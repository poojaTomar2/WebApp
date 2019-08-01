Ext.define('CoolerIoTMobile.controller.Order', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			order: 'mobile-order'
		},
		control: {
			'order': {
				show: 'onShow',
				itemsingletap: 'onOrderClick',
				itemswipe: 'OnSwipeOrder'
			}
		}
	},
	OnSwipeOrder: function (dataview, ix, target, record, event, options) {
		//complete order
		var consumerOrderId = record.get('consumerOrderId');
		var statusId = record.get('statusId');
		// Don't complete order if already completed
		if (statusId != CoolerIoTMobile.Enums.OrderStatus.Completed) {
			this.onUpdateOrder(consumerOrderId, CoolerIoTMobile.Enums.OrderStatus.Completed);// completed
		}
		
	},
	onUpdateOrder: function (consumerOrderId, statusId) {
		var authToken = localStorage.authToken;
		var url = Df.App.getController('consumer/order/updatestatus');
		url = url.replace(".ashx", "");
		Ext.Ajax.request({
			url: url,
			waitMsg: 'Updating...',
			params: {
				consumerOrderId: consumerOrderId,
				statusId: statusId,
				authToken: authToken
			},
			success: this.onSuccessCallBack,
			failure: this.onErrorCallBack,
			scope: this
		});
	},
	onErrorCallBack: function (options, success, response) {
		Ext.Msg.alert('Error', 'An error occurred.');
	},
	onSuccessCallBack: function (options, success, response) {
		var data = Ext.decode(options.responseText);
		if (success) {
			this.loadOrder();
		}
	},
	onOrderClick: function (grid, index, target, record, e, eopts) {
		var statusId = record.get('statusId');
		// Don't update order if already completed
		if (statusId != CoolerIoTMobile.Enums.OrderStatus.Completed) {
			this.onUpdateOrder(record.data.consumerOrderId, CoolerIoTMobile.Enums.OrderStatus.Progress);// Progress
		}
		var updateWindow = Ext.Viewport.add({
			xtype: 'mobile-orderdetail-win',
			windowScope: this,
			consumerOrderId: record.data.consumerOrderId
		});
		updateWindow.show();
	},
	onShow: function () {
		this.loadOrder();
		this.resetTimer();
	},
	loadOrder: function(){
		var store = Ext.getStore('Order');
		var storeProxy = store.getProxy();
		var authToken = localStorage.authToken;
		storeProxy.setExtraParams({ authToken: authToken });
		store.load();
	},
	resetTimer: function () {
		var me = this;
		var task = new Ext.util.DelayedTask(function () {
			me.loadOrder();
			me.resetTimer.call(this);
		}, this);
		task.delay(30000); // 30 sec
		this.task = task;
	}
});