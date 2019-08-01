Ext.define('Push.controller.Main', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            todoField : 'main toolbar textfield',
            main      : 'main'
        },

        control : {
            'button[action=add]'    : {
                tap : 'onAddItem'
            },
            'button[action=reload]' : {
                tap : 'onReload'
            },

            main : {
                activate      : 'loadInitialData',
                itemdoubletap : 'onItemEdit'
            },

            'push-dataitem checkboxfield' : {
                change : 'onItemCompleteTap'
            },

            'push-dataitem button' : {
                tap : 'onItemDeleteTap'
            }
        }
    },

    init : function () {
        //Until Touch has event domains, we have to manually set these event handlers
        Ext.Azure.on({
            scope                     : this,
            'pushregistrationsuccess' : this.onPushRegistrationSuccess,
            'pushnotification'        : this.onPushNotification,

            'pushregistrationfailure' : function(error) {
                Ext.Msg.alert('Error', 'Error registering the device for Push Notifications: ' + error);
            }
        });
    },

    onPushRegistrationSuccess : function (event) {
        Ext.create('Push.model.Device', {
            platform : Ext.azure.Push.platform,
            token    : Ext.azure.Push.token
        }).save();
    },

    onPushNotification : function (event) {
        Ext.Msg.alert('Notification', event.message);
    },

    loadInitialData : function () {
        Ext.getStore('TodoItems').load();
    },

    onItemDeleteTap : function (button, e, eOpts) {
        var store    = Ext.getStore('TodoItems'),
            dataItem = button.up('dataitem'),
            rec      = dataItem.getRecord();

        rec.erase({
            success: function (rec, operation) {
                store.remove(rec);
            },
            failure: function (rec, operation) {
                Ext.Msg.alert(
                    'Error',
                    Ext.util.Format.format('There was an error deleting this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                );
            }
        });
    },

    onItemCompleteTap : function (checkbox, newVal, oldVal, eOpts) {
        var dataItem = checkbox.up('dataitem'),
            rec      = dataItem.getRecord(),
            recVal   = rec.get('complete');

        // this check is needed to prevent an issue where multiple creates get triggered from one create
        if (newVal !== recVal) {
            rec.set('complete', newVal);
            rec.save({
                success: function (rec, operation) {
                    rec.commit();
                },
                failure: function (rec, operation) {
                    // since there was a failure doing the update on the server then silently reject the change
                    rec.reject(true);
                    Ext.Msg.alert(
                        'Error',
                        Ext.util.Format.format('There was an error updating this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                    );
                }
            });
        }
    },

    onItemEdit : function (list, index, target, record, e, eOpts) {
        var rec = list.getSelection()[0];

        Ext.Msg.prompt('Edit', 'Rename task',
            function (buttonId, value) {
                if (buttonId === 'ok') {
                    rec.set('text', value);
                    rec.save({
                        success: function (rec, operation) {
                            rec.commit();
                        },
                        failure: function (rec, operation) {
                            // since there was a failure doing the update on the server then reject the change
                            rec.reject();
                            Ext.Msg.alert(
                                'Error',
                                Ext.util.Format.format('There was an error updating this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                            );
                        }
                    });
                }
            },
            null,
            false,
            record.get('text')
        );
    },

    onReload : function () {
        Ext.getStore('TodoItems').load();
    },

    onAddItem : function () {
        var me = this,
            rec,
            store = Ext.getStore('TodoItems'),
            field = me.getTodoField(),
            value = field.getValue();

        if (value === '') {
            Ext.Msg.alert('Error', 'Please enter Task name', Ext.emptyFn);
        }
        else {
            rec = Ext.create('Push.model.TodoItem', {
                complete : false,
                text     : value
            });
            //store.insert(0, rec); //insert at the top
            //store.sync();
            rec.save({
                success: function (rec, operation) {
                    store.insert(0, rec); //insert at the top
                    field.setValue('');
                },
                failure: function (rec, operation) {
                    Ext.Msg.alert(
                        'Error',
                        Ext.util.Format.format('There was an error creating this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                    );
                }
            });
        }
    }
});