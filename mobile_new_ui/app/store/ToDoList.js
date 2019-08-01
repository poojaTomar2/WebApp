Ext.define('CoolerIoTMobile.store.ToDoList', {
	extend: 'Ext.data.Store',
	config: {
		//autoLoad: true,
		model: 'CoolerIoTMobile.model.AlertAction',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('AlertAction', true),
			enablePagingParams: false,
			extraParams: {
				action: 'list',
				asArray: 0,
				limit: 0,
				todo: true,
				sort: 'Date'
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});