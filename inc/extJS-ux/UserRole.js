DA.SecurityUser = function(config){
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'UserRole: {0}',
		listTitle: 'UserRole',
		keyColumn: 'UserRoleId',
		captionColumn: 'UserName',
		controller: 'SecurityUser'
	});
    DA.SecurityUser.superclass.constructor.call(this, config);
};
	    
Ext.extend(DA.SecurityUser, DA.Form, {

	listRecord: Ext.data.Record.create([
		{name: 'SecurityUserId', type: 'int'},
		{name: 'RoleId', type: 'int'},
		{name: 'UserName', type: 'string'},
		{name: 'Name', type: 'string'}
	]),

    cm: function() {
        var cm = new Ext.grid.ColumnModel([
			{header: 'User Name', dataIndex: 'UserName', width: 100}
        ]);
        
        return cm;
    }(),
	
	createForm: function(config) {
	    
	    var name = new Ext.form.TextField({fieldLabel: 'User Name', name: 'UserName', width: 160});
	    var role = new Ext.form.TextField({fieldLabel: 'Role', name: 'Name', width: 160});
	    
	    this.on('dataLoaded', function(rmsForm, data) {
            
            name.setDisabled(true);
            role.setDisabled(true);
        });
        
		Ext.apply(config, {
	        layout:'table',
	        layoutConfig:{columns:2},
	        border: false,
	        defaults: {bodyStyle:'padding: 2px',border: false, layout: 'form', defaultType: 'textfield', labelWidth: 60},
	        items:[
	            // Row 1
	            {items: [name]},
	            {items: [role]}
	        ]
	    });
	    return config;
	},
	CreateFormPanel: function(config) {
	    
	    var roleModuleGrid = DA.Security_RoleModule.createGrid({title: 'Role Modules', root: 'Security_RoleModules', allowPaging: false, editable: true, height:100}, true);
	    var grids = [];
        grids.push(roleModuleGrid);
	     
        var tabPanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            defaults: {layout: 'fit', border: false},
            items: [
                roleModuleGrid
            ]
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
            defaults: {border: false},
            height: 550,
            items: [this.formPanel, tabPanel]
        });
	}
});

DA.SecurityUser = new DA.SecurityUser();