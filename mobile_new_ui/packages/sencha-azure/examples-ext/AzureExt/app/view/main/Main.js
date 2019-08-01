Ext.define('AzureExt.view.main.Main', {
    extend : 'Ext.container.Container',
    xtype  : 'app-main',

    requires : [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    controller : 'mainviewcontroller',

    layout : 'fit',

    items : [
        {
            xtype     : 'grid',
            title     : 'Azure Data Example',
            store     : 'Todo',
            reference : 'todoGrid',

            columns : [
                {
                    text      : 'Id',
                    dataIndex : 'id'
                },
                {
                    text      : 'Text',
                    dataIndex : 'text',
                    flex      : 1
                },
                {
                    text      : 'Complete',
                    dataIndex : 'complete'
                }
            ],

            dockedItems : [
                {
                    xtype : 'toolbar',
                    items : [
                        {
                            xtype        : 'button',
                            text         : 'Filter by Completed',
                            enableToggle : true,
                            listeners    : {
                                click : 'onFilter'
                            }
                        },
                        {
                            xtype     : 'button',
                            text      : 'Sort ASC',
                            listeners : {
                                click : 'onAsc'
                            }
                        },
                        {
                            xtype     : 'button',
                            text      : 'Sort DSC',
                            listeners : {
                                click : 'onDsc'
                            }
                        },
                        {
                            xtype     : 'button',
                            text      : 'Login',
                            listeners : {
                                click : 'onLogin'
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
