Cooler.OutletsPerTerritory = Ext.extend(Object, {
	ShowList: function () {
		DCPLApp.AddTab(this.createFilterPanel());
	},
	createFilterPanel: function () {
		if (!this.panel) {
			var submitButton = new Ext.Button({ text: 'Show', cls: 'search', scope: this });
			var searchSalesOrganizationData = new Ext.form.TextField({
				fieldLabel: 'Search By Name',
				width: 200,
				xtype: 'textfield',
				emptyText: 'Sales Territory Name',
				enableKeyEvents: true,
				itemCls: 'txt-search search'	// Add css to align search button next to textbox
			});
			this.searchSalesOrganizationData = searchSalesOrganizationData;
			submitButton.on('click', this.onShowButtonClick, this);

			var submitButtonForCode = new Ext.Button({ text: 'Show', cls: 'search', scope: this });
			var searchSalesTerritoryDataByCode = new Ext.form.TextField({
				fieldLabel: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search By Code',
				width: 200,
				xtype: 'textfield',
				emptyText: 'Sales Territory Code',
				enableKeyEvents: true,
				itemCls: 'txt-search search'	// Add css to align search button next to textbox
			});
			this.searchSalesTerritoryDataByCode = searchSalesTerritoryDataByCode;
			submitButtonForCode.on('click', this.onSubmitButtonForCodeClick, this);

			var reportFilter = {
				xtype: 'fieldset',
				title: 'Search by Sales Territory Name / Sales Territory Code',
				bodyStyle: 'padding: 5px;',
				height: 70,
				items: [searchSalesOrganizationData, submitButton, searchSalesTerritoryDataByCode, submitButtonForCode]
			};

			var filterPanel = new Ext.Panel({
				layout: 'table',
				region: 'west',
				height: 70,
				defaults: { border: false, defaults: { labelWidth: 80 } },
				items: [reportFilter]
			});

			var UserGrid = Cooler.SalesUsers.createGrid({
				title: 'Users',
				editable: false,
				tbar: [],
				showDefaultButtons: true,
				height: (window.innerHeight - 70) / 2.3
			});
			this.UserGrid = UserGrid;

			var locationGrid = Cooler.LocationType.SalesTerritoryOutlet.createGrid({
				title: 'Outlet',
				editable: false,
				tbar: [],
				showDefaultButtons: true,
				height: (window.innerHeight - 70) / 2.3
			});
			this.locationGrid = locationGrid;

			var resultPanel = new Ext.Panel({
				title: 'Outlets per territory Tool',
				region: 'east',
				closable: true,
				items: [filterPanel, UserGrid, locationGrid],
				id: 'oughter',
				baseCls: 'baseOughter'
			});
			this.resultPanel = resultPanel;
		}
		return this.resultPanel;
	},
	onShowButtonClick: function (button) {
		this.locationGrid.store.baseParams.SearchByCode = false;
		this.UserGrid.store.baseParams.SearchByCode = false;
		this.UserGrid.store.baseParams.UserTerritory = this.searchSalesOrganizationData.getValue();
		this.UserGrid.store.baseParams.SearchByName = true;
		this.UserGrid.store.load();
		this.locationGrid.store.baseParams.SalesTerritory = this.searchSalesOrganizationData.getValue();
		this.locationGrid.store.baseParams.SearchByName = true;
		this.locationGrid.store.load();
	},
	onSubmitButtonForCodeClick: function (button) {
		this.locationGrid.store.baseParams.SearchByName = false;
		this.UserGrid.store.baseParams.SearchByName = false;
		this.UserGrid.store.baseParams.UserTerritoryByCode = this.searchSalesTerritoryDataByCode.getValue();
		this.UserGrid.store.baseParams.SearchByCode = true;
		this.UserGrid.store.load();
		this.locationGrid.store.baseParams.SalesTerritoryByCode = this.searchSalesTerritoryDataByCode.getValue();
		this.locationGrid.store.baseParams.SearchByCode = true;
		this.locationGrid.store.load();
	}
});
Cooler.OutletsPerTerritory = new Cooler.OutletsPerTerritory();