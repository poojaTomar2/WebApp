Cooler.RetailerReport = Ext.extend(Cooler.Form, {

	controller: 'RetailerReport',

	keyColumn: 'ConsumerLoyaltyPointId',

	title: 'Retailer Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'RetailerReport',
	constructor: function (config) {
		Cooler.RetailerReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'ASC', sort: 'ConsumerId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 150 },
			{ header: 'Retailer Id', type: 'string', dataIndex: 'UserName', width: 150 },
            { header: 'Asset Serial', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Type', dataIndex: 'AssetType', type: 'string' },
			{ header: 'Street', dataIndex: 'Street', type: 'string' },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 150, align: 'right' },
			{ header: 'State', type: 'string', dataIndex: 'State', width: 100 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 100 },
			{ header: 'Postal Code', type: 'string', dataIndex: 'PostalCode' },
			{ header: 'CoolerIot Client', type: 'string', dataIndex: 'Client' },
			{ header: 'Channel', type: 'string', dataIndex: 'Channel' },
			{ header: 'Classification', type: 'string', dataIndex: 'Classification' },
			{ header: 'Responsible BD', type: 'string', dataIndex: 'PSR' },
			{ header: 'Reason', type: 'string', dataIndex: 'Reason' },
			{ header: 'Notes', type: 'string', dataIndex: 'Note' },
			{ header: 'Points', dataIndex: 'Points', align: 'right', type: 'int' },
            { header: 'Total Point At That Time', dataIndex: 'CumulativeSum', type: 'int', align: 'right' },
			{ header: 'Points Created On', type: 'date', dataIndex: 'CreatedOn', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Event Id', dataIndex: 'EventId', width: 150, type: 'int', align: 'right' },
			{ header: 'Event Time', type: 'date', dataIndex: 'EventTime', renderer: ExtHelper.renderer.DateTime, },
			{ header: 'Record Uploaded On', dataIndex: 'EventCreatedOn', type: 'date', renderer: ExtHelper.renderer.DateTime },
            { header: 'Month', dataIndex: 'PointMonth', align: 'right', type: 'int' },
			{ header: 'Day ', dataIndex: 'PointDay', align: 'right', type: 'int' },
			{ header: 'Day of Week', dataIndex: 'PointWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'PointWeek', align: 'right', type: 'int' }
		];
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerialNumber' });


		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });


		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

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
		var resetField = ['LocationName', 'AssetSerialNumber'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				this.grid.topToolbar.items.get(index).setValue('');
			}
		}
	}
});
Cooler.RetailerReport = new Cooler.RetailerReport({ uniqueId: 'RetailerReport' });