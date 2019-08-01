// Added for Logging the JS Errors.
var JsLoggerEx = {
	sendmail: function (excObject, appName) {
		var user = '';
		if(DA && DA.Security && DA.Security.info) {
			user += DA.Security.info.UserId;
			if(DA.Security.info.Tags.Username) {
				user += ' (' + DA.Security.info.Tags.Username + ')';
			} else {
				user += ' (' + DA.Security.info.Tags.FirstName + ' ' + DA.Security.info.Tags.LastName + ')';
			}
		}

		var params = {}, url = DA.App.ExceptionUrl;
		params.rawurl = window.location.href,
		params.exception = [
			'<b>Module Name:</b> ' + DCPLApp.ActiveTab.title,
			'<b>Message:</b> ' + excObject.message,
			'<b>Stack Trace:</b> ' + excObject.stack
		].join('\r\n'),
		params.User = user,
		params.UserAgent = navigator.userAgent,
		params.Browser = navigator.appVersion,
		params.VirtualPath = appName,
		params.SystemPath = appName,
		params.Location = appName
		if (url) {
			Ext.Ajax.request({
				url: url,
				params: params,
			});
		}
	},
	initialize: function () {
		window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
			var appName = DA.App.AppName,
				url = document.URL;
			if (url.indexOf('localhost') > -1) {
				return;
			}
			// Send object with all data to server side log, using severity fatal, 
			// from logger "onerrorLogger"
			if (appName) {
				var exceptionObject = JL.Logger.prototype.buildExceptionObject(errorObj);
				JsLoggerEx.sendmail(exceptionObject, appName);
				return false;
			}
		}
	}
};
