Ext.define('CoolerIoTMobile.view.Mobile.Assets', {
    extend: 'Ext.Container',
    xtype: 'mobile-assets',
    config: {
        layout: 'fit',
        title: CoolerIoTMobile.Localization.AssetListTitle,
        cls: 'asset-item-list-container',
        items: [
            ///* Original Code For TitleBar
			{
			    xtype: 'toolbar',
			    docked: 'top',
			   // margin: '10px 3px 0 0',
			    layout: 'hbox',              
			    flex: 1,
                cls: 'asset-list-toolbar',
			    items: [
					{
					    xtype: 'searchfield',
					    width: '52%',
					    name: 'Name',
					    //ui: 'plain',
                        cls: 'search-field-white-bg',
					    placeHolder: 'Search',
					    itemId: 'searchAssetField',
					    docked: 'left'					    
					},
					{
						xtype: 'selectfield',
						width: 155,
						itemId: 'issueType',
						usePicker: 'true',
						docked: 'right',						
						cls: 'white-color',
						//style: 'background-color: #3598DB;',
						options: [
							{ text: 'Select Filter', value: '' },
							{ text: 'Low Stock', value: 'StockIssue' },
							{ text: 'Health Issue', value: 'HealthIssue' },
							{ text: 'Purity Issue', value: 'PurityIssue' },
							{ text: 'Moved', value: 'MovementIssue' },
							{ text: 'Missing', value: 'MissingIssue' }
						]
					}
			    ]
			},
          //  */
            
			{
			    xtype: 'mobile-assetList',
			    itemId: 'assetsList',
			    flex: 1
			}
        ]
    }   
});
