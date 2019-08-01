// JScript File
Ext.ns("DA");

Ext.onReady(function () {
	var conn = new Ext.data.Connection();

	var applyQueryString = function () {
		if (DA.App) {
			var requestedModule = ExtHelper.GetParamValue("type");
			if (requestedModule) {
				requestedModule = requestedModule.substr(0, 1).toUpperCase() + requestedModule.substr(1);
				requestedModule = DA.App[requestedModule];
				if (requestedModule) {
					var id = ExtHelper.GetParamValue("id");
					if (id && !isNaN(id) && requestedModule.ShowForm) {
						id = parseInt(id);
						requestedModule.ShowForm(id);
					}
					var filter = ExtHelper.GetParamValue("filter");
					if (filter && requestedModule.ShowList) {
						requestedModule.ShowList(undefined, { filter: filter });
					}
				}
			}
		}
	}

	if (DA.Security.info) {
		applyQueryString();
	} else {
		var loadingWindow = Ext.Msg.wait('Please wait.', "Loading");
		var config = {
			url: EH.BuildUrl("SecurityInfo")
		};
		config.callback = function (options, success, response) {
			loadingWindow.hide();
			if (!success) {
				Ext.Msg.alert('Error', response.statusText);
			} else {
				var jsonResponse = Ext.decode(response.responseText);
				DA.Security.info = jsonResponse;
				applyQueryString();
			}
		};
		conn.request(config);
	}

	if (DA.Config.sessionRenewDelay) {
		var delay = DA.Config.sessionRenewDelay * 60 * 1000; // milliseconds
		DA.sessionRenewTask = {
			run: EH.GenericConnection.request,
			interval: delay,
			args: [{ url: EH.BuildUrl("LoginController") }],
			scope: EH.GenericConnection
		};
		Ext.TaskMgr.start(DA.sessionRenewTask);
	}
});

Ext.apply(Ext.ux.SessionTimeout, {
	onLogout: function () {
		if (DA.sessionRenewTask) {
			Ext.TaskMgr.stop(DA.sessionRenewTask);
		}
		DCPLApp.warningMsg = false;
		if (this.loginUrl) {
			window.location.href = this.loginUrl;
		} else {
			Ext.Msg.alert('Info', 'Due to inactivity, your session has timed out.', this.reloadCurrentPage);
		}
	}
});

DA.loadSecurityInfo = function () {
	ExtHelper.GenericConnection.request({
		url: 'Controllers/SecurityInfoRequest.ashx',
		params: {},
		callback: function (o, success, response) {
			if (!success) {
				Ext.Msg.alert('Error', 'An error occured');
			}
			else {
				var jsonResponse = Ext.decode(response.responseText);
				DA.Security.info = jsonResponse;
			}
		},
		scope: this
	});
}

//---------------------
// Util
//---------------------

Ext.ns("DA.Grid");
if (1 == 2) {
	/**
	* Test
	* @constructor
	*/
	DA = function () {

	};

	/**
	* Test
	* @constructor
	*/
	DA.Help = function () {

	};

	/**
	* Test
	* @constructor
	*/
	DA.modLog = function () {

	};

	/**
	* Test
	* @constructor
	*/
	DA.Grid = function () {

	};
}

/**
* Disables a editable grid
* @param Object options
*/
DA.Grid.DisableHandler = function (options) {
	var grid = options.grid;
	var module = options.module;
	grid.on('beforeedit', function (e) {
		e.cancel = module.formPanel.disabled;
	});
};

/**
* Disables a editable grid
* @param Object options
* @constructor
*/
DA.Grid.ContextMenu = function (options) {
	Ext.apply(this, options);
	this.init();
};

DA.Grid.ContextMenu.prototype = {
	/*
	* @cfg {Object} scope Should contain the grid to which context menu needs to be attached. Example: {scope: {grid: myGrid}}
	*/

	/**
	* @private
	*/
	init: function () {
		var items = this.items;
		if (!items) {
			items = [];
		}

		if (!this.grid) {
			this.grid = this.scope.grid;
		}
		else {

			if (ExtHelper.isMobile.any()) {
				if (this.grid.baseParams && this.grid.baseParams.isMoveButton) {
					var temptbar = this.grid.topToolbar;
					var itemtotal = [];
					var temptbarLength = temptbar.length;
					for (var i = 0; i < temptbarLength; i++) {
						if (temptbar[i].tooltip == "Help") {
							itemtotal.push(temptbar[i - 1]);
							itemtotal.push(temptbar[i]);
							temptbar.pop(i - 1)
							temptbar.pop(i)
							break;
						}
					}
					temptbar.push({ text: 'Move Up Group', iconCls: 'moveupgroup', tag: 'upgroup', handler: this.onItemClick, scope: this });
					temptbar.push({ text: 'Move Down Group', iconCls: 'movedowngroup', tag: 'downgroup', handler: this.onItemClick, scope: this });
					temptbar.push({ text: 'Cancel', iconCls: 'cancel', tag: 'cancel', handler: this.onItemClick, scope: this });
					temptbar.push(itemtotal[0]);
					temptbar.push(itemtotal[1]);
				}
			}
		}

		if (this.insert !== false) {

			items.push({ text: 'Insert', tag: 'insert' });
			items.push({ text: 'Add', tag: 'add' });
			items.push('-');
		}
		if (this.remove != false) {
			items.push({ text: 'Delete', cls: 'grid-row-delete', tag: 'delete' });
		}
		if (this.groupField) {
			items.push({ text: 'Move Up Group', iconCls: 'moveupgroup', tag: 'upgroup' });
			items.push({ text: 'Move Down Group', iconCls: 'movedowngroup', tag: 'downgroup' });
		} else {
			items.push({ text: 'Move Up', cls: 'grid-row-move-up', tag: 'up' });
			items.push({ text: 'Move Down', cls: 'grid-row-move-down', tag: 'down' });
			if (this.moveBottomAndTop !== false) {
				items.push({ text: 'Move to Top', cls: 'grid-row-move-top', tag: 'top' });
				items.push({ text: 'Move to Bottom', cls: 'grid-row-move-bottom', tag: 'bottom' });
			}
		}
		items.push('-');
		items.push({ text: 'Cancel', iconCls: 'cancel', tag: 'cancel' });

		var menu = new Ext.menu.Menu({ items: items });

		menu.on('itemclick', this.onItemClick, this);

		this.menu = menu;

		this.grid.on('cellcontextmenu', this.onShow, this);
		if (this.autoReorder) {
			var store = this.grid.getStore();
			store.on({
				'remove': { fn: this.reorder, scope: this, delay: 20 },
				scope: this
			})
		}
	},

	/**
	* @private
	*/
	findItem: function (tag) {
		return this.menu.items.find(function (item) {
			return item.tag == tag;
		});
	},

	/**
	* @private
	*/
	onShow: function (grid, rowIndex, cellIndex, e) {
		if (grid.isDisabled) {
			return;
		}
		if (this.column && this.columnValue) {
			var record = grid.getStore().getAt(rowIndex);
			if (record.get(this.column) == this.columnValue) {
				return;
			}
		}
		if (grid.disableContextMenu == true) {
			return;
		}
		e.preventDefault();

		var sm = grid.getSelectionModel();
		if (sm.select) {
			sm.select(rowIndex, cellIndex);
		}
		else {
			sm.selectRow(rowIndex);
		}

		this.rowIndex = rowIndex;
		var contextMenu = this;
		contextMenu.rowIndex = rowIndex;
		var record = grid.getStore().getAt(rowIndex);
		var recordCount = grid.getStore().getCount();
		var canMoveDown = rowIndex < recordCount - 1;
		var canMoveUp = rowIndex > 0;

		var deleteItem = this.findItem("delete");
		if (deleteItem) {
			deleteItem.setDisabled(recordCount < 1);
		}
		if (!this.groupField) {
			this.findItem("down").setDisabled(!canMoveDown);
			if (this.findItem("bottom")) {
				this.findItem("bottom").setDisabled(!canMoveDown);
			}
			this.findItem("up").setDisabled(!canMoveUp);
			if (this.findItem("top")) {
				this.findItem("top").setDisabled(!canMoveUp);
			}
		}

		this.menu.show(e.getTarget(), 'tr-br?');
	},

	/**
	* @private
	*/
	getNewRecord: function () {
		return this.scope.newGridRecord.call(this.scope);
	},
	beforePerformAction: function (action) {
		return true;
	},
	/**
	* @private
	*/
	performAction: function (action) {
		if (action == "cancel") {
			this.menu.hide();
			return;
		}

		if (this.beforePerformAction(action, this) === false) {
			return;
		};

		var grid = this.grid;
		var cm = grid.getColumnModel();
		var store = grid.getStore();
		var oldRecord;
		var newRecord;

		var rowIndex = this.rowIndex;
		oldRecord = store.getAt(rowIndex);
		newRecord = oldRecord;

		var moveTo = -1;
		switch (action) {
			case "up":
				moveTo = rowIndex - 1;
				break;
			case "top":
				moveTo = 0;
				break;
			case "down":
				moveTo = rowIndex + 1;
				break;
			case "bottom":
				moveTo = store.getCount() - 1;
				break;
			case "delete":
				store.remove(oldRecord);
				break;
			case "add":
				oldRecord = null;
				newRecord = this.getNewRecord();
				moveTo = store.getCount();
				break;
			case "insert":
				oldRecord = null;
				newRecord = this.getNewRecord();
				moveTo = rowIndex;
				break;
		}

		var startEditing = false;
		if (moveTo != -1) {
			if (oldRecord) {
				store.remove(oldRecord);
			}
			if (newRecord) {
				store.insert(moveTo, [newRecord]);
				startEditing = true;
			}
		}

		this.reorder();

		if (startEditing && this.startEditing !== false && typeof (grid.startEditing) == 'function') {
			var cm = grid.getColumnModel();
			var cols = cm.getColumnCount();
			for (var i = 0; i < cols; i++) {
				if (cm.getCellEditor(i, moveTo)) {
					grid.startEditing(moveTo, i);
					break;
				}
			}
		} else {
			var sm = grid.getSelectionModel();
			if (typeof sm.selectRange == 'function') {
				sm.selectRange(moveTo, moveTo, false);
			}
		}

		delete oldRecord;
		delete newRecord;
	},

	reorder: function () {
		var grid = this.grid;
		var store = grid.getStore();
		var orderField = this.orderField;
		if (!orderField && this.grid.gridContextMenu) {
			orderField = this.grid.gridContextMenu.orderField;
		}
		var first = null;
		var firstIndex;
		if (orderField) {
			//Removing phantom line, this is because, it becomes dirty and validation of empty / blank fails on child grids on forms
			var itemsToRemove = [];
			for (var i = 0, len = store.getCount() ; i < len; i++) {
				var record = store.getAt(i);
				if (record.phantom && !record.dirty) {
					itemsToRemove.push(i);
				}
			}
			if (itemsToRemove.length > 0) {
				store.removeAt(itemsToRemove[0]);
			}

			//store.suspendEvents();
			for (var i = 0, len = store.getCount() ; i < len; i++) {
				var record = store.getAt(i);
				var sortOrder = i;//Sort Order Start from 0.
				if (!first) {
					first = record;
					firstIndex = sortOrder;
				} else {
					record.set(orderField, sortOrder);
				}
			}
			//store.resumeEvents();
			if (first) {
				first.set(orderField, firstIndex);
			}
		}
	},

	/**
	* @param {Object} item Item's tag is used to identify action to be performed. This method can be used publicly as well
	*/
	getLastIndex: function (store, groupColumnValue) {
		var icount;
		for (var i = 0, len = store.getCount() ; i < len; i++) {
			var record = store.getAt(i);
			if (record.get(this.groupField) == groupColumnValue) {
				//	rows.push({ rowIndex: i });
				icount = i;
			}
		}
		return icount;
	},

	removeSelectedRecord: function (store, selectedRecords) {
		for (var i = 0, len = selectedRecords.length; i < len; i++) {
			store.remove(selectedRecords[i]);
		}
	},

	onItemClick: function (item) {
		switch (item.tag) {
			case 'downgroup':
			case 'upgroup':
				var grid = this.grid;
				if (grid) {
					var store = grid.getStore();
					var rows = [];


					if (!this.rowIndex) {
						this.rowIndex = 0;
					}
					var groupColumnValue = store.getAt(grid.selModel.last).get(this.groupField);
					var firstIndex = store.find('OrderNumber', groupColumnValue);
					var lastIndex = this.getLastIndex(store, groupColumnValue);
					//Push & counting current Selected Group items


					var selectedRecords = store.getRange(firstIndex, lastIndex);

					if (item.tag == 'upgroup') {
						var previousRecordIndex = firstIndex - 1;
						var previousRecord;
						if (previousRecordIndex > -1) {
							previousRecord = store.getAt(previousRecordIndex);
						} else {
							Ext.Msg.alert('Error', 'Cannot move this group up');
							return;
						}
						if (previousRecord) {
							var indexToInsert = store.find('OrderNumber', previousRecord.get('OrderNumber'));

							this.removeSelectedRecord(store, selectedRecords);
							for (var i = selectedRecords.length - 1; i > -1; i--) {
								store.insert(indexToInsert, selectedRecords[i]);
								indexToInsert = store.find('OrderNumber', selectedRecords[i].get('OrderNumber'));
							}
						}
					}

					if (item.tag == 'downgroup') {
						var nextRecordIndex = lastIndex + 1;
						var nextRecord;
						if (nextRecordIndex < store.getCount()) {
							nextRecord = store.getAt(nextRecordIndex);
						} else {
							Ext.Msg.alert('Error', 'Cannot move this group down');
							return;
						}
						if (nextRecord) {
							var nextRecordFirstIndex = store.find('OrderNumber', nextRecord.get('OrderNumber'));
							var nextRecordLastIndex = this.getLastIndex(store, nextRecord.get('OrderNumber'));
							var nextSelectedRecords = store.getRange(nextRecordFirstIndex, nextRecordLastIndex);
							this.removeSelectedRecord(store, nextSelectedRecords);

							for (var i = nextSelectedRecords.length - 1; i > -1; i--) {
								store.insert(firstIndex, nextSelectedRecords[i]);
								nextRecordFirstIndex = store.find('OrderNumber', nextSelectedRecords[i].get('OrderNumber'));
							}
						}
					}
					this.reorder();

					break;
				}
				else {
					Ext.Msg.alert('Alert', 'Please select Task to Perform this Action');
				}
			default:
				//TODO: FIX FOR MOBILE, to automatically focus on first row
				this.performAction(item.tag);
				break;
		}

	}
};


Ext.ns("DA.Util");


/**
* Maps data to fields
* @param {Object} options Object containing options:
*    <ul class="mdetail-params">
*      <li><b>module</b> : DA.Form<div class="sub-desc">DA.Form module</div></li>
*      <li><b>items</b> : {Object}<div class="sub-desc">List of values to be mapped</div></li>
*      <li><b>data</b> : {Object}<div class="sub-desc">Data to be mapped</div></li>
*    </ul>
* data: data to be mapped
*/
DA.Util.SetValues = function (options) {
	var addlFields = options.module.addlFormFields;
	var formFields = options.module.fields;
	var form = options.module.formPanel;
	var data = options.data;

	var process = function (items) {
		if (items) {
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (Ext.isArray(item)) {
					process(item);
				} else {
					var field = item.field;
					var mapTo = item["map"] || value;
					if (field) {
						if (typeof (field) == 'string') {
							field = formFields[field];
						}
						if (field) {
							EH.SetFieldValue({ field: field, value: data[mapTo] });
						}
					} else {
						var property = item["property"] || 'name';
						var value = item["value"]; //To find the control by Name
						var id = item["id"]; //To find the control by Id
						if (value) {
							var fields = form.find(property, value);
							for (var j = 0; j < fields.length; j++) {
								EH.SetFieldValue({ field: fields[j], value: data[mapTo] });
							};
							if (addlFields && addlFields[value]) {
								EH.SetFieldValue({ field: addlFields[value], value: data[mapTo] });
							}
						}
						else if (id) {
							EH.SetFieldValue({ field: Ext.getCmp(id), value: data[mapTo] });
						}
					}
				}
			}
		}
	};

	process(options.items);
};

/**
* Combo Lazy Loader
* @param {Object|combo} value
*/
DA.Util.ComboLazyLoader = function (value) {
	var options;
	var params = {};

	// Check if this is an object
	// If we passed in combo
	if (typeof (value.getValue) == 'function') {
		options = this;
		params.id = value.getValue();
		Ext.applyIf(options, {
			id: params.id
		});
	} else {
		options = value;
		if (value.params) {
			params = value.params;
		}
		params.id = options.id;
	}

	params.action = options.action; //remove, delete, add
	var customEvent = options.customEvent;

	var callParams = {
		module: options.module,
		items: options.items
	}

	if (!params.id) {
		callParams.data = {};
		DA.Util.SetValues(callParams);
	} else {
		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl(options.controller || options.module.controller),
			params: params,
			callback: function (o, success, response) {
				if (!success) {
					canContinue = false;
					Ext.Msg.alert('An error occured', 'An error occured');
				}
				else {
					Ext.apply(callParams, Ext.util.JSON.decode(response.responseText));
					DA.Util.SetValues(callParams);
					if (typeof (customEvent) == 'function') {
						customEvent.call(this, options, callParams, params.id);
					}
				}
			},
			scope: this
		});
	}
};

/**
* Returns a safeNumber if value is not a number
*/
DA.Util.SafeNumber = function (value) {
	if (isNaN(value) || !isFinite(value)) {
		return 0;
	} else {
		return value;
	}
};

/**
* Sets the grid's column name. Shouldn't be used any more with grid option
*/
DA.Util.SetGridColumnValue = function (options) {
	//comboRecord, grid, mappings - Properties
	if (options.comboRecord && options.mappings) {
		var gridRecord = options.record;
		if (gridRecord) {
			var comboRecord = options.comboRecord;
			for (var i = 0; i < options.mappings.length; i++) {
				var item = options.mappings[i];
				gridRecord.set(item["gridColumnName"], comboRecord.get(item["comboColumnName"]));
			}
		}
	}
}


/**
* Finds a field
*/
DA.Util.FindField = function (config) {
	var form = config.form;
	if (!form) {
		form = config.module.formPanel;
	}
	var property = config.property || "name";
	var fields = form.find(property, config.value);
	if (fields.length > 0) {
		return fields[0];
	} else {
		return undefined;
	}
}

DA.ReusableForm = Ext.extend(DA.Form, {
	getId: function (suffix) {
		return Ext.id(null, this.controller + "-" + suffix);
	}
});

//-------------------------------
// Note
//-------------------------------

DA.Note = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Note: {0}',
		listTitle: 'Notes',
		keyColumn: 'NoteId',
		captionColumn: null,
		controller: 'Note',
		gridConfig: { defaults: { sort: { dir: 'DESC', sort: 'CreatedOn' } } },
		baseParams: { AssociationType: null, AssociationId: 0 },
		fields: {}
	});
	DA.Note.superclass.constructor.call(this, config);
};

Ext.extend(DA.Note, DA.ReusableForm, {

	listRecord: Ext.data.Record.create([
		{ name: 'NoteId', type: 'int' },
		{ name: 'Title', type: 'string' },
		{ name: 'NoteTypeId', type: 'int' },
		{ name: 'Notes', type: 'string' },
		{ name: 'NoteType', type: 'string' },
		{ name: 'CreatedBy', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer }
	]),

	cm: function () {
		var cm = new Ext.grid.ColumnModel([
			{ header: 'Subject', dataIndex: 'Title', width: 150, renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'Notes', dataIndex: 'Notes', renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'Note Type', dataIndex: 'NoteType', width: 100 },
			{ header: 'Created By', dataIndex: 'CreatedBy', width: 100 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 120, renderer: ExtHelper.renderer.DateTime }
		])

		return cm;
	}(),

	createForm: function (config) {

		config.defaults = config.defaults ? config.defaults : {};
		Ext.apply(config.defaults, {
			//width: 150
		});
		this.on('beforeLoad', this.onBeforeLoad, this);
		var noteTypeCombo = ExtHelper.CreateCombo({ fieldLabel: 'Note Type', hiddenName: 'NoteTypeId', xtype: 'combo', baseParams: { comboType: 'ResourceNoteType' }, allowBlank: false, width: 400 });
		this.fields.noteTypeCombo = noteTypeCombo;
		var notesTextArea = new Ext.form.TextArea({
			fieldLabel: 'Notes', name: 'Notes', xtype: 'textarea', height: 280, width: 400, rowspan: 4, scope: this
		});// plugins: [Ext.ux.FieldSpeecher] Hide for as Per #5884 

		config.items = [
            this.defaultField = noteTypeCombo,
            { fieldLabel: 'Subject', name: 'Title', xtype: 'textfield', allowBlank: false, width: 400 },
			notesTextArea
		]
		return config;


	},

	onBeforeLoad: function (grid) {
		var defaultNoteType = grid.defaultNoteType;
		if (defaultNoteType) {
			ExtHelper.SetComboValue(this.fields.noteTypeCombo, defaultNoteType);
		}
		this.fields.noteTypeCombo.setFieldVisible(isNaN(defaultNoteType));
	}
});

//----------------------------
// Attachment
//----------------------------

DA.Attachment = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Attachment: {0}',
		listTitle: 'Attachment',
		keyColumn: 'AttachmentId',
		captionColumn: null,
		controller: 'Attachment',
		baseParams: { AssociationType: null, AssociationId: 0 },
		allowExport: false,
		gridConfig: {
			listeners: {
				'cellclick': this.onListGridCellClick
			}
		},
		fields: {}
	});
	DA.Attachment.superclass.constructor.call(this, config);
};

Ext.extend(DA.Attachment, DA.ReusableForm, {

	listRecord: Ext.data.Record.create([
		{ name: 'AttachmentId', type: 'int' },
		{ name: 'Filename', type: 'string' },
		{ name: 'AttachmentType', type: 'string' },
		{ name: 'AttachmentTypeId', type: 'int' },
		{ name: 'CreatedBy', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'OriginalFileName', type: 'string' }
	]),

	downloadController: "DownloadAttachment",

	onListGridCellClick: function (grid, rowIndex, colIndex, e) {
		if (grid.getTopToolbar().disabled == true) {
			return;
		}
		var cm = grid.getColumnModel();
		var colId = cm.getColumnId(colIndex);
		var colInfo = cm.getColumnById(colId);
		var r = grid.getStore().getAt(rowIndex);
		if (colInfo.header == 'Download Attachment') {
			window.open(EH.BuildUrl(colInfo.controller) + "?Id=" + r.get('AttachmentId'));
		}
		if (colInfo.header === 'Delete') {
			Ext.Msg.confirm("Delete", "Are you sure you want to delete this record?", function (btn) {
				if (btn == 'yes') {
					var params = {
						action: 'onDelete',
						id: r.get('AttachmentId')
					};
					ExtHelper.GenericConnection.request({
						url: EH.BuildUrl('Attachment'),
						params: params,
						callback: function (o, success, response) {
							if (!success) {
								Ext.Msg.alert('Error', 'An error occured');
							} else {
								var store = grid.getStore();
								store.reload();
								Ext.Msg.alert('Success', 'File has been successfully deleted');
							}
						},
						scope: this
					});
				}
			}, this);
		}
	},

	iconRenderer: function (v, m, r) {
		m.css = "downLoadedAttachment";
		return "&nbsp;";
	},

	deleteRenderer: function (v, m, r) {
		m.css = "deleteAttachment";
		return "&nbsp;";
	},

	cm: function () {

		var configCM = [
			{ header: 'File', dataIndex: 'Filename', id: 'Filename', width: 150, renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'Type', dataIndex: 'AttachmentType', id: 'AttachmentType', width: 130 },
			{ header: 'Created By', dataIndex: 'CreatedBy', id: 'CreatedBy', width: 100 },
			{ header: 'Created On', dataIndex: 'CreatedOn', id: 'CreatedOn', width: 130, renderer: ExtHelper.renderer.DateTime }
		];

		if (this.showDownLoadIcon) {
			configCM.push({ header: 'Download Attachment', dataIndex: 'AttachmentId', id: 'DownloadAttachment', width: 80, renderer: this.iconRenderer, controller: this.downloadController });
		}
		if (this.showDeleteIcon) {
			configCM.push({ header: 'Delete', dataIndex: 'AttachmentId', id: 'Delete', width: 50, renderer: this.deleteRenderer });
		}
		if (this.showOriginalFileName) {
			configCM.push({ header: 'Original FileName', dataIndex: 'OriginalFileName', id: 'AttachmentType', width: 130 });
		}
		var cm = new Ext.grid.ColumnModel(configCM)

		return cm;
	},

	createForm: Ext.emptyFn,

	ShowForm: function (id) {
		var grid = this.grid;
		var defaultAttachmentType;
		var comboType;
		if (grid) {
			defaultAttachmentType = grid.defaultAttachmentType;
			comboType = grid.defaultAttachmentType;
		}

		if (this.defaultAttachmentType) {
			comboType = this.defaultAttachmentType;
			defaultAttachmentType = this.defaultAttachmentType;
		}

		if (!comboType) {
			comboType = 'AttachmentType';
		}


		if (id != 0) {
			window.open(EH.BuildUrl(this.downloadController) + "?Id=" + id);
		} else {
			if (!this.win) {
				//var hiddenField = Ext.form.Hidden({name: 'RecordId', value: ExtHelper.GetParamValue('id')});
				var attachmentTypeCombo = ExtHelper.CreateCombo({
					fieldLabel: 'Attachment type',
					name: 'AttachmentTypeId',
					hiddenName: 'AttachmentTypeId',
					width: 250,
					allowBlank: false,
					baseParams: { comboType: comboType, scopeId: 0 },
					controller: "Combo"
				});
				var uploadFile = new Ext.form.FileUploadField({
					fieldLabel: 'Select File',
					width: 250,
					name: 'selectFile',
					allowBlank: false
				});

				var setDefaultFocus = function () {
					uploadFile.focus(true, true);

				}
				var formPanel = new Ext.form.FormPanel({
					labelWidth: 125,
					bodyStyle: "padding:5px;",
					fileUpload: true,
					baseParams: { action: 'save' },
					url: EH.BuildUrl('Attachment'),
					items: [
                        attachmentTypeCombo,
                        uploadFile
					]
				});

				var baseParams = this.baseParams;

				var win = new Ext.Window({
					title: 'Attachment',
					closable: true,
					layout: 'fit',
					plain: true,
					width: 550,
					height: 150,
					modal: true,
					fileUpload: true,
					closeAction: 'hide',
					items: formPanel,
					buttons: [
                    {
                    	id: 'btnUpload',
                    	text: 'Upload',
                    	handler: function () {
                    		if (formPanel.form.isValid()) {
                    			if (grid && grid.allowedTypes && grid.allowedTypes.length > 0) {
                    				if (!DA.CheckFileExtension(uploadFile.getValue(), grid.allowedTypes)) {
                    					Ext.MessageBox.alert('Errors', 'Only files with extension(s) ' + grid.allowedTypes + ' are allowed to be uploaded');
                    					return;
                    				}
                    			}
                    			formPanel.form.submit({
                    				params: baseParams,
                    				waitMsg: 'Uploading...',
                    				failure: function (form, action) {
                    					Ext.MessageBox.alert('Error', action.result.info);
                    				},
                    				success: function (form, action) {
                    					win.hide();
                    					Ext.Msg.alert('File uploaded', 'File upload successfully');
                    				}
                    			});
                    		} else {
                    			Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
                    		}
                    	}
                    }
					]
				});

				this.formPanel = formPanel;
				this.win = win;

				if (DA.errorMessage) {
					Ext.Msg.alert('Error', DA.errorMessage, setDefaultFocus);
				}
				else {
					setDefaultFocus();
				}

				this.win.on('hide', function () {
					//refresh attachments grid
					this.grid.getStore().reload();
				}, this);

				this.fields.typeCombo = attachmentTypeCombo;
			}
			this.formPanel.form.reset();

			this.win.show();
			if (!isNaN(defaultAttachmentType)) {
				this.fields.typeCombo.setValue(defaultAttachmentType);
				this.fields.typeCombo.setFieldVisible(false);
			} else {
				this.fields.typeCombo.setFieldVisible(true);
			}
		}
	}
});

//---------------------------------------------
// Contact
//---------------------------------------------
DA.Contact = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Contact: {0}',
		listTitle: 'Contact',
		keyColumn: 'ContactId',
		captionColumn: null,
		gridIsLocal: true
	});
	DA.Contact.superclass.constructor.call(this, config);
};

Ext.extend(DA.Contact, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'FirstName', type: 'string' },
		{ name: 'LastName', type: 'string' },
		{ name: 'JobTitle', type: 'string' },
		{ name: 'HomePhone', type: 'string' },
		{ name: 'WorkPhone', type: 'string' },
		{ name: 'CellPhone', type: 'string' },
		{ name: 'IsPrimary', type: 'int' },
		{ name: 'PersonalEmailAddress', type: 'string' },
		{ name: 'CorporateEmailAddress', type: 'string' },
		{ name: 'Fax', type: 'string' }
	]),

	init: function () {
		this.cm = new Ext.grid.ColumnModel([
			{ header: 'First name', dataIndex: 'FirstName', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Last name', dataIndex: 'LastName', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Job title', dataIndex: 'JobTitle', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
			{ header: 'Home phone', dataIndex: 'HomePhone', width: 100, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Work phone', dataIndex: 'WorkPhone', width: 100, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Cell phone', dataIndex: 'CellPhone', width: 100, editor: new Ext.form.TextField({ maxLength: 15 }) },
			{ header: 'Personal email address', dataIndex: 'PersonalEmailAddress', width: 150, editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) },
			{ header: 'Corporate email address', dataIndex: 'CorporateEmailAddress', width: 150, editor: new Ext.form.TextField({ maxLength: 100, vtype: 'email' }) },
			{ header: 'Fax', dataIndex: 'Fax', width: 100, editor: new Ext.form.TextField({ maxLength: 15 }) }
		]);
	},

	createForm: function (config) {

	}
});

DA.Contact = new DA.Contact();
Ext.onReady(DA.Contact.init, DA.Contact);


//----------------------------------------------
// Address
//----------------------------------------------

Ext.ns("DA.Modules");

DA.Modules.Address = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Address: {0}',
		listTitle: 'Address',
		keyColumn: 'Id',
		captionColumn: null,
		gridIsLocal: true,
		newListRecordData: { AddressTypeId: 2 },
		comboStores: {}
	});

	DA.Modules.Address.superclass.constructor.call(this, config);

	Ext.applyIf(this.comboStores, this.cStores);

	if (!this.cm) {
		var addressTypeCombo = ExtHelper.CreateCombo({ store: this.comboStores.AddressType, mode: 'local', allowBlank: false });
		var countryCombo = ExtHelper.CreateCombo({ store: this.comboStores.Country, mode: 'local', allowBlank: false });

		this.cm = new Ext.grid.ColumnModel([
		    { header: 'Type', dataIndex: 'AddressTypeId', width: 100, renderer: ExtHelper.renderer.Combo(addressTypeCombo), editor: addressTypeCombo },
		    { header: 'Address', dataIndex: 'Address1', width: 130, editor: new Ext.form.TextField({ maxLength: 50 }) },
		    { header: '', dataIndex: 'Address2', width: 110, editor: new Ext.form.TextField({ maxLength: 50 }) },
		    { header: '', dataIndex: 'Address3', width: 110, editor: new Ext.form.TextField({ maxLength: 50 }) },
		    { header: 'City', dataIndex: 'City', width: 80, editor: new Ext.form.TextField({ maxLength: 20 }) },
		    { header: 'State', dataIndex: 'State', width: 60, editor: new Ext.form.TextField({ maxLength: 10 }) },
		    { header: 'Zip Code', dataIndex: 'PostalCode', editor: new Ext.form.TextField({ maxLength: 10 }), width: 80 },
		    { header: 'Country', dataIndex: 'CountryId', width: 80, renderer: ExtHelper.renderer.Combo(countryCombo), editor: countryCombo },
		    { header: 'Phone', dataIndex: 'Phone', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) },
		    { header: 'Fax', dataIndex: 'Fax', width: 100, editor: new Ext.form.TextField({ maxLength: 50 }) }
		])
	}
};

Ext.extend(DA.Modules.Address, DA.ReusableForm, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'AddressTypeId', type: 'int' },
		{ name: 'Address1', type: 'string' },
		{ name: 'Address2', type: 'string' },
		{ name: 'Address3', type: 'string' },
		{ name: 'City', type: 'string' },
		{ name: 'State', type: 'string' },
		{ name: 'PostalCode', type: 'string' },
		{ name: 'CountryId', type: 'int' },
		{ name: 'Phone', type: 'string' },
		{ name: 'Fax', type: 'string' }
	]),

	cStores: {
		AddressType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	createForm: function (config) {
		// place-holder for form configuration	
		// sample:
		// config.items = {
		//	{fieldLabel:'Relocate/ Travel',name:'WillingToRelocate', xtype:'checkbox'}
		// };
	}
});

DA.Address = new DA.Modules.Address();

//----------------------------------------------
//  ContactAddress
//----------------------------------------------

DA.ContactAddress = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'ContactAddress: {0}',
		listTitle: 'ContactAddress',
		keyColumn: 'Id',
		captionColumn: null,
		gridIsLocal: true,
		newListRecordData: { ContactAddressTypeId: '' }
	});
	DA.ContactAddress.superclass.constructor.call(this, config);
};

Ext.extend(DA.ContactAddress, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'ContactAddressTypeId', type: 'int' },
		{ name: 'Address', type: 'string' }
	]),

	comboStores: {
		ContactAddressType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	init: function () {
		var addressTypeCombo = ExtHelper.CreateCombo({ store: this.comboStores.ContactAddressType, mode: 'local', allowBlank: false });

		this.cm = new Ext.grid.ColumnModel([
		    { header: 'Type', dataIndex: 'ContactAddressTypeId', width: 100, renderer: ExtHelper.renderer.Combo(addressTypeCombo), editor: addressTypeCombo, maxLength: 50 },
		    { header: 'Address', dataIndex: 'Address', width: 200, editor: new Ext.form.TextField({ maxLength: 50 }) }
		])
	},

	createForm: function (config) {
		// place-holder for form configuration	
		// sample:
		// config.items = {
		//	{fieldLabel:'Relocate/ Travel',name:'WillingToRelocate', xtype:'checkbox'}
		// };
	}
});

DA.ContactAddress = new DA.ContactAddress();
Ext.onReady(DA.ContactAddress.init, DA.ContactAddress);

//----------------------------------------------
// Lookup
//----------------------------------------------

DA.LookupList = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Lookup: {0}',
		listTitle: 'Lookup',
		keyColumn: 'Id',
		captionColumn: null,
		gridIsLocal: true
	});
	DA.LookupList.superclass.constructor.call(this, config);
};

Ext.extend(DA.LookupList, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'DisplayValue', type: 'string' }
	]),

	init: function () {
		this.cm = new Ext.grid.ColumnModel([
		    { header: 'Display Value', dataIndex: 'DisplayValue', width: 130 }
		])
	},

	createForm: function (config) {
		// place-holder for form configuration	
		// sample:
		// config.items = {
		//	{fieldLabel:'Relocate/ Travel',name:'WillingToRelocate', xtype:'checkbox'}
		// };
	}
});

DA.LookupList = new DA.LookupList();
Ext.onReady(DA.LookupList.init, DA.LookupList);

/**
* Should not be used
*/
DA.OpenLink = function (config) {
	if (config.newWindow) {
		window.open(config.iframeUrl);
	}
	else {
		var loadMask = true;
		if (config.iframeUrl && config.iframeUrl.toLowerCase().indexOf('.pdf') > -1) {
			loadMask = false;
		}
		var win = new Ext.ux.ManagedIframePanel({ defaultSrc: config.iframeUrl, loadMask: loadMask, title: config.title })
		DCPLApp.AddTab(win);
	}
};

/**
* Shows the help window
*/
Ext.ns("DA.Help");

DA.CheckFileExtension = function (file, extensions) {
	var validExtensions = extensions;
	if (extensions && !Ext.isArray(extensions)) {
		//create an array of acceptable files
		validExtensions = extensions.split(',');
	}
	var allowSubmit = false;
	var ext = file.slice(file.lastIndexOf(".")).toLowerCase();
	if (validExtensions.length > 0) {
		//loop through our array of extensions
		for (var i = 0, len = validExtensions.length; i < len; i++) {
			//check to see if it's the proper extension
			if (validExtensions[i] == ext) {
				//it's the proper extension
				allowSubmit = true;
			}
		}
	}
	else {
		allowSubmit = true;
	}
	//now check the final bool value
	if (allowSubmit == false) {
		return false;
	}
	else {
		return true
	}
	return allowSubmit;
}


DA.Help.enableNotes = true;
DA.Help.Controller = "Help";
DA.Help.FileUpload = function (options) {
	options = options || {};
	Ext.applyIf(options, {
		fieldLabel: 'Select file',
		allowedTypes: []
	});

	var url = EH.BuildUrl('Document');
	var params = options.params || {};
	Ext.apply(params, {
		Action: 'uploadHelp',
		helpContext: options.helpContext,
		isAudio: options.isAudio
	});
	if (!this.win) {
		var uploadFile = new Ext.form.FileUploadField({
			fieldLabel: options.fieldLabel,
			width: 250,
			name: 'file',
			allowBlank: false
		});

		// create form panel
		var formPanel = new Ext.form.FormPanel({
			labelWidth: 100,
			bodyStyle: "padding:5px;",
			fileUpload: true,
			url: url,
			items: [uploadFile]
		});

		var baseParams = this.baseParams;
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
			buttons: [
					{
						text: 'Upload',
						handler: function () {
							// check form value
							if (formPanel.form.isValid()) {
								if (options && options.extensionsAllowed && options.extensionsAllowed.length > 0) {
									if (!DA.CheckFileExtension(uploadFile.getValue(), options.extensionsAllowed)) {
										Ext.MessageBox.alert('Errors', 'Only files with extension(s) ' + options.extensionsAllowed + ' are allowed to be uploaded');
										return;
									}
								}
								formPanel.form.submit({
									params: params,
									waitMsg: 'Uploading...',
									failure: function (form, action) {
										Ext.MessageBox.alert('Error', action.result.info);
									},
									success: function (form, action) {
										window.hide();
										Ext.Msg.alert('File uploaded', 'File upload successfully');
									}
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
	}
	this.options = options;

	this.formPanel.form.reset();
	this.win.show();
};

DA.Help.JoinKey = '-';
DA.Help.Show = function (options) {
	if (!options) {
		options = {};
	}

	var helpContext;
	helpContext = options.helpKey + (options.extraKey ? DA.Help.JoinKey + options.extraKey : "");
	DA.Help.helpContext = helpContext;
	var editor;
	var editorNotes;
	var helpPanel;
	var notesPanel;
	var isSuperAdmin = DA.Security.info.IsSuperAdmin;
	var isAdmin = DA.Security.info.IsAdmin || DA.Help.allowHelpNotesEdit;
	var enableNotes = this.enableNotes;

	var helpUpload = function (options) {
		DA.Help.FileUpload({ helpContext: helpContext, extensionsAllowed: options.extensionsAllowed });
	}
	if (!DA.Help.Window) {
		var items;
		var tbarButtons;

		var saveHandler = function (options) {
			var params = options.params;
			var editor = options.editor;
			if (!params) {
				params = {};
			}
			var loadingWindow = Ext.Msg.wait('Saving....', 'Saving Help');
			ExtHelper.GenericConnection.request({
				url: EH.BuildUrl(DA.Help.Controller),
				params: Ext.applyIf(params, { action: 'save', helpContext: DA.Help.helpContext, content: editor.getValue() }),
				callback: function (options, success, response) {
					loadingWindow.hide();
					if (!success) {
						canContinue = false;
						Ext.Msg.alert('Save help', 'An error occured');
					}
				}
			});
		}
		var saveHelpButton = new Ext.Toolbar.Button({
			text: 'Save',
			handler: function () {
				saveHandler({ editor: editor });
			}
		});
		var videoButton = new Ext.Toolbar.Button({ text: '', iconCls: 'video', tooltip: 'Video Help', handler: function () { DA.Help.ShowVideoHelp() } });
		var audioButton = new Ext.Toolbar.Button({ text: '', iconCls: 'speaker', tooltip: 'Audio Help', handler: function () { DA.Help.ShowAudioHelp() } });
		var uploadHelp = new Ext.Toolbar.Button({ text: '', iconCls: 'exportPDF', tooltip: 'Upload Video Help', handler: function () { helpUpload({ extensionsAllowed: '.flv' }); } });
		var uploaAudiodHelp = new Ext.Toolbar.Button({ text: '', iconCls: 'exportPDF', tooltip: 'Upload Audio Help', handler: function () { helpUpload({ extensionsAllowed: '.mp3,.wav' }); } });
		var printDocument = new Ext.Toolbar.Button({ text: 'Print', iconCls: 'exportPDF', tooltip: 'Print Help Document', handler: function () { DA.Help.helpPrint() } });

		var items = [];
		if (DA.Help.showVideoHelp) {
			items.push(videoButton);
		}
		if (DA.Help.showAudioHelp) {
			items.push(audioButton);
		}

		if (DA.Help.showPrintHelp) {
			items.push(printDocument);
		}
		if (isSuperAdmin) {
			items.push(saveHelpButton);
			if (DA.Help.showUploadVideoHelp) {
				items.push(uploadHelp); //Uploading only allowed to super admin
			}
			if (DA.Help.showUploadAudioHelp) {
				items.push(uploaAudiodHelp); //Uploading only allowed to super admin
			}
		}

		helpPanel = new Ext.Panel({
			hideMode: 'offsets',
			layout: 'fit',
			autoScroll: !isSuperAdmin,
			tbar: items.length > 0 ? items : null
		});

		if (isSuperAdmin) {
			editor = new Ext.form.HtmlEditor();
			helpPanel.add(editor);
		}

		if (enableNotes) {
			helpPanel.title = "Help";

			var saveButton = new Ext.Toolbar.Button({ text: 'Save', handler: function () { saveHandler({ editor: editorNotes, params: { notes: 1 } }) } });

			var items = [];
			items.push(saveButton);

			notesPanel = new Ext.Panel({
				hideMode: 'offsets',
				layout: 'fit',
				title: 'Notes',
				autoScroll: !isAdmin,
				tbar: isAdmin ? items : null
			});

			if (isAdmin) {
				editorNotes = new Ext.form.HtmlEditor();
				notesPanel.add(editorNotes);
			}

			DA.Help.TabPanel = new Ext.TabPanel({
				region: 'center',
				activeTab: 0,
				hideMode: 'offsets',
				height: 300,
				layoutOnTabChange: true,
				defaults: { layout: 'fit', border: false },
				items: [helpPanel, notesPanel]
			});
		}
		var width = DA.Help.helpVideos ? 650 : 500;
		var height = DA.Help.helpVideos ? 450 : 300;
		DA.Help.Window = new Ext.Window({
			layout: 'fit',
			width: width,
			modal: true,
			height: height,
			closeAction: 'hide',
			plain: true,
			items: enableNotes ? DA.Help.TabPanel : helpPanel
		});

		Ext.apply(DA.Help, {
			helpPanel: helpPanel,
			notesPanel: notesPanel,
			editor: editor,
			editorNotes: editorNotes
		});
	} else {
		editor = DA.Help.editor;
		editorNotes = DA.Help.editorNotes;
		helpPanel = DA.Help.helpPanel;
		notesPanel = DA.Help.notesPanel;
	}

	var canContinue = true;
	if (isSuperAdmin) {
		DA.Help.TabPanel.items.items[0].setTitle('Help: ' + helpContext);
	}

	DA.Help.Window.setTitle('Help: ' + options.title);
	DA.Help.Window.show();

	if (enableNotes) {
		if (options.type) {
			switch (options.type) {
				case 1: //Only Help
					DA.Help.TabPanel.unhideTabStripItem(helpPanel);
					DA.Help.TabPanel.activate(helpPanel);
					DA.Help.TabPanel.hideTabStripItem(notesPanel);
					break;
				case 2: //Only Notes
					DA.Help.TabPanel.unhideTabStripItem(notesPanel);
					DA.Help.TabPanel.activate(notesPanel);
					DA.Help.TabPanel.hideTabStripItem(helpPanel);
					break;
			}
		} else {
			DA.Help.TabPanel.activate(notesPanel);
			DA.Help.TabPanel.activate(helpPanel);
		}
	}

	if (isSuperAdmin) {
		var loadingWindow = Ext.Msg.wait('Loading....', 'Loading Help');
		//loadingWindow.show();
		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl(DA.Help.Controller),
			params: { action: 'load', helpContext: helpContext },
			callback: function (options, success, response) {
				loadingWindow.hide();
				if (!success) {
					canContinue = false;
					Ext.Msg.alert('Load help', 'An error occured');
				} else {
					callResult = response;
					editor.setValue(response.responseText);
				}
			}
		});
	} else {
		helpPanel.load({
			url: EH.BuildUrl(DA.Help.Controller) + '?action=load&helpContext=' + helpContext,
			callback: function (options, success, response) {
				if (!success) {
					Ext.Msg.alert('Load help', 'An error occured');
				} else {
					var videoButton = DA.Help.helpPanel.getTopToolbar().items.items[0];
					videoButton.setIconClass('notvideo');
					videoButton.setTooltip('Video Not Found');
					videoButton.setDisabled(true);
					if (response.responseText.indexOf("File Found") > -1) {
						response.responseText = response.responseText.replace("File Found", '');
						DA.Help.helpPanel.body.dom.innerHTML = response.responseText;
						videoButton.setIconClass('video');
						videoButton.setTooltip('Video Help');
						videoButton.setDisabled(false);
					}
				}
			},
			discardUrl: false,
			scope: this
		});
	}

	if (enableNotes) {
		if (isAdmin) {
			var loadingWindowNotes = Ext.Msg.wait('Loading....', 'Loading Notes');
			//loadingWindow.show();
			ExtHelper.GenericConnection.request({
				url: EH.BuildUrl(DA.Help.Controller),
				params: { action: 'load', helpContext: helpContext, notes: 1 },
				callback: function (options, success, response) {
					loadingWindowNotes.hide();
					if (!success) {
						canContinue = false;
						Ext.Msg.alert('Load notes', 'An error occured');
					} else {
						callResult = response;
						editorNotes.setValue(response.responseText);
					}
				}
			});
		} else {
			notesPanel.load({ url: EH.BuildUrl(DA.Help.Controller) + '?action=load&notes=1&helpContext=' + helpContext });
		}
	}
};


DA.Help.PlayFLV = function (options) {
	var divId = options.divId;
	var swfSource = options.swfSource;
	var videoFile = options.videoFile;
	var width = options.width;
	var height = options.height;

	flashembed(divId, {
		src: swfSource,
		width: width,
		height: height
	}, {
		config: {
			autoPlay: false,
			autoBuffering: true,
			controlBarBackgroundColor: '0xd9b859',
			initialScale: 'scale',
			videoFile: videoFile
		}
	});
};

DA.Help.ShowFLVPlayerWindow = function (options) {
	if (!options) {
		options = {};
	}
	var divId = 'nothing';
	var height = 0;
	var width = 0;
	var title = '';
	var videoFileName = '';
	if (options.divId) {
		divId = options.divId;
	}
	if (options.videoFileName) {
		videoFileName = options.videoFileName;
	}
	if (options.height) {
		height = options.height;
	}
	if (options.width) {
		width = options.width;
	}
	if (options.title) {
		title = options.title;
	}

	var playerWindow = new Ext.Window({
		layout: 'fit',
		width: width + 15,
		modal: true,
		height: height + 35,
		plain: true,
		items: { html: '.', id: divId }
		//items: videoPanel
	});

	playerWindow.setTitle(title);
	playerWindow.show();
	var fileSource = DA.Help.helpVideos ? DA.Help.helpVideos + videoFileName : 'inc/extJS-ux/Video/FlowPlayerLight.swf';
	DA.Help.PlayFLV({ divId: divId, swfSource: fileSource, videoFile: videoFileName, height: height, width: width });
};

DA.Help.ShowVideoJSPlayerWindow = function (options) {
	if (!options) {
		options = {};
	}
	if (options.title) {
		title = options.title;
	}
	if (options.height) {
		height = options.height;
	}
	if (options.width) {
		width = options.width;
	}
	// Added panel for video.
	var videoPanel = new Ext.Panel({
		loop: false,
		poster: '',
		html: ''
	});
	// Add a video for Video JS Player.
	
	var playerWindow = new Ext.Window({
		layout: 'fit',
		id: 'videoplayer',
		width: width + 15,
		modal: true,
		height: height + 35,
		plain: true,
		items: videoPanel
	});
	var fileSource = DA.Help.helpVideos + options.videoFileName;
	playerWindow.setTitle(title);
	playerWindow.show();
	videoPanel.body.update('<video poster="' + '' + '" id="videoplayer" height=' + videoPanel.getEl().getHeight() + ' width=' + videoPanel.getEl().getWidth() + ' class="video-js vjs-default-skin" controls preload="auto" data-setup="{"controls":true}"><source src="' + fileSource + '" type="video/mp4" /></video>');
};

DA.Help.ShowVideoHelp = function (options) {
	width = DA.Help.helpVideos ? screen.width - 200 : 400;
	height = DA.Help.helpVideos ? screen.height - 400: 300;
	var videoFileName = DA.Help.helpVideos ? DA.Help.helpContext + '.mp4' : '../../Help-Audios/' + DA.Help.helpContext + '.flv';
	if (DA.Help.helpVideos) {
		var title = 'Help Video - ' + DA.Help.helpContext.split('_')[0];
		DA.Help.ShowVideoJSPlayerWindow({ title: title, width: width, height: height, videoFileName: videoFileName });
	} else {
		DA.Help.ShowFLVPlayerWindow({ divId: 'helpVideoDiv', title: 'Video', width: width, height: height, videoFileName: videoFileName });
	}
};

DA.Help.ShowAudioHelp = function (options) {
	var audioFileName = '../../Help-Audios/' + DA.Help.helpContext + '.mp3';
	DA.Help.ShowFLVPlayerWindow({ divId: 'helpAudioDiv', title: 'Audio', width: 400, height: 80, videoFileName: audioFileName });
};

DA.Help.helpPrint = function () {
	if (DA.Help.helpDocUrl) {
		var baseUrl = window.location.href.toLowerCase().split('#')[0];
		window.open(baseUrl + DA.Help.helpDocUrl);
	}
};

Ext.ns("DA.modLog");


/**
* Shows the mod log window
*/
DA.modLog.show = function (options) {

	var url = "rss/modlog.ashx?resultType=table&table=" + options.tableName;
	if (options.parentId) {
		url += "&parentId=" + options.parentId;
	}
	if (options.parentKeyColumnName) {
		url += "&parentKeyColumnName=" + options.parentKeyColumnName;
	}
	if (options.primaryKeyId) {
		url += "&primaryKeyId=" + options.primaryKeyId;
	}

	var modLog = DA.modLog;

	if (!modLog.window) {

		modLog.store = new Ext.data.JsonStore({
			url: url
		});

		var grid = new Ext.grid.GridPanel({
			store: modLog.store,
			plugins: [new EH.grid.plugins.AutoConfigureGrid()]
		});

		modLog.window = new Ext.Window({
			title: 'Changes',
			height: 400,
			width: 600,
			modal: true,
			layout: 'fit',
			items: [grid],
			closeAction: 'hide'
		});

	} else {
		modLog.store.proxy.conn.url = url;
	}

	modLog.window.show();
	modLog.store.load();
};

/**
* Returns config for ModifiedOn column
*/
DA.Grid.ModifiedOn = function (options) {
	return Ext.applyIf(this, options);
}

DA.Grid.ModifiedOn.prototype = new Ext.ux.grid.GridColumn({ header: 'Modified On', dataIndex: 'ModifiedOn', renderer: 'DateTime' });

/**
* Configures columns for admin
*/
DA.Grid.ConfigureAdminCols = function (colConfig) {
	// If array, use as it is, otherwise assume it is a colModel
	var cols = Ext.isArray(colConfig) ? colConfig : colConfig.config;

	cols.push(new DA.Grid.ModifiedOn());

	if (!Ext.isArray(colConfig)) {
		colConfig.setConfig(cols);
	} else {
		return cols;
	}
}

/**
*
* @constructor
*/
DA.ChangePassword = {};

Ext.apply(DA.ChangePassword, {

	Show: function () {

		if (!this.win) {

			var oldPassword = new Ext.form.TextField({
				fieldLabel: 'Current Password',
				name: 'OldPassword',
				allowBlank: false,
				inputType: 'password',
				minLength: 3,
				maxLength: 15
			});

			var newPassword = new Ext.form.TextField({
				fieldLabel: 'New Password',
				name: 'NewPassword',
				allowBlank: false,
				inputType: 'password',
				minLength: 5,
				maxLength: 15
			});

			var confirmPassword = new Ext.form.TextField({
				fieldLabel: 'Confirm Password',
				name: 'ConfirmPassword',
				allowBlank: false,
				inputType: 'password',
				minLength: 5,
				maxLength: 15
			});

			// create form panel
			var formPanel = new Ext.form.FormPanel({
				labelWidth: 100,
				bodyStyle: "padding:5px;",
				url: EH.BuildUrl('LoginController'),
				items: [
                    oldPassword,
                    newPassword,
                    confirmPassword
				]
			});

			// define window
			var window = new Ext.Window({
				title: 'Change password',
				width: 300,
				height: 150,
				layout: 'fit',
				modal: true,
				plain: true,
				closeAction: 'hide',
				items: formPanel,
				buttons: [
                {
                	text: 'Change Password',
                	handler: function () {
                		// check form value 
                		if (formPanel.form.isValid()) {
                			if (oldPassword.getValue().length == 0 || newPassword.getValue().length == 0 || confirmPassword.getValue().length == 0) {
                				Ext.Msg.alert('Missing data', 'You must enter all the info to change password');
                				return;
                			}
                			if (newPassword.getValue() != confirmPassword.getValue()) {
                				Ext.Msg.alert('Missing data', 'New password and confirmation password should be same');
                				return;
                			}
                			formPanel.form.submit({
                				params: { action: 'changepassword' },
                				waitMsg: 'Checking...',
                				failure: function (form, action) {
                					Ext.MessageBox.alert('Error', action.result.info);
                				},
                				success: function (form, action) {
                					window.hide();
                					Ext.Msg.alert('Password change', action.result.info);
                				}
                			});
                		} else {
                			Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
                		}
                	}
                }, {
                	text: 'Cancel',
                	handler: function () { window.hide(); }
                }
				]
			});

			this.oldPassword = oldPassword;
			this.formPanel = formPanel;
			this.win = window;
		}

		this.formPanel.form.reset();
		this.win.show();

		this.oldPassword.focus(true, true);
	}
});

/**
* Should not be used
*/
DA.Util.GetComboSelectedRecord = function (combo) {
	var toReturn = null;
	var idx = combo.store.findBy(function (record) {
		if (record.get(combo.valueField) == combo.getValue()) {
			toReturn = record;
		}
	});
	return toReturn;
}

/**
* Make two grids dependent on each other
* Issues: 1. On add from any other button, the ID is not set correctly, because of which dependency fails
*         2. On dataloaded refreshChildGrids has to be called, need to know how
*/
DA.Util.DependentGrids = function (options) {
	Ext.applyIf(this, {
		/**
		* @cfg {Ext.grid.GridPanel} masterGrid Master Grid
		**/
		/**
		* @cfg {Ext.grid.GridPanel} childGrid Child Grid
		**/
		/**
		* @cfg {String} masterColumn Master record Key. Defaults to Id
		**/
		masterColumn: 'Id',
		/**
		* @cfg {String} childColumn Child record key
		**/
		/**
		* @property {String} masterId last Id for master
		**/
		masterId: 0,
		/**
		* @property {String} masterId Current master Id for child
		**/
		currentMasterId: 0,
		masterGridValidation: null
	});
	Ext.apply(this, options);

	var info = this;
	if (this.masterGrid.daScope) {
		this.setNewFunc({ grid: this.masterGrid, colName: this.masterColumn, info: this, propertyToSet: 'masterId', isMaster: true });
	}
	if (this.childGrid.daScope) {
		this.setNewFunc({ grid: this.childGrid, colName: this.childColumn, info: this, propertyToSet: 'currentMasterId' });
		this.childGrid.getStore().on('load', this.filterChildren, this);
	}

	var masterGrid = this.masterGrid;
	var childGrid = this.childGrid;

	var sm = this.masterGrid.getSelectionModel();

	// Assuming we are working with on editor grid and it has cell selection model;
	sm.on('beforecellselect', this.onBeforeCellSelect, this);
	sm.on('selectionchange', this.onSelectionChange, this);
	childGrid.on('beforeedit', this.onBeforeEdit, this);

	masterGrid.getStore().on('datachanged', this.onMasterDataChanged, this, { delay: 200 });
	masterGrid.getStore().on('remove', this.onMasterDataRemoved, this);

};

DA.Util.DependentGrids.prototype = {
	setNewFunc: function (options) {
		var grid = options.grid;
		var colName = options.colName;
		var info = options.info;
		var propertyToSet = options.propertyToSet;
		var oldMethod = grid.daScope.newListRecordData;
		var newMethod = function () {
			var data;
			switch (typeof (oldMethod)) {
				case "object":
					data = oldMethod;
					break;
				case "function":
					data = oldMethod();
					break;
			}
			if (!data) {
				data = {};
			}
			if (options.isMaster) {
				info[propertyToSet] = info[propertyToSet] - 1;
			}
			data[colName] = info[propertyToSet];
			return data;
		}
		grid.daScope.newListRecordData = newMethod;
	},

	onBeforeCellSelect: function (sm, rowIndex, colIndex) {
		var store = this.masterGrid.getStore();
		var masterCol = this.masterColumn;
		var newData = store.getAt(rowIndex).get(masterCol);
		if (newData != this.currentMasterId) {
			if (this.masterGridCaptionCol && this.childGridCaptionCol) {
				this.childGrid.setTitle(String.format(this.childGridCaptionCol, store.getAt(rowIndex).get(this.masterGridCaptionCol)));
			}
			if (!ExtHelper.ValidateGrid(this.childGrid).IsValid) {
				var selectedCell = sm.getSelectedCell();
				if (selectedCell) {
					sm.select(selectedCell[0], selectedCell[1]);
				}
				return false;
			}
		}
		if (!this.canEdit(store.getAt(rowIndex)) || this.masterGrid.isDisabled === true) {
			ExtHelper.DisableGrid(this.childGrid);
		} else {
			ExtHelper.EnableGrid(this.childGrid);
		}
	},

	onMasterDataChanged: function (store) {
		if (store.getCount() === 0) {
			this.currentMasterId = 0;
			this.filterChildren();
		} else if (this.masterGrid.rendered) {
			var sm = this.masterGrid.getSelectionModel();
			if (typeof sm.selectFirstRow === 'function') {
				sm.selectFirstRow();
			} else {
				sm.select(0, 0);
			}
		}
	},

	onMasterDataRemoved: function (store, masterRecord, index) {
		var childStore = this.childGrid.getStore();
		var recordsToRemove = [];
		childStore.each(function (record) {
			if (this.childColumn && this.masterColumn && record.data[this.childColumn] == masterRecord.data[this.masterColumn]) {
				recordsToRemove.push(record);
			}
		});
		if (recordsToRemove.length > 0) {
			for (var i = 0; i < recordsToRemove.length; i++) {
				childStore.remove(recordsToRemove[i]);
			}
		}
		this.currentMasterId = 0;
		this.filterChildren();
	},
	canEdit: function (record) {
		if (typeof (this.masterGridValidation) == 'function') {
			return this.masterGridValidation.call(record);
		}
		return true;
	},
	onBeforeEdit: function (e) {
		var record = e.record;
		if (record.get(this.childColumn) != this.currentMasterId || this.currentMasterId == 0) {
			e.cancel = true;
		}
		if (this.currentMasterId == 0) {
			//Removing un-used record
			//e.grid.getStore().remove(record); - not functioning properly
		}
		if (!this.canEdit(record)) {
			e.cancel = true;
		}
	},

	filterChildren: function () {
		var store = this.childGrid.getStore();
		var childColumn = this.childColumn;
		var masterId = this.currentMasterId;
		store.filterBy(function (record) {
			return record.data[childColumn] == masterId;
		});
	},

	onSelectionChange: function (sm) {
		this.childGrid.stopEditing();
		var childStore = this.childGrid.getStore();
		childStore.commitChanges();

		var record;
		var selection = sm.selection;
		if (selection && selection.record) {
			record = selection.record;
		}
		if (record) {
			var masterId = record.get(this.masterColumn);
			this.currentMasterId = masterId;
			this.filterChildren();
		}
	}
};

DA.FileUploader = {
	id: 0,

	fields: {},

	params: {},

	Show: function (options) {
		options = options || {};
		Ext.applyIf(options, {
			fieldLabel: 'Select file',
			allowedTypes: [],
			title: 'Upload file'
		});

		var url = options.formPanel.url;
		this.params = options.params || {};
		Ext.apply(this.params, {
			Action: 'upload',
			id: options.formPanel.getForm().baseParams.id
		});

		this.id = this.params.id;

		if (!this.win) {

			var uploadFile = new Ext.form.FileUploadField({
				fieldLabel: options.fieldLabel,
				width: 250,
				name: 'file',
				allowBlank: false
			});
			this.fields.uploadFile = uploadFile;

			// create form panel
			var formPanel = new Ext.form.FormPanel({
				labelWidth: 100,
				bodyStyle: "padding:5px;",
				fileUpload: true,
				url: url,
				items: [uploadFile]
			});

			var baseParams = this.baseParams;
			// define window
			var window = new Ext.Window({
				title: options.title,
				width: 500,
				height: 150,
				layout: 'fit',
				modal: true,
				plain: true,
				closeAction: 'hide',
				items: formPanel,
				buttons: [
                {
                	text: 'Upload',
                	handler: function () {
                		// check form value
                		if (formPanel.form.isValid()) {
                			Ext.apply(this.params, { id: DA.FileUploader.id });
                			if (options && options.allowedTypes && options.allowedTypes.length > 0) {
                				if (!DA.CheckFileExtension(uploadFile.getValue(), options.allowedTypes)) {
                					Ext.MessageBox.alert('Errors', 'Only files with extension(s) ' + options.allowedTypes + ' are allowed to be uploaded');
                					return;
                				}
                			}
                			formPanel.form.submit({
                				params: this.params,
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
                }
				]
			});

			this.formPanel = formPanel;
			this.win = window;
		}
		this.options = options;

		this.fields.uploadFile.setLabel(options.fieldLabel);

		this.win.setTitle(options.title);

		this.formPanel.form.reset();
		this.win.show();
	},

	onFailure: function (form, action) {
		Ext.MessageBox.alert('Error', action.result.info);
		if (this.options.onFailure) {
			this.options.onFailure.call(this.options.scope || this, form, action);
		}
	},

	onSuccess: function (form, action) {
		this.win.hide();
		if (this.options.onSuccess) {
			this.options.onSuccess.call(this.options.scope || this, form, action);
		}
	}
};

/**
* Checks stores for duplicate values
* @param {Object}
* The valid options are:
* <ul class="mdetail-params">
*  <li><b>toCheck</b> : array/object<div class="sub-desc">Values to check. For example: [{ds: myStore, field: 'ContactTypeId', message: 'Contact type must be unique'}, fn: calcSomething]</div></li>
* </ul>
**/
DA.Util.HasDuplicates = function (options) {
	var hasDuplicates = false;
	var toCheck = [].concat(options.toCheck);
	var errorMessage;
	for (var i = 0, len = toCheck.length; i < len; i++) {
		var item = toCheck[i];
		var ds = item.ds;
		var field = item.field;
		var message = item.message;
		var fn = item.fn;
		var hasFn = typeof (fn) === 'function';
		var scope = item.scope || options.scope || this;
		var onError = item.onError;
		var hasOnError = typeof (onError) === 'function';
		var temp = {};
		ds.each(function (record) {
			var value = record.get(field);
			// if duplicate property exists show error 
			if (temp[value]) {
				hasDuplicates = true;
				errorMessage = item.message;
				if (hasOnError) {
					onError.call(scope, item, record);
				}
				return false;
			}
			temp[value] = true;
			if (hasFn) {
				fn.call(scope, record);
			}
		});
		if (hasDuplicates) {
			break;
		}
	}
	return { hasDuplicates: hasDuplicates, message: errorMessage };
};

DA.Util.AttachmentList = {
	show: function (attachments) {
		var win = this.attachmentWindow;
		var title = "Files generated, double click to download";
		if (!win) {
			var store = new Ext.data.JsonStore({
				fields: [
					{ name: 'AttachmentId', type: 'int' },
                    { name: 'File', type: 'int' }
				]
			});

			var cm = [
                { id: 0, header: 'File#', dataIndex: 'File', width: 200 }
			];

			var grid = new Ext.grid.GridPanel({
				columns: cm,
				store: store
			});

			grid.on('rowdblclick', function (grid, rowIndex, e) {

				var rec = grid.getStore().getAt(rowIndex);
				ExtHelper.HiddenForm.submit({ action: EH.BuildUrl('DownloadAttachment') + "?id=" + rec.get('AttachmentId') });
			});

			win = new Ext.Window({
				title: title,
				width: 260,
				height: 300,
				modal: true,
				layout: 'fit',
				closeAction: 'hide',
				items: [grid]
			});
			this.attachmentGrid = grid;
			this.attachmentWindow = win;
		} else {
			win.setTitle(title);
		}
		this.attachmentGrid.getStore().loadData(attachments);
		this.attachmentWindow.show();
	}
}

DA.Util.OpenReport = function (options) {
	Ext.applyIf(options, {
		action: 'Report.ashx',
		params: {}
	});
	Ext.applyIf(options.params, {
		download: 1
	});
	if (options.saveToAttachments) {
		var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
		mask.show();
		ExtHelper.GenericConnection.request({
			timeout: 1200000,
			url: options.action,
			params: options.params,
			callback: function (o, success, response) {
				mask.hide();
				mask = null;
				if (!success) {
					Ext.Msg.alert('An error occured', 'An error occured');
				}
				else {
					var jsonResponse = Ext.decode(response.responseText);
					if (jsonResponse.data) {
						Ext.Msg.alert('Info', jsonResponse.data);
					} else {
						var attachmentIds;
						if (typeof (jsonResponse) == 'object') {
							attachmentIds = jsonResponse.AttachmentId;
						}
						else {
							attachmentIds = jsonResponse.toString();
						}

						if (attachmentIds.indexOf(',') > 0) {
							var arrAttachmentIds = attachmentIds.split(',');
							var attachments = [];
							for (var i = 0; i < arrAttachmentIds.length; i++) {
								attachments.push({ AttachmentId: arrAttachmentIds[i], File: i + 1 });
							}
							DA.Util.AttachmentList.show(attachments);
						} else {

							ExtHelper.HiddenForm.submit({ action: EH.BuildUrl('DownloadAttachment') + "?id=" + attachmentIds });
						}
						/*
						ExtHelper.HiddenForm.submit({
						target: '_target',
						action: 'downloadattachment.aspx?id=' + response.responseText,
						params: {}
						});
						*/
					}
				}
			},
			scope: this
		});
	}
	else {
		ExtHelper.HiddenForm.submit(options);
	}
};


EH.renderer.TextAsLink = function (v, m, r) {
	if (v) {
		m.css += " hyperlink";
		return v;
	}
	return " ";
};


//--------------------
// For the Article
//--------------------

DA.ShowArticle = function (o) {
	var associationId = o.id;

	var renderBody = function (options) {
		if (!Ext.isDate(options.createdOn)) {
			options.createdOn = Date.parseDate(options.createdOn, 'X');
		}
		options.createdOn = Ext.ux.DateLocalizer(options.createdOn);

		var content = "<table border='0' cellpadding='0' cellspacing='0' class='article' width='100%'>";
		content += "<tr><td Width='90%'><b>{0}</b></td></tr><tr><td><b>&nbsp;</b></td></tr>";
		content += "<tr><td>{1}</td></tr>";
		content += "<tr><td align='right'><i>Posted By: </i>{2}&nbsp;<i>Posted On: </i>{3}</td></tr>";
		content += "</table>";
		content = String.format(content, options.title, options.body, options.createdBy, ExtHelper.renderer.DateTime(options.createdOn));
		var body = options.body;
		var title = options.title;

		var cbDoNotShow = new Ext.form.Checkbox({ fieldLabel: 'Do not show again', name: 'DoNotShowAgain' });
		var north = new Ext.Panel({ defaults: { border: false }, items: [{ html: content }], region: 'north', height: 200, autoScroll: true });
		var center = new Ext.Panel({ layout: 'form', items: [cbDoNotShow], region: 'center' });

		var items = [north];

		if (options.fromFlash) {
			items.push(center);
		}

		var formPanel = new Ext.form.FormPanel({
			bodyStyle: "padding:5px;",
			autoScroll: true,
			defaults: { border: false },
			url: EH.BuildUrl('UserPreference'),
			items: items
		});

		// define window
		var window = new Ext.Window({
			title: title,
			width: 500,
			height: 300,
			layout: 'fit',
			modal: true,
			plain: true,
			closeAction: 'hide',
			items: [formPanel],
			buttons: [{
				text: 'Ok',
				handler: function () {
					if (cbDoNotShow.getValue() == true) {
						formPanel.form.submit({
							params: {
								action: 'UpdateUserPreference',
								associationId: associationId,
								associationTypeId: 5, //ARTICLE
								info: cbDoNotShow.getValue()
							},
							waitMsg: 'Please wait...',
							failure: function (form, action) {
								Ext.MessageBox.alert('Error', action.result.info);
							},
							success: function (form, action) {
								window.hide();
							}
						});
					} else {
						window.hide();
					}
				}
			}
			]
		});
		window.show();
	}

	if (!o.body) {
		var params = {};
		params.action = 'list';
		params.articleId = associationId;

		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl('ArticleFlash'),
			params: params,
			callback: function (o, success, response) {
				if (!success) {
					canContinue = false;
					Ext.Msg.alert('An error occured', 'An error occured');
				}
				else {
					var callParams = {};
					Ext.apply(callParams, Ext.util.JSON.decode(response.responseText));
					var record = callParams.records[0];
					var options = {};
					options.title = record.Title;
					options.body = record.Body;
					options.createdBy = record.CreatedBy;
					options.createdOn = record.CreatedOn;

					renderBody(options);
				}
			},
			scope: this
		});
	} else {
		o.fromFlash = true;
		renderBody(o);
	}
};


DA.UpdatePreference = function (options) {
	var params = {};
	params.action = 'UpdateUserPreference';
	params.associationTypeId = options.associationTypeId;
	params.info = options.info;

	ExtHelper.GenericConnection.request({
		url: EH.BuildUrl('UserPreference'),
		params: params,
		callback: function (o, success, response) {
			if (!success) {
				canContinue = false;
				Ext.Msg.alert('An error occured', 'An error occured');
			}
			else {
				Ext.MessageBox.alert('Preference', options.successMessage);
			}
		},
		scope: this
	});
}

DA.TaskScheduler = {
	createWin: function () {
		var ds = new Ext.data.JsonStore({
			url: EH.BuildUrl('TaskScheduler'),
			baseParams: { action: 'List' },
			fields: [
				{ name: 'Name', type: 'string' },
				{ name: 'LastStart', type: 'date', convert: Ext.ux.DateLocalizer },
				{ name: 'LastEnd', type: 'date', convert: Ext.ux.DateLocalizer },
				{ name: 'Status', type: 'string' },
				{ name: 'Info', type: 'string' }
			]
		});
		this.ds = ds;
		var tbar = [];
		var refresh = new Ext.Toolbar.Button({ text: 'Refresh', handler: this.refreshGrid, scope: this, iconCls: 'refresh' });
		var start = new Ext.Toolbar.Button({ text: 'Start', handler: this.onStart, scope: this, iconCls: 'green-circle_Icon' });
		var stop = new Ext.Toolbar.Button({ text: 'Stop', handler: this.onStop, scope: this, iconCls: 'red_circle_Icon' });
		var StartAll = new Ext.Toolbar.Button({ text: 'Start All', handler: this.onStartAll, scope: this, iconCls: 'concentric_rings_green' });
		var stopAll = new Ext.Toolbar.Button({ text: 'Stop All', handler: this.onStopAll, scope: this, iconCls: 'concentric_rings_red' });
		var cancel = new Ext.Toolbar.Button({ text: 'Cancel', iconCls: 'cancel', handler: function () { win.hide(); } });
		var taskConfig = new Ext.Toolbar.Button({ text: 'Task Manager', handler: function () { DA.TaskConfig.ShowList(); }, iconCls: 'checklist_Icon' });
		var reInitialize = new Ext.Toolbar.Button({ text: 'Re - Initialize', handler: this.reInitialize, scope: this, iconCls: 'arrow_refresh_Icon' });

		tbar.push(refresh);
		tbar.push(start);
		tbar.push(stop);
		tbar.push(StartAll);
		tbar.push(stopAll);
		tbar.push(cancel);

		if (DA.Security.HasPermission('AdministratorLogs-Scheduler-Status-Button-Frequency')) {
			tbar.push(taskConfig);
			tbar.push(reInitialize);
		}
		tbar.push("->");
		tbar.push({ text: '', handler: function () { DA.Help.Show({ helpKey: 'task_scheduler', extraKey: 'grid', title: 'Task Scheduler' }); }, scope: this, iconCls: 'help', tooltip: 'Help' });

		var grid = new Ext.grid.GridPanel({
			columns: [
				{ id: 'Name', header: 'Task', dataIndex: 'Name', width: 300 },
				{ id: 'Start', header: 'Last Start', dataIndex: 'LastStart', renderer: ExtHelper.renderer.DateTime, width: 140 },
				{ id: 'End', header: 'Last End', dataIndex: 'LastEnd', renderer: ExtHelper.renderer.DateTime, width: 140 },
				{ id: 'Status', header: 'Status', dataIndex: 'Status' },
				{ id: 'Info', header: 'Info', dataIndex: 'Info', renderer: ExtHelper.renderer.ToolTip() }
			],
			autoExpandColumn: 'Info',
			ds: ds,
			tbar: tbar,
			loadMask: true
		});
		this.grid = grid;

		var win = new Ext.Window({
			modal: true,
			height: 500,
			width: 900,
			layout: 'fit',
			items: [grid],
			modal: false,
			closeAction: 'hide',
			collapsible: true,
			closable: false,
			resizable: true,
			title: 'Task Scheduler'
		});
		this.win = win;
	},

	onStop: function () {
		var r = this.grid.getSelectionModel().getSelected();
		if (r) {
			if (r.get('Status') === 'Stopped') {
				Ext.Msg.alert('Error', 'This task is already stopped');
			} else {
				Ext.Ajax.request({
					url: this.ds.url,
					params: { action: 'Stop', name: r.get('Name') },
					success: this.refreshGrid,
					scope: this
				}, this);
			}
		}
	},

	onStart: function () {
		var r = this.grid.getSelectionModel().getSelected();
		if (!r) {
			return;
		}
		Ext.Ajax.request({
			url: this.ds.url,
			params: { action: 'Start', name: r.get('Name') },
			success: this.refreshGrid,
			scope: this
		}, this);
	},

	onStartAll: function () {
		Ext.Ajax.request({
			url: this.ds.url,
			params: { action: 'StartAll' },
			success: this.refreshGrid,
			scope: this
		});
	},

	onStopAll: function () {
		Ext.Ajax.request({
			url: this.ds.url,
			params: { action: 'StopAll' },
			success: this.refreshGrid,
			scope: this
		});
	},

	refreshGrid: function () {
		this.ds.reload();
	},

	show: function () {
		if (!this.win) {
			this.createWin();
		}
		this.win.show();
		this.ds.load();
	},
	reInitialize: function () {
		Ext.Ajax.request({
			url: this.ds.url,
			params: { action: 'ReInitialize' },
			success: this.refreshGrid,
			scope: this
		});
	}
};

DA.ReportRunner = Ext.extend(Object, {
	reportName: 'Processing',
	onComplete: function (data, progress) {
		Ext.Msg.alert(this.reportNameWinTitle ? this.reportNameWinTitle : this.reportName, this.translateComplete(data, progress));
	},
	translateComplete: function (data, progress) {
		return progress.Records + " record(s) processed.";
	},
	onFormSubmitFailure: function (form, action) {
		Ext.Msg.alert('Error', this.reportNameWinTitle ? this.reportNameWinTitle : this.reportName + ' - An error has occurred');
	},
	showAttachmentList: function (attachments) {
		var win = this.attachmentWindow;
		var title = "Files generated, double click to download";
		if (!win) {
			var store = new Ext.data.JsonStore({
				fields: [
					{ name: 'AttachmentId', type: 'int' },
                    { name: 'File', type: 'int' }
				]
			});

			var cm = [
                { id: 0, header: 'File#', dataIndex: 'File', width: 200 }
			];

			var grid = new Ext.grid.GridPanel({
				columns: cm,
				store: store
			});

			grid.on('rowdblclick', function (grid, rowIndex, e) {

				var rec = grid.getStore().getAt(rowIndex);
				ExtHelper.HiddenForm.submit({ action: EH.BuildUrl("DownloadAttachment") + "?id=" + rec.get('AttachmentId') });
			});

			win = new Ext.Window({
				title: title,
				width: 260,
				height: 300,
				modal: true,
				layout: 'fit',
				closeAction: 'hide',
				items: [grid]
			});
			this.attachmentGrid = grid;
			this.attachmentWindow = win;
		} else {
			win.setTitle(title);
		}
		this.attachmentGrid.getStore().loadData(attachments);
		this.attachmentWindow.show();
	},
	onFormSubmitSuccess: function (form, action) {
		var json = Ext.util.JSON.decode(action.response.responseText);
		var data = json.data;
		var message = data.responseText;
		var status = data.status;
		this.startTime = new Date();
		//this.invoicePromptWin1.hide();
		if (data) {
			var importKey = data.importStatusKey;
			var task = {
				run: function () {
					Ext.Ajax.request({
						url: form.url,
						params: { importKey: importKey },
						callback: this.onTaskCallBack,
						scope: this
					});
				},
				interval: 5 * 1000,
				scope: this
			};
			this.task = Ext.TaskMgr.start(task);
			this.messageBar = Ext.Msg.wait("Generating...", this.reportNameWinTitle ? this.reportNameWinTitle : this.reportName);
		} else {
			Ext.Msg.alert('Error', message);
		}
	},
	onTaskCallBack: function (options, success, response) {
		var json = Ext.util.JSON.decode(response.responseText);
		var data = json.data;
		var progress = data.progress;
		var status = data.status;
		var error = data.exception;
		var isRunning = status === "Running";
		var elapsedTime;
		var startTime;
		//Time handling
		var startDateTime = options.scope.startTime;
		if (startDateTime) {
			elapsedTime = Ext.ux.GetElapsedTime(startDateTime);
			startTime = startDateTime.getHours() + ':' + startDateTime.getMinutes() + ' ' + (startDateTime.getHours() < 12 ? 'AM' : 'PM');
		}
		if (!isRunning) {
			Ext.TaskMgr.stop(this.task);
			this.messageBar.hide();
			delete this.messageBar;
			delete this.task;
		}
		if (error) {
			ExtHelper.OpenWindow({ id: 'ErrorWindow', title: 'Error', width: 600, height: 400, html: error, autoScroll: true, modal: true });
		} else {
			var records = progress.Records;
			var response = progress.Response;
			if (!isRunning) {
				if (records > 0) {
					var isCompleted = this.onComplete(data, progress);
					if (isCompleted) {
						return;
					}
					//Downloading attachments if found
					if (response.AttachmentId && response.AttachmentId.length > 0) {
						if (response.AttachmentId.indexOf(',') > 0) {
							var arrAttachmentIds = response.AttachmentId.split(',');
							var attachments = [];
							for (var i = 0; i < arrAttachmentIds.length; i++) {
								attachments.push({ AttachmentId: arrAttachmentIds[i], File: i + 1 });
								//ExtHelper.HiddenForm.submit({ action: "downloadattachment.aspx?id=" + arrAttachmentIds[i] });
							}
							this.showAttachmentList(attachments);
						} else {
							ExtHelper.HiddenForm.submit({ action: EH.BuildUrl("DownloadAttachment") + "?id=" + response.AttachmentId });
						}
					} else {
						if (response.error) {
							Ext.Msg.alert('Alert', 'There is an some error coming in code produced by your report, Exception: ' + response.error);
						} else {
							Ext.Msg.alert('Alert', 'No report generated.');
						}
					}

					if (this.grid) {
						//this.grid.getStore().reload(); //To Be fixed permanently
						var store = this.grid.getStore();
						store.reload.defer(1000, store);
					}
				} else {
					if (response.error) {
						Ext.Msg.alert('Alert', 'There is an some error coming in code produced by your report, Exception: ' + response.error);
					} else {
						Ext.Msg.alert('Alert', 'No records found for processing');
					}
				}
			} else {
				var message = "Processing records..";
				if (records > 0) {
					if (startTime) {
						message = records + ' record(s) processed..' + '<br>Start Time: ' + startTime + '<br>Elapsed Time: ' + elapsedTime;
					} else {
						message = records + ' record(s) processed..';
					}
				}
				this.messageBar.updateText(message);

			}
		}
	}
});

DA.TaskConfig = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Task Config: {0}',
		listTitle: 'Task Config',
		keyColumn: 'TaskConfigId',
		captionColumn: null,
		controller: 'TaskConfig',
		gridPlugins: [new DA.form.plugins.Inline()],
		disableAdd: true,
		disableDelete: true,
		gridConfig: {
			plugins: [new Ext.grid.CheckColumn()]
		}
	});
	DA.TaskConfig.superclass.constructor.call(this, config);
};

Ext.extend(DA.TaskConfig, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'TaskConfigId', type: 'int' },
		{ name: 'TaskName', type: 'string' },
		{ name: 'IsActive', type: 'bool' },
		{ name: 'Frequency', type: 'string' },
		{ name: 'Hosts', type: 'string' },
		{ name: 'AppPaths', type: 'string' },
		{ name: 'RunAt', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ id: 0, header: 'Task Name', dataIndex: 'TaskName', width: 300 },
			new Ext.grid.CheckColumn({ id: '1', header: 'Is Active?', width: 60, dataIndex: 'IsActive' }),
			{ id: 2, header: 'Frequency (hh:mm:ss)', dataIndex: 'Frequency', width: 200, editor: new Ext.form.TextField({ vtype: 'frequency' }) },
			{ id: 3, header: 'Hosts', dataIndex: 'Hosts', width: 100, editor: new Ext.form.TextField() },
			{ id: 4, header: 'App Paths', dataIndex: 'AppPaths', width: 100, editor: new Ext.form.TextField() },
			{ id: 5, header: 'Run At', dataIndex: 'RunAt', width: 200, editor: new Ext.form.TextField() }
		]);

		return cm;
	}

});

DA.TaskConfig = new DA.TaskConfig();

DA.TaskRunner = Ext.extend(Object, {
	taskTitle: 'Processing',
	url: EH.BuildUrl('WithSessionReport'),
	params: {},
	onComplete: function (data, progress) {
		Ext.Msg.alert(this.taskTitle, this.translateComplete(data, progress));
	},
	translateComplete: function (data, progress) {
		return progress.Records + " record(s) processed.";
	},
	onFormSubmitFailure: function (form, action) {
		Ext.Msg.alert('Error', this.taskTitle + ' - An error has occurred');
	},
	onFormSubmitSuccess: function (form, action) {
		this.taskWin.hide();
		var json = Ext.util.JSON.decode(action.response.responseText);
		var data = json.data;
		var message = data.responseText;
		var status = data.status;
		if (data) {
			var importKey = data.importStatusKey;
			var task = {
				run: function () {
					Ext.Ajax.request({
						url: form.url,
						params: { importKey: importKey },
						callback: this.onTaskCallBack,
						scope: this
					});
				},
				interval: 5 * 1000,
				scope: this
			};
			this.task = Ext.TaskMgr.start(task);
			this.messageBar = Ext.Msg.wait("Running...", this.taskTitle);
		} else {
			Ext.Msg.alert('Error', message);
		}
	},
	onTaskCallBack: function (options, success, response) {
		var json = Ext.util.JSON.decode(response.responseText);
		var data = json.data;
		var progress = data.progress;
		var status = data.status;
		var error = data.exception;
		var isRunning = status === "Running";
		if (!isRunning) {
			Ext.TaskMgr.stop(this.task);
			this.messageBar.hide();
			delete this.messageBar;
			delete this.task;
		}
		if (error) {
			ExtHelper.OpenWindow({ id: 'ErrorWindow', title: 'Error', width: 600, height: 400, html: error, autoScroll: true, modal: true });
		} else {
			var records = progress.Records;
			var response = progress.Response;
			if (!isRunning) {
				if (response.error) {
					Ext.Msg.alert('Error', response.error);
					return;
				}
				if (records > 0) {
					var isCompleted = this.onComplete(data, progress);
					if (isCompleted) {
						return;
					}

					if (response.data) {
						Ext.Msg.alert('Alert', response.data);
					} else {
						Ext.Msg.alert('Error', 'Unexpected error');
					}
				}
				else {
					Ext.Msg.alert('Alert', 'No records found for processing');
				}
			} else {
				var message = "Processing records..";
				if (records > 0) {
					message = records + ' record(s) processed..';
				}
				this.messageBar.updateText(message);

			}
		}
	},
	start: function () {
		if (!this.form) {
			this.form = new Ext.form.FormPanel({
				url: this.url,
				height: 10,
				width: 10
			});
			this.taskWin = new Ext.Window({
				height: 10,
				width: 10,
				modal: true,
				items: [this.form],
				closeAction: 'hide'
			});
		}
		this.taskWin.show();
		this.form.form.submit({
			params: this.params,
			success: this.onFormSubmitSuccess,
			failure: this.onFormSubmitFailure,
			scope: this
		});
	}
});
