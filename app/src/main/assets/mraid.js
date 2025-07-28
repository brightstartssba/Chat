function sendMessageToLogHandler(message) {
    console.log(message);
}

function debugOXMMRAID(message) {
    //Uncomment to assist in debugging this file
    sendMessageToLogHandler("OXM mraid.js debugging: " + message);
}

debugOXMMRAID("Beginning to add mraid.js...");

/* cross-platform abstraction for calling to the container. */
function callContainer(command) {
    if (!MraidBridge) {
        console.log("MraidBridge not bound.");
        return;
    }
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    debugOXMMRAID("callContainer: command = [" + command + "], args = [" + args + "]");
    MraidBridge.handleMraidCommand(command, args);
}

(function () {
    var mraid = {};
    mraid.state = "loading";
    mraid.viewable = false;
    window.mraid = mraid;
    mraid.eventListeners = {};
    mraid.allSupports = {
        sms: false,
        tel: false,
        calendar: false,
        storePicture: false,
        inlineVideo: false,
        vpaid: false,
        location: false
    };
    mraid.expandProperties = {
        width: 0,
        height: 0,
        useCustomClose: false, // This is deprecated. In MRAID 3.0 host will ignore this request
        isModel: true // readonly
    };
    mraid.maxSize = {
        width: 0,
        height: 0
    };
    mraid.screenSize = {
        width: 0,
        height: 0
    };
    mraid.orientationProperties = {
		allowOrientationChange: true,
		forceOrientation: "none"
	};

    /**
     * The ad calls the getVersion() method to query the host about which MRAID
     * version the host supports. The host returns a version number string ("3.0" for
     * MRAID 3.0). The version number indicates the version of MRAID that the host
     * supports (1.0, 2.0, or 3.0, etc.), NOT the version of the vendor's SDK.
     * @returns A String that indicates the MRAID version with which the SDK is compliant (not the version of the SDK). 
     */
    mraid.getVersion = function () {
        return "3.0";
    };

    mraid.getState = function () {
        return mraid.state;
    };

    /**
     * The ad calls addEventListener() to register a specific listener for a specific
     * event. The ad may register more than one listener, each to support listening for
     * separate event. The host dispatches an event to all registered listeners for each
     * specific event that occurs. The ad may also register a single listener to multiple
     * events instead of a listener for each event.
     * The events supported in MRAID 3.0 are:
     *  ● ready: report initialize complete
     *  ● error: report error has occurred
     *  ● stateChange: report state changes
     *  ● exposureChange: report change in exposure
     *  ● viewableChange (deprecated): report viewable changes
     *  ● sizeChange: report viewable changes
     * @param {string} event a string for the name of the event to listen for
     * @param {function} listener function to execute
     */
    mraid.addEventListener = function (event, listener) {
        var listeners = mraid.eventListeners[event];

        if (!listeners) {
            listeners = [];
            mraid.eventListeners[event] = listeners;
        }
        /* see if the listener is already present */
        for (var i = 0; i < listeners.length; i++) {
            if (listener == listeners[i]) { /* listener already present, nothing to do */
                return;
            }
        }

        /* not present yet, go ahead and add it */
        listeners.push(listener);
    };

    /**
     * When the ad no longer needs notification of a particular event,
     * removeEventListener() is used to unregister to that event. To avoid errors,
     * event listeners must always be removed when they are no longer needed. If no
     * listener function is specified in the in the listener attribute for the call, then all
     * functions listening to the event will be removed.
     * @param event
     * @param listener
     */
    mraid.removeEventListener = function (event, listener) {
        var listeners = mraid.eventListeners[event];
        if (listeners != null) {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i] == listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    };

    /**
     * The ad can call the open() method to prompt the host to open an external
     * mobile website in a browser window that is the default browser on the user’s
     * device The purpose of this method is to handle clickthroughs in the ad. All
     * MRAID ads must handle clickthroughs using the open() method.
     * @param url
     */
    mraid.open = function (url) {
        callContainer("open", url)
    };

    /**
     * The ad uses close() to downgrade the container state. The host responds by
     * changing the state depending on the current state using the stateChange event
     * described in section 7.4.
     * For ads in an expanded or resized state, the close() method moves the ad to a
     * default state. For interstitial ads in a default state, the close() method moves to
     * a hidden state. These ad states and the state that results from calling close()
     * are described in section 4.2.1.
     * For ads in a default state, ad developers must avoid using mraid.close() . To
     * inform the container that the ad needs to be dismissed, use mraid.unload().
     * If an ad uses multiple resize() calls or a resize() followed by the expand()
     * call, close() returns the container state to 'default.' Calling close() in these
     * instances does NOT simply undo the most recently called resize() or
     * expand().
     */
    mraid.close = function () {
        debugOXMMRAID("mraid.close");
        callContainer('close');
    };

    /**
     * The key purpose of this method is to allow the ad to communicate to the host that
     * the ad must no longer be shown to the user. The ad can request the host to
     * completely dismiss the ad by using the unload() method. The host responds by
     * dismissing the ad and then either removing the webview or replacing it with
     * another document or refreshing it with a new ad.
     */
    mraid.unload = function () {
        debugOXMMRAID("mraid.unload");
        callContainer('unload');
    };

    mraid.useCustomClose = function () {
        // deprecated in MRAID 3.0
    };

    /**
     * The ad uses expand() to request support for an ad expansion experience, either
     * by changing the width and height of the current webview (one-part creative) or by
     * opening a new webview at the highest level in an expanded size (two-part
     * creative). The expanded view can either contain a new HTML document if a URL
     * is specified, or it can reuse the same document that was in the default position. 
     * 
     * @param {string} url optional. The URL for the document to be displayed in a
     * new overlay view. If null or a non-URL parameter is used, the
     * body of the current ad will be used in the current webview.
     */
    mraid.expand = function (url) {
        debugOXMMRAID("mraid.expand");
        if (url) {
            callContainer('expand', url);
        } else {
            callContainer('expand');
        }
    };

    mraid.setExpandProperties = function (properties) {
        if (properties && properties.width != null && typeof properties.width !== 'undefined' && !isNaN(properties.width)) {
            mraid.expandProperties.width = properties.width;
        }

        if (properties && properties.height != null && typeof properties.height !== 'undefined' && !isNaN(properties.height)) {
            mraid.expandProperties.height = properties.height;
        }
    }

    mraid.getExpandProperties = function () {
        mraid.expandProperties.isModel = true;
        return mraid.expandProperties;
    };

    mraid.isViewable = function () {
        return mraid.viewable;
    };

    /**
     * Calling resize() is a request for a container size change that accommodates
     * the creative size change. Resize is used for a succession of changes or a size 
     * change that is less than full screen size and that doesn't interfere with app
     * operation.
     * Before calling resize(), the ad must specify the desired width and height of the
     * resize using setResizeProperties(). Calling resize() before
     * setResizeProperties will result in an error.
     * After calling resize, the host responds by adjusting the ad container to the ad's
     * desired size.
     * Resize operates at a higher z-index than the app content so that it does not push
     * or reposition app content. If an app wishes to support content-shifting ads, like
     * "push-downs," the app must implement app repositioning features to support
     * such functionality.
     */
    mraid.resize = function () {
        debugOXMMRAID("mraid.resize");
        callContainer('resize');
    };

    mraid.getMaxSize = function () {
        debugOXMMRAID("mraid.getMaxSize: " + mraid.maxSize);
        return mraid.maxSize;
    };

    mraid.setMaxSize = function (w, h) {
        debugOXMMRAID("mraid.setMaxSize: w=" + w + ", h=" + h);
        mraid.maxSize.width = w;
        mraid.maxSize.height = h;
    };

    mraid.getScreenSize = function () {
        debugOXMMRAID("mraid.getScreenSize: " + mraid.screenSize);
        return mraid.screenSize;
    };

    mraid.setScreenSize = function (w, h) {
        debugOXMMRAID("mraid.setScreenSize: w=" + w + ", h=" + h);
        mraid.screenSize.width = w;
        mraid.screenSize.height = h;
    }

    /* The setResizeProperties method sets the whole JavaScript object. */
	mraid.setResizeProperties = function(properties) {
 
		debugOXMMRAID("mraid.setResizeProperties: " + JSON.stringify(properties));
 
		mraid.resizePropertiesInitialized = false;
 
		if (!properties) {
			mraid.onError("properties is null", "setResizeProperties");
			return;
		}
 
		//Get max size
		var maxSize = mraid.getMaxSize();
		if (!maxSize || !maxSize.width || !maxSize.height) {
			mraid.onError("Unable to use maxSize of [" + JSON.stringify(maxSize) + "]", "setResizeProperties");
			return;
		}
 
		//Width
		if (properties.width == null || typeof properties.width === 'undefined' || isNaN(properties.width)) {
			mraid.onError("width param of [" + properties.width + "] is unusable.", "setResizeProperties");
			return;
		}
		
		if (properties.width < 50 || properties.width > maxSize.width) {
			mraid.onError("width param of [" + properties.width + "] outside of acceptable range of 50 to " + maxSize.width, "setResizeProperties");
			return;
		}

		//Height
		if (properties.height == null || typeof properties.height === 'undefined' || isNaN(properties.height)) {
			mraid.onError("height param of [" + properties.height + "] is unusable.", "setResizeProperties");
			return;
		}
			
		if (properties.height < 50 || properties.height > maxSize.height) {
			mraid.onError("height param of [" + properties.height + "] outside of acceptable range of 50 to " + maxSize.height, "setResizeProperties");
			return;
		}

		//Offset
		if (properties.offsetX == null || typeof properties.offsetX === 'undefined' || isNaN(properties.offsetX)) {
            properties.offsetX = 0;
		}

		if (properties.offsetY == null || typeof properties.offsetY === 'undefined' || isNaN(properties.offsetY)) {
			properties.offsetY = 0;
		}

		//Allow Offscreen
		if (typeof(properties.allowOffscreen) !== "boolean") {
			properties.allowOffscreen = false;
		}
		
        mraid.resizeProperties = {};
		mraid.resizeProperties.width = properties.width;
		mraid.resizeProperties.height = properties.height;		
		mraid.resizeProperties.customClosePosition = properties.customClosePosition;		
		mraid.resizeProperties.offsetX = properties.offsetX;		
		mraid.resizeProperties.offsetY = properties.offsetY;		
		mraid.resizeProperties.allowOffscreen = properties.allowOffscreen;

		mraid.resizePropertiesInitialized = true;
	};

    mraid.getResizeProperties = function() {
        return mraid.resizeProperties;
    };

    /* The setOrientationProperties method sets the JavaScript orientationProperties object. */
	mraid.setOrientationProperties = function(properties) {
		debugOXMMRAID("mraid.setOrientationProperties: " + JSON.stringify(properties));
		if (!properties)
			return;
		var aoc = properties.allowOrientationChange;
		if (aoc === true || aoc === false) {
			mraid.orientationProperties.allowOrientationChange = aoc;
		}

		var fo = properties.forceOrientation;
		if (fo == 'landscape' || fo == 'portrait' || fo == 'none') {
			mraid.orientationProperties.forceOrientation = fo;
		}

		callContainer('onOrientationPropertiesChanged', JSON.stringify(mraid.getOrientationProperties()));
	};

	/* The getOrientationProperties method returns the whole JavaScript object orientationProperties object. */
	mraid.getOrientationProperties = function() {
		return mraid.orientationProperties;
	};

    mraid.getCurrentAppOrientation = function() {
        if (MraidBridge == null) {
            debugOXMMRAID("mraid.getCurrentAppOrientation failed, MraidBridge==null.")
            return {};
        }
        return JSON.parse(MraidBridge.getCurrentAppOrientation());
    }

    /**
     * The ad can use the supports feature to query the host about which devicenative features the app can access. Awareness of supported native features
     * helps the ad compensate in environments where certain features are not
     * supported.
     * @param {string} feature 
     * @returns true or false
     */
    mraid.supports = function (feature) {
        return mraid.allSupports[feature];
    };

    /* event - event name, args - arguments */
	mraid.fireEvent = function(event, args) {
		var handlers = mraid.eventListeners[event];
		if (handlers == null) { /* no handlers defined yet, set it up */
			return;
		}

		/* see if the listener is present */
		for (var i = 0; i < handlers.length; i++) {
			if (event == 'ready') {
				handlers[i]();
			} else if (event == 'error') {
				handlers[i](args[0], args[1]);
			} else if (event == 'stateChange') {
				handlers[i](args);
			} else if (event == 'viewableChange') {
				handlers[i](args);
			} else if (event == 'sizeChange') {
				handlers[i](args[0], args[1]);
			}
		}
	};

	/* The createCalendarEvent method opens the device UI to create a new calendar event. */
	mraid.createCalendarEvent = function(parameters) {
		callContainer('createCalendarEvent', JSON.stringify(parameters));
	};

	/* The storePicture method will place a picture in the device's photo album. */
	mraid.storePicture = function(url) {
		callContainer('storePicture', url);
	};

    mraid.playVideo = function(url) {
        callContainer('playVideo', url);
    }

	/* This error is thrown whenever an SDK error occurs */

	/* message - description of the type of error, action - name of action that caused error */
	mraid.onError = function(message, action) {
        debugOXMMRAID("onError:" + action + "," + message);
		mraid.fireEvent("error", [message, action]);
	};

	/* This event fires when the SDK is fully loaded, initialized, and ready for any calls from the ad creative */
	mraid.onReady = function() {
		debugOXMMRAID("mraid.onReady");
		mraid.onStateChange("default");
		mraid.fireEvent("ready");
	};

	mraid.onReadyExpanded = function() {
		debugOXMMRAID("mraid.onReadyExpanded");
		mraid.onStateChange("expanded");
		mraid.fireEvent("ready");
	};

	/* The sizeChange event fires when the ad’s size within the app UI changes. */
	mraid.onSizeChange = function(width, height) {
		debugOXMMRAID("mraid.onSizeChange(" + width + "," + height + ")");
		mraid.fireEvent("sizeChange", [width, height]);
	};

	/* This event fires when the state is changed programmatically by the ad or by the environment.
	The possible states are:
	loading - the container is not yet ready for interactions with the MRAID implementation
	default - the initial position and size of the ad container as placed by the application and SDK
	expanded - the ad container has expanded to cover the application content at the top of the view hierarchy
	resized - the ad container has changed size via MRAID 2.0’s resize() method
	hidden - the state an interstitial ad transitions to when closed. Where supported, the state a banner ad transitions to when closed */
	mraid.onStateChange = function(state) {
        // Output state changes to the log per MRAID specs: https://www.iab.com/wp-content/uploads/2015/08/MRAID_Test_Ad-Video_Interstitial.pdf
        sendMessageToLogHandler("mraid.onStateChange(" + state + ")");
		mraid.state = state;
		callContainer("onStateChanged", state);
		mraid.fireEvent("stateChange", mraid.getState());
	};

	/* This event fires when the ad moves from on-screen to off-screen and vice versa */

	/* true: container is on-screen and viewable by user; false: container is off-screen and not viewable */
	mraid.onViewableChange = function(isViewable) {
		debugOXMMRAID("mraid.onViewableChange(" + isViewable + ")");
		mraid.viewable = isViewable;
		mraid.fireEvent("viewableChange", mraid.isViewable());
	};

	mraid.onExposureChange = function(exposureInfo) {
        debugOXMMRAID("mraid.onExposureChange(" + JSON.stringify(exposureInfo) + ")");
	};
    callContainer("initialized");
}());

function setupViewport(width) {
	var element = document.querySelector("meta[name=viewport]");
	if (!element) {
		element = document.createElement("meta");
		element.name = "viewport";
		element.content = "width=" + width + ", user-scalable=no";
		document.getElementsByTagName('head')[0].appendChild(element);
	} else {
		element.content = "width=" + width + ", user-scalable=no";
	}
}

function removeBodyMargin() {
    // 获取head节点
    var head = document.head || document.getElementsByTagName('head')[0];

    // 创建style节点
    var style = document.createElement('style');

    // 设置样式内容
    style.textContent = 'body { margin: 0px; padding: 0px;}';

    // 将style节点插入到head节点中
    head.appendChild(style);
}
removeBodyMargin();
debugOXMMRAID("Finished adding mraid.js");
