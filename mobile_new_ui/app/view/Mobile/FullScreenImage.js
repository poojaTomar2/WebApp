Ext.define('CoolerIoTMobile.view.Mobile.FullScreenImage', {
	extend: 'Ext.Container',
	xtype: 'mobile-fullScreenImage',
	config: {
		layout:{
			type:'fit'
		},
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				title: 'Image',
				itemId:'imageTitle'
			},
			{
				xtype: 'container',
				itemId: 'pinchImage',
				height: '100%', 
				width: '100%'
			}
		]
	}
});