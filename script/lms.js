var gRootFolder = getRootFolder();
var gAbsoluteURL = getAbsoluteURL();

function LMSInit() {
    getCourseFrame();

    if (gAPI.getData("cmi.core.lesson_status") == 'not attempted') {
        gAPI.setData("cmi.core.lesson_status", "incomplete")
        // gAPI.setData("cmi.core.lesson_location", "");
        // gAPI.setData("cmi.suspend_data", "");
        // gAPI.setData("cmi.core.score.raw","");
    }
    getSuspendData();
    gStudentName = getStudentName();

		// cc.location.replace(gAbsoluteURL + 'topics/sundries/menu.html');
    //cc.location.replace(gAbsoluteURL + 'topics/topic0/page13.html');
    // return;
    //
    playedonce ? getRedirection() : gotoIntro();
}

function gotoIntro() {

    cc.location.replace(gAbsoluteURL + 'topics/sundries/intro.html');
    //cc.location.replace(gAbsoluteURL+'topics/'+assessmenttopic+'/page1.html');
    playedonce = true;
}
function choseDirection(menu) {
   cc.location.replace(gAbsoluteURL + (menu ? 'topics/sundries/intro.html' : 'topics/topic0/page01.html'));
}
function getRedirection(filePath) {
				var str = String(cc.location);
				if(str.indexOf('noredirect') != -1){
					cc.location.replace(gAbsoluteURL + 'topics/sundries/intro.html');
					return;
				}
    gBookmark = gAPI.getData("cmi.core.lesson_location")
    $debug("DEBUG:: getRedirection(" + gBookmark + ")");

    if (gBookmark != '' && gBookmark !== true && gBookmark != 'topics/sundries/intro.html' && gBookmark != 'topics/sundries/intro.html') {
        // Confirm with user where to go
        cc.document.getElementById('loading').style.display = 'none';
        cc.document.getElementById('redirectionConfirmation').style.display = 'block';
        // cc.location.replace(gAbsoluteURL + gBookmark)
    } else {
        cc.location.replace(gAbsoluteURL + 'topics/sundries/intro.html')
        //cc.location.replace(gAbsoluteURL+'topics/topic0/page1.html')
    }
    getCourseFrame();
}

function getPageName() {
    var _tmp = gPageURL.substring(gPageURL.lastIndexOf('/' + gRootFolder) + (gRootFolder.length));
    _tmp = _tmp.substring(1, _tmp.length);
    return _tmp;
}

function setBookMark() {
    var _bm;
    if (typeof gPageURL != 'undefined' && !gIsAssessPage) {
        _bm = getPageName()
    } else {
        _bm = 'topics/sundries/intro.html'
    }
    return _bm;
}

function setSuspendData() {
    //	var _assessscores = '';
    var _data = '';
    var _ps = '';
    for (var i = 0; i < gTopicDetails.length; i++) {
        _ps += gTopicDetails[i].pageStatus;
        _data += gTopicDetails[i].status;
        if (i < gTopicDetails.length - 1) {
            _ps += '^';
            _data += ',';
        }
    }
    _data += '*' + _ps; //.toString();
    _data += '*' + playedonce;
    _data += '*' + menu_audio_played;
    // $debug(_data)
    return _data;

}

function getSuspendData() {
    var _sd = gAPI.getData("cmi.suspend_data");
    //var _sd ='i,i,na,na,na,na,na*0,0,0,0^0,0,0,0,0^0,0,0,0^0,0,0,0,0,0^0,0,0,0,0^0,0,0^0*0*false*false'
    if (_sd.length > 0) {
        var _topics = _sd.split('*')[0].split(',');
        var _ps = _sd.split('*')[1].split('^');
        var _count = 0;
        for (var i = 0; i < _topics.length; i++) {

            var _topic = gTopicDetails[i];
            _topic.setPageStatus(_ps[i]);
            _topic.setStatus(_topics[i]);

            if (_topic.xml != '') {
                _topic.setScore(_count);
                _count++;
            }
        }
        playedonce = (_sd.split('*')[2] === 'true'); //Boolean(_sd.split('*')[3]);
        menu_audio_played = (_sd.split('*')[3] === 'true'); //Boolean(_sd.split('*')[3]);
    }
}

function setScore(_newscore) {
    if (_newscore > gTopicObject.score) gTopicObject.setScore(_newscore);
    setLessonStatus();
}

function setLMSScore() {
    var _totalscores = 0;
    var _totalassess = 0;
    for (var i = 0; i < gTopicDetails.length; i++) {
        var topic = gTopicDetails[i];
        if (topic.xml != '') {
            _totalassess++;
            _totalscores = _totalscores + topic.score;
        }
    }
    var _average = Math.round(_totalscores / _totalassess);
    gAPI.setData("cmi.core.score.raw", _average);
}

function getScore() {
    var _rawscore = gAPI.getData("cmi.core.score.raw");
    if (_rawscore == '') _rawscore = 0;
    return Number(_rawscore);
}

function setLessonStatus() {
    var lessonStatus = gAPI.getData("cmi.core.lesson_status");

    if (lessonStatus != 'passed' && lessonStatus != 'completed') {

        gIsAssessed ? lessonStatus = 'passed' : lessonStatus = 'completed';

        if (gCompletionPaths.length > 0) {
            for (var i = 0; i < gCompletionPaths.length; i++) {

                var _pathArray = gCompletionPaths[i];

                for (var j = 0; j < _pathArray.length; j++) {

                    var path = _pathArray[j];

                    if (gTopicDetails[path - 1].status != 'c') {
                        lessonStatus = 'incomplete';
                        break;
                    }
                }
                if (lessonStatus != 'incomplete') {
                    if (gReview) $debug('completed by paths');
                    break;
                }
            }
        } else {
            for (var i = 0; i < gTopicDetails.length; i++) {
                if (gTopicDetails[i].status != 'c' || (gIsAssessed && gCurrentScore < gMasteryScore)) {
                    lessonStatus = 'incomplete';
                    break;
                }
            }
            // $debug('non path completion ls to ' + lessonStatus)
        }
        // $debug('setting ls to ' + lessonStatus)
        gAPI.setData("cmi.core.lesson_status", lessonStatus);
        if (lessonStatus == 'passed') {
            setLMSScore();
        }
    }
}

function getStudentName() {
    var stud = gAPI.getData("cmi.core.student_name")
    var stud_array = String(stud).split(',')
    return String(stud_array[1]).trimWhiteSpace() + ' ' + String(stud_array[0]).trimWhiteSpace()
}

function LMSFinish() {
    if (gAPI != null && gAPI.getAPI() != null) {
        $debug('LMSFinish')
        gAPI.setData("cmi.core.lesson_location", setBookMark());
        gAPI.setData("cmi.core.session_time", gAPI.getElapsedTime());
        gAPI.setData("cmi.suspend_data", setSuspendData());
        window.closeCourse();
    }
}