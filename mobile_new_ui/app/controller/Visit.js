Ext.define('CoolerIoTMobile.controller.Visit', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			mainNavigationView: 'mobile-main #mainNavigationView',
			coolerPanel: 'mobile-customerInfo #coolerPanel',
			visitPanel: 'mobile-visit',
			searchbox: 'mobile-visit #searcNameField',
			dayfield: 'mobile-visit #dayfield',
			visitTabPanel: 'mobile-visit #visitTabPanel'
		},
		control: {
			'mobile-visit #dayfield': {
				change: 'onDayChange'
			},
			'mobile-visit #searcNameField': {
				keyup: 'onLocationSearch',
				clearicontap: 'onLocationSearch'
			},
			'mobile-visit #onRouteVisitList': {
				itemsingletap: 'onVisitListTap',
				activate: 'onRouteVisitActivate'
			},
			'mobile-visit #offRouteVisitList': {
				itemsingletap: 'onVisitListTap',
				activate: 'offRouteVisitActivate'
			},
			'mobile-visit': {
				activate: 'onVisitActivate'
			}
		}
	},
	onVisitActivate: function (panel) {
		var visitTab = panel.down('#visitTabPanel');
		var activeItem = visitTab.getActiveItem();
		if (activeItem.getItemId() === 'onRouteVisitList')
			this.onRouteVisitActivate(activeItem)
		else
			this.offRouteVisitActivate(activeItem); 
	},
	onRouteVisitActivate: function (list) {
		this.getDayfield().setHidden(false);
		var store = list.getStore();
		var day = this.getDayfield().getValue();
		var proxy = store.getProxy();
		proxy.setExtraParam('location', null);
		proxy.setExtraParam('day', day);
		proxy.setExtraParam('onRoute', true);
		store.load();
	},
	offRouteVisitActivate: function (list) {
		this.getDayfield().setHidden(true);
		var store = list.getStore(); 
		store.getProxy().setExtraParam('day', 0);
		store.getProxy().setExtraParam('onRoute', false);
		store.load();
	},
	onLocationSearch: function () {
		if (!this.searchTask) {
			this.searchTask = new Ext.util.DelayedTask(this.doLocationSearch, this);
		}
		this.searchTask.delay(500);
	},
	onDayChange: function (combo, newValue, oldValue, eOpts) {
		this.doLocationSearch();
	},
	doLocationSearch: function () {
		var visitTab = this.getVisitTabPanel();
		var activeItem = visitTab.getActiveItem(); 
		var value = this.getSearchbox().getValue();
		var day = this.getDayfield().getValue();
		this.serachLocation({ 'location': value, 'day': day, 'onRoute': activeItem.getItemId() === 'onRouteVisitList' });
	},
	onVisitListTap: function (list, index, target, record) {
		var visitTab = this.getVisitTabPanel();
		var activeItem = visitTab.getActiveItem();
		var fromOffRoute = false;
		if (activeItem.getItemId() !== 'onRouteVisitList') {
			fromOffRoute = true;
		}
		this.show({ xtype: 'mobile-customerInfo', data: record.data, fromOffRoute: fromOffRoute });
		var assetStore = this.getCoolerPanel().getComponent('assetDetailList').getStore();
		assetStore.getProxy().setExtraParam('LocationId', record.get('LocationId'));//record.getRecord().get('LocationId'));
		assetStore.getProxy().setExtraParam('AsArray', 0);
		assetStore.load();
	},
	serachLocation: function (params) {
		var visitPanel = this.getVisitPanel();
		var visitTab = visitPanel.down('#visitTabPanel');
		var activeItem = visitTab.getActiveItem();
		var store = activeItem.getStore();
		store.getProxy().setExtraParams(params);
		store.load();
	},
	show: function (file) {
		var view = this.getMainNavigationView();
		if (typeof file === 'object')
			view.push(file);
		else
			view.push({ xtype: file });
	}

});