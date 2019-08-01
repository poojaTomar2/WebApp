Cooler.DevicesWithRemovedAssociationReportForm = Ext.extend(Cooler.Form, {

	controller: 'DevicesWithRemovedAssociationReport',

	keyColumn: 'ModifiedOn',

	title: 'Devices With Removed Association',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'DevicesWithRemovedAssociationReport',
	constructor: function (config) {
		Cooler.DevicesWithRemovedAssociationReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceId' } }
		});
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceId' },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'DeviceSerialNumber', width: 120, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 120 },
			{ header: 'Association Type', type: 'string', dataIndex: 'AssociationType', width: 120 },
            { header: 'New Asset Serial Number', type: 'string', dataIndex: 'NewAssetSerialNumber', width: 120, hyperlinkAsDoubleClick: true },
            { header: 'Old Asset Serial Number', type: 'string', dataIndex: 'OldAssetSerialNumber', width: 120, hyperlinkAsDoubleClick: true },
			{ header: 'Old Asset Associated On', type: 'string', dataIndex: 'OldValue', width: 145, menuDisabled: true, quickFilter: false }, //, renderer: ExtHelper.renderer.DateTime },
			{ header: 'New Asset Associated On', type: 'string', dataIndex: 'NewValue', width: 145, menuDisabled: true, quickFilter: false }, // renderer: ExtHelper.renderer.DateTime },
			{ header: 'New Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 120 },
			{ header: 'Old Asset Technical ID', type: 'string', dataIndex: 'OldTechnicalIdentificationNumber', width: 120 },
			{ header: 'New Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 130 },
			{ header: 'Old Asset Equipment Number', type: 'string', dataIndex: 'OldEquipmentNumber', width: 130 },
			{ header: 'New Asset Type', type: 'string', dataIndex: 'AssetType', width: 130 },
			{ header: 'Old Asset Type', type: 'string', dataIndex: 'OldAssetType', width: 130 },
            { header: 'New Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Old Outlet Code', type: 'string', dataIndex: 'OldOutletCode', width: 110 },
			{ header: 'New Outlet Name', type: 'string', dataIndex: 'Outlet', width: 130 },
			{ header: 'Old Outlet Name', type: 'string', dataIndex: 'Old Outlet', width: 130 },
			{ header: 'New Country', type: 'string', dataIndex: 'Country', width: 130 },
			{ header: 'Old Country', type: 'string', dataIndex: 'OldCountry', width: 130 },
			{ header: 'Client', type: 'string', dataIndex: 'ClientName', width: 110 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
            { header: 'Trade Channel', dataIndex: 'Channel', type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', type: 'string' },
            { header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' },
            { header: 'Sales Organization', dataIndex: 'SalesOrganizationName', width: 150, type: 'string' },
            { header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', dataIndex: 'SalesOfficeName', width: 150, type: 'string' },
            { header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', dataIndex: 'SalesGroupName', width: 150, type: 'string' },
            { header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', dataIndex: 'SalesTerritoryName', width: 150, type: 'string' },
			{ header: 'Sales Territory Code', hidden: true, dataIndex: 'SalesTerritoryCode', width: 150, type: 'string' }
		];
	},
	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
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
				//this.clientCombo.reset();
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
Cooler.DevicesWithRemovedAssociationReport = new Cooler.DevicesWithRemovedAssociationReportForm({ uniqueId: 'DevicesWithRemovedAssociationReport' });