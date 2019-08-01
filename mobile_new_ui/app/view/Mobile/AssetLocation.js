Ext.define("CoolerIoTMobile.view.Mobile.AssetLocation", {
	extend: 'Ext.Panel',
	xtype: 'asset-location',
	requires: [
        'Ext.dataview.List',
        'Ext.data.Store',
        'Ext.field.Search',
        'Ext.List',
        'Ext.Toolbar'
	],

	config: {
		title: 'Location',
		iconMask: true,
		iconCls: 'location',
		layout: 'fit',
		centered: true,
		height: '98%',
		width: '85%',
		modal: true,

		/* top toolbar with title and new button */
		items: [
        {
        	xtype: "toolbar",
			itemId:'toptoolbar',
        	docked: "top",
        	items: [

                {
                	xtype: "button",
                	text: 'Add',
                	ui: 'action',
                	itemId: "addAssetLocation"
                },

                { xtype: 'spacer' },
				 { iconMask: true, iconCls: 'delete', ui: 'plain', align: 'right', itemId: 'cancelAssetLocation' }
        	]
        },

        {
        	xtype: 'toolbar',
        	docked: 'top',


        	items: [
                { xtype: 'spacer' },
                {
                	xtype: 'searchfield',
                	placeHolder: 'Search...',
                	itemId: 'searchAssetLocationField'
                },
                { xtype: 'spacer' }
        	]
        },

        /* data store list */
        {
        	xtype: 'assetLocationList'
		},
		 {
		 	xtype: 'assetInstallList',
			hidden : true
		 }
		]

	}
});