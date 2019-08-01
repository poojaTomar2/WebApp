/**
 * BoxSelect for ExtJS 4
 * 
 * A friendlier combo box for multiple selections that creates labels for 
 * the individual selections and allows for easy removal, as seen on facebook 
 * and other sites.  
 * 
 * Inspired by the SuperBoxSelect component for ExtJS 3 (http://technomedia.co.uk/SuperBoxSelect/examples3.html), 
 * which in turn was inspired by the BoxSelect component for ExtJS 2 (http://efattal.fr/en/extjs/extuxboxselect/).
 * 
 * @author kvee_iv http://www.sencha.com/forum/member.php?29437-kveeiv
 * @version 0.3
 * @requires BoxSelect.css
 * @class Ext.ux.form.field.BoxSelect
 * @extends Ext.form.field.ComboBox
 */
Ext.define('Df.form.field.BoxSelect', {
    extend:'Ext.form.field.ComboBox',
    alias: ['widget.comboboxselect', 'widget.boxselect'],

	// private
	selectOnFocus: true,
	// private
    multiSelect: true,
	// private
	forceSelection: true,
	// private
	typeAhead: false, // only really not allowed here because combo would throw error
	// private
	editable: true,
	// private
	autoSelect: false,
	// private
	matchFieldWidth: true,

	// private
	fieldSubTpl: [
		'<div class="x-boxselect {[this.userCls]}">',
			'<ul class="x-boxselect-list {fieldCls} {typeCls}">',
				'<li class="x-boxselect-input">',
					'<input id="{id}" type="{type}" ',
						'<tpl if="name">name="{name}" </tpl>',
						'<tpl if="size">size="{size}" </tpl>',
						'<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
						'class="x-boxselect-input-field" autocomplete="off" />',
					'<div class="{clearCls}" role="presentation"></div>',
				'</li>',
			'</ul>',
			'<div class="{triggerWrapCls}" role="presentation">',
				'{triggerEl}',
				'<div class="{clearCls}" role="presentation"></div>',
			'</div>',
		'</div>',
        {
        	compiled: true,
        	disableFormats: true,
        	userCls: ''
        }
    ],
	// private
	renderSelectors: {
		itemList: 'ul.x-boxselect-list',
		inputEl: 'input.x-boxselect-input-field',
		inputElCt: 'li.x-boxselect-input'
	},

    componentLayout: 'boxselectfield',

    initComponent: function() {
        var me = this;

		Ext.apply(me, {
			multiSelectItemTpl: [
				'<tpl for=".">',
						'<li class="x-boxselect-item" ',
						'qtip="{[typeof values === "string" ? values : values.' + me.displayField + ']}">' ,
						'<div class="x-boxselect-item-text">{[typeof values === "string" ? values : values.' + me.displayField + ']}</div>',
						'<div class="x-boxselect-item-close"></div>' ,
						'<div class="{clearCls}" role="presentation"></div>' ,
						'</li>' ,
					'</tpl>',
				{
					compile: true,
					disableFormats: true
				}
			]
		});		
		if (!me.fieldSubTpl.compiled) {
			me.fieldSubTpl.forEach(function (item) {
				if (typeof item === "object") {
					if (item.userCls == '' && me.userCls)
						item.userCls = me.userCls;
				}

			});
		}
		else {
			me.fieldSubTpl.userCls = me.userCls ? me.userCls : '';
		}
		me.callParent();
    },

	initEvents: function() {
		var me = this;

		me.callParent();

		me.mon(me.itemList, {
			'click': {
				fn: me.onItemListClick,
				scope: me
			}
		});
		me.mon(me.store, {
			'datachanged': {
				fn: me.trackFilteredSelections,
				buffer: 10,
				scope: me
			}
		});
	},

	onDestroy: function() {
		var me = this;

		Ext.destroyMembers(me, 'metrics');

		me.callParent();
	},

	afterRender: function() {
		var me = this,
			itemList = me.itemList;

		me.metrics = new Ext.util.TextMetrics(itemList);

		// Cannot use placeholder, as our main input field is often empty
		if (Ext.supports.Placeholder && me.inputEl && me.emptyText) {
			delete me.inputEl.dom.placeholder;
		}

		me.callParent();
	},

	/**
	 * Overridden to allow for continued querying with multiSelect selections already made
	 */
	doRawQuery: function() {
		var me = this,
			rawValue = me.inputEl.dom.value;
			
		if (me.multiSelect) {
			rawValue = rawValue.split(me.delimiter).pop();
		}

		this.doQuery(rawValue);
    },

	/**
	 * Overridden to handle forcing selections on multiSelect values more directly
	 */
    assertValue: function() {
        var me = this,
			rawValue = me.inputEl.dom.value,
			rec = rawValue ? me.findRecordByDisplay(rawValue) : false;

		if (rec && !Ext.Array.contains(me.value, rec.get(me.valueField))) {
			me.setValue(me.value.concat(rec.get(me.valueField)));
		}

		me.inputEl.dom.value = '';

        me.collapse();
    },

	/**
	 * Watch for changes on the store's data to keep filteredSelections up to date
	 */
	trackFilteredSelections: function() {
		var me = this,
			store = me.store,
			filteredSelections = me.filteredSelections || [];

		if (store.isFiltered()) {
			filteredSelections = Ext.Array.filter(filteredSelections, function(filteredRecord) {
				return ((store.data.indexOf(filteredRecord) === -1) && (store.snapshot.indexOf(filteredRecord) !== -1));
			});
		} else {
			filteredSelections = [];
		}

		me.filteredSelections = filteredSelections;
	},

	/**
	 * Overridden to preserve multiSelect selections when list is refiltered via overridden doRawQuery
	 */
	onListSelectionChange: function(list, selectedRecords) {
        var me = this,
			store = me.store,
			mergedRecords = [],
			i;

        // Only react to selection if it is not called from setValue, and if our list is
        // expanded (ignores changes to the selection model triggered elsewhere)
        if (!me.ignoreSelection && me.isExpanded) {
            if (!me.multiSelect) {
                Ext.defer(me.collapse, 1, me);
            } else if (!Ext.isEmpty(me.lastSelection) && store.isFiltered()) {
				Ext.Array.forEach(me.lastSelection, function(selectedRecord) {
					if (Ext.Array.contains(selectedRecords, selectedRecord)) {
						// in current selection
						mergedRecords.push(selectedRecord);
					} else if ((store.data.indexOf(selectedRecord) === -1) && (store.snapshot.indexOf(selectedRecord) !== -1)) {
						// is now filtered
						Ext.Array.include(me.filteredSelections, selectedRecord);
						mergedRecords.push(selectedRecord);
					} else if (Ext.Array.contains(me.filteredSelections, selectedRecord)) {
						// was already filtered
						mergedRecords.push(selectedRecord);
					}
				});
				// combine remaining current selections and previously filtered selections
				mergedRecords = Ext.Array.merge(Ext.Array.merge(mergedRecords, selectedRecords), me.filteredSelections);
			} else {
				mergedRecords = selectedRecords;
			}

			
			i = Ext.Array.intersect(mergedRecords, me.lastSelection).length;
			if ((i != mergedRecords.length) || (i != me.lastSelection.length)) {
				me.setValue(mergedRecords, false);
				if (mergedRecords.length > 0) {
					me.fireEvent('select', me, mergedRecords);
				}
				me.inputEl.focus();
			}
			me.alignPicker();
        }
    },

	/**
	 * Intercept backspaces and deletes when user input is empty to remove the last selected entry
	 */
    onKeyUp: function(e, t) {
        var me = this,
            key = e.getKey(),
			value = me.value;

        if (!me.readOnly && !me.disabled && me.editable && (key == e.BACKSPACE || key == e.DELETE) && (me.inputEl.dom.value == '') && 
					Ext.isEmpty(me.lastInputValue) && (value.length > 0)) {
			value.splice(value.length - 1, 1);
			me.setValue(value);
			me.inputEl.focus();
		} else {
			me.callParent([e,t]);
		}

		// tracker to make sure we were empty before the backspace/delete, since the field will be empty by the time we know
		me.lastInputValue = me.inputEl.dom.value;
    },

	/**
	 * Delegation control for removing selected items or triggering list collapse/expansion
	 */
	onItemListClick: function(evt, el, o) {
		var me = this,
			itemEl = evt.getTarget('.x-boxselect-item'),
			closeEl = itemEl ? evt.getTarget('.x-boxselect-item-close') : false;

		if (!closeEl) {
			me.onTriggerClick();
			return;
		}

		me.removeByListItemNode(itemEl);
	},

	getMultiSelectItemMarkup: function() {
        return this.getTpl('multiSelectItemTpl').apply(this.valueModels ? Ext.Array.pluck(this.valueModels, 'data') : this.value);
	},

	/**
	 * Removal of value by node reference
	 */
	removeByListItemNode: function(itemEl) {
		var me = this,
			itemIdx = 0,
			searchEl = me.itemList.dom.firstChild;
		while (searchEl && searchEl.nextSibling) {
			if (searchEl == itemEl) {
				break;
			}
			itemIdx++;
			searchEl = searchEl.nextSibling;
		}
		itemIdx = (searchEl == itemEl) ? itemIdx : false;

		if (itemIdx !== false) {
			var value = me.value;
			value.splice(itemIdx, 1);
			me.setValue(value);
			me.inputEl.focus();
		}
	},

	/**
	 * Overridden to align to bodyEl instead of inputEl
     */
    alignPicker: function() {
        var me = this,
            picker, isAbove,
            aboveSfx = '-above';

        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by min and max width) unless there are no records to display.
                picker.setSize(me.itemList.getWidth(), picker.store && picker.store.getCount() ? null : 0);
            }
            if (picker.isFloating()) {

                picker.alignTo(me.itemList, me.pickerAlign, me.pickerOffset);

                // add the {openCls}-above class if the picker was aligned above
                // the field due to hitting the bottom of the viewport
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    }, 

	/**
	 * Intercept calls to getRawValue to pretend there is no inputEl for rawValue handling, 
	 * so that we can use inputEl for just the user input.
	 */
	getRawValue: function() {
		var me = this,
			inputEl = me.inputEl,
			result;
		me.inputEl = false;
		result = me.callParent(arguments);
		me.inputEl = inputEl;
		return result;
	},

	/**
	 * Intercept calls to setValue to search the unfiltered store snapshot instead of filtered store data
	 */
	setValue: function(value, doSelect) {
		var me = this,
			store = me.store,
			valueField = me.valueField,
			selectedRecords = [],
			record, len, i;

		if (Ext.isEmpty(value)) {
			value = [];
		} else {
			value = Ext.Array.from(value);
		}

		if (store.isFiltered()) {
			for (i = 0, len = value.length; i < len; i++) {
				record = value[i];
				if (!record || !record.isModel) {
					record = store.snapshot.findIndexBy(function(rec) {
						return rec.get(valueField) === record;
					});
					if (record !== -1) {
						selectedRecords.push(store.snapshot.getAt(record));
					}
				} else {
					selectedRecords.push(record);
				}
			}
		} else {
			selectedRecords = value;
		}

		me.callParent([selectedRecords, doSelect]);
	},

	/**
	 * Intercept calls to setRawValue to pretend there is no inputEl for rawValue handling, so that we can use inputEl 
	 * for just the user input. Update the multiSelect items list display based on the new values.
	 */
	setRawValue: function(value) {
        var me = this,
			inputEl = me.inputEl,
			result, rawValues;

		me.inputEl = false;
		result = me.callParent([value]);
		me.inputEl = inputEl;

		if (inputEl && me.multiSelect) {
			rawValues = result.split(me.delimiter);
			if (rawValues.length != me.value.length) {
				inputEl.dom.value = Ext.value(rawValues[rawValues.length - 1], '');
			} else if (me.emptyText === inputEl.dom.value) {
				inputEl.dom.value = '';
			}
		}

		if (me.itemList) {
			me.el.appendChild(me.inputElCt);
			me.itemList.update(me.getMultiSelectItemMarkup());
			me.itemList.appendChild(me.inputElCt);
			me.alignPicker();
		}

        return result;
    },

	/**
	 * Overridden to use value (selection) instead of raw value and to avoid the use of placeholder
	 */
	applyEmptyText : function(){
		var me = this,
            emptyText = me.emptyText,
            isEmpty;

        if (me.rendered && emptyText) {
            isEmpty = me.value.length < 1 && !me.hasFocus;
            
            if (isEmpty) {
                me.setRawValue(emptyText);
                me.inputEl.addCls(me.emptyCls);
            }

            me.autoSize();
        }
    },

	/**
	 * Intercept calls to onFocus to add focusCls, because the base field classes assume this should be applied to inputEl
	 */
    onFocus: function() {
        var me = this,
            focusCls = me.focusCls,
            itemList = me.itemList;

        if (focusCls && itemList) {
            itemList.addCls(focusCls);
        }

		me.callParent();
	},

	/**
	 * Intercept calls to onBlur to remove focusCls, because the base field classes assume this should be applied to inputEl
	 */
	onBlur: function() {
		var me = this,
            focusCls = me.focusCls,
            itemList = me.itemList;

        if (focusCls && itemList) {
            itemList.removeCls(focusCls);
        }

		me.callParent();
	},

	/**
	 * Ensure inputEl is sized well for user input using the remaining horizontal space available in the list element
	 */
	autoSize: function() {
		if(!this.rendered){
            return this;
        }

		var me = this,
        	inputElCt = me.inputElCt,
			itemList = me.itemList,
			listWidth = itemList.getWidth(),
			value = Ext.value(me.inputEl.dom.value, me.emptyText), 
			valueWidth = !Ext.isEmpty(value) ? me.metrics.getWidth(value) + 25 : false,
			inputWidth = inputElCt.getWidth(),
			newWidth, offsets;


		inputElCt.setWidth('1px');
		offsets = inputElCt.getOffsetsTo(itemList);

		newWidth = listWidth - offsets[0] - 25;
		if (((newWidth > inputWidth) && (valueWidth > newWidth)) || (newWidth < 25)) {
			newWidth = listWidth - 25;
		}

		inputElCt.setWidth(newWidth + 'px');

		me.callParent();
	}

});

/**
 * Overridden to resize the field at the item list wrap instead of the inputEl
 */
Ext.define('Ext.ux.layout.component.field.BoxSelectField', {

    /* Begin Definitions */

    alias: ['layout.boxselectfield'],

    extend: 'Ext.layout.component.field.Field',

    /* End Definitions */

    type: 'boxselectfield',

    sizeBodyContents: function(width, height) {
        var me = this,
            owner = me.owner,
            itemList = owner.itemList,
            triggerWrap = owner.triggerWrap,
            triggerWidth = owner.getTriggerWidth();

        // If we or our ancestor is hidden, we can get a triggerWidth calculation
        // of 0.  We don't want to resize in this case.
        if (owner.hideTrigger || owner.readOnly || triggerWidth > 0) {
            // Decrease the field's width by the width of the triggers. Both the field and the triggerWrap
            // are floated left in CSS so they'll stack up side by side.
            me.setElementSize(itemList, Ext.isNumber(width) ? width - triggerWidth : width);
    
            // Explicitly set the triggerWrap's width, to prevent wrapping
            triggerWrap.setWidth(triggerWidth);

			owner.autoSize();
        }
    }
});
