Cooler.iBeaconPromotion = new Cooler.Form({
	keyColumn: 'iBeaconPromotionId',
	captionColumn: 'iBeaconPromotion',
	controller: 'iBeaconPromotion',
	title: 'iBeacon Promotion',
	logoUrl: './FileServer/iBeaconPromotion/',
	securityModule: 'iBeaconPromotion',

	comboTypes: [
		'PromotionAction',
		'Client'
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		PromotionAction: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'iBeaconPromotionId', type: 'int' },
			{ header: 'Title', dataIndex: 'Title', type: 'string' },
			{ header: 'Push Notification Text', dataIndex: 'PushNotificationText', width: 250, type: 'string' },
			{ header: 'Action', dataIndex: 'ActionId', displayIndex: 'EddystonUIDPromotionAction', type: 'int', store: this.comboStores.PromotionAction, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.PromotionAction }) },
			{ header: 'Promotion Text', dataIndex: 'PromotionText', width: 250, type: 'string' },
			{ header: 'Client ', dataIndex: 'ClientId', displayIndex: 'Client', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},
	createForm: function (config) {
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			width: 250,
			name: 'selectFile'
		});
		var logoField = new Ext.ux.Image({ height: 120, src: "" });
		var me = this;
		var action = DA.combo.create({ fieldLabel: 'Action', name: 'ActionId', hiddenName: 'ActionId', displayIndex: 'Action', mode: 'local', store: this.comboStores.PromotionAction, listWidth: 160 });
		var promotionText = { fieldLabel: 'Promotion Text', name: 'PromotionText', xtype: 'textfield', width: 250, allowBlank: false };
		var pushNotificationText = { fieldLabel: 'Push Notification Text', name: 'PushNotificationText', xtype: 'textfield', width: 250, allowBlank: false };
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 160, baseParams: { comboType: 'Client' } });
		var col1 = {
			columnWidth: .6,
			labelWidth: 160,
			defaults: {
				width: 210
			},
			items: [{ fieldLabel: 'Title', name: 'Title', xtype: 'textfield', width: 250, allowBlank: false },
				pushNotificationText,
				action,
				uploadImage,
				promotionText,
				clientCombo
			]
		};
		var col2 = {
			columnWidth: .4,
			defaults: {
				width: 150,
				height: 250
			},
			items: [
				logoField

			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			labelWidth: 150,
			items: [col1, col2],
			fileUpload: true
		});

		this.logoField = logoField;
		this.uploadImage = uploadImage;
		this.clientCombo = clientCombo;

		this.on('dataLoaded', function (consumerForm, data) {
			var record = data.data;
			if (record) {
				Cooler.loadThumbnail(this, record, this.logoUrl + "/userProfileNoImage.png");
			}
			this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
		});

		this.on('dataLoaded', function (promotionForm, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				ExtHelper.SetComboValue(this.clientCombo, clientId);
				this.clientCombo.setDisabled(true);
			}
			this.iBeaconPromotionId = data.data.Id;
			var gridToClear = [this.selectedOutletGrid, this.iBeaconPromotionLocationGrid, this.iBeaconPromotionLocationActiveGrid], index, grid, button;
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
			var locationPromotionGridStore = this.iBeaconPromotionLocationGrid.getStore();
			locationPromotionGridStore.baseParams.iBeaconPromotionId = this.iBeaconPromotionId;
			locationPromotionGridStore.load();

			var iBeaconPromotionLocationActiveGridStore = this.iBeaconPromotionLocationActiveGrid.getStore();
			iBeaconPromotionLocationActiveGridStore.baseParams.iBeaconPromotionId = this.iBeaconPromotionId;
			iBeaconPromotionLocationActiveGridStore.baseParams.IsActive = 1;
			iBeaconPromotionLocationActiveGridStore.load();
		});
		return config;
	},

	onAddPromotionButton: function (val) {
		var selectedRecords = this.selectedOutletGrid.getSelectionModel().getSelections();
		var params = this.selectedOutletGrid.store.lastOptions.params;
		var locationIds = [];
		for (var i = 0; i < selectedRecords.length; i++) {
			locationIds.push(selectedRecords[i].data.LocationId);
		}

		if (locationIds.length == 0) {
			Ext.Msg.alert('Alert', 'Please select outlet for add to promotion');
			return;
		}
		params.locationIds = locationIds;
		params.action = 'addLocation';
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/iBeaconPromotion.ashx',
			params: params,
			success: this.onSuccess,
			failure: this.onFailure,
			scope: this
		});
	},



	onAddActivePromotionButton: function (val) {
		var selectedRecords = this.iBeaconPromotionLocationGrid.getSelectionModel().getSelections();
		var params = this.iBeaconPromotionLocationGrid.store.lastOptions.params;
		params.validate = true;
		params.count = 0;
		params.action = 'activePromotion';
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
			url: 'Controllers/iBeaconPromotion.ashx',
			params: params,
			success: this.onSuccessActivePromotion,
			failure: this.onFailure,
			scope: this
		});
	},

	onSuccess: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.iBeaconPromotionLocationGrid.store.reload();
		this.iBeaconPromotionLocationActiveGrid.store.reload();

	},

	onSuccessPromotion: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', 'New Promotion Activated Sucessfully');
		this.iBeaconPromotionLocationGrid.store.reload();
		this.iBeaconPromotionLocationActiveGrid.store.reload();
	},

	onSuccessActivePromotion: function (result, request) {
		this.mask.hide();
		var responce = Ext.decode(result.responseText).data;
		function processResult(btn) {
			if (btn == 'yes') {
				var selectedRecords = this.iBeaconPromotionLocationGrid.getSelectionModel().getSelections();
				var params = this.iBeaconPromotionLocationGrid.store.lastOptions.params;
				params.action = 'activePromotion';
				params.validate = false;
				params.count = responce;
				if (!this.mask) {
					var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
					this.mask = mask;
				}
				this.mask.show();
				Ext.Ajax.request({
					url: 'Controllers/iBeaconPromotion.ashx',
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
			this.iBeaconPromotionLocationActiveGrid.store.reload();
			this.iBeaconPromotionLocationGrid.store.reload();
		}
	},

	onFailure: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveAllButton: function () {
		var params = this.iBeaconPromotionLocationGrid.store.lastOptions.params;
		var selections = this.iBeaconPromotionLocationGrid.getStore().getTotalCount();
		params.action = 'deleteLocation';
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
				url: 'Controllers/iBeaconPromotion.ashx',
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
		this.iBeaconPromotionLocationGrid.store.reload();
	},



	onRemovedNone: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveButton: function () {
		var sm = this.iBeaconPromotionLocationGrid.getSelectionModel();
		var rowSelectionMode = false;
		var selections = [];
		var store = this.iBeaconPromotionLocationGrid.getStore();
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
							url: EH.BuildUrl(this.iBeaconPromotionLocationGrid.controller),
							params: Ext.apply({ action: 'delete', Ids: Ids }, this.baseParams),
							title: 'Delete',
							handleSuccess: false,
							success: function () {
								for (var i = 0; i < selections.length; i++) {
									store.remove(selections[i]);
									this.iBeaconPromotionLocationGrid.store.reload();
								}
							},
							scope: this
						});
					}
				}
			}, this);
		}
	},


	onRemoveActivePromotionButton: function (val) {
		var selectedRecords = this.iBeaconPromotionLocationActiveGrid.getSelectionModel().getSelections();
		var params = this.iBeaconPromotionLocationActiveGrid.store.lastOptions.params;
		params.action = 'deActivate';
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
			url: 'Controllers/iBeaconPromotionLocation.ashx',
			params: params,
			success: this.onSuccess,
			failure: this.onFailure,
			scope: this
		});
	},

	CreateFormPanel: function (config) {
		var addPromotionButton = new Ext.Button({ text: 'Add To Promotion', handler: this.onAddPromotionButton, scope: this });  //added new button for addding location to location promotion
		var addActivePromotionButton = new Ext.Button({ text: 'Active Promotion', handler: this.onAddActivePromotionButton, scope: this });

		var tbarItems = [addPromotionButton];
		var selectedOutletGrid = Cooler.LocationType.iBeaconPromotionOutlet.createGrid({ title: 'All Outlet', editable: false, tbar: [], showDefaultButtons: false });
		selectedOutletGrid.topToolbar.splice(0, 0, addPromotionButton);
		this.selectedOutletGrid = selectedOutletGrid;
		var removeAllButton = new Ext.Button({ text: 'Remove All', handler: this.onRemoveAllButton, scope: this, iconCls: 'delete' });
		var removeButton = new Ext.Button({ text: 'Remove', handler: this.onRemoveButton, scope: this, iconCls: 'delete' });
		var removeActivePromotionButton = new Ext.Button({ text: 'Deactive Promotion', handler: this.onRemoveActivePromotionButton, scope: this, iconCls: 'delete' });
		var tbarItemsActivate = [addActivePromotionButton];
		var iBeaconPromotionLocationGrid = Cooler.iBeaconPromotionLocation.createGrid({ title: 'Non Active Outlets', editable: false, tbar: [], showDefaultButtons: true });


		var iBeaconPromotionLocationActiveGrid = Cooler.iBeaconPromotionLocationActive.createGrid({ title: 'Active Outlets', editable: false, tbar: [], showDefaultButtons: true });
		var tbarItems = [removeAllButton, removeButton];
		iBeaconPromotionLocationGrid.topToolbar.splice(1, 0, removeAllButton);
		iBeaconPromotionLocationGrid.topToolbar.splice(1, 0, removeButton);
		iBeaconPromotionLocationGrid.topToolbar.splice(1, 0, addActivePromotionButton);
		this.iBeaconPromotionLocationGrid = iBeaconPromotionLocationGrid;

		iBeaconPromotionLocationActiveGrid.topToolbar.splice(1, 0, removeActivePromotionButton);
		this.iBeaconPromotionLocationActiveGrid = iBeaconPromotionLocationActiveGrid;

		var grid = [selectedOutletGrid, iBeaconPromotionLocationGrid, iBeaconPromotionLocationActiveGrid];
		this.childGrids = grid;
		this.childModules = [Cooler.iBeaconPromotionLocation, Cooler.iBeaconPromotionLocationActive];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [selectedOutletGrid, iBeaconPromotionLocationGrid, iBeaconPromotionLocationActiveGrid]
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

Cooler.iBeaconPromotionLocation = new Cooler.Form({

	formTitle: 'iBeacon Promotion Location: {0}',
	listTitle: 'iBeacon Promotion Location',
	controller: 'iBeaconPromotionLocation',
	captionColumn: null,
	newListRecordData: { LocationIds: '' },
	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'iBeaconPromotionId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ header: 'Location', dataIndex: 'Name', width: 220, type: 'string' },
            { header: 'Code', dataIndex: 'Code', width: 120, type: 'string', hyperlinkAsDoubleClick: true },
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

Cooler.iBeaconPromotionLocationActive = new Cooler.Form({

	formTitle: 'iBeacon Promotion Location: {0}',
	listTitle: 'iBeacon Promotion Location',
	controller: 'iBeaconPromotionLocation',
	captionColumn: null,
	newListRecordData: { LocationIds: '' },
	gridConfig: {
		defaults: { baseParams: { isActive: 1 } }
	},
	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'iBeaconPromotionId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ header: 'Location', dataIndex: 'Name', width: 220, type: 'string' },
            { header: 'Code', dataIndex: 'Code', width: 120, type: 'string', hyperlinkAsDoubleClick: true },
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

