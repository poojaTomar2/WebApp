/*global Ext:false, DA:false, ExtHelper: false, alert: true, EH: false, DCPLApp: false */

/* DA
* 
* @license     Contact Durlabh Computers for Licensing Details
* @author      Durlabh Jain <durlabh@gmail.com>
* @copyright   Copyright (c) 2007-2008 Durlabh Computers Pvt. Ltd. (http://www.durlabhcomputers.com)
*
*/

Ext.ns("DA.plugins");

Ext.apply(DA, {
	Version: 1.0,
	Security: {},
	Help: {},
	Config: {}
});

/* Temporary constructors for static objects. Used for documentation only */
if (1 == 2) {
	/**
	* Security
	* @Constructor
	*/
	DA.Security = {};

	/**
	* Test2
	* @constructor
	*/
	DA.Util = function () {

	};

	/**
	* Test
	* @constructor
	* @namespace DA.Util
	*/
	DA.Util.Form = function () {

	};
}

DA.Defaults = {
	Grid: { loadMask: false, loadMsg: "Loading...", newRecordComboDefaults: false },
	Form: { loadMask: false, loadMsg: null, saveMask: false, saveMsg: null }
};

DA.ExportTemplate = {
	fields: {},
	prompt: function (options) {
		if (!this.win) {
			var form = new Ext.form.FormPanel({
				labelWidth: 60,
				bodyStyle: 'padding:5px',
				defaults: { width: 240 },
				items: [
					this.fields.Title = new Ext.form.TextField({ name: 'Title', fieldLabel: 'Title' }),
					this.fields.Header = new Ext.form.TextArea({ xtype: 'textarea', name: 'Header', fieldLabel: 'Header' }),
					this.fields.Footer = new Ext.form.TextArea({ xtype: 'textarea', name: 'Footer', fieldLabel: 'Footer' })
				]
			});
			var win = new Ext.Window({
				title: 'Export to ' + options.cfg.format,
				layout: 'fit',
				items: [form],
				closeAction: 'hide',
				height: 250,
				width: 350,
				buttons: [
					{ text: 'Ok', handler: this.onExport, scope: this },
					{ text: 'Cancel', handler: this.onCancel, scope: this }
				]
			});
			this.win = win;
			this.form = form;
		}
		if (this.options && this.options.grid == options.grid) {

		} else {
			this.win.setTitle('Export to ' + options.cfg.exportFormat);
			this.form.getForm().reset();
			this.fields.Title.setValue(options.cfg.Title);
			this.fields.Header.setValue(options.cfg.filterDescription);
		}
		this.options = options;
		this.win.show();
	},

	onCancel: function () {
		this.win.hide();
	},

	onExport: function () {
		var cfg = Ext.applyIf(this.form.getForm().getValues(), this.options.cfg);
		ExtHelper.ExportGrid(this.options.grid, cfg);
		this.win.hide();
	}
};

/**
* Class for handling of native browser popup window.
* <p>This class is intended to make the usage of a native popup window as easy as dealing with a modal window.<p>
* <p>Example usage:</p>
* <pre><code>
* var myBO = new DA.Form({
*		formTitle: 'Account: {0}',
*		listTitle: 'Account',
*		keyColumn: 'AccountId',
*		captionColumn: 'Name',
*		controller: 'Account',
*		winConfig: {height:400, width: 550}
* });
* </code></pre>
*/
DA.Form = function (config) {
	Ext.applyIf(this, {
		/**
		* @cfg {Object} newListRecordData Default data for new record
		*/
		newListRecordData: {},
		/**
		* @cfg {Object} baseParams Base parameters for the form
		*/
		baseParams: {},
		/**
		* @cfg {Object} winConfig Overriding config parameters for form popup window
		*/
		winConfig: {},
		/**
		* @cfg {Array} comboTypes Additional combo types to fetch. A list from form combos is automatically prepared. Example: ["Account", "Group"]
		*/
		comboTypes: [],
		/**
		* @property {Object} comboData Local cache of combo data loaded from server
		*/
		comboData: {},
		/**
		* @cfg {Object} comboStores Combo stores used for this form
		*/
		comboStores: {},
		/**
		* @cfg {Boolean} disableAdd Disable Add. Defaults to false.
		*/
		disableAdd: false,
		/**
		* @cfg {Boolean} disableDelete Disable Delete. Defaults to false.
		*/
		disableDelete: false,
		/**
		* @cfg {Boolean} allowExport Allow export. Defaults to true.
		*/
		allowExport: true,
		/**
		* @cfg {Boolean} gridIsLocal Whether grid is local. In this case, no callbacks are made
		*/
		gridIsLocal: false,
		/**
		* @cfg {Array} gridPlugins Plugins for the form's grid. These not really grid plugins. These are DA-Plugins
		*/
		gridPlugins: []
		/**
		* @cfg {String} tag column id
		*/
		//tagColumn: 'Name'
		/**
		* @cfg {Ext.data.Record} listRecord Record object for grid
		*/

		/**
		* @cfg {String} securityModule Security Module for the form
		*/

		/**
		* @cfg {Ext.grid.ColumnModel} cm ColumnModel for grid
		*/
		/**
		* @cfg {String} formTitle Title for the form
		*/
		/**
		* @cfg {String} listTitle Title for the grid
		*/
		/**
		* @cfg {String} keyColumn Property to identify the key in the list grid
		*/
		/**
		* @cfg {String} captionColumn Property to identify the caption of the form
		*/
		/**
		* @cfg {String} controller Controller
		*/
		/**
		* @property {Ext.grid.GridPanel} grid Main grid panel
		*/
		/**
		* @property {Number} activeRecordId Form's active record id
		*/
		/**
		* @cfg {Object} defaultMappings List of defaults
		*/
		/**
		* @property {Ext.form.FormPanel} formPanel
		*/
		/**
		* @property {Function} createForm Used to create the data entry form
		*/
		/**
		* @property {Ext.Window} win Main window for the popup form
		*/
		/**
		* @cfg gridConfig
		* @type {Object}
		* @desc Grid configuration defaults as passed to ExtHelper.CreateGrid or Ext.grid.GridPanel. Some of the additional options are:
		* <ul class="mdetail-params">
		*  <li><b>tBar</b> : Object<div class="sub-desc">Toolbar config for grid. Default buttons won't be added in this case.</div></li>
		*  <li><b>disableDblClickHandler</b> : Boolean<div class="sub-desc">Disable default double click handler on grid</div></li>
		*  <li><b>custom</b> : Object<div class="sub-desc">
		*    <ul class="mdetail-params">
		*      <li><b>tbar</b> : Array<div class="sub-desc">Additional buttons for the grid</div></li>
		*    </ul>
		*    </div>
		*  </li>
		*  <li><b>autoFilter</b> : Object<div class="sub-desc">Adds CherryOnExt grid filtering
		*    <ul class="mdetail-params">
		*      <li><b>quickFilter</b> : Boolean<div class="sub-desc">Whether quick filter context menu should be added</div></li>
		*    </ul>
		*   </div>
		*  </li>
		*  <li><b>prefManager</b> : Boolean<div class="sub-desc">Adds Preferences option for CherryOnExt</div></li>
		* </ul>
		*/
	});

	Ext.apply(this, config);

	this.addEvents(
        'beforeValidation',
	/**
	* @event beforeValidation
	* @desc  Fired before a validation of beforeSave
	* @param {DA.Form} form
	*/
        'afterSave',
	/**
	* @event beforeSave
	* @desc  Fired before a save callback is triggered on form
	* @param {DA.Form} form
	* @param {object} addlParams
	* @param {object} options
	*/
        'beforeSave',
	/**
	* @event dataLoaded
	* @desc  Fired after the data is loaded in the form
	* @param {DA.Form} form
	* @param {object} data
	*/
        'dataLoaded',
	/**
	* @event beforeShowForm
	* @desc  Fired after the form is created and before it is shown
	* @param {DA.Form} form
	* @param {object} args
	*/
        'beforeShowForm',
	/**
	* @event afterShowForm
	* @desc  Fired after the form is created and after it is shown
	* @param {DA.Form} form
	* @param {object} args
	*/
        'afterShowForm',
	/**
	* @event beforeLoad
	* @desc  Fired before the form load is called
	* @param {DA.Form} form
	* @param {object} args
	*/
        'beforeLoad',
	/**
	* @event dataUpdated
	* @desc  Fires after data updated
	* @param {object} args
	*/
        'dataUpdated',
	/**
	* @event beforeFormClose
	* @desc  Fired before the form is closed
	* @param {DA.Form} form
	* @param {object} args
	*/
        'beforeFormClose',
	/**
	* @event copy
	* @desc  Fired after copy operation
	* @param {DA.Form} form
	* @param {object} args
	*/
        'copy',
	/**
	* @event beforeQuickSave
	* @desc  Fired after copy operation
	* @param {DA.Form} form
	* @param {object} args
	*/
        'beforeQuickSave',
	/**
	* @event afterQuickSave
	* @desc  Fired after copy operation
	* @param {DA.Form} form
	* @param {object} args
	*/
        'afterQuickSave'
    );


	if (this.parentObjects) {
		var parentObjects = this.parentObjects;
		delete this.parentObjects;
		for (var i = 0; i < parentObjects.length; i++) {
			var parentObject = parentObjects[i];
			if (typeof parentObject !== 'object') {
				alert('Parent Object not defined');
			} else {
				parentObjects[i].on('dataUpdated', this.reloadGrid, this);
			}
		}
	}

	if (this.comboStores) {
		for (var comboType in this.comboStores) {
			if (this.comboStores[comboType] == null) {
				this.comboStores[comboType] = new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
			}
			var comboStore = this.comboStores[comboType];
			Ext.applyIf(comboStore, { baseParams: {} });
			Ext.applyIf(comboStore.baseParams, { comboType: comboType });
		}
	}

	if (this.controller) {
		Ext.applyIf(this, {
			title: this.controller
		});
	}

	if (this.title) {
		Ext.applyIf(this, {
			listTitle: this.getPlural(this.title),
			keyColumn: this.controller + 'Id',
			formTitle: this.title + ': {0}'
		});
	}

	DA.Form.superclass.constructor.call(this);
};

Ext.extend(DA.Form, Ext.util.Observable, {

	pruneDisallowed: function (arr) {
		if (Ext.isArray(arr)) {
			var toRemove = [];
			for (var i = 0, len = arr.length; i < len; i++) {
				var obj = arr[i], requiredPermission = obj.requiredPermission;
				if (requiredPermission) {
					if (!DA.Security.HasPermission(requiredPermission.module, requiredPermission.permission)) {
						toRemove.push(obj);
					}
				}
			}
			for (i = 0, len = toRemove.length; i < len; i++) {
				arr.remove(toRemove[i]);
			}
		}
		return arr;
	},

	getPlural: function (title) {
		if (title && title.length > 0) {
			var endsWith = title.substr(title.length - 1);
			if (endsWith === 'y' && 'aeiou'.indexOf(title.substr(title.length - 2)) === -1) {
				return title.substr(0, title.length - 1) + 'ies';
			} else if (endsWith === 's') {
				return title + 'es';
			} else {
				return title + 's';
			}
		}
	},

	yesNoAvailableValues: new Ext.data.SimpleStore({
		fields: ['LookupId', 'DisplayValue'],
		data: [
        ["1", "Yes"],
        ["0", "No"]
		],
		id: 'LookupId'
	}),

	reloadGrid: function () {
		var grid = this.grid;
		if (grid) {
			var store = grid.getStore();
			if (store && store.lastOptions && !DA.App.loadNext) {
				store.reload();
			}
		}
	},

	/**
	* @cfg {Boolean} allowOrdering allow reordering of grid rows. Defaults to false
	*/
	allowOrdering: false,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Show save and new button on the form
	*/
	saveAndNew: true,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Show save and close button on the form
	*/
	saveClose: true,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Show save only button on the form
	*/
	save: true,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Show new button on the form
	*/
	newButton: true,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Show copy button on the form
	*/
	copyButton: false,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Show delete button on the form
	*/
	deleteButton: true,

	reloadAfterSave: false,

	// whether grid needs to be reloaded after closing of popup
	closeFormAfterSave: false,

	/**
	* @cfg
	* @type {Boolean}
	* @desc Whether form needs to be validated before save
	*/
	validateForm: true,

	/**
	* @cfg
	* @type {Boolean}
	* @desc whether to load form as new after save
	*/
	loadNewAfterSave: false,

	/**
	* @cfg
	* @type {Boolean}
	* @desc whether to nothing after save
	*/
	noAction: false,

	/**
	* Creates a new record object for the grid
	* @returns object
	* @type object
	*/
	loadNextAfterSave: true,
	newGridRecord: function () {
		var record = new this.listRecord({});

		var fields = record.fields.items;
		var data = {}, i;
		for (i = 0; i < fields.length; i++) {
			var field = fields[i];
			switch (field.type) {
				case "int":
				case "float":
				case "real":
					data[field.name] = 0;
					break;

				case "string":
					data[field.name] = "";
					break;

				case "date":
					data[field.name] = "";
					break;

				case "bool":
					data[field.name] = false;
					break;
			}
		}

		if (typeof (this.newListRecordData) == 'function') {
			Ext.apply(data, this.newListRecordData.call(this, data));
		} else {
			Ext.apply(data, this.newListRecordData);
		}

		if (DA.Defaults.Grid.newRecordComboDefaults) {
			var cm = this.cm;
			if (typeof (this.cm) == 'function') {
				cm = this.cm();
			}
			if (!cm && this.grid) {
				cm = this.grid.getColumnModel();
			}
			if (cm) {
				var columnCount = cm.getColumnCount();
				for (i = 0; i < columnCount; i++) {
					var col = cm.getColumnById(i);
					if (col && col.editor && col.editor) {
						var oldvalue = data[col.dataIndex];
						if (oldvalue === null || oldvalue === undefined || oldvalue == '0' || oldvalue.length == 0) {
							var field = col.editor.field;
							if (field && field.store && field.store.baseParams && field.store.baseParams.comboType) {
								var lookupId = '';
								var displayValue = '';
								for (var j = 0; j < field.store.data.items.length; j++) {
									var storeItem = field.store.data.items[j].data;
									if (storeItem.IsDefault === true) {
										lookupId = storeItem.LookupId;
										displayValue = storeItem.DisplayValue;
										break;
									}
								}
								data[col.dataIndex] = lookupId;
								if (col.displayIndex) {
									data[col.displayIndex] = displayValue;
								}
							}
						}
					}
				}
			}
		}

		return new this.listRecord(data);
	},

	/**
	* addHandler is the default handler for Add button click
	*/
	addHandler: function () {
		if (this.gridIsLocal || (this.canAdd() && this.inlineEdit && !this.openForm)) {
			var grid = this.grid;
			var store = grid.getStore();
			store.add(this.newGridRecord());
			if (typeof (grid.startEditing) == 'function') {
				var cm = grid.getColumnModel();
				var cols = cm.getColumnCount();
				var rowIndex = store.getCount() - 1;
				for (var i = 0; i < cols; i++) {
					if (cm.getCellEditor(i, rowIndex)) {
						grid.startEditing(rowIndex, i);
						break;
					}
				}
			}
		} else {
			if (this.targetModule) {
				if (typeof this.targetModule == 'function') {
					this.targetModule().ShowForm(0, { id: 0 });
				} else {
					this.targetModule.ShowForm(0, { id: 0 });
				}
			}
			else {
				this.ShowForm(0, { id: 0 });
			}
		}
	},

	/**
	* @private {Boolean} disabled Readonly property returns whether form is disabled
	*/

	/**
	* Sets the mask on the formPanel
	* @param {Boolean} formDisabled Set true to show the mask and false to hide the mark
	*/
	setDisabled: function (disabled) {
		disabled = disabled !== false;
		this.formDisabled = disabled;
		this.formPanel.items.each(function (f) {
			if (f.isFormField) {
				// We need to disable.. mark that we did it programmatically
				if (disabled) {
					if (!f.DA) {
						f.DA = {};
					}
					f.DA.disabled = true;
					f.setDisabled(true);
				} else {
					if (f.DA && f.DA.disabled) {
						f.setDisabled(false);
					}
				}
			}
		});
	},

	/**
	* Sets the mask on the formPanel
	* @param {Boolean} disabled Set true to show the mask and false to hide the mark
	*/
	setMask: function (disabled) {
		if (disabled === false) {
			this.formPanel.body.unmask();
		} else {
			this.formPanel.body.mask();
		}
	},

	/**
	* Default handler for Grid's Delete button click. If gridIsLocal then records are removed
	* only from store. Otherwise, a callback is made and if successful, records are removed from store.
	*/
	deleteHandler: function () {
		var sm = this.grid.getSelectionModel();
		var rowSelectionMode = false;
		var selections = [];
		var store = this.grid.getStore();
		var msg;

		// if row selection mode, all the selections can be deleted
		if (sm.getSelections !== undefined) {
			rowSelectionMode = true;
			selections = sm.getSelections();
			msg = "Are you sure you want to delete " + selections.length + " selected records?";
		} else {
			var selectedCell = sm.getSelectedCell();
			if (selectedCell) {
				var rowIndex = selectedCell[0];
				var record = store.getAt(rowIndex);
				selections.push(record);
				msg = "Are you sure you want to delete this record?";
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
							Ids.push(selections[i].get(this.keyColumn));
						}
						Ids = Ids.join(",");
						ExtHelper.GenericCall({
							url: EH.BuildUrl(this.controller),
							params: Ext.apply({ action: 'delete', Ids: Ids }, this.baseParams),
							title: 'Delete',
							handleSuccess: false,
							success: function () {
								for (var i = 0; i < selections.length; i++) {
									store.remove(selections[i]);
								}
							},
							scope: this
						});
					}
				}
			}, this);
		}
	},

	/**
	* Default handler for Form's Delete button click.
	*/
	formDeleteHandler: function () {
		Ext.Msg.confirm("Delete", "Are you sure you want to delete this record?", function (btn) {
			if (btn == 'yes') {
				ExtHelper.GenericCall({
					url: EH.BuildUrl(this.controller),
					params: Ext.apply({ action: 'delete', ids: this.formPanel.baseParams.id }, this.baseParams),
					title: 'Delete',
					handleSuccess: false,
					success: function () {
						this.win.allowHide = true;
						this.fireEvent("dataUpdated", this, {});
						this.hideFormWin({ reloadGrid: true });
					},
					scope: this
				});
			}
		}, this);
	},

	/**
	* Default handler for Form's Delete button click.
	* @param {Object}
	* The valid options are:
	* <ul class="mdetail-params">
	*  <li><b>validate</b> : bool<div class="sub-desc">Whether any validations should be performed</div></li>
	*  <li><b>params</b> : object<div class="sub-desc">Parameters object that'll store the child grid records</div></li>
	* </ul>
	*/
	validateChildren: function (options) {
		var errorMessage = null;
		var params = options.params;
		var grids, i, len;

		if (options.validate !== false && this.requiredGrids) {
			for (var i = 0; i < this.requiredGrids.length; i++) {
				var grid = this.requiredGrids[i];
				if (grid.getStore().getCount() === 0) {
					errorMessage = "Atleast one item is required in " + grid.title;
					break;
				}
			}
		}

		if (options.validate !== false && !errorMessage && this.childGrids) {
			grids = this.childGrids;
			// validate and save all grids
			for (i = 0, len = grids.length; i < len; i++) {
				var gridValidationResult = ExtHelper.ValidateGrid(grids[i]);
				if (!gridValidationResult.IsValid) {
					var gridTitle = grids[i].title;
					if (gridTitle == '') {
						gridTitle = grids[i].root;
					}
					errorMessage = "Validation error in " + gridTitle + " item(s)";
					break;
				}
			}
		}

		if (errorMessage) {
			DA.Util.ShowError('Validation error', errorMessage);
		}
		else {
			if (this.childGrids) {
				grids = this.childGrids;
				for (i = 0, len = grids.length; i < len; i++) {
					var paramName = grids[i].initialConfig.root;
					if (paramName) {
						grids[i].getStore().clearFilter(); //For Child / Filter based grids
						if (grids[i].sortColumn) {
							grids[i].getStore().sort(grids[i].sortColumn, 'ASC');
						}
						paramName = paramName.substr(0, 1).toLowerCase() + paramName.substr(1);
						params[paramName] = ExtHelper.GetModifiedRows({ grid: grids[i], all: true, encoded: true });
					}
				}
			}
		}

		return errorMessage === null;
	},

	/**
	* Default handler for Form's Save button click.
	* @param {Object}
	* The valid options are:
	* <ul class="mdetail-params">
	*  <li><b>validate</b> : Boolean<div class="sub-desc">Whether any validations should be performed</div></li>
	*  <li><b>close</b> : Boolean<div class="sub-desc">Form should be closed</div></li>
	*  <li><b>loadNew</b> : Boolean<div class="sub-desc">New record should be loaded after save</div></li>
	* </ul>
	*/
	saveHandler: function (options) {
		if (!options) {
			options = {};
		}
		var form = this.formPanel.getForm();
		var addlParams = {};

		var requiresValidation = !(options.validate === false || this.validateForm === false);
		var result = !requiresValidation || form.isValid();
		var firstInvalid = null;
		var validationResult = {};
		this.fireEvent("beforeValidation", this, validationResult);
		if (validationResult.result === false) {
			return;
		}


		//Validation of additional fields in tab Panels
		if (result && requiresValidation) {
			var module = this;
			var addlFields = module.addlFormFields;
			if (addlFields) {
				for (var property in addlFields) {
					var field = addlFields[property];
					if (!field.disabled) {
						result = field.isValid();
						if (!result) {
							//Error found in validation show error message in next step
							firstInvalid = field;
							break;
						}
					}
				}
			}
		}

		if (!result) {
			Ext.Msg.alert('Error', 'Please correct data errors before continuing', function () {
				if (!firstInvalid) {
					firstInvalid = form.items.find(function (f) { return !f.isValid(); });
				}

				//Activating tab panel
				if (firstInvalid) {
					var p = firstInvalid, ownerCt;
					while (ownerCt = p.ownerCt) {
						if (ownerCt.isXType('tabpanel')) {
							ownerCt.setActiveTab(p);
						}
						p = ownerCt;
					}
					firstInvalid.focus();
				}
			});
		} else {
			addlParams = { action: 'save' };
			this.closeFormAfterSave = options.close;
			this.loadNewAfterSave = options.loadNew;
			this.loadNextAfterSave = options.loadNext;
			DA.App.loadNext = this.loadNextAfterSave;
			this.noAction = options.noAction;
			result = this.validateChildren({ params: addlParams, validate: requiresValidation });
		}

		if (result) {
			result = this.fireEvent("beforeSave", this, addlParams, options);
			if (result !== false) {
				DA.Util.Form.GetValues({ module: this, params: addlParams });
			}
		}

		if (result !== false) {
			var saveOptions = {};
			saveOptions.params = addlParams;
			if ((this.options && this.options.saveMask) || DA.Defaults.Form.saveMask) {
				saveOptions.waitMsg = DA.Defaults.Form.saveMsg ? DA.Defaults.Form.saveMsg : true;
			}
			if (options.validate === false || this.validateForm === false) {
				saveOptions.clientValidation = false;
			}
			if (options.submitOptions) {
				Ext.apply(saveOptions, options.submitOptions);
			}
			//set CheckOldVersion = true
			var checkOldVersionField = this.formPanel.find('name', 'CheckOldVersion')[0];
			if (checkOldVersionField) {
				checkOldVersionField.setValue(true);
			}
			if (options.confirmation) {
				var msg = 'Are you sure you want to continnue?';
				if (options.msg) {
					msg = options.msg;
				}
				ExtHelper.ShowYesNo({
					title: 'Close',
					msg: msg,
					scope: this,
					yesFn: function () {
						form.submit(saveOptions);
					}
				});
			} else {
				form.submit(saveOptions);
			}
		}
	},
	saveHandlerManual: function (saveOptions) {
		var options = options ? options : {};
		options.close = this.closeFormAfterSave;
		options.loadNew = this.loadNewAfterSave;
		options.loadNext = saveOptions ? saveOptions.loadNextAfterSave : this.loadNextAfterSave;
		options.noAction = this.noAction;
		this.saveHandler(options);
	},

	/**
	* Default handler for Grid's row double click. Opens the Editable form.
	*/
	rowDblClickHandler: function (grid, rowIndex, e, options) {
		var canContinue = true;
		if (typeof this.allowRowDblClick == 'function') {
			canContinue = this.allowRowDblClick(grid, rowIndex, e, options);
		};
		if (!canContinue) {
			return;
		}
		var toolbar = grid.getTopToolbar();
		if (toolbar && toolbar.disabled) {
			if (grid.controller != 'Attachment') { //Allow downloading of attachment in read-only mode
				return;
			}
		}

		var record = grid.getStore().getAt(rowIndex);
		var id = record.get(this.keyColumn);
		var args = {
			record: record,
			id: id,
			grid: grid
		};
		if (this.targetModule) {
			args.sourceModule = this;
			if (typeof this.targetModule == 'function') {
				this.targetModule().ShowForm(id, args);
			} else {
				this.targetModule.ShowForm(id, args);
			}
		}
		else {
			this.ShowForm(id, args);
		}
	},

	cellclick: function (grid, rowIndex, e, options) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e]

		if (column.hyperlinkAsDoubleClick === true) {
			this.grid.fireEvent('rowdblclick', grid, rowIndex, e, options);
		}
	},
	helpKeyOverride: null,

	/**
	* @returns Returns the helpKey for generic help function. Defaults to controller name
	* @type {String}
	*/
	helpKey: function () {
		var toReturn = this.helpKeyOverride;
		if (this.grid && !toReturn) {
			toReturn = this.grid.helpKeyText;
		}
		if (!toReturn) {
			toReturn = this.controller;
			if (this.uniqueId) {
				toReturn = this.uniqueId;
			}
			if (!toReturn) {
				if (this.grid && this.grid.title) {
					toReturn = this.grid.title.replace(/ /g, '');	// Added for replace for all spaces.
				}
				if (!toReturn && this.listTitle) {
					toReturn = this.listTitle;
				}
			}
		}
		return toReturn;
	},

	/**
	* Whether user has specific permission for form's module.
	* For example, hasPermission(DA.Permissions.Add) will return whether user has Add permission
	* @param {DA.Permissions}
	* Permission to check
	* @type {Boolean}
	*/
	hasPermission: function (permission) {
		//Works as OR condition (e.g. [Module1, Module2]

		var hasPermission = true;
		if (this.securityModule) {
			var modules = this.securityModule;
			if (!Ext.isArray(this.securityModule)) {
				modules = this.securityModule.split(',');
			}
			for (var i = 0; i < modules.length; i++) {
				hasPermission = DA.Security.HasPermission(modules[i], permission);
				if (hasPermission) {
					break;
				}
			}
		}
		return hasPermission;
	},

	/**
	* Whether user has add permission
	* @type {Boolean}
	*/
	canAdd: function () {
		return this.hasPermission(DA.Permissions.Add);
	},



	/**
	* Whether user has edit permission
	* @type {Boolean}
	*/
	canEdit: function () {
		return this.hasPermission(DA.Permissions.Edit);
	},

	/**
	* Whether user has delete permission
	* @type {Boolean}
	*/
	canDelete: function () {
		return this.hasPermission(DA.Permissions.Delete);
	},

	/**
	* Whether user has export permission
	* @type {Boolean}
	*/
	canExport: function () {
		return this.allowExport && this.hasPermission(DA.Permissions.Export);
	},

	/**
	* Converts CherryOnExt filter object to a simpler object used on server side
	* @param {Object} filter
	* @type {Object}
	*/
	resolveFilter: function (filter) {
		var value = {};
		if (filter !== null) {
			if (typeof (filter.operatorId) != 'undefined') {
				value.fieldName = filter.fieldId;
				value.operatorId = filter.operatorId;
				value.convert = filter.convert ? filter.convert : false;
				value.values = [];
				for (var i = 0; i < filter.values.length; i++) {
					value.values.push(filter.values[i].value);
				}
			} else {
				if (filter.left) {
					value.left = this.resolveFilter(filter.left);
				}
				value.logicalOperator = filter.logicalOperator;
				if (filter.right) {
					value.right = this.resolveFilter(filter.right);
				}
			}

			//if (value.values && value.values.length > 0) {
			//	value.values.push(new Date());
			//}

			return value;
		}
	},

	/**
	* Converts CherryOnExt filter object to a header value
	* @param {Object} filter
	* @type {Object}
	*/
	resolveFilterDescription: function (grid) {
		grid = grid || this.grid;
		var description = "";
		if (grid.prefManager && grid.prefManager.lastFilter) {
			description = this.resolveCherryFilterDescription(grid.prefManager.lastFilter);
		}

		if (grid.gridFilter) {
			var filterData = [];
			var cm = grid.getColumnModel();
			var operators = {
				"eq": "Is",
				"lt": "Is Less Than",
				"gt": "Is Greater Than"
			};
			grid.gridFilter.filters.each(function (f) {
				if (f.active) {
					var field = f.proxyCol || f.dataIndex;
					var d = [].concat(f.serialize());
					for (var i = 0, len = d.length; i < len; i++) {
						var data = d[i];
						var value = data.value;
						var comparison = data.comparison || "eq";
						comparison = operators[comparison] || comparison;
						var values = [];

						if (f.type == 'list') {
							var store = f.store;
							var valueField = f.valueField;
							var displayField = f.labelField;
							for (var j = 0, jlen = value.length; j < jlen; j++) {
								var v = value[j];
								var index = store.findBy(function (r) {
									return r.get(valueField) == v;
								});
								if (index > -1) {
									v = store.getAt(index).get(displayField);
								}
								values.push(v);
							}
						} else {
							values = [].concat(value);
						}
						var objHeader = cm.getColumnsBy(function (col) { return col.dataIndex == field; });
						var header = '';
						if (objHeader && objHeader.length > 0) {
							header = objHeader[0].header;
						}
						filterData.push(header + " " + comparison + " " + values.join(" OR "));
					}
				}
			});
			description += ((description.length > 0 && filterData.length > 0) ? " AND " : "") + filterData.join(" AND ");
		}
		return description;
	},

	isCherryFilterValid: function (fields, filter) {
		if (typeof filter !== 'object' || filter === null) {
			return true;
		}
		if (typeof (filter.operatorId) !== 'undefined') {
			var fieldName = filter.fieldId;
			if (fields.containsKey(fieldName) < 0) {
				return false;
			}
		} else {
			if (!this.isCherryFilterValid(fields, filter.left)) {
				return false;
			}
			if (!this.isCherryFilterValid(fields, filter.right)) {
				return false;
			}
		}
		return true;
	},

	cherryOperatorMap: {
		"=": "Is",
		"<": "Is Less Than",
		">": "Is Greater Than",
		"!=": "Is Not"
	},

	// private
	resolveCherryFilterDescription: function (filter) {
		var value = "";
		var operatorMap = this.cherryOperatorMap;
		if (filter !== null) {
			var operator = filter.operator;
			if (typeof (operator) != 'undefined') {
				var field = filter.field;
				var values = filter.values;
				var comparison = operatorMap[operator.label] || operator.label;

				value += field.label + " " + comparison + " ";
				for (var i = 0; i < filter.values.length; i++) {
					value += (i === 0 ? "" : ", ") + values[i].label;
				}
			} else {
				if (filter.left) {
					value += this.resolveCherryFilterDescription(filter.left);
				}
				value += " " + filter.logicalOperator + " ";
				if (filter.right) {
					value += this.resolveCherryFilterDescription(filter.right);
				}
			}
			return value;
		}
	},

	gridComboLoader: function (store, options) {
		var comboTypes = this.getComboTypesForLoad();
		Ext.applyIf(options, {
			callback: function (r, options, success) {
				var reader = store.reader;
				var jsonData = reader.jsonData;
				this.loadComboData(jsonData);
				// Since grid is rendered - combo renderer won't show properly
				if (this.grid && this.grid.rendered) {
					this.grid.getView().refresh();
				}
			},
			params: {},
			scope: this
		});
		Ext.apply(options.params, {
			comboTypes: Ext.encode(comboTypes)
		});
	},
	exportGrid: function (button) {
	    var format = button.tag || DA.App.defaultExportOption || 'XLSX';
		var formatted = false;
		// formatted
		if (format.substr(0, 1) === ':') {
			formatted = true;
			format = format.substr(1);
		}
		if (format === 'XLSX' && this.grid.getStore().getTotalCount() > 1000000) {
			Ext.Msg.alert('Error', 'Cannot export more than 60k records, reduce your results using filters');
			return;
		}
		var filterDescription;
		if (this.exportFilterCriteria || format !== 'CSV') {
			filterDescription = this.resolveFilterDescription(this.grid);
		}
		var options = { visibleColumns: true, isEmptySpace: this.isEmptySpace, exportFileName: this.listTitle, exportFormat: format, filterDescription: filterDescription };

		options.selectedFields = Ext.ux.GetRequiredColumns(this.grid.colModel.config, this.grid.store.fields.items);
		options.selectedConcatenatedFields = Ext.ux.GetConcatenatedFields(this.grid.colModel.config);

		if (this.grid.title && this.exportTitle !== false) {
			options.Title = this.grid.title.replace(/(<([^>]+)>)/ig, "");
		}
		if (button.exportType === 'CurrentPageOnly') {
			options.exportType = 'CurrentPageOnly'
		}

		if (formatted) {
			DA.ExportTemplate.prompt({ grid: this.grid, cfg: options });
		} else {
			ExtHelper.ExportGrid(this.grid, options);
		}
	},

	addExportOptions: function (tbar) {
		tbar.splice(0, 0, {
			xtype: 'splitbutton', text: 'Export', menu: {
				items:
					[
						{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLSX' },
						{ text: 'CSV', iconCls: 'exportCSV', tag: 'CSV' },
						{ text: 'Current Page Excel', iconCls: 'exportExcel', tag: 'XlSX', exportType: 'CurrentPageOnly' },
						{ text: 'Current Page CSV', iconCls: 'exportCSV', tag: 'CSV', exportType: 'CurrentPageOnly'}
						//{ text: 'PDF', iconCls: 'exportPDF', tag: 'PDF' },
						//{ text: 'PDF - Formatted', iconCls: 'exportPDF', tag: ':PDF' }
					],
				listeners: { itemclick: this.exportGrid, scope: this }
			},
			handler: this.exportGrid, scope: this, iconCls: 'exportExcel'
		});
	},

	filterTable: function (options) {
		var grid = this.grid,
			store = grid.getStore(),
			filterModel = grid.prefManager.filterModel,
			filterInfo = filterModel.getFilterObj();

		if (!options) {
			options = { saveState: true };
		}

		if (filterInfo) {
			filterInfo = this.module.resolveFilter(filterInfo);
			filterInfo = Ext.util.JSON.encode(filterInfo);
		}
		store.baseParams.filter = filterInfo;
		if (options.load !== false) {
			if (store.proxy) {
				// tree grid?
				if (store.active_node && typeof store.setActiveNode === 'function') {
					store.setActiveNode(null);
					if (store.lastOptions) {
						store.lastOptions.add = false;
						if (store.lastOptions.params) {
							store.lastOptions.params[store.paramNames.active_node] = null;
						}
					}
				}
				grid.loadFirst();
			}
		}
		if (options.saveState === true) {
			grid.saveState();
		}
	},

	provaGetFunc: function () {
		var grid = this.grid, module = this.module, state = grid.getState(), params, store;
		grid.fireEvent('beforestatesave', grid, state);

		if (module && module.adhocReporting && module.controller) {
			params = {
				cols: Ext.ux.util.Export.getGridColInfo({ grid: grid })
			};
			store = grid.getStore();
			Ext.apply(params, store.baseParams);
			if (store.lastOptions) {
				Ext.apply(params, store.lastOptions.params);
			}
			state.exportInfo = { controller: module.controller, title: grid.initialConfig.title.replace(/(<([^>]+)>)/ig, ""), params: params };
		}
		return state;
	},

	provaSetFunc: function (prefInfo) {
		var grid = this.grid, module, state = {}, prefName, columnInfo;
		if (prefInfo) {
			if (prefInfo.prefValue) {
				module = this.module;
				state = Ext.decode(prefInfo.prefValue);
				if (prefInfo.ColumnInfo) {
					columnInfo = Ext.decode(prefInfo.ColumnInfo);
					if (columnInfo && this.module.gridConfig.custom && this.module.gridConfig.custom.customFields) {
						this.module.applyCustomFieldValues(this.module.gridConfig.custom.customFields, state, columnInfo);
					}
				}
				prefName = prefInfo.prefName;
			} else {
				grid.loadFirst();
				return;
			}
		}

		grid.fireEvent('beforestaterestore', grid, state, columnInfo);
		Ext.state.Manager.getProvider().state[grid.stateId] = state;
		grid.applyState(state);
		if (grid.rendered) {
			var colConfig = grid.getColumnModel().config;
			grid.getView().onColumnSplitterMoved(0, colConfig[0].width);
			grid.getView().refresh(true);
		}
		if (this && typeof this.filterTable == 'function') {
			this.filterTable.call(this);
		} else {
			this.module.filterTable.call(this);
		}
		var updateTitle = function () {
			grid.setTitle(grid.initialConfig.title + (prefName ? " <i>(" + prefName + ")</i>" : ""));
		}
		updateTitle.defer(200);
	},

	applyCustomFieldValues: function (customFields, state, columnInfo, grid) {
		if (this.grid) {
			grid = this.grid;
		}
		if (columnInfo && customFields) {
			for (var i = 0; i < customFields.length; i++) {
				if (!customFields[i].xtype && customFields[i].getXType() == 'combo') {
					ExtHelper.SetComboValue(customFields[i], columnInfo[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex]);
				}
				else {
					var field = customFields[i];
					if (customFields[i].xtype == 'lovcombo') {
						grid.loadFirst(); // IF combo is lovcombo load grid first to load combo type 
						grid.getStore().on('beforeLoad', this.gridComboLoader, this);
						grid.getStore().on('load', this.removeGridComboLoader, this);
						if (customFields[i].listeners) {
							field = customFields[i].listeners.scope;
						}
					}
					if (field && typeof field.setValue == 'function') {
						field.setValue(columnInfo[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex]);
					}
				}
				grid.baseParams[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex] = columnInfo[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex];
			}
			grid.loadFirst();
		}
	},
	removeGridComboLoader: function () {
		this.grid.getStore().un('beforeLoad', this.gridComboLoader, this);
	},
	removeFilter: function () {
		if (this && this.module && typeof this.module.beforeRemoveFilter == 'function') {
			this.module.beforeRemoveFilter.call(this);
		}
		if (this && typeof this.provaSetFunc == 'function') {
			this.provaSetFunc.call(this);
		} else {
			this.module.provaSetFunc.call(this);
		}
	},

	resetColumns: function () {
		var grid = this.grid, state = grid.initialState || {};
		grid.fireEvent('beforestaterestore', grid, state);
		grid.applyState(state);
		if (grid.rendered) {
			grid.getView().refresh(true);
		}
		grid.saveState();
	},

	removeColumnFilter: function (grid) {
		var grid = this.grid;
		var col = grid.getView().hdCtxIndex;
		this.filtercolumn(grid, col);
	},
	filtercolumn: function (grid, col) {
		var filterInfo = this.filterModel.getFilterObj(); // get grid quick/cherry filters
		var fieldId = this.cm.getDataIndex(col);  //this.filterModel.getFieldManager().getFieldById(col); // getting fields as per column
		if (filterInfo && (filterInfo.length > 0 || typeof (filterInfo.length) == 'undefined')) {
			if (typeof (filterInfo.left) == 'undefined') { // for 1st quick filter without left/ right filters
				filterInfo.firstValue = 1;
			}
			filterInfo = this.mouseOverResolveFilter(filterInfo); // use to seperate left/ right filter
			for (var i = 0; i < filterInfo.length; i++) {
				var filterdetail = this.filterModel.getElementaryFiltersByFieldId(filterInfo[i].field);
				for (var j = 0; j < filterdetail.length; j++) {
					if (filterdetail[j].field.id == fieldId) { //matching fields for selected column
						grid.prefManager.filterModel.removeElementaryFilterById(filterdetail[j].id);
						this.quickFilter.fireEvent('filterChanged');
					}
				}
			}
		}
	},
	createFilterWindow: function (o) {
		var filterWin;
		filterWin = new Ext.Window({
			title: 'Filters',
			width: 600,
			height: 350,
			layout: 'border',
			closeAction: 'hide',
			items: [
				{
					filterModel: o.model,
					region: "center",
					xtype: 'dynamicFilter',
					buttons: [
						new Ext.Button({ text: "Remove Filters", handler: this.removeFilter, scope: o.scope }),
						new Ext.Button({ text: "Cancel", handler: function () { filterWin.hide(); } }),
						new Ext.Button({ text: "Apply", handler: this.filterTable, scope: o.scope })
					]
				}
			]
		});
		return filterWin;
	},

	autoBlankRow: false,

	quickFilter: false,

	/**
	* Creates the grid for current module
	* @param {Object} config  Extra options for grid. They will always be overriden by DA.Form's gridConfig.
	* @param {Boolean} copy  A new copy should be created? Defaults to false.
	* @param {Object} copyOptions  Some of the options are:
	* <ul class="mdetail-params">
	*  <li><b>copyCm</b> : Boolean<div class="sub-desc">Create a new copy of columnModel too. Useful for editable grids.</div></li>
	*  <li><b>scope</b> : Object<div class="sub-desc">Custom scope for this copied grid</div></li>
	* </ul>
	* @type {Ext.grid.GridPanel}
	*/
	filterTpl: function () {
		return new Ext.XTemplate(
		'<table class="filterTooltip">',
        '<tbody>',
	    '<tr>',
		'<td><b>Type</b></td>',
		'<td><b>Field</b></td>',
		'<td><b>Operator</b></td>',
		'<td><b>Value</b></td></tr>',
		'<tpl for=".">',
		'<td>{values.type}</td>',
		'<td>{values.field}</td>',
		'<td>{values.data.comparison}</td>',
		'<td>{values.data.value}</td></tr>',
		'</tpl>',
		'</tbody></table>'
		)
	},
	filtersMouseOver: function (button, e, grid) {
		if (!this.grid) {
			this.grid = grid;
		}
		var filterTpl = this.filterTpl(); // get template format
		var headerfilter = this.grid.filters.getFilterData(); // get grid header filters
		var filterInfo = this.filterModel ? this.filterModel.getFilterObj() : null; // get grid quick/cherry filters
		filterInfoNew = [];
		var newFilterInfo = []; // created array for combining grid header & quick/cherry filters
		if (filterInfo && (filterInfo.length > 0 || typeof (filterInfo.length) == 'undefined')) {
			filterInfo.firstValue = 1; // added for array creation first time
			filterInfo = this.mouseOverResolveFilter(filterInfo);
			for (var i = 0; i < filterInfo.length; i++) {
				filterInfo[i].type = 'Q';
				var operator = filterInfo[i].data.comparison;
				if (operator == 'STRING_EQUAL' || operator == 'DATE_EQUAL' || operator == 'NUMBER_EQUAL') {
					operator = '=';
				}
				if (operator == 'DATE_GREATER' || operator == 'NUMBER_GREATER') {
					operator = '>';
				}
				if (operator == 'NUMBER_LESS' || operator == 'DATE_LESS') {
					operator = '<';
				}
				if (operator == 'DATE_GREATER_OR_EQUAL' || operator == 'NUMBER_GREATER_OR_EQUAL') {
					operator = '>=';
				}
				if (operator == 'NUMBER_LESS_OR_EQUAL' || operator == 'DATE_LESS_OR_EQUAL') {
					operator = '<=';
				}
				if (operator == 'NUMBER_NOT_EQUAL' || operator == 'STRING_DIFFERENT') {
					operator = '!=';
				}

				filterInfo[i].data.comparison = operator;
				newFilterInfo.push(filterInfo[i]);
			}
		}
		if (headerfilter && headerfilter.length > 0) {
			for (var i = 0; i < headerfilter.length; i++) {
				headerfilter[i].type = 'H';
				newFilterInfo.push(headerfilter[i]);
				if (headerfilter[i].data.type == "boolean") {
					if (headerfilter[i].data.value == true) {
						headerfilter[i].data.value = "Yes";
					}
					else {
						headerfilter[i].data.value = "No";
					}
				}
				var columnIndex = this.grid.colModel.findColumnIndex(headerfilter[i].field);
				if (columnIndex > -1 && this.cm.config[columnIndex].displayIndex) {
					var column = this.cm.getColumnById(this.cm.getColumnId(columnIndex));
					if (column.store) {
						var values = headerfilter[i].data.value;
						var valuesLength = values.length;
						headerfilter[i].data.value = '';
						for (var j = 0; j < valuesLength; j++) {
							var recordIndex = column.store.find('LookupId', values[j]);
							if (recordIndex > -1) {
								var record = column.store.getAt(recordIndex);
								headerfilter[i].data.value += ', ' + record.get('DisplayValue');
							}
						}
						if (headerfilter[i].data.value.length > 0) {
							headerfilter[i].data.value = headerfilter[i].data.value.substring(2);
						}
					}
				}

				if (headerfilter[i].data.comparison == "eq" || typeof (headerfilter[i].data.comparison) == 'undefined') {
					headerfilter[i].data.comparison = "=";
				}
				if (headerfilter[i].data.comparison == "lt") {
					headerfilter[i].data.comparison = "<";
				}
				if (headerfilter[i].data.comparison == "gt") {
					headerfilter[i].data.comparison = ">";
				}
			}
		}
		var index;
		for (var i = 0; i < newFilterInfo.length; i++) { // Setting Header Name
			index = this.grid.getColumnModel().findColumnIndex(newFilterInfo[i].field);
			if (index > -1) { // since header filters are returned as object.
				newFilterInfo[i].field = this.grid.getColumnModel().getColumnHeader(index);
			}
		}
		var html = filterTpl.applyTemplate(newFilterInfo); // inserted data into template
		if (newFilterInfo.length > 0) {
			button.setTooltip(html);
		}
		else {
			button.setTooltip('');
		}

	},
	mouseOverResolveFilter: function (filter) { // created new ResolveFilter on Mouse Over event - copied from ResolveFilter
		if (filter.firstValue == 1) {
			var value = [];
		}
		else {
			value = filter.value;
		}
		if (filter !== null) {
			if (typeof filter.operatorId !== 'undefined') {
				var i, len;
				var values = [];
				values.data = []
				var updateValue = filter.values[0].value;
				var label = filter.values[0].label;
				if (this.cm.config[this.grid.colModel.findColumnIndex(filter.fieldId)].displayIndex) {
					updateValue = label;
				}
				if ((updateValue == true || updateValue == false) && (label == 'Yes' || label == 'No')) {
					updateValue = label;
				}
				values.field = filter.fieldId;
				values.data.comparison = filter.operatorId;
				values.data.value = updateValue;

				for (i = 0, len = 1; i < len; i++) {
					value.push(values);
				}
			} else {
				if (filter.left) {
					filter.left.firstValue = 1;
					value = (this.mouseOverResolveFilter(filter.left));
				}
				if (filter.right) {
					filter.right.value = value;
					value = this.mouseOverResolveFilter(filter.right);
				}
			}
			return value;
		}
	},
	createGrid: function (config, copy, copyOptions, overrideConfig) {
		var grid = {}, prefManagView, filterWin, preferenceText, quickFilter;
		var filteringScope = { module: this }, sortFilterAbility = true, modifyGridColumnsAbility = true;
		if (typeof DA.App.sortFilterAbility == 'function') {
			sortFilterAbility = DA.App.sortFilterAbility();
		}
		if (typeof DA.App.modifyGridColumnsAbility == 'function') {
			modifyGridColumnsAbility = DA.App.modifyGridColumnsAbility();
		}
		if (copy || !this.grid) {
			preferenceText = this.preferenceText || { plural: 'Preferences' };
			if (!config) {
				config = {};
			}

			var treeGrid = config.treeGrid || (this.gridConfig && this.gridConfig.treeGrid);

			var treeDescriptionColumn = treeGrid ? (config.treeDescriptionColumn || 'Description') : null;

			if (this.hybridConfig) {
				var hybridConfig;
				if (typeof this.hybridConfig == 'function') {
					hybridConfig = this.hybridConfig();
				} else {
					hybridConfig = this.hybridConfig;
				}
				delete this.hybridConfig;
				var info = Ext.ux.util.SplitGridInfo(hybridConfig);
				if (treeGrid) {
					info.fields = Ext.ux.AddTreeGridFields(info.fields);
				}
				this.listRecord = Ext.data.Record.create(info.fields);
				this.cm = new Ext.ux.grid.ColumnModel(info.cm);
			}

			if (typeof (this.cm) == 'function') {
				this.cm = this.cm.call(this);
			}

			var cm;
			if (copyOptions && copyOptions.copyCm) {
				var colConfig = this.cm.config;
				var newConfig = [];
				var len = colConfig.length;
				for (var i = 0; i < len; i++) {
					newConfig[i] = Ext.apply({}, colConfig[i]);
				}
				cm = new Ext.ux.grid.ColumnModel(newConfig);
			} else {
				if (copyOptions && copyOptions.cm) {
					cm = copyOptions.cm;
				} else {
					cm = this.cm;
				}
			}
			if (cm) {
				for (var i = 0; i < cm.config.length; i++) {
					var col = this.cm.config[i];
					if (col.hyperlinkAsDoubleClick === true) {
						cm.setRenderer(i, ExtHelper.renderer.DefaultHyperLink(cm));
					}
				}
			}
			if (this.gridConfig && this.gridConfig.custom && this.gridConfig.custom.allowBulkSelections === true) {
				if (!config.prefixCols) {
					config.prefixCols = [];
				}
				if (!this.gridConfig.selModel && !config.sm) {
					config.prefixCols = [new Ext.grid.CheckboxSelectionModel({ dataIndex: 'isSelected' })].concat(config.prefixCols);
				}

				if (!config.selModel && !config.sm && !this.gridConfig.selModel) {
					config.selModel = new Ext.grid.CheckboxSelectionModel();
				}
			}

			if (typeof config.prefixCols !== 'undefined') {
				var cols = config.prefixCols.concat(cm.config);
				cm = new Ext.ux.grid.ColumnModel(cols);
				delete config.prefixCols;
			}

			var gridConfig = Ext.applyIf(config, {
				cm: cm,
				recordType: this.listRecord,
				controller: this.gridIsLocal ? undefined : this.controller,
				baseParams: Ext.apply({ action: 'list', asArray: 1 }, this.baseParams),
				defaultPlugins: true,
				border: false,
				stripeRows: true,
				title: this.listTitle,
				loadMask: DA.Defaults.Grid.loadMask ? { msg: DA.Defaults.Grid.loadMsg } : false
			});
			var cm = gridConfig.cm;
			if (!sortFilterAbility) {
				for (var i = 0, len = cm.config.length; i < len; i++) {
					cm.config[i].sortable = false;
				}
			}
			if (!gridConfig.plugins) {
				gridConfig.plugins = [];
			}

			gridConfig.baseParams = Ext.applyIf({ action: 'list', asArray: 1 }, gridConfig.baseParams);
			if (this.tagColumn) {
				gridConfig.plugins.push(new Ext.ux.grid.Tags({ dataIndex: this.tagColumn, keyColumn: this.keyColumn }));
				gridConfig.baseParams.FetchTags = 1;
			}

			if (this.gridConfig) {
				if (gridConfig.plugins && this.gridConfig.plugins) {
					for (var i = 0; i < this.gridConfig.plugins.length; i++) {
						// Added Code For When grid is editable then error comes ComboLoader not supported
						if (this.securityModule && !DA.Security.HasPermission(this.securityModule, 'Edit')) {
							var isComboLoader = this.gridConfig.plugins[i] instanceof Ext.ux.ComboLoader; //#3377
							if (!isComboLoader) {
								gridConfig.plugins.push(this.gridConfig.plugins[i]);
							}
						}
						else {
							gridConfig.plugins.push(this.gridConfig.plugins[i]);
						}
					}
					delete this.gridConfig.plugins;
				}
				gridConfig = Ext.apply(config, this.gridConfig);
			}

			if (overrideConfig) {
				gridConfig = Ext.apply(gridConfig, overrideConfig);
			}

			gridConfig.autoRefreshFirstTime = true;
			if (gridConfig.autoRefreshInterval && gridConfig.autoRefreshInterval > 0) {
				var task = {
					run: function () {
						if (grid.isVisible()) {
							var store = grid.getStore();
							if (!gridConfig.autoRefreshFirstTime) {
								store.reload();
							}
							gridConfig.autoRefreshFirstTime = false;
						}
					},
					interval: gridConfig.autoRefreshInterval //1 Second
				};

				Ext.TaskMgr.start(task, this);
				delete gridConfig.autoRefreshInterval;
			}


			var scope;
			var setScopeReferences = false;

			// If this grid is a copy, then scope should be for the copied grid
			if ((copy || copyOptions) && this.gridIsLocal) {
				if (!copyOptions) {
					copyOptions = {};
				}
				Ext.applyIf(copyOptions, {
					scope: {}
				});
				Ext.applyIf(copyOptions.scope, {
					grid: grid,
					gridIsLocal: this.gridIsLocal,
					newGridRecord: this.newGridRecord,
					listRecord: this.listRecord,
					newListRecordData: this.newListRecordData
				});
				scope = copyOptions.scope;
				setScopeReferences = true;
			} else {
				scope = this;
			}
			var tbar;
			if (!gridConfig.tBar) {
				if (!gridConfig.showDefaultButtons) {
					tbar = [];
				} else {
					delete gridConfig.showDefaultButtons;
					tbar = gridConfig.tbar;
				}
				if (!this.disableAdd && this.canAdd()) {
					tbar.push({ text: '<u>A</u>dd', handler: this.addHandler, scope: scope, iconCls: 'add' });
				}
				if (!this.disableDelete && ((gridConfig.custom && gridConfig.custom.allowBulkDelete) || this.gridIsLocal) && this.canEdit()) {
					tbar.push({ text: '<u>D</u>elete', handler: this.deleteHandler, scope: scope, iconCls: 'delete' });
				}
				if (!this.gridIsLocal && this.canExport()) {
					this.addExportOptions(tbar, this);
				}
				gridConfig.tbar = tbar;
			}

			if (this.autoBlankRow && (gridConfig.gridIsLocal || this.gridIsLocal) || gridConfig.addAutoRow) {
				gridConfig.plugins.push(new Ext.ux.plugins.gridAutoRow({ createNewRecord: this.newGridRecord, scope: scope, autoEditOnPhantom: gridConfig.autoEditOnPhantom }));
			}

			var stateId = gridConfig.stateId;
			if (!stateId) {
				stateId = config.controller;
			}
			if (scope.gridIsLocal) {
				stateId = 'Order-' + gridConfig.root; //TODO: Pick from parent module controller
			}

			if (gridConfig.prefId) {
				stateId = stateId + '-' + gridConfig.prefId;
			}

			if (gridConfig.autoFilter && gridConfig.tbar && scope && !scope.gridIsLocal) {
				//config for the FieldManager
				var filterCfg = [];
				var cm = gridConfig.cm;
				var columnCount = cm.getColumnCount();
				var prefManager = {};

				var recordType = config.recordType;

				for (var i = 0; i < columnCount; i++) {
					var colId = cm.getColumnId(i);
					var col = cm.getColumnById(colId);
					var dataIndex = col.dataIndex;
					if (dataIndex && dataIndex !== treeDescriptionColumn) {
						var field = recordType.getField(dataIndex);
						if (field) {
							var filterInfo = { id: cm.getDataIndex(i) + '', label: cm.getColumnHeader(i), type: recordType.getField(dataIndex).type };
							switch (filterInfo.type) {
								case "date":
									filterInfo.format = ExtHelper.DateFormat;
									if (col.convert) {
										filterInfo.convert = col.convert;
									}
									break;
								case "bool":
									Ext.apply(filterInfo, { type: 'enum', availableValues: DA.Form.prototype.yesNoAvailableValues, remoteStore: false });
									break;
								default:
									var editor = cm.getCellEditor(i, 0);
									var store = (editor && editor.field && editor.field.store) ? editor.field.store : col.store;
									if (store) {
										Ext.apply(filterInfo, {
											type: "enum",
											availableValues: store,
											remoteStore: editor && editor.field.mode == 'remote' ? true : false
										});
									}
							}
							filterCfg.push(filterInfo);
						}
					}
				}

				//FilterModel
				var fieldManager = new Ext.ux.netbox.core.FieldManager(filterCfg);
				var filterModel = new Ext.ux.netbox.core.FilterModel(fieldManager);

				if (gridConfig.prefManager) {
					// Preference Manager

					var prefManagerUrl = EH.BuildUrl('GridPreferenceManager');
					prefManager = new Ext.ux.netbox.PreferenceManager({
						id: stateId,
						userName: 'user',
						getFn: this.provaGetFunc,
						setFn: this.provaSetFunc,
						fnScope: filteringScope,
						getAllPrefURL: prefManagerUrl + '?action=list',
						applyDefaultPrefURL: prefManagerUrl + '?action=default',
						loadPrefURL: prefManagerUrl + '?action=load',
						savePrefURL: prefManagerUrl + '?action=save',
						deletePrefURL: prefManagerUrl + '?action=delete'
					});

					prefManagView = new Ext.ux.netbox.PreferenceManagerView({ preferenceManager: prefManager });
				}

				//var filterModel=new Ext.ux.netbox.core.FilterModel(filterCfg);
				//var localFilterResolver=new Ext.ux.netbox.core.LocalStoreFilterResolver(filterModel);

				if (!scope.gridIsLocal) {
					gridConfig.plugins.push(new Ext.ux.netbox.core.FilterHeaderPlugin(filterModel));
				}
				filterWin = this.createFilterWindow({ model: filterModel, scope: filteringScope });

				quickFilter = this.quickFilter;
				if (typeof (gridConfig.autoFilter) == 'object') {
					quickFilter = gridConfig.autoFilter.quickFilter;
				}

				if (quickFilter) {
					quickFilter = new Ext.ux.netbox.core.QuickFilterModelView({
						filterModel: filterModel
					});

					this.quickFilter = quickFilter;
					quickFilter.on('filterChanged', this.filterTable, filteringScope);
					var contextMenuItems = [quickFilter.getFilterMenu(), quickFilter.getRemoveFilterMenu()];
					if (!sortFilterAbility) {
						contextMenuItems = [];
					}
					var contextMenuManager = new Ext.ux.netbox.ContextMenuManager({
						menu: {
							items: contextMenuItems
						}
					});
					gridConfig.plugins.push(contextMenuManager);
				}
				gridConfig.prefManager = { enabled: gridConfig.prefManager, manager: prefManager, filterModel: filterModel, contextMenuManager: contextMenuManager };
			} else {
				delete gridConfig.prefManager;
			}

			this.beforeGridCreate(this, this.gridPlugins, overrideConfig);

			// Initialize all plug-ins
			for (var i = 0; i < this.gridPlugins.length; i++) {
				this.gridPlugins[i].init(this, gridConfig);
			}

			//Custom Tbar items
			var custom = {};
			if (this.gridConfig && this.gridConfig.custom) {
				custom = this.gridConfig.custom;

				var customTBar = custom.tbar;
				if (tbar && customTBar) {
					for (var i = 0; i < customTBar.length; i++) {
						tbar.push(customTBar[i]);
					}
				}

				if (custom.quickSearch && gridConfig.allowPaging !== false) {
					this.quickSearch = new Ext.ux.grid.Search(custom.quickSearch);
					gridConfig.plugins.push(this.quickSearch);
				}
			}
			this.filterModel = filterModel;
			if (gridConfig.prefManager && !scope.gridIsLocal && scope.showPrefManager !== false) {
				tbar = gridConfig.tbar;

				if (!tbar) {
					tbar = [];
				}

				if (tbar.length > 0) {
					tbar.push('-');
				}

				if (sortFilterAbility) {
					tbar.push({
						text: 'Filters...',
						handler: function () {
							filterWin.show();
						},
						listeners: {
							mouseover: function (button, e) {
								this.filtersMouseOver(button, e, grid);
							}, scope: this
						},
						scope: this
					});

					tbar.push({
						text: 'Remove Filter',
						handler: this.removeFilter,
						scope: filteringScope
					});
				}
				if (gridConfig.prefManager.enabled) {
					tbar.push({ text: preferenceText.plural, menu: prefManagView });
				}
			}

			var gridSummaryButton;
			if (gridConfig.groupField && tbar) {
				var showGridSummary = gridConfig.showGridSummary;
				if (showGridSummary !== true && gridConfig.showGridSummary !== false) {
					var cols = gridConfig.cm.config;
					for (var i = 0, len = cols.length; i < len; i++) {
						if (cols[i].summaryType === 'fixed' || cols[i].summaryType === 'average') {
							showGridSummary = true;
							break;
						}
					}
				}
				if (showGridSummary) {
					gridSummaryButton = { text: 'Group Summary', handler: this.onGridGroupSummary };
					tbar.push(gridSummaryButton);
				}
			}

			if (DA.Help) {
				if (!tbar) {
					tbar = [];
				}
				if (custom.helpButton !== false) {
					tbar.push("->");
					tbar.push({ text: '', handler: function () { DA.Help.Show({ helpKey: gridConfig && gridConfig.helpKey ? gridConfig.helpKey : this.helpKey(), extraKey: 'grid', title: gridConfig.title }); }, scope: this, iconCls: 'help', tooltip: 'Help' });
				}
			}

			if (this.enablePrint) {
				gridConfig.plugins.push(new Ext.ux.plugins.Print());
			}

			if (DA.App.quickSaveGridCm === true && gridConfig.stateful !== false) {
				gridConfig.stateful = true;
			}
			Ext.applyIf(gridConfig, { stateId: "grid-" + stateId });

			gridConfig.plugins = [new DA.plugins.GridState({ module: this })].concat(gridConfig.plugins);
			gridConfig.daScope = scope;
			grid = ExtHelper.CreateGrid(gridConfig);

			if (custom.loadComboTypes) {
				grid.getStore().on('beforeLoad', this.gridComboLoader, this, { single: true });
			}
			if (setScopeReferences) {
				scope.grid = grid;
			}
			if (gridSummaryButton) {
				gridSummaryButton.scope = grid;
			}
			filteringScope.grid = grid;

			// Apply any customizations required for plugins after grid creation
			for (var i = 0; i < this.gridPlugins.length; i++) {
				this.gridPlugins[i].apply(grid);
			}

			if (!this.gridIsLocal && !gridConfig.disableDblClickHandler && typeof (this.createForm) == 'function') {
				grid.on('rowdblclick', this.rowDblClickHandler, this);
				grid.on("cellclick", this.cellclick, this);
			}
			if (!copy) {
				this.grid = grid;
			}

			if (this.gridContextMenu) {
				if (!grid.contextMenu) {
					var contextMenuOptions = {};
					if (typeof this.gridContextMenu == 'object') {
						contextMenuOptions = Ext.apply(contextMenuOptions, this.gridContextMenu);
					}
					contextMenuOptions.scope = scope;
					grid.contextMenu = new DA.Grid.ContextMenu(contextMenuOptions);
				}
			}
		} else {
			grid = this.grid;
		}
		var resetMenuItemConfig = { text: 'Reset Columns', handler: this.resetColumns, scope: filteringScope };
		var removeMenuItemConfig = { text: 'Remove Column Quick filter', handler: this.removeColumnFilter, scope: this, grid: grid };

		grid.on('render', function (grid) {
			var hmenu = grid.getView().hmenu;
			hmenu.addSeparator();
			hmenu.add(new Ext.menu.Item(resetMenuItemConfig));
			if (this.filterModel) {
				hmenu.add(new Ext.menu.Item(removeMenuItemConfig));
			}
			if (!modifyGridColumnsAbility || !sortFilterAbility) {
				var hmenuitems = hmenu.items.items;
				var removeOption = []
				for (var i = 0, len = hmenu.items.items.length; i < len; i++) {
					if (hmenuitems[i] && (hmenuitems[i].text == 'Filters' || hmenuitems[i].text == 'Sort Ascending' || hmenuitems[i].text == 'Sort Descending') && !sortFilterAbility) {
						hmenuitems.remove(hmenu.items.items[i]);
						i--
					}
					if (hmenuitems[i] && (hmenuitems[i].text == 'Columns' || hmenuitems[i].text == 'Reset Columns') && !modifyGridColumnsAbility) {
						hmenuitems.remove(hmenu.items.items[i]);
						i--
					}
				}
			}
			var toolbar = grid.getTopToolbar();
			if (toolbar && toolbar.el) {
                if (grid.multiLineToolbar) {
                    toolbar.el.dom.firstChild.classList.add('multiLine-toolbar')
                } else {
                    toolbar.el.setStyle("overflow-x", "auto"); //Fix for toolbar to scroll - TODO: Fix with proper corousal technique
                }
			}
		}, this, { single: true });


		this.onGridCreated.call(this, grid);
		if (!modifyGridColumnsAbility) {
			grid.enableColumnMove = false;
		}
		return grid;
	},
	beforeGridCreate: function (gridConfig, gridPlugins, overrideConfig) {
	},
	onGridGroupSummary: function () {
		var parentGrid = this;
		var parentStore = parentGrid.getStore();
		var groupField = parentStore.groupField;
		var multiGrouping = parentGrid.multiGrouping;
		var groupSummaryPaging = parentGrid.groupSummaryPaging;
		if (!groupField) {
			Ext.Msg.alert('No grouping', 'No groups enabled currently');
			return;
		}

		var params = Ext.apply({}, parentStore.lastOptions.params);
		params.action = 'listGroups';
		params.groupSummaryPaging = groupSummaryPaging;
		if (!params.limit) {
			params.parentPageSize = 20;
		}
		else {
			params.parentPageSize = params.limit;
		}

		delete params.sort;
		delete params.dir;
		delete params.start;
		delete params.limit;
		delete params.multiGroupBy;
		delete params.multiSortInfo;

		var cm = [];
		var oldCm = parentGrid.getColumnModel().config;
		var fields = [];
		var allowedSortField = groupField;
		var autoExpandColumnId;
		var len = oldCm.length;
		var paramMultiGroup = [];
		if (multiGrouping) {
			var multiArr = groupField;
			for (var j = 0; j < multiArr.length; j++) {
				groupField = multiArr[j];
				for (var i = 0; i < len; i++) {
					var col = oldCm[i];
					if (col.dataIndex === groupField) {
						if (col.dataIndex === groupField) {
							autoExpandColumnId = col.id;
						}
						var colInfo = Ext.apply({}, col);
						if (colInfo.displayIndex) {
							fields.push({ name: col.dataIndex, type: parentStore.fields.get(col.dataIndex).type });
							colInfo.dataIndex = colInfo.displayIndex;
							allowedSortField = colInfo.dataIndex;
							params.proxyCol = colInfo.displayIndex;
						}
						colInfo.width = 120;
						paramMultiGroup.push(colInfo.dataIndex);
						cm.push(Ext.apply(colInfo, { hidden: false }));
						fields.push({ name: colInfo.dataIndex, type: parentStore.fields.get(colInfo.dataIndex).type });
					}
				}
			}
			for (var i = 0; i < len; i++) {
				var col = oldCm[i];
				if (col.summaryType === 'fixed' || col.summaryType === 'average') {
					var colInfo = Ext.apply({}, col);
					if (colInfo.displayIndex) {
						fields.push({ name: col.dataIndex, type: parentStore.fields.get(col.dataIndex).type });
						colInfo.dataIndex = colInfo.displayIndex;
						allowedSortField = colInfo.dataIndex;
						params.proxyCol = colInfo.displayIndex;
					}
					cm.push(Ext.apply(colInfo, { hidden: false }));
					fields.push({ name: colInfo.dataIndex, type: parentStore.fields.get(colInfo.dataIndex).type });
				}
			}
		}
		else {
			for (var i = 0; i < len; i++) {
				var col = oldCm[i];
				if (col.dataIndex === groupField || col.summaryType === 'fixed' || col.summaryType === 'average') {
					if (col.dataIndex === groupField) {
						autoExpandColumnId = col.id;
					}
					var colInfo = Ext.apply({}, col);
					if (colInfo.displayIndex) {
						fields.push({ name: col.dataIndex, type: parentStore.fields.get(col.dataIndex).type });
						colInfo.dataIndex = colInfo.displayIndex;
						allowedSortField = colInfo.dataIndex;
						params.proxyCol = colInfo.displayIndex;
					}
					cm.push(Ext.apply(colInfo, { hidden: false }));
					fields.push({ name: colInfo.dataIndex, type: parentStore.fields.get(colInfo.dataIndex).type });
				}
			}
		}
		if (paramMultiGroup.length > 0) {
			params.multiGroupBy = paramMultiGroup;
			delete params.proxyCol;
		}
		//Correct duplicate column id, if columns are pushed on condition basis.
		cm.push({ id: len + 1001, header: 'Items', dataIndex: 'TotalCount__', width: 60, align: 'right', menuDisabled: true });
		fields.push({ name: 'TotalCount__', type: 'int' });

		cm.push({ id: len + 1002, header: 'Page#', dataIndex: 'Page__', width: 60, align: 'right', menuDisabled: true });
		fields.push({ name: 'Page__', type: 'int' });

		var store = new Ext.data.JsonStore({
			url: parentStore.url,
			//proxy: new Ext.data.HttpProxy({ url: url, timeout: 100000 }), //100 seconds
			fields: fields,
			totalProperty: 'recordCount',
			root: 'records',
			baseParams: params
		});
		if (!multiGrouping) {
			store.setDefaultSort(allowedSortField, parentStore.sortInfo.field === allowedSortField ? parentStore.sortInfo.direction : 'ASC');
		}
		var win;
		var summaryGrid;

		/* Copied from basic Grid */
		var exportGrid = function (button) {
			var format = button.tag || 'CSV';
			var formatted = false;
			// formatted
			if (format.substr(0, 1) === ':') {
				formatted = true;
				format = format.substr(1);
			}
			var filterDescription;
			var options = { visibleColumns: true, isEmptySpace: true, exportFileName: parentGrid.viewConfig.listTitle + ' Summary', exportFormat: format, filterDescription: filterDescription, group: true, parentGrid: parentGrid };
			if (parentGrid.viewConfig.listTitle) {
				options.Title = parentGrid.viewConfig.listTitle.replace(/(<([^>]+)>)/ig, "") + ' Summary';
			}
			if (formatted) {
				DA.ExportTemplate.prompt({ grid: summaryGrid, cfg: options });
			} else {
				ExtHelper.ExportGrid(summaryGrid, options);
			}
		}

		// Copied from the Main grid code need to do common TO DO.
		var provaGetFunc = function () {
			var grid = summaryGrid, module = this.module, state = grid.getState(), params, store;
			grid.fireEvent('beforestatesave', grid, state);
			module.controller = parentGrid.controller;
			if (module && module.controller) {
				params = {
					cols: Ext.ux.util.Export.getGridColInfo({ grid: grid }),
					groupBy: parentGrid.groupField
				};
				store = grid.getStore();
				Ext.apply(params, store.baseParams);
				if (store.lastOptions) {
					Ext.apply(params, store.lastOptions.params);
				}
				state.exportInfo = { controller: this.module.controller, title: this.module.controller + 'SummaryGrid', params: params };
			}
			return state;
		};

		var provaSetFunc = function (prefInfo) {
			var grid = summaryGrid, module, state = {}, prefName, columnInfo;
			if (prefInfo) {
				if (prefInfo.prefValue) {
					module = this.module;
					state = Ext.decode(prefInfo.prefValue);
					if (prefInfo.ColumnInfo) {
						columnInfo = Ext.decode(prefInfo.ColumnInfo);
						if (columnInfo && state && state.customFields) {
							//this.module.applyCustomFieldValues(this.module.custom.customFields, state, columnInfo);
							var customFields = state.customFields;
							grid = summaryGrid;
							if (columnInfo && customFields) {
								for (var i = 0; i < customFields.length; i++) {
									if (!customFields[i].xtype && customFields[i].getXType() == 'combo') {
										ExtHelper.SetComboValue(customFields[i], columnInfo[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex]);
									}
									else {
										var field = customFields[i];
										if (customFields[i].xtype == 'lovcombo') {
											grid.loadFirst(); // IF combo is lovcombo load grid first to load combo type 
											grid.getStore().on('beforeLoad', this.gridComboLoader, this);
											grid.getStore().on('load', this.removeGridComboLoader, this);
											if (customFields[i].listeners) {
												field = customFields[i].listeners.scope;
											}
										}
										if (field && typeof field.setValue == 'function') {
											field.setValue(columnInfo[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex]);
										}
									}
									this.module.baseParams[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex] = columnInfo[customFields[i].name || customFields[i].hiddenName || customFields[i].dataIndex];
								}
								this.module.loadFirst();
							}
						}
					}
					prefName = prefInfo.prefName;
				} else {
					this.module.loadFirst();
					return;
				}
			}
			grid.fireEvent('beforestaterestore', summaryGrid, state, columnInfo);
			grid.applyState(state);
			grid.fireEvent('statesave', summaryGrid, summaryGrid.getState());
			if (grid.rendered) {
				var colConfig = this.module.getColumnModel().config;
				grid.getView().onColumnSplitterMoved(0, colConfig[0].width);
				grid.store.baseParams.multiGroupBy = Ext.decode(prefInfo.ColumnInfo).multiGroupBy;
				grid.store.load();
				grid.getView().refresh(true);
			}
			grid.setTitle(this.module.initialConfig.title + (prefName ? " <i>(" + prefName + ")</i>" : ""));

		};
		var prefManagerUrl = EH.BuildUrl('GridPreferenceManager');
		var filteringScope = { module: this };

		prefManager = new Ext.ux.netbox.PreferenceManager({
			id: filteringScope.module.controller + '_Summary',
			userName: 'user',
			getFn: provaGetFunc,
			setFn: provaSetFunc,
			fnScope: filteringScope,
			getAllPrefURL: prefManagerUrl + '?action=list',
			applyDefaultPrefURL: prefManagerUrl + '?action=default',
			loadPrefURL: prefManagerUrl + '?action=load',
			savePrefURL: prefManagerUrl + '?action=save',
			deletePrefURL: prefManagerUrl + '?action=delete'
		});

		prefManagView = new Ext.ux.netbox.PreferenceManagerView({ preferenceManager: prefManager });

		var addExportOptions = function (tbar) {
			tbar.splice(0, 0, {
				xtype: 'splitbutton', text: 'Export',
				menu:
					{
						items: [
							{ text: 'Excel', iconCls: 'exportExcel', tag: 'CSV' }
							//{ text: 'PDF', iconCls: 'exportPDF', tag: 'PDF' },
							//{ text: 'PDF - Formatted', iconCls: 'exportPDF', tag: ':PDF' }
						], listeners: { itemclick: exportGrid, scope: this }
					}, handler: exportGrid, scope: this, iconCls: 'exportExcel'
			});
			tbar.push({ text: 'Views', menu: prefManagView });
		}



		var gridConfig = {
			cm: new Ext.grid.ColumnModel(cm),
			plugins: [new Ext.ux.grid.GridSummary()],
			ds: store,
			autoExpandColumn: autoExpandColumnId,
			defaultPlugins: true,
			tbar: [],
			allowPaging: groupSummaryPaging ? groupSummaryPaging : false,
			isSummary: true
		};
		addExportOptions(gridConfig.tbar);
		summaryGrid = ExtHelper.CreateGrid(gridConfig);
		this.summaryGrid = summaryGrid;
		prefManager.fnScope = { module: summaryGrid };
		//this.summaryGrid.getBottomToolbar().hide();
		win = new Ext.Window({
			height: 400,
			width: 800,
			layout: 'fit',
			title: 'Summary',
			items: [summaryGrid],
			border: false
		});
		win.show();
		var gridConfigLength = summaryGrid.colModel.config.length;
		for (var i = 0 ; i < gridConfigLength; i++) {
			if (summaryGrid.colModel.config[i].removeRendererOnGroupSummary) {
				summaryGrid.colModel.config[i].renderer = null;
			}
		}
		summaryGrid.loadFirst();
	},


	/**
	* Called after the grid is created. Can be used by child classes
	* @param {Ext.grid.GridPanel} grid
	* @returns
	*/
	onGridCreated: Ext.emptyFn,

	/**
	* Unique Id for this form. Used for Tab/ Window Ids
	* @param {String} suffix
	* @returns {String}
	*/
	getId: function (suffix) {
		var id = this.uniqueId;
		if (!id) {
			id = this.controller;
		}
		id = id + suffix;
		return id;
	},

	resolveParamFilter: function (filter) {
		var fieldName = this.defaultSearchField;
		var operator = "STRING_EQUAL";
		var value;

		var pos = filter.indexOf("::");
		if (pos > -1) {
			if (pos > 0) {
				fieldName = filter.substring(0, pos);
				value = filter.substring(pos + 2);
			}
		} else if (fieldName) {
			value = filter;
		}

		if (value) {
			var obj = {};
			obj.fieldName = fieldName;
			obj.operatorId = operator;
			obj.values = [value];
			return Ext.encode(obj);
		}
		return filter;
	},

	configureListTab: Ext.emptyFn,

	beforeShowList: Ext.emptyFn,

	afterShowList: Ext.emptyFn,

	quickEntry: function () {
		var qe = this.quickEntryInfo;
		if (!qe) {

			qe = new DA.form.QuickEntry({ module: this });
			this.quickEntryInfo = qe;

			this.initQuickEntry(qe);

		}

		qe.show();
	},

	createFilterPanel: function () {
		var grid = this.grid;
		var prefManager = grid.prefManager;
		if (typeof (this.staticFilter) !== 'object') {
			this.staticFilter = {};
		}

		var defaultFilters = this.staticFilter.defaultFilters;
		if (defaultFilters) {
			for (var i = 0; i < defaultFilters.length; i++) {
				prefManager.filterModel.addElementaryFilter(defaultFilters[i]);
			}
		}

		Ext.applyIf(this.staticFilter, {
			filterModel: prefManager.filterModel,
			autoScroll: true,
			colsNumber: 2,
			labelPad: 1,
			region: "north",
			height: 180,
			xtype: 'staticFilter',
			itemCls: 'filter',
			buttons: [{ text: 'Apply', handler: this.filterTable, scope: { grid: grid, module: this } }],
			title: 'Filter',
			collapsible: true,
			split: true
		});
	},

	/// <summary>
	/// Show the list view
	/// </summary>
	fnApplyLabel: function (sender, a, b, menuItem) {
		if (menuItem.id == 'Remove') {
			action = 'delete';
		} else {
			action = 'save';
		}
		var grid = sender;
		var record = grid.getSelectionModel().selections.items[0];
		if (!record) {
			Ext.Msg.alert('Error', 'No row selected');
			return;
		}
		var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Applying...' });
		mask.show();
		var params = {};
		params.bgColor = menuItem.id;
		params.action = action;
		params.BusinessObjectId = record.get(this.keyColumn);
		params.BusinessObjectTypeId = this.businessObjectTypeId;
		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl("LabelInfo"),
			params: params,
			callback: function (o, success, response) {
				mask.hide();
				if (!success) {
					Ext.Msg.alert('An error occurred', 'An error occurred');
				}
				else {
					record.set('LabelInfo', '{ bgColor: "' + params.bgColor + '" }'); //Applying new settings
					grid.getView().refresh();

				}
			},
			scope: this
		}, this);
	},

	getRowClassForLabel: function (record, rowIndex, rp, ds) {
		if (record.get('LabelInfo') != "") {
			var css;
			var labelInfo = Ext.util.JSON.decode(record.get('LabelInfo'));
			if (labelInfo.bgColor != "") {
				css = 'grid-row-back-color-' + labelInfo.bgColor;
			}
			if (labelInfo.foreColor != "") {
				css += ' grid-row-fore-color-' + labelInfo.foreColor;
			}
			return css;
		}
	},
	ShowList: function (config, extraOptions) {
		var isFirstTime = typeof (this.grid) === 'undefined';
		if (isFirstTime) {
			if (this.beforeShowList(this, extraOptions) === false) {
				return;
			}
			if (this.enableLabels) {
				if (!this.gridConfig) {
					this.gridConfig = {};
				}
				if (!this.gridConfig.viewConfig) {
					this.gridConfig.viewConfig = {};
				}
				if (typeof (this.gridConfig.viewConfig.getRowClass) == 'function') {
					//Alert - Cannot apply the Labels feature, its over-ridden in the using JS
					Ext.Msg.alert('Error', 'GetRowClass function is overriden in the using JS, apply or override there');
				} else {
					this.gridConfig.viewConfig.getRowClass = this.getRowClassForLabel;
				}
			}
			this.createGrid(config);

		}
		var grid = this.grid;
		var prefManager = grid.prefManager;
		// code for add color fOr cell 
		if (this.grid && this.enableLabels && isFirstTime) {
			var contextMenu = this.grid.prefManager.contextMenuManager.menu;
			this.addLabelContextMenu(contextMenu, this.grid);
		}

		if (extraOptions && extraOptions.extraParams) {
			var store = grid.getStore();
			Ext.apply(store.baseParams, extraOptions.extraParams);
		}

		var loadFirst = true;
		if (extraOptions && extraOptions.filter) {
			prefManager.filterModel.setFilterObj(null);
			var store = grid.getStore();
			store.baseParams.filter = this.resolveParamFilter(extraOptions.filter);
		} else {
			if (prefManager && prefManager.enabled) {
				prefManager.manager.applyDefaultPreference();
				loadFirst = false;
			}
		}
		if (loadFirst) {
			grid.loadFirst();
		}
		var tabConfig = {
			id: this.getId('List'),
			title: this.listTitle,
			iconCls: this.iconCls,
			icon: this.icon
		};


		if (isFirstTime) {
			if (this.gridConfig && this.gridConfig.autoFilter && this.staticFilter) {

				this.createFilterPanel();

				Ext.applyIf(grid, {
					region: 'center'
				});

				Ext.apply(tabConfig, {
					layout: 'border',
					items: [this.staticFilter, grid]
				});
			} else {
				tabConfig.items = [grid];
			}

			this.configureListTab(tabConfig);
		}
		var tab = DCPLApp.AddTab(tabConfig);

		if (DA.App) {
			if (DA.App.recreateCm) {
				var newList = [];

				for (var i = 0; i < DA.App.recreateCm.length; i++) {
					var obj = DA.App.recreateCm[i];
					if (obj == this) {
						var grid = obj.grid;
						if (grid) {
							obj.updateCm(grid);
						}
					} else {
						newList.push(obj);
					}
				}

				DA.App.recreateCm = newList;
			}
		}

		if (this.quickSearch) {
			var setFocus = function () {
				this.quickSearch.field.focus();
			};
			setFocus.defer(500, this);
			tab.on('activate', function () {
				setFocus.defer(500, this);
			}, this);
		}
		this.afterShowList({ isFirstTime: isFirstTime, tab: tab }, extraOptions);
	},

	HideList: function () {
		var tabId = this.getId('List');
		var config = { id: tabId };
		DCPLApp.CloseTab(config);
	},
	addLabelContextMenu: function (contextMenu, grid) {
		var menuItemHighlightText = 'Highlights';
		contextMenu.items.push({
			text: menuItemHighlightText, scope: this,
			listeners: {
				'show': {
					fn: function (comboField) {
						var grid = (grid) ? grid : this.grid;
						var record = grid.getSelectionModel().selections.items[0];

						for (var i = 0; i < comboField.menu.items.length; i++) {
							comboField.menu.items.items[i].setIconClass('');
						}
						if (record && record.get("LabelInfo") != "") {
							var menuItem = comboField.menu.items.get(Ext.util.JSON.decode(record.get('LabelInfo')).bgColor);
							if (menuItem) {
								menuItem.setIconClass('check');
							}
						}
					}
				, scope: this
				}
			},
			menu: {
				items: [
				{ text: 'Blue', id: 'SteelBlue', handler: this.fnApplyLabel, scope: this },
				{ text: 'Light Blue', id: 'LightBlue', handler: this.fnApplyLabel, scope: this },
				{ text: 'Green', id: 'DarkSeaGreen', handler: this.fnApplyLabel, scope: this },
				{ text: 'Light Green', id: 'LightGreen', handler: this.fnApplyLabel, scope: this },
				{ text: 'Purple', id: 'Purple', handler: this.fnApplyLabel, scope: this },
				{ text: 'Light Purple', id: 'LightPurple', handler: this.fnApplyLabel, scope: this },
				{ text: 'Red', id: 'IndianRed', handler: this.fnApplyLabel, scope: this },
				{ text: 'Pink', id: 'Pink', handler: this.fnApplyLabel, scope: this },
				{ text: 'Yellow', id: 'LightGoldenRodYellow', handler: this.fnApplyLabel, scope: this },
				{ text: 'Orange', id: 'Orange', handler: this.fnApplyLabel, scope: this },
				{ text: 'Bisque', id: 'Bisque', handler: this.fnApplyLabel, scope: this },
				{ text: 'Silver', id: 'Silver', handler: this.fnApplyLabel, scope: this },
				{ text: 'Cyan', id: 'Cyan', handler: this.fnApplyLabel, scope: this },
				{ text: 'Magenta', id: 'Magenta', handler: this.fnApplyLabel, scope: this },
				{ text: 'Brown', id: 'Brown', handler: this.fnApplyLabel, scope: this },
				{ text: 'Black', id: 'Black', handler: this.fnApplyLabel, scope: this },
				{ text: 'Remove highlight', id: 'Remove', handler: this.fnApplyLabel, scope: this }
				], scope: this
			}
		});
	},
	// Load custom data
	loadData: function (form, data) {
		var i, len, id;
		if (data.data && !isNaN(data.data.Id)) {
			form.baseParams.id = data.data.Id;
			if (this.showFormArgs.copy) {
				form.baseParams.id = 0;
			}
			this.activeRecordId = data.data.Id;
			var formCaption;
			if (form.baseParams.id === 0) {
				if (this.showFormArgs.copy) {
					formCaption = "New as Copy";
				} else {
					formCaption = "New";
				}
			} else {
				formCaption = data.data[this.captionColumn];
			}
			if (formCaption) {
				this.win.setTitle(String.format(this.formTitle, formCaption));
			}
		}
		id = form.baseParams.id;
		var isNew = id === 0;

		this.loadComboData(data);
		// load global combos
		for (var prop in this.comboData) {
			if (DA.combo.stores[prop]) {
				DA.combo.stores[prop].loadData(this.comboData[prop]);
			}
		}

		var childModules = this.childModules;
		if (childModules) {
			for (i = 0, len = childModules.length; i < len; i++) {
				var childModule = childModules[i];
				childModule.comboData = this.comboData;
				childModule.loadComboStores();
			}
		}

		var comboData = data.combos;
		var formItems = form.items.items;
		var loadCombos = false;
		if (comboData) {
			loadCombos = true;
		}
		this.updateCombos(formItems, loadCombos, comboData);

		var grids = this.childGrids;
		if (grids) {
			this.loadChildGridData(grids, { id: id, data: data });
		}

		this.populateChildren(form, data);

		var setValues = function () {
			DA.Util.Form.SetValues({ module: this, data: data });
			if (isNew) {
				DA.combo.setDefaultValues.call(this, { module: this });
				//Setting default values for the fields
				if (this.defaultMappings) {
					DA.Util.SetValues({ module: this, items: this.defaultMappings, data: DA.Security.info.DefaultValues });
				}
			}
			this.fireEvent("dataLoaded", this, data);

			var defaultField = this.defaultField;
			if (!defaultField) {
				this.formPanel.cascade(function (o) {
					if (!defaultField && typeof o.getValue == 'function' && !o.disabled && typeof o.focus == 'function') {
						defaultField = o;
						return false;
					}
				});
			}
			if (defaultField) {
				if (!ExtHelper.isMobile.any()) {
					defaultField.focus(true, 250);
				}
			}

			//Updating combos to show actual text instead of ID's, loading them for Child Tabs / Remote Combos
			if (this.addlFormFields) {
				var childFields = []; //Temporary
				for (var obj in this.addlFormFields) {
					childFields.push(this.addlFormFields[obj]);
				}

				var updateCombosDelayed = function () {
					this.updateCombos(childFields, loadCombos, comboData);
				};

				updateCombosDelayed.defer(250, this);

				childFields = null; //Wiping
			}
		};

		setValues.call(this);
	},

	loadChildGridData: function (grids, options) {
		var id = options.id;
		var data = options.data;
		var isNew = id === 0;
		// load all child grids
		for (i = 0, len = grids.length; i < len; i++) {
			var grid = grids[i];
			var store = grid.getStore();
			if (grid.initialConfig.root) {
				var root = store.reader.root || store.root;
				if (root && !data.data[root]) {
					data.data[root] = [];
				}
				grid.getStore().loadData(data.data);
			} else {
				store.baseParams[grid.parentColumn || this.keyColumn] = id;
				if (grid.isVisible()) {
					grid.loadFirst();
				} else {
					grid.loaded = false;
				}
				grid.setDisabled(isNew);
			}
		}
	},

	loadComboData: function (data) {
		if (data && data.combos) {
			var combos = data.combos;
			// assign loaded combos to the form
			this.comboData = Ext.applyIf(combos, this.comboData);

			// if there are store combos, load the values there too
			this.loadComboStores();
		}
	},

	loadComboStores: function () {
		for (var prop in this.comboData) {
			if (this.comboStores[prop]) {
				this.comboStores[prop].loadData(this.comboData[prop]);
			}
		}
	},

	// Creates the formpanel. Override this method if you want to create specific layouts
	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
	},

	hideFormWin: function (args) {
		this.fireEvent("beforeFormClose", this, args);

		DA.CurrentModule = DA.PrevModule;

		if (this.formPanel.body.isMasked()) {
			this.formPanel.body.unmask();
		}

		if (this.formAsTab) {
			DCPLApp.TabPanel.remove(this.win);
		} else {
			this.win.hide();
		}
		if (args && args.reloadGrid) {
			if (args.sourceModule) {
				args.grid = args.sourceModule.grid;
			}
			if (args.grid) {
				args.grid.getStore().reload();
			} else {
				if (this.grid && this.grid.isVisible()) {
					this.grid.getStore().reload();
				}
			}
			args.reloadGrid = false;
		}
	},

	resetUserState: function () {//Added Due to #6197 
		var winResetUserState = this.winResetUserState;
		if (!winResetUserState) {
			this.comboTypes.push('UserState');
			this.comboStores.UserState = new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup });
			var userCombo = DA.combo.create({ fieldLabel: 'Select User', baseParams: { comboType: 'UserState' }, controller: 'combo', allowBlank: false });
			this.userCombo = userCombo;
			var form = new Ext.form.FormPanel({
				bodyStyle: "padding:5px;",
				items: userCombo
			});
			winResetUserState = new Ext.Window({
				title: 'Reset Form user State',
				height: 110,
				modal: true,
				width: 330,
				items: form,
				closeAction: 'hide',
				layout: 'fit',
				buttons: [
					{
						text: 'Submit', handler: function () {
							var userId = this.userCombo.getValue();
							var stateIds = '';
							var innerStatefulItems = this.formPanel.find('stateful', true);
							var childGrid = this.childGrids;

							var formStateId = this.formPanel.getStateId();
							if (formStateId) {
								stateIds += "'" + formStateId + "'" + ",";
							}
							for (var i = 0; i < childGrid.length ; i++) {// Add Child grid
								if (childGrid[i].stateId)
									stateIds += "'" + childGrid[i].stateId + "'" + ",";
							}
							for (var i = 0; i < innerStatefulItems.length ; i++) {//Panel Items 
								if (innerStatefulItems[i] && innerStatefulItems[i].stateId && stateIds.indexOf(innerStatefulItems[i].stateId) < 0)
									stateIds += "'" + innerStatefulItems[i].stateId + "'" + ",";
							}
							if (this.tabPanel) {// Add Inner Tab like order Histor on Order Entry Form
								var itemTabs = this.tabPanel.items.items;
								for (var i = 0; i < itemTabs.length ; i++) {
									if (itemTabs[i] && itemTabs[i].stateId && stateIds.indexOf(itemTabs[i].stateId) < 0)
										stateIds += "'" + itemTabs[i].stateId + "'" + ",";
								}
							}
							var stateIds = stateIds.replace(/,\s*$/, '');//remove last Comma from stateIds
							if (stateIds) {
								Ext.Ajax.request({
									url: EH.BuildUrl('UserState'),
									params: Ext.apply({ action: 'resetState', stateId: stateIds, userId: userId }),
									title: 'Reset',
									handleSuccess: false,
									success: function () {
										this.winResetUserState.hide();
										Ext.Msg.alert('Message', 'User state deleted.');
									},
									failure: function () {
										Ext.Msg.alert('Error', 'An error occurred.');
									},
									scope: this
								});
							} else
								Ext.Msg.alert('Message', 'User state not found.');
						}, scope: this
					}
				]
			}, this);
			this.form = form;
			this.winResetUserState = winResetUserState;
		}

		this.winResetUserState.show();

	},

	// private - replacement of comboLoader
	updateCombos: function (items, loadCombos, comboData) {
		if (!items) {
			return;
		}
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item) {
				if (item.isXType('combo')) {
					var combo = item;
					var remotelyLoaded = false;
					var comboType;
					if (loadCombos) {
						comboType = combo.comboType || (combo.store.baseParams && combo.store.baseParams.comboType);
						if (comboType && !combo.controller) {
							if (combo.store.baseParams.scopeId) {
								comboType += ":" + combo.store.baseParams.scopeId;
							}
							var data = comboData[comboType];
							if (data) {
								combo.store.loadData(data);
								if (combo.valueField) {
									ExtHelper.SelectComboValue(combo, combo.getValue());
								}
								remotelyLoaded = true;
							}
						}
					}
					var comboValue = combo.getValue();
					if (comboType && comboValue && comboValue == "0") {
						combo.clearValue();
					} else {
						if (!remotelyLoaded && combo.valueField) {
							if (combo.mode == 'local') {
								ExtHelper.SelectComboValue(combo, comboValue);
							} else {
								if (combo.valueField !== 'DisplayValue') {
									if (this.formPanel && this.formPanel.url) {
										combo.baseParams.activeModule = this.formPanel.url;
									}
									ExtHelper.SetComboValue(combo, comboValue);
								}
							}
						}
					}
				}
			}
		}
	},

	// showFormArgs,

	addFormToolbarButton: function (formCfg, options) {
		var addSeperator = options.addSeperator === true;
		var button = options.button;
		var tbar = formCfg.tbar;
		var position = (DA.Help && DA.Help.Show && !this.disableHelp) ? tbar.length - 2 : tbar.length;
		if (addSeperator) {
			tbar.splice(position, 0, "-");
			position = position + 1;
		}
		tbar.splice(position, 0, button);
	},

	ShowForm: function (id, args) {
		var showUserStateButton = true;
		if (typeof DA.App.showUserStateButton == 'function') {
			showUserStateButton = DA.App.showUserStateButton();
		}
		if (!args) {
			args = {};
		}

		Ext.applyIf(args, {
			id: id
		});

		if (args.source) {
			this.sourceArgs = args.source;
		}
		else {
			if (!this.grid && args.sourceModule && args.sourceModule.grid) {
				this.grid = args.sourceModule.grid;
			}
			var newArgs = { grid: this.grid, keyField: this.keyColumn, keyId: id, targetKeyField: this.keyColumn };
			this.sourceArgs = newArgs;
		}
		this.showFormArgs = args;

		var asTab = this.formAsTab;

		this.closeFormAfterSave = false;
		this.loadNewAfterSave = false;
		if (!this.formPanel) {
			var tbar = [];
			var buttons = {};

			this.formButtons = buttons;

			buttons.saveAndClose = new Ext.Toolbar.Button({ text: 'S<u>a</u>ve and Close', handler: function () { this.reloadObjectAfterSave = false, this.saveHandler({ validate: true, close: true }); }, scope: this, iconCls: 'save', disabled: true });
			buttons.save = new Ext.Toolbar.Button({ text: '<u>S</u>ave', handler: function () { this.reloadObjectAfterSave = false, this.saveHandler(); }, scope: this, iconCls: 'save', disabled: true });
			buttons.add = new Ext.Toolbar.Button({ text: '<u>N</u>ew', handler: this.load, scope: this, iconCls: 'new', disabled: !this.canAdd() });
			buttons.copy = new Ext.Toolbar.Button({ text: '<u>C</u>opy', handler: this.copy, scope: this, iconCls: 'new', disabled: true });
			buttons.del = new Ext.Toolbar.Button({ text: '<u>D</u>elete', handler: this.formDeleteHandler, scope: this, iconCls: 'delete', disabled: !this.canDelete() });
			buttons.close = new Ext.Toolbar.Button({ text: 'Ca<u>n</u>cel', handler: function () { this.win.allowHide = true; this.hideFormWin(args); }, scope: this, iconCls: 'cancel' });
			buttons.saveAndNew = new Ext.Toolbar.Button({ text: 'Save and Ne<u>w</u>', handler: function () { this.reloadObjectAfterSave = true, this.saveHandler({ loadNew: true }); }, scope: this, iconCls: 'save', disabled: true });
			buttons.saveWithoutValidations = new Ext.Toolbar.Button({ text: 'Save without <u>V</u>alidation', handler: function () { this.reloadObjectAfterSave = false, this.saveHandler({ validate: false, isValid: true }); }, scope: this, iconCls: 'save', disabled: true });
			buttons.help = new Ext.Toolbar.Button({ text: '', handler: function () { DA.Help.Show({ helpKey: this.helpKey(), extraKey: 'form', title: this.listTitle }); }, scope: this, iconCls: 'help', tooltip: 'Help' });
			buttons.saveAndNext = new Ext.Toolbar.Button({ text: 'Save and Ne<u>x</u>t', handler: function () { this.reloadObjectAfterSave = true, this.saveHandler({ loadNext: true }); }, scope: this, iconCls: 'save', disabled: true });
			buttons.reset = new Ext.Toolbar.Button({ text: 'Reset Form User State', handler: this.resetUserState, scope: this, iconCls: 'refresh' });
			if (this.saveClose) {
				tbar.push(buttons.saveAndClose);
			}

			if (this.save) {
				tbar.push(buttons.save);
			}
			if (this.showSaveWithoutValidationsButtons) {
				buttons.saveAndClose.text = 'Submit';
				buttons.saveWithoutValidations.text = 'Save';
				tbar.push(buttons.saveWithoutValidations);
			}
			if (this.saveAndNew) {
				tbar.push(buttons.saveAndNew);
			}
			if (DA.App.saveAndNext && this.loadNextAfterSave) {
				tbar.push(buttons.saveAndNext);
			}
			if (tbar.length > 0) {
				tbar.push("-");
			}
			if (this.newButton) {
				tbar.push(buttons.add);
			}
			if (this.copyButton) {
				tbar.push(buttons.copy);
			}

			if (!this.disableDelete) {
				if (tbar.length > 0 && tbar[tbar.length - 1] !== "-") {
					tbar.push("-");
				}
				tbar.push(buttons.del);
			}
			if (tbar.length > 0 && tbar[tbar.length - 1] !== "-") {
				tbar.push("-");
			}
			tbar.push(buttons.close);
			if (DA.Security.IsSuperAdmin() && showUserStateButton) {
				tbar.push(buttons.reset);
			}
			if (DA.Help && DA.Help.Show) {
				/*
				Moved on PrinterFreindly.js
				if (!this.disableHelp) {
				tbar.push("->");
				tbar.push(buttons.help);
				}
				*/
			}

			if (!this.formConfig) {
				this.formConfig = {};
			}

			var baseParams = {
				id: 0
			};

			var plugins = [ExtHelper.Plugins.ExceptionHandler];
			if (this.enablePrint) {
				plugins.push(new Ext.ux.plugins.Print());
			}

			var config = Ext.apply({
				url: EH.BuildUrl(this.controller),
				method: 'post',
				baseParams: Ext.apply(baseParams, this.baseParams),
				plugins: plugins,
				bodyStyle: 'padding:5px 5px 5px 5px',
				tbar: tbar,
				border: false,
				bodyBorder: false
			}, this.formConfig);

			config = this.createForm(config);
			// Hidden Field for Old Version field on all forms
			var configItems = config.items && config.items.items ? config.items.items : config.items;
			if (this.useVersion && configItems) {
				var oldVersionHiddenField = new Ext.form.Hidden({ name: 'OldVersion' });
				configItems.push(oldVersionHiddenField);
				var checkOldVersionHiddenField = new Ext.form.Hidden({ name: 'CheckOldVersion' });
				configItems.push(checkOldVersionHiddenField);
			}
			this.CreateFormPanel(config);

			ExtHelper.Plugins.ExceptionHandler.init(this.formPanel.form);

			this.formPanel.on('actioncomplete', function (form, action) {

				var isNew = false;
				if (action.result) {
					if (action.result.data && !isNaN(action.result.data.Id)) {
						var id = Number(action.result.data.Id);
						isNew = id === 0;
						var savable = false;
						if (isNew) {
							savable = this.canAdd();
						} else {
							savable = (this.canEdit() && action.result.data.CanEdit !== false) || this.showFormArgs.copy;
						}

						var childGrids = this.childGrids;
						if (Ext.isArray(childGrids)) {
							for (var i = 0, len = childGrids.length; i < len; i++) {
								var childGrid = childGrids[i];
								if (typeof childGrid.getTopToolbar == 'function') {
									var childGridToolbar = childGrid.getTopToolbar();
									if (childGridToolbar) {
										if (typeof childGridToolbar.setDisabled == 'function') {
											childGridToolbar.setDisabled(!savable);
										} else {
											childGridToolbar.disabled = true;
										}
									}
								}
							}
						}

						buttons.saveAndClose.setDisabled(!savable);
						buttons.saveAndNext.setDisabled(!savable);
						buttons.save.setDisabled(!savable);
						buttons.saveAndNew.setDisabled(!savable || this.disableAdd);
						buttons.saveWithoutValidations.setDisabled(!savable);
						if (this.copyButton) {
							buttons.copy.setDisabled(isNew || !this.canAdd());
						}

						form.items.each(function () {
							if (this.initialConfig && !this.initialConfig.disabled) {
								if (this.xtype == 'combo' || this.constructor.xtype == 'combo') {
									if (!savable) {
										this.disable();
									} else {
										this.enable();
									}
								} else {
									if (this.isFormField) {
										this.setReadOnly(!savable);
									}
								}
							}
						});

						buttons.del.setDisabled(isNew || !this.canDelete() || action.result.data.CanDelete === false);
					}

				}
				switch (action.options.params.action) {
					case 'load':
						this.loadData(form, action.result);
						break;
					case 'save':
						this.fireEvent("afterSave", this, form, action);
						this.fireEvent("dataUpdated", this, {});

						this.activeRecordId = action.result.data.Id;

						args.reloadGrid = true;
						if (this.closeFormAfterSave) {
							this.closeFormAfterSave = false;
							this.win.allowHide = true;
							args.reloadGrid = true;
							this.hideFormWin(args);
						}
						else if (this.loadNewAfterSave) {
							this.loadNewAfterSave = false;
							this.load();
						}
						else if (this.loadNextAfterSave) {
							var sourceGrid = this.sourceArgs.grid;
							var sourceStore;
							var sm;
							var loadNextRecord;
							if (sourceGrid) {
								sm = sourceGrid.getSelectionModel();
								sourceStore = sourceGrid.getStore();
								//TODO: Optimize, refresh only if Save and Next is clicked
								if (sourceStore) {
									//sourceStore.reload(); Code Commented #3692
								}
							}
							var sourceStoreLoadComplete = function () {
								//sm.selectRow(0);
								var nextId = sourceStore.getAt(0).get(this.sourceArgs.targetKeyField);
								this.sourceArgs.keyId = sourceStore.getAt(0).get(this.sourceArgs.keyField);
								sourceStore.un('load', sourceStoreLoadComplete, this); //Dis-associating event
								if (nextId || scope.sourceArgs.ignoreIteration) {
									if (this.sourceArgs.group) {
										var group = sourceStore.getAt(0).get(this.sourceArgs.group.field);
										if (this.sourceArgs.group.id !== group) {
											Ext.Msg.alert('Group End', 'Group ' + this.sourceArgs.group.id + ' end New Group ' + group + ' started');
											this.sourceArgs.group.id = group;
										}
									}
									this.load(nextId);
								}
								else {
									//Need to optimize code for scope 
									loadNextRecord({ index: nextRecordIndex, scope: this });
								}
							};
							loadNextRecord = function (options) {
								var nextRecordIndex = options.index;
								var scope = options.scope;
								if (nextRecordIndex > sourceStore.getCount() - 1) {
									var pagingToolbar = sourceGrid.getBottomToolbar();
									var total = sourceGrid.getStore().getTotalCount();
									var extra = total % pagingToolbar.pageSize;
									var lastStart = extra ? (total - extra) : total - pagingToolbar.pageSize;
									if (lastStart != total && lastStart > 0 && pagingToolbar.cursor + nextRecordIndex !== total) {
										sourceStore.on('load', sourceStoreLoadComplete, scope); //Associating event
										pagingToolbar.onClick("next");
									} else {
										Ext.Msg.alert('Alert', 'Records end');
									}
								} else {
									//sm.select(nextRecordIndex, 0);
									if (scope.sourceArgs.group) {
										var group = sourceStore.getAt(nextRecordIndex).get(scope.sourceArgs.group.field);
										if (scope.sourceArgs.group.id !== group) {
											Ext.Msg.alert('Group End', 'Group ' + scope.sourceArgs.group.id + ' end New Group ' + group + ' started');
											scope.sourceArgs.group.id = group;
										}
									}
									var nextId = sourceStore.getAt(nextRecordIndex).get(scope.sourceArgs.targetKeyField); //Always get OrderId in this case
									scope.sourceArgs.keyId = sourceStore.getAt(nextRecordIndex).get(scope.sourceArgs.keyField);
									scope.noAction = true;
									if (nextId || scope.sourceArgs.ignoreIteration) {
										scope.load(nextId);
									}
									else {
										loadNextRecord({ index: nextRecordIndex + 1, scope: scope });
									}
								}
							};

							if (sourceStore) {
								var currentRecordIndex = sourceStore.findExact(this.sourceArgs.keyField, this.sourceArgs.keyId); //It will pick last documentId or OrderId (if coming frmo Billing / Settlement Screen);
								var nextRecordIndex = currentRecordIndex + 1;

								//Need to optimize code for scope
								loadNextRecord({ index: nextRecordIndex, scope: this });
							}

						}
						else if (this.noAction) {
							this.noAction = false;
							//Do nothing
						} else {
							if (this.reloadAfterSave) {
								this.load(action.result.data.Id);
							} else {
								this.loadData(form, action.result);
							}
						}

						break;
				}
			}, this);

			if (this.winItems === null) {
				this.winItems = this.formPanel;
			}

			var winConfig = Ext.applyIf(this.winConfig, {
				height: 400,
				width: 800,
				modal: true,
				border: false,
				title: String.format(this.formTitle, id),
				id: this.getId("Form"),
				layout: 'fit',
				items: this.formPanel
			});

			if (asTab) {
				delete winConfig.height;
				delete winConfig.width;
				delete winConfig.modal;
				this.win = DCPLApp.AddTab(winConfig);
			} else {
				this.win = ExtHelper.OpenWindow(winConfig, { hidden: true });
			}

			if (!asTab) {
				this.win.on('beforehide', function () {
					if (!this.win.allowHide) {
						Ext.Msg.confirm('Close', 'Any pending changes will be lost.<br />Do you still want to continue?', function (btn) {
							if (btn == 'yes') {
								this.win.allowHide = true;
								this.hideFormWin(args);
							}
						}, this);
						return false;
					}
					this.win.allowHide = false;
					return true;
				}, this);
			} else {
				DCPLApp.on('beforeTabRemove', function (app, args) {
					if (args.panel == this.win) {
						if (!this.win.allowHide) {
							Ext.Msg.confirm('Close', 'Any pending changes will be lost.<br />Do you still want to continue?', function (btn) {
								if (btn == 'yes') {
									this.win.allowHide = true;
									this.hideFormWin(args);
								}
							}, this);
							return false;
						}
						this.win.allowHide = false;
						return true;
					}
				}, this);
			}

			// request combo types
			var items = this.formPanel.findByType('combo');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.mode == 'local' && item.store && item.store.baseParams && item.store.baseParams.comboType) {
					this.comboTypes.push({ comboType: item.store.baseParams.comboType, scopeId: item.store.baseParams.scopeId });
				}
			}
		} else {
			// Mark that we need to reload combos
			var form = this.formPanel.getForm();
			form.reset();
			form.combosLoaded = false;
		}

		if (this.formDisabled) {
			this.setDisabled(false);
		}

		if (this.fireEvent("beforeShowForm", this, args) === false) {
			return;
		}

		if (this.formAsTab) {
			this.win = DCPLApp.AddTab(this.win);
		} else {
			this.win.show();
		}

		DA.PrevModule = DA.CurrentModule;
		DA.CurrentModule = this;

		this.fireEvent("afterShowForm", this, args);

		this.formPanel.getForm().waitMsgTarget = this.win.getEl();

		var caption;
		if (args.id === 0) {
			caption = "New";
		} else {
			if (this.captionColumn && args.record) {
				caption = args.record.get(this.captionColumn);
			}
			if (!caption) {
				caption = args.id;
			}
		}
		this.win.setTitle(String.format(this.formTitle, caption));

		this.load(id, args.loadOptions);
	},

	copy: function () {
		this.win.setTitle(String.format(this.formTitle, "New"));
		this.formPanel.baseParams.id = 0;
		this.fireEvent('copy', this);

		// Clear original values tracked
		this.formPanel.getForm().originalValues = {};

		// Reset all link fields
		var linkFields = this.formPanel.findByType('hyperlinkField');
		Ext.each(linkFields, function (field) { field.setHtml(); });
	},

	load: function (id, options) {
		if (isNaN(id)) {
			id = 0;
		}

		var args = { id: id };
		if (!options) {
			options = {};
		}

		if (this.fireEvent("beforeLoad", this, args, options) === false) {
			return;
		}

		var form = this.formPanel;
		var baseParams = form.baseParams;

		baseParams.id = id;


		var loadOptions = {};
		if (this.formConfig && this.formConfig.loadOptions) {
			loadOptions = this.formConfig.loadOptions;
		}
		var comboTypes = this.getComboTypesForLoad();
		loadOptions.params = Ext.apply({ action: 'load', comboTypes: Ext.encode(comboTypes), loadCombos: this.loadCombos }, options.params);
		if (DA.Defaults.Form.loadMask) {
			loadOptions.waitMsg = DA.Defaults.Form.loadMsg ? DA.Defaults.Form.loadMsg : true;
		}
		form.load(loadOptions);
	},

	getComboTypesForLoad: function () {
		var comboTypes = [];
		var comboStores = this.comboStores;
		for (var i = 0, len = this.comboTypes.length; i < len; i++) {
			var shouldLoad = true;
			var comboInfo = this.comboTypes[i];
			if (typeof comboInfo === 'string') {
				comboInfo = { comboType: comboInfo };
			}
			var comboType = comboInfo.comboType;
			var loaded = false;
			var globalStore = DA.combo.getStore(comboType);
			var store = globalStore;
			if (comboStores) {
				store = this.comboStores[comboType];
				if (store) {
					// If it is not a global store, check if it is defined as a global type
					// If this type is defined as a global type, set the reference to global store
					if (!store.isGlobalStore && globalStore) {
						delete this.comboStores[comboType];
						this.comboStores[comboType] = globalStore;
						store = globalStore;
					}
				} else {
					store = globalStore;
				}
			}
			if (store) {
				if (store.doNotLoad) {
					shouldLoad = false;
				} else if (store.reader && store.reader.jsonData) {
					loaded = true;
				}
			}
			if (shouldLoad) {
				comboTypes.push({ type: comboType, loaded: loaded, scopeId: comboInfo.scopeId });
			}
		}
		return comboTypes;
	},

	SetAssociationInfo: function (type, id, grid) {
		this.SetBaseParams({ AssociationType: type, AssociationId: id }, grid);
	},

	SetBaseParams: function (params, grid) {
		Ext.apply(this.baseParams, params);
		if (grid) {
			Ext.apply(grid.baseParams, params);
		}
		if (this.grid) {
			Ext.apply(this.grid.baseParams, params);
		}
		if (this.formPanel) {
			Ext.apply(this.formPanel.baseParams, params);
		}
	},

	populateChildren: function (form, data) {
		var id = data.data.Id;

		var associations = this.associations;
		if (!associations) {
			return;
		}

		var isNew = id === 0;

		for (var i = 0, len = associations.length; i < len; i++) {
			var association = associations[i];
			association.grid.setDisabled(isNew);
			association.grid.store.removeAll();
			association.grid.loaded = false;
			association.module.SetAssociationInfo(this.controller, id, association.grid);
			if (!isNew && association.grid.isVisible()) {
				association.grid.loadFirst();
			}
		}
	},

	createRelations: function (config) {

		if (Ext.isArray(config)) {
			config = { relations: config };
		}

		var relations = config.relations, associationTypeId = config.associationTypeId;

		var childGrids = [];
		var childModules = [];
		var associations = [];
		var grids = [];
		for (var i = 0, len = relations.length; i < len; i++) {
			var item = relations[i], module = item.module, gridConfig = item.gridConfig || {}, type = item.type, grid;
			if (type === 'oneToMany') {
				if (gridConfig.root) {
					Ext.applyIf(gridConfig, { allowPaging: false, editable: true });
				}
				grid = module.createGrid(gridConfig, true);
				childModules.push(module);
				childGrids.push(grid);
			} else {
				grid = module.createGrid(gridConfig, true);
				associations.push({ module: module, grid: grid });
			}
			Ext.applyIf(module, { grid: grid });
			grids.push(grid);
		}
		this.childModules = childModules;
		this.childGrids = childGrids;
		this.associations = associations;

		return {
			config: config,
			tabPanel: {
				xtype: 'tabpanel',
				region: 'center',
				activeTab: 0,
				layoutOnTabChange: true,
				defaults: { border: false },
				items: grids,
				listeners: {
					tabchange: this.onChildGridTabChange,
					scope: this
				}
			}
		};
	},

	onChildGridTabChange: function (tabPanel, panel) {
		if (!panel.isXType('grid') || panel.loaded === true || panel.initialConfig.root) {
			return;
		}
		var store = panel.getStore();
		if (store.url) {
			panel.loadFirst();
		}
	}

});

Ext.ns("DA.Util.Form");

/**
* Maps values to form fields
*/
DA.Util.Form.SetValues = function (options) {
	var module = options.module;
	var addlFields = module.addlFormFields;
	var data = options.data.data;
	if (addlFields) {
		for (var property in addlFields) {
			var field = addlFields[property];
			var value = data[field.hiddenName || field.name || field.id];
			EH.SetFieldValue({ field: field, value: value });
		}
	}
};

/**
* Reads values from form fields
*/
DA.Util.Form.GetValues = function (options) {
	var module = options.module;
	var addlFields = module.addlFormFields;
	var params = options.params;
	if (addlFields) {
		for (var property in addlFields) {
			var field = addlFields[property];
			if (!field.disabled) {
				var value = field.getValue();
				if (value === undefined || value === null) {
					value = field.value;
				}
				if (Ext.isDate(value)) {
					value = field.getRawValue();
				}
				params[field.hiddenName || field.name || field.id] = value;
			}
		}
	}
};

/**
* Adds fields  to addlFormFields list
*/
DA.Util.Form.AddAddlFields = function (options) {
	var module = options.module;
	var containers = options.items, container;
	for (var i = 0; i < containers.length; i++) {
		container = containers[i];
		if (container.items) {
			for (var j = 0; j < container.items.length; j++) {
				var item = container.items[j] || container.items.items[j];
				if (item.getXType && item.ignore !== true) {
					module.addlFormFields[item.hiddenName || item.name] = item;
				}
				if (options.recursive && item.items) {
					DA.Util.Form.AddAddlFields({ module: module, recursive: true, items: [item] });
				}
			}
		}
	}
};

/**
* Shows a title and message using Ext.Msg.show
*/
DA.Util.ShowError = function (title, msg, fn) {
	Ext.Msg.show({
		title: title,
		msg: msg,
		buttons: Ext.Msg.OK,
		icon: Ext.MessageBox.ERROR,
		fn: fn
	});
};

/**
* Global combo help for forms
* @constructor
*/
DA.combo = {
	/**
	* @property {Object} stores Global stores
	*/
	stores: {},
	/**
	* @property {Object} globalTypes Global combo types. Define as
	*  DA.combo.globalTypes = {
	*     ResourceType: 1,
	*     ResourcePaymentType: 2
	*  };
	*/
	globalTypes: {},
	/**
	* Returns the default value for the combo. If there is only 1 record, that's default otherwise we check for IsDefault for each record
	* @type String
	*/
	comboConfigs: {},
	getDefaultValue: function (combo) {
		var defaultValue = null;
		var store = combo.store;
		var items = store.getCount();
		switch (items) {
			case 0:
				break;
			case 1:
				defaultValue = store.getAt(0).get(combo.valueField);
				break;
			default:
				for (var j = 0; j < items; j++) {
					var record = store.getAt(j);
					if (record.data.IsDefault === true) {
						defaultValue = record.get(combo.valueField);
						break;
					}
				}
				break;
		}
		return defaultValue;
	},
	/**
	* Sets the default value for the combo if available
	*/
	setDefaultValue: function (combo) {
		var defaultValue = this.getDefaultValue(combo);
		if (defaultValue !== undefined && defaultValue !== null) {
			combo.setValue(defaultValue);
		}
	},
	/**
	* Sets the default values for each combo in the fields collection. This can be an array or dictionary
	*/
	setDefaults: function (fields) {
		if (fields === null || typeof (fields) === 'undefined') {
			return;
		}
		if (typeof (fields) == 'object') {
			var oFields = fields;
			fields = [];
			for (var o in oFields) {
				fields.push(oFields[o]);
			}
		}
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			if (Ext.isArray(field)) {
				this.setDefaults(field);
			} else {
				if (field.store && field.mode == 'local') {
					var value = field.getValue();
					if (value === null || value == 0) {
						this.setDefaultValue(field);
					}
				}
			}
		}
	},
	/**
	* Sets the default values for each combo
	* @param Object options options are:
	*    <ul class="mdetail-params">
	*      <li><b>module</b> : DA.Form</li>
	*    </ul>
	*/
	setDefaultValues: function (options) {
		var module = options.module;
		var container = module.formPanel;
		var combos = container.findByType('combo');
		DA.combo.setDefaults(combos);
		DA.combo.setDefaults(module.addlFormFields);
		return;
	},

	beforeSelect: function (combo, record, index) {
		if (index < 0) {
			return;
		}
		if (record.get('IsDeleted') === 1) {
			Ext.Msg.alert('Alert', 'The value selected has been deleted/inactive, cannot be selected from here');
			record.set('DisplayValue', '');
			return false;
		}
		if (!combo.disabledValues) {
			return true;
		}
		var allowed = combo.disabledValues.indexOf(record.get(combo.valueField)) == -1;

		if (!allowed) {
			Ext.Msg.alert('Alert', 'This option is not allowed to be selected from here');
			if (!combo.useOldValue) {
				combo.clearValue();
			}
			else { //#3494 for setting old combo values
				var comboLastText = combo.lastSelectionText;
				combo.setValue(combo.startValue);
				combo.setRawValue(comboLastText);
			}
		}
		return allowed;
	},


	/**
	* Create a new combo. If it is in global list, return the reference to it
	* @param Object config options are same as the one you would pass to ExtHelper.CreateCombo.
	* @type Ext.form.Combo
	*/
	create: function (config) {
		var comboType;
		if (!config.store && config.baseParams && config.baseParams.comboType) {
			comboType = config.baseParams.comboType;
			var store = this.getStore(comboType);
			if (store !== undefined) {
				config.store = store;
			}
		}
		if (config.store && config.store.baseParams && config.store.baseParams.comboType) {
			comboType = config.store.baseParams.comboType;
			Ext.applyIf(config, {
				mode: 'local'
			});
		}

		if (config.useTemplate) {
			comboType = config.baseParams.comboType;
		}

		if (!comboType && config.comboType) {
			comboType = config.comboType;
			delete config.comboType;
		}

		var defaultOptions = this.comboConfigs[comboType];
		if (typeof defaultOptions == 'object') {
			Ext.applyIf(config, defaultOptions);
		}

		var combo;
		if (config.createModule) {
			if (!config.store) {
				config.store = this.getStore(comboType, true);
			}
			combo = new Ext.ux.AddableCombo(config);
		} else {
			combo = ExtHelper.CreateCombo(config);
		}

		if (combo.disabledValues != 'undefined') {
			combo.on('beforeselect', this.beforeSelect);
		}

		if (combo.quickAdd) {
			combo.on('specialkey', this.onComboSpecialKey);
		}

		if (comboType) {
			var modules = this.modules;
			if (modules) {
				var moduleInfo = modules[comboType];
				if (typeof moduleInfo == 'object') {
					var moduleName = moduleInfo.module;
					var module = eval(moduleName);
					if (typeof module == 'object') {
						if (!moduleInfo.combos) {
							moduleInfo.combos = [];
							module.on('dataUpdated', this.onComboSourceUpdated, { comboType: comboType, moduleInfo: moduleInfo });
						}
						moduleInfo.combos.push(combo);
					}
				}
			}
		}

		return combo;
	},

	onComboSpecialKey: function (combo, e) {
		if (combo.disabled || combo.readOnly) {
			return;
		}
		if (e.altKey && e.getKey() === e.ENTER) {
			combo.quickAdd.source = combo.scope;
			combo.quickAdd.show(combo);
			e.stopEvent();
		}
	},

	onComboRequestCallback: function (options, success, response) {
		if (success) {
			var jsonResponse = Ext.decode(response.responseText);
			if (!jsonResponse.records) {
				Ext.Msg.alert('Error', jsonResponse.info);
				return;
			}
			var combos = this.moduleInfo.combos;
			Ext.each(combos, function (combo) {
				combo.store.loadData(jsonResponse.records);
			});
		} else {
			Ext.Msg.alert('Combo refresh failed', 'Could not load combo data');
		}

	},

	onComboSourceUpdated: function () {
		var comboType = this.comboType;
		// Basic request
		Ext.Ajax.request({
			url: EH.BuildUrl('Combo'),
			params: { comboType: comboType },
			callback: DA.combo.onComboRequestCallback,
			scope: this
		});
	},

	/**
	* Gets the store from global list
	* @param string comboType
	* @param bool autoCreate If store is not found in global list, create a new one?
	* @type Ext.data.JsonStore
	*/
	getStore: function (comboType, autoCreate) {
		// If this is defined as a global/ cacheable combo
		if (this.globalTypes[comboType]) {
			var stores = this.stores;
			if (!stores[comboType]) {
				stores[comboType] = new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', baseParams: { comboType: comboType } });
				stores[comboType].isGlobalStore = true;
			}

			// Apply global combo store
			return stores[comboType];
		}
		if (autoCreate === true) {
			return new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', baseParams: { comboType: comboType } });
		}
	}
};

/**
* Permissions
* @Constructor
*/
DA.Permissions = {
	/**
	* @property {string} Module
	*/
	Module: "Module",
	/**
	* @property {string} Add
	*/
	Add: "Add",
	/**
	* @property {string} Edit
	*/
	Edit: "Edit",
	/**
	* @property {string} Delete
	*/
	Delete: "Delete",
	/**
	* @property {string} Export
	*/
	Export: "Export"
};

Ext.ns("DA.Security");

/**
* Whether user is in particular role
* @param {String} roleName
* @type {Boolean}
*/
DA.Security.IsInRole = function (roleName) {
	return DA.Security.info.Roles[roleName] === true;
};

/**
* Whether user has permission on a particular module
* @param {String} moduleName
* @param {DA.Permissions} permission Optional. Defaults to DA.Permissions.Module
* @type {Boolean}
*/
DA.Security.HasPermission = function (moduleName, permission) {
	var hasPermission = false;
	var module = DA.Security.info.Modules[moduleName];
	if (permission === null || permission === undefined) {
		permission = DA.Permissions.Module;
	}
	if (DA.Security.info.Modules[moduleName]) {
		hasPermission = module[permission];
	}
	return hasPermission;
};

DA.Security.IsSuperAdmin = function () {
	return DA.Security.info.IsSuperAdmin;
};

DA.Security.IsAdmin = function () {
	return DA.Security.info.IsAdmin;
};

DA.cancelInlineEditableGrid = function (options) {
	if (!options.grid.multiGrouping) {
		var grid = options.grid;
		var store, i, len;
		if (grid) {
			store = grid.store;
		} else {
			store = options.store;
		}
		var keyColumn = options.keyColumn;
		store.rejectChanges();
		var newRecords = [];

		for (i = 0, len = store.getCount() ; i < len; i++) {
			var record = store.getAt(i);
			if (record.data[keyColumn] === 0) {
				newRecords.push(record);
			}
		}

		for (i = 0, len = newRecords.length; i < len; i++) {
			store.remove(newRecords[i]);
		}


		newRecords = null;

		store.rejectChanges();
	}
	//store.load();
};

DA.plugins.GridState = function (cfg) {
	Ext.apply(this, cfg);
};

DA.plugins.GridState.prototype = {
	savePageSize: false,

	applyCustomState: function (grid, state) {
		var module = this.module, store = grid.getStore(), filter, quickSearch, filterModel;

		if (this.savePageSize && state.pageSize) {
			var bbar = grid.getBottomToolbar();
			if (bbar instanceof Ext.PagingToolbar) {
				bbar.pageSize = state.pageSize;
				// Sync combo size with Preference, if page size is 50 and in preference its 20, records were loaded 20, but in page size combo it was showing 50 only
				bbar.items.each(function (item) {
					if (item && item.displayField === 'pageSize') {
						item.setValue(bbar.pageSize);
					}
				});
			}
		}

		// For compatibility with old preferences
		if (state.headerFilters) {
			state.filters = state.headerFilters;
			delete state.headerFilters;
		}

		if (state.grid) {
			Ext.apply(state, state.grid);
			delete state.grid;
		}

		// Validate header filter
		if (state.filters) {
			for (var fieldName in state.filters) {
				if (!store.fields.containsKey(fieldName)) {
					Ext.Msg.alert(module.preferenceText.plural, "Filter could not be applied for field:" + fieldName);
					delete state.filters[fieldName];
				}
			}
		}

		// This code is commented due to apply sort in load pref
		if (state.sort && !state.sort.field && state.sort.direction) {
			//delete state.sort;
		}

		quickSearch = module.quickSearch;
		if (quickSearch) {
			// TODO: Fix quickSearch before rendering
			if (state.quickSearch) {
				quickSearch.checked = state.quickSearch.fields;
				if (quickSearch.field) {
					quickSearch.field.setValue(state.quickSearch.query);
				}
			} else {
				if (quickSearch.field) {
					quickSearch.field.setValue('');
				}
			}
			if (quickSearch.field) {
				quickSearch.onTriggerSearch(false);
			}
		}

		filterModel = grid.prefManager ? grid.prefManager.filterModel : null;
		if (filterModel) {
			filter = state.filter || null;
			if (filter && !filter.fieldId && !filter.left) {
				filter = null;
			} else {
				// Validate cherry filter
				var isValidFilter = module.isCherryFilterValid(store.fields, filter);
				if (!isValidFilter) {
					filter = null;
					Ext.Msg.alert(module.preferenceText.plural, "Some filters could not be applied due to application version change");
				}
			}
			filterModel.setFilterObj(filter);

			module.filterTable.call(this, { saveState: false, load: false });
		}

		if (state.customFields) {
			this.module.applyCustomFieldValues(grid.custom.customFields, state, state.customFields, grid);
		}
	},

	saveCustomState: function (grid, state) {
		if (typeof grid.prefManager === 'object') {
			var filter = grid.prefManager.filterModel.getFilterObj();
			if (filter) {
				state.filter = filter;
			}
		}
		var quickSearch = this.module.quickSearch;
		if (quickSearch) {
			var store = grid.getStore();
			if (store.lastOptions && store.lastOptions.params) {
				var params = store.lastOptions.params,
					paramNames = quickSearch.paramNames,
					query = params[paramNames.query];
				if (query) {
					state.quickSearch = { fields: params[paramNames.fields], query: query };
				}
			}
		}
		if (this.savePageSize) {
			var bbar = grid.getBottomToolbar();
			if (bbar instanceof Ext.PagingToolbar) {
				state.pageSize = bbar.pageSize;
			}
		}

		if (grid.custom && grid.custom.customFields) {
			var customFields = grid.custom.customFields;
			if (customFields) {
				if (!state.customFields) {
					state.customFields = {};
					for (var i = 0; i < customFields.length - 1; i++) {
						state.customFields[customFields[i].hiddenName || customFields[i].name] = customFields[i].getValue();
					}
				}
			}
		}

		this.updateModifiedFilterTitle(grid);
	},

	updateModifiedFilterTitle: function (grid) {
		var title = grid.title;
		if (title && title.length > 10 && title.substr(title.length - 8) !== "modified" && title.substr(title.length - 5) == ")</i>") {
			title += " - modified";
			grid.setTitle(title);
		}
	},

	init: function (grid) {
		this.grid = grid;
		grid.initialState = grid.getState();
		if (grid.stateful && grid.prefManager && Ext.state.Manager) {
			var id = grid.getStateId();
			if (id) {
				var state = Ext.state.Manager.get(id);
				if (state) {
					grid.setTitle(grid.initialConfig.title + " <i>Last View</i>");
				}
			}
		}
		grid.on({
			"beforestaterestore": this.applyCustomState,
			"beforestatesave": this.saveCustomState,
			scope: this
		});
		if (this.savePageSize) {
			var bbar = grid.getBottomToolbar();
			if (bbar instanceof Ext.PagingToolbar) {
				var plugins = bbar.plugins;
				if (plugins) {
					for (var i = 0, len = plugins.length; i < len; i++) {
						if (plugins[i] instanceof Ext.ux.Andrie.pPageSize) {
							plugins[i].on('beforePageSizeChange', function (sender, args) {
								this.saveState();
							}, grid);
							break;
						}
					}
				}
			}
		}
	}
};

DA.QuickAdd = Ext.extend(Ext.util.Observable, {
	valueField: 'Id',

	constructor: function (cfg) {
		Ext.apply(this, cfg);
		DA.QuickAdd.superclass.constructor.call(this);
	},
	canShow: function () {
		return true;
	},
	cancelGridEdit: function () {
		if (this.source && this.source.grid) {
			this.source.grid.stopEditing();
		}
	},
	show: function (combo) {
		this.combo = combo;
		if (!this.canShow()) {
			return;
		}
		if (!this.win) {
			this.createWindow();
		}
		var basicForm = this.formPanel.getForm();
		basicForm.reset();

		//Attaching the event
		this.cancelGridEdit.defer(40, this);
		this.win.show();

		var displayField = typeof this.displayField === 'function' ? this.displayField() : this.displayField;
		if (displayField) {
			var displayFormField = basicForm.findField(displayField);
			if (displayFormField) {
				displayFormField.setValue(combo.getRawValue());
			}
		}

		var defaultField = this.defaultField;
		if (!defaultField) {
			this.formPanel.cascade(function (o) {
				if (!defaultField && !o.disabled && o.isFormField) {
					defaultField = o;
					return false;
				}
			});
		}
		if (defaultField) {
			if (!ExtHelper.isMobile.any()) {
				defaultField.focus(true, 50);
			}
		}
		this.onFormShow(combo);
	},
	onFormShow: function (combo) {
	},
	createWindow: function () {
		var formCfg = typeof this.formCfg === 'function' ? this.formCfg() : this.formCfg;
		Ext.applyIf(formCfg, {
			bodyStyle: 'padding: 4px',
			xtype: 'form',
			baseParams: { action: 'Save' },
			url: EH.BuildUrl(this.controller),
			plugins: []
		});

		formCfg.plugins.push(ExtHelper.Plugins.ExceptionHandler);

		this.formPanel = new Ext.FormPanel(formCfg);

		var winCfg = this.winCfg || {};
		Ext.applyIf(winCfg, {
			title: this.title,
			width: 500,
			height: 250,
			layout: 'fit',
			plain: true,
			modal: true,
			closeAction: 'hide',
			resizable: false,
			items: [this.formPanel],
			buttons: [
				{ text: '<u>S</u>ave', handler: this.onSave, scope: this },
				{ text: '<u>C</u>ancel', handler: this.onCancel, scope: this }
			]
		});
		this.win = new Ext.Window(winCfg);
	},

	onCancel: function () {
		this.combo = null;
		this.win.hide();
	},

	createParams: Ext.emptyFn,

	onSave: function () {
		var formPanel = this.formPanel;
		if (formPanel.form.isValid()) {
			var comboType = this.combo.store.baseParams.comboType;
			formPanel.form.submit({
				waitMsg: 'Please wait...',
				params: this.createParams(this.combo, comboType),
				failure: this.onSaveFailure,
				success: this.onSaveSuccess,
				scope: this
			});
		}
		else {
			Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
		}
	},

	onSaveFailure: function (form, action) {
		Ext.MessageBox.alert('Error', (action.result && action.result.info) ? action.result.info : 'Save failed');
	},
	onComboUpdateFinish: Ext.emptyFn,
	getCombo: Ext.emptyFn,
	setLocationCombo: Ext.emptyFn,
	updateFocus: function () {
		var comboFormPanel = this.combo.findParentByType('form').getForm();
		var indexOfField = comboFormPanel.items.indexOf(this.combo);
		var nextField;
		while (1 === 1) {
			nextField = comboFormPanel.items.items[++indexOfField];
			if (!nextField || (nextField.isFormField && nextField.inputType !== 'hidden' && !nextField.disabled && !nextField.hidden)) {
				break;
			}
		}
		this.combo.collapse();
		if (nextField) {
			nextField.focus();
		}
		this.combo = null;
	},
	onSelectValue: function (combo, action) {
		this.onComboUpdateFinish(combo, action);
		this.updateFocus();
	},
	onSaveSuccess: function (form, action) {//Changes for #4322
		var result = action.result;
		var cmb = this.getCombo(this.combo);
		if (!cmb) {
			cmb = this.combo;
			this.setLocationCombo(cmb, result.data, result.data[this.valueField]);
		}
		else {
			this.combo = cmb; //Re-assigning back
			ExtHelper.SetComboValue(cmb, result.data[this.valueField], this.onSelectValue, this);
		}
		this.win.hide();
	}
});

