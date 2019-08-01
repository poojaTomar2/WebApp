Ext.define('Df.button.LinkButton', {
	extend: 'Ext.Component',
	xtype: 'df-linkButton',
	renderTpl: '<a href="{url}">{text}</a>',
	renderSelectors: {
		linkEl: 'a'
	},
	initComponent: function (component) {
		this.callParent();
		this.renderData = {
			url: this.url === undefined ? '#' : this.url,
			text: this.text
		}
		this.addListener({
			click: {
				element: 'linkEl',
				scope: this,
				fn: this.fireHandler
			}
		}, this);
	},
	fireHandler: function (e) {
		this.fireEvent('click', this, e);
	}
});