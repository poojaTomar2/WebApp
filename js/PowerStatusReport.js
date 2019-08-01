Cooler.PowerStatusReport = Ext.extend(Cooler.Form, {

	controller: 'PowerStatusReport',

	keyColumn: 'AssetId',

	title: 'Power Status Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'PowerStatusReport',
	constructor: function (config) {
		Cooler.PowerStatusReport.superclass.constructor.call(this, config || {});
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
            { header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Outlet Name', type: 'string', dataIndex: 'OutletName', width: 150 },
            { header: 'Outlet Type', type: 'string', dataIndex: 'OutletType', width: 150 },
			{ header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Asset Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string' },
            { header: 'Asset Equipment Number', dataIndex: 'EquipmentNumber', type: 'string' },
            { header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Power Off Duration In Hours', dataIndex: 'PowerOffDurationInHours', type: 'int', width: 150 },
            { header: 'Power Off Duration In Minutes', dataIndex: 'PowerOffDurationInMinutes', type: 'int', width: 150 },
            { header: 'Power Off Duration In Seconds', dataIndex: 'PowerOffDurationInSeconds', type: 'int', width: 150 },
            { header: 'Power Status', dataIndex: 'IsPowerOn', type: 'string', width: 150 },
            { header: 'Number of Power Off Events', dataIndex: 'PowerOffCount', type: 'int', width: 150 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 150, align: 'right' },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 100 },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'TradeChannel', width: 150 },
            { header: 'Trade Channel Code', hidden: true, type: 'string', dataIndex: 'TradeChannelCode', width: 150 },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomTier', width: 150 },
			{ header: 'Customer Tier Code', hidden: true, type: 'string', dataIndex: 'CustomTierCode', width: 150 },
            { header: 'Sub Trade Channel', type: 'string', dataIndex: 'SubTradeChannel', width: 150 },
            { header: 'Sub Trade Channel Code', hidden: true, type: 'string', dataIndex: 'SubTradeChannelCode', width: 150 },
            { header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
            { header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
            { header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
            { header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode', width: 150 },
            { header: 'Client Name', type: 'string', dataIndex: 'ClientName', width: 150 }

		];
	},
	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
		//Cooler.DateRangeFilter(this, 'EventTime');
	},
	onClear: function () {
		this.startDateField.setValue();
		this.endDateField.setValue();
		var startDateFilter = this.grid.gridFilter.getFilter('EventTime');
		startDateFilter.setActive(false);
		this.grid.loadFirst();
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		//this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });

		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });


		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		if (DA.Security.info.Tags.ClientId == 0) {
			//	tbarItems.push('Client ');
			//	tbarItems.push(this.clientCombo);
		}

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
					//Cooler.DateRangeFilter(this, 'EventTime', true);
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
				//this.PowerStatusReport.setDisabled(true);
				//this.PowerStatusReport.store.removeAll()
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
		delete this.grid.baseParams['validationDate'];
	}
});
Cooler.PowerStatusReport = new Cooler.PowerStatusReport({ uniqueId: 'PowerStatusReport' });