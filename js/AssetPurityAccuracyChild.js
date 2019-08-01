Cooler.AssetPurityAccuracyChild = Ext.extend(Cooler.Form, {
	controller: 'AssetPurityAccuracy',
	listTitle: 'Daily Accuracy',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'MonthlyAccuracy',
	gridConfig: {
		autoFilter: { quickFilter: false },
		autoFilter: false
	},
	constructor: function (config) {
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetPurityDay' } }
		});
		config.gridConfig = this.gridConfig;
		Cooler.AssetPurityAccuracyChild.superclass.constructor.call(this, config || {});
	},
	
	hybridConfig: function () {
		return [
			{ header: "Day", type: 'date', dataIndex: 'PurityDateTime', width: 150, renderer: ExtHelper.renderer.Date, sortable: false, menuDisabled: true },
			{ header: "# Images", type: 'int', align: 'right', dataIndex: 'ImageCount', sortable: false, menuDisabled: true },
			//{ type: 'date', dataIndex: 'PurityDateTime' },

			{ header: "# Self Check", type: 'int', align: 'right', dataIndex: 'ManualPurityStatusCount', sortable: false, menuDisabled: true},
			{ header: "# Client Check", type: 'int', align: 'right', dataIndex: 'ClientPurityStatusCount', sortable: false, menuDisabled: true },

			{ header: "# RealTime Processing Image", type: 'int', align: 'right', dataIndex: 'RealTimeImageCount', sortable: false, menuDisabled: true },

			{ header: "Avg Response time (second)", type: 'int', align: 'right', dataIndex: 'AVGResponseTime', sortable: false, menuDisabled: true },
			{ header: "# Images, Less then Response time SLA", type: 'int', align: 'right', dataIndex: 'CountLessThenSLA', sortable: false, menuDisabled: true },
			{ header: "# Images, With in SLA + 10 sec", type: 'int', align: 'right', dataIndex: 'CountLessThenSLA10', sortable: false, menuDisabled: true },
			{ header: "# Images, More then SLA + 10 Sec", type: 'int', align: 'right', dataIndex: 'CountGreaterThenSLA10', sortable: false, menuDisabled: true },

			{ header: "Product Accuracy", type: 'string', align: 'right', dataIndex: 'BrandAccuracy', sortable: false, menuDisabled: true },
			{ header: "SKU Accuracy", align: 'right', type: 'string', dataIndex: 'SKUAccuracy', sortable: false, menuDisabled: true }
		];
	}
});
Cooler.AssetPurityAccuracyChild = new Cooler.AssetPurityAccuracyChild({ uniqueId: 'AssetPurityAccuracyChild' });