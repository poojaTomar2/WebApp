Cooler.RawFiles = new Cooler.Form({
	title: 'Raw File',
	controller: 'RawFiles',
	disableAdd: true,
	disableDelete: true,
	allowExport: false,
	securityModule: 'RawFiles',
	hybridConfig: [
		{ header: 'File Name', dataIndex: 'FileName', width: 150, type: 'string', hidden: true },
		{ header: 'Hub Mac Address', dataIndex: 'HubMac', width: 120, type: 'string', quickFilter: false },
		{ header: 'Size(Bytes)', dataIndex: 'Size', width: 80, type: 'int', align: 'right', quickFilter: false, menuDisabled: true },
		{ header: 'Log Date', dataIndex: 'CreationTime', width: 150, type: 'date', renderer: ExtHelper.renderer.DateTime, quickFilter: false, filterable: false, menuDisabled: true },
		{ header: 'Download', width: 150, type: 'string', sortable: false, quickFilter: false, menuDisabled: true, renderer: function (value, meta, record) { var dateForDownload = new Date(record.data.CreationTime); var formattedDate = dateForDownload.toLocaleDateString() + " " + dateForDownload.toLocaleTimeString(); return "<a target='_blank' href='Controllers/" + Cooler.RawFiles.controller + ".ashx?action=downloadFile&fileName=" + record.data.FileName + "&startDateTime=" + formattedDate + "'>Download</a>" } }
	],
	onStartDateChange: function (field, newValue) {
		this.endDateTimeField.setValue(newValue.add('d', 1).add('s', -1));
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var startDateTimeField = new Ext.ux.form.DateTime();
		var endDateTimeField = new Ext.ux.form.DateTime();
		startDateTimeField.df.format = DA.Security.info.Tags.DateFormat;
		endDateTimeField.df.format = DA.Security.info.Tags.DateFormat;

		this.startDateTimeField = startDateTimeField;
		this.endDateTimeField = endDateTimeField;

		startDateTimeField.df.on('change', this.onStartDateChange, this);

		tbarItems.push('Raw File Start Date');
		var initialStartDateTime = new Date().clearTime();
		var initialEndDateTime = initialStartDateTime.add('D', 1).add('s', -1)

		startDateTimeField.setValue(initialStartDateTime);


		endDateTimeField.setValue(initialEndDateTime);
		endDateTimeField.df.setDisabled(true);
		tbarItems.push(startDateTimeField);
		tbarItems.push('End Time');
		tbarItems.push(endDateTimeField);
		this.searchButton = new Ext.Button({
			text: 'Search', handler: this.onSearchBtnClk, scope: this
		});
		tbarItems.push(this.searchButton);
		config.baseParams.startDateTime = startDateTimeField.getValue();
		config.baseParams.endDateTime = endDateTimeField.getValue();
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	onSearchBtnClk: function () {
		delete this.grid.getStore().baseParams.startDateTime;
		delete this.grid.getStore().baseParams.endDateTime;

		this.endDateTimeField.df.setDisabled(false);

		if (!Ext.isEmpty(this.startDateTimeField.getValue()) && !Ext.isEmpty(this.endDateTimeField.getValue())) {
			Ext.applyIf(this.grid.getStore().baseParams, { startDateTime: this.startDateTimeField.getValue(), endDateTime: this.endDateTimeField.getValue() });
			this.grid.loadFirst();
		}
		this.endDateTimeField.df.setDisabled(true);
	}
});
