Ext.define('CoolerIoTMobile.Util', {

	requires: [
		'Ext.DateExtras',
		'Ext.data.Field'
	],

	mixins: [
		'Ext.mixin.Observable'
	],
	singleton: true,
	constructor: function (config) {
		this.applyDefaultDateFormat();

		Number.prototype.toHourMinute = function () {
			var value = this;
			var negative = value < 0;
			value = Math.abs(value);
			var hours = Math.floor(value / 60);
			var minutes = Math.floor(value - hours * 60);
			var rValue = (negative ? "-" : "") + Ext.util.Format.leftPad(hours.toString(), 2, '0') + ':' + Ext.util.Format.leftPad(minutes.toString(), 2, '0');
			rValue = rValue.indexOf("NaN") > -1 ? "0:00" : rValue;
			return rValue;
		};

		this.initConfig(config);
	},

	applyDefaultDateFormat: function () {
		Ext.DateExtras.parseCodes.X = {
			g: 1,
			c: "y = parseInt(results[1], 10); m = parseInt(results[2], 10) - 1; d = parseInt(results[3], 10); h = parseInt(results[4], 10); i = parseInt(results[5], 10); s = parseInt(results[6], 10); ms = parseInt(results[7], 10);",
			s: "(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{3})"
		};
		Ext.data.Field.prototype._dateFormat = 'X';

		Ext.DateExtras.parseFunctions.XL = function (input, strict) {
			// note: the timezone offset is ignored since the MS Ajax server sends
			// a UTC milliseconds-since-Unix-epoch value (negative values are allowed)
			var re = new RegExp('(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{3})');
			var r = (input || '').match(re);
			if (r) {
				return new Date(Date.UTC(Number(r[1]), Number(r[2] - 1), Number(r[3]), Number(r[4]), Number(r[5]), Number(r[6])))
			}
			return null;
		};

		this.setDateFormat('m/d/Y', 'H:i');
	},

	dateFormat: "m/d/Y",
	timeFormat: "H:i",
	dateTimeFormat: "m/d/Y H:i",
	longDateFormat: null,
	stopCaseDetailRefresh: true,
	configurableCleaningTime: 0,
	BaseSerialNumber: 31657719406704,
	dateLocalizer: function (v) {
		if (!v) {
			return '';
		}
		if (Ext.isDate(v)) {
			v = Ext.Date.add(v, Ext.Date.MINUTE, -v.getTimezoneOffset())
		}
		return v;
	},

	setDateFormat: function (dateFormat, timeFormat) {
		this.dateFormat = dateFormat;
		this.timeFormat = timeFormat;
		if (timeFormat === "h:ia") {
			this.longTimeFormat = "H:i:sa";
		}
		else {
			this.longTimeFormat = timeFormat + ":s";
		}
		this.dateTimeFormat = dateFormat + ' ' + timeFormat;
		this.longDateFormat = dateFormat + ' ' + this.longTimeFormat;
		this.shortDateTimeFormat = "m/d " + timeFormat;
	},

	functionalityNotImplemented: function () {
		Ext.Msg.alert('Alert', 'Functionality not implemented');
	},
	showForgotPasswordForm: function () {
		var win = Ext.Viewport.getActiveItem();
		!Ext.isEmpty(win) ? win.setActiveItem(1) : '';
	},
	showFormBeforeLogin: function (className) {
		var win = Ext.Viewport.add(Ext.create(className));
		win.show();
	},
	showActionUpdateWindow: function (alertStatusHide, toDoActionHide, data) {
		var alertActionId = 0;
		var alertId = data.alert ? data.alert.AlertId : data.get('AlertId');
		if (data.data)
			alertActionId = data.data.AlertActionId;
		if (data.action)
			alertActionId = data.action.AlertActionId;

		var updateWindow = Ext.Viewport.add({
			xtype: 'mobile-alertaction-win',
			alertActionId: alertActionId,
			args: data,
			alertId: alertId,
			callback: this.onComplete,
			windowScope: this
		});
		if (data.data.AlertActionId)
			updateWindow.setValues(data.data);
		if (data.action)
			updateWindow.setValues(data.action);

		updateWindow.show();
		var statusCombo = updateWindow.getFields('StatusId');
		statusCombo.setHidden(alertStatusHide);
		var toActionCombo = updateWindow.getFields('ToDoActionId');
		toActionCombo.setHidden(toDoActionHide);
	},
	onComplete: function () {
		var toDoList = Ext.ComponentQuery.query('mobile-toDoList')[0];
		if (toDoList) {
			toDoList.getStore().load();
		}
	},
	addViewWithDynamicItems: function (view, items) {
		if (items[1].html == "Image Calibration") {
			items[0].items[0].text = "Take Picture";
		}
		else {
			items[0].items[0].text = "Set";
		}
		var win = Ext.Viewport.add(Ext.create(view, { items: items }));
		win.show();
	},
	isPhoneGap: function () {
		return !!window.cordova;
	},
	getDatabase: function () {
		var me = this, database;

		if (me.database)
			return me.database;

		var databaseOptions = {
			name: 'my.db',
			createFromLocation: 1
		};

		if (me.isPhoneGap()) {
			database = window.sqlitePlugin.openDatabase(databaseOptions);
		} else {
			return false;
		}
		me.database = database;
		return database;
	},

	execute: function (query, params) {
		var me = this;
		return new Promise(function (resolve, reject) {
			var db = CoolerIoTMobile.Util.getDatabase(), value;
			if (typeof (query) === "string")
				value = { query: query, params: params };
			else if (query && query.length === 0) {
				resolve({}, { rows: [] });
				return;
			}

			db.transaction(
				function (transaction) {
					var res = [];
					transaction.executeSql((value.query), value.params,
						function (transaction, results) {
							res.push(arguments);
							resolve(res.length === 1 ? res[0] : res);
						},
						function (transaction, error) {
							reject(error);
							me.errorHandler(error, query);
						}
					);

				},
				function (error) {
					console.error(error && error.message ? error.message : 'Transaction error');
					console.log(query);
					reject(error);
				}
			);
		})['catch'](function (args) {
			me.errorHandler(args);
		});
	},
	errorHandler: function (error, query) {
		console.log('Error in query - ' + query + ', ' + JSON.stringify(error));
	},
	getResultAsArray: function (res) {
		if (res.length === 0)
			return [];

		var jsonData = [], me = this;
		var isPhoneGap = CoolerIoTMobile.Util.isPhoneGap();
		var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
		for (var i = 0, len = res.length; i < len; i++) {
			jsonData.push((isPhoneGap || isSafari) ? res.item(i) : res[i]);
		}
		return jsonData;
	},
	machexToBytes: function (hex) {
		hex = hex.replace(/:/g, "");
		var length = hex.length / 2;
		var macAddressBytes = new Uint8Array(length);
		for (var i = 0; i < length; i++) {
			var str = hex.substring(i * 2, i * 2 + 2);
			var hexPart = parseInt(str, 16);
			macAddressBytes[i] = hexPart & 255;//this.byteValue(hexPart);
		}
		return macAddressBytes;
	},
	byteValue: function (n) {
		if (n > 127) {
			n = -((n & 127) ^ 127) - 1;
		}
		return n;
	},
	getUInt32: function (value) {
		var bytes = new Array();
		for (i = 0; i < 4; i++) {
			bytes[i] = (value >> (8 * i)) & 0xff;
		}
		return bytes;
	},
	// Convert a byte array to a hex string
	bytesToHex: function (bytes) {
		for (var hex = [], i = 0; i < bytes.length; i++) {
			hex.push((bytes[i] >>> 4).toString(16));
			hex.push((bytes[i] & 0xF).toString(16));
		}
		return hex.join("");
	},

	// Convert a hex string to a byte array
	hexToBytes: function (hex) {
		for (var bytes = [], c = 0; c < hex.length; c += 2)
			bytes.push(parseInt(hex.substr(c, 2), 16));
		return bytes;
	}
});
