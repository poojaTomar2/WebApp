Cooler.EddystonePromotionHistory = Ext.extend(Cooler.Form, {

	controller: 'EddystonePromotionHistory',

	title: 'Eddystone Promotion History',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'EddystonePromotionHistory',
	constructor: function (config) {
		Cooler.EddystonePromotionHistory.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'EddystoneUrlNotificationId' } }
		});
	},

	hybridConfig: function () {
		return [

					{ header: 'Id', type: 'int', dataIndex: 'EddystoneUrlNotificationId' },
					{ dataIndex: 'SmartDeviceId', type: 'int', width: 150 },
                    { header: 'Smart Device Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
                    { header: 'Outlet Code', dataIndex: 'OutletCode', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
					{ header: 'Outlet', dataIndex: 'OutletName', type: 'string', width: 150 },
					{ header: 'Eddystone Promotion Id', dataIndex: 'EddystonePromotionId', type: 'int', width: 150 },
					{ header: 'Eddystone Promotion LocationId', dataIndex: 'EddystonePromotionLocationId', type: 'int', width: 150 },
					{ header: 'Data', dataIndex: 'Data', type: 'string', width: 150 },
					{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
					{ header: 'Platform', dataIndex: 'Platform', type: 'string', width: 150 },
					{ header: 'Message To App', dataIndex: 'MessageToApp', type: 'string', width: 150 },
					{ header: 'Promo Code', dataIndex: 'PromoCode', type: 'string', width: 150 },
					{ header: 'CoolerIot Client', type: 'string', dataIndex: 'ClientName', width: 150 },
					{ header: 'Application UDID', type: 'string', dataIndex: 'AppUuid', width: 150 },
					{ header: 'City', type: 'string', dataIndex: 'City', width: 150 },
					{ header: 'Trade Channel', dataIndex: 'TradeChannel', width: 120, type: 'string' },
					{ header: 'Trade Channel Code', hidden: true, dataIndex: 'TradeChannelCode', width: 120, type: 'string' },
					{ header: 'Customer Tier', dataIndex: 'CustomerTier', width: 120, type: 'string' },
					{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' }

		];
	}
});
Cooler.EddystonePromotionHistory = new Cooler.EddystonePromotionHistory({ uniqueId: 'EddystonePromotionHistory' });