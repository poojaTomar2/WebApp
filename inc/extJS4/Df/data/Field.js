/**
 * Overrides the default Field object to specify the default dateFormat as 'YmdHisu'. Also creates formula property
 */
Ext.define('Df.data.Field', {
	override: 'Ext.data.Field',
	
	dateReadFormat: 'YmdHisu',

	constructor: function (config) {
		if (typeof config.formula === 'string') {
			this.applyFormula(config);
		}
		this.callParent(arguments);
	},

	applyFormula: function (field) {
		var formula = field.formula;
		var re = /(\{([^{]*)\})/gi
		var dep = [];
		var calcTpl = new Ext.XTemplate("{[" + formula.replace(re, function (s1, s2, s3) {
			if (dep.indexOf(s3) == -1)
				dep.push(s3);
			return "values." + s3;
		}) + "]}");

		field.dependencies = dep;
		field.calcTpl = calcTpl;
		field.convert = this.tplApply;
	},

	tplApply: function (v, record) {
		return this.calcTpl.apply(record.data);
	}
})