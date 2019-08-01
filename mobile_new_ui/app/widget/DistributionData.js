Ext.define('CoolerIoTMobile.widget.DistributionData', {
	extend: 'Ext.Container',
	xtype: 'distributionData',
	requires: [
		'Ext.carousel.Carousel'
	],
	config: {
		layout: 'vbox',
		items: [
			{
				flex: 1,
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						itemId: 'planogram-data',
						xtype: 'container',
						tpl: CoolerIoTMobile.Templates.planogram,
						flex: 0.49
					},
					{
						itemId: 'facing-data',
						xtype: 'container',
						tpl: CoolerIoTMobile.Templates.planogram,
						flex: 0.49
					}
				]
			}
		]
	},
	updateData: function (data) {
		var facing = Ext.ComponentQuery.query('[itemId=facing-data]')[0];
		data.facings.title = 'REALOGRAM';
		facing.updateData(data.facings);

		var planogram = Ext.ComponentQuery.query('[itemId=planogram-data]')[0];
		data.planogram.title = 'PLANOGRAM';
		planogram.updateData(data.planogram);
	}
});




