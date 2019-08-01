/*global Ext, document,location,window */
Ext.BLANK_IMAGE_URL = (function() {
	var baseUrl = "inc/ExtJS";
	if (Ext.version >= "3") {
		baseUrl += Ext.version.substr(0, 1);
	}
	return baseUrl + '/resources/images/default/s.gif';
} ());

// Allow short date formats for date input
Ext.form.DateField.prototype.altFormats += "|n/j/Y|n/j/y|n/j|n/J";

/**
* @constructor
**/
var ExtHelper = {
	version: "1.1",
	globalPageSize: true,
	DateFormat: 'm/d/Y',
	TimeFormat: 'h:i:s A',
	ShortTimeFormat: 'h:i A',
	ControllerExtension: ".ashx",
	ControllerBasePath: "",
	BuildUrl: function(name) {
		return ExtHelper.ControllerBasePath + "Controllers/" + name + ExtHelper.ControllerExtension;
	},
	gridPageSizes: [5, 10, 15, 20, 25, 50]
};

ExtHelper.DateTimeFormat = ExtHelper.DateFormat + ' ' + ExtHelper.TimeFormat;
ExtHelper.ShortDateTimeFormat = ExtHelper.DateFormat + ' ' + ExtHelper.ShortTimeFormat;


var EH = ExtHelper;

ExtHelper.GenericConnection = new Ext.data.Connection();

/**
* Makes a generic call
*/
ExtHelper.GenericCall = function(config) {
	config = Ext.applyIf(config, {
		title: config.params.action
	});

	var title = config.title;
	var loadingWindow = Ext.Msg.wait('Please wait.', title);
	config.callback = function(options, success, response) {
		loadingWindow.hide();
		if (!success) {
			Ext.Msg.alert('Error', response.statusText);
		} else {
			var jsonResponse = Ext.decode(response.responseText);
			if (!jsonResponse.success) {
				Ext.Msg.alert('Error', jsonResponse.info);
			} else {
				var handleDefault = config.handleSuccess;
				if (typeof (config.onSuccess) == 'function') {
					handleDefault = config.onSuccess.call({
						config: config,
						options: options,
						success: success,
						response: response,
						result: jsonResponse
					});
				}
				if (handleDefault) {
					if (jsonResponse.info && jsonResponse.info.length > 0) {
						Ext.Msg.alert(title, jsonResponse.info);
					}
				}
			}
		}
	};

	ExtHelper.GenericConnection.request(config);
};

/**
* Sets a value of combo box that has separate display value and item value but uses remote data source
*/
ExtHelper.SetComboValue = function(combo, value, callBackFn, scope) {

	var params = {};
	combo.lastQuery = null;
	params[combo.valueField] = value;
	combo.store.baseParams.query = "";
	combo.store.load({ params: params });

	var setInitValue = function(store, records, options) {
		combo.store.un('load', setInitValue);
		ExtHelper.SelectComboValue(combo, value);
		if (typeof callBackFn == 'function') {
			callBackFn.call(scope || combo, combo, value);
		}
	};

	combo.store.on('load', setInitValue);
};

/**
* This function searches the value in store and sets it for combo
* in addition, it also fires the select event so that complete lifecycle
* is followed
*/

ExtHelper.isMobile = {

	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (ExtHelper.isMobile.Android() || ExtHelper.isMobile.BlackBerry() || ExtHelper.isMobile.iOS() || ExtHelper.isMobile.Opera() || ExtHelper.isMobile.Windows());
	}
};
ExtHelper.SelectComboValue = function (combo, value) {
	if (!combo.el) {
		return;
	}
	combo.setValue(value);

	if (combo.getValue() + '' != 'false') {
		if (combo.store.baseParams) {
			if (combo.store.baseParams.comboType) {
				if (combo.getValue() == '0' && combo.allowZero !== true) {
					combo.clearValue();
				}
			}
		}
	}

	var record;
	var index;
	if (value !== null || (typeof value === 'string' && value.length > 0)) {
		record = combo.findRecord(combo.valueField, combo.value);
		if (!record && combo.valueField != 'LookupId' && combo.store.data.items.length == 1) {
			record = combo.store.getAt(0);
		}
		if (record) {
			index = combo.store.indexOf(record);
		} else {
			combo.setValue('');
		}
	}
	combo.validate();
	combo.fireEvent('select', combo, record, index);
};

/**
* Sets cascading combo. This should not be used any longer
*/
ExtHelper.SetCascadingCombo = function(parentCombo, child) {
	var baseParams = child.store.baseParams;
	if (typeof baseParams.ParentRecordType === 'undefined') {
		baseParams.ParentRecordType = parentCombo.store.baseParams.type || parentCombo.store.baseParams.recordType || parentCombo.store.baseParams.comboType;
		if (!baseParams.ParentRecordType && parentCombo.baseParams) {
			baseParams.ParentRecordType = parentCombo.baseParams.comboType;
		}
	}
	baseParams.ScopeId = parentCombo.getValue();

	child.store.on('beforeload', function(store, options) {
		store.baseParams.ScopeId = parentCombo.getValue();
	});

	parentCombo.on('select', function(combo, record, index) {
		child.lastQuery = null;
	});

	parentCombo.on('blur', function(combo) {
		if (combo.getValue() == '') {
			child.lastQuery = null;
		}
	});

	parentCombo.on('change', function(combo, newValue, oldValue) {
		if (oldValue != newValue) {
			child.setValue('');
		}
	});
};


/**
* Creates a simple store
*/
ExtHelper.SimpleStore = function(options, minValue, maxValue, increment) {
	var data;
	var inc = 1;
	var fieldType = "int";
	var i;
	if (increment) {
		inc = Number(increment);
	}
	var keyFieldId = 'LookupId';
	if (typeof (options) == 'string') {
		data = [];
		switch (options) {
			case "yesno":
				data.push([false, "No"]);
				data.push([true, "Yes"]);
				fieldType = "bool";
				keyFieldId = null;
				break;
			case "yesnoint":
				data.push([0, "No"]);
				data.push([1, "Yes"]);
				break;
			case "triple":
				data.push([255, "-"]);
				data.push([0, "No"]);
				data.push([1, "Yes"]);
				break;
			case "number":
				i = minValue;
				for (i = minValue; i <= maxValue; i = i + inc) {
					data.push([i, i + '']);
				}
				break;
			case "weekday":
				data.push([0, "Sunday"]);
				data.push([1, "Monday"]);
				data.push([2, "Tuesday"]);
				data.push([3, "Wednesday"]);
				data.push([4, "Thursday"]);
				data.push([5, "Friday"]);
				data.push([6, "Saturday"]);
				break;
			case "month":
				data.push([1, "Jan"]);
				data.push([2, "Feb"]);
				data.push([3, "Mar"]);
				data.push([4, "Apr"]);
				data.push([5, "May"]);
				data.push([6, "Jun"]);
				data.push([7, "Jul"]);
				data.push([8, "Aug"]);
				data.push([9, "Sep"]);
				data.push([10, "Oct"]);
				data.push([11, "Nov"]);
				data.push([12, "Dec"]);
				break;
			case "minutesDuration":
				i = minValue;
				var displayValue;
				for (i = minValue; i <= maxValue; i = i + inc) {
					if (i < 60) {
						displayValue = i + ' minutes';
					}
					else {
						displayValue = i / 60 + ' hours';
					}
					data.push([i, displayValue]);
				}
				data.push([1440, "Once a day"]);
				break;
		}
	} else {
		data = options;
	}
	for (var i = 0, len = data.length; i < len; i++) {
		data[i] = { LookupId: data[i][0], DisplayValue: data[i][1] };
	}
	return new Ext.data.JsonStore({ fields: [{ name: 'LookupId', type: fieldType }, { name: 'DisplayValue' }], data: data, id: keyFieldId });
};


ExtHelper.window = (function() {
	var msgCt;

	function createBox(t, s) {
		return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
	}
	return {
		msg: function(title, format) {
			if (!msgCt) {
				msgCt = Ext.DomHelper.insertFirst(document.body, { id: 'msg-div' }, true);
			}
			msgCt.alignTo(document, 't-t');
			var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
			var m = Ext.DomHelper.append(msgCt, { html: createBox(title, s) }, true);
			m.slideIn('t').pause(3).ghost("t", { remove: true });
		}
	};
} ());

ExtHelper.JoinStrings = function(separator) {
	var result = "";
	for (var i = 1; i < arguments.length; i++) {
		var argValue = arguments[i];
		if (argValue && argValue.length > 0) {
			if (result.length > 0) {
				result += separator;
			}
			result += argValue;
		}
	}
	return result;
};

ExtHelper.DefaultPageSize = function() {
	var pageSize = 20;
	if (Ext.state && Ext.state.Manager) {
		var value = Ext.state.Manager.get('PageSize');
		if (!isNaN(value)) {
			pageSize = value;
		}
	}
	return pageSize;
};

ExtHelper.CreateGrid = function (config, editable) {
	if (!config) {
		config = {};
	}

	if (config.editable) {
		editable = true;
	}

	var treeGrid = config.treeGrid === true;

	if (treeGrid) {
		Ext.applyIf(config, { master_column_id: 'Description' });
	}

	var ds = config.ds;
	if (!ds) {
		ds = Ext.copy({}, config, ['root', 'recordType', 'baseParams', 'reader', 'id', 'groupField', 'fields']);

		Ext.applyIf(ds, {
			root: "records",
			baseParams: {}
		});

		if (!ds.fields) {
			Ext.applyIf(ds, {
				recordType: ExtHelper.Record.Lookup
			});
		}
		if (!ds.reader) {
			var keyColumn;
			if (config.preserveSelection !== false) {
				if (config.daScope && config.daScope.keyColumn) {
					keyColumn = config.daScope.keyColumn;
				}
			}
			if (ds.fields) {
				ds.reader = new Ext.data.JsonReader({ totalProperty: "recordCount", root: ds.root, id: treeGrid ? "_id" : (ds.recordId || keyColumn), fields: ds.fields });
			} else {
				if (config && config.daScope && config.daScope.gridConfig && config.daScope.gridConfig.groupField) {
					ds.reader = new Ext.data.JsonReader({ totalProperty: "recordCount", root: ds.root, id: treeGrid ? "_id" : (ds.recordId) }, ds.recordType);
				} else {
					ds.reader = new Ext.data.JsonReader({ totalProperty: "recordCount", root: ds.root, id: treeGrid ? "_id" : (ds.recordId || keyColumn) }, ds.recordType);
				}
			}
		}
		if (config.controller) {
			ds.url = EH.BuildUrl(config.controller);
			if (config.allowPaging !== false) {
				Ext.applyIf(ds, { remoteSort: true });
			}
		}
		if (ds.groupField) {
			Ext.applyIf(ds, {
				sortInfo: { field: ds.groupField, direction: "ASC" }
			});
			if (ds.remoteSort && ds.remoteGroup !== false) {
				ds.remoteGroup = true;
			}
			if (config.multiGrouping) {
				ds = new Ext.ux.MultiGroupingStore(ds);
			} else {
				ds = new Ext.data.GroupingStore(ds);
			}
		} else if (treeGrid) {
			ds = new Ext.ux.maximgb.treegrid.AdjacencyListStore(ds);
		} else {
			ds = new Ext.data.Store(ds);
		}
		config.ds = ds;
	} else if (ds.url && config.allowPaging !== false) {
		ds.remoteSort = true;
	}

	Ext.applyIf(config, { loadMask: true });

	var allowPaging = config.allowPaging !== false && config.pageSize !== 0;
	delete config.allowPaging;

	var usingDefaultPageSize = false;
	if (!allowPaging) {
		config.pageSize = 0;
	} else if (typeof config.pageSize === 'undefined') {
		config.pageSize = ExtHelper.DefaultPageSize();
		usingDefaultPageSize = true;
	}

	if (config.defaultPlugins) {
		if (!config.plugins) {
			config.plugins = [];
		}
		var filterConfig = ExtHelper.CreateGridFilter({ cm: config.cm, recordType: config.recordType ? config.recordType : config.ds.recordType, treeDescriptionColumn: config.master_column_id, local: typeof config.controller === 'undefined' || allowPaging == false });
		config.gridFilter = filterConfig.gridFilters;
		config.multiFilters = filterConfig.multiFilters;
		config.plugins.push(config.gridFilter);
		if (config.multiFilters) {
			config.plugins.push(config.multiFilters);
		}
		config.plugins.push(ExtHelper.Plugins.ExceptionHandler);
	}

	var msg;
	if (!config.bbar && allowPaging) {
		var pagerPlugins = [];
		var arrPageSizes = config.gridPageSizes ? config.gridPageSizes : this.gridPageSizes;
		if (config.defaultPlugins || config.allowPageSize) {
			pagerPlugins.push(ExtHelper.Plugins.ExceptionHandler);
			var pageSizeChanger = new Ext.ux.Andrie.pPageSize({ variations: arrPageSizes });
			if (arrPageSizes) {
				pageSizeChanger.on('beforePageSizeChange', function (sender, args) {
					ExtHelper.SetPageSize(args.value);
				});
			}
			pagerPlugins.push(pageSizeChanger);
		}
		msg = config.caption || config.title;
		var displayMsg = 'Displaying ' + msg + ' {0} - {1} of {2}';
		var emptyMsg = "No " + msg + " to display";

		var bbarConfig = {
			pageSize: config.pageSize,
			plugins: pagerPlugins,
			store: config.ds,
			displayInfo: true,
			displayMsg: displayMsg,
			emptyMsg: emptyMsg
		};
		if (treeGrid) {
			config.bbar = new Ext.ux.maximgb.treegrid.PagingToolbar({
				store: config.ds,
				displayInfo: true,
				displayMsg: displayMsg,
				emptyMsg: emptyMsg
			});
		} else {
			config.bbar = new Ext.PagingToolbar(bbarConfig);
		}
	}
	if (config.enableLockingGrid) {
		var viewConfig = config.viewConfig || {};
		Ext.apply(config, {
			view: new Ext.grid.LockingGridView(config)
		});
	}
	if (config.groupField) {
		var viewConfig = config.viewConfig || {};
		if (config.multiGrouping) {
			Ext.apply(config, {
				view: new Ext.ux.MultiGroupingView(Ext.applyIf(viewConfig, {
					groupTextTpl: '{text} : {group} ({[values.rs.length]} {[values.rs.length > 1 ? "s" : ""]})'
				}))
			});
		}
		else {
			Ext.apply(config, {
				view: new Ext.grid.GroupingView(Ext.applyIf(viewConfig, {
					groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
				}))
			});
		}
	}

	if (config.preserveSelection !== false) {
		config.plugins.push(new Ext.ux.plugins.PreserveSelection());
	}
	//-------------------not allow grouping on float type fields
	if (config.cm && config.recordType) {
		for (var i = 0, len = config.cm.getColumnCount() ; i < len; i++) {
			var colId = config.cm.getColumnId(i);
			var col = config.cm.getColumnById(colId);
			var dataIndex = col.dataIndex;
			var field = config.recordType.getField(dataIndex);
			if (field && field.type === 'float') {
				col.groupable = false;
			}
		}
	}
	// create the Grid
	var grid;
	if (config.defaults && config.defaults.sort) {
		config.ds.setDefaultSort(config.defaults.sort.sort, config.defaults.sort.dir || 'ASC');
		//delete config.defaults.sort;
	}
	if (editable) {
		if (!config.clicksToEdit) {
			config.clicksToEdit = 1;
		}
		grid = new Ext.grid.EditorGridPanel(config);
	} else if (treeGrid) {
		grid = new Ext.ux.maximgb.treegrid.GridPanel(config);
	} else if (config.multiGrouping) {
		grid = new Ext.ux.MultiGroupingGrid(config);
	}
	else {
		grid = new Ext.grid.GridPanel(config);
	}
	if (allowPaging) {
		grid.on('resize', function (grid, adjWidth, adjHeight, rawWidth, rawHeight) {
			var bbar = grid.getBottomToolbar();
			if (adjWidth <= 500 && adjWidth > 400) {
				bbar.displayMsg = '{0} - {1} of {2}';
				bbar.emptyMsg = '';
			} else if (adjWidth <= 400) {
				bbar.displayMsg = '';
				bbar.emptyMsg = '';
			} else {
				bbar.displayMsg = 'Displaying ' + msg + ' {0} - {1} of {2}';
				bbar.emptyMsg = "No " + msg + " to display";
			}
		});
	}

	if (config.autoDisplay || config.grids) {
		grid.show();
		grid.loadFirst();
		if (config.grids && config.grids.length > 0) {
			var gridCount = config.grids.length + 1;
			grid.getStore().on('load', function (data) {
				var grids = grid.grids;
				var pageSize = grid.getBottomToolbar().pageSize;
				var startIndex = 0;
				if (grid.getStore().getCount() < pageSize) {
					pageSize = grid.getBottomToolbar().pageSize;
				}
				if (pageSize % gridCount == 0) {
					startIndex = (pageSize / gridCount);
				}
				else {
					startIndex = Math.floor(pageSize / gridCount);
				}
				for (var i = 0; i < gridCount - 1; i++) {
					grids[i].getStore().removeAll();
				}
				var endIndexForSecondGrid = startIndex * 2;
				var endIndex = pageSize;
				if (pageSize % gridCount == 2) {
					endIndexForSecondGrid = endIndexForSecondGrid + 1;
				}
				var recordsToMove = grid.getStore().getRange(parseInt(startIndex), endIndexForSecondGrid - 1);
				var recordsToMoveInLastGrid = grid.getStore().getRange(parseInt(endIndexForSecondGrid), endIndex - 1);
				
				for (i = 0; i < recordsToMove.length; i++) {
					if (recordsToMove[i]) {
						grids[0].getStore().add(recordsToMove[i]);
						grid.getStore().remove(recordsToMove[i]);
					}
				}
				for (i = 0; i < recordsToMoveInLastGrid.length; i++) {
					if (recordsToMoveInLastGrid[i]) {
						grids[1].getStore().add(recordsToMoveInLastGrid[i]);
						grid.getStore().remove(recordsToMoveInLastGrid[i]);
					}
				}
			});
		}

	}
	return grid;
};

Ext.ns("Ext.ux.plugins");
Ext.ux.plugins.PreserveSelection = Ext.extend(Object, {

	init: function (grid) {
		var store = grid.getStore();
		var sm = grid.getSelectionModel();

		this.grid = grid;
		store.on({
			'beforeload': this.onBeforeLoad,
			'load': this.onLoad,
			scope: this
		});
	},

	onBeforeLoad: function (store) {
		var grid = this.grid, sm = grid.getSelectionModel();
		if (typeof sm.getSelectedCell === 'function') {
			this.ids = sm.getSelectedCell();
		} else {
			var selections = sm.getSelections();
			var ids = [], record, i, len, idProperty = store.reader.meta.id;
			for (i = 0, len = selections.length; i < len; i++) {
				record = selections[i];
				ids.push(record.json[idProperty]);
			}
			this.ids = ids;
		}
	},

	onLoad: function (store) {
		var ids = this.ids;
		if (!ids) {
			return;
		}
		var grid = this.grid, sm = grid.getSelectionModel();
		var records = [];
		if (typeof sm.getSelectedCell === 'function') {
			sm.select(ids[0], ids[1]);
		} else {
			if (ids.length > 0) {
				var records = [], i, len, record, idProperty = store.reader.meta.id, index, recordCount = store.getCount();
				for (i = 0; i < recordCount; i++) {
					record = store.getAt(i);
					if (ids.indexOf(record.json[idProperty]) > -1) {
						records.push(record);
					}
				}
				sm.selectRecords(records);
			}
		}
		delete this.ids;
	}
});

Ext.grid.GridPanel.override({
	loadFirst: function(params) {
		var loadOptions = {
			params: {
				start: 0,
				limit: this.initialConfig.pageSize
			}
		};

		var bbar = this.getBottomToolbar();
		if (bbar instanceof Ext.PagingToolbar) {
			loadOptions.params.limit = bbar.pageSize;
		}

		// todo: Delete this
		if (params && params.callBackFn) {
			loadOptions.callback = function(r, options, success) {
				if (success) {
					params.callBackFn.call(this);
				}
			};
		}

		Ext.apply(loadOptions.params, params);
		delete loadOptions.params.callBackFn;

		this.getStore().load(loadOptions);
	}
});

ExtHelper.Redirect = function(href, qs) {
	document.location = href + (qs ? "?" + qs : "");
};

ExtHelper.CreateCombo = function(config, basicForm) {

	if (!config) {
		config = {};
	}

	if (!config.store) {
		var idProperty;
		if (!config.recordType) {
			if (config.displayField && config.valueField) {
				config.recordType = [config.displayField, config.valueField];
				idProperty = config.valueField;
			} else {
				config.recordType = ExtHelper.Record.Lookup;
				idProperty = 'LookupId';
			}
		}

		var dsConfig = {
			baseParams: config.baseParams || {},
			fields: config.recordType
		};

		if(idProperty) {
			dsConfig.id = idProperty;
		}
		if (config.controller) {
			Ext.apply(dsConfig, {
				totalProperty: 'recordCount',
				root: 'records',
				url: EH.BuildUrl(config.controller)
			});
		} else {
			config.mode = 'local';
		}
		config.store = new Ext.data.JsonStore(dsConfig);
	} else if (typeof (config.store) == 'string') {
		if (config.store == 'number' || config.store == 'minutesDuration') {
			config.store = ExtHelper.SimpleStore(config.store, config.storeMinValue, config.storeMaxValue, config.storeIncrement);
		} else {
			if (config.store == 'weekday') {
				//This is done to have SUNDAY (0) .. renderer ignores 0 otherwise
				config.considerZero = true;
			}
			config.store = ExtHelper.SimpleStore(config.store);
		}
		config.mode = 'local';
	} else if (Ext.isArray(config.store)) {
		config.store = ExtHelper.SimpleStore(config.store);
		config.mode = 'local';
	}

	config = Ext.applyIf(config, {
		typeAhead: config.mode == 'local',
		valueField: "LookupId",
		displayField: "DisplayValue",
		minChars: 1,
		queryDelay: config.mode == 'local' ? 10 : 200,
		typeAheadDelay: config.mode == 'local' ? 50 : 200,
		forceSelection: true
	});
	//if (config.mode === 'local') {
	config.triggerAction = 'all';
	//}

	if (config.disableIfNoValues && config.store.length === 0) {
		config.disabled = 'disabled';
	}
	if (!config.disablePaging && config.mode != 'local') {
		Ext.applyIf(config, { pageSize: ExtHelper.DefaultPageSize() });
	}

	return new Ext.form.ComboBox(config);
};

ExtHelper.SetPageSize = function(value) {
	if (Ext.state.Manager && this.globalPageSize) {
		Ext.state.Manager.set('PageSize', value);
	}
};

ExtHelper.GetParamValue = function(param) {
	param = param.toLowerCase();
	for (var propName in ExtHelper.Params) {
		if (propName.toLowerCase() == param) {
			return ExtHelper.Params[propName];
		}
	}
};

Ext.onReady(function() {

	Ext.QuickTips.init();

	Ext.form.Field.prototype.msgTarget = 'qtip';

	var getParams = document.URL.split("?");
	ExtHelper.Params = Ext.urlDecode(getParams[getParams.length - 1].replace(/\+/g, " ").replace("#", ""));
});

ExtHelper.OpenWindow = function(config, options) {
	var win;
	if (config.id) {
		win = Ext.getCmp(config.id);
	}
	if (!win) {
		if (config.iframeUrl) {
			config.items = [new Ext.ux.ManagedIframePanel({ defaultSrc: config.iframeUrl, loadMask: true })];
			config.layout = 'fit';
		}
		config.closeAction = config.closeAction ? config.closeAction : 'hide';
		win = new Ext.Window(config);
	} else {
		if (config.iframeUrl) {
			win.initialConfig.items[0].setSrc(config.iframeUrl);
		} else if (config.html) {
			win.body.update(config.html);
		}
	}
	if (!options) {
		options = {};
	}
	if (!options.hidden) {
		win.show();
	}
	return win;
};

//Here we define the functions for Re-login
ExtHelper.ReLogin = {
	gridToload: [],

	//set the focus on Password field
	setDefaultFocus: function () {
		var password = this.password;
		password.reset();
		password.focus(true, true);
	},

	//setKeymap: Is used if user press enter after entering password
	setKeymap: function (cmp) {
		var map = new Ext.KeyMap(
			cmp.el,
			[
				{
					key: [10, Ext.EventObject.ENTER],
					scope: this,
					fn: this.onReLogin
				}
			],
			"keydown"
		);
	},

	//onReLogin: Is a handler for login Button 
	onReLogin: function () {
		if (this.formPanel.form.isValid()) {
			var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Logging in...' });
			mask.show();
			this.formPanel.getForm().submit({
				success: function (from, response) {
					mask.hide();
					var result = response.result;
					if (result.success && result.message == 'Logged in') {
						this.loginPrompt.hide();
						//If last time user try to load a form here we reload that.
						if (this.options && this.options.action) {
							var action = this.options.action;
							var params = action.options.params;
							action.form.load({ params: params });
						}
						//If last time user try to load a grid(with child grid) here we reload those.
						if (this.gridToload.len != 0) {
							//Load only those grids which are not disabled
							for (var i = 0, len = this.gridToload.length; i < len; i++) {
								if (!this.gridToload[i].disabled) {
									this.gridToload[i].getStore().load();
								}
							}
						}
						//make the gridToload every time we do successfull login
						this.gridToload = [];
					}
					else {
						Ext.MessageBox.alert('Failed!', 'Please enter correct password', this.setDefaultFocus, this);
					}
				},
				failure: function (from, response) {
					mask.hide();
					Ext.MessageBox.alert('Failed!', 'Please enter correct password', this.setDefaultFocus, this);
				},
				scope: this
			});
		} else {
			Ext.MessageBox.alert('Errors', 'Please enter password', this.setDefaultFocus, this);
		}
	},

	//onExitClick: Is a handler for Quit Button 
	onExitClick: function () {
		ExtHelper.Redirect(location.href);
	},

	//openLoginPrompt: function is used to show the user a popup windo where he/she enter password again for re Login
	openLoginPrompt: function (options) {
		this.options = options;
		if (!this.loginPrompt) {
			var username = new Ext.form.Hidden({ name: 'Username', value: DA.Security.info.Tags.Username });
			var password = new Ext.form.TextField({ fieldLabel: 'Password', name: 'Password', inputType: 'password', allowBlank: false });
			this.password = password;
			var formPanel = new Ext.form.FormPanel({
				xtype: 'form',
				labelWidth: 70,
				bodyStyle: "padding:15px;",
				url: EH.BuildUrl('Login'),
				items: [
					username,
					password
				],
				buttons: [
					{ text: 'Quit', handler: this.onExitClick, scope: this },
					{ text: 'Login', handler: this.onReLogin, scope: this }
				]
			});
			this.formPanel = formPanel;
			this.loginPrompt = new Ext.Window({
				title: 'Session expired, Login to continue...',
				resizable: false,
				closable: false,
				items: formPanel,
				layout: 'fit',
				height: 110,
				width: 250,
				modal: true,
				closeAction: 'hide',
				draggable: 'false'
			});
			this.loginPrompt.on('activate', this.setKeymap, this);
		}
		this.setDefaultFocus();
		this.loginPrompt.show();
	}
};

ExtHelper.ValidateGrid = function (grid, options) {
	var ds = grid.getStore();
	var cm = grid.getColumnModel();
	var columnCount = cm.getColumnCount();
	var rowCount = ds.getCount();
	var isValid = true;
	var errorMessage = '';
	var startEditing = false;
	var emptyRecords = [];
	if (options) {
		startEditing = options.startEditing;
	}

	for (var row = 0; row < rowCount; row++) {
		var record = ds.getAt(row);
		// do not validate autoRecord if it hasn;t been modified

		if (record.dirty || (record.phantom !== undefined && !record.phantom)) {    //Empty rows adding on child grid on 2.3 version
			for (var col = 0; col < columnCount; col++) {
				if (cm.isCellEditable(col, row)) {
					var editor = cm.getCellEditor(col, row);
					var field = editor.field;
					var value = record.data[cm.getDataIndex(col)];
					if (field.validateValue && !field.validateValue(value)) {
						isValid = false;
						if (typeof (grid.getSelectionModel().select) == 'function') {
							grid.getSelectionModel().select(row, col);
						} else {
							grid.getSelectionModel().selectRow(row);
						}
						var cell = grid.getView().getCell(row, col);
						ExtHelper.ShowTip({ title: 'Error', text: cm.getColumnHeader(col) + " is invalid", showBy: cell });
						errorMessage = cm.getColumnHeader(col) + " is invalid";
						if (startEditing) {
							grid.startEditing(row, col);
						}
						break;
					}
				}
			}
		} else if (record.data.Id == 0 || record.data[grid.daScope.keyColumn] == 0) {
			emptyRecords.push(record);
		}
		if (!isValid) {
			break;
		}
	}
	//----Remove empty records from store
	for (var i = 0, len = emptyRecords.length; i < len; i++) {
		var emptyRecord = emptyRecords[i];
		ds.remove(emptyRecord);
	}
	return { IsValid: isValid, Message: errorMessage };
};

ExtHelper.Tip = new Ext.Tip({
	title: 'Error!',
	html: 'Error in grid'
});

ExtHelper.DelayHide = function(obj, hideDelay) {
	if (!hideDelay) {
		hideDelay = 4000;
	}
	if (!obj.hidden) {
		obj.hideTimer = obj.hide.defer(hideDelay, obj);
	}
};

ExtHelper.ShowTip = function(config) {
	var tip = ExtHelper.Tip;

	tip.setTitle(config.title);
	if (!tip.rendered) {
		tip.html = config.text;
	} else {
		tip.body.dom.innerHTML = config.text;
	}
	if (config.showBy) {
		tip.showBy(config.showBy, 'tl-bl');
	} else {
		if (!config.x) {
			config.x = 10;
		}
		if (!config.y) {
			config.y = 10;
		}

		tip.showAt([config.x, config.y]);
	}
	ExtHelper.DelayHide(tip);
};


ExtHelper.renderer = {};
ExtHelper.renderer.Date = Ext.util.Format.dateRenderer(ExtHelper.DateFormat);
ExtHelper.renderer.DateTime = function(v) {
	if (!Ext.isDate(v)) {
		return v;
	} else {
		return v.format(ExtHelper.DateTimeFormat);
	}
};
ExtHelper.renderer.ShortDateTime = function(v) {
	if (!Ext.isDate(v)) {
		return v;
	} else {
		return v.format(ExtHelper.ShortDateTimeFormat);
	}
};
ExtHelper.renderer.Time = Ext.util.Format.dateRenderer(ExtHelper.TimeFormat);
ExtHelper.renderer.ShortTime = Ext.util.Format.dateRenderer(ExtHelper.ShortTimeFormat);
ExtHelper.renderer.TimeString = function(v) {
	if (v) {
		var dateString = "1900/01/01 " + v;
		var t = new Date(dateString);
		return t.format(ExtHelper.ShortTimeFormat);
	} else {
		return '';
	}
};
ExtHelper.renderer.Boolean = function (value) { return value == 'true' || value === true || value == 1 ? 'Yes' : 'No'; };
ExtHelper.renderer.BooleanAsLink = function(v, m, r) {
	if (v) {
		m.css += " Hyperlink";
	}
	return v ? 'Yes' : 'No';
};
ExtHelper.renderer.Proxy = function(fieldName) {
	return function(v, m, r) {
		return r.get(fieldName);
	};
};
ExtHelper.renderer.AmountNonDecimal = function (value) {
	if (isNaN(value)) {
		value = 0;
	}
	return Ext.util.Format.usMoney(value).replace('.00', '').replace('$', '');
};

ExtHelper.renderer.AmountWithSign = function (value) {
	if (isNaN(value)) {
		value = 0;
	}
	return Ext.util.Format.usMoney(value);
};


ExtHelper.renderer.Decimal = function(value, meta) {
	meta.css += 'align-right';
	return typeof value === 'number' ? value.toFixed(2) : value;
};

ExtHelper.renderer.Float = function (precision, renderConfig) {
	if (typeof (renderConfig) === 'string') {
		renderConfig = { suffix: renderConfig };
	}
	var returnValue = function (value) {
		var v;
		if (!value) {
			value = 0;
		}
		if (!isNaN(value)) {
			v = parseFloat(value);
			v = v.toFixed(!precision || isNaN(precision) ? 2 : precision);
			if (precision === 0) {
				v = Number(v);
			}
			if (renderConfig) {
				if (renderConfig.prefix) {
					v = renderConfig.prefix + v;
				}
				if (renderConfig.suffix) {
					v = v + renderConfig.suffix;
				}
			}
		} else {
			v = value;
		}
		return v;
	};

	Ext.apply(returnValue, {
		rendererName: 'Float',
		info: { precision: precision }
	});

	return returnValue;
};
ExtHelper.renderer.DefaultHyperLink = function (cm) {
	var returnValue = function (value, meta, record, rowIndex, colIndex, store, name) {
		var fieldName = cm.config[colIndex].displayIndex;
		var fieldValue;
		var v;
		if (!fieldName) {
			fieldName = cm.config[colIndex].dataIndex;
		}
		var fType = record.fields.get(fieldName).type;
		var fieldNameformat = this.name.toLowerCase();
		if (fieldNameformat.indexOf('from') != -1) {
			fieldNameformat = "from";
		}
		if (fType == 'date') {
			if (fieldNameformat.indexOf('time') != -1 || fieldNameformat.indexOf('date') != -1 || fieldNameformat.indexOf('from') != -1) {

				switch (fieldNameformat) {
					case 'time':
						{
							fieldValue = ExtHelper.renderer.Time(value);
							break;
						}
					case 'from':
					case 'date':
						{
							fieldValue = ExtHelper.renderer.Date(value);
							break;
						}
					default:
						fieldValue = ExtHelper.renderer.DateTime(value);
						break;
				}
				v = '<a href="#">' + fieldValue + '</a>'
			}
		}
		else {
			v = '<a href="#">' + record.get(fieldName) + '</a>'
		}
		return v;
	};
	return returnValue;
};
ExtHelper.renderer.Amount = function (v) {
	if (isNaN(v)) {
		v = 0;
	}
	return Ext.ux.FormatNumber(v, 2);
};

ExtHelper.renderer.Password = function(value) {
	if (value && value.length > 0) {
		return "******";
	}
	else {
		return "";
	}
};

ExtHelper.renderer.ToolTip = function(options) {
	if (typeof options === 'string') {
		options = { tooltipField: arguments[0], valueField: arguments[1] };
	} else if (typeof options !== 'object') {
		options = {};
	}
	return function(value, meta, record) {
		var tooltipValue;
		if (options.valueField) {
			value = record.data[options.valueField];
		}
		tooltipValue = options.tooltipField ? record.data[options.tooltipField] : value;
		if (value === null || value === undefined) {
			value = "";
		}

		return "<span ext:qtip=\"<pre class='qtipwrap'>" + tooltipValue + "</pre>\">" + value + "</span>";

	};
};

ExtHelper.renderer.Hyperlink = function(baseLink, propertyName, propertyName2) {
	return function(value, meta, record) {
		if (propertyName) {
			if (propertyName2) {
				return String.format(baseLink, record.data[propertyName], record.data[propertyName2], value);
			}
			else {
				return String.format(baseLink, record.data[propertyName], value);
			}
		} else {
			return String.format(baseLink, value);
		}
	};
};
ExtHelper.renderer.ImpersonateHyperlink = function(baseLink) {
	return function(value, meta, record) {
		if (Number(value) !== 0) {
			return String.format(baseLink, value);
		}
		else {
			return '';
		}
	};
};
ExtHelper.renderer.AttachmentHyperlink = function(baseLink, blankText) {
	return function(value, meta, record) {
		var toReturn = blankText;
		if (Number(value) !== 0) {
			toReturn = String.format(baseLink, value);
		}
		return toReturn;
	};
};

ExtHelper.renderer.findMethods = {};

ExtHelper.renderer.findById = function (store, value) {
	return store.getById(value);
};

ExtHelper.renderer.findExact = function(valueField) {
	return function (store, value) {
		var data = store.snapshot || store.data;
		data = data.items;
		var record;
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i].data[valueField] === value) {
				record = data[i];
				break;
			}
		}
		return record;
	};
};

ExtHelper.renderer.ComboRenderer = function (options) { 
	var value = options.value;
	var combo = options.combo;
	var store = options.store;
	if (!store) {
		store = combo.store;
	}

	var returnValue = value;
	var valueField = combo.valueField;
	var navigateUrl = combo.navigateUrl;
	if (options.customValueField) {
		valueField = options.customValueField;
	}

	var idProperty = store.id, reader = store.reader, findRecord;
	if (reader) {
		idProperty = (reader.meta ? reader.meta.id : reader.id) || idProperty;
	}
	if (idProperty === valueField) {
		findRecord = ExtHelper.renderer.findById;
	} else {
		var findMethods = ExtHelper.renderer.findMethods;
		findRecord = findMethods[valueField];
		if (!findMethods[valueField]) {
			findRecord = ExtHelper.renderer.findExact(valueField);
			findMethods[valueField] = findRecord;
		}
	}

	var record = findRecord(combo.store, value);
	if (record) {
		if (navigateUrl) {
			return "<a href='#' onclick='" + String.format(navigateUrl, record.get(valueField)) + "'>" + record.get(combo.displayField) + "</a>";
		}
		return record.get(combo.displayField);
	}

	if ((value === 0 || value === "0") && combo.store && !combo.considerZero) {
		returnValue = '';
	}

	return returnValue;
};

ExtHelper.renderer.Combo = function(combo, valueField) {
	return function(value, meta, record) {
		return ExtHelper.renderer.ComboRenderer({ value: value, meta: meta, record: record, combo: combo, customValueField: valueField });
	};
};

ExtHelper.renderer.Lookup = function(config, scope) {
	config = Ext.applyIf(config, {
		valueField: 'LookupId',
		displayField: 'DisplayValue'
	});
	return function(value, meta, record) {
		var store;
		if (config.store) {
			store = config.store;
		} else {
			store = scope.comboStores[config.comboType];
		}
		var idProperty = store.id, reader = store.reader, findRecord, valueField = config.valueField;
		if (reader) {
			idProperty = (reader.meta ? reader.meta.id : reader.id) || idProperty;
		}
		if (idProperty === valueField) {
			findRecord = ExtHelper.renderer.findById;
		} else {
			var findMethods = ExtHelper.renderer.findMethods;
			findRecord = findMethods[valueField];
			if (!findMethods[valueField]) {
				findRecord = ExtHelper.renderer.findExact(valueField);
				findMethods[valueField] = findRecord;
			}
		}
		var rec = findRecord(store, value);
		if (rec) {
			return rec.get(config.displayField);
		} else {
			return value;
		}
	};
};

ExtHelper.renderer.SSN = function(v, m, r) {
	var toReturn = '';
	if (v && v.length > 0) {
		toReturn = v.substring(0, 3) + '-';
		toReturn += v.substring(3, 5) + '-';
		toReturn += v.substring(5, 9);
	}
	return toReturn;
};

ExtHelper.renderer.TimeRangeRenderer = function(dateField, startTimeField, endTimeField) {
	var returnValue = function(v, m, r) {
		v = [ExtHelper.renderer.Date(r.get(dateField))];
		var startTime = r.get(startTimeField);
		if (startTime) {
			v.push(' ');
			v.push(startTime.format(ExtHelper.ShortTimeFormat));

			var endTime = r.get(endTimeField);
			if (endTime) {
				v.push(' - ');
				v.push(endTime.format(ExtHelper.ShortTimeFormat));
			}
		}
		return v.join('');
	};
	Ext.apply(returnValue, {
		info: { dateField: dateField, startTimeField: startTimeField, endTimeField: endTimeField },
		rendererName: 'TimeRangeRenderer'
	});
	return returnValue;
};

ExtHelper.renderer.DateTimeRangeRenderer = function (dateField1, startTimeField, dateField2, endTimeField) {
	var returnValue = function (v, m, r) {
		v = [ExtHelper.renderer.Date(r.get(dateField1))];
		var startTime = r.get(startTimeField);
		if (startTime) {
			v.push(startTime.format(ExtHelper.ShortTimeFormat));
		}
		var v1 = [ExtHelper.renderer.Date(r.get(dateField2))];
		var endTime = r.get(endTimeField);
		if (endTime) {
			v1.push(endTime.format(ExtHelper.ShortTimeFormat));
		}
		var v2 = v + ' - ' + v1;
		var v3;
		if (v2.indexOf(',') > -1) {
			v3 = v2.replace(',', ' ');
		}
		else {
			v3 = v2;
		}
		var v4 = v3;
		var v5;
		if (v4.indexOf(',') > -1) {
			v5 = v4.replace(',', ' ');
		}
		else {
			v5 = v4;
		}
		var v6;
		if ([ExtHelper.renderer.Date(r.get(dateField2))][0] == "") {
			v6 = v5.replace('-', '');
		}
		else { v6 = v5; }
		return v6;
	};
	Ext.apply(returnValue, {
		info: { dateField1: dateField1, startTimeField1: startTimeField, dateField2: dateField2, endTimeField: endTimeField },
		rendererName: 'DateTimeRangeRenderer'
	});
	return returnValue;
};

// Config:
// fields: all-all fields, blank=Id, otherwise field array such as ['Id', 'Caption']
ExtHelper.CreateGridDragDrop = function(myForm, grid, type, ddGroup, gridAction, baseParams, config) {
	if (!config) {
		config = {};
	}
	if (!config.fields) {
		config.fields = ['Id'];
	}

	new Ext.dd.DropTarget(grid.getView().scroller, {
		dropAllowed: 'x-dd-drop-ok',
		ddGroup: ddGroup,
		notifyDrop: function(dd, e, data) {
			var ds1 = data.grid.getStore();
			var ds2 = grid.getStore();
			var items = [];
			var i, len;
			for (i = 0, len = data.selections.length; i < len; i++) {
				var record = data.selections[i];
				var dataToPush = {};
				if (config.fields == 'all') {
					dataToPush = record.data;
				} else {
					dataToPush = {};
					for (var col = 0; col < config.fields.length; col++) {
						var colName = config.fields[col];
						dataToPush[colName] = record.data[colName];
					}
				}
				items.push(dataToPush);
			}
			if (!config.cancelCallback) {
				var params;
				if (baseParams) {
					params = baseParams;
				} else {
					params = {};
				}
				params.Action = 'assignment';
				params.gridAction = gridAction;
				params.type = type;
				params.changes = Ext.util.JSON.encode(items);
				myForm.submit({
					params: params,
					clientValidation: false,
					waitMsg: 'Updating...',
					reset: false,
					failure: function(myForm, action) {
						var errorMessage = 'Unhandled exception';
						if (action.result && action.result.info) {
							errorMessage = action.result.info;
						}
						Ext.MessageBox.alert('Error', errorMessage);
					},
					success: function(myForm, action) {
						ds2.add(data.selections);
						for (var i = 0; i < data.selections.length; i++) {
							ds1.remove(data.selections[i]);
						}
					}
				});
			} else {
				ds2.add(data.selections);
				for (i = 0, len = data.selections.length; i < len; i++) {
					ds1.remove(data.selections[i]);
				}
			}
			return true;
		}
	});
};

ExtHelper.Record = {};

ExtHelper.Record.Lookup = [
	{ "name": "LookupId", "type": "int" },
	{ "name": "DisplayValue", "type": "string" },
	{ "name": "IsDefault", "type": "bool" },
	{ "name": "Description", "type": "string" },
	{ "name": "ReferenceValue", "type": "string" },
	{ "name": "SystemValue", "type": "string" },
	{ "name": "CustomStringValue", "type": "string" },
	{ "name": "CustomValue", "type": "int" },
	{ "name": "IsDeleted", "type": "int" }
];
ExtHelper.Record.LookupRecord = Ext.data.Record.create(ExtHelper.Record.Lookup);


ExtHelper.Plugins = {};

ExtHelper.Plugins.ComboLoader = {
	init: function(o) {
		var updateCombos = function(items, loadCombos, comboData) {
			if (!items) {
				return;
			}
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item) {
					if (item.xtype == 'combo' || item.constructor.xtype == 'combo') {
						var combo = item;
						var remotelyLoaded = false;
						var comboType = null;
						if (loadCombos) {
							comboType = combo.comboType || combo.store.baseParams.comboType;
							if (comboType) {
								var data = comboData[comboType];
								if (data) {
									combo.store.loadData(data);
									ExtHelper.SelectComboValue(combo, combo.getValue());
									remotelyLoaded = true;
								}
							}
						}
						var comboValue = combo.getValue();
						if (comboType && comboValue && comboValue == "0") {
							combo.clearValue();
						} else {
							if (!remotelyLoaded) {
								if (combo.mode == 'local') {
									ExtHelper.SelectComboValue(combo, comboValue);
								} else {
									ExtHelper.SetComboValue(combo, comboValue);
								}
							}
						}
					}
				}
			}
		};

		var formActionHandler = function(form, action) {
			var comboData = action.result.combos;
			var loadCombos = action.options.params.loadCombos && comboData;
			if (action.type == 'load') {
				var formItems = form.items.items;
				var defer = 0;
				// If there was combo data, we need to defer
				if (comboData) {
					for (var prop in comboData) {
						defer = 150;
						break;
					}
				}
				updateCombos.defer(defer, this, [formItems, loadCombos, comboData]);
				updateCombos.defer(defer, this, [form.combos, loadCombos, comboData]);
				form.combosLoaded = true;
			}
		};

		var xType = ExtHelper.GetXType(o);

		switch (xType) {
			case 'form':
				o.combosLoaded = false;
				o.on('beforeaction', function(form, action) {
					var params = action.options.params;
					if (!params) {
						params = {};
						action.options.params = params;
					}
					if (action.type == 'load') {
						params.loadCombos = !(form.combosLoaded);
					} else {
						params.loadCombos = false;
					}
				});
				o.on('actioncomplete', formActionHandler);
				break;
			case 'combo':
				if (!o.store) {
					o.store = new Ext.data.JsonStore({
						fields: o.fields ? o.fields : o.recordType ? o.recordType : ExtHelper.Record.Lookup,
						id: o.valueField || 'LookupId'
					});
				}
				o.mode = 'local';
				o.displayField = o.displayField ? o.displayField : 'DisplayValue';
				o.valueField = o.valueField ? o.valueField : 'LookupId';
				if (o.form) {
					if (!o.form.combos) {
						o.form.combos = [];
					}
					o.form.combos.push(o);
				}
				break;
			default:
				Ext.MsgBox.alert('Error', 'ComboLoader not supported for ' + xType);
				break;
		}
	}
};

ExtHelper.GetXType = function (o) {
	var xType;
	if (o instanceof Ext.BasicForm) {
		xType = 'form';
	} else {
		xType = o.getXType();
	}
	return xType;
};
ExtHelper.Plugins.ExceptionHandler = {
	exceptionHandler: function (proxy, options, response, e) {
		var message, responseText, openLoginPrompt = false, sessionMsg = 'Session has expired!';
		if (e && (e.name === 'SyntaxError')) {
			message = sessionMsg;
		} else if (options && options.reader && options.reader.jsonData && options.reader.jsonData.info) {
			message = options.reader.jsonData.info;
		}
		//Below we are checking in any reponse we are getting Session expired Message
		if (response) {
			responseText = response.responseText
			var responeInfo = Ext.decode(responseText);
			/* Checking if response if not null then only check for success or message from responseText */
			openLoginPrompt = responeInfo ? ((!responeInfo.success && responeInfo.info == sessionMsg) || message == sessionMsg) : message == sessionMsg;
		}

		//If user Session expired open the Re-login Window
		if (DA.App.ReLoginOnSessionExpired && openLoginPrompt) {
			ExtHelper.ReLogin.openLoginPrompt();
		} else {
			if (message) {
				buttons = [{ text: 'Ok', handler: function () { errorWin.hide(); } }];
			} else {
				var params = {};
				params.action = 'SendErrorEmail';
				params.responseText = responseText;
				params.controller = proxy.conn.url;
				params.params = Ext.util.JSON.encode(options.params);
				var buttons, errorWin;
				message = "An unhandled exception has occured.<br />Help us improve the system by sending us this error report.";
				buttons = [
					{
						text: 'Send error report',
						handler: function () {
							Ext.Ajax.request({
								url: EH.BuildUrl('LoginController'),
								params: params
							});
							errorWin.hide();
						}
					},
					{ text: 'Don\'t send', handler: function () { errorWin.hide(); } }
				];
			}
			errorWin = new Ext.Window({
				title: 'Error!',
				height: 210,
				width: 210,
				modal: true,
				html: message,
				closeAction: 'hide',
				bodyStyle: 'padding: 5px',
				iconCls: 'cancel',
				buttons: buttons
			});
			errorWin.show();
		}
	},

	onActionFailed: function (form, action) {
		var response = action.response;
		var message;
		var sessionExpiry = false;
		var result;
		var responeInfo = Ext.decode(response.responseText);
		var openLoginPrompt = !responeInfo.success && responeInfo.info == 'Session has expired!';
		switch (action.failureType) {
			case Ext.form.Action.CLIENT_INVALID:
				message = "Please correct data errors before continuing";
				break;
			case Ext.form.Action.LOAD_FAILURE:
				result = action.result;
				if (result && result.info && result.info.length > 0) {
					message = result.info;
				}
				break;
			default:
				result = action.result;
				var errors;
				if (result) {
					errors = result.errors;
				}
				if (result && result.info && result.info.length > 0) {
					message = result.info;
				} else {
					message = "";
				}
				if (errors && errors.length > 0) {
					message += "<table>";
					for (var i = 0; i < errors.length; i++) {
						var error = errors[i];
						message += "<tr><td>" + error.id + "</td><td>" + error.msg + "</td></tr>";
					}
					message += "</table>";
				}
				break;
		}
		if (message) {
			if (message == "Session has expired!") {
				sessionExpiry = true;
			}
			if (typeof this.beforeException !== 'undefined') {
				if (this.fireEvent("beforeException", this, response, message) !== true) {
					Ext.Msg.alert('Error', message, function () {
						if (sessionExpiry) {
							ExtHelper.Redirect(location.href);
						}
					});
				}
			} else {
				var obj = this;
				if (form.url == 'Controllers/Order.ashx') {
					obj = TLS.Order.formPanel;
				}
				var exceptionResponse = obj.fireEvent("beforeException", obj, response, message);
				if (typeof obj.events.beforeexception == 'undefined') {
					//If user Session expired open the Re-login Window
					if (DA.App.ReLoginOnSessionExpired && sessionExpiry) {
						ExtHelper.ReLogin.openLoginPrompt();
					}
					else {
						Ext.Msg.alert('Error', message);
					}
				}
				if (!exceptionResponse && message) {
					Ext.Msg.alert('Error', message);
				}
			}
		} else {
			//If user Session expired open the Re-login Window
			DA.App.ReLoginOnSessionExpired && openLoginPrompt ? ExtHelper.ReLogin.openLoginPrompt({ action: action }) : ExtHelper.OpenWindow({ id: 'ErrorWindow', title: 'Error', width: 600, height: 400, html: response.responseText, autoScroll: true, modal: true });
		}
		if (form.el) {
			form.el.focus();
		}
	},

	init: function (o) {
		var xType = ExtHelper.GetXType(o);
		switch (xType) {
			case 'grid':
			case 'editorgrid':
			case 'multiGroupingGrid':
			case 'ux-maximgb-treegrid':
				var ds = o.getStore();
				ExtHelper.ReLogin.gridToload.push(o);
				if (ds) {
					ds.on('loadexception', this.exceptionHandler, this);
				}
				break;
			case 'paging':
				// ignore
				break;
			case 'form':
				o.on('actionfailed', this.onActionFailed, o);
				break;
			default:
				Ext.Msg.alert('Error', 'ExceptionHandler not supported for ' + xType);
				break;
		}
	}
};

ExtHelper.GetSelectedIds = function(config) {
	var sm = config.grid.getSelectionModel();
	var selections = sm.getSelections();
	var ids = [], record;
	for (var i = 0, len = selections.length; i < len; i++) {
		record = selections[i];
		ids.push(record.get(config.id));
	}
	return ids.join(",");
};

ExtHelper.CreateGridFilter = function (config) {
	var cm = config.cm;
	var recordType = config.recordType;
	var treeDescriptionColumn = config.treeDescriptionColumn;

	var filterCols = [];
	for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
		var colId = cm.getColumnId(i);
		var col = cm.getColumnById(colId);
		var dataIndex = col.dataIndex;
		if (dataIndex && dataIndex !== treeDescriptionColumn) {
			var field = recordType.getField(dataIndex);
			if (field) {
				var type = recordType.getField(dataIndex).type;

				var editor = cm.getCellEditor(i, 0);
				var store = (editor && editor.field && editor.field.store) ? editor.field.store : col.store;

				if (store) {
					type = (col.disableStoreFilter === true) ? 'string' : 'enum';
				}
				if (col.ignoreFilter) {
					type = '';
				}
				switch (type) {
					case 'string':
					case 'date':
						if ((editor && editor.field && editor.field instanceof Ext.form.TimeField) || col.renderer == ExtHelper.renderer.Time) {
							filterCols.push({ type: 'Time', dataIndex: dataIndex, cm: cm });
						} else {
							var filter = { type: type, dataIndex: dataIndex, cm: cm };
							if (col.disableStoreFilter === true && col.displayIndex) {
								filter.proxyCol = col.displayIndex;
							}
							filterCols.push(filter);
						}
						break;
					case 'bool':
						filterCols.push({ type: 'Boolean', dataIndex: dataIndex });
						break;
					case 'int':
					case 'float':
						filterCols.push({ type: 'numeric', dataIndex: dataIndex });
						break;
					case 'enum':
						if (editor && editor.field && editor.field instanceof Ext.form.TimeField) {
							filterCols.push({ type: 'Time', dataIndex: dataIndex });
						}
						else if (editor && editor.field.mode == 'remote') {
							var cfg = { type: 'string', dataIndex: dataIndex };
							var proxyCol = col.displayIndex;
							if (proxyCol) {
								cfg.proxyCol = proxyCol;
							}
							filterCols.push(cfg);
						} else if (store.mode === 'local') {
							var displayField = col.displayIndex || store.fields.itemAt(1).name;
							var filterOptions = [];
							var data = store.snapshot || store.data;
							data = data.items;
							for (var row = 0, rows = data.length; row < rows; row++) {
								var rowData = data[row];
								filterOptions.push([rowData.id, rowData.data[displayField]]);
							}
							filterCols.push({ type: 'list', dataIndex: dataIndex, options: filterOptions, labelField: displayField });
						} else {
							filterCols.push({ type: 'list', dataIndex: dataIndex, store: store, labelField: 'DisplayValue', valueField: 'LookupId', loaded: store.mode !== 'remote' });
						}
						break;
				}
			}
		}
	}
	
	var filterConfig = {
		gridFilters : new Ext.ux.grid.GridFilters({ filters: filterCols, local: config.local }),
		multiFilters: new Ext.ux.grid.MultiGridFilters({ filters: filterCols, local: config.local })
	}
	//var filters = new Ext.ux.grid.GridFilters({ filters: filterCols, local: config.local });
	//filters =new  Ext.ux.grid.MultiGridFilters({ filters: filterCols, local: config.local })
	//var filters = new Ext.ux.grid.MultiGridFilters({ filters: filterCols, local: config.local });
	return filterConfig;
};

ExtHelper.AddStoreChangeHandler = function(config) {
	var ds = config.ds;
	if (!ds) {
		var grid = config.grid;
		if (grid) {
			ds = grid.getStore();
		}
	}
	var fn = config.fn;
	ds.on('datachanged', fn);
	ds.on('add', fn);
	ds.on('clear', fn);
	ds.on('load', fn);
	ds.on('update', fn);
	ds.on('remove', fn);
};

ExtHelper.onBeforeEditCancel = function(e) {
	e.cancel = true;
};

ExtHelper.DisableGrid = function(grid) {
	// Avoid multiple event handlers on same grid
	if (!grid.isDisabled) {
		grid.isDisabled = true;
		grid.on('beforeedit', ExtHelper.onBeforeEditCancel);
	}
};


ExtHelper.EnableGrid = function(grid) {
	grid.isDisabled = false;
	grid.un('beforeedit', ExtHelper.onBeforeEditCancel);
};

ExtHelper.EnableDisableGrid = function(options) {
	var grid = options.grid;
	var enabled = options.enabled === true;
	if (grid.getXType() == 'editorgrid') {
		if (options.enabled) {
			ExtHelper.EnableGrid(options.grid);
		}
		else {
			ExtHelper.DisableGrid(options.grid);
		}
	}
	var toolbar = grid.getTopToolbar();
	if (toolbar) {
		if (Ext.isArray(toolbar)) {
			toolbar = new Ext.Toolbar({ disabled: !enabled, buttons: toolbar });
			grid.topToolbar = toolbar;
		} else {
			toolbar.setDisabled(!enabled);
		}
	}
};
// Get Selected Row from list
ExtHelper.GetSelectedRowsValues = function (grid, Col) {
	var selectedRecords = grid.getSelectionModel().getSelections();
	var ids = '';
	if (selectedRecords && selectedRecords.length > 0) {
		for (var i = 0; i < selectedRecords.length; i++) {
			ids += selectedRecords[i].get(Col) + ',';
		}
		if (ids.length > 0) {
			//Removing last comma
			ids = ids.substring(0, ids.length - 1);
		}
	}
	return ids;
};
ExtHelper.GetModifiedRows = function(config) {
	Ext.applyIf(config, {
		/**
		* @cfg {Ext.grid.EditorGrid} grid Grid
		**/
		/**
		* @cfg {String} keyField Defaults to "Id". Used to identify if the record is new
		**/
		/**
		* @cfg {Boolean} includeId Whether to send the client id as well
		**/
		/**
		* @cfg {Array} fields List of fields to send. Defaults to all. You can also specify 'modified' to send only modified fields
		**/
		fields: 'all'
	});
	var ds = config.grid.getStore();
	var rows = ds.getCount();
	var lineItems = [];
	var fields = ds.fields;
	var fieldCount = fields.getCount();
	var keyField = config.keyField;
	var allFields = config.fields === 'all';
	var checkModified = config.checkModified === true;
	for (var row = 0; row < rows; row++) {
		var record = ds.getAt(row);
		var addRow = false;
		var i, field;
		if (record.dirty || ((config.all || Number(record.data[keyField]) === 0) && !record.phantom)) {
			/* cleanse it */
			var data = {};
			if (allFields) {
				Ext.apply(data, record.data);
				addRow = true;
			} else if (config.fields == 'modified') {
				for (i = 0; i < fieldCount; i++) {
					field = fields.get(i);
					if (field.name == keyField || typeof (record.modified[field.name]) !== 'undefined') {
						data[field.name] = record.get(field.name);
						addRow = true;
					}
				}
			} else if (Ext.isArray(config.fields)) {
				for (i = 0; i < config.fields.length; i++) {
					if (typeof (record.modified[config.fields[i]]) !== 'undefined' || !checkModified) {
						data[fields[i]] = record.get(config.fields[i]);
						addRow = true;
					}
				}
			}

			if (addRow || !checkModified) {
				for (i = 0; i < fieldCount; i++) {
					field = fields.get(i);
					if (typeof (data[field.name]) !== 'undefined') {
						switch (field.type) {
							case "int":
							case "float":
								if (data[field.name] === null || data[field.name] === "") {
									data[field.name] = 0;
								}
						}
					}
				}
				lineItems.push(data);
				if (config.includeId) {
					data.id = record.get(keyField);
				}
			}
		}
	}
	if (config.encoded) {
		return Ext.util.JSON.encode(lineItems);
	} else {
		return lineItems;
	}
};

ExtHelper.DisableForm = function(form) {
	form.items.each(function(f) {
		if (f.isFormField) {
			f.disable();
		}
	});
};
ExtHelper.FormReadOnly = function(form) {
	form.items.each(function(f) {
		if (f.xtype == 'combo' || f.constructor.xtype == 'combo') {
			f.disable();
		} else {
			if (f.isFormField) {
				f.setReadOnly(true);
			}
		}
	});
};

ExtHelper.EnableDisableForm = function(options) {
	var disabled = options.enabled !== true;
	options.form.items.each(function(f) {
		if (f.isFormField) {
			f.setDisabled(disabled);
		}
	});
};

ExtHelper.DisableFields = function(options) {
	var container = options.container;
	var disabled = options.disabled !== false;
	var fields = container.findBy(function(item) { return item.isFormField; });
	Ext.each(fields, function(field) { field.setDisabled(disabled); });
};

ExtHelper.ApplyCompareValidator = function(field, compareTo, message, operator) {
	ExtHelper.CompareValidator({ field: field, compareTo: compareTo, message: message, operator: operator || "=" });
};

ExtHelper.NormalizeFieldValue = function(field, value) {
	switch (ExtHelper.GetXType(field)) {
		case "timefield":
		case "datefield":
			if (value.length > 0) {
				value = field.parseDate(value);
			}
	}
	return value;
};

ExtHelper.CompareValidator = function(config) {
	var field = config.field;
	var compareTo = config.compareTo;
	var message = config.message;
	var operator = config.operator || "=";
	if (!message) {
		var fieldCaption = config.field.fieldLabel;
		var compareToCaption = config.field.fieldLabel;
		var comparisonType;
		switch (operator) {
			case "=":
				comparisonType = "equal to";
				break;
			case ">":
				comparisonType = "greater than";
				break;
			case ">=":
				comparisonType = "greater than or equal to";
				break;
			case "<=":
				comparisonType = "less than or equal to";
				break;
			case "<":
				comparisonType = "less than";
				break;
			default:
				comparisonType = "unknown";
				break;
		}

		message = String.format("{0} must be {1} {2}", fieldCaption, comparisonType, compareToCaption);
	}

	compareTo.on('blur', function() {
		if (operator == "=") {
			if (compareTo.getValue().length !== 0) {
				field.allowBlank = false;
			} else {
				field.allowBlank = compareTo.allowBlank;
			}
		}
		field.validate();
	});

	field.validator = function(value) {
		var isValid = false;
		var compareToValue = compareTo.getValue();

		value = ExtHelper.NormalizeFieldValue(field, value);
		compareToValue = ExtHelper.NormalizeFieldValue(compareTo, compareToValue);

		switch (operator) {
			case "=":
				isValid = value == compareToValue;
				break;
			case ">":
				isValid = (compareToValue.length !== undefined && compareToValue.length === 0) || value > compareToValue;
				break;
			case ">=":
				isValid = (compareToValue.length !== undefined && compareToValue.length === 0) || value >= compareToValue;
				break;
			case "<":
				isValid = (compareToValue.length !== undefined && compareToValue.length === 0) || value < compareToValue;
				break;
			case "<=":
				isValid = (compareToValue.length !== undefined && compareToValue.length === 0) || value <= compareToValue;
				break;
			default:
				isValid = true;
		}
		if (isValid) {
			return true;
		} else {
			return message;
		}
	};
};

ExtHelper.HiddenForm = {
	submit: function (options) {
		var formElem = this.formElem;
		var hiddenField = this.hiddenField;

		var paramName = options.parameterName || "params";

		if (!formElem) {
			formElem = Ext.get(document.body).createChild({
				tag: 'form',
				method: 'post',
				action: options.action
			});

			hiddenField = formElem.createChild({
				tag: 'input',
				type: 'hidden',
				name: paramName,
				id: paramName
			});

			this.formElem = formElem;
			this.hiddenField = hiddenField;
		}

		formElem.dom.action = options.action;
		hiddenField.dom.name = paramName;
		hiddenField.dom.id = paramName;

		if (Ext.isChrome && !options.target) {
			options.target = 'report_win'; //related to ticket 4184 issue we removed "_self", it's creating issue on form local
		}

		formElem.dom.target = options.target || "_blank";

		hiddenField.dom.value = Ext.encode(options.params);
		formElem.dom.submit();
	}
};


ExtHelper.ExportGrid = function (grid, options) {
	Ext.ux.util.Export.Execute({ grids: [grid], options: options });
};

Ext.ns("EH.grid.plugins");

EH.grid.plugins.AutoConfigureGrid = Ext.extend(Ext.util.Observable, {

	init: function (grid) {

		// If no columns defined, setup an empty column model
		if (!grid.colModel) {
			grid.colModel = new Ext.grid.ColumnModel([]);
		}

		// register to the store's metachange event
		if (grid.store) {
			grid.store.on("metachange", this.onMetaChange, grid);
		}
	},

	onMetaChange: function (store, meta) {
		if (meta.columns) {

			var cols = meta.columns;
			for (var i = 0, len = cols.length; i < len; i++) {
				var col = cols[i];
				var renderer = col.renderer;
				if (renderer && renderer.indexOf(".") > 0) {
					col.renderer = eval(renderer);
				}
				var summaryRenderer = col.summaryRenderer;
				if (summaryRenderer && summaryRenderer.indexOf(".") > 0) {
					col.summaryRenderer = eval(summaryRenderer);
				}
			}

			this.colModel.setConfig(cols);

			// Re-render grid
			if (this.rendered) {
				this.view.refresh(true);
			}
		}
	}
});

Ext.ns("EH.form");

EH.form.MultiFieldValidator = function(options) {
	var dependencies = options.dependencies;
	var validator = options.validator;
	var recursive = false;
	return function(value) {
		var message = validator.call(this, value);
		if (!recursive) {
			recursive = true;
			for (var i = 0; i < dependencies.length; i++) {
				var field = dependencies[i];
				if (field != this) {
					field.validate();
				}
			}
			recursive = false;
		}
		return message ? message : true;
	};
};

EH.SetFieldValue = function(options) {
	var field = options.field;
	var value = options.value;

	if (value == '0') {
		if (typeof (field.clearValue) == 'function' && field.comboType || (field.store && field.store.baseParams && field.store.baseParams.comboType)) {
			if (field.el) {
				field.clearValue();
			} else {
				field.setValue('');
			}
			return;
		}
	}
	if (field.controller) {
		ExtHelper.SetComboValue(field, value);
	} else {
		field.setValue(value);
	}
	return;
};

// Example usage:
//  grid.on('beforeedit', EH.grid.CascadingCombo, {'State': 'CountryId'});
// In this, state is the field name and CountryId is the parent value

EH.grid.CascadingCombo = function(e, options) {
	var field = e.field;
	var record = e.record;

	if (options === undefined) {
		options = this;
	}

	if (options[field]) {
		var info = options[field];
		if (typeof info == 'string') {
			info = { field: info };
		}
		var combo = e.grid.getColumnModel().getCellEditor(e.column, e.row).field;
		var parentValue = record.get(info.field);
		var store = combo.store;

		// If a different country, reload the store
		if (store.baseParams.ScopeId != parentValue) {
			store.baseParams.ScopeId = parentValue;
			var loadOptions = {};
			if (info.setValue) {
				var value = record.get(field);
				loadOptions.callback = function() {
					if (!combo.isExpanded()) {
						combo.expand();
					}
					combo.selectByValue(value);
				};
			}
			if (combo.pageSize) {// Pass start/limit in CascadingCombo Child combo if we use Tab.- Ticket no #5914 in TLS. 
				loadOptions.params = {
					start: 0,
					limit: combo.pageSize
				}
			}
			store.load(loadOptions);
		} else {
			if (combo.hasFocus && combo.list) {
				combo.expand();
			}
		}
	}
};

ExtHelper.ShowYesNo = function(options) {
	var yesFn = options.yesFn;

	Ext.applyIf(options, {
		buttons: Ext.Msg.YESNO,
		fn: function(btn) {
			if (btn === 'yes') {
				yesFn.call(this, options.scope || this);
			}
		},
		animEl: 'elId',
		icon: Ext.MessageBox.QUESTION
	});
	Ext.Msg.show(options);
};

EH.SelectDefaultComboValue = function(combo) {
	var lookupId = 0;
	combo.store.findBy(function(record) {
		if (record.get('IsDefault')) {
			lookupId = record.get('LookupId');
			return true;
		}
	});
	EH.SelectComboValue(combo, lookupId);
};

EH.HasDuplicateRecords = function (options) {
	var temp = {};
	var grid = options.grid;
	var store = grid.getStore();
	var cols = options.cols;
	var hasError = false;
	var validate = true;
	var rowIndex = 0;
	var isIgnoreZero = options.isIgnoreZero;

	store.each(function (record) {
		if (record.get('Id') > 0 || record.dirty || (record.phantom !== undefined && !record.phantom)) {
			validate = true;
			if (typeof options.extraCheck == 'function') {
				validate = options.extraCheck.call(this, record);
			}
			if (validate) {
				var uniqueKey = '';
				for (var i = 0, len = cols.length; i < len; i++) {
					uniqueKey += '_' + record.get(cols[i]);
				}
				// ignore the records that have 0 or blank Id.
				if (isIgnoreZero && (uniqueKey === '_0' || uniqueKey === '_') ) {
					hasError = false;
				}
				else if (temp[uniqueKey]) {
					if (options.tabPanel) {
						var tabPanel = options.tabPanel;
						tabPanel.activate(options.panelIndex);

						//For Filtered Parent / Child Grids
						var parentGrid = options.parentGrid;
						if (parentGrid) {
							parentGrid.focus();
							parentGrid.startEditing(0, 0);
						}
					}
					hasError = true;
					return false;
				}
				temp[uniqueKey] = true;
			}
			rowIndex++;
		}
	});
	if (hasError) {
		grid.startEditing(rowIndex, 0);
	}
	return hasError;
};

//Works for Max Two Columns Compare
EH.HasSameColumnValues = function(options) {
	var grid = options.grid;
	var store = grid.getStore();
	var cols = options.cols;
	var hasError = false;
	var rowIndex = 0;
	var colIndex = 0;
	store.each(function(record) {
		if (record.get(cols[0]) === record.get(cols[1]) && (record.dirty && !record.phantom)) {
			hasError = true;
			grid.focus();
			grid.startEditing(colIndex, rowIndex);
			return false;
		}
		rowIndex++;
	});
	return hasError;
};


EH.ExceedsMaxSum = function(options) {
	var temp = {};
	var grid = options.grid;
	var store = grid.getStore();
	var cols = options.cols;
	var sumCol = options.sumCol;
	var maxSumEach = options.maxSumEach;
	var hasError = false;

	//Creating an array for each unique key, value set to sumCol (Value)
	store.each(function(record) {
		var uniqueKey = '';
		for (var i = 0, len = cols.length; i < len; i++) {
			uniqueKey += '_' + record.get(cols[i]); //Date + TaskId
		}
		if (!temp[uniqueKey]) {
			temp[uniqueKey] = 0;
		}
		temp[uniqueKey] += record.get(sumCol); //Add value
		if (temp[uniqueKey] > maxSumEach) {
			hasError = true;
			return false;
		}
	});

	return hasError;
};

EH.ExceedsMaxSumAllowed = function(options) {
	var temp = {};
	var grid = options.grid;
	var store = grid.getStore();
	var cols = options.cols;
	var anotherGrid = options.anotherGrid;
	var anotherStore = anotherGrid.getStore();
	var compareColumn = options.compareColumn;
	var sumCol = options.sumCol;
	var maxSumEach = options.maxSumEach;
	var hasError = false;

	//Creating an array for each unique key, value set to sumCol (Value)
	store.each(function(record) {
		var uniqueKey = '';
		for (var i = 0; i < cols.length; i++) {
			uniqueKey += record.get(cols[i]); //TaskId
		}
		if (!temp[uniqueKey]) {
			temp[uniqueKey] = 0;
		}
		temp[uniqueKey] += record.get(sumCol); //Add value
	});

	//Checking each row from max allowed column in another store
	for (var key in temp) {
		anotherStore.each(function(anotherRecord) {
			if (key == anotherRecord.get(compareColumn)) {
				if (temp[key] > anotherRecord.get(maxSumEach)) {
					hasError = true;
				}
			}
		});
	}

	//If No Error Found, do a check if row even exists in another grid or not
	if (!hasError) {
		for (var key in temp) {
			var foundInAllowed = false;
			anotherStore.each(function(anotherRecord) {
				if (key == anotherRecord.get(compareColumn)) {
					foundInAllowed = true;
				}
			});
			if (!foundInAllowed) {
				hasError = true;
				break;
			}
		}
	}

	return hasError;
};


EH.ExistsInCSV = function(options) {
	var stringValue = ',' + options.stringValue + ',';
	var value = ',' + options.value + ',';
	return stringValue.indexOf(value, 0) > -1;
};

EH.DateDiff = (function() {
	var diffValues = {
		M: 1000 * 60, /* Minute */
		D: 1000 * 60 * 60 * 24
	};

	return function(options) {
		var diffType = options.diffType || 'D';

		// Convert both dates to milliseconds
		var date1 = Ext.isDate(options.startDate) ? options.startDate : new Date(options.startDate);
		var date2 = Ext.isDate(options.endDate) ? options.endDate : new Date(options.endDate);

		// Calculate the difference in milliseconds
		var diff = Math.abs(date1 - date2);

		// Convert back to days and return
		return Math.round(diff / diffValues[diffType]);
	};
} ());

EH.OpenPopup = function(options) {
	var imageWin = window.open(options.fileName, options.winName, options.features);
	if (!imageWin) {
		Ext.MessageBox.alert('Error', 'Please disable popup blockers');
	}
	return imageWin;
};

EH.ConcatDateTime = function(date, time) {
	var toReturn = date;

	//Making time as midnight 0
	if (toReturn) {
		toReturn = toReturn.add(Date.HOUR, -toReturn.getHours());
		toReturn = toReturn.add(Date.MINUTE, -toReturn.getMinutes());
		toReturn = toReturn.add(Date.SECOND, -toReturn.getSeconds());

		//Adding the Time
		if (time.length > 0) {
			var timeSplit = time.split(':');
			var timeSplit1 = timeSplit[1].split(' ');
			toReturn = toReturn.add(Date.MINUTE, Number(timeSplit1[0]));
			if (timeSplit1[1] == 'AM') {
				if (timeSplit[0] < 12) {
					toReturn = toReturn.add(Date.HOUR, Number(timeSplit[0]));
				}
			}
			else if (timeSplit1[1] == 'PM') {
				toReturn = toReturn.add(Date.HOUR, Number(timeSplit[0]));
				if (timeSplit[0] < 12) {
					toReturn = toReturn.add(Date.HOUR, 12);
				}
			}
		}
	}
	return toReturn;
};

EH.OpenReport = function (options) {
	var params = options.params;
	var target = '';
	if (options.openInWindow) {
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

	if (!options.saveToAttachments) {
		ExtHelper.HiddenForm.submit({
			target: target,
			params: params,
			action: 'Report.ashx'
		});
	} else  {
		ExtHelper.GenericConnection.request({
			url: 'Report.ashx',
			params: params,
			callback: function (o, success, response) {
				if (!success) {
					Ext.Msg.alert('An error occured', 'An error occured');
				}
				else {
					var jsonResponse = Ext.decode(response.responseText);
					if (params.ShowPrintResults) {
						if (jsonResponse.data.AttachmentId > 0) {
							ExtHelper.HiddenForm.submit({
								target: target,
								action: EH.BuildUrl('DownloadAttachment') + '?id=' + jsonResponse.data.AttachmentId,
								params: {}
							});
						}
						if (typeof (params.afterProcess) == 'function') {
							params.afterProcess.apply(null, [jsonResponse.data])
						}
						
					} else if (jsonResponse.data) {
						Ext.Msg.alert('Info', jsonResponse.data);
					} else {
						ExtHelper.HiddenForm.submit({
							target: target,
							action: EH.BuildUrl('DownloadAttachment') + '?id=' + response.responseText,
							params: {}
						});
					}
					if (typeof (options.callbackFn) == 'function') {
						options.callbackFn.call();
					}
				}
			},
			timeout: 1200000,
			scope: this
		});
	}
	
}
Ext.apply(Ext.form.VTypes, {
	frequencyValue: /^[0-9]\d?-\d{7}$/,
	frequencyText: 'Frequency not in correct format, Must be in the format (hh:mm:ss)',
	frequency: function (v) {
		return ExtHelper.fnFrequencyValidator(v);
	}
});
ExtHelper.fnFrequencyValidator = function (record) {
	var returnValue = false;
	var frequency = record;
	var frequencys = [];
	var errorFound = false;
	var hr, mm, sec;
	frequencys = frequency.split(':');
	if (frequencys.length == 3) {
		if (frequencys.length >= 1) {
			if (frequencys[2].trim().length > 0) {
				hr = frequencys[0].trim();
			}
			else {
				errorFound =true;
			}
		}
		if (frequencys.length >= 2) {
			if (frequencys[1].trim().length > 0) {
				mm = frequencys[1].trim();
			} else {
				errorFound =true;
			}
		}
		if (frequencys.length >= 3) {
			if (frequencys[2].trim().length > 0) {
				sec = frequencys[2].trim();
			} else {
				errorFound =true;
			}
		}
		else if (hr >= 24) {
			errorFound =true;
		}
	}
	else {
		errorFound =true;
	}
	if (!errorFound) {
		returnValue = true;
	}
	return returnValue;
};
this.groupData;
ExtHelper.onGroupRowColor = function (recordData, rowIndex, store, groupVariable, columnName) {
	var avgTime = 0;
	var avgCount = 0;
	var className = false;
	var rowValue;
	var columnType;
	if (rowIndex == 0) {
		rowIndex = 1;
	}
	if (recordData._groupId) {
		this.groupData = recordData._groupId.split(groupVariable)[1].replace('-', ''); //TODO  Change code// 
		this.groupData = this.groupData.replace('amp;', '');
	}
	for (var i = 0; i <= store.data.length - 1; i++) {
		rowValue = store.data.items[i];
		columnType = rowValue.fields.get(groupVariable).type;
		if (this.groupData && this.groupData != "(None)") {
			switch (columnType) {
				case 'date':
					if (rowValue.get(groupVariable) != "" && rowValue.get(groupVariable).format("m/d/y") == this.groupData) {//TODO Please change code for as You suggest me
						avgTime = parseInt(avgTime) + parseInt(rowValue.get(columnName) == "" ? 0 : rowValue.get(columnName));
						avgCount++;
					}
					break;
				default:
					if (rowValue.get(groupVariable) == this.groupData) {
						avgTime = parseInt(avgTime) + parseInt(rowValue.get(columnName) == "" ? 0 : rowValue.get(columnName));
						avgCount++;
					}
					break;
			}
		}
		else {

			if (store.data.items[i].get(groupVariable) == "") {
				avgTime = parseInt(avgTime) + parseInt(rowValue.get(columnName) == "" ? 0 : rowValue.get(columnName));
				avgCount++;
			}
		}
	}
	avgTime = avgTime / avgCount;
	switch (columnType) {
		case 'date':
			if (recordData.get(columnName) > 0) {
				className = true;
			}
			break;

		default:
			if (recordData.get(columnName) > avgTime || this.groupData == "(None)") {
				className = true;
			}
			break;
	}
	return className;
};
