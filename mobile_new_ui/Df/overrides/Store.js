Ext.define('Df.overrides.Store', {
	override: 'Ext.data.Store',

	getGroupString: function (record) {
		if (this instanceof Ext.data.Store)  {
			var tpl = this.getGroupTpl();
			if (tpl) {
				return tpl.apply(record.data);
			}
		}
		var grouper = this.getGrouper();
		if (grouper) {
			return grouper.getGroupString(record);
		}
		return null;
	}
});