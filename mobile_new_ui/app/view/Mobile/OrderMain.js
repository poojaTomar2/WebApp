Ext.define('CoolerIoTMobile.view.Mobile.OrderMain', {
	extend: 'Ext.Container',
	xtype: 'mobile-ordermain',
	config: {
		layout: 'fit',
		items: [{
			xtype: 'navigationview',
			layout: {
				type: 'card',
				animation: false
			},
			defaultBackButtonText: '',
			itemId: 'mainNavigationView',
			items: [{
				xtype: 'mobile-order'
			},
			 {
			 	xtype: 'toolbar',
			 	docked: 'bottom',
			 	itemId: 'bottom-bar',
			 	defaults: {
			 		ui: 'plain'
			 	},
			 	items: [
					{
						xtype: 'button',
						text: 'Logout',
						itemId: 'logout',
						docked: 'left',
						height: '100%',
						hidden: false,
						labelCls: 'x-button button-font order-button-logout'
					}
			 	]
			 }
			]
		}]
	}
});