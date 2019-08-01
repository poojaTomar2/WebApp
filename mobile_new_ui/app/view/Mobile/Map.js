Ext.define('CoolerIoTMobile.view.Mobile.Map', {
	extend: 'Ext.Container',
	xtype: 'mobile-map',
	config: {
		layout: 'fit',
		title: 'Map',
		items: [
			{
				xtype: 'Df-Map'
			}
		]
	}
});
