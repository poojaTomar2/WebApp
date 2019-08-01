Ext.define('CoolerIoTMobile.CommandFormItems', {
	singleton: true,
	CommonItems: [{
		xtype: 'fieldset',
		docked: 'bottom',
		itemId: 'commonItems',
		style: 'margin: 0em;',
		defaults: {
			xtype: 'button',
			cls: 'device-details-button',
			width: '50%'
		},
		items: [

			{
				text: 'Set',
				itemId: 'deviceConfigurationSetBtn',
				style: 'border-right: none;',
				docked: 'right'
			},
			{
				text: 'Cancel',
				docked: 'right',
				style: 'border-left: none;border-right: none;',
				handler: function (button) {
					button.up().up().destroy();
				}
			}
		]
	}],
	DeviceDetailItems: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Change Beacon Settings',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '65%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '60%',
				name: 'Major',
				label: 'Major'
			},
			{
				xtype: 'numberfield',
				labelWidth: '60%',
				name: 'Minor',
				label: 'Minor'
			},
			{
				xtype: 'numberfield',
				labelWidth: '60%',
				name: 'Rssi',
				label: 'Rssi for 1 meter distance'
			}
			]
		}
	],
	RangeOfEventId: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Last Read Event Index',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',			
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '75%',
				name: 'RangeOfEventId',
				label: 'Last Read Event Index'
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 123',
					itemId: 'minLabel'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 145',
					itemId: 'maxLabel'
				}
			]
		}
	],
	AdvertisingPeriodMilliseconds: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Advertisement  Frequency',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'AdvertisingPeriodMilliseconds',
				label: 'Milliseconds',
				minValue: 20,
				maxValue: 1000
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 20'
				},
				{
					xtype: 'label',
					width: '50%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 10000'
				}
			]
		}
	],
	PeriodicIntervalMinutes: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Heartbeat Interval',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				name: 'PeriodicIntervalMinutes',
				labelWidth: '50%',
				label: 'In Minutes',
				minValue: 1,
				maxValue: 60
			}
			]
		},
		{
			xtype: 'container',
			width: '90%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 60'
				}
			]
		}
	],
	MovementThresholdG: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Movement G',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				name: 'MovementThresholdG',
				labelWidth: '70%',
				label: 'Movement threshold G Value',
				minValue: 1,
				maxValue: 127
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 127'
				}
			]
		}
	],
	MovementThresholdTime: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Movement Time',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				name: 'MovementThresholdTime',
				labelWidth: '70%',
				label: 'Movement threshold Time',
				minValue: 1,
				maxValue: 127
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 127'
				}
			]
		}
	],
	TemperatureOutOfThreashold: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Temperature',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				name: 'TemperatureOutOfThreashold',
				label: 'Temperature out of threashold',
				labelWidth: '75%',
				minValue: -20,
				maxValue: 30
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: -20'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 30'
				}
			]
		}
	],
	LightOutOfThreashold: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Ambient Light',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '70%',
				name: 'LightOutOfThreashold',
				label: 'Light out of threashold',
				minValue: 1,
				maxValue: 1000
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 1000'
				}
			]
		}
	],
	HumidityOutOfThreashold: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Humidity',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '72%',
				name: 'HumidityOutOfThreashold',
				label: 'Humidity out Of threashold',
				minValue: 1,
				maxValue: 100
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 100'
				}
			]
		}
	],
	Angle: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Angle',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',		
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'Angle',
				label: 'Angle',
				minValue: 30,
				maxValue: 150
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 30'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 150'
				}
			]
		}
	],
	Brightness: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Brightness',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'Brightness',
				label: 'Brightness',
				minValue: 1,
				maxValue: 5
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 5'
				}
			]
		}
	],
	Contrast: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Contrast',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'Contrast',
				label: 'Contrast',
				minValue: 1,
				maxValue: 5
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 5'
				}
			]
		}
	],
	Saturation: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Saturation',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'Saturation',
				label: 'Saturation',
				minValue: 1,
				maxValue: 5
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 5'
				}
			]
		}
	],
	ShutterSpeed: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'ShutterSpeed',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '55%',
				name: 'ShutterSpeed',
				label: 'Shutter Speed',
				minValue: 100,
				maxValue: 1600
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 100'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 1600'
				}
			]
		}
	],
	CameraQuality: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Camera Quality',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '55%',
				name: 'CameraQuality',
				label: 'Camera Quality',
				minValue: 1,
				maxValue: 32
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 32'
				}
			]
		}
	],
	Effect: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Camera Quality',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'Effect',
				label: 'Effect',
				minValue: 0,
				maxValue: 8
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 0'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 8'
				}
			]
		}
	],
	LightMode: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Light Mode',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'LightMode',
				label: 'Light Mode',
				minValue: 1,
				maxValue: 5
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 5'
				}
			]
		}
	],
	CameraClock: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Camera Clock',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '50%',
				name: 'CameraClock',
				label: 'Camera Clock',
				minValue: 1,
				maxValue: 3
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 3'
				}
			]
		}
	],
	Cdly: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Cdly',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '40%',
				name: 'Cdly',
				label: 'Cdly',
				minValue: 1,
				maxValue: 500
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 1'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 500'
				}
			]
		}
	],
	Drive: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Drive',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			height: '33%',
			items: [
			{
				xtype: 'numberfield',
				labelWidth: '40%',
				name: 'Drive',
				label: 'Drive',
				minValue: 0,
				maxValue: 10
			}
			]
		},
		{
			xtype: 'container',
			width: '100%',
			margin: 0,
			docked: 'bottom',
			style: 'padding: 1em;font-size: .9em;',
			layout: 'hbox',
			items: [
				{
					xtype: 'label',
					width: '40%',
					docked: 'left',
					html: 'Min value: 0'
				},
				{
					xtype: 'label',
					width: '40%',
					style: 'text-align: right;',
					docked: 'right',
					html: 'Max value: 10'
				}
			]
		}
	],
	ImageCalibration: [
		{
			xtype: 'label',
			docked: 'top',
			width: '100%',
			html: 'Image Calibration',
			cls: 'device-details-form-top-bar'
		},
		{
			xtype: 'fieldset',
			scrollable: true,
			defaults:{
				usePicker: 'true'
			},
			items: [
				{
					xtype: 'selectfield',
					label: 'Brightness',
					name: 'brightnessSelectField',
					itemId: 'imageCalibrationBrightness',
					labelWidth: '60%',
					options: [
                        { text: '3', value: '3' },
                        { text: '4', value: '4' },
                        { text: '5', value: '5' }
					]
				},
				{
					xtype: 'selectfield',
					label: 'Contrast',
					name: 'contrastSelectField',
					itemId: 'imageCalibrationContrast',
					labelWidth: '60%',
					options: [
                        { text: '3', value: '3' },
                        { text: '4', value: '4' },
                        { text: '5', value: '5' }
					]
				},
				{
					xtype: 'selectfield',
					label: 'Saturation',
					name: 'saturationSelectField',
					itemId: 'imageCalibrationSaturation',
					labelWidth: '60%',
					options: [
                        { text: '1', value: '1' },
                        { text: '2', value: '2' },
                        { text: '3', value: '3' },
						{ text: '4', value: '4' },
						{ text: '5', value: '5' }
					]
				},
				{
					xtype: 'selectfield',
					label: 'Shutter Speed',
					itemId: 'imageCalibrationShutterSpeed',
					name: 'shutterSpeedSelectField',
					labelWidth: '60%',
					options: [
                        { text: '150', value: '150' },
                        { text: '200', value: '200' },
                        { text: '225', value: '225' },
						{ text: '250', value: '250' },
						{ text: '275', value: '275' },
						{ text: '300', value: '300' },
						{ text: '325', value: '325' },
						{ text: '350', value: '350' },
						{ text: '375', value: '375' },
						{ text: '400', value: '400' }
					]
				},
				{
					xtype: 'selectfield',
					label: 'Camera Quality',
					itemId: 'imageCalibrationCameraQuality',
					name: 'cameraQualitySelectField',
					labelWidth: '60%',
					options: [
                        { text: '7', value: '7' },
                        { text: '8', value: '8' },
                        { text: '9', value: '9' },
						{ text: '10', value: '10' },
						{ text: '11', value: '11' },
						{ text: '12', value: '12' },
						{ text: '13', value: '13' },
						{ text: '14', value: '14' },
						{ text: '15', value: '15' }
					]
				},
				{
					xtype: 'selectfield',
					labelWidth: '60%',
					itemId: 'imageCalibrationEffect',
					name: 'effectSelectField',
					label: 'Effect',
					options: [
                        { text: '8', value: '8' }
					]
				},
				{
					xtype: 'selectfield',
					labelWidth: '60%',
					itemId: 'imageCalibrationLightMode',
					name: 'lightModeSelectField',
					label: 'Light Mode',
					options: [
                        { text: '1', value: '1' },
                        { text: '2', value: '2' },
                        { text: '3', value: '3' },
						{ text: '4', value: '4' }
					]
				}

			]
		}
	]
});
