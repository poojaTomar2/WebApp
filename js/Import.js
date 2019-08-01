Cooler.Import = {};
Cooler.Import = Ext.apply(Cooler.Import, {

	Show: function (importType) {

		if (!this.win) {
			var uploadFile = new Ext.form.TextField({
				fieldLabel: 'Select File',
				width: 250,
				name: 'selectFile',
				inputType: 'file',
				regex: /^.*\.(CSV|csv)$/,
				regexText: 'Only CSV attachment type accepted'
			});
			var typeStore = [
				[1, "Outlet"]
			];
			var typeCombo = DA.combo.create({ fieldLabel: 'Import Type', hiddenName: 'type', store: typeStore, listWidth: 150 });
			// create form panel
			var formPanel = new Ext.form.FormPanel({
				labelWidth: 100,
				bodyStyle: "padding:15px;",
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
				width: 400,
				height: 150,
				layout: 'fit',
				modal: true,
				plain: true,
				closeAction: 'hide',
				items: formPanel,
				buttons: [
				{
					text: 'Import',
					handler: function () {
						// check form value 
						if (formPanel.form.isValid()) {
							typeCombo.setDisabled(false);
							formPanel.form.submit({
								params: baseParams,
								Type: typeCombo.value,
								waitMsg: 'Uploading...',
								success: this.onSuccess,
								scope: this
							});
						} else {
							Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
						}
					},
					scope: this
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

	showErrorList: function (data, errorInfo) {
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
                { id: 0, header: 'Row#', dataIndex: 'Row', width: 50 },
                { id: 1, header: 'Key', dataIndex: 'Key', width: 100 },
                { id: 2, header: 'Error', dataIndex: 'Error', width: 300 }
			];

			var grid = new Ext.grid.GridPanel({
				columns: cm,
				store: store,
				tbar: [
				 new Ext.Button({
				 	text: 'Export',
				 	iconCls: 'export',
				 	handler: function () {
				 		var options = { header1: 'Timesheet Import Details' };
				 		window.location.href = 'data:application/vnd.ms-excel;base64,' + Base64.encode(this.errorGrid.getExcelXml(false, options));
				 	},
				 	scope: this
				 })
				]
			});

			win = new Ext.Window({
				title: title,
				width: 500,
				height: 300,
				modal: true,
				layout: 'fit',
				closeAction: 'hide',
				items: [grid],
				tbar: [
					"->",
				 {
				 	text: '', handler: function () {
				 		var errorMessage = '';
				 		var errorStore = this.errorGrid.getStore();
				 		errorStore.each(function (record) {
				 			errorMessage += 'Row#: ' + record.get("Row") + ' Key: ' + record.get("Key") + ' Error: ' + record.get("Error") + '<br>';
				 		});
				 		this.ShowErrorMessage(errorMessage);
				 	}, scope: this, iconCls: 'print', tooltip: 'Error Message'
				 }
				]
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

	onProgressUpdate: function (options, success, response) {
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
						Ext.Msg.alert("Import completed", "Processed " + data.Total + " rows.");
					}
				} else {
					this.messageBar.updateText("Processed " + data.Total + " rows.");
				}
			} else {
				Ext.Msg.alert("Error", data.info);
			}
		}
	},

	onSuccess: function (form, action) {
		var result = action.result;
		var message = result.info;
		var data = result.data;
		this.win.hide();
		if (data) {
			var importKey = data;
			var task = {
				run: function () {
					Ext.Ajax.request({
						url: EH.BuildUrl("WithSessionImport"),
						params: { importKey: importKey },
						callback: this.onProgressUpdate,
						scope: this
					});
				},
				interval: 5 * 1000,
				scope: this
			};
			this.task = Ext.TaskMgr.start(task);
			this.messageBar = Ext.Msg.wait("Import", "Importing", "File loaded");
		} else {
			this.messageBar = Ext.Msg.alert('Import failed', message);
		}
	}
});
