// JavaScript Document
var DISABLENEXT = false;



function setProgess(n, b) {
    var tp, cp;
    cp = gCurrentPage;
    tp = gTotalPages;

    cc.document.getElementById('pagenumbers').innerHTML = gTopicObject.title  + ' | ' + cp + ' of ' +tp;
}

function setHref() {
        getCourseFrame();
        var handle = cc.document.getElementById('next');
        if (handle == null) {
            return;
        }

        if (verbose_debug) $debug(" .setHref ...... lockNext function ...  pagestatus " + gTopicObject.pageStatus[gCurrentPage - 1] + " ....  gIsAssessPage " + gIsAssessPage + " .... gDev " + gDev)

        var nb = cc.document.getElementById('next');
        var bb = cc.document.getElementById('back');
        bb.style.visibility = 'hidden';
        nb.style.visibility = 'hidden';


        nb.href = nb.tempHref = getPageStepperNext();
        bb.href = bb.tempHref = getPageStepperBack();
        nb.style.visibility = 'visible';
        bb.style.visibility = 'visible';


        if (gTopicObject.pageStatus[gCurrentPage - 1] == 0) {
			$debug('DEBUG:: setNavigation call PAGE NOT COMPLETE'+ DISABLENEXT)
            setNavigation({'next':false,'back':true})
        } else {
			$debug('DEBUG:: setNavigation call '+ DISABLENEXT)
            setNavigation({'next':DISABLENEXT === true ? false : true,'back':true}) // what if disabled  setNavigation(_next,_back)
        }
        setProgess()
    }
    // Page stepper next
function getPageStepperNext() {
    var stepper;
				if(isNaN(gCurrentPage)) return 'javascript:void(0);';
    var nextPage = gCurrentPage + 1;
    if (gCurrentPage == gTotalPages) {
        stepper = '../sundries/menu.html';
		$debug('DEBUG:: PAGE STEPPER NEXT')
        //nextTopic = gTopicDetails[int(gCurrentTopic)+1]
        if (!gIsAssessPage) {
            // $debug('not assess')
            if (gCurrentTopic + 1 < gTopicDetails.length) {
                // $debug('topic less that total - next topic ' + JSON.stringify(gNextTopic))
                if (gNextTopic.status == 'na') {
                    gNextTopic.setStatus('i');
                }
            }
            //set Current Topic complete  
            // $debug('set complete 1')
            if (!hasInteraction) gTopicDetails[gCurrentTopic].setStatus('c');

            //set last topic to 'i'
            //will be overridden if prereqs aren't met
            //but needs to be tested and end of each topic
            //gTopicDetails[assessmenttopic].setStatus('i'); 

            setLessonStatus();
            //LMStopicFinish();
        }
    } else {
        if (gIsAssessPage && gCurrentPage == gTotalPages - 1) {
            stepper = '../sundries/menu.html'; //were done
        } else {
            stepper = 'page' + nextPage + '.html'; //normal page
        }
    }
    $debug("DEBUG:: stepper " + stepper)
    return stepper;
}


// Build the page stepper (back button)
function getPageStepperBack() {
    var stepper = '';
    var backPage = gCurrentPage - 1;

    if (gCurrentPage == 1) {
        stepper += '../sundries/menu.html'
    } else {
        stepper += 'page' + backPage + '.html'
    }

    return stepper;
}


//
function setNavigation(config) {
    lockNext(config.next != true);
    lockBack(config.back != true);

}

lockNext = function (bool) {
    var nb = cc.document.getElementById('next');
    var callout = cc.document.getElementById('must-finish');
    if (verbose_debug) $debug(" ......... lockNext function " + bool + " ...  pagestatus " + gTopicObject.pageStatus[gCurrentPage - 1] + " ....  gIsAssessPage " + gIsAssessPage + " .... gDev " + gDev)
    if (bool && !gDev) {        
        if (gTopicObject.pageStatus[gCurrentPage - 1] == 0 || gIsAssessPage || parent.DISABLENEXT === true) {
            $debug("setting next to disabled")
            //nb.className = 'disabled'
            $(nb).removeClass('active').addClass('disabled');
            nb.removeAttribute('href');
            nb.title = 'Next (disabled)';
            nb.setAttribute('aria-disabled', true);
            
            $(nb).hover(
                function() {
                    $debug('hover in')
                    $(callout).show()
                }, 
                function() {
                    $(callout).fadeOut('fast')
                    $debug('hover out')
                }
            );;
   
            return
        }
    } else {
        if (verbose_debug) $debug('setting next button to active. Link to ' + nb.tempHref)
        //nb.className = 'active'
        $(nb).removeClass('disabled').addClass('active');
        nb.href = nb.tempHref
        nb.title = 'Next';
        nb.setAttribute('aria-disabled', false);
        $(nb).unbind('mouseenter mouseleave');
        $(callout).fadeOut('fast')
        $(nb).click(function(e) {
            try{stopAllMediaElements();}catch(e){$debug('attempt pause of audio on navigation failed' + e.message)}
            gAPI.setData("cmi.core.lesson_location", setBookMark());
        })
    }
}
lockBack = function (bool) {
    //var bb = $('#back', cc).get(0);
    var bb = cc.document.getElementById('back');
    if (verbose_debug) $debug(" ......... lockBack function " + bool + " ...  pagestatus " + gTopicObject.pageStatus[gCurrentPage - 1] + " ....  gIsAssessPage " + gIsAssessPage + " .... gDev " + gDev)
    if (bool) {
        //bb.className = 'disabled';
        $(bb).removeClass('active').addClass('disabled');
        bb.removeAttribute('href');
        bb.title = 'Back (disabled)';
        bb.setAttribute('aria-disabled', true);
    } else {
        if (verbose_debug) $debug('setting back button to active. Link to ' + bb.tempHref)

        //bb.className = 'active'
        $(bb).removeClass('disabled').addClass('active');
        bb.href = bb.tempHref
        bb.title = 'Back';
        bb.setAttribute('aria-disabled', false);
        $(bb).click(function(e) {
            try{stopAllMediaElements();}catch(e){$debug('attempt pause of audio on navigation failed' + e.message)}
        })
    }
}


/*
// find and timerrs or animations on screen and stop them
//IE causes an error 'permission denied'
//when navigating the child i frame mid way through a animation
function clearElements(){
   $('*',cc.document).finish();
    var interval_id = window.setInterval("", 9999); // Get a reference to the last
    return true;
    
    
    //interval list builds up tremendously
    //does not appears need when using the above .finish();
   // $debug('GARBAGE COLLECTION ------------------------------------------------')   
    for (var i = 1; i < interval_id; i++){
        window.clearInterval(i);
        $debug('clearing interval ---------- ' + i)   

    }
   // $debug('END GARBAGE COLLECTION --------------------------------------------')   
    return true;
}
*/

function setPageComplete() {
    DISABLENEXT = false; // reset global;
    parent.DISABLENEXT = false; // reset global;
     $debug('SET PAGE COMPLETE')
    gTopicObject.pageStatus[gCurrentPage - 1] = 1;
    if (typeof $('#next', cc.document).get(0) != 'undefined' && !gIsAssessPage) setNavigation({'next':true,'back':true});
   
   
    //if(gCurrentPage == gTotalPages && gTopicObject.id != gTopicDetails[assessmenttopic].id) {
    if (gCurrentPage == gTotalPages) {
        gTopicObject.setStatus('c');
        // gTopicDetails[assessmenttopic].setStatus('i'); 
    }
    //   $debug($('#next', cc).get(0))
}