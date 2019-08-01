Cooler.LocationReference = new Cooler.Form({
	title: 'Location Reference',
	controller: 'LocationReference',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'OutletReference',
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var approveButton = new Ext.Button({ text: 'Approve', handler: this.onProcessButtonClick, scope: this });
		var rejectButton = new Ext.Button({ text: 'Reject', handler: this.onProcessButtonClick, scope: this });
		tbarItems.push(approveButton);
		tbarItems.push(rejectButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	hybridConfig: [
		{ header: 'Location Id', dataIndex: 'LocationId', width: 100, type: 'int', align: 'right' },
		{ header: 'Name', dataIndex: 'Name', width: 150, type: 'string' },
		{ header: 'Latitude', dataIndex: 'Latitude', width: 60, align: 'right', renderer: ExtHelper.renderer.Float(8) },
		{ header: 'Longitude', dataIndex: 'Longitude', width: 70, align: 'right', renderer: ExtHelper.renderer.Float(8) },
		{ header: 'City', dataIndex: 'City', width: 100, type: 'string' },
		{ header: 'Street', dataIndex: 'Street', width: 100, type: 'string' },
		{ header: 'Street2', dataIndex: 'Street2', width: 100, type: 'string' },
		{ header: 'Street3', dataIndex: 'Street3', width: 100, type: 'string' },
		//using as PrimaryPhone as string 
		{ header: 'Primary Phone', dataIndex: 'PrimaryPhone', width: 100, type: 'string' },
		{ header: 'Location Business Hour', dataIndex: 'BusinessHour', width: 300, type: 'string' },
		{ header: 'CreatedBy', dataIndex: 'Username', width: 150, type: 'string' }
	],
	onProcessButtonClick: function (sender) {
		var selectedRecord = Cooler.LocationReference.grid.getSelectionModel().getSelected();
		if (selectedRecord == undefined) {
			Ext.Msg.alert('Alert', 'Please select one row.');
			return;
		}
		var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
		mask.show();
		outleRequesttParams = {};
		outleRequesttParams.locationReferenceId = selectedRecord.id;
		outleRequesttParams.isForApprove = sender.text == 'Approve' ? true : false;
		outleRequesttParams.action = 'other';
		outleRequesttParams.otherAction = 'ProcessOutletColumns';

		Ext.Ajax.request({
			url: EH.BuildUrl('LocationReference'),
			params: outleRequesttParams,
			success: function (result, request) {
				mask.hide();
				mask.destroy();
				Ext.Msg.alert('Info', result.responseText.replace(/"/g, ''));
				Cooler.LocationReference.grid.getStore().load();
			},
			failure: function (result, request) {
				mask.hide();
				mask.destroy();
				Ext.Msg.alert('Error', result.responseText.replace(/"/g, ''));
			},
			scope: this
		});
	},
});