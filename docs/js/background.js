// -------------------------------------------------------
//
//  General services worker listeners
//
// -------------------------------------------------------

self.addEventListener('install', function(event) {
    console.debug('activate', event);
});
self.addEventListener('activate', function (event) {
    console.debug('activate', event);	
	openOrinAyoWindow();
});

self.addEventListener('message', function (event) {
	console.debug('message', event.data);
})

self.addEventListener('notificationclose', function(event) {
    console.debug('notificationclose', event.notification);
});

self.addEventListener('notificationclick', function(event) {
    console.debug('notificationclick', event);
});

// -------------------------------------------------------
//
//  Chrome extension listeners
//
// -------------------------------------------------------

if (location.protocol == "chrome-extension:") {
	
	chrome.runtime.onInstalled.addListener((details) => {
		console.debug("onInstalled");
		
		if (details.reason == "install")
		{
			console.debug("This is a first install!");

		} else if (details.reason == "update"){
			const thisVersion = chrome.runtime.getManifest().version;

			if (thisVersion != details.previousVersion)
			{
				console.debug("Updated from " + details.previousVersion + " to " + thisVersion + "!");			
			}
		}	
	});

	chrome.runtime.onStartup.addListener(() => {
		console.debug("onStartup");	
	});
	
	chrome.action.onClicked.addListener( () => {
		console.debug("action onClicked");	
		openOrinAyoWindow();
	});	

	chrome.windows.onFocusChanged.addListener((win) => {
		//console.debug("onFocusChanged", win);	
	});	

	chrome.windows.onCreated.addListener((win) => {
		//console.debug("onCreated");		
	});	

	chrome.windows.onRemoved.addListener((win) => {
		//console.debug("onRemoved", win);	
		chrome.storage.local.get('orinAyoWin', async (data) => {	
			if (data.orinAyoWin && data.orinAyoWin == win) {	
				chrome.storage.local.remove('orinAyoWin');	
			}
		});	
	});
}

// -------------------------------------------------------
//
//  Functions
//
// -------------------------------------------------------

const createOrinAyoWindow = () => {
	console.debug("createOrinAyoWindow");		
	const data = {url: chrome.runtime.getURL("index.html"), type: 'popup'};
	
	chrome.windows.create(data, async (win) => {
		//await chrome.offscreen.closeDocument();
		chrome.storage.local.set({orinAyoWin: win.id});			
		chrome.windows.update(win.id, {width: 1200, height: 1140});
	});
}

const openOrinAyoWindow = () => {	
	chrome.storage.local.get('orinAyoWin', (data) => 
	{	
		if (data.orinAyoWin) {
			chrome.windows.getAll((windows) => {
				let window = null;

				for (let win of windows) {
					if (data.orinAyoWin == win.id) window = win;
				}
				
				if (window) {
					chrome.windows.update(window.id, {focused: true});			
				} else {
					createOrinAyoWindow();
				}					
			});	
		} else {
			createOrinAyoWindow();
		}
	});		
}
