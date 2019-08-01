Cooler.ClientBaseMenu = new Cooler.Form({
	formTitle: 'ClientBaseMenu: {0}',
	keyColumn: 'MenuId',
	controller: 'ClientBaseMenu',
	captionColumn: 'Country',
	title: 'Menu',
	securityModule: 'Menu',
	disableAdd: true,
	disableDelete: true,
	gridConfig: {
		defaults: { sort: { dir: 'ASC', sort: 'Caption' } }
	},
	hybridConfig: function () {
		return [

            { type: 'int', dataIndex: 'MenuId' },
			{ header: 'Menu', dataIndex: 'Caption', type: 'string', width: 150 },
			{ header: 'Module', dataIndex: 'DisplayName', type: 'string', width: 250 },
			{ header: 'Permission', type: 'string', dataIndex: 'ClientName', width: 150 },


		];
	},
	createForm: function (config) {
		var responsibleforClientIdForStore = DA.combo.create({ baseParams: { comboType: 'ClientForMenu', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforClientIdForStore = responsibleforClientIdForStore;
		var responsibleforClientIdCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Permission',
			hiddenName: 'ClientIds',
			name: 'ClientIds',
			displayField: 'DisplayValue',
			store: responsibleforClientIdForStore.getStore(),
			width: 200,
			height: 100
		});
		this.responsibleforClientIdCombo = responsibleforClientIdCombo;

		//var clientText = new Ext.form.TextField({
		//	fieldLabel: 'Search',
		//	width: 180,
		//	xtype: 'textfield',
		//	emptyText: 'Search ...',
		//	enableKeyEvents: true,
		//	hidden: true,
		//});
		//clientText.on('keyup', this.onclientSearchDataKeyUp, this);
		//this.smartDeviceText = clientText;

		var col1 = {
			columnWidth: 1,
			defaults: { width: 220, labelWidth: 102 },
			items: [
				{ fieldLabel: 'Menu', name: 'Caption', xtype: 'textfield', maxLength: 50, disabled: true, allowBlank: false },
				{ fieldLabel: 'Module', name: 'DisplayName', xtype: 'textfield', maxLength: 50, disabled: true, allowBlank: false },
				responsibleforClientIdCombo
				//clientText
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1]
		});
		return config;
	},
	//onclientSearchDataKeyUp: function (field) {
	//	var value = field.getValue();
	//	debugger;
	//	store = this.responsibleforClientIdForStore.getStore();
	//	store.filter('DisplayValue', value);
	//	if (value != undefined && value != '') {
	//		this.responsibleforClientIdForStore.setValue();
	//	}
	//	if (value == "") {
	//		this.responsibleforClientIdForStore.getStore().clearFilter();
	//		this.responsibleforClientIdForStore.setValue();
	//	}
	//},
	CreateFormPanel: function (config) {
		this.on('beforeSave', this.onBeforeSave, this);
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 400,
			height: 250,
			items: [this.formPanel]

		});
		this.on('beforeLoad', function (param) {
			this.responsibleforClientIdForStore.getStore().load();
			var cellValue = this.grid.selModel.selections.items;
			var menuId = cellValue[0].data.MenuId;
			this.grid.baseParams.menuId = menuId;

		});
	},
	onBeforeSave: function (ClientBaseMenuFrom, params, options) {
		var form = ClientBaseMenuFrom.formPanel.getForm();
		var globalAdmin = "0,";
		var clientIds = form.findField('ClientIds').getValue();
		clientIds = globalAdmin + clientIds;
		this.grid.baseParams.clientIds = clientIds;

	}
});