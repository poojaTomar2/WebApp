/**
 * @private
 */
Ext.define('Ext.ux.mgd.device.scanner.Cordova', {
	alternateClassName: 'Ext.device.scanner.PhoneGap',
	extend: 'Ext.ux.mgd.device.scanner.Abstract',

	TYPES: {
		text: "TEXT_TYPE",
		email: "EMAIL_TYPE",
		phone: "PHONE_TYPE",
		sms: "SMS_TYPE"
	},

	getScan: function (onSuccess, onError) {
		if (onSuccess == Ext.emptyFn)
			onSuccess = this.callback.onSuccess;
		if (onError == Ext.emptyFn)
			onError = this.callback.onError;

		try {
			var scanner = cordova.plugins.BarcodeScanner;
			if (scanner == undefined)
				scanner = cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");

			scanner.scan(onSuccess, onError);
		} catch (e) {
			alert(e);
		}
	},

	scan: function (args) {
		var onSuccess = args.success,
			onError = args.failure,
			scope = args.scope;

		if (scope) {
			onSuccess = Ext.Function.bind(onSuccess, scope);
			onError = Ext.Function.bind(onError, scope);
		}

		this.getScan(onSuccess, onError);
	},

	getEncode: function (type, data, onSuccess, onError, options) {
		if (onSuccess == Ext.emptyFn)
			onSuccess = this.callback.onSuccess;
		if (onError == Ext.emptyFn)
			onError = this.callback.onError;
		if (!type in this.TYPES)
			type = 'text';

		type = this.TYPES[type];

		try {
			var scanner = cordova.plugins.BarcodeScanner;
			if (scanner == undefined)
				scanner = cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
			scanner.encode(type, data, onSuccess, onError, options);
//			scanner.encode(type, data,
//				function (success) {
//					alert("encode success: " + success);
//				}, function (fail) {
//					alert("encoding failed: " + fail);
//				}
//			);
		} catch (e) {
			alert(e);
		}
	},

	encode: function (args) {
		if (typeof args === 'string')
			args = {type: 'text', data: args, success: Ext.emptyFn, failure: Ext.emptyFn, scope: null, options: null};

		var type = args.type || 'text',
			data = args.data,
			onSuccess = args.success,
			onError = args.failure,
			scope = args.scope,
			options = args.options;

		if (scope) {
			onSuccess = Ext.Function.bind(onSuccess, scope);
			onError = Ext.Function.bind(onError, scope);
		}

		this.getEncode(type, data, onSuccess, onError, options);
	}
})
;