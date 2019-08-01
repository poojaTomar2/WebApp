Ext.define('CoolerIoTMobile.view.Mobile.ScanningDevice', {
    extend: 'Ext.dataview.List',
    xtype: 'scanningDeviceList',
    config: {
    	title: CoolerIoTMobile.Localization.SearchTags,        
        emptyText: CoolerIoTMobile.Localization.CoolerDetailsListEmptyText,
        store: 'BleTag',        
        padding: 0,
        margin: 0,        
        itemTpl: CoolerIoTMobile.Templates.ScanningDeviceItem
    }   
});