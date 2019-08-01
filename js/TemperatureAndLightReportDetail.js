Cooler.TemperatureAndLightReportDetailForm = Ext.extend(Cooler.Form, {

	controller: 'TemperatureAndLightReportDetail',

	keyColumn: 'SmartDeviceHealthRecordId',

	title: 'Temperature And Light Detail',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'TemperatureAndLightReport',
	constructor: function (config) {
		Cooler.TemperatureAndLightReportDetailForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceHealthRecordId' } }
		});
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceHealthRecordId' },
			{ type: 'int', dataIndex: 'AssetId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'Date', type: 'date', dataIndex: 'EventTime', width: 150, renderer: ExtHelper.renderer.Date },
			{ header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150 },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
            { header: 'Total Light On (hrs)', type: 'string', dataIndex: 'LightOn', width: 100, sortable: false },
			{ header: 'Total Light Off (hrs)', type: 'string', dataIndex: 'LightOff', width: 100, sortable: false },
            //{ header: 'Total Full Brightness (hrs)', type: 'string', dataIndex: 'FullLightBrightness', width: 100, sortable: false },
			//{ header: 'Total Medium Brightness (hrs)', type: 'string', dataIndex: 'MediumBrightness', width: 100, sortable: false },
			//{ header: 'Total Low Brightness (hrs)', type: 'string', dataIndex: 'LowBrightness', width: 100, sortable: false },
			//{ header: 'Total No Light (hrs)', type: 'string', dataIndex: 'NoLight', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (<3)', type: 'string', dataIndex: 'LessThen3', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>3, <8)', type: 'string', dataIndex: 'GreaterThen3', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>8, <10)', type: 'string', dataIndex: 'GreaterThen8', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>10, <12)', type: 'string', dataIndex: 'GreaterThen10', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>12)', type: 'string', dataIndex: 'GreaterThen12', width: 100, sortable: false },
			{ header: 'Total Data For date', type: 'string', dataIndex: 'TotalHealthInterval', width: 100, align: 'right', sortable: false }
		];
	}
});
Cooler.TemperatureAndLightReportDetail = new Cooler.TemperatureAndLightReportDetailForm({ uniqueId: 'TemperatureAndLightReportDetail' });