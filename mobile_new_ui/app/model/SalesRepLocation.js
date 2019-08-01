Ext.define('CoolerIoTMobile.model.SalesRepLocation', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'LocationId',
        fields: [
			{ name: 'LocationId', type: 'int' },
			{ name: 'OosIssue', type: 'int' },
			{ name: 'TemperatureIssue', type: 'int' },
			{ name: 'DoorOpenIssue', type: 'int' },
			{ name: 'LightIssue', type: 'int' },
			{ name: 'HumidityIssue', type: 'int' },
			{ name: 'OtherIssue', type: 'int' },
			{ name: 'PurityIssue', type: 'int' },
			{ name: 'Latitude', type: 'string' },
			{ name: 'Longitude', type: 'string' }
        ]
    }
});