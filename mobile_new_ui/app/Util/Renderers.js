Ext.define('CoolerIoTMobile.util.Renderers', {
	singleton: true,
	standardDate: function (value, p, r) {
		if (Ext.isDate(value)) {
			return Ext.Date.format(value, CoolerIoTMobile.Localization.StandardDate);
		}
		return "&nbsp;";
	},
	// Returns the standard date and time 
	standardDateTime: function (value, p, r) {
		if (Ext.isDate(value)) {
			return Ext.Date.format(value, CoolerIoTMobile.Localization.DateTimeFormat);
		}
		return "&nbsp;";
	},
	standardTime: function (value, p, r) {
		if (Ext.isDate(value)) {
			return Ext.Date.format(value, CoolerIoTMobile.Localization.TimeFormat);
		}
		return "&nbsp;";
	},
	getLightIntensity: function (values) {
		return (values.LightIntensity);
	},
	getPurityPerc: function (values, fromCoolerImage) {
		var toReturn = values.PurityPercentage;
		toReturn = isNaN(toReturn) || toReturn == null ? 0 : toReturn;
		if (toReturn === 100) {
			toReturn = '<div class="cooler-list-labelblack">' + toReturn + ' %</div>';
		}
		else {
			toReturn = '<div class="cooler-list-labelblack">' + toReturn + ' %</div>';
		}
		return toReturn;
	},
	getStockPerc: function (values, fromCoolerImage) {
		//TODO: Color based on threshold
		var toReturn = values.StockPercentage;
		toReturn = isNaN(toReturn) || toReturn == null ? 0 : toReturn;
		toReturn = toReturn + ' %';

		return '<div class="cooler-list-labelblack">' + toReturn + '</div>';
	},
	getPlanogramCompliance: function (values) {
		var toReturn = values.PlanogramCompliance;
		toReturn = isNaN(toReturn) || toReturn == null ? 0 : toReturn;
		toReturn = toReturn + ' %';
		return '<div class="cooler-list-labelblack">' + toReturn + '</div>';
	},
	getDeviceMovement: function (values) {
		var toReturn = values.DeviceMovement;
		toReturn = isNaN(toReturn) || toReturn == null ? 0 : toReturn;
		toReturn = Math.round(toReturn / 60) + ' min.';
		return '<div class="cooler-list-labelblack">' + toReturn + '</div>';
	},
	getTemperatureText: function (values) {
		var toReturn = 'In Range';
		var temperature = values.Temperature;
		if (temperature < 2) {
			toReturn = '<div class="blue-text">Too Cold</div>';
		}
		else if (temperature > 7 && temperature < 10) {
			toReturn = 'Warm';
		}
		else if (temperature > 10) {
			toReturn = '<div class="blue-text">Too Hot</div>';
		}
		return toReturn
	},
	getHumidityText: function (values) {
		var toReturn = '<div class="blue-text">Dry</div>';
		if (values.Humidity > 6 && values.Humidity < 20) {
			toReturn = 'Normal';
		}
		else if (values.Humidity > 20 && values.Humidity < 40) {
			toReturn = '<div class="blue-text">Humid</div>';
		}
		else if (values.Humidity > 40 && values.Humidity < 80) {
			toReturn = '<div class="blue-text">High</div>';
		}
		else if (values.Humidity > 80) {
			toReturn = '<div class="blue-text">Very High</div>';
		}
		return toReturn
	},
	getLightIntensityText: function (values) {
		var toReturn;
		if (values.LightIntensity <= 10) {
			toReturn = '<div class="blue-text">Dark</div>';
		} else if (values.LightIntensity <= 20) {
			toReturn = 'Low';
		} else {
			toReturn = '<div class="blue-text">Bright</div>';
		}
		return toReturn;
	},
	coolerImageType: function (values) {
		if (values.LightIntensity <= 10 || values.LightIntensity > 20 || (values.Humidity > 20 && values.Humidity < 40) || (values.Humidity > 40 && values.Humidity < 80) || (values.Humidity > 80) || values.Temperature < 2 || values.Temperature > 7) {
			return "-blue";
		}
		else {
			return "";
		}
	},
	getPurityPercText: function (values, fromCoolerImage) {
		var toReturn = 'Impure';
		if (values.PurityPercentage === 100) {
			toReturn = 'Pure';
		}
		return toReturn;
	},
	getStockPercText: function (values, fromCoolerImage) {
		var spaces = values.TotalStock;
		var toReturn = values.StockPercentage;
		toReturn = isNaN(toReturn) || toReturn == null ? 0 : toReturn;

		if (toReturn >= 60) {
			toReturn = '<div class="cooler-list-labelblack">' + toReturn + '%</div>';
		}
		else {
			toReturn = '<div class="cooler-list-label">' + toReturn + '%</div>';
		}
		return toReturn;
	},

	getPurityStatus: function (values) {
		return values.PurityIssue ? 'Yes' : 'No';
	},
	getStatus: function (value) {
		return value ? 'Yes' : 'No';
	},
	getImgUrl: function (imageName, purityDateTime) {
		//To Do for small Image***
		return Df.App.getController('AssetPurity') + '?action=other&otherAction=Download&width=100&height=100&AssetImageName=' + imageName + '&PurityDateTime=' + purityDateTime;
	},
	getPurityValue: function (values, fromCoolerImage) {
		var toReturn;
		//if ForeignProduct == 0, show in Black else in Red
		if (values.ForeignProduct === 0) {
			toReturn = '<div class="cooler-list-labelblack">Pure</div>';
		}
		else {
			toReturn = '<div class="cooler-list-label">Impure</div>';
		}
		if (fromCoolerImage && values.IsVerified === false) {
			toReturn = '';
		}
		return toReturn;
	},
	getStockValue: function (values, fromCoolerImage) {

		var toReturn;
		if (values.ForeignProduct === null || values.ForeignProduct === 0) {
			toReturn = (0).toFixed(2);// to avoid divide by zero
		}
		toReturn = ((values.Stock - values.ForeignProduct));
		toReturn = isNaN(toReturn) ? 0 : toReturn;

		//if stock < 60% of Spaces, show in Red otherwise show in Black
		if (toReturn < 60) {
			toReturn = '<div class="cooler-list-label">' + toReturn + ' </div>';
		}
		else {
			toReturn = '<div class="cooler-list-labelblack">' + toReturn + ' </div>';
		}
		if (fromCoolerImage && values.IsVerified === false) {
			toReturn = '';
		}
		return toReturn;
	},
	dateRenderer: function (date, format, isShowTimeFirst) {
		if (!date) {
			return '';
		}
		var v = Ext.isDate(date) ? date : Ext.Date.parse(date, 'X');
		
		//v = CoolerIoTMobile.Util.dateLocalizer(v);
		var dateToRender = Ext.Date.format(v, format || CoolerIoTMobile.Localization.DateTimeWithSecondFormat).split(' ');
		var date = dateToRender[0];
		var time = dateToRender[1] + " " + dateToRender[2];
		var returnValue = '<div><div class="time-inline">' + date + '</div><div class="time-inline">' + time + '</div></div>';
		if (isShowTimeFirst) {
			returnValue = '<div><div class="time-inline">' + time + '</div><div class="time-inline">' + date + '</div></div>';
		}
		return returnValue;
	},
	dateRendererWithTimeZone: function (date, format, isShowTimeFirst) {
		if (!date) {
			return '';
		}
		var v = Ext.isDate(date) ? date : Ext.Date.parse(date, 'X');
		var dateToRender = Ext.Date.format(v, format || CoolerIoTMobile.Localization.DateTimeWithSecondFormat).split(' ');
		var date = dateToRender[0];
		var time = dateToRender[1] + " " + dateToRender[2];
		var timeZone = Ext.Date.format(v, "T");
		var returnValue = '<div><div class="time-inline">' + date + ' (' + timeZone + ')</div><div class="time-inline">' + time + '</div></div>';
		if (isShowTimeFirst) {
			returnValue = '<div><div class="time-inline">' + time + ' (' + timeZone + ')</div><div class="time-inline">' + date + '</div></div>';
		}
		return returnValue;
	},
	getEnvTemperatureImg: function (values) {
		var base = 'cooler-list-image-small';
		var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-inrangetemperature") + '">&nbsp;</div>';
		if (values.EnvTemperature < 35.6) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowtemperature") + '">&nbsp;</div>';
		}
		else if (values.EnvTemperature > 39.2) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, " cooler-list-hightemperature") + '">&nbsp;</div>';
		}
		return toReturn;
	},
	getEnvHumidityImg: function (values) {
		var base = 'cooler-list-image-small';
		if (values.EnvHumidity <= 25) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowhumidity") + '">&nbsp;</div>';
		}
		if (values.EnvHumidity <= 50 && values.EnvHumidity > 25) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-avragehumidity") + '">&nbsp;</div>';
		}
		if (values.EnvHumidity <= 75 && values.EnvHumidity > 50) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-aboveavragehumidity") + '">&nbsp;</div>';
		}
		if (values.EnvHumidity > 75) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-highhumidity") + '">&nbsp;</div>';
		}
		return toReturn;
	},
	getTemperatureImg: function (values, baseCls) {
		var base = baseCls || 'cooler-list-image-small';
		var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-inrangetemperature") + '">&nbsp;</div>';
		if (values.Temperature < 35.6) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowtemperature") + '">&nbsp;</div>';
		}
		else if (values.Temperature > 39.2) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, " cooler-list-hightemperature") + '">&nbsp;</div>';
		}
		return toReturn;
	},
	getHumidityImg: function (values, baseCls) {
		var base = baseCls || 'cooler-list-image-small';
		if (values.Humidity <= 25) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowhumidity") + '">&nbsp;</div>';
		}
		if (values.Humidity <= 50 && values.Humidity > 25) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-avragehumidity") + '">&nbsp;</div>';
		}
		if (values.Humidity <= 75 && values.Humidity > 50) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-aboveavragehumidity") + '">&nbsp;</div>';
		}
		if (values.Humidity > 75) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-highhumidity") + '">&nbsp;</div>';
		}
		return toReturn;
	},
	getPurityImg: function (values, baseCls) {
		var purityPerc = values.PurityPercentage;
		var base = baseCls || 'cooler-list-image-small';
		var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity25") + '">&nbsp;</div>';
		if (purityPerc > 25 && purityPerc <= 50)
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity50") + '">&nbsp;</div>';
		else if (purityPerc > 50 && purityPerc <= 75)
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity75") + '">&nbsp;</div>';
		else if (purityPerc > 75)
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity100") + '">&nbsp;</div>';

		return toReturn;
	},
	getPowerImg: function (values, baseCls) {
		var isPowerOn = values.IsPowerOn;
		var base = baseCls || 'cooler-list-image-small';
		var toReturn = '';
		if (isPowerOn) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-powerOn") + '">&nbsp;</div>';
		}
		else {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-powerOff") + '">&nbsp;</div>';
		}

		return toReturn;
	},
	getPowerText: function (values, baseCls) {
		return values.IsPowerOn ? 'ON' : 'OFF';
	},
	getLocationAddress: function (values) {
		var result = '';
		if (values.Street)
			result += values.Street;
		if (values.Street2)
			result += ', ' + values.Street2;
		if (values.Street3)
			result += ', ' + values.Street3;
		if (values.City)
			result += ', ' + values.City;
		if (values.Zip)
			result += ' - ' + values.Zip;

		return result;
	},
	getLightImg: function (values, baseCls) {
		var base = baseCls || 'cooler-list-image-small';
		var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-brightlight") + '">&nbsp;</div>';
		if (values.LightIntensity <= 10)
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, " cooler-list-darklight") + '">&nbsp;</div>';
		else if (values.LightIntensity > 10 && values.LightIntensity < 50)
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowlight") + '">&nbsp;</div>';

		return toReturn;
	},
	getStockImg: function (values, baseCls) {;
		var stockPerc = values.StockPercentage;

		var base = baseCls || 'cooler-list-image-small';
		var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock100") + '">&nbsp;</div>'

		if (stockPerc <= 25) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock25") + '">&nbsp;</div>'
		} else if (stockPerc > 25 && stockPerc <= 50) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock50") + '">&nbsp;</div>'
		} else if (stockPerc > 50 && stockPerc <= 75) {
			toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock75") + '">&nbsp;</div>'
		}
		return toReturn;
	},
	actionDateRenderer: function (value) {
		if (value) {
			var date = new Date(value);
			return Ext.Date.format(date, 'dm');
		}
	},
	routeDateRenderer: function (value) {
		if (value) {
			var date = new Date(value),
				currentDate = new Date();
			if (Ext.Date.format(currentDate, 'dm') == Ext.Date.format(date, 'dm'))
				return 'Today';
			else
				return Ext.Date.format(date, 'dm');
		}
	},
	alertText: function (value) {
		return value.split(':')[0];
	},
	getAlertTypeImg: function (values) {
		var base = 'cooler-list-image-small';
		toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-alerttype" + values.AlertTypeId) + '">&nbsp;</div>';
		return toReturn;
	},
	getUUIDText: function (values) {
		var UuidValue = values.ManufacturerUUID;

		if (!UuidValue)
			return "";

		var result = UuidValue.replace(/ +/g, "");
		result = result.toUpperCase();
		return result;
	},
	getConnectionStatus: function (values) {
		return values.IsConnected ? "Connected" : "Disconnected";
	},
	renderDeviceData: function (values) {

		var template = null;

		switch (values.RecordType) {
			case CoolerIoTMobile.RecordTypes.HELTHY_EVENT:

				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
	            '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Temperature + ':</td><td class="device-data-value">{TemperatureValue}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Humidity + ':</td><td class="device-data-value">{HumidityValue} %rH</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.AmbientLight + ':</td><td class="device-data-value">{AmbientlightValue} lux</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.BatteryLevel + ':</td><td class="device-data-value">{BatteryLevel}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
                '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.LINEAR_MOTION:

				var measurement = "N/A";
				if (values.DistanceMsb == 0)
					measurement = "cm";
				if (values.DistanceMsb == 1)
					measurement = "m";

				if (values.DistanceMsb > 1) {
					var distMsb = CoolerIoTMobile.util.Utility.dec2Bin(values.DistanceMsb).substring(0, 2);
					if (distMsb === "00")
						measurement = "cm";
					if (distMsb === "01")
						measurement = "m";
					if (distMsb === "10")
						measurement = "ft";
				}

				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
	            '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Distance + ':</td><td class="device-data-value">{DistanceLsb} ' + measurement + '</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Angle + ':</td><td class="device-data-value">{Angle}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.MagnetX + ':</td><td class="device-data-value">{MagnetX}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.MagnetY + ':</td><td class="device-data-value">{MagnetY}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
                '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.ANGULAR_MOTION:

				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
	            '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.PosXNegX + ':</td><td class="device-data-value">{PosX}/ {NegX}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.PosYNegY + ':</td><td class="device-data-value">{PosY}/ {NegY}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.PosZNegZ + ':</td><td class="device-data-value">{PosZ}/ {NegZ}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
                '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.MAGNET_MOTION:
				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
	            '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.MagnetX + ':</td><td class="device-data-value">{MagnetX}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.MagnetY + ':</td><td class="device-data-value">{MagnetY}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.MagnetZ + ':</td><td class="device-data-value">{MagnetZ}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
                '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.DOOR_EVENT:
				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
               '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.IMAGE_EVENT:
				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Sequence + ':</td><td class="device-data-value">{Sequence}</td></tr>',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Angle + ':</td><td class="device-data-value">{Angle}</td></tr>',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Address + ':</td><td class="device-data-value">{Address}</td></tr>',
               '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
               '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.GPS_EVENT:
				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
	            '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Latitude + ':</td><td class="device-data-value">{Latitude}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Longitude + ':</td><td class="device-data-value">{Longitude}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
                '</table>');
				break;
			case CoolerIoTMobile.RecordTypes.MOTION_TIME:
				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
	            '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.StartTimeMovement + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.StartTimeMovement) + '</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Duration + ':</td><td class="device-data-value">{DurationMovement}</td></tr>',
                '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
                '</table>');
				break;
			default:
				template = Ext.XTemplate.create('<table style="margin-left: 10px; width:100%">',
              '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.RecordType + '</td><td class="device-data-value">{RecordTypeText}</td></tr>',
              '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Door + ':</td><td class="device-data-value">{DoorStatus}</td></tr>',
              '<tr><td class="device-data-subtitle">' + CoolerIoTMobile.Localization.Time + ':</td><td class="device-data-value">' + CoolerIoTMobile.util.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>',
              '</table>');
				break;
		}

		return template.apply(values);
	},
	checkCondition: function (values, condition, type) {
		var varType;
		switch (type) {
			case 1: varType = values.TemperatureOutOfBounds
				break;
			case 2: varType = values.LightOutOfBounds
				break;
			case 3: varType = values.PowerOff
				break;
			case 4: varType = values.MovementOutOfBounds
				break;
		}

		switch (condition) {
			case 1: return varType > 0 && values.RecordCount != 0;
				break;
			case 2: return varType <= 0 && values.RecordCount != 0;
				break;
			case 3: return values.RecordCount == 0;
				break;
		}
	},
	formatDate: function (input) {
		var date = new Date(input.slice(0, 4), input.slice(4, 6) - 1, input.slice(6, 8), input.slice(8, 10), input.slice(10, 12), input.slice(12, 14));
		return Ext.Date.format(date, "D d");
	},
	getLinkId: function (values, items) {
		var result = Ext.id();
		Ext.Function.defer(this.addListener, 1, this, [result, values, items]);
		return result;
	},
	addListener: function (id, values, recordType) {
		var input = recordType,
		chart = input == 0 ? Ext.ComponentQuery.query('[itemId=summary-chart]') : Ext.ComponentQuery.query('[itemId=health-distribution-chart]'),
		hiddenChart = input != 0 ? Ext.ComponentQuery.query('[itemId=summary-chart]') : Ext.ComponentQuery.query('[itemId=health-distribution-chart]'),
		healthContainer = Ext.ComponentQuery.query('[itemId=healthSummary]')[0];
		Ext.get(id).on('tap', function (e) {
			e.stopEvent();
			healthContainer.setHeight(600);
			var chartProperty = chart[0], selectedChartDate, selectedDate, assetId, action, chartType;
			chartProperty.setHidden(false);
			hiddenChart[0].setHidden(true);
			if (values.Date) {
				selectedChartDate = values.Date;
				selectedDate = (selectedChartDate.slice(0, 4)) + '-' + (selectedChartDate.slice(4, 6)) + '-' + (selectedChartDate.slice(6, 8));
				assetId = values.AssetId;
			}
			else {
				assetId = values.records[0].AssetId;
			}

			switch (input) {
				case 0:
					action = "GetChartData";
					chartType = "Summary";
					break;
				case 1:
					action = "HealthChartData";
					chartType = "Temperature";
					break;
				case 2:
					action = "HealthChartData";
					chartType = "Light Intensity";
					break;
				case 3:
					action = "DoorChartData";
					chartType = "Door Chart";
					break;
			}
			this.chartRender(action, chartType, selectedDate, assetId, chart);
			this.chartCaption(chartProperty, chartType, selectedDate);
		}, this);
	},
	chartCaption: function (chartProperty, chartType, selectedDate) {
		var caption = chartType + ' ' + (Ext.isEmpty(selectedDate) ? 'For Week' : selectedDate);
		chartProperty.setChartTitle(caption);
	},
	chartRender: function (action, chartType, selectedDate, assetId, chart) {
		var chartData = [];
		var params = {
			AssetId: assetId,
			IgnoreOutOfBusinessHours: false,
			IsWeeklyData: false,
			action: action,
			DataDate: selectedDate
		};
		Ext.Ajax.request({
			url: Df.App.getController('CoolerTrackingDetail'),
			params: params,
			success: function (response) {
				var responseData = Ext.decode(response.responseText), params = response.request.options.params, forWeek = Ext.isEmpty(params.DataDate) ? true : false, weeklyData;

				if (chartType != 'Summary') {
					Ext.each(responseData.records, function (item) {
						switch (chartType) {
							case 'Temperature':
								eventTime = this.chartTimeFormat(item.EventTime);
								data = item.Temperature;
								break;
							case 'Light Intensity':
								eventTime = this.chartTimeFormat(item.EventTime);
								data = item.LightIntensity;
								break;
							case 'Door Chart':
								eventTime = this.chartTimeFormat(item.SlotDescription);
								data = item.DoorCount;
								break;
						}
						weeklyData = '';
						if (!forWeek) {
							eventTime = Ext.Date.format(eventTime, 'H:i ');
						}
							/*it run for weekly data i.e on icon click*/
						else {
							eventDate = eventTime;
							eventTime = Ext.Date.format(eventTime, 'd-M H:i');
							weeklyData = chartData.filter(function (obj) {
								return obj.eventDate === eventDate;
							})[0];
						}
						if (Ext.isEmpty(weeklyData)) {
							chartData.push({ label: eventTime, value: data, toolText: "Time: " + eventTime + ", Value: " + data, eventDate: eventTime });
						}
						else {
							weeklyData.value = chartType == 'Door Chart' ? weeklyData.value + data : chartType == 'Light Intensity' ? weeklyData.value < data ? weeklyData.value : data : weeklyData.value > data ? weeklyData.value : data;
							weeklyData.toolText = "Time: " + weeklyData.label + ", Value: " + weeklyData.value;
						}
					}, this);
				}
				chart[0].setData(chartType != 'Summary' ? chartData : responseData.records, chartType);
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Data not loaded');
			},
			scope: this
		});
	},
	chartTimeFormat: function (input) {
		return date = new Date(input.slice(0, 4), input.slice(4, 6) - 1, input.slice(6, 8), input.slice(8, 10), input.slice(10, 12), input.slice(12, 14));
	},
	DateTimeFormat: function (value, p, r) {
		if (Ext.isDate(value)) {
			return Ext.Date.format(value, CoolerIoTMobile.Localization.MonthDateTimeFormat);
		}
		return "&nbsp;";
	},
	CovertUTCToLocalDate: function (value, p, r) {
		if (Ext.isDate(value)) {
			value = CoolerIoTMobile.Util.dateLocalizer(value);//Change UTC datetime to local datetime
			return Ext.Date.format(value, 'm/d/Y h:i:s A');
		}
		return "&nbsp;";
	},
	alertType: function (val) {
		var baseUrl = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 ? ServerSettings.url : ".."
		return Ext.String.format("{0}/images/AlertType/{1}{2}", baseUrl, val, ".png");
	},
	alertPriority: function (value, p) {
		return value == p;
	},
	alertCount: function (value) {
		return value != 0 && value != undefined;
	},
	consumerApiUrl: function (url) {
		var url = Df.App.getController(url);
		url = url.replace(".ashx", "");
		return url;
	},
	orderStatus: function (value, metadata) {
		var classValue, val;
		switch (value) {
			case CoolerIoTMobile.Enums.OrderStatus.New:
				classValue = 'priorityHigh';
				val = 'New';
				break;
			case CoolerIoTMobile.Enums.OrderStatus.Progress:
				classValue = 'priorityMedium';
				val = 'Progress';
				break
			case CoolerIoTMobile.Enums.OrderStatus.Completed:
				classValue = 'priorityLow';
				val = 'Completed';
		}
		return '<div class="' + classValue + '">' + val + '</div>';
	},
	orderNumber: function (value) {
		return Ext.String.format('Order-{0}', value);
	}
});