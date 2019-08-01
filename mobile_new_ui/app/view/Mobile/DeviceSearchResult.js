Ext.define('CoolerIoTMobile.view.Mobile.DeviceSearchResult', {
	extend: 'Ext.grid.Grid',
	xtype: 'mobile-deviceSearchResult',
	config: {
		store: 'DeviceSearchResult',
		scrollable: true,
		cls: 'df-autoHeight',
		width: '100%',
		hidden: true,
		titleBar: {
			hidden: true
		}
	},

	initialize: function () {
		var columns = [
			{
				text: 'Event Time',
				dataIndex: 'EventTime',
				renderer: function (v, m) { if (v) { return Ext.Date.format(Ext.Date.parse(v, 'X'), 'm/d/Y h:i:s A') } else return "&nbsp;"; },
				width: 150
			},
			{
				text: 'Device Number',
				width: 120,
				dataIndex: 'SerialNumber',
				renderer: this.deviceSerialRenderer,
				align: 'right'
			},
			{
				text: 'Event Id',
				width: 120,
				dataIndex: 'EventId',
				align: 'right'
			},
			{
				text: 'Created On',
				dataIndex: 'CreatedOn',
				renderer: function (v, m) { return CoolerIoTMobile.util.Renderers.CovertUTCToLocalDate(v) },
				width: 150
			},
			{
				text: 'Gateway Id',
				width: 150,
				dataIndex: 'GatewayId',
				align: 'right'
			}
		];
		this.setColumns(columns);
		this.callParent(arguments);
	},
	deviceSerialRenderer: function (v, m) {
		var selectedController = Ext.ComponentQuery.query('#logsSelect')[0];
		if (selectedController) {
			if (selectedController.getValue() === 'LogDebugger') {
				return m.data.DeviceSerial;
			}
			else {
				return v;
			}
		}
	}
});
