Ext.define('CoolerIoTMobile.controller.CustomerInfo', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			customerInfo: 'mobile-customerInfo',
			mainNavigationView: 'mobile-main #mainNavigationView',
			customerDetails: 'mobile-customerInfo #customerDetails'
		},
		control: {
			'main-navigation': {
				itemsingletap: 'onCustomerInfoNavigation'
			},
			'mobile-customerInfo image': {
				tap: 'onImage'
			},
			'mobile-customerInfo #customerInfoMap': {
				maprender: 'onCustomerInfoMapRenderer'
			},
			'mobile-customerInfo #assetDetailList': {
				itemsingletap: 'onAssetListTap'
			}
		}
	},
	onCustomerInfoNavigation: function (dataview, index, target, record) {
		
		menuId = record.get('itemId');
		if (menuId) {
			switch (menuId) {
				case "addtoRoute":
					this.onAddToRoute();
					break;
				case "inStore":
					this.onStoreTap();
					break;
				case "phoneOrder":
					this.onPhoneOrderTap();
					break;
				default:
					break;
			}
		}
	},
	onImage: function () {
		this.show('mobile-coolerSummary');
	},
	onStoreTap: function () {
		var view = this.getMainNavigationView();
		view.push({ xtype: 'mobile-taskList' });
	},
	onPhoneOrderTap: function () {
		Ext.Msg.alert('Info', 'Task added in To do list');
	},
	onAddToRoute: function () {
		var customerInfo = this.getCustomerInfo();
		var customerData = customerInfo.getData();
		console.log(customerData.LocationId);
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Saving..' });
		Ext.Ajax.request({
			url: Df.App.getController('Location'),
			params: {
				LocationId: customerData.LocationId,
				action: 'other',
				otherAction: 'AddToRoute'
			},
			success: function (response) {
				Ext.Viewport.setMasked(false);
				var data = Ext.decode(response.responseText);
				Ext.Msg.alert('Alert', data.info);
			},
			failure: function () {
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Error', 'Some error occured.');
			},
			scope: this
		});
	},
	onAssetListTap: function (list, index, target, record) {
		this.loadAssetDetail(record.get('AssetId'));
	},
	loadAssetDetail: function (assetId) {
		//var assetDetailStore = Ext.getStore('AssetDetail');
		//assetDetailStore.getProxy().setExtraParam('Id', assetId);
		//assetDetailStore.load();
		Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'loading detail..' });
		Ext.Ajax.request({
			url: Df.App.getController('AssetInfo'),
			params: {
				action: 'load',
				Id: assetId
			},
			success: function (response, config) {
				this.onAssetDetailStoreLoad(response);
			},
			failure: function () {
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Error', 'Some error occured.');
			},
			scope: this
		});
		//assetDetailStore.on('load', this.onAssetDetailStoreLoad, assetDetailStore);
	},
	onCustomerInfoMapRenderer: function (comp, map) {
		var data = this.getCustomerDetails().up().getData(),
			position = new google.maps.LatLng(data.Latitude, data.Longitude);
		this.mapOptions = {
			zoom: 6,
			center: position,
			icon: 'resources/icons/Marker/red.png'
		};
		var marker = new google.maps.Marker({
			position: position,
			map: map
		});
		setTimeout(function () {
			map.panTo(position);
		}, 1000);
	},
	onAssetDetailStoreLoad: function (response) {
		var data = Ext.decode(response.responseText).data;
		var navigationView = Ext.ComponentQuery.query('#mainNavigationView')[0];
		navigationView.push({ xtype: 'mobile-coolerSummary', data: data });
		Ext.Viewport.setMasked(false);
	}
});