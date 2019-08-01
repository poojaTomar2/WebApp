Ext.define('CoolerIoTMobile.view.Mobile.DeviceDataResponseWindow', {
	extend: 'Ext.Panel',
	xtype: 'deviceDataResponseWindow',
	config: {
		centered: true,
		height: 80,
		width: 370,
		modal: true,
		hideOnMaskTap: true,
		scrollable: false,
		responseTitle: CoolerIoTMobile.Localization.ResponseData,
		listeners: {
			show: function (panel, eOpts) {

				var height = 0, defaultHeight = 80;
				var data = [];
				var store = Ext.getStore('DeviceData');
				store.each(function (record) {
					data.push(record.getData());
					height += 35;
				});
			}
		},
		hideAnimation: {
			type: 'popOut',
			duration: 200,
			easing: 'ease-out'
		},
		showAnimation: {
			type: 'popIn',
			duration: 200,
			easing: 'ease-out'
		},
		layout: 'fit',
		items: [
            {
            	xtype: 'titlebar',
            	itemId: 'deviceDataResponseTitlebar',
            	docked: 'top',
            	title: CoolerIoTMobile.Localization.ResponseData,
            	items: [
                    {
                    	iconMask: true, iconCls: 'delete', ui: 'plain', align: 'right',
                    	handler: function (button) {
                    		this.up('deviceDataResponseWindow').hide();
                    	}
                    }]
            },
            {
            	xtype: 'deviceDataList',
            	flex: 1
            }]
	}
});