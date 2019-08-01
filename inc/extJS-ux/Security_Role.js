/*
Sps
===
1. addSecurity_Role, 2. addSecurity_RoleModule, 3. deleteSecurity_Role, 4. deleteSecurity_RoleModule, 5. getSecurity_Role, 6. getSecurity_RoleModule, 7. updateSecurity_Role, 8. updateSecurity_RoleModule
Views
=====
1. Security_vwRoleList, 2. Security_vwRoleModuleList, 3. SecurityModuleList


*/

DA.Security_Role = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Role: {0}',
		listTitle: 'Role',
		keyColumn: 'RoleId',
		captionColumn: 'Name',
		controller: 'SecurityRole',
		winconfig: { height: 300, width: 300 },
		copyButton: true,
		newButton: false
	});
	DA.Security_Role.superclass.constructor.call(this, config);
};

Ext.extend(DA.Security_Role, DA.Form, {

	hybridConfig: [
		{ dataIndex: 'RoleId', type: 'int' },
		{ dataIndex: 'Name', type: 'string', header: 'Role', dataIndex: 'Name', width: 200, hyperlinkAsDoubleClick: true },
		{ dataIndex: 'CreatedBy', type: 'string', header: 'Created By', width: 120 },
		{ dataIndex: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer, header: 'Created On', width: 135, renderer: ExtHelper.renderer.DateTime },
		{ dataIndex: 'ModifiedBy', type: 'string', header: 'Modified By', width: 120 },
		{ dataIndex: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer, header: 'Modified On', width: 135, renderer: ExtHelper.renderer.DateTime }
	],

	fields: {},

	createForm: function(config) {
		var role = new Ext.form.TextField({ fieldLabel: 'Role', name: 'Name', xtype: 'textfield', maxLength: 50, allowBlank: false });
		DA.Security_Role.fields.role = role;
		var items = [
			role
		];

		Ext.apply(config, {
			defaults: { width: 150 },
			items: items
		});
		return config;
	},
	CreateFormPanel: function(config) {

		var roleModuleGrid = DA.Security_RoleModule.createGrid({ plugins: [new Ext.grid.CheckColumn()], title: 'Role Modules', root: 'RoleModules', allowPaging: false, editable: true, height: 100 });
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


		this.on('dataLoaded', function(rmsForm, data) {
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
			DA.Security_Role.fields.role.setDisabled(id != 0);
			this.win.doLayout();
			this.win.center();
		});

		this.on('copy', function() {
			DA.Security_Role.fields.role.setValue('');
			DA.Security_Role.fields.role.setDisabled(false);
		});


		// Assign info for children
		this.requiredGrids = null;
		this.childGrids = grids;


		Ext.apply(config, {
			region: 'north',
			height: 60
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

DA.Security_Role = new DA.Security_Role();

//---------------------------------
//          Role Module
//---------------------------------

DA.Security_RoleModule = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'SecurityRoleModule: {0}',
		listTitle: 'SecurityRoleModule',
		keyColumn: 'RoleModuleId',
		gridIsLocal: true,
		disableAdd: true,
		disableDelete: true
	});
	DA.Security_RoleModule.superclass.constructor.call(this, config);
};

Ext.extend(DA.Security_RoleModule, DA.Form, {

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
		{ name: 'Permission8', type: 'bool' }
	]),

	cm: function() {

		var cols = [{ header: 'Module', dataIndex: 'DisplayName', width: 300}];
		var counter = 0;
		for (var permissionType in DA.Permissions) {
			cols.push(new Ext.grid.CheckColumn({ header: permissionType, dataIndex: 'Permission' + (++counter), width: 55 }));
		}

		var cm = new Ext.grid.ColumnModel(cols);

		return cm;
	} ()
});

DA.Security_RoleModule = new DA.Security_RoleModule();