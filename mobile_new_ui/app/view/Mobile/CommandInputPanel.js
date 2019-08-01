Ext.define('CoolerIoTMobile.view.Mobile.CommandInputPanel', {
    extend: 'Ext.Panel',
    xtype: 'commandInputPanel',
    config: {
        centered: true,
        height: 110,
        width: '95%',
        modal: true,
        hideOnMaskTap: true,
        scrollable: false,
        inputTitle: CoolerIoTMobile.Localization.InputValue,
        containerItems: [],
        command: null,
        listeners: {
            painted: function (panel, eOpts) {                
                
                var height = 0, defaultHeight = 110;
                var data = this.getContainerItems() || [];
                for (var i = 0; i < data.length; i++) {
                    height += 48;
                }
                
                var container = this.down('container#inputDataContainer');
                container.removeAll();
                this.setHeight(defaultHeight + height);
                var title = '<div style="font-size: 18px; color: white;">' + this.getInputTitle() + '</div>';
                this.down('container#inputTitlebar').setTitle(title);                
                container.add(data);       
                
            },
            show: function (panel) {
                var form = this.down('container#inputDataContainer');
                var field = form.getItems().getAt(0);
                field.focus();
            }

        },
        hideAnimation: {
            type: 'popOut',
            duration: 200,
            easing: 'ease-out'
        },
        showAnimation: {
            type: 'popIn',
            duration: 200,
            easing: 'ease-out'
        },
        layout: 'fit',
        items: [
            {
                xtype: 'titlebar',
                itemId: 'inputTitlebar',
                styleHtmlContent: true,
                docked: 'top'               
            },
            {
                xtype: 'formpanel',
                scrollable: false,
                itemId: 'inputDataContainer',               
                //items: [{ xtype: 'hiddenfield', name: 'command', value: 0 }],
                flex: 1
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [                    
                   {
                       iconMask: true, text: CoolerIoTMobile.Localization.Cancel, iconCls: 'delete', 
                       handler: function (button) {
                           this.up('commandInputPanel').hide();
                       }
                   },
                   {
                       xtype: 'spacer'
                   },
                   {
                       iconMask: true, text: CoolerIoTMobile.Localization.Ok, itemId: 'commandWindowOkButton', iconCls: 'action'                       
                   }]
            }
        ]
    }
});