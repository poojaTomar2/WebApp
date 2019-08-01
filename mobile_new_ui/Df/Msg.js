Ext.define('Df.Msg', {
	singleton: true,

	clearTimer: function () {
		this.timer.cancel();
		delete this.timer;
	},

	closeAndClearTimer: function () {
		Ext.Msg.hide();
	},

	defaultTimeout: 10,

	startTimer: function (timeout) {
		timeout = timeout || this.defaultTimeout;
		Ext.Msg.on('hide', this.clearTimer, this, { single: true });
		this.timer = Ext.create('Ext.util.DelayedTask', this.closeAndClearTimer, this);
		this.timer.delay(timeout * 1000);
	}
});