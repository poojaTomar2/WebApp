Cooler.SmartDeviceEventSQLLog = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		Cooler.SmartDeviceEventLog.superclass.constructor.call(this, config || {});
		Ext.applyIf(this.gridConfig, {
			defaults: {}
		});
		Ext.applyIf(this.gridConfig.defaults, {
			sort: { dir: 'DESC', sort: this.keyColumn }
		});
	},
	securityModule: 'Logs',
	disableAdd: true,
	onGridCreated: function (grid) {
		grid.on("cellclick", this.cellclick, this);
	},
	cellclick: function (grid, rowIndex, e, options) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e]
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		switch (column.dataIndex) {
			// Commented as per the ticket #752
			/* case 'SerialNumber':
				Cooler.Asset.ShowForm(rec.get('AssetId'));
				break;*/
			case 'MacAddress':
				Cooler.SmartDevice.ShowForm(rec.get('SmartDeviceId'));
				break;
			case 'Location':
				Cooler.LocationType.Location.ShowForm(rec.get('LocationId'));
				break;
		}
	},
	assetLocationColumns: [
        { dataIndex: 'AssetSerialNumber', type: 'string', header: 'Asset Serial #', width: 120, sortable: false, hyperlinkAsDoubleClick: true }, // hyperlinkAsDoubleClick: true Commented as per the ticket #752
		{ dataIndex: 'MacAddress', header: 'Smart Device Mac', width: 120, type: 'string', hyperlinkAsDoubleClick: true, sortable: false },
        { dataIndex: 'SerialNumber', header: 'Smart Device#', width: 120, type: 'string', sortable: false, hyperlinkAsDoubleClick: true },
		{ dataIndex: 'LocationId', type: 'int' },
		{ dataIndex: 'SmartDeviceTypeName', header: 'Smart Device Type', width: 120, type: 'string', sortable: false },
		{ dataIndex: 'Location', type: 'string', header: 'Outlet', width: 160, hyperlinkAsDoubleClick: true, elasticDataIndex: 'LocationName', sortable: false },
        { dataIndex: 'LocationCode', type: 'string', header: 'Outlet Code', width: 160, sortable: false, hyperlinkAsDoubleClick: true },
		{ dataIndex: 'LocationCity', type: 'string', header: 'Outlet City', width: 160, hidden: true, elasticDataIndex: 'City' },
		{ dataIndex: 'State', type: 'string', header: 'Outlet State', hidden: true },
		{ dataIndex: 'LocationPostalCode', type: 'string', header: 'Outlet Postal', hidden: true, elasticDataIndex: 'PostalCode' },
		{ dataIndex: 'Country', type: 'string', header: 'Outlet Country', hidden: true },
		{ dataIndex: 'CountryId', type: 'int' },
		{ dataIndex: 'AssetId', type: 'int' },
		{ dataIndex: 'SmartDeviceId', type: 'int' },
		{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', elasticDataIndex: 'Client', sortable: false },
		{ header: 'Time Zone', dataIndex: 'TimeZoneId', displayIndex: 'DisplayValue', type: 'int', store: Cooler.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: Cooler.comboStores.TimeZone }), width: 300 }
	],
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;

		var tbarItems = [];

		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });

		this.smartDeviceSerialTextField = new Ext.form.TextField({ width: 100 });
		this.smartDeviceMacTextField = new Ext.form.TextField({ width: 100 });
		this.gateWayMacTextField = new Ext.form.TextField({ width: 100 });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100 });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100 });
		this.locationNameTextField = new Ext.form.TextField({ width: 100 });

		if (DA.Security.info.Tags.ClientId == 0) {
			tbarItems.push('Client ');
			tbarItems.push(this.clientCombo);
		}

		tbarItems.push('Smart Device Serial#');
		tbarItems.push(this.smartDeviceSerialTextField);

		tbarItems.push('Smart Device Mac');
		tbarItems.push(this.smartDeviceMacTextField);

		tbarItems.push('GateWay Mac');
		tbarItems.push(this.gateWayMacTextField);

		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Outlet Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Outlet Name');
		tbarItems.push(this.locationNameTextField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {

				delete this.grid.getStore().baseParams.ClientId;
				delete this.grid.getStore().baseParams.SerialNumber;
				delete this.grid.getStore().baseParams.MacAddress;
				delete this.grid.getStore().baseParams.GatewayMac;
				delete this.grid.getStore().baseParams.AssetSerial;
				delete this.grid.getStore().baseParams.LocationCode;
				delete this.grid.getStore().baseParams.LocationName;


				if (!Ext.isEmpty(this.clientCombo.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { ClientId: this.clientCombo.getValue() });
				}

				if (!Ext.isEmpty(this.smartDeviceSerialTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { SerialNumber: this.smartDeviceSerialTextField.getValue() });
				}

				if (!Ext.isEmpty(this.smartDeviceMacTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { MacAddress: this.smartDeviceMacTextField.getValue() });
				}

				if (!Ext.isEmpty(this.gateWayMacTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { GatewayMac: this.gateWayMacTextField.getValue() });
				}

				if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { AssetSerial: this.assetSerialTextField.getValue() });
				}

				if (!Ext.isEmpty(this.locationCodeTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { LocationCode: this.locationCodeTextField.getValue() });
				}

				if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { LocationName: this.locationNameTextField.getValue() });
				}

				this.grid.loadFirst();
			}, scope: this
		});


		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {

				delete this.grid.getStore().baseParams.ClientId;
				delete this.grid.getStore().baseParams.SerialNumber;
				delete this.grid.getStore().baseParams.MacAddress;
				delete this.grid.getStore().baseParams.GatewayMac;
				delete this.grid.getStore().baseParams.AssetSerial;
				delete this.grid.getStore().baseParams.LocationCode;
				delete this.grid.getStore().baseParams.LocationName;

				this.clientCombo.reset();
				this.smartDeviceSerialTextField.reset();
				this.smartDeviceMacTextField.reset();
				this.gateWayMacTextField.reset();
				this.assetSerialTextField.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();

				this.grid.loadFirst();
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);

		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	addEventColumns: function (columns, options) {
		options = options || {};
		if (this.title != 'AssetPurityReadOnly') {
			columns.push(
				{ header: 'Event Id', dataIndex: options.eventId || 'EventId', width: 70, type: 'int', align: 'right' },
				{ header: 'Created On', dataIndex: 'CreatedOn', width: 180, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer }
			);
		}
		if (options.eventTime !== false && this.title != 'AssetPurityReadOnly') {
			columns.push({ header: 'Event Time', dataIndex: 'EventTime', width: 180, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, type: 'date' });
		}
		columns.push(
			{ header: 'Gateway Mac', dataIndex: 'GatewayMacAddress', type: 'string', width: 110, elasticDataIndex: 'GatewayMac' },
			{ header: 'Gateway#', dataIndex: 'GatewaySerialNumber', type: 'string', width: 110 }
		);
		return columns.concat(this.assetLocationColumns);
	}
});