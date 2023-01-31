// JavaScript Document
var gRuntime;

function Comms() {
	this.api; 								// OBJECT: Reference the communication API, for either Local or SCORM communication
	this.error; 							// BOOLEAN: Track errors with SCORM communication
	this.maxTries = 10;						// NUMBER: Maximum attempts to connect to SCORM API
	this.apiFail = false;					// BOOLEAN: Determines if there is an API available for tracking;
	this.launchTime = new Date().getTime(); // DATE: Inidicates the launch time of the course
	this.errorWindow;
	this.elapsedTime;
	
}
// PRIVATE
Comms.prototype.connectAPI = function(_runtime) {
	var api = null;
	gRuntime = _runtime;
	if(_runtime == "scorm") {
		var tries = 0, triesMax = 500;
		while (tries < triesMax && api == null) {
			window.status = 'Looking for API object ' + tries + '/' + triesMax;
			api = this.findAPI(window);
			if (api == null && typeof(window.parent) != 'undefined') api = this.findAPI(window.parent)
			if (api == null && typeof(window.top) != 'undefined') api = this.findAPI(window.top);
			if (api == null && typeof(window.opener) != 'undefined') if (window.opener != null && !window.opener.closed) api = this.findAPI(window.opener);
			tries++;
		}
		if (api == null) {
			this.setAPIFail(true);
			this.throwError('<h1>Connectivity Error</h1><hr /><p>An LMS API has not been found. The course will not be able to communicate with the LMS.</p><p>Please exit the course, confirm you LMS settings are correct then try launching it again.</p><p>Note: be sure that the API is located in the course launch window, or that the LMS has not launched an extra window.</p><p><a href="javascript:parent.launchStandalone()">Select here to run this course as a stand-alone version</a>');
			return;
		}else{
			this.setAPI(api);
		}
	}else{
		if(_runtime == "local"){
			// Assign APILocal instance to API
			// This API will take the place of the SCORM API meaning the same data types will exist
			this.setAPI(new APILocal());
		}else if(_runtime == "dummy") {
			// Need a new handler in here to allow for a system to run without tracking (cookies/scorm api)
			this.setAPI(new APIDummy());
		}else{
			this.throwError("<p>Unknown runtime argument <b>'"+_runtime+"'</b> passed to <b>connectAPI</b> in <b>Comms class</b>. Expected scorm, local or dummy.</p>")
			return;
		}
	}
    
	if(!this.getAPIFail()) this.initComms();
	
}
// PRIVATE
Comms.prototype.findAPI = function(win) {
	// look in this window
	if (typeof(win) != 'undefined' ? typeof(win.API) != 'undefined' : false) {
		if (win.API != null ) return win.API;
	}
	// look in this window's frameset kin (except opener)
	if (win.frames.length > 0) {
		for (var i = 0 ; i < win.frames.length ; i++) {
			if (typeof(win.frames[i]) != 'undefined' ? typeof(win.frames[i].API) != 'undefined' : false) {
                $debug('DEBUG:: API FOUND ---- WINDOW FRAME NO:'+i) 

				if (win.frames[i].API != null) return win.frames[i].API;
			}
		}
	}
	return null;
}
//
Comms.prototype.closeAPI = function() {
	
	var api = this.getAPI();
	api.LMSFinish("");
}
// PRIVATE
Comms.prototype.initComms = function() {
	$debug('DEBUG:: initComms ') 
	var api = this.getAPI()
	api.LMSInitialize("");
	api.LMSGetLastError();
    $debug('DEBUG:: LMSInistialised ') 

}
// PRIVATE
Comms.prototype.getError = function() {
	return this.error;
}
// PRIVATE
Comms.prototype.setError = function(_error) {
	this.error = _error;
}
// PRIVATE
Comms.prototype.commsError = function(_error,_data1,_data2) {
	this.setError(_error);
	var msg,api;
	_msg = '<p>ERROR: The module has failed to make a connection to the Learning Management System. This may be due to a network dropout.</p><br>'
	api = this.getAPI();
	msg =  api.LMSGetErrorString(_error);
	msg += ' <b>('+_data1;
	if(_data2 != '') msg+= ', '+_data2;
	msg += ')</b>';
	msg += ': ';
	msg +=  api.LMSGetDiagnostic(_error);
	msg += '<br><p>Your progress will not be tracked. Please exit the module and re-launch it again. </p><p><b>If the problem persists, please contact you system administrator.</b></p><p>Please note down the error message above as it will be of use to determine the fault.</p>'
	this.throwError(msg)
}
// PRIVATE
Comms.prototype.getMaxTries = function() {
	return this.maxTries;
}
// PUBLIC: Set LMS Data
Comms.prototype.setData = function(cmi,data) {

	var api = this.getAPI()
	var error;
	var vTry = 0, vMaxTry = this.getMaxTries();
	while (vTry < vMaxTry && error != '0')  {
		api.LMSSetValue(cmi,data);
		error = api.LMSGetLastError();
		vTry++;
	}
	api.LMSCommit("");
	$debug('CMI SetValue >>'+cmi+' -- setting value to: '+ data) 
	if(Number(error) != 0)  this.commsError(error,cmi,data);
}
// PUBLIC: Get LMS Data
Comms.prototype.getData = function(cmi) {

	var api = this.getAPI()
	var data,error;
	var vTry = 0, vMaxTry = this.getMaxTries();
	while (vTry < vMaxTry && error != '0')  {
		data = api.LMSGetValue(cmi);
		error = api.LMSGetLastError();
		vTry++;
	}
	$debug('CMI GetValue >>'+ data) 
	if(Number(error) != 0) this.commsError(error,cmi,'');
	return data;
}
// PRIVATE
Comms.prototype.setAPI = function(api) {
	this.api = api;
}
// PUBLIC
Comms.prototype.getAPI = function() {
	return this.api;
}
// PRIVATE
Comms.prototype.setAPIFail = function(bool) {
	this.apiFail = bool;
}
// PUBLIC
Comms.prototype.getAPIFail = function() {
	return this.apiFail;
}
// Get the launchTime
Comms.prototype.getLaunchTime = function() {
	return this.launchTime;
}
// Get the elapsed time
Comms.prototype.getElapsedTime = function() {
	var _curr = new Date().getTime();
	var _elapse = _curr - this.getLaunchTime();
	var hms ='';
	var dtm = new Date();
	dtm.setTime(_elapse);
	var h = '000' + Math.floor(_elapse/3600000);
	var m = '0' + dtm.getMinutes();
	var s = '0' + dtm.getSeconds();
	var cs = '0' + Math.round(dtm.getMilliseconds() /10);
	hms += h.substr(h.length-4) + ':' + m.substr(m.length-2)+':';
	hms += s.substr(s.length-2) + '.' + cs.substr(cs.length-2);
	return hms;
}

var errorPageMsg = '';
Comms.prototype.throwError = function(e) {
    showError(e)
    //course_container.contentDocument.getElementById('loading').style.display = 'none';
    //course_container.contentDocument.getElementById('systemDiag').innerHTML = e;
}