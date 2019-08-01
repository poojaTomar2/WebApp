Ext.define('CoolerIoTMobile.view.Mobile.DebugDevicePanel', {
	extend: 'Ext.form.Panel',
	xtype: 'debugDevicePanel',
	config: {
		record: null,
		layout: 'fit',
		listeners: {
			updateselection: function (record) {
				this.down('#selectedItem').setData(record.data);
			},
			painted: function (panel, oOpts) {
				this.element.on({
					delegate: '#editDeviceDetails, #RangeOfEventId, #AdvertisingPeriodMilliseconds, #PeriodicIntervalMinutes, #MovementThresholdG, #MovementThresholdTime, #TemperatureOutOfThreashold, #LightOutOfThreashold, #HumidityOutOfThreashold, #Angle, #Brightness, #Contrast, #Saturation, #ShutterSpeed, #CameraQuality, #Effect, #LightMode, #CameraClock, #Cdly, #Drive, #StandByModeValue, #EnableTakePicture, #CurentTime, #ResetCameraSetting',
					tap: function (element) {
						var currentId = element.delegatedTarget.id;
						var currentItems = null;
						switch (currentId) {
							case "editDeviceDetails":
								currentItems = CoolerIoTMobile.CommandFormItems.DeviceDetailItems;
								break;
							case "RangeOfEventId":
								currentItems = CoolerIoTMobile.CommandFormItems.RangeOfEventId;
								break;
							case "AdvertisingPeriodMilliseconds":
								currentItems = CoolerIoTMobile.CommandFormItems.AdvertisingPeriodMilliseconds;
								break;
							case "PeriodicIntervalMinutes":
								currentItems = CoolerIoTMobile.CommandFormItems.PeriodicIntervalMinutes;
								break;
							case "MovementThresholdG":
								currentItems = CoolerIoTMobile.CommandFormItems.MovementThresholdG;
								break;
							case "MovementThresholdTime":
								currentItems = CoolerIoTMobile.CommandFormItems.MovementThresholdTime;
								break;
							case "TemperatureOutOfThreashold":
								currentItems = CoolerIoTMobile.CommandFormItems.TemperatureOutOfThreashold;
								break;
							case "LightOutOfThreashold":
								currentItems = CoolerIoTMobile.CommandFormItems.LightOutOfThreashold;
								break;
							case "HumidityOutOfThreashold":
								currentItems = CoolerIoTMobile.CommandFormItems.HumidityOutOfThreashold;
								break;
							case "Angle":
								currentItems = CoolerIoTMobile.CommandFormItems.Angle;
								break;
							case "Brightness":
								currentItems = CoolerIoTMobile.CommandFormItems.Brightness;
								break;
							case "Contrast":
								currentItems = CoolerIoTMobile.CommandFormItems.Contrast;
								break;
							case "Saturation":
								currentItems = CoolerIoTMobile.CommandFormItems.Saturation;
								break;
							case "ShutterSpeed":
								currentItems = CoolerIoTMobile.CommandFormItems.ShutterSpeed;
								break;
							case "CameraQuality":
								currentItems = CoolerIoTMobile.CommandFormItems.CameraQuality;
								break;
							case "Effect":
								currentItems = CoolerIoTMobile.CommandFormItems.Effect;
								break;
							case "LightMode":
								currentItems = CoolerIoTMobile.CommandFormItems.LightMode;
								break;
							case "CameraClock":
								currentItems = CoolerIoTMobile.CommandFormItems.CameraClock;
								break;
							case "Cdly":
								currentItems = CoolerIoTMobile.CommandFormItems.Cdly;
								break;
							case "Drive":
								currentItems = CoolerIoTMobile.CommandFormItems.Drive;
								break;
							case "StandByModeValue":
								var currentDeviceContainer = Ext.ComponentQuery.query('#deviceDataList')[0];

								if (element.target.checked == true) {
									currentDeviceContainer.getData().StandByModeValue = 0;
								}
								else {
									currentDeviceContainer.getData().StandByModeValue = 1;
								}
								Ext.ComponentQuery.query('#deviceDetailsSaveBtn')[0].setDisabled(false);
								return;
								break;
							case "EnableTakePicture":
								var currentDeviceContainer = Ext.ComponentQuery.query('#deviceDataList')[0];

								if (element.target.checked == true) {
									currentDeviceContainer.getData().EnableTakePicture = 0;
								}
								else {
									currentDeviceContainer.getData().EnableTakePicture = 1;
								}
								Ext.ComponentQuery.query('#deviceDetailsSaveBtn')[0].setDisabled(false);
								return;
								break;
							case "CurentTime":
								var debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice');
								debugDeviceController.setCurrentTimeFromHomeScreen();
								return;
								break;
							case "ResetCameraSetting":
								var debugDeviceController = CoolerIoTMobile.app.getController('DebugDevice');
								window.plugins.toast.show('Resetting camera setting', 'short', 'bottom');
								debugDeviceController.executeCommand(CoolerIoTMobile.BleCommands.SET_CAMERA_FACTORY_DEFAULT_SETTING);
								return;
								break;
						}
						CoolerIoTMobile.Util.addViewWithDynamicItems("CoolerIoTMobile.view.Mobile.DeviceConfiguration", CoolerIoTMobile.CommandFormItems.CommonItems.concat(currentItems));
					}
				});
			}
		},
		record: null,
		title: CoolerIoTMobile.Localization.SmartCoolerTitle,
		layout: 'vbox',
		items: [{
			xtype: 'container',
			itemId: 'selectedItem',
			tpl: CoolerIoTMobile.Templates.DeviceStatusItem
		},
		{
			xtype: 'container',
			itemId: 'deviceDataList',
			tpl: CoolerIoTMobile.Templates.DebugDeviceDetailInfo
		}
		]
	}
});