﻿Ext.define('CoolerIoTMobile.model.CoolerSummary', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'LocationId', type: 'int ' },
			{ name: 'AssetTypeId', type: 'int ' },
			{ name: 'SmartDeviceTypeId', type: 'int ' },
			{ name: 'SerialNumber', type: 'auto' },
			{ name: 'IsActive', type: 'boolean' },
			{ name: 'Latitude', type: 'float' },
			{ name: 'Longitude', type: 'float' },
			{ name: 'LatestCoolerInfoId', type: 'int' },
			{ name: 'StockDetails', type: 'auto' },
			{ name: 'DoorOpen', type: 'auto' },
			{ name: 'DoorClose', type: 'auto' },
			{ name: 'DoorOpenDuration', type: 'int' },
			{ name: 'LightIntensity', type: 'int' },
			{ name: 'Temperature', type: 'float' },
			{ name: 'Humidity', type: 'int' },
			{ name: 'SoundLevel', type: 'int' },
			{ name: 'LatestLatitude', type: 'float' },
			{ name: 'LatestLongitude', type: 'float' },
            { name: 'StockRemoved', type: 'int' },
            { name: 'PurityIssue', type: 'boolean' },
            { name: 'Location', type: 'string' },
            { name: 'AssetType', type: 'string' },
            { name: 'City', type: 'string' },
            { name: 'Street', type: 'string ' },
            { name: 'Street2', type: 'string ' },
			{ name: 'Street3', type: 'string ' },
			{ name: 'LastPing', type: 'auto' },
			{ name: 'Zip', type: 'auto ' },
			{ name: 'State', type: 'string ' },
			{ name: 'Country', type: 'string ' },
            { name: 'StateId', type: 'int ' },
			{ name: 'CountryId', type: 'int ' },
			{ name: 'IsSmart', type: 'boolean ' },
			{ name: 'IsUnhealthy', type: 'boolean ' },
			{ name: 'Columns', type: 'int ' },
            { name: 'Shelves', type: 'int ' },
			{ name: 'ItemsPerColumn', type: 'int ' },
			{ name: 'ForeignProduct', type: 'auto ' },
			{ name: 'LatestProcessedPurityId', type: 'int ' },
			{ name: 'Stock', type: 'int' },
			{ name: 'Id', mapping: 'AssetId', type: 'int' },
			{ name: 'DeviceStatus', defaultValue: 0, type: 'int' },
			{ name: 'OpenHealthAlert', type: 'int' },
			{ name: 'OpenMissingAlert', type: 'int' },
			{ name: 'OpenMovementAlert', type: 'int' },
			{ name: 'OpenPurityAlert', type: 'int' },
			{ name: 'OpenStockAlert', type: 'int' },
			{ name: 'LastSevenDayMaxDoorOpen', type: 'int' },
			{ name: 'LastSevenDayMinDoorOpen', type: 'int' },
			{ name: 'TodayDoorOpen', type: 'int' },
			{ name: 'Details', type: 'auto' },
			{ name: 'VerifiedOn', type: 'auto' },
			{ name: 'IsMissing', type: 'boolean' },
			{ name: 'IsPowerOn', type: 'boolean' },
			{ name: 'OurStock', type: 'auto' },
			{ name: 'PurityPercentage', type: 'auto' },
			{ name: 'StockPercentage', type: 'auto' },
			{ name: 'PlanogramCompliance', type: 'auto' }
		],
		idProperty: 'AssetId'
		
	}
});