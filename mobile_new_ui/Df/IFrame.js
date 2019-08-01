Ext.define('Df.IFrame', {
	extend: 'Ext.Component',
	xtype: 'df-iframe',
	config: {
		url: null,
		retainUrl: true
	},
	template: [
		{
			reference: 'iframe',
			tag: 'iframe',
			style: 'width:100%; height:100%; border: none;'
		}
	],
	initialize: function () {
		var me = this;
		me.callParent();
		me.on({
			'show': me.handleShow,
			'hide': me.handleHide,
			scope: me
		});
	},

	isSrcSet: false,

	handleShow: function () {
		this.isSrcSet = true;
		this.iframe.dom.src = this.getUrl()
	},

	handleHide: function () {
		if (this.getRetainUrl() && this.isSrcSet) {
			this._url = this.iframe.dom.contentDocument.location.href;
		}
		this.iframe.dom.src = "";
	}
});