Cooler.AppUser = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'User: {0}',
		listTitle: 'Users',
		keyColumn: 'UserId',
		captionColumn: 'Username',
		securityModule: 'Users',
		controller: 'AppUser',
		winConfig: { height: 280, width: 425 },
		gridConfig: {
			custom: { loadComboTypes: true }
		},
		processNode: -1,
		childNodeCount: 0
	});
	Cooler.AppUser.superclass.constructor.call(this, config);
};

var isSalesOrganizationChange = false;
var isSalesOfficeChange = false;
var isSalesGroupChange = false;
var isSalesTerritoryChange = false;
var isTeleSellingChange = false;
var isNewOrEditedRecord = '';

Ext.extend(Cooler.AppUser, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'UserId', type: 'int' },
		{ name: 'AppUserId', type: 'int' },
		{ name: 'FirstName', type: 'string' },
		{ name: 'LastName', type: 'string' },
		{ name: 'Username', type: 'string' },
		{ name: 'PrimaryEmail', type: 'string' },
		{ name: 'PrimaryPhone', type: 'string' },
		{ name: 'Password', type: 'string' },
		{ name: 'Role', type: 'string' },
		{ name: 'RoleId', type: 'int' },
		{ name: 'IsExcludeOutletTestData', type: 'bool' },
		{ name: 'SupervisorId', type: 'int' },
		{ name: 'PreferedNotificationTypeIds', type: 'string' },
		{ name: 'PreferedNotificationType', type: 'string' },
		{ name: 'LastLoginOn', type: 'date' },
		{ name: 'ClientId', type: 'int' },
		{ name: 'ClientName', type: 'string' },
		{ name: 'ReportingManager', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'ResponsibleCountryIds', type: 'string' },
		{ name: 'SalesOrganizationIds', type: 'string' },
		{ name: 'SalesOrganization', type: 'string' },
		{ name: 'SalesOfficeIds', type: 'string' },
		{ name: 'SalesOffice', type: 'string' },
		{ name: 'SalesGroupIds', type: 'string' },
		{ name: 'SalesGroup', type: 'string' },
		{ name: 'SalesTerritoryIds', type: 'string' },
		{ name: 'NonParentSalesHierarchyIds', type: 'string' },
		{ name: 'TeleSellingSalesHierarchyIds', type: 'string' },
		{ name: 'SalesTerritory', type: 'string' },
		{ name: 'SalesOrganizationCode', type: 'string' },
		{ name: 'SalesOfficeCode', type: 'string' },
		{ name: 'SalesGroupCode', type: 'string' },
		{ name: 'SalesTerritoryCode', type: 'string' },
		{ name: 'UPN', type: 'string' },
		{ name: 'Country', type: 'string' },
		{ name: 'ResponsibleCountry', type: 'string' },
		{ name: 'TeleSellingTerritoryIds', type: 'string' },
		{ name: 'TeleSellingTerritoryName', type: 'string' },
		{ name: 'TeleSellingTerritoryCode', type: 'string' },
		{ name: 'BD_Territory', type: 'string' },
		{ name: 'CA_Territory', type: 'string' },
		{ name: 'MC_Territory', type: 'string' },
		{ name: 'P1_Territory', type: 'string' },
		{ name: 'P2_Territory', type: 'string' },
		{ name: 'P3_Territory', type: 'string' },
		{ name: 'P4_Territory', type: 'string' },
		{ name: 'P5_Territory', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'First Name', dataIndex: 'FirstName' },
			{ header: 'Last Name', dataIndex: 'LastName' },
			{ header: 'User Name', dataIndex: 'Username' },
			{ header: 'UPN', dataIndex: 'UPN' },
			{ header: 'Email', dataIndex: 'PrimaryEmail', width: 150 },
			{ header: 'Phone', dataIndex: 'PrimaryPhone' },
			{ header: 'Role', dataIndex: 'Role' },
			{ header: 'Reporting Manager', dataIndex: 'ReportingManager' },
			{ header: 'Preferred Notification Type', dataIndex: 'PreferedNotificationType' },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 150 },
			{ header: 'Responsible Country', dataIndex: 'ResponsibleCountry' },
			{ header: 'Sales Organization', dataIndex: 'SalesOrganization' },
			{ header: 'Sales Office', dataIndex: 'SalesOffice' },
			{ header: 'Sales Group', dataIndex: 'SalesGroup' },
			{ header: 'Sales Territory', dataIndex: 'SalesTerritory' },
			{ header: 'Teleselling Territory', dataIndex: 'TeleSellingTerritoryName' },
			{ header: 'Sales Organization Code', dataIndex: 'SalesOrganizationCode', hidden: true },
			{ header: 'Sales Office Code', dataIndex: 'SalesOfficeCode', hidden: true },
			{ header: 'Sales Group Code', dataIndex: 'SalesGroupCode', hidden: true },
			{ header: 'Sales Territory Code', dataIndex: 'SalesTerritoryCode', hidden: true },
			{ header: 'Teleselling Code', dataIndex: 'TeleSellingTerritoryCode', hidden: true },
			{ header: 'BD Territory Name', dataIndex: 'BD_Territory', width: 150, },
			{ header: 'CA Territory Name', dataIndex: 'CA_Territory', width: 150, },
			{ header: 'MC Territory Name', dataIndex: 'MC_Territory', width: 150, },
			{ header: 'P1 Territory Name', dataIndex: 'P1_Territory', width: 150, },
			{ header: 'P2 Territory Name', dataIndex: 'P2_Territory', width: 150, },
			{ header: 'P3 Territory Name', dataIndex: 'P3_Territory', width: 150, },
			{ header: 'P4 Territory Name', dataIndex: 'P4_Territory', width: 150, },
			{ header: 'P5 Territory Name', dataIndex: 'P5_Territory', width: 150, },
			{ header: 'Last Login On', dataIndex: 'LastLoginOn', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);
		cm.defaultSortable = true;
		return cm;
	},
	comboStores: {
		Role: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	createForm: function (config) {

		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var responsibleforCountryIdForStore = DA.combo.create({ baseParams: { comboType: 'Country', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforCountryIdForStore = responsibleforCountryIdForStore;

		var responsibleforSalesHierarchyLevel_0 = DA.combo.create({ baseParams: { comboType: 'SalesOrganization', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_0 = responsibleforSalesHierarchyLevel_0;
		this.responsibleforSalesHierarchyLevel_0.store.on('load', this.loadSalesOrganization, this);

		var responsibleforSalesHierarchyLevel_1 = DA.combo.create({ baseParams: { comboType: 'SalesOffice', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_1 = responsibleforSalesHierarchyLevel_1;
		this.responsibleforSalesHierarchyLevel_1.store.on('load', this.loadSalesOffice, this);

		var responsibleforSalesHierarchyLevel_2 = DA.combo.create({ baseParams: { comboType: 'SalesGroup', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_2 = responsibleforSalesHierarchyLevel_2;
		this.responsibleforSalesHierarchyLevel_2.store.on('load', this.loadSalesGroup, this);

		var responsibleforSalesHierarchyLevel_3 = DA.combo.create({ baseParams: { comboType: 'SalesTerritory', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_3 = responsibleforSalesHierarchyLevel_3;
		this.responsibleforSalesHierarchyLevel_3.store.on('load', this.loadSalesTerritory, this);

		var responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds = DA.combo.create({ baseParams: { comboType: 'TeleSellingSalesHierarchy', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds = responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds;
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.store.on('load', this.loadTeleSellingSalesHierarchy, this);
		var responsibleforCountryIdCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Responsible for Country',
			hiddenName: 'ResponsibleCountryIds',
			name: 'ResponsibleCountryIds',
			displayField: 'DisplayValue',
			store: responsibleforCountryIdForStore.getStore(),
			width: 180
		});

		var selectAllButtonResponsibleSalesHierarchyLevel_0 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesOrganizationSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_0 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesOrganizationDeSelectAll, scope: this });
		var searchSalesOrganizationData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true,
			itemCls: 'clsSalesHierarchySearchBox'
		});
		searchSalesOrganizationData.on('keyup', this.onSearchSalesOrganizationDataKeyUp, this);

		var responsibleSalesHierarchyLevel_0 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Organization',
			hiddenName: 'SalesOrganizationIds',
			name: 'SalesOrganizationIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_0.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_0.on('change', this.onSalesOrganizationChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_1 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesOfficeSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_1 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesOfficeDeSelectAll, scope: this });
		var searchSalesOfficeData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true,
			itemCls: 'clsSalesHierarchySearchBox'
		});
		searchSalesOfficeData.on('keyup', this.onSearchSalesOfficeDataKeyUp, this);

		var responsibleSalesHierarchyLevel_1 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Office',
			hiddenName: 'SalesOfficeIds',
			name: 'SalesOfficeIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			id: 'SalesOfficeIds',
			store: responsibleforSalesHierarchyLevel_1.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_1.on('change', this.onSalesOfficeChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_2 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesGroupSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_2 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesGroupDeSelectAll, scope: this });
		var searchSalesGroupData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true,
			itemCls: 'clsSalesHierarchySearchBox'
		});
		searchSalesGroupData.on('keyup', this.onSearchSalesGroupDataKeyUp, this);

		var responsibleSalesHierarchyLevel_2 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Group',
			hiddenName: 'SalesGroupIds',
			name: 'SalesGroupIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_2.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_2.on('change', this.onSalesGroupChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_3 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesTerritorySelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_3 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesTerritoryDeSelectAll, scope: this });
		var searchSalesTerritoryData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true,
			itemCls: 'clsSalesHierarchySearchBox'
		});
		searchSalesTerritoryData.on('keyup', this.onSearchSalesTerritoryDataKeyUp, this);

		var responsibleSalesHierarchyLevel_3 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Territory',
			hiddenName: 'SalesTerritoryIds',
			name: 'SalesTerritoryIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_3.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_3.on('change', this.onSalesTerritoryChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesTeleSellingSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesTeleSellingDeSelectAll, scope: this });
		var searchTeleSellingSalesData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchTeleSellingSalesData.on('keyup', this.onSearchTeleSellingSalesDataDataKeyUp, this);

		var responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'MultiTerritory',
			hiddenName: 'TeleSellingSalesHierarchyIds',
			name: 'TeleSellingSalesHierarchyIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.on('change', this.onTeleSellingSalesChange, this);

		this.responsibleforCountryIdCombo = responsibleforCountryIdCombo;
		this.responsibleSalesHierarchyLevel_0 = responsibleSalesHierarchyLevel_0;
		this.responsibleSalesHierarchyLevel_1 = responsibleSalesHierarchyLevel_1;
		this.responsibleSalesHierarchyLevel_2 = responsibleSalesHierarchyLevel_2;
		this.responsibleSalesHierarchyLevel_3 = responsibleSalesHierarchyLevel_3;
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds;

		this.selectAllButtonResponsibleSalesHierarchyLevel_0 = selectAllButtonResponsibleSalesHierarchyLevel_0;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_0 = deSelectAllButtonResponsibleSalesHierarchyLevel_0;
		this.searchSalesOrganizationData = searchSalesOrganizationData;


		this.selectAllButtonResponsibleSalesHierarchyLevel_1 = selectAllButtonResponsibleSalesHierarchyLevel_1;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_1 = deSelectAllButtonResponsibleSalesHierarchyLevel_1;
		this.searchSalesOfficeData = searchSalesOfficeData;

		this.selectAllButtonResponsibleSalesHierarchyLevel_2 = selectAllButtonResponsibleSalesHierarchyLevel_2;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_2 = deSelectAllButtonResponsibleSalesHierarchyLevel_2;
		this.searchSalesGroupData = searchSalesGroupData;

		this.selectAllButtonResponsibleSalesHierarchyLevel_3 = selectAllButtonResponsibleSalesHierarchyLevel_3;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_3 = deSelectAllButtonResponsibleSalesHierarchyLevel_3;
		this.searchSalesTerritoryData = searchSalesTerritoryData;

		this.selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds;
		this.searchTeleSellingSalesData = searchTeleSellingSalesData;

		var preferedNotificationTypeForStore = DA.combo.create({ baseParams: { comboType: 'PreferedNotificationType' }, listWidth: 180, controller: "Combo" });
		this.preferedNotificationTypeForStore = preferedNotificationTypeForStore;
		var preferedNotificationTypeCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			name: 'PreferedNotificationTypeIds',
			fieldLabel: 'Preferred Notification Type',
			hiddenName: 'PreferedNotificationTypeIds',
			displayField: 'DisplayValue',
			store: preferedNotificationTypeForStore.getStore(),
			width: 200,
			allowBlank: false
		});
		this.preferedNotificationTypeCombo = preferedNotificationTypeCombo;
		var IsExcludeOutletTestData = { fieldLabel: 'Is Exclude Outlet Test Data?', name: 'IsExcludeOutletTestData', dataIndex: 'IsExcludeOutletTestData', xtype: 'checkbox' };
		var salesHierarchy = { xtype: 'button', text: 'Sales Hierarchy', iconCls: 'add', border: false, handler: this.onSalesHierarchyClick, scope: this };
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', hiddenName: 'ClientId', store: this.comboStores.Client, width: 200 });
		this.clientCombo = clientCombo;
		this.clientCombo.store.on('load', this.loadClientCombo, this);
		var countryCombo = DA.combo.create({ fieldLabel: 'Country', hiddenName: 'CountryId', store: this.comboStores.Country, width: 200 });
		this.countryCombo = countryCombo;
		this.countryCombo.store.on('load', this.loadCountryCombo, this);
		var roleCombo = DA.combo.create({ fieldLabel: 'Role', hiddenName: 'RoleId', store: this.comboStores.Role, allowBlank: false, width: 200 });
		roleCombo.on('change', this.hideCountryOnGrid, this);
		var salesHierarchyIds = new Ext.form.Hidden({ name: 'SalesHierarchyIds' });
		this.salesHierarchyIds = salesHierarchyIds;
		var salesOrgCheckedvals = [];
		var salesOfficeCheckedvals = [];
		var salesGroupCheckedvals = [];
		var salesTerritoryCheckedvals = [];
		var salesTelesellingterritoryCheckedvals = [];

		this.salesOrgCheckedvals = salesOrgCheckedvals;
		this.salesOfficeCheckedvals = salesOfficeCheckedvals;
		this.salesGroupCheckedvals = salesGroupCheckedvals;
		this.salesTerritoryCheckedvals = salesTerritoryCheckedvals;
		this.salesTelesellingTerritoryCheckedvals = salesTelesellingterritoryCheckedvals;

		roleCombo.on('select', this.onRoleComboSelect, this);
		var firstColumn = [
			{ fieldLabel: 'User Name', name: 'Username', xtype: 'textfield', maxLength: 50, allowBlank: false, width: 200 },
			{ fieldLabel: 'UPN', name: 'UPN', xtype: 'textfield', maxLength: 50, width: 200 },
			{ fieldLabel: 'First Name', name: 'FirstName', xtype: 'textfield', maxLength: 50, allowBlank: false, width: 200 },
			{ fieldLabel: 'Last Name', name: 'LastName', xtype: 'textfield', maxLength: 50, allowBlank: false, width: 200 },
			{ fieldLabel: 'Email', name: 'PrimaryEmail', xtype: 'textfield', vtype: 'email', maxLength: 50, width: 200 },
			{ fieldLabel: 'Phone', name: 'PrimaryPhone', xtype: 'textfield', vtype: 'phone', maxLength: 15, width: 200 },
			{ fieldLabel: 'Password', name: 'Password', xtype: 'textfield', id: "password", inputType: 'password', maxLength: 50, allowBlank: false, width: 200 },
			{
				fieldLabel: 'Re-enter password', xtype: 'textfield', name: 'ConfirmPassword', inputType: 'password', maxLength: 50, allowBlank: false, width: 200, //msgTarget: 'side', enableKeyEvents: true, listeners: { 'keyup': ReEnterPasswordOnchangeEvent },
				id: 'confirmPass',
				vtype: 'password',
				vtypeText: 'Password does not match  !',
				confirmTo: 'password'
			},
			roleCombo,
			clientCombo,
			countryCombo,
			preferedNotificationTypeCombo,
			IsExcludeOutletTestData,
			DA.combo.create({ fieldLabel: 'Reporting Manager', hiddenName: 'SupervisorId', baseParams: { comboType: 'ReportingManager' }, width: 200 }),
			tagsPanel,
			salesHierarchyIds
		];

		var secondColumn = [
			selectAllButtonResponsibleSalesHierarchyLevel_0,
			deSelectAllButtonResponsibleSalesHierarchyLevel_0,
			searchSalesOrganizationData,
			responsibleSalesHierarchyLevel_0,

			selectAllButtonResponsibleSalesHierarchyLevel_1,
			deSelectAllButtonResponsibleSalesHierarchyLevel_1,
			searchSalesOfficeData,
			responsibleSalesHierarchyLevel_1,

			responsibleforCountryIdCombo
		];

		var thirdColumn = [
			selectAllButtonResponsibleSalesHierarchyLevel_2,
			deSelectAllButtonResponsibleSalesHierarchyLevel_2,
			searchSalesGroupData,
			responsibleSalesHierarchyLevel_2,

			selectAllButtonResponsibleSalesHierarchyLevel_3,
			deSelectAllButtonResponsibleSalesHierarchyLevel_3,
			searchSalesTerritoryData,
			responsibleSalesHierarchyLevel_3,

			selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds,
			deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds,
			searchTeleSellingSalesData,
			responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds
		];

		var columns = {
			layout: 'column',
			region: 'center',
			border: false,
			defaults: {
				layout: 'form',
				border: false
			},
			items: [
				{ items: firstColumn, columnWidth: .4 },
				{ items: secondColumn, columnWidth: .3 },
				{ items: thirdColumn, columnWidth: .3 }
			]
		};

		Ext.apply(config, {
			items: columns
		});
		return config;
	},

	setTreeValue: function (child) {
		child.eachChild(function (childNode) {
			childNode.ui.toggleCheck(this.salesHierarchyArray.indexOf(childNode.id) > -1);
			if (childNode.hasChildNodes()) {
				this.setTreeValue(childNode);
			}
		}, this);
	},

	onSalesOrganizationSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_0 = this.responsibleforSalesHierarchyLevel_0.getStore();
		var salesOrganizationHierarchyIds = [];
		var len = storeLevel_0.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_0.getAt(i).data.LookupId;
			salesOrganizationHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_0.setValue('' + salesOrganizationHierarchyIds + '');
		this.salesOrgCheckedvals = [];
		this.salesOrgCheckedvals.push(salesOrganizationHierarchyIds.join(','));

		var storeLevel_1 = this.responsibleforSalesHierarchyLevel_1.getStore();
		var salesOfficeHierarchyIds = [];
		var len = storeLevel_1.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_1.getAt(i).data.LookupId;
			salesOfficeHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_1.setValue('' + salesOfficeHierarchyIds + '');
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(salesOfficeHierarchyIds.join(','));

		var storeLevel_2 = this.responsibleforSalesHierarchyLevel_2.getStore();
		var salesGroupHierarchyIds = [];
		var len = storeLevel_2.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_2.getAt(i).data.LookupId;
			salesGroupHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_2.setValue('' + salesGroupHierarchyIds + '');
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},

	onSalesOrganizationDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		this.responsibleSalesHierarchyLevel_0.setValue('');
		this.responsibleSalesHierarchyLevel_1.setValue('');
		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');

		this.salesOrgCheckedvals = [];
		this.salesOfficeCheckedvals = [];
		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
		this.salesTelesellingTerritoryCheckedvals = [];
	},

	onSalesOfficeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_1 = this.responsibleforSalesHierarchyLevel_1.getStore();
		var salesOfficeHierarchyIds = [];
		var len = storeLevel_1.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_1.getAt(i).data.LookupId;
			salesOfficeHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_1.setValue('' + salesOfficeHierarchyIds + '');
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(salesOfficeHierarchyIds.join(','));

		var storeLevel_2 = this.responsibleforSalesHierarchyLevel_2.getStore();
		var salesGroupHierarchyIds = [];
		var len = storeLevel_2.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_2.getAt(i).data.LookupId;
			salesGroupHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_2.setValue('' + salesGroupHierarchyIds + '');
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},

	onSalesOfficeDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		this.responsibleSalesHierarchyLevel_1.setValue('');
		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');

		this.salesOfficeCheckedvals = [];
		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
	},

	onSalesGroupSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_2 = this.responsibleforSalesHierarchyLevel_2.getStore();
		var salesGroupHierarchyIds = [];
		var len = storeLevel_2.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_2.getAt(i).data.LookupId;
			salesGroupHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_2.setValue('' + salesGroupHierarchyIds + '');
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},

	onSalesGroupDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');

		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
	},

	onSalesTerritorySelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},

	onSalesTerritoryDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		this.responsibleSalesHierarchyLevel_3.setValue('');
		this.salesTerritoryCheckedvals = [];
	},

	onSalesTeleSellingSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
		var store = this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore();
		var teleSellingSalesTerritoryHierarchyIds = [];
		var len = store.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = store.getAt(i).data.LookupId;
			teleSellingSalesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + teleSellingSalesTerritoryHierarchyIds + '');
		this.salesTelesellingTerritoryCheckedvals = [];
		this.salesTelesellingTerritoryCheckedvals.push(teleSellingSalesTerritoryHierarchyIds.join(','));
	},

	onSalesTeleSellingDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');

		this.salesTelesellingTerritoryCheckedvals = [];
	},

	onSalesOrganizationChange: function (combo, newValue, oldValue) {
		isSalesOrganizationChange = true;
		isOldValuehigher = false;
		var tempSOrg = this.salesOrgCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesOrgCheckedvals = [];
		this.salesOrgCheckedvals.push(tempSOrg.join(','));

		var tempSO = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(tempSO.join(','));

		var tempSG = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(tempSG.join(','));

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		var lookupIds = [];
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				isOldValuehigher = false;
				this.salesOrgCheckedvals.push(newValue);
				var salesOrgIds = $.unique((this.salesOrgCheckedvals.join(',')).split(','));
				this.salesOrgCheckedvals = [];
				this.salesOrgCheckedvals.push(salesOrgIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				isOldValuehigher = true;
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesOrgSelectedvals = this.salesOrgCheckedvals.join(',').split(',');
				for (var k = 0; k < salesOrgSelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesOrgSelectedvals[k] == oldValueArr[l]) {
							salesOrgSelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salesOrgSelectedvals.length > 0) {

					this.salesOrgCheckedvals = [];
					this.salesOrgCheckedvals.push(salesOrgSelectedvals.join(','));
					//this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
				}
				removeuncheckedValueFromSalesHierarchyAppUser(0, oldValueArr.join(','));
			}
		}
		else if (newValue != '' && oldValue == '') {
			isOldValuehigher = false;
			this.salesOrgCheckedvals.push(newValue);
			var salesOrgIds = $.unique((this.salesOrgCheckedvals.join(',')).split(','));
			this.salesOrgCheckedvals = [];
			this.salesOrgCheckedvals.push(salesOrgIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			isOldValuehigher = true;
			var salesOrgSelectedVals = this.salesOrgCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			var oldVal = [];
			for (var i = 0; i < salesOrgSelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesOrgSelectedVals[i] == oldSelectedVals[j]) {
						salesOrgSelectedVals.splice(i, 1);
						oldVal.push(oldSelectedVals[j]);
						break;
					}
				}
			}
			if (salesOrgSelectedVals.length > 0) {
				this.salesOrgCheckedvals = [];
				this.salesOrgCheckedvals.push(salesOrgSelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
				removeuncheckedValueFromSalesHierarchyAppUser(0, oldVal.join(','));
			}
			else {
				this.salesOrgCheckedvals = [];
				removeuncheckedValueFromSalesHierarchyAppUser(0, oldVal.join(','));
				//this.salesOfficeCheckedvals = [];
				//this.salesGroupCheckedvals = [];
				//this.salesTerritoryCheckedvals = [];
				//this.salesTelesellingTerritoryCheckedvals = [];	
			}

		}

		var store = '';
		if (this.salesOrgCheckedvals.length > 0 && isOldValuehigher == true) {
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		else if (this.salesOrgCheckedvals.length > 0 && isOldValuehigher == false) {
			var salesOfficeFilterData = this.responsibleforSalesHierarchyLevel_1.getStore();
			store = salesOfficeFilterData;
			var selectedItems = newValue.split(',');
			lookupIds = selectedItems;
			store.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});

			// For Sales Group
			var salesOfficeHierarchyIds = [];
			var len = store.data.length;
			for (var j = 0; j < len; j++) {
				var salesOfficeHierarchyId = store.getAt(j).data.LookupId;
				salesOfficeHierarchyIds.push(salesOfficeHierarchyId);
			}
			if (salesOfficeHierarchyIds.length > 0) {
				this.salesOfficeCheckedvals.push(salesOfficeHierarchyIds.join(','));
				var temp = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(temp.join(','));
			}
			var officeSelectedHierarchy = $.unique(this.salesOfficeCheckedvals.join(',').split(','));
			this.salesOfficeCheckedvals = [];
			this.salesOfficeCheckedvals.push(officeSelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');

			var storeSalesGroupFilterData = '';
			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			storeSalesGroupFilterData = salesGroupFilterData;
			var selectedItems = salesOfficeHierarchyIds;
			lookupIds = selectedItems;
			storeSalesGroupFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesGroupHierarchyIds = [];
			for (var k = 0; k < storeSalesGroupFilterData.data.length; k++) {
				var salesGroupHierarchyId = storeSalesGroupFilterData.getAt(k).data.LookupId;
				salesGroupHierarchyIds.push(salesGroupHierarchyId);
			}
			if (salesGroupHierarchyIds.length > 0) {
				this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));
				var temp = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(temp.join(','));
			}
			var groupSelectedHierarchy = $.unique(this.salesGroupCheckedvals.join(',').split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(groupSelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');

			// For Sales Territory
			var storeSalesTerritoryFilterData = '';
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			storeSalesTerritoryFilterData = salesTerritoryFilterData;
			var selectedItems = salesGroupHierarchyIds;
			lookupIds = selectedItems;

			storeSalesTerritoryFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesTerritoryHierarchyIds = [];
			for (var l = 0; l < storeSalesTerritoryFilterData.data.length; l++) {
				var salesTerritoryHierarchyId = storeSalesTerritoryFilterData.getAt(l).data.LookupId;
				salesTerritoryHierarchyIds.push(salesTerritoryHierarchyId);
			}
			if (salesTerritoryHierarchyIds.length > 0) {
				this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
				var temp = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(temp.join(','));
			}
			var territorySelectedHierarchy = $.unique(this.salesTerritoryCheckedvals.join(',').split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');

		}
		else {
			this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_0.setValue('');
			// For Sales Office
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_1.setValue('');
			// For Sales Group
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_2.setValue('');
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},

	onSalesOfficeChange: function (combo, newValue, oldValue) {

		isSalesOfficeChange = true;
		isOldValuehigher = false;
		var tempSO = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(tempSO.join(','));

		var tempSG = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(tempSG.join(','));

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		var lookupIds = [];
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				isOldValuehigher = false;
				this.salesOfficeCheckedvals.push(newValue);
				var salesOfficeIds = $.unique((this.salesOfficeCheckedvals.join(',')).split(','));
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(salesOfficeIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				isOldValuehigher = true;
				var oldVal = oldValueArr;
				var newVal = newValueArr;
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesOfficeSelectedvals = this.salesOfficeCheckedvals.join(',').split(',');
				for (var k = 0; k < salesOfficeSelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesOfficeSelectedvals[k] == oldValueArr[l]) {
							salesOfficeSelectedvals.splice(k, 1);
							break;
						}
					}
				}
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(salesOfficeSelectedvals.join(','))
				removeuncheckedValueFromSalesHierarchyAppUser(1, oldValueArr.join(','));
				//if (salesOfficeSelectedvals.length > 0) {
				//	this.salesOfficeCheckedvals = [];
				//	this.salesOfficeCheckedvals.push(salesOfficeSelectedvals.join(','));
				//}
			}
		}
		else if (newValue != '' && oldValue == '') {
			isOldValuehigher = false;
			this.salesOfficeCheckedvals.push(newValue);
			var salesOfficeIds = $.unique((this.salesOfficeCheckedvals.join(',')).split(','));
			this.salesOfficeCheckedvals = [];
			this.salesOfficeCheckedvals.push(salesOfficeIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			isOldValuehigher = true;
			var salesOfficeSelectedVals = this.salesOfficeCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			var oldVal = [];
			for (var i = 0; i < salesOfficeSelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesOfficeSelectedVals[i] == oldSelectedVals[j]) {
						salesOfficeSelectedVals.splice(i, 1);
						oldVal.push(oldSelectedVals[j]);
						break;
					}
				}
			}
			if (salesOfficeSelectedVals.length > 0) {
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(salesOfficeSelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
				removeuncheckedValueFromSalesHierarchyAppUser(1, oldVal.join(','));
			}
			else {
				this.salesOfficeCheckedvals = [];
				removeuncheckedValueFromSalesHierarchyAppUser(1, oldVal.join(','));
				//this.salesGroupCheckedvals = [];
				//this.salesTerritoryCheckedvals = [];
				//this.salesTelesellingTerritoryCheckedvals = [];

			}
		}

		var store = '';
		if (this.salesOfficeCheckedvals.length > 0 && isOldValuehigher == true) {
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		else if (this.salesOfficeCheckedvals.length > 0 && isOldValuehigher == false) {

			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			var selectedItems = newValue.split(',');
			lookupIds = selectedItems;
			salesGroupFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesGroupHierarchyIds = [];
			for (var k = 0; k < salesGroupFilterData.data.length; k++) {
				var salesGroupHierarchyId = salesGroupFilterData.getAt(k).data.LookupId;
				salesGroupHierarchyIds.push(salesGroupHierarchyId);
			}
			if (salesGroupHierarchyIds.length > 0) {
				this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));
				var temp = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(temp.join(','));
			}

			var groupSelectedHierarchy = $.unique(this.salesGroupCheckedvals.join(',').split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(groupSelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');

			// For Sales Territory
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var selectedItems = salesGroupHierarchyIds;
			lookupIds = selectedItems;

			salesTerritoryFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesTerritoryHierarchyIds = [];
			for (var l = 0; l < salesTerritoryFilterData.data.length; l++) {
				var salesTerritoryHierarchyId = salesTerritoryFilterData.getAt(l).data.LookupId;
				salesTerritoryHierarchyIds.push(salesTerritoryHierarchyId);
			}
			if (salesTerritoryHierarchyIds.length > 0) {
				this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
				var temp = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(temp.join(','));
			}
			var territorySelectedHierarchy = $.unique(this.salesTerritoryCheckedvals.join(',').split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			// For Sales Office
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_1.setValue('');
			// For Sales Group
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_2.setValue('');
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},

	onSalesGroupChange: function (combo, newValue, oldValue) {

		isSalesGroupChange = true;
		isOldValuehigher = false;
		var tempSG = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(tempSG.join(','));

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		var lookupIds = [];
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				isOldValuehigher = false;
				this.salesGroupCheckedvals.push(newValue);
				var salesGroupeIds = $.unique((this.salesGroupCheckedvals.join(',')).split(','));
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(salesGroupeIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				isOldValuehigher = true;
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesGroupSelectedvals = this.salesGroupCheckedvals.join(',').split(',');
				for (var k = 0; k < salesGroupSelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesGroupSelectedvals[k] == oldValueArr[l]) {
							salesGroupSelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salesGroupSelectedvals.length > 0) {
					this.salesGroupCheckedvals = [];
					this.salesGroupCheckedvals.push(salesGroupSelectedvals.join(','));
					removeuncheckedValueFromSalesHierarchyAppUser(2, oldValueArr.join(','));
				}
				else {
					this.salesGroupCheckedvals = [];
					this.salesTerritoryCheckedvals = [];
				}

			}
		}
		else if (newValue != '' && oldValue == '') {
			isOldValuehigher = false;
			this.salesGroupCheckedvals.push(newValue);
			var salesGroupIds = $.unique((this.salesGroupCheckedvals.join(',')).split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(salesGroupIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			isOldValuehigher = true;
			var salesGroupSelectedVals = this.salesGroupCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			var oldVal = [];
			for (var i = 0; i < salesGroupSelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesGroupSelectedVals[i] == oldSelectedVals[j]) {
						salesGroupSelectedVals.splice(i, 1);
						oldVal.push(oldSelectedVals[j]);
						break;
					}
				}
			}
			if (salesGroupSelectedVals.length > 0) {
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(salesGroupSelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesGroupCheckedvals.join(',') + '');
				removeuncheckedValueFromSalesHierarchyAppUser(2, oldVal.join(','));
			}
			else {
				this.salesGroupCheckedvals = [];
				removeuncheckedValueFromSalesHierarchyAppUser(2, oldVal.join(','));
				//this.salesTerritoryCheckedvals = [];
				//this.salesTelesellingTerritoryCheckedvals = [];

			}
		}

		var store = '';
		if (this.salesGroupCheckedvals.length > 0 && isOldValuehigher == true) {
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		else if (this.salesGroupCheckedvals.length > 0 && isOldValuehigher == false) {
			// For Sales Territory
			var storeSalesTerritoryFilterData = '';
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			storeSalesTerritoryFilterData = salesTerritoryFilterData;
			var selectedItems = newValue.split(',');
			lookupIds = selectedItems;

			storeSalesTerritoryFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesTerritoryHierarchyIds = [];
			for (var l = 0; l < storeSalesTerritoryFilterData.data.length; l++) {
				var salesTerritoryHierarchyId = storeSalesTerritoryFilterData.getAt(l).data.LookupId;
				salesTerritoryHierarchyIds.push(salesTerritoryHierarchyId);
			}
			if (salesTerritoryHierarchyIds.length > 0) {
				this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
				var temp = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(temp.join(','));
			}
			var territorySelectedHierarchy = $.unique(this.salesTerritoryCheckedvals.join(',').split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');

		}
		else {
			// For Sales Group
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_2.setValue('');
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},

	onSalesTerritoryChange: function (combo, newValue, oldValue) {

		isSalesTerritoryChange = true;

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				this.salesTerritoryCheckedvals.push(newValue);
				var salesTerritoryIds = $.unique((this.salesTerritoryCheckedvals.join(',')).split(','));
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(salesTerritoryIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesTerritorySelectedvals = this.salesTerritoryCheckedvals.join(',').split(',');
				for (var k = 0; k < salesTerritorySelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesTerritorySelectedvals[k] == oldValueArr[l]) {
							salesTerritorySelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salesTerritorySelectedvals.length > 0) {
					this.salesTerritoryCheckedvals = [];
					this.salesTerritoryCheckedvals.push(salesTerritorySelectedvals.join(','));
					this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
				}
				else {

					this.salesTerritoryCheckedvals = [];
				}
			}
		}
		else if (newValue != '' && oldValue == '') {
			this.salesTerritoryCheckedvals.push(newValue);
			var salesTerritoryIds = $.unique((this.salesTerritoryCheckedvals.join(',')).split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(salesTerritoryIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			var salesTerritorySelectedVals = this.salesTerritoryCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			for (var i = 0; i < salesTerritorySelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesTerritorySelectedVals[i] == oldSelectedVals[j]) {
						salesTerritorySelectedVals.splice(i, 1);
						break;
					}
				}
			}
			if (salesTerritorySelectedVals.length > 0) {
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(salesTerritorySelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
			else {
				this.salesTerritoryCheckedvals = [];
			}
		}

		if (this.salesTerritoryCheckedvals.length == 0) {
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('');
		}

	},

	onTeleSellingSalesChange: function (combo, newValue, oldValue) {
		isTeleSellingChange = true;
		var tempTST = this.salesTelesellingTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});

		this.salesTelesellingTerritoryCheckedvals = [];
		this.salesTelesellingTerritoryCheckedvals.push(tempTST.join(','));

		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				this.salesTelesellingTerritoryCheckedvals.push(newValue);
				var salessalesTelesellingTerritoryIds = $.unique((this.salesTelesellingTerritoryCheckedvals.join(',')).split(','));
				this.salesTelesellingTerritoryCheckedvals = [];
				this.salesTelesellingTerritoryCheckedvals.push(salessalesTelesellingTerritoryIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salessalessalesTelesellingTerritorySelectedvals = this.salesTelesellingTerritoryCheckedvals.join(',').split(',');
				for (var k = 0; k < salessalessalesTelesellingTerritorySelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salessalessalesTelesellingTerritorySelectedvals[k] == oldValueArr[l]) {
							salessalessalesTelesellingTerritorySelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salessalessalesTelesellingTerritorySelectedvals.length > 0) {
					this.salesTelesellingTerritoryCheckedvals = [];
					this.salesTelesellingTerritoryCheckedvals.push(salessalessalesTelesellingTerritorySelectedvals.join(','));
					this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
				}
				else {
					this.salesTerritoryCheckedvals = [];
				}
			}
		}
		else if (newValue != '' && oldValue == '') {
			this.salesTelesellingTerritoryCheckedvals.push(newValue);
			var salesTelesellingTerritoryIds = $.unique((this.salesTelesellingTerritoryCheckedvals.join(',')).split(','));
			this.salesTelesellingTerritoryCheckedvals = [];
			this.salesTelesellingTerritoryCheckedvals.push(salesTelesellingTerritoryIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			var salesTelesellingTerritorySelectedVals = this.salesTelesellingTerritoryCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			for (var i = 0; i < salesTelesellingTerritorySelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesTelesellingTerritorySelectedVals[i] == oldSelectedVals[j]) {
						salesTelesellingTerritorySelectedVals.splice(i, 1);
						break;
					}
				}
			}
			if (salesTelesellingTerritorySelectedVals.length > 0) {
				this.salesTelesellingTerritoryCheckedvals = [];
				this.salesTelesellingTerritoryCheckedvals.push(salesTelesellingTerritorySelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
			}
			else {
				this.salesTelesellingTerritoryCheckedvals = [];
			}
		}

		if (this.salesTelesellingTerritoryCheckedvals.length == 0) {
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
		}

	},

	onAddLocationButton: function (val) {
		var params = this.outletGrid.store.lastOptions.params;
		params.action = 'addLocation';
		if (!this.mask) {
			var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/AppUser.ashx',
			params: params,
			success: this.onSuccess,
			failure: this.onFailure,
			scope: this
		});
	},

	onSuccess: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.userLocationGrid.store.reload();
	},

	onFailure: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveAllButton: function () {
		var params = this.userLocationGrid.getStore().lastOptions.params;
		var selections = this.userLocationGrid.getStore().getTotalCount();
		params.action = 'deleteLocation';
		if (selections === 0) {
			DA.Util.ShowError('Delete', 'Failed: No records selected');
		}
		else {
			if (!this.mask) {
				var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/AppUser.ashx',
				params: params,
				success: this.onRemovedAll,
				failure: this.onRemovedNone,
				scope: this
			});
		}
	},

	onRemovedAll: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.userLocationGrid.store.reload();
	},

	onRemovedNone: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveButton: function () {
		var sm = this.userLocationGrid.getSelectionModel();
		var rowSelectionMode = false;
		var selections = [];
		var store = this.userLocationGrid.getStore();
		var msg;

		// if row selection mode, all the selections can be deleted
		if (sm.getSelections !== undefined) {
			rowSelectionMode = true;
			selections = sm.getSelections();
			msg = "Are you sure you want to remove " + selections.length + " selected records?";
		} else {
			var selectedCell = sm.getSelectedCell();
			if (selectedCell) {
				var rowIndex = selectedCell[0];
				var record = store.getAt(rowIndex);
				selections.push(record);
				msg = "Are you sure you want to remove this record?";
			}
		}
		if (selections.length === 0) {
			DA.Util.ShowError('Delete', 'Failed: No records selected');
		} else {
			Ext.Msg.confirm("Delete", msg, function (btn) {
				var i, len;
				if (btn == 'yes') {
					if (this.gridIsLocal || this.disableHardDelete === true) {
						for (i = 0, len = selections.length; i < len; i++) {
							store.remove(selections[i]);
						}
					} else {
						var Ids = [];
						for (var i = 0, len = selections.length; i < len; i++) {
							Ids.push(selections[i].json[0]);
						}
						Ids = Ids.join(",");
						ExtHelper.GenericCall({
							url: EH.BuildUrl(this.userLocationGrid.controller),
							params: Ext.apply({ action: 'delete', Ids: Ids }, this.baseParams),
							title: 'Delete',
							handleSuccess: false,
							success: function () {
								for (var i = 0; i < selections.length; i++) {
									store.remove(selections[i]);
									this.userLocationGrid.store.reload();
								}
							},
							scope: this
						});
					}
				}
			}, this);
		}
	},


	//For : Add Mass Outlets to User
	FileUploader: {
		userLocationMassGrid: null,
		Show: function (options) {
			options = options || {};
			Ext.applyIf(options, {
				fieldLabel: 'Select files',
				allowedTypes: []
			});
			var url = EH.BuildUrl('OutletsToUser');

			if (!this.win) {
				var uploadFile = new Ext.form.FileUploadField({
					fieldLabel: options.fieldLabel,
					width: 250,
					name: 'file',
					multiple: false,
					vtype: 'fileUploadExcel',
					allowBlank: false
				});
				uploadFile.on('fileselected', this.showFileList, this);
				// create form panel
				var formPanel = new Ext.form.FormPanel({
					labelWidth: 100,
					autoScroll: true,
					bodyStyle: "padding:5px;",
					fileUpload: true,
					url: url,
					items: [uploadFile, { itemId: 'selectedFilesList', xtype: 'box', autoEl: { html: '', width: 90 } }]
				});
				// define window
				var window = new Ext.Window({
					title: 'Upload',
					width: 500,
					height: 150,
					layout: 'fit',
					modal: true,
					plain: true,
					closeAction: 'hide',
					items: formPanel,
					buttons: [{
						text: 'Upload',
						handler: function () {
							// check form value
							if (formPanel.form.isValid()) {
								var params = { action: 'AddMassOutletToUser', UserId: Cooler.AppUser.activeRecordId };
								formPanel.form.submit({
									params: params,
									waitMsg: 'Uploading...',
									failure: this.onFailure,
									success: this.onSuccess,
									scope: this
								});
							} else {
								Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
							}
						},
						scope: this
					}]
				});
				this.formPanel = formPanel;
				this.win = window;
			}
			this.options = options;
			this.formPanel.form.reset();
			this.win.show();
			this.formPanel.items.get('selectedFilesList').el.update('') // clearing Html of widows
		},
		showFileList: function (list) {
			var listContainer = this.formPanel.items.get('selectedFilesList');
			var totalFiles = list.getValue().split(',');
			var html = '';
			for (var i = 0; i < totalFiles.length; i++) { // starting from 1 to not select first path that contain fakepath
				html += '<li>' + totalFiles[i] + '</li>';
			}
			html = '<ul>' + html + '</ul>';
			listContainer.el.update(html);
		},
		onFailure: function (form, action) {
			Ext.MessageBox.alert('Error', action.result.info);
		},

		onSuccess: function (form, action) {
			this.win.hide();
			var fileName = this.formPanel.getComponent(0).getValue().replace('C:\\fakepath\\', '');
			Ext.Msg.alert('Success', Ext.decode(action.response.responseText).message);
			this.userLocationMassGrid.store.reload();
		}
	},

	//End : Add Mass Outlets to User

	CreateFormPanel: function (config) {
		var addPromotionButton = new Ext.Button({ text: 'Add To User Outlet', handler: this.onAddLocationButton, scope: this });
		var addMassOutletsTouser = new Ext.Button({ text: 'Add to User Outlet MASS', handler: function () { this.FileUploader.Show() }, scope: this });
		var tbarItems = [addPromotionButton];
		var outletGrid = Cooler.LocationType.UserOutlet.createGrid({ title: 'Outlet', editable: false, tbar: [], showDefaultButtons: false });
		outletGrid.topToolbar.splice(0, 0, addMassOutletsTouser);
		outletGrid.topToolbar.splice(0, 0, addPromotionButton);
		this.outletGrid = outletGrid;
		var removeAllButton = new Ext.Button({ text: 'Remove All', handler: this.onRemoveAllButton, scope: this, iconCls: 'delete' });
		var removeButton = new Ext.Button({ text: 'Remove', handler: this.onRemoveButton, scope: this, iconCls: 'delete' });
		var userLocationGrid = Cooler.UserLocation.createGrid({ title: 'User Outlet', editable: false, tbar: [], showDefaultButtons: true });
		var tbarItems = [removeAllButton, removeButton];
		userLocationGrid.topToolbar.splice(1, 0, removeAllButton);
		userLocationGrid.topToolbar.splice(1, 0, removeButton);
		this.userLocationGrid = userLocationGrid;
		var grids = [outletGrid, userLocationGrid];
		this.childGrids = grids;
		this.FileUploader.userLocationMassGrid = this.userLocationGrid;
		Ext.apply(config, {
			region: 'north',
			height: 400,
			width: 900,
			autoScroll: true
		});
		var territoryDetailGrid = Cooler.TerritoryDetail.createGrid();
		this.territoryDetailGrid = territoryDetailGrid;
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			enableTabScroll: true,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			items: [territoryDetailGrid, outletGrid, userLocationGrid]
		});

		this.formPanel = new Ext.FormPanel(config);
		this.on('beforeLoad', function (param) {
			this.salesHierarchyArray = [];
			this.salesOrgCheckedvals = [];
			this.salesOfficeCheckedvals = [];
			this.salesGroupCheckedvals = [];
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals = [];
			this.responsibleSalesHierarchyLevel_0.setValue('');
			this.responsibleSalesHierarchyLevel_1.setValue('');
			this.responsibleSalesHierarchyLevel_2.setValue('');
			this.responsibleSalesHierarchyLevel_3.setValue('');
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
			this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			isNewOrEditedRecord = param.activeRecordId;					// (isNewOrEditedRecord == 0 new record), (isNewOrEditedRecord > 0 edited record)
			this.preferedNotificationTypeForStore.getStore().load();
			this.responsibleforCountryIdForStore.getStore().load();
			if (!this.mask) {
				var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			if (this.isLimitLocation) {
				this.mask.show();
			}
			this.responsibleforSalesHierarchyLevel_0.getStore().load();
			this.tagsPanel.removeAllItems();
		});

		this.on('beforeSave', this.onBeforeSave, this);
		this.on('dataLoaded', function (locationForm, data) {
		if (locationForm.activeRecordId == 0) {
				this.preferedNotificationTypeCombo.setValue('5232'); //Default Value DND
			}
			this.salesHierarchyArray = [];
			if (data != '' && data != undefined) {
				this.salesHierarchyValues = data.data.SalesHierarchyIds;
			}
			var salesHierarchyIds = data.data.SalesHierarchyIds;
			if (salesHierarchyIds == '' || salesHierarchyIds == undefined) {
				this.salesHierarchyValues = "";
				this.salesHierarchyArray = [];
				this.salesOrgCheckedvals = [];
				this.salesOfficeCheckedvals = [];
				this.salesGroupCheckedvals = [];
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals = [];
				this.responsibleSalesHierarchyLevel_0.setValue('');
				this.responsibleSalesHierarchyLevel_1.setValue('');
				this.responsibleSalesHierarchyLevel_2.setValue('');
				this.responsibleSalesHierarchyLevel_3.setValue('');
				this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
				this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
				this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
				this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
				this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
				this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			}
			if (salesHierarchyIds != null && salesHierarchyIds != undefined) {
				if (salesHierarchyIds.length > 0) {
					// For Sales Organization
					this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
					this.responsibleSalesHierarchyLevel_0.setValue('');
					this.responsibleSalesHierarchyLevel_0.setValue('' + salesHierarchyIds + '');
					this.salesOrgCheckedvals = [];
					this.salesOrgCheckedvals.push(this.responsibleSalesHierarchyLevel_0.getValue());
					// For Sales Office
					this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
					this.responsibleSalesHierarchyLevel_1.setValue('');
					this.responsibleSalesHierarchyLevel_1.setValue('' + salesHierarchyIds + '');
					this.salesOfficeCheckedvals = [];
					this.salesOfficeCheckedvals.push(this.responsibleSalesHierarchyLevel_1.getValue());
					// For Sales Group
					this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
					this.responsibleSalesHierarchyLevel_2.setValue('');
					this.responsibleSalesHierarchyLevel_2.setValue('' + salesHierarchyIds + '');
					this.salesGroupCheckedvals = [];
					this.salesGroupCheckedvals.push(this.responsibleSalesHierarchyLevel_2.getValue());
					// For Sales Territory
					this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
					this.responsibleSalesHierarchyLevel_3.setValue('');
					this.responsibleSalesHierarchyLevel_3.setValue('' + salesHierarchyIds + '');
					this.salesTerritoryCheckedvals = [];
					this.salesTerritoryCheckedvals.push(this.responsibleSalesHierarchyLevel_3.getValue());
					// For TeleSelling Sales Hierarchy 
					this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
					this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
					this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + salesHierarchyIds + '');
					this.salesTelesellingTerritoryCheckedvals = [];
					this.salesTelesellingTerritoryCheckedvals.push(this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getValue());
				}
			}
			this.dataLoaded = true;
			this.lastLoadedValue = '';
			if (this.isLimitLocation) {
				this.responsibleforSalesHierarchyLevel_0.getStore().load();
			}
			this.loadTags(this.tagsPanel, data);
			if (this.salesHierarchyValues) {
				this.salesHierarchyArray = this.salesHierarchyValues.split(',').map(Number);
			}
			this.loadTerritoryGrid(this.salesHierarchyValues, true);

			var gridToClear = [this.outletGrid, this.userLocationGrid], index, grid, button;
			for (var i = 0, len = gridToClear.length; i < len; i++) {
				grid = gridToClear[i];
				if (grid.topToolbar.items) {
					index = grid.topToolbar.items.findIndex('text', 'Remove Filter');
					if (index > -1) {
						button = grid.topToolbar.items.get(index);
						button.handler.call(button.scope, button);
					}
				}
			}
			var userLocationGridStore = this.userLocationGrid.getStore();
			if (data != '' && data != undefined) {
				userLocationGridStore.baseParams.UserId = data.data.Id;
			}
			userLocationGridStore.load();
			outletGrid.getStore().load();
			if (this.isLimitLocation) {
				this.territoryDetailGrid.setDisabled(false);
				this.outletGrid.setDisabled(false);
				this.userLocationGrid.setDisabled(false);
			}
			else {
				this.territoryDetailGrid.setDisabled(true);
				this.outletGrid.setDisabled(true);
				this.userLocationGrid.setDisabled(true);
			}
		});

		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 650,
			width: 1020,
			items: [this.formPanel, tabPanel]
		});
	},
	hideCountryOnGrid: function (combo, record, oldRecord) {
		if (record === Cooler.Enums.Role.ClientAdmin) {
			this.countryCombo.setValue(0);
		}
	},

	onBeforeSave: function (AppUserFrom, params, options) {
		if (this.grid.getSelectionModel().getSelected() != undefined) {
			var hierarchyData = this.grid.getSelectionModel().getSelected().data;
			if (hierarchyData != undefined || hierarchyData != null) {
				//FOR OLD VALUES COMES FROM GRID
				var userSalesHierarchyIds = hierarchyData.UserSalesHierarchyIds;
			}
		}
		//FOR NEW VALUES SELECTED BY USERS
		var form = AppUserFrom.formPanel.getForm();

		var salesOrganizationIds = this.salesOrgCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		}).join(',');
		var salesOfficeIds = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		}).join(',');
		var salesGroupIds = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		}).join(',');
		var salesTerritoryIds = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		}).join(',');
		var teleSellingSalesHierarchyIds = this.salesTelesellingTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		}).join(','); //form.findField('TeleSellingSalesHierarchyIds').getValue();

		var ids = [];
		if (salesOrganizationIds.length > 0) {
			ids.push(salesOrganizationIds);
		}
		if (salesOfficeIds.length > 0) {
			ids.push(salesOfficeIds);
		}
		if (salesGroupIds.length > 0) {
			ids.push(salesGroupIds);
		}
		if (salesTerritoryIds.length > 0) {
			ids.push(salesTerritoryIds);
		}
		if (teleSellingSalesHierarchyIds.length > 0) {
			ids.push(teleSellingSalesHierarchyIds);
		}

		ids = ids.filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		ids = $.unique(ids).join(',');
		this.salesHierarchyIds.setValue(ids);

		this.saveTags(this.tagsPanel, params);
	},

	arraysEqual: function (arr1, arr2) {
		if (arr1.length !== arr2.length)
			return false;
		for (var i = arr1.length; i--;) {
			if (arr1[i] !== arr2[i])
				return false;
		}
		return true;
	},

	onCheckChange: function (node, checked) {

		this.childNodeCount += node.childNodes.length;
		node.eachChild(function (child) {
			child.ui.toggleCheck(checked);
		}, this);
		this.processNode++;
		var ids = '';
		this.salesHierarchyIds.setValue(ids);
		if (this.processNode == this.childNodeCount) {
			this.childNodeCount = 0;
			this.processNode = -1;
			this.loadTerritoryGrid(ids, true);
		}
	},

	onSalesHierarchyClick: function () {
		Cooler.SalesHierarchyTreeView.show({ action: 'getSalesHierarchy', title: 'Sales Hierarchy', subTitle: 'Grouping by Sales Hierarchy' });
	},

	onSearchSalesOrganizationDataKeyUp: function (field) {
		var salesHierarchy_Ids = this.salesOrgCheckedvals.join(',');
		var value = field.getValue();
		var store = this.responsibleforSalesHierarchyLevel_0.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		}

		var orgFilterSelectvalue = this.responsibleSalesHierarchyLevel_0.getValue();

		if (value == "" || orgFilterSelectvalue == "") {
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			return;
		}
		//For Sales Office
		if (orgFilterSelectvalue != '') {
			var salesOfficeFilterData = this.responsibleforSalesHierarchyLevel_1.getStore();
			var salesOfficeStore = salesOfficeFilterData;
			var selectedIds = orgFilterSelectvalue.split(',');

			var arr = selectedIds;
			var temp = arr.filter(function (x) {
				return (x !== (undefined || null || ''));
			});
			arr = temp;
			lookupIds = temp;
			if (lookupIds[0] != '' && lookupIds[0] != null) {
				salesOfficeStore.filterBy(function (record, id) {
					var len = lookupIds.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsVal = [];
				var len = salesOfficeStore.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = salesOfficeStore.getAt(j).data.LookupId;
					salesHierarchyIdsVal.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			}
			//For Sales Group
			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			var storeGroup = salesGroupFilterData;
			var selectedHierarchyId = salesHierarchyIdsVal;
			var selectedHierarchyItems = selectedHierarchyId;
			lookupIds_2 = selectedHierarchyItems;
			if (lookupIds_2 != '' && lookupIds_2 != null && lookupIds_2 != undefined) {
				storeGroup.filterBy(function (record, id) {
					var len = lookupIds_2.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds_2[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_2 = [];
				var length = storeGroup.data.length;
				for (var j = 0; j < length; j++) {
					var salesHierarchyId = storeGroup.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_2.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			}
			//For Sales Territory
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var storeTerritory = salesTerritoryFilterData;
			var selectedstoreTerritoryId = salesHierarchyIdsLevel_2;
			var selectedTerritoryItems = selectedstoreTerritoryId;
			lookupIds_3 = selectedTerritoryItems;
			if (lookupIds_3 != '' && lookupIds_3 != null) {
				storeTerritory.filterBy(function (record, id) {
					var lookupIdsLen = lookupIds_3.length;
					for (var i = 0; i < lookupIdsLen; i++) {
						if (record.get('CustomValue') == lookupIds_3[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_3 = [];
				var len = storeTerritory.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = storeTerritory.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_3.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
		}
	},

	onSearchSalesOfficeDataKeyUp: function (field) {
		var salesHierarchy_Ids = this.salesOfficeCheckedvals.join(',');
		var value = field.getValue();
		var store = this.responsibleforSalesHierarchyLevel_1.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		}
		var officeFilterSelectvalue = this.responsibleSalesHierarchyLevel_1.getValue();
		if (value == "" || officeFilterSelectvalue == "") {
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			return;
		}
		//For Sales Office
		if (officeFilterSelectvalue != "") {
			//For Sales Group
			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			var storeGroup = salesGroupFilterData;
			var selectedHierarchyId = officeFilterSelectvalue.split(',');
			var selectedHierarchyItems = selectedHierarchyId;

			selectedHierarchyItems = selectedHierarchyItems.filter(function (x) {
				return (x !== (undefined || null || ''));
			});

			lookupIds_2 = selectedHierarchyItems;
			if (lookupIds_2 != '' && lookupIds_2 != null && lookupIds_2 != undefined) {
				storeGroup.filterBy(function (record, id) {
					var len = lookupIds_2.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds_2[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_2 = [];
				var length = storeGroup.data.length;
				for (var j = 0; j < length; j++) {
					var salesHierarchyId = storeGroup.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_2.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			}
			//For Sales Territory
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var storeTerritory = salesTerritoryFilterData;
			var selectedstoreTerritoryId = salesHierarchyIdsLevel_2;
			var selectedTerritoryItems = selectedstoreTerritoryId;
			lookupIds_3 = selectedTerritoryItems;
			if (lookupIds_3 != '' && lookupIds_3 != null) {
				storeTerritory.filterBy(function (record, id) {
					var lookupIdsLen = lookupIds_3.length;
					for (var i = 0; i < lookupIdsLen; i++) {
						if (record.get('CustomValue') == lookupIds_3[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_3 = [];
				var len = storeTerritory.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = storeTerritory.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_3.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
		}
	},

	onSearchSalesGroupDataKeyUp: function (field) {
		var salesHierarchy_Ids = this.salesGroupCheckedvals;
		var value = field.getValue();
		store = this.responsibleforSalesHierarchyLevel_2.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		var groupFilterSelectvalue = this.responsibleSalesHierarchyLevel_2.getValue();
		if (value == "" || groupFilterSelectvalue == "") {
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			return;
		}

		if (groupFilterSelectvalue != "") {
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var store = salesTerritoryFilterData;
			var selectedId = groupFilterSelectvalue.split(',');
			var arr = selectedId;
			var temp = arr.filter(function (x) {
				return (x !== (undefined || null || ''));
			});
			arr = temp;
			lookupIds = temp;
			if (lookupIds[0] != '' && lookupIds[0] != null) {
				store.filterBy(function (record, id) {
					var len = lookupIds.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds[i].toString()) {
							return true;
						}
						if (record.get('LookupId') == lookupIds[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsVal = [];
				var len = store.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = store.getAt(j).data.LookupId;
					salesHierarchyIdsVal.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
		}
	},

	onSearchSalesTerritoryDataKeyUp: function (field) {
		var value = field.getValue();
		store = this.responsibleforSalesHierarchyLevel_3.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
		}
		if (value == "") {
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
		}
	},

	onSearchTeleSellingSalesDataDataKeyUp: function (field) {
		var value = field.getValue();
		store = this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
		}
		if (value == "") {
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
		}
	},

	onRoleComboSelect: function (combo, record) {
		var isLimitLocation = !Ext.isEmpty(record) && JSON.parse(record.get('CustomStringValue'));
		this.isLimitLocation = isLimitLocation;
		var isLimitCountry = !Ext.isEmpty(record) && JSON.parse(record.get('SystemValue'));
		this.responsibleSalesHierarchyLevel_0.setFieldVisible(isLimitLocation);
		this.responsibleSalesHierarchyLevel_1.setFieldVisible(isLimitLocation);
		this.responsibleSalesHierarchyLevel_2.setFieldVisible(isLimitLocation);
		this.responsibleSalesHierarchyLevel_3.setFieldVisible(isLimitLocation);
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setFieldVisible(isLimitLocation);
		if (isLimitLocation || isLimitCountry) {
			this.responsibleforCountryIdCombo.setFieldVisible(true);			
			this.countryCombo.setFieldVisible(true);
		} else {
			this.responsibleforCountryIdCombo.setFieldVisible(false);
			this.countryCombo.setFieldVisible(false);
		}

		this.territoryDetailGrid.setDisabled(!isLimitLocation);
		this.outletGrid.setDisabled(!isLimitLocation);
		this.userLocationGrid.setDisabled(!isLimitLocation);

		this.selectAllButtonResponsibleSalesHierarchyLevel_0.setVisible(isLimitLocation);
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_0.setVisible(isLimitLocation);
		this.searchSalesOrganizationData.setFieldVisible(isLimitLocation);

		this.selectAllButtonResponsibleSalesHierarchyLevel_1.setVisible(isLimitLocation);
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_1.setVisible(isLimitLocation);
		this.searchSalesOfficeData.setFieldVisible(isLimitLocation);

		this.selectAllButtonResponsibleSalesHierarchyLevel_2.setVisible(isLimitLocation);
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_2.setVisible(isLimitLocation);
		this.searchSalesGroupData.setFieldVisible(isLimitLocation);


		this.selectAllButtonResponsibleSalesHierarchyLevel_3.setVisible(isLimitLocation);
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_3.setVisible(isLimitLocation);
		this.searchSalesTerritoryData.setFieldVisible(isLimitLocation);

		this.selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setVisible(isLimitLocation);
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setVisible(isLimitLocation);
		this.searchTeleSellingSalesData.setFieldVisible(isLimitLocation);

		if (!isLimitLocation) {
			this.territoryDetailGrid.getStore().removeAll();
		}
		if (this.isLimitLocation) {
			this.responsibleforSalesHierarchyLevel_0.getStore().load();
		}
	},

	loadTerritoryGrid: function (ids, isLoadBasedId) {
		var territoryDetailGridStore = this.territoryDetailGrid.getStore();
		this.currentValue = isLoadBasedId ? ids ? ids : '-1' : this.salesHierarchyValues;
		territoryDetailGridStore.baseParams.ids = this.currentValue;
		if (!this.lastLoadedValue || !(this.arraysEqual(this.lastLoadedValue.split(',').map(Number), this.currentValue.split(',').map(Number)))) {
			territoryDetailGridStore.load();
		}
		else {
			territoryDetailGridStore.removeAll();
		}
		this.lastLoadedValue = this.currentValue;
	},

	loadSalesOrganization: function (a) {
		if (!this.mask) {
			var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		if (this.isLimitLocation) {
			this.mask.show();
			this.responsibleforSalesHierarchyLevel_1.getStore().load();
		}
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_0.setValue('');
			this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesHierarchyValues + '');
			var salesOrgIds = $.unique((this.responsibleSalesHierarchyLevel_0.getValue()).split(','));
			this.salesOrgCheckedvals = [];
			this.salesOrgCheckedvals.push(salesOrgIds.join(','));
			//this.salesOrgCheckedvals.push(this.responsibleSalesHierarchyLevel_0.getValue());	
		}
		else {
			this.salesOrgCheckedvals = [];
			this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_0.setValue('');
		}
	},
	loadSalesOffice: function () {
		if (this.isLimitLocation) {
			this.responsibleforSalesHierarchyLevel_2.getStore().load();
		}
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_1.setValue('');
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesHierarchyValues + '');
			var officeSelectedHierarchy = $.unique(this.responsibleSalesHierarchyLevel_1.getValue().split(','));
			this.salesOfficeCheckedvals = [];
			this.salesOfficeCheckedvals.push(officeSelectedHierarchy.join(','));
			//this.salesOfficeCheckedvals.push(this.responsibleSalesHierarchyLevel_1.getValue());
		}
		else {
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_1.setValue('');
		}
	},
	loadSalesGroup: function () {
		if (this.isLimitLocation) {
			this.responsibleforSalesHierarchyLevel_3.getStore().load();
		}
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_2.setValue('');
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesHierarchyValues + '');
			var groupSelectedHierarchy = $.unique(this.responsibleSalesHierarchyLevel_2.getValue().split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(groupSelectedHierarchy.join(','));
			//this.salesGroupCheckedvals.push(this.responsibleSalesHierarchyLevel_2.getValue());	
		}
		else {
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_2.setValue('');
		}
	},
	loadSalesTerritory: function () {
		if (this.isLimitLocation) {
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().load();
		}
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_3.setValue('');
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesHierarchyValues + '');
			var territorySelectedHierarchy = $.unique(this.responsibleSalesHierarchyLevel_3.getValue().split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			//this.salesTerritoryCheckedvals.push(this.responsibleSalesHierarchyLevel_3.getValue());
		}
		else {
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},
	loadTeleSellingSalesHierarchy: function () {
		this.mask.show();
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesHierarchyValues + '');
			var salessalesTelesellingTerritoryIds = $.unique((this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getValue()).split(','));
			this.salesTelesellingTerritoryCheckedvals = [];
			this.salesTelesellingTerritoryCheckedvals.push(salessalesTelesellingTerritoryIds.join(','));
		}
		else {
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
		}
		this.mask.hide();
	},
	loadCountryCombo: function () {
		var countryId = Number(DA.Security.info.Tags.CountryId);
		if (countryId != 0) {
			var countryCombo = this.countryCombo;
			ExtHelper.SetComboValue(countryCombo, countryId);
			//countryCombo.setDisabled(true);
		}
	},
	loadClientCombo: function () {
		var clientId = Number(DA.Security.info.Tags.ClientId);
		if (clientId != 0) {
			var clientCombo = this.clientCombo;
			ExtHelper.SetComboValue(clientCombo, clientId);
			clientCombo.setDisabled(true);
		}
	}

});

function removeuncheckedValueFromSalesHierarchyAppUser(salesHieraarchyLevel, salesHierarchyValue) {
	if (salesHieraarchyLevel == 0) {
		var salesOfficeTempIds = [];
		var salesGroupTempIds = [];
		var salesTerritoryTempIds = [];
		var salesOfficeStore = Cooler.AppUser.responsibleforSalesHierarchyLevel_1.getStore();
		var salesGroupStore = Cooler.AppUser.responsibleforSalesHierarchyLevel_2.getStore();
		var salesTerritoryeStore = Cooler.AppUser.responsibleforSalesHierarchyLevel_3.getStore();
		salesOfficeStore.clearFilter();
		salesGroupStore.clearFilter();
		salesTerritoryeStore.clearFilter();
		var vals = salesHierarchyValue.split(',');

		salesOfficeStore.each(function (record) {
			for (var i = 0; i < vals.length; i++) {
				if (record.get("CustomValue") == vals[i]) {
					salesOfficeTempIds.push(record.data.LookupId.toString());
				}
			}
		}, this);
		if (salesOfficeTempIds.length > 0) {
			salesGroupStore.each(function (record) {
				var vals = salesOfficeTempIds;
				for (var i = 0; i < vals.length; i++) {
					if (record.get("CustomValue") == vals[i]) {
						salesGroupTempIds.push(record.data.LookupId.toString());
					}
				}
			}, this);
			if (salesGroupTempIds.length > 0) {
				salesTerritoryeStore.each(function (record) {
					var vals = salesGroupTempIds;
					for (var i = 0; i < vals.length; i++) {
						if (record.get("CustomValue") == vals[i]) {
							salesTerritoryTempIds.push(record.data.LookupId.toString());
						}
					}
				}, this);
			}
		}

		var officeSelectedIds = Cooler.AppUser.salesOfficeCheckedvals.join(',').split(',').filter(function (item) {
			return salesOfficeTempIds.indexOf(item) === -1;
		});
		var groupSelectedIds = Cooler.AppUser.salesGroupCheckedvals.join(',').split(',').filter(function (item) {
			return salesGroupTempIds.indexOf(item) === -1;
		});
		var territorySelectedIds = Cooler.AppUser.salesTerritoryCheckedvals.join(',').split(',').filter(function (item) {
			return salesTerritoryTempIds.indexOf(item) === -1;
		});
		Cooler.AppUser.salesOfficeCheckedvals = [];
		Cooler.AppUser.salesGroupCheckedvals = [];
		Cooler.AppUser.salesTerritoryCheckedvals = [];
		if (officeSelectedIds.length > 0) {
			Cooler.AppUser.salesOfficeCheckedvals.push(officeSelectedIds.join(','));
			Cooler.AppUser.responsibleSalesHierarchyLevel_1.setValue('' + Cooler.AppUser.salesOfficeCheckedvals.join(',') + '');
		}
		else {
			Cooler.AppUser.salesOfficeCheckedvals = [];
			Cooler.AppUser.responsibleSalesHierarchyLevel_1.setValue('' + Cooler.AppUser.salesOfficeCheckedvals.join(',') + '');
		}
		if (groupSelectedIds.length > 0) {
			Cooler.AppUser.salesGroupCheckedvals.push(groupSelectedIds.join(','));
			Cooler.AppUser.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AppUser.salesGroupCheckedvals.join(',') + '');
		}
		else {
			Cooler.AppUser.salesGroupCheckedvals = [];
			Cooler.AppUser.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AppUser.salesGroupCheckedvals.join(',') + '');
		}
		if (territorySelectedIds.length > 0) {
			Cooler.AppUser.salesTerritoryCheckedvals.push(territorySelectedIds.join(','));
			Cooler.AppUser.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AppUser.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			Cooler.AppUser.salesTerritoryCheckedvals = [];
			Cooler.AppUser.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AppUser.salesTerritoryCheckedvals.join(',') + '');
		}
	}
	else if (salesHieraarchyLevel == 1) {
		var salesGroupTempIds = [];
		var salesTerritoryTempIds = [];
		var salesGroupStore = Cooler.AppUser.responsibleforSalesHierarchyLevel_2.getStore();
		var salesTerritoryeStore = Cooler.AppUser.responsibleforSalesHierarchyLevel_3.getStore();

		salesGroupStore.clearFilter();
		salesTerritoryeStore.clearFilter();
		var vals = salesHierarchyValue.split(',');

		salesGroupStore.each(function (record) {
			for (var i = 0; i < vals.length; i++) {
				if (record.get("CustomValue") == vals[i]) {
					salesGroupTempIds.push(record.data.LookupId.toString());
				}
			}
		}, this);
		if (salesGroupTempIds.length > 0) {
			salesTerritoryeStore.each(function (record) {
				var vals = salesGroupTempIds;
				for (var i = 0; i < vals.length; i++) {
					if (record.get("CustomValue") == vals[i]) {
						salesTerritoryTempIds.push(record.data.LookupId.toString());
					}
				}
			}, this);
		}


		var groupSelectedIds = Cooler.AppUser.salesGroupCheckedvals.join(',').split(',').filter(function (item) {
			return salesGroupTempIds.indexOf(item) === -1;
		});
		var territorySelectedIds = Cooler.AppUser.salesTerritoryCheckedvals.join(',').split(',').filter(function (item) {
			return salesTerritoryTempIds.indexOf(item) === -1;
		});

		Cooler.AppUser.salesGroupCheckedvals = [];
		Cooler.AppUser.salesTerritoryCheckedvals = [];

		if (groupSelectedIds.length > 0) {
			Cooler.AppUser.salesGroupCheckedvals.push(groupSelectedIds.join(','));
			Cooler.AppUser.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AppUser.salesGroupCheckedvals.join(',') + '');
		}
		else {
			Cooler.AppUser.salesGroupCheckedvals = [];
			Cooler.AppUser.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AppUser.salesGroupCheckedvals.join(',') + '');
		}
		if (territorySelectedIds.length > 0) {
			Cooler.AppUser.salesTerritoryCheckedvals.push(territorySelectedIds.join(','));
			Cooler.AppUser.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AppUser.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			Cooler.AppUser.salesTerritoryCheckedvals = [];
			Cooler.AppUser.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AppUser.salesTerritoryCheckedvals.join(',') + '');
		}
	}
	else if (salesHieraarchyLevel == 2) {
		var salesTerritoryTempIds = [];
		var salesTerritoryeStore = Cooler.AppUser.responsibleforSalesHierarchyLevel_3.getStore();
		salesTerritoryeStore.clearFilter();
		var vals = salesHierarchyValue.split(',');

		salesTerritoryeStore.each(function (record) {
			for (var i = 0; i < vals.length; i++) {
				if (record.get("CustomValue") == vals[i]) {
					salesTerritoryTempIds.push(record.data.LookupId.toString());
				}
			}
		}, this);

		var territorySelectedIds = Cooler.AppUser.salesTerritoryCheckedvals.join(',').split(',').filter(function (item) {
			return salesTerritoryTempIds.indexOf(item) === -1;
		});
		Cooler.AppUser.salesTerritoryCheckedvals = [];
		if (territorySelectedIds.length > 0) {
			Cooler.AppUser.salesTerritoryCheckedvals.push(territorySelectedIds.join(','));
			Cooler.AppUser.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AppUser.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			Cooler.AppUser.salesTerritoryCheckedvals = [];
			Cooler.AppUser.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AppUser.salesTerritoryCheckedvals.join(',') + '');
		}
	}
}
Cooler.SalesUsers = new Cooler.AppUser({ uniqueId: 'SalesUsers', listTitle: 'Users', disableAdd: true, allowExport: true });
Cooler.AppUser = new Cooler.AppUser();

/*TerritoryDetail Grid*/
Cooler.TerritoryDetail = new Cooler.Form({
	title: 'Sales Outlet',
	controller: 'TerritoryDetail',
	disableAdd: true,
	disableDelete: true,
	keyColumn: 'LocationId',
	hybridConfig: function () {
		return [
			{ dataIndex: 'LocationId', type: 'int' },
			{ header: 'Outlet', dataIndex: 'Location', width: 145, type: 'string' },
			{ header: 'Outlet Code', dataIndex: 'LocationCode', width: 145, type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Parent Sales Hierarchy', dataIndex: 'ParentSalesHierarchy', width: 145, type: 'string' },
			{ header: 'Sales Hierarchy', dataIndex: 'SalesHierarchy', width: 145, type: 'string' },
			{ header: 'Asset Present', dataIndex: 'IsHaveAsset', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'CA Territory Name', type: 'string', dataIndex: 'CATerritoryName', width: 150, },
			{ header: 'MC Territory Name', type: 'string', dataIndex: 'MCTerritoryName', width: 150, },
			{ header: 'P1 Territory Name', type: 'string', dataIndex: 'P1TerritoryName', width: 150, },
			{ header: 'P2 Territory Name', type: 'string', dataIndex: 'P2TerritoryName', width: 150, },
			{ header: 'P3 Territory Name', type: 'string', dataIndex: 'P3TerritoryName', width: 150, },
			{ header: 'P4 Territory Name', type: 'string', dataIndex: 'P4TerritoryName', width: 150, },
			{ header: 'P5 Territory Name', type: 'string', dataIndex: 'P5TerritoryName', width: 150, }
		];
	}
});

Cooler.UserLocation = new Cooler.Form({
	formTitle: 'User Location: {0}',
	listTitle: 'User Location',
	controller: 'UserLocation',
	captionColumn: null,
	disableAdd: true,
	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'PromotionId', type: 'int' },
			{ header: 'Location', dataIndex: 'Name', width: 220, type: 'string' },
			{ header: 'Code', dataIndex: 'Code', width: 120, type: 'string' },
			{ header: 'Is Key Outlet?', dataIndex: 'IsKeyLocation', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ header: 'Is Smart?', dataIndex: 'IsSmart', renderer: ExtHelper.renderer.Boolean, type: 'bool' },
			{ header: 'Is Vision?', dataIndex: 'IsVision', renderer: ExtHelper.renderer.Boolean, type: 'bool' },
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
			{ header: 'TimeZone', dataIndex: 'TimeZone', width: 250, type: 'string' }
		];
	}
});
