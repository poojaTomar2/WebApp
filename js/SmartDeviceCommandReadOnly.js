Cooler.SmartDeviceCommandReadOnly = new Cooler.SmartDeviceEventSQLLog({
	controller: 'SmartDeviceCommand',
	useElastic: true,
	title: 'Command',
	securityModule: 'Command',
	gridConfig: {
		multiLineToolbar: true,
		viewConfig: {
			getRowClass: function (r) {
				if (r.get('CreatedByUserId') <= 1) {
					return 'blue-row';
				}
				return '';
			}
		}
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceCommandId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Value', dataIndex: 'Value', type: 'string', width: 150 },
			{ header: 'Command', dataIndex: 'SmartDeviceTypeCommand', type: 'string', width: 150 },
			{ header: 'Executed On', dataIndex: 'ExecutedOn', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Result', dataIndex: 'Result', type: 'string', width: 150 },
			{ header: 'Is Success', dataIndex: 'CommandStatus', width: 130, type: 'string' },
			{ header: 'Configuration Changed By', dataIndex: 'ChangeRequestedByUser', type: 'string' },
			{ header: 'Command Type', dataIndex: 'CommandType', type: 'string' },
			{ dataIndex: 'CreatedByUserId', type: 'int' }
		]);
	}
});