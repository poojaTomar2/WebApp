Cooler.LoginHistory = new Cooler.Form({
	controller: 'Token',

	keyColumn: 'TokenId',

	title: 'Login History',

	disableAdd: true,

	securityModule: 'LoginHistory',

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'CreatedOn' } }
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'TokenId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Consumer Name', dataIndex: 'Username', type: 'string', width: 100 },
			{ header: 'User Role', dataIndex: 'Role', type: 'string', width: 100 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string' },
			{ header: 'Application Name', dataIndex: 'AppName', type: 'string', width: 100 },
			{ header: 'Login', dataIndex: 'CreatedOn', type: 'date', width: 100, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Last Used', dataIndex: 'LastUsed', width: 100, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Expiry / Logout', dataIndex: 'Expiry', type: 'date', width: 100, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Is Logged Out?', dataIndex: 'IsLoggedOut', type: 'bool', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Ip Address', dataIndex: 'IpAddress', type: 'string', hidden: true },
			{ header: 'User Agent', dataIndex: 'UserAgent', width: 100, type: 'string' },
			{ header: 'App Info', dataIndex: 'AppInfo', width: 100, type: 'string' },
			{ header: 'App Identifier', dataIndex: 'Appidentifier', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'DeviceOSVersion', dataIndex: 'OSVersion', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'App Name', dataIndex: 'AppNameRendered', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Device Model', dataIndex: 'DeviceModel', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'App Version Code', dataIndex: 'AppVersionCode', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
            { header: 'Latitude', dataIndex: 'Latitude', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
            { header: 'Longitude', dataIndex: 'Longitude', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
            { header: 'Wifi Mac Address', dataIndex: 'WifiMacAddress', width: 150, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
            { header: 'Device Manufacturer', dataIndex: 'DeviceManufacturer', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			//{ header: 'Device Manufacturer', dataIndex: '', width: 100, type: 'string', renderer: this.appRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Month (login)', dataIndex: 'LoginMonth', type: 'int', align: 'right' },
			{ header: 'Day (login) ', dataIndex: 'LoginDay', type: 'int', align: 'right' },
			{ header: 'Day of the Week (login)', dataIndex: 'LoginWeekDay', type: 'string' },
			{ header: 'Week of the Year (login)', dataIndex: 'LoginWeek', type: 'int', align: 'right' },
			{ header: 'Time Zone (login)', dataIndex: 'HourInDay', type: 'int', align: 'right' }
		];
	},

	appRenderer: function (v, m, r) {
		if (r.data.AppInfo === "") {
			return "";
		}
		else {
			try {
				var record = Ext.decode(r.data.AppInfo);
				if (typeof (record) === "object") {
					if (m.id == 11) {
						return record.AppIdentifier;
					}
					else if (m.id == 12) {
						return record.AppVersion;
					}
					else if (m.id == 13) {
						return record.DeviceOSVersion != null ? record.DeviceOSVersion : record.OSVersion;
					}
					else if (m.id == 14) {
						return record.AppName;
					}
					else if (m.id == 15) {
						return record.DeviceModel;
					}
					else if (m.id == 16) {
						return record.AppVersionCode;
					}
					else if (m.id == 17) {
						return record.Latitude;
					}
					else if (m.id == 18) {
						return record.Longitude;
					}
					else if (m.id == 19) {
						return record.WifiMacAddress;
					}
					else if (m.id == 20) {
						return record.DeviceManufacturer;
					}
				}
			}
			catch (e) {
				return "";
			}
		}
	},
	afterShowList: function (config) {
		Cooler.DateRangeFilter(this, 'CreatedOn', false);
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
				var sDateTime = this.startDateField.getValue();
				var eDateTime = this.endDateField.getValue();
				if (sDateTime != '' && eDateTime != '') {
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
				}
				var isGridFilterApply = false;
				if (!isGridFilterApply) {
					this.grid.baseParams.limit = this.grid.pageSize;
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
					var isValidDate = Cooler.DateRangeFilter(this, 'CreatedOn', true);
					if (!isValidDate) {
						return;
					}
				}
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.grid.loadFirst();
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});