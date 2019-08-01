Ext.define('CoolerIoTMobile.view.Mobile.Dashboard', {
	extend: 'Ext.Container',
	xtype: 'mobile-Dashboard',
	config: {
		title: 'Cooler-Alerts',
		layout: 'vbox',
		items: [
			{
				xtype: 'mobile-AlertList',
				flex: 1
			},
			{
				xtype: 'tabpanel',
				flex: 0.2,
				tabBarPosition: 'bottom',
				items: [
					{
						title: 'Open',
						itemId: 'openAlertsList',
						iconCls: 'star'
					}, {
						title: 'Close',
						itemId: 'closeAlertsList',
						iconCls: 'star'
					}
				]
			}
		]
	}
});