Cooler.LocalizationFile = new Cooler.Form({
	controller: 'LocalizationFile',

	title: 'Localization File',

	keyColumn: 'LocalizationFileId',

	comboTypes: ['Application'],

	disableDelete: false,
	securityModule: 'LocalizationFile',
	gridConfig: {
		custom: {
			loadComboTypes: true
		}
	},

	winConfig: {
		height: 150,
		width: 412
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'LocalizationFileId', type: 'int', header: 'Id' },
			{ header: 'Application Name', dataIndex: 'ApplicationId', store: this.comboStores.Application, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Application }), type: 'int', width: 200 },
			{ header: 'Version', dataIndex: 'ApplicationVersion', type: 'int', width: 200 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
		]
	},

	comboStores: {
		Application: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	createForm: function (config) {
		var applicationName = DA.combo.create({
			fieldLabel: 'Application Name', name: 'ApplicationId', hiddenName: 'ApplicationId', store: this.comboStores.Application, mode: 'local', width: 240, listWidth: 230
		});
		var version = { fieldLabel: 'Application Version', name: 'ApplicationVersion', xtype: 'numberfield', allowDecimals: false, minValue: 1, maxValue: 100, allowBlank: false };
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'File Upload',
			width: 250,
			name: 'selectFile',
			validator: function (v) {
				if (!/^.*\.(json)$/i.test(v)) {
					return 'Please select valid file.';
				}
				return true;
			}
		});
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				applicationName,
				version,
				uploadImage
			],
			fileUpload: true
		});
		this.applicationName = applicationName;
		this.on('dataLoaded', this.onDataLoaded);
		this.on('beforeSave', function (LocalizationFileForm, params, options) {
			var form = LocalizationFileForm.formPanel.getForm();
			var version = form.findField('ApplicationVersion').getValue();
			if (Number(version) === version && version % 1 != 0) {
				Ext.Msg.alert('Error', 'Decimal value not allowed in Application Version.');
				return false;
			}
			if (form.findField('selectFile').fileInput.dom.files.length == 0) {
				Ext.Msg.alert('Upload File', 'File is missing. Please uplaod a file.');
				return false;
			}
		}, this);
		return config;
	},

	onDataLoaded: function (form, data) {
		if (this.applicationName.value > 0) {
			this.applicationName.setDisabled(true);
		}
	}
});