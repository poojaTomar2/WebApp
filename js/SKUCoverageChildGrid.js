Cooler.SKUCoverageChildGrid = Ext.extend(Cooler.Form, {
	controller: 'SKUCoverage',
	listTitle: 'SKU Coverage',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'SKUCoverage',
	constructor: function (config) {
		Cooler.SKUCoverageChildGrid.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'ClientId' } }
		});
	},

	hybridConfig: function () {
		return [
			{ dataIndex: "ClientId", type: 'int' },
			{ header: "Id", type: 'int', dataIndex: 'ProductId' },
			{ header: "Product", type: 'string', dataIndex: 'ProductName' },
			{ header: "SKU", type: 'string', dataIndex: 'ProductSKU' },
			{ header: "Brand", type: 'string', dataIndex: 'BrandName' },
			{ header: "Flavour", type: 'string', dataIndex: 'FlavourName' },
			{ header: "Package", type: 'string', dataIndex: 'PackageType' },
			{ header: "Size", type: 'string', dataIndex: 'PackageSize' },
			{ header: "# Of Facing", type: 'int', dataIndex: 'FacingCount' },
		];
	},
});

Cooler.SKUCoverageChildGrid = new Cooler.SKUCoverageChildGrid({ uniqueId: 'SKUCoverageChildGrid' });