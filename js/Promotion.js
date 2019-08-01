Cooler.Promotion = new Cooler.Form({
	keyColumn: 'PromotionId',
	captionColumn: 'Promotion',
	controller: 'ConsumerPromotion',
	title: 'Consumer Promotion',
	securityModule: 'Banners',
	comboTypes: [
		'PromotionType',
		'PromotionCategory',
		'Category'
	],
	logoUrl: './FileServer/Promotion/',
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'PromotionId', type: 'int' },
			{ header: 'Promotion Type', dataIndex: 'PromotionType', type: 'string' },
			{ header: 'Promotion Text', dataIndex: 'PromotionText', width: 150, type: 'string' },
			{ header: 'Promotion Category', dataIndex: 'PromotionCategory', type: 'string' },
			{ header: 'Promotion User', dataIndex: 'PromotionUser', type: 'string' },
			{ header: 'Image Url', dataIndex: 'ImageUrl', width: 150, type: 'string' },
			{ header: 'Target Url', dataIndex: 'TargetUrl', width: 150, type: 'string' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }

		];
	},
	comboStores: {
		PromotionType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		PromotionCategory: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Category: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	createForm: function (config) {
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			width: 250,
			name: 'selectFile'
		});
		var logoField = new Ext.ux.Image({ height: 120, src: "" });

		var col1 = {
			columnWidth: .7,
			labelWidth: 80,
			defaults: {
				width: 165
			},
			items: [
				DA.combo.create({ fieldLabel: 'Promotion Type', name: 'PromotionTypeId', hiddenName: 'PromotionTypeId', store: this.comboStores.PromotionType, width: 250, allowBlank: false }),
				DA.combo.create({ fieldLabel: 'Promotion Category', name: 'PromotionCategoryId', hiddenName: 'PromotionCategoryId', store: this.comboStores.PromotionCategory, width: 250, allowBlank: false }),
				DA.combo.create({ fieldLabel: 'Promotion User', name: 'PromotionUserId', hiddenName: 'PromotionUserId', store: this.comboStores.Category, width: 250, allowBlank: false }),
				{ fieldLabel: 'Promotion Text', name: 'PromotionText', xtype: 'textarea', width: 250, allowBlank: false },
				{ fieldLabel: 'Image Url', name: 'ImageUrl', xtype: 'textfield', width: 250 },
				{ fieldLabel: 'Target Url', name: 'TargetUrl', xtype: 'textfield', width: 250 },
				uploadImage
			]
		};
		var col2 = {
			columnWidth: .3,
			defaults: {
				width: 165
			},
			items: [
				logoField
			]
		};

		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			labelWidth: 250,
			items: [col1, col2],
			fileUpload: true
		});

		this.logoField = logoField;
		this.uploadImage = uploadImage;

		this.on('dataLoaded', function (promotionForm, data) {
			var record = data.data;
			if (record) {
				Cooler.loadThumbnail(this, record, this.logoUrl + "/imageNotFound.png");
			}
			this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
			this.PromotionId = data.data.Id;
			var gridToClear = [this.outletGrid, this.locationPromotionGrid], index, grid, button;
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
			var locationPromotionGridStore = this.locationPromotionGrid.getStore();
			locationPromotionGridStore.baseParams.PromotionId = this.PromotionId;
			locationPromotionGridStore.load();
		});
		return config;
	},

	onAddPromotionButton: function (val) {
		var params = this.outletGrid.store.lastOptions.params;
		params.action = 'addLocation';
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		Ext.Ajax.request({
			url: 'Controllers/ConsumerPromotion.ashx',
			params: params,
			success: this.onSuccess,
			failure: this.onFailure,
			scope: this
		});
	},

	onSuccess: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(result.responseText).data);
		this.locationPromotionGrid.store.reload();
	},

	onFailure: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveAllButton: function () {
		var params = this.locationPromotionGrid.store.lastOptions.params;
		var selections = this.locationPromotionGrid.getStore().getTotalCount();
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
				url: 'Controllers/ConsumerPromotion.ashx',
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
		this.locationPromotionGrid.store.reload();
	},

	onRemovedNone: function (result, request) {
		this.mask.hide();
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},

	onRemoveButton: function () {
		var sm = this.locationPromotionGrid.getSelectionModel();
		var rowSelectionMode = false;
		var selections = [];
		var store = this.locationPromotionGrid.getStore();
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
							url: EH.BuildUrl(this.locationPromotionGrid.controller),
							params: Ext.apply({ action: 'delete', Ids: Ids }, this.baseParams),
							title: 'Delete',
							handleSuccess: false,
							success: function () {
								for (var i = 0; i < selections.length; i++) {
									store.remove(selections[i]);
									this.locationPromotionGrid.store.reload();
								}
							},
							scope: this
						});
					}
				}
			}, this);
		}
	},

	CreateFormPanel: function (config) {
		var addPromotionButton = new Ext.Button({ text: 'Add To Promotion', handler: this.onAddPromotionButton, scope: this });  //added new button for addding location to location promotion
		var tbarItems = [addPromotionButton];
		var outletGrid = Cooler.LocationType.OutletPromotion.createGrid({ title: 'Outlet', editable: false, tbar: [], showDefaultButtons: false });
		outletGrid.topToolbar.splice(0, 0, addPromotionButton);
		this.outletGrid = outletGrid;
		var removeAllButton = new Ext.Button({ text: 'Remove All', handler: this.onRemoveAllButton, scope: this, iconCls: 'delete' });
		var removeButton = new Ext.Button({ text: 'Remove', handler: this.onRemoveButton, scope: this, iconCls: 'delete' });
		var locationPromotionGrid = Cooler.LocationPromotion.createGrid({ title: 'Outlet Promotion', editable: false, tbar: [], showDefaultButtons: true });
		var tbarItems = [removeAllButton, removeButton];
		locationPromotionGrid.topToolbar.splice(1, 0, removeAllButton);
		locationPromotionGrid.topToolbar.splice(1, 0, removeButton);
		this.locationPromotionGrid = locationPromotionGrid;
		var grid = [outletGrid, locationPromotionGrid];
		this.childGrids = grid;
		this.childModules = [Cooler.LocationPromotion];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [outletGrid, locationPromotionGrid]
		});
		Ext.apply(config, {
			region: 'north',
			height: 250
		});
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			modal: 'false',
			defaults: {
				border: false,
				bodyStyle: 'padding: 0px'
			},
			height: 550,
			items: [this.formPanel, tabPanel]
		});
	}
});

Cooler.LocationPromotion = new Cooler.Form({
	formTitle: 'Location Promotion: {0}',
	listTitle: 'Location Promotion',
	controller: 'LocationPromotion',
	captionColumn: null,
	newListRecordData: { LocationId: '' },
	disableAdd: true,

	hybridConfig: function () {
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'PromotionId', type: 'int' },
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
