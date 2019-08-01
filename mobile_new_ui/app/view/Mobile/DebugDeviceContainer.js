Ext.define('CoolerIoTMobile.view.Mobile.DebugDeviceContainer', {
	extend: 'Ext.Container',
	xtype: 'debugDeviceContainer',
	config: {
		layout: 'hbox',
		title: CoolerIoTMobile.Localization.SmartCoolerTitle,
		items: [
			{
				flex: Ext.os.is.phone ? 0.7 : 1.4,
				xtype: 'debugDevicePanel'
			},
			 {
			 	xtype: 'container',
			 	top: 0,
			 	right: 0,
			 	modal: true,
			 	hideOnMaskTap: true,
			 	hidden: true,
			 	listeners: {
			 		hide: function (container) {
			 			var store = this.down('commandsNavigation').getStore();
			 			store.clearFilter();
			 			this.down('commandsNavigation').deselectAll();
			 		},
			 		painted: function (container) {
			 			var store = this.down('commandsNavigation').getStore();
			 			store.clearFilter();
			 			store.filter('parentId', 0);
			 			var containerData = CoolerIoTMobile.app.getController('BlueToothLeDeviceActor').getDebugDevicePanel().down('#deviceDataList').getData();
			 			if (containerData == null || !containerData.IsSmartVision) {
			 				store.filter('isSmartVision', false);
			 			}
			 		}
			 	},
			 	width: Ext.os.is.phone ? '65%' : '30%',
			 	height: '100%',
			 	layout: {
			 		type: 'fit'
			 	},
			 	showAnimation: {
			 		type: "slide",
			 		direction: "left"
			 	},

			 	hideAnimation: {
			 		type: "slideOut",
			 		direction: "right"
			 	},
			 	itemId: 'debugSlideContainer',
			 	items: [
				{
					xtype: 'commandsNavigation',
					hideOnMaskTap: true,
					model: true,
					itemId: 'debuggCommandsNavigation'
				}
			 	]

			 }
		]
	}
});




