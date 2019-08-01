Cooler.CoolerImageBoundingBox = Ext.extend(Cooler.Form, {
	controller: 'AssetPurityImage',
	listTitle: 'Operator QC',
	disableAdd: true,
	disableDelete: true,
	keyColumn: 'AssetPurityImageId',
	securityModule: 'CoolerBoundingBox',
	constructor: function (config) {
		Cooler.CoolerImageBoundingBox.superclass.constructor.call(this, config || {});
	},
	comboStores: {
		Product: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'PurityDateTimeUtc', type: 'date' },
			{ dataIndex: 'TimeZoneId', type: 'int', width: 50 },
			{ dataIndex: 'AssetPurityId', type: 'int', header: 'Id' },
			{ dataIndex: 'IrUserName', type: 'string', header: 'Username' },
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'VerifiedOn', type: 'date', header: 'Recognition time', width: 140, renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'ImageUid', type: 'string', header: 'Image Uid' },
			{ dataIndex: 'ImageSizeReadable', type: 'string', header: 'Image Size', width: 100 },
			{ dataIndex: 'PurityDateTime', type: 'date', header: 'Image Received On', width: 140, rendererInfo: 'TimeZoneRenderer', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ dataIndex: 'ImageName', type: 'string' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ dataIndex: 'Shelves', type: 'int', header: 'Shelves', width: 80, align: 'right' },
			{ dataIndex: 'Columns', type: 'int' },
			{ dataIndex: 'StateId', type: 'int' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ dataIndex: 'PurityStatus', type: 'string' },
			{ dataIndex: 'AssetPurityImageId', type: 'int' },

		];
	},
	drawBoundingBoxes: function (coolerBoundingBoxes, purityProductBoundingBoxes) {
		if (purityProductBoundingBoxes.length != 0) {
			var productBoundingBox = Ext.decode(purityProductBoundingBoxes[0].BoundingBoxCoordinates);
			var loadedImageScaledWidth = this.loadedImage.getScaledWidth();
			var loadedImageScaledHeight = this.loadedImage.getScaledHeight();
			for (var i = 0; i < purityProductBoundingBoxes.length; i++) {
				var productPurityData = purityProductBoundingBoxes[i];
				var productBoundingBox = Ext.decode(productPurityData.BoundingBoxCoordinates);
				if (productBoundingBox) {
					var boundingBoxId = 'boundingbox' + (productPurityData.Shelf - 1) + (productPurityData.Position - 1);
					var productBound = new fabric.Rect({
						width: ((productBoundingBox.w * loadedImageScaledWidth) / this.loadedImage.width),
						height: ((productBoundingBox.h * loadedImageScaledHeight) / this.loadedImage.height),
						left: (((productBoundingBox.x) * loadedImageScaledWidth) / this.loadedImage.width),
						top: ((productBoundingBox.y * loadedImageScaledHeight) / this.loadedImage.height),
						fill: '#00000000',
						stroke: '#4FFF33',
						id: boundingBoxId,
						strokeWidth: 2,
						selectable: true, // isSelectable is false for cooler and shelves boundarybox
						hoverCursor: 'pointer',
						originalBoundingWidth: productBoundingBox.w,
						originalBoundingHeight: productBoundingBox.h,
						originalBoundingX: productBoundingBox.x,
						originalBoundingY: productBoundingBox.y,
						productPurityData: productPurityData,
						lockMovementX: true,
						lockMovementY: true,
						lockRotation: true,
						lockScalingX: true,
						lockScalingY: true

					});
					productBound.on('mousedown', this.onProductBoundingBoxSelect);
					this.canvas.add(productBound);
				}
			}
			//this.canvas.on('selection:created', this.onProductBoundingBoxSelect)
			this.canvas.renderAll();
			if (this.updateImageMask)
				this.updateImageMask.hide();
		}
	},
	getCanvasItemById: function (itemId) {
		var object = null,
			objects = this.canvas.getObjects();
		for (var i = 0, len = objects.length; i < len; i++) {
			if (objects[i].id && objects[i].id === itemId) {
				object = objects[i];
				break;
			}
		}

		return object;
	},
	onProductBoundingBoxSelect: function (options, event) {
		var scope = Cooler.CoolerImageBoundingboxes;
		if (scope.selectedBoundingBoxId) {
			var previousSelectedBoundingBox = scope.getCanvasItemById(scope.selectedBoundingBoxId);
			previousSelectedBoundingBox && previousSelectedBoundingBox.set(
				{
					stroke: '#4FFF33',
					strokeWidth: 2
				}
			);
		}
		var activeBoundingbox = this;
		activeBoundingbox && activeBoundingbox.set({ stroke: '#8B0000', strokeWidth: 3 });

		scope.selectedBoundingBoxId = activeBoundingbox.id;
		scope.canvas.renderAll();

		// Code for focusing Product Related combo
		var productComboContainer = scope.imageContainer.getComponent("productComboContainer");
		if (productComboContainer) {
			var purityStatusPanel = productComboContainer.getComponent("purityStatus");
			var productComboId = scope.selectedBoundingBoxId.replace('boundingbox', 'product');
			var productCombo = purityStatusPanel.getComponent(productComboId);
			if (productCombo) {
				productCombo.focus('', 100);
			}
		}
		// Showing Selected Product information 
		var backgroundImage = scope.canvas.backgroundImage;
		var imgSrc = backgroundImage.getElement().src;
		var el = scope.productClipImagePanel.getEl();
		var clipZone = el.dom.getElementsByClassName('clipzone');
		if (clipZone.length != 0) {
			var clipDiv = clipZone[0];
			clipDiv.style.height = activeBoundingbox.originalBoundingHeight + 'px';
			clipDiv.style.width = activeBoundingbox.originalBoundingWidth + 'px';
			var productImageToShow = document.getElementById('productClip');
			if (!productImageToShow) {
				productImageToShow = document.createElement('img');
				productImageToShow.id = 'productClip';
			}
			productImageToShow.src = imgSrc;
			productImageToShow.style.left = (- activeBoundingbox.originalBoundingX) + 'px';
			productImageToShow.style.top = (- activeBoundingbox.originalBoundingY) + 'px';
			if (clipDiv.childNodes.length == 0) {
				clipDiv.appendChild(productImageToShow);
			}

			// Showing Thumbnail image
			var productThumbnailToShow = document.getElementById('productThumbnailPanel');
			var productImageName = productCombo.getValue() + '.png';
			if (productThumbnailToShow) {
				productThumbnailToShow.src = './thumbnail.ashx?imagePath=products/Thumbnails/' + productImageName + '&v=' + new Date().getTime();
				//scope.productInformationPanel.body.update(scope.productInformationTemplate.apply(activeBoundingbox.productPurityData));
			} else {
				productThumbnailToShow = document.createElement('img');
				productThumbnailToShow.id = 'productThumbnailPanel';
				productThumbnailToShow.src = './thumbnail.ashx?imagePath=products/Thumbnails/' + productImageName + '&v=' + new Date().getTime();
				//scope.productInformationPanel.body.update(scope.productInformationTemplate.apply(activeBoundingbox.productPurityData));

			}
			var flavourCombo = scope.productInformationPanel.items.get('FlavourCombo');
			var brandCombo = scope.productInformationPanel.items.get('BrandCombo');
			var packagingTypeCombo = scope.productInformationPanel.items.get('PackagingTypeCombo');
			
		}

	},
	getBoundingboxData: function (assetPurityImageId) {
		Ext.Ajax.request({
			url: EH.BuildUrl('AssetPurityImage'),
			params: {
				action: 'other',
				otherAction: 'GetAssetPurityBoundingBoxCoordinates',
				AssetPurityImageId: assetPurityImageId
			},
			success: function (response, data) {
				this.imageMask.hide();
				if (response.responseText) {
					var data = Ext.decode(response.responseText);
					var coolerBoundingBoxesData = data.CoolerBoundingBoxesData[0];
					if (coolerBoundingBoxesData && !Ext.isEmpty(coolerBoundingBoxesData.CoolerBoundingBoxes) && coolerBoundingBoxesData.CoolerBoundingBoxes != 'null') {
						var coolerBoundingBoxes = Ext.decode(coolerBoundingBoxesData.CoolerBoundingBoxes)[0];
						var shelfBoundingBoxes = coolerBoundingBoxesData.ShelfBoundingBoxes;
						var purityProductBoundingBoxes = data.PurityProductBoundingBoxes;
						this.drawBoundingBoxes(coolerBoundingBoxes, purityProductBoundingBoxes);
					}
				}
			},
			failure: function () {
				Ext.Msg.alert('Error', 'An error occured during unassignment');
			},
			scope: this
		});
	},
	getCoolerImage: function () {
		var origImageName = this.selectedRecord.get('ImageName');
		var purityDatetime = this.selectedRecord.get('PurityDateTimeUtc').format(Cooler.Enums.DateFormat.PurityDate),
			name = origImageName;
		var id = this.selectedRecord.get('AssetPurityId');
		if (!this.canvas) {
			this.canvas = new fabric.Canvas('myCanvas');
		}
		//this.canvas.setHeight(this.assetImagePanel.el.dom.offsetHeight);
		//this.canvas.setWidth((this.assetImagePanel.el.dom.offsetWidth * 98 / 100));
		var imageUrl = 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + name + '&ImageId=' + id + '&v=' + new Date() + '&PurityDateTime=' + purityDatetime;

		if (this.loadedImage) {

			this.canvas.setHeight(this.loadedImage.height);


			this.canvas.setBackgroundImage(this.loadedImage, this.canvas.renderAll.bind(this.canvas), {
				scaleX: this.canvas.width / this.loadedImage.width,
				scaleY: this.canvas.height / this.loadedImage.height,
				backgroundImageStretch: false
			});
			this.canvas.renderAll();
			var id = this.selectedRecord.get('AssetPurityImageId');
			this.getBoundingboxData(id);
		} else {
			fabric.Image.fromURL(imageUrl, function (img) {
				var scope = Cooler.CoolerImageBoundingboxes;
				scope.fabricImage = img
				EXIF.getData(img.getElement(), function (imageEl) {

					var img = this.fabricImage;
					var rotation = EXIF.getTag(img.getElement(), 'Orientation');
					switch (rotation) {
						case 6:
							this.orientation = 90
							break
						case 8:
							this.orientation = 270
							break
						case 3:
							this.orientation = 180
							break
						default:
							this.orientation = 0
							break
					}


					img.selectable = false;
					if (this.orientation === 90 || this.orientation === 270) {
						this.imgWidth = img.height
						this.imgHeight = img.width

					} else {
						this.imgWidth = img.width
						this.imgHeight = img.height
					}
					this.loadedImage = img;
					img.width = this.imgWidth;
					img.height = this.imgHeight;
					img.set({
						originX: 'left', originY: 'top'
					});
					this.canvas.setHeight(img.height);
					this.canvas.setWidth(img.width);
					this.canvas.setBackgroundImage(img, scope.canvas.renderAll.bind(this.canvas), {
					});
					img.rotate(this.orientation);

					this.canvas.renderAll();
					// Adding Bounding Box Squares on Canvas
					var id = this.selectedRecord.get('AssetPurityImageId');
					this.getBoundingboxData(id);

				}.bind(scope));

			});
		}
	},
	productComboTpl: new Ext.XTemplate(
		'<tpl for=".">',
		'<div class="x-combo-list-item">',
		'<div {[this.productColor(values)]}>{DisplayValue}</div>',
		'</div>',
		'</tpl>', {
			productColor: function (record) {
				if (record.SystemValue) {
					return parseInt(record.SystemValue) == -1 ? 'style="font-weight: bold;"' : '';
				}
				else {
					return '';
				}
			}
		}
	),

	showImagePanel: function () {
		var selectionModel = this.grid.getSelectionModel();
		if (selectionModel) {
			var selectedRecord = selectionModel.getSelected();
			if (selectedRecord) {
				this.selectedRecord = selectedRecord;
				if (this.canvas) {
					this.canvas.clear();
					this.loadedImage = null;
				}
				var imageMask = new Ext.LoadMask(this.assetImagePanel.getEl(), {
					msg: "Image is loading, Please wait..."
				});
				// Clearing Clip Image and Other information
				this.resetBoundingBoxInformation();

				imageMask.show();
				this.imageMask = imageMask;
				this.getCoolerImage(selectedRecord);
				this.loadComboGrid(selectedRecord);
			}
		}
	},
	sortProduct: function (obj1, obj2) {
		if (obj1.SystemValue < obj2.SystemValue) {
			return -1;
		} else if (obj1.SystemValue > obj2.SystemValue) {
			return 1;
		}
		return obj1.DisplayValue.localeCompare(obj2.DisplayValue);
	},
	loadComboGrid: function (selectedRecord) {
		var productList = [];
		var productData = Cooler.comboStores.Product.reader.jsonData, priority = ["Empty", "Foreign"];
		var countryId = selectedRecord.get('CountryId'), stateId = selectedRecord.get('StateId'), clientId = selectedRecord.get('ClientId');

		var planogramProducts = {}, isValidProduct = false;
		if (productData) {
			for (var i = 0, len = productData.length; i < len; i++) {
				var record = Ext.apply({}, productData[i]);
				if (planogramProducts[record.LookupId]) {
					record.SystemValue = -1;
					isValidProduct = true;
				} else if ((record.ClientId === 0 || record.ClientId === clientId) && (countryId === 0 || record.CountryId === 0 || record.CountryId === countryId) && (stateId === 0 || record.StateId === 0 || record.StateId === stateId)) {
					var priorityIndex = priority.indexOf(record.DisplayValue);
					record.SystemValue = priorityIndex === -1 ? 999 : priorityIndex;
					isValidProduct = true;
				} else {
					isValidProduct = false;
				}
				if (isValidProduct) {
					productList.push(record);
				}
			}
		}
		productList.sort(this.sortProduct);
		var comboContainer = this.imageContainer.getComponent('productComboContainer');
		if (comboContainer.items) {
			comboContainer.remove('purityStatus', true);
		}
		var comboStore = this.comboStores.Product;
		comboStore.loadData(productList);
		var purityCombos = [];
		var shelves = selectedRecord.get('Shelves');
		var columns = selectedRecord.get('Columns');
		var purityStatus = selectedRecord.get('PurityStatus').indexOf(',') > 0 ? selectedRecord.get('PurityStatus').split(',') : [];
		var pos = 0;
		for (var row = 0; row < shelves; row++) {
			for (var column = 0; column < columns; column++) {
				var productCombo = DA.combo.create({
					store: comboStore,
					itemId: 'product' + row + column,
					itemIndex: pos,
					value: Number(purityStatus[pos] || Cooler.Enums.Product.Unknown),
					tpl: this.productComboTpl,
					listWidth: 200,
					width: (comboContainer.el.getWidth()) / columns - 5,
					listeners: {
						focus: this.setCurrentCombo,
						blur: this.onProductComboBlur,
						scope: this
					}
				});
				if (row === shelves - 1 && column === columns - 1) { // to stop tab key event on last combo
					productCombo.addListener('specialkey', function (field, e) {
						if (e.getKey() === e.TAB) {
							e.stopEvent();
						}
					});
				}
				pos++;
				purityCombos.push(productCombo);
			}
		}
		comboContainer.add({
			itemId: 'purityStatus',
			layout: 'table',
			autoScroll: true,
			layoutConfig: {
				columns: (columns)
			},
			items: purityCombos
		});
		comboContainer.doLayout();

	},
	setCurrentCombo: function (combo) {
		var comboId = combo.itemId;
		var purityStatusPanel = combo.ownerCt;
		var selectionBoundingBoxId = comboId.replace('product', 'boundingbox');
		var selectedBoundingBox = this.getCanvasItemById(selectionBoundingBoxId);
		this.selectedBoundingBoxId = selectionBoundingBoxId;
		if (selectedBoundingBox) {
			selectedBoundingBox.set({ stroke: '#8B0000', strokeWidth: 3 });
			this.canvas.setActiveObject(selectedBoundingBox)
		}
		this.canvas.renderAll();
		combo.addClass('activeCombo');
	},
	onProductComboBlur: function (combo) {
		var comboId = combo.itemId;
		var selectionBoundingBoxId = comboId.replace('product', 'boundingbox');
		if (selectionBoundingBoxId) {
			var selectedBoundingBox = this.getCanvasItemById(selectionBoundingBoxId);
			selectedBoundingBox && selectedBoundingBox.set(
				{
					stroke: '#4FFF33',
					strokeWidth: 2
				}
			);
		}
		this.canvas.renderAll();
		combo.removeClass('activeCombo');
	},
	resetBoundingBoxInformation: function () {
		// Removing Product 
		var productImageToShow = document.getElementById('productClip');
		if (productImageToShow) {
			productImageToShow.src = "";
		}
		var productThumbnailPanel = document.getElementById('productThumbnailPanel');
		if (productThumbnailPanel) {
			productThumbnailPanel.src = "";
		}

	},
	configureListTab: function (config) {
		var grid = this.grid;
		this.grid.region = 'west';
		this.grid.width = 300;
		this.grid.collapsible = true;
		grid.on('rowclick', this.showImagePanel, this);

		var assetImagePanel = new Ext.Panel({
			layout: 'column',
			autoScroll: true,
			html: '<canvas id="myCanvas"></canvas>'
		});

		var productClipImagePanel = new Ext.Panel({
			title: 'Actual',
			html: '<div class="clipzone"></div>'
		});
		var productThumbnailImagePanel = new Ext.Panel({
			autoScroll: true,
			title: 'Sample',
			itemId: 'productThumbnailPanel',
			html: '<div><img id="productThumbnailPanel" alt="Thumbnail Image"></div>'

		});
		var previewPanel = new Ext.Panel({
			items: [
				productClipImagePanel,
				productThumbnailImagePanel
			]
		});
		this.productInformationTemplate = new Ext.XTemplate(
			'<table>',
			'<tr><td><b>Prodcut</b>: {Product}</td></tr>',
			'<tr><td><b>Brand</b>: {BrandName}</td></tr>',
			'<tr><td><b>Flavour</b>: {FlavourName}</td></tr>',
			'<tr><td><b>Package Type</b>: {PackageType}</td></tr>',
			'<tr><td><b>Size (ml) </b>: {NormalizePackagingSize}</td></tr>',
			'</table>'
		);
		var brandCombo = DA.combo.create({ fieldLabel: 'Brand', itemId: 'BrandCombo', name: 'BrandId', hiddenName: 'BrandId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Brand' }, allowBlank: false });
		var flavourCombo = DA.combo.create({ fieldLabel: 'Flavour', itemId: 'FlavourCombo', name: 'FlavourId', hiddenName: 'FlavourId', controller: 'combo', baseParams: { comboType: 'Flavour' }, listWidth: 220 });
		var packagingTypeCombo = DA.combo.create({ fieldLabel: 'Packaging Type', itemId: 'PackagingTypeCombo', name: 'PackagingTypeId', hiddenName: 'PackagingTypeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'PackagingType' }, allowBlank: false });

		var productInformationPanel = new Ext.Panel({
			itemId: 'productInformationTemplate',
			width: '100%',
			height: '100%',
			layout: 'form',
			//tpl: this.productInformationTemplate,
			items: [
				brandCombo,
				flavourCombo,
				packagingTypeCombo
			],
			border: false
		});
		this.productInformationPanel = productInformationPanel;

		this.productClipImagePanel = productClipImagePanel;
		var productPanel = new Ext.Panel({
			region: 'east',
			width: 300,
			collapsible: true,
			autoScroll: true,
			items: [
				previewPanel,
				productInformationPanel
			]
		});

		var imageContainer = new Ext.Panel({
			region: 'center',
			layout: 'border',
			title: 'Asset Image',
			items: [
				new Ext.Panel({
					region: 'center',
					layout: 'fit',
					bodyStyle: "text-align: center;",
					items: [
						assetImagePanel
					]
				}),
				{
					xtype: 'panel',
					region: 'south',
					height: 135,
					//autoHeight:true,
					autoScroll: true,
					itemId: 'productComboContainer',
					items: [

					]
				}
			]
		});
		this.imageContainer = imageContainer;
		this.assetImagePanel = assetImagePanel;
		grid.on('collapse', this.updateLayout, this);
		productPanel.on('collapse', this.updateLayout, this);


		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [grid, imageContainer, productPanel]
		});
	},
	updateLayout: function () {
		if (!this.updateImageMask) {
			this.updateImageMask = new Ext.LoadMask(this.assetImagePanel.getEl(), {
				msg: "Please wait..."
			});
		}
		if (this.canvas) {
			this.canvas.clear();
		}
		this.updateImageMask.show();
		this.getCoolerImage();
		this.loadComboGrid(this.selectedRecord);
	}
});

Cooler.CoolerImageBoundingboxes = new Cooler.CoolerImageBoundingBox({ uniqueId: 'CoolerImageBoundingboxes' });