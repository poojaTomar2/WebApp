Cooler.ProductForm = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.ProductForm.superclass.constructor.call(this, config);
	},
	controller: 'Product',
	captionColumn: 'Product',
	securityModule: 'Product',
	logoUrl: './products/thumbnails/',
	winConfig: { height: 400, width: 425 },
	comboTypes: ['Client', 'Country'],
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	onGridCreated: function (grid) {
		grid.on("cellclick", this.onGridCellclick, this);
	},
	onGridCellclick: function (grid, rowIndex, e) {
		var row = grid.getStore().getAt(rowIndex);
		var productId = row.get('ProductId');
		var productOnboardingGridStore = this.productOnboardingGrid.getStore();
		if (productOnboardingGridStore) {
			productOnboardingGridStore.baseParams.ProductId = productId;
			productOnboardingGridStore.load();
			grid.setDisabled(false);
		}

	},
	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'ProductId', type: 'int' },
			{ dataIndex: 'ClientName', type: 'string' },
			{ header: 'Product', dataIndex: 'Product', type: 'string' },
			{ header: 'SKU', dataIndex: 'SKU', type: 'string' },
			{ header: 'UPC', dataIndex: 'UPC', type: 'string' },
			{ header: 'Price', dataIndex: 'Price', type: 'float', align: 'right' },
			{ header: 'Is Foreign Product?', dataIndex: 'IsForeign', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ dataIndex: 'Country', type: 'string' },
			{ header: 'Country', dataIndex: 'CountryId', type: 'int', displayIndex: 'Country', renderer: 'proxy', store: this.comboStores.Country, width: 100 },
			{ header: 'State', dataIndex: 'State', type: 'string' },
			{ dataIndex: 'StateId', type: 'int' },
			{ dataIndex: 'ManufacturerId', type: 'int' },
			{ header: 'Product Category', dataIndex: 'ProductCategory', type: 'string' },
			{ header: 'Product Group', dataIndex: 'GroupName', type: 'string' },
			{ header: 'Manufacturer', dataIndex: 'Manufacturer', type: 'string' },
			{ header: 'Distributor', dataIndex: 'DistributorName', type: 'string' },
			{ dataIndex: 'DistributorId', type: 'int' },
			{ header: 'Packaging Type', dataIndex: 'PackagingType', type: 'string' },
			{ header: 'Beverage Type', dataIndex: 'BeverageType', type: 'string' },
			{ header: 'Measurement Unit', dataIndex: 'MeasurementUnit', type: 'string', width: 120 },
			{ dataIndex: 'MeasurementUnitTypeId', type: 'int' },
			{ header: 'Brand', dataIndex: 'BrandName', type: 'string' },
			{ dataIndex: 'BrandId', type: 'int' },
			{ header: 'CoolerIoT Client', displayIndex: 'ClientName', dataIndex: 'ClientName', type: 'string' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Graph Color', dataIndex: 'GraphColor', type: 'string' },
			{ dataIndex: 'IsEmpty', type: 'bool' },
			{ header: 'Short Name', dataIndex: 'ShortName', type: 'string' },
			{ header: 'Font Color', dataIndex: 'FontColor', type: 'string' },
			{ header: 'Font Style', dataIndex: 'FontStyle', type: 'string' },
			{ header: 'Height', dataIndex: 'Height', align: 'right', renderer: ExtHelper.renderer.Float(2), type: 'float' },
			{ header: 'Width', dataIndex: 'Width', align: 'right', renderer: ExtHelper.renderer.Float(2), type: 'float' },
			{ header: 'Tags', dataIndex: 'Tags', width: 150, type: 'string' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 160, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 160, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
			{ header: 'Is Image Available?', dataIndex: 'IsImageAvailable', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool', sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Barcode', dataIndex: 'Barcode', type: 'string' },
			{ header: 'BAN', dataIndex: 'Ban', type: 'string' },
			{ header: 'Is Unknown?', dataIndex: 'IsUnknownBool', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ header: 'Language Key', dataIndex: 'LanguageKey', type: 'string' },
			{ header: 'Flavour', dataIndex: 'FlavourName', type: 'string' },
			{ header: 'Sales Unit', dataIndex: 'SalesUnitName', type: 'string' },
			{ header: 'Serving Type', dataIndex: 'ServingTypeName', type: 'string' },
			{ header: 'Is Trained?', dataIndex: 'IsTrained', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean }
		];
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var filterFields = ['product'];
		this.filterFields = filterFields;
		this.skuTextField = new Ext.form.TextField({ width: 150 });
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.resetGridStore();
				if (!Ext.isEmpty(this.skuTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { product: this.skuTextField.getValue() });
				}
				this.grid.loadFirst();
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {
				this.resetGridStore();
				this.skuTextField.reset();
				this.grid.loadFirst();
			}, scope: this
		});
		tbarItems.push('|');
		tbarItems.push('SKU:');
		tbarItems.push(this.skuTextField);
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	resetGridStore: function () {
		var storeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete storeBaseParams[filterField];
		}
	},
	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});
		grid.getTopToolbar().splice(0, 0, {
			text: 'Copy', iconCls: 'new', handler: this.onCopy, scope: this,
			hidden: (!DA.Security.info.Modules.Product.Add && !DA.Security.info.Modules.Product.Edit) || (DA.Security.info.Tags.ClientId != 0)
		});
		var productOnboardingGrid = Cooler.ProductOnboarding.createGrid({ disabled: true });
		this.productOnboardingGrid = productOnboardingGrid;

		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [productOnboardingGrid],
			height: 250,
			split: true
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
	onCopy: function () {
		if (!this.copyForm) {
			var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', store: Cooler.comboStores.Client, mode: 'local', allowBlank: false, listWidth: 220 });
			var copyForm = new Ext.FormPanel({
				itemId: 'copyForm',
				defaults: {
					labelStyle: 'width: 110px; margin-left: 13px;'
				},
				items: [
					clientCombo
				]
			});
			this.copyForm = copyForm;
		}
		if (!this.copyWindow) {
			var window = new Ext.Window({
				width: 350,
				height: 100,
				layout: 'fit',
				padding: 10,
				title: 'Product Copy',
				resizable: false,
				constrain: true,
				items: this.copyForm,
				closeAction: 'hide',
				tbar: [
					{
						xtype: 'button',
						text: 'Copy',
						handler: this.onCopyProduct,
						iconCls: 'save',
						scope: this
					},
					{
						xtype: 'button',
						text: 'Cancel',
						iconCls: 'cancel',
						handler: function () {
							this.copyWindow.hide();
						},
						scope: this
					}
				],
				modal: true
			});
			this.copyWindow = window;
		}
		this.copyWindow.show();
	},
	onCopyProduct: function () {
		var form = this.copyForm.getForm();
		this.form = form;
		var formValues = form.getValues();
		var clientId = formValues.ClientId;
		if (!form.isValid()) {
			Ext.MessageBox.alert('Alert', 'Please select "CoolerIoT Client"');
			return false;
		}
		Ext.Msg.confirm('Update', 'Are you sure you want to Copy all the records with current grid filters ?', function (btn) {
			if (btn == 'yes') {
				this.form.reset();
				this.copyWindow.hide();
				if (!this.mask) {
					var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
					this.mask = mask;
				}
				this.mask.show();
				var params = this.grid.store.lastOptions.params;
				params.action = 'copyProduct';
				params.clientId = clientId;
				Ext.Ajax.request({
					url: EH.BuildUrl('Product'),
					params: params,
					success: this.onCopySuccess,
					failure: this.onCopyFailure,
					scope: this
				});
			}
		}, this);
	},
	onCopySuccess: function (response, success) {
		this.mask.hide();
		Ext.Msg.alert('Success', Ext.decode(response.responseText).data);
		this.grid.store.reload();
	},
	onCopyFailure: function () {
		this.mask.hide();
		Ext.Msg.alert('Error', 'Product Copy failed..Try again.');
	},
	onDataLoaded: function (coolerForm, data) {
		this.loadTags(this.tagsPanel, data);
		this.productImageGrid.getStore().removeAll();
		if (this.activeRecordId == 0) {
			this.productImageGrid.topToolbar.items.get('upload').setDisabled(true);
		}
		else {
			this.productImageGrid.topToolbar.items.get('upload').setDisabled(false);
			var baseParamsDetail = this.productImageGrid.getStore().baseParams;
			baseParamsDetail.ProductId = this.activeRecordId;
			if (this.activeRecordId > 0) {
				this.productImageGrid.loadFirst();
			}
		}
	},
	createForm: function (config) {
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var countryCombo = DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 220, allowBlank: false });
		var stateCombo = DA.combo.create({ fieldLabel: 'State', name: 'StateId', hiddenName: 'StateId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'State' } });
		var brandCombo = DA.combo.create({ fieldLabel: 'Brand', name: 'BrandId', hiddenName: 'BrandId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Brand' }, allowBlank: false });
		var distributorCombo = DA.combo.create({ fieldLabel: 'Distributor', name: 'DistributorId', hiddenName: 'DistributorId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Distributor' }, allowBlank: false });
		var packagingTypeCombo = DA.combo.create({ fieldLabel: 'Packaging Type', name: 'PackagingTypeId', hiddenName: 'PackagingTypeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'PackagingType' }, allowBlank: false });
		var measurementUnitCombo = DA.combo.create({ fieldLabel: 'Measurement Unit', name: 'MeasurementUnitId', hiddenName: 'MeasurementUnitTypeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'MeasurementUnit' } });
		//var manufacturerCombo = DA.combo.create({ fieldLabel: 'Manufacturer', name: 'ManufacturerId', hiddenName: 'ManufacturerId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Manufacturer' }, allowBlank: false });
		var brandCombo = DA.combo.create({ fieldLabel: 'Brand', name: 'BrandId', hiddenName: 'BrandId', controller: 'combo', baseParams: { comboType: 'Brand' }, listWidth: 220 });
		var distributorCombo = DA.combo.create({ fieldLabel: 'Distributor', name: 'DistributorId', hiddenName: 'DistributorId', controller: 'combo', baseParams: { comboType: 'Distributor' }, listWidth: 220 });
		var packagingTypeCombo = DA.combo.create({ fieldLabel: 'Packaging Type', name: 'PackagingTypeId', hiddenName: 'PackagingTypeId', controller: 'combo', baseParams: { comboType: 'PackagingType' }, listWidth: 220, allowBlank: false });
		var fontStyle = DA.combo.create({ fieldLabel: 'Font Style', hiddenName: 'FontStyle', store: [["Bold", "Bold"], ["Italic", "Italic"]], valueField: 'DisplayValue' });
		var productCategoryCombo = DA.combo.create({ fieldLabel: 'Product Category', name: 'ProductCategoryId', hiddenName: 'ProductCategoryId', controller: 'combo', baseParams: { comboType: 'ProductCategory' }, listWidth: 220 });
		var logoField = new Ext.ux.Image({ fieldLabel: 'Logo', height: 120, src: "", style: "margin-left:90px;margin-top:30px" });
		var beverageCombo = DA.combo.create({ fieldLabel: 'Beverage Type', name: 'BeverageTypeId', hiddenName: 'BeverageTypeId', controller: 'combo', baseParams: { comboType: 'BeverageType' }, listWidth: 220 });
		var clientIotCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', baseParams: { comboType: 'Client' }, listWidth: 220, allowBlank: false });
		var productGroupCombo = DA.combo.create({ fieldLabel: 'Product Group', hiddenName: 'ProductGroupId', controller: 'combo', baseParams: { comboType: 'ProductGroup' }, listWidth: 220 });
		var flavourCombo = DA.combo.create({ fieldLabel: 'Flavour', name: 'FlavourId', hiddenName: 'FlavourId', controller: 'combo', baseParams: { comboType: 'Flavour' }, listWidth: 220 });
		var salesUnitCombo = DA.combo.create({ fieldLabel: 'Sales Unit', name: 'SalesUnitId', hiddenName: 'SalesUnitId', controller: 'combo', baseParams: { comboType: 'SalesUnit' }, listWidth: 220 });
		var servingTypeCombo = DA.combo.create({ fieldLabel: 'Serving Type', name: 'ServingTypeId', hiddenName: 'ServingTypeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'ServingType' } });
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			width: 200,
			name: 'selectFile',
			vtype: 'fileUpload'
		});
		this.salesUnitCombo = salesUnitCombo;
		this.servingTypeCombo = servingTypeCombo;
		this.flavourCombo = flavourCombo;
		this.clientIotCombo = clientIotCombo;
		var currencyCombo = DA.combo.create({ fieldLabel: 'Currency Type', name: 'CurrencyTypeId', hiddenName: 'CurrencyTypeId', controller: 'combo', baseParams: { comboType: 'Currency' }, listWidth: 300 });
		this.currencyCombo = currencyCombo;
		//new Ext.Button({ name: 'ProductThumbnail', text: 'Image Upload', handler: this.onUploadLogoClick, scope: this, disabled: true });
		this.logoField = logoField;
		this.uploadImage = uploadImage;

		var col1 = {
			columnWidth: .5,
			defaults: {
				width: 130
			},
			items: [
				{ fieldLabel: 'Product', name: 'Name', xtype: 'textfield', maxLength: 100, allowBlank: false },
				{ fieldLabel: 'SKU', name: 'SKU', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'UPC', name: 'UPC', xtype: 'textfield', maxLength: 20 },
				countryCombo,
				stateCombo,
				{ fieldLabel: 'Graph Color', name: 'GraphColor', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Font Color', name: 'FontColor', xtype: 'textfield', maxLength: 50 },
				DA.combo.create({ fieldLabel: 'Is Empty?', hiddenName: 'IsEmpty', store: "yesno" }),
				brandCombo,
				distributorCombo,
				packagingTypeCombo,
				beverageCombo,
				measurementUnitCombo,
				{ fieldLabel: 'Short Name', name: 'ShortName', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'Height', name: 'Height', xtype: 'numberfield', allowDecimals: true },
				{ fieldLabel: 'Width', name: 'Width', xtype: 'numberfield', allowDecimals: true },
				fontStyle,
				tagsPanel

			]
		};
		var col2 = {
			columnWidth: .5,
			defaults: {
				width: 130
			},
			items: [
				productCategoryCombo,
				productGroupCombo,
				clientIotCombo,
				{ fieldLabel: 'Price', name: 'Price', xtype: 'numberfield', allowDecimals: true },
				currencyCombo,
				{ fieldLabel: 'Barcode', name: 'Barcode', xtype: 'textfield', maxLength: 50 },
				{ fieldLabel: 'BAN', name: 'Ban', xtype: 'textfield', maxLength: 50 },
				{ fieldLabel: 'Language Key', name: 'LanguageKey', xtype: 'textfield', maxLength: 50 },
				this.flavourCombo,
				this.salesUnitCombo,
				this.servingTypeCombo,
				DA.combo.create({ fieldLabel: 'Is Unknown?', hiddenName: 'IsUnknownBool', store: "yesno" }),
				uploadImage

			]
		};
		var col3 = {
			columnWidth: .5,
			items: [
				logoField
			]
		};

		ExtHelper.SetCascadingCombo(countryCombo, stateCombo);
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1, col2, col3],
			fileUpload: true
		});
		return config;
	},
	onUploadLogoClick: function () {
		DA.FileUploader.Show({
			params: { uploadType: 1 },
			formPanel: this.formPanel,
			onSuccess: this.onLogoUploaded,
			allowedTypes: [".png", ".jpg"],
			scope: this
		});
	},

	FileUploader: {
		Show: function (options) {
			options = options || {};
			Ext.applyIf(options, {
				fieldLabel: 'Select file',
				allowedTypes: []
			});
			var url = EH.BuildUrl('ProductImage');
			var params = options.params || {};
			Ext.apply(params, {
				action: 'Save',
				ProductId: Cooler.Product.activeRecordId
			});
			Cooler.Product.uploadParams = params;
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
									params: Cooler.Product.uploadParams,
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
			var imageGrid = Cooler.ProductImage.grid;
			imageGrid.store.load();
		}
	},

	CreateFormPanel: function (config) {
		var imageUploadButton = new Ext.Button({ text: 'Upload', itemId: 'upload', handler: function () { Cooler.Product.FileUploader.Show() }, iconCls: 'upload' });
		var tbarItems = [imageUploadButton];
		var productImageGrid = Cooler.ProductImage.createGrid({ title: 'Product Images', height: 250, region: 'center', allowPaging: false, editable: false }, true);
		var productGroupCodeGrid = Cooler.ProductGroupCode.createGrid({ title: 'Product Code', root: 'ProductGroupCode', region: 'center', allowPaging: false, editable: true, plugins: [new Ext.ux.ComboLoader()] });
		productImageGrid.topToolbar.splice(1, 0, imageUploadButton);
		var grids = [];
		grids.push(productImageGrid);
		grids.push(productGroupCodeGrid);
		this.childGrids = grids;
		this.childModules = [Cooler.ProductImage, Cooler.ProductGroupCode];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			layoutOnTabChange: true,
			defaults: { layout: 'fit', border: false },
			items: [productImageGrid, productGroupCodeGrid]
		});
		config.region = 'north';
		config.height = 470;
		this.formPanel = new Ext.FormPanel(config);
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
		});
		this.on('beforeSave', function (rmsForm, params, options) {
			this.saveTags(this.tagsPanel, params);
		});
		this.on('dataLoaded', function (product, data) {
			var record = data.data;
			if (record) {
				Cooler.loadThumbnail(this, record, "./products/notfound.png");
			}
			this.uploadImage.setFieldVisible(DA.Security.HasPermission('ProductImage'));
			this.productImageGrid.topToolbar.setVisible(DA.Security.HasPermission('ProductImage'));
			this.productImageGrid.topToolbar.items.items[0].setVisible(DA.Security.info.Modules["ProductImage"].Delete);
			this.productImageGrid.setDisabled(record.Id == 0);
			this.clientIotCombo.setDisabled(parseInt(DA.Security.info.Tags.ClientId) != 0);

		});
		this.uploadImage.on('fileselected', Cooler.onFileSelected, this);

		this.productImageGrid = productImageGrid;
		this.productImageGrid.on('rowdblclick', this.showProductPreview, this);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			width: 550,
			height: 630,
			items: [this.formPanel, tabPanel]
		});
	},
	imageExists: function (url, callback) {
		var img = new Image();
		img.onload = function () { callback(true); };
		img.onerror = function () { callback(false); };
		img.src = url;
	},
	showProductPreview: function () {
		var record = this.productImageGrid.getSelectionModel().getSelected();
		if (!this.productPreview) {
			this.productPreview = new Ext.Window({
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
		}
		this.productPreview.setTitle(record.get('Filename'));
		this.productPreview.html = '<img src=./products/' + record.get('StoredFilename') + ' />';
		if (this.productPreview.body) { // for refreshing window's html 
			this.productPreview.body.update(this.productPreview.html);
		}
		this.productPreview.show();
	}

});
Cooler.Product = new Cooler.ProductForm();
/////******** Child grid for poroduct images *********/////
Cooler.ProductImage = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Product Images',
		keyColumn: 'ProductImageId',
		controller: 'ProductImage',
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
	Cooler.ProductImage.superclass.constructor.call(this, config);
};
Ext.extend(Cooler.ProductImage, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'ProductImageId', type: 'int' },
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
			var tipHtml = '<img height="100" src="./products/' + record.get('StoredFilename') + '" />';
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
Cooler.ProductImage = new Cooler.ProductImage();