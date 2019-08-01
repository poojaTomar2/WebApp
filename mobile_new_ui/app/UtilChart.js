Ext.define('CoolerIoTMobile.UtilChart', {
	singleton: true,
	createMultiSeriesBySum: function (options) {

		var categories = [];
		var categoryNames = [];
		var data = options.data;
		var categoryField = options.categoryField;
		var seriesIdField = options.seriesIdField;
		var seriesNameField = options.seriesNameField || seriesIdField;
		var valueField = options.valueField;
		var dataset = [];
		var serieses = {};
		var seriesInfo = {};

		for (var index = 0, recordCount = data.length; index < recordCount; index++) {
			var record = data[index];
			var category = record[categoryField];
			if (categoryNames.indexOf(category) === -1) {
				categories.push({ label: category });
				categoryNames.push(category);
			}
		}

		for (var index = 0, recordCount = data.length; index < recordCount; index++) {
			var record = data[index];
			var seriesId = record[seriesIdField];
			var category = record[categoryField];
			seriesInfo = serieses[seriesId];
			if (!seriesInfo) {
				seriesInfo = { seriesname: record[seriesNameField], data: [] };
				for (var i = 0, len = categories.length; i < len; i++) {
					seriesInfo.data[i] = { value: 0 };
				}
				serieses[seriesId] = seriesInfo;
				dataset.push(seriesInfo);
			}
			seriesInfo.data[categoryNames.indexOf(category)].value += record[valueField];
		}

		return {
			categories: [
				{
					category: categories
				}
			],
			dataset: dataset
		};
	},

	createMultiSeries: function (options) {

		var categories = [];
		var categoryNames = [];
		var data = options.data;
		var categoryField = options.categoryField;
		var seriesDetails = options.seriesDetails;
		var categoryNameFn = options.categoryNameFn || function (values, category) { return category; };
		var dataset = [];
		var serieses = {};
		var seriesInfo = {};

		for (var index = 0, recordCount = data.length; index < recordCount; index++) {
			var record = data[index];
			var category = record[categoryField];
			if (categoryNames.indexOf(category) === -1) {
				categories.push({ label: categoryNameFn(record, category) });
				categoryNames.push(category);
			}
		}

		for (var index = 0, recordCount = seriesDetails.length; index < recordCount; index++) {
			var seriesId = seriesDetails[index].field;
			seriesInfo = { seriesname: seriesDetails[index].label, data: [] };
			serieses[seriesId] = seriesInfo;
			dataset.push(seriesInfo);
		}

		for (var index = 0, recordCount = data.length; index < recordCount; index++) {
			var record = data[index];
			for (var seriesIndex = 0, seriesCount = seriesDetails.length; seriesIndex < seriesCount; seriesIndex++) {
				var seriesId = seriesDetails[seriesIndex].field;
				seriesInfo = serieses[seriesId];
				seriesInfo.data.push({ value: record[seriesId] });
			}
		}

		return {
			categories: [
				{
					category: categories
				}
			],
			dataset: dataset
		};
	}
});