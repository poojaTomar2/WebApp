Cooler.Roles = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Role: {0}',
		listTitle: 'Role',
		keyColumn: 'RoleId',
		captionColumn: 'Name',
		controller: 'SecurityRole',
		securityModule: 'Roles',
		winconfig: { height: 300, width: 300 },
		copyButton: true,
		disableDelete: true,
		newButton: false
	});
	Cooler.Roles.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Roles, DA.Form, {

	hybridConfig: [
		{ dataIndex: 'RoleId', type: 'int' },
		{ dataIndex: 'Name', type: 'string', header: 'Role', width: 200, hyperlinkAsDoubleClick: true },
		{ dataIndex: 'LimitLocation', type: 'bool', header: 'Limit Location', renderer: ExtHelper.renderer.Boolean },
		{ dataIndex: 'LimitCountry', type: 'bool', header: 'Limit Country', renderer: ExtHelper.renderer.Boolean },
		{ dataIndex: 'IsClientRole', type: 'bool', header: 'For Clients', renderer: ExtHelper.renderer.Boolean },
		{ dataIndex: 'LimitSalesRep', type: 'bool', header: 'Limit Sales Rep', renderer: ExtHelper.renderer.Boolean },
		{ dataIndex: 'CreatedBy', type: 'string', header: 'Created By', width: 120 },
		{ dataIndex: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer, header: 'Created On', width: 135, renderer: ExtHelper.renderer.DateTime },
		{ dataIndex: 'ModifiedBy', type: 'string', header: 'Modified By', width: 120 },
		{ dataIndex: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer, header: 'Modified On', width: 135, renderer: ExtHelper.renderer.DateTime }
	],

	fields: {},

	createForm: function (config) {
		var role = new Ext.form.TextField({ fieldLabel: 'Role', name: 'Name', xtype: 'textfield', maxLength: 50, allowBlank: false });
		Cooler.Roles.fields.role = role;
		var items = [
			role,
			{ xtype: 'checkbox', name: 'LimitLocation', fieldLabel: 'Limit Location' },
			{ xtype: 'checkbox', name: 'LimitCountry', fieldLabel: 'Limit Country' },
			{ xtype: 'checkbox', name: 'IsClientRole', fieldLabel: 'For Clients' },
			{ xtype: 'checkbox', name: 'LimitSalesRep', fieldLabel: 'Limit Sales Rep' }
		];

		Ext.apply(config, {
			defaults: { width: 150 },
			items: items
		});
		return config;
	},
	CreateFormPanel: function (config) {

		var roleModuleGrid = Cooler.RolesModule.createGrid({ plugins: [new Ext.grid.CheckColumn()], title: 'Role Modules', root: 'RoleModules', allowPaging: false, editable: true, height: 100 });
		var grids = [];
		grids.push(roleModuleGrid);

		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			defaults: { layout: 'fit', border: false },
			items: [
                roleModuleGrid
			]
		});


		this.on('dataLoaded', function (rmsForm, data) {
			var id = data.data.Id;
			if (isNaN(id)) {
				id = 0;
			}
			if (data.data.RoleModules.length == 0) {
				tabPanel.setVisible(false);
				this.win.setHeight(200);
				this.win.setWidth(500);
			}
			else {
				tabPanel.setVisible(true);
				this.win.setHeight(this.winConfig.height);
				this.win.setWidth(this.winConfig.width);
			}
			Cooler.Roles.fields.role.setDisabled(id != 0);
			this.win.doLayout();
			this.win.center();
		});

		this.on('copy', function () {
			Cooler.Roles.fields.role.setValue('');
			Cooler.Roles.fields.role.setDisabled(false);
		});


		// Assign info for children
		this.requiredGrids = null;
		this.childGrids = grids;


		Ext.apply(config, {
			region: 'north',
			height: 140
		});
		this.formPanel = new Ext.FormPanel(config);

		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 550,
			items: [this.formPanel, tabPanel]
		});
	}
});

Cooler.Roles = new Cooler.Roles();

//---------------------------------
//          Role Module
//---------------------------------

Cooler.RolesModule = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'SecurityRoleModule: {0}',
		listTitle: 'SecurityRoleModule',
		keyColumn: 'RoleModuleId',
		gridIsLocal: true,
		disableAdd: true,
		disableDelete: true
	});
	Cooler.RolesModule.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.RolesModule, DA.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'Module', type: 'string' },
		{ name: 'DisplayName', type: 'string' },
		{ name: 'RoleId', type: 'int' },
		{ name: 'ForUserId', type: 'int' },
		{ name: 'ModuleId', type: 'int' },
		{ name: 'Permissions', type: 'string' },
		{ name: 'Permission1', type: 'bool' },
		{ name: 'Permission2', type: 'bool' },
		{ name: 'Permission3', type: 'bool' },
		{ name: 'Permission4', type: 'bool' },
		{ name: 'Permission5', type: 'bool' },
		{ name: 'Permission6', type: 'bool' },
		{ name: 'Permission7', type: 'bool' },
		{ name: 'Permission8', type: 'bool' },
		{ name: 'Description', type: 'string' }
	]),

	cm: function () {

		var cols = [{ header: 'List', dataIndex: 'DisplayName', width: 200 }];
		var counter = 0;
		cols.push({ header: 'Description', dataIndex: 'Description', width: 200 });
		for (var permissionType in DA.Permissions) {
			cols.push(new Ext.grid.CheckColumn({ header: permissionType === 'Module' ? 'List' : permissionType, dataIndex: 'Permission' + (++counter), width: 55 }));
		}
		var cm = new Ext.grid.ColumnModel(cols);

		return cm;
	}()
});

Cooler.RolesModule = new Cooler.RolesModule();