Ext.define('CoolerIoTMobile.store.AssetList', {
    extend: 'Df.data.Store',
    config: {
        model: 'CoolerIoTMobile.model.AssetList',
        groupTpl: new Ext.XTemplate('<div class="asset-item-header">',
							'<div class="header-text sub-header-text asset-location-wrap">{Location}</div>',
							'<div class="header-text header-text-r asset-serialno-wrap">{SerialNumber}</div>',
							'<div class="cooleriot-icon header-text-r"><tpl if="CoolerIoTMobile.util.Renderers.alertCount(values.Alerts) == false"><span class="cooler-icon-small"></span></tpl><tpl if="CoolerIoTMobile.util.Renderers.alertCount(values.Alerts) == true""><span class="cooler-icon-small-alert"></span></tpl></div>',
                            '</div>'),
        grouper: {
            sortProperty: "AssetId",
            direction: "ASC",
            groupFn: function (record) {
                return record.data.SerialNumber;
            }
        },
        proxy: {
            enablePagingParams: true,
            reader: {
                type: 'json',
                rootProperty: 'records',
                totalProperty: 'recordCount'
            }
        },
        pageSize: 25
    }
});
