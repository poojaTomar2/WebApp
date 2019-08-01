Ext.define('CoolerIoTMobile.controller.TabletDashboard', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			'tabletMainView': 'tablet-main',
			'pieChart': 'tablet-dashboard #openAlertPieChart',
			'mapView': 'tablet-main #tablet-map',
			'chartContainer': 'tablet-main #chartContainer',
			'outLetPurity': 'tablet-main #outletPurityChart',
			'coolerContainer': 'tablet-main #coolerContainer',
			'myTeam': 'tablet-MyTeam',
			'lowestOutletPurity': 'tablet-main #lowestOutletPurityChart',
			'coachingContainer': 'tablet-main #coachingContainer',
			'myLibrary': 'tablet-main #myLibraryGrid',
			'alertList': 'alert-list',
			'alertCombo': 'tablet-toolbar #alertCombo',
			'todoList': 'tablet-main #todoList',
			'syncContainer': 'tablet-main #syncContainer',
			'mapContainer': 'tablet-mapPanel #map-container'
		},
		control: {
			'tablet-main': {
				activeitemchange: 'onitemTap'
			},
			'tablet-dashboard #navigation-list': {
				itemsingletap: 'onListItemTap'
			},
			'tablet-dashboard #alertCombo': {
				change: 'onAlertComboChange'
			},
			'tablet-dashboard': {
				show: 'onTabletDashboardShow'
			},
			'coaching-toolbar #salesRepCombo': {
				change: 'onSalesRepComboChange'
			},
			'coaching-toolbar #fromDateField': {
				change: 'onFromDateField'
			},
			'coaching-toolbar #numberOfStores': {
				change: 'onStoreComboChange'
			},
			'tablet-mapPanel #mapSalesRepCombo': {
				change: 'onMapSalesRepChange'
			}
		}
	},
	onMapSalesRepChange: function (field, newValue, oldValue, eOpts) {
		var store = Ext.getStore('LocationWithIssues');
		var storeProxy = Ext.getStore('LocationWithIssues').getProxy();
		storeProxy.setExtraParam('salesRepId', newValue);
		store.load({
			callback: function () {
				this.getMapContainer().setMapMarkers();
			},
			scope: this
		});
	},
	onStoreComboChange: function (field, newValue, oldValue, eOpts) {
		this.loadMultiSeriesLineChart(this.salesRepId, this.fromDate, newValue);
	},
	onFromDateField: function (field, value, eOpts) {
		this.loadMultiSeriesLineChart(this.salesRepId, value, this.stores);
	},
	onSalesRepComboChange: function (field, newValue, oldValue, eOpts) {
		this.loadMultiSeriesLineChart(newValue, this.fromDate, this.stores);
	},

	onTabletDashboardShow: function (container) {
		var navigationList = container.down('#navigation-list'),
			myTeamStore = Ext.getStore('SalesRepIssue');
		navigationList.selectRange(1, 1, false);
		myTeamStore.load();
		var store = Ext.getStore('LocationWithIssues');
		store.load();
	},

	onAlertComboChange: function (field, newValue, oldValue, eOpts) {
		var pieChart = getChartFromId('openAlertPieChart'),
			view = this.getTabletMainView();
		if (pieChart && view.getActiveItem().getItemId() == 'chartContainer') {
			var chart = this.getPieChart();
			chart.setExtraParams({ alertTypeId: newValue });
			chart.refresh();
		}

		if (view.getActiveItem().getItemId() == 'salesRepListItem') {
			var store = Ext.getStore('SalesRepIssue');
			if (store.getCount() === 0) store.load();
			var storeProxy = store.getProxy()
			storeProxy.setExtraParams({
				alertTypeId: newValue
			});
			store.load();
		}
	},

	getDetailChartLink: function (options) {
		//var params = Ext.apply(options.params, this.getBaseParams(), this.getExtraParams());
		return 'javascript:CoolerIoTMobile.Util.showDetail()';
	},

	onitemTap: function (panel, value, oldValue, eOpts) {
		var currentItem = value;
		if (currentItem && currentItem.getItemId() === 'outletPurityChart') {
			currentItem.setData([]);
		}
	},
	loadMultiSeriesLineChart: function (salesRepId, fromDate, stores) {
		this.salesRepId = salesRepId;
		this.fromDate = fromDate;
		this.stores = stores; // number of stores
		//TODO: Temporary
		Ext.Ajax.request({
			url: Df.App.getController('LowestOutletPurityChartData'),
			params: {
				salesRepId: this.salesRepId,
				fromDate: this.fromDate,
				stores: this.stores,
				fromSupervisor: true
			},
			scope: this,
			success: function (response, opts) {
				var obj = Ext.decode(response.responseText);
				var msData = CoolerIoTMobile.UtilChart.createMultiSeriesBySum({
					data: obj.records,
					categoryField: 'Date',
					seriesIdField: 'LocationId',
					seriesNameField: 'Location',
					valueField: 'AvgPurity'
				});

				var component = this.getCoachingContainer();
				var chart = component.down("df-fusionchart");
				if (chart.chart)
					chart.chart.setChartData(msData, "json");
			},
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		});
	},

	loadCoolerSummary: function () {
		Ext.Ajax.request({
			url: Df.App.getController('AssetSummaryBySupervisor'),
			scope: this,
			success: function (response, opts) {
				var obj = Ext.decode(response.responseText);

				var msData = CoolerIoTMobile.UtilChart.createMultiSeries({
					data: obj.records,
					categoryField: 'UserId',
					categoryNameFn: function (values, category) {
						return values.FirstName + ' ' + values.LastName;
					},
					seriesDetails: [
						{ field: 'LowStock', label: 'Low Stock' },
						{ field: 'Moved', label: 'Moved' },
						{ field: 'Impure', label: 'Impure' },
						{ field: 'Missing', label: 'Missing' },
						{ field: 'Unhealthy', label: 'Unhealthy' }
					]
				});

				var coolerComponent = this.getCoolerContainer();
				var chart = coolerComponent.down("df-fusionchart");
				chart.chart.setChartData(msData, "json");
			},
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		});

	},

	onListItemTap: function (view, index, target, record, e, eOpts) {
		var title = record.get('title');
		switch (title) {
			case 'My Territory':
				//This is for remove duplicate elemanet which is having same id.
				var mapCmp = Ext.ComponentQuery.query('tablet-mapPanel')[0];
				if (mapCmp) {
					mapCmp.destroy();
				}
				this.getTabletMainView().setActiveItem({
					xtype: 'tablet-mapPanel',
					itemId: 'tablet-map'
				});
				break;
			case 'My Team':
				this.getTabletMainView().setActiveItem(this.getMyTeam());
				break;
			case 'Dashboard':
				this.getTabletMainView().setActiveItem(this.getChartContainer());
				break;
			case 'Coolers':
				var coolers = this.getCoolerContainer();
				this.getTabletMainView().setActiveItem(coolers);
				this.loadCoolerSummary();
				break;
			case 'Targets':
				//TODO: Move to correct place
				this.getTabletMainView().setActiveItem(this.getCoachingContainer());
				this.loadMultiSeriesLineChart();
				break;
			case 'My Library':
				this.getTabletMainView().setActiveItem(this.getMyLibrary());
				break;
			case 'My Task':
				var todoList = this.getTodoList();
				this.getTabletMainView().setActiveItem(todoList);
				todoList.down("grid").getStore().load();
				break;
			case 'Logout':
				this.getApplication().getController('Login').logout();
				break;
			case 'Sync':
				this.getTabletMainView().setActiveItem(this.getSyncContainer());
				break;
			default:
				CoolerIoTMobile.Util.functionalityNotImplemented();
				break;
		}
	}
});