Cooler.AssetPurityAccuracy = Ext.extend(Cooler.Form, {
	controller: 'AssetPurityAccuracy',
	listTitle: 'Monthly Accuracy',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'MonthlyAccuracy',
	gridConfig: {
		autoFilter: { quickFilter: false },
		autoFilter: false
	},
	constructor: function (config) {
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetPurityMonth' } }
		});
		config.gridConfig = this.gridConfig;
		Cooler.AssetPurityAccuracy.superclass.constructor.call(this, config || {});
	},

	hybridConfig: function () {
		return [
			{ header: "Month", type: 'string', align: 'right', dataIndex: 'AssetPurityMonthName', sortable: false, menuDisabled: true },
			{ type: 'int', dataIndex: 'AssetPurityMonth' },
			{ header: "# Images", type: 'int', align: 'right', dataIndex: 'ImageCount', sortable: false, menuDisabled: true },

			{ header: "# Self Check", type: 'int', align: 'right', dataIndex: 'ManualPurityStatusCount', sortable: false, menuDisabled: true },
			{ header: "# Client Check", type: 'int', align: 'right', dataIndex: 'ClientPurityStatusCount', sortable: false, menuDisabled: true },

			{ header: "# RealTime Processing Image", type: 'int', align: 'right', dataIndex: 'RealTimeImageCount', sortable: false, menuDisabled: true },

			{ header: "Avg Response time (second)", type: 'int', align: 'right', dataIndex: 'AVGResponseTime', sortable: false, menuDisabled: true },
			{ header: "# Images, Less then Response time SLA", type: 'int', align: 'right', dataIndex: 'CountLessThenSLA', sortable: false, menuDisabled: true },
			{ header: "# Images, With in SLA + 10 sec", type: 'int', align: 'right', dataIndex: 'CountLessThenSLA10', sortable: false, menuDisabled: true },
			{ header: "# Images, More then SLA + 10 Sec", type: 'int', align: 'right', dataIndex: 'CountGreaterThenSLA10', sortable: false, menuDisabled: true },

			{ header: "Product Accuracy", type: 'string', align: 'right', dataIndex: 'BrandAccuracy', sortable: false, menuDisabled: true },
			{ header: "SKU Accuracy", align: 'right', type: 'string', dataIndex: 'SKUAccuracy', sortable: false, menuDisabled: true }
		];
	},
	configureListTab: function (config) {
		var grid = this.grid;
		this.grid.region = 'center';
		var assetPurityAccuracyChildGrid = Cooler.AssetPurityAccuracyChild.createGrid({ header: false, IsChildGrid: true });
		assetPurityAccuracyChildGrid.on('rowdblclick', this.showQualityCheckScreen, this);
		this.assetPurityAccuracyChildGrid = assetPurityAccuracyChildGrid;
		var childTabPanel = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			id: 'assetPurityAccuracyChildTab',
			items: [assetPurityAccuracyChildGrid],
			height: 250,
			split: true
		});
		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [grid, childTabPanel]
		});
	},
	loadAssetPurityChildGrid: function () {
		var selectionModel = this.grid.getSelectionModel();
		if (selectionModel) {
			var selectedRecord = selectionModel.getSelected();
			if (selectedRecord) {
				var selectedMonth = selectedRecord.get('AssetPurityMonth');
				var assetPurityAccuracyChildGridStore = this.assetPurityAccuracyChildGrid.getStore();
				if (assetPurityAccuracyChildGridStore) {
					var dateFilters = this.getDateFilterValue(selectedMonth, 'month');
					assetPurityAccuracyChildGridStore.baseParams.IsChildGrid = true;
					assetPurityAccuracyChildGridStore.baseParams.selectedMonth = selectedMonth;
					assetPurityAccuracyChildGridStore.baseParams.PurityDateTimeFrom = dateFilters.PurityDateTimeFrom;
					assetPurityAccuracyChildGridStore.baseParams.PurityDateTimeTo = dateFilters.PurityDateTimeTo;
					assetPurityAccuracyChildGridStore.load();
				}
			}
		}
	},
	onGridCreated: function (grid) {
		grid.on('rowdblclick', this.showQualityCheckScreen, this);
		grid.on('rowclick', this.loadAssetPurityChildGrid, this);
		var date = new Date();
		var currentYear = date.getFullYear();
		this.selectedYear = currentYear;
		if (grid.store && grid.store.baseParams) {
			var storebaseParams = grid.store.baseParams;
			if (!storebaseParams.PurityDateTimeFrom) {
				var gridStore = grid.store;
				var dateFilters = this.getDateFilterValue(currentYear)
				gridStore.baseParams.PurityDateTimeFrom = dateFilters.PurityDateTimeFrom;
				gridStore.baseParams.PurityDateTimeTo = dateFilters.PurityDateTimeTo;
				gridStore.baseParams.ImageTypeId = -1;
				gridStore.baseParams.selectedMonth = 0;
			}
		}

		// To do need to load Years 
		var last5YearCombo = [];
		var previous5YearValue = currentYear - 5;
		for (var i = previous5YearValue; i <= currentYear; i++) {
			last5YearCombo.push([i, i]);
		}
		var selectedYearField = DA.combo.create({ store: last5YearCombo, width: 100, mode: 'local', value: currentYear, itemId: 'selectedYearCombo' });
		grid.getTopToolbar().push('|');
		grid.getTopToolbar().push('Year : ');
		grid.getTopToolbar().push(selectedYearField);
		selectedYearField.on('change', this.reloadGridStore, this);
		grid.getTopToolbar().push('|');
		grid.getTopToolbar().push('Image Type : ');
		var imageTypeCombo = DA.combo.create({ store: [[-1, 'All'], [2, 'Training'], [1, 'Production']], itemId: 'imageTypeCombo', width: 100, mode: 'local', value: -1 });
		grid.getTopToolbar().push(imageTypeCombo);
		imageTypeCombo.on('change', this.reloadGridStore, this);
		this.selectedYearField = selectedYearField;
	},
	reloadGridStore: function (combo, value) {
		var gridStore = this.grid.getStore();
		if (gridStore) {
			if (combo.itemId == 'selectedYearCombo') {
				var dateFilters = this.getDateFilterValue(value);
				gridStore.baseParams.PurityDateTimeFrom = dateFilters.PurityDateTimeFrom;
				gridStore.baseParams.PurityDateTimeTo = dateFilters.PurityDateTimeTo;
				this.selectedYear = value;
			}
			if (combo.itemId == 'imageTypeCombo') {
				gridStore.baseParams.ImageTypeId = value;
			}
			gridStore.load();
			
			this.assetPurityAccuracyChildGrid.store.removeAll();
		}
	},
	getDateFilterValue: function (value, dateType) {
		var dateFilters = {};
		var selectedFromDate = new Date();
		var selectedEndDate = new Date();
		switch (dateType) {
			case "year":
				selectedFromDate = new Date(value, 0);
				selectedEndDate = new Date(value + 1, 0);
				break;
			case "month":
				// First date of Month , Removing 1 as Javascript index start from 0 for months
				selectedFromDate = new Date(this.selectedYear, value - 1, 1);
				// Last Date of Month
				selectedEndDate = new Date(this.selectedYear, value, 1);
				break;
			case "day":
				var dateValue = value.setHours(0, 0, 0, 0);
				selectedFromDate = value;
				selectedEndDate = value.addDays(1);
				break;
			default:
				selectedFromDate = new Date(value, 0);
				selectedEndDate = new Date(value + 1, 0);
				break;
		}
		dateFilters = {
			PurityDateTimeFrom: selectedFromDate,
			PurityDateTimeTo: selectedEndDate
		}
		return dateFilters;
	},
	showQualityCheckScreen: function (grid, rowIndex, e) {
		var selectionModel = grid.getSelectionModel();
		if (selectionModel) {
			var selectedRecord = selectionModel.getSelected();
			if (selectedRecord) {
				var selectedMonth = selectedRecord.get('AssetPurityMonth');
				var selectedDateFilter = this.getDateFilterValue(selectedMonth, 'month');
				if (grid.IsChildGrid) {
					var selectedDate = selectedRecord.get('PurityDateTime');
					selectedDateFilter = this.getDateFilterValue(selectedDate, 'day');
				}

				Cooler.CoolerImageIRVsClientManual.ShowList({},
					{
						extraParams: {
							fromWeb: true,
							fromBackOfficeWithProcessType: 1,
							selectedMonth: selectedMonth,
							PurityDateTimeFrom: selectedDateFilter.PurityDateTimeFrom,
							PurityDateTimeTo: selectedDateFilter.PurityDateTimeTo
						}
					});
			}
		}
	}
});
Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}
Cooler.AssetPurityAccuracy = new Cooler.AssetPurityAccuracy({ uniqueId: 'AssetPurityAccuracy' });