Cooler.VendingMachineData = new Cooler.Form({

	controller: 'VendingMachineData',

	keyColumn: 'VendingMachineDataId',

	title: 'Vending Machine Data',

	disableAdd: true,

	disableDelete: true,

	securityModule: 'VendingMachineData',

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'VendingMachineDataId' } }
	},

	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'VendingMachineDataId' },
			{ header: 'Serial Number', dataIndex: 'SerialNumber', type: 'int', align: 'right'  },
			{ header: 'Event Time', dataIndex: 'EventTime', type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer, width: 130 },
			{ header: 'Number Of Paid Product Vended Since Initialization', dataIndex: 'NumberOfPaidProductVendedSinceInitialization', type: 'int', align: 'right'  },
			{ header: 'Value Of Paid Product Sales SinceInitialization', dataIndex: 'ValueOfPaidProductSalesSinceInitialization', type: 'int', align: 'right'  },
			{ header: 'Number Of Paid Product Vended Since Last Reset', dataIndex: 'NumberOfPaidProductVendedSinceLastReset', type: 'int', align: 'right'  },
			{ header: 'Value Of Paid Product Sale Since Last Reset', dataIndex: 'ValueOfPaidProductSaleSinceLastReset', type: 'int', align: 'right'  },
			{ header: 'Value Of All Paid Vend Since Initialization', dataIndex: 'ValueOfAllPaidVendSinceInitialization', type: 'int', align: 'right'  },
			{ header: 'Number Of All Paid Vend Since Initialization', dataIndex: 'NumberOfAllPaidVendSinceInitialization', type: 'int', align: 'right'  },
			{ header: 'Value Of All Paid Sale Since Last Reset', dataIndex: 'ValueOfAllPaidSaleSinceLastReset', type: 'int', align: 'right'  },
			{ header: 'Number Of All Paid Vend Since Last Reset', dataIndex: 'NumberOfAllPaidVendSinceLastReset', type: 'int', align: 'right'  },
			{ header: 'Value Of Cash In Since Last Reset', dataIndex: 'ValueOfCashInSinceLastReset', type: 'int', align: 'right'  },
			{ header: 'Value Of Cash Sale Since Initialization', dataIndex: 'ValueOfCashSaleSinceInitialization', type: 'int', align: 'right'  },
			{ header: 'Product Identifier', dataIndex: 'ProductIdentifier', type: 'int', align: 'right'  },
			{ header: 'Product Price', dataIndex: 'ProductPrice', type: 'int', align: 'right'  },
			{ header: 'CRC', dataIndex: 'CRC', type: 'int', align: 'right'  },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer }
		];
	}
});