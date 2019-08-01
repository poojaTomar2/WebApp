Ext.define('CoolerIoTMobile.view.Mobile.CustomerInfo', {
	extend: 'Ext.Container',
	xtype: 'mobile-customerInfo',
	config: {
		layout: 'vbox',
		title: 'Customer Info',
		cls: 'asset-item-list-container',
		data: null,
		fromOffRoute: false,
		items: [
			{
				xtype: 'container',
				height: 104,
				scrollable: {
					direction: 'vertical',
					directionLock: true
				},
				itemId: 'customerDetails',
				tpl: new Ext.XTemplate(
					'<div class = "background-white-container">',
					'<table class="customeInfoTable">',
					'<td class="headerDetail">Name:</td><td class ="customerDetail">{Name}</td>',
					'</tr>',
					'<tr>',
					'<td class="headerDetail">Channel:</td><td class="customerDetail">{Channel}</td></tr>',
					'<tr><td>Address:</td><td class ="customerDetail">{Street} {Street2}</td>',
					'</tr>',
					'<tr><td>&nbsp;</td><td class ="customerDetail">{City} {State} {PostalCode}</td>',
					'</tr>',
					'<tr>',
					'<td>VAT Number:</td><td class ="customerDetail">{VATNumber}</td>',
					'</tr>',
					'<tr>',
					'<td>Primary Contact:</td><td class ="customerDetail">{FirstName} {LastName}</td>',
					'</tr>',
					'<tr>',
					'<td>Contact:</td><td class ="customerDetail">{WorkPhone} <tpl if="values.WorkPhone">/ </tpl>{CellPhone}</td>',
					'</tr>',
					'<tr>',
					'<td>Location:</td><td class ="customerDetail">Lat: {Latitude}&nbsp;Long: {Longitude}</td>',
					'</tr>',
					'</table>',
					'</div>'
				),
				data: { CustomerCode: '0091987363', CustomerName: 'DULAKSHI Distributor', CustomerChannel: 'Special Events', CustomerAddress: '14/21 Durevall', AddressCity: 'NewYork', AddressPostalCode: '262802', CustomerVATNumber: 'A12688', ContentFirstName: 'Tom', ContentLastName: 'Blown', ContentPhone: '785 34987593', ContentMobile: '70643534', Identity1: '14/3 Lansdwell', Identity2: '2012.09.10', CustomerId: 1 }
			},
			{
				xtype: 'map',
				flex: 1,
				itemId: 'customerInfoMap'
			},
			{
				xtype: 'container',
				height: 110,
				layout: 'fit',
				itemId: 'coolerPanel',
				items: [
					{
						xtype: 'dataview',
						flex: 1,
						cls: "background-white-container",
						itemId: 'assetDetailList',
						scrollable: {
							direction: 'horizontal',
							directionLock: true
						},
						inline: {
							wrap: false
						},
						disableSelection: true,
						itemTpl: new Ext.XTemplate(
							'<div class="cooler-list-image-container {[values.OpenMissingAlert > 0 ? "missing-cooler" + CoolerIoTMobile.util.Renderers.coolerImageType(values) : values.AssetTypeId === CoolerIoTMobile.Enums.AssetType.WendingMachine ? "wending-machine-list-image" : "cooler-list-image" + CoolerIoTMobile.util.Renderers.coolerImageType(values)]}">',
								'<div class="assetIssueContainer">',
								'<tpl if="OpenHealthAlert &gt; 0"><div class="assetIssue">H</div></tpl>',
								'<tpl if="OpenMissingAlert  &gt; 0"><div class="assetIssue">X</div></tpl>',
								'<tpl if="OpenPurityAlert &gt; 0"><div class="assetIssue">P</div></tpl>',
								'<tpl if="OpenMovementAlert &gt; 0"><div class="assetIssue">M</div></tpl>',
								'<tpl if="OpenStockAlert &gt; 0"><div class="assetIssue">O</div></tpl>',
								'</div>',
							'</div>',
							'<div class="assetDetails">{SerialNumber}</div>'
						),
						store: 'CoolerSummary'
					}
				]
			}
		],
		listeners: {
			painted: function (container) {
				var isOffROute = this.getFromOffRoute()
				this.getMenuItem('addtoRoute').setHidden(!isOffROute);
				this.getMenuItem('inStore').setHidden(isOffROute);
			}
		}
	},

	updateData: function (data) {
		this.setTitle(data.Code);
		this.down('#customerDetails').setData(data);
	},

	getMenuItem: function (menuId) {
		this.menuId = menuId;
		return Ext.ComponentQuery.query('#mainNavigation')[0].listItems.filter(function (i) {
			return i.getRecord().get('itemId') === this.menuId
		}, this)[0];
	}
});