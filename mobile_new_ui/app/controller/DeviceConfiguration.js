Ext.define('CoolerIoTMobile.controller.DeviceConfiguration', {
	extend: 'Ext.app.Controller',
	config: {
		commandParamData: [],
		refs: {
			deviceConfiguration: 'deviceConfiguration',
			debugDevicePanel: 'debugDevicePanel',
			debugDevicePanelSetBtn: '[itemId=deviceConfigurationSetBtn]',
			bluetooth: 'ble-bluetoothLe#coolerIotDeviceActor'
		},
		control: {
			deviceConfiguration: {
				show: 'onDeviceConfigurationShow'
			},
			debugDevicePanelSetBtn: {
				tap: 'onDebugDevicePanelSetBtnTap'
			}
		}
	},
	onDeviceConfigurationShow: function (view, x) {
		var mainDebugDevicePanel = this.getDebugDevicePanel();
		var formFields = view.getFieldsAsArray()
		for (var i = 0, len = formFields.length; i < len ; i++) {
			var fieldName = formFields[i].getName();
			if (fieldName == "Major" || fieldName == "Minor") {
				var me = this.getBluetooth();
				var activeDeviceName = me.getActiveDeviceName(),
				    major = 0,
					monor = 0,
					majorMinorValue = activeDeviceName.slice(-8);// As we know last 8 digit of serial # are major/minor combination out of those last 8 digits first 4 should be set as Major and last 4 as minor.

				switch (fieldName) {
					case "Major":
						major = parseInt(majorMinorValue.substring(0, 4));
						formFields[i].setValue(major == 0 ? 1000 : major);
						break;
					case "Minor":
						minor = parseInt(majorMinorValue.substring(4, majorMinorValue.length))
						formFields[i].setValue(minor);
						break;
				}
			}
			else {
				var parentElement = mainDebugDevicePanel.element.query("#" + fieldName);
				if (parentElement[0]) {
					if (fieldName == "Rssi") {
						valueElement = parentElement[0].getElementsByClassName('normal-font-blue-color')[0].textContent;
					}
					else {
						if (fieldName == "RangeOfEventId") {
							var field = formFields[i];
							var minimunValue = CoolerIoTMobile.app.getController('BlueToothLeDeviceActor').getDebugDevicePanel().down('#deviceDataList').getData().RangeOfEventId,
								maximumValue = CoolerIoTMobile.app.getController('BlueToothLeDeviceActor').getDebugDevicePanel().down('#deviceDataList').getData().CurrentEventIndex;
							field.setMinValue(minimunValue);
							field.setMaxValue(maximumValue);
							Ext.ComponentQuery.query('#minLabel')[0].setHtml('Min value: ' + minimunValue);
							Ext.ComponentQuery.query('#maxLabel')[0].setHtml('Max value: ' + maximumValue);
						}
						valueElement = parentElement[0].getElementsByClassName('second-column-size')[0].textContent;
					}
					if (valueElement) {
						formFields[i].setValue(valueElement);
					}
				}
			}
		}

	},
	onDebugDevicePanelSetBtnTap: function (button) {
		var mainDebugDevicePanel = this.getDebugDevicePanel(),
			deviceDataContainer = this.getDebugDevicePanel().down('#deviceDataList'),
		    bulkCommandData = deviceDataContainer.getData(),
			saveDetailButton = Ext.ComponentQuery.query('#deviceDetailsSaveBtn')[0],
			imageCalibrationObject = {};

		var view = this.getDeviceConfiguration();
		var formFields = view.getFieldsAsArray();
		for (var i = 0, len = formFields.length; i < len ; i++) {
			var fieldName = formFields[i].getName();

			if (fieldName == "Major" || fieldName == "Minor" || fieldName == "Rssi") {
				bulkCommandData[formFields[i].getName()] = formFields[i].getValue();
			}
			else if (fieldName == "brightnessSelectField" || fieldName == "contrastSelectField" || fieldName == "saturationSelectField" || fieldName == "shutterSpeedSelectField" || fieldName == "cameraQualitySelectField" || fieldName == "effectSelectField" || fieldName == "lightModeSelectField") {
				imageCalibrationObject[fieldName] = formFields[i].getValue();
			}
			else {
				var element = mainDebugDevicePanel.element.query("#" + formFields[i].getName());
				if (element) {
					if (formFields[i].getValue() < formFields[i].getMinValue() || formFields[i].getValue() > formFields[i].getMaxValue()) {
						window.plugins.toast.show('Value should be between min value and max value', 'short', 'center');
						return;
					}
					else {
						bulkCommandData[fieldName] = formFields[i].getValue();
					}
				}
			}
		}
		if (!this.isEmpty(imageCalibrationObject)) {
			var bluetooth = this.getBluetooth();
			var debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice'),
				imageCalibrationCommandData = [];
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.brightnessSelectField, 1));
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.contrastSelectField, 1));
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.saturationSelectField, 1));
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.shutterSpeedSelectField, 2));
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.cameraQualitySelectField, 1));
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.effectSelectField, 1));
			this.addImageCommandParamData(CoolerIoTMobile.util.Utility.decimalToBytes(imageCalibrationObject.lightModeSelectField, 1));
			CoolerIoTMobile.util.Utility.takePictureAfterImageCalibration = true;
			bluetooth.fireEvent('writeDeviceCommand', CoolerIoTMobile.BleCommands.SET_CAMERA_SETTING, this.getCommandParamData());
			this.setCommandParamData([]);
		}
		else {
			deviceDataContainer.setData(bulkCommandData);
			if (saveDetailButton) {
				saveDetailButton.setDisabled(false);
			}
		}
		view.destroy();
	},
	addImageCommandParamData: function (value, isDirect) {
		var param = this.getCommandParamData() || [];
		if (isDirect) {
			for (var i = 0; i < value.length; i++) {
				param.push(value[i]);
			}
		}
		else {
			for (var i = value.length; i--;) {
				param.push(value[i]);
			}
		}

		this.setCommandParamData(param);
	},
	isEmpty: function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}
});
