// JavaScript Document
var cc, FRAMEDOM;

var forceHide = false;

var IS_IPAD = navigator.userAgent.match(/iPad/i) != null;
var IS_IPHONE = (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
if (IS_IPAD) {
    IS_IPHONE = false;
}

IS_IPAD = IS_IPAD || IS_IPHONE;
//IS_IPAD = true;

function hideControls(){
    forceHide = true;    
    $debug('hide audio controls');
    $('.mejs-container').addClass('hidden');
    //$('.mejs-container, #custom-player').hide();
}
function showControls(){
    forceHide = false;
    $debug('show audio controls');
    $('.mejs-container').removeClass('hidden');
    //$('.mejs-container, #custom-player').css.show();
}

function swapAudio(file, arr, noPlay, callback) {

    forceHide = false;
    if ($('.mejs-container').hasClass('hidden')) {
        showControls();
    }

    getCourseFrame();
    $debug("DEBUG:: swapAudio(" + file + ")");
    //
    clearElements()
    if (file !== 'blank') { // don't show the preloader if it is just the blank audio
        var preloader = $('#audio_preloader',cc.document);
        $debug('DEBUG:: preloader target = ' + preloader.selector);
                        $('#mep_0').fadeOut();

        preloader.css({display:'block'}); // changed to show to hide page elements quicker
    }
    //$debug('no localfuntion to call');

    try{ player.pause();}catch(e){$debug('player pause error == ' + e.message)};
    player.setSrc([{
        src: 'assets/audio/' + file + '.mp3',
        type: 'audio/mpeg'
    }]);
     try{ player.media.load();}catch(e){$debug('player.media.load() error == ' + e.message)};
    try { player.load(); } catch (e) { $debug('player.load() error == ' + e.message) };
    if (!noPlay) {
        if (callback && IS_IPAD) {
            callback();
        }
        else {
            player.play();
        }
    }
}

var tu = false; //used for time update of audio to console

var volume = 0.8;
var muted = false;

function AudioLoaded(){}

function $debug(a){
	//trace(a)
	}

initAudio = function(src, final, paused){

  
   var timeholder = 0;
  
   player = new MediaElementPlayer( $('#custom-player') ,{
  
    startVolume: volume,
    'audioWidth': 126,
	'audioHeight': 35,
    features: ['playpause'],
	
	error:function(e){trace(e)},
    
    success: function (mediaElement, domObject){
   //   dbg('INITAUDIO -- success '+src)
      mediaElement.pause();
      mediaElement.setSrc([{'src':'../../assets/audio/'+src+'.mp3','type': 'audio/mpeg'},{'src':'../../assets/audio/'+src+'.ogg','type':'audio/ogg'}]);
      mediaElement.load();
	  
      if(typeof paused ==  "undefined" || paused == false){
     //   mediaElement.play();
        //dbg('INITAUDIO -- PLAY')
		AudioLoaded()
      }

      mediaElement.addEventListener('timeupdate', function(e) {
        if(parent.verbose_debug){ 
         if (tu == true) {
         	$('#current-time').html(ediaElement.currentTime.toFixed(2))
		 }
        }
       if(typeof event_array != "undefined") {
          var obj = [];
          var k = 0;
          
          for(var i=0;i<event_array.length;i++){
            
            var time = mediaElement.currentTime;
            var t = Math.round(time * 10) / 10;
            var c = event_array[i];
            var tc = c.timecode;
			c.idx = i
           
            if(!c.fired){
              
              if(t >= tc) {
                var ef
                if(typeof c.efunction != "undefined"){
                  try
				  {c.efunction()}
				  catch(e)
					{ }
                }else{
                  ef = false;
                }
              
                if(typeof c.pause != 'undefined') {
                  dbg('pausing mediaelement');
                  mediaElement.pause();
                  //timeholder = ;;
                }
                
                c.fired = true;
                if(typeof c.container != 'undefined') {
                  obj = c.container;
                  
                  //if(parent.gDebug) dbg('action to fire on '+obj)
                  //add a class so we can hide on next event
                  //$('.toremove').not('.persistent').hide();
                  //animateElements($('.'+obj))
                  
                  //if we need to only show the element for a specified period
                  if(typeof c.showtime != 'undefined') {
                    //dbg('hide mediaelement in '+ c.showtime +' seconds');
                    $('.'+obj).delay(c.showtime*1000).fadeOut(0);
                  }
                }
                
                k++ ;
              }
            }
          }
        }
      }, false); //end timeupdate eventlistener
        
      mediaElement.addEventListener('seeked', function(e) {
        //e.stopPropagation();
       // return false;
      })
      mediaElement.addEventListener('ended', function(e) {
        
        if(typeof final != "undefined") try{ localEnd(); }catch(e){dbg('no localfuntion to call')};
      }, false)
      // can play
      mediaElement.addEventListener('canplay', function(e) {
		  
		  trace('LOADED')
        //o.canplay = true;
		
		//$('#audio_preloader').fadeOut()
      }, false)
      mediaElement.addEventListener('volumechange', function(e) {
        dbg('muting audio '+mediaElement.muted)
        parent.muted = mediaElement.volume;
        parent.muted = mediaElement.muted
       }, false)
      mediaElement.setMuted(parent.muted);

      var count = 0;
      var maxcount = 20; // 10 seconds
      var frequency = 500; // every 5/10 of a second
      
      var int = setInterval(function(){
        // detect if we can play this narration
        if(player.canplay) {
          clearInterval(int);
          //if(o.autoplay) o.player.play();
        }else{
          // we allow "maxcount" seconds for the o.canplay flag to be set
          if(count >= maxcount) {
            clearInterval(int);
           // dbg('max attempts at playing audio')

          }
          count ++;
        }
      },frequency) 
    } 
  })
  //player.changeSkin('mejs-pomc-audio');
  return player;
}


function initVideo(div, src, dimW, dimH) {

    var timeholder = 0;

    var w = typeof dimW != 'undefined' ? dimW : 472;
    var h = typeof dimH != 'undefined' ? dimH : 320;


    var player = new MediaElementPlayer(div, {
        startVolume: volume,
        'videoWidth': w,
        'videoHeight': h,
        'plugins': ['flash'],
        enableAutosize: true,
        iPadUseNativeControls: false,
        iPhoneUseNativeControls: false,
        AndroidUseNativeControls: false,
        features: ['volume', 'playpause', 'progress', 'duration'],

        success: function (mediaElement, domObject) {

            mediaElement.pause();
            mediaElement.setSrc(src);
            mediaElement.load();
            //mediaElement.play()
            mediaElement.addEventListener('ended', function (e) {

                try {
                    videoEnd(div);
                } catch (e) {
                    $debug('no localfuntion videoEnd to call');
                }

            }, false);

        }
    });
    return player;
}

function stopAllMediaElements(a) {
    
    try{player.pause();}catch(e){$debug('attempt pause of audio on navigation failed' + e.message)}
    clearElements(); // find and timerrs or animations on screen and stop them

}

//function to remove all intervals and finish jquery animation() when navigating frame.
//otherwise we get a permission denied error e.g (the element being targeted to animate no longer exists)
function clearElements(){
   $('*',cc.document).finish();
    var interval_id = window.setInterval("", 9999); // Get a reference to the last
    return true;
    
    
    //interval list builds up tremendously
    //does not appears need when using the above .finish();
    $debug('GARBAGE COLLECTION ------------------------------------------------')   
    for (var i = 1; i < interval_id; i++){
        window.clearInterval(i);
        $debug('clearing interval ---------- ' + i)   

    }
    $debug('END GARBAGE COLLECTION --------------------------------------------')   
    return true;
}