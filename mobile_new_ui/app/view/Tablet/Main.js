Ext.define('CoolerIoTMobile.view.Tablet.Main', {
	extend: 'Ext.Container',
	id: 'tablet-MainView',
	xtype: 'tablet-main',
	config: {
		layout: 'card',
		items: [
			{
				xtype: 'container',
				itemId: 'salesRepListItem',
				layout: 'vbox',
				items: [
					{
						xtype: 'titlebar',
						title: 'My Team'
					},
					{
						xtype: 'tablet-MyTeam',
						flex: 1
					}
				]
			}, {
				xtype: 'container',
				layout: 'vbox',
				itemId: 'chartContainer',
				flex: 1,
				items: [
					{
						xtype: 'tablet-toolbar',
						showSalesRep: false
					},
					{
						xtype: 'container',
						flex: 1,
						layout: 'hbox',
						itemId: 'pieChartContainer',
						title: 'Chart',
						iconCls: 'star',
						items: [
							{
								xtype: 'df-fusionchart',
								url: Df.App.getController('Chart'),
								chartType: 'pie2d',
								itemId: 'openAlertPieChart',
								flex: 1,
								chartConfig: {
									chart: {
										caption: 'Open Alerts by SRs',
										useRoundEdges: '1',
										basefontsize: '15'
									}
								},

								series: [
									{
										field: 'Value',
										label: 'Name'
									}
								]
							},
							{
								xtype: 'agingChart',
								flex: 1,
								itemId: 'agingChart',
								chartTitle: 'Aging overview for open alerts'
							}
						]
					}
				]
			}, {
				xtype: 'container',
				layout: 'vbox',
				itemId: 'coolerContainer',
				items: [
					{
						xtype: 'toolbar',
						title: 'Coolers'
					},
					{
						xtype: 'df-fusionchart',
						chartType: 'mscolumn3d',
						itemId: 'outletPurityChart',
						flex: 1,
						chartConfig: {
							chart: {
								useRoundEdges: '1',
								basefontsize: '15',
								yAxisMaxValue: 100
							}
						}
					}
				]
			}, {
				xtype: 'container',
				layout: 'vbox',
				itemId: 'coachingContainer',
				items: [
					{
						xtype: 'coaching-toolbar'
					},
					{
						xtype: 'df-fusionchart',
						chartType: 'msline',
						itemId: 'lowestOutletPurityChart',
						flex: 1,
						url: Df.App.getController('LowestOutletPurityChartData'),
						chartConfig: {
							chart: {
								caption: 'Lowest Outlet Purity',
								useRoundEdges: '1',
								basefontsize: '15'
							}
						},
						series: [
							{
								field: 'AvgPurity',
								label: 'Location'
							}
						]
					}
				]
			}, {
				xtype: 'container',
				itemId: 'todoList',
				layout: 'vbox',
				items: [
					{
						xtype: 'titlebar',
						title: 'My Tasks'
					}, {
						xtype: 'mobile-toDoList',
						flex: 1
					}
				]
			}, {
				xtype: 'container',
				itemId: 'myLibraryGrid',
				layout: 'vbox',
				items: [
					{
						xtype: 'toolbar',
						title: 'My Library'
					}, {
						xtype: 'grid',
						flex: 1,
						titleBar: {
							hidden: true
						},
						store: {
							fields: ['title', 'createdon'],
							data: [
								{
									title: 'Handbook v1.0',
									createdon: '1/1/2014'
								}, {
									title: 'Sales Presentation',
									createdon: '1/1/2014'
								}, {
									title: 'Marketing Trends',
									createdon: '1/1/2014'
								}, {
									title: 'Organization flowchart',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}, {
									title: 'Handbook',
									createdon: '1/1/2014'
								}
							]
						},
						columns: [
							{
								text: 'Document Title',
								dataIndex: 'title',
								width: 250
							}, {
								text: 'Uploaded On',
								dataIndex: 'createdon',
								width: 100
							}
						]
					}
				]
			},
			{
				xtype: 'container',
				layout: 'vbox',
				itemId: 'syncContainer',
				items: [
					{
						xtype: 'titlebar',
						title: 'Sync'
					},
				{
					flex: 1,
					html: 'All data is synched',
					cls : 'syncPanelData'
					
				}
				]
			}
		]
	}
});