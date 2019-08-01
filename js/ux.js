Ext.namespace('Ext.ux');

/**
 * @author Thomas Lauria
 * http://www.thomas-lauria.de
 */
Ext.ux.ImageCrop = Ext.extend(Ext.Component, {
	quadratic: false,
	minWidth: 50,
	minHeight: 50,
	preserveRatio: true,
	cropData: {
		xAxis: 0,
		yAxis: 0,
		height: 0,
		width: 0
	},

	initComponent: function () {
		this.preserveRatio = this.preserveRatio;
		Ext.ux.ImageCrop.superclass.initComponent.call(this);
	},

	onRender: function (ct, position) {
		var cropWin = {};
		cropWin.height = this.initialHeight;
		cropWin.width = this.initialWidth;
		this.maxWidth = this.imgWidth
		this.maxHeight = this.imgHeight;
		this.cropData.height = this.imgHeight < cropWin.height ? this.imgHeight : cropWin.height - 80;
		this.cropData.width = this.maxWidth < cropWin.width ? this.maxWidth : cropWin.width - 80;
		Ext.ux.ImageCrop.superclass.onRender.call(this, ct, position);
		this.el = ct;
		this.el.setStyle({
			position: 'relative'
		}).setSize(this.initialWidth, this.initialHeight);
		//cropWrapper used inside the Resizable component which also hold the image
		this.cropWrapper = this.el.insertFirst().setSize(this.imgWidth, this.imgHeight);
		this.cropWrapped = this.cropWrapper.setStyle({}).insertFirst().setSize(this.cropData.width, this.cropData.height);
		this.cropWrapped.insertFirst({ tag: "img", src: Ext.BLANK_IMAGE_URL, width: this.imgWidth, height: this.imgHeight, maxheight: this.imgHeight, maxwidth: this.imgWidth });
		//cropBgBox is used as the background image inside the crop window
		this.cropBgBox = this.el.insertFirst().setStyle({
			background: 'url(' + this.imageUrl + ') no-repeat',
			position: 'absolute',
			left: 0,
			top: 0
		}).setSize(this.imgWidth, this.imgHeight).setOpacity(0.5);
		this.cropBgBox.dom.onmousemove = this.setMouseCoordinates;
		this.cropBgBox.dom.onmouseout = this.clearMouseCoordinates;
		this.initWrapper();
	},

	getCropData: function () {
		return this.cropData;
	},
	// here we are creating the Resizable component which we used for cropping
	initWrapper: function () {
		var parentBox = this;
		var cropBgBox = this.cropBgBox;
		var imageUrl = this.imageUrl;
		var result = this.cropData;
		var wrapped = new Ext.Resizable(this.cropWrapped, {
			wrap: true,
			pinned: true,
			minWidth: this.minWidth,
			minHeight: this.minHeight,
			maxWidth: this.maxWidth,
			maxHeight: this.maxHeight,
			draggable: true,
			preserveRatio: this.preserveRatio,
			handles: 'all',
			constrainTo: this.cropWrapper,
			listeners: {
				'resize': function (box, width, height) {
					//attached the drag end image where we can update the image inside the Resizable component as per background image
					box.imageOffset = [box.el.getBox().x - cropBgBox.getX(), box.el.getBox().y - cropBgBox.getY()];
					result.width = width;
					result.height = height;
					result.xAxis = box.imageOffset[0];
					result.yAxis = box.imageOffset[1];
					box.el.setStyle({
						'background': 'url(' + imageUrl + ')  no-repeat',
						'background-position': (-box.imageOffset[0]) + 'px ' + (-box.imageOffset[1]) + 'px'
					});
					if (parentBox.fireEvent('change', parentBox, result) === false) {
						return parentBox;
					}
				},
				'beforeresize': function () {
					this.getEl().setStyle({ background: 'transparent' });
				}
			},
			dynamic: true
		});
		wrapped.getEl().setStyle({ background: 'url(' + imageUrl + ') no-repeat' });
		wrapped.imageOffset = [0, 0];
		//attached the drag end image where we can update the image inside the Resizable component as per background image
		wrapped.dd.endDrag = function () {
			wrapped.imageOffset = [wrapped.getEl().getBox().x - cropBgBox.getX(), wrapped.getEl().getBox().y - cropBgBox.getY()];
			result.xAxis = wrapped.imageOffset[0];
			result.yAxis = wrapped.imageOffset[1];
			wrapped.getEl().setStyle({
				'background': 'url(' + imageUrl + ') no-repeat',
				'background-position': (-wrapped.imageOffset[0]) + 'px ' + (-wrapped.imageOffset[1]) + 'px'
			});
			if (parentBox.fireEvent('change', parentBox, result) === false) {
				return parentBox;
			}
		};
		wrapped.dd.startDrag = function (e) {
			wrapped.getEl().setStyle({
				'background': 'transparent'
			});
		};
		if (parentBox.fireEvent('change', parentBox, result) === false) {
			return parentBox;
		}
	},
	/*for testing use */
	setMouseCoordinates: function (e) {
		var xAxis = e.offsetX;
		var yAxis = e.offsetY;
		document.getElementById("mouse-detail").innerHTML = "Mouse Coordinates: (" + xAxis + "," + yAxis + "),";
	},
	/*for testing use */
	clearMouseCoordinates: function () {
		document.getElementById("mouse-detail").innerHTML = "Mouse Coordinates: (0,0),";
	}
});


Ext.ux.CropWindow = Ext.extend(Ext.Window, {
	title: 'Image Crop Utility',
	width: 800,
	height: 800,
	modal: true,
	cropData: null,
	imageUrl: null,
	autoScroll: true,
	resizable: false,
	constrain: true,
	cls: 'x-crop-window',
	parent: null,
	
	initComponent: function () {
		this.addEvents('saveCrop');
		this.tbar = [
			{
				xtype: 'button',
				text: 'Save',
				itemId: 'saveButton',
				iconCls: 'save',
				handler: function () {
					this.fireEvent('saveCrop', this, this.cropData);
				},
				scope: this
			},
			{
				xtype: 'button',
				text: 'Cancel',
				itemId: 'cancelButton',
				iconCls: 'cancel',
				handler: function () {
					this.hide();
				},
				scope: this
			},
			'<div id="wrap-detail"></div>',
			'<div id="mouse-detail">&nbsp;&nbsp;&nbsp;Mouse Coordinates: (0,0)</div>',

		];

		Ext.ux.CropWindow.superclass.initComponent.call(this);
		var imgLoad = new Image();
		imgLoad.onload = (function () {
			this.imageCropWinMask.hide();
			this.addClass('x-window-handle');
			var crop = new Ext.ux.ImageCrop({
				imageUrl: this.imageUrl,
				initialWidth: this.width - 20,
				minWidth: 110,
				minHeight: 110,
				initialHeight: this.height,
				imgWidth: imgLoad.width,
				imgHeight: imgLoad.height
			});
			this.cropData = crop.getCropData();
			crop.on('change', function (parentBox, axis) {
				this.cropData = axis;
				document.getElementById("wrap-detail").innerHTML = '&nbsp;Crop Window Coordinates: X Offset: ' + this.cropData.xAxis + ' Y Offset: ' + this.cropData.yAxis + ' Width: ' + this.cropData.width + ' Height: ' + this.cropData.height;
			}, this);
			this.add(crop);
			this.crop = crop;
			this.doLayout();
		}).createDelegate(this);
		imgLoad.src = this.imageUrl;
	}
});