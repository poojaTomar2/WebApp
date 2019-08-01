Cooler.DoorSummaryReportDetailForm = Ext.extend(Cooler.Form, {

	controller: 'DoorSummaryReportDetail',

	keyColumn: 'SmartDeviceDoorStatusId',

	title: 'Door Summary Detail',
	securityModule: 'DoorSummaryReport',
	disableAdd: true,

	disableDelete: true,

	constructor: function (config) {
		Cooler.DoorSummaryReportDetailForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceDoorStatusId' } }
		});
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceDoorStatusId' },
			{ type: 'int', dataIndex: 'AssetId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'Data', type: 'date', dataIndex: 'EventTime', width: 150, renderer: ExtHelper.renderer.Date },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Door Count For The date', type: 'int', dataIndex: 'DoorCount', width: 100, align: 'right' }
		];
	}
});
Cooler.DoorSummaryReportDetail = new Cooler.DoorSummaryReportDetailForm({ uniqueId: 'DoorSummaryReportDetail' });