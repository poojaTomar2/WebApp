Ext.define('Df.button.Button', {

	extend: 'Ext.button.Button',

	xtype: 'df-button',

	config: {
		modules: undefined,
		confirmText: undefined,
		confirmTitle: undefined
	},

	initComponent: function () {
		// check if permissions are applicable
		var modules = this.getModules();

		if (modules) {
			if (!this.plugins) {
				this.plugins = [];
			}
			this.plugins.push({ ptype: 'df-security', modules: modules });
		}
		this.handler = this.onHandler;
		this.callParent();
	},
	onHandler: function (e) {
		//Changed for toolbar overflow event issue.		
		var confirmText = this.confirmText;
		if (confirmText) {
			Ext.Msg.confirm(confirmText || this.getText() || this.tooltip, confirmText, function (btn) {
				if (btn === 'yes') {
					this.fireEvent('dfclick', this, e);
				}
			}, this);
		}
		else
			this.fireEvent('dfclick', this, e);	
	}
});