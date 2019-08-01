Ext.define('CoolerIoTMobile.controller.InstallDevice', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			installDevice: 'installDevice',
			scanningWindow: 'scanningDevicePanel',
			bluetooth: 'ble-bluetoothLe#coolerIotDeviceActor',
			debugDeviceContainer: 'debugDeviceContainer',
			mainNavigationView: 'mobile-main #mainNavigationView',
			assetLocation: 'asset-location',
			assetLocationToolbar: 'asset-location #toptoolbar',
			assetAddLocationToolbar: 'asset-location #addAssetLocation',
			assetInstallList: 'assetInstallList',
			assetLocationList: 'assetLocationList',
			'locationField': 'installDevice #assetLocation',
			'assetField': 'installDevice #assetText',
			'installButton': 'installDevice #assetInstallDevice',
			'smartDeviceField': 'installDevice #smartDeviceText',
			'searchbox': 'asset-location #searchAssetLocationField'
		},
		control: {
			'installDevice #assetInstallDevice': {
				tap: 'onInstallDevice'
			},
			'installDevice #assetLocation': {
				focus: 'onAssetLocationAdd'
			},
			'installDevice #assetText': {
				focus: 'onAssetTextAdd'
			},
			'installDevice #smartDeviceText': {
				focus: 'onSmartDeviceTextAdd'
			},
			'asset-location #searchAssetLocationField': {
				keyup: 'onLocationSearch',
				clearicontap: 'onLocationSearch'
			},
			'asset-location #cancelAssetLocation': {
				tap: 'onCancelAssetLocation'
			},
			'asset-location #addAssetLocation': {
				tap: 'onAddInstallList'
			}
		}
	},

	onCancelAssetLocation: function () {
		this.getAssetLocation().hide();
	},

	// Open List of Location and Coolers and Set Values of LocationId and SerialNumber
	onAddInstallList: function () {
		this.getAssetLocation().hide();
		var locationName,
			locationId,
			assetSerial,
			list,
			assetId,
			assetLocation = this.getAssetLocationList(),
			assetInstall = this.getAssetInstallList(),
			locationField = this.getLocationField(),
			assetField = this.getAssetField(),
			smartDeviceField = this.getSmartDeviceField();
		if (!assetLocation.isHidden()) {
			list = assetLocation;
			assetLocation.setHidden(true);
			assetInstall.setHidden(true);
			var store = list.getStore();
			if (list.getSelection().length > 0 && store.getCount() > 0) {
				var record = list.getSelection()[0];
				locationName = record.get('Name');
				locationId = record.get('LocationId');
				this.locationId = locationId;
			}
			locationField.setValue(locationName);
			assetField.setValue();
			assetField.setDisabled(false);
		}
		else {
			assetLocation.setHidden(true);
			assetInstall.setHidden(true);
			list = assetInstall;
			var store = list.getStore();
			if (list.getSelection().length > 0 && store.getCount() > 0) {
				var record = list.getSelection()[0];
				assetSerial = record.get('SerialNumber');
				assetId = record.get('AssetId');
			}
			assetField.setValue(assetSerial);
			smartDeviceField.setDisabled(false);
		}
	},
	// Search in the list
	onLocationSearch: function () {
		if (!this.searchTask) {
			this.searchTask = new Ext.util.DelayedTask(this.doLocationSearch, this);
		}
		this.searchTask.delay(500);
	},

	doLocationSearch: function () {
		var value = this.getSearchbox().getValue(),
			assetList = this.getAssetLocationList(),
			assetLocation = this.getAssetLocationList(),
			assetInstall = this.getAssetInstallList();
		if (!assetLocation.isHidden()) {
			var store = assetList.getStore();
			assetList.setLoadingText("");
			store.getProxy().setExtraParam('locationName', '%' + value + '%');
			store.load();
		}
		else {
			var store = Ext.getStore('AssetList'),
				storeProxy = store.getProxy();
			storeProxy.setExtraParams({ action: 'list', AsArray: 0, locationId: this.locationId, serialNumber: '%' + value + '%' });
			store.load();
		}
	},

	// Open Location List 
	onAssetLocationAdd: function () {

		var deviceLatitude = CoolerIoTMobile.DeviceLatitude,
			deviceLongitude = CoolerIoTMobile.DeviceLongitude,
			assetLocationWindow = this.getAssetLocation();

		if (!assetLocationWindow) {
			assetLocationWindow = Ext.Viewport.add({ xtype: 'asset-location' });
		}
		this.getAssetLocationToolbar().setTitle('Outlets');
		//this.getAssetAddLocationToolbar().setHidden(true);

		assetLocationWindow.show();
		var assetLocation = this.getAssetLocationList(),
			assetInstall = this.getAssetInstallList();
		assetLocation.setHidden(false);
		assetInstall.setHidden(true);

		var assetLocationStore = Ext.getStore('AssetLocation');
		assetLocationStore.getProxy().setExtraParams({ action: 'other', otherAction: 'LocationListByLatLog', 'latitude': deviceLatitude, 'longitude': deviceLongitude });
		assetLocationStore.load();
	},

	//Open Asset List
	onAssetTextAdd: function () {
		var assetLocationWindow = this.getAssetLocation(),
			assetLocation = this.getAssetLocationList(),
			assetInstall = this.getAssetInstallList();

		if (!assetLocationWindow) {
			assetLocationWindow = Ext.Viewport.add({ xtype: 'asset-location' });
		}
		this.getAssetLocationToolbar().setTitle('Assets');
		//this.getAssetAddLocationToolbar().setHidden(true);

		assetLocationWindow.show();

		assetLocation.setHidden(true);
		assetInstall.setHidden(false);

		var store = Ext.getStore('AssetList');
		store.getProxy().setExtraParams({ action: 'list', AsArray: 0, locationId: this.locationId, limit: 0 });
		store.load();
	},

	//Open Scanning Bluetooth Panel
	onSmartDeviceTextAdd: function () {
		this.searchSmartDevice();
	},

	searchSmartDevice: function () {
		if (Df.App.isPhoneGap) {
			var scanningWindow = this.getScanningWindow();
			this.scanningWindow = scanningWindow;
			CoolerIoTMobile.util.Utility.isFromInstallDevice = true;
			if (!this.scanningWindow) {
				scanningWindow = Ext.Viewport.add({ xtype: 'scanningDevicePanel' });
				this.scanningWindow = scanningWindow;
			}
			var bluetooth = this.getBluetooth();

			if (!bluetooth)
				bluetooth = Ext.create('CoolerIoTMobile.widget.BlueToothLe', { itemId: 'coolerIotDeviceActor' });
			bluetooth.setActiveCommand(null);
			if (bluetooth.getActiveDeviceAddress() != null) {
				bluetooth.fireEvent('disconnectDevice');
			}
			scanningDeviceStore = Ext.getStore('BleTag');
			scanningDeviceStore.clearData();
			this.scanningWindow.fireEvent('startscan');
			this.scanningWindow.show();
		}
	},

	// Set the record after selection of device from Scanning Panel
	processInstall: function (record) {
		var smartDeviceSerial = record.data.DeviceName.slice(-8),
			installButton = this.getInstallButton(),
			smartDeviceField = this.getSmartDeviceField();
		this.smartDeviceSerial = smartDeviceSerial;
		this.record = record;
		this.scanningWindow.hide();
		smartDeviceField.setValue(smartDeviceSerial);
		installButton.setDisabled(false);
	},

	// on Install Button Click we install the Selected SmartDevice if not Associated
	onInstallDevice: function () {
		var locationField = this.getLocationField(),
			assetField = this.getAssetField(),
			installButton = this.getInstallButton(),
			smartDeviceField = this.getSmartDeviceField(),
			assetFieldValue = assetField.getValue(),
			locationFieldValue = locationField.getValue(),
			smartDeviceFieldValue = smartDeviceField.getValue(),
			deviceLatitude = CoolerIoTMobile.DeviceLatitude,
			deviceLongitude = CoolerIoTMobile.DeviceLongitude,
			params = { action: 'provisionedDevice', assetSerialNumber: assetFieldValue, deviceSerialNumber: this.smartDeviceSerial, isAutoCreateAsset: false, DeviceLatitude: deviceLatitude, deviceLongitude: deviceLongitude };
		this.params = params;
		if (assetFieldValue && locationFieldValue && smartDeviceFieldValue) {
			Ext.Ajax.request({
				url: Df.App.getController('SmartDevice'),
				params: this.params,
				success: this.onSuccess,
				failure: this.onFailure,
				scope: this
			});
		}
	},

	// After Successfull install , Erase all data on Smartdevice 
	onSuccess: function (response) {
		var data = Ext.decode(response.responseText);
		Ext.Viewport.setMasked(false);
		if (data.success) {
			if (Df.App.isPhoneGap && data.data != 'Asset does not exist') {
				window.plugins.toast.show(data.data, 'short', 'bottom');
			}
			if (data.data == 'Device provisioned successfully') {
				if (Df.App.isPhoneGap) {
					CoolerIoTMobile.util.Utility.isInstallDevice = true;
					CoolerIoTMobile.util.Utility.InstallDeviceSerialNumber = this.smartDeviceSerial;

					var bluetooth = this.getBluetooth();
					this.bluetooth = bluetooth;
					if (!this.bluetooth)
						this.bluetooth = Ext.create('CoolerIoTMobile.widget.BlueToothLe', { itemId: 'coolerIotDeviceActor' });
					this.bluetooth.setActiveCommand(null);
					if (this.bluetooth.getActiveDeviceAddress() != null) {
						this.bluetooth.fireEvent('disconnectDevice');
					}

					this.getBluetooth().setActiveCommand(null);
					this.getBluetooth().fireEvent('stopScan');
					CoolerIoTMobile.app.getController('BlueToothLeDeviceActor').setSelectedRecord(this.record);
					var password = localStorage.getItem("BlePassword");

					this.getBluetooth().fireEvent('connectWithPassword', this.record);

					var locationField = this.getLocationField(),
						assetField = this.getAssetField(),
						installButton = this.getInstallButton(),
						smartDeviceField = this.getSmartDeviceField();

					assetField.setValue();
					locationField.setValue();
					smartDeviceField.setValue();

					smartDeviceField.setDisabled(true);
					assetField.setDisabled(true);
					installButton.setDisabled(true);
					Ext.Viewport.setMasked(false);
				}
				else {
					this.getInstallDevice().reset();
				}
			}
		} else {
			Ext.Msg.alert('Alert', data.info);
		}
	},

	onFailure: function () {
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert('Error', 'Error Occured...');
	}

});