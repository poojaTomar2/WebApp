Cooler.AlertReport = Ext.extend(Cooler.Form, {

	controller: 'AlertReport',

	title: 'Alert Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'AlertReport',

	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.AlertReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetId' } }
		});
	},
	comboTypes: [
	'Country',
	'SmartDeviceType',
	'AssetType'

	],
	comboStores: {
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'AssetId', type: 'int' },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', store: this.comboStores.AssetType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }), width: 130 },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Technical Identification Number', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet', type: 'string', dataIndex: 'OutletName', width: 150 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Street', type: 'string', dataIndex: 'Street', width: 150 },
			{ header: 'Street2', type: 'string', dataIndex: 'Street2', width: 150 },
			{ header: 'Street3', type: 'string', dataIndex: 'Street3', width: 150 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 150 },
			{ header: 'Country', dataIndex: 'CountryId', type: 'int', displayIndex: 'Country', store: this.comboStores.Country, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }), width: 130 },
			{ header: 'Sales Group Name', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Group Code', type: 'string', dataIndex: 'SalesGroupCode', width: 150, hidden: true },
			{ header: 'Sales Territory Name', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', type: 'string', dataIndex: 'SalesTerritoryCode', width: 150, hidden: true },
			{ header: 'Sales Office Name', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Office Code', type: 'string', dataIndex: 'SalesOfficeCode', width: 150, hidden: true },
			{ header: 'Sales Organization Name', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'Sales Organization Code', type: 'string', dataIndex: 'SalesOrganizationCode', width: 150, hidden: true },
			{ header: 'Temperature Alert', type: 'int', dataIndex: 'TemperatureAlertCount', width: 150, align: 'right' },
			{ header: 'Regulation Probe Alert', type: 'int', dataIndex: 'RegulationProbeAlertCount', width: 150, align: 'right' },
			{ header: 'Door Malfunction Alert', type: 'int', dataIndex: 'DoorMalfunctionAlertCount', width: 150, align: 'right' }
		];
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},

	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.startDateField = new Ext.form.DateField({
			name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
		});
		this.endDateField = new Ext.form.DateField({
			name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
		});
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {

				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
				var sDateTime = this.startDateField.getValue();
				var eDateTime = this.endDateField.getValue();
				if (sDateTime != '' && eDateTime != '') {
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
				}
				this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
				if (!isGridFilterApply) {
					if (!this.startDateField.getValue()) {
						if (this.endDateField.getValue()) {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(this.endDateField.getValue(), -6));
						}
						else {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
						}
					}
					if (!this.endDateField.getValue()) {
						this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
					}
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
				else {
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.grid.loadFirst();
			}, scope: this
		});
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				}
				else if (resetField[i] == 'endDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date()));
				}
				else {
					this.grid.topToolbar.items.get(index).setValue('');
				}
			}
		}
	}
});
Cooler.AlertReport = new Cooler.AlertReport({ uniqueId: 'AlertReport' });