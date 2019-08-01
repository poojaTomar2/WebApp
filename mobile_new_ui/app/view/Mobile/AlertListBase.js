Ext.define('CoolerIoTMobile.view.Mobile.AlertListBase', {
	xtype: 'alert-list-base',
	extend: 'Ext.Container',
	config: {
		layout:'vbox',
		title: "My Alerts",
		items: [
			{
				xtype: 'container',
				html: [
					'<div class="iot-alertData-header iot-alert-list">',
						'<div class="iot-row-expander-icon  iot-row-leaf"></div>',
						'<div class="iot-alert-location">Alert Text</div>',
						'<div class="iot-alert-location">Customer</div>',
						'<div class="iot-alert-alert">Alert</div>',
						'<div class="iot-alert-age">Age</div>',
						'<div class="iot-alert-status">Status</div>',
						'<div class="iot-alert-route">Route</div>',
						'<div class="x-clear"></div>',
						'</div>'
				].join('')
			},
			{
				xtype: 'alert-list',
				flex: 1
			}
		]
	}
});