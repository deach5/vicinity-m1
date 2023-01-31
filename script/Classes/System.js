
function System() {
	this.screenDimensions; 			// ASSOCIATIVE ARRAY: An array containing the width and height
	this.flashRequired; 			// NUMBER: The minmum required flash version
	this.popupsRequired; 			// BOOLEAN: Determines if popups are required for the course
	this.browser = BrowserDetect.browser; 		// STRING: Stores the users browser name
	this.runtime; 					// STRING: "scorm" - SCORM 1.2 API,"local" Tracks with cookies,"dummy" No tracking required
	this.elapsedTime;
}
// Method Type: PUBLIC //
System.prototype.initSystemProperties = function(_popups,_runtime) {
	// Popups
	this.popupsRequired = _popups;
	this.runtime = _runtime;
  
  getCourseFrame(); 
}

System.prototype.getCookiesEnabled = function() {
	var c = document.cookie ?  true :  false;
  return c;
}

// This is the main method and will run once, it will
// set all of the required properties and return a boolean.
// This determines if the end users system meets the minimum requirements
System.prototype.checkSystem = function() {
	var _reqDim,_sysDim,_msg,_mobileDevice;
  var systemOK = true;
	_msg = '<h1>WARNING</h1>';
  _msg += '<p>Your system does not meet the minimum requirements for this module to play correctly. Please review the following:</p>'
	_msg += '<hr>';
	
		
	_msg += '<h2>You\'re using ' + BrowserDetect.browser + ' browser, version: ' + BrowserDetect.version + ' on ' + BrowserDetect.OS + ' Operating System</h2>';
		
		// Check for cookies ------------------------------------------ //
		systemOK = true;
		
		if(this.runtime == "local") systemOK = this.getCookiesEnabled();
		if(!systemOK) {
			_msg += '<li>Your system does not support cookies and requires them for tracking the module.</li></ol>';
			this.throwError(_msg); 
      return false;
		}
    return true
}
//
// Error function - turn on and off
var errorPageMsg = '';
System.prototype.throwError = function(e) {
		$debug('throwError: '+e)
    showError(e)
		//errorPageMsg = e
		//eWindow = window.open('../error.htm','Error',"scrollbars=yes,height=620,width=716");
}


var gSystem;
function initSystem() {
    $debug('DEBUG:: initSystem')
    if (gAPI != null && gAPI.getAPI() != null) {
        return;
    }
	gSystem = new System();
	getMinSpecs();
    do_connect_LMS();
}

// ---------------------

var gAPI,gCourseWindow,gWindowCleaner;
var gCloseCounter = 0;
function do_connect_LMS() {
    $debug('DEBUG:: do_connect_LMS')

	gAPI = new Comms();
	gAPI.connectAPI(gSystem.runtime);
	if(!gAPI.getAPIFail()) {
        $debug('DEBUG:: do_LMSInit')
		LMSInit();
	}
}

function launchStandalone(){
    if(typeof mode != 'undefined'){ 
        mode = 'dummy';
        initSystem();
    }
}

//
function closeCourse() {
	gAPI.closeAPI();
	//delay closing window.
	gWindowCleaner = setInterval("closeOpener()",1000);	
}
function closeOpener() {
	clearInterval(gWindowCleaner);
	// //alert('closeOpener');
	try{window.close();}catch(e){}
	try{parent.close();}catch(e){}
	try{top.close();}catch(e){}
	
}

function getCourseFrame(){
    iframe = document.getElementsByTagName('iframe')[0]
    cc = iframe.contentWindow;
    FRAMEDOM = document.getElementById('course_container').contentWindow;

}

Array.prototype.shuffle=function(){for(var e,t,n=this.length;n;e=parseInt(Math.random()*n),t=this[--n],this[n]=this[e],this[e]=t);return this};String.prototype.toFileName=function(){var e="$@<>[]{}():;=^|*!/%?,'\"&";var t=this.split("");var n="";for(var r=0;r<t.length;r++){if(t[r]==" "){if(n.substr(n.length-1)!="_")n+="_"}else{if(e.indexOf(t[r])==-1){n+=t[r]}}}return n.toLowerCase()};String.prototype.toMilliseconds=function(){var e,t,n,r,i,s;e=this.split(":");t=e[2].split(".");n=e[0]*36e3;r=e[1]*600;i=t[0]*10;s=t[1];return n+r+i+s};String.prototype.trimWhiteSpace=function(){var e=false;var t=this;var n=this.length;while(!e){if(t.charAt(n-1)==" "){n--}else{e=true}}t=t.substring(0,n);e=false;n=0;while(!e&&n<t.length){if(t.charAt(n)==" "){n++}else{e=true}}t=t.substr(n);return t};Number.prototype.toTimeStamp=function(){var e="";var t=new Date;t.setTime(this);var n="000"+Math.floor(this/36e5);var r="0"+t.getMinutes();var i="0"+t.getSeconds();var s="0"+Math.round(t.getMilliseconds()/10);e+=n.substr(n.length-4)+":"+r.substr(r.length-2)+":";e+=i.substr(i.length-2)+"."+s.substr(s.length-2);return e}