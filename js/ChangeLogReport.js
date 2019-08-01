Cooler.ChangeLogReport = Ext.extend(Cooler.Form, {

	controller: 'ChangeLogReport',

	keyColumn: 'ModId',

	title: 'Role Change Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'ChangeLogReport',
	constructor: function (config) {
		Cooler.ChangeLogReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'ModId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},

	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'ModId' },
			{ header: 'Role', dataIndex: 'Name', width: 120, type: 'string' },
			{ header: 'Column Name', type: 'string', dataIndex: 'ColumnName', width: 150 },
			{ header: 'Module Name', type: 'string', dataIndex: 'DisplayName', width: 200 },
			{ header: 'Old Value', dataIndex: 'OldValue', type: 'string', width: 200 },
			{ header: 'New Value', dataIndex: 'NewValue', type: 'string', width: 200 },
			{ header: 'Modified By', dataIndex: 'Username', type: 'string', width: 200 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 200, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone }
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
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
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
					else {
						if (this.dateDifferanceInDays(sDateTime, eDateTime) > 92) {
							Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
							return;
						}
					}
				}
				if (!isGridFilterApply) {
					//this.grid.baseParams.limit = this.grid.pageSize;
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
				}
				else {

					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});
		tbarItems.push(this.searchButton);
		//tbarItems.push(this.removeSearchButton);
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
Cooler.ChangeLogReport = new Cooler.ChangeLogReport({ uniqueId: 'ChangeLogReport' });