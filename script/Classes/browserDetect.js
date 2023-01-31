var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser:[
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   
      string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
       string: navigator.userAgent,
       subString: "iPhone",
       identity: "iPhone/iPod"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};



BrowserDetect.init();

//alert('You\'re using ' + BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS + '!');

//place all minimum browser name and versions in this array no spaces;
// var minumumBrowserArray = new Array('Explorer7','Firefox5','Chrome13', 'Safari4');
/*var minumumBrowserArray = new Array('Explorer7','Firefox3','Chrome1', 'Safari3')

for(i=0; i<minumumBrowserArray.length; i++)
{
  //alert(BrowserDetect.browser)
  //your browser name is detected ie: Fireforx od Explorer
  
  if(minumumBrowserArray[i].indexOf(BrowserDetect.browser) != -1)
  {
    br = minumumBrowserArray[i].split(BrowserDetect.browser);
    var vernum = parseFloat(br[1])

    //alert(typeof(BrowserDetect.version)+'\n'+typeof(vernum))
    if(BrowserDetect.version < vernum)
    {
      //alert('sorry\nneed at least version: '+vernum+'\nyour version: '+BrowserDetect.version);
      
      //your browser version is NOT suffiecient to continue - please upgrade;
      window.location.href = "/html/browser_not_supported.html";
    }else{
      // your browser version is sufficient to continue;
      break;
    };
  }else
  {
    //fall through only after full loop has run
    if(i == minumumBrowserArray.length)
    {
      //alert('FALL THROUGH')
      
      //brower names that are not in the minumumBrowserArray 
      //window.location.href = "/html/browser_not_supported.html";
    }
    
  };
}
*/