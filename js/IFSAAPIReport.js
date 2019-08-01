Cooler.IFSAAPIReport = Ext.extend(Cooler.Form, {

	controller: 'IFSAAPIReport',

	keyColumn: 'SmartDeviceId',

	title: 'IFSA API Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'IFSAAPIReport',
	constructor: function (config) {
		Cooler.IFSAAPIReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'SmartDeviceId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},

	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'SmartDeviceId' },
			{ header: 'Asset Type', dataIndex: 'AssetType', width: 120, type: 'string' },
			{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
            { header: 'Serial Number', type: 'string', dataIndex: 'SerialNumber', width: 200, hyperlinkAsDoubleClick: true },
			{ header: 'Technical Identification Number ', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 200 },
			{ header: 'Outlet Name', dataIndex: 'OutletName', type: 'string', width: 200 },
            { header: 'Outlet Code', dataIndex: 'OutletCode', type: 'string', width: 200, hyperlinkAsDoubleClick: true },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 200 },
			{ header: 'Last30Day DoorAvg', dataIndex: 'Last30DayDoorAvg', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Last30Day ActiveDoorAvg', dataIndex: 'Last30DayActiveDoorAvg', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Last30Day TempAvg', dataIndex: 'Last30DayTempAvg', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Last Download Date', dataIndex: 'LastDownloadDate', width: 200, type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Traffic Light Last30Day DoorAvg', dataIndex: 'TrafficLightLast30DayDoorAvg', type: 'string', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Traffic Light Last30Day ActiveDoorAvg', dataIndex: 'TrafficLightLast30DayActiveDoorAvg', type: 'string', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Traffic Light Last30Day TempAvg', dataIndex: 'TrafficLightLast30DayTempAvg', type: 'string', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Traffic LightDays Since LastDownload', dataIndex: 'TrafficLightDaysSinceLastDownload', type: 'string', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Threshold Light Last30Day ActiveDoorAvg', dataIndex: 'ThresholdLightLast30DayActiveDoorAvg', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Threshold Last30Day ActiveDoorAvg', dataIndex: 'ThresholdLast30DayActiveDoorAvg', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Threshold Light Last30Day TempAvg', dataIndex: 'ThresholdLightLast30DayTempAvg', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Threshold LightDays Since LastDownload', dataIndex: 'ThresholdLightDaysSinceLastDownload', type: 'float', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'CoolerIot Client', dataIndex: 'ClientName', type: 'string', width: 200 }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}

});
Cooler.IFSAAPIReport = new Cooler.IFSAAPIReport({ uniqueId: 'IFSAAPIReport' });