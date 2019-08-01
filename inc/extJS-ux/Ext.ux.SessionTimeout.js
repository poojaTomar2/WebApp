Ext.ux.SessionTimeout = Ext.extend(Ext.util.Observable, {
	constructor: function(cfg) {
		Ext.apply(this, cfg);
		Ext.ux.SessionTimeout.superclass.constructor.call(this, cfg);
	},

	timeout: 30, // in minutes

	milliSecondsInMinute: 1000 * 60,

	resumeOption: 60, // in seconds,

	remainingSeconds: 0,

	messageTpl: "Your session will expire in <b>{0}</b> seconds. Click <b>continue</b> to resume working.",

	expiredMessage: 'Your session has expired. Please refresh this page to resume working.',

	loginUrl: null,

	init: function(options) {
		Ext.apply(this, options);
		this.lastSuccess = new Date();
		Ext.Ajax.on('requestcomplete', this.onRequestComplete, this);
		var task = {
			run: this.checkTimeout,
			scope: this,
			interval: this.milliSecondsInMinute
		}
		this.task = task;
		Ext.TaskMgr.start(task);
	},

	showOnTimeout: function() {
		this.remainingSeconds = this.resumeOption;
		if (!this.win) {
			this.win = new Ext.Window({
				height: 200,
				width: 300,
				modal: true,
				closable: false,
				html: String.format(this.messageTpl, this.remainingSeconds),
				title: 'Session about to expire',
				buttons: [
					{ text: 'Continue', handler: this.onContinue, scope: this }
				]
			});
			this.resumeTask = {
				run: this.resumeTaskCounter,
				scope: this,
				interval: 1000
			}
		}
		Ext.TaskMgr.start(this.resumeTask);
		this.win.show();
	},

	onContinue: function() {
		Ext.TaskMgr.stop(this.resumeTask);
		this.win.hide();
		this.lastSuccess = new Date();
		Ext.TaskMgr.start(this.task);
	},

	onLogout: function() {
		if (this.loginUrl) {
			window.location.href = this.loginUrl;
		} else {
			Ext.Msg.alert('Info', 'Due to inactivity, your session has timed out.', this.reloadCurrentPage);
		}
	},

	reloadCurrentPage: function() {
		window.location.reload();
	},

	resumeTaskCounter: function() {
		this.remainingSeconds -= 1;
		if (this.remainingSeconds == 0) {
			this.win.close();
			Ext.TaskMgr.stop(this.resumeTask);
			this.onLogout();
		} else {
			this.win.body.update(String.format(this.messageTpl, this.remainingSeconds));
		}
	},

	checkTimeout: function(conn) {
		var minutes = new Date().getElapsed(this.lastSuccess) / this.milliSecondsInMinute
		if (minutes >= this.timeout) {
			Ext.TaskMgr.stop(this.task);
			this.showOnTimeout();
		}
	},

	onRequestComplete: function(conn, response, options) {
		var url = options.url || conn.url;
		var excludeUrls = this.excludeUrls || [];
		for (var i = 0, len = excludeUrls.length; i < len; i++) {
			if (!!url.match(excludeUrls)) {
				return;
			}
		}
		this.lastSuccess = new Date();
	}
});
Ext.ux.SessionTimeout = new Ext.ux.SessionTimeout();