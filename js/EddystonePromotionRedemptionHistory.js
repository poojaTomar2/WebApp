Cooler.EddystonePromotionRedemptionHistory = Ext.extend(Cooler.Form, {

	controller: 'EddystonePromotionRedemptionHistory',

	title: 'Eddystone Promotion Redemption',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'EddystonePromotionRedemption',
	constructor: function (config) {
		Cooler.EddystonePromotionRedemptionHistory.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'EddystonePromotionRedemptionId' } }
		});
	},

	hybridConfig: function () {
		return [
            { header: 'Id', type: 'int', dataIndex: 'EddystonePromotionRedemptionId' },
			{ header: 'Eddystone Promotion Id', dataIndex: 'EddystonePromotionId', type: 'int', width: 150 },
            { header: 'BarCode Id', type: 'string', dataIndex: 'BarCodeId', width: 150 },
			{ header: 'Title', dataIndex: 'Title', type: 'string' },
			{ header: 'Outlet', dataIndex: 'LocationName', type: 'string', width: 150 },
            { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 100 },
			{ header: 'CoolerIot Client', type: 'string', dataIndex: 'ClientName', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }

		];
	}
});
Cooler.EddystonePromotionRedemptionHistory = new Cooler.EddystonePromotionRedemptionHistory({ uniqueId: 'EddystonePromotionRedemptionHistory' });