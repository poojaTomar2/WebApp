Ext.define('CoolerIoTMobile.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    config: {
        layout: 'card',
        items: [
			{
			    //xtype: 'assetDetail'
			    xtype: 'login'
			    //xtype: 'assetlist'
			},
			{
			    xtype: 'forgotPassword'
			}
			
        ]
    }
});
