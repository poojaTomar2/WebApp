Ext.define('CoolerIoTMobile.view.Mobile.Attachment', {
	extend: 'Ext.grid.Grid',
	xtype: 'mobile-attachment',
	config: {
		store: 'Attachment',
		cls: 'df-autoHeight',
		title: 'Document',
		assetId: 0,
		defaults: {
			margin: 20,
			padding: 20
		},
		titleBar: {
			items: [
				{
					xtype: 'button',
					text: 'Add',
					align: 'right',
					height: 30,
					itemId: 'addAttachment'
				}]
		},
		headerContainer: {
			height: 35
		},
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		plugins: [
			{
				xclass: 'Ext.plugin.PullRefresh',
				pullText: 'Pull down to refresh'
			}],
		listeners: [
			{
				fn: 'renderColumnPercentage',
				event: 'resize'
			}
		]
	},

	initialize: function () {
		var columns = [
			{
				text: 'File',
				dataIndex: 'Filename',
				align: 'center',
				width: '40%'
			},
			{
				text: 'Type',
				width: '15%',
				align: 'center',
				dataIndex: 'AttachmentType'
			},
			{
				text: 'Created On',
				dataIndex: 'CreatedOn',
				renderer: CoolerIoTMobile.util.Renderers.CovertUTCToLocalDate,
				align: 'center',
				width: '20%'

			},
			
			{
				text: 'Created By',
				width: '25%',
				align: 'center',
				dataIndex: 'CreatedBy'
			}
		];
		this.setColumns(columns);
		this.callParent(arguments);
	},
	renderColumnPercentage: function (element) {
		var grid = this,
		columnArr = grid.getColumns(),
		numberOfCols = columnArr.length,
		clientWidth = element.getAttribute('clientWidth');
		columnArr.forEach(
		function (column, index, array) {
			var perWidth = column.getWidth(); // Percentage or Pixel width --> '25%' || '123'
			if (!Ext.isNumeric(perWidth) && perWidth) { // Checking for a percentage value
				perWidthNum = perWidth.substr(0, perWidth.length - 1) / 100; // Numeric Width --> 0.25
				pxWidth = clientWidth * perWidthNum; // Width in Pixel --> 123
			}
			// Header width
			column.bodyElement.setWidth(pxWidth);
			column.refreshSizeState();
			// Each column has its own class
			if (!column.getCellCls()) {
				column.setCellCls(createCellCssClass(pxWidth));
			} else {
				// Query doms for a class --> 1 Class = 1 Column
				var elements = Ext.query('.' + column.getCellCls()),
					newClass = createCellCssClass(pxWidth),
					oldClass = column.getCellCls();
				// Loop doms and replace old class with new one
				Ext.Array.each(elements, function (ele, index, elementsItSelf) {
					ele.classList.remove(column.getCellCls());
					ele.classList.add(newClass);
				});
				column.setCellCls(newClass);
			}
		}
	);

		function createCellCssClass(pxWidth) {
			var className = 'cell-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
			var css = document.createElement('style');
			css.type = 'text/css';
			var styles = '.' + className + ' { width: ' + pxWidth + 'px !important; }';
			if (css.styleSheet) {
				css.styleSheet.cssText = styles;
			}
			else {
				css.appendChild(document.createTextNode(styles));
			}
			document.getElementsByTagName("head")[0].appendChild(css);
			return className;
		}
	}
});
