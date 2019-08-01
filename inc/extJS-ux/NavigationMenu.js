DCPLApp.NavigationEditor = new DA.Form({
    controller: 'Navigation',
    formTitle: 'Menu',
    listTitle: 'Menu',
    listeners: {
        dataLoaded: function(module, data) {
            if (data.data.Id == 0) {
                module.fields.parentId.setValue(module.activeNode.id);
            }
        },
        beforeFormClose: function() {
            DCPLApp.refreshMenu();
        }
    },
    winConfig: { height: 250, width: 500 },
    createForm: function(config) {
        var caption = new Ext.form.TextField({ fieldLabel: 'Caption', name: 'MenuCaption', width: 300, allowBlank: false });
        var moduleCombo = DA.combo.create({ fieldLabel: 'Module', hiddenName: 'ModuleId', width: 300, baseParams: { comboType: 'SecurityModules' }, allowBlank: false });
        var url = new Ext.form.TextField({ fieldLabel: 'URL', name: 'Url', width: 300 });
        var isActive = new Ext.form.Checkbox({ fieldLabel: 'Is Active?', width: 120, allowBlank: false, name: 'IsActive' });
        var icon = new Ext.form.TextField({ fieldLabel: 'Icon', name: 'Icon', width: 300 });
        var parentId = new Ext.form.NumberField({ fieldLabel: 'Parent', name: 'ParentId', allowDecimals: false });
        this.fields.parentId = parentId;
        var path = new Ext.form.TextField({ fieldLabel: 'Path', name: 'Path', allowBalnk: false });

        var uploadFile = new Ext.form.FileUploadField({
            fieldLabel: 'Select File',
            width: 250,
            name: 'selectFile',
            allowBlank: true
        });

        // create form panel
        return Ext.apply(config, {
            fileUpload: true,
            items: [caption, moduleCombo, url, isActive, icon, parentId, path, uploadFile]
        })
    },

    fields: {},

    createNavigationContextMenu: function() {
        var fields = this.fields;
        return new Ext.menu.Menu({
            items: [
				fields.addMenu = new Ext.menu.Item({ text: 'Add', tag: 'add' }),
				fields.renameMenu = new Ext.menu.Item({ text: 'Edit', tag: 'edit' })
			],
            listeners: {
                itemclick: this.onNavigationMenuItemClick,
                scope: this
            }
        });

        this.url = EH.BuildUrl('NavigationMenu');
    },

    onNavigationContextMenu: function(node, e) {
        if (typeof e == 'object') {
            e.preventDefault();
        }
        var menu = this.menu;
        if (!menu) {
            menu = this.createNavigationContextMenu();
            this.menu = menu;
        }
        var fields = this.fields;
        fields.addMenu.setDisabled(node.disabled);
        fields.renameMenu.setDisabled(node.disabled);

        this.activeNode = node;

        menu.show(e.getTarget(), 'tr-br?');
    },

    onNavigationMenuItemClick: function(menu) {
        var action = menu.tag;
        var node = this.activeNode;

        this.ShowForm(action == 'add' ? 0 : node.id);
    },

    onNodeDrop: function(e) {
        Ext.Msg.confirm('Arrange Menu', 'Are you sure you want to change the parent of the menu', function(btn) {
            if (btn == 'yes') {
                ExtHelper.GenericCall({
                    url: EH.BuildUrl('Menu'),
                    params: { action: 'ArrangeMenu', id: e.data.node.id, parentId: e.target.id },
                    title: 'Arrange Menu',
                    handleSuccess: false,
                    onSuccess: function() {
                        Ext.Msg.alert("Successful", 'Menu Arranged');
                        DCPLApp.refreshMenu();
                    },
                    onFailure: function() {
                        Ext.Msg.alert("Alert", 'failed');
                    }
                });
            }
        });
    }
});
