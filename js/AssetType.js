Cooler.AssetType = new Cooler.Form({
	controller: 'AssetType',

	title: 'Asset Type',

	captionColumn: 'AssetType',

	securityModule: 'AssetType',
	constructor: function (config) {
		Cooler.AssetType.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			custom: {
				loadComboTypes: true
			}
		});
	},
	comboTypes: [
			'AssetTypeCapacity'
	],
	comboStores: {
		AssetTypeCapacity: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: [
		{ dataIndex: 'AssetTypeId', type: 'int' },
		{ header: 'Asset Type', dataIndex: 'AssetType', type: 'string', width: 150 },
		{ header: 'Model Number', dataIndex: 'ModelNumber', type: 'string' },
		{ header: 'Manufacturer', dataIndex: 'Manufacturer', type: 'string' },
		{ header: 'Client', type: 'string', dataIndex: 'Client', width: 150 },
		{ header: 'Shelves', dataIndex: 'Shelves', type: 'int', width: 50, align: 'right' },
		{ header: 'Columns', dataIndex: 'Columns', type: 'int', width: 70, align: 'right' },
		{ header: 'Life', dataIndex: 'Life', type: 'int', width: 50, align: 'right' },
		{ header: 'Capacity Type', dataIndex: 'AssetTypeCapacity', type: 'string' },
		{ header: 'Capacity', dataIndex: 'Capacity', type: 'float', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(2) },
		{ header: 'Warranty', dataIndex: 'Warranty', type: 'int', width: 70, align: 'right' },
		{ header: 'Cabinet Height', dataIndex: 'CabinetHeight', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(2) },
		{ header: 'Cabinet Width', dataIndex: 'CabinetWidth', type: 'float', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(2) },
		{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
		{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
		{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
		{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
		{ header: 'Is Open Front?', dataIndex: 'IsOpenFront', type: 'bool', renderer: ExtHelper.renderer.Boolean, width: 120 }

	],

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var allowedAlertTypeSpecification = "Allowed parameter:<br> CoolerTopSpace : 2(Any Valid Value), <br> CoolerLeftSpace : 2(Any Valid Value), <br> CoolerRightSpace : 2(Any Valid Value), <br> CoolerBottomSpace : 2(Any Valid Value), <br> CoolerShelveHeight : 2(Any Valid Value), <br> CoolerShelveWidth : 2(Any Valid Value) <br><br> Text used for Key should be the same as mentioned above, Value may be differ";
		var manufacturerCombo = DA.combo.create({ fieldLabel: 'Manufacturer', hiddenName: 'ManufacturerId', baseParams: { comboType: 'Manufacturer' }, width: 250, listWidth: 180, controller: "Combo", allowBlank: false });
		var doorHandleLocationCombo = DA.combo.create({ fieldLabel: 'Door Handle Location', hiddenName: 'DoorHandleLocation', mode: 'local', store: [[0, "Left"], [1, "Right"]], width: 250, allowBlank: false });
		var capacityTypeCombo = DA.combo.create({ fieldLabel: 'Capacity Type', hiddenName: 'AssetTypeCapacityId', store: this.comboStores.AssetTypeCapacity, width: 250, listWidth: 250, mode: 'local' });
		var clientCombo = DA.combo.create({
			fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 200, width: 250,
			baseParams: { comboType: 'Client' }, listeners: {
				blur: Cooler.changeTimeZone,
				change: this.onClientChange,
				scope: this
			}
		});
		this.capacityTypeCombo = capacityTypeCombo;
		this.clientCombo = clientCombo;

		var columnStore = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7'], [8, '8'], [9, '9'], [10, '10'], [11, '11'], [12, '12'], [13, '13'], [14, '14'], [15, '15']];
		var columnCombo = DA.combo.create({ fieldLabel: 'Columns', value: 1, hiddenName: 'Columns', store: columnStore, width: 130, allowBlank: false });
		this.columnCombo = columnCombo;

		var shelvesStore = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7'], [8, '8'], [9, '9'], [10, '10'], [11, '11'], [12, '12'], [13, '13'], [14, '14'], [15, '15']];
		var shelvesCombo = DA.combo.create({ fieldLabel: 'Shelves', value: 1, hiddenName: 'Shelves', store: shelvesStore, width: 130, allowBlank: false });
		this.shelvesCombo = shelvesCombo;
		var items = [];
		Ext.apply(config, {
			layout: 'column',
			border: false,
			items: [
				{
					border: false,
					layout: 'form',
					labelWidth: 90,
					bodyStyle: 'padding: 5px',
					defaults: {
						width: 250
					},
					items: [
						{ fieldLabel: 'Asset Type', name: 'Name', xtype: 'textfield', maxLength: 50, allowBlank: false },
						{ fieldLabel: 'Model Number', name: 'ModelNumber', xtype: 'textfield', maxLength: 50, allowBlank: false },
						manufacturerCombo,
						this.clientCombo,
						shelvesCombo,
						columnCombo,
						{ fieldLabel: 'Life', name: 'Life', xtype: 'numberfield', maxValue: 100, allowDecimals: false, allowBlank: false },
						{ fieldLabel: 'Warranty', name: 'Warranty', xtype: 'numberfield', maxValue: 100, allowDecimals: false, allowBlank: false },
						{ fieldLabel: 'Cabinet Height', name: 'CabinetHeight', xtype: 'numberfield', allowDecimals: true },
						{ fieldLabel: 'Cabinet Width', name: 'CabinetWidth', xtype: 'numberfield', allowDecimals: true },
						{ fieldLabel: 'Select File', name: 'selectFile', xtype: 'fileuploadfield' }
					]
				},
				{
					border: false,
					layout: 'form',
					labelWidth: 90,
					bodyStyle: 'padding: 5px',
					defaults: {
						width: 250
					},
					items: [
						tagsPanel,
						this.capacityTypeCombo,
						{ fieldLabel: 'Capacity', name: 'Capacity', xtype: 'numberfield', minValue: 0, maxValue: 5000, allowDecimals: true, allowBlank: false },
						IsOpenFront = DA.combo.create({ fieldLabel: 'Is Open Front', hiddenName: 'IsOpenFront', store: "yesno" })
					]
				}
			]
		});
		return config;
	},
	onClientChange: function (combo, record, newValue) {
		if (DA.Security.info.Tags.ClientId == 0) {
			if (record) {
				if (this.assetCapacitytypeComboStoreJson == undefined || this.assetCapacitytypeComboStoreJson == {}) {
					this.assetCapacitytypeComboStoreJson = JSON.parse(JSON.stringify(this.capacityTypeCombo.store.reader.jsonData));
				}
				var assetTypeCapcityList = [];
				var assettypecapacityObj = {};
				this.recordValue = record;
				var assetTypeCapacityData = this.assetCapacitytypeComboStoreJson;

				assettypecapacityObj = $.grep(assetTypeCapacityData, function (e) { return e.ReferenceValue === record; });

				for (var i = 0, len = assettypecapacityObj.length; i < len; i++) {
					var record = assettypecapacityObj[i];
					assetTypeCapcityList.push(record);
				}
				this.assettypeCapacity = assetTypeCapcityList;
				this.capacityTypeCombo.store.loadData(this.assettypeCapacity);
			}
		}
	},
	FileUploader: {
		Show: function (options) {
			options = options || {};
			Ext.applyIf(options, {
				fieldLabel: 'Select files',
				allowedTypes: []
			});
			var url = EH.BuildUrl('AssetTypeImage');
			var params = options.params || {};
			Ext.apply(params, {
				action: 'Save',
				AssetTypeId: Cooler.AssetType.activeRecordId
			});
			Cooler.AssetType.uploadParams = params;
			if (!this.win) {
				var uploadFile = new Ext.form.FileUploadField({
					fieldLabel: options.fieldLabel,
					width: 250,
					name: 'file',
					multiple: true,
					vtype: 'fileUpload',
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
								formPanel.form.submit({
									params: Cooler.AssetType.uploadParams,
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
			for (var i = 1; i < totalFiles.length; i++) { // starting from 1 to not select first path that contain fakepath
				html += '<li>' + totalFiles[i] + '</li>';
			}
			html = '<ul>' + html + '</ul>';
			listContainer.el.update(html);
		},
		onFailure: function (form, action) {
			Ext.MessageBox.alert('Error', action.result.info);
		},

		onSuccess: function (form, action) {
			var data = Ext.decode(action.response.responseText);
			this.win.hide();
			var fileName = this.formPanel.getComponent(0).getValue().replace('C:\\fakepath\\', '');
			var imageGrid = Cooler.AssetTypeImage.grid;
			imageGrid.store.load();
		}
	},
	CreateFormPanel: function (config) {
		var imageUploadButton = new Ext.Button({ text: 'Upload', itemId: 'upload', handler: function () { Cooler.AssetType.FileUploader.Show() }, iconCls: 'upload' });
		var tbarItems = [imageUploadButton];
		var assetTypeImageGrid = Cooler.AssetTypeImage.createGrid({ title: 'Asset Type Images', height: 250, region: 'center', allowPaging: false, editable: false }, true);
		assetTypeImageGrid.topToolbar.splice(1, 0, imageUploadButton);
		var notesObj = new DA.Note();
		var notesGrid = notesObj.createGrid();
		var attachmentObj = new DA.Attachment();
		var attachmentGrid = attachmentObj.createGrid({ title: 'Document' });
		var grids = [];
		grids.push(assetTypeImageGrid);
		this.childModules = [Cooler.AssetTypeImage];
		this.childGrids = grids;
		this.assetTypeImageGrid = assetTypeImageGrid;
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			defaults: { layout: 'fit', border: false },
			items: [
				notesGrid,
                attachmentGrid,
				assetTypeImageGrid
			]
		});

		Ext.apply(config, {
			region: 'north',
			height: 300,
			fileUpload: true
		});

		this.formPanel = new Ext.FormPanel(config);
		this.on('beforeSave', this.onBeforeSave, this);
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
		});
		this.on('dataLoaded', function (rmsForm, data) {
			var assetTypeId = data.data.Id;
			if (assetTypeId === 0) {
				notesGrid.setDisabled(true);
				attachmentGrid.setDisabled(true);
				this.assetTypeImageGrid.setDisabled(true);
			}
			else {
				notesGrid.setDisabled(false);
				attachmentGrid.setDisabled(false);
				this.assetTypeImageGrid.setDisabled(false);
			}
			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				var clientCombo = this.clientCombo;
				ExtHelper.SetComboValue(clientCombo, clientId);
				clientCombo.setDisabled(true);
			}
			this.loadTags(this.tagsPanel, data);
			notesObj.SetAssociationInfo("Location", assetTypeId);
			attachmentObj.SetAssociationInfo("Location", assetTypeId);

			if (assetTypeId !== 0) {
				notesGrid.loadFirst();
				attachmentGrid.loadFirst();
				this.assetTypeImageGrid.loadFirst();
			}


		});

		this.assetTypeImageGrid.on('rowdblclick', this.assetTypeImagePreview, this);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 580,
			width: 740,
			items: [this.formPanel, tabPanel]
		});
	},
	imageExists: function (url, callback) {
		var img = new Image();
		img.onload = function () { callback(true); };
		img.onerror = function () { callback(false); };
		img.src = url;
	},
	assetTypeImagePreview: function () {
		var record = this.assetTypeImageGrid.getSelectionModel().getSelected();
		this.assetTypeImagePreview = new Ext.Window({
			width: 300,
			constrain: true,
			html: '',
			height: 300,
			layout: 'fit',
			autoScroll: true,
			resizable: true,
			modal: false,
			closeAction: 'hide'
		});
		this.assetTypeImagePreview.setTitle(record.get('Filename'));
		this.assetTypeImagePreview.html = '<img src=./FileServer/AssetType/' + record.get('StoredFilename') + ' />';
		if (this.assetTypeImagePreview.body) { // for refreshing window's html 
			this.assetTypeImagePreview.body.update(this.assetTypeImagePreview.html);
		}
		this.assetTypeImagePreview.show();
	},
	onBeforeSave: function (assetTypeForm, params) {
		this.saveTags(this.tagsPanel, params);
	}
});

Cooler.AssetTypeImage = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Asset Type Image',
		keyColumn: 'AssetTypeImageId',
		controller: 'AssetTypeImage',
		captionColumn: null,
		allowExport: false,
		disableAdd: true,
		disableDelete: false,
		gridConfig: {
			prefManager: false,
			autoFilter: false,
			custom: { allowBulkDelete: true },
			allowPaging: false
		}
	});
	Cooler.AssetTypeImage.superclass.constructor.call(this, config);
};
Ext.extend(Cooler.AssetTypeImage, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'AssetTypeImageId', type: 'int' },
		{ name: 'Filename', type: 'string' },
		{ name: 'StoredFilename', type: 'string' }
	]),
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Image File name', dataIndex: 'Filename', width: 250, displaytooltip: 'true' }
		]);
		return cm;
	},
	gridTooltip: undefined,
	showTooltip: function (e, t) {
		var target = e.getTarget(".x-grid3-cell");
		if (!target) {
			return;
		}
		var grid = this.grid;
		var colIndex = grid.getView().findCellIndex(target);
		if (colIndex === false || colIndex < 0) {
			return;
		}
		var rowIndex = grid.getView().findRowIndex(target);
		if (rowIndex === false || rowIndex < 0) {
			return;
		}
		var record = grid.getStore().getAt(rowIndex);
		if (!this.gridTooltip) {
			this.gridTooltip = new Ext.Layer({ shadow: false, shim: false });
		}
		var position = e.getXY();
		var tip = this.gridTooltip;
		if (record === tip.lastRecord) {
			return;
		}
		// check if we need to display tooltip
		var gridConfig = this.grid.getColumnModel().config;
		if (gridConfig[colIndex].displaytooltip !== 'true' || gridConfig[colIndex].displaytooltip === 'undefined') {
			return;
		}
		if (record !== tip.lastRecord) {
			tip.update(this.getTooltipHtml(record, rowIndex, colIndex));
			tip.lastRecord = record;
			tip.setLeftTop(position[0] + 25, position[1] - 35);
		}
		this.clearTipTimer();
		this.tipShowTimer = this.setTooltipVisible.defer(1000, this);
	},
	setTooltipVisible: function () {
		this.gridTooltip.setVisible(true);
		this.tipDismissTimer = this.hideTooltip.defer(5000, this);
	},
	clearTipTimer: function () {
		if (this.tipShowTimer) {
			clearTimeout(this.tipShowTimer);
		}
		clearTimeout(this.tipDismissTimer);
	},
	hideTooltip: function () {
		this.clearTipTimer();
		if (this.gridTooltip) {
			this.gridTooltip.setVisible(false);
			delete this.gridTooltip.lastRecord;
		}
	},
	getTooltipHtml: function (record, rowIndex, colIndex) {
		var cm = this.grid.getColumnModel();
		var colId = cm.getColumnId(colIndex);
		var col = cm.getColumnById(colId);
		if (col.dataIndex == 'Filename') {
			var tipHtml = '<img height="100" src="./FileServer/AssetType/' + record.get('StoredFilename') + '" />';
			return tipHtml;
		}
		return '';
	},
	onGridCreated: function (grid) {
		this.grid = grid;
		grid.on('render', function () {
			grid.getView().mainBody.on({
				'mousemove': this.showTooltip,
				'mouseover': this.showTooltip,
				'mouseout': this.hideTooltip,
				scope: this
			});
			grid.on('beforedestroy', this.onBeforeGridDestroy, this);
		}, this);
	}
});
Cooler.AssetTypeImage = new Cooler.AssetTypeImage();
