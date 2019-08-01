Ext.define('CoolerIoTMobile.view.Mobile.Message', {
	extend: 'Ext.dataview.List',
	xtype: 'mobile-MessageList',
	cls: 'asset-item-list-container',
	config: {
		title: 'Messages',
		emptyText: 'No Data',
		store: 'Message',
		scrollToTopOnRefresh: true,
		striped: true,
		itemTpl: new Ext.XTemplate(
		'<div class="asset-item-container">',
			'<table class="message-list">',
				'<tr><td><div class="message-list-subject-text">{Name}</div></td><td><div class="message-list-date-text">{[this.formatDate(values.Date)]}</div></td></tr>',
				'<tr><td colspan="2"><div class="message-list-subject-text">{Subject}</div></td></tr>',
				'<tr><td colspan="2"><div class="message-list-detail-text">{Message}<div></td></tr>',
			'</table>',
		'</div>',
			{
				formatDate: function (date) {
					return Ext.Date.format(date, 'd-m');
				}
			}
		)
	}
});