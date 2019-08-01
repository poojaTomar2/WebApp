Ext.define('CoolerIoTMobile.view.Tablet.CoachingToolbar', {
	extend: 'Ext.TitleBar',
	xtype: 'coaching-toolbar',
	requires: [
        'Ext.field.Select'
	],
	config: {
		title: 'Outlet Purity',
		items: [
			{
				xtype: 'df-combo',
				label: 'SR',
				itemId: 'salesRepCombo',
				comboType: 'SalesRep',
				width: 200,
				addAll: true,
				value: 0,
				align: 'right'
			},
			{
				xtype: 'selectfield',
				label: 'Stores',
				align: 'right',
				usePicker: 'true',
				itemId: 'numberOfStores',
				options: [
                        { text: '10', value: '10' },
                        { text: '11', value: '11' },
                        { text: '12', value: '12' },
						{ text: '13', value: '13' },
						{ text: '14', value: '14' },
						{ text: '15', value: '15' }
				]
			},
	 		{
	 			xtype: 'datepickerfield',
	 			label: 'Date',
	 			itemId: 'fromDateField',
	 			name: 'fromDate',
	 			picker: {
	 				yearFrom: 2000,
	 				yearTo: new Date().getFullYear()
	 			},
	 			align: 'right'
	 		}
		]
	}
});