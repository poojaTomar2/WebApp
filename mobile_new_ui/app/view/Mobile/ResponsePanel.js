Ext.define('CoolerIoTMobile.view.Mobile.ResponsePanel', {
    extend: 'Ext.Panel',
    xtype: 'responsePanel',
    config: {
        centered: true,
        height: 80,
        width: 320,
        modal: true,
        hideOnMaskTap: true,
        scrollable: false,
        responseTitle: CoolerIoTMobile.Localization.ResponseData,        
        listeners: {
            show: function (panel, eOpts) {               
               
                var height = 0, defaultHeight = 80;
                var data = [];
                var store = Ext.getStore('CommandData');
                store.each(function (record) {
                    data.push(record.getData());
                    height += 35;
                });

                var container = this.down('container#responseDataContainer');                
                this.setHeight(defaultHeight + height);
                container.setData(data);
                this.down('container#responseTitlebar').setTitle(this.getResponseTitle());
                
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
                itemId: 'responseTitlebar',                
                docked: 'top',
                items: [
                    {
                        iconMask: true, iconCls: 'delete', ui: 'plain', align: 'right',
                        handler: function (button) {
                            this.up('responsePanel').hide();
                        }
                    }]
            },
            {
                xtype: 'container',                
                tpl: '<table class="device-name-selection"><tpl for="."><tr><td style="width:{LabelWidth}">{Title}</td><td>: {Data}</td></tr></tpl></table>',
                styleHtmlContent: true,
                scrollable: true,
                itemId: 'responseDataContainer',                
                flex: 1
            }]
    }
});