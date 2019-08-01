Ext.define('Df.TimeoutPanel', {
	extend: 'Ext.Panel',
	// @private
	initComponent: function () {
		var config = {};
		Ext.apply(this, config, this.initialConfig);
		Df.TimeoutPanel.superclass.initComponent.call(this);
	},

	// @private
	onRender: function (ct, position) {
		Df.TimeoutPanel.superclass.onRender.call(this, ct, position);
		// add event listener
		this.element.on('keypress', this.resetTask, this);
		this.element.on('mouseup', this.resetTask, this);
		this.element.on('mousedown', this.resetTask, this);
		this.element.on('keydown', this.resetTask, this);
		this.element.on('touchstart', this.resetTask, this);
		this.setupTask();
	},

	handleTimeout: function () {
		this.onTimeout.call(this.scope || this);
		this.setupTask();
	},

	setupTask: function () {
		this.task = new Ext.util.DelayedTask(this.onTimeout, this);
		this.resetTask();
	},

	timeout: 60,

	onTimeout: Ext.emptyFn,

	resetTask: function () {
		// delay added for 1 minutes
		this.task.delay(this.timeout * 1000);
	}
});