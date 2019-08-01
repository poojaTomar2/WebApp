Cooler.SmartDeviceImageCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	title: 'Image Event',
	useElastic: true,
	controller: 'SmartDeviceImage',
	securityModule: 'ImageRecord',
	constructor: function (config) {
		Cooler.SmartDeviceImageCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceImageId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Sequence', dataIndex: 'Sequence', width: 70, type: 'int', align: 'right' },
			{ header: 'Open Angle', dataIndex: 'OpenAngle', width: 70, renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right' },
			{ header: 'Close Angle', dataIndex: 'CloseAngle', width: 70, renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right' },
			{ header: 'Country', dataIndex: 'Country', type: 'string' }
		]);
	}
});

Cooler.SmartDeviceImage = new Cooler.SmartDeviceImageCl();
Cooler.SmartDeviceImageReadOnly = new Cooler.SmartDeviceImageCl({ independent: true });