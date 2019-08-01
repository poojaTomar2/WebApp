Ext.define('CoolerIoTMobile.util.Utility', {
	singleton: true,
	isSetBulkCommandExecution: false,
	takePictureAfterImageCalibration: false,
	defaultMacAddress: '6C:19:8F:0D:59:2A',
	isManualFactorySetup: false,
	isInstallDevice: false,
	isFromInstallDevice: false,
	InstallDeviceSerialNumber: '0',
	Base64: { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } },
	getPasswordBytes: function (password) {
		var buffer = CoolerIoTMobile.util.Utility.stringToBytes(password);
		var passwordBytes = new Uint8Array(buffer);
		var bytes = [];
		for (var i = 0; i < 19; i++) {

			if (i < passwordBytes.length)
				bytes[i] = passwordBytes[i];
			else
				bytes[i] = 0;
		}

		return bytes;
	},
	bytesToHex: function (buffer, start, end) {
		var bytes = new Uint8Array(buffer);
		var result = "";
		var len = end ? end : bytes.length;
		for (var i = start || 0; i < len; i++) {
			result += bytes[i].toString(16);
		}
		return result;
	},
	base64ToArrayBuffer: function (string) {
		var binaryString = window.atob(string);
		var len = binaryString.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	},
	bytesToEncodedString: function (bytes) {
		return btoa(String.fromCharCode.apply(null, bytes));
	},
	encodedStringToBytes: function (string) {
		var data = atob(string);
		var bytes = new Uint8Array(data.length);
		for (var i = 0; i < bytes.length; i++) {
			bytes[i] = data.charCodeAt(i);
		}
		return bytes;
	},
	arrayBufferToBase64: function (arrayBuffer) {
		return window.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
	},
	bytesToString: function (buffer) {
		return String.fromCharCode.apply(null, new Uint8Array(buffer));
	},
	stringToBytes: function (string) {
		var array = new Uint8Array(string.length);
		for (var i = 0, l = string.length; i < l; i++) {
			array[i] = string.charCodeAt(i);
		}
		return array.buffer;
	},
	base64ToHex: function (str, start, end) {
		for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
			var tmp = bin.charCodeAt(i).toString(16);
			if (tmp.length === 1) tmp = "0" + tmp;
			hex[hex.length] = tmp;
		}
		if (start)
			return Ext.Array.toArray(hex, start, end ? end : hex.length).join(" ");

		return hex.join(" ");
	},
	hexStringToByteArray: function (value) {
		var len = value.length;
		var array = new Uint8Array(len / 2);
		for (var i = 0; i < len; i += 2) {
			array[i / 2] = ((parseInt(value.charAt(i), 16) << 4) + parseInt(value.charAt(i + 1), 16));
		}
		return array.buffer;
	},
	readWord: function (bytes) {
		return bytes[0] + bytes[1] * 256;
	},
	readThreeByte: function (bytes) {
		return bytes[0] + bytes[1] * 256 + bytes[2] * 256 * 256;
	},
	readFourByte: function (bytes) {
		return bytes[0] + bytes[1] * 256 + bytes[2] * 256 * 256 + bytes[3] * 256 * 256 * 256;
	},
	readSingle: function (bytes) {
		return bytes[0];
	},
	readWordReverse: function (bytes) {
		return bytes[0] * 256 + bytes[1];
	},
	isInt: function (n) {
		return Number(n) === n && n % 1 === 0;
	},
	getDateFromMilliseconds: function (val) {
		if (!val)
			return null;

		var date = new Date(val * 1000);
		return Ext.Date.format(date, CoolerIoTMobile.Localization.DateTimeWithSecondFormat);
	},
	decimalToBytes: function (val, len) {
		var bytes = [];
		var i = len;
		do {
			bytes[--i] = val & (255);
			val = val >> 8;
		} while (i)
		return bytes;
	},
	dec2Bin: function (dec) {
		if (dec >= 0) {
			return dec.toString(2);
		}
		else {
			/* Here you could represent the number in 2s compliment but this is not what 
			   JS uses as its not sure how many bits are in your number range. There are 
			   some suggestions http://stackoverflow.com/questions/10936600/javascript-decimal-to-binary-64-bit 
			*/
			return (~dec).toString(2);
		}
	},
	/**
	* @method getResultRecord
	* Returns the combined record from the result data.
	* @param {Object} selectedRecord.
	* @param {Object} result from server call.
	* @return {Ext.data.Record} returns the combined result.
	*/
	getResultRecord: function (selectedRecord, result) {
		var data = Ext.apply(result.data, Ext.decode("{" + selectedRecord.getIdProperty() + " : " + result.data.Id + " }"));
		return Ext.applyIf(selectedRecord.stores[0].getModel().create(data), { stores: [selectedRecord.stores[0]] });
	},
	IsMatch: function (array, position, candidate) {
		if (candidate.length > (array.length - position)) {
			return false;
		}

		for (var i = 0; i < candidate.length; i++) {
			if (array[position + i] != candidate[i]) {
				return false;
			}
		}
		return true;
	},
	getDeviceDateFromMilliseconds: function (val) {
		if (!val)
			return null;

		var date = new Date(val * 1000);
		return Ext.Date.format(date, CoolerIoTMobile.Localization.DateWithSecondFormat);
	},
	logDeviceInfo: function (serviceType, status) {
		var store = Ext.getStore('DeviceLogs');
		var record = store.getModel().create({ EventTime: Ext.Date.format(new Date(), "m/d h:i:s"), ServiceType: serviceType, Status: status });
		store.add(record);
		FileIO.logsData.EventTime = new Date();
		FileIO.logsData.ServiceType = serviceType;
		FileIO.logsData.Status = status;
		FileIO.saveLogs();
	},
	sendRegistrationRequest: function (regid, userId) {
		var platform;
		switch (Ext.os.name) {
			case 'iOS':
				platform = 'apns';
				break;
			case 'Android':
				platform = 'gcm';
				break;
			case 'WindowsPhone':
				platform = 'wns';
				break;
		}
		Ext.Ajax.request({
			url: Df.App.getController('NotificationRecipient', true),
			params: {
				Platform: platform,
				action: 'other',
				otherAction: 'NotificationRegister',
				tags: 'UserId_' + userId,
				uuid: device.uuid,
				Handle: regid
			},
			scope: this
		});
	},
	/*Creating pop over just like toast in android .*/
	createPopoverNotification: function (message) {
		if (CoolerIoTMobile.util.Utility.popoverPanel) {
			CoolerIoTMobile.util.Utility.popoverPanel.destroy();
		}
		var popoverPanel = new Ext.Panel({
			width: '60%',
			height: 45,
			hideOnMaskTap: false,
			html: message,
			baseCls: 'popupOver-notification',
			listeners: [
					{
						element: 'element',
						event: 'tap',
						fn: function () {
							this.hide({ type: 'fadeOut', duration: 500 });
							var view = Ext.ComponentQuery.query('#mainNavigationView')[0], list;
							if (view) {
								var activeView = view.getActiveItem();
								var grid = Ext.ComponentQuery.query('alert-list')[0];
								if (grid) {
									var store = grid.getStore();
									var listPlugin = grid.getPlugins()[0];
									list = listPlugin.getList();
									// count total loaded records here
									var totalItemloaded = list.itemsCount;
									var currentPage = list.getStore().currentPage;
									var storeProxy = store.getProxy();
									// load store with specific start and end 
									storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: totalItemloaded });
									store.loadPage(1);
									// again set limit 25 to make work List paging
									storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: 25 });
									list.getStore().currentPage = currentPage;
								}
								else {
									list = Ext.ComponentMgr.create({ xtype: 'alert-list-base' });
									if (activeView.config.xtype != list.config.xtype) {
										view.setActiveItem(list);
									}
								}
							}
						}
					}
			]
		});
		Ext.Viewport.add(popoverPanel);
		popoverPanel.show({ type: 'fadeIn', duration: 400 });
		CoolerIoTMobile.util.Utility.popoverPanel = popoverPanel;
		Ext.defer(function () {
			popoverPanel.hide({ type: 'fadeOut' });
		}, 3000, this);
	}
});