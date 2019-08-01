Ext.define('Df.plugins.FormTimeout', {
	//extend: 'Object',

	requires: [
		'Ext.util.DelayedTask'
	],

	config: {
		timeout: 60
	},

	constructor: function(config) {
		this.initConfig(config);
	},

	init: function (component) {
		this.component = component;
		component.on({
			'activate': this.startTimer,
			'deactivate': this.stopTimer,
			'destroy': this.stopTimer,
			scope: this
		});
	},

	resetTimer: function () {
		this.resetTask.delay(this.getTimeout() * 1000);
	},

	initialized: false,

	stopTimer: function() {
		this.resetTask.cancel();
	},

	hookupListener: function() {

		var component = this.component;

		var fields = component.query("field");
		for (var i = 0, len = fields.length; i < len; i++) {
			var field = fields[i];
			field.getComponent().input.on('keypress', this.resetTime, this);
		}

		this.resetTask = Ext.create('Ext.util.DelayedTask', this.resetForm, this);
	},

	resetForm: function() {
		var component = this.component;

		var fields = component.query("field");
		for (var i = 0, len = fields.length; i < len; i++) {
			var field = fields[i];
			field.setValue('');
		}

		var me = this;
		var call = function () {
			me.resetTimer();
		}
		window.setTimeout(call, 50);
	},

	startTimer: function () {

		if (!this.initialized) {
			this.hookupListener();
			this.initialized = true;
		}

		this.resetTimer();
	}
});