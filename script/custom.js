//'use strict';

var player;
var ie9 = false;

function trace(a){
	console.log(a)
}

function dbg(a) {
	try{
    parent.$debug(a);
	}catch(e){}
}

function pageIsComplete(pageNumber) {
    return parent.gTopicObject && parent.gTopicObject.pageStatus[pageNumber - 1];
}

function stopAudio() {
    try { player.pause(); } catch (e) { $debug('attempt pause of audio on navigation failed' + e.message) }
}

function stopAllMediaAndBookmarkPage() {
    try { parent.stopAllMediaElements(); } catch (e) { $debug('attempt pause of audio on navigation failed' + e.message) }
    parent.gAPI.setData("cmi.core.lesson_location", parent.setBookMark());
}

function setupPage() {
   
 /*  
   
    $('.loader-close').addClass('loaderLink').removeClass('loader-close').html('Continue');
    var obj = {};
    //if (parent.gTopicObject) {
    // console.log("Current page: " + parent.gCurrentPage);
    // console.log(parent.gTopicObject.pageStatus);
    //}
    if (parent.gTopicObject && parent.gTopicObject.pageStatus[parent.gCurrentPage - 1]) {
        obj.isComplete = true;
    }

   $("a.btn-continue").on("click", function () {
        stopAllMediaAndBookmarkPage();
    });
	*/
	
	ie9 = $('html').hasClass('lt-ie10')
	var obj = {};
	
	$('#showmenu_button').on({
		click:function(){$('#dropmenu_wrapper').toggleClass('showhidedrop')}
	})
		
	$('.blocker span').text('Please complete the activity above to unlock this screen.')
	$( window ).resize(function() { resizeSetup()});
	
	if(parent.menu_audio_played)
	{
		$('section').each(function(index, element) {
			
			if($(element).data('mp3')){
				var playBtn = $('<a></a>');
				playBtn.addClass('playButton playBtn')
				.data("mp3", $(element).data('mp3') )
				.on({
			click:function(){
				swapAudio($(this).data('mp3'));
				$('.playBtn').removeClass('on')
				$(this).addClass('on')
			}
				})			
				$(element).append(playBtn)			
			}      
		
    	});
	
	}
	else{
		if(!intro){
		$('.playBtn').hide()
		}
	}

	ddplayer = new MediaElementPlayer('#custom-player',{
		success: function (mediaElement, domObject){
			mediaElement.addEventListener('ended', function(e) { 
				$('.playBtn').removeClass('on')
			}, false)
		}
	});
	
	
	

    onLoad(obj);
}
/*
var utils = (function () {
    var _isIPad = null;
    return {
        setEnabledState: function ($el, enabled, setTabindex) {
            if (enabled) {
                $el.removeAttr("aria-disabled").removeClass("disabled");
                if (setTabindex) {
                    $el.attr("tabindex", 0);
                }
            }
            else {
                $el.attr("aria-disabled", true).addClass("disabled");
                if (setTabindex) {
                    $el.attr("tabindex", -1);
                }
            }
        },
        setVisibleState: function ($el, visible) {
            $el.attr("aria-hidden", !visible);
        },
        fadeIn: function ($el, callback, duration) {
            $el.fadeIn(duration || 200, function () {
                utils.setVisibleState($el, true);
                if(callback) callback();
            });
        },
        fadeOut: function ($el, callback, duration) {
            $el.fadeOut(duration || 200, function () {
                utils.setVisibleState($el, false);
                if(callback) callback();
            });
        },
        isIPad: function () {
            return true;
            if (_isIPad === null) {
                var IS_IPAD = navigator.userAgent.match(/iPad/i) != null;
                var IS_IPHONE = (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
                if (IS_IPAD) {
                    IS_IPHONE = false;
                }
                _isIPad = IS_IPAD || IS_IPHONE;
            }
            return _isIPad;
        },
        // http://stackoverflow.com/a/3955096/120399
        removeFromArray: function (arr) {
            var what, a = arguments, L = a.length, ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax = arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        }
    };
})(); */

var popover = (function () {
    var $popover, $btnClose;
    
    var appendPopover = function ($contents) {
        var $window = $(window);
        $("body").append($popover);
        var w = $contents.outerWidth(),
            h = $contents.outerHeight(),
            x = Math.max(0, ($window.width() - w) / 2),
            y = Math.max(0, ($window.height() - h) / 2);
        $contents.hide();
        $contents.css("left", x + "px").css("top", y + "px");
        $contents.fadeIn(200);
    };

    return {
        close: function (onClosed) {
            $btnClose.off("click");
            $popover.fadeOut(100, function () {
                $popover.remove();
                if (onClosed) {
                    onClosed();
                }
            });
        },
        // options: { title: String, closeButtonText: String, closeButtonSize: 's' | 'm' | 'l' | 'xl', onClosed: Function, class: String }
        show: function (options) {
            var that = this,
                $details = options.details instanceof jQuery ? options.details : $(options.details),
                btnCloseText = options.closeButtonText || "Got it! Let's continue";
            $popover = $("#popover");
            if ($popover.length) {
                $popover.remove();
                $popover.empty();
            }
            else {
                $popover = $("<div />", { id: "popover", "class": options["class"]|| "" });
            }
            var $contents = $("<div />");
            $popover.append($contents);
            if (options.title) {
                $contents.append('<h1>' + options.title + '</h1>');
            }
            var $div = $("<div />");
            $div.append($details);
            $contents.append($div);

            $btnClose = $('<a href="javascript:void(0);" role="button" class="button ' + (options.closeButtonSize || 'm') + '"><span>' + btnCloseText + '</span><span></span></a>');
            $contents.append($btnClose);
            $btnClose.on("click", function () {
                that.close(options.onClosed);
                return false;
            });

            var $images = $details.find("img");
            if ($images.length) {
                var remaining = $images.length;
                $images.on("load", function () {
                    remaining -= 1;
                    if (remaining === 0) {
                        appendPopover($contents);
                    }
                });
            }
            else {
                appendPopover($contents);
            }
        }
    };
})();

var popup = (function () {
    var $popover, $contents, $btnClose;

    var appendPopover = function ($contents, vPos) {
        var $window = $(window);
        var w = $contents.outerWidth(),
            h = $contents.outerHeight(),
            x = Math.max(0, ($window.width() - w) / 2),
            y = vPos || Math.max(0, ($window.height() - h) / 2);
        $contents.hide();
        $contents.css("left", x + "px").css("top", y + "px");
        $contents.fadeIn(200);
    };

    return {
        close: function (onClosed) {
            $btnClose.off("click");
            $popover.fadeOut(100, function () {
                $contents.css("left", "").css("top", "");
                if (onClosed) {
                    onClosed();
                }
            });
        },
        // options: { buttonCloses: Boolean, closeButtonId: String, vPos: Number, onClosed: Function)
        show: function (id, options) {
            var that = this;

            $contents = $("#" + id);
            $popover = $contents.parent();

            options = options || {};

            if (options.closeButtonId || options.buttonCloses) {
                $btnClose = options.closeButtonId ? $("#" + options.closeButtonId) : $contents.find(".button");
                $btnClose.on("click", function () {
                    that.close(options.onClosed);
                    return false;
                });
            }
            
            if (options.vPos) {
                $popover.show();
                appendPopover($contents, options.vPos);
            }
            else {
            var $images = $contents.find("img");
            if ($images.length) {
                var remaining = $images.length;
                $images.on("load", function () {
                    remaining -= 1;
                    if (remaining === 0) {
                        appendPopover($contents);
                    }
                });
                $popover.show();
            }
            else {
                $popover.show();
                appendPopover($contents);
            }
        }
        }
    };
})();

var audioPlayButton = (function () {
    var $popover;

    return {
        close: function (onClosed) {
            $btn.off("click");
            $popover.fadeOut(100, function () {
                $popover.remove();
                if (onClosed) {
                    onClosed();
                }
            });
        },
        show: function (onClicked) {
            var that = this;
            $popover = $("#playAudio");
            if ($popover.length) {
                $popover.remove();
                $popover.empty();
            }
            else {
                $popover = $("<div />", { id: "playAudio" });
            }
            $btn = $('<a href="javascript:void(0);" role="button" class="btn-play">Play</a>');
            $popover.append($btn);
            $("body").append($popover);
            var w = $btn.outerWidth(),
                h = $btn.outerHeight(),
                x = Math.max(0, ($(window).width() - w) / 2),
                y = Math.max(0, ($(window).height() - h) / 2);
            $btn.hide();
            $btn.css("left", x + "px").css("top", y + "px");
            $btn.fadeIn(200);
            $btn.on("click", function () {
                player.play();
                $btn.off("click");
                $popover.fadeOut(100, function () {
                    $popover.remove();
                    if (onClicked) {
                        onClicked();
                    }
                });
                return false;
            });
        }
    };
})();

var playAudio = function (file, suppressiPadPlayButton) {
    if (suppressiPadPlayButton) {
        parent.swapAudio(file, true, null);
    }
    else {
        parent.swapAudio(file, true, null, function () {
            if(file.indexOf('blank') == -1) audioPlayButton.show();
        });
    }
};

var playAudioThenSetPageComplete = function (file, isComplete, suppressiPadPlayButton) {
    if (!isComplete) {
        utils.setVisibleState($(".btn-continue"), false);
        window.localEnd = function () {
            utils.fadeIn($(".btn-continue"));
            parent.setPageComplete();
        };
    }
    playAudio(file, suppressiPadPlayButton);
};

var menu = (function () {

    var items = [
        { title: "Video introduction", url: "../sundries/intro.html?noredirect" },
        { title: "Start", url: "../sundries/menu.html" },
        { title: "Welcome", page: 1 },
        { title: "Module overview", page: 2 },
        { title: "Common email threats", page: 3 },
        { title: "We are all responsible for information security; not just the IT Department.", page: 4 },
        { title: "What is phishing?", page: 5 },
        { title: "Identifying phishing", page: 6 },
        { title: "You have what they want. Don't give it to them.", page: 7 },
        { title: "What is spear-phishing?", page: 8 },
        { title: "Identifying spear-phishing", page: 9 },
        { title: "Your turn to identify phishing", page: 10 },
        { title: "What should I do?", page: 11 },
        { title: "Check your understanding - Question 1 of 2", page: 12 },
        { title: "Check your understanding - Question 2 of 2", page: 13 },
        { title: "Conclusion", page: 14 }
    ];

    var show = function () {
        var $menu = $("#dd-menu"),
            $ul, $li;
        if ($menu.length) {
            $menu.remove();
        }
        $menu = $("<div />", { id: "dd-menu" });
        $ul = $("<ul />");
        $menu.append($ul);
        $.each(items, function () {
            var title = this.title,
                $a;
            if (this.page) {
                title = this.page + ". " + title;
            }
            $li = $("<li />");
            $a = $("<a />", { text: title, href: this.url || "../topic0/page" + this.page + ".html", role: "navigation" });
            utils.setEnabledState($a, !this.page || this.page === 1 || pageIsComplete(this.page - 1), true);
            $li.append($a);
            $ul.append($li);
        });

        var $anchors = $ul.find("a");

        $anchors.on("click touchend", function () {
            if ($(this).hasClass("disabled")) {
                // alert('disabled');
                $menu.remove();
                return false;
            }
            parent.stopAllMediaElements();
        });

        $menu.on("click touchend", function () {
            setTimeout(function(){
              $menu.remove();
              return false;
            },500);
            
        });
        $ul.css("top", "33px").css("right", "4px");
        $("body").append($menu);
        $($anchors[0]).focus();
    };

    return {
        init: function () {
            $("#menu").on("click", function () {
                show();
                return false;
            });
        }
    };
})();

$(function () {
    FastClick.attach(document.body);
    
    menu.init();

    var $btnMenu = $("#menu").closest("li"),
        $btnResources = $("#btn-resources");
    if (!$btnResources.length && $btnMenu.length) {
        var $a = $('<a href="javascript:void(0);" class="header-button" id="btn-resources">More Info<span class="icon"></span></a>'),
            $li = $("<li />");
        $li.append($a);
        $a.on("click", function () {
            window.open('../sundries/more-info.html', 'Help', 'width=1000,height=630')
            return false;
        });
        $btnMenu.after($li);
    }
});


