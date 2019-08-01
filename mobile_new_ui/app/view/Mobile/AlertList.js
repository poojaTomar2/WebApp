Ext.define('CoolerIoTMobile.view.Mobile.AlertList', {
	xtype: 'alert-list',
	extend: 'Ext.List',
	config: {
		cls: 'iot-alert-list',
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		plugins: [
			{
				xclass: 'Ext.plugin.ListPaging',
				loadMoreText: 'Load More Alerts...',
				noMoreRecordsText: 'No More Alerts',
				autoPaging: true
			}
		],
		listeners: {
			painted: function (panel, oOpts) {
				var store = Ext.getStore('AlertList');
				var storeProxy = store.getProxy();
				storeProxy.setExtraParams({ action: 'list', asArray: 0, limit: 25, StatusId: CoolerIoTMobile.Enums.New }); 
				store.loadPage(1);
			}
		},
		store: 'AlertList',
		itemTpl: new Ext.XTemplate([
			'<tpl for=".">',
				'<div class="iot-alertRow iot-row-collapsed">',
					'<div class="iot-alertData">',
						'<tpl if="this.checkChildData(values) == true"> <div class="iot-row-expander-icon-blue {[(values.actions && values.actions.length === 0) ? "iot-row-leaf" : "iot-row-expandable-blue"]}"></div></tpl>',
						'<tpl if="this.checkChildData(values) == false"> <div class="iot-row-expander-icon-blue iot-row-leaf"></div></tpl>',
						'<div class="iot-alert-location">{AlertText}</div>',
						'<div class="iot-alert-location">{Location}</div>',
						'<div class="iot-alert-alert">{[CoolerIoTMobile.util.Renderers.getAlertTypeImg(values)]}</div>',
						'<div class="iot-alert-age">{[this.aging(values.AlertAt)]}</div>',
						'<div class="iot-alert-status status-alert-{Status}">&nbsp;</div>',
						'<div class="iot-alert-route">{[this.dateRenderer(values.Route)]}</div>',
						'<div class="x-clear"></div>',
					'</div>',
					'<div class="iot-alertRow-detail iot-row-detail">',
						'<tpl for="actions">',
							'<div class="iot-alert-actionRow">',
								'<div class="iot-action-date">{[this.dateRenderer(values.Date)]}</div>',
								'<div class="iot-action-icon action-{ActionTypeId}">&nbsp;</div>',
								'<div class="iot-action-status status-action-{Status}">&nbsp;</div>',
								'<div class="iot-action-detail">{Detail}</div>',
							'</div>',
						'</tpl>',
					'</div>',
				'</div>',
			'</tpl>',
			{
				checkChildData: function (values) {
					return (values.actions && values.actions.length != 0) ? true : false;
				},
				dateRenderer: function (value) {
					if (!value) {
						return;
					}
					return Ext.Date.format(value instanceof Date ? value : Ext.Date.parseDate(value, "X"), "d-m");
				},
				day: 1000 * 60 * 60 * 24,
				aging: function (value) {
					if (!value) {
						return;
					}
					return Math.ceil((new Date() - (value instanceof Date ? value : Ext.Date.parseDate(value, "X"))) / this.day) + "d";
				}
			}
		])
	},
	initialize: function () {
		this.callParent(arguments);
		this.addListener({
			'element': 'element',
			'doubletap': this.onDoubleTap,
			'singletap': this.onSingleTap,
			scope: this
		});
		this.on({
			updatedata: this.onUpdateData,
			scope: this
		});
	},
	onDoubleTap: function (e, target) {
		var row = e.getTarget("div.iot-alertRow");
		if (!row) {
			return;
		}
		var rowEl = Ext.get(row);
		this.onActionClick(e, target);
		var targetEl = Ext.get(target);
		var expanded = rowEl.hasCls("iot-row-collapsed");
		rowEl.toggleCls('iot-row-collapsed');	
		if (rowEl.select("div.iot-row-expander-icon-blue").elements[0]) {
			Ext.fly(rowEl.select("div.iot-row-expander-icon-blue").elements[0]).replaceCls(expanded ? "iot-row-expandable-blue" : "iot-row-expanded-blue", expanded ? "iot-row-expanded-blue" : "iot-row-expandable-blue");
		}
	},
	onActionClick: function (e, target) {
		var row = e.getTarget("div.iot-alertRow");
		var alertIndex = this.nodes ? this.nodes.indexOf(row) : this.element.select("div.iot-alertRow").indexOf(row);
		var rowEl = Ext.get(row);
		var alertAction = /iot-alert-([a-zA-Z]+)/g.exec(target.className), actionAction, actionIndex = -1;
		if (!alertAction) {
			actionAction = /iot-action-([a-zA-Z]+)/g.exec(target.className);
			if (actionAction) {
				actionAction = actionAction[1];
			}
			var actionRows = rowEl.select("div.iot-alert-actionRow");
			var actionRow = e.getTarget("div.iot-alert-actionRow");
			actionIndex = actionRows.indexOf(actionRow);
		} else {
			alertAction = alertAction[1];
		}
		var alertData = this.getStore().getData(), alert = alertData.getAt(alertIndex).raw, action = actionIndex === -1 ? null : alert.actions[actionIndex];
		var args = {
			data: alertData,
			alertAction: alertAction,
			alertIndex: alertIndex,
			alert: alert,
			action: action,
			actionAction: actionAction
		};
		return args;
	},
	onSingleTap: function (e, target) {
		var row = e.getTarget("div.iot-alertRow");
		if (!row) {
			return;
		}
		var rowEl = Ext.get(row);
		var args = this.onActionClick(e, target);
		var targetEl = Ext.get(target);
		if (targetEl.hasCls("iot-row-expander-icon-blue") && !targetEl.hasCls("iot-row-leaf")) {
			var expanded = rowEl.hasCls("iot-row-collapsed");
			rowEl.toggleCls('iot-row-collapsed');
			Ext.fly(rowEl.select("div.iot-row-expander-icon-blue").elements[0]).replaceCls(expanded ? "iot-row-expandable-blue" : "iot-row-expanded-blue", expanded ? "iot-row-expanded-blue" : "iot-row-expandable-blue");
		}
		this.fireEvent('actiontap', this, args);
	},

	onUpdateData: function () {
		this.nodes = this.element.select("div.iot-alertRow");
	}
});