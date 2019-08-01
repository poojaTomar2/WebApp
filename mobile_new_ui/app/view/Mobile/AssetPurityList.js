Ext.define('CoolerIoTMobile.view.Mobile.AssetPurityList', {
	extend: 'Ext.dataview.List',
	xtype: 'purityImageList',
	config: {
		plugins: [
		 {
		 	xclass: 'Ext.plugin.ListPaging',
		 	pullRefereshText: 'Pull To Refresh',
		 	autoPaging: true
		 }
		],
		title: 'Purity Images',
		emptyText: 'No Data',
		store: 'AssetPurity',
		scrollToTopOnRefresh: true,
		striped: true,
		cls: 'asset-item-list-container',
		itemTpl: new Ext.XTemplate(
			'<div class="asset-item-container">',
				'<div class="cooleriot-display-table">',
				'<table style="width:100%">',
					'<tr>',
						'<td rowspan="4" style = "padding: 0.5em;">',
							'{[values.StatusId > -1 ? this.setImages(values) : "Rejected"]}',
						'</td>',
					'</tr>',
					'<tr>',
						'<td width="75">{[values.StatusId > -1 && values.VerifiedOn ? CoolerIoTMobile.util.Renderers.getPurityImg(values) : "&nbsp;"]}</td>',
						'<td width="75">{[values.StatusId > -1 && values.VerifiedOn ? CoolerIoTMobile.util.Renderers.getStockImg(values) : "&nbsp;"]}</td>',
					'</tr>',
					'<tr>',
						'<td>{[values.StatusId > -1 && values.VerifiedOn ? CoolerIoTMobile.util.Renderers.getPurityPerc(values, true) : "&nbsp;"]}</td>',
						'<td>{[values.StatusId > -1 && values.VerifiedOn ? CoolerIoTMobile.util.Renderers.getStockPerc(values, true) : "&nbsp;"]}</td>',
					'</tr>',
					'<tr>',
						'<td>{[values.StatusId > -1 && values.VerifiedOn ? CoolerIoTMobile.util.Renderers.getPurityValue(values, true) : "&nbsp;"]}</td>',
						'<td>{[values.StatusId > -1 && values.VerifiedOn ? CoolerIoTMobile.util.Renderers.getStockPercText(values, true) : "&nbsp;"]}</td>',
					'</tr>',
					'<tr>',
						'<td style = "width: 1em">{[CoolerIoTMobile.util.Renderers.standardDateTime(values.DoorClose)]}</td>',
						'<td align="center">{[CoolerIoTMobile.util.Renderers.standardDateTime(values.VerifiedOn)]}</td>',
						'<td>&nbsp;</td>',
					'</tr>',
				'</table>',
			'<div>',
			'</div>',
			{
				setImages: function (values) {
					var toReturn = '';
					var purityDateTime = Ext.Date.format(values.PurityDateTime, CoolerIoTMobile.Localization.PurityDateFormat);
					if (values.ImageCount > 1) {
						for (var i = 1, len = values.ImageCount; i <= len; i++) {
							var imageName = values.ImageName.replace('.jpg', '_' + i + '.jpg');
							toReturn += '<div class="image-shadow"><img src="' + CoolerIoTMobile.util.Renderers.getImgUrl(imageName, purityDateTime) + '"  height="80" width="85"></img></div>';
						}
					} else {
						toReturn += '<div class="image-shadow"><img src="' + CoolerIoTMobile.util.Renderers.getImgUrl(values.ImageName, purityDateTime) + '"  height="80" width="85"></img></div>';
					}
					return toReturn;
				}
			})
	}
});
