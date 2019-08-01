Cooler.PlanogramForm = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.PlanogramForm.superclass.constructor.call(this, config);
	},
	formTitle: 'Planogram: {0}',

	keyColumn: 'PlanogramId',

	captionColumn: 'PlanogramName',

	controller: 'Planogram',

	title: 'Planogram',

	securityModule: 'Planogram',

	comboTypes: ['AssetType', 'Client'],

	comboStores: {
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	copyButton: true,
	hybridConfig: function () {
		var clientCombo = DA.combo.create({ store: Cooler.comboStores.Client, mode: 'local' });
		return [
			{ dataIndex: 'PlanogramId', type: 'int' },
			{ dataIndex: 'AssetTypeId', type: 'int' },
			{ dataIndex: 'FacingDetails', type: 'string' },
			{ header: 'Planogram Name', dataIndex: 'PlanogramName', type: 'string', width: 150 },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', displayIndex: 'AssetTypeName', type: 'int', store: this.comboStores.AssetType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }), width: 110 },
			{ header: 'Shelves', dataIndex: 'Shelves', type: 'int', width: 150, align: 'right' },
			{ dataIndex: 'ClientName', type: 'string' },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', renderer: 'proxy', store: this.comboStores.Client },
			{ header: 'Start Date', dataIndex: 'StartDate', type: 'date', hidden: true, renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 160, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedBy', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 160, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedBy', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var assetTypeCombo = DA.combo.create({ fieldLabel: 'Asset Type', hiddenName: 'AssetTypeId', store: this.comboStores.AssetType, mode: 'local', width: 150, disabled: !this.modal });
		assetTypeCombo.on('change', function (combo, newValue) {
			var store = combo.getStore();
			index = store.find("LookupId", newValue);
			if (index != -1) {
				var data = store.getAt(index);
				var assetShelves = data.json.CustomStringValue;
				if (assetShelves > 0) {
					this.shelves.setValue(assetShelves);
					this.addRemoveShelves(assetShelves);
				}
			}
		}, this);

		var countryCombo = DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', baseParams: { comboType: 'Country' }, listWidth: 110, width: 150 });
		countryCombo.on('select', function (combo, data) {
			if (data) {
				this.loadProductData(data.id);
			}
		}, this);
		var shelves = new Ext.form.TextField({ fieldLabel: 'Shelves', name: 'Shelves', xtype: 'numberfield', maxLength: 50, allowBlank: false, allowDecimals: false, maxLength: 2, width: 50, disabled: !this.modal });
		var planogramName = new Ext.form.TextField({ fieldLabel: 'Planogram Name', name: 'PlanogramName', xtype: 'textfield', allowBlank: false, width: 150, disabled: !this.modal });
		var productSearch = new Ext.form.TextField({ fieldLabel: 'Product', name: 'productSearch', xtype: 'textfield', width: 120, disabled: !this.modal, enableKeyEvents: true });
		var hasLinkedAsset = new Ext.form.Hidden({ name: 'HasLinkedAsset' });
		shelves.on('change', function (field, newValue, oldValue) {
			if (newValue > 0) {
				this.addRemoveShelves(newValue);
			}
			else {
				Ext.Msg.alert('Alert', 'Shelves value can\'t be 0');
				field.setValue(oldValue);
				return;
			}
		}, this);

		productSearch.on('keyup', function (key) {
			var store = this.productsDataView.getStore();
			store.filter('DisplayValue', key.getRawValue(), true, false);
		}, this);

		this.shelves = shelves;
		this.productSearch = productSearch;
		this.hasLinkedAsset = hasLinkedAsset;
		this.assetTypeCombo = assetTypeCombo;
		var facingDetails = new Ext.form.Hidden({ name: 'FacingDetails' });
		this.facingDetails = facingDetails;
		this.planogramName = planogramName;
		this.countryCombo = countryCombo;
		var col1 = {
			columnWidth: .23,
			labelWidth: 90,
			items: [
				planogramName,
				facingDetails
			]
		}
		var col2 = {
			columnWidth: .2,
			labelWidth: 60,
			items: assetTypeCombo
		}
		var col3 = {
			columnWidth: .1,
			labelWidth: 50,
			items: shelves
		}
		var col4 = {
			columnWidth: .2,
			labelWidth: 60,
			items: countryCombo
		}
		var col5 = {
			columnWidth: .2,
			labelWidth: 60,
			items: productSearch
		}
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1, col2, col3, col4, col5]
		});
		return config;
	},

	loadProductData: function (countryId, isComingFromCoolerImage) {
		var products = {}, productData = Cooler.comboStores.Product.reader.jsonData, products1 = {};
		var loadProductList = {};
		var productsOfConuntry = {};
		if (this.activeRecordId === 0) {
			if (countryId == 0) {
				productsOfConuntry = {};
			}
			else {
				productsOfConuntry = $.grep(productData, function (e) { return e.CountryId === countryId; });
			}
		}
		else {
			if (!this.hasLinkedAsset && countryId != 0) {
				productsOfConuntry = $.grep(productData, function (e) { return e.CountryId === countryId; });
			}
			else {
				loadProductList = countryId == 0 ? $.grep(productData, function (e) { return e.CountryId === countryId; }) : productData; 
				productsOfConuntry = productData;
			}
		}
		var isValidColorCode = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i, productList = [], productList1 = [];
		if (!productsOfConuntry) {
			productsOfConuntry = {};
		}

		for (var i = 0, len = productsOfConuntry.length; i < len; i++) {
			var record = productsOfConuntry[i];
			if (!isValidColorCode.test(record.Description)) {
				record.Description = Cooler.Enums.ColorHex.White;
			}
			if (!isValidColorCode.test(record.ReferenceValue)) {
				record.ReferenceValue = Cooler.Enums.ColorHex.Black;
			}
			//if (countryId !== 0) {
			products[record.LookupId] = record;
			productList.push(record);
			//}
			//if ((countryId === 0 || record.CountryId === 0 || record.CountryId === countryId || !countryId)) {
			//	products[record.LookupId] = record;
			//	productList.push(record);
			//}
		}

		if (countryId == 0) {
			for (var i = 0, len = loadProductList.length; i < len; i++) {
				var record = loadProductList[i];
				if (!isValidColorCode.test(record.Description)) {
					record.Description = Cooler.Enums.ColorHex.White;
				}
				if (!isValidColorCode.test(record.ReferenceValue)) {
					record.ReferenceValue = Cooler.Enums.ColorHex.Black;
				}
				//if (countryId !== 0) {
				products1[record.LookupId] = record;
				productList1.push(record);
				//}
				//if ((countryId === 0 || record.CountryId === 0 || record.CountryId === countryId || !countryId)) {
				//	products[record.LookupId] = record;
				//	productList.push(record);
				//}
			}
		}
		
		if (!this.products) {
			this.products = {};
		}

		for (var key in products) {
			var obj = products[key];
			this.products[obj.LookupId] = obj;
		}
		//this.products = products;
		this.productList = productList;
		this.productList1 = productList1;
		if (!isComingFromCoolerImage) {
			this.productsDataView.store.loadData(countryId == 0 ? this.productList1 : this.productList);
		}
	},
	addRemoveShelves: function (shelvesCount) {
		var currentShelveCount = this.planogram.length;
		if (currentShelveCount < shelvesCount) {
			for (var i = currentShelveCount; i < shelvesCount; i++) {
				this.planogram.push({ products: [] });
			}
		}
		else {
			for (var j = shelvesCount; j < currentShelveCount; j++) {
				this.planogram.pop();
			}
		}
		this.itemTpl.overwrite(this.item.body, this.planogram); //To change affect of selected row color
	},

	attachEvents: function (planogram) {
		planogram.getEl().on('click', this.onEventClick, this);
		planogram.getEl().on('contextmenu', this.onRightClick, this);
		this.initializePlanogramDropZone(planogram);
	},

	getDropedIndex: function (xPosition, yPosition, nodes) {
		// Get the node after the product need to be inserted
		var nodeLength = nodes.length;
		var totalLeft, bottom, node, nodeBound;
		for (var i = 0; i < nodeLength; i++) {
			node = nodes[i];
			nodeBound = node.getBoundingClientRect();
			totalLeft = nodeBound.left + nodeBound.width;;
			bottom = nodeBound.bottom;
			if (totalLeft > xPosition && (bottom > yPosition)) {
				return node;
			}
		}
	},

	onProductDrop: function (target, data, sourceEl, event) {
		// update the tpl after the product drop
		var xPosition = event.getPageX();
		var yPosition = event.getPageY()
		var nodes = target.childNodes;
		var selectedItem = this.getDropedIndex(xPosition, yPosition, nodes);
		var childIndex = this.findIndex(selectedItem);
		var planogramShelveIndex = this.findIndex(target.parentNode);
		if (data.fromPlanogram) {
			// if we are rearranging the product in planogram
			var div = Ext.fly(data.sourceEl).parent(".planogram-row-outer");
			div = div ? div.dom : div;
			var planogramShelveIndexParent = this.findIndex(div);
			var parentChildIndex = this.findIndex(data.sourceEl);
			var product = this.planogram[planogramShelveIndexParent];
			product.products.splice(parentChildIndex, 1);
		}
		var product = this.planogram[planogramShelveIndex];
		var productId = data.productData;

		var item = { id: Number(productId) };
		if (childIndex != undefined) {
			product.products.splice(childIndex, 0, item);
		}
		else {
			product.products.push(item);
		}

		this.itemTpl.overwrite(this.item.body, this.planogram);
	},

	onProductDrag: function (event, fromPlanogram, scope, dataView) {
		// return data to be send to drop zone
		var sourceEl = event.target;
		if (scope.showFormArgs.id != 0 && !scope.showFormArgs.grid) {
			return;
		}
		if (scope.hasLinkedAsset) {
			return;
		}
		else {
			if (!Ext.fly(sourceEl).hasClass("planogram-product")) {
				var parentDiv = Ext.fly(sourceEl).parent(".planogram-product");
				if (!parentDiv) {
					return;
				}
				sourceEl = parentDiv.dom;
			}
			if (sourceEl) {
				var productId = sourceEl.getAttribute('productId');
				var node = sourceEl.cloneNode(true);
				node.id = Ext.id();
				return dataView.dragData = {
					sourceEl: sourceEl,
					repairXY: Ext.fly(sourceEl).getXY(),
					ddel: node,
					productData: productId,
					fromPlanogram: fromPlanogram
				}
			}
		}
	},

	initializeProductDragZone: function (productDataView) {
		//Create Drag zone for product to be dragged
		var scope = this;
		productDataView.dragZone = new Ext.dd.DragZone(productDataView.getEl(), {

			getDragData: function (event) {
				// return the data need to send to drop zone
				return scope.onProductDrag(event, false, scope, productDataView);
			},

			getRepairXY: function () {
				return this.dragData.repairXY;
			}
		});
	},

	initializePlanogramDropZone: function (planogramDataView) {
		//Create Drop zone in planogram
		var scope = this;
		planogramDataView.dropZone = new Ext.dd.DropZone(planogramDataView.getEl(), {
			getTargetFromEvent: function (event) {
				//validate the correct drop zone
				return event.getTarget('div .planogram-row');
			},

			//On exit from a target node, unhighlight that node.
			onNodeOut: function (target, dd, event, data) {
				if (scope.selectedItem) {
					Ext.fly(scope.selectedItem).removeClass('planogram-product-border-selected')
				}
			},

			onNodeOver: function (target, dd, event, data) {
				if (scope.selectedItem) {
					Ext.fly(scope.selectedItem).removeClass('planogram-product-border-selected');
				}
				var xPosition = event.getPageX();
				var yPosition = event.getPageY()
				var nodes = target.childNodes;
				scope.selectedItem = scope.getDropedIndex(xPosition, yPosition, nodes);
				if (scope.selectedItem) {
					Ext.fly(scope.selectedItem).addClass('planogram-product-border-selected');
				}
				return Ext.dd.DropZone.prototype.dropAllowed;
			},

			onNodeDrop: function (target, dragSource, event, data) {
				// update the planogram shelves on product drop
				var sourceEl = dragSource.getEl();
				scope.onProductDrop(target, data, sourceEl, event);
				return true;
			}
		});

		planogramDataView.dragZone = new Ext.dd.DragZone(planogramDataView.getEl(), {
			// Create dragzone inside planogram for rearrange products
			ddGroup: 'planogram',
			getDragData: function (event) {
				// return the data need to rearrange
				return scope.onProductDrag(event, true, scope, planogramDataView);
			},

			getRepairXY: function () {
				return this.dragData.repairXY;
			}

		});

		planogramDataView.dropZoneProduct = new Ext.dd.DropZone(planogramDataView.getEl(), {
			// create drop zone for planogram for rearrange
			ddGroup: 'planogram'
		});
	},

	setContextVisibility: function (text, isVisible) {
		var items = this.contextMenu.items;
		var index = items.findIndex('text', text);
		var item = items.get(index);
		item.setVisible(isVisible);
	},

	resetSelected: function () {
		Ext.each(this.planogram, function (item, index, allItems) {
			Ext.each(item.products, function (product, index, allItems) {
				delete product.selected;
			}, this)
		}, this);
	},

	onRightClick: function (e) {
		e.stopEvent();
		if (this.showFormArgs.id != 0 && !this.showFormArgs.grid) {
			Ext.Msg.alert('Alert', 'Please go to planogram screen for any modification');
			return;
		}
		if (this.hasLinkedAsset) {
			return;
		}
		var position = e.getXY();
		var planogramShelve = e.getTarget('div .planogram-row');
		var selectedItem = e.getTarget('div .planogram-product');
		var parentIndex = planogramShelve ? this.findIndex(planogramShelve.parentNode) : 0;
		this.planogramShelve = planogramShelve;
		var childIndex = this.findIndex(selectedItem);
		if (childIndex !== undefined) {
			this.setContextVisibility('Duplicate', true);
			this.setContextVisibility('Remove', true);
			this.contextMenu.showAt(position);
			this.childIndex = childIndex;
			this.planogramShelveIndex = parentIndex + 1;
			this.itemTpl.overwrite(this.item.body, this.planogram); //To change affect of selected row color
		}
		else if (this.planogramShelveIndex != 0 && this.planogramShelve && (this.planogramShelveIndex == parentIndex + 1)) {
			this.setContextVisibility('Duplicate', false);
			this.setContextVisibility('Remove', false);
			this.contextMenu.showAt(position);
		}

	},

	onEventClick: function (e) {
		var planogramShelve = e.getTarget('div .planogram-row');
		this.planogramShelve = planogramShelve;
		if (planogramShelve) {
			var index = this.findIndex(this.planogramShelve.parentNode);
			this.planogramShelveIndex = index + 1;
			var selectedItem = e.getTarget('div .planogram-product');
			var childIndex = this.findIndex(selectedItem);
			if (childIndex !== undefined) {
				this.resetSelected();
				var product = this.planogram[this.planogramShelveIndex - 1];
				var item = product.products[childIndex];
				item.selected = true;
				this.seletedIndex = childIndex;
			}
			else {
				this.resetSelected();
				this.seletedIndex = undefined;
			}
			this.itemTpl.overwrite(this.item.body, this.planogram); //To change affect of selected row color
		}
	},

	findIndex: function (node) {
		var i = 0;
		if (!node) { return; }
		while (node = node.previousSibling) {
			if (node.nodeType === 1) { ++i }
		}
		return i;
	},

	onContextMenuItemClick: function (e) {
		var product = this.planogram[this.planogramShelveIndex - 1];
		if (product) {
			switch (e.itemId) {
				case 'Duplicate':
					var item = product.products[this.childIndex];
					product.products.splice(this.childIndex, 0, item);
					break;
				case 'Remove':
					product.products.splice(this.childIndex, 1);
					break;
				case 'RemoveShelf':
					product.products = [];
					this.planogram.splice(this.planogramShelveIndex - 1, 1);
					var totalShelves = this.shelves.getValue();
					this.shelves.setValue(totalShelves - 1);
					this.addRemoveShelves(totalShelves - 1);
					return;
					break;
			}
		}
		this.itemTpl.overwrite(this.item.body, this.planogram);
	},

	productDoubleClick: function (dataView, index, node, e) {
		if (this.showFormArgs.id != 0 && !this.showFormArgs.grid) {
			Ext.Msg.alert('Alert', 'Please go to planogram screen for any modification');
			return;
		}
		if (this.hasLinkedAsset) {
			function processResult(btn) {
				if (btn == 'yes') {
					this.copy();
				}
				else {
					return;
				}
			}
			Ext.Msg.show({
				title: 'Alert',
				msg: 'Asset(s) already associated with this planogram. Changes are not allowed. Do you want to create a new copy?',
				buttons: Ext.Msg.YESNO,
				fn: processResult,
				animEl: 'elId',
				scope: this
			});
		}
		else {
			if (!this.planogramShelve || this.planogramShelveIndex == 0) {
				Ext.Msg.alert('Alert', 'Please select a shelf first');
				return;
			}
			var product = this.planogram[this.planogramShelveIndex - 1];
			var productId = node.getAttribute('productId');

			if (this.seletedIndex + 1) {
				var item = product.products[this.seletedIndex];
				product.products.splice(this.seletedIndex + 1, 0, { id: Number(productId) });
			}
			else {
				product.products.push({ id: Number(productId) });
			}
			this.itemTpl.overwrite(this.item.body, this.planogram);
		}
	},

	CreateFormPanel: function (config) {
		config.region = 'north';
		config.height = 60;
		this.formPanel = new Ext.FormPanel(config);
		var planogram = [];

		this.planogram = planogram;
		if (!this.item) {
			var itemTpl = new Ext.XTemplate(
				'<div>',
				'<tpl for=".">',
				'<div class="planogram-row-outer">',
				'<div class="planogram-row" style="{[this.getRowClass(xindex)]} ">',
				'<tpl for="products">',
				'{[this.productDiv(values.id , values.selected)]}',
				'</tpl>',
				'</div>',
				'</div>',
				'</tpl>',
				'</div>',
				{
					productDiv: function (productId, selected) {
						var div = ''
						var products = this.scope.products;
						if (productId != 0) {
							
							var record = products[productId] || {};
							var imagePath = './products/imageNotFound.png';
							if (record.CustomStringValue) {
								imagePath = './products/thumbnails/' + record.CustomStringValue;
							}
							var selectedCls = '';
							if (selected) {
								selectedCls = "planogram-product-border";
							}
							else {
								selectedCls = "planogram-product-border-default";
							}
							div += '<div class="planogram-product flip-container ' + selectedCls + '" ontouchstart= "this.classList.toggle("hover");" productId = ' + productId + '><div class="flipper"><div class="front" style="width: 65px"><img src="' + imagePath + '" style="height: 80px;" alt = "{DisplayValue}"onerror="this.src = \'./products/imageNotFound.png\';" />';
							div += '<div class="product-panelName" style="color:' + record.ReferenceValue + '; background-color:' + record.Description + '">' + record.DisplayValue + '</div></div>';
							div += '<div class="back" style="width: 65px"><img src="' + imagePath + '" style="height: 80px;" alt = "{DisplayValue}"onerror="this.src = \'./products/imageNotFound.png\';" />';
							div += '<div class="product-panelName" style="color:' + record.ReferenceValue + '; background-color:' + record.Description + '">' + record.DisplayValue + '</div></div>';
							div += '</div></div>';
						}
						return div;
					},
					getRowClass: function (rowNumber) {
						if (this.scope.planogramShelveIndex == rowNumber) {
							return ' background-color: #B0C4E5;';
						}
					},
					scope: this
				}
			);
			var item = new Ext.Panel(
				{
					cls: 'planogram-container',
					itemId: 'planogramDisplay',
					region: 'west',
					width: '60%',
					tpl: itemTpl,
					data: this.planogram,
					autoScroll: true,
					listeners: {
						render: this.attachEvents,
						scope: this
					}
				}
			);
			this.item = item;
			this.itemTpl = itemTpl;
			var contextMenu = new Ext.menu.Menu({
				items:
				[
					{ text: 'Duplicate', itemId: 'Duplicate', handler: this.onContextMenuItemClick, iconCls: 'new', scope: this, hidden: true },
					{ text: 'Remove', itemId: 'Remove', handler: this.onContextMenuItemClick, iconCls: 'delete', scope: this, hidden: true },
					{ text: 'Remove Shelf', itemId: 'RemoveShelf', handler: this.onContextMenuItemClick, iconCls: 'delete', scope: this }
				]
			});
			this.contextMenu = contextMenu;
		}
		if (!this.productsDataView) {
			var dvStore = new Ext.data.JsonStore({ fields: [{ name: 'LookupId', type: 'int' }, { name: 'Description', type: 'string' }, { name: 'DisplayValue', type: 'string' }, { name: 'CustomStringValue', type: 'string' }, { name: 'ReferenceValue', type: 'string' }] });
			var productsDataView = new Ext.DataView({
				store: dvStore,
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<div class="planogram-product planogram-product-border flip-container" ontouchstart= "this.classList.toggle("hover");" productId="{LookupId}">',
					'<div class="flipper">',
					'<div class="front">',
					'<img src = "./products/thumbnails/{CustomStringValue}" alt = "{DisplayValue}"onerror="this.src = \'./products/imageNotFound.png\';" class = "productimage">',
					'<div class="product-name" style="color: {ReferenceValue}; background-color: {Description}">{DisplayValue}</div>',
					'</div>',
					'<div class="back">',
					'<img src = "./products/thumbnails/{CustomStringValue}" alt = "{DisplayValue}"onerror="this.src = \'./products/imageNotFound.png\';" class = "productimage">',
					'<div class="product-name" style="color: {ReferenceValue}; background-color: {Description}">{DisplayValue}</div>',
					'</div>',
					'</div>',
					'</div>',
					'</tpl>',
					'<div class="x-clear"></div>'
				),
				singleSelect: false,
				itemSelector: 'div.planogram-product',
				listeners: {
					'dblclick': this.productDoubleClick,
					scope: this
				}
			});
			this.productsDataView = productsDataView;

			var panelProductsImage = new Ext.Panel({
				frame: true,
				region: 'center',
				autoScroll: true,
				width: '40%',
				items: productsDataView,
				listeners: {
					render: this.initializeProductDragZone,
					scope: this
				}
			});
			this.panelProductsImage = panelProductsImage;
		}
		this.on('beforeSave', this.onBeforeSave, this);
		this.on('dataLoaded', this.onDataLoad, this);
		this.on('copy', this.onCopy, this);
		this.winConfig = Ext.apply(this.winConfig, {
			width: '85%',
			height: 600,
			layout: 'border',
			constrain: true,
			minimizable: this.minimizable,
			modal: this.modal,
			maximizable: this.maximizable,
			items: [this.formPanel, this.item, this.panelProductsImage],
			listeners: {
				minimize: function (win) {
					if (win.collapsed) {
						win.expand();
					}
					else {
						win.collapse();
					}
				},
				maximize: function (win) {
					if (this.showFormArgs.grid && this.showFormArgs.grid.title == 'Planograms') {
						return;
					}
				},
				beforehide: function (win) {
					if (!this.showFormArgs.grid) {
						win.allowHide = true;
					}
				},
				scope: this
			}
		});
	},
	onCopy: function (planogram) {
		var form = planogram.formPanel.getForm();
		var planogramNameField = form.findField('PlanogramName');
		if (planogramNameField) {
			planogramNameField.setValue('');
			planogramNameField.setDisabled(false);
			planogramNameField.focus();
		}
		this.hasLinkedAsset = false;
		this.shelves.setDisabled(false);
		this.assetTypeCombo.setDisabled(false);
		this.countryCombo.setDisabled(false);
	},
	onDataLoad: function (planogram, data) {
		var record = data.data;
		this.planogramShelveIndex = 0;
		if (record.Id != 0 && record.FacingDetails) {
			this.planogram = Ext.decode(record.FacingDetails);
			this.resetSelected();
		}
		else {
			this.planogram = [];
			this.planogram.push({ products: [] });
			this.shelves.setValue('1');
		}
		var setDisabled = false;
		this.hasLinkedAsset = record.HasLinkedAsset;
		if (this.hasLinkedAsset) {
			setDisabled = true;
		}
		this.loadProductData(0, planogram.uniqueId == "CoolerImagePlanogram");
		var productsDataViewStore = this.productsDataView.store;
		this.itemTpl.overwrite(this.item.body, this.planogram);
		this.planogramName.setDisabled(setDisabled);
		this.shelves.setDisabled(setDisabled);
		this.assetTypeCombo.setDisabled(setDisabled);
		this.countryCombo.setDisabled(setDisabled);

		if (this.activeRecordId === 0) {
			this.countryCombo.clearValue();
			Ext.Msg.alert('Info', "Select Country to view product");
		}
	},
	onBeforeSave: function (assetPlanogram, params, options) {
		this.facingDetails.setValue(Ext.encode(this.planogram));
	}
});

Cooler.Planogram = new Cooler.PlanogramForm({ uniqueId: 'Planogram', minimizable: false, modal: true, maximizable: false });
Cooler.CoolerImagePlanogram = new Cooler.PlanogramForm({ uniqueId: 'CoolerImagePlanogram', minimizable: true, modal: false, maximizable: false, saveClose: false, save: false, saveAndNew: false, disableDelete: true, copyButton: false });