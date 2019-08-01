Ext.define('CoolerIoTMobile.controller.Message', {
	extend: 'Ext.app.Controller',
	config: { 
		control: {
			'mobile-MessageList': {
				activate: 'onMessageActivate'
			}
		}
	},
	onMessageActivate: function (panel) {
		panel.getStore().load();
	}
});