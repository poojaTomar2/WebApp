Cooler.SolarDoorOpening = Ext.extend(Cooler.Form, {

	controller: 'SolarDoorOpening',

	keyColumn: 'SmartDeviceDoorStatusId',

	title: 'Solar Door Opening',

	disableAdd: true,
	securityModule: 'SolarDoorOpeningReport',
	disableDelete: true,

	constructor: function (config) {
		Cooler.SolarDoorOpening.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'AssetId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'TimeZoneId', type: 'int' },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical Id', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
			{ header: 'CoolerIot Client', type: 'string', dataIndex: 'ClientName', width: 150 },
            { header: 'Outlet Code', dataIndex: 'OutletCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', dataIndex: 'LocationName', type: 'string' },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDeviceSerial', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Device Installed On', type: 'date', dataIndex: 'AssetAssociatedOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Solar Days', type: 'int', dataIndex: 'SolarDay', align: 'right', width: 100 },
			{ header: 'Active Days', type: 'int', dataIndex: 'ActiveDays', align: 'right', width: 100 },
			{ header: 'Total Opening', type: 'int', dataIndex: 'TotalOpening', align: 'right', width: 100 },
			{ header: 'Average Opening per Solar day', type: 'float', dataIndex: 'AvgDoorOpening', align: 'right', width: 100, renderer: ExtHelper.renderer.Float(2) },
			{ header: '# of doors', type: 'float', dataIndex: 'DoorNumber', align: 'right', width: 100, renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Breakeven Threshold', type: 'float', dataIndex: 'BreakevenThreshold', align: 'right', width: 100, renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Breakeven Achievement (delta)', type: 'float', dataIndex: 'BrakeEvenAchivement', align: 'right', width: 100, renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Breakeven Achievement %', type: 'int', dataIndex: 'BrakeEvenAchivementPercentage', align: 'right', width: 100 },
			//{ header: 'Sales Territory', dataIndex: 'SalesTerritory', width: 120, type: 'string' },
			{ header: 'City', dataIndex: 'City', width: 130, type: 'string' },
			{ header: 'State', dataIndex: 'State', width: 130, type: 'string' },
			{ header: 'Country', dataIndex: 'Country', width: 130, type: 'string' },
			{ header: 'Trade Channel', dataIndex: 'LocationType', width: 120, type: 'string' },
            { header: 'Trade Channel Code', hidden: true, type: 'string', dataIndex: 'TradeChannelCode', width: 100, hidden: true },
			{ header: 'Customer Tier', dataIndex: 'CustomerTier', width: 120, type: 'string' },
            { header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
            { header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 150, type: 'string' },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
            { header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
            { header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
            { header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode', width: 150 },
			{ header: 'TimeZone', dataIndex: 'TimeZone', width: 130, type: 'string' }
		];
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'OutletCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerialNumber' });

		var daysStore = [[7, 'Last 7 Days'], [14, 'Last 14 Days'], [30, 'Last 30 Days'], [60, 'Last 60 Days'], [90, 'Last 90 Days'], [120, 'Last 120 Days']];
		var daysCombo = DA.combo.create({ fieldLabel: 'Record Days  ', value: 7, hiddenName: 'RecordDays', store: daysStore, width: 130 });
		this.daysCombo = daysCombo;
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });


		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		//tbarItems.push('Days');
		//tbarItems.push(this.daysCombo);


		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Location Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);

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
					else {
						if (this.dateDifferanceInDays(sDateTime, eDateTime) > 92) {
							Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
							return;
						}
					}
				}

				if (!Ext.isEmpty(this.locationCodeTextField.getValue())) {
					isGridFilterApply = true;
					var locationCodeFilter = this.grid.gridFilter.getFilter('OutletCode');
					locationCodeFilter.active = true;
					locationCodeFilter.setValue(this.locationCodeTextField.getValue());
				}

				if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
					isGridFilterApply = true;
					var locationNameFilter = this.grid.gridFilter.getFilter('LocationName');
					locationNameFilter.active = true;
					locationNameFilter.setValue(this.locationNameTextField.getValue());
				}
				if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
					isGridFilterApply = true;
					var assetSerialFilter = this.grid.gridFilter.getFilter('AssetSerialNumber');
					assetSerialFilter.active = true;
					assetSerialFilter.setValue(this.assetSerialTextField.getValue());
				}
				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
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
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
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
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
				this.grid.loadFirst();
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	beforeRemoveFilter: function () {
		var resetField = ['LocationCode', 'LocationName', 'AssetSerial'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				this.grid.topToolbar.items.get(index).setValue('');
			}
		}
	}
});
Cooler.SolarDoorOpening = new Cooler.SolarDoorOpening({ uniqueId: 'SolarDoorOpening' });