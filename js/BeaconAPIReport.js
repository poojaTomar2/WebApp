Cooler.BeaconAPIReport = Ext.extend(Cooler.Form, {

	controller: 'BeaconAPIReport',

	keyColumn: 'AssetId',

	title: 'Beacon API Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'BeaconAPIReport',
	constructor: function (config) {
		Cooler.BeaconAPIReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},

	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'AssetId' },
			{ header: 'Device Type', dataIndex: 'SmartDeviceType', width: 120, type: 'string' },
            { header: 'Serial Number', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'IBeacon Uuid', type: 'string', dataIndex: 'IBeaconUuid', width: 200 },
			{ header: 'IBeacon Major', dataIndex: 'IBeaconMajor', type: 'string', width: 200 },
			{ header: 'IBeacon Minor', dataIndex: 'IBeaconMinor', type: 'string', width: 200 },
			{ header: 'Eddystone Instance', dataIndex: 'EddystoneNameSpace', type: 'string', width: 200 },
			{ header: 'Eddystone Namespace', dataIndex: 'EddystoneUid', type: 'string', width: 200 },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 200 },
			{ header: 'Technical ID', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 200 },
            { header: 'Linked with Asset', dataIndex: 'SerialNumber', type: 'string', width: 200, hyperlinkAsDoubleClick: true },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 200 },
			{ header: 'CoolerIot Client', dataIndex: 'ClientName', type: 'string', width: 200 },
			{ header: 'CCH Solution', dataIndex: 'CCHSolution', type: 'string', width: 200 },
			{ header: 'Password', dataIndex: 'Password', type: 'string', width: 200, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Mac Address', dataIndex: 'MacAddress', type: 'string', width: 200 }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}

});
Cooler.BeaconAPIReport = new Cooler.BeaconAPIReport({ uniqueId: 'BeaconAPIReport' });