Cooler.LocationImage = new Cooler.Form({
	controller: 'LocationImage',
	keyColumn: 'LocationImageId',
	title: 'Image',
	allowExport: false,
	disableAdd: true,
	disableDelete: false,
	gridConfig: {
		prefManager: false,
		autoFilter: false,
		custom: {
			allowBulkDelete: true,
			tbar: [new Ext.Toolbar.Button({ text: 'Upload', iconCls: 'upload', handler: function () { Cooler.LocationImage.fileUploader.show() }, scope: this })]
		}
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'LocationImageId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ header: 'Filename', dataIndex: 'Filename', type: 'string', width: 300 },
			{ header: 'Consumer Name', dataIndex: 'Username', type: 'string', width: 150 },
			{ dataIndex: 'StoredFilename', type: 'string' }
		];
	},

	// Multiple file uploaded
	fileUploader: {
		show: function (options) {
			options = options || {};
			Ext.applyIf(options, {
				fieldLabel: 'Select file'
			});
			var url = EH.BuildUrl('LocationImage');
			var params = options.params || {};
			Ext.apply(params, {
				action: 'Save',
				LocationId: Cooler.LocationImage.grid.getStore().baseParams.LocationId
			});
			Cooler.LocationImage.uploadParams = params;
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
									params: Cooler.LocationImage.uploadParams,
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
			for (var i = 1, len = totalFiles.length; i < len; i++) { // starting from 1 to not select first path that contain fakepath
				html += '<li>' + totalFiles[i] + '</li>';
			}
			html = '<ul>' + html + '</ul>';
			listContainer.el.update(html);
		},
		onFailure: function (form, action) {
			Ext.MessageBox.alert('Error', action.result.info);
		},

		onSuccess: function (form, action) {
			this.win.hide();// close uploader window
			var imageGrid = Cooler.LocationImage.grid;
			imageGrid.store.load();
		}
	},

	onGridCreated: function (grid) {
		grid.on("cellclick", this.onGridCellclick, this);
	},

	onGridCellclick: function (grid, rowIndex, e, options) {
		var store = grid.getStore(),
		 	record = store.getAt(rowIndex);
		var fileName = record.get('Filename');
		var imageName = record.get('StoredFilename');
		var imageUrl = './FileServer/LocationImage/' + imageName;
		Cooler.showImageWindow(record, imageUrl, fileName);
	}
});