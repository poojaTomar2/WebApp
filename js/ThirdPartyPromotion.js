Cooler.ThirdPartyPromotion = new Cooler.Form({
	keyColumn: 'ThirdPartyPromotionId',
	captionColumn: 'ThirdPartyPromotion',
	controller: 'ThirdPartyPromotion',
	title: 'Third Party Promotion',
	securityModule: 'ThirdPartyPromotion',
	comboTypes: [
		'Client',
		'Country',
		'ThirdPartyAppName'
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ThirdPartyAppName: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	onGridCreated: function (grid) {
		grid.on("rowdblclick", this.doubleClick, this);
	},
	doubleClick: function (grid, rowIndex, e) {
		var row = grid.getStore().getAt(rowIndex);
		this.thirdPartyAppId = row.data.ThirdPartyAppId;
		this.thirdPartyPromotionAllLocationGrid.baseParams.ThirdPartyAppId = this.thirdPartyAppId;
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'IsEditable', type: 'int' },
			{ header: 'PromotionId', dataIndex: 'ThirdPartyPromotionId', type: 'int' },
			{ header: 'Promotion Grouping', dataIndex: 'ThirdPartyPromotionGrouping', type: 'string', width: 250 },
			{ header: 'Name', dataIndex: 'ThirdPartyPromotionName', width: 100, type: 'string' },
			{ header: 'Title', dataIndex: 'MessageTitle', width: 100, type: 'string' },
			{ header: 'Is Active', dataIndex: 'IsActive', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ header: 'Start Date', dataIndex: 'StartDate', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'End Date', dataIndex: 'EndDate', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Country ', dataIndex: 'CountryId', displayIndex: 'Country', type: 'int', store: this.comboStores.Country, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }) },
			{ header: 'Application ', dataIndex: 'ThirdPartyAppId', displayIndex: 'ApplicationName', type: 'int', store: this.comboStores.ThirdPartyAppName, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.ThirdPartyAppName }) },
			{ header: 'Client ', dataIndex: 'ClientId', displayIndex: 'Client', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},

	createForm: function (config) {
		var me = this;
		this.promotionName = { fieldLabel: 'Promotion Name', name: 'ThirdPartyPromotionName', xtype: 'textfield', allowBlank: false, maxLength: 240 };
		this.messageTitle = { fieldLabel: 'Message Title', name: 'MessageTitle', xtype: 'textfield', allowBlank: false, maxLength: 50 };
		this.messageText = { fieldLabel: 'Message Text', name: 'MessageText', xtype: 'textfield', allowBlank: false, maxLength: 240 };
		this.promotionGrouping = { fieldLabel: 'Promotion Grouping', name: 'ThirdPartyPromotionGrouping', xtype: 'textfield', maxLength: 200 };
		var countryCombo = DA.combo.create({ fieldLabel: 'Country', itemId: 'CountryCombo', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'Country' }, allowBlank: false });
		this.messageLimit = { fieldLabel: 'Message Limit', name: 'MessageLimit', xtype: 'numberfield', maxValue: 10000, minValue: 1, allowDecimal: false, allowBlank: false };
		this.messageHours = { fieldLabel: 'Message Hours', name: 'MessageHours', xtype: 'numberfield', maxValue: 1000, minValue: 1, allowDecimal: false, allowBlank: false };
		var appNameCombo = DA.combo.create({ fieldLabel: 'App', itemId: 'appNameCombo', name: 'ThirdPartyAppId', hiddenName: 'ThirdPartyAppId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'ThirdPartyAppName' }, allowBlank: false });
		var clientCombo = DA.combo.create({ fieldLabel: 'Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'Client' }, allowBlank: false });
		var isActive = DA.combo.create({ fieldLabel: 'Is Active', hiddenName: 'IsActive', store: "yesno" });
		var startDate = { fieldLabel: 'Start Date', name: 'StartDate', xtype: 'datefield', width: 180 };
		var endDate = { fieldLabel: 'End Date', name: 'EndDate', xtype: 'datefield', width: 180 };
		var isDefault = { fieldLabel: 'Is Default?', name: 'IsDefault', dataIndex: 'IsDefault', xtype: 'checkbox' };
		//var startDate = new Ext.form.DateField({ name: 'StartDate', fieldLabel: 'Start Date', id: 'startDate', width: 180, value: new Date(), minValue: new Date(), format: DA.Security.info.Tags.DateFormat, allowBlank: false });
		//var endDate = new Ext.form.DateField({ name: 'EndDate', fieldLabel: 'End Date', width: 180, minValue: new Date(), format: DA.Security.info.Tags.DateFormat, allowBlank: false });
		this.transactionThreshold = { fieldLabel: 'Transaction Threshold', name: 'TransactionThreshold', xtype: 'numberfield', maxValue: 240, minValue: 1, allowDecimal: false, allowBlank: false };
		this.status = { fieldLabel: 'Status', name: 'Status', xtype: 'textfield', maxLength: 200, disabled: true };
		var col1 = {
			columnWidth: .5,
			labelWidth: 160,
			defaults: {
				width: 210
			},
			items: [
			this.promotionName,
			this.messageTitle,
			this.messageText,
			this.promotionGrouping,
			countryCombo,
			appNameCombo,
			this.messageLimit,
			this.messageHours,
			this.status,
			this.transactionThreshold
			]
		};

		var col2 = {
			columnWidth: .5,
			defaults: {
				width: 210,
				height: 250
			},
			items: [
				clientCombo,
				isActive,
				startDate,
				endDate,
				isDefault
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			labelWidth: 150,
			items: [col1, col2]
		});
		this.clientCombo = clientCombo;
		this.countryCombo = countryCombo;
		//this.appNameCombo = appNameCombo;

		this.on('dataLoaded', function (consumerForm, data) {
			//var record = data.data;
			//if (record) {
			//	var sDate = Ext.getCmp('startDate').minValue;
			//	Ext.getCmp('startDate').setValue(sDate);
			//}
			this.clientCombo.setDisabled(parseInt(DA.Security.info.Tags.ClientId) != 0);
			//this.countryCombo.setDisabled(parseInt(DA.Security.info.Tags.CountryId) != 0);
		});

		this.on('dataLoaded', function (promotionForm, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				ExtHelper.SetComboValue(this.clientCombo, clientId);
				this.clientCombo.setDisabled(true);
			}
			var record = data.data;
			this.ThirdPartyPromotionId = data.data.Id;
			this.ThirdPartyAppId = data.data.ThirdPartyAppId;
			var gridToClear = [this.thirdPartyPromotionAllLocationGrid, this.thirdPartyPromotionLocationActiveGrid], index, grid, button;
			//var gridToClear = [this.thirdPartyPromotionLocationActiveGrid], index, grid, button;
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

			var thirdPartyPromotionLocationActiveGridStore = this.thirdPartyPromotionLocationActiveGrid.getStore();
			thirdPartyPromotionLocationActiveGridStore.baseParams.ThirdPartyPromotionId = this.ThirdPartyPromotionId;
			thirdPartyPromotionLocationActiveGridStore.baseParams.ThirdPartyAppId = this.ThirdPartyAppId;
			this.thirdPartyPromotionAllLocationGrid.baseParams.ThirdPartyAppId = this.ThirdPartyAppId;
			thirdPartyPromotionLocationActiveGridStore.baseParams.IsActive = 1;
			thirdPartyPromotionLocationActiveGridStore.load();
		});
		return config;
	},
	onActivateAllToPromotionButton: function (val) {
		var params = this.thirdPartyPromotionAllLocationGrid.store.lastOptions.params;
		var selections = this.thirdPartyPromotionAllLocationGrid.getStore().getTotalCount();
		var params = this.thirdPartyPromotionAllLocationGrid.store.lastOptions.params;
		var appId = this.ThirdPartyAppId;
		//var selectedRecord = this.selectedOutletGrid.getStore().getTotalCount();
		var selectedRecords = this.thirdPartyPromotionAllLocationGrid.getStore().data.items;
		params.validate = true;
		params.count = 0;
		params.appId = appId;
		var locationIds = [];
		for (var i = 0; i < selectedRecords.length; i++) {
			locationIds.push(selectedRecords[i].data.LocationId);

		}

		params.locationIds = locationIds;
		params.action = 'addAllLocation';
		if (selections === 0) {
			DA.Util.ShowError('Add', 'Failed: No records found');
		}
		else {
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/ThirdPartyPromotion.ashx',
				params: params,
				success: this.onSuccessActiveAllPromotion,
				failure: this.onFailure,
				scope: this
			});
		}
	},
	onSuccessActiveAllPromotion: function (result, request) {
		this.mask.hide();
		var responce = Ext.decode(result.responseText).data;
		function processResult(btn) {
			if (btn == 'yes') {
				var selectedRecords = this.thirdPartyPromotionAllLocationGrid.getSelectionModel().getSelections();
				var params = this.thirdPartyPromotionAllLocationGrid.store.lastOptions.params;
				params.action = 'activateAllLocation';
				params.validate = false;
				params.count = responce;
				if (!this.mask) {
					var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
					this.mask = mask;
				}
				this.mask.show();
				Ext.Ajax.request({
					url: 'Controllers/ThirdPartyPromotion.ashx',
					params: params,
					success: this.onSuccessAllActivePromotion,
					failure: this.onFailure,
					scope: this
				});
			}
			else {
				return;
			}
		}
		if (responce > 0) {
			Ext.Msg.show({
				title: 'Alert',
				msg: 'Promotion already activated for some outlets, do you want to create new promotion',
				buttons: Ext.Msg.YESNO,
				fn: processResult,
				scope: this
			});
		}
		else {
			Ext.Msg.alert('Success', 'Promotion activate successfully for outlets.');
			this.thirdPartyPromotionLocationActiveGrid.store.reload();
			this.thirdPartyPromotionAllLocationGrid.store.reload();
		}
	},
	onSuccessAllActivePromotion: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', 'New Promotion Activated Sucessfully');
		this.thirdPartyPromotionAllLocationGrid.store.reload();
		this.thirdPartyPromotionLocationActiveGrid.store.reload();
	},
	onAddActivePromotionButton: function (val) {
		var selectedRecords = this.thirdPartyPromotionAllLocationGrid.getSelectionModel().getSelections();
		if (selectedRecords.length > 0) {
			var params = this.thirdPartyPromotionAllLocationGrid.store.lastOptions.params;
			params.validate = true;
			params.count = 0;
			params.action = 'addLocation';
			var locationIds = [];
			for (var i = 0; i < selectedRecords.length; i++) {
				locationIds.push(selectedRecords[i].data.LocationId);

			}
			params.locationIds = locationIds;
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/ThirdPartyPromotion.ashx',
				params: params,
				success: this.onSuccessActivePromotion,
				failure: this.onFailure,
				scope: this
			});
		}
		else {
			Ext.Msg.alert('Alert', 'Please select outlet for active Promotion');
		}

	},

	//Begin Success Function 
	onSuccess: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.thirdPartyPromotionAllLocationGrid.store.reload();
		this.thirdPartyPromotionLocationActiveGrid.store.reload();

	},
	//End Success Function 
	onSuccessPromotion: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', 'New Promotion Activated Sucessfully');
		this.thirdPartyPromotionAllLocationGrid.store.reload();
		this.thirdPartyPromotionLocationActiveGrid.store.reload();
	},

	onSuccessActivePromotion: function (result, request) {
		this.mask.hide();
		var responce = Ext.decode(result.responseText).data;
		function processResult(btn) {
			if (btn == 'yes') {
				var selectedRecords = this.thirdPartyPromotionAllLocationGrid.getSelectionModel().getSelections();
				var params = this.thirdPartyPromotionAllLocationGrid.store.lastOptions.params;
				params.action = 'activePromotion';
				params.validate = false;
				params.count = responce;
				if (!this.mask) {
					var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
					this.mask = mask;
				}
				this.mask.show();
				Ext.Ajax.request({
					url: 'Controllers/ThirdPartyPromotion.ashx',
					params: params,
					success: this.onSuccessPromotion,
					failure: this.onFailure,
					scope: this
				});
			}
			else {
				return;
			}
		}
		if (responce > 0) {
			Ext.Msg.show({
				title: 'Alert',
				msg: 'Promotion already activated for some outlets, do you want to create new promotion',
				buttons: Ext.Msg.YESNO,
				fn: processResult,
				scope: this
			});
		}
		else {
			Ext.Msg.alert('Success', 'Promotion activate successfully for outlets.');
			this.thirdPartyPromotionLocationActiveGrid.store.reload();
			this.thirdPartyPromotionAllLocationGrid.store.reload();
		}
	},

	//Begin Failure Function
	onFailure: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	//Begin Function Remove All For Active Outlets Grid.
	onRemoveActivePromotionAllButton: function () {
		var params = this.thirdPartyPromotionLocationActiveGrid.store.lastOptions.params;
		var selections = this.thirdPartyPromotionLocationActiveGrid.getStore().getTotalCount();
		params.action = 'deleteAllActiveLocation';
		//var selectedRecords = this.selectedOutletGrid.getStore().data.items;
		//var locationIds = [];
		//for (var i = 0; i < selectedRecords.length; i++) {
		//	locationIds.push(selectedRecords[i].data.LocationId);

		//}
		//params.locationIds = locationIds;
		if (selections === 0) {
			DA.Util.ShowError('Delete', 'Failed: No records selected');
		}
		else {
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/ThirdPartyPromotionLocation.ashx',
				params: params,
				success: this.onRemovedActiveAll,
				failure: this.onRemovedNone,
				scope: this
			});
		}
	},


	onRemovedActiveAll: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.thirdPartyPromotionLocationActiveGrid.store.reload();
		this.thirdPartyPromotionAllLocationGrid.store.reload();
	},
	onRemovedNone: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	////End Function Remove All For Active Outlets Grid.

	////Start Function for Remove Button For Active Outlet Grid
	onRemoveActiveButton: function () {
		var selectedRecords = this.thirdPartyPromotionLocationActiveGrid.getSelectionModel().getSelections();
		if (selectedRecords.length > 0) {
			var params = this.thirdPartyPromotionLocationActiveGrid.store.lastOptions.params;
			params.validate = true;
			params.count = 0;
			params.action = 'deleteActiveLocation';
			var locationIds = [];
			for (var i = 0; i < selectedRecords.length; i++) {
				locationIds.push(selectedRecords[i].data.LocationId);

			}
			params.locationIds = locationIds;
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/ThirdPartyPromotionLocation.ashx',
				params: params,
				success: this.onRemovedActive,
				failure: this.onRemovedActiveNone,
				scope: this
			});
		}
		else {
			Ext.Msg.alert('Alert', 'Please select outlet for Remove Promotion');
		}
	},
	onRemovedActive: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.thirdPartyPromotionLocationActiveGrid.store.reload();
		this.thirdPartyPromotionAllLocationGrid.store.reload();
	},
	onRemovedActiveNone: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},
	//End Function for Remove Button For Active Outlet Grid


	// Start Function for Deactivate button For Active Outlet Grid.
	onRemoveActivePromotionButton: function (val) {
		var selectedRecords = this.thirdPartyPromotionLocationActiveGrid.getSelectionModel().getSelections();
		var params = this.thirdPartyPromotionLocationActiveGrid.store.lastOptions.params;
		params.action = 'deActivate';
		if (selectedRecords.length > 0) {
			var locationIds = [];
			for (var i = 0; i < selectedRecords.length; i++) {
				locationIds.push(selectedRecords[i].data.LocationId);

			}
			params.locationIds = locationIds;
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/ThirdPartyPromotionLocation.ashx',
				params: params,
				success: this.onSuccess,
				failure: this.onFailure,
				scope: this
			});
		}
		else {
			Ext.Msg.alert('Alert', 'Please select outlet for Decativate Promotion');
		}
	},
	// End Function for Deactivate button For Active Outlet Grid.
	CreateFormPanel: function (config) {
		var addActivePromotionButton = new Ext.Button({ text: 'Active Promotion', handler: this.onAddActivePromotionButton, scope: this, iconCls: 'add' });
		var addActiveAllPromotionButton = new Ext.Button({ text: 'Activate All Promotion', handler: this.onActivateAllToPromotionButton, scope: this, iconCls: 'add' });
		var tbarItems = [];
		var selectedOutletGrid = Cooler.LocationType.ThirdPartyPromotionOutlet.createGrid({
			title: 'All Outlet', editable: false, tbar: [], showDefaultButtons: false
		});
		this.selectedOutletGrid = selectedOutletGrid;
		var removeActivePromotionButton = new Ext.Button({ text: 'Deactive Promotion', handler: this.onRemoveActivePromotionButton, scope: this, iconCls: 'delete' }); // Deactive Button For Active Outlets Grid.
		var removeActivePromotionAllButton = new Ext.Button({ text: 'Remove All', handler: this.onRemoveActivePromotionAllButton, scope: this, iconCls: 'delete' }); // Remove All Button For Active Outlets Grid.
		var removeActiveButton = new Ext.Button({ text: 'Remove', handler: this.onRemoveActiveButton, scope: this, iconCls: 'delete' }); // Remove Button For Active Outlets Grid.
		var tbarItemsActivate = [addActivePromotionButton, addActiveAllPromotionButton];
		var thirdPartyPromotionAllLocationGrid = Cooler.ThirdPartyPromotionAllLocation.createGrid({ title: 'All Outlet', editable: false, tbar: [], showDefaultButtons: true }); // Grid For All NonActiveOutlet
		var thirdPartyPromotionLocationActiveGrid = Cooler.ThirdPartyPromotionLocationActive.createGrid({ title: 'Active Outlets', editable: false, tbar: [], showDefaultButtons: true }); //Grid For Active Outlets
		thirdPartyPromotionAllLocationGrid.topToolbar.splice(1, 0, addActivePromotionButton, addActiveAllPromotionButton); // Add Button To All Non Active Outlet
		this.thirdPartyPromotionAllLocationGrid = thirdPartyPromotionAllLocationGrid;
		thirdPartyPromotionLocationActiveGrid.topToolbar.splice(1, 0, removeActivePromotionButton); // Add Deactive Promotion Button To Active Outlet Grid For Decativate Selected Outlet From Active Outlet Grid.
		thirdPartyPromotionLocationActiveGrid.topToolbar.splice(1, 0, removeActivePromotionAllButton); // Add Remove all Button To Active Outlets Grid For Remove All Outlets From Active Outlet Grid.
		thirdPartyPromotionLocationActiveGrid.topToolbar.splice(1, 0, removeActiveButton); // Add Remove Button To Active Outlets Grid For Remove Selected Outlets From Acive Outlet Grid.
		this.thirdPartyPromotionLocationActiveGrid = thirdPartyPromotionLocationActiveGrid;

		var grid = [thirdPartyPromotionAllLocationGrid, thirdPartyPromotionLocationActiveGrid];
		this.childGrids = grid;
		//this.childModules = [Cooler.ThirdPartyPromotionLocation, Cooler.ThirdPartyPromotionLocationActive];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [thirdPartyPromotionAllLocationGrid, thirdPartyPromotionLocationActiveGrid]
		});
		Ext.apply(config, {
			region: 'north',
			height: 280
		});
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			modal: 'false',
			defaults: {
				border: false,
				bodyStyle: 'padding: 0px'
			},
			height: 500,
			items: [this.formPanel, tabPanel]
		});
	}
});
/////
Cooler.ThirdPartyPromotionAllLocation = new Cooler.Form({

	formTitle: 'Third Party Promotion Location: {0}',
	listTitle: 'Third Party Promotion Location',
	controller: 'ThirdPartyPromotionAllLocation',
	captionColumn: null,
	newListRecordData: { LocationIds: '' },
	disableAdd: true,
	comboTypes: [
		'Client',
		'Country',
		'ThirdPartyAppName',
		'OutletType',
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		ThirdPartyAppName: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		OutletType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'LocationId', width: 200, type: 'int' },
			{ header: 'Name', dataIndex: 'Name', width: 200, type: 'string' },
            { header: 'Code', dataIndex: 'Code', width: 120, type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string' },
			{ header: 'Is Key Outlet?', dataIndex: 'IsKeyLocation', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ header: 'Is Smart?', dataIndex: 'IsSmart', renderer: ExtHelper.renderer.Boolean, type: 'bool' },
			{ header: 'Country', dataIndex: 'Country', type: 'string' },
			{ header: 'State', dataIndex: 'State', type: 'string' },
			{ header: 'City', dataIndex: 'City', type: 'string' },
			{ header: 'Street', dataIndex: 'Street', width: 120, type: 'string' },
			{ header: 'Street 2', dataIndex: 'Street2', width: 120, type: 'string' },
			{ header: 'Street 3', dataIndex: 'Street3', width: 120, type: 'string' },
			{ header: 'Postal Code', dataIndex: 'PostalCode', width: 150, type: 'string' },
			{ header: 'Retailer', dataIndex: 'Retailer', type: 'string' },
			{ header: 'Primary Phone', dataIndex: 'PrimaryPhone', width: 120, type: 'string' },
			{ header: 'Primary Sales Rep', dataIndex: 'PrimarySalesRep', width: 120, type: 'string' },
			{ header: 'Technician', dataIndex: 'Technician', width: 120, type: 'string' },
			{ header: 'Market', dataIndex: 'MarketName', type: 'string' },
			{ header: 'Sales Target', dataIndex: 'SalesTarget', align: 'right', type: 'string' },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string' },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'float' },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'float' },
			{ header: 'Trade Channel', dataIndex: 'LocationType', type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', type: 'string' },
			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' },
			{ header: 'Sales Organization', dataIndex: 'SalesOrganizationName', width: 150, type: 'string' },
			{ header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', dataIndex: 'SalesOfficeName', width: 150, type: 'string' },
			{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string', type: 'string' },
			{ header: 'Sales Group', dataIndex: 'SalesGroupName', width: 150, type: 'string' },
			{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', dataIndex: 'SalesTerritoryName', width: 150, type: 'string' },
			{ header: 'Sales Territory Code', hidden: true, dataIndex: 'SalesTerritoryCode', width: 150, type: 'string' },
			{ header: 'TeleSelling Territory Code', dataIndex: 'TeleSellingTerritoryCode', width: 150, type: 'string' },
			{ header: 'TeleSelling Territory Name', dataIndex: 'TeleSellingTerritoryName', width: 150, type: 'string' },
			{ header: 'TimeZone', dataIndex: 'TimeZone', width: 250, type: 'string' },
			{ header: 'Nearest Latitude', dataIndex: 'NearestLatitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'string' },
			{ header: 'Nearest Longitude', dataIndex: 'NearestLongitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'string' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150, type: 'string' },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150, type: 'string' }
		];
	}
	
});

//Cooler.ThirdPartyPromotionLocation = new Cooler.Form({

//	formTitle: 'Third Party Promotion Location: {0}',
//	listTitle: 'Third Party Promotion Location',
//	controller: 'ThirdPartyPromotionLocation',
//	captionColumn: null,
//	newListRecordData: { LocationIds: '' },
//	disableAdd: true,

//	hybridConfig: function () {
//		return [
//			{ dataIndex: 'Id', type: 'int' },
//			{ header: 'PromotionId', dataIndex: 'ThirdPartyPromotionId', type: 'int' },
//			{ dataIndex: 'LocationId', type: 'int' },
//			{ header: 'Promotion Name', dataIndex: 'ThirdPartyPromotionName', width: 220, type: 'string' },
//			{ header: 'Location', dataIndex: 'Name', width: 220, type: 'string' },
//			{ header: 'Code', dataIndex: 'Code', width: 120, type: 'string' },
//			{ header: 'Is Key Outlet?', dataIndex: 'IsKeyLocation', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
//			{ header: 'Is Smart?', dataIndex: 'IsSmart', renderer: ExtHelper.renderer.Boolean, type: 'bool' },
//			{ header: 'Country', dataIndex: 'Country', type: 'string' },
//			{ header: 'State', dataIndex: 'State', type: 'string' },
//			{ header: 'City', dataIndex: 'City', type: 'string' },
//			{ header: 'Street', dataIndex: 'Street', width: 120, type: 'string' },
//			{ header: 'Street 2', dataIndex: 'Street2', width: 120, type: 'string' },
//			{ header: 'Street 3', dataIndex: 'Street3', width: 120, type: 'string' },
//			{ header: 'Primary Phone', dataIndex: 'PrimaryPhone', width: 120, type: 'string' },
//			{ header: 'Primary Sales Rep', dataIndex: 'PrimarySalesRep', width: 120, type: 'string' },
//			{ header: 'Technician', dataIndex: 'Technician', width: 120, type: 'string' },
//			{ header: 'Market', dataIndex: 'MarketName', type: 'string' },
//			{ header: 'Trade Channel', dataIndex: 'LocationType', type: 'string' },
//			{ header: 'Sales Target', dataIndex: 'SalesTarget', align: 'right', type: 'int' },
//			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
//			{ header: 'Sub Trade Channel Name', dataIndex: 'SubTradeChannelName', width: 120, type: 'string' },
//			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string' },
//			{ header: 'Latitude', dataIndex: 'Latitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'float' },
//			{ header: 'Longitude', dataIndex: 'Longitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8), type: 'float' },
//			{ header: 'Territory', dataIndex: 'Territory', type: 'string' },
//			{ header: 'TimeZone', dataIndex: 'TimeZone', width: 250, type: 'string' }
//		];
//	}
//});

Cooler.ThirdPartyPromotionLocationActive = new Cooler.Form({

	formTitle: 'Third Party Promotion Location: {0}',
	listTitle: 'Third Party Promotion Location',
	controller: 'ThirdPartyPromotionLocation',
	captionColumn: null,
	newListRecordData: { LocationIds: '' },
	gridConfig: {
		defaults: { baseParams: { isActive: 1 } }
	},
	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'PromotionId', dataIndex: 'ThirdPartyPromotionId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ header: 'Promotion Name', dataIndex: 'ThirdPartyPromotionName', width: 220, type: 'string' },
			{ header: 'Location', dataIndex: 'Name', width: 220, type: 'string' },
			{ header: 'Code', dataIndex: 'Code', width: 120, type: 'string' },
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
			{ header: 'TimeZone', dataIndex: 'TimeZone', width: 250, type: 'string' }
		];
	}
});


