Cooler.ProductCategory = Ext.extend(Cooler.Form, {
	keyColumn: 'ProductCategoryId',
	captionColumn: 'ProductCategoryName',
	formTitle: 'Product Category : {0}',
	controller: 'ProductCategory',
	securityModule: 'ProductCategory',
	listTitle: 'Product Category',
	logoUrl: './FileServer/ProductCategory/',
	hybridConfig: function () {
		return [
			{ dataIndex: 'ProductCategoryId', type: 'int' },
			{ header: 'Product Category Name', dataIndex: 'ProductCategoryName', type: 'string', width: 200 },
			{ header: 'Category Color', dataIndex: 'CategoryColor', type: 'string', width: 200 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},
	createForm: function (config) {
		var logoField = new Ext.ux.Image({ height: 120, src: "" });
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			name: 'selectFile',
			vtype: 'fileUpload'
		});
		this.logoField = logoField;
		this.uploadImage = uploadImage;
		var col1 = {
			columnWidth: .7,
			defaults: {
				width: 250
			},
			items: [
				{ xtype: 'textfield', fieldLabel: 'Category Name', name: 'ProductCategoryName', maxLength: 100, allowBlank: false },
				{ xtype: 'textfield', fieldLabel: 'Category Color', name: 'CategoryColor', maxLength: 10, allowBlank: false },
				uploadImage
			]
		};
		var col2 = { columnWidth: .3, items: [logoField] };
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1, col2],
			fileUpload: true
		});
		return config;
	},
	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.on('dataLoaded', this.onDataLoaded, this);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 550,
			height: 200,
			resizable: false,
			constrain: true,
			items: [this.formPanel]
		});
	},
	onDataLoaded: function (productCategoryForm, data) {
		var record = data.data;
		if (record) {
			Cooler.loadThumbnail(this, record, this.logoUrl + "/imageNotFound.png");
		}
		this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
	}
});
Cooler.ProductCategory = new Cooler.ProductCategory({ uniqueId: 'ProductCategory' });