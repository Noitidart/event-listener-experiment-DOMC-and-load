const {interfaces: Ci,	utils: Cu} = Components;
Cu.import('resource://gre/modules/Services.jsm');
const ignoreFrames = false;

function listenLog(event, msg) {
	var win = event.originalTarget.defaultView;
	var doc = win.document;
	if (win.frameElement) {
		if (ignoreFrames) return;
		Cu.reportError(msg + ' - frame - loc = ' + doc.location);
	} else {
		Cu.reportError(msg + ' - loc = ' + doc.location)
	}
}

var listenLogFuncs = {
	'PgSh-fals-gbrwsr': function(event){ listenLog(event, 'PgSh-fals-gbrwsr') },
	'PgSh-true-gbrwsr': function(event){ listenLog(event, 'PgSh-true-gbrwsr') },
	'DOMC-fals-gbrwsr': function(event){ listenLog(event, 'DOMC-fals-gbrwsr') },
	'DOMC-true-gbrwsr': function(event){ listenLog(event, 'DOMC-true-gbrwsr') },
	'load-fals-gbrwsr': function(event){ listenLog(event, 'load-fals-gbrwsr') },
	'load-true-gbrwsr': function(event){ listenLog(event, 'load-true-gbrwsr') },
	'PgSh-fals-domWin': function(event){ listenLog(event, 'PgSh-fals-domWin') },
	'PgSh-true-domWin': function(event){ listenLog(event, 'PgSh-true-domWin') },
	'DOMC-fals-domWin': function(event){ listenLog(event, 'DOMC-fals-domWin') },
	'DOMC-true-domWin': function(event){ listenLog(event, 'DOMC-true-domWin') },
	'load-fals-domWin': function(event){ listenLog(event, 'load-fals-domWin') },
	'load-true-domWin': function(event){ listenLog(event, 'load-true-domWin') }
};


var windowListener = {
	onOpenWindow: function (aXULWindow) {
		//does this to future loaded windows, match this //it is same as the content inside the while loop of register, but different in that it waits for window to load before interacting with gBrowser
		let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
		
		aDOMWindow.addEventListener('pageshow', listenLogFuncs['PgSh-fals-domWin'], false);
		aDOMWindow.addEventListener('pageshow', listenLogFuncs['PgSh-true-domWin'], true);
		aDOMWindow.addEventListener('DOMContentLoaded', listenLogFuncs['DOMC-fals-domWin'], true);
		aDOMWindow.addEventListener('DOMContentLoaded', listenLogFuncs['DOMC-true-domWin'], true);
		aDOMWindow.addEventListener('load', listenLogFuncs['load-fals-domWin'], true);
		aDOMWindow.addEventListener('load', listenLogFuncs['load-true-domWin'], true);
		
		aDOMWindow.addEventListener("load", function () { //this one is needed to listen to gBrowser
			aDOMWindow.removeEventListener("load", arguments.callee, false);
			windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
		}, false);
	},
	onCloseWindow: function (aXULWindow) {},
	onWindowTitleChange: function (aXULWindow, aNewTitle) {},
	register: function () {
		// Load into any existing windows
		let XULWindows = Services.wm.getXULWindowEnumerator(null);
		while (XULWindows.hasMoreElements()) {
			let aXULWindow = XULWindows.getNext();
			let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
			
			aDOMWindow.addEventListener('pageshow', listenLogFuncs['PgSh-fals-domWin'], false);
			aDOMWindow.addEventListener('pageshow', listenLogFuncs['PgSh-true-domWin'], true);
			aDOMWindow.addEventListener('DOMContentLoaded', listenLogFuncs['DOMC-fals-domWin'], true);
			aDOMWindow.addEventListener('DOMContentLoaded', listenLogFuncs['DOMC-true-domWin'], true);
			aDOMWindow.addEventListener('load', listenLogFuncs['load-fals-domWin'], true);
			aDOMWindow.addEventListener('load', listenLogFuncs['load-true-domWin'], true);
			
			windowListener.loadIntoWindow(aDOMWindow, aXULWindow); //needed for gBrowser //this is the reason i dont do a windowListener.onOpenWindow(aXULWindow) here because, gBrowser is already loaded, an onOpenWindow it waits to listen for gBrowser load
		}
		// Listen to new windows
		Services.wm.addListener(windowListener);
	},
	unregister: function () {
		// Unload from any existing windows
		let XULWindows = Services.wm.getXULWindowEnumerator(null);
		while (XULWindows.hasMoreElements()) {
			let aXULWindow = XULWindows.getNext();
			let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
			
			windowListener.unloadFromWindow(aDOMWindow, aXULWindow); //this one needed to remove from gBrowser

			aDOMWindow.removeEventListener('pageshow', listenLogFuncs['PgSh-fals-domWin'], false);
			aDOMWindow.removeEventListener('pageshow', listenLogFuncs['PgSh-true-domWin'], true);
			aDOMWindow.removeEventListener('DOMContentLoaded', listenLogFuncs['DOMC-fals-domWin'], true);
			aDOMWindow.removeEventListener('DOMContentLoaded', listenLogFuncs['DOMC-true-domWin'], true);
			aDOMWindow.removeEventListener('load', listenLogFuncs['load-fals-domWin'], true);
			aDOMWindow.removeEventListener('load', listenLogFuncs['load-true-domWin'], true);
			
		}
		//Stop listening so future added windows dont get this attached
		Services.wm.removeListener(windowListener);
	},
	loadIntoWindow: function (aDOMWindow, aXULWindow) {
		if (!aDOMWindow) {
			return;
		}
		if (aDOMWindow.gBrowser) {
			aDOMWindow.gBrowser.addEventListener('pageshow', listenLogFuncs['PgSh-fals-gbrwsr'], false);
			aDOMWindow.gBrowser.addEventListener('pageshow', listenLogFuncs['PgSh-true-gbrwsr'], true);
			aDOMWindow.gBrowser.addEventListener('DOMContentLoaded', listenLogFuncs['DOMC-fals-gbrwsr'], true);
			aDOMWindow.gBrowser.addEventListener('DOMContentLoaded', listenLogFuncs['DOMC-true-gbrwsr'], true);
			aDOMWindow.gBrowser.addEventListener('load', listenLogFuncs['load-fals-gbrwsr'], true);
			aDOMWindow.gBrowser.addEventListener('load', listenLogFuncs['load-true-gbrwsr'], true);
			
			//no need to add to the iframes in the document if there is one  because the listener on gBrowser will catch it
		} else {
			//window does not have gBrowser
		}
	},
	unloadFromWindow: function (aDOMWindow, aXULWindow) {
		if (!aDOMWindow) {
			return;
		}
		if (aDOMWindow.gBrowser) {
			aDOMWindow.gBrowser.removeEventListener('pageshow', listenLogFuncs['PgSh-fals-gbrwsr'], false);
			aDOMWindow.gBrowser.removeEventListener('pageshow', listenLogFuncs['PgSh-true-gbrwsr'], true);
			aDOMWindow.gBrowser.removeEventListener('DOMContentLoaded', listenLogFuncs['DOMC-fals-gbrwsr'], true);
			aDOMWindow.gBrowser.removeEventListener('DOMContentLoaded', listenLogFuncs['DOMC-true-gbrwsr'], true);
			aDOMWindow.gBrowser.removeEventListener('load', listenLogFuncs['load-fals-gbrwsr'], true);
			aDOMWindow.gBrowser.removeEventListener('load', listenLogFuncs['load-true-gbrwsr'], true);
		} else {
			//window does not have gBrowser
		}
	}
};

function startup(aData, aReason) {
	windowListener.register();
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	windowListener.unregister();
}

function install() {}

function uninstall() {}