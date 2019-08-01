Cooler.Media = new Cooler.Form({
	controller: 'Media',
	keyColumn: 'MediaId',
	captionColumn: 'MediaTitle',
	listTitle: 'Media',
	securityModule: 'Media',
	logoUrl: './FileServer/',
	comboTypes: [
		'MediaType'
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'MediaId', type: 'int' },
			{ header: 'Media Title', dataIndex: 'MediaTitle', type: 'string', width: 150 },
			{ header: 'Media Type', dataIndex: 'MediaType', type: 'string', width: 150 },
			{ header: 'FileType', dataIndex: 'MediaFileType', type: 'string', width: 150 },
			{ header: 'Album', dataIndex: 'Album', type: 'string', width: 150 },
			{ header: 'Album Title', dataIndex: 'Title', type: 'string', width: 150 },
			{ header: 'Artist', dataIndex: 'Artist', type: 'string', width: 150 },
			{ header: 'Duration', dataIndex: 'MediaFileDuration', type: 'int', align: 'right', width: 70 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},
	comboStores: {
		MediaType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	createForm: function (config) {
		var logoField = new Ext.ux.Image({ height: 120, src: "" });
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Media Image',
			name: 'MediaImage',
			vtype: 'fileUpload'
		});
		var uploadMedia = new Ext.form.FileUploadField({
			fieldLabel: 'Media',
			name: 'Media',
			vtype: 'mediaUpload'
		});
		this.logoField = logoField;
		this.uploadImage = uploadImage;
		this.uploadMedia = uploadMedia;
		var col1 = {
			columnWidth: .7,
			defaults: {
				width: 250
			},
			items: [
				{ xtype: 'textfield', fieldLabel: 'Media Title', name: 'MediaTitle', maxLength: 100, allowBlank: false },
				DA.combo.create({ fieldLabel: 'Media Type', name: 'MediaTypeId', hiddenName: 'MediaTypeId', store: this.comboStores.MediaType, width: 250, allowBlank: false }),
				uploadImage,
				uploadMedia
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
		this.on('beforeSave', this.onBeforeSave, this);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 550,
			height: 200,
			resizable: false,
			constrain: true,
			items: [this.formPanel]
		});
		this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
	},

	onDataLoaded: function (mediaForm, data) {
		var record = data.data;
		if (record) {
			Cooler.loadThumbnail(this, record, this.logoUrl + "MediaImage/imageNotFound.png", this.uploadImage.name);
		}
		this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
	},
	onBeforeSave: function (mediaForm, params, options) {
			var uploadedImage = mediaForm.uploadImage,
				uploadedMedia = mediaForm.uploadMedia;
			this.validateUpload(uploadedImage);
			this.validateUpload(uploadedMedia);
	},
	validateUpload: function (field) {
		var value = field.value,
			validateValue = true,
			isFieldEmpty;
		if (value) {
			validateValue = field.validateValue(value);
			isFieldEmpty = document.getElementById(field.id);
			if (Ext.isEmpty(isFieldEmpty.value)) {
				validateValue = false;
			}
		}
		if (!validateValue) {
			field.reset();
		}
	}
});