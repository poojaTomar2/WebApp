Cooler.ReportForAlerts = Ext.extend(Cooler.Form, {

	controller: 'ReportForAlerts',

	title: 'Report For Alert',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'ReportForAlerts',

	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.ReportForAlerts.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AlertId' } }
		});
	},
	comboTypes: [
		'OutletType',
		'Client',
		'Country',
		'SmartDeviceType',
		'AlertStatus'
	],
	comboStores: {
		OutletType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
	},

	hybridConfig: function () {
		return [

			{ header: 'Outlet Name', type: 'string', dataIndex: 'OutletName', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', type: 'string', dataIndex: 'OutletType', width: 150 },
			{ header: 'Outlet City', type: 'string', dataIndex: 'OutletCity', width: 150 },
			{ header: 'Outlet Postal Code', type: 'string', dataIndex: 'OutletPostalCode', width: 150 },
			{ header: 'Outlet Country', type: 'string', dataIndex: 'OutletCountry', width: 150 },
			{ header: 'Outlet Latitude', dataIndex: 'OutletLatitude', width: 150, align: 'right', type: 'float', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Outlet Longitude', dataIndex: 'OutletLongitude', width: 150, align: 'right', type: 'float', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Asset Serial Number', dataIndex: 'AssetSerialNumber', type: 'string', width: 130, hyperlinkAsDoubleClick: true },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 130 },
			{ header: 'Asset Type', dataIndex: 'AssetType', type: 'string', width: 130 },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceType', type: 'string', width: 130 },
			{ header: 'Smart Device Serial Number', dataIndex: 'SmartDeviceSerialNumber', type: 'string', width: 130 },
			{ header: 'Firmware Version', dataIndex: 'FirmwareVersion', type: 'string', width: 130 },
			{ header: 'Alert Id', dataIndex: 'AlertId', type: 'int' },
			{ header: 'Alert Type', dataIndex: 'AlertType', type: 'string', width: 130 },
			{ header: 'Alert Name', dataIndex: 'AlertName', type: 'string', width: 130 },
			{ header: 'Alert At', dataIndex: 'AlertAt', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Status', dataIndex: 'StatusId', type: 'int', displayIndex: 'Status', store: this.comboStores.AlertStatus, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AlertStatus }) },
			{ header: 'Status Changed On', dataIndex: 'StatusChangedOn', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Age', dataIndex: 'AlertAt', displayIndex: 'AlertAgeFormatted', type: 'date', width: 100, sortable: false, renderer: function (v, m, r) { return r.data.AlertAgeFormatted; } },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 60, align: 'right', type: 'float', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 70, align: 'right', type: 'float', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Displacement(Meter)', dataIndex: 'Displacement', width: 120, type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Accuracy(Meter)', dataIndex: 'Accuracy', width: 120, type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'GPS Source', dataIndex: 'GPSSource', width: 120, type: 'string' },
			{ header: 'Power Status', dataIndex: 'PowerOnOff', width: 120, type: 'string' },
			{ dataIndex: 'AlertAgeFormatted', type: 'string' }
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
Cooler.ReportForAlerts = new Cooler.ReportForAlerts({ uniqueId: 'ReportForAlerts' });