Ext.define('CoolerIoTMobile.view.Mobile.CoolerSummaryMatrix', {
	extend: 'Ext.dataview.List',
	xtype: 'coolerSummaryMatrix',
	config: {
		listeners: {
			painted: function (list, oOpts) {
				var store = this.getStore();
				store.load();
			}

		},
		disableSelection: true,
		striped: true,
		pressedCls: 'emptypressed',
		emptyText: 'No Data',
		store: 'CoolerSummaryMatrix',
		itemTpl: new Ext.XTemplate(
		'<div class="matrix-list-container"><table style="width:100%">',
		'<tr><td style="width:20%;">{Position}</td>',
		'<td style="width:60%;">{Product}</td>',
        '<td style="width:10%;">{Capacity}</td>',
		'<td editable=true style="width:10%;"><div class="x-container x-field-number x-label-align-left x-spinner x-form-label-nowrap x-field-grouped-buttons x-field-labeled"><div class="x-component-outer" style="height: 43px;font-size:18px;"><div class="x-spinner-button x-spinner-button-down" onmousedown="BleTag.util.Renderers.addPressedCls(this, true);" onmouseup="BleTag.util.Renderers.addPressedCls(this, false);">-</div><div class="matrix-refil-value">{Refill}</div><div class="x-spinner-button x-spinner-button-up" tap="BleTag.util.Renderers.addPressedCls(this, true);" onmousedown="BleTag.util.Renderers.addPressedCls(this, true);" onmouseup="BleTag.util.Renderers.addPressedCls(this, false);">+</div></div></div></td></tr>',
 		'</table></div>')
	}

});