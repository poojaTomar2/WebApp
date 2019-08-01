Ext.define('CoolerIoTMobile.controller.ToDoList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			mainNavigationView: 'mobile-main #mainNavigationView',
			coolerPanel: 'mobile-customerInfo #coolerPanel',
			toDoList: 'mobile-toDoList',
			searchbox: 'mobile-customer #searcNameField',
			alertaction: 'mobile-alertaction-win'
		},
		control: {
			'toDoList': {
				itemsingletap: 'onToDoList'
			}
		}
	},
	onToDoList: function (grid, index, target, record, e, eopts) {
		CoolerIoTMobile.Util.showActionUpdateWindow(false, false, record);
	}
});