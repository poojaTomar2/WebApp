Cooler.RDCustomerMapping = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.RDCustomerMapping.superclass.constructor.call(this, config);
	},
	controller: 'RDCustomerMapping',
	keyColumn: 'RDCustomerId',
	listTitle: 'RD Customer Mapping',
	disableAdd: true,
	disableDelete: true,
	allowExport: true,
	securityModule: 'RDCustomerMapping',


	hybridConfig: function () {

		return [
			{ header: 'Id', dataIndex: 'RDCustomerId', width: 50, type: 'int' },
			{ header: 'RDCustomer Name', type: 'string', dataIndex: 'RDCustomerName', width: 120 },
			{ header: 'RDCustomer Code', type: 'string', dataIndex: 'RDCustomerCode', width: 130 },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 150 },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', type: 'int', width: 120 },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'TradeChannelName', width: 150 },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'TradeChannelCode', type: 'int', width: 130 },
			{ header: 'Sub Trade Channel', type: 'string', dataIndex: 'SubTradeChannelTypeName', width: 130 },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelCode', type: 'int', width: 120 },
			{ header: 'CPL Name', dataIndex: 'CPLName', type: 'string', width: 150 },
			{ header: 'CPL Code', dataIndex: 'CPLCode', type: 'string', hidden: true, width: 150 }

		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	}


});
Cooler.RDCustomerMapping = new Cooler.RDCustomerMapping({ uniqueId: 'RDCustomerMapping' });