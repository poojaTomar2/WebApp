Cooler.MDImportStatusReport = Ext.extend(Cooler.Form, {
	controller: 'MDImportStatusReport',
	title: 'MD Import Status Report',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'MDImportStatusReport',
	constructor: function (config) {
		Cooler.MDImportStatusReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'Date' } },
			listeners: {
				'cellclick': this.onListGridCellClick,
				scope: this
			}
		});
	},
	hybridConfig: function () {
		return [
			{ header: 'Date', dataIndex: 'Date', width: 130, type: 'date', renderer: Cooler.renderer.MonthDateYear },
			{ header: 'Location Processed', type: 'int', dataIndex: 'LocationProcessed', width: 150 },
			{ header: 'Location Non Processed', type: 'int', dataIndex: 'LocationNonProcessed', width: 150 },
			{ header: 'Asset Processed', type: 'int', dataIndex: 'AssetProcessed', width: 150 },
			{ header: 'Asset Non Processed', dataIndex: 'AssetNonProcessed', type: 'int', width: 150 },
			{ header: 'User Processed', dataIndex: 'UserProcessed', type: 'int', width: 100 },
			{ header: 'User Non Processed', dataIndex: 'UserNonProcessed', type: 'int', width: 200 },
			{ header: 'Failed Location', dataIndex: 'LocationProcessedWithError', type: 'int', width: 200, hyperlinkAsDoubleClick: true },
			{ header: 'Failed Asset', dataIndex: 'AssetProcessedWithError', type: 'int', width: 200, hyperlinkAsDoubleClick: true },
			{ header: 'Failed User', dataIndex: 'UserProcessedWithError', type: 'int', width: 200, hyperlinkAsDoubleClick: true },
		];
	},
	onListGridCellClick: function (grid, rowIndex, e) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e];
		var row = grid.getStore().getAt(rowIndex);
		var date = row.get('Date');
		if (!date || (this.selectedDate && this.selectedDate === date && this.selectedDataIndex === column.dataIndex)) {
			return false;
		}
		var isValidColumn = false;
		var startDate, endDate;
		switch (column.dataIndex) {
			case 'LocationProcessedWithError':
				isValidColumn = true;
				startDate = date;
				endDate = date;
				break;
			case 'AssetProcessedWithError':
				isValidColumn = true;
				isValidColumn = true;
				startDate = date;
				endDate = date;
				break;
			case 'UserProcessedWithError':
				isValidColumn = true;
				isValidColumn = true;
				startDate = date;
				endDate = date;
				break;

		}
		if (!isValidColumn) {
			this.mDImportStatusReportAssetDetailGrid.setDisabled(true);
			this.mDImportStatusReportAssetDetailGrid.store.removeAll();
			this.mDImportStatusReportLocationDetailGrid.setDisabled(true);
			this.mDImportStatusReportLocationDetailGrid.store.removeAll();
			this.mDImportStatusReportUserDetailGrid.setDisabled(true);
			this.mDImportStatusReportUserDetailGrid.store.removeAll();
			return false;
		}

		this.selectedDate = date;
		this.selectedDataIndex = column.dataIndex;
		if (this.selectedDataIndex == 'AssetProcessedWithError') {
			var grid = this.mDImportStatusReportAssetDetailGrid;
			Ext.getCmp('mDImportStatusDetail').setActiveTab('Asset');
			var store = grid.getStore();
			grid.setDisabled(false);
			store.baseParams.date = date;
			store.baseParams.StartDate = startDate;
			store.baseParams.EndDate = endDate;
			store.load();
			this.mDImportStatusReportLocationDetailGrid.setDisabled(true);
			this.mDImportStatusReportLocationDetailGrid.store.removeAll();
			this.mDImportStatusReportUserDetailGrid.setDisabled(true);
			this.mDImportStatusReportUserDetailGrid.store.removeAll();
		}
		else if (this.selectedDataIndex == 'LocationProcessedWithError') {
			var grid = this.mDImportStatusReportLocationDetailGrid;
			Ext.getCmp('mDImportStatusDetail').setActiveTab('Location');
			var store = grid.getStore();
			grid.setDisabled(false);
			store.baseParams.date = date;
			store.baseParams.StartDate = startDate;
			store.baseParams.EndDate = endDate;
			store.load();
			this.mDImportStatusReportAssetDetailGrid.setDisabled(true);
			this.mDImportStatusReportAssetDetailGrid.store.removeAll();
			this.mDImportStatusReportUserDetailGrid.setDisabled(true);
			this.mDImportStatusReportUserDetailGrid.store.removeAll();
		}
		else if (this.selectedDataIndex == 'UserProcessedWithError') {
			var grid = this.mDImportStatusReportUserDetailGrid;
			Ext.getCmp('mDImportStatusDetail').setActiveTab('User');
			var store = grid.getStore();
			grid.setDisabled(false);
			store.baseParams.date = date;
			store.baseParams.StartDate = startDate;
			store.baseParams.EndDate = endDate;
			store.load();
			this.mDImportStatusReportAssetDetailGrid.setDisabled(true);
			this.mDImportStatusReportAssetDetailGrid.store.removeAll();
			this.mDImportStatusReportLocationDetailGrid.setDisabled(true);
			this.mDImportStatusReportLocationDetailGrid.store.removeAll();
		}
		else {
			this.mDImportStatusReportAssetDetailGrid.setDisabled(true);
			this.mDImportStatusReportAssetDetailGrid.store.removeAll();
			this.mDImportStatusReportLocationDetailGrid.setDisabled(true);
			this.mDImportStatusReportLocationDetailGrid.store.removeAll();
			return false;
		}

	},
	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});
		this.mDImportStatusReportAssetDetailGrid = Cooler.MDImportStatusReportAssetDetail.createGrid({ title: 'Failed Asset Detail ', id: 'Asset', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		this.mDImportStatusReportLocationDetailGrid = Cooler.MDImportStatusReportLocationDetail.createGrid({ title: 'Failed Location Detail ', id: 'Location', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		this.mDImportStatusReportUserDetailGrid = Cooler.MDImportStatusReportUserDetail.createGrid({ title: 'Failed User Detail ', id: 'User', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });

		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			id: 'mDImportStatusDetail',
			items: [
				this.mDImportStatusReportAssetDetailGrid,
				this.mDImportStatusReportLocationDetailGrid,
				this.mDImportStatusReportUserDetailGrid
			],
			height: 200,
			split: true,
			enableTabScroll: true
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, south]
		});

		return config;
	},
});


//Start Code For MDImportStatusReportAssetDetail
Cooler.MDImportStatusReportAssetDetail = new Cooler.Form({
	controller: 'MDImportStatusReportAssetDetail',
	disableAdd: true,
	comboTypes: [
	'Client'
	],
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'AssetMDHistoryId' } },
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		return [
			{ header: 'Id', type: 'int', dataIndex: 'AssetMDHistoryId' },
			{ header: 'Error', type: 'string', dataIndex: 'ErrorMessage', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
			{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
            { header: 'Serial Number', type: 'string', dataIndex: 'SerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Model', type: 'string', dataIndex: 'Model', width: 150 },
			{ header: 'SubBrand', type: 'string', dataIndex: 'SubBrand', width: 150 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Technical Identification Number', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Installation', dataIndex: 'Installation', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Acquisition Date', dataIndex: 'AcquisitionDate', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Type Of Technical Object Code', type: 'string', dataIndex: 'TypeOfTechnicalObjectCode', width: 150 },
			{ header: 'Type Of Technical Object Description', type: 'string', dataIndex: 'TypeOfTechnicalDescription', width: 150 },
			{ header: 'Maintenance Plant Code', type: 'string', dataIndex: 'AssetMaintenancePlantCode', width: 150 },
			{ header: 'Maintenance Plant Description', type: 'string', dataIndex: 'AssetMaintenancePlantDescription', width: 150 },
			{ header: 'Equipment Grouping Region', type: 'string', dataIndex: 'EquipmentGroupingRegion', width: 150 },
			{ header: 'Stock Plant Code', type: 'string', dataIndex: 'StockPlantCode', width: 150 },
			{ header: 'Stock Plant Description', type: 'string', dataIndex: 'StockPlantDescription', width: 150 },
			{ header: 'Storage Location Code', type: 'string', dataIndex: 'StorageLocation', width: 150 },
			{ header: 'Storage Location Name', type: 'string', dataIndex: 'StorageLocationName', width: 150 },
			{ header: 'Material', type: 'string', dataIndex: 'Material', width: 100 },
			{ header: 'Material Name', type: 'string', dataIndex: 'MaterialName', width: 100 },
			{ header: 'Stock Batch', type: 'string', dataIndex: 'StockBatch', width: 150 },
			{ header: 'Master Batch', type: 'string', dataIndex: 'MasterBatch', width: 150 },
			{ header: 'ICOOL Or Retrofit', type: 'string', dataIndex: 'ICOOLOrRetrofit', width: 150 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'MainTypeOfCDE', type: 'string', dataIndex: 'MainTypeOfCDE', width: 150 },
			{ header: 'LightingType', type: 'string', dataIndex: 'LightingType', width: 150 },
			{ header: 'Cooler Brand', type: 'string', dataIndex: 'CoolerBrand', width: 150 },
			{ header: 'Refrigerant Gas', type: 'string', dataIndex: 'RefrigerantGas', width: 150 },
			{ header: 'Supplier', type: 'string', dataIndex: 'Supplier', width: 150 },
			{ header: 'Door Factor', type: 'string', dataIndex: 'DoorFactor', width: 150 },
			{ header: 'Energy Consumption', type: 'string', dataIndex: 'EnergyConsumption', width: 150 },
			{ header: 'EMD Type', type: 'string', dataIndex: 'EMDType', width: 150 },
			{ header: 'FullWarranty', type: 'string', dataIndex: 'FullWarranty', width: 150 },
			{ header: 'Last Verification Date', dataIndex: 'LastVerificationDate', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Placement Date', dataIndex: 'PlacementDate', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Procurement', type: 'string', dataIndex: 'Procurement', width: 150 },
			{ header: 'UserName', type: 'string', dataIndex: 'UserName', width: 150 },
			{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) }
			
		];
	}
});
//END Code For MDImportStatusReportAssetDetail


//Start Code For MDImportStatusReportLocationDetail
Cooler.MDImportStatusReportLocationDetail = new Cooler.Form({
	controller: 'MDImportStatusReportLocationDetail',
	disableAdd: true,
	comboTypes: [
	'Client',
	'Country',
	'TimeZone'
	],
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'LocationMDHistoryId' } },
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'LocationMDHistoryId', type: 'int' },
			{ header: 'Error', type: 'string', dataIndex: 'ErrorMessage', width: 150 },
            { header: 'Outlet Code', dataIndex: 'OutletCode', width: 100, type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', dataIndex: 'OutletName', width: 220, type: 'string' },
			{ header: 'Outlet Name Continue', dataIndex: 'CustomerNameContinue', width: 120, type: 'string', hidden: true },
			{ header: 'House Number', dataIndex: 'HouseNumber', width: 100, type: 'string' },
			{ header: 'Street', dataIndex: 'Street', width: 150, type: 'string' },
			{ header: 'Address1', dataIndex: 'Address1', width: 150, type: 'string' },
			{ header: 'Address2', dataIndex: 'Address2', width: 150, type: 'string' },
			{ header: 'Address3', dataIndex: 'Address3', width: 150, type: 'string' },
			{ header: 'Address4', dataIndex: 'Address4', width: 150, type: 'string' },
			{ header: 'Postal Code', dataIndex: 'PostalCode', width: 150, type: 'string' },
			{ header: 'City', dataIndex: 'City', width: 150, type: 'string' },
			{ header: 'Country', dataIndex: 'Country', width: 150, type: 'string' },
			{ header: 'Telephone', dataIndex: 'Telephone', width: 150, type: 'string' },
			{ header: 'Mobile Phone', dataIndex: 'MobilePhone', width: 150, type: 'string' },
			{ header: 'EMail', dataIndex: 'EMail', width: 150, type: 'string' },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 150, type: 'string' },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 150, type: 'string' },
			{ header: 'Bd Id', dataIndex: 'BdId', width: 150, type: 'string' },
			{ header: 'Bd Name', dataIndex: 'BdName', width: 150, type: 'string' },
			{ header: 'Bd Phone', dataIndex: 'BdPhone', width: 150, type: 'string' },
			{ header: 'Agent Id', dataIndex: 'AgentId', width: 150, type: 'string' },
			{ header: 'Agent Name', dataIndex: 'AgentName', width: 150, type: 'string' },
			{ header: 'Agent Phone', dataIndex: 'AgentPhone', width: 150, type: 'string' },
			{ header: 'IsKeyOutlet', dataIndex: 'IsKeyOutlet', width: 150, type: 'string' },
			{ header: 'Sales Organization Code', dataIndex: 'SalesOrganization', width: 150, type: 'string' },
			{ header: 'Sales Organization Name', dataIndex: 'SalesOrganizationName', width: 150, type: 'string' },
			{ header: 'Sales Office Code', dataIndex: 'SalesOffice', width: 150, type: 'string' },
			{ header: 'Sales Office Name', dataIndex: 'SalesOfficeName', width: 150, type: 'string' },
			{ header: 'Sales Group Code', dataIndex: 'SalesGroup', width: 150, type: 'string' },
			{ header: 'Sales Group Name', dataIndex: 'SalesGroupName', width: 150, type: 'string' },
			{ header: 'BDTerritory', dataIndex: 'BDTerritory', width: 150, type: 'string' },
			{ header: 'BD Territory Name', dataIndex: 'BDTerritoryName', width: 150, type: 'string' },
			{ header: 'TeleSellingTerritory', dataIndex: 'TeleSellingTerritory', width: 150, type: 'string' },
			{ header: 'TeleSellingTerritory Name', dataIndex: 'TeleSellingTerritoryName', width: 150, type: 'string' },
			{ header: 'Customer Type', dataIndex: 'CustomerType', width: 150, type: 'string' },
			{ header: 'Customer Type Name', dataIndex: 'CustomerTypeName', width: 150, type: 'string' },
			{ header: 'Trade Channel', dataIndex: 'TradeChannel', width: 150, type: 'string' },
			{ header: 'TradeChannel Name', dataIndex: 'TradeChannelName', width: 150, type: 'string' },
			{ header: 'SubChannel', dataIndex: 'SubChannel', width: 150, type: 'string' },
			{ header: 'SubChannelName', dataIndex: 'SubChannelName', width: 150, type: 'string' },
			{ header: 'Client Id', dataIndex: 'ClientId', width: 120, type: 'int', hidden: true },
			{ header: 'CountryId', dataIndex: 'CountryId', width: 120, type: 'int', hidden: true },
			{ header: 'Timezone Id', dataIndex: 'TimezoneId', width: 120, type: 'int', hidden: true },
			{ header: 'User Name', dataIndex: 'UserName', width: 150, type: 'string' },
			{ header: 'Created On', dataIndex: 'CreatedOn', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Is Key Outlet?', dataIndex: 'IsKeyLocation', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ header: 'Is Smart?', dataIndex: 'IsSmart', renderer: ExtHelper.renderer.Boolean, type: 'bool' },
			{ header: 'Country', dataIndex: 'Country', type: 'string' },
			{ header: 'State', dataIndex: 'State', type: 'string' },
			{ header: 'City', dataIndex: 'City', type: 'string' },
			{ header: 'Street', dataIndex: 'Street', width: 120, type: 'string' },
			{ header: 'Street 2', dataIndex: 'Street2', width: 120, type: 'string' },
			{ header: 'Street 3', dataIndex: 'Street3', width: 120, type: 'string' },
			{ header: 'Primary Phone', dataIndex: 'PrimaryPhone', width: 120, type: 'string' },
			{ header: 'Primary Sales Rep', dataIndex: 'PrimarySalesRep', width: 120, type: 'string' },
			{ header: 'Technician', dataIndex: 'Technician', width: 120, type: 'string' },
			{ header: 'Market', dataIndex: 'MarketName', type: 'string' },
			{ header: 'Trade Channel', dataIndex: 'LocationType', type: 'string' },
			{ header: 'Sales Target', dataIndex: 'SalesTarget', align: 'right', type: 'int' },
			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel Name', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string' },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'float' },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'float' },
			{ header: 'Territory', dataIndex: 'Territory', type: 'string' },
			{ header: 'TimeZone', dataIndex: 'TimezoneId', displayIndex: 'DisplayName', type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }) },
			{ header: 'Country', dataIndex: 'CountryId', displayIndex: 'Country', type: 'int', store: this.comboStores.Country, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }) },
			{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) }
			
		];
	}
});
//END Code For MDImportStatusReportLocationDetail


//Start Code For MDImportStatusReportUserDetail
Cooler.MDImportStatusReportUserDetail = new Cooler.Form({
	controller: 'MDImportStatusReportUserDetail',
	disableAdd: true,
	comboTypes: [
	'Client'
	],
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'UserMDHistoryId' } },
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'UserMDHistoryId', type: 'int' },
			{ header: 'Error', type: 'string', dataIndex: 'ErrorMessage', width: 150 },
			{ header: 'User Id', dataIndex: 'UserID', type: 'int' },
			{ header: 'First Name', dataIndex: 'FirstName', width: 100, type: 'string' },
			{ header: 'Last Name', dataIndex: 'LastName', width: 220, type: 'string' },
			{ header: 'Email', dataIndex: 'Email', width: 100, type: 'string' },
			{ header: 'Territory', dataIndex: 'Territory', width: 150, type: 'string' },
			{ header: 'Role', dataIndex: 'Role', width: 150, type: 'string' },
			{ header: 'Phone', dataIndex: 'Phone', width: 150, type: 'string' },
			{ header: 'Country', dataIndex: 'Country', width: 150, type: 'string' },
			{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'User Name', dataIndex: 'UserName', width: 150, type: 'string' },
			{ header: 'Created On', dataIndex: 'CreatedOn', type: 'date', width: 160, renderer: ExtHelper.renderer.DateTime }
			
		];
	}
});
//END Code For MDImportStatusReportUserDetail


Cooler.MDImportStatusReport = new Cooler.MDImportStatusReport({ uniqueId: 'MDImportStatusReport' });