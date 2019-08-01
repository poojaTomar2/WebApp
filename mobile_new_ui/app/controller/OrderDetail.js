Ext.define('CoolerIoTMobile.controller.OrderDetail', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			orderDeatil: 'mobile-orderdetail-win'
		},
		control: {
			'mobile-orderdetail-win #orderdetailData': {
				activate: 'onActivate'
			},
			'mobile-orderdetail-win #okBtn': {
				singletap: 'onActionUpdateCancel'
			}
		}
	},
	onActionUpdateCancel: function (doCallback) {
		var alerActionWin = this.getOrderDeatil();
		alerActionWin.hide();
		alerActionWin.destroy();
		if (doCallback === true) {
			Ext.callback(alerActionWin.getCallback(), alerActionWin.getWindowScope());
		}
	},

	onActivate: function () {
		var updateWindow = this.getOrderDeatil(),
			consumerOrderId = updateWindow.getConsumerOrderId();

		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Loading..' });
		var url = CoolerIoTMobile.util.Renderers.consumerApiUrl('consumer/order/details')
		Ext.Ajax.request({
			url: url,
			params: {
				authToken: localStorage.authToken,
				consumerOrderId: consumerOrderId
			},
			success: function (response) {
				this.onSuccess(response);
			},
			failure: function () {
				this.onFailure();
			},
			scope: this
		});
	},
	onSuccess: function (response) {
		Ext.Viewport.setMasked(false);
		var data = Ext.decode(response.responseText);
		var order = Ext.ComponentQuery.query('[itemId=orderdetailData]')[0];
		order.setData(data);
	},
	onFailure: function () {
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert('Error', 'Some error occured.');
	}
});