Ext.ns("DA.form");

DA.form.QuickEntry = function(options) {
    Ext.apply(this, options);
    
    Ext.applyIf(this, {
        cn: new Ext.data.Connection({url:EH.BuildUrl(this.module.controller), method:'POST', scope:this}),
        comboNameFieldSuffix: 'Name'
    });

    delete options;
};

DA.form.QuickEntry.prototype = {
    init: function() {
        var qe = this;
        if(!qe.grid) {
            qe.grid = new Ext.grid.EditorGridPanel({
                store: qe.store,
                cm: qe.cm || this.module.cm,
                clicksToEdit:1,
                tbar: [{text:'Save and Close', handler: qe.onSave, scope: qe, iconCls: 'save'}]
            });
        }

        if(!qe.win) {
            qe.win = new Ext.Window({
                closeAction: 'hide',
                closable: true,
                layout: 'fit',
                height: 300,
                width: 800,
                modal: true,
                items: [qe.grid]
            });
        }
        
        if(qe.copyFields) {
            qe.grid.on('beforeedit', qe.onBeforeEdit, qe);
        }
        
        if(qe.comboFields) {
            qe.grid.on('validateedit', qe.onValidateEdit, qe);            
        }
    },

    show: function() {
        var qe = this;
        if(!qe.grid) {
            qe.init();
        }
        
        qe.cn.request({
            params: {
                action: 'load',
                comboTypes: Ext.encode(qe.module.getComboTypesForLoad())
            },
            success: function(response) {
                var json = response.responseText;
                var o = eval("("+json+")");
                if(!o) {
                    throw {message: "JsonReader.read: Json object not found"};
                }
                if(o.combos) {
                    this.loadComboData(o);
                }
            },
            scope: this.module
        });
        
        qe.win.show();
        qe.grid.startEditing(0, 0);
    },

    onSave: function() {
        var module = this.module;
        var qe = this;
        var lineItems = qe.getData();
        qe.cn.request({
            params: {
                action: 'quickSave',
                lineItems: Ext.encode(lineItems)
            },
            success: function(response) {
                var json = response.responseText;
                var o = eval("("+json+")");
                if(!o) {
                    throw {message: "JsonReader.read: Json object not found"};
                }
                if(!o.success) {
                    Ext.Msg.alert('Error saving data');
                } else {
                    qe.win.hide();
                    if(typeof(qe.onSaved) == 'function') {
                        qe.onSaved.call(module);
                    }
                    module.grid.getStore().reload();
                }
            },
            scope: this,
            failure: function() {
                Ext.Msg.alert('Error saving data');
            }
        });
    },
    
    getCaptionFieldName: function(idField) {
        var len = idField.length;
        var captionField = idField;
        if(len >= 2) {
            var endsWidth = idField.substr(len-2,2);
            if(endsWidth == "Id") {
                captionField = idField.substr(0, len-2);
            }
        }
        captionField += this.comboNameFieldSuffix;
        return captionField;
    },
    
    onBeforeEdit: function(e) {
        var fieldName = e.field;
        var rec = e.record;
        
        var qe = this;

        // If first row, or not in copy field list or has a value, return
        if(e.row == 0 || qe.copyFields.indexOf(fieldName) == -1 || rec.get(fieldName) != null) {
            return;
        }
        
        // Default from previous row
        var pRec = qe.store.getAt(e.row - 1);
        rec.set(fieldName, pRec.get(fieldName));
        
        if(qe.comboFields && qe.comboFields.indexOf(fieldName) > -1) {
            var captionField = qe.getCaptionFieldName(fieldName);
            rec.set(captionField, pRec.get(captionField));
        }
    },

    onValidateEdit: function(e) {
        var fieldName = e.field;
        var qe = this;
        
        if(qe.comboFields.indexOf(fieldName) == -1) {
            return;
        }

        var rec = e.record;
        var editor = qe.grid.getColumnModel().getCellEditor(e.column, e.row);
        var captionField = qe.getCaptionFieldName(fieldName);
        e.record.set(captionField, editor.field.getRawValue());
        editor.field.setRawValue(editor.field.getRawValue());
    }
}