
var gPageURL,gIsAssessPage,gTopicName,gCurrentPage,gTotalPages,gNextTopic,gTopicObject,gCurrentTopic, cc;

var gClickedExit = false;
var hasInteraction = false;
function initPageVars() {
  getCourseFrame();
  
  if(ddipad){
	 // alert(window.parent)
	  $(window.parent).on('scroll', function(){		  
		ipadScroll()  
	}); 

  }


  gPageURL = cc.location.href; //ok;

 /* if(getPageName() != 'topics/sundries/menu.html' && getPageName() != 'menu.html' && getPageName() != 'topics/sundries/intro.html' && getPageName() != 'intro.html'
  ){*/
    gCurrentTopic = getCurrentTopic();
    gTopicObject = gTopicDetails[gCurrentTopic];
    gTopicName = getTopicName();
    gCurrentPage = getCurrentPage();
    gTotalPages = getTotalPages();
    if(gCurrentTopic < gTopicDetails.length){gNextTopic = gTopicDetails[gCurrentTopic+1];}
    if(gTopicObject.xml !=+ ''){gIsAssessPage = true;}
    setHref();
  /*}*/
  $('.no-js', cc).removeClass('no-js');
}

// Replace span tags with string of username with the username <span>username</span>
function setUserName() {
    var _names = cc.getElementsByTagName('span');
    if(_names.length > 0) {
        for(var i=0;i<_names.length;i++) {
            if(_names[i].innerHTML == "username") _names[i].innerHTML = gStudentName;
        }
    }
}
function getTopicName() { return gTopicObject.title;}

function getCurrentTopic() {
				return 0;
    /*var searchString = 'topic';
    var startPos = gPageURL.lastIndexOf(searchString) + searchString.length;
    var endPos = gPageURL.lastIndexOf('/'); //i'll try this but it could cau;se problems
    return Number(gPageURL.substring(startPos,endPos));*/
}

// Get page number - Parse the page number from the URL





var ipadScroll = function(){
		var disY = this.parent.pageYOffset || this.parent.documentElement.scrollTop 
		
		try{
			//alert('pad11: '+ this.parent.pageYOffset)
			
			FRAMEDOM.scrolling(disY)  
			
		}catch(e){}
     

}
	
	
	
function getCurrentPage() {
    var searchString = 'page';
    var startPos = gPageURL.lastIndexOf(searchString) + searchString.length;
    var endPos = gPageURL.lastIndexOf('.html');
    return Number(gPageURL.substring(startPos,endPos));
}
// Get the total pages in this topic
function getTotalPages() {
    var _tot;
    if(!gIsAssessPage) {
        _tot = gTopicObject.screens;
    }else{
        if(typeof(gQuiz) != 'undefined') {
            _tot = gQuiz.length+3;
        }
    }
    // If it is an assessment page and array doesnt exist total pages is set in XML Parser
    return _tot;
}

function unlockAllTopics(){
  
  //loop through all topics except the last (Assessment) and mark 'i'
  for(var i=0;i<(gTopicDetails.length);i++) {
    var t = gTopicDetails[i]
    //loop 
      if(t.status != 'c'){
        t.setStatus('i')      
      }
  }
}


//var TimeOut = setInterval("checkTimeOut()",60000)
// Save and Exit
// 1: Check to see if function has already run
// 2: Write data to the LMS, and then
// 3: close the window.
function exitCourse(browserUnload) {
    if(!browserUnload) {
        if(confirm('Are you sure you wish to save and exit this module?\n\nThis may take a few moments.')) if(gClickedExit === false) {LMSFinish();gClickedExit = true;}
    }else{
        if(gClickedExit === false) {LMSFinish();gClickedExit = true;}
    }
}

// This function is executed once and finds the root folder of the course
// The root folder of the course is needed to parse the bookmark
    function getRootFolder() {
    var folder = '';
    var urlArr = window.location.href.split('/');
    for(var i = 0;i < urlArr.length; i++) {
        if(urlArr[i].indexOf(gFrameSet) != -1) {
            folder = urlArr[i-1]+"/";
        }
    }
    return folder;
}
// This function is executed once and finds the root folder of the course
// The root folder of the course is needed to parse the bookmark
function getAbsoluteURL() {
    var _url = String(window.location.href);
    _url = _url.split(gFrameSet)[0];
    return _url;
}




function fakeClick(event, anchorObj) {
  if (anchorObj.click) {
    anchorObj.click();
  } else if(document.createEvent) {
    if(event.target !== anchorObj) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window,
          0, 0, 0, 0, 0, false, false, false, false, 0, null);
      var allowDefault = anchorObj.dispatchEvent(evt);
      // you can check allowDefault for false to see if
      // any handler called evt.preventDefault().
      // Firefox will *not* redirect to anchorObj.href
      // for you. However every other browser will.
    }
  }
}


// add event cross browser
function addEvent(elem, event, fn) {
    // avoid memory overhead of new anonymous functions for every event handler that's installed
    // by using local functions
    function listenHandler(e) {
        var ret = fn.apply(this, arguments);
        if (ret === false) {
            e.stopPropagation();
            e.preventDefault();
        }
        return(ret);
    }

    function attachHandler() {
        // set the this pointer same as addEventListener when fn is called
        // and make sure the event is passed to the fn also so that works the same too
        var ret = fn.call(elem, window.event);
        if (ret === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return(ret);
    }
    if (elem.addEventListener) {
        elem.addEventListener(event, listenHandler, false);
    } else {
        elem.attachEvent("on" + event, attachHandler);
    }
}

function $debug(s){
    if(!gDebug)return;
    if(typeof console!="undefined"&&typeof console.log!="undefined"){
        try{
            console.log(s);
        }catch(e){
            //alert(s)
        }
    }
}
