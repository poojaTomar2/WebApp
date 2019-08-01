Ext.define('CoolerIoTMobile.view.Mobile.OrderDetail', {
	extend: 'Ext.form.Panel',
	xtype: 'mobile-orderdetail-win',
	config: {
		windowScope: undefined,
		consumerOrderId: 0,
		modal: true,
		hideOnMaskTap: true,
		showAnimation: {
			type: 'popIn',
			duration: 250,
			easing: 'ease-out'
		},
		hideAnimation: {
			type: 'popOut',
			duration: 250,
			easing: 'ease-out'
		},
		centered: true,
		width: '85%',
		height: '15em',
		padding: '5 5 5 5',
		defaults: {
			margin: '0 0 5 0',
			labelWidth: '45%'
		},
		items: [
			{
				xtype: 'container',
				itemId: 'orderdetailData',
				margin: '0 0 8px 0',
				tpl: new Ext.XTemplate('<div>',
					'<div class="order-popup-container">Order Summary</div>',
					'<div class="iot-alertData-header iot-alert-list">',
						'<div class="iot-order-product">Product Name</div>',
						'<div class="iot-order-quantity">Quantity</div>',
						'<div class="x-clear"></div>',
						'</div>',
					'<tpl for="records">',
					'<div class="iot-alertData iot-order-textfont">',
					'<tpl if="values.productName == null"><div class="iot-order-product">N/A</div></tpl>',
					'<tpl if="values.productName"><div class="iot-order-product">{[values.productName]}</div></tpl>',
						'<div class="iot-order-quantity">{[values.quantity]}</div>',
						'<div class="x-clear"></div>',
					'</div>',
					'</tpl>',
					'</div>'
					)
			},
			{
				xtype: 'container',
				layout: 'vbox',
				align: 'center',
				items: [
					{
						xtype: 'df-buttonplus',
						text: 'OK',
						ui: 'confirm',
						itemId: 'okBtn'
					}
				]
			}
		]
	}
});