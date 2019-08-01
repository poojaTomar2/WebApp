Cooler.EddystonePromotion = new Cooler.Form({
	keyColumn: 'EddystonePromotionId',
	captionColumn: 'EddystonePromotion',
	controller: 'EddystonePromotion',
	title: 'Eddystone URL Promotion',
	logoUrl: './FileServer/EddystonePromotion/',
	securityModule: 'EddystoneURL',
	comboTypes: [
		'Client'
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'IsEditable', type: 'int' },
			{ header: 'Id', dataIndex: 'EddystonePromotionId', type: 'int' },
			{ header: 'Title', dataIndex: 'Title', type: 'string' },
			{ header: 'Eddystone Promotion Url', dataIndex: 'EddystonePromotionUrl', width: 250, type: 'string' },
			{ header: 'Eddystone Promotion Preview Url', dataIndex: 'EddystonePromotionPreviewUrl', width: 250, type: 'string' },
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
		var logoField = new Ext.ux.Image({ height: 150, src: "" });
		var me = this;
		this.eddystonePromotionURL = new Ext.form.TextField({ fieldLabel: 'Eddystone Promotion Url', name: 'EddystonePromotionUrl', xtype: 'textfield', width: 320, allowBlank: false });
		this.eddystonePromotionPreviewUrl = new Ext.form.TextField({ fieldLabel: 'Eddystone Promotion Url Preview', name: 'EddystonePromotionPreviewUrl', xtype: 'textfield', width: 320, allowBlank: false });
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 160, baseParams: { comboType: 'Client' } });
		var col1 = {
			columnWidth: .6,
			labelWidth: 160,
			defaults: {
				width: 210
			},
			items: [{ fieldLabel: 'Title', name: 'Title', xtype: 'textfield', width: 300, allowBlank: false },

			this.eddystonePromotionURL,
			this.eddystonePromotionPreviewUrl,
				uploadImage,
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
			var record = data.data;
			this.EddystonePromotionId = data.data.Id;
			if (data.data.Id == 0) {
				this.eddystonePromotionURL.setValue(location.origin + '/' + 'EddystoneUrl' + '.aspx');
				this.eddystonePromotionPreviewUrl.setValue(location.origin + '/' + 'EddystoneUrl' + '.aspx');

				this.eddystonePromotionURL.setWidth(300);
				this.eddystonePromotionPreviewUrl.setWidth(300);
			}
			var gridToClear = [this.eddystonePromotionLocationGrid, this.eddystonePromotionLocationActiveGrid], index, grid, button;
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
			var locationPromotionGridStore = this.eddystonePromotionLocationGrid.getStore();
			locationPromotionGridStore.baseParams.EddystonePromotionId = this.EddystonePromotionId;
			locationPromotionGridStore.load();

			var eddystonePromotionLocationActiveGridStore = this.eddystonePromotionLocationActiveGrid.getStore();
			eddystonePromotionLocationActiveGridStore.baseParams.EddystonePromotionId = this.EddystonePromotionId;
			eddystonePromotionLocationActiveGridStore.baseParams.IsActive = 1;
			eddystonePromotionLocationActiveGridStore.load();
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
			url: 'Controllers/EddystonePromotion.ashx',
			params: params,
			success: this.onSuccess,
			failure: this.onFailure,
			scope: this
		});
	},

	onAddAllToPromotionButton: function (val) {
		var params = this.selectedOutletGrid.store.lastOptions.params;
		var selections = this.selectedOutletGrid.getStore().getTotalCount();
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
				url: 'Controllers/EddystonePromotion.ashx',
				params: params,
				success: this.onSuccess,
				failure: this.onFailure,
				scope: this
			});
		}
	},

	onAddActivePromotionButton: function (val) {
		var selectedRecords = this.eddystonePromotionLocationGrid.getSelectionModel().getSelections();
		var params = this.eddystonePromotionLocationGrid.store.lastOptions.params;
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
			url: 'Controllers/EddystonePromotion.ashx',
			params: params,
			success: this.onSuccessActivePromotion,
			failure: this.onFailure,
			scope: this
		});
	},

	onSuccess: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.eddystonePromotionLocationGrid.store.reload();
		this.eddystonePromotionLocationActiveGrid.store.reload();

	},

	onSuccessPromotion: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', 'New Promotion Activated Sucessfully');
		this.eddystonePromotionLocationGrid.store.reload();
		this.eddystonePromotionLocationActiveGrid.store.reload();
	},

	onSuccessActivePromotion: function (result, request) {
		this.mask.hide();
		var responce = Ext.decode(result.responseText).data;
		function processResult(btn) {
			if (btn == 'yes') {
				var selectedRecords = this.eddystonePromotionLocationGrid.getSelectionModel().getSelections();
				var params = this.eddystonePromotionLocationGrid.store.lastOptions.params;
				params.action = 'activePromotion';
				params.validate = false;
				params.count = responce;
				if (!this.mask) {
					var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
					this.mask = mask;
				}
				this.mask.show();
				Ext.Ajax.request({
					url: 'Controllers/EddystonePromotion.ashx',
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
			this.eddystonePromotionLocationActiveGrid.store.reload();
			this.eddystonePromotionLocationGrid.store.reload();
		}
	},

	onFailure: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveAllButton: function () {
		var params = this.eddystonePromotionLocationGrid.store.lastOptions.params;
		var selections = this.eddystonePromotionLocationGrid.getStore().getTotalCount();
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
				url: 'Controllers/EddystonePromotion.ashx',
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
		this.eddystonePromotionLocationGrid.store.reload();
	},



	onRemovedNone: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveButton: function () {
		var sm = this.eddystonePromotionLocationGrid.getSelectionModel();
		var rowSelectionMode = false;
		var selections = [];
		var store = this.eddystonePromotionLocationGrid.getStore();
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
							url: EH.BuildUrl(this.eddystonePromotionLocationGrid.controller),
							params: Ext.apply({ action: 'delete', Ids: Ids }, this.baseParams),
							title: 'Delete',
							handleSuccess: false,
							success: function () {
								for (var i = 0; i < selections.length; i++) {
									store.remove(selections[i]);
									this.eddystonePromotionLocationGrid.store.reload();
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
		var selectedRecords = this.eddystonePromotionLocationActiveGrid.getSelectionModel().getSelections();
		var params = this.eddystonePromotionLocationActiveGrid.store.lastOptions.params;
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
			url: 'Controllers/EddystonePromotionLocation.ashx',
			params: params,
			success: this.onSuccess,
			failure: this.onFailure,
			scope: this
		});
	},

	CreateFormPanel: function (config) {
		var addPromotionButton = new Ext.Button({ text: 'Add To Promotion', handler: this.onAddPromotionButton, scope: this });  //added new button for addding location to location promotion
		var addAllToPromotionButton = new Ext.Button({ text: 'Add All To Promotion', handler: this.onAddAllToPromotionButton, scope: this });
		var addActivePromotionButton = new Ext.Button({ text: 'Active Promotion', handler: this.onAddActivePromotionButton, scope: this });

		var tbarItems = [addPromotionButton, addAllToPromotionButton];
		var selectedOutletGrid = Cooler.LocationType.EddystonePromotionOutlet.createGrid({ title: 'All Outlet', editable: false, tbar: [], showDefaultButtons: false });
		selectedOutletGrid.topToolbar.splice(0, 0, addPromotionButton);
		selectedOutletGrid.topToolbar.splice(1, 0, addAllToPromotionButton);
		this.selectedOutletGrid = selectedOutletGrid;
		var removeAllButton = new Ext.Button({ text: 'Remove All', handler: this.onRemoveAllButton, scope: this, iconCls: 'delete' });
		var removeButton = new Ext.Button({ text: 'Remove', handler: this.onRemoveButton, scope: this, iconCls: 'delete' });
		var removeActivePromotionButton = new Ext.Button({ text: 'Deactive Promotion', handler: this.onRemoveActivePromotionButton, scope: this, iconCls: 'delete' });
		var tbarItemsActivate = [addActivePromotionButton];
		var eddystonePromotionLocationGrid = Cooler.EddystonePromotionLocation.createGrid({ title: 'Non Active Outlets', editable: false, tbar: [], showDefaultButtons: true });


		var eddystonePromotionLocationActiveGrid = Cooler.EddystonePromotionLocationActive.createGrid({ title: 'Active Outlets', editable: false, tbar: [], showDefaultButtons: true });
		var tbarItems = [removeAllButton, removeButton];
		eddystonePromotionLocationGrid.topToolbar.splice(1, 0, removeAllButton);
		eddystonePromotionLocationGrid.topToolbar.splice(1, 0, removeButton);
		eddystonePromotionLocationGrid.topToolbar.splice(1, 0, addActivePromotionButton);
		this.eddystonePromotionLocationGrid = eddystonePromotionLocationGrid;

		eddystonePromotionLocationActiveGrid.topToolbar.splice(1, 0, removeActivePromotionButton);
		this.eddystonePromotionLocationActiveGrid = eddystonePromotionLocationActiveGrid;

		var grid = [selectedOutletGrid, eddystonePromotionLocationGrid, eddystonePromotionLocationActiveGrid];
		this.childGrids = grid;
		this.childModules = [Cooler.EddystonePromotionLocation, Cooler.EddystonePromotionLocationActive];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [selectedOutletGrid, eddystonePromotionLocationGrid, eddystonePromotionLocationActiveGrid]
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

Cooler.EddystonePromotionLocation = new Cooler.Form({

	formTitle: 'Eddystone Promotion Location: {0}',
	listTitle: 'Eddystone Promotion Location',
	controller: 'EddystonePromotionLocation',
	captionColumn: null,
	newListRecordData: { LocationIds: '' },
	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'EddystonePromotionId', type: 'int' },
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

Cooler.EddystonePromotionLocationActive = new Cooler.Form({

	formTitle: 'Eddystone Promotion Location: {0}',
	listTitle: 'Eddystone Promotion Location',
	controller: 'EddystonePromotionLocation',
	captionColumn: null,
	newListRecordData: { LocationIds: '' },
	gridConfig: {
		defaults: { baseParams: { isActive: 1 } }
	},
	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'EddystonePromotionId', type: 'int' },
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

