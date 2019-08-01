/*global Ext:true, document: false, $D: true */

// Add our custom .NET date parsing
Date.parseCodes.X = {
	g: 1,
	c: "y = parseInt(results[1], 10); m = parseInt(results[2], 10) - 1; d = parseInt(results[3], 10); h = parseInt(results[4], 10); i = parseInt(results[5], 10); s = parseInt(results[6], 10); ms = parseInt(results[7], 10);",
	s: "(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{3})"
};
Ext.data.Field.prototype.dateFormat = 'X'; //'Y-m-d H:i:s';
$D = function(v) {
	return Date.parseDate(v, 'X');
};

// Add copy function for selective properties
if (Ext.version < "3") {
	Ext.applyIf(Ext, {
		copy: function (target, source, properties) {
			Ext.each(properties, function (propertyName) {
				target[propertyName] = source[propertyName];
			});
			return target;
		},
		copyTo: function (dest, source, names) {
			if (typeof names == 'string') {
				names = names.split(/[,;\s]/);
			}
			Ext.each(names, function (name) {
				if (source.hasOwnProperty(name)) {
					dest[name] = source[name];
				}
			}, this);
			return dest;
		},


		destroy: function () {
			Ext.each(arguments, function (arg) {
				if (arg) {
					if (Ext.isArray(arg)) {
						this.destroy.apply(this, arg);
					} else if (typeof arg.destroy == 'function') {
						arg.destroy();
					} else if (arg.dom) {
						arg.remove();
					}
				}
			}, this);
		},


		destroyMembers: function (o, arg1, arg2, etc) {
			for (var i = 1, a = arguments, len = a.length; i < len; i++) {
				Ext.destroy(o[a[i]]);
				delete o[a[i]];
			}
		}

	});
} else {
	Ext.copy = Ext.copyTo;
}

// Use array in JsonReader
Ext.data.JsonReader.prototype.readRecords = Ext.data.JsonReader.prototype.readRecords.createInterceptor(function(o) {
	var mappings = o.mappings;
	if (mappings && mappings.length > 0) {
		delete this.ef;
		var fields = this.recordType.prototype.fields;
		for (var i = 0, len = mappings.length; i < len; i++) {
			var fieldName = mappings[i];
			Ext.each(fields.items, function(fieldInfo) {
				if (fieldInfo.mapping == fieldName || fieldInfo.name == fieldName) {
					fieldInfo.mapping = i;
					fieldInfo.fieldName = fieldName;    // preserve fieldName
				}
			});
			if (fieldName === this.meta.id) {
				this.meta.id = i;
				var g = this.getJsonAccessor(this.meta.id);
				this.getId = function(rec) {
					var r = g(rec);
					return (r === undefined || r === "") ? null : r;
				};
			}
		}
		if (Ext.version >= "3") {
			this.buildExtractors();
		}
	}
});

// Long length menus should have scroll
if (Ext.version < "3") {
	Ext.override(Ext.menu.Menu, {
		showAt: function(xy, parentMenu, /* private: */_e) {
			this.parentMenu = parentMenu;
			if (!this.el) {
				this.render();
			}
			if (_e !== false) {
				this.fireEvent("beforeshow", this);
				xy = this.el.adjustForConstraints(xy);
			}
			this.el.setXY(xy);
			this.assertMenuHeight(this);
			this.el.show();
			this.hidden = false;
			this.focus();
			this.fireEvent("show", this);
		},

		assertMenuHeight: function(m) {
			var maxHeight = Ext.getBody().getHeight() - 20;
			if (m.el.getHeight() > maxHeight) {
				m.el.setHeight(maxHeight);
				m.el.applyStyles('overflow-y:auto;');
			}
		}
	});
}

Ext.override(Ext.tree.TreeLoader, {
	setData: function (node, o) {
		if (this.clearOnLoad) {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
		}

		if (o) {
			node.beginUpdate();
			for (var i = 0, len = o.length; i < len; i++) {
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
				this.doPreload(n);
			}
			node.endUpdate();
		}
	}
});

Ext.override(Ext.form.Field, {
	setLabel: function(text) {
		if (this.rendered) {
			var r = this.getEl().up('div.x-form-item');
			r.dom.firstChild.firstChild.nodeValue = String.format('{0}', text);
		}
		this.fieldLabel = text;
	},

	setFieldVisible: function(visible) {
		if (this.rendered) {
			this.hidden = !visible;
			this.getEl().up('.x-form-item').setDisplayed(visible);
		}
	},
	setReadOnly: function(readOnly) {
		if (readOnly == this.readOnly) {
			return;
		}
		this.readOnly = readOnly;
		if (this.rendered) {
			if (readOnly) {
				this.el.dom.setAttribute('readOnly', true);
			} else {
				this.el.dom.removeAttribute('readOnly');
			}
		}
	}
});

// Refer: http://www.extjs.com/forum/showthread.php?t=69421
Ext.override(Ext.data.Record, {
	setValues: function(values, fireEvents) {
		if (fireEvents !== false) {
			this.beginEdit();
			for (var name in values) {
				if (values.hasOwnProperty(name)) {
					this.set(name, values[name]);
				}
			}
			this.endEdit();
		} else {
			for (var name in values) {
				if (values.hasOwnProperty(name)) {
					var value = values[name];
					if (String(this.data[name]) !== String(value)) {
						this.dirty = true;
						if (!this.modified) {
							this.modified = {};
						}
						if (typeof this.modified[name] === 'undefined') {
							this.modified[name] = this.data[name];
						}
						this.data[name] = value;
					}
				}
			}
		}
	},
	/**
     * <p>Marks this <b>Record</b> as <code>{@link #dirty}</code>.  This method
     * is used interally when adding <code>{@link #phantom}</code> records to a
     * {@link Ext.data.Store#writer writer enabled store}.</p>
     * <br><p>Marking a record <code>{@link #dirty}</code> causes the phantom to
     * be returned by {@link Ext.data.Store#getModifiedRecords} where it will
     * have a create action composed for it during {@link Ext.data.Store#save store save}
     * operations.</p>
     */
	markDirty: function () {
		this.dirty = true;
		if (!this.modified) {
			this.modified = {};
		}
		this.fields.each(function (f) {
			this.modified[f.name] = this.data[f.name];
		}, this);
	}
});

Ext.apply(Ext.util.Format, {
	numberFormat: {
		decimalSeparator: '.',
		decimalPrecision: 2,
		groupingSeparator: ',',
		groupingSize: 3,
		currencySymbol: '$'
	},
	formatNumber: function(value, numberFormat) {
		var format = Ext.apply(Ext.apply({}, this.numberFormat), numberFormat);
		if (typeof value !== 'number') {
			value = String(value);
			if (format.currencySymbol) {
				value = value.replace(format.currencySymbol, '');
			}
			if (format.groupingSeparator) {
				value = value.replace(new RegExp(format.groupingSeparator, 'g'), '');
			}
			if (format.decimalSeparator !== '.') {
				value = value.replace(format.decimalSeparator, '.');
			}
			value = parseFloat(value);
		}
		var neg = value < 0;
		value = Math.abs(value).toFixed(format.decimalPrecision);
		var i = value.indexOf('.');
		if (i >= 0) {
			if (format.decimalSeparator !== '.') {
				value = value.slice(0, i) + format.decimalSeparator + value.slice(i + 1);
			}
		} else {
			i = value.length;
		}
		if (format.groupingSeparator) {
			while (i > format.groupingSize) {
				i -= format.groupingSize;
				value = value.slice(0, i) + format.groupingSeparator + value.slice(i);
			}
		}
		if (format.currencySymbol) {
			value = format.currencySymbol + value;
		}
		if (neg) {
			value = '-' + value;
		}
		return value;
	}
});

//This override fixes the issue of making the time field blank in editable grid
Ext.override(Ext.form.TimeField, {
	initComponent: Ext.form.TimeField.prototype.initComponent.createSequence(function() {
		this.minChars = 1;
	})
});

if (Ext.version < "3") {
	Ext.override(Ext.form.TextField, {
		// Change how validators work - fire validation even if blank

		/**
		* Validates a value according to the field's validation rules and marks the field as invalid
		* if the validation fails
		* @param {Mixed} value The value to validate
		* @return {Boolean} True if the value is valid, else false
		*/
		validateValue: function(value) {
			if (value === null || value.length < 1 || value === this.emptyText) { // if it's blank
				if (this.allowBlank) {
					if (!this.validateOnBlank) {
						this.clearInvalid();
						return true;
					}
				} else {
					this.markInvalid(this.blankText);
					return false;
				}
			}
			if (value.length < this.minLength) {
				this.markInvalid(String.format(this.minLengthText, this.minLength));
				return false;
			}
			if (value.length > this.maxLength) {
				this.markInvalid(String.format(this.maxLengthText, this.maxLength));
				return false;
			}
			if (this.vtype) {
				var vt = Ext.form.VTypes;
				if (!vt[this.vtype](value, this)) {
					this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
					return false;
				}
			}
			if (typeof this.validator == "function") {
				var msg = this.validator(value);
				if (msg !== true) {
					this.markInvalid(msg);
					return false;
				}
			}
			if (this.regex && !this.regex.test(value)) {
				this.markInvalid(this.regexText);
				return false;
			}
			return true;
		}
	});
}

Ext.override(Ext.form.TextField, {
	//To set the maxLength of HTML field  
	onRender: function(ct, position) {
		Ext.form.TextField.superclass.onRender.call(this, ct, position);
		if (/^[0-9]{1,}$/.test(this.maxLength)) {
			this.el.dom.setAttribute('maxLength', this.maxLength);
		}
	}
});

// redefining Ext.lib.Ajax.serializeForm to handle checkboxes more ideally
if (Ext.version < "3") {
	Ext.lib.Ajax.serializeForm = function(form) {
		if (typeof form == 'string') {
			form = (document.getElementById(form) || document.forms[form]);
		}

		var el, name, val, disabled, data = '', hasSubmit = false;
		for (var i = 0; i < form.elements.length; i++) {
			el = form.elements[i];
			disabled = form.elements[i].disabled;
			name = form.elements[i].name;
			val = form.elements[i].value;

			if (!disabled && name) {
				switch (el.type) {
					case 'select-one':
					case 'select-multiple':
						for (var j = 0; j < el.options.length; j++) {
							if (el.options[j].selected) {
								var opt = el.options[j],
                                        sel = (opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified) ? opt.value : opt.text;
								data += encodeURIComponent(name) + '=' + encodeURIComponent(sel) + '&';
							}
						}
						break;
					case 'radio':
					case 'checkbox':
						if (el.checked) {
							data += encodeURIComponent(name) + "=" + encodeURIComponent(val == "on" ? 'true' : val) + "&";
						} else {
							data += encodeURIComponent(name) + "=" + encodeURIComponent('false') + "&";
						}
						break;
					case 'file':

					case undefined:

					case 'reset':

					case 'button':

						break;
					case 'submit':
						if (hasSubmit === false) {
							data += encodeURIComponent(name) + '=' + encodeURIComponent(val) + '&';
							hasSubmit = true;
						}
						break;
					default:
						data += encodeURIComponent(name) + '=' + encodeURIComponent(val) + '&';
						break;
				}
			}
		}
		data = data.substr(0, data.length - 1);
		return data;
	};
} else {
	Ext.lib.Ajax.serializeForm = function(form) {
		var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
						hasSubmit = false,
						encoder = encodeURIComponent,
						name,
						data = '',
						type;

		Ext.each(fElements, function(element) {
			name = element.name;
			type = element.type;

			if (!element.disabled && name) {
				if (/select-(one|multiple)/i.test(type)) {
					Ext.each(element.options, function(opt) {
						if (opt.selected) {
							data += String.format("{0}={1}&", encoder(name), encoder((opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? opt.value : opt.text));
						}
					});
				} else if (!/file|undefined|reset|button/i.test(type)) {
					var bool = /radio|checkbox/i.test(type);
					if (!(type == 'submit' && hasSubmit)) {
						if (bool) {
							data += encoder(name) + '=' + encoder(element.checked ? (element.value == "on" ? true : element.valueOf) : false) + '&';
						} else {
							data += encoder(name) + '=' + encoder(element.value) + '&';
						}
						hasSubmit = /submit/i.test(type);
					}
				}
			}
		});
		return data.substr(0, data.length - 1);
	};
}

// Default should be off for states. We'll turn-on state for individual components based on our needs
Ext.override(Ext.Component, {
	stateful: false,
	findParentBy: function(fn) {
		for (var p = this.ownerCt; (p != null) && !fn(p); p = p.ownerCt);
		return p;
	},

	findParentByType: function(xtype) {
		return typeof xtype == 'function' ?
            this.findParentBy(function(p) {
            	return p.constructor === xtype;
            }) :
            this.findParentBy(function(p) {
            	return p.constructor.xtype === xtype;
            });
	}
});

Ext.override(Ext.data.Store, {
	isLoaded: function() {
		return this.reader && typeof (this.reader.jsonData) == 'object';
	},
	max: function(col) {
		var max;
		for (var i = 0, len = this.getCount(); i < len; i++) {
			var val = this.getAt(i).get(col);
			if (typeof val !== 'undefined' && val !== null && (max === undefined || val > max)) {
				max = val;
			}
		}
		return max;
	},
	min: function(col) {
		var min;
		for (var i = 0, len = this.getCount(); i < len; i++) {
			var val = this.getAt(i).get(col);
			if (typeof val !== 'undefined' && val !== null && (min === undefined || val < min)) {
				min = val;
			}
		}
		return min;
	},
	findExact: function(property, value, start) {
		return this.data.findIndexBy(function(rec) {
			return rec.get(property) === value;
		}, this, start);
	}
});

if (Ext.version < "3") {
	Ext.override(Ext.form.ComboBox, {
		//Making the combo blank
		onKeyUp: function (e) {
			var k = e.getKey();
			if (this.editable !== false && (k == e.BACKSPACE || !e.isSpecialKey())) {
				this.lastKey = k;
				if (this.getRawValue().length === 0) {
					this.collapse();
				} else {
					this.dqTask.delay(this.queryDelay);
				}
			}
			Ext.form.ComboBox.superclass.onKeyUp.call(this, e);
		},

		findRecordByValue: function (value) {
			if (typeof (value) == "undefined") {
				value = this.getValue();
			}
			if (!this.valueField) {
				return this.findRecord('LookupId', value); //TODO: Fix it permanently later, this works in case where TYPE is also allowed
			} else {
				return this.findRecord(this.valueField, value);
			}
		},
		doQuery: function (q, forceAll) {
			if (q === undefined || q === null) {
				q = '';
			}
			var qe = {
				query: q,
				forceAll: forceAll,
				combo: this,
				cancel: false
			};
			if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
				return false;
			}
			q = qe.query;
			forceAll = qe.forceAll;
			if (forceAll === true || (q.length >= this.minChars)) {
				// checking this.lastQuery == "" because when value is selected in combo then combo's blur event did not called. 
				if (this.lastQuery !== q || this.lastQuery == "") {
					this.lastQuery = q;
					if (this.mode == 'local') {
						this.selectedIndex = -1;
						if (forceAll) {
							this.store.clearFilter();
						} else {
							this.store.filter(this.displayField, q);
						}
						this.onLoad();
					} else {
						this.store.baseParams[this.queryParam] = q;
						this.store.load({
							params: this.getParams(q)
						});
						this.expand();
					}
				} else {
					this.selectedIndex = -1;
					this.onLoad();
				}
			}
		},
		// http://www.extjs.com/forum/showthread.php?t=76524
		beforeBlur: function () {
			var val = this.getRawValue();
			var rec = this.findRecord(this.displayField, val);
			if (!rec && this.forceSelection) {
				if (val.length > 0 && val != this.emptyText) {
					this.el.dom.value = this.lastSelectionText === undefined ? '' : this.lastSelectionText;
					this.applyEmptyText();
				} else {
					this.clearValue();
				}
			} else {
				//var rec = this.findRecord(this.displayField, val);
				if (rec) {
					val = rec.get(this.valueField || this.displayField);
				}
				this.setValue(val);
			}
			this.lastQuery = null;
		},
		onLoad: function () { 
			if (!this.hasFocus) {
				return;
			}
			if (this.store.getCount() > 0) {
				//Fix for avoiding expand on cascading combo's
				if (this.mode === 'local') {
					this.expand();
				}
				this.restrictHeight();
				if (this.lastQuery == this.allQuery) {
					if (this.editable) {
						this.el.dom.select();
					}
					if (!this.selectByValue(this.value, true)) {
						this.select(0, true);
					}
				} else {
					this.selectNext();
					if (this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE) {
						this.taTask.delay(this.typeAheadDelay);
					}
				}
			} else {
				this.onEmptyResults();
			}
			//this.el.focus();
		}
	});
}

// http://www.extjs.com/forum/showthread.php?t=71521
Ext.override(Ext.data.Store, {
	remove: function(record) {
		var index = this.data.indexOf(record);
		if (index > -1) {
			this.data.removeAt(index);
		}
		if (this.pruneModifiedRecords) {
			this.modified.remove(record);
		}
		if (this.snapshot) {
			this.snapshot.remove(record);
		}
		if (index > -1) {
			this.fireEvent("remove", this, record, index);
		}
	},
	insert: function(index, records) {
		records = [].concat(records);
		for (var i = 0, len = records.length; i < len; i++) {
			this.data.insert(index, records[i]);
			records[i].join(this);
		}
		if (this.snapshot) {
			this.snapshot.addAll(records);
		}
		this.fireEvent("add", this, records, index);
	},
	getById: function(id) {
		return (this.snapshot || this.data).key(id);
	}
});

// Don't allow trigger click if datefield is set as readonly
Ext.form.DateField.override({
	oldOnTriggerClick: Ext.form.DateField.prototype.onTriggerClick,
	onTriggerClick: function() {
		if (this.readOnly) {
			return;
		}
		this.oldOnTriggerClick();
	},
	oldParseDate: Ext.form.DateField.prototype.parseDate,

	parseDate: function(value) {
		if (value && value.length <= 3 && !isNaN(value)) {
			var diff = Number(value);
			if (diff >= -365 && diff <= 365) {
				var date = new Date().clearTime();
				date = date.add(Date.DAY, diff);
				return date;
			}
		}
		return this.oldParseDate.call(this, value);
	}
});
if (Ext.version < "3") {
	/*
	Sort based on displayIndex instead of dataIndex, if displayIndex is provided.
	*/

	Ext.grid.GridView.override({
		onHeaderClick: function(g, index) {
			if (this.headersDisabled || !this.cm.isSortable(index)) {
				return;
			}
			g.stopEditing(true);
			var sortDataIndex = this.cm.config[index].displayIndex;
			if (!sortDataIndex) {
				sortDataIndex = this.cm.config[index].dataIndex;
			}
			g.store.sort(sortDataIndex);
		},
		handleHdMenuClick: function(item) {
			var index = this.hdCtxIndex;
			var cm = this.cm, ds = this.ds;
			var sortDataIndex = this.cm.config[index].displayIndex;
			if (!sortDataIndex) {
				sortDataIndex = this.cm.config[index].dataIndex;
			}
			switch (item.id) {
				case "asc":
					ds.sort(sortDataIndex, "ASC");
					break;
				case "desc":
					ds.sort(sortDataIndex, "DESC");
					break;
				default:
					index = cm.getIndexById(item.id.substr(4));
					if (index != -1) {
						if (item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1) {
							this.onDenyColumnHide();
							return false;
						}
						cm.setHidden(index, item.checked);
					}
			}
			return true;
		},
		updateHeaderSortState: function() {
			var state = this.ds.getSortState();
			if (!state) {
				return;
			}
			if (!this.sortState || (this.sortState.field != state.field || this.sortState.direction != state.direction)) {
				this.grid.fireEvent('sortchange', this.grid, state);
			}
			this.sortState = state;
			var sortColumn = this.cm.findColumnIndex(state.field);

			if (sortColumn == -1) {
				// returns an array of column config objects for all hidden columns
				var columns = this.grid.getColumnModel().getColumnsBy(function(c) {
					return c.displayIndex == state.field;
				});
				if (columns && columns.length > 0) {
					var col = columns[0];
					sortColumn = this.cm.findColumnIndex(col.dataIndex);
				}
			}

			if (sortColumn != -1) {
				var sortDir = state.direction;
				this.updateSortIcon(sortColumn, sortDir);
			}
		}
	});
}

if (!Ext.isIE) {
	Ext.chromeVersion = Ext.isChrome ? parseInt((/chrome\/(\d{2})/).exec(navigator.userAgent.toLowerCase())[1], 10) : NaN;
}
Ext.override(Ext.grid.ColumnModel, {
	defaultSortable: true,
	getTotalWidth: function (includeHidden) { //Added for new chrome browser issue
		if (!this.totalWidth) {
			var boxsizeadj = (Ext.isChrome && Ext.chromeVersion > 18 ? 2 : 0);
			this.totalWidth = 0;
			for (var i = 0, len = this.config.length; i < len; i++) {
				if (includeHidden || !this.isHidden(i)) {
					this.totalWidth += (this.getColumnWidth(i) + boxsizeadj);
				}
			}
		}
		return this.totalWidth;
	}
});

Ext.override(Ext.PagingToolbar, {
	addCustomItems: (function() {
		if (Ext.version < "3") {
			return function(items) {
				for (var i = 0, len = items.length; i < len; i++) {
					this.add(items[i]);
				}
			};
		} else {
			return function(items) {
				for (var i = items.length - 1; i > -1; i--) {
					this.insert(11, items[i]);
				}
			};
		}
	} ())
});

// If beforeshow returns false, don't show the menu
Ext.override(Ext.menu.Menu, {
	show: function (el, pos, parentMenu) {
		this.parentMenu = parentMenu;
		if (!this.el) {
			this.render();
		}
		if (this.fireEvent("beforeshow", this) !== false) {
			this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
			//#2644 - changes fixed
			var itemslength = this.items.items.length;
			for (i = 0; i < itemslength; i++) {
				if (this.items.items[i].text == 'Remove Column Quick filter') { // Matching text for getting record
					this.menuRecord = this.items.items[i];
				}
			}
			if (this.menuRecord) {
				this.menuRecord.show();
			}
			if (this.menuRecord && this.menuRecord.scope.filterModel && typeof (this.menuRecord.scope.filterModel.getElementaryFiltersByFieldId(this.menuRecord.scope.cm.getDataIndex(this.menuRecord.grid.getView().hdCtxIndex))[0]) == 'undefined') {
				this.menuRecord.hide(); // hiding menurecord if no quick filters
				this.el.disableShadow();// hiding menu shadow if no quick filters
			}
		}
	}
});

Ext.form.Field.override({ selectOnFocus: true });
Ext.form.TextField.override({ selectOnFocus: true });
Ext.form.TextArea.override({ selectOnFocus: true });
Ext.form.ComboBox.override({ selectOnFocus: true });
Ext.form.DateField.override({ selectOnFocus: true });
Ext.form.TimeField.override({ selectOnFocus: true });
Ext.form.TriggerField.override({ selectOnFocus: true });
Ext.form.TwinTriggerField.override({ selectOnFocus: true });

// Allows the grid to remain in editing mode if beforeedit return false
(function() {
	var acceptsNav = function(row, col, cm) {
		var acceptsNav = !cm.isHidden(col) && cm.isCellEditable(col, row);
		if (acceptsNav) {
			var e = {
				grid: this.grid,
				record: this.grid.getStore().getAt(row),
				field: cm.getDataIndex(col),
				row: row,
				column: col,
				cancel: false
			};
			e.value = e.record.get(e.field);
			acceptsNav = this.grid.fireEvent("beforeedit", e) !== false && !e.cancel;
		}
		return acceptsNav;
	};
	Ext.grid.RowSelectionModel.prototype.acceptsNav = acceptsNav;
	Ext.grid.CellSelectionModel.prototype.acceptsNav = acceptsNav;
} ());

// Backspace fix on GridPanel
Ext.grid.GridPanel.override({
	onRender: Ext.grid.GridPanel.prototype.onRender.createSequence(function() {
		this.on('keydown', function(e) {
			var key = e.getKey();
			if(key === e.BACKSPACE) {
				e.stopEvent();
			}
		});
	})
});

Ext.grid.EditorGridPanel.override({
	updateRecord: function(record, data) {
		record.setValues(data, false);
		this.getView().refreshRow(record);
		var activeEditor = this.activeEditor;
		if (activeEditor) {
			var isExpandable = false;
			var dataIndex = this.colModel.getDataIndex(activeEditor.col);
			if (typeof activeEditor.field.collapse === 'function') {
				activeEditor.field.collapse();
				isExpandable = true;
			}
			if (typeof data[dataIndex] !== 'undefined') {
				activeEditor.setValue(data[dataIndex]);
				activeEditor.field.selectText();
			}
		}
	},
	startEditing: function (row, col) {
		this.stopEditing();
		if (this.colModel && this.colModel.isCellEditable(col, row)) {
			this.view.ensureVisible(row, col, true);
			var r = this.store.getAt(row);
			var field = this.colModel.getDataIndex(col);
			var e = {
				grid: this,
				record: r,
				field: field,
				value: r.data[field],
				row: row,
				column: col,
				cancel: false
			};
			if (this.fireEvent("beforeedit", e) !== false && !e.cancel) {
				this.editing = true;
				var ed = this.colModel.getCellEditor(col, row);
				if (!ed) {
					return;
				}
				if (!ed.rendered) {
					ed.parentEl = this.view.getEditorParent(ed);
					ed.on({
						scope: this,
						render: {
							fn: function (c) {
								c.field.focus(false, true);
							},
							single: true,
							scope: this
						},
						specialkey: function (field, e) {
							var colCount = this.colModel.getColumnCount();
							if (e.getKey() == e.ENTER && this.getSelectionModel() && this.getSelectionModel().select) {
								this.getSelectionModel().select(field.row, field.col);// Added to set selection in the grid on pressing enter key.
								this.getSelectionModel().onEditorKey(field, e);
							}
							else if (e.getKey() == e.ENTER && (field.col + 1 < colCount)) {
								this.getSelectionModel().grid.startEditing(field.row, field.col + 1);
							}
							else {
								this.getSelectionModel().onEditorKey(field, e);
							}
						},
						complete: this.onEditComplete,
						canceledit: this.stopEditing.createDelegate(this, [true])
					});
				}
				Ext.apply(ed, {
					row: row,
					col: col,
					record: r
				});

				this.lastEdit = {
					row: row,
					col: col
				};
				this.activeEditor = ed;
				var v = this.preEditValue(r, field);
				ed.startEdit(this.view.getCell(row, col).firstChild, v !== undefined ? v : '');
			}
		}
	}
});

Ext.Ajax.override({
	timeout: 120000
});
Ext.isObject = function (v) {
	return !!v && Object.prototype.toString.call(v) === '[object Object]';
};

Ext.override(Ext.Button, {
	setTooltip: function (tooltip, /* private */initial) {
		if (this.rendered) {
			if (!initial) {
				this.clearTip();
			}
			if (Ext.isObject(tooltip)) {
				Ext.QuickTips.register(Ext.apply({
					target: this.btnEl.id
				}, tooltip));
				this.tooltip = tooltip;
			} else {
				this.btnEl.dom[this.tooltipType] = tooltip;
			}
		} else {
			this.tooltip = tooltip;
		}
		return this;
	},

	// private
	clearTip: function () {
		if (Ext.isObject(this.tooltip)) {
			Ext.QuickTips.unregister(this.btnEl);
		}
	}
});
//When we click SPACE on Test Box then remove space #3274
Ext.override(Ext.form.TextField, {
	onBlur: Ext.form.TextField.prototype.onBlur.createSequence(function (impl, e) {
		if (e) {
			e.value = e.value.trim();
		}
	})
});
Ext.override(Ext.Editor, {
	onSpecialKey: function (field, e) {
		var key = e.getKey(),
			complete = this.completeOnEnter && key == e.ENTER,
			cancel = this.cancelOnEsc && key == e.ESC;

		if (complete) {
			e.stopEvent();
			this.completeEdit();
		} else if (cancel) {
			e.stopEvent(); // Stop FF grid view scrolling to the top
			this.cancelEdit();
		}
		if (field.triggerBlur && (complete || cancel)) {
			field.triggerBlur();
		}
		field.row = this.row;
		field.col = this.col;
		this.fireEvent('specialkey', field, e);
	}
});
Ext.override(Ext.form.BasicForm, {
	afterAction: function (action, success) {
		this.activeAction = null;
		var o = action.options;
		if (o.waitMsg) {
			if (this.waitMsgTarget === true) {
				this.el.unmask();
			} else if (this.waitMsgTarget) {
				this.waitMsgTarget.unmask();
			} else {
				Ext.MessageBox.updateProgress(1);
				Ext.MessageBox.hide();
			}
		}
		if (success) {
			if (o.reset) {
				this.reset();
			}
			Ext.callback(o.success, o.scope, [this, action]);
			this.fireEvent('actioncomplete', this, action);
		} else {
			if (action && action.response && action.response.responseText) {
				var response = Ext.decode(action.response.responseText);
				if (this.findField("CheckOldVersion") && response && response.info && response.info.indexOf('ConcurrencyException') > -1) {
					this.action = action;
					var activeFormTitle = DCPLApp.TabPanel.getActiveTab().title.split(':')[0];
					var messageText = "Cannot save. This record has just been updated by " + response.info.split('-')[1] + ". Click Reload to bring in the current record and make your changes again, or click Cancel.";
					if (!this.concurrencyAlertWindow) {
						var concurrencyAlertWindow = new Ext.Window({
							title: 'Alert',
							html: messageText,
							layout: 'fit',
							height: 120,
							width: 300,
							closeAction: 'hide',
							resizable: false,
							buttons: [
								{
									text: 'Reload',
									handler: function () {
										var options = {};
										options.params = { action: 'load', comboTypes: "[]" };
										options.waitMsg = true;
										this.load(options);
										this.concurrencyAlertWindow.hide();
									},
									scope: this
								}, {
									text: 'Cancel',
									handler: function () {
										this.concurrencyAlertWindow.hide();
									},
									scope: this
								}, this]
						}, this);
						this.concurrencyAlertWindow = concurrencyAlertWindow;
					}
					if (DCPLApp.ActiveTab && DCPLApp.ActiveTab.container && DCPLApp.ActiveTab.container.mask()) {
						DCPLApp.ActiveTab.container.mask().hide();
					}
					this.concurrencyAlertWindow.html = messageText;
					this.concurrencyAlertWindow.show();
				}
				else {
					Ext.callback(o.failure, o.scope, [this, action]);
					this.fireEvent('actionfailed', this, action);
				}
			}
		}
	}
});
