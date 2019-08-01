Cooler.LocationBusinessHour = new Cooler.Form({
	keyColumn: 'LocationBusinessHourId',
	captionColumn: null,
	title: 'Business Hour',
	controller: 'LocationBusinessHour',
	quickSaveController: 'LocationBusinessHour',
	allowExport: false,
	newListRecordData: { Days: '', OpenTime: '', CloseTime: '' },
	gridPlugins: [new DA.form.plugins.Inline()],
	hybridConfig: function () {
		var data = [
			{ LookupId: 0, DisplayValue: 'All' },
			{ LookupId: 1, DisplayValue: 'Sunday' },
			{ LookupId: 2, DisplayValue: 'Monday' },
			{ LookupId: 3, DisplayValue: 'Tuesday' },
			{ LookupId: 4, DisplayValue: 'Wednesday' },
			{ LookupId: 5, DisplayValue: 'Thursday' },
			{ LookupId: 6, DisplayValue: 'Friday' },
			{ LookupId: 7, DisplayValue: 'Saturday' }
		];
		var daysCombo = new Ext.ux.form.LovCombo({
			store: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, idProperty: 'LookupId', data: data }),
			mode: 'local',
			displayField: 'DisplayValue',
			displayFieldTpl: '{DisplayValue}',
			valueField: 'LookupId',
			width: 150,
			height: 150,
			allowBlank: false,
			readOnly: true
		});
		this.daysCombo = daysCombo;
		var startTime = new Ext.form.TimeField({ allowBlank: false, format: 'h:i A', listWidth: 80 });
		var endTime = new Ext.form.TimeField({ allowBlank: false, format: 'h:i A', listWidth: 80 });
		return [
			{ dataIndex: 'LocationBusinessHourId', type: 'int' },
			{
				header: 'Days', dataIndex: 'Day', type: 'string', xtype: 'combocolumn', width: 250, editor: daysCombo, ignoreFilter: true, renderer: function (value, m, r) {
					if (value && value !== '') {
						var values = value.split(',');
						var store = daysCombo.getStore();
						var toReturn = [];
						for (var i = 0, len = values.length; i < len; i++) {
							var rec = store.getAt(values[i])
							toReturn.push(rec.get("DisplayValue"));
						}
						return toReturn.join(',');
					}
				}
			},
			{ header: 'Start Time', dataIndex: 'OpenTime', type: 'date', editor: startTime, renderer: this.timeRenderer, ignoreFilter: true },
			{ header: 'End Time', dataIndex: 'CloseTime', type: 'date', editor: endTime, renderer: this.timeRenderer, ignoreFilter: true }
		];
	},
	onGridCreated: function (grid) {
		grid.on('validateedit', this.onValidateEdit, this);
		this.daysCombo.on('select', this.onSelect, this);
		this.on('afterQuickSave', this.onAfterQuickSave, this);
	},

	onAfterQuickSave: function(){
		this.grid.getStore().load();
	},

	convertTo24Hour: function (time) {
		var hours = parseInt(time.substr(0, 2));
		if (time.indexOf('AM') != -1 && hours == 12) {
			time = time.replace('12', '0');
		}
		if (time.indexOf('PM') != -1 && hours < 12) {
			time = time.replace(hours, (hours + 12));
		}
		return time.replace(/(AM|PM)/, '');
	},
	isValidComparison: function (value, field, time) {
		var timepart = value.split(' ')[0];
		var hours = parseInt(timepart.split(':')[0]);
		var minutes = parseInt(timepart.split(':')[1]);
		var compareValue = (hours * 100 + minutes);
		var isDateFormat = time instanceof Date;
		if (isDateFormat) {
			var compareWith = time.getHours() * 100 + time.getMinutes();
		}
		else {
			time = this.convertTo24Hour(time);
			var timepart = time.split(' ')[0];
			var hours = parseInt(timepart.split(':')[0]);
			var minutes = parseInt(timepart.split(':')[1]);
			var compareWith = (hours * 100 + minutes);
		}
		if (field == 'OpenTime') {
			return compareValue > compareWith ? true : false;
		}
		else {
			return compareValue < compareWith ? true : false;
		}
	},
	onValidateEdit: function (e) {
		var field = e.field;
		var record = e.record;
		var grid = e.grid;
		var value = e.value;
		var row = e.row;
		var col = e.column;
		var originalValue = e.originalValue;
		originalValue = Ext.isDate(originalValue) ? originalValue.format('h:i A') : originalValue;
		record.valueChanged = originalValue == value ? false : true;
		if (value) {
			switch (field) {
				case 'OpenTime':
					var endTime = record.get('CloseTime');
					value = this.convertTo24Hour(value);
					if (endTime) {
						if (this.isValidComparison(value, field, endTime)) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End time must be greater than Start time", showBy: cell });
							return false;
						}
					}
					break;
				case 'CloseTime':
					var startTime = record.get('OpenTime');
					value = this.convertTo24Hour(value);
					if (startTime) {
						if (this.isValidComparison(value, field, startTime)) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End time must be greater than Start time", showBy: cell });
							return false;
						}
					}
					break;
			}
		}
	},
	onSelect: function (me, record, index) {
		var firstRecord = me.store.getAt(0);
		if (record.get(me.checkField) == false && index != 0) {
			firstRecord.set(me.checkField, false);
		}
		else if (me.value.length == 13 && index != 0) {
			firstRecord.set(me.checkField, true);
		}
		me.setValue(me.getCheckedValue());
	},
	timeRenderer: function (value, model, record) {
		if (!record.valueChanged) {
			record.dirty = false
		}
		if (value) {
			var time = value;
			if (!Ext.isDate(value)) {
				var dateString = "1900/01/01 " + value;
				time = new Date(dateString);
			}
			return time.format('h:i A');
		} else {
			return '';
		}
	}
});

