DA.Import = function(config) {
	Ext.apply(this, config);
}

Ext.override(DA.Import, {
	Show: function(importType) {

		if (!this.win) {
			var uploadFile = new Ext.form.TextField({
				fieldLabel: 'Select File',
				width: 200,
				autoCreate: { tag: "input", type: "text", size: 45, autocomplete: "off" },
				name: 'selectFile',
				inputType: 'file',
				allowBlank: false
			});
			var typeCombo = DA.combo.create({ fieldLabel: 'Import Type', hiddenName: 'type', store: this.importTypes, allowBlank: false, width: 313 });

			// create form panel
			var formPanel = new Ext.form.FormPanel({
				labelWidth: 100,
				bodyStyle: "padding:5px;",
				fileUpload: true,
				plugins: [ExtHelper.Plugins.ExceptionHandler],
				url: EH.BuildUrl('WithSessionImport'),
				items: [
                    uploadFile,
                    typeCombo
                ]
			});
			var baseParams = this.baseParams;
			// define window
			var window = new Ext.Window({
				title: 'Import',
				width: 500,
				height: 200,
				layout: 'fit',
				modal: true,
				plain: true,
				closeAction: 'hide',
				items: formPanel,
				buttons: [
				{
					text: 'Import',
					handler: function() {
						// check form value 
						if (formPanel.form.isValid()) {
							typeCombo.setDisabled(false);
							formPanel.form.submit({
								params: baseParams,
								waitMsg: 'Uploading...',
								success: this.onSuccess,
								scope: this
							});
						} else {
							Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
						}
					},
					scope: this
				}, {
					text: 'Help',
					handler: function() {
						DA.Help.Show({ helpKey: 'import', extraKey: 'grid', title: window.title });
					}, scope: this, tooltip: 'Help'
				}
				]
			});

			this.formPanel = formPanel;
			this.win = window;
			this.typeCombo = typeCombo;
		}
		this.formPanel.form.reset();

		this.win.show();
		if (importType) {
			this.typeCombo.setValue(importType);
			this.typeCombo.setDisabled(true);
		} else {
			this.typeCombo.setDisabled(false);
		}
	},

	showErrorList: function(data, errorInfo) {
		var win = this.errorWindow;
		var title = "Processed " + data.Total + " rows.";
		if (data.Failed > 0) {
			title += " Successful: " + data.Imported + ", Failed: " + data.Failed;
		}
		if (!win) {
			var store = new Ext.data.JsonStore({
				fields: [
                    { name: 'Row', type: 'int', mapping: 0 },
                    { name: 'Key', type: 'string', mapping: 1 },
                    { name: 'Error', type: 'string', mapping: 2 }
                ]
			});

			var cm = [
                { header: 'Row#', dataIndex: 'Row', width: 50 },
                { header: 'Key', dataIndex: 'Key', width: 100 },
                { header: 'Error', dataIndex: 'Error', width: 300 }
            ];

			var grid = new Ext.grid.GridPanel({
				columns: cm,
				store: store
			});

			win = new Ext.Window({
				title: title,
				width: 500,
				height: 300,
				modal: true,
				layout: 'fit',
				closeAction: 'hide',
				items: [grid]
			});
			this.errorGrid = grid;
			this.errorWin = win;
		} else {
			win.setTitle(title);
		}
		this.errorGrid.getStore().loadData(errorInfo);
		this.errorWin.show();
	},

	importKey: null,

	progressWin: null,

	onProgressUpdate: function(options, success, response) {
		var data;
		var error;
		var isRunning = false;
		if (!success) {
			error = response.responseText;
		} else {
			var data;
			try {
				data = Ext.decode(response.responseText);
			}
			finally {
			}
			if (typeof (data) !== 'object') {
				error = response.responseText;
			} else {
				if (data.data) {
					isRunning = data.data.TaskStatus === 1;
				}
			}
		}
		if (!isRunning) {
			Ext.TaskMgr.stop(this.task);
			this.messageBar.hide();
			delete this.messageBar;
			delete this.task;
		}
		if (error) {
			ExtHelper.OpenWindow({ id: 'ErrorWindow', title: 'Error', width: 600, height: 400, html: response.responseText, autoScroll: true, modal: true });
		} else {
			if (data.data) {
				var errorInfo = data.moreInfo;
				var data = data.data.StatusInfo;
				if (!isRunning) {
					if (data.Failed > 0) {
						this.showErrorList(data, errorInfo);
						return;
					} else {
						Ext.Msg.alert("Import", "Import Completed. Processed " + data.Total + " rows.");
					}
				} else {
					this.messageBar.updateText("Processed " + data.Total + " rows.");
				}
			} else {
				Ext.Msg.alert("Error", data.info);
			}
		}
	},

	onSuccess: function(form, action) {
		var result = action.result;
		var message = result.info;
		var data = result.data;
		var importType = this.typeCombo.getValue();
		this.win.hide();
		if (data) {
			var importKey = data;
			var task = {
				run: function() {
					Ext.Ajax.request({
						url: EH.BuildUrl("WithSessionImport"),
						params: { importKey: importKey, type: importType },
						callback: this.onProgressUpdate,
						scope: this
					});
				},
				interval: 1 * 1000,
				scope: this
			};
			this.task = Ext.TaskMgr.start(task);
			this.messageBar = Ext.Msg.wait("Import", "Importing", "File loaded");
		} else {
			Ext.Msg.alert('Import failed', message);
		}
	}

});