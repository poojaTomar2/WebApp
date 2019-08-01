Ext.define('CoolerIoTMobile.view.Mobile.MainMenu', {
	extend: 'Ext.Panel',
	xtype: 'mainMenu',
	config: {
		layout: 'fit',
		items: [{
			xtype: 'container',
			layout: 'vbox',
			cls: 'home-background',
			defaults: {
				flex: 1
			},
			scrollable: true,
			items: [
				{
					xtype: 'container',
					layout: 'hbox',
					defaults: {
						flex: 1,
						cls: 'home-button',
						iconAlign: 'top',
						xtype: 'button',
						ui: 'home-btn',
						labelCls: 'font-size'
					},
					items: [{
						iconCls: 'visit-icon menu-icon-size',
						itemId: 'visit',
						text: 'VISIT'
					},
					{
						iconCls: 'alert-icon menu-icon-size',
						itemId: 'alert',
						text: 'ALERTS'
					}]
				},
				 {
				 	xtype: 'container',
				 	layout: 'hbox',
				 	defaults: {
				 		flex: 1,
				 		cls: 'home-button',
				 		iconAlign: 'top',
				 		xtype: 'button',
				 		ui: 'home-btn',
				 		labelCls: 'font-size'
				 	},
				 	items: [{
				 		iconCls: 'objective-icon menu-icon-size',
				 		text: 'OBJECTIVES',
				 		itemId: 'objective'
				 	},
					{
						iconCls: 'todo-icon menu-icon-size',
						itemId: 'toDoList',
						text: 'TO DO'
					}]
				 },
				 {
				 	xtype: 'container',
				 	layout: 'hbox',
				 	defaults: {
				 		flex: 1,
				 		cls: 'home-button',
				 		iconAlign: 'top',
				 		xtype: 'button',
				 		ui: 'home-btn',
				 		labelCls: 'font-size'
				 	},
				 	items: [
					{
						iconCls: 'customer-icon menu-icon-size',
						itemId: 'customer',
						text: 'CUSTOMER'
					},
					{
						iconCls: 'cooler-icon menu-icon-size',
						text: 'COOLERS',
						itemId: 'assets'
					}]
				 }]
		}]
	}
});