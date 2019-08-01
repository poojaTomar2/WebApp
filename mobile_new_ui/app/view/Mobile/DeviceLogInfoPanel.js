Ext.define('CoolerIoTMobile.view.Mobile.DeviceLogInfoPanel', {
	extend: 'Ext.Panel',
	xtype: 'deviceLogInfoPanel',
	config: {
		centered: true,
		height: '98%',
		width: '85%',
		modal: true,
		hideOnMaskTap: true,
		scrollable: false,
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
            	title: CoolerIoTMobile.Localization.ScaningDevice,
            	docked: 'top',
            	title: CoolerIoTMobile.Localization.Logs,
            	items: [                   
                    { iconMask: true, iconCls: 'delete', ui: 'plain', align: 'right', itemId: 'deviceLogInfoPanelCloseButton' }]
            },
            {
            	xtype: 'list',
            	fullscreen: true,
            	itemTpl: '<div style="width:100%; display: flex;"><div style="float:left; width:33%">{EventTime}</div><div style="width:30%; margin-left: 3px;">{ServiceType}</div><div style="width:43%; overflow-wrap: break-word; float: right;">{Status}</div></div>',
            	store: 'DeviceLogs',
            	flex: 1
            }]
	}
});