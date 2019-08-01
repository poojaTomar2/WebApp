DA.SystemStatus = {

	Show: function() {

		if (!this.win) {
			var sqlStatus = new Ext.form.TextField({ fieldLabel: 'SQL Status', name: 'SQLStatus', disabled: true, width: 180 });
			var jsMinify = new Ext.form.TextField({ fieldLabel: 'JS Minifying', name: 'JSMinify', disabled: true, width: 180 });
			var jsCompression = new Ext.form.TextField({ fieldLabel: 'JS Compression', name: 'JSCompression', disabled: true, width: 180 });
			var useMenuIcons = new Ext.form.TextField({ fieldLabel: 'Menu Icons', name: 'UseMenuIcons', disabled: true, width: 180 });
			var webServerTime = new Ext.form.TextField({ fieldLabel: 'Current Web Server Time', name: 'WebServerTime', disabled: true, width: 180 });
			var sqlServerTime = new Ext.form.TextField({ fieldLabel: 'Current SQL Server Time', name: 'SQLDateTime', disabled: true, width: 180 });
			var email = new Ext.form.TextField({ fieldLabel: 'Email', name: 'Email', vtype: 'email', width: 180 });

			// create form panel
			var formPanel = new Ext.form.FormPanel({
				labelWidth: 150,
				bodyStyle: "padding:5px;",
				url: 'Controllers/SystemStatus.aspx',
				items: [
                    sqlStatus,
                    jsMinify,
                    jsCompression,
                    useMenuIcons,
                    webServerTime,
                    sqlServerTime,
                    email
                ]
			});

			// define window
			var window = new Ext.Window({
				title: 'System Health Check v1.0',
				width: 400,
				height: 250,
				layout: 'fit',
				modal: true,
				plain: true,
				closeAction: 'hide',
				items: formPanel,
				buttons: [{
					text: 'Send',
					handler: function() {
						// check form value
						if (formPanel.form.isValid()) {
							if (email.getValue().length == 0) {
								Ext.Msg.alert('Missing data', 'You must enter email');
								return;
							}
							formPanel.form.submit({
								params: { action: 'mailservertest' },
								waitMsg: 'Sending...',
								failure: function(form, action) {
									if (action.result) {
										Ext.MessageBox.alert('Error', action.result.info);
									}
									else {
										Ext.MessageBox.alert('Error', 'Un-expected error');
									}
								},
								success: function(form, action) {
									Ext.Msg.alert('Mail Server Test', action.result.info);
								}
							});
						} else {
							Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
						}
					}
				}, {
					text: 'Release Queue',
					handler: function() {
						// check form value
						if (formPanel.form.isValid()) {
							formPanel.form.submit({
								params: { action: 'releaseemails' },
								waitMsg: 'Sending request...',
								failure: function(form, action) {
									if (action.result) {
										Ext.MessageBox.alert('Error', action.result.info);
									}
									else {
										Ext.MessageBox.alert('Error', 'Un-expected error');
									}
								},
								success: function(form, action) {
									Ext.Msg.alert('Release Queue', action.result.info);
								}
							});
						} else {
							Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
						}
					}
				}, {
					text: 'Close',
					handler: function() { window.hide(); }
}]
				});

				this.formPanel = formPanel;
				this.win = window;
			}

			this.formPanel.form.load({
				params: { action: 'load' }
			});
			this.win.show();
		}
	};
