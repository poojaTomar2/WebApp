Ext.define('CoolerIoTMobile.store.Order', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.Order',
		proxy: {
			type: 'ajax',
			url: CoolerIoTMobile.util.Renderers.consumerApiUrl('consumer/order/list'),
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});