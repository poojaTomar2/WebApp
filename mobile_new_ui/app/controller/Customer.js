Ext.define('CoolerIoTMobile.controller.Customer', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			mainNavigationView: 'mobile-main #mainNavigationView',
			coolerPanel: 'mobile-customerInfo #coolerPanel',
			customerList: 'mobile-customer #customerList',
			searchbox: 'mobile-customer #searcNameField'
		},
		control: {
			'mobile-customer #searcNameField': {
				keyup: 'onLocationSearch',
				clearicontap: 'onLocationSearch'
			},
			'mobile-customer #customerList': {
				itemsingletap: 'onCustomerListTap'
			}
		}
	},

	onCustomerListTap: function (list, index, target, record) {
		var view = this.getMainNavigationView();
		view.push({ xtype: 'mobile-customerInfo', data: record.data, fromOffRoute: false });
		var assetStore = this.getCoolerPanel().getComponent('assetDetailList').getStore();
		assetStore.getProxy().setExtraParam('LocationId', record.get('LocationId'));//record.getRecord().get('LocationId'));
		assetStore.getProxy().setExtraParam('AsArray', 0);
		assetStore.load();
	},

	onLocationSearch: function () {
		if (!this.searchTask) {
			this.searchTask = new Ext.util.DelayedTask(this.doLocationSearch, this);
		}
		this.searchTask.delay(500);
	},
	doLocationSearch: function () {
		var value = this.getSearchbox().getValue();
		this.serachLocation({ 'location': value, forCustomer: true });
	},

	serachLocation: function (params) {
		var customerlist = this.getCustomerList();
		var store = customerlist.getStore();
		store.getProxy().setExtraParams(params);
		store.load();
	}
});