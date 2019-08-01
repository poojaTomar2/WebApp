Ext.define('Df.ux.ButtonPlus', {
	extend: 'Ext.Button',
	xtype: 'df-buttonplus',

	initialize: function () {
		var me = this;

		me.element.on({
			scope: me,
			singletap: 'onSingleTap',
			doubletap: 'onDoubleTap'
		});

		me.callParent();
	},

	onSingleTap: function () {
		this.fireEvent('singletap', this);
	},

	onDoubleTap: function () {
		this.fireEvent('doubletap', this);
	}
});