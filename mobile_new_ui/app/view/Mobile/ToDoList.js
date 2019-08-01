Ext.define('CoolerIoTMobile.view.Mobile.ToDoList', {
	extend: 'Ext.grid.Grid',
	xtype: 'mobile-toDoList',
	config: {
		store: 'ToDoList',
		cls: 'df-autoHeight',
		title: 'To-Do List',

		titleBar: {
			hidden: true
		},
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		listeners: [
			{
				fn: 'renderColumnPercentage',
				event: 'resize'
			}
		]
	},

	initialize: function () {
		var columns = [
			/*
			{
				xtype: 'templatecolumn',
				text: '',
				dataIndex: 'ActionTypeId',
				tpl: '<div class="action-{ActionTypeId}">&nbsp;</div>',
				width: 30
			}, */
			{
				text: 'Created',
				dataIndex: 'Date',
				renderer: function (v, m) { return Ext.Date.format(Ext.Date.parse(v, 'X'), 'd-m') },
				width: '20%'
			},
			{
				text: 'Customer',
				width: '28%',
				dataIndex: 'Name'
			},
			{
				text: 'Alert',
				width: '12%',
				xtype: 'templatecolumn',
				dataIndex: 'AlertTypeId',
				align: 'center',
				tpl: '{[CoolerIoTMobile.util.Renderers.getAlertTypeImg(values)]}'
			},
			{
				text: 'Status',
				dataIndex: 'Status',
				xtype: 'templatecolumn',
				align: 'center',
				tpl: '<div class="status-action-{Status}"></div>',
				width: '15%'
			},
			{
				text: 'To-Do',
				width: '25%',
				dataIndex: 'ToDoAction'
			}
			/*
			{
				text: 'Date',
				width: 40,
				dataIndex: 'AlertAt',
				renderer: function (v, m) {
					if (v) {
						return Ext.Date.format(v, 'dm')
					}
					return v;
				}
			}
			*/
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
