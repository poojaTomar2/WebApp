/*global Ext:true */
Ext.override(Ext.tree.ColumnTree, {
	refreshNodeColumns: function(n) {
		var t = n.getOwnerTree();
		var a = n.attributes;
		var cols = t.columns;
		var el = n.ui.getEl().firstChild; // <div class="x-tree-el">
		var cells = el.childNodes;

		//<div class="x-tree-col"><div class="x-tree-col-text">

		for (var i = 1, len = cols.length; i < len; i++) {
			var d = cols[i].dataIndex;
			var v = (a[d] !== null) ? a[d] : '';
			if (cols[i].renderer) {
				v = cols[i].renderer(v, n);
			}
			cells[i].firstChild.innerHTML = v;
		}
	},

	countRenderer: function(v, n) {
		var returnValue = 0;
		if (n.childNodes && n.childNodes.length > 0) {
			returnValue = n.childNodes.length;
		} else if (n.attributes && n.attributes.children) {
			returnValue = n.attributes.children.length;
		}
		return returnValue;
	}
});

// Handles empty time if date is not today
delete Ext.ux.form.DateTime.prototype.dateFormat;
delete Ext.ux.form.DateTime.prototype.timeFormat;

Ext.ux.form.DateTime.override({
	timeWidth: 72,
	paddingRight: 0,
	selectOnFocus: true,
	allowBlank: function (val) {
		this.df.allowBlank = val;
		this.tf.allowBlank = val;
	},
	afterUpdateDate: function () {
	},
	updateDate: function () {
		var d = this.df.getValue();
		if (d) {
			if (!(this.dateValue instanceof Date)) {
				this.initDateValue();
				if (!this.tf.getValue()) {
					if (d.Equals(new Date(), true)) {
						this.setTime(this.dateValue);
					}
					else {
						this.setTime('');
					}
					if (this.tf.hasFocus && this.tf.selectOnFocus) {
						this.tf.selectText();
					}
				}
			}
			this.dateValue.setMonth(0); // because of leap years
			this.dateValue.setFullYear(d.getFullYear());
			this.dateValue.setMonth(d.getMonth());
			this.dateValue.setDate(d.getDate());
		}
		else {
			this.dateValue = '';
			this.setTime('');
		}
		this.afterUpdateDate();
	}, // eo function updateDate
	onSpecialKey: function (t, e) {
		var key = e.getKey();
		if (key === e.TAB) {
			if (t === this.df && !e.shiftKey) {
				this.df.beforeBlur();
				e.stopEvent();
				this.tf.focus();
			}
			if (t === this.tf && e.shiftKey) {
				this.tf.beforeBlur();
				e.stopEvent();
				this.df.focus();
			}
			this.updateValue();
		}
		// otherwise it misbehaves in editor grid
		if (key === e.ENTER) {
			this.updateValue();
		}

	}, // eo function onSpecialKey
	focus: function () {
		this.df.focus(this.selectOnFocus, 20);
	}
});

Ext.override(Ext.ux.grid.Search, {
	iconCls: undefined,
	paramNames: {
		fields: 'fields',
		query: 'quickSearch'
	}
});

// Netbox changes
Ext.override(Ext.ux.netbox.core.FilterHeaderPlugin, {
	filterCls: 'ux-cherry-filtered-column'
});

Ext.override(Ext.ux.netbox.core.DynamicFilterModelView, {
  imageRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return('<img class="x-icon x-icon-delete" src="'+Ext.BLANK_IMAGE_URL+'"/>');
  }
});

Ext.override(Ext.ux.netbox.PreferenceManager, {
	applyDefaultPreferenceCbk: function(response, options) {
		if (response.responseText == "") {
			response.responseText = "{}";
		}
		this.applyPreferenceCbk(response, options);
	}
});

Ext.override(Ext.ux.netbox.PreferenceManagerView, {
	imageRenderer: function(value, metadata, record, rowIndex, colIndex, store) {
		if (value === true) {
			return ('<img class="x-icon x-icon-checked" src="' + Ext.BLANK_IMAGE_URL + '"/>');
		}
	},
	showAddDialog: function(prefId, prefName, prefDesc, isDefault) {
		if (!this.addDialog) {
			this.fields = {};

			this.addForm = new Ext.form.FormPanel({
				labelWidth: 75,
				border: false,
				bodyStyle: 'background-color:transparent;padding:10px; ',
				items: [
					this.fields.prefId = new Ext.form.Hidden({ name: 'prefId' }),
					this.fields.prefName = new Ext.form.TextField({ fieldLabel: this.nameText, name: 'prefName', allowBlank: false, width: '96%', maxLength: 50 }),
					this.fields.prefDesc = new Ext.form.TextField({ fieldLabel: this.descText, name: 'prefDesc', width: '96%' }),
					this.fields.isDefault = new Ext.form.Checkbox({ fieldLabel: this.defaultText, name: 'isDefault' })
				]
			});

			this.addDialog = new Ext.Window({
				width: 400,
				height: 160,
				minWidth: 400,
				minHeight: 160,
				closeAction: 'hide',
				layout: 'fit',
				plain: true,
				modal: true,
				shadow: true,
				items: this.addForm,
				buttons: [
					{
						text: this.okText,
						handler: this.savePreference,
						scope: this
					}, {
						text: this.cancelText,
						handler: function() { this.addDialog.hide(); },
						scope: this
					}
				]
			});
		}

		this.fields.prefId.setValue(prefId);
		this.fields.prefName.setValue(prefName);
		this.fields.prefDesc.setValue(prefDesc);
		this.fields.isDefault.setValue(isDefault);

		if (prefId != '') {
			this.addDialog.setTitle(this.modifyText);
		} else {
			this.addDialog.setTitle(this.addText);
		}

		//this.addForm.findById('prefName').focus();
		this.addDialog.show();
		this.fields.prefName.focus(true, true);
	},

	savePreference: function() {
		if (this.addForm.getForm().isValid()) {
			this.preferenceManager.savePreference(this.fields.prefId.getValue(), this.fields.prefName.getValue(), this.fields.prefDesc.getValue(), this.fields.isDefault.getValue());
		}
	}
});

Ext.ux.netbox.core.AvailableValuesEditor = function(store, config) {

	if (config === undefined) {
		config = {};
	}
	var mode = 'local';
	if (config.remote === true) {
		mode = 'remote';
	}
	if (config.multiSelect === undefined) {
		config.multiSelect = false;
	}

	var displayField = config.displayField;
	var valueField = config.valueField;

	if (!config.displayField && !config.valueField && store.fields && store.fields.getCount() >= 2) {
		valueField = store.fields.itemAt(0).name;
		displayField = store.fields.itemAt(1).name;
	}

	if (!displayField) {
		displayField = this.displayField;
		valueField = this.valueField;
	}

	delete config.displayField;
	delete config.valueField;

	this.displayField = displayField;
	this.valueField = valueField;

	this.fieldCombo = new Ext.ux.Andrie.Select({
		store: store,
		displayField: displayField,
		valueField: valueField,
		mode: mode,
		triggerAction: 'all',
		selectOnFocus: true,
		typeAhead: true,
		multiSelect: config.multiSelect,
		minChars: 0
	});
	if (!config.multiSelect) {
		this.fieldCombo.on('select', this.completeEditLater, this);
	}
	if (config.forceReload) {
		this.fieldCombo.on("beforequery", function(qe) { qe.combo.lastQuery = null; });
	}
	if (config.caseSensitive) {
		this.caseSensitive = true;
	} else {
		this.caseSensitive = false;
	}
	Ext.ux.netbox.core.AvailableValuesEditor.superclass.constructor.call(this, this.fieldCombo, config);
	this.store = store;
};

Ext.extend(Ext.ux.netbox.core.AvailableValuesEditor, Ext.ux.netbox.FilterEditor, {
	displayField: 'text',
	valueField: 'value',
	setValue: function(value) {
		var val = [];
		var rawVal = [];
		if (value !== undefined && value !== null && Ext.type(value) === "array") {
			if (value.length > 0) {
				for (var i = 0; i < value.length && ((this.fieldCombo.multiSelect) || i < 1); i++) {
					val.push(value[i][this.valueField]);
					if (value[i].labels !== undefined) {
						rawVal.push(value[i].label);
					} else {
						rawVal.push(value[i][this.valueField]);
					}
				}
			}
		}
		this.originalValue = value;

		Ext.ux.netbox.core.AvailableValuesEditor.superclass.setValue.call(this, val);
		// Hack to show the right label even if the store is not loaded.
		Ext.form.ComboBox.superclass.setValue.call(this.fieldCombo, rawVal.join(","));
		this.fieldCombo.value = val;
		this.fieldCombo.rawValueArray = rawVal;
	},

	completeEditLater: function() {
		var task = new Ext.util.DelayedTask(this.completeEdit, this);
		task.delay(0);
	},

	getValue: function() {
		var val = Ext.ux.netbox.core.AvailableValuesEditor.superclass.getValue.call(this);
		if (Ext.type(val) == 'string') {
			if (val === '') {
				return ([]);
			}
			val = val.split(',');
		}
		var toReturn = [];
		for (var i = 0; i < val.length; i++) {
			var record = this.fieldCombo.findRecord(this.valueField, val[i]);
			if (record) {
				toReturn.push({ label: record.get(this.displayField), value: val[i] });
			}
		}
		//if the user clicks on the field and then it presses Enter, the store is not loaded...
		if (val.length > 0 && toReturn.length === 0) {
			return this.originalValue;
		} else {
			return toReturn;
		}
	}
});

//This override is added to not allow quick filter on columns which are disabled for sorting, this is done for Concatenated columns, coz sorting is disable mostly for those columns only
Ext.override(Ext.ux.netbox.core.QuickFilterModelView, {
	filterIsToShow: function (grid, row, column) {
		//In case column is not found / valid avoid error for existing filters from User State or Preference
		if (column == -1) {
			return false;
		}
		var columnId = grid.getColumnModel().getColumnId(column);
		var allowQuickFilter = true;
		if (columnId) {
			allowQuickFilter = grid.getColumnModel().getColumnById(columnId).quickFilter === false ? false : true;
		}
		if (column == -1 || this.getField(grid, column) == null || !allowQuickFilter) {
			return false;
		} else {

			var itemsArray = [];
			var field = this.getField(grid, column);
			var availableOperatorsId;

			if (this.fieldsOptions) {
				for (var i = 0; i < this.fieldsOptions.length; i++) {
					if (this.fieldsOptions[i].id === field.getId() && this.fieldsOptions[i].operators) {
						availableOperatorsId = this.fieldsOptions[i].operators;
					}
				}
			}

			if (!availableOperatorsId) {
				if (field instanceof Ext.ux.netbox.string.StringField || field instanceof Ext.ux.netbox.string.EnumField) {
					availableOperatorsId = this.stringOperDefault;
				} else if (field instanceof Ext.ux.netbox.number.NumberField) {
					availableOperatorsId = this.numberOperDefault;
				} else if (field instanceof Ext.ux.netbox.date.DateField) {
					//Check if date column is empty the we not going to show 'DATE_GREATER', 'DATE_GREATER_OR_EQUAL', 'DATE_LESS', 'DATE_LESS_OR_EQUAL'------
					var record = grid.getStore().getAt(row);
					var columnValue = record.get(field.getId());
					var dateOperNotValidForEmptyValue = ['DATE_GREATER', 'DATE_GREATER_OR_EQUAL', 'DATE_LESS', 'DATE_LESS_OR_EQUAL'];
					var dateOperDefault = ['DATE_EQUAL', 'DATE_GREATER', 'DATE_GREATER_OR_EQUAL', 'DATE_LESS', 'DATE_LESS_OR_EQUAL', 'DATE_NOT_EQUAL', 'DATE_ISNULL', 'DATE_IS_NOT_NULL'];
					if (!columnValue) {
						for (var i = 0, len = dateOperNotValidForEmptyValue.length; i < len; i++) {
							var index = dateOperDefault.indexOf(dateOperNotValidForEmptyValue[i]);
							if (index !== -1) {
								dateOperDefault.splice(index, 1);
							}
						}
					}
					//----------------
					availableOperatorsId = dateOperDefault;
				} else {
					var availableOperators = field.getAvailableOperators();
					for (var i = 0; i < availableOperators.length; i++) {
						availableOperatorsId.push(availableOperators[i].getId());
					}
				}
			}

			for (var i = 0; i < availableOperatorsId.length; i++) {
				var isToAdd = true;
				var operator = field.getAvailableOperatorById(availableOperatorsId[i]);
				var filterItem = {
					text: Ext.util.Format.htmlEncode(operator.getLabel()),
					handler: this.setFilter.createDelegate(this, [grid, row, column, field.getId(), operator.getId()], false)
				};

				var filtersList = this.filterModel.getElementaryFiltersByFieldId(field.getId());
				var values = this.getValues(grid, row, column, field.getId(), operator.getId());
				for (var j = 0; j < filtersList.length; j++) {
					if (filtersList[j].getOperator().getId() === operator.getId() &&
          Ext.util.JSON.encode(filtersList[j].getValues()) === Ext.util.JSON.encode(values))
						isToAdd = false;
				}
				if (operator.validate(values) !== true)
					isToAdd = false;

				if (isToAdd)
					itemsArray.push(filterItem);
			}

			if (itemsArray.length > 0) {
				this.quickFilterItem.setSubMenu(new Ext.menu.Menu({ items: itemsArray }));
				return true;
			} else {
				return false;
			}
		}
	}
});

Ext.ux.Andrie.Select.prototype.setValueOriginal = Ext.ux.Andrie.Select.prototype.setValue;

//Override for navigation click handling in case of Session expired
Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype.manageError = function (title, message) {
	var msg = Ext.decode(message);
	var openLoginPrompt = !msg.success && msg.info == 'Session has expired!';
	DA.App.ReLoginOnSessionExpired && openLoginPrompt ? ExtHelper.ReLogin.openLoginPrompt() :
	Ext.MessageBox.show({
		title: title,
		msg: message,
		buttons: Ext.MessageBox.OK,
		icon: Ext.MessageBox.ERROR,
		minWidth: 200
	});
}

Ext.override(Ext.ux.Andrie.Select, {
	setValue: function(v) {
		if (typeof (v) == 'number') {
			v = String(v);
		}
		this.setValueOriginal(v);
	}
});

Ext.ux.grid.GridFilters.override({
	getFilterData: function() {
		var filters = [];
		this.filters.each(function(f) {
			if (f.active) {
				var d = [].concat(f.serialize());
				for (var i = 0, len = d.length; i < len; i++) {
					filters.push({
						field: f.proxyCol || f.dataIndex,
						data: d[i]
					});
				}
			}
		});

		return filters;
	},
	reload: function() {
		if (this.local) {
			this.grid.store.clearFilter(true);
			this.grid.store.filterBy(this.getRecordFilter());
		} else {
			this.deferredUpdate.cancel();
			var store = this.grid.store;
			if (this.toolbar) {
				var start = this.toolbar.paramNames.start;
				if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[start])
					store.lastOptions.params[start] = 0;
			}
			this.grid.loadFirst();
		}
	}
});

//This override gets the LookupId in Lookup stores (for Header Filter)
Ext.ux.menu.ListMenu.override({
	onLoad: function(store, records) {
		var visible = this.isVisible();
		this.hide(false);

		this.removeAll();

		var gid = this.single ? Ext.id() : null;
		for (var i = 0, len = records.length; i < len; i++) {
			var val = this.valueField ? records[i].get(this.valueField) : records[i].id;
			var item = new Ext.menu.CheckItem({
				text: records[i].get(this.labelField),
				group: gid,
				checked: this.selected.indexOf(val) > -1,
				hideOnClick: false
			});

			item.itemId = val;
			item.on('checkchange', this.checkChange, this);

			this.add(item);
		}

		this.loaded = true;

		if (visible) {
			this.show();
		}

		this.fireEvent('load', this, records);
	},
	setSelected: function(value) {
		value = this.selected = [].concat(value);

		if (this.loaded) {
			this.items.each(function(item) {
				if (typeof (item.setChecked) == 'function') {
					item.setChecked(false, true);
					for (var i = 0, len = value.length; i < len; i++) {
						if (item.itemId == value[i]) {
							item.setChecked(true, true);
						}
					}
				} else {
					//Do Nothing
				}
			}, this);
		}
	}
});
//Override added for the error "Null Operator not allowed" (Cherry)
Ext.ux.netbox.core.ElementaryFilter.override({
	setOperator: function(operator) {
		if (operator === null) {
			return;
		}
		if (operator.getId) {
			if (this.field.getAvailableOperatorById(operator.getId()) === null) {
				throw ("Operator " + operator.getId() + " is not available for this elementaryFilter");
			}
		} else {
			var operatorTmp = this.getField().getAvailableOperatorById(operator);
			if (operatorTmp === null) {
				throw ("Operator " + operator + " is not available for this elementaryFilter");
			}
			operator = operatorTmp;
		}
		this.operator = operator;
		this.fireEvent("operatorChanged", this, operator);
		this.setValues(this.operator.convertValue(this.getValues()));
	}
});

if (Ext.ux.state.HttpProvider) {
	Ext.ux.state.HttpProvider.override({
		encodeValue: function(o) {
			if (!this.applyImmediately) {
				return Ext.encode(o);
			} else {
				return Ext.ux.state.HttpProvider.superclass.encodeValue(o);
			}
		},

		decodeValue: function(o) {
			if (o && o.substr(1, 2) !== '%3') {
				return Ext.decode(o);
			} else {
				return Ext.ux.state.HttpProvider.superclass.decodeValue(o);
			}
		}
	});
}


// Range Menu modified to include TAB handling and Time Filter
Ext.ux.menu.RangeMenu = Ext.extend(Ext.menu.Menu, {
	constructor: function(config) {
		Ext.ux.menu.RangeMenu.superclass.constructor.call(this, config);

		var cfg = this.fieldCfg;
		var cls = this.fieldCls;

		if (!cfg) {
			if (this.fieldCls === Ext.form.TimeField) {
				cfg = { width: 125, listClass: 'ux-header-filter-list' };
			}
		}

		if (!cfg) {
			cfg = {};
		}

		var fields = this.fields = Ext.applyIf(this.fields || {}, {
			'gt': new Ext.ux.menu.EditableItem({
				iconCls: this.icons.gt,
				editor: new cls(cfg.gt || cfg)
			}),
			'lt': new Ext.ux.menu.EditableItem({
				iconCls: this.icons.lt,
				editor: new cls(cfg.lt || cfg)
			}),
			'eq': new Ext.ux.menu.EditableItem({
				iconCls: this.icons.eq,
				editor: new cls(cfg.eq || cfg)
			})
		});
		this.add(fields.gt, fields.lt, '-', fields.eq);

		if (this.fieldCls === Ext.form.TimeField) {
			this.addTimeChangeHandlers();
		} else {
			this.addChangeHandlers();
		}

		this.addEvents(
			'update'
		);
	},

	fieldCls: Ext.form.NumberField,

	fieldCfg: undefined,

	updateBuffer: 500,

	icons: {
		gt: 'ux-rangemenu-gt',
		lt: 'ux-rangemenu-lt',
		eq: 'ux-rangemenu-eq'
	},


	fireUpdate: function() {
		this.fireEvent("update", this);
	},

	setValue: function(data) {
		for (var key in this.fields) {
			this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
		}

		this.fireEvent("update", this);
	},

	getValue: function() {
		var result = {};
		for (var key in this.fields) {
			var field = this.fields[key];
			if (field.isValid() && String(field.getValue()).length > 0) {
				result[key] = field.getValue();
			}
		}

		return result;
	},

	addTimeChangeHandlers: function() {
		var fields = this.fields;
		for (var key in fields) {
			fields[key].editor.on({
				'change': this.onTimeFieldChange,
				'select': this.onTimeFieldChange,
				scope: this
			});
		}
	},

	onTimeFieldChange: function(field, newValue) {
		var fields = this.fields;
		if (field == fields.eq.editor) {
			fields.gt.setValue(null);
			fields.lt.setValue(null);
		} else {
			fields.eq.setValue(null);
		}

		this.fireEvent("update", this);
	},

	onNumberFieldChange: function(event, input, notSure, field) {
		var fields = this.fields;
		var key = event.getKey();
		if (key === event.TAB) {
			return;
		}
		if (key == event.ENTER && field.isValid()) {
			this.hide(true);
			return;
		}

		if (field === fields.eq) {
			fields.gt.setValue('');
			fields.lt.setValue('');
		} else {
			fields.eq.setValue('');
		}

		this.updateTask.delay(this.updateBuffer);
	},

	addChangeHandlers: function() {
		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
		var fields = this.fields;
		for (var key in fields) {
			fields[key].on('keyup', this.onNumberFieldChange.createDelegate(this, [fields[key]], true));
		}
	}
});

Ext.override(Ext.ux.grid.filter.DateFilter, {

	init: function() {
		var opts = Ext.apply(this.pickerOpts, {
			minDate: this.minDate,
			maxDate: this.maxDate,
			format: this.dateFormat,
			hideOnClick: false
		});
		var dates = this.dates = {
			'before': new Ext.menu.CheckItem({ text: this.beforeText, menu: new Ext.menu.DateMenu(opts), hideOnClick: false }),
			'after': new Ext.menu.CheckItem({ text: this.afterText, menu: new Ext.menu.DateMenu(opts), hideOnClick: false }),
			'on': new Ext.menu.CheckItem({ text: this.onText, menu: new Ext.menu.DateMenu(opts), hideOnClick: false })
		};
		this.menu.add(dates.before, dates.after, "-", dates.on);

		for (var key in dates) {
			var date = dates[key];
			date.menu.on('select', function(date, menuItem, value, picker) {
				date.setChecked(false);
				date.setChecked(true);

				if (date == dates.on) {
					dates.before.setChecked(false, true);
					dates.after.setChecked(false, true);
				} else {
					dates.on.setChecked(false, true);

					if (date == dates.after && dates.before.menu.picker.value < value)
						dates.before.setChecked(false, true);
					else if (date == dates.before && dates.after.menu.picker.value > value)
						dates.after.setChecked(false, true);
				}
				this.fireEvent("update", this);
			} .createDelegate(this, [date], 0));

			date.on('checkchange', function() {
				this.setActive(this.isActivatable());
			}, this);
		};
	},

	setValue: function(value) {
		for (var key in this.dates) {
			if (value[key]) {
				var date = typeof value[key] === 'string' ? Date.parseDate(value[key], 'c') : value[key];
				this.dates[key].menu.picker.setValue(date);
				this.dates[key].setChecked(true);
			} else {
				this.dates[key].setChecked(false);
			}
		}
	},
	serialize: function() {
		var colId = this.cm.getColumnId(this.cm.findColumnIndex(this.dataIndex));
		var col = this.cm.getColumnById(colId);

		var args = [];
		if (this.dates.before.checked)
			args = [{ type: 'date', comparison: 'lt', value: this.getFieldValue('before').format(this.dateFormat), convert: (col && col.convert) ? true : false}];
		if (this.dates.after.checked)
			args.push({ type: 'date', comparison: 'gt', value: this.getFieldValue('after').format(this.dateFormat), convert: (col && col.convert) ? true : false });
		if (this.dates.on.checked)
			args = { type: 'date', comparison: 'eq', value: this.getFieldValue('on').format(this.dateFormat), convert: (col && col.convert) ? true : false };

		this.fireEvent('serialize', args, this);
		return args;
	}
});

Ext.ux.grid.filter.TimeFilter = Ext.extend(Ext.ux.grid.filter.Filter, {

	init: function() {
		this.menu = new Ext.ux.menu.RangeMenu({ updateBuffer: this.updateBuffer, fieldCls: Ext.form.TimeField });

		this.menu.on("update", this.fireUpdate, this);
	},


	fireUpdate: function() {
		this.setActive(this.isActivatable());
		this.fireEvent("update", this);
	},

	isActivatable: function() {
		var value = this.menu.getValue();
		return value.eq !== undefined || value.gt !== undefined || value.lt !== undefined;
	},

	setValue: function(value) {
		this.menu.setValue(value);
	},

	getValue: function() {
		var values = this.menu.getValue();
		for (var key in values) {
			values[key] = Date.parseDate(values[key], 'g:i A').format('H:i');
		}
		return values;
	},

	serialize: function() {
		var args = [];
		var values = this.getValue();
		for (var key in values) {
			args.push({ type: 'time', comparison: key, value: values[key] });
		}

		this.fireEvent('serialize', args, this);
		return args;
	},

	validateRecord: function(record) {
		var val = record.get(this.dataIndex),
			values = this.getValue();

		if (values.eq !== undefined && val != values.eq) {
			return false;
		}

		if (values.lt !== undefined && val >= values.lt) {
			return false;
		}

		if (values.gt !== undefined && val <= values.gt) {
			return false;
		}

		return true;
	}
});

Ext.onReady(function() {
	if (Ext.ux.maximgb) {
		Ext.ux.maximgb.treegrid.AbstractTreeStore.override({
			/**
			* Sort the Records.
			*
			* @access public
			*/
			sort: function(fieldName, dir) {
				if (this.remoteSort) {
					this.setActiveNode(null);
					if (this.lastOptions) {
						this.lastOptions.add = false;
						if (this.lastOptions.params) {
							this.lastOptions.params[this.paramNames.active_node] = null;
						}
					}
				}

				return Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.sort.call(this, fieldName, dir);
			}
		});
	}
});

Ext.override(Ext.ux.grid.filter.StringFilter, {
	validateRecord: function(record) {
		var searchCol = this.proxyCol ? this.proxyCol : this.dataIndex;
		var val = record.get(searchCol);

		if (typeof val != "string") {
			return this.getValue().length == 0;
		}

		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});

Ext.override(Ext.ux.MultiGroupingGrid, {
	setUpDragging: function () {
		//console.debug("SetUpDragging", this); 
		this.dragZone = new Ext.dd.DragZone(this.getTopToolbar().getEl(), {
			ddGroup: "grid-body" + this.getGridEl().id //FIXME - does this need to be unique to support multiple independant panels on the same page
      , panel: this
      , scroll: false
			// @todo - docs
      , onInitDrag: function (e) {
      	// alert('init');
      	var clone = this.dragData.ddel;
      	clone.id = Ext.id('ven'); //FIXME??
      	// clone.class='x-btn button';
      	this.proxy.update(clone);
      	return true;
      }

			// @todo - docs
      , getDragData: function (e) {
      	var target = Ext.get(e.getTarget().id);
      	//console.debug("DragZone: ",e,target);
      	if (!target || target.hasClass('x-toolbar x-small-editor')) {
      		return false;
      	}

      	d = e.getTarget().cloneNode(true);
      	d.id = Ext.id();

      	this.dragData = {
      		repairXY: Ext.fly(target).getXY(),
      		ddel: d,
      		btn: e.getTarget()
      	};
      	return this.dragData;
      }

			//Provide coordinates for the proxy to slide back to on failed drag.
			//This is the original XY coordinates of the draggable element.
      , getRepairXY: function () {
      	return this.dragData.repairXY;
      }
		});

		// This is the target when columns are dropped onto the toolbar (ie added to the group)
		this.dropTarget2s = new Ext.dd.DropTarget(this.getTopToolbar().getEl(), {
			ddGroup: "gridHeader" + this.getGridEl().id
      , panel: this
      , notifyDrop: function (dd, e, data) {
      	var check = this.panel.getColumnModel().config[this.panel.getView().getCellIndex(data.header)];
      	var isReturn = false;
      	var dataIndex = check.dataIndex;
      	if (check.displayIndex) {
      		dataIndex = check.displayIndex;
      	}
      	if (this.panel.getState().sort && this.panel.getState().sort.field == dataIndex) {
      		isReturn = true;
      	}
      	if (this.panel.getState().sort && this.panel.getState().sort.sorters) {
      		for (var i = 0; i < this.panel.getState().sort.sorters.length; i++) {
      			if (this.panel.getState().sort.sorters[i].field == dataIndex) {
      				isReturn = true;
      			}
      		}
      	}
      	if (check && !check.summaryType && !isReturn) {
      		var btname;
      		btname = this.panel.getColumnModel().getDataIndex(this.panel.getView().getCellIndex(data.header));
      		var gridColumn = this.panel.getColumnModel().getColumnById(this.panel.getView().getCellIndex(data.header));
      		if (gridColumn && gridColumn.groupable === false) {
      			Ext.Msg.alert('Alert', 'Can\'t apply grouping on ' + gridColumn.header + ' column.');
      			return false;
      		}
      		this.panel.store.groupBy(btname);
      		this.panel.store.drag = true;
      		this.panel.view.columnDrop.proxyBottom.hide();
      		this.panel.view.columnDrop.proxyTop.hide()
      		return true;
      	}
      	else {
      		this.panel.view.columnDrop.proxyBottom.hide();
      		this.panel.view.columnDrop.proxyTop.hide()
      		return false;
      	}
      }
       , notifyOver: function (dd, e, data) {
       	var check = this.panel.getColumnModel().config[this.panel.getView().getCellIndex(data.header)];
       	var isReturn = false;
       	var dataIndex = check.dataIndex;
       	if (check.displayIndex) {
       		dataIndex = check.displayIndex;
       	}
       	if (this.panel.getState().sort && this.panel.getState().sort.field == dataIndex) {
       		Ext.Msg.alert('Alert', 'Remove the sort before you drag this column');
       		isReturn = true;
       		return this.dropNotAllowed;
       	}
       	if (this.panel.getState().sort && this.panel.getState().sort.sorters) {
       		for (var i = 0; i < this.panel.getState().sort.sorters.length; i++) {
       			if (this.panel.getState().sort.sorters[i].field == dataIndex) {
       				Ext.Msg.alert('Alert', 'Remove the sort before you drag this column');
       				isReturn = true;
       				return this.dropNotAllowed;
       			}
       		}
       	}
       	if (check && !check.summaryType && !isReturn) {
       		return this.dropAllowed;
       	}
       	else {
       		return this.dropNotAllowed;
       	}
       }
		});

		// This is the target when columns are dropped onto the grid (ie removed from the group)
		this.dropTarget22s = new Ext.dd.DropTarget(this.getView().el.dom.childNodes[0].childNodes[1], {
			ddGroup: "grid-body" + this.getGridEl().id  //FIXME - does this need to be unique to support multiple independant panels on the same page
      , panel: this
      , notifyDrop: function (dd, e, data) {
      	var txt = Ext.get(data.btn).dom.innerHTML;
      	var tb = this.panel.getTopToolbar();

      	var bidx = tb.items.findIndexBy(function (b) {
      		return b.text == txt;
      	}, this);

      	if (bidx < 0) return; // Error!
      	var fld = tb.items.get(bidx).fieldName;
      	// Remove from toolbar 
      	if (this.panel.itemsToIgnoreForMultiGroping) {
      		for (var i = 0; i <= this.panel.itemsToIgnoreForMultiGroping.length; i++) {
      			if (txt == this.panel.itemsToIgnoreForMultiGroping[i]) {
      				return;
      			}
      		}
      	}
      	if (!Ext.getDom(tb.items.get(bidx).id)) {
      		Ext.removeNode(Ext.getDom(data.btn.id));
      		Ext.removeNode(Ext.getDom(tb.items.get(bidx + 1).id));
      	}
      	else {
      		Ext.removeNode(Ext.getDom(tb.items.get(bidx).id));
      	}
      	if (bidx > 0) Ext.removeNode(Ext.getDom(tb.items.get(bidx - 1).id)); ;


      	//console.dir(button);
      	var cidx = this.panel.view.cm.findColumnIndex(fld);
      	this.panel.view.cm.setHidden(cidx, false);

      	//Ext.removeNode(Ext.getDom(data.btn.id));

      	// Remove this group from the groupField array
      	// @todo - replace with method on store
      	// this.panel.store.removeGroupField(fld);
      	var temp = [];
      	for (var i = this.panel.store.groupField.length - 1; i >= 0; i--) {
      		if (this.panel.store.groupField[i] == fld) {
      			this.panel.store.groupField.pop();
      			this.panel.store.drop = true;
      			break;
      		}
      		temp.push(this.panel.store.groupField[i]);
      		this.panel.store.groupField.pop();
      	}

      	for (var i = temp.length - 1; i >= 0; i--) {
      		this.panel.store.groupField.push(temp[i]);
      	}

      	if (this.panel.store.groupField.length == 0) {
      		this.panel.store.groupField = false;
      		delete this.panel.store.baseParams.multiGroupBy;
      	}
      	if (this.panel.store.groupField.length > 0) {
      		this.panel.store.baseParams.multiGroupBy = this.panel.store.groupField;
      	}
      	this.panel.store.load();
      	this.panel.store.fireEvent('datachanged', this);
      	return true;
      }
		});
	}
});

//Changes to handle hidden column in grouping - override from Ext-all-debug.js
Ext.override(Ext.grid.GroupingView, {
	renderRows: function () { 
		var groupField = this.getGroupField();
		var eg = !!groupField;
		// if they turned off grouping and the last grouped field is hidden
		if (this.hideGroupedColumn) {
			var colIndex = this.cm.findColumnIndex(groupField);
			var isHidden = false;
			if (this.grid.getState().columns && this.grid.getState().columns[colIndex]) {
				isHidden = this.grid.getState().columns[colIndex].hidden == true ? true : false;
			}
			if (!eg && this.lastGroupField !== undefined) {
				this.mainBody.update('');
				this.cm.setHidden(this.cm.findColumnIndex(this.lastGroupField), false);
				delete this.lastGroupField;
			} else if (eg && this.lastGroupField === undefined) {
				this.lastGroupField = groupField;
				this.cm.setHidden(colIndex, isHidden);
			} else if (eg && this.lastGroupField !== undefined && groupField !== this.lastGroupField) {
				this.mainBody.update('');
				var oldIndex = this.cm.findColumnIndex(this.lastGroupField);
				this.cm.setHidden(oldIndex, isHidden);
				this.lastGroupField = groupField;
				this.cm.setHidden(colIndex, isHidden);
			}
		}
		return Ext.grid.GroupingView.superclass.renderRows.apply(
                    this, arguments);
	}
});

Ext.ux.netbox.number.NumberField = function (id, label) {
	Ext.ux.netbox.number.NumberField.superclass.constructor.call(this, id, label);
	var equalOperator = new Ext.ux.netbox.core.Operator("NUMBER_EQUAL", "=");
	this.addOperator(equalOperator);
	this.setDefaultOperator(equalOperator);
	this.addOperator(new Ext.ux.netbox.core.Operator("NUMBER_NOT_EQUAL", "!="));
	noEmptyAllowed = this.emptyNotAllowedFn.createDelegate(this);
	var op = new Ext.ux.netbox.core.Operator("NUMBER_GREATER", ">");
	op.addValidateFn(noEmptyAllowed);
	this.addOperator(op);
	op = new Ext.ux.netbox.core.Operator("NUMBER_GREATER_OR_EQUAL", ">=");
	op.addValidateFn(noEmptyAllowed);
	this.addOperator(op);
	op = new Ext.ux.netbox.core.Operator("NUMBER_LESS", "<");
	op.addValidateFn(noEmptyAllowed);
	this.addOperator(op);
	op = new Ext.ux.netbox.core.Operator("NUMBER_LESS_OR_EQUAL", "<=");
	op.addValidateFn(noEmptyAllowed);
	this.addOperator(op);
	this.addOperator(new Ext.ux.netbox.number.NumberRangeOperator("NUMBER_RANGE", "between"));
	this.addOperator(new Ext.ux.netbox.number.NumberRangeOperator("NUMBER_NOT_RANGE", "not between"));
}

Ext.extend(Ext.ux.netbox.number.NumberField, Ext.ux.netbox.core.Field, {
	createEditor: function (operatorId) {
		var editor = new Ext.ux.netbox.core.TextValuesEditor(new Ext.form.NumberField({ decimalPrecision: 10 }));
		return editor;
	}
});

//Overriden to have NUMBER - NOT IN RANGE filter from cherryonext.js
Ext.ux.netbox.number.NumberRangeOperator = function (rangeOperator, includeText) {
	Ext.ux.netbox.number.NumberRangeOperator.superclass.constructor.call(this, rangeOperator, includeText ? includeText : this.includeText);
	var validateFn = function (value) {
		var isOk = this.getField().emptyNotAllowedFn(value);
		if (isOk !== true) {
			return (isOk);
		}
		if (value.length != 2) {
			return (this.bothFromAndToNotEmpty);
		}
		var fromANumber = this.isNumeric(value[0].value);
		var toANumber = this.isNumeric(value[1].value);
		if (!fromANumber && !toANumber) {
			return (this.toAndFromNotANumber);
		}

		if (!fromANumber) {
			return (this.fromNotANumber);
		}

		if (!toANumber) {
			return (this.toNotANumber);
		}

		if (parseFloat(value[0].value) > parseFloat(value[1].value)) {
			return (this.fromBiggerThanTo);
		}
		return (true);
	}
	this.setValidateFn(validateFn);
}


Ext.extend(Ext.ux.netbox.number.NumberRangeOperator, Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.number.NumberRangeOperator.prototype */{

	fromText: 'from',
	toText: 'to',
	includeText: 'between',
	bothFromAndToNotEmpty: "Both 'from' and 'to' must have a value",
	fromBiggerThanTo: "From is bigger than to",
	fromNotANumber: "From is not a number",
	toNotANumber: "To is not a number",
	toAndFromNotANumber: "From and to are not numbers",
	isNumeric: function (value) {
		if (Ext.type(value) === 'number') {
			return (isFinite(value));
		} else if (Ext.type(value) === 'string') {
			// I use this function like this: if (isNumeric(myVar)) { }
			// regular expression that validates a value is numeric
			if (value.lastIndexOf(".") === value.length) {
				return ("A number should not end with a .");
			}
			var RegExp = /^(-)?(\d+)(\.?)(\d*)$/;
			// Note: this WILL allow a number that ends in a decimal: -452.
			// compare the argument to the RegEx
			// the 'match' function returns 0 if the value didn't match

			return (value.match(RegExp));
		}
		return (false);
	},

	/** This method creates an aditor used to edit the range of numbers
	  * @param {String} operatorId The operatorId actually used in the filter
	  * @return {Ext.Editor} The field used to edit the values of this filter
	  */
	createEditor: function (operatorId) {
		var field = new Ext.ux.netbox.core.RangeField({
			textCls: Ext.form.NumberField,
			fromConfig: {},
			toConfig: {}
		});
		var editor = new Ext.ux.netbox.FilterEditor(field);
		field.on("editingcompleted", editor.completeEdit, editor);
		return editor;
	},
	/** This function returns a string rendering the values. The format is da: (value[0].label), a: (value[1].label).
		* @private
		*/
	render: function (value) {
		var valueFrom = value[0] == undefined ? '' : value[0].label;
		var valueTo = value[1] == undefined ? '' : value[1].label;
		return (this.fromText + ": " + valueFrom + ", " + this.toText + ": " + valueTo);
	}
});// $Id: NumberField.js 183 2008-09-12 14:08:41Z bobbicat71 $


// Multi Grid Filter for String

Ext.ux.grid.MultiGridFilters = function (config) {
	this.filters = new Ext.util.MixedCollection();
	this.filters.getKey = function (o) { return o ? o.dataIndex : null };

	for (var i = 0, len = config.filters.length; i < len; i++)
		this.addFilter(config.filters[i]);

	this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
	delete config.filters;
	Ext.apply(this, config);
};

Ext.extend(Ext.ux.grid.MultiGridFilters, Ext.util.Observable, {
	
	
	updateBuffer: 500,

	paramPrefix: 'multifilter',

	filterCls: 'ux-multiFiltered-column',

	local: false,

	autoReload: true,

	stateId: undefined,

	showMenu: true,

	menuFilterText: 'Multi Filters',


	init: function (grid) {

		if (grid instanceof Ext.grid.GridPanel) {
			
			this.grid = grid;

			this.store = this.grid.getStore();
			if (this.local) {
				this.store.on('load', function (store) {
					store.filterBy(this.getRecordFilter());
				}, this);
			} else {
				this.store.on('beforeload', this.onBeforeLoad, this);
			}

			//this.grid.filters = this;

			this.grid.addEvents({ "filterupdate": true });

			grid.on("render", this.onRender, this);

			grid.on("beforestaterestore", this.applyState, this);
			grid.on("beforestatesave", this.saveState, this);

		} else if (grid instanceof Ext.PagingToolbar) {
			this.toolbar = grid;
		}
	},


	applyState: function (grid, state) {
		this.applyingState = true;
		this.clearFilters();
		if (state.filters)
			for (var key in state.filters) {
				var filter = this.filters.get(key);
				if (filter) {
					filter.setValue(state.filters[key]);
					filter.setActive(true);
				}
			}

		this.deferredUpdate.cancel();
		if (this.local)
			this.reload();

		delete this.applyingState;
	},


	saveState: function (grid, state) {
		var filters = {};
		this.filters.each(function (filter) {
			if (filter.active)
				filters[filter.dataIndex] = filter.getValue();
		});
		return state.filters = filters;
	},


	onRender: function () {
		var hmenu;

		if (this.showMenu) {
			hmenu = this.grid.getView().hmenu;
			this.sep = hmenu.addSeparator();
			this.multiFilterMenu = hmenu.add(new Ext.menu.CheckItem({
				text: this.menuFilterText,
				menu: new Ext.menu.Menu()
			}));
			this.multiFilterMenu.on('checkchange', this.onCheckChange, this);
			this.multiFilterMenu.on('beforecheckchange', this.onBeforeCheck, this);

			hmenu.on('beforeshow', this.onMenu, this);
		}

		this.grid.getView().on("refresh", this.onRefresh, this);
		this.updateColumnHeadings(this.grid.getView());
	},


	onMenu: function (filterMenu) {
		var filter = this.getMenuFilter();
		if (filter) {
			this.multiFilterMenu.menu = filter.multiFilterMenu;
			this.multiFilterMenu.setChecked(filter.active, false);
		}
		this.multiFilterMenu.setVisible(filter !== undefined);
		this.sep.setVisible(filter !== undefined);
	},


	onCheckChange: function (item, value) {
		this.getMenuFilter().setActive(value);
	},


	onBeforeCheck: function (check, value) {
		return !value || this.getMenuFilter().isActivatable();
	},


	onStateChange: function (event, filter) {
		if (event == "serialize") return;

		if (filter == this.getMenuFilter())
			this.multiFilterMenu.setChecked(filter.active, false);

		if ((this.autoReload || this.local) && !this.applyingState)
			this.deferredUpdate.delay(this.updateBuffer);

		var view = this.grid.getView();
		this.updateColumnHeadings(view);

		if (!this.applyingState)
			this.grid.saveState();

		this.grid.fireEvent('filterupdate', this, filter);
	},


	onBeforeLoad: function (store, options) {
		options.params = options.params || {};
		this.cleanParams(options.params);
		var params = this.buildQuery(this.getFilterData());
		Ext.apply(options.params, params);
	},


	onRefresh: function (view) {
		this.updateColumnHeadings(view);
	},


	getMenuFilter: function () {
		var view = this.grid.getView();
		if (!view || view.hdCtxIndex === undefined)
			return null;

		return this.filters.get(
			view.cm.config[view.hdCtxIndex].dataIndex);
	},


	updateColumnHeadings: function (view) {
		if (!view || !view.mainHd) return;

		var hds = view.mainHd.select('td').removeClass(this.filterCls);
		for (var i = 0, len = view.cm.config.length; i < len; i++) {
			var filter = this.getFilter(view.cm.config[i].dataIndex);
			if (filter && filter.active)
				hds.item(i).addClass(this.filterCls);
		}
	},


	reload: function () {
		if (this.local) {
			this.grid.store.clearFilter(true);
			this.grid.store.filterBy(this.getRecordFilter());
		} else {
			this.deferredUpdate.cancel();
			var store = this.grid.store;
			if (this.toolbar) {
				var start = this.toolbar.paramNames.start;
				if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[start])
					store.lastOptions.params[start] = 0;
			}
			store.reload();
		}
	},


	getRecordFilter: function () {
		var f = [];
		this.filters.each(function (filter) {
			if (filter.active) f.push(filter);
		});

		var len = f.length;
		return function (record) {
			for (var i = 0; i < len; i++)
				if (!f[i].validateRecord(record))
					return false;

			return true;
		};
	},


	addFilter: function (config) {
		if (config.type === 'string') {
			var filter = config.menu ? config :
				new (this.getFilterClass(config.type))(config);
			this.filters.add(filter);

			Ext.util.Observable.capture(filter, this.onStateChange, this);
			return filter;
		}
		//var filter = config.menu ? config :
		//	new (this.getFilterClass(config.type))(config);
		//this.filters.add(filter);

		//Ext.util.Observable.capture(filter, this.onStateChange, this);
		//return filter;
	},


	getFilter: function (dataIndex) {
		return this.filters.get(dataIndex);
	},


	clearFilters: function () {
		this.filters.each(function (filter) {
			filter.setActive(false);
		});
	},


	getFilterData: function () {
		var filters = [],
			fields = this.grid.getStore().fields;

		this.filters.each(function (f) {
			if (f.active) {
				var d = [].concat(f.serialize());
				for (var i = 0, len = d.length; i < len; i++)
					filters.push({
						field: f.dataIndex,
						data: d[i]
					});
			}
		});

		return filters;
	},


	buildQuery: function (filters) {
		var p = {};
		for (var i = 0, len = filters.length; i < len; i++) {
			var f = filters[i];
			var root = [this.paramPrefix, '[', i, ']'].join('');
			p[root + '[field]'] = f.field;

			var dataPrefix = root + '[data]';
			for (var key in f.data)
				p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
		}

		return p;
	},


	cleanParams: function (p) {
		var regex = new RegExp("^" + this.paramPrefix + "\[[0-9]+\]");
		for (var key in p)
			if (regex.test(key))
				delete p[key];
	},


	getFilterClass: function (type) {
		return Ext.ux.grid.MultiGridFilters[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}
});
Ext.namespace("Ext.ux.grid.MultiGridFilters");

Ext.ux.grid.MultiGridFilters.Filter = function (config) {
	Ext.apply(this, config);

	this.addEvents(

		'activate',

		'deactivate',

		'serialize',

		'update'
	);
	Ext.ux.grid.MultiGridFilters.Filter.superclass.constructor.call(this);
	this.multiFilterMenu = new Ext.menu.Menu();
	this.init(config);
	if (config && config.value) {
		this.setValue(config.value);
		this.setActive(config.active !== false, true);
		delete config.value;
	}
};

Ext.extend(Ext.ux.grid.MultiGridFilters.Filter, Ext.util.Observable, {


	active: false,

	dataIndex: null,

	multiFilterMenu: null,


	updateBuffer: 500,



	init: Ext.emptyFn,


	fireUpdate: function () {
		if (this.active)
			this.fireEvent("update", this);

		this.setActive(this.isActivatable());
	},


	isActivatable: function () {
		return true;
	},


	setActive: function (active, suppressEvent) {
		if (this.active != active) {
			this.active = active;
			if (suppressEvent !== true)
				this.fireEvent(active ? 'activate' : 'deactivate', this);
		}
	},


	getValue: Ext.emptyFn,


	setValue: Ext.emptyFn,


	serialize: Ext.emptyFn,


	validateRecord: function () { return true; }
});

Ext.ux.grid.MultiGridFilters.StringFilter = Ext.extend(Ext.ux.grid.MultiGridFilters.Filter, {

	icon: 'ux-gridfilter-text-icon',


	init: function () {
		var multiFilterValue = this.multiFilterValue = new Ext.ux.menu.EditableItem({ iconCls: this.icon });
		multiFilterValue.on('keyup', this.onKeyUp, this);
		this.multiFilterMenu.add(multiFilterValue);

		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},


	onKeyUp: function (event) {
		if (event.getKey() == event.ENTER) {
			this.multiFilterMenu.hide(true);
			return;
		}

		this.updateTask.delay(this.updateBuffer);
	},

	isActivatable: function () {
		return this.multiFilterValue.getValue().length > 0;
	},


	fireUpdate: function () {
		if (this.active)
			this.fireEvent("update", this);

		this.setActive(this.isActivatable());
	},

	setValue: function (value) {
		this.multiFilterValue.setValue(value);
		this.fireEvent("update", this);
	},

	getValue: function () {
		return this.multiFilterValue.getValue();
	},

	serialize: function () {
		var args = { type: 'string', value: this.getValue() };
		this.fireEvent('serialize', args, this);
		return args;
	},

	validateRecord: function (record) {
		var val = record.get(this.dataIndex);

		if (typeof val != "string")
			return this.getValue().length == 0;

		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});