Ext.define('CoolerIoTMobile.controller.ProvisionNewDevice', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			provisionNewDeviceScreen: 'provisionNewDevice',
			scanningWindow: 'scanningDevicePanel',
			bluetooth: 'ble-bluetoothLe#coolerIotDeviceActor',
			debugDeviceContainer: 'debugDeviceContainer',
			mainNavigationView: 'mobile-main #mainNavigationView',
			assetLocation: 'asset-location',
			assetLocationList: 'assetLocationList',
			'searchbox': 'asset-location #searchAssetLocationField'
		},
		control: {
			'provisionNewDevice #submitButton': {
				singletap: 'onActioUpdateSave'
			},
			'provisionNewDevice #smartDeviceSerialBarcode': {
				tap: 'openBarcodeScan'
			},
			'provisionNewDevice #assetSerialBarcode': {
				tap: 'openBarcodeScan'
			},
			'asset-location #searchAssetLocationField': {
				keyup: 'onLocationSearch',
				clearicontap: 'onLocationSearch'
			},
			'asset-location #addAssetLocation': {
				tap: 'onAddAssetLocation'
			},
			'asset-location #cancelAssetLocation': {
				tap: 'onCancelAssetLocation'
			}
		}
	},
	onCancelAssetLocation: function(){
		this.getAssetLocation().hide();
	},
	onAddAssetLocation: function(){
		this.getAssetLocation().hide();
		var locationName;
		var list = this.getAssetLocationList();
		var store = list.getStore();
		if (list.getSelection().length > 0 && store.getCount() > 0) {
			locationName = list.getSelection()[0].get('Name');
		} else {
			locationName = this.getSearchbox().getValue();
		}
		Ext.apply(this.params, {
			location: locationName,
			isAutoCreateAsset : true
		})
		this.processProvision(this.smartDeviceSerial, this.params);
	},
	onLocationSearch: function () {
		if (!this.searchTask) {
			this.searchTask = new Ext.util.DelayedTask(this.doLocationSearch, this);
		}
		this.searchTask.delay(500);
	},
	doLocationSearch: function () {
		var value = this.getSearchbox().getValue();
		var assetList = this.getAssetLocationList();
		var store = assetList.getStore();
		assetList.setLoadingText("");
		store.getProxy().setExtraParam('locationName', '%' + value);
		store.load();
	},
	openBarcodeScan: function (source) {
		if (Df.App.isPhoneGap) {
			var provisionScreen = this.getProvisionNewDeviceScreen();
			var field = source.getItemId();
			field = field.split('Barcode')[0];
			Ext.device.Scanner.scan({
				success: function (results) {
					if (!results.cancelled) {
						var currentField = provisionScreen.getFields(field);
						currentField.setValue(results.text);
					}
					else {
						Ext.Msg.alert('Alert', 'Scan cancelled by user');
					}
				},
				failure: function (error) {
					Ext.Msg.alert('Error', 'Scanning failed' + error);
				}, scope: this
			});
		}
		else {
			Ext.Msg.alert('Error', 'This feature is not available for web version');
		}
	},
	onActioUpdateSave: function () {
		var updateWindow = this.getProvisionNewDeviceScreen(),
		form = updateWindow,
		//assetSerial = form.getFields('assetTextField').getValue();
		assetSerial = form.getFields('assetSerial').getValue();
		smartDeviceSerial = form.getFields('smartDeviceSerial').getValue();
		this.smartDeviceSerial = smartDeviceSerial;
		var params = { action: 'provisionedDevice', assetSerialNumber: assetSerial, deviceSerialNumber: smartDeviceSerial, isAutoCreateAsset: false };
		this.params = params;
		if (Ext.os.is('phone')) {
			var deviceLatitude = CoolerIoTMobile.DeviceLatitude;
			var deviceLongitude = CoolerIoTMobile.DeviceLongitude;
			Ext.apply(params, {
				deviceLatitude: deviceLatitude,
				deviceLongitude: deviceLongitude
			})
		}
		if (assetSerial == "" || smartDeviceSerial == "") {
			Ext.Msg.alert('Data Inappropriate', 'Please fill both fields.');
		}
		else {
			Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Processing..' });
			this.processProvision(smartDeviceSerial, params);
			
		}
	},
	processProvision: function (smartDeviceSerial, params) {
		Ext.Ajax.request({
			url: Df.App.getController('SmartDevice'),
			params: params,
			success: function (response) {
				var data = Ext.decode(response.responseText);
				Ext.Viewport.setMasked(false);
				if (data.success) {
					if (Df.App.isPhoneGap && data.data != 'Asset does not exist') {
						window.plugins.toast.show(data.data, 'short', 'bottom');
					}
					else {
						if (data.data == 'Asset does not exist') {
							//Show location form dropdown should be editable/searchable
							Ext.Msg.confirm('Confirmation', 'Asset does not exist, Do you want to create new asset', function (btn) {
								if (btn === 'yes') {
									var assetLocationWindow = this.getAssetLocation();
									if (!assetLocationWindow) {
										assetLocationWindow = Ext.Viewport.add({ xtype: 'asset-location' });
									}
									assetLocationWindow.show();
									var assetLocationStore = Ext.getStore('AssetLocation');
									assetLocationStore.getProxy().setExtraParam('locationName', '%');
									assetLocationStore.load();
								}
							}, this);

						} else {
							Ext.Msg.alert('Alert', data.data);
						}
					}
					if (data.data == 'Device provisioned successfully') {
						if (Df.App.isPhoneGap) {
							CoolerIoTMobile.util.Utility.isInstallDevice = true;
							CoolerIoTMobile.util.Utility.InstallDeviceSerialNumber = smartDeviceSerial;
							var scanningWindow = this.getScanningWindow();
							if (!scanningWindow) {
								scanningWindow = Ext.Viewport.add({ xtype: 'scanningDevicePanel' });
							}
							var bluetooth = this.getBluetooth();

							if (!bluetooth)
								bluetooth = Ext.create('CoolerIoTMobile.widget.BlueToothLe', { itemId: 'coolerIotDeviceActor' });
							bluetooth.setActiveCommand(null);
							if (bluetooth.getActiveDeviceAddress() != null) {
								bluetooth.fireEvent('disconnectDevice');
							}
							var debugDevicePanel = this.getDebugDeviceContainer();
							if (!debugDevicePanel) {
								debugDevicePanel = Ext.Viewport.add({ xtype: 'debugDeviceContainer' });
							}

							this.getMainNavigationView().push(debugDevicePanel);
							scanningDeviceStore = Ext.getStore('BleTag');
							scanningDeviceStore.clearData();
							scanningWindow.fireEvent('startscan');
							scanningWindow.show();
						}
						else {
							this.getProvisionNewDeviceScreen().reset();
						}
					}
				} else {
					Ext.Msg.alert('Alert', data.info);
				}
			},
			failure: function () {
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Error', 'Something goes wrong...');
			},
			scope: this
		});
	}
});