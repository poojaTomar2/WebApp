Ext.define('CoolerIoTMobile.view.Mobile.Order', {
	extend: 'Ext.grid.Grid',
	xtype: 'mobile-order',
	config: {
		store: 'Order',
		cls: 'order-autoHeight',
		title: 'Order List',
		layout: 'fit',
		titleBar: {
			hidden: true
		},
		scrollable: {
			direction: 'vertical',
			directionLock: true
		}
	},

	initialize: function () {
		var columns = [
			{
				text: 'Order Date',
				dataIndex: 'orderDate',
				renderer: CoolerIoTMobile.util.Renderers.CovertUTCToLocalDate,
				align: 'center',
				width: '20vw'

			},
			{
				text: '#Order',
				dataIndex: 'consumerOrderId',
				align: 'center',
				width: '15vw',
				renderer: CoolerIoTMobile.util.Renderers.orderNumber
			},
			{
				text: '#Table',
				width: '12vw',
				align: 'right',
				dataIndex: 'tableNumber'
			},
			{
				text: 'Amount',
				width: '13vw',
				align: 'right',
				dataIndex: 'amount'
			},
			{
				text: 'Status',
				width: '20vw',
				align: 'center',
				dataIndex: 'statusId',
				renderer: CoolerIoTMobile.util.Renderers.orderStatus
			},
			{
				text: 'Customer Name',
				width: '20vw',
				align: 'center',
				dataIndex: 'customerName'
			}
		];
		this.setColumns(columns);
		this.callParent(arguments);
	}
});