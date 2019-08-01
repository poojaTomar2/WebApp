/*globals Ext,EH,ExtHelper,window,document,swfobject */
// JScript File
Ext.applyIf(String.prototype, {
	toTitleCase: function () {
		return this.replace(/([\w&`'‘’"“.@:\/\{\(\[<>_]+-? *)/g, function (match, p1, index, title) {
			if (index > 0 && title.charAt(index - 2) != ":" && match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ -]/i) > -1) {
				return match.toLowerCase();
			}
			if (title.substring(index - 1, index + 1).search(/['"_{([]/) > -1) {
				return match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2);
			}
			if (match.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || title.substring(index - 1, index + 1).search(/[\])}]/) > -1) {
				return match;
			}
			return match.charAt(0).toUpperCase() + match.substr(1);
		});
	},
	toSentenceCase: function () { //Converts: WHAT ARE YOU DOING? -> What are you doing?
		val = this;
		result = new Array();
		result2 = '';
		count = 0;
		endSentence = new Array();
		for (var i = 1; i < val.length; i++) {
			if (val.charAt(i) == '.' || val.charAt(i) == '!' || val.charAt(i) == '?') {
				endSentence[count] = val.charAt(i);
				count++
			}
		}
		var val2 = val.split(/[.|?|!]/);
		if (val2[val2.length - 1] == '') val2.length = val2.length - 1;
		for (var j = 0; j < val2.length; j++) {
			val3 = val2[j];
			if (val3.substring(0, 1) != ' ') val2[j] = ' ' + val2[j];
			var temp = val2[j].split(' ');
			var incr = 0;
			if (temp[0] == '') {
				incr = 1;
			}
			temp2 = temp[incr].substring(0, 1);
			temp3 = temp[incr].substring(1, temp[incr].length);
			temp2 = temp2.toUpperCase();
			temp3 = temp3.toLowerCase();
			temp[incr] = temp2 + temp3;
			for (var i = incr + 1; i < temp.length; i++) {
				temp2 = temp[i].substring(0, 1);
				temp2 = temp2.toLowerCase();
				temp3 = temp[i].substring(1, temp[i].length);
				temp3 = temp3.toLowerCase();
				temp[i] = temp2 + temp3;
			}
			if (endSentence[j] == undefined) endSentence[j] = '';
			result2 += temp.join(' ') + endSentence[j];
		}
		if (result2.substring(0, 1) == ' ') result2 = result2.substring(1, result2.length);
		return result2;
	}
});

Date.prototype.Equals = function (date, ignoreTime) {
	var formatToCheck = ignoreTime ? 'Y-m-d' : 'U';
	return date instanceof Date && date.format(formatToCheck) == this.format(formatToCheck);
};

Ext.ns("Ext.ux");
Ext.ns("Ext.ux.renderer");
Ext.ux.IFrameComponent = Ext.extend(Ext.BoxComponent, {
	onRender: function (ct, position) {
		this.el = ct.createChild({ tag: 'iframe', id: 'iframe-' + this.id, name: 'iframe-' + this.id, frameBorder: 0 });
		this.setUrl(this.url);
	},

	setUrl: function (url) {
		this.url = url;
		if (this.rendered) {
			this.el.dom.src = url;
		}
	}
});

Ext.ux.BoxSelect = Ext.extend(Ext.form.ComboBox, {

	initComponent: function () {
		Ext.apply(this, {
			selectedValues: {},
			boxElements: {},
			current: false,
			options: {
				className: 'bit',
				separator: ','
			},
			hideTrigger: true,
			grow: false
		});

		Ext.ux.BoxSelect.superclass.initComponent.call(this);
	},

	onRender: function (ct, position) {
		Ext.ux.BoxSelect.superclass.onRender.call(this, ct, position);

		this.el.removeClass('x-form-text');
		this.el.className = 'maininput';
		this.el.setWidth(20);

		this.holder = this.el.wrap({
			'tag': 'ul',
			'class': 'holder x-form-text'
		});

		this.holder.on('click', function (e) {
			e.stopEvent();
			if (this.maininput != this.current) this.focus(this.maininput);
		}, this);

		this.maininput = this.el.wrap({
			'tag': 'li', 'class': 'bit-input'
		});


		Ext.apply(this.maininput, {
			'focus': function () {
				this.focus();
			}.createDelegate(this)
		})

		this.store.on('datachanged', function (store) {
			this.store.each(function (rec) {
				if (this.checkValue(rec.data[this.valueField])) {
					this.removedRecords[rec.data[this.valueField]] = rec;
					this.store.remove(rec);
				}
			}, this);
		}, this);

		this.on('expand', function (store) {
			this.store.each(function (rec) {
				if (this.checkValue(rec.data[this.valueField])) {
					this.removedRecords[rec.data[this.valueField]] = rec;
					this.store.remove(rec);
				}
			}, this);
		}, this);

		this.removedRecords = {};
	},

	onResize: function (w, h, rw, rh) {
		this._width = w;
		this.holder.setWidth(w - 4);
		Ext.ux.BoxSelect.superclass.onResize.call(this, w, h, rw, rh);
		this.autoSize();
	},

	onKeyUp: function (e) {
		var value = this.el.dom.value;
		if (this.editable !== false && !e.isSpecialKey()) {
			if (e.getKey() == e.BACKSPACE && this.lastValue.length == 0) {
				e.stopEvent();
				this.collapse();
				var el = this.maininput.prev();
				if (el) el.focus();
				return;
			}
			this.dqTask.delay(this.queryDelay);
		}
		if (e.getKey() === Ext.EventObject.ENTER) {
			if ((value && this.store.findExact('DisplayValue', value) > -1) || (value && this.removedRecords[value] && this.store.findExact('DisplayValue', value)) == -1) {
				Ext.Msg.alert('Alert', "Duplicate tag value not allowed");
				return false;
			}
			else {
				this.addCustomTags();
			}
		}

		this.autoSize();

		Ext.ux.BoxSelect.superclass.onKeyUp.call(this, e);

		this.lastValue = value;

	},

	postBlur: function () {
		this.addCustomTags();
	},
	addCustomTags: function () {
		if (this.lastValue && this.store.findExact('DisplayValue', this.lastValue) == -1 && !this.removedRecords[this.lastValue]) {
			LookupRecord = Ext.data.Record.create([
									{ name: 'LookupId', type: 'int' },
									{ name: 'DisplayValue', type: 'string' }
			]);
			var record = new LookupRecord({
				LookupId: Ext.id(),
				DisplayValue: this.lastValue
			})
			this.store.add(record);
			this.collapse();
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.setValue(this.lastValue);
			this.lastValue = '';
		}
	},
	onSelect: function (record, index) {
		var val = record.data[this.valueField];
		var isExists = this.getValue().split(',').indexOf(val) > -1;
		this.selectedValues[val] = val;

		if (typeof this.displayFieldTpl === 'string')
			this.displayFieldTpl = new Ext.XTemplate(this.displayFieldTpl);

		if (!this.boxElements[val]) {
			var caption;
			if (this.displayFieldTpl)
				caption = this.displayFieldTpl.apply(record.data)
			else if (this.displayField)
				caption = record.data[this.displayField];
			if (!isExists) {
				this.addItem(record.data[this.valueField], caption)
			} else {
				Ext.Msg.alert('Alert', "Duplicate tag value not allowed");
				return false;
			}

		}
		this.collapse();
		this.setRawValue('');
		this.lastSelectionText = '';
		this.applyEmptyText();
		this.lastValue = '';
		this.autoSize();
	},

	onEnable: function () {
		Ext.ux.BoxSelect.superclass.onEnable.apply(this, arguments);
		for (var k in this.boxElements) {
			this.boxElements[k].enable();
		}
	},

	onDisable: function () {
		Ext.ux.BoxSelect.superclass.onDisable.apply(this, arguments);
		for (var k in this.boxElements) {
			this.boxElements[k].disable();
		}
	},

	getValue: function () {
		var ret = [];
		for (var k in this.selectedValues) {
			if (this.selectedValues[k])
				ret.push(this.selectedValues[k]);
		}
		return ret.join(this.options['separator']);
	},

	setValue: function (value) {
		//this.removeAllItems();
		this.store.clearFilter();
		this.resetStore();

		if (Ext.isArray(this.value) && typeof this.value[0] === 'object' && this.value[0].data) {
			this.setValues(this.value);
		}
		else {
			if (value && typeof value === 'string') {
				value = value.split(',');
			}

			var values = [];

			if (this.mode == 'local') {
				Ext.each(value, function (item) {
					//So that we get the exact index
					var index = this.store.findExact(this.valueField, item.trim());
					if (index > -1) {
						values.push(this.store.getAt(index));
					}
				}, this);
			} else {
				this.store.baseParams[this.queryParam] = value;
				this.store.load({
					params: this.getParams(value)
				});
			}
			this.setValues(values);
		}
	},

	setValues: function (values) {
		if (values) {
			Ext.each(values, function (data) {
				this.onSelect(data);
			}, this);
		}

		this.value = '';
	},

	removeAllItems: function () {
		for (var k in this.boxElements) {
			this.boxElements[k].dispose(true);
		}
		//this will remove the store in case of removeAllItems method is used
		if (this.store.getCount() > 0) {
			this.store.removeAll();
			this.removedRecords = {};
		}
	},

	resetStore: function () {
		for (var k in this.removedRecords) {
			var rec = this.removedRecords[k];
			this.store.add(rec);
		}
		this.sortStore();
	},

	sortStore: function () {
		var si = this.store.getSortState();
		if (si && si.field)
			this.store.sort(si.field, si.direction);
	},

	addItem: function (id, caption) {
		var box = new Ext.ux.BoxSelect.Item({
			id: 'Box_' + id,
			maininput: this.maininput,
			renderTo: this.holder,
			className: this.options['className'],
			caption: caption,
			disabled: this.disabled,
			'value': id,
			listeners: {
				'remove': function (box) {
					delete this.selectedValues[box.value];
					var rec = this.removedRecords[box.value];
					if (rec) {
						var index = this.store.findExact(this.valueField, rec.get('DisplayValue'));
						if (index == -1) {
							this.store.add(rec);
							this.sortStore();
							this.view.render();
						}
						//this.removedRecords[box.value] = null;
					}
				},
				scope: this
			}
		});
		box.render();

		box.hidden = this.el.insertSibling({
			'tag': 'input',
			'type': 'hidden',
			'value': id,
			'name': (this.hiddenName || this.name)
		}, 'before', true);

		this.boxElements['Box_' + id] = box;
	},

	autoSize: function () {
		if (!this.rendered) {
			return;
		}
		if (!this.metrics) {
			this.metrics = Ext.util.TextMetrics.createInstance(this.el);
		}
		var el = this.el;
		var v = el.dom.value;
		var d = document.createElement('div');
		d.appendChild(document.createTextNode(v));
		v = d.innerHTML;
		d = null;
		v += "&#160;";
		var w = Math.max(this.metrics.getWidth(v) + 10, 10);
		if (typeof this._width != 'undefined')
			w = Math.min(this._width, w);

		this.el.setWidth(w);

		if (Ext.isIE) {
			this.el.dom.style.top = '0';
		}
	},

	onEnable: function () {
		Ext.ux.BoxSelect.superclass.onEnable.apply(this, arguments);

		for (var k in this.boxElements) {
			this.boxElements[k].enable();
		}
	},

	onDisable: function () {
		Ext.ux.BoxSelect.superclass.onDisable.apply(this, arguments);

		for (var k in this.boxElements) {
			this.boxElements[k].disable();
		}
	},

	checkValue: function (value) {
		return (typeof this.selectedValues[value] != 'undefined');
	}
});

Ext.reg('boxselect', Ext.ux.BoxSelect);

Ext.ux.BoxSelect.Item = Ext.extend(Ext.Component, {

	initComponent: function () {
		Ext.ux.BoxSelect.Item.superclass.initComponent.call(this);
	},

	onElClick: function (e) {
		this.focus();
	},

	onLnkClick: function (e) {
		e.stopEvent();
		this.dispose();
	},

	onLnkFocus: function () {
		this.el.addClass("bit-box-focus");
	},

	onLnkBlur: function () {
		this.el.removeClass("bit-box-focus");
	},

	enableElListeners: function () {
		this.el.on('click', this.onElClick, this, { stopEvent: true });
	},

	enableLnkListeners: function () {
		this.lnk.on({
			'click': this.onLnkClick,
			'focus': this.onLnkFocus,
			'blur': this.onLnkBlur,
			scope: this
		});
	},

	enableAllListeners: function () {
		this.enableElListeners();
		this.enableLnkListeners();
	},

	disableAllListeners: function () {
		this.el.un('click', this.onElClick, this);

		this.lnk.un('click', this.onLnkClick, this);
		this.lnk.un('focus', this.onLnkFocus, this);
		this.lnk.un('blur', this.onLnkBlur, this);
	},

	onRender: function (ct, position) {
		Ext.ux.BoxSelect.Item.superclass.onRender.call(this, ct, this.maininput);

		this.addEvents('remove');

		this.addClass('bit-box');

		this.el = ct.createChild({ tag: 'li' }, this.maininput);
		this.el.addClassOnOver('bit-hover');

		Ext.apply(this.el, {
			'focus': function () {
				this.down('a.closebutton').focus();
			},
			'dispose': function () {
				this.dispose();
			}.createDelegate(this)

		});

		this.enableElListeners();

		this.el.update(this.caption);

		this.lnk = this.el.createChild({
			'tag': 'a',
			'class': 'closebutton',
			'href': '#'
		});

		if (!this.disabled)
			this.enableLnkListeners();
		else
			this.disableAllListeners();

		this.on({
			'disable': this.disableAllListeners,
			'enable': this.enableAllListeners,
			scope: this
		});

		new Ext.KeyMap(this.lnk, [
			{
				key: [Ext.EventObject.BACKSPACE, Ext.EventObject.DELETE],
				fn: function () {
					this.dispose();
				}.createDelegate(this)
			},
			{
				key: Ext.EventObject.RIGHT,
				fn: function () {
					this.move('right');
				}.createDelegate(this)
			},
			{
				key: Ext.EventObject.LEFT,
				fn: function () {
					this.move('left');
				}.createDelegate(this)
			},
			{
				key: Ext.EventObject.TAB,
				fn: function () {
				}.createDelegate(this)
			}
		]).stopEvent = true;

	},

	move: function (direction) {
		if (direction == 'left')
			el = this.el.prev();
		else
			el = this.el.next();
		if (el)
			el.focus();
	},

	dispose: function (withoutEffect) {
		this.fireEvent('remove', this);

		if (withoutEffect) {
			this.destroy();
		}
		else {
			this.el.hide({
				duration: .5,
				callback: function () {
					this.move('right');
					this.destroy()
				}.createDelegate(this)
			});
		}

		return this;
	}

});

Ext.ux.GridHeaderContextMenu = function () {
	this.init = function (grid) {
		this.grid = grid;
		this.grid.on('headercontextmenu', this.onGridHeaderClick, this);
		//this.grid.on('mousedown', this.onMouseDown, this);
		this.grid.on('click', this.onClick, this);
	}
	this.onGridHeaderClick = function (g, colIndex, e) {
		this.colIndex = colIndex;
		e.preventDefault();
		var colMenu = this.grid.colModel.config[colIndex]['headerMenu'];
		if (colMenu) {
			colMenu.showAt(e.getXY());
			colMenu.on('click', this.menuItemClick, this);
		}

	}
	this.menuItemClick = function (m, mItem, e) {
		e.stopEvent();
		var handler = mItem['menuhandler'];
		if (handler) {
			handler.apply(this, [this.colIndex])
		}
	}
	this.onClick = function (checked) {
		var selCol = this.grid.colModel.config[0];

		if (typeof selCol.beforeCheckSelected == 'function') {
			var allowClick = true;

			var record = this.grid.getSelectionModel().getSelected();

			if (record) {
				allowClick = selCol.beforeCheckSelected(record);

				if (!allowClick) {
					checked.target.checked = !checked.target.checked; //Reversing
				}
			}
		}

		this.updateOnClick(this.grid, checked);
	}

	this.updateOnClick = function (grid, checked) {
		var checkboxes = grid.getEl().select("div.x-grid3-col-selection-checkbox > input[type='checkbox']").elements;
		for (var j = 0, len = checkboxes.length; j < len; j++) {
			grid.getStore().data.items[j].data.isSelected = checkboxes[j].checked;
		}
	}

};

Ext.ux.GridRowChecker = function (config) {
	init = function (grid) {
		this.grid = grid;
		this.gridSelModel = this.grid.getSelectionModel();
		this.gridSelModel.originalMouseDown = this.gridSelModel.handleMouseDown;
		this.gridSelModel.handleMouseDown = this.onGridMouseDown;
		grid.getColumnModel().config.unshift(this);
		grid.gridSelModel.getChecked = this.getChecked.createDelegate(this);
	}
	config.id = 'selection-checkbox';
	config.headerMenu = new Ext.menu.Menu({
		items: [{
			text: 'Select All',
			menuhandler: function (columnIndex) {
				this.grid.colModel.config[columnIndex].updateChecked(true, this.grid);
			},
			scope: this
		},
		{
			text: 'Un-Select All',
			menuhandler: function (columnIndex) {
				this.grid.colModel.config[columnIndex].updateChecked(false, this.grid);
			},
			scope: this
		}]
	}, this);
	this.onGridMouseDown = function (g, rowIndex, e) {
		if (e.getTarget('div.x-grid3-col-selection-checkbox')) {
			e.stopEvent();
			return false;
		}
		this.originalMouseDown.apply(this, arguments);
	}
	Ext.apply(this, config);
};
Ext.ux.GridRowChecker.prototype = {
	init: function (grid) {
		this.grid = grid;
		this.gridSelModel = this.grid.getSelectionModel();
		this.gridSelModel.originalMouseDown = this.gridSelModel.handleMouseDown;
		this.gridSelModel.handleMouseDown = this.onGridMouseDown;
		grid.getColumnModel().config.unshift(this);
		grid.gridSelModel.getChecked = this.getChecked.createDelegate(this);
	},

	renderer: function (v, p, record) {
		return '<input class="x-row-checkbox" type="checkbox">';
	},

	getChecked: function () {
		var result = [];
		var cb = this.grid.getEl().query("div.x-grid3-col-selection-checkbox > input[type=checkbox]");
		var idx = 0;
		this.grid.store.each(function (rec) {
			if (cb[idx++].checked) {
				result.push(rec);
			}
		});
		delete cb;
		return result;
	},
	onGridMouseDown: function (g, rowIndex, e) {
		if (e.getTarget('div.x-grid3-col-selection-checkbox')) {
			e.stopEvent();
			return false;
		}
		this.originalMouseDown.apply(this, arguments);
	},
	allowChange: function (grid, index) {
		var selCol = grid.colModel.config[0];
		var changeCheck = true;
		if (typeof selCol.beforeCheckSelected == 'function') {
			var record = grid.getStore().getAt(index);
			if (record) {
				changeCheck = selCol.beforeCheckSelected(record);
			}
		}
		return changeCheck;
	},
	updateChecked: function (checked, grid) {
		var index = 0;
		grid.getEl().select("div.x-grid3-col-selection-checkbox > input[type='checkbox']").each(function (e) {
			var changeCheck = this.allowChange(grid, index);
			var selCol = grid.colModel.config[0];
			if (changeCheck) {
				e.dom.checked = checked;
			}
			var length = grid.store.data.length;
			for (var i = 0; i < length; i++) {
				changeCheck = this.allowChange(grid, i);
				if (changeCheck) {
					grid.getStore().data.items[i].data.isSelected = checked;
				}
			}
			index++;
		}, this);
	}
};
Ext.ux.IFramePanel = Ext.extend(Ext.Panel, {
	layout: 'fit',

	initComponent: function () {
		Ext.ux.IFramePanel.superclass.initComponent.call(this);
		this.add(new Ext.ux.IFrameComponent({ url: this.url }));
	},

	setUrl: function (url) {
		this.url = url;
		this.items.itemAt(0).setUrl(url);
	}
});

Ext.grid.CheckColumn = function (config) {
	Ext.apply(this, config);
	//this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
	menuText: {
		selectAll: "Select All",
		unselectAll: "Unselect All"
	},

	beforeCheckSelected: function (record) {
		return true;
	},

	menuHandler: function (item, e) {
		var selected = item.text == this.menuText.selectAll;
		var store = this.grid.getStore();
		var field = this.field;
		var checkRecord = this.grid.colModel.config[item.scope.colIndex];
		store.each(function (record) {
			if (checkRecord.beforeCheckSelected(record)) {
				record.set(field, selected);
			}
		});
		this.menu.hide();
	},

	init: function (grid) {
		this.menu = new Ext.menu.Menu([
            { text: this.menuText.selectAll, handler: this.menuHandler, scope: this },
            { text: this.menuText.unselectAll, handler: this.menuHandler, scope: this }
		]);

		this.grid = grid;
		this.grid.on('render', function () {
			var view = this.grid.getView();
			view.mainBody.on('mousedown', this.onMouseDown, this);
		}, this);

		this.grid.on('headercontextmenu', function (grid, colIndex, e) {
			this.colIndex = colIndex;
			this.field = grid.getColumnModel().getDataIndex(colIndex);
			var gv = grid.getView();
			var cell = gv.getCell(0, colIndex);
			if (cell.className && cell.className.indexOf('ux-checked') != -1) {
				e.stopEvent();
				this.menu.showAt(e.getXY());
			}
		}, this);
	},

	handleClick: function (e, t) {
		var className;
		if (t.tagName === "DIV") {
			className = t.parentNode.className;
		} else {
			className = t.className;
		}
		if (className && className.indexOf('ux-checked') != -1) {
			var row = this.grid.view.findRowIndex(t);
			var col = this.grid.view.findCellIndex(t);
			var r = this.grid.store.getAt(row);
			var field = this.grid.colModel.getDataIndex(col);
			var xe = {
				grid: this.grid,
				record: r,
				field: field,
				value: r.data[field],
				row: row,
				column: col,
				cancel: false
			};
			if (this.grid.fireEvent("beforeedit", xe, this.grid) !== false && xe.cancel !== true) {
				e.stopEvent();
				var index = row;
				var record = this.grid.store.getAt(index);
				record.set(field, !record.get(field));
				this.grid.fireEvent("cellclick", this.grid, row, col);
			}
		}

	},

	onMouseDown: function (e, t) {
		this.handleClick(e, t);
	},

	renderer: function (v, p, record) {
		p.css += ' ux-checked' + (v ? '-on' : '');
		return '&#160;';
	}
};

Ext.state.Manager.setProvider(new Ext.ux.state.HttpProvider({
	readUrl: 'controllers/UserState.ashx?action="read"',
	saveUrl: 'controllers/UserState.ashx', autoRead: false,
	initState: function (state) {
		if (typeof state === 'object') {
			for (var k in state) {
				if (typeof state[k] == 'string') {
					this.state[k] = this.decodeValue(state[k]);
				}
			}
		} else {
			this.state = {};
		}
	}
}));

Ext.ux.renderer.Check = function (value, p) {
	var v = value === true || value === "true" || (isNaN(value) && Number(value) !== 0);
	p.css += ' ux-checked' + (v ? '-on' : '');
	return '&#160;';
};

Ext.ux.renderer.Proxy = function (fieldName) {
	return function (v, m, r) {
		return r.get(fieldName);
	};
};

Ext.ns("Ext.ux.util");
Ext.ux.util.MoveProperties = function (src, dest, properties) {
	for (var i = 0, len = properties.length; i < len; i++) {
		var property = properties[i];
		if (typeof (src[property]) != 'undefined') {
			dest[property] = src[property];
			delete src[property];
		}
	}
	return;
};


Ext.ux.Image = function (config) {
	var c = config || {};
	Ext.applyIf(c, {
		autoEl: { tag: 'img' }
	});

	// Transfer src, width, height to autoEl
	Ext.ux.util.MoveProperties(c, c.autoEl, ["src", "width", "height"]);

	Ext.ux.Image.superclass.constructor.call(this, c);
};

Ext.extend(Ext.ux.Image, Ext.BoxComponent, {
	setSrc: function (url, avoidCaching) {
		if (avoidCaching) {
			url += "?v=" + (new Date().getTime());
		}
		this.el.set({ src: url });
	}
});

Ext.reg('xImage', Ext.ux.Image);

Ext.ux.DateLocalizer = function (v) {
	if (!v) {
		return '';
	}
	if (!Ext.isDate(v)) {
		v = Date.parseDate(v, Ext.data.Field.prototype.dateFormat);
	}
	if (Ext.isDate(v)) {
		if (1 == 2) {
			//New Code
			var targetTime = new Date(v);
			//get the timezone offset from local time in minutes
			var tzDifference = targetTime.getTimezoneOffset();
			//convert the offset to milliseconds, add to targetTime, and make a new Date
			v = new Date(targetTime.getTime() + tzDifference);
		} else {
			v = v.add(Date.MINUTE, -v.getTimezoneOffset());
		}
	}
	return v;
};

/*
Ext.ux.CapitalizeText = function() {
var field = this;
var xtype = field.getXType();
	
// Check if autoCapitalize is on and the field is a valid field and not inherited one
if (field.autoCapitalize && ['textfield', 'textarea'].indexOf(xtype) > -1) {
var value = field.getRawValue();
if (typeof (value) === 'string' && value.length > 1) {
var newValue;
			
// Capitalize only if the typed text is all lower case or upper case
if (value === value.toUpperCase()) {
newValue = value.toLowerCase().toTitleCase();
} else if (value === value.toLowerCase()) {
newValue = value.toTitleCase();
}
if (newValue && value !== newValue) {
field.setRawValue(newValue);
}
}
}
};

Ext.form.TextField.override({
//autoCapitalize: true,
initEvents: Ext.form.TextField.prototype.initEvents.createInterceptor(function() {
this.on('change', Ext.ux.CapitalizeText);
})
});*/

Ext.ns("Ext.ux.grid");
Ext.ux.grid.DownloadColumn = function (config) {
	Ext.apply(this, config);
	this.setRenderer(this.text);
};

Ext.ux.grid.DownloadColumn.prototype = {
	init: function (grid) {
		grid.on('cellclick', this.cellClick);
	},

	isDownloadColumn: true,

	cellClick: function (grid, rowIndex, colIndex) {
		var cm = grid.getColumnModel();
		var col = cm.getColumnById(cm.getColumnId(colIndex));
		if (col.isDownloadColumn) {
			var record = grid.getStore().getAt(rowIndex);
			var filename = record.get(col.dataIndex);
			if (filename) {
				var storedFilename;
				if (col.storedFileDataIndex) {
					storedFilename = record.get(col.storedFileDataIndex);
				}
				if (!storedFilename) {
					storedFilename = filename;
				}
				window.open(EH.BuildUrl('downloadattachment') + '?Filename=' + storedFilename + '&useFileServer=1&saveAs=' + filename);
			}
		}
	},

	storedFileDataIndex: 'StoredFilename',
	header: 'Download',
	dataIndex: 'Filename',
	text: 'Download',
	setRenderer: function (text) {
		this.renderer = function (v, m, record) {
			if (v) {
				m.css = "hyperlink";
				return text;
			} else {
				return " ";
			}
		};
	}
};

Ext.ux.grid.DateTimeColumn = function (config) {
	if (!config.editor) {
		config.editor = new Ext.ux.form.DateTime({ dateValidation: config.dateValidation });
	}
	Ext.applyIf(config, {
		renderer: ExtHelper.renderer.DateTime
	});
	Ext.apply(this, config);
	return this;
};

Ext.ux.grid.DateTimeColumn.prototype = {
	width: 155
};

Ext.ux.grid.DateColumn = function (config) {
	if (!config.editor) {
		config.editor = new Ext.form.DateField();
	}
	Ext.applyIf(config, {
		renderer: ExtHelper.renderer.Date
	});
	Ext.apply(this, config);
	return this;
};

Ext.ux.grid.DateColumn.prototype = {
	width: 70
};

if (Ext.ux.grid.GridSummary) {
	var fixedRenderer = function (v, record, field, data) {
		var jsonData = record.store.reader.jsonData;
		return jsonData.Totals[field];
	};
	Ext.applyIf(Ext.ux.grid.GridSummary.Calculations, {
		fixed: fixedRenderer,
		average: fixedRenderer
	});
}
if (Ext.grid.GroupSummary) {
	Ext.apply(Ext.grid.GroupSummary, {
		showCount: function (values) {
			var r = values.rs[0];
			var record = this.getGroupTotalInfo(r);
			var v;
			if (record) {
				v = "(";
				v += record.PageCount__ === record.TotalCount__ ? record.TotalCount__ : (String(record.PageCount__) + " of " + String(record.TotalCount__));
				v += record.TotalCount__ === 1 ? " item" : " items";
				v += ")";
			} else {
				v = "(" + String(values.rs.length) + (values.rs.length > 1 ? " items" : " item" + ")");
			}
			return v;
		},

		getGroupTotalInfo: function (record) {
			var store = record.store;
			var groupTotals = store.reader.jsonData.GroupTotals;
			var groupField = store.groupField;
			var groupType = record.fields.map[groupField].type;
			if (groupType == "date") { //3351 Group by on Date field
				var groupValue = ExtHelper.renderer.Date(record.get(groupField), 'm/d/Y');
			}
			else {
				var groupValue = record.get(groupField);
			}
			var returnValue = null;
			if (groupTotals) {
				for (var i = 0, len = groupTotals.length; i < len; i++) {
					var v = groupTotals[i][groupField];
					if (v === null) {
						v = "";
					}

					if (v != null && groupType == "date") { //3351
						var vChangeFormat = v.substring(6, 4) + '/' + v.substring(8, 6) + '/' + v.substring(4, 0); //Convert into 'm/d/Y' format
						if (vChangeFormat === groupValue) {
							returnValue = groupTotals[i];
							break;
						}
					}
					if (v === groupValue) { // When v & groupValue both NULL
						returnValue = groupTotals[i];
						break;
					}
				}
			}
			return returnValue;
		}
	});
	Ext.applyIf(Ext.grid.GroupSummary.Calculations, {
		fixed: function (v, record, field, data) {
			record = Ext.grid.GroupSummary.getGroupTotalInfo(record);
			return record ? record[field] : "";
		}
	});
}

Ext.ux.FormatNumber = function (v, decimals) {
	var x, x1, x2;
	if (typeof (v) === 'number' && typeof (decimals) === 'number') {
		v = v.toFixed(decimals);
	}
	v += '';
	x = v.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
};

Ext.ns("Ext.ux.form");
Ext.ux.form.Hyperlink = Ext.extend(Ext.BoxComponent, {
	fieldLabel: 'Download',
	value: 'Download',
	emptyText: "Not available",
	filenameField: 'Filename',
	storedFilenameField: 'StoredFilename',
	downloadUrl: EH.BuildUrl('downloadattachment') + '?',
	defaultAutoCreate: { tag: "div" },
	onRender: function (ct, position) {
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		if (!this.el) {
			var cfg = this.getAutoCreate();
			//cfg.html = this.value;
			this.el = ct.createChild(cfg, position);
			this.el.on('click', this.onClick, this);
		}
		this.formPanel = this.findParentByType('form');
		this.setHtml();
	},

	setHtml: function () {
		var info = this.getInfo(this.formPanel.getForm().originalValues);
		var el = this.el;
		if (info.filename) {
			el.addClass("x-form-hyperlink");
			el.update(this.value);
		} else {
			el.removeClass("x-form-hyperlink");
			el.update(this.emptyText);
		}
	},

	init: function (fp) {
		if (typeof fp.getForm == 'function') {
			var basicForm = fp.getForm();
			basicForm.on('actioncomplete', this.formActionComplete, fp);
		}
	},

	formActionComplete: function (form, action) {
		if (typeof action.result == 'object' && typeof action.result.data == 'object') {
			var data = action.result.data;
			form.originalValues = data;
			var fp = this;
			var linkFields = fp.findByType('hyperlinkField');
			Ext.each(linkFields, function (field) { field.setHtml(); });
		}
	},

	getInfo: function (values) {
		if (!values) {
			values = {};
		}
		var filename = values[this.filenameField];
		var storedFilename;
		if (filename) {
			if (this.storedFilenameField) {
				storedFilename = values[this.storedFilenameField];
			}
			if (!storedFilename) {
				storedFilename = filename;
			}
		}
		return { filename: filename, storedFilename: storedFilename };
	},

	onClick: function (e) {
		var values;
		var info = {};
		if (this.ownerCt) {
			if (typeof this.ownerCt.getForm == 'function') {
				values = this.ownerCt.getForm().originalValues;
			} else if (typeof this.ownerCt.ownerCt == 'object' && typeof this.ownerCt.ownerCt.getForm == 'function') {
				values = this.ownerCt.ownerCt.getForm().originalValues;
			}
		}
		if (values) {
			info = this.getInfo(values);
			if (info.filename) {
				window.open(this.downloadUrl + '&Filename=' + info.storedFilename + '&useFileServer=1&saveAs=' + info.filename);
			}
		}
	}
});
Ext.reg('hyperlinkField', Ext.ux.form.Hyperlink);

//help icon for all fields

// create namespace for plugins
Ext.ns('Ext.ux.plugins');

/**
* Ext.ux.plugins.HelpIcon plugin for Ext.form.Field
*
* @author  Jonas Skoogh
* @date    September 4, 2008
*
* @class Ext.ux.plugins.HelpIcon
* @extends Ext.util.Observable
* 
* An plugin for all kind of form fields.
* 
* NOTE: Don't use anchor:'100%', use anchor:-20 (or -40 if msgTarget:'side' is used)
*/

/**
* 
* @class Ext.ux.plugins.HelpIcon
* @extends Ext.util.Observable
*/
Ext.ux.plugins.HelpIcon = Ext.extend(Ext.util.Observable, {
	/**
	* Init of plugin
	* @param {Ext.Component} field
	*/
	init: function (field) {
		Ext.apply(field, {
			onRender: field.onRender.createSequence(function (ct, position) {
				//If field has the fieldLabel object, add the helpIcon
				if (this.fieldLabel && this.helpText) {
					var label = this.el.findParent('.x-form-element', 5, true) || this.el.findParent('.x-form-field-wrap', 5, true);

					//For radio buttons
					if (!label) {
						if (this.boxLabel && this.boxLabel.length > 0) {
							label = this.labelEl;
						}
					}

					this.helpIcon = label.createChild({
						cls: (this.helpIconCls || 'ux-helpicon-icon'),
						style: 'width:16px; height:18px; position:absolute; left:0; top:0; display:block; background:transparent no-repeat scroll 0 2px;'
					});

					this.alignHelpIcon = function () {
						var el = this.wrap ? this.wrap : this.el;
						this.helpIcon.alignTo(el, 'tl-tr', [2, 0]);
					};
					//Redefine alignErrorIcon to move the errorIcon (if it exist) to the right of helpIcon
					if (this.alignErrorIcon) {
						this.alignErrorIcon = function () {
							this.errorIcon.alignTo(this.helpIcon, 'tl-tr', [2, 0]);
						};
					}

					this.on('resize', this.alignHelpIcon, this);

					//Register QuickTip for icon
					Ext.QuickTips.register({
						target: this.helpIcon,
						title: (this.helpTitle || ''),
						text: (this.helpText || 'No help defined yet!'),
						enabled: true
					});
				}
			}) //end of onRender
		}); //end of Ext.apply
	} // end of function init
});           // end of extend

// end of file

Ext.ns("Ext.ux");
Ext.ux.ComboLoader = function (options) {
	Ext.apply(this, options);
};

Ext.ux.ComboLoader.prototype = {
	init: function (o) {

		this.o = o;

		var xType = o.getXType();

		switch (xType) {
			case 'editorgrid':
				var cm = o.getColumnModel();
				var cols = cm.config;
				var autoAssignDisplayValue = false;
				var cascadeMappings = {};
				for (var i = 0; i < cols.length; i++) {
					var col = cols[i];
					var field = col.editor && (col.editor.field || col.editor);
					if (field && field.mode === 'remote') {
						field.triggerAction = 'query'; /* It is just that this plays better */
						field.minChars = 0;
						autoAssignDisplayValue = true;
					}
					if (!col.renderer && col.displayIndex) {
						cm.setRenderer(i, Ext.ux.renderer.Proxy(col.displayIndex));
					}
					if (col.parentDataIndex && col.cascadeOptions && col.cascadeOptions.autoClear) {
						if (!cascadeMappings[col.parentDataIndex]) {
							cascadeMappings[col.parentDataIndex] = [];
						}
						var mappings = cascadeMappings[col.parentDataIndex];
						mappings.push(col.id);
					}
					this.cascadeMappings = cascadeMappings;
				}
				if (autoAssignDisplayValue || cascadeMappings) {
					o.on('beforeedit', this.onBeforeEdit);
					o.on('validateedit', this.onValidateEdit, this);
				}
				break;
			default:
				Ext.MsgBox.alert('Error', 'ComboLoader not supported for ' + xType);
				break;
		}
	},

	onBeforeEdit: function (e) {
		var value = e.value;
		//		switch (typeof (value)) {
		//			case 'string':
		//				if (value.length == 0) {
		//					return;
		//				}
		//				break;
		//			case 'number':
		//				if (value == 0) {
		//					return;
		//				}
		//				break;
		//			default:
		//				return;
		//		}

		var record = e.record;
		var colIndex = e.column;
		var cm = e.grid.getColumnModel();

		var colId = cm.getColumnId(colIndex);
		var col = cm.getColumnById(colId);

		var parentDataIndex = col.parentDataIndex;

		if (col.displayIndex) {
			var editor = cm.getCellEditor(colIndex, e.row);
			var combo = editor.field;
			if (combo.mode == 'remote') {
				var comboStore = combo.store;
				var requery = false;

				if (parentDataIndex) {
					var oldScope = comboStore.baseParams.ScopeId;
					var newScope = record.get(parentDataIndex);
					if (oldScope !== newScope) {
						comboStore.baseParams.ScopeId = newScope;
						if (comboStore.lastOptions) {
							delete comboStore.lastOptions.params[combo.queryParam];
						}
						combo.lastQuery = null;
						requery = true;
					}
				}
				var r = combo.findRecord(combo.valueField, value);
				var displayValue = record.get(col.displayIndex);
				if (!r && comboStore.lastQuery != displayValue) {
					requery = true;
				}
				if (requery) {
					combo.valueNotFoundText = displayValue;
				}
			}
		}
	},

	onValidateEdit: function (e) {
		var record = e.record;
		var colIndex = e.column;
		var cm = e.grid.getColumnModel();

		var colId = cm.getColumnId(colIndex);
		var col = cm.getColumnById(colId);

		if (col.displayIndex) {
			var editor = cm.getCellEditor(colIndex, e.row);
			var combo = editor.field;
			record.set(col.displayIndex, combo.getRawValue());
		}

		var cascadeMappings = this.cascadeMappings;
		if (cascadeMappings) {
			var toReset = cascadeMappings[col.dataIndex];
			if (toReset) {
				var len = toReset.length;
				for (var i = 0; i < len; i++) {
					col = cm.getColumnById(toReset[i]);
					if (col) {
						record.set(col.dataIndex, '');
						if (col.displayIndex) {
							record.set(col.displayIndex, '');
						}
					}
				}
			}
		}
	}
};

Ext.grid.CellSelectionModel.override({
	getSelections: function () {
		var selectedCell = this.getSelectedCell();
		var records = [];
		if (selectedCell) {
			var row = selectedCell[0];
			records.push(this.grid.getStore().getAt(row));
		}
		return records;
	}
});

Ext.ux.plugins.gridDragDrop = function (config) {
	Ext.apply(this, config);
	this.addEvents('drop');
};

Ext.extend(Ext.ux.plugins.gridDragDrop, Ext.util.Observable, {
	createDropTarget: function (grid) {
		var fields = this.fields || ['Id'];

		var plugin = this;

		new Ext.dd.DropTarget(grid.el, {
			dropAllowed: 'x-dd-drop-ok',
			ddGroup: this.ddGroup,
			notifyDrop: function (dd, e, data) {
				var ds1 = data.grid.getStore();
				var ds2 = grid.getStore();
				// Moved to assigned
				var items = [];
				var i, len;
				for (i = 0, len = data.selections.length; i < len; i++) {
					var record = data.selections[i];
					var dataToPush = {};
					if (fields == 'all') {
						dataToPush = Ext.apply({}, record.data);
					} else {
						dataToPush = {};
						for (var col = 0; col < fields.length; col++) {
							var colName = fields[col];
							dataToPush[colName] = record.data[colName];
						}
					}
					items.push(dataToPush);
				}
				ds2.add(data.selections);
				for (i = 0, len = data.selections.length; i < len; i++) {
					ds1.remove(data.selections[i]);
				}
				plugin.fireEvent('drop', { source: ds1, target: ds2, selections: data.selections });
				return true;
			}
		});
	},

	init: function (grid) {
		grid.on('render', this.createDropTarget, this);
	}
});

Ext.form.NumberField.override({
	setValue: function (v) {
		if (v !== null && v !== undefined && typeof v === 'string' && v.length > 0) {
			v = parseFloat(v.replace(this.decimalSeparator, "."));
		}
		if (typeof v === 'number') {
			if (this.allowDecimals && this.decimalPrecision > 0 && v % 1 != 0) {
				v = v.toFixed(this.decimalPrecision);
				if (this.decimalSeparator != ".") {
					v = v.replace(".", this.decimalSeparator);
				}
			}
		} else {
			v = '';
		}
		Ext.form.NumberField.superclass.setValue.call(this, v);
	},
	parseValue: function (value) {
		return isNaN(value) ? '0' : parseFloat(String(value).replace(this.decimalSeparator, "."));
	},
	beforeBlur: function () {
		var v = this.parseValue(this.getRawValue());
		this.setValue(this.fixPrecision(v));
	}
});

Ext.ux.util.fieldSpecificProperties = ['type', 'mapping', 'calc', 'formula', 'notDirty', 'dependencies', 'convert'];

Ext.ux.util.SplitGridInfo = function (hybridConfig) {
	var fields = [];
	var cm = [];
	var isCalcRecord = false;

	var fieldSpecific = this.fieldSpecificProperties;

	Ext.each(hybridConfig, function (col) {
		// include only fields that have type. If only renderer is specified, don't use
		if (col.type) {
			if (col.calc || col.formula) {
				isCalcRecord = true;
			}
			var fieldInfo = { name: col.dataIndex };
			Ext.each(fieldSpecific, function (propertyName) {
				fieldInfo[propertyName] = col[propertyName];
			});
			fields.push(fieldInfo);
		}

		// include only if header is defined
		if (col.header) {
			var gridCol = Ext.apply({}, col);
			Ext.each(fieldSpecific, function (property) {
				if (property !== 'convert') {
					delete gridCol[property];
				}
			});

			cm.push(gridCol);
		}
	});

	if (isCalcRecord) {
		fields = new Ext.ux.data.CalcRecord.create(fields);
	}

	return { cm: cm, fields: fields };
};

Ext.ux.plugins.onLostFocus = function (options) {
	Ext.apply(this, options);
};

Ext.extend(Ext.ux.plugins.onLostFocus, Ext.util.Observable, {
	init: function (field) {
		this.field = field;
		field.on('focus', this.onGotFocus, this);
		field.on('change', this.onChange, this);
	},

	onGotFocus: function (field) {
		this.hasFocus = true;
	},

	onChange: function (field) {
		if (this.hasFocus) {
			this.hasFocus = false;
			var scope = this.scope || field;
			this.fn.apply(scope, arguments);
		}
	}
});

Ext.ux.EnterHandler = function (cfg) {
	Ext.apply(this, cfg);
};

Ext.ux.EnterHandler.prototype = {
	init: function (component) {
		component.on('render', this.setKeymap, this);
	},

	setKeymap: function (cmp) {
		new Ext.KeyMap(
			cmp.el,
			[
				{
					key: [10, Ext.EventObject.ENTER],
					scope: this.scope,
					fn: this.fn
				}
			],
			"keydown"
		);
	}
};

Ext.ux.Log = function () {
	this.init();
};

Ext.ux.Log.prototype = {
	init: function () {
	},
	log: function (message) {
		if (console) {
			console.log(message);
		}
	}
};

Ext.ux.Log = new Ext.ux.Log();

Ext.ux.applyOnlyIf = function (obj1, obj2, propertyList) {
	Ext.each(propertyList, function (propertyName) {
		if (typeof obj1[propertyName] == 'undefined') {
			obj1[propertyName] = obj2[propertyName];
		}
	});
	return obj1;
};

Ext.ux.isNativeObject = function (obj) {
	return obj.constructor.toString().trim().substr(0, 17) == "function Object()";
};

Ext.ux.plugins.statefulPanel = function (cfg) {
	Ext.apply(this, cfg);
};

Ext.ux.plugins.statefulPanel.prototype = {
	properties: ['height', 'width'],

	init: function (panel) {
		if (!panel.stateEvents) {
			panel.stateEvents = [];
		}
		panel.stateful = true;
		panel.stateEvents.push('resize');
		panel.getState = this.getState;
		panel.applyState = this.applyState;
		panel.statePlugin = this;
	},

	getState: function () {
		var box = this.getBox();
		return Ext.copy({}, box, this.statePlugin.properties);
	},

	applyState: function (state) {
		Ext.apply(this, state);
	}
};

// Adds TableFormLayout
if (Ext.version < "3") {
	Ext.ux.TableFormLayout = Ext.extend(Ext.layout.TableLayout, {
		monitorResize: true,
		setContainer: function () {
			Ext.layout.FormLayout.prototype.setContainer.apply(this, arguments);
			if (!this.fieldTpl) {
				Ext.ux.TableFormLayout.prototype.fieldTpl = Ext.layout.FormLayout.prototype.fieldTpl;
			}
			this.currentRow = 0;
			this.currentColumn = 0;
			this.cells = [];
		},
		labelSeparator: ":",
		renderItem: function (c, position, target) {
			if (c && !c.rendered) {
				var cell = Ext.get(this.getNextCell(c));
				cell.addClass("x-table-layout-column-" + this.currentColumn);
				if (c && !c.rendered && c.isFormField && c.inputType != 'hidden') {
					var elementStyle = this.elementStyle;
					var labelStyle = this.labelStyle;

					if (this.columnLabelWidths) {
						var labelWidth = this.columnLabelWidths[this.currentColumn];
						if (labelWidth) {
							var pad = (typeof this.labelPad == 'number' ? this.labelPad : 5);
							labelStyle = "width:" + labelWidth + "px;";
							elementStyle = "padding-left:" + (labelWidth + pad) + 'px';
						}
					}

					var args = [
                   c.id, c.fieldLabel,
                   this.getLabelStyle(labelStyle, c.labelStyle),
                   elementStyle || '',
                   typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
                   (c.itemCls || this.container.itemCls || '') + (c.hideLabel ? ' x-hide-label' : ''),
                   c.clearCls || 'x-form-clear-left'
					];
					if (typeof position == 'number') {
						position = cell.dom.childNodes[position] || null;
					}
					if (position) {
						this.fieldTpl.insertBefore(position, args);
					} else {
						this.fieldTpl.append(cell, args);
					}
					c.render('x-form-el-' + c.id);
				} else {
					Ext.layout.FormLayout.superclass.renderItem.call(this, c, 0, cell);
				}
			}
		},
		getAnchorViewSize: function (ct, target) {
			return target.dom == document.body ? target.getViewSize() : target.getStyleSize();
		},
		onLayout: function (ct, target) {
			Ext.ux.TableFormLayout.superclass.onLayout.call(this, ct, target);
			if (!target.hasClass("x-table-form-layout-ct")) {
				target.addClass("x-table-form-layout-ct");
			}
			var viewSize = this.getAnchorViewSize(ct, target);
			var aw, ah;
			if (ct.anchorSize) {
				if (typeof ct.anchorSize == "number") {
					aw = ct.anchorSize;
				} else {
					aw = ct.anchorSize.width;
					ah = ct.anchorSize.height;
				}
			} else {
				aw = ct.initialConfig.width;
				ah = ct.initialConfig.height;
			}
			var cs = ct.items.items, len = cs.length, i, j, c, a, cw, ch;
			var x, w, h, col, colWidth, offset;
			for (i = 0; i < len; i++) {
				c = cs[i];
				// get table cell
				x = c.getEl().parent(".x-table-layout-cell");
				if (this.columnWidths) {
					// get column
					col = Number(x.dom.className.replace(/.*x\-table\-layout\-column\-([\d]+).*/, "$1"));
					// get cell width (based on column widths)
					colWidth = 0; offset = 0;
					for (j = col; j < (col + (c.colspan || 1)) ; j++) {
						colWidth += this.columnWidths[j];
						offset += 10;
					}
					w = (viewSize.width * colWidth) - offset;
				} else {
					// get cell width
					w = (viewSize.width / this.columns) * (c.colspan || 1);
				}
				// set table cell width
				x.setWidth(w);
				// get cell width (-10 for spacing between cells) & height to be base width of anchored component
				w = w - 10;
				h = x.getHeight();
				// perform anchoring
				if (c.anchor) {
					a = c.anchorSpec;
					if (!a) {
						var vs = c.anchor.split(" ");
						c.anchorSpec = a = {
							right: this.parseAnchor(vs[0], c.initialConfig.width, aw),
							bottom: this.parseAnchor(vs[1], c.initialConfig.height, ah)
						};
					}
					cw = a.right ? this.adjustWidthAnchor(a.right(w), c) : undefined;
					ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h), c) : undefined;
					if (cw || ch) {
						c.setSize(cw || undefined, ch || undefined);
					}
				}
			}
		},
		parseAnchor: Ext.layout.AnchorLayout.prototype.parseAnchor,
		adjustWidthAnchor: function (value, comp) {
			return value - (comp.isFormField ? (comp.hideLabel ? 0 : this.labelAdjust) : 0);
		},
		adjustHeightAnchor: Ext.layout.AnchorLayout.prototype.adjustHeightAnchor,
		getLabelStyle: Ext.layout.FormLayout.prototype.getLabelStyle
	});

	Ext.Container.LAYOUTS.tableform = Ext.ux.TableFormLayout;
} else {
	Ext.namespace("Ext.ux.layout");

	Ext.ux.layout.TableFormLayout = Ext.extend(Ext.layout.TableLayout, {
		monitorResize: true,
		setContainer: function () {
			Ext.layout.FormLayout.prototype.setContainer.apply(this, arguments);
			this.currentRow = 0;
			this.currentColumn = 0;
			this.cells = [];
		},

		renderItem: function (c, position, target) {
			if (c && !c.rendered) {
				var cell = Ext.get(this.getNextCell(c));
				cell.addClass("x-table-layout-column-" + this.currentColumn);
				Ext.layout.FormLayout.prototype.renderItem.call(this, c, 0, cell);
			}
		},
		getAnchorViewSize: Ext.layout.AnchorLayout.prototype.getAnchorViewSize,
		getTemplateArgs: Ext.layout.FormLayout.prototype.getTemplateArgs,
		onLayout: function (ct, target) {
			Ext.ux.layout.TableFormLayout.superclass.onLayout.call(this, ct, target);
			if (!target.hasClass("x-table-form-layout-ct")) {
				target.addClass("x-table-form-layout-ct");
			}
			var viewSize = this.getAnchorViewSize(ct, target);
			var aw, ah;
			if (ct.anchorSize) {
				if (typeof ct.anchorSize == "number") {
					aw = ct.anchorSize;
				} else {
					aw = ct.anchorSize.width;
					ah = ct.anchorSize.height;
				}
			} else {
				aw = ct.initialConfig.width;
				ah = ct.initialConfig.height;
			}
			var cs = ct.items.items, len = cs.length, i, j, c, a, cw, ch;
			var x, w, h, col, colWidth, offset;
			for (i = 0; i < len; i++) {
				c = cs[i];
				// get table cell
				x = c.getEl().parent(".x-table-layout-cell");
				if (this.columnWidths) {
					// get column
					col = Number(x.dom.className.replace(/.*x-table-layout-column-([d]+).*/, "$1"));
					// get cell width (based on column widths)
					colWidth = 0; offset = 0;
					for (j = col; j < (col + (c.colspan || 1)) ; j++) {
						colWidth += this.columnWidths[j];
						offset += 10;
					}
					w = (viewSize.width * colWidth) - offset;
				} else {
					// get cell width
					w = (viewSize.width / this.columns) * (c.colspan || 1);
				}
				// set table cell width
				x.setWidth(w);
				// get cell width (-10 for spacing between cells) & height to be base width of anchored component
				w = w - 10;
				h = x.getHeight();
				// perform anchoring
				if (c.anchor) {
					a = c.anchorSpec;
					if (!a) {
						var vs = c.anchor.split(" ");
						c.anchorSpec = a = {
							right: this.parseAnchor(vs[0], c.initialConfig.width, aw),
							bottom: this.parseAnchor(vs[1], c.initialConfig.height, ah)
						};
					}
					cw = a.right ? this.adjustWidthAnchor(a.right(w), c) : undefined;
					ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h), c) : undefined;
					if (cw || ch) {
						c.setSize(cw || undefined, ch || undefined);
					}
				}
			}
		},
		parseAnchor: function (a, start, cstart) {
			if (a && a != "none") {
				var last;
				if (/^(r|right|b|bottom)$/i.test(a)) {
					var diff = cstart - start;
					return function (v) {
						if (v !== last) {
							last = v;
							return v - diff;
						}
					};
				} else if (a.indexOf("%") != -1) {
					var ratio = parseFloat(a.replace("%", "")) * 0.01;
					return function (v) {
						if (v !== last) {
							last = v;
							return Math.floor(v * ratio);
						}
					};
				} else {
					a = parseInt(a, 10);
					if (!isNaN(a)) {
						return function (v) {
							if (v !== last) {
								last = v;
								return v + a;
							}
						};
					}
				}
			}
			return false;
		},
		adjustWidthAnchor: function (value, comp) {
			return value - (comp.isFormField ? (comp.hideLabel ? 0 : this.labelAdjust) : 0);
		},
		adjustHeightAnchor: function (value, comp) {
			return value;
		},
		getLabelStyle: Ext.layout.FormLayout.prototype.getLabelStyle
	});

	Ext.Container.LAYOUTS.tableform = Ext.ux.layout.TableFormLayout;
}

Ext.ux.MonthPickerPlugin = function (config) {
	Ext.apply(this, config);
};

Ext.ux.MonthPickerPlugin.prototype = {
	init: function (picker) {
		this.picker = picker;
		picker.onTriggerClick = picker.onTriggerClick.createSequence(this.onClick, this);
		picker.parseDate = picker.parseDate.createInterceptor(this.setDefaultMonthDay, this).createSequence(this.restoreDefaultMonthDay, this);
	},

	setDefaultMonthDay: function () {
		this.oldDateDefaults = Date.defaults.d;
		Date.defaults.d = 1;
		return true;
	},

	restoreDefaultMonthDay: function (ret) {
		Date.defaults.d = this.oldDateDefaults;
		return ret;
	},

	first: true,

	onClick: function (e, el, opt) {
		var p = this.picker.menu.picker;
		p.activeDate = p.activeDate.getFirstDateOfMonth();
		if (p.value) {
			p.value = p.value.getFirstDateOfMonth();
		}
		p.showMonthPicker();
		if (!p.disabled) {
			if (this.first) {
				// We should create the sequence functions only once.
				this.first = false;
				if (Ext.version < "3") {
					p.monthPicker.slideIn = Ext.emptyFn;
					p.monthPicker.slideOut = Ext.emptyFn;
				} else {
					p.monthPicker.stopFx();
				}

				if (typeof p.mun == 'function') {
					p.mun(p.monthPicker, 'click', p.onMonthClick, p);
					p.mun(p.monthPicker, 'dblclick', p.onMonthDblClick, p);
				} else {
					p.monthPicker.un('click', p.onMonthClick);
					p.monthPicker.un('dblclick', p.onMonthDblClick);
				}
				p.onMonthClick = p.onMonthClick.createSequence(this.pickerClick, this);
				p.onMonthDblClick = p.onMonthDblClick.createSequence(this.pickerDblclick, this);
				p.mon(p.monthPicker, 'click', p.onMonthClick, p);
				p.mon(p.monthPicker, 'dblclick', p.onMonthDblClick, p);
			}
			p.monthPicker.show();
		}
	},

	pickerClick: function (e, t) {
		var picker = this.picker;
		var el = new Ext.Element(t);
		if (el.is('button.x-date-mp-cancel')) {
			picker.menu.hide();
		} else if (el.is('button.x-date-mp-ok')) {
			var p = picker.menu.picker;
			p.setValue(p.activeDate);
			p.fireEvent('select', p, p.value);
		}
	},

	pickerDblclick: function (e, t) {
		var el = new Ext.Element(t);
		var parent = el.parent();
		if (parent && (parent.is('td.x-date-mp-month') || parent.is('td.x-date-mp-year'))) {
			var p = this.picker.menu.picker;
			p.setValue(p.activeDate);
			p.fireEvent('select', p, p.value);
		}
	}
};

if (Ext.version >= "3") {
	Ext.preg('monthPickerPlugin', Ext.ux.MonthPickerPlugin);
}

if (Ext.version < "3") {
	Ext.grid.Column = function (cfg) {
		Ext.apply(this, cfg);
	};
	Ext.grid.Column.prototype = {
		isColumn: true
	};
}

Ext.ux.grid.GridColumn = function (config) {
	if (typeof (config) === 'object') {
		var editor = config.editor ? (config.editor.field || config.editor) : null;
		var xtype;
		if (editor && typeof editor.getXType === 'function') {
			xtype = editor.getXType();
		}
		var rendererType;
		if (typeof (config.renderer) === 'string') {
			rendererType = config.renderer;
		} else if (typeof (xtype) === 'string') {
			rendererType = this.xMappings[xtype];
		}

		if (typeof rendererType === 'string') {
			var rendererInfo = this.renderers[rendererType];
			if (rendererInfo) {
				if (typeof config.renderer === 'string') {
					delete config.renderer;
				}

				switch (xtype) {
					case "combo":
						if (typeof config.renderer === 'undefined') {
							rendererInfo.renderer = config.displayIndex ? Ext.ux.renderer.Proxy(config.displayIndex) : ExtHelper.renderer.Combo(editor);
						}
						break;
					case "numberfield":
						var renderConfig = config.renderConfig;
						delete config.renderConfig;
						if (typeof config.renderer === 'undefined') {
							rendererInfo.renderer = ExtHelper.renderer.Float(editor.allowDecimals && !isNaN(editor.allowDecimals) ? editor.decimalPrecision : 0, renderConfig);
						}
						break;
				}
				Ext.applyIf(config, rendererInfo);
			}
			else {
				switch (rendererType) {
					case "proxy":
						config.renderer = config.displayIndex ? Ext.ux.renderer.Proxy(config.displayIndex) : ExtHelper.renderer.Combo(config.store);
						break;
				}
			}
		}
	}

	Ext.ux.grid.GridColumn.superclass.constructor.call(this, config);
	return this;
};

Ext.extend(Ext.ux.grid.GridColumn, Ext.grid.Column, {
	concatenated: null,
	required: null,
	renderers: {
		Checkbox: { renderer: Ext.ux.renderer.Check, width: 50 },
		Time: { renderer: EH.renderer.Time, width: 70 },
		Date: { renderer: EH.renderer.Date, width: 70 },
		DateTime: { renderer: EH.renderer.DateTime, width: 155 },
		Boolean: { renderer: EH.renderer.Boolean },
		Number: { width: 70, align: 'right' },
		Combo: {}
	},

	xMappings: {
		datefield: "Date",
		timefield: "Time",
		xdatetime: "DateTime",
		checkbox: "Checkbox",
		numberfield: "Number",
		combo: "Combo"
	}
});

Ext.ux.grid.ColumnModel = function (config) {
	if (config && Ext.isArray(config)) {
		for (var i = 0, len = config.length; i < len; i++) {
			var col = config[i];
			if (!col.isColumn && !col.xtype) {
				config[i] = new Ext.ux.grid.GridColumn(col);
			}
		}
	}
	return new Ext.grid.ColumnModel(config);
};

Ext.extend(Ext.ux.grid.ColumnModel, Ext.grid.ColumnModel, {
	defaultSortable: true
});

Ext.ux.util.Export = {
	getGridColInfo: function (o) {
		var grid = o.grid;
		var cols = [];
		var cm = grid.getColumnModel();
		var colCount = cm.getColumnCount();
		var store = grid.getStore();
		var fields = store.reader.recordType.prototype.fields;
		var i, col, rowCols;

		var colPrefixes = [];

		if (cm.rows) {
			for (i = 0; i < colCount; i++) {
				colPrefixes[i] = [];
			}
			for (var row = 0; row < cm.rows.length; row++) {
				var r = cm.rows[row];
				i = 0;
				for (col = 0, rowCols = r.length; col < rowCols; col++) {
					var colInfo = r[col];
					for (var span = 0, spans = colInfo.colspan || 1; span < spans; span++) {
						if (colInfo.header) {
							colPrefixes[i].push(colInfo.header);
						}
						i++;
					}
				}
			}
			for (i = 0; i < colCount; i++) {
				colPrefixes[i] = colPrefixes[i].join(' ');
			}
		}

		var groupingColumn;
		var view = grid.getView();
		if (view.hideGroupedColumn && typeof store.groupField === 'string') {
			groupingColumn = store.groupField;
		}

		for (i = 0; i < colCount; i++) {
			col = cm.getColumnById(cm.getColumnId(i));
			var dataIndex = col.displayIndex || col.dataIndex;
			if (dataIndex) {
				var field = fields.get(dataIndex);
				if (field) {
					if (field.mapping) {
						dataIndex = field.fieldName || (isNaN(field.mapping) ? field.mapping : field.name);
					} else {
						dataIndex = field.name;
					}
				}
			}
			if (dataIndex == groupingColumn || !col.hidden) {
				var colHeader = col.header;
				if (colPrefixes[i]) {
					colHeader = colPrefixes[i] + ' ' + colHeader;
				}
				colHeader = colHeader.replace(/(<([^>]+)>)/ig, " ");
				colHeader = colHeader.replace(',', ' ');
				if (dataIndex) {
					var align = col.align;
					var stdRenderer = undefined;
					var rendererInfo = undefined;
					if (!align) {
						if (col.cssClass == 'textRight') {
							align = 'right';
						}
					}
					switch (col.renderer) {
						case ExtHelper.renderer.Amount:
						case ExtHelper.renderer.AmountNonDecimal:
						case ExtHelper.renderer.Float:
							align = 'right';
							break;
						case ExtHelper.renderer.Date:
							stdRenderer = 'Date';
							break;
						case ExtHelper.renderer.DateTime:
							stdRenderer = 'DateTime';
							break;
						case ExtHelper.renderer.Boolean:
							stdRenderer = 'Boolean';
							break;
						default:
							if (col.renderer) {
								stdRenderer = col.renderer.rendererName;
								rendererInfo = (col.renderer.info ? Ext.encode(col.renderer.info) : col.rendererInfo ? col.rendererInfo : "");
							}
					}
					cols.push({
						ColumnName: dataIndex,
						Header: colHeader,
						Width: cm.getColumnWidth(i),
						Align: align,
						Renderer: stdRenderer,
						RendererInfo: rendererInfo,
						Convert: typeof col.convert === 'function'
					});
				}
			}
		}
		return cols;
	},

	Execute: function (o) {
		var grids = o.grids;
		// Create base parameters
		var grid = grids[0];
		if (typeof grid == 'string') {
			grid = Ext.getCmp(grid);
		}

		var store = grid.getStore();
		var params = {};
		Ext.apply(params, store.baseParams);
		if (typeof store.lastOptions !== 'undefined' && store.lastOptions !== null) {
			Ext.apply(params, store.lastOptions.params);
		}
		params.action = o.options && o.options.group ? 'exportGroups' : 'export';
		if (params.action == 'exportGroups') {
			var parentGrid = o.options.parentGrid;
			var parentHeaderFilter = 'undefined';
			if (parentGrid) {
				parentHeaderFilter = parentGrid.filters.getFilterData();
			}
			var childHeaderFilter = grid.filters.getFilterData();
			var filterParams = {};
			if (parentHeaderFilter.length > 0) {
				var mainArray = parentHeaderFilter.concat(childHeaderFilter);
				filterParams = grid.filters.buildQuery(mainArray);
			}
			else {
				filterParams = grid.filters.buildQuery(childHeaderFilter);
			}
			Ext.apply(params, filterParams);
		}
		var url = store.url;
		if (!url && store.proxy && store.proxy.conn && store.proxy.conn.url) {
			url = store.proxy.conn.url;
		}

		if (!url && o.options && o.options.url) {
			url = o.options.url;
		}
		// var url = store.url || store.proxy.conn.url;

		if (typeof url === 'undefined' || url === null) {
			url = String(document.location.href);
		}

		/* Fix for Chrome */
		if (url.indexOf('?') > -1) {
			url = url + '&';
		} else {
			url = url + '?';
		}
		var v = (new Date()).toString().replace(/(<([^>]+)>)/ig, "");
		url = url + 'v=' + v;
		/* Fix for Chrome Ends */

		var options = o.options;
		if (!options) {
			options = {};
		}


		var cols = [];
		var visibleColumns = options.visibleColumns;
		delete options.visibleColumns;
		delete options.parentGrid;
		for (var i = 0; i < grids.length; i++) {
			grid = grids[i];
			if (typeof grid == 'string') {
				grid = Ext.getCmp(grid);
			}
			if (i > 0) {
				params.controlId += "|" + grid.getStore().baseParams.controlId;
			}
			if (visibleColumns) {
				cols.push(this.getGridColInfo({ grid: grid }));
			}
		}
		if (visibleColumns) {
			params.cols = Ext.encode(grids.length == 1 ? cols[0] : cols);
		}

		Ext.apply(params, options);
		var d = new Date()
		var gmtHours = -d.getTimezoneOffset();
		params.TimeOffSet = gmtHours;
		ExtHelper.HiddenForm.submit({
			action: url,
			params: params
		});
	}
};

Ext.ux.Fusion = Ext.extend(Ext.FlashComponent, {

	initComponent: function () {
		Ext.ux.Fusion.superclass.initComponent.call(this);
		var flashVars = this.flashVars || {};

		Ext.applyIf(flashVars, {
			debugMode: 0,
			DOMId: this.id,
			registerWithJS: 1,
			lang: 'EN'
		});

		this.flashVars = flashVars;
		this.on('resize', this.resizeFlash, this);
	},

	onRender: function () {

		Ext.FlashComponent.superclass.onRender.apply(this, arguments);

		this.renderSwf();
	},
	xmlRegExp: new RegExp().compile('=\s*\".*?\"', 'g'),
	encodeDataXML: function (strDataXML) {
		var arrDQAtt = strDataXML.match(this.xmlRegExp);
		if (arrDQAtt) {
			for (var i = 0; i < arrDQAtt.length; i++) {
				var repStr = arrDQAtt[i].replace(/^=\s*\"|\"$/g, "");
				repStr = repStr.replace(/\'/g, "%26apos;");
				var strTo = strDataXML.indexOf(arrDQAtt[i]);
				var repStrr = "='" + repStr + "'";
				var strStart = strDataXML.substring(0, strTo);
				var strEnd = strDataXML.substring(strTo + arrDQAtt[i].length);
				strDataXML = strStart + repStrr + strEnd;
			}
		}

		strDataXML = strDataXML.replace(/\"/g, "%26quot;");
		strDataXML = strDataXML.replace(/%(?![\da-f]{2}|[\da-f]{4})/ig, "%25");
		strDataXML = strDataXML.replace(/\&/g, "%26");

		return strDataXML;

	},
	setChartData: function (xml) {
		var o;
		this.dataURL = null;
		this.dataXML = xml;
		if (this.swf) {
			var size = this.getSize();
			this.renderSwf(size.width, size.height);
		}
		o = null;
		return this;
	},
	setChartDataURL: function (url, immediate) {
		this.dataURL = url;
		this.dataXML = null;
		if (this.swf) {
			this.renderSwf();
		}
	},
	renderSwf: function (width, height) {
		if (arguments.length === 0) {
			var size = this.getSize();
			width = size.width;
			height = size.height;
		}
		Ext.apply(this.flashVars, { chartWidth: width, chartHeight: height });

		var theChart;
		var params = Ext.apply({
			allowScriptAccess: 'always',
			bgcolor: this.backgroundColor,
			wmode: this.wmode
		}, this.flashParams), vars = Ext.apply({
			allowedDomain: document.location.hostname,
			elementID: this.getId(),
			eventHandler: 'Ext.FlashEventProxy.onEvent',
			chartWidth: width,
			chartHeight: height
		}, this.flashVars);

		if (this.dataURL) {
			vars.dataURL = escape(this.dataURL);
		} else if (this.dataXML) {
			vars.dataXML = this.encodeDataXML(this.dataXML);
		}
		if (!DA.App || !DA.App.chartAsHTML5) {
			new swfobject.embedSWF(this.url, this.id, this.swfWidth, this.swfHeight, this.flashVersion,
            this.expressInstall ? Ext.FlashComponent.EXPRESS_INSTALL_URL : undefined, vars, params);
		}
		else {
			theChart = new FusionCharts({
				type: this.url,
				width: this.swfWidth,
				height: this.swfHeight,
				debugMode: false
			});
			theChart.setDataURL(this.dataURL);
		}

		if (this.rendered && theChart) {
			theChart.render(this.id);
		}
		this.swf = Ext.getDom(this.id);
		this.el = Ext.get(this.swf);
	},
	resizeFlash: function (cmp, width, height) {
		if (height > 30) {
			if (this.swf) {
				var parent = this.swf.parentNode;
				swfobject.removeSWF(this.id);
				var el = new Ext.Element({ tag: 'div', id: this.id });
				el.setSize(width, height);
				Ext.get(parent).appendChild(el);
			}
			this.renderSwf(width, height);
		}
	}
});

Ext.ux.FusionPanel = Ext.extend(Ext.Panel, {
	animCollapse: false,
	initComponent: function () {
		Ext.ux.FusionPanel.superclass.initComponent.call(this);
		if (typeof this.dataURL !== 'undefined' || typeof this.dataXML !== 'undefined') {
			this.addFlashComponent();
		}
	},
	addFlashComponent: function () {
		if (!this.flash) {
			this.flash = new Ext.ux.Fusion({ url: this.chartURL, dataURL: this.dataURL, dataXML: this.dataXML, flashVars: this.flashVars, border: false });
			this.add(this.flash);
			if (this.rendered) {
				this.doLayout();
			}
		}
	},
	layout: 'fit',
	setDataURL: function (url) {
		this.addFlashComponent();
		this.flash.setChartDataURL(url);
	},
	setChartData: function (data) {
		this.addFlashComponent();
		this.flash.setChartData(data);
	}
});

Ext.ns('Ext.ux.form');

Ext.ux.form.NZTextField = Ext.extend(Ext.form.TextField, {
	valueRenderer: null,
	initComponent: function (config) {
		Ext.ux.form.NZTextField.superclass.initComponent.apply(this, arguments);
		this.on('blur', this.setHidden, this);
		this.on('blur', function (field) {
			var value = field.getValue() + '';
			field.setValue(value.replace(',', ''));
		}, this);
	},
	onRender: function () {
		Ext.ux.form.NZTextField.superclass.onRender.apply(this, arguments);
		this.hiddenEl = this.el.insertSibling({
			tag: 'input', type: 'hidden', name: this.hiddenName
		});
	},
	setHidden: function (v) {
		var regEx = new RegExp(/\s?[a-z]?/gi);
		var myValue = Ext.ux.form.NZTextField.superclass.getValue.call(this);

		if (myValue.match(/\s?h/gi)) {
			myValue = myValue.replace(regEx, '');
			myValue = myValue * 60;
		}
		else if (myValue.match(/\s?k/gi)) {
			myValue = myValue.replace(regEx, '');
			myValue = myValue * 1000;
		}
		else if (myValue.match(regEx)) {
			myValue = myValue.replace(regEx, '');
		}

		this.hiddenEl.dom.value = myValue;
	},
	setValue: function (v) {
		switch (this.valueRenderer) {
			case 'minutesToHours': v = this.m2h(v); break;
			case 'metersToKilometers': v = this.m2km(v); break;
			case 'metersToMeters': v = this.m2m(v); break;
			case 'commaSeperated': v = this.cSep(v); break;
			default: break;
		}
		if (v.indexOf('NaN') > -1) {
			v = v.replace('NaN', '0');
		}
		Ext.ux.form.NZTextField.superclass.setValue.apply(this, [v]);
		this.setHidden(v);
	},
	getValue: function () {
		return parseFloat(this.hiddenEl.dom.nextSibling.value.replace(/,/gi, ''));
	},
	getName: function () {
		return this.hiddenName;
	},
	m2h: function (v) {
		v = (v / 60) + ' h';
		return v;
	},
	m2km: function (v) {
		v = (v / 1000) + ' km';
		return v;
	},
	m2m: function (v) {
		return v + ' m';
	},
	cSep: function (v) {
		return Ext.util.Format.usMoney(v).replace('$', '');
	}
});

Ext.reg('NZTextField', Ext.ux.form.NZTextField);

Ext.ux.Multiselect = function (config) {
	Ext.ux.Multiselect.superclass.constructor.call(this, config);

	this.addEvents({
		'dblclick': true,
		'click': true,
		'change': true
	});

	this.on('valid', this.onValid);
	this.on('invalid', this.onInvalid);

};

Ext.extend(Ext.ux.Multiselect, Ext.form.Field, {

	store: null,
	width: 100,
	height: 100,
	displayField: 0,
	valueField: 1,
	allowBlank: true,
	minLength: 0,
	maxLength: Number.MAX_VALUE,
	blankText: Ext.form.TextField.prototype.blankText,
	minLengthText: 'Minimum {0} item(s) required',
	maxLengthText: 'Maximum {0} item(s) allowed',
	isFormField: true,
	focusClass: undefined,
	delimiter: ',',
	view: null,
	defaultAutoCreate: { tag: "input", type: "hidden", value: "" },

	onRender: function (ct, position) {
		var div, cls, lw, lh, tpl;

		this.el = ct.createChild();
		this.el.dom.style.zoom = 1;
		this.el.addClass(this.fieldCls);
		this.el.setWidth(this.width);
		this.el.setHeight(this.height);

		div = this.el.createChild({ tag: div });

		this.store.on('clear', this.reset, this);

		cls = 'x-combo-list';

		this.list = new Ext.Layer({
			shadow: false, cls: [cls, 'ux-mselect ux-mselect-valid'].join(' '), constrain: false
		}, div);

		lw = this.width - this.el.getFrameWidth('lr');
		lh = this.height - this.el.getFrameWidth('tb');

		this.list.setWidth(lw);
		this.list.setHeight(lh);
		this.list.swallowEvent('mousewheel');

		this.innerList = this.list.createChild({ tag: 'div', cls: cls + '-inner' });
		this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
		this.innerList.setHeight(lh - this.list.getFrameWidth('tb'));


		if (Ext.isIE || Ext.isIE7) {
			tpl = '<div unselectable=on class="' + cls + '-item">{' + this.displayField + '}</div>';
		} else {
			tpl = '<div class="' + cls + '-item">{' + this.displayField + '}</div>';
		}

		this.view = new Ext.DataView({
			renderTo: this.innerList,
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
				tpl,
				'</tpl>'
			),
			multiSelect: true,
			simpleSelect: true,
			store: this.store,
			itemSelector: "div." + cls + "-item",
			selectedClass: 'x-combo-selected'
		});

		this.view.on('click', this.onViewClick, this);
		this.view.on('beforeClick', this.onViewBeforeClick, this);
		this.view.on('dblclick', this.onViewDblClick, this);

		this.list.setStyle('position', '');
		this.list.show();

		this.hiddenName = this.name;
		this.defaultAutoCreate.name = this.name;
		if (this.isFormField) {
			this.hiddenField = this.el.createChild(this.defaultAutoCreate);
		} else {
			this.hiddenField = Ext.get(document.body).createChild(this.defaultAutoCreate);
		}
	},

	onViewClick: function (vw, index, node, e) {
		var arrayIndex = this.preClickSelections.indexOf(index);
		if (arrayIndex != -1) {
			this.preClickSelections.splice(arrayIndex, 1);
			this.view.clearSelections(true);
			this.view.select(this.preClickSelections);
		}
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
		this.fireEvent('click', this, e);
		this.validate();

	},

	onViewBeforeClick: function (vw, index, node, e) {
		this.preClickSelections = this.view.getSelectedIndexes();
		if (this.disabled) { return false; }
	},

	onViewDblClick: function (vw, index, node, e) {
		return this.fireEvent('dblclick', vw, index, node, e);
	},

	getValue: function (valueField) {
		var returnArray = [];
		var selectionsArray = this.view.getSelectedIndexes();
		if (selectionsArray.length === 0) {
			return '';
		}
		for (var i = 0; i < selectionsArray.length; i++) {
			returnArray.push(this.store.getAt(selectionsArray[i]).get(valueField || this.valueField));
		}
		return returnArray.join(this.delimiter);
	},

	setValue: function (values) {
		var index;
		var selections = [];
		this.view.clearSelections();
		this.hiddenField.dom.value = '';

		if (!values || (values == '')) { return; }

		if (!(values instanceof Array)) { values = values.split(this.delimiter); }
		for (var i = 0; i < values.length; i++) {
			index = this.view.store.indexOf(this.view.store.query(this.valueField,
				new RegExp('^' + values[i] + '$', "i")).itemAt(0));
			selections.push(index);
		}
		this.view.select(selections);
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	},

	reset: function () {
		this.setValue('');
	},

	getRawValue: function (valueField) {
		var tmp = this.getValue(valueField);
		if (tmp.length) {
			tmp = tmp.split(this.delimiter);
		}
		else {
			tmp = [];
		}
		return tmp;
	},

	setRawValue: function (values) {
		this.setValue(values);
	},

	validateValue: function (value) {
		if (value.length < 1) { // if it has no value
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
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
		return true;
	},

	onValid: function () {
		this.list.addClass('ux-mselect-valid');
		this.list.removeClass('ux-mselect-invalid');
	},

	onInvalid: function () {
		this.list.addClass('ux-mselect-invalid');
		this.list.removeClass('ux-mselect-valid');
	}
});

Ext.ux.ImageEditor = function (cfg) {
	Ext.apply(this, cfg);
};

Ext.ux.ImageEditor.prototype = {
	init: function (panel) {
		this.transformations = {
			rotate: 0,
			zoom: 100
		};

		this.panel = panel;
		this.src = panel.client.src;
		this.children = {};

		var tbar = panel.getTopToolbar();
		if (tbar.buttons.length > 0) {
			tbar.buttons.push('-');
		}
		tbar.buttons.push(
            this.children.rotate = new Ext.Toolbar.Button({ text: 'Rotate', handler: this.rotate, scope: this }),
            this.children.zoomOut = new Ext.Toolbar.Button({ text: 'Zoom Out', handler: this.zoomOut, scope: this }),
            this.children.zoomIn = new Ext.Toolbar.Button({ text: 'Zoom In', handler: this.zoomIn, scope: this }),
			this.children.save = new Ext.Toolbar.Button({ text: 'Save', handler: this.rotateSave, scope: this }),
		//{ text: 'Rotate and Save', handler: this.rotate({ save: true }), scope: this },
			{ text: '1:1', handler: this.resetZoom, scope: this },
            { text: 'Fit Width', handler: this.sizeToWindowWidth, scope: this },
            { text: 'Fit', handler: this.sizeToWindow, scope: this }
        );
		Ext.EventManager.on(panel.client, 'load', this.sizeToWindowWidth, this);
	},

	resetZoom: function () {
		this.transformations.zoom = 100;
		this.zoom(0);
	},

	zoomIn: function () {
		this.zoom(10);
	},

	zoomOut: function () {
		this.zoom(-10);
	},

	rotate: function (options) {
		var transformations = this.transformations;
		if (this.saved) {
			this.saved = false;
			transformations.rotate = 0;
			transformations.save = null;
		}
		if (!options.save) {
			transformations.rotate += 90;
		}
		var size = this.getSize();
		this.size = { width: size.height, height: size.width };
		while (transformations.rotate > 360) {
			transformations.rotate -= 360;
		}
		if (options.save) {
			transformations.save = options.save;
			this.saved = true;
		}
		this.loadImage();
	},

	rotateSave: function () {
		this.rotate({ save: true });
	},

	loadImage: function () {
		var el = this.getEl();
		var dom = el.dom;
		dom.src = Ext.BLANK_IMAGE_URL;
		this.zoom(0);

		dom.src = this.src + (this.src.indexOf("?") === -1 ? "?" : "&") + Ext.urlEncode(this.transformations) + "&dc=" + new Date().getTime();
	},

	getEl: function () {
		return this.panel.client;
	},

	canZoomIn: function () {
		return this.transformations.zoom < 200;
	},

	sizeToWindowWidth: function () {
		var size = this.getSize();
		var winWidth = this.panel.getInnerWidth();
		this.transformations.zoom = Math.floor(winWidth / size.width * 100);
		this.zoom(0);
	},

	sizeToWindow: function () {
		var size = this.getSize();
		var winWidth = this.panel.getInnerWidth();
		var winHeight = this.panel.getInnerHeight();

		var widthRatio = Math.floor(winWidth / size.width * 100);
		var heightRatio = Math.floor(winHeight / size.height * 100);

		this.transformations.zoom = Math.min(widthRatio, heightRatio);
		this.zoom(0);
	},

	canZoomOut: function () {
		return this.transformations.zoom > 10;
	},

	getZoomSize: function () {
		var size = this.getSize(), zoom = this.transformations.zoom;
		return { width: size.width * zoom / 100, height: size.height * zoom / 100 };
	},

	getSize: function () {
		if (!this.size) {
			this.size = this.getEl().getSize();
		}
		if (this.size.width === 0 || this.size.height === 0) {
			Ext.MsgBox.alert('Error', 'Browser not giving height or width');
		}
		return this.size;
	},

	zoom: function (increment) {
		var el = this.getEl();
		this.transformations.zoom += increment;
		var newSize = this.getZoomSize();

		el.setSize(newSize.width, newSize.height);

		this.children.zoomOut.setDisabled(!this.canZoomOut());
		this.children.zoomIn.setDisabled(!this.canZoomIn());
	}
};

Ext.ux.PanPanel = Ext.extend(Ext.Panel, {
	constructor: function (config) {
		//config.autoScroll = false;
		Ext.ux.PanPanel.superclass.constructor.apply(this, arguments);
	},

	onRender: function () {
		Ext.ux.PanPanel.superclass.onRender.apply(this, arguments);
		this.body.appendChild(this.client);
		this.client = Ext.get(this.client);
		this.client.on('mousedown', this.onMouseDown, this);
		this.client.setStyle('cursor', 'move');
	},

	onMouseDown: function (e) {
		e.stopEvent();
		this.mouseX = e.getPageX();
		this.mouseY = e.getPageY();
		Ext.getBody().on('mousemove', this.onMouseMove, this);
		Ext.getDoc().on('mouseup', this.onMouseUp, this);
	},

	onMouseMove: function (e) {
		e.stopEvent();
		var x = e.getPageX();
		var y = e.getPageY();
		if (e.within(this.body)) {
			var xDelta = x - this.mouseX;
			var yDelta = y - this.mouseY;
			this.body.dom.scrollLeft -= xDelta;
			this.body.dom.scrollTop -= yDelta;
		}
		this.mouseX = x;
		this.mouseY = y;
	},

	onMouseUp: function (e) {
		Ext.getBody().un('mousemove', this.onMouseMove, this);
		Ext.getDoc().un('mouseup', this.onMouseUp, this);
	}
});

Ext.reg('pan-panel', Ext.ux.PanPanel);

Ext.ns("Ext.ux");

Ext.ux.TwinCombo = Ext.extend(Ext.form.ComboBox, {
	trigger2Cls: 'x-form-clear-trigger',
	initComponent: function () {
		this.triggerConfig = {
			tag: 'span',
			cls: 'x-form-twin-triggers',
			cn: [
				{ tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger" },
				{ tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Cls }
			]
		};
		Ext.ux.TwinCombo.superclass.initComponent.call(this);
	},
	onTrigger2Click: function () {
		Ext.MsgBox.alert('Error', 'Not implemented');
	},
	getTrigger: Ext.form.TwinTriggerField.prototype.getTrigger,
	initTrigger: Ext.form.TwinTriggerField.prototype.initTrigger,
	onTrigger1Click: Ext.form.ComboBox.prototype.onTriggerClick,
	trigger1Class: Ext.form.ComboBox.prototype.triggerClass
});
Ext.reg('ux-twinCombo', Ext.ux.TwinCombo);

Ext.ux.AddableCombo = function (config) {
	if (!config.mode) {
		config.mode = 'local';
	}
	Ext.applyIf(config, {
		typeAhead: config.mode === 'local',
		valueField: "LookupId",
		displayField: "DisplayValue",
		minChars: 1,
		triggerAction: 'all',
		queryDelay: config.mode === 'local' ? 10 : 200,
		typeAheadDelay: config.mode === 'local' ? 50 : 200,
		forceSelection: true
	});
	Ext.ux.AddableCombo.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.AddableCombo, Ext.ux.TwinCombo, {
	trigger2Cls: 'addTrigger',
	onTrigger2Click: function () {
		var createModule = this.createModule;
		createModule.on('beforeFormClose', this.onBeforeFormClose, this);
		createModule.ShowForm({ id: 0 });
	},
	onBeforeFormClose: function (popupModule, args) {
		popupModule.un('beforeFormClose', this.onBeforeFormClose);
		if (args.reloadGrid) {
			var module = this.module, comboType = this.store.baseParams.comboType;
			Ext.Ajax.request({
				url: EH.BuildUrl(module.controller),
				params: {
					action: 'load',
					id: 0,
					comboTypes: Ext.encode([{ type: comboType, loaded: false }])
				},
				success: function (response, options) {
					var o = Ext.decode(response.responseText);
					this.store.loadData(o.combos[comboType]);
				},
				scope: this
			});
		}
	}
});
Ext.reg('ux-addableCombo', Ext.ux.AddableCombo);

// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
* Ext.ux.ThemeCombo - Combo pre-configured for themes selection
* 
* @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
* @copyright (c) 2008, by Ing. Jozef Sakáloš
* @date      30. January 2008
* @version   $Id: Ext.ux.ThemeCombo.js 472 2009-01-22 23:24:56Z jozo $
*
* @license Ext.ux.ThemeCombo is licensed under the terms of
* the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
* that the code/component(s) do NOT become part of another Open Source or Commercially
* licensed development library or toolkit without explicit permission.
* 
* License details: http://www.gnu.org/licenses/lgpl.html
*/

/*global Ext */

Ext.ux.ThemeCombo = Ext.extend(Ext.form.ComboBox, {
	// configurables
	themeBlueText: 'Ext Blue Theme',
	themeGrayText: 'Gray Theme',
	themeBlackText: 'Black Theme',
	themeOliveText: 'Olive Theme',
	themePurpleText: 'Purple Theme',
	themeDarkGrayText: 'Dark Gray Theme',
	themeSlateText: 'Slate Theme',
	themeVistaText: 'Vista Theme',
	themePeppermintText: 'Peppermint Theme',
	themePinkText: 'Pink Theme',
	themeChocolateText: 'Chocolate Theme',
	themeGreenText: 'Green Theme',
	themeIndigoText: 'Indigo Theme',
	themeMidnightText: 'Midnight Theme',
	themeSilverCherryText: 'Silver Cherry Theme',
	themeSlicknessText: 'Slickness Theme',
	themeVar: 'theme',
	selectThemeText: 'Select Theme',
	themeGrayExtndText: 'Gray-Extended Theme',
	lazyRender: true,
	lazyInit: true,
	cssPath: 'inc/extjs/resources/css/', // mind the trailing slash

	// {{{
	initComponent: function () {

		Ext.apply(this, {
			store: new Ext.data.SimpleStore({
				fields: ['themeFile', { name: 'themeName', type: 'string' }],
				data: [
					['xtheme-default.css', this.themeBlueText],
                    ['xtheme-gray.css', this.themeGrayText],
                    ['xtheme-darkgray.css', this.themeDarkGrayText],
                    ['xtheme-black.css', this.themeBlackText],
                    ['xtheme-olive.css', this.themeOliveText],
                    ['xtheme-purple.css', this.themePurpleText],
                    ['xtheme-slate.css', this.themeSlateText],
                    ['xtheme-peppermint.css', this.themePeppermintText],
                    ['xtheme-chocolate.css', this.themeChocolateText],
                    ['xtheme-green.css', this.themeGreenText],
                    ['xtheme-indigo.css', this.themeIndigoText],
                    ['xtheme-midnight.css', this.themeMidnightText],
                    ['xtheme-silverCherry.css', this.themeSilverCherryText],
                    ['xtheme-slickness.css', this.themeSlicknessText],
                    ['xtheme-gray-extend.css', this.themeGrayExtndText]
				//                    ,['xtheme-pink.css', this.themePinkText]
				]
			}),
			valueField: 'themeFile',
			displayField: 'themeName',
			triggerAction: 'all',
			mode: 'local',
			forceSelection: true,
			editable: false,
			fieldLabel: this.selectThemeText
		}); // end of apply

		this.store.sort('themeName');

		// call parent
		Ext.ux.ThemeCombo.superclass.initComponent.apply(this, arguments);

		if (false !== this.stateful && Ext.state.Manager.getProvider()) {
			this.setValue(Ext.state.Manager.get(this.themeVar) || 'xtheme-default.css');
		}
		else {
			this.setValue('xtheme-default.css');
		}

	}, // end of function initComponent
	// }}}
	// {{{
	setValue: function (val) {
		Ext.ux.ThemeCombo.superclass.setValue.apply(this, arguments);

		// set theme
		Ext.util.CSS.swapStyleSheet(this.themeVar, this.cssPath + val);

		if (false !== this.stateful && Ext.state.Manager.getProvider()) {
			Ext.state.Manager.set(this.themeVar, val);
		}
	} // eo function setValue
	// }}}

});    // end of extend

// register xtype
Ext.reg('themecombo', Ext.ux.ThemeCombo);

// eof

Ext.ux.AddTreeGridFields = function (fields) {
	return fields.concat([
		{ name: '_id', type: 'string' },
		{ name: '_parent', type: 'auto' },
		{ name: '_is_leaf', type: 'bool' }
	]);
};
Ext.ux.GetRequiredColumns = function (columns, fieldsitems) {
	var visibleColumns = [];
	var listFields = fieldsitems;
	for (var i = 0; i < columns.length; i++) {
		if ((!columns[i].hidden && !columns[i].concatenated) || columns[i].required) {
			visibleColumns.push(columns[i].dataIndex);
			if (columns[i].displayIndex) {
				visibleColumns.push(columns[i].displayIndex);
			}
			if (columns[i].dependentListColumns) {
				var length = columns[i].dependentListColumns.length;
				while (length > 0) {
					if (visibleColumns.indexOf(columns[i].dependentListColumns[length - 1]) === -1) {
						visibleColumns.push(columns[i].dependentListColumns[length - 1]);
					}
					length--;
				}
			}
		}
	}
	var cmColumns = [];
	for (var i = 0; i < columns.length; i++) {
		cmColumns.push(columns[i].dataIndex);
		if (columns[i].displayIndex) {
			cmColumns.push(columns[i].displayIndex);
		}
	}

	for (var i = 0; i < listFields.length; i++) {
		if (cmColumns.indexOf(listFields[i].name) === -1 && visibleColumns.indexOf(listFields[i].name) === -1) {
			if (listFields[i].required) {
				visibleColumns.push(listFields[i].name);
			}
		}
	}
	return Ext.encode(visibleColumns);
};
Ext.ux.GetConcatenatedFields = function (columns) {
	var visibleColumns = [];
	for (var i = 0; i < columns.length; i++) {
		if ((!columns[i].hidden || columns[i].required === true) && columns[i].concatenated) {
			visibleColumns.push(columns[i].dataIndex);
			if (columns[i].displayIndex) {
				visibleColumns.push(columns[i].displayIndex);
			}
		}
	}
	return Ext.encode(visibleColumns);
};



Ext.ux.HtmlBox = Ext.extend(Ext.BoxComponent, {
	initComponent: function () {
		this.autoEl = { tag: 'div', cn: this.html };
		delete this.html;
		Ext.ux.HtmlBox.superclass.initComponent.call(this);
	}
});
Ext.reg('htmlBox', Ext.ux.HtmlBox);

Ext.ux.ObjectToArray = function (obj) {
	var array = [];
	for (var o in obj) {
		if (obj.hasOwnProperty(o)) {
			array.push([obj[o], o]);
		}
	}
	return array;
};

Ext.ux.plugins.GridCascadingCombo = Ext.extend(Object, {
	constructor: function (cfg) {
		Ext.apply(this, cfg);
		Ext.ux.plugins.GridCascadingCombo.superclass.constructor.call(this);
	},

	init: function (grid) {
		grid.on('beforeedit', this.onBeforeEdit, this);
	},

	onBeforeEdit: function (e) {
		var info = this.fields[e.field];
		if (info) {
			if (typeof info === 'string') {
				info = { field: info };
			}
			var record = e.record;
			var combo = e.grid.getColumnModel().getCellEditor(e.column, e.row).field;
			var parentValue = record.get(info.field);
			var store = combo.store;

			// If a different country, reload the store
			if (store.baseParams.ScopeId !== parentValue) {
				store.baseParams.ScopeId = parentValue;
				combo.lastQuery = null;
			}
		}
	}
});

Ext.ux.plugins.dynamicFieldLoading = Ext.extend(Object, {
	constructor: function (config) {
		Ext.apply(this, config);
		Ext.ux.plugins.dynamicFieldLoading.superclass.constructor.call(this);
	},

	init: function (grid) {
		this.grid = grid;
		grid.store.on('beforeload', this.beforeload, this);
		grid.colModel.on('hiddenchange', this.reloadGrid, this);
	},
	reloadGrid: function (cm, columnIndex, hidden) {
		var lastParams = this.grid.store.lastOptions.params
		if (!hidden && lastParams.selectedFields.indexOf(cm.getDataIndex(columnIndex)) === -1 && lastParams.selectedConcatenatedFields.indexOf(cm.getDataIndex(columnIndex)) === -1) {
			this.grid.store.reload();
		}
	},
	beforeload: function (e, options) {
		if (options.params) {
			options.params.selectedFields = Ext.ux.GetRequiredColumns(this.grid.colModel.config, this.grid.store.fields.items);
			options.params.selectedConcatenatedFields = Ext.ux.GetConcatenatedFields(this.grid.colModel.config);
		}
	}
});

Ext.ux.plugins.gridAutoRow = Ext.extend(Object, {
	constructor: function (config) {
		Ext.apply(this, config);
		Ext.ux.plugins.gridAutoRow.superclass.constructor.call(this);
	},

	init: function (grid) {
		grid.on('afteredit', this.onAfterEdit, this);
	},

	onAfterEdit: function (e) {
		var store = e.grid.getStore();
		if (e.row === store.getCount() - 1) {
			var newRecord = this.createNewRecord.call(this.scope || e.grid, e);
			if (newRecord) {
				newRecord.phantom = true;
				store.add(newRecord);
				if (this.autoEditOnPhantom) {
					var startEdit = function () {
						e.grid.startEditing(e.row + 1, 0);
					}
					startEdit.defer(250);
				}
			}
		}
	}
});

Ext.ux.form.LabelField = Ext.extend(Ext.form.Field, {
	defaultAutoCreate: { tag: "span" },
	//fieldClass: 'x-form-label',
	value: '',
	readonly: true,
	setValue: function (val) {
		if (this.rendered) {
			this.el.update(typeof this.format == 'function' ? this.format(val) : val);
		}
		this.value = val;
	},
	getValue: function () {
		return this.value;
	},
	getName: function () {
		return this.name;
	}
});
Ext.reg('labelfield', Ext.ux.form.LabelField);


/**
*  Multi Sort Patch for grids (and stores)
*  Uses a modified version of the multiSort function from 'Animal'
*  which can be found at http://www.extjs.com/forum/showthread.php?p=232118#post232118
*
*/

/**
*  Multi Sort Patch for grids (and stores)
*  Uses a modified version of the multiSort function from 'Animal'
*  which can be found at http://www.extjs.com/forum/showthread.php?p=232118#post232118
*
*/

Ext.override(Ext.data.Store, {
	getSortState: function () {
		return this.hasMultiSort ? this.multiSortInfo : this.sortInfo;
	},

	setSortState: function (sort) {
		this.hasMultiSort = false;
		delete this.sortInfo;
		if (sort) {
			if (sort.sorters) {
				this.hasMultiSort = true;
				this.multiSortInfo = sort;
			} else if (sort.field) {
				this.sortInfo = sort;
			}
		}
	},
	oldSort: Ext.data.Store.prototype.sort,
	sort: function (fieldName, dir) {
		if (this.remoteSort) {
			var multiSort = Ext.isArray(arguments[0]);
			if (multiSort) {

				var oldHasMultiSort = this.hasMultiSort;

				this.hasMultiSort = true;

				var oldMultiSortInfo = this.multiSortInfo;

				this.multiSortInfo = {
					sorters: fieldName,
					direction: dir || 'ASC'
				};

				if (!this.load(this.lastOptions)) {
					this.multiSortInfo = oldMultiSortInfo;
					this.hasMultiSort = oldHasMultiSort;
				}
			} else {
				return this.oldSort(fieldName, dir);
			}
		} else {
			this.oldSort(fieldName, dir);
		}
	},

	load: function (options) {
		this.paramNames = {
			"start": "start",
			"limit": "limit",
			"sort": "sort",
			"dir": "dir",
			"multiSortInfo": "multiSortInfo"
		};
		options = options || {};
		if (this.fireEvent("beforeload", this, options) !== false) {
			this.storeOptions(options);
			var p = Ext.apply(options.params || {}, this.baseParams);
			if (this.remoteSort) {
				if (this.hasMultiSort) {
					delete p.dir;
					delete p.sort;
					var pn = this.paramNames;
					p[pn["multiSortInfo"]] = Ext.encode(this.multiSortInfo.sorters);
				}
				else if (this.sortInfo) {
					delete p.multiSortInfo;
					var pn = this.paramNames;
					p[pn["sort"]] = this.sortInfo.field;
					p[pn["dir"]] = this.sortInfo.direction;
				}
			}
			if (this.showGroup == false) {
				delete options.params.multiGroupBy;
				delete p.multiGroupBy;
				this.showGroup = true;
			}
			if (options && options.scope && options.scope.grid && options.scope.grid.multiGrouping) {
				delete options.params.groupBy;
				delete p.groupBy;
				if (!options.params.multiGroupBy) {
					options.params.multiGroupBy = options.scope.grid.groupField
					p.multiGroupBy = options.scope.grid.groupField
				}
				/* Commented on 11-Sep-2013 - it was removing multiGroupBy params on loadFirst
				if (options.params.sort) {
					delete options.params.multiGroupBy;
					delete p.multiGroupBy;
				}
				*/
			}
			if (this.returnGroup == true) {
				this.returnGroup = false;
				delete options.params.multiGroupBy;
				delete p.multiGroupBy;
				return;
			}
			this.proxy.load(p, this.reader, this.loadRecords, this, options);
			return true;
		} else {
			return false;
		}

	},
	sortByFields: function (newFields, add) {
		//var fields = this.sortState;
		var fields = this.hasMultiSort ? this.multiSortInfo.sorters : (this.sortInfo ? [this.sortInfo] : []);
		//Todo: see if ext has an exisiting lookup implementation
		var lookupfn = function (arr, field) {
			var index = Ext.each(arr, function (item) {
				if (item.field == field)
					return false;
			})
			if (index === undefined)
				return -1;
			return index;
		}

		if (!add) {
			//fields = []
			if (this.hasMultiSort) {
				this.hasMultiSort = false;
			}
		}
		Ext.each(newFields, function (item, i) {
			var doFlip = false;
			if (typeof item === 'string') {
				item = {
					field: item,
					direction: 'ASC'
				};
				doFlip = true;
			}
			var oldIndex = lookupfn(fields, item.field);
			if (oldIndex >= 0) {
				fields[oldIndex].direction = (doFlip ? (fields[oldIndex].direction === 'ASC' ? 'DESC' : 'ASC') : item.direction);
				if (!add && fields.length > 1) {
					item.direction = fields[oldIndex].direction;
					fields = [];
					fields.push(item);
				}
			} else {
				//only create completely new selection if an unsorted column is clicked withou CTRL pressed                
				if (!add && i === 0) {
					fields = [];
				}
				fields.push(item);
			}
		}, this);
		if (fields.length > 1) {
			this.sort(fields);
		} else {
			this.oldSort(fields[0].field, fields[0].direction);
		}
	}
});

Ext.override(Ext.grid.GridView, {
	// private
	onHeaderClick: function (g, index, evt) {
		var isReturn = false;
		if (g.multiGrouping && g.getState().groupFields) {
			var multiGroupby = g.getState().groupFields;
			for (var i = 0; i < multiGroupby.length; i++) {
				if (multiGroupby[i] == this.cm.config[index].dataIndex) {
					Ext.Msg.alert('Alert', "Can't apply sorting on this Column");
					isReturn = true;
					return;
				}
			}
		}
		if (this.headersDisabled || !this.cm.isSortable(index)) {
			return;
		}
		g.stopEditing(true);
		var field = null;
		var check = this.cm.config[index];
		if (check.displayIndex) {
			field = check.displayIndex;
		}
		else {
			field = check.dataIndex;
		}
		if (evt.ctrlKey) {
			if (DA.App.allowMultisort) {
				g.store.sortByFields([field], true);
			}
		}
		else {
			g.store.sortByFields(field);
		}

	},
	// private
	handleHdMenuClick: function (item) {
		var index = this.hdCtxIndex;
		var cm = this.cm, ds = this.ds;
		var check = cm.config[index];
		if (check.displayIndex) {
			field = check.displayIndex;
		}
		else {
			field = check.dataIndex;
		}

		// This is for managing for group by if Multigrouping is applied
		if (this.grid.multiGrouping) {
			this.ds.showGroup = true;
			this.ds.returnGroup = false;
			if (item.id == 'showGroups' && item.checked == true) {
				this.ds.showGroup = false;
			}
			if (item.id == 'showGroups' && item.checked == false) {
				if (this.ds.getSortState() && this.ds.getSortState().field == field) {
					Ext.Msg.alert('Alert', 'Remove the sort before you apply group');
					item.checked = true;
					this.ds.returnGroup = true;
					return false;
				}
				if (this.ds.getSortState() && this.ds.getSortState().sorters) {
					for (var i = 0; i < this.ds.getSortState().sorters.length; i++) {
						if (this.ds.getSortState().sorters[i].field == field) {
							Ext.Msg.alert('Alert', 'Remove the sort before you apply group');
							item.checked = true;
							this.ds.returnGroup = true;
							return false;
						}
					}
				}
			}
		}
		switch (item.id) {
			case "asc":
				this.ds.hasMultiSort = false;
				ds.sort(field, "ASC");
				break;
			case "desc":
				this.ds.hasMultiSort = false;
				ds.sort(field, "DESC");
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
	// private
	getDataIndexByDisplayIndex: function (field, config) {
		var dataIndex = field;
		for (var i = 0; i < config.length; i++) {
			if (config[i].displayIndex == field) {
				dataIndex = config[i].dataIndex;
			}
		}
		return dataIndex;
	},
	updateHeaderSortState: function () {
		var state = this.ds.getSortState();
		if (!state || (state.sorters && state.sorters.length === 0)) {
			return;
		}
		if (!this.sortState || (this.sortState != state)) {
			this.grid.fireEvent('sortchange', this.grid, state);
		}
		state = state.sorters || [state];
		this.mainHd.select('td').removeClass(this.sortClasses);
		Ext.each(state, function (state) {
			if (typeof state != 'function') {
				var sortColumn = this.cm.findColumnIndex(state.field);
				if (sortColumn < 0) {
					sortColumn = this.cm.findColumnIndex(this.getDataIndexByDisplayIndex(state.field, this.cm.config));
				}
				if (sortColumn != -1) {
					var sortDir = state.direction;
					this.updateSortIcon(sortColumn, sortDir);
				}
			}
		}, this)
	},

	updateSortIcon: function (col, dir) {
		var sc = this.sortClasses;
		var hds = this.mainHd.select('td');
		hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
	},
	// private
	processRows: function (startRow, skipStripe) {  // This is override for remove Ext.fly is null
		if (!this.ds || this.ds.getCount() < 1) {
			return;
		}
		var rows = this.getRows();
		skipStripe = skipStripe || !this.grid.stripeRows;
		startRow = startRow || 0;
		Ext.each(rows, function (row, idx) {
			row.rowIndex = idx;
			row.className = row.className.replace(this.rowClsRe, ' ');
			if (!skipStripe && (idx + 1) % 2 === 0) {
				row.className += ' x-grid3-row-alt';
			}
		});
		// add first/last-row classes
		if (startRow === 0) {
			if (Ext.fly(rows[0])) {
				Ext.fly(rows[0]).addClass(this.firstRowCls);
			}
		}
		if (Ext.fly(rows[rows.length - 1])) {
			Ext.fly(rows[rows.length - 1]).addClass(this.lastRowCls);
		}
	},
	getCell: function (row, col) { // This is override for remove Ext.fly is null
		if (this.getRow(row)) {
			return this.getRow(row).getElementsByTagName('td')[col];
		}
	},
	getResolvedXY: function (resolved) { // This is override for remove Ext.fly is null
		if (!resolved) {
			return null;
		}
		var s = this.scroller.dom, c = resolved.cell, r = resolved.row;
		if (Ext.fly(r)) {
			return c ? Ext.fly(c).getXY() : [this.el.getX(), Ext.fly(r).getY()];
		}
	}

});

Ext.PagingToolbar.override({
	onLoad: function (store, r, o) {
		if (!this.rendered) {
			this.dsLoaded = [store, r, o];
			return;
		}
		this.cursor = o.params ? o.params[this.paramNames.start] : 0;
		if (isNaN(this.cursor)) {
			this.cursor = 0;
		}
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		if (isNaN(ap)) {
			ap = 1;
		}
		this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		this.loading.enable();
		this.updateInfo();
		this.fireEvent('change', this, d);
	}
});


/*-----------------------Lock Grid Column----------------------*/
/** Normal grid with locking column support */
Ext.grid.LockingGridPanel = Ext.extend(Ext.grid.GridPanel, {
	getView: function () {
		if (!this.view) {
			this.view = new Ext.grid.LockingGridView(this.viewConfig);
		}
		return this.view;
	},
	initComponent: function () {
		if (!this.cm) {
			this.cm = new Ext.grid.LockingColumnModel(this.columns);
			delete this.columns;
		}
		Ext.grid.LockingGridPanel.superclass.initComponent.call(this);
	}
});

/** Editor grid with locking column support */
Ext.grid.LockingEditorGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	getView: function () {
		if (!this.view) {
			this.view = new Ext.grid.LockingGridView(this.viewConfig);
		}
		return this.view;
	},
	initComponent: function () {
		if (!this.cm) {
			this.cm = new Ext.grid.LockingColumnModel(this.columns);
			delete this.columns;
		}
		Ext.grid.LockingEditorGridPanel.superclass.initComponent.call(this);
	}
});

Ext.grid.LockingGridView = function (config) {
	Ext.apply(this, config);
	if (!this.templates) this.templates = {};
	if (!this.templates.master) {
		this.templates.master = new Ext.Template(
                    '<div class="x-grid3" hidefocus="true">',
                    '<div class="x-grid3-locked">',
                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{lstyle}">{lockedHeader}</div></div><div class="x-clear"></div></div>',
                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{lstyle}">{lockedBody}</div><div class="x-grid3-scroll-spacer"></div></div>',
                    '</div>',
                    '<div class="x-grid3-viewport x-grid3-unlocked">',
                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>',
                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
                    '</div>',
                    '<div class="x-grid3-resize-marker">&#160;</div>',
                    '<div class="x-grid3-resize-proxy">&#160;</div>',
                '</div>'
                    );
	}
	Ext.grid.LockingGridView.superclass.constructor.call(this);
};

Ext.extend(Ext.grid.LockingGridView, Ext.grid.GridView, {

	lockText: "Lock",
	unlockText: "Unlock",

	//Template has changed and we need a few other pointers to keep track
	initElements: function () {
		var E = Ext.Element;

		var el = this.grid.getGridEl();
		el = el.dom.firstChild; //.dom.childNodes[1];
		var cs = el.childNodes;

		this.el = new E(el);

		this.lockedWrap = new E(cs[0]);
		this.lockedHd = new E(this.lockedWrap.dom.firstChild);
		this.lockedInnerHd = this.lockedHd.dom.firstChild;
		this.lockedScroller = new E(this.lockedWrap.dom.childNodes[1]);
		this.lockedBody = new E(this.lockedScroller.dom.firstChild);

		this.mainWrap = new E(cs[1]);
		this.mainHd = new E(this.mainWrap.dom.firstChild);
		this.innerHd = this.mainHd.dom.firstChild;
		this.scroller = new E(this.mainWrap.dom.childNodes[1]);
		if (this.forceFit) {
			this.scroller.setStyle('overflow-x', 'hidden');
		}
		this.mainBody = new E(this.scroller.dom.firstChild);

		this.focusEl = new E(this.scroller.dom.childNodes[1]);
		this.focusEl.swallowEvent("click", true);

		this.resizeMarker = new E(cs[2]);
		this.resizeProxy = new E(cs[3]);
	},

	getLockedRows: function () {
		return this.hasRows() ? this.lockedBody.dom.childNodes : [];
	},

	getLockedRow: function (row) {
		return this.getLockedRows()[row];
	},

	getCell: function (rowIndex, colIndex) {
		var locked = this.cm.getLockedCount();
		var row;
		if (colIndex < locked) {
			row = this.getLockedRow(rowIndex);
		} else {
			row = this.getRow(rowIndex);
			colIndex -= locked;
		}
		return row.getElementsByTagName('td')[colIndex];
	},


	getHeaderCell: function (index) {
		var locked = this.cm.getLockedCount();
		if (index < locked) {
			return this.lockedHd.dom.getElementsByTagName('td')[index];
		} else {
			return this.mainHd.dom.getElementsByTagName('td')[(index - locked)];
		}
	},

	scrollToTop: function () {
		Ext.grid.LockingGridView.superclass.scrollToTop.call(this);
		this.syncScroll();
	},

	syncScroll: function (e) {
		Ext.grid.LockingGridView.superclass.syncScroll.call(this, e);
		var mb = this.scroller.dom;
		this.lockedScroller.dom.scrollTop = mb.scrollTop;
	},

	processRows: function (startRow, skipStripe) {
		if (this.ds.getCount() < 1) {
			return;
		}
		skipStripe = skipStripe || !this.grid.stripeRows;
		startRow = startRow || 0;
		var cls = ' x-grid3-row-alt ';
		var rows = this.getRows();
		var lrows = this.getLockedRows();
		for (var i = startRow, len = rows.length; i < len; i++) {
			var row = rows[i];
			var lrow = lrows[i];
			row.rowIndex = i;
			lrow.rowIndex = i;
			if (!skipStripe) {
				var isAlt = ((i + 1) % 2 == 0);
				var hasAlt = (' ' + row.className + ' ').indexOf(cls) != -1;
				if (isAlt == hasAlt) {
					continue;
				}
				if (isAlt) {
					row.className += " x-grid3-row-alt";
					lrow.className += " x-grid3-row-alt";
				} else {
					row.className = row.className.replace("x-grid3-row-alt", "");
					lrow.className = lrow.className.replace("x-grid3-row-alt", "");
				}
			}
		}
	},

	updateSortIcon: function (col, dir) {
		var sc = this.sortClasses;
		var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
		var hds = this.mainHd.select('td').removeClass(sc);
		var lhds = this.lockedHd.select('td').removeClass(sc);
		if (lclen > 0 && col < lclen)
			lhds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
		else
			hds.item(col - lclen).addClass(sc[dir == "DESC" ? 1 : 0]);
	},

	//only used for forceFit?
	updateAllColumnWidths: function () {

		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();
		var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
		var ws = [];
		for (var i = 0; i < clen; i++) {
			ws[i] = this.getColumnWidth(i);
		}

		this.innerHd.firstChild.firstChild.style.width = (tw - lw) + 'px';
		this.mainWrap.dom.style.left = lw + 'px';
		this.lockedInnerHd.firstChild.firstChild.style.width = lw + 'px';

		for (var i = 0; i < clen; i++) {
			var hd = this.getHeaderCell(i);
			hd.style.width = ws[i] + 'px';
		}

		var ns = this.getRows();
		var lns = this.getLockedRows();
		for (var i = 0, len = ns.length; i < len; i++) {
			ns[i].style.width = (tw - lw) + 'px';
			ns[i].firstChild.style.width = (tw - lw) + 'px';
			lns[i].style.width = lw + 'px';
			lns[i].firstChild.style.width = lw + 'px';
			for (var j = 0; j < lclen; j++) {
				var row = lns[i].firstChild.rows[0];
				row.childNodes[j].style.width = ws[j] + 'px';
			}
			for (var j = lclen; j < clen; j++) {
				var row = ns[i].firstChild.rows[0];
				row.childNodes[j].style.width = ws[j] + 'px';
			}
		}

		this.onAllColumnWidthsUpdated(ws, tw);
	},

	updateColumnWidth: function (col, width) {
		var w = this.cm.getColumnWidth(col);
		var tw = this.cm.getTotalWidth();
		var lclen = this.cm.getLockedCount();
		var lw = this.cm.getTotalLockedWidth();

		var hd = this.getHeaderCell(col);
		hd.style.width = w + 'px';

		var ns, gw;
		if (col < lclen) {
			ns = this.getLockedRows();
			gw = lw;
			this.lockedInnerHd.firstChild.firstChild.style.width = gw + 'px';
			this.mainWrap.dom.style.left = this.cm.getTotalLockedWidth() + 'px';
			this.mainWrap.dom.style.display = 'none';
			this.mainWrap.dom.style.display = '';
		} else {
			ns = this.getRows();
			gw = tw - lw;
			col -= lclen;
			this.innerHd.firstChild.firstChild.style.width = gw + 'px';
		}

		for (var i = 0, len = ns.length; i < len; i++) {
			ns[i].style.width = gw + 'px';
			ns[i].firstChild.style.width = gw + 'px';
			ns[i].firstChild.rows[0].childNodes[col].style.width = w + 'px';
		}

		this.onColumnWidthUpdated(col, w, tw);
		this.layout();
	},

	updateColumnHidden: function (col, hidden) {
		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();
		var lclen = this.cm.getLockedCount();

		this.innerHd.firstChild.firstChild.style.width = tw + 'px';

		var display = hidden ? 'none' : '';

		var hd = this.getHeaderCell(col);
		hd.style.display = display;

		var ns, gw;
		if (col < lclen) {
			ns = this.getLockedRows();
			gw = lw;
			this.lockedHd.dom.firstChild.firstChild.style.width = gw + 'px';
			this.mainWrap.dom.style.left = this.cm.getTotalLockedWidth() + 'px';
		} else {
			ns = this.getRows();
			gw = tw - lw;
			col -= lclen;
			this.innerHd.firstChild.firstChild.style.width = gw + 'px';
		}

		for (var i = 0, len = ns.length; i < len; i++) {
			ns[i].style.width = gw + 'px';
			ns[i].firstChild.style.width = gw + 'px';
			ns[i].firstChild.rows[0].childNodes[col].style.display = display;
		}

		this.onColumnHiddenUpdated(col, hidden, tw);

		delete this.lastViewWidth;
		this.layout();
	},

	syncHeaderHeight: function () {
		if (this.lockedInnerHd == undefined || this.innerHd == undefined) return;

		this.lockedInnerHd.firstChild.firstChild.style.height = "auto";
		this.innerHd.firstChild.firstChild.style.height = "auto";
		var height = (this.lockedInnerHd.firstChild.firstChild.offsetHeight > this.innerHd.firstChild.firstChild.offsetHeight) ?
                          this.lockedInnerHd.firstChild.firstChild.offsetHeight : this.innerHd.firstChild.firstChild.offsetHeight;
		this.lockedInnerHd.firstChild.firstChild.style.height = height + 'px';
		this.innerHd.firstChild.firstChild.style.height = height + 'px';

		//if (this.lockedScroller == undefined || this.scroller == undefined) return;
		//this.lockedScroller.dom.style.height = (this.el.dom.offsetHeight - height) + 'px';
		//this.scroller.dom.style.height = (this.el.dom.offsetHeight - height) + 'px';
	},

	doRender: function (cs, rs, ds, startRow, colCount, stripe) {
		var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();
		var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
		var tstyle = 'width:' + this.getTotalWidth() + ';';
		var buf = [], lbuf = [], cb, lcb, c, p = {}, rp = { tstyle: tstyle }, r;
		for (var j = 0, len = rs.length; j < len; j++) {
			r = rs[j]; cb = []; lcb = [];
			var rowIndex = (j + startRow);
			for (var i = 0; i < colCount; i++) {
				c = cs[i];
				p.id = c.id;
				p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
				p.attr = p.cellAttr = "";
				p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
				p.style = c.style;
				if (p.value == undefined || p.value === "") p.value = "&#160;";
				if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
					p.css += ' x-grid3-dirty-cell';
				}
				if (c.locked)
					lcb[lcb.length] = ct.apply(p);
				else
					cb[cb.length] = ct.apply(p);
			}
			var alt = [];
			if (stripe && ((rowIndex + 1) % 2 == 0)) {
				alt[0] = "x-grid3-row-alt";
			}
			if (r.dirty) {
				alt[1] = " x-grid3-dirty-row";
			}
			rp.cols = colCount;
			if (this.getRowClass) {
				alt[2] = this.getRowClass(r, rowIndex, rp, ds);
			}

			rp.alt = alt.join(" ");
			rp.cells = lcb.join("");
			rp.tstyle = 'width:' + lw + 'px;';
			lbuf[lbuf.length] = rt.apply(rp);

			rp.cells = cb.join("");
			rp.tstyle = 'width:' + (tw - lw) + 'px;';
			buf[buf.length] = rt.apply(rp);
		}
		return [buf.join(""), lbuf.join("")];
	},

	renderUI: function () {

		var header = this.renderHeaders();
		var body = this.templates.body.apply({ rows: '' });


		var html = this.templates.master.apply({
			body: body,
			header: header[0],
			lockedBody: body,
			lockedHeader: header[1]
		});

		var g = this.grid;

		g.getGridEl().dom.innerHTML = html;

		this.initElements();

		var bd = this.renderRows();
		if (bd == '') bd = ['', ''];

		this.mainBody.dom.innerHTML = bd[0];
		this.lockedBody.dom.innerHTML = bd[1];
		this.processRows(0, true);


		Ext.fly(this.innerHd).on("click", this.handleHdDown, this);
		Ext.fly(this.lockedInnerHd).on("click", this.handleHdDown, this);
		this.mainHd.on("mouseover", this.handleHdOver, this);
		this.mainHd.on("mouseout", this.handleHdOut, this);
		this.mainHd.on("mousemove", this.handleHdMove, this);
		this.lockedHd.on("mouseover", this.handleHdOver, this);
		this.lockedHd.on("mouseout", this.handleHdOut, this);
		this.lockedHd.on("mousemove", this.handleHdMove, this);
		this.mainWrap.dom.style.left = this.cm.getTotalLockedWidth() + 'px';
		this.scroller.on('scroll', this.syncScroll, this);
		if (g.enableColumnResize !== false) {
			this.splitone = new Ext.grid.GridView.SplitDragZone(g, this.lockedHd.dom);
			this.splitone.setOuterHandleElId(Ext.id(this.lockedHd.dom));
			this.splitone.setOuterHandleElId(Ext.id(this.mainHd.dom));
		}

		if (g.enableColumnMove) {
			this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
			this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
		}

		if (g.enableHdMenu !== false) {
			if (g.enableColumnHide !== false) {
				this.colMenu = new Ext.menu.Menu({ id: g.id + "-hcols-menu" });
				this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
				this.colMenu.on("itemclick", this.handleHdMenuClick, this);
			}
			this.hmenu = new Ext.menu.Menu({ id: g.id + "-hctx" });
			this.hmenu.add(
                { id: "asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc" },
                { id: "desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc" }
            );
			if (this.grid.enableColLock !== false) {
				this.hmenu.add('-',
                    { id: "lock", text: this.lockText, cls: "xg-hmenu-lock" },
                    { id: "unlock", text: this.unlockText, cls: "xg-hmenu-unlock" }
                );
			}

			if (g.enableColumnHide !== false) {
				this.hmenu.add('-',
                    { id: "columns", text: this.columnsText, menu: this.colMenu, iconCls: 'x-cols-icon' }
                );
			}
			this.hmenu.on("itemclick", this.handleHdMenuClick, this);

		}

		if (g.enableDragDrop || g.enableDrag) {
			var dd = new Ext.grid.GridDragZone(g, {
				ddGroup: g.ddGroup || 'GridDD'
			});
		}

		this.updateHeaderSortState();

	},

	layout: function () {
		if (!this.mainBody) {
			return;
		}
		var g = this.grid;
		var c = g.getGridEl(), cm = this.cm,
                expandCol = g.autoExpandColumn,
                gv = this;
		var lw = cm.getTotalLockedWidth();
		var csize = c.getSize(true);
		var vw = csize.width;

		if (vw < 20 || csize.height < 20) {
			return;
		}

		this.syncHeaderHeight();
		if (g.autoHeight) {
			this.scroller.dom.style.overflow = 'visible';
			this.lockedScroller.dom.style.overflow = 'visible';
		} else {
			this.el.setSize(csize.width, csize.height);

			var hdHeight = this.mainHd.getHeight();
			var vh = csize.height - (hdHeight);

			this.scroller.setSize(vw - lw, vh);
			var scrollbar = (this.scroller.dom.scrollWidth > this.scroller.dom.clientWidth) ? 17 : 0;
			this.lockedScroller.setSize(cm.getTotalLockedWidth(), vh - scrollbar);
			if (this.innerHd) {
				this.innerHd.style.width = (vw) + 'px';
			}
		}
		if (this.forceFit) {
			if (this.lastViewWidth != vw) {
				this.fitColumns(false, false);
				this.lastViewWidth = vw;
			}
		} else {
			this.autoExpand();
			lw = cm.getTotalLockedWidth(); //recalculate, as it might be changed by autoExpand
		}
		this.mainWrap.dom.style.left = lw + 'px';
		this.onLayout(vw, vh);
	},

	renderHeaders: function () {
		var cm = this.cm, ts = this.templates;
		var ct = ts.hcell;
		var tw = this.cm.getTotalWidth();
		var lw = this.cm.getTotalLockedWidth();

		var cb = [], lb = [], sb = [], lsb = [], p = {};

		for (var i = 0, len = cm.getColumnCount() ; i < len; i++) {
			p.id = cm.getColumnId(i);
			p.value = cm.getColumnHeader(i) || "";
			p.style = this.getColumnStyle(i, true);
			p.tooltip = this.getColumnTooltip(i);

			if (cm.config[i].align == 'right') {
				p.istyle = 'padding-right:16px';
			}
			if (cm.isLocked(i)) {
				lb[lb.length] = ct.apply(p);
			} else {
				cb[cb.length] = ct.apply(p);
			}
		}
		return [ts.header.apply({ cells: cb.join(""), tstyle: 'width:' + (tw - lw) + ';' }),
				ts.header.apply({ cells: lb.join(""), tstyle: 'width:' + (lw) + ';' })];
	},

	// private
	getColumnTooltip: function (i) {
		var tt = this.cm.getColumnTooltip(i);
		if (tt) {
			if (Ext.QuickTips.isEnabled()) {
				return 'ext:qtip="' + tt + '"';
			} else {
				return 'title="' + tt + '"';
			}
		}
		return "";
	},

	updateHeaders: function () {
		var hd = this.renderHeaders();
		this.innerHd.firstChild.innerHTML = hd[0];
		this.lockedInnerHd.firstChild.innerHTML = hd[1];
	},

	insertRows: function (dm, firstRow, lastRow, isUpdate) {
		if (firstRow === 0 && lastRow == dm.getCount() - 1) {
			this.refresh();
		} else {
			if (!isUpdate) {
				this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
			}
			var html = this.renderRows(firstRow, lastRow);
			var before = this.getRow(firstRow);
			var beforeLocked = this.getLockedRow(firstRow);
			if (before) {
				Ext.DomHelper.insertHtml('beforeBegin', before, html[0]);
			} else {
				Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html[0]);
			}

			var beforeLocked = this.getLockedRow(firstRow);
			if (beforeLocked) {
				Ext.DomHelper.insertHtml('beforeBegin', beforeLocked, html[1]);
			} else {
				Ext.DomHelper.insertHtml('beforeEnd', this.lockedBody.dom, html[1]);
			}
			if (!isUpdate) {
				this.fireEvent("rowsinserted", this, firstRow, lastRow);
				this.processRows(firstRow);
			}
		}
	},
	// private
	removeRow: function (row) {
		Ext.removeNode(this.getRow(row));
		if (this.cm.getLockedCount() > 0) {
			Ext.removeNode(this.getLockedRow(row));
		}
	},

	getColumnData: function () {
		var cs = [], cm = this.cm, colCount = cm.getColumnCount();
		for (var i = 0; i < colCount; i++) {
			var name = cm.getDataIndex(i);
			cs[i] = {
				name: (typeof name == 'undefined' ? this.ds.fields.get(i).name : name),
				renderer: cm.getRenderer(i),
				id: cm.getColumnId(i),
				style: this.getColumnStyle(i),
				locked: cm.isLocked(i)
			};
		}
		return cs;
	},

	renderBody: function () {
		var markup = this.renderRows();
		return [this.templates.body.apply({ rows: markup[0] }), this.templates.body.apply({ rows: markup[1] })];
	},

	refresh: function (headersToo) {
		this.fireEvent("beforerefresh", this);
		this.grid.stopEditing();

		var result = this.renderBody();
		this.mainBody.update(result[0]);
		this.lockedBody.update(result[1]);

		if (headersToo === true) {
			this.updateHeaders();
			this.updateHeaderSortState();
		}
		this.processRows(0, true);
		this.layout();
		this.applyEmptyText();
		this.fireEvent("refresh", this);
	},

	handleLockChange: function () {
		this.refresh(true);
	},

	onDenyColumnHide: function () {

	},

	onColumnLock: function () {
		this.handleLockChange.apply(this, arguments);
	},

	addRowClass: function (row, cls) {
		var r = this.getRow(row);
		if (r) {
			this.fly(r).addClass(cls);
			r = this.getLockedRow(row);
			this.fly(r).addClass(cls);
		}
	},

	removeRowClass: function (row, cls) {
		var r = this.getRow(row);
		if (r) {
			this.fly(r).removeClass(cls);
			r = this.getLockedRow(row);
			this.fly(r).removeClass(cls);
		}
	},

	handleHdMenuClick: function (item) {
		var index = this.hdCtxIndex;
		var cm = this.cm, ds = this.ds;
		switch (item.id) {
			case "asc":
				ds.sort(cm.getDataIndex(index), "ASC");
				break;
			case "desc":
				ds.sort(cm.getDataIndex(index), "DESC");
				break;
			case "lock":
				var lc = cm.getLockedCount();
				if (cm.getColumnCount(true) <= lc + 1) {
					this.onDenyColumnLock();
					return;
				}
				if (lc != index) {
					cm.setLocked(index, true, true);
					cm.moveColumn(index, lc);
					this.grid.fireEvent("columnmove", index, lc);
				} else {
					cm.setLocked(index, true);
				}
				break;
			case "unlock":
				var lc = cm.getLockedCount();
				if ((lc - 1) != index) {
					cm.setLocked(index, false, true);
					cm.moveColumn(index, lc - 1);
					this.grid.fireEvent("columnmove", index, lc - 1);
				} else {
					cm.setLocked(index, false);
				}
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

	handleHdDown: function (e, t) {
		if (Ext.fly(t).hasClass('x-grid3-hd-btn')) {
			e.stopEvent();
			var hd = this.findHeaderCell(t);
			Ext.fly(hd).addClass('x-grid3-hd-menu-open');
			var index = this.getCellIndex(hd);
			this.hdCtxIndex = index;
			var ms = this.hmenu.items, cm = this.cm;
			ms.get("asc").setDisabled(!cm.isSortable(index));
			ms.get("desc").setDisabled(!cm.isSortable(index));
			if (this.grid.enableColLock !== false) {
				ms.get("lock").setDisabled(cm.isLocked(index));
				ms.get("unlock").setDisabled(!cm.isLocked(index));
			}
			this.hmenu.on("hide", function () {
				Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
			}, this, { single: true });
			this.hmenu.show(t, "tl-bl?");
		}
	}
});

Ext.grid.LockingColumnModel = function (config) {
	Ext.grid.LockingColumnModel.superclass.constructor.call(this, config);
};

Ext.extend(Ext.grid.LockingColumnModel, Ext.grid.ColumnModel, {
	getTotalLockedWidth: function () {
		var totalWidth = 0;
		for (var i = 0; i < this.config.length; i++) {
			if (this.isLocked(i) && !this.isHidden(i)) {
				totalWidth += this.getColumnWidth(i);
			}
		}
		return totalWidth;
	}
});


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = (function () {

	// private property
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// private method for UTF-8 encoding
	function utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}

	// public method for encoding
	return {
		encode: (typeof btoa == 'function') ? function (input) { return btoa(input); } : function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = utf8Encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
			}
			return output;
		}
	};
})();

Ext.override(Ext.grid.GridPanel, {
	getFilterParams: function () {
		return this.filters.buildQuery(this.filters.getFilterData());
	},
	getExcelXml: function (includeHidden, options) {
		var worksheet = this.createWorksheet(includeHidden, options);
		var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
		return '<?xml version="1.0" encoding="utf-8"?>' +
            '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
            '<o:DocumentProperties><o:Title>' + this.title + '</o:Title></o:DocumentProperties>' +
            '<ss:ExcelWorkbook>' +
                '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
                '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
                '<ss:ProtectStructure>False</ss:ProtectStructure>' +
                '<ss:ProtectWindows>False</ss:ProtectWindows>' +
            '</ss:ExcelWorkbook>' +
            '<ss:Styles>' +
                '<ss:Style ss:ID="Default">' +
                    '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />' +
                    '<ss:Font ss:FontName="arial" ss:Size="10" />' +
                    '<ss:Borders>' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
                    '</ss:Borders>' +
                    '<ss:Interior />' +
                    '<ss:NumberFormat />' +
                    '<ss:Protection />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="title">' +
                    '<ss:Borders />' +
                    '<ss:Font />' +
                    '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />' +
                    '<ss:NumberFormat ss:Format="@" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="headercell">' +
                    '<ss:Font ss:Bold="1" ss:Size="10" />' +
                    '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />' +
                    '<ss:Interior ss:Pattern="Solid" ss:Color="#A3C9F1" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="even">' +
                    '<ss:Interior ss:Pattern="Solid" ss:Color="#CCFFFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evendate">' +
                    '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenint">' +
                    '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
                    '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="odd">' +
                    '<ss:Interior ss:Pattern="Solid" ss:Color="#CCCCFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
                    '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
                    '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
                    '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
            '</ss:Styles>' +
            worksheet.xml +
            '</ss:Workbook>';
	},

	createWorksheet: function (includeHidden, options) {

		//      Calculate cell data types and extra class names which affect formatting
		var cellType = [];
		var cellTypeClass = [];
		var cm = this.getColumnModel();
		var totalWidthInPixels = 0;
		var colXml = '';
		var headerXml = '';
		for (var i = 0; i < cm.getColumnCount() ; i++) {
			if (includeHidden || !cm.isHidden(i)) {
				var w = cm.getColumnWidth(i)
				totalWidthInPixels += w;
				colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="' + w + '" />';
				headerXml += '<ss:Cell ss:StyleID="headercell">' +
                    '<ss:Data ss:Type="String">' + cm.getColumnHeader(i) + '</ss:Data>' +
                    '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
				var colId = cm.getColumnId(i);
				var col = cm.getColumnById(colId);
				var colName = col.displayIndex;
				if (!colName) {
					colName = col.dataIndex;
				}
				var fld = this.store.recordType.prototype.fields.get(colName);
				switch (fld.type) {
					case "int":
						cellType.push("Number");
						cellTypeClass.push("int");
						break;
					case "float":
						cellType.push("Number");
						cellTypeClass.push("float");
						break;
					case "bool":
					case "boolean":
						cellType.push("String");
						cellTypeClass.push("");
						break;
					case "date":
						cellType.push("DateTime");
						cellTypeClass.push("date");
						break;
					default:
						cellType.push("String");
						cellTypeClass.push("");
						break;
				}
			}
		}
		var visibleColumnCount = cellType.length;

		var result = {
			height: 9000,
			width: Math.floor(totalWidthInPixels * 30) + 50
		};

		var title = this.title;
		if (options && options.header1) {
			title = options.header1;
		}

		if (options && options.header2) {
			title += ' (' + options.header2 + ')';
		}
		if (options && options.header3) {
			title += ' (' + options.header3 + ')';
		}

		//      Generate worksheet header details.
		var t = '<ss:Worksheet ss:Name="' + title + '">' +
            '<ss:Names>' +
                '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + title + '\'!R1:R2" />' +
            '</ss:Names>' +
            '<ss:Table x:FullRows="1" x:FullColumns="1"' +
                ' ss:ExpandedColumnCount="' + visibleColumnCount +
                '" ss:ExpandedRowCount="' + (this.store.getCount() + 2) + '">' +
                colXml +
                '<ss:Row ss:Height="38">' +
                    '<ss:Cell ss:StyleID="title" ss:MergeAcross="' + (visibleColumnCount - 1) + '">' +
                      '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">' +
                        '<html:B><html:U><html:Font html:Size="15">' + title +
                        '</html:Font></html:U></html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />' +
                    '</ss:Cell>' +
                '</ss:Row>' +
                '<ss:Row ss:AutoFitHeight="1">' +
                headerXml +
                '</ss:Row>';

		//      Generate the data rows from the data in the Store
		for (var i = 0, it = this.store.data.items, l = it.length; i < l; i++) {
			t += '<ss:Row>';
			var cellClass = (i & 1) ? 'odd' : 'even';
			r = it[i].data;
			var k = 0;
			for (var j = 0; j < cm.getColumnCount() ; j++) {
				if (includeHidden || !cm.isHidden(j)) {
					var colId = cm.getColumnId(j);
					var col = cm.getColumnById(colId);
					var colName = col.displayIndex;
					var editor = col.editor;
					if (!colName) {
						colName = col.dataIndex;
					}
					var v = r[colName];

					if (editor && editor.field) {
						var editorField = editor.field;
						if (editorField.getXType() == 'combo') {
							var record = editorField.findRecord(editorField.valueField, v);
							if (record) {
								v = record.get(editorField.displayField)
								cellType[k] = 'String';
							}
						}
					}

					t += '<ss:Cell ss:StyleID="' + cellClass + cellTypeClass[k] + '"><ss:Data ss:Type="' + cellType[k] + '">';
					if (cellType[k] == 'DateTime') {
						t += v.format('Y-m-d');
					} else {
						t += v;
					}
					t += '</ss:Data></ss:Cell>';
					k++;
				}
			}
			t += '</ss:Row>';
		}

		result.xml = t + '</ss:Table>' +
            '<x:WorksheetOptions>' +
                '<x:PageSetup>' +
                    '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
                    '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
                    '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
                '</x:PageSetup>' +
                '<x:FitToPage />' +
                '<x:Print>' +
                    '<x:PrintErrors>Blank</x:PrintErrors>' +
                    '<x:FitWidth>1</x:FitWidth>' +
                    '<x:FitHeight>32767</x:FitHeight>' +
                    '<x:ValidPrinterInfo />' +
                    '<x:VerticalResolution>600</x:VerticalResolution>' +
                '</x:Print>' +
                '<x:Selected />' +
                '<x:DoNotDisplayGridlines />' +
                '<x:ProtectObjects>False</x:ProtectObjects>' +
                '<x:ProtectScenarios>False</x:ProtectScenarios>' +
            '</x:WorksheetOptions>' +
        '</ss:Worksheet>';
		return result;
	}
});
Ext.ux.plugins.checkBoxRadio = Ext.extend(Object, {
	constructor: function (config) {
		Ext.apply(this, config);
		Ext.ux.plugins.checkBoxRadio.superclass.constructor.call(this);
	},

	init: function (grid) {
		grid.on('beforeedit', this.onBeforeEdit, this);

	},
	unSelectAll: function (e) {
		var store = e.grid.getStore();
		store.each(function (records) {
			records.set(e.grid.checkColumnName, false);
		});
		scope: this
	},
	onBeforeEdit: function (e) {
		var field = e.field;
		var record = e.record;
		switch (field) {
			case e.grid.checkColumnName:
				if (record) {
					this.unSelectAll(e);
				}
				break;
		}
	}
});
if (Ext.grid.CheckColumn.prototype) {
	Ext.override(Ext.grid.CheckColumn, {
		init: Ext.grid.CheckColumn.prototype.init.createSequence(function () {
			if (this.grid.plugins) {
				var plugins = this.grid.plugins;
				if (plugins) {
					for (var i = 0, len = plugins.length; i < len; i++) {
						if (plugins[i] instanceof Ext.ux.plugins.checkBoxRadio) {
							this.menu = null;
						}
					}
				}
			}
		})
	});
}


Ext.ux.FieldSpeecher = {
	init: function (field) {
		if (Ext.isWebKit && !Ext.isSafari) {
			if (!Ext.recognition) {
				Ext.recognition = new webkitSpeechRecognition();
				Ext.recognition.continuous = true;
				Ext.recognition.interimResults = true;
				Ext.recognition.lang = 'en';
				Ext.recognition.onresult = function (event) {
					var textArea = Ext.recognition.currentObj;
					if (textArea) {
						for (var i = event.resultIndex; i < event.results.length; ++i) {
							if (event.results[i].isFinal) {
								var textValue = textArea.getValue() + ' ' + event.results[i][0].transcript.toSentenceCase();
								textValue = textValue.trim();
								textArea.setValue(textValue);
							}
						}
					}
				}
			}
			if (field.xtype == 'textarea') {
				Ext.apply(field, {
					onRender: field.onRender.createSequence(function (ct, position) {
						var label = this.el.findParent('.x-form-element', 5, true) || this.el.findParent('.x-form-field-wrap', 5, true);
						var labeldiv;
						var labelFound = label != null;
						if (!label) {
							label = this.el.parent('div').parent('div').parent('div').parent('div').child('span');
							labeldiv = this.el.parent('div').parent('div').parent('div').child('div');
						}
						var style = labelFound ? 'si-notes-btn' : 'si-btn';
						
						//var speechTextField = new Ext.form.TextField({ width: 20, height: 20, name: 'speech', value: '<button class="si-btn" style="top: 4.7px; width: 37.6px; height: 37.6px;"><span class="si-mic"></span><span class="si-holder"></span></button>', readOnly: true });
						var speechTextField = new Ext.Button({
							iconCls: 'si-btn',
							width: 50, height: 50, name: 'speech',
							text: '<span class="si-mic"></span><span class="si-holder"></span>'
						});

						this.speechTextField = speechTextField;

						speechTextField.on('click', function (btn) {
							var divTextArea = btn.el.parent('div').parent('div').child('textarea');
							var textArea = Ext.getCmp(divTextArea.id);
							if (!Ext.recognition.currentObj) {
								Ext.recognition.start();
								Ext.recognition.currentObj = textArea;
								//btn.setValue('^');
							} else {
								//btn.setValue('o');
								Ext.recognition.currentObj = null;
								Ext.recognition.stop();
							}
							textArea.focus(true, true);
						}, this);
						speechTextField.on('render', function (f) {

							f.getEl().set({ 'x-webkit-speech': true, 'speech': true });
							f.getEl().on('webkitspeechchange', function (e) {
								f.fireEvent('speech', f, f.getValue());
							});

						}, this);
						if (labelFound) {
							this.divSpeech = label.createChild({ name: 'divSpeech' });
							speechTextField.render(this.divSpeech.id);
						}
						else {
							speechTextField.render(labeldiv.id);
						}
						if (labelFound)//It resize the divSpeech width/height
						{
							this.alignDivTextArea = function () {
								var fieldHeight = this.getSize().height;
								var fieldWidth = this.getSize().width;
								speechTextField.getEl().set({ 'style': 'width:18px;height:16px;margin-top:-' + fieldHeight + 'px;margin-left:' + fieldWidth + 'px' });
							};
							this.on('resize', this.alignDivTextArea, this);
						}
						else //It resize the speechTextField width/height
						{
							this.alignDivTextArea = function () {
								var fieldHeight = this.getSize().height;
								var fieldWidth = this.getSize().width - 20;
								speechTextField.getEl().set({ 'style': 'width:12px;height:16px;margin-top:-17.3px;margin-left:-25px;' });
							};
							this.on('resize', this.alignDivTextArea, this);
						}
					})
				});
			}
			else {
				/*
				field.on('speech', function (field, value) {
				var textValue = field.originalValue + ' ' + value;
				textValue = textValue.toTitleCase();
				field.setValue(textValue);
				field.originalValue = textValue;
				});
				*/

				field.on('render', function () {
					field.getEl().set({
						'x-webkit-speech': true,
						'speech': true
					});

					field.getEl().on('webkitspeechchange', function (e) {
						field.fireEvent('speech', field, field.getValue());
					});
				});
			}
		}

	}
};
Ext.data.Connection.override({
	doFormUpload: function (o, ps, url) {
		var id = Ext.id();
		var frame = document.createElement('iframe');
		frame.id = id;
		frame.name = id;
		frame.className = 'x-hidden';
		if (Ext.isIE) {
			frame.src = Ext.SSL_SECURE_URL;
		}
		document.body.appendChild(frame);

		if (Ext.isIE) {
			document.frames[id].name = id;
		}

		var form = Ext.getDom(o.form),
            buf = {
            	target: form.target,
            	method: form.method,
            	encoding: form.encoding,
            	enctype: form.enctype,
            	action: form.action
            };
		form.target = id;
		form.method = 'POST';
		form.enctype = form.encoding = 'multipart/form-data';
		if (url) {
			form.action = url;
		}

		var hiddens, hd;
		if (ps) { // add dynamic params
			hiddens = [];
			ps = Ext.urlDecode(ps, false);
			for (var k in ps) {
				if (ps.hasOwnProperty(k)) {
					hd = document.createElement('input');
					hd.type = 'hidden';
					hd.name = k;
					hd.value = ps[k];
					form.appendChild(hd);
					hiddens.push(hd);
				}
			}
		}

		function cb() {
			var r = {  // bogus response object
				responseText: '',
				responseXML: null
			};

			r.argument = o ? o.argument : null;

			try { //
				var doc;
				if (Ext.isIE) {
					doc = frame.contentWindow.document;
				} else {
					doc = (frame.contentDocument || window.frames[id].document);
				}
				if (doc && doc.body) {
					r.responseText = doc.body.innerHTML;
				}
				if (doc && doc.XMLDocument) {
					r.responseXML = doc.XMLDocument;
				} else {
					r.responseXML = doc;
				}
			}
			catch (e) {
				// ignore
			}

			Ext.EventManager.removeListener(frame, 'load', cb, this);

			this.fireEvent("requestcomplete", this, r, o);

			Ext.callback(o.success, o.scope, [r, o]);
			Ext.callback(o.callback, o.scope, [o, true, r]);

			setTimeout(function () { Ext.removeNode(frame); }, 100);
		}

		Ext.EventManager.on(frame, 'load', cb, this);
		form.submit();

		form.target = buf.target;
		form.method = buf.method;
		form.enctype = buf.enctype;
		form.encoding = buf.encoding;
		if (!Ext.isIE) {
			form.action = buf.action;
		}

		if (hiddens) { // remove dynamic params
			for (var i = 0, len = hiddens.length; i < len; i++) {
				Ext.removeNode(hiddens[i]);
			}
		}
	}
});
Ext.ux.GetElapsedTime = function (startDateTime) {
	var ms = startDateTime.getElapsed();
	var secs = ms / 1000;
	ms = Math.floor(ms % 1000);
	var minutes = secs / 60;
	secs = Math.floor(secs % 60);
	var hours = minutes / 60;
	minutes = Math.floor(minutes % 60);
	hours = Math.floor(hours % 24);
	var elapsedTime = minutes + ":" + secs + ":" + ms;
	return elapsedTime;
};

Ext.ux.RemoveStoreFiltersOnColumns = function (dataIndex, grid, obj) {
	var filters = grid.prefManager.filterModel.getAllElementaryFilters(grid.prefManager.filterModel.filter);
	if (filters) {
		for (var i = 0; i < filters.length; i++) {
			if (filters[i].field.id == dataIndex) {
				grid.prefManager.filterModel.removeElementaryFilterById(filters[i].id);
			}
		}
	}
	var filterInfo = grid.prefManager.filterModel.getFilterObj();
	if (filterInfo) {
		filterInfo = obj.resolveFilter(filterInfo);
		filterInfo = Ext.util.JSON.encode(filterInfo);
	}
	grid.store.baseParams.filter = filterInfo;
};

Ext.ux.util.Popup = {
	show: function (options) {
		var url = options.url;

		var params = options.params;
		var method = options.method || 'GET';
		if (method === 'GET' && params) {
			url += (url.indexOf("?") > -1 ? "&" : "?") + Ext.urlEncode(params);
		}


		var iframePanel = new Ext.ux.IFrameComponent({
			url: method === 'GET' ? url : ""
		});

		var win = new Ext.Window(Ext.apply({
			layout: 'fit',
			modal: true,
			title: options.title,
			items: iframePanel,
			height: options.height || 600,
			width: options.width || 900,
			maximizable: true,
			tbar: options.tbar,
			maximized: options.maximized,
			y: 10
		}, options.window));

		if (method === 'POST') {
			iframePanel.on('render', function () {
				iframePanel.maskFrame(true);
				ExtHelper.HiddenForm.submit({
					action: url,
					params: params,
					target: iframePanel.getIFrameName()
				});
			});
		}

		win.show();
		return win;
	}

};

Ext.ux.util.ValidateForm = function (form) {
	var basicForm = form.getForm(),
		valid = true,
		invalidField = null;
	basicForm.items.each(function (f) {
		if (f.hasFocus && typeof f.beforeBlur === 'function') {
			f.beforeBlur();
		}

		if (!f.validate()) {
			valid = false;
			invalidField = f;
			return false;
		}
	});
	if (invalidField) {
		Ext.Msg.alert('Validation Error', 'Please correct the validation errors before saving!', function () {
			invalidField.focus(true, true);
			var tip = new Ext.ToolTip({ title: invalidField.activeError, dismissDelay: 2000 });
			tip.showBy(invalidField.getEl());
		});
	}
	return valid;
};
Ext.ux.plugins.Period = Ext.extend(Object, {
	constructor: function (config) {
		Ext.apply(this, config);
		Ext.ux.plugins.Period.superclass.constructor.call(this);
	},

	getStoreValues: function () {
		return [
			['0', 'Current Date'],
			['1', 'Last Day'],
			['2', 'Last Week'],
			['3', 'Last Month'],
			['4', 'Last Year'],
			['5', 'Last 7 days'],
			['6', 'Last 30 days']
		];
	},

	periods: {
		CurrentDate: '0',
		LastDay: '1',
		LastWeek: '2',
		LastMonth: '3',
		LastYear: '4',
		Last7Days: '5',
		Last30Days: '6'
	},

	init: function (combo) {
		this.fromDate.on({
			'change': this.dateRangeCheck,
			'select': this.dateRangeCheck,
			beforedestroy: this.onDestroy,
			scope: this
		});

		this.toDate.on({
			'change': this.dateRangeCheck,
			'select': this.dateRangeCheck,
			beforedestroy: this.onDestroy,
			scope: this
		});

		combo.on({
			'change': this.onPeriodComboChange,
			'select': this.onPeriodComboChange,
			beforedestroy: this.onDestroy,
			scope: this
		});


	},

	onDestroy: function () {
		this.fromDate = null;
		this.toDate = null;
		if (this.tip) {
			this.tip.destroy();
			delete this.tip;
		}
	},

	warningLimit: 365,

	day: 24 * 60 * 60 * 1000,

	warningTipCfg: {
		html: 'Caution! You have chosen a longer period. The report may take a long time',
		width: 400,
		cls: 'x-tip-body'
	},

	checkDateRange: function () {
		var mt = Ext.form.MessageTargets.under;
		if (this.fromDate.isValid() && this.toDate.isValid()) {
			var days = (this.toDate.getValue() - this.fromDate.getValue()) / this.day + 1;
			if (days >= this.warningLimit) {
				mt.mark(this.toDate, this.warningTipCfg.html);
				return;
			}
		}
		mt.clear(this.toDate);
	},

	dateRangeCheck: function (dateField) {
		var otherFieldValue, value = dateField.getValue();
		if (dateField === this.fromDate) {
			this.toDate.setMinValue(value);
			otherFieldValue = this.toDate.getValue();
			if (!Ext.isDate(otherFieldValue) || otherFieldValue < value) {
				this.toDate.setValue(value);
			}
		} else {
			this.fromDate.setMaxValue(value);
			otherFieldValue = this.fromDate.getValue();
			if (!Ext.isDate(otherFieldValue) || otherFieldValue > value) {
				this.fromDate.setValue(value);
			}
		}
		this.checkDateRange();
	},

	onPeriodComboChange: function (combo) {
		var fromDate = new Date(),
			toDate = new Date(),
			period = this.periods,
			newValue = combo.getValue();
		if (!newValue) {
			return;
		}
		switch (newValue) {
			case period.CurrentDate:
				fromDate = fromDate;
				toDate = toDate;
				break;
			case period.LastDay:
				fromDate = fromDate.add(Date.DAY, -1);
				toDate = fromDate;
				break;
			case period.LastWeek:
				fromDate = fromDate.add(Date.DAY, -(7 + fromDate.getDay()));
				toDate = fromDate.add(Date.DAY, 6);
				break;
			case period.LastMonth:
				fromDate = fromDate.getFirstDateOfMonth().add(Date.MONTH, -1);
				toDate = fromDate.getLastDateOfMonth();
				break;
			case period.LastYear:
				fromDate = new Date(fromDate.getFullYear() - 1, 0, 1);
				toDate = new Date(fromDate.getFullYear(), 11, 31);
				break;
			case period.Last7Days:
				fromDate = fromDate.add(Date.DAY, -6);
				break;
			case period.Last30Days:
				fromDate = fromDate.add(Date.DAY, -30);
				break;
		}
		this.fromDate.setValue(fromDate);
		this.toDate.setValue(toDate);
		this.checkDateRange();
	},

	getFirstDayOfWeek: function (today) {
		return today.add(Date.DAY, today.getDay());
	}
});
