var CourseName = 'The Trust Equation';
var gDebug = false; //switches console logging on 
var verbose_debug = false; //used to debug interactions
var gDev = false; //unlocks next buttons
// Specify the course name
var mode = 'dummy'; // scorm, dummy,

supportedBrowsers = new Array('Internet Explorer 9', 'Firefox 25', 'Chrome 30', 'Safari 5')

function getMinSpecs() {
  var _popups = false;
  gSystem.initSystemProperties(_popups, mode);
}
var gTopicDetails = new Array();
gTopicDetails.push(new Topic('The Trust Equation ', 1, 'i', '', '', ''));

var gFrameSet = 'index.html'

var volume = 0.8;
var muted = false;
var lockedOut = false;
var gIsAssessed = false;
var playedonce = false;
var menu_audio_played = false;
//completion audio on menu
//not tracked in suspend data and only used once per session
var menu_completion_audio_played = false;
// Possible completion paths
var gCompletionPaths = new Array();
var returnFromBookmark = false;