Cooler.AssetPurityReadOnlyCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	listTitle: 'Image',
	useElastic: true,
	keyColumn: 'AssetPurityId',
	captionColumn: null,
	controller: 'AssetPurityReadOnly',
	securityModule: 'Image',
	constructor: function (config) {
		Cooler.AssetPurityReadOnlyCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'AssetPurityId' } }
	},
	disableAdd: true,
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'AssetPurityId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ dataIndex: 'Username', type: 'string', header: 'Username' },
			{ dataIndex: 'AssignedOn', type: 'date' },
			{ dataIndex: 'ImageName', type: 'string', header: 'Image File Name' },
			{ dataIndex: 'PurityDateTime', type: 'date', header: 'Image Date/ Time', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ dataIndex: 'VerifiedOn', type: 'date', header: 'Recognition time', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'CreatedOn', type: 'date', header: 'Image Received Time', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'PurityStatus', type: 'string' },
			{ dataIndex: 'PurityIssueStatus', type: 'string', header: 'Purity Issue', align: 'right' },
			{ dataIndex: 'SceneTypeName', type: 'string', header: 'Subscene Type', width: 100 },
			{ dataIndex: 'SceneTypeCategory', type: 'string', header: 'Scene', width: 100 },
			{ dataIndex: 'ImageCount', type: 'int', header: 'Image Count', align: 'right' },
			{ dataIndex: 'Image1size', type: 'int', header: 'Image1size', align: 'right' },
			{ dataIndex: 'Image2size', type: 'int', header: 'Image2size', align: 'right' },
			{ dataIndex: 'ErrorCode', type: 'int', header: 'ErrorCode', align: 'right' },
			{ dataIndex: 'FlashSequence', type: 'int', header: 'FlashSequence', align: 'right' },
			{ dataIndex: 'ImageCaptureTime', type: 'date', header: 'Image CaptureTime', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'Contrast', type: 'int', header: 'Contrast', align: 'right' },
			{ dataIndex: 'Brightness', type: 'int', header: 'Brightness', align: 'right' },
			{ dataIndex: 'Saturation', type: 'int', header: 'Saturation', align: 'right' },
			{ dataIndex: 'Quality', type: 'int', header: 'Quality', align: 'right' },
			{ dataIndex: 'Effects', type: 'int', header: 'Effects', align: 'right' },
			{ dataIndex: 'LightMode', type: 'int', header: 'Light Mode', align: 'right' },
			{ dataIndex: 'ShutterSpeed', type: 'int', header: 'Shutter Speed', align: 'right' },
			{ dataIndex: 'CameraClock', type: 'int', header: 'Camera Clock', align: 'right' },
			{ dataIndex: 'Cdly', type: 'int', header: 'Cdly', align: 'right' },
			{ dataIndex: 'Drive', type: 'int', header: 'Drive', align: 'right' },
			{ dataIndex: 'ExtraLines', type: 'int', header: 'Extra Lines', align: 'right' },
			//{ dataIndex: 'CameraSequence', type: 'int', header: 'Camera Sequence', align: 'right' },
			{ dataIndex: 'Gain', type: 'int', header: 'Gain', align: 'right' },
			{ dataIndex: 'Cam2Contrast', type: 'int', header: 'Cam2 Contrast', align: 'right' },
			{ dataIndex: 'Cam2Brightness', type: 'int', header: 'Cam2 Brightness', align: 'right' },
			{ dataIndex: 'Cam2Saturation', type: 'int', header: 'Cam2 Saturation', align: 'right' },
			{ dataIndex: 'Cam2Quality', type: 'int', header: 'Cam2 Quality', align: 'right' },
			{ dataIndex: 'Cam2Effects', type: 'int', header: 'Cam2 Effects', align: 'right' },
			{ dataIndex: 'Cam2LightMode', type: 'int', header: 'Cam2 Light Mode', align: 'right' },
			{ dataIndex: 'Cam2ShutterSpeed', type: 'int', header: 'Cam2 Shutter Speed', align: 'right' },
			{ dataIndex: 'Cam2CameraClock', type: 'int', header: 'Cam2 Camera Clock', align: 'right' },
			{ dataIndex: 'Cam2CameraSequence', type: 'int', header: 'Cam2 Cdly', align: 'right' },
			{ dataIndex: 'Cam2Gain', type: 'int', header: 'Cam2 Gain', align: 'right' },
			{ dataIndex: 'Cam2ExtraLines', type: 'int', header: 'Cam2 Extra Lines', align: 'right' },
			{ dataIndex: 'FirstImageCamSequence', type: 'int', header: 'First Image Cam Seq#', align: 'right' },
			{ dataIndex: 'STMFirmwareVersion', type: 'float', header: 'STM Firmware Version', align: 'right' },
			{ header: 'Month', dataIndex: 'AssetPurityMonth', align: 'right', type: 'int' },
			{ header: 'Day ', dataIndex: 'AssetPurityDay', align: 'right', type: 'int' },
			{ header: 'Day of Week', dataIndex: 'AssetPurityWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'AssetPurityWeek', align: 'right', type: 'int' },
			{ header: 'Country', dataIndex: 'Country', type: 'string' },
			{ dataIndex: 'AuditorFirstName', type: 'string', header: 'Auditor First Name' },
			{ dataIndex: 'Shelves', type: 'int' },
			{ dataIndex: 'Columns', type: 'int' },
			{ dataIndex: 'ImageName', type: 'string' },
		]);
	},
	onGridCreated: function (grid) {
		grid.on("cellclick", this.cellclick, this);
		grid.on("rowdblclick", this.onCoolerImageClick, this);
	},
	onCoolerImageClick: function (grid, rowIndex, e, options) {
		var store = grid.getStore(),
			record = store.getAt(rowIndex);
		Cooler.showCoolerImage(record);
	}
});

Cooler.AssetPurityReadOnly = new Cooler.AssetPurityReadOnlyCl({ uniqueId: 'AssetPurityReadOnly' });