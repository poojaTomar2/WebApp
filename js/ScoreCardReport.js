Cooler.ScoreCardReportForm = Ext.extend(Cooler.Form, {

	controller: 'ScoreCardReport',

	keyColumn: 'UserId',

	title: 'Score Card Report',

	disableAdd: true,
	securityModule: 'ScoreCardReport',
	disableDelete: true,

	constructor: function (config) {
		Cooler.ScoreCardReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'UserId' } },
			custom: {
				loadComboTypes: true
			}

		});
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'UserId' },
			//{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'User Role', type: 'string', dataIndex: 'UserRole', width: 150 },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritory', width: 150 },
			{ header: 'User name', type: 'string', dataIndex: 'Username', width: 150 },
			{ header: 'First Name', type: 'string', dataIndex: 'FirstName', width: 150 },
			{ header: 'Last Name', type: 'string', dataIndex: 'LastName', width: 150 },
			{ header: 'Total Asset For User', type: 'int', dataIndex: 'TotalAssetForUser', width: 150 },
			{ header: 'Associated Assets', type: 'string', dataIndex: 'AssociatedAssets', width: 150 },
			{ header: 'Last Installation Date', type: 'date', dataIndex: 'LastInstallationDate', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Day Since Last Install', type: 'int', dataIndex: 'DaySinceLastInstall', width: 150 },
			{ header: 'Install Percentage (%)', type: 'int', dataIndex: 'InstallPercentage', width: 110 },
			{ header: 'Day Since Account Creation', type: 'int', dataIndex: 'DaySinceAccountCreation', width: 170 },
			{ header: 'User Working Days', type: 'int', dataIndex: 'UserWorkingDays', width: 170 },
			{ header: 'Total Login Days', type: 'int', dataIndex: 'TotalLoginDays', width: 150 },
			{ header: 'Last Activity Date', type: 'date', dataIndex: 'LastActivityDate', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Days Since Last Login', type: 'int', dataIndex: 'DaysSinceLastLogin' },
			{ header: 'Average Login Per Day (%)', type: 'int', dataIndex: 'AverageLoginPerDay', width: 110 },
			{ header: 'Last Data Download Date', type: 'date', dataIndex: 'LastDataDownloadDate', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Data Downloaded Assets Total', type: 'int', dataIndex: 'DataDownloadedAssetsTotal'}
		];
	},



	afterShowList: function (config) {
		this.grid.baseParams.EndDate = this.startDateField.getValue();
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
				var sDateTime = this.startDateField.getValue();
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				debugger;
				this.grid.store.load();
				delete this.grid.getStore().baseParams['limit'];

			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.loadFirst();
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	beforeRemoveFilter: function () {
		var resetField = ['startDate'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				}
				else {
					this.grid.topToolbar.items.get(index).setValue('');
				}
			}
		}
	}
});
Cooler.ScoreCardReport = new Cooler.ScoreCardReportForm({ uniqueId: 'ScoreCardReport' });