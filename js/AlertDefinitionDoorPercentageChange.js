Cooler.AlertDefinitionDoorPercentageChange = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Door Percentage Change',
		keyColumn: 'AlertDefinitionDoorPercentageChangeId',
		captionColumn: null,
		newListRecordData: { WeekDayNumber: '' },
		gridIsLocal: true
	});
	Cooler.AlertDefinitionDoorPercentageChange.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AlertDefinitionDoorPercentageChange, Cooler.Form, {
	hybridConfig: function () {
		var daysValue = [
			[Cooler.Enums.WeekDays.Sunday, 'Sunday' ], [Cooler.Enums.WeekDays.Monday, 'Monday' ], [Cooler.Enums.WeekDays.Tuesday, 'Tuesday' ], [Cooler.Enums.WeekDays.Wednesday, 'Wednesday' ], [Cooler.Enums.WeekDays.Thursday, 'Thursday' ], [Cooler.Enums.WeekDays.Friday, 'Friday' ], [Cooler.Enums.WeekDays.Saturday, 'Saturday' ]
		];
		var daysCombo = DA.combo.create({ mode: 'local', store: daysValue, allowBlank: false });
		this.daysCombo = daysCombo;
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'Days', dataIndex: 'WeekDayNumber', width: 150, type: 'int', editor: daysCombo, ignoreFilter: true },
			{ header: 'Min Door %', dataIndex: 'DoorPercentageMin', width: 150, type: 'float', editor: new Ext.form.NumberField({ allowBlank: false, minValue: 1, maxValue: 100, allowDecimals: true }) },
			{ header: 'Max Door %', dataIndex: 'DoorPercentageMax', width: 150, type: 'float', editor: new Ext.form.NumberField({ allowBlank: false, minValue: 1, maxValue: 100, allowDecimals: true }) }
		];
	}
});

Cooler.AlertDefinitionDoorPercentageChange = new Cooler.AlertDefinitionDoorPercentageChange();
