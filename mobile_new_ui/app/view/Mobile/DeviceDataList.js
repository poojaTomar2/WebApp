Ext.define('CoolerIoTMobile.view.Mobile.DeviceDataList', {
	extend: 'Ext.dataview.List',
	xtype: 'deviceDataList',
	config: {		
		emptyText: CoolerIoTMobile.Localization.DeviceDataListEmptytext,
		store: 'DeviceData',		
		striped: true,
		pinHeaders: false,
		disableSelection: true,
		itemTpl: CoolerIoTMobile.Templates.DeviceDataList
	}
});