// APIDummy Class
// There is only one instance of the APIDummy class (This is instantiated if RUNTIME is equaly to "")
// This class has to define properties for Comms data.
// This enables the course to be more flexible and not
// care if the course is tracked localy via SCORM or not tracked at all
function APIDummy() {
	this.core_children = "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,exit,session_time";
	this.student_id = "defaultID";
	this.student_name = "";
	this.lesson_location = "";
	this.credit = "credit";
	this.lesson_status = "not attempted";
	this.entry = "ab-initio";
	this.score_children = "raw";
	this.score = "";
	this.exit = "";
	this.session_time = "";
	this.total_time = "0000:00:00.00";
	this.suspend_data = "";
	this.launch_data = "";	
	this.comments = "";	
}
// cookie = course title to make it unique to this course + cmi + data 
APIDummy.prototype.LMSSetValue = function(cmi,data) {
    // console.log('LMSSetValue: '+cmi+' : '+data);
	switch(cmi) {
		case "cmi.core.student_name":
			this.student_name = data
			break;
		case "cmi.core.lesson_location":
			this.lesson_location = data;
			break;
		case "cmi.core.credit":
			this.credit = data; 
			break;
		case "cmi.core.lesson_status":
			this.lesson_status = data;
			break;
		case "cmi.core.entry":
			this.entry = data;
			break;
		case "cmi.core.score.raw":
			this.score = data;
			break;
		case "cmi.core.exit":
			this.exit = data;
			break;
		case "cmi.core.session_time":
			this.session_time = data;
			break;
		case "cmi.core.total_time":
			this.total_time = data;
			break;
		case "cmi.suspend_data":
			this.suspend_data = data
			break;
		case "cmi.launch_data":
			this.launch_data = data;
			break;
        case "cmi.comments":
			this.comments += data;
			break;
	}
}
//
APIDummy.prototype.LMSGetValue = function(cmi) {
	var data;
	switch(cmi) {
		case "cmi.core._children":
			data = this.core_children
			break;
		case "cmi.core.student_id":
			data = this.student_id
			break;
		case "cmi.core.student_name":
			data = this.student_name;
			if(data == "") {
				data = 'User, Guest'; 
				this.LMSSetValue(cmi,data);
			}
			break;
		case "cmi.core.lesson_location":
			data = this.lesson_location;
			break;
		case "cmi.core.credit":
			data = this.credit
			break;
		case "cmi.core.lesson_status":
			data = this.lesson_status;
			break;
		case "cmi.core.entry":
			data = this.entry;
			break;
		case "cmi.core.score._children":
			data = this.score_children;
			break;
		case "cmi.core.score.raw":
			data = this.score;
			break;
		case "cmi.core.exit":
			data = this.exit
			break;
		case "cmi.core.session_time":
			data = this.session_time
			break;
		case "cmi.core.total_time":
			data = this.total_time;
			break;
		case "cmi.suspend_data":
			data = this.suspend_data;
			break;
		case "cmi.launch_data":
			data = this.launch_data;
			break;
        case "cmi.comments":
			data = this.comments;
			break;
	}
    // console.log('LMSGetValue: '+cmi+' : '+data);
	return data;
}
//
APIDummy.prototype.LMSInitialize = function(str) {return true;}
APIDummy.prototype.LMSCommit = function(str) {return true;}
APIDummy.prototype.LMSFinish = function(str) {return true;}
APIDummy.prototype.LMSGetLastError = function() {return 0}
APIDummy.prototype.LMSGetErrorString = function(error) {return;}
APIDummy.prototype.LMSGetDiagnostic = function(error) {return;}
// This implementation can be changed to suit the course
// It currently just uses a a JavaScript implementation
// It could use a nice div
APIDummy.prototype.promptStudentName = function() {
	var _data;
	_data = prompt("Please enter your first name and last name in the input box below","Firstname + Lastname");
	_data = _data.split(' ');
	_data = _data[1]+', '+_data[0];
	return _data;
}


