Ext.define('Df.data.Connection', {
	override: 'Ext.data.Connection',
	constructor: function () {
		var me = this;

		me.callParent(arguments);

		me.on('requestexception', me.handleRequestException, me);
	},
	onComplete: function (request) {		
		var result = this.callParent(arguments);
		var data = Ext.decode(result.responseText);
		if (!result.aborted) {
			if (result.status === 0) {
				Ext.Msg.alert('Error', result.statusText);
			}
			else {
				if (result.status === 401 && data.info == "Session has expired!") {
					Ext.Msg.alert('Error', 'Your login session has expired.', function () { window.location = ""; }, this);
				}
			}
		}
		return result;
	},
	handleRequestException: function (conn, response, options, eOpts) {
		if (!response.aborted) {
			Ext.Msg.alert('Error', response.statusText || 'Error communicating with server');
		}
	},

	setOptions: function (options, scope) {
		var result = this.callOverridden(arguments);
		result.url = Ext.urlAppend(result.url, (options.disableCachingParam || this.getDisableCachingParam()) + '=' + (new Date().getTime()));
		return result;
	}
});