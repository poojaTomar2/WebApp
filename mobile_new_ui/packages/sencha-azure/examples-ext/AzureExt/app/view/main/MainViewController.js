Ext.define('AzureExt.view.main.MainViewController', {
    extend : 'Ext.app.ViewController',

    alias : 'controller.mainviewcontroller',

    onAsc : function() {
        var grid = this.lookupReference('todoGrid'),
            store = grid.getStore();

        store.sort('text', 'ASC');
    },

    onDsc : function() {
        var grid = this.lookupReference('todoGrid'),
            store = grid.getStore();

        store.sort('text', 'DESC');
    },

    onFilter : function(btn) {
        var grid = this.lookupReference('todoGrid'),
            store = grid.getStore();

        if (btn.pressed) {
            store.filter([
                Ext.create('Ext.azure.Filter', {
                    property : "complete",
                    value    : "false"
                })
            ]);
        }
        else {
            store.clearFilter();
        }

        store.loadPage(1);
    },

    onLogin : function(btn) {
        var authOptions = Ext.create('Ext.azure.AuthOptions');
        authOptions.show();
    }
});