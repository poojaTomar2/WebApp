Cooler.DashboardLogin = Ext.extend(Cooler.Form, {

	controller: 'DashboardLogin',

	title: 'DashBoard Login',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'DashboardLogin',

	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.DashboardLogin.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'LoginActivityId' } }
		});
	},
	comboTypes: [
		'Client',
		'Country'
	],
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'DateFormatId' },
			{ dataIndex: 'LoginActivityId', type: 'int' },
			{ header: 'User Name', type: 'string', dataIndex: 'UserName', width: 150 },
			{ header: 'Role', type: 'string', dataIndex: 'Role', width: 150 },
			{ header: 'Login DateTime', dataIndex: 'LoginDateTime', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Login Date (Only Date)', dataIndex: 'LoginDate', type: 'date', width: 150, renderer: Cooler.renderer.MonthDateYear },
			{ header: 'Login Time (Only Time)', dataIndex: 'LoginTime', type: 'string', width: 150 },
			{ header: 'Client', dataIndex: 'ClientName', type: 'string', width: 150 }
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
Cooler.DashboardLogin = new Cooler.DashboardLogin({ uniqueId: 'DashboardLogin' });