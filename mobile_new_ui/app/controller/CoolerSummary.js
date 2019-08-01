Ext.define('CoolerIoTMobile.controller.CoolerSummary', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			'assetList': 'mobile-assetList',
			'searchbox': 'mobile-assets #searchAssetField',
			'coolerSummaryPanel': 'mobile-coolerSummary',
			'productdistributionChartPlanogram': 'mobile-coolerSummary #product-distribution-chart-planogram',
			'productdistributionChartFacing': 'mobile-coolerSummary #product-distribution-chart-facing'
		},
		control: {
			'assetList': {
				itemsingletap: 'onAssetListClick'
			},
			'mobile-assets #searchAssetField': {
				keyup: 'onLocationSearch',
				clearicontap: 'onLocationSearch'
			},
			'mobile-assets #issueType': {
				change: 'onIssueChange'
			},
			'mobile-coolerSummary #coolerMovementMap': {
				maprender: 'onMovementInfoMapRenderer'
			},
			'viewport': {
				orientationchange: 'onOrientationChange'
			}
		}
	},

	onMovementInfoMapRenderer: function (comp, map) {
		var coolerPanel = this.getCoolerSummaryPanel(),
			coolerRecord = coolerPanel.getData(),
			smartDeviceId = coolerRecord.SmartDeviceId,
			store = Ext.getStore(Ext.getStore('SmartDeviceMovement'));
		storeProxy = store.getProxy();
		storeProxy.setExtraParams({ action: 'list', limit: 25, AsArray: 0, SmartDeviceId: smartDeviceId, sort: 'SmartDeviceMovementId', dir: 'DESC' });
		var bounds = new google.maps.LatLngBounds(),
		position = null, marker = null, data = null, routePoints = [];
		var lineSymbol = {
			path: 'M 0,-1 0,1',
			strokeOpacity: 1,
			strokeColor: "#FF0000",
			scale: 4
		};
		position = new google.maps.LatLng(coolerRecord.Latitude, coolerRecord.Longitude);
		bounds.extend(position);
		this.mapOptions = {
			zoom: 6,
			center: position,
			icon: 'resources/icons/Marker/red.png'
		};
		marker = new google.maps.Marker({
			position: position,
			map: map
		});
		store.load({
			callback: function (records, operation, success) {
				for (var i = 0, len = records.length ; i < len; i++) {
					data = records[i].data;
					position = new google.maps.LatLng(data.Latitude, data.Longitude);
					bounds.extend(position);
					marker = new google.maps.Marker(
					{
						position: position,
						map: map
					});
					routePoints.push(new google.maps.LatLng(data.Latitude, data.Longitude));
				}
				var route = new google.maps.Polyline({
					path: routePoints,
					icons: [{
						icon: lineSymbol,
						offset: '0',
						repeat: '20px'
					}],
					strokeOpacity: 0,
					strokeWeight: 2
				});
				route.setMap(map);
				var center = bounds.getCenter();
				setTimeout(function () {
					map.panTo(center);
				}, 1000);
			},
			scope: this
		});
	},
	onOrientationChange: function (viewport, orientation, width, height) {
		var facing = this.getProductdistributionChartFacing();
		var planogram = this.getProductdistributionChartPlanogram();
		if (facing && facing.chartId || planogram && planogram.chartId) {
			planogram.chartId.render();
			facing.chartId.render();
		}
	},
	onAssetListClick: function (list, index, target, record) {
		this.getApplication().getController('Dashboard').loadAssetDetail(record.get('AssetId'), 'AssetInfo', record);
	},
	onLocationSearch: function () {
		if (!this.searchTask) {
			this.searchTask = new Ext.util.DelayedTask(this.doLocationSearch, this);
		}
		this.searchTask.delay(500);
	},
	doLocationSearch: function () {
		var value = this.getSearchbox().getValue();
		var assetList = this.getAssetList();
		var store = assetList.getStore();
		assetList.setLoadingText("");
		store.getProxy().setExtraParam('SerialNumber', '%' + value);
		store.load();
	},
	onIssueChange: function (selectfield, newValue, oldValue, eOpts) {
		if (newValue !== oldValue) {
			var assetList = this.getAssetList();
			var store = assetList.getStore();
			assetList.setLoadingText("");
			store.getProxy().setExtraParam('IssueType', newValue);
			store.load();
		}
	}
});
