Ext.ns('DA.form.plugins');
Ext.ns('DA.plugins');

/*
    Options:
    module: DA-form
    copyFields: records to be copied from previous row
    comboFields: fields that need to be assigned to the caption fields
    comboNameFieldSuffix: suffix that needs to be used to identify the Caption field. Defaults to Name
    modifiedRowOptions: Options for GetModifiedRows function
*/
DA.form.plugins.Inline = function(options) {
	Ext.apply(this, options);
};

DA.form.plugins.Inline.prototype = {
	init: function (module, gridConfig) {
		this.module = module;

		if (gridConfig) {
			if (module.canEdit()) {
				Ext.applyIf(gridConfig, {
					editable: true
				});
			}
			if (gridConfig.tbar) {
				if (module.canEdit()) {
					var saveCaption = 'Save';
					if (module.saveCaption) {
						saveCaption = module.saveCaption;
					}
					if (gridConfig.tbar.length > 0) {
						gridConfig.tbar.splice(1, 0, ({ text: saveCaption, listeners: { click: { fn: this.onSave, scope: this, delay: 20} }, iconCls: 'save' }));
					} else {
						gridConfig.tbar.push({ text: saveCaption, listeners: { click: { fn: this.onSave, scope: this, delay: 20} }, iconCls: 'save' });
					}
				}
				if (module.canDelete() && !module.disableDelete) {
					if (!this.onDelete) {
						this.onDelete = this.module.deleteHandler;
					}
					gridConfig.tbar.push({ text: 'Delete', handler: this.onDelete, scope: this.module, iconCls: 'delete' });
				}
			}
		}

		Ext.applyIf(module, {
			inlineEdit: true
		});
	},

	apply: function (grid) {
		var qe = this;
		qe.grid = grid;

		qe.grid.getStore().on('beforeload', this.onGridBeforeLoad, this);

		if (qe.copyFields) {
			qe.grid.on('beforeedit', qe.onBeforeEdit, qe);
		}

		if (qe.comboFields) {
			qe.grid.on('validateedit', qe.onValidateEdit, qe);
		}

		Ext.applyIf(this, {
			comboNameFieldSuffix: 'Name'
		});
	},

	getCaptionFieldName: function (idField) {
		var len = idField.length;
		var captionField = idField;
		if (len >= 2) {
			var endsWidth = idField.substr(len - 2, 2);
			if (endsWidth === "Id") {
				captionField = idField.substr(0, len - 2);
			}
		}
		captionField += this.comboNameFieldSuffix;
		return captionField;
	},

	onBeforeEdit: function (e) {
		var fieldName = e.field;
		var rec = e.record;

		var qe = this;

		// If first row, or not in copy field list or has a value, return
		if (e.row === 0 || qe.copyFields.indexOf(fieldName) === -1 || rec.get(fieldName) !== null) {
			return;
		}

		// Default from previous row
		var store = qe.grid.getStore();
		var pRec = store.getAt(e.row - 1);
		rec.set(fieldName, pRec.get(fieldName));

		if (qe.comboFields && qe.comboFields.indexOf(fieldName) > -1) {
			var captionField = qe.getCaptionFieldName(fieldName);
			rec.set(captionField, pRec.get(captionField));
		}
	},

	onValidateEdit: function (e) {
		var fieldName = e.field;
		var qe = this;

		if (qe.comboFields.indexOf(fieldName) === -1) {
			return;
		}

		var rec = e.record;
		var editor = qe.grid.getColumnModel().getCellEditor(e.column, e.row);
		var captionField = qe.getCaptionFieldName(fieldName);
		e.record.set(captionField, editor.field.getRawValue());
		editor.field.setRawValue(editor.field.getRawValue());
	},

	onSave: function (options) {
		var result = true;
		this.grid.stopEditing();
		if (result) {
			result = this.module.fireEvent.call(this.module, "beforeQuickSave", this, options);
		}

		if (result) {
			var grid = this.grid;
			var store = grid.getStore();
			var keyColumn = this.module.keyColumn;
			var gridValidationResult = ExtHelper.ValidateGrid(grid, { startEditing: true });
			if (gridValidationResult.IsValid) {
				var data = ExtHelper.GetModifiedRows(Ext.apply({ grid: grid, includeId: true, keyField: keyColumn }, this.modifiedRowOptions));
				if (data.length > 0) {
					//---------------------------------------------- Correct Data For Date fields with Localizer -------------
					var fields = this.grid.store.fields.items;
					var dateFieldsWithLocalizer = [];
					for (var i = 0, len = fields.length; i < len; i++) {
						var field = fields[i];
						if (field.type === 'date' && field.convert === Ext.ux.DateLocalizer) {
							dateFieldsWithLocalizer.push(field);
						}
					}
					var modifiedData = ExtHelper.GetModifiedRows(Ext.apply({ grid: grid, includeId: true, keyField: keyColumn }, { fields: 'modified' }));//---Get Records with modified fields
					if (dateFieldsWithLocalizer.length > 0) {
						for (var i = 0, len = data.length; i < len; i++) {
							var record = data[i];
							var modifiedRecord = modifiedData[i];
							for (j = 0; j < dateFieldsWithLocalizer.length; j++) {
								var fieldName = dateFieldsWithLocalizer[j].name;
								if (modifiedRecord[fieldName]) {//-------if field is modified, don't change value
									continue;
								}
								var fieldValue = record[fieldName];
								if (fieldValue && Ext.isDate(fieldValue)) {
									fieldValue = fieldValue.add(Date.MINUTE, fieldValue.getTimezoneOffset());
									record[fieldName] = fieldValue;
								}
							}
						}
					}
					//-----------------------------------------------------------------------------------------------------------
					ExtHelper.GenericCall({
						url: EH.BuildUrl(this.module.quickSaveController ? this.module.quickSaveController : this.module.controller),
						params: Ext.apply({ action: 'quickSave', lineItems: Ext.encode(data)}, this.module.baseParams),
						timeout: this.requestTimeout ? this.requestTimeout : 30000,
						title: 'Save',
						handleSuccess: false,
						onSuccess: function () {
							var result = this.result.data;
							var errorInfo = '';
							var successCount = 0;
							for (var i = 0; i < result.length; i++) {
								var clientId = result[i].id;
								var serverId = result[i].Id;
								if (!serverId) {
									serverId = result[i].id;
								}
								if (serverId) {
									var record = store.getById(clientId);
									if (!record) {
										var idx = store.findExact(keyColumn, clientId);
										if (idx > -1) {
											record = store.getAt(idx);
										}
									}
									record.set(keyColumn, serverId);
									record.commit();
									successCount += 1;
								} else {
									errorInfo += ", " + this.result.data[i].error;
								}
								if (errorInfo.length > 0) {
									errorInfo = errorInfo.substring(2, errorInfo.length); //Removing first comma
								}
							}

							var hasError = false;

							if (successCount < data.length) {
								hasError = true;
								DA.Util.ShowError("Error while saving", (data.length - successCount) + " record(s) failed with following errors: <br />" + errorInfo);
							}
							if (options && options.afterSave) {
								options.afterSave.call();
							}
							if (!hasError) {
								result = this.options.scope.fireEvent("afterQuickSave", this, options);
							}
						},
						scope: this.module
					});
				} else {
					Ext.Msg.alert('Information', 'Nothing to update');
				}
			}
		}
	},

	onGridBeforeLoad: function (store, options) {
		if (!store.lastOptions) {
			var comboTypes = this.module.getComboTypesForLoad();
			Ext.applyIf(options, {
				callback: function (r, options, success) {
					var reader = store.reader;
					var jsonData = reader.jsonData;
					this.loadComboData(jsonData);
					if (jsonData.combos && this.grid) {
						this.grid.getView().refresh();
					}
				},
				params: {},
				scope: this.module
			});
			Ext.apply(options.params, {
				comboTypes: Ext.encode(comboTypes)
			});
		}

		var grid = this.grid;
		var keyColumn = this.module.keyColumn;
		var modifiedRowsParams = { grid: grid, keyField: keyColumn };
		if (this.module.fieldsToPost) {
			modifiedRowsParams.fields = this.module.fieldsToPost;
			modifiedRowsParams.checkModified = this.module.checkModified;
		}
		var data = ExtHelper.GetModifiedRows(modifiedRowsParams);
		if (data.length > 0) {
			var bbar = grid.getBottomToolbar();
			if (bbar) {
				if (bbar.loading) {
					bbar.loading.enable();
				}
			}
			Ext.Msg.show({
				title: 'Save changes?',
				msg: 'You have unsaved changes. If you continue without save, changes will be lost. Would you like to save?',
				buttons: Ext.Msg.YESNOCANCEL,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					switch (btn) {
						case "yes":
							this.onSave.call(this, { afterSave: function () {
								grid.store.load(options);
							}
							});
							break;
						case "no":
							DA.cancelInlineEditableGrid({ grid: grid, keyColumn: keyColumn });
							break;
					}
				},
				scope: this
			});
			return false;
		}
	}
};

DA.plugins.ReportMenu = function (options) {
    Ext.apply(this, options);
    Ext.applyIf(this, {
        /**
         * @cfg {string} menuText Menu text
         **/
        menuText: 'Reports',
        /**
         * @cfg {Object} params Additional parameters for report
         **/
        params: {}
        /**
         * @cfg {string} after Menu item after which the report menu should be appeneded. Defaults to separater
         **/
        //after: '->'
    });
};

Ext.override(DA.plugins.ReportMenu, {
	/**
	* @cfg {string} availableForNew Whether menu should be enabled for new record. Only applicable for form. (defaults to false)
	**/
	availableForNew: false,

	openInWindow: false,

	onDataLoaded: function (form, action) {
		var isNew = true;
		if (action.result && action.result.data) {
			var id = action.result.data.Id;
			if (!isNaN(id) && id != 0) {
				isNew = false;
			}
		}
		this.reportItem.setDisabled(isNew);
	},

	init: function (cmp, gridConfig) {
		if (cmp.getXType() != 'form') {
			gridConfig = cmp;
		}
		var tbar;
		var disabled = false;
		if (typeof (gridConfig) == 'undefined') {
			switch (cmp.getXType()) {
				case 'form':
					this.form = cmp;
					tbar = cmp.getTopToolbar();
					if (this.availableForNew === false) {
						cmp.on('actioncomplete', this.onDataLoaded, this);
						disabled = true;
					}
					break;
			}
		} else {
			tbar = gridConfig.getTopToolbar();
		}

		if (tbar) {
			var reportMenu = new Ext.menu.Menu({
				items: this.items
			});

			var updatedItems = [];
			for (var i = 0; i < reportMenu.items.items.length; i++) {
				var item = reportMenu.items.items[i];
				var canRemove = false;
				if (item.denyAccess) {
					if (DA.Security.HasPermission(item.denyAccess, 'Module') && !DA.Security.IsSuperAdmin()) {
						canRemove = true;
					}
				}
				else if (item.securityModule) {
					if (!DA.Security.HasPermission(item.securityModule, 'Module') && !DA.Security.IsSuperAdmin()) {
						canRemove = true;
					}
				}
				if (!canRemove) {
					updatedItems.push(item); //If this passed security add to the menu
				}
			}

			reportMenu.items.items = updatedItems; //Assigning back to original items

			delete this.items;

			reportMenu.on('itemclick', this.onReportMenuClick, this);

			var reportItem = new Ext.Toolbar.Button({ text: this.menuText, menu: reportMenu, disabled: disabled });

			var after = this.after || "->";
			var sepIndex = tbar.indexOf(after);
			if (sepIndex == -1) {
				sepIndex = tbar.length;
			}

			if (!this.securityModule || DA.Security.HasPermission(this.securityModule)) {
				tbar.splice(sepIndex, 0, "-", reportItem);
			}

			this.reportMenu = reportMenu;
			this.reportItem = reportItem;
		}
	},

	apply: function (grid) {
		this.grid = grid;
	},

	/**
	* Handles click event and uses the tag to identify the report to show
	* item.tag must be the name of the report and this.grid must contain grid
	*/
	onReportMenuClick: function (item) {
		if (this.reportMenu) {
			this.reportMenu.hide();
		}

		if (item.ignoreReportHandler == true) {
			return;
		}

		var report = item.tag;
		var params = item.params;
		if (!params) {
			params = {};
		}
		Ext.apply(params, this.params);
		if (this.form) {
			Ext.apply(params, this.form.getForm().baseParams);
		}

		var grid = item.scope.grid;
		var filterDescription;
		if (grid && grid.getSelectionModel().getSelected() && grid.isVisible()) {
			Ext.apply(params, { id: grid.getSelectionModel().getSelected().id });

			var module = DA.Form.prototype;
			filterDescription = module.resolveFilterDescription(grid);
		}
		else if (grid && !this.form && !item.skipSelectionCheck) {
			Ext.Msg.alert('Alert', 'Please select a record');
			return;
		}
		Ext.apply(params, {
			Report: report,
			ClientDateTime: new Date()
		});

		Ext.applyIf(params, {
			filterDescription: filterDescription
		});

		var generateReport = function (item, params, report, scope) {
			if (typeof (item.validateFn) == 'function') {
				var e = {
					params: params,
					cancel: false,
					report: report
				}
				item.validateFn.call(scope, e);
				if (e.cancel === true) {
					if (e.showErrorMessage !== false) {
						var errorMessage = e.errorMessage || 'This option cannot be executed at this time';
						Ext.Msg.alert('Error', errorMessage);
					}
					return;
				}
			}

			var target = '_blank';
			if (this.openInWindow) {
				var tab = DCPLApp.AddTab({
					id: 'Report_' + report,
					title: item.text,
					uri: 'about:blank'
				});

				var iFrame = tab.items.get(0).el.dom;
				target = iFrame.name;
			} else {
				Ext.applyIf(params, {
					download: 1
				});
			}

			var saveToAttachments = false;
			if (item.saveToAttachments) {
				saveToAttachments = true;
			}
			if (!saveToAttachments) {
				var action = (item.controller) ? 'controllers/' + item.controller + '.ashx' : 'Report.ashx';
				if (item.extraParams) {
					Ext.applyIf(params, item.extraParams);
				}
				ExtHelper.HiddenForm.submit({
					target: target,
					params: params,
					action: action
				});
			}
			else if (DA.Security.info.SendAttachmentId) {
				ExtHelper.GenericConnection.request({
					timeout: 120000,
					url: 'Report.ashx',
					params: params,
					callback: function (o, success, response) {
						if (!success) {
							Ext.Msg.alert('An error occured', 'An error occured');
						}
						else {
							var jsonResponse = Ext.decode(response.responseText);
							if (jsonResponse.data) {
								Ext.Msg.alert('Info', jsonResponse.data);
							} else {
								Ext.apply(ExtHelper.openWindow(EH.BuildUrl('downloadattachment') + '?id=' + response.responseText));
								
								//ExtHelper.HiddenForm.submit({
								//	target: target,
								//	action: EH.BuildUrl('downloadattachment') + '?id=' + response.responseText,
								//	params: {}
								//});
								if (typeof (item.afterComplete) == 'function') {
									var e = {
										report: report
									}
									item.afterComplete.call(this, e);
								}
							}
						}
					},
					scope: this
				});
			}
			else {
				params.isReportSave = true;
				ExtHelper.HiddenForm.submit({
					target: target,
					params: params,
					action: 'Report.ashx'
				});
				if (typeof (item.afterComplete) == 'function') {
					var e = {
						report: report
					}
					item.afterComplete.call(this, e);
				}
			}
			if (item.reload && item.module) {
				var el = Ext.get(this.form.el);
				el.mask('Printing...');
				var x = function () {
					item.module.load(params.id); //reloading
					el.unmask();
				}
				x.defer(500);
			}
		}

		if (item.confirmationMessage) {
			Ext.Msg.confirm('Confirm', item.confirmationMessage, function (btn) {
				if (btn == 'yes') {
					generateReport(item, params, report, this);
				}
			}, this);
		} else {
			generateReport(item, params, report, this);
		}
	}
});

DA.plugins.GridTitleCount = function(options) {
    Ext.apply(this, options);
}

Ext.override(DA.plugins.GridTitleCount, {
	init: function(grid) {
		if (grid.getXType() == 'grid') {
			this.grid = grid;
			this.grid.getStore().on('datachanged', this.onDataChanged, this);
			this.title = grid.title;
		}
	},
	onDataChanged: function(store) {
		var gridTitle = '';
		if (store.getTotalCount() > 0) {
			gridTitle = store.getTotalCount();
			if (this.countPrefix) {
				gridTitle = this.countPrefix + gridTitle;
			}
			if (this.countSuffix) {
				gridTitle = gridTitle + this.countSuffix;
			}
		}
		this.grid.setTitle(String.format(this.title, gridTitle));
	}
});