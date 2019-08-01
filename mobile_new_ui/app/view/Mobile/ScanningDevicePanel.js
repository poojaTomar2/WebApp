Ext.define('CoolerIoTMobile.view.Mobile.ScanningDevicePanel', {
    extend: 'Ext.Panel',
    xtype: 'scanningDevicePanel',
    config: {        
        centered: true,
        height: '98%',
        width: '85%',
        modal: true,
        hideOnMaskTap: true,
        scrollable: false,
        listeners: {
            stopscan: function (obj) {                
                var button = Ext.ComponentQuery.query('scanningDevicePanel titlebar button#scaningWindowScanButton')[0];
                button.setIconCls(null);
                button.setText(CoolerIoTMobile.Localization.StartText);
            },
            startscan: function (obj) {            	
                var button = Ext.ComponentQuery.query('scanningDevicePanel titlebar button#scaningWindowScanButton')[0];
                button.setIconCls('location-list-image loading');
                button.setText(CoolerIoTMobile.Localization.StopText);
                var bluetooth = Ext.ComponentQuery.query('#coolerIotDeviceActor')[0];
                bluetooth.fireEvent('initializeBluetooth');
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
                title: CoolerIoTMobile.Localization.ScaningDevice,
                docked: 'top',
                items: [                   
                    { iconMask: true, text: CoolerIoTMobile.Localization.StopText, iconCls: 'location-list-image loading', ui: 'plain', itemId: 'scaningWindowScanButton' },
                    { iconMask: true, iconCls: 'delete', ui: 'plain', align: 'right', itemId: 'scaningWindowCloseButton' }]
            },
            {               
               xtype: 'scanningDeviceList',
               flex: 1
		}]    	
    }   
});