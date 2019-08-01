Cooler.BatteryAnalysisReport = Ext.extend(Cooler.Form, {

	controller: 'BatteryAnalysisReport',

	keyColumn: 'SmartDeviceId',

	title: 'Battery Analysis Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'BatteryAnalysisReport',
	constructor: function (config) {
		Cooler.BatteryAnalysisReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
			{ header: 'Client', type: 'string', dataIndex: 'Client', width: 150 },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'Name', width: 150 },
			{ header: 'Asset Name', type: 'string', dataIndex: 'AssetName', width: 150 },
            { header: 'Smart Device Serial', type: 'string', dataIndex: 'SmartDeviceSerial', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Mac', dataIndex: 'MacAddress', type: 'string' },
			{ header: 'Smart Device FW Number', dataIndex: 'FirmwareVersion', type: 'string' },
			{ header: 'Battery level', type: 'int', dataIndex: 'BatteryLevel', width: 150, align: 'right' },
			{ header: 'Battery Status', type: 'string', dataIndex: 'BatteryStatus', width: 100 },
			{ header: 'Last Status Changed On', type: 'date', dataIndex: 'LastStatusChangedOn', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'First Health Event', type: 'date', dataIndex: 'FirstHealthEvent', align: 'right', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Last Health Event', type: 'date', dataIndex: 'LastHealthEvent', align: 'right', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Latest Installation Date', type: 'date', dataIndex: 'AssetAssociatedOn', align: 'right', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'First Door Event', type: 'date', dataIndex: 'FirstDoorEvent', align: 'right', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Last Door Event', type: 'date', dataIndex: 'LatestDoorEvent', align: 'right', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Latitude', type: 'float', dataIndex: 'Latitude', align: 'right', width: 100, renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', type: 'float', dataIndex: 'Longitude', align: 'right', width: 100, renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Last Data Upload From Mac', dataIndex: 'LastDataUploadFromMac', width: 130, type: 'string' },
			{ header: 'Last Data Upload From Serial#', dataIndex: 'LastDataUploadFromSerial', width: 130, type: 'string' },
			{ header: 'Last Data Upload Date', dataIndex: 'LastDatauploadDate', width: 150, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Excellent Health on', dataIndex: 'ExcellentHealthOn', width: 120, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
            { header: 'Medium Health on', type: 'date', dataIndex: 'GoodHealthOn', width: 100, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Fair Health on', dataIndex: 'FairHealthOn', width: 120, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
            { header: 'Poor Health on', dataIndex: 'PoorHealthOn', width: 120, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Street', dataIndex: 'Street', width: 120, type: 'string' },
            { header: 'City', dataIndex: 'City', width: 150, type: 'string' },
			{ header: 'State', type: 'string', dataIndex: 'State', width: 150 },
            { header: 'Country', dataIndex: 'Country', width: 150, type: 'string' }
		];
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.smartDeviceSerialTextField = new Ext.form.TextField({ width: 100, name: 'SmartDeviceSerial' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'Name' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetName' });


		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Smart Device Serial#');
		tbarItems.push(this.smartDeviceSerialTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
				if (!Ext.isEmpty(this.smartDeviceSerialTextField.getValue())) {
					isGridFilterApply = true;
					var smartDeviceSerialFilter = this.grid.gridFilter.getFilter('SmartDeviceSerial');
					smartDeviceSerialFilter.active = true;
					smartDeviceSerialFilter.setValue(this.smartDeviceSerialTextField.getValue());
				}

				if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
					isGridFilterApply = true;
					var locationNameFilter = this.grid.gridFilter.getFilter('Name');
					locationNameFilter.active = true;
					locationNameFilter.setValue(this.locationNameTextField.getValue());
				}
				if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
					isGridFilterApply = true;
					var assetSerialFilter = this.grid.gridFilter.getFilter('AssetName');
					assetSerialFilter.active = true;
					assetSerialFilter.setValue(this.assetSerialTextField.getValue());
				}
				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
				else {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.smartDeviceSerialTextField.reset();
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
		var resetField = ['SmartDeviceSerial', 'Name', 'AssetName'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				this.grid.topToolbar.items.get(index).setValue('');
			}
		}
	}
});
Cooler.BatteryAnalysisReport = new Cooler.BatteryAnalysisReport({ uniqueId: 'BatteryAnalysisReport' });