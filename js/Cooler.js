DA.Help = false;

Ext.ux.form.Search = Ext.form.TextField.extend({

	inputType: 'search',

	cls: 'x-form-text'

});
Ext.reg('ux.form.search', Ext.ux.form.Search);




//Override for navigation click handling in case of Session expired
Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype.manageError = function (title, message) {
	var openLoginPrompt = false;
	if (message == "You do not have permission to view this directory or page.") {
		openLoginPrompt = true;
	}
	else {
		var msg = Ext.decode(message);
		openLoginPrompt = !msg.success && msg.info == 'Session has expired!';
	}

	DA.App.ReLoginOnSessionExpired && openLoginPrompt ? ExtHelper.ReLogin.openLoginPrompt() :
		Ext.MessageBox.show({
			title: title,
			msg: message,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.ERROR,
			minWidth: 200
		});
}


Ext.Ajax.on('beforerequest', (function (conn, options, eOpts) {
	var controllerUrl = options.url;
	if (controllerUrl) {
		var controllerName = controllerUrl.split('/')[1];
		// Checking if we have valid Controller name. if not then cancelling request
		if (!controllerName) {
			return false;
		}
	}
}));

//Here we define the functions for Re-login
ExtHelper.ReLogin = {
	gridToload: [],

	//set the focus on Password field
	setDefaultFocus: function () {
		var password = this.password;
		password.reset();
		password.focus(true, true);
	},

	//setKeymap: Is used if user press enter after entering password
	setKeymap: function (cmp) {
		var map = new Ext.KeyMap(
			cmp.el,
			[
				{
					key: [10, Ext.EventObject.ENTER],
					scope: this,
					fn: this.onReLogin
				}
			],
			"keydown"
		);
	},


	//onReLogin: Is a handler for login Button 
	onReLogin: function () {
		if (this.formPanel.form.isValid()) {
			var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Logging in...' });
			mask.show();
			this.formPanel.getForm().submit({
				success: function (from, response) {
					mask.hide();
					var result = response.result;
					if (result.success && result.message == 'Logged in') {
						this.loginPrompt.hide();
						//If last time user try to load a form here we reload that.
						if (this.options && this.options.action) {
							var action = this.options.action;
							var params = action.options.params;
							action.form.load({ params: params });
						}
						//If last time user try to load a grid(with child grid) here we reload those.
						if (this.gridToload.length != 0) {
							//Load only those grids which are not disabled
							for (var i = 0, len = this.gridToload.length; i < len; i++) {
								if (!this.gridToload[i].disabled) {
									if (this.gridToload[i] && (this.gridToload[i].getStore() != undefined || this.gridToload[i].getStore() != null)) {
										this.gridToload[i].getStore().load();
									}
								}
							}
						}
						//make the gridToload every time we do successfull login
						this.gridToload = [];
					}
					else {
						Ext.MessageBox.alert('Failed!', 'Please enter correct password', this.setDefaultFocus, this);
					}
				},
				failure: function (from, response) {
					mask.hide();
					Ext.MessageBox.alert('Failed!', 'Please enter correct password', this.setDefaultFocus, this);
				},
				scope: this
			});
		} else {
			Ext.MessageBox.alert('Errors', 'Please enter password', this.setDefaultFocus, this);
		}
	},

	//onExitClick: Is a handler for Quit Button 
	onExitClick: function () {
		DCPLApp.warningMsg = false;
		ExtHelper.Redirect(location.href);
	},

	//openLoginPrompt: function is used to show the user a popup windo where he/she enter password again for re Login
	openLoginPrompt: function (options) {

		if (window.location.hostname == "cch-portal.ebest-iot.com" || window.location.hostname == "cch-portal-qa.ebest-iot.com") {
			DCPLApp.warningMsg = false;
			ExtHelper.Redirect(location.href);
		}
		else {
			this.options = options;
			if (!this.loginPrompt) {
				var username = new Ext.form.Hidden({ name: 'Username', value: DA.Security.info.Tags.Username });
				var password = new Ext.form.TextField({ fieldLabel: 'Password', name: 'Password', inputType: 'password', allowBlank: false });
				this.password = password;
				var formPanel = new Ext.form.FormPanel({
					xtype: 'form',
					labelWidth: 70,
					bodyStyle: "padding:15px;",
					url: EH.BuildUrl('Login'),
					items: [
						username,
						password
					],
					buttons: [
						{ text: 'Quit', handler: this.onExitClick, scope: this },
						{ text: 'Login', handler: this.onReLogin, scope: this }
					]
				});
				this.formPanel = formPanel;
				this.loginPrompt = new Ext.Window({
					title: 'Session expired, Login to continue...',
					resizable: false,
					closable: false,
					items: formPanel,
					layout: 'fit',
					height: 110,
					width: 270,
					modal: true,
					closeAction: 'hide',
					draggable: 'false'
				});
				this.loginPrompt.on('activate', this.setKeymap, this);
			}
			this.setDefaultFocus();
			this.loginPrompt.show();
		}
	}
};



ExtHelper.Plugins.ExceptionHandler = {

	exceptionHandler: function (proxy, options, response, e) {
		var message, responseText, openLoginPrompt = false, sessionMsg = 'Session has expired!', newResponse, msgs;
		if (e && (e.name === 'SyntaxError')) {
			message = sessionMsg;
		} else if (options && options.reader && options.reader.jsonData && options.reader.jsonData.info) {
			message = options.reader.jsonData.info;
		}
		//Below we are checking in any reponse we are getting Session expired Message
		if (response) {
			responseText = response.responseText;
			if (responseText == "You do not have permission to view this directory or page." && response.status == 401) {
				openLoginPrompt = true;
			}
			else {
				try {
					var responeInfo = Ext.decode(responseText);
					openLoginPrompt = (!responeInfo.success && responeInfo.info == sessionMsg) || message == sessionMsg;
					newResponse = responeInfo.info;
					msgs = newResponse.match(/Incorrect|syntax|Invalid|column|DECLARE|@param0|was|deadlocked|Must|declare|multi-part|identifier|procedure|no parameter|table-valued parameter|conversion|varchar data type|semaphore|timeout period/g);

					if ((msgs[0] == "Incorrect" && msgs[1] == "syntax")) {
						message = "Error-0002 Occurred. Please retry.";
					}
					else if ((msgs[0] == "Invalid" && msgs[1] == "column")) {
						message = "Error-0003 Occurred . Please retry.";
					}
					else if ((msgs[0] == "DECLARE" && msgs[1] == "@param0")) {
						message = "Error-0004 Occurred . Please retry.";
					}
					else if ((msgs[0] == "column" && msgs[1] == "was")) {
						message = "Error-0005 Occurred . Please retry.";
					}
					else if (msgs[0] == "was" && msgs[1] == "deadlocked") {
						message = "Error-0006 Occurred . Please retry.";
					}
					else if ((msgs[0] == "Must" && msgs[1] == "declare")) {
						message = "Error-0007 Occurred . Please retry.";
					}
					else if ((msgs[0] == "multi-part" && msgs[1] == "identifier")) {
						message = "Error-0008 Occurred . Please retry.";
					}
					else if ((msgs[0] == "procedure" && msgs[1] == "no parameter")) {
						message = "Error-0009 Occurred . Please retry.";
					}
					else if ((msgs[0] == "table-valued parameter" && msgs[1] == "column")) {
						message = "Error-0010 Occurred . Please retry.";
					}
					else if ((msgs[0] == "conversion" && msgs[1] == "varchar data type")) {
						message = "Error-0011 Occurred . Please retry.";
					}
					else if ((msgs[0] == "semaphore" && msgs[1] == "timeout period")) {
						message = "Error-0012 Occurred . Please retry.";
					}
					else {
						message = responeInfo.info + "<br>" + "Please retry..<br/>";
					}
				}
				catch (e) {

					if (response.statusText == "transaction aborted" && response.status == -1) {
						message = "Error-0001 Occurred . Please retry.";
					}
					//else {
					//	message = message + "<br>"+ "Please retry...";
					//}
				}
			}
		}
		//If user Session expired open the Re-login Window
		if (DA.App.ReLoginOnSessionExpired && openLoginPrompt) {
			ExtHelper.ReLogin.openLoginPrompt();
		} else {
			if (message) {
				buttons = [{ text: 'Ok', handler: function () { errorWin.hide(); } }];
			} else {
				var params = {};
				params.action = 'SendErrorEmail';
				params.responseText = responseText;
				params.controller = proxy.conn.url;
				params.params = Ext.util.JSON.encode(options.params);
				var buttons, errorWin;
				message = "An unhandled exception has occured.<br />Help us improve the system by sending us this error report.";
				buttons = [
					{
						text: 'Send error report',
						handler: function () {
							Ext.Ajax.request({
								url: EH.BuildUrl('Helper'),
								params: params
							});
							errorWin.hide();
						}
					},
					{ text: 'Don\'t send', handler: function () { errorWin.hide(); } }
				];
			}
			errorWin = new Ext.Window({
				title: 'Error!',
				height: 210,
				width: 210,
				modal: true,
				html: message,
				closeAction: 'hide',
				bodyStyle: 'padding: 5px',
				iconCls: 'cancel',
				buttons: buttons
			});
			if (message && message != undefined) {
				errorWin.show();
			}
			else {
				ExtHelper.ReLogin.openLoginPrompt();
			}
		}
	},

	onActionFailed: function (form, action) {
		var response = action.response;
		var message;
		var sessionExpiry = false;
		var result;
		var openLoginPrompt = false;
		if (response.responseText == "You do not have permission to view this directory or page." && response.status == 401) {
			openLoginPrompt = true;
		}
		else {
			var responeInfo = Ext.decode(response.responseText);
			openLoginPrompt = !responeInfo.success && responeInfo.info == 'Session has expired!';
		}
		switch (action.failureType) {
			case Ext.form.Action.CLIENT_INVALID:
				message = "Please correct data errors before continuing";
				break;
			case Ext.form.Action.LOAD_FAILURE:
				result = action.result;
				if (result && result.info && result.info.length > 0) {
					message = result.info;
				}
				break;
			default:
				result = action.result;
				var errors;
				if (result) {
					errors = result.errors;
				}
				if (result && result.info && result.info.length > 0) {
					message = result.info;
				} else {
					message = "";
				}
				if (errors && errors.length > 0) {
					message += "<table>";
					for (var i = 0; i < errors.length; i++) {
						var error = errors[i];
						message += "<tr><td>" + error.id + "</td><td>" + error.msg + "</td></tr>";
					}
					message += "</table>";
				}
				break;
		}
		if (message) {
			if (message == "Session has expired!") {
				sessionExpiry = true;
			}
			if (typeof this.beforeException !== 'undefined') {
				if (this.fireEvent("beforeException", this, response, message) !== true) {
					Ext.Msg.alert('Error', message, function () {
						if (sessionExpiry) {
							ExtHelper.Redirect(location.href);
						}
					});
				}
			} else {
				var obj = this;
				if (form.url == 'Controllers/Order.ashx') {
					obj = TLS.Order.formPanel;
				}
				var exceptionResponse = obj.fireEvent("beforeException", obj, response, message);
				if (typeof obj.events.beforeexception == 'undefined') {
					//If user Session expired open the Re-login Window
					if (DA.App.ReLoginOnSessionExpired && sessionExpiry) {
						ExtHelper.ReLogin.openLoginPrompt();
					}
					else {
						Ext.Msg.alert('Error', message);
					}
				}
				if (!exceptionResponse && message) {
					Ext.Msg.alert('Error', message);
				}
			}
		} else {
			//If user Session expired open the Re-login Window
			DA.App.ReLoginOnSessionExpired && openLoginPrompt ? ExtHelper.ReLogin.openLoginPrompt({ action: action }) : ExtHelper.OpenWindow({ id: 'ErrorWindow', title: 'Error', width: 600, height: 400, html: response.responseText, autoScroll: true, modal: true });
		}
		if (form.el) {
			form.el.focus();
		}
	},

	init: function (o) {
		var xType = ExtHelper.GetXType(o);
		switch (xType) {
			case 'grid':
			case 'editorgrid':
			case 'multiGroupingGrid':
			case 'ux-maximgb-treegrid':
				var ds = o.getStore();
				ExtHelper.ReLogin.gridToload.push(o);
				if (ds) {
					ds.on('loadexception', this.exceptionHandler, this);
				}
				break;
			case 'paging':
				// ignore
				break;
			case 'form':
				o.on('actionfailed', this.onActionFailed, o);
				break;
			default:
				Ext.Msg.alert('Error', 'ExceptionHandler not supported for ' + xType);
				break;
		}
	}
};

Ext.ux.util.SplitGridInfo = function (hybridConfig) {
	var fields = [];
	var cm = [];
	var isCalcRecord = false;

	var fieldSpecific = this.fieldSpecificProperties;

	var isElasticEnabled = DA.Security.info.EnableElasticSearch;

	Ext.each(hybridConfig, function (col) {

		if (isElasticEnabled && col.elasticDataIndex) {
			col.dataIndex = col.elasticDataIndex;
			if (col.elasticDataIndexType) {
				col.type = col.elasticDataIndexType;
			}
		}

		// include only fields that have type. If only renderer is specified, don't use
		if (col.type) {
			if (col.calc || col.formula) {
				isCalcRecord = true;
			}


			var fieldInfo = { name: col.dataIndex };
			Ext.each(fieldSpecific, function (propertyName) {
				fieldInfo[propertyName] = col[propertyName];
			});
			fields.push(fieldInfo);
		}

		// include only if header is defined
		if (col.header) {
			var gridCol = Ext.apply({}, col);
			Ext.each(fieldSpecific, function (property) {
				if (property !== 'convert') {
					delete gridCol[property];
				}
			});

			cm.push(gridCol);
		}
	});

	if (isCalcRecord) {
		fields = new Ext.ux.data.CalcRecord.create(fields);
	}

	return { cm: cm, fields: fields };
};

// When we submit(multipart/form-data) then if a form having check box value then not pass if UnChecked
// Take refrence from https://www.sencha.com/forum/archive/index.php/t-36645.html
Ext.override(Ext.form.Checkbox, {
	//To set the maxLength of HTML field  
	onRender: function (ct, position) {
		Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
		if (this.inputValue !== undefined) {
			this.el.dom.value = this.inputValue;
		}
		this.el.addClass('x-hidden');

		this.innerWrap = this.el.wrap({
			tabIndex: this.tabIndex,
			cls: this.baseCls + '-wrap-inner'
		});
		this.wrap = this.innerWrap.wrap({ cls: this.baseCls + '-wrap' });

		if (this.boxLabel) {
			this.labelEl = this.innerWrap.createChild({
				tag: 'label',
				htmlFor: this.el.id,
				cls: 'x-form-cb-label',
				html: this.boxLabel
			});
		}

		this.imageEl = this.innerWrap.createChild({
			tag: 'img',
			src: Ext.BLANK_IMAGE_URL,
			cls: this.baseCls
		}, this.el);

		// Fix for checkbox, earlier on form submission post data when it's checked
		// If we give the hiddenName in the CheckBox it will create a new hidden input tag which will be save in place that checkBox
		if (this.hiddenName) {
			var hiddenId = this.hiddenId || this.hiddenName;

			this.hiddenField = this.el.insertSibling(
				{ tag: 'input', type: 'hidden', value: this.getValue(), name: this.hiddenName, id: hiddenId },
				'before',
				true
			);

			this.on('check', function (com, value) {
				Ext.getDom(hiddenId).value = value;
			}, this);

			// prevent input submission
			this.el.dom.removeAttribute('name');
		}
		if (this.checked) {
			this.setValue(true);
		} else {
			this.checked = this.el.dom.checked;
		}
		this.originalValue = this.checked;
	}
});

//window that opens will be constrain(restricted inside) to the viewport
Ext.override(Ext.Window, {
	constrain: true
});

Ext.override(Ext.ToolTip, {
	onTargetOver: function (e) {
		if (this.disabled || e.within(this.target.dom, true)) {
			return;
		}
		var t = e.getTarget(this.delegate);
		if (t) {
			this.triggerElement = t;
			this.clearTimer('hide');
			this.targetXY = e.getXY();
			this.delayShow();
		}
	},
	onMouseMove: function (e) {
		var t = e.getTarget(this.delegate);
		if (t) {
			this.targetXY = e.getXY();
			if (t === this.triggerElement) {
				if (!this.hidden && this.trackMouse) {
					this.setPagePosition(this.getTargetXY());
				}
			} else {
				this.hide();
				this.lastActive = new Date(0);
				this.onTargetOver(e);
			}
		} else if (!this.closable && this.isVisible()) {
			this.hide();
		}
	},
	hide: function () {
		this.clearTimer('dismiss');
		this.lastActive = new Date();
		delete this.triggerElement;
		Ext.ToolTip.superclass.hide.call(this);
	}
});

Ext.override(Ext.form.BasicForm, {
	afterAction: function (a, g) {
		this.activeAction = null;
		var e = a.options;
		if (e.waitMsg) {
			if (this.waitMsgTarget === true) {
				this.el.unmask()
			} else {
				if (this.waitMsgTarget) {
					this.waitMsgTarget.unmask()
				} else {
					Ext.MessageBox.updateProgress(1);
					Ext.MessageBox.hide()
				}
			}
		}
		if (g) {
			if (e.reset) {
				this.reset()
			}
			Ext.callback(e.success, e.scope, [this, a]);
			this.fireEvent("actioncomplete", this, a)
		} else {
			if (a && a.response && a.response.responseText) {
				var f = a.response.responseText != "You do not have permission to view this directory or page." ? Ext.decode(a.response.responseText) : undefined;
				if (this.findField("CheckOldVersion") && f && f.info && f.info.indexOf("ConcurrencyException") > -1) {
					this.action = a;
					var b = DCPLApp.TabPanel.getActiveTab().title.split(":")[0];
					var d = "Cannot save. This record has just been updated by " + f.info.split("-")[1] + ". Click Reload to bring in the current record and make your changes again, or click Cancel.";
					if (!this.concurrencyAlertWindow) {
						var c = new Ext.Window({
							title: "Alert",
							html: d,
							layout: "fit",
							height: 120,
							width: 300,
							closeAction: "hide",
							resizable: false,
							buttons: [{
								text: "Reload",
								handler: function () {
									var h = {};
									h.params = {
										action: "load",
										comboTypes: "[]"
									};
									h.waitMsg = true;
									this.load(h);
									this.concurrencyAlertWindow.hide()
								},
								scope: this
							}, {
								text: "Cancel",
								handler: function () {
									this.concurrencyAlertWindow.hide()
								},
								scope: this
							}, this]
						}, this);
						this.concurrencyAlertWindow = c
					}
					if (DCPLApp.ActiveTab && DCPLApp.ActiveTab.container && DCPLApp.ActiveTab.container.mask()) {
						DCPLApp.ActiveTab.container.mask().hide()
					}
					this.concurrencyAlertWindow.html = d;
					this.concurrencyAlertWindow.show()
				} else {
					Ext.callback(e.failure, e.scope, [this, a]);
					this.fireEvent("actionfailed", this, a)
				}
			}
		}
	}
});

Ext.override(Ext.dd.DropZone, {
	notifyOver: function (dd, e, data) {
		this.currentScrollLocation = e.target.offsetLeft
		var gridInnerWidth = dd.grid.getInnerWidth();
		this.currentScrollView = gridInnerWidth;

		if (this.currentScrollLocation > this.currentScrollView) {
			this.currentScrollView = this.currentScrollView + gridInnerWidth
		}
		if (this.currentScrollLocation < this.currentScrollView) {
			this.currentScrollView = this.currentScrollView - gridInnerWidth
		}

		if (this.currentScrollLocation < this.currentScrollView) {
			this.currentScrollLocation = this.currentScrollLocation + 100;
			dd.grid.view.scroller.scrollTo('left', this.currentScrollLocation, true)
		}
		if (this.currentScrollLocation > this.currentScrollView) {
			this.currentScrollLocation = this.currentScrollLocation - 100;
			dd.grid.view.scroller.scrollTo('left', this.currentScrollLocation, true)
		}

		var n = this.getTargetFromEvent(e);
		if (!n) { // not over valid drop target
			if (this.lastOverNode) {
				this.onNodeOut(this.lastOverNode, dd, e, data);
				this.lastOverNode = null;
			}
			return this.onContainerOver(dd, e, data);
		}
		if (this.lastOverNode != n) {
			if (this.lastOverNode) {
				this.onNodeOut(this.lastOverNode, dd, e, data);
			}
			this.onNodeEnter(n, dd, e, data);
			this.lastOverNode = n;
		}
		return this.onNodeOver(n, dd, e, data);
	},
});
ExtHelper.ControllerExtension = ".ashx";

Cooler = {
	Version: 1.0,
	AppDataPath: "AppData/",
	BaseSerialNumber: 31657719406704,

	getLogoPath: function (fileName) {
		if (fileName != null && typeof (fileName) == 'string' && fileName.length > 0) {
			return this.AppDataPath + "CompanyLogo/" + fileName;
		}
	},



	openPasswordChangePrompt: function () {
		if (!this.win) {
			var password = new Ext.form.TextField({
				fieldLabel: 'Password',
				name: 'password',
				inputType: 'password',
				allowBlank: false,
				minLength: 3,
				maxLength: 50
			});
			var newPassword = new Ext.form.TextField({
				fieldLabel: 'NewPassword',
				name: 'newPassword',
				inputType: 'password',
				allowBlank: false,
				minLength: 3,
				maxLength: 50
			});
			var confirmPassword = new Ext.form.TextField({
				fieldLabel: 'ConfirmPassword',
				name: 'confirmPassword',
				inputType: 'password',
				allowBlank: false,
				minLength: 3,
				maxLength: 50
			});

			var formPanel = new Ext.form.FormPanel({

				labelWidth: 100,
				bodyStyle: "padding:15px;",
				items: [

					password,
					newPassword,
					confirmPassword

				],
			});

			var window = new Ext.Window({

				title: 'Change password',
				resizable: false,
				closable: false,
				items: formPanel,
				layout: 'fit',
				height: 180,
				width: 400,
				modal: true,
				closeAction: 'hide',
				draggable: false,
				buttons: [
					{
						text: 'Change Now', handler: function () {
							// check form value 
							if (password.getValue().length == 0 || newPassword.getValue().length == 0 || confirmPassword.getValue().length == 0) {
								Ext.Msg.alert('Missing Data', 'You must enter all the info to change password');
								return;
							}
							if (password.getValue() == newPassword.getValue()) {
								Ext.Msg.alert('Wrong Data', 'Old and new password should not be same.');
								return;
							}
							if (newPassword.getValue() != confirmPassword.getValue()) {
								Ext.Msg.alert('Mismatched Data', 'New password and confirmation password should be same');
								return;
							}

							formPanel.form.submit({
								url: EH.BuildUrl('ChangeLoginPasword'),
								params: { action: 'changePassword' },
								waitMsg: 'Checking...',
								failure: function (form, action) {
									Ext.MessageBox.alert('Error', action.result.message);
								},
								success: function (form, action) {
									window.hide();
									Ext.MessageBox.alert('Password change', action.result.message);
								}
							});
						}
					},
					{ text: 'Remind Me Later', handler: function () { window.hide(); } },
					{
						text: 'Dont Show This Message Again', handler: function () {
							Ext.Ajax.request({
								url: EH.BuildUrl('ChangeLoginPasword'),
								params: { action: 'ignorePasswordChange' },
								waitMsg: 'Checking...',
								failure: function (form, action) {
									Ext.Msg.alert('Error', 'Invalid');
								},
								success: function (form, action) {
									window.hide();
									Ext.Msg.alert('Successful    ', 'Done!      ');
								}
							});
						}
					}
				]
			});

			this.formPanel = formPanel;
			this.password = password;
			this.win = window;
		}
		this.formPanel.form.reset();
		this.win.show();
		this.password.focus(true, true);
	},
	attachStockMouseOver: function (grid) {
		grid.tip = new Ext.ToolTip({
			grid: grid,
			view: grid.getView(),
			target: grid.getView().mainBody,
			delegate: '.x-grid3-td-stock',
			trackMouse: true,
			renderTo: document.body,
			listeners: {
				beforeshow: function updateTipBody(tip) {
					var grid = tip.grid;
					var rowIndex = tip.view.findRowIndex(tip.triggerElement);
					var row = grid.store.getAt(rowIndex);
					tip.body.update(Cooler.stockRenderer(row.get('StockDetails')));
				}
			}
		});
	},

	initStartup: function () {
		if (DA.Security.info.Tags.IsFirstLogin == "1") {
			this.openPasswordChangePrompt();
		}
		this.initStockTooltip();
		//this.startKeepAlive();
		ExtHelper.DateFormat = DA.Security.info.Tags.DateFormat;
		ExtHelper.DateTimeFormat = ExtHelper.DateFormat + ' ' + ExtHelper.TimeFormat;
		ExtHelper.ShortDateTimeFormat = ExtHelper.DateFormat + ' ' + ExtHelper.ShortTimeFormat;
		ExtHelper.renderer.Date = function (v) {
			var format = ExtHelper.DateFormat || 'd/m/Y';
			return Ext.util.Format.date(v, format);

		}
	},

	initStockTooltip: function () {
		DCPLApp.TabPanel.remove(0); // removing Analytics tab for Operator
		if (DA.Security.HasPermission('Operator', 'Add') && !DA.Security.HasPermission('Admin')) {
			DCPLApp.MenuTree.collapse(true); // collapse navigation if user is operator
			Cooler.CoolerImage.ShowList({}, { extraParams: { fromWeb: true, fromBackOfficeWithSubStatus: 1 } });
			this.createImageInfo();
		}
		var tooltip = new Ext.ToolTip({
			renderTo: Ext.getBody(),
			target: Ext.getBody(),
			delegate: "div.cooler-stock",
			title: 'something',
			html: 'Demo',
			trackMouse: true,
			listeners: {
				beforeshow: this.beforeStockTooltip,
				scope: this
			}
		});

		this.loadGlobalCombos();
	},

	comboStores: {
		Product: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		EventType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		MovementType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		ImageRecognitionContentStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		ImageRecognitionQualityStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', mode: 'local' }),
		AlertStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, mode: 'local' })
	},

	loadGlobalCombos: function () {
		var comboTypes = [], comboStores = this.comboStores;
		for (var o in comboStores) {
			comboTypes.push({ type: o, loaded: false });
		}
		var params = {
			action: 'load',
			id: 0,
			comboTypes: Ext.encode(comboTypes)
		};

		ExtHelper.GenericConnection.request({
			url: EH.BuildUrl('Asset'),
			params: params,
			callback: function (o, success, response) {
				var record = Ext.util.JSON.decode(response.responseText);
				if (record && record.data) {
					var comboData = new Array(10);
					comboData = record.combos;
					for (var prop in comboData) {
						if (this.comboStores[prop]) {
							this.comboStores[prop].loadData(comboData[prop]);
						}
					}
				}
			},
			scope: this
		});
	},

	beforeStockTooltip: function (tip) {
		tip.body.update(this.stockRenderer(tip.triggerElement.getAttribute("stock")));
	},
	createImageInfo: function () {
		var imageInfo = Ext.get("imageInfo");
		if (imageInfo != null) {
			imageInfo.removeClass("x-hidden");
		}
		this.showCoolerInfo = {
			run: function () {
				Ext.Ajax.request({
					url: EH.BuildUrl('AssetPurity'),
					params: {
						action: 'other',
						otherAction: 'ShowCoolerInfo'
					},
					success: function (response) {
						var imageInfo = null,
							res = Ext.decode(response.responseText);
						var imageTpl = '<li id="active"><a><b>Total Images: <b>' + res.TotalCoolerImages + '</a></li><li><a><b>Processed Images: </b>' + res.ProcessedImages + '</a></li><li><a><b>Unprocessed Images: <b>' + res.UnprocessedImages + '</a></li><li><a><b>Online Users: <b>' + res.UserOnline + '</a></li>';
						var infoDiv = Ext.fly(document.getElementsByClassName('imageInfo'));
						infoDiv.dom[0].innerHTML = imageTpl // To Do need better way to get element from dom 
					},
					failure: function () {
						Ext.Msg.alert('Error', 'An error occured while fetching details');
					},
					scope: this
				});
			},
			interval: 15000 //15 Second
		};
		Ext.TaskMgr.start(this.showCoolerInfo, this);
	},

	stockRenderer: function (stock) {
		var rows = [];
		var row = [];
		if (stock) {
			for (var i = 0, len = stock.length; i < len; i++) {
				if (i > 0 && i % 8 == 0) {
					rows.push(row.join(""));
					row = [];
				}
				var bits;
				if (stock.charCodeAt(i) > 47 && stock.charCodeAt(i) < 65) {
					bits = Array(Number(stock.charCodeAt(i))).join("1") + "00000000";
				}
				else {
					bits = stock.charCodeAt(i).toString(2) + "00000000";
				}
				bits = bits.substring(0, 8);
				row.push("<td><div class='bit" + (bits.split('').reverse()).join("'></div><div class='bit") + "'></div></td>");
			}
			rows.push(row.join(""));
			return "<table class='stockDetail'><tr>" + rows.join("</tr><tr>") + "</tr></table>";
		}
	},
	zoomIn: function () {
		this.zoom(1);
	},

	zoomOut: function () {
		this.zoom(2);
	},

	zoom: function (zoomType) {
		var images = this.imagePanel.items.items;
		for (var i = 0, len = images.length; i < len; i++) {
			this.setZoomSize(images[i], zoomType);
		}
	},

	setZoomSize: function (img, zoomType) {
		var oldSize = img.getSize(),
			zoomVal = 1.1,
			width = 0, height = 0,
			images, currImageIndex;
		switch (zoomType) {
			case 1:
				width = Math.round(oldSize.width * zoomVal);
				height = Math.round(oldSize.height * zoomVal);
				break;
			case 2:
				width = Math.round(oldSize.width / zoomVal);
				height = Math.round(oldSize.height / zoomVal);
				break;
		}
		var parentWidth = this.imagePanel.getSize().width;
		if (width > parentWidth) {
			img.el.setStyle('max-width', null);
		}
		else {
			img.el.setStyle('max-width', '98%');
		}
		images = this.imagePanel.items.items;
		currImageIndex = images.indexOf(img);
		if (currImageIndex > 0) {
			var prevImage = images[currImageIndex - 1], prevImageSize = prevImage.getSize();
			img.setPosition(0, prevImageSize.height);
		}
		img.setSize(width, height);
	},
	showCoolerImage: function (record) {
		var childItems = [];
		var btnZoomOut = new Ext.Toolbar.Button({ text: 'Zoom Out', handler: this.zoomOut, scope: this });
		var btnZoomIn = new Ext.Toolbar.Button({ text: 'Zoom In', handler: this.zoomIn, scope: this });
		var count = record.get('ImageCount');
		var imageId = record.get('AssetPurityId');
		var imageName = record.get('ImageName');
		var origImageName = record.get('StoredFilename');
		var purityDatetime = record.get('PurityDateTime').format('Ymd');
		if (imageName && !Ext.isEmpty(imageName)) {
			var imageNameArray = imageName.split(',');
			for (var j = 0; j < imageNameArray.length; j++) {
				var imageName = imageNameArray[j];
				var image = this.getNewImage(imageName, imageId, purityDatetime);
				childItems.push(image);
			}
		} else {
			if (origImageName && count > 1) {
				for (var i = 1; i <= count; i++) {
					var imageName = origImageName.replace('.jpg', '_' + i + '.jpg');
					var image = this.getNewImage(imageName, imageId, purityDatetime);
					childItems.push(image);
				}
			}
			else {
				if (origImageName && count == 1) {
					var origImageName = origImageName.replace('.jpg', '_' + count + '.jpg');
				}
				var image = this.getNewImage(origImageName, imageId, purityDatetime);
				childItems.push(image);
			}
		}
		childItems[0].region = 'center';
		if (childItems.length > 1) {
			childItems[1].region = 'south';
		}

		var imagePanel = new Ext.Panel({
			region: 'center',
			autoScroll: true,
			tbar: [btnZoomOut, btnZoomIn],
			items: childItems
		});
		this.imagePanel = imagePanel;
		var coolerImagePreviewWin = new Ext.Window({
			width: 1000,
			height: 650,
			layout: 'border',
			maximizable: true,
			modal: true,
			autoScroll: true,
			closeAction: 'hide',
			items: [
				imagePanel,
				{
					xtype: 'panel',
					itemId: 'detail',
					region: 'south',
					autoScroll: true,
					height: 110
				}]
		});
		coolerImagePreviewWin.setTitle(imageId);
		coolerImagePreviewWin.show();
		var purityStatus = record.get('PurityStatus').split(','),
			shelves = record.get('Shelves'),
			columns = record.get('Columns');
		var productStore = Cooler.comboStores.Product;
		var rows = [], pos = 0;
		var rowData = [''];
		for (var index = 1; index <= columns; index++) {
			rowData.push(index);
		}
		rows.push("<td>" + rowData.join("</td><td>") + "</td>");
		for (var row = 0; row < shelves; row++) {
			rowData = [row + 1];
			for (var column = 0; column < columns; column++) {
				var value = purityStatus.length > pos ? (Number(purityStatus[pos]) || 1) : 1;
				var productInfo = productStore.getById(value);
				var isForeign = productInfo ? (productInfo.get('CustomValue') === 1) : false;
				var productName = productInfo ? productInfo.get('DisplayValue') : '';
				rowData.push((isForeign ? '<div class="foreignProduct">' : '') + productName + (isForeign ? '</div>' : ''));
				pos++;
			}
			rows.push("<td>" + rowData.join("</td><td>") + "</td>");
		}
		coolerImagePreviewWin.getComponent('detail').body.update('<table class="borderTable"><tr>' + rows.join('</tr><tr>') + '</tr></table>');
	},
	getNewImage: function (name, id, purityDatetime) {
		var img = new Ext.ux.Image({
			style: {
				'display': 'block'
			},
			src: 'Controllers/CoolerImagePreview.ashx?AssetImageName=' + name + '&ImageId=' + id + '&v=' + new Date() + '&PurityDateTime=' + purityDatetime
		});
		return img;
	},

	getTimeZone: function (timeZoneId) {
		var timeZoneCombo = Cooler.comboStores.TimeZone
		var timeZoneInfo = timeZoneCombo.getById(timeZoneId);
		if (timeZoneInfo) {
			return timeZoneCombo.getById(timeZoneId).get('CustomStringValue');
		}
		return '';
	},

	keepAlive: function () {
		Ext.Ajax.request({
			url: EH.BuildUrl('KeepAlive'),
			params: {
				action: 'keepAlive'
			},
			scope: this
		});
	},

	startKeepAlive: function () {
		var keepAliveTask = {
			run: this.keepAlive,
			interval: 1 * 60 * 1000, /* every 1 minute */
			scope: this
		};

		Ext.TaskMgr.start(keepAliveTask);
	},

	plugins: {}
}

DA.App = Cooler;
// Added due to log the JS Errors for the AppName.
var prefix = document.URL.indexOf("https:") > -1 ? 'https' : 'http';
DA.App.AppName = 'Cooler';
DA.App.hidePdfOption = true;
DA.Defaults.Form.saveMask = "Please wait...";
DA.App.ReLoginOnSessionExpired = true;
DA.App.ExceptionUrl = window.location.origin + "/Controllers/ExceptionHandler.ashx?MachineName=" + DA.App.AppName + "&DateTime=" + new Date().format('m/d/y h:m:s a') + "&DateTimeUTC=" + new Date().format('m/d/y h:m:s a'),
	JsLoggerEx.initialize();

DCPLApp.initialConfig = {
}

Cooler.Form = function (config) {
	Ext.applyIf(config, {
		gridConfig: {},
		save: false,
		newButton: false
	});

	Ext.applyIf(config.gridConfig, {
		autoFilter: { quickFilter: true },
		prefManager: true,
		custom: {
			helpButton: false
		}
	});

	Cooler.Form.superclass.constructor.call(this, config);
}

Ext.extend(Cooler.Form, DA.Form, {
	loadComboStores: function () {
		for (var prop in this.comboData) {
			if (this.comboStores[prop]) {
				this.comboStores[prop].loadData(this.comboData[prop]);
			}
		}
		if (typeof (this.afterLoadComboStores) == 'function') {
			this.afterLoadComboStores();
		}
	},

	loadTags: function (tagsPanel, data) {
		var storeItems = [];
		var tagsData = '';
		if (data != undefined) {
			tagsData = data.moreInfo;
		}

		if (tagsData != null && tagsData != '' && tagsData != undefined) {
			tagsPanel.removeAllItems();
			for (var j = 0; j < tagsData.length; j++) {
				var comboRecord = tagsData[j];
				storeItems.push([comboRecord.Id, comboRecord.Name]);
			}
			var store = new Ext.data.SimpleStore({ fields: ['LookupId', 'DisplayValue'], data: storeItems });
			tagsPanel.store = store;
			for (var j = 0; j < tagsData.length; j++) {
				tagsPanel.setValue(tagsData[j].Name);
			}
		}
	},
	saveTags: function (tagsPanel, params) {
		params.TagsValue = tagsPanel.getValue();
	},
	adhocReporting: true
});

Cooler.renderer = {};
Ext.tree.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
	lines: false,
	borderWidth: Ext.isBorderBox ? 0 : 2, // the combined left/right border for each cell
	cls: 'x-column-tree',
	collapsible: false,

	onRender: function () {
		Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
		this.headers = this.body.createChild({
			cls: 'x-tree-headers'
		}, this.innerCt.dom);

		var cols = this.columns,
			c;
		var totalWidth = 0;

		for (var i = 0, len = cols.length; i < len; i++) {
			c = cols[i];
			totalWidth += c.width;
			this.headers.createChild({
				cls: 'x-tree-hd ' + (c.cls ? c.cls + '-hd' : ''),
				cn: {
					cls: 'x-tree-hd-text',
					html: c.header
				},
				style: 'width:' + (c.width - this.borderWidth) + 'px;'
			});
		}
		this.headers.createChild({
			cls: 'x-clear'
		});
		// prevent floats from wrapping when clipped
		this.headers.setWidth(totalWidth);
		this.innerCt.setWidth(totalWidth);
	}
});

Ext.tree.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
	focus: Ext.emptyFn, // prevent odd scrolling behavior

	renderElements: function (n, a, targetNode, bulkRender) {
		this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

		var t = n.getOwnerTree();
		var cols = t.columns;
		var bw = t.borderWidth;
		var c = cols[0];

		n.cols = new Array();

		var text = n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]);
		n.cols[cols[0].dataIndex] = text;

		var buf = [
			'<li class="x-tree-node" unselectable="on"><div ext:tree-node-id="', n.id, '" class="x-tree-node-el x-tree-node-leaf ', a.cls, '" unselectable="on">',
			'<div class="x-tree-col" style="width:', c.width - bw, 'px;" unselectable="on">',
			'<span class="x-tree-node-indent" unselectable="on">', this.indentMarkup, "</span>",
			'<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" unselectable="on">',
			'<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? " " + a.iconCls : ""), '" unselectable="on">',
			'<a hidefocus="on" class="x-tree-node-anchor" href="', a.href ? a.href : "#", '" tabIndex="1" ',
			a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "", ' unselectable="on">',
			'<span unselectable="on">', text, "</span></a>",
			"</div>"];
		for (var i = 1, len = cols.length; i < len; i++) {
			c = cols[i];
			var text = (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]);
			n.cols[cols[i].dataIndex] = text;
			buf.push('<div class="x-tree-col ', (c.cls ? c.cls : ''), '" style="width:', c.width - bw, 'px;" unselectable="on">',
				'<div class="x-tree-col-text" unselectable="on">', text, "</div>",
				"</div>");
		}
		buf.push(
			'<div class="x-clear" unselectable="on"></div></div>',
			'<ul class="x-tree-node-ct" style="display:none;" unselectable="on"></ul>',
			"</li>");

		if (bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
				n.nextSibling.ui.getEl(), buf.join(""));
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
		}

		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.firstChild.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		this.anchor = cs[3];
		this.textNode = cs[3].firstChild;
	}
});
Ext.tree.ColumnTreeEditor = function (tree, config) {
	config = config || {};
	var field = config.events ? config : DA.combo.create({ itemId: 'userTypeCombo', baseParams: { comboType: 'UserType' }, listWidth: 180, controller: "Combo" });
	Ext.tree.TreeEditor.superclass.constructor.call(this, field);
	this.tree = tree;
	if (!tree.rendered) {
		tree.on('render', this.initEditor, this);
	} else {
		this.initEditor(tree);
	}
};

Ext.extend(Ext.tree.ColumnTreeEditor, Ext.tree.TreeEditor, {

	alignment: "l-l",
	autoSize: false,

	hideEl: false,

	cls: "x-small-editor x-tree-editor",

	shim: false,
	shadow: "frame",

	maxWidth: 250,

	editDelay: 0,

	initEditor: function (tree) {
		tree.on('beforeclick', this.beforeNodeClick, this);
		this.on('complete', this.updateNode, this);
		this.on('beforestartedit', this.fitToTree, this);
		this.on('startedit', this.bindScroll, this, {
			delay: 10
		});
		this.on('specialkey', this.onSpecialKey, this);
	},

	fitToTree: function (ed, el) {
		var td = this.tree.getTreeEl().dom,
			nd = el.dom;
		if (td.scrollLeft > nd.offsetLeft) {
			td.scrollLeft = nd.offsetLeft;
		}
		var w = Math.min(
			this.maxWidth,
			(td.clientWidth > 20 ? td.clientWidth : td.offsetWidth) - Math.max(0, nd.offsetLeft - td.scrollLeft) - 5);
		this.setSize(w, '');
	},

	triggerEdit: function (node, e) {
		var obj = e.target;
		if (Ext.select(".x-tree-node-anchor", false, obj).getCount() == 1) {
			obj = Ext.select(".x-tree-node-anchor", false, obj).elements[0].firstChild;
		} else if (obj.nodeName == 'SPAN' || obj.nodeName == 'DIV') {
			obj = e.target;
		} else {
			return false;
		}

		var colIndex = 0;
		for (var i in node.cols) {
			if (node.cols[i] == obj.innerHTML && i !== 'text') {
				colIndex = i;
			}
		}
		if (colIndex === 'manager') { // only showing combo on manager column 
			this.completeEdit();
			this.editNode = node;
			this.editCol = obj;
			this.editColIndex = colIndex;
			this.startEdit(obj);
			if (obj.nodeName == 'DIV') {
				var width = obj.offsetWidth;
				this.setSize(width);
			}
		}
	},

	bindScroll: function () {
		this.tree.getTreeEl().on('scroll', this.cancelEdit, this);
	},

	beforeNodeClick: function (node, e) {
		var sinceLast = (this.lastClick ? this.lastClick.getElapsed() : 0);
		this.lastClick = new Date();
		if (sinceLast > this.editDelay && this.tree.getSelectionModel().isSelected(node)) {
			e.stopEvent();
			this.triggerEdit(node, e);
			return false;
		} else {
			this.completeEdit();
		}
	},

	updateNode: function (ed, value) {
		this.tree.getTreeEl().un('scroll', this.cancelEdit, this);
		this.editNode.cols[this.editColIndex] = value; //for internal use only
		this.editNode.attributes[this.editColIndex] = value; //duplicate into array of node attributes
		this.editCol.innerHTML = ed.field.getRawValue();
	},

	onHide: function () {
		Ext.tree.TreeEditor.superclass.onHide.call(this);
		if (this.editNode) {
			this.editNode.ui.focus();
		}
	},

	onSpecialKey: function (field, e) {
		var k = e.getKey();
		if (k == e.ESC) {
			e.stopEvent();
			this.cancelEdit();
		} else if (k == e.ENTER && !e.hasModifier()) {
			e.stopEvent();
			this.completeEdit();
		}
	}
});

Cooler.MonthDateYear = 'm-d-Y',
	Cooler.renderer.MonthDateYear = function (v, m, r) {
		if (r.data.DateFormatId) {
			var dateFormateId = r.data.DateFormatId;
			if (dateFormateId == 6284) {
				Cooler.MonthDateYear = 'd/m/Y'
			}
			else if (dateFormateId == 6285) {
				Cooler.MonthDateYear = 'm/d/Y'
			}
			else if (dateFormateId == 6286) {
				Cooler.MonthDateYear = 'Y/m/d'
			}
			else {
				Cooler.MonthDateYear = 'm/d/Y'
			}
		}
		if (!Ext.isDate(v)) {
			return v;
		} else {
			var timeZone = ' ' + v.getTimezone();
			return v.format(Cooler.MonthDateYear);
		}
	};

Cooler.renderer.Hyperlink = function (v, m, r) {
	m.css += ' hyperlink';
	return v;
},

	Cooler.renderer.timeRenderer = function (v, m, r) {
		if (v) {
			var t = v;
			if (!Ext.isDate(v)) {
				var dateString = "1900/01/01 " + v;
				t = new Date(dateString);
			}
			return t.format('h:i A');
		} else {
			return '';
		}
	};

Cooler.renderer.DateTimeWithLocalTimeZone = function (v, m, r) {
	if (!Ext.isDate(v)) {
		return v;
	} else {
		var timeZone = ' ' + v.getTimezone();
		return v.format(ExtHelper.DateTimeFormat) + timeZone;
	}
};

Cooler.renderer.DateTimeWithTimeZone = function (v, m, r) {
	if (!Ext.isDate(v)) {
		return v;
	} else {
		if (!r.data.TimeZoneId) {
			r.data.TimeZoneId = 35; // UTC
		}
		var timeZone = Cooler.getTimeZone(r.data.TimeZoneId);
		timeZone = timeZone ? ' ' + timeZone : '';
		return v.format(ExtHelper.DateTimeFormat) + timeZone;
	}
};

Cooler.renderer.CalculateStockFromDistanceData = function (value, model, record) {
	var data = record.data;
	var stockData = 0;

	if (data.ModuleTypeId == 5 && data.ModuleActivityId == 2) {
		var receivedDistance = data.ActivityData;
		if (receivedDistance > data.ContainerLength) { //--BoxWidth
			receivedDistance = data.ContainerLength;
		}
		var distance1 = data.ContainerLength - receivedDistance;
		var stockTemp = distance1 / data.BoxWidth;
		var temp1 = distance1 % data.BoxWidth;
		var temp2 = data.BoxWidth / 2;
		if (temp1 > temp2) {
			stockTemp = stockTemp + 1;
		}
		stockData = Math.round(stockTemp);
		//}
	}
	else {
		stockData = data.ActivityData;
	}
	return stockData;
};

Cooler.renderer.DistanceData = function (value, model, record) {
	var data = record.data;
	var distanceData = 0;
	if (data.ModuleTypeId == 5 && data.ModuleActivityId == 2) {
		distanceData = data.ActivityData;
	}
	return distanceData;
};


Cooler.renderer.PowerStatus = function (value) {

	if (value) {
		return "On";
	}
	else {
		return "Off";
	}
},

	Cooler.renderer.DateTimeWithTimeZoneForTpl = function (v, timezoneId) {
		if (!Ext.isDate(v)) {
			return v;
		} else {
			var timeZone = Cooler.getTimeZone(timezoneId);
			timeZone = timeZone ? ' ' + timeZone : '';
			return v.format(ExtHelper.DateTimeFormat) + timeZone;
		}
	},
	// on mouse over show the bigger image
	Cooler.showBigImage = function (div) {
		var img = div.children[0];
		var imgCoordinates = img.getBoundingClientRect();
		if (!this.gridTooltip) {
			this.gridTooltip = new Ext.Layer({ shadow: false, shim: false });
		}
		this.gridTooltip.update('<div><div><img width="50" src=' + img.getAttribute('src') + '></div><div style="text-align: center;">' + img.getAttribute('name') + '</div></div>');
		this.gridTooltip.setLeftTop(imgCoordinates.left + 15, imgCoordinates.top);
		this.gridTooltip.setVisible(true);
	},

	// on mouse out hide the bigger image the image
	Cooler.hideBigImage = function () {
		if (this.gridTooltip) {
			this.gridTooltip.setVisible(false);
		}
	}
Cooler.renderer.AssetIssue = function (value, model, record) {
	var data = record.data;
	var returnHtml = '<div class="alertIssues-div-container">'
	if (data.OpenHealthAlert) {
		returnHtml += '<div class="alertIssues-image-div" onmouseover="Cooler.showBigImage(this);" onmouseout= "Cooler.hideBigImage(this);"><img src="images/AlertType/Health.png" class="alertIssues-image" name="Health"/></div>'
	}
	if (data.OpenMissingAlert) {
		returnHtml += '<div class="alertIssues-image-div" onmouseover="Cooler.showBigImage(this);" onmouseout= "Cooler.hideBigImage(this);"><img src="images/AlertType/MissingData.png" class="alertIssues-image" name="Missing Data"/></div>'
	}
	if (data.OpenPurityAlert) {
		returnHtml += '<div class="alertIssues-image-div" onmouseover="Cooler.showBigImage(this);" onmouseout= "Cooler.hideBigImage(this);"><img src="images/AlertType/Purity.png" class="alertIssues-image" name="Purity"/></div>'
	}
	if (data.OpenMovementAlert) {
		returnHtml += '<div class="alertIssues-image-div" onmouseover="Cooler.showBigImage(this);" onmouseout= "Cooler.hideBigImage(this);"><img src="images/AlertType/Movement.png" class="alertIssues-image" name="Movement"/></div>'
	}
	if (data.OpenStockAlert) {
		returnHtml += '<div class="alertIssues-image-div" onmouseover="Cooler.showBigImage(this);" onmouseout= "Cooler.hideBigImage(this);"><img src="images/AlertType/Stock.png" class="alertIssues-image" name="Stock"/></div>'
	}
	return returnHtml + '</div>';
},
	Cooler.DateWithSecondFormat = 'm/d/Y h:i:s A';
Cooler.MacAdddressRegExp = RegExp("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$");
Cooler.Enums = {};
Cooler.Enums.QuestionType = { Text: 4201, TextArea: 4202, Image: 4203, Number: 4204, Choice: 4205, Date: 4206 };
Cooler.Enums.SurveyConfig = { Standard: 4217, Advance: 4218 };
Cooler.Enums.QuestionCategory = { Availability: 4191, Activation: 4192, Cooler: 4193, InStore: 4222, Store: 4223, AdditionalInfo: 4224 };
Cooler.Enums.AssetPurityStatus = { Unprovisioned: 0, New: 1, Provisioned: 2, Rejected: -1, Processed: 13 };
Cooler.Enums.ReportTypePieChart = { SmartCoolers: 1, ActiveCoolers: 2 };
Cooler.Enums.ReportTypeStackedChart = { HealthIssues: 1 };
Cooler.Enums.Role = { Admin: 1, Operator: 5, SalesPerson: 2, ClientAdmin: 28 };
Cooler.Enums.AssociationType = { Location: 1, Customer: 11 };
Cooler.Enums.AlertType = { Health: 10, Door: 5, Movement: 13, Power: 17, Battery: 1, Stock: 19, Purity: 18, DeviceAccumulatedMovement: 4, HubAccumulatedMovement: 11, GpsDisplacement: 9, EnvironmentHealth: 8, CoolerMalfunction: 3, StockAlertProductWise: 21, StockAlertShelfWise: 22, CoolerConnectivity: 2, DoorOpenMax: 6, DoorOpenMin: 7, MissingData: 12, NoData: 14, NoDoorData: 15, PlanogramAlert: 16, MovementCount: 20, Light: 23, EnvironmentLight: 24, DoorPercentage: 25, OutletSOVI: 26, VHCoreBattery: 27, OutOfStock: 28, LowStock: 29, ProductPositionAlert: 30, SmartRewardIssue: 31, DoorOpenMinAndSales: 32, LightOffHoursAndSales: 33, TemperatureAndSales: 34, HighUtilizationLowSales: 35, LowUtilizationHighSales: 36, SystemDoor: 37, OutofStockSKUBased: 38, OutofStockPlanogramBased: 39, HubMovementDuration: 40, StokeSensorAlert: 41, NoInitialTransmission: 42, NonAuthorizedMovement: 43, Battery_GSM: 44, SmartTemperatureAlert: 45, CoolerMissing: 46 };
Cooler.Enums.EventType = { HealthyEvent: 0, Environment: 10 };
Cooler.Enums.MovementType = { DeviceAccumulated: 170, HubAccumulated: 171, DeviceMovement: 82, GPSDisplacement: 78, HubMovement: 117 };
Cooler.Enums.Product = { Unknown: 0 };
Cooler.Enums.ChartType = { BIAlerts: 0, All: 1, Health: 2, Planogram: 3, Purity: 4, ShelfVoid: 5, VisitEffectiveness: 6 };
Cooler.Enums.ReccurencePattern = { Daily: 181, Weekly: 184, Monthly: 183, Yearly: 185, Hourly: 182 };
Cooler.Enums.ValidLatLong = { Latitude: 90, Longitude: 180 };
Cooler.Enums.Image = { First: 1, Second: 2 };
Cooler.Enums.LoadPurityImage = { Count: 5, WindowCount: 1 };
Cooler.Enums.Options = { Count: 4 };
Cooler.Enums.Category = { Employee: 4219, Consumer: 4220, Customer: 4221, Retailer: 5265 };
Cooler.Enums.SurveyType = { Feedback: 4195, Prospect: 4196 };
Cooler.Enums.DateFormat = { PurityDate: 'Ymd', PurityProcessedDate: 'MMM D YYYY HH:mm:ss', PurityPingDate: 'Y/m/d', PurityPingTime: 'h:m', Date: 'm/d/y', DMY: 6284 };
Cooler.Enums.CoolerFilterCategory = { All: 1, Displaced: 2 };
Cooler.Enums.AlertRecipientType = { Email: 72, Text: 73, SalesRep: 74, Role: 5251 };
Cooler.Enums.ContactType = { Email: 5233, Prefered: 5234, Text: 5235, MobileNotification: 5236 };
Cooler.Enums.SmartDeviceType = { SmartTrackV1: 1, SmartTagV2R1: 2, SmartVisionV2R1: 3, SmartHub: 4, SmartTrackV2: 5, SmartVisionV5R1: 7, SmartTagV3R3: 8, LoRaTagV3r3: 9, VirtualHub: 12, SmartCore: 13, BluVisioniBeek: 14, SmartTag2ndGeneration: 15, SmartTagV3R1: 16, ST1031: 18, ImberaCMD: 21, SmartBeaconV1R1: 23, ImberaHub: 24, SmartBeaconMINEW: 25, SmartVisionV6R2: 26, SmartHub2ndGen: 27, Wellington: 28, SollatekGBR4: 29, SollatekFFMB: 30, SmartHub3rdGen: 31, SollatekGMC0: 32, SmartTag3rdGeneration: 33, SollatekFFM2: 34, SmartTag4thGeneration: 35, SollatekGBR1: 36, SollatekGBR2: 37, SollatekGBR3: 38, SmartTagSwire: 39, SmartVisionV7R1: 40, SollatekFFM2BB: 41, StockSensor: 42, StockGateway: 43, SollatekFFX: 44, SmartTrackAON: 45, SmartHubCATM: 46, SmartTag4gV2: 47, SollatekJEA: 48, StockSensorIR: 49, SmartTagM: 50, WellingtonClick: 51, LoRaSmartTag: 52, SmartTagAONBG96: 53, SmartTag4GL: 54, SmartTag4GL2: 55, ThincBeacon: 56, NexoEMS100: 57 };
Cooler.Enums.WeekDays = { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7 };
Cooler.Enums.OutletSOVIType = { Colas: 5248, Flavours: 5249, ColasAndFlavours: 5250 };
Cooler.Enums.FirmwareFileType = { Hex: 1, Zip: 2, Bin: 3 };
Cooler.Enums.Days = { WeekDays: 7, MonthDays: 30 };
Cooler.Enums.ValidMinorMajor = { MinMinor: 1, MaxMinor: 65535, MinMajor: 1, MaxMajor: 65535 };
Cooler.Enums.IRProductCluster = { Gold: 8333, Silver: 8334 };
Cooler.Enums.LightValue = { STFirstGenNoLight: 19, STFirstGenLowBrightness: 30, STFirstGenMediumBrightness: 450, SVFirstGenNoLight: 3, SVFirstGenLowBrightness: 5, SVFirstGenMediumBrightness: 23, STSecondGenNoLight: 10, STSecondGenLowBrightness: 100, STSecondGenMediumBrightness: 160 };
Cooler.Enums.SmartDeviceCommandType = {
	SET_CHANGE_PASSWORD: 1,
	SET_INTERVAL: 2,
	SET_REAL_TIME_CLOCK: 3,
	SET_GPS_LOCATION: 4,
	SET_MAJOR_MINOR_VERSION: 5,
	SET_IBEACON_UUID: 6,
	SET_SERIAL_NUMBER: 7,
	SET_ADVERTISING_PERIOD: 8,
	SET_SENSOR_THRESHOLD: 9,
	SET_STANDBY_MODE: 10,
	SET_DOOR_OPEN_ANGLE: 11,
	SET_CAMERA_SETTING: 12,
	ENABLE_TAKE_PICTURE: 13,
	SET_CAMERA_FACTORY_DEFAULT_SETTING: 14,
	SET_MAC_ADDRESS: 15,
	READ_CALIBRATE_GYRO: 16,
	SET_DEEP_SLEEP: 17,
	SET_IMAGE_CAPTURE_MODE: 28,

	FETCH_DATA: 128,
	FIRMWARE_DETAIL: 129,
	CURRENT_TIME: 130,
	RESTART_DEVICE: 131,
	RESET_DEVICE: 132,
	CURRENT_SENSOR_DATA: 133,
	EVENT_COUNT: 134,
	LATEST_N_EVENTS: 135,
	ERASE_EVENT_DATA: 136,
	SOUND_BUZZER: 137,
	SET_VALIDATE_PASSWORD: 138,
	READ_CONFIGURATION_PARAMETER: 139,
	READ_IMAGE_DATA: 140,
	READ_IMAGE_SPECIFIC_SEQUENCE: 141,
	SET_DEVICE_IN_DFU: 142,
	TAKE_PICTURE: 143,
	READ_GYROSCOPE_DATA: 144,
	READ_CAMERA_SETTING: 145,
	READ_AVAILABLE_UNREAD_EVENT: 146,
	MODIFY_LAST_READ_EVENT_INDEX: 147,
	TurnAssetPowerOn: 92,
	TurnAssetPowerOff: 93,
	RequestLatestData: 94,
	ResetSmartDevice: 95,
	RestartSmartDevice: 96,
	SET_CAMERA2_SETTING: 18,
	READ_IMAGE_FILE_TABLE: 152,
	DELETE_IMAGE: 19,
	SET_ENERGY_METER_CALIBRATION: 20,
	SET_RELAY_STATUS: 21,
	SET_PROGRAMMING_PARAMETERS: 34,
	SET_SH_APN: 23,
	SET_BOTTLE_DIAMETER: 24,
	EDDYSTONE_CONFIGURATION: 25,
	SET_GLOBAL_TX_POWER: 27,
	SET_DOOR_OPEN_COUNT: 28,
	SET_POWER_SAVING_TIME: 29,
	CONTROL_EVENT: 35
};
Cooler.Enums.CoolerImageSubStatusType = {
	ImageForCollection: 11,
	ImageQueueToIR: 12,
};
Cooler.Enums.SmartDeviceLocationType = {
	GPS: 1,
	CellLocation: 2
};
Cooler.Enums.ColorHex = {
	Gray: '#808080',
	Black: '#000000',
	LightGray: '#F8F8F8',
	White: '#FFFFFF'
};
Cooler.Enums.EmailTemplate = {
	All: 7285,
	OnlyAlert: 7286
};
Cooler.showGPSLocation = function (latitude, longitude, markerTitle) {
	var gMapPanel = new Ext.ux.GMapPanel({
		zoomLevel: 10,
		gmapType: 'map',
		mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
		mapControls: ['GSmallMapControl', 'GMapTypeControl', 'NonExistantControl'],
		setCenter: {
			lat: latitude,
			lng: longitude,
			marker: { title: markerTitle == '' ? 'GPS Location' : markerTitle + ' Meter' },
			circleOverlay: true,
			circleOverlayOptions: {
				radius: (markerTitle == '' || markerTitle == '-1') ? 0 : parseFloat(markerTitle), // in meter
				strokeColor: "#FF0000",
				strokeOpacity: 0.8,
				strokeWeight: 1,
				fillColor: "#FF0000",
				fillOpacity: 0.35
			}
		}
	});
	var mapwin = new Ext.Window({
		layout: 'fit',
		title: 'GPS Location',
		closeAction: 'hide',
		modal: true,
		width: 500,
		height: 500,
		items: [gMapPanel]
	});
	mapwin.show();
};

Cooler.getDistance = function (lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1 / 180
	var radlat2 = Math.PI * lat2 / 180
	var radlon1 = Math.PI * lon1 / 180
	var radlon2 = Math.PI * lon2 / 180
	var theta = lon1 - lon2
	var radtheta = Math.PI * theta / 180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180 / Math.PI
	dist = dist * 60 * 1.1515
	if (unit == "K") { dist = dist * 1.609344 }
	if (unit == "N") { dist = dist * 0.8684 }
	return dist
};

DA.LookupType = new DA.LookupType({ baseParams: { IsDropdown: 1 }, listTitle: 'Dropdowns', uniqueId: 'Lookup-Dropdowns' });

Ext.onReady(Cooler.initStartup, Cooler);

Ext.apply(Ext.form.VTypes, {
	'phone': function () {
		var re = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
		return function (v) { return re.test(v); };
	}(), 'phoneText': 'The phone number format is wrong, ie: 123-456-7890 (dashes optional) Or (123) 456-7890 Or + 1(480)123-4567 Or 001(480)1234567',
	fileUpload: function (val, field) {
		var fileName = /^.*\.(gif|png|bmp|jpg|jpeg)$/i;
		return fileName.test(val);
	},
	fileUploadText: 'Image must be in .gif,.png,.bmp,.jpg,.jpeg format',
	mediaUpload: function (val, field) {
		var mediaName = /\.(mp3|aac|aiff|wav|mp4|mov|m4v)$/i;
		return mediaName.test(val);
	},
	mediaUploadText: 'Please upload audio or video only.',
	'englishCharacters': function () {
		var re = /^[\x20-\x7E]+$/;
		return function (v) { return re.test(v); };
	}(), 'englishCharactersText': 'Only english characters allowed',
	password: function (val, field) {
		if (field.confirmTo) {  // confirmTo is our custom configuration parameters, usually used to preserve the value of the other components of the id 
			var pwd = Ext.get(field.confirmTo); // get confirmTo the value of that id 
			return (val == pwd.getValue());
		}
		return true;
	},
	fileUploadExcel: function (val, field) {
		var fileName = /^.*\.(xls|xlsx)$/i;
		return fileName.test(val);
	},
	fileUploadExcelText: 'File uplod Excel format only',
});

Cooler.SwitchClient = {

	show: function () {

		if (!this.win) {

			var clientCombo = EH.CreateCombo({
				fieldLabel: 'Client',
				hiddenName: 'ScopeId',
				allowBlank: false,
				mode: 'local',
				store: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId', data: Cooler.comboStores.Client.reader.jsonData })
			});

			// define window
			var window = new Ext.Window({
				title: 'Switch Client',
				width: 300,
				height: 150,
				layout: 'form',
				modal: true,
				plain: true,
				closeAction: 'hide',
				constrain: true,
				resizable: false,
				items: clientCombo,
				buttons: [
					{
						text: 'Change',
						handler: function () {
							var scopeId = clientCombo.getValue();
							Df.util.Cookies.set('ScopeId', scopeId);

							Ext.Ajax.request({
								url: 'Controllers/Asset.ashx',
								method: 'POST',
								success: function () {
									DCPLApp.warningMsg = false;
									location.reload();
								}
							});
						}
					}, {
						text: 'Cancel',
						handler: function () { window.hide(); }
					}
				]
			});

			this.defaultControl = clientCombo;
			this.win = window;
		}

		this.win.show();

		this.defaultControl.focus(true, true);
	}
};

// On Client/Asset combo change we change the Timezone (currently call this from SmartDevice and Location)
Cooler.changeTimeZone = function (combo) {
	Cooler.setTimeZone(combo.getStore(), combo.getValue(), combo.hiddenName, this);
};

Cooler.setTimeZone = function (store, newValue, hiddenName, outer) {
	var selectedRecord = store.getAt(store.findExact("LookupId", newValue));
	if (selectedRecord) {
		var timeZoneField = outer.formPanel.form.findField('TimeZoneId');
		var timeZoneId = hiddenName == 'ClientId' ? selectedRecord.get('CustomValue') : hiddenName == 'SmartDeviceLocationId' ? selectedRecord.get('Description') : selectedRecord.get('CustomStringValue');
		if (timeZoneId && timeZoneId > 0) {
			ExtHelper.SetComboValue(timeZoneField, timeZoneId);
			//timeZoneField.setValue(timeZoneId);
		}
		//here we are updating the SmartDeviceLocation when asset changed in Smart Device
		if (hiddenName == 'LinkedAssetId') {
			var smartDeviceLocationField = outer.formPanel.form.findField('SmartDeviceLocationId');
			if (smartDeviceLocationField) {
				ExtHelper.SetComboValue(smartDeviceLocationField, selectedRecord.get('Description'));
			}
		}
	}
};

Cooler.plugins.Search = Ext.extend(Object, {

	constructor: function (config) {
		Ext.apply(this, config);
	},

	init: function (cmp) {
		cmp.on('render', this.attachEvents, this, { single: true });
	},

	attachEvents: function (cmp) {
		cmp.getEl().on('search', this.onSearch, cmp);
	},

	onSearch: function () {
		var cmp = this;
		var value = cmp.getRawValue();
		if (!value) {
			value = cmp.clearValue();
		}
		cmp.fireEvent('change', cmp.getValue());
	}
});

Cooler.onFileSelected = function (field, action) {
	var fileInput = this.uploadImage.fileInput.dom;

	var files = fileInput.files;
	if (files.length > 0) {
		var file = files[0];
		var imageType = /image.*/;
		if (!file.type.match(imageType)) {
			return;
		}
		var img = document.getElementById(this.logoField.id);
		img.file = file;
		var reader = new FileReader();
		reader.onload = (function (image) {
			return function (e) {
				image.src = e.target.result;
			};
		})(img);
		reader.readAsDataURL(file);
	}
};

Cooler.imageExists = function (url, callback) {
	var img = new Image();
	img.onload = function () { callback(true); };
	img.onerror = function () { callback(false); };
	img.src = url;
};

Cooler.loadThumbnail = function (me, record, noImageUrl, folder) {
	if (record.Id != 0) {
		var logo = record.Id + ".png",
			imageUrl = me.logoUrl + logo,
			logoField = me.logoField;
		if (folder) {
			logo = folder + '/' + record.Id + ".png";
			imageUrl = me.logoUrl + logo;
		}
		Cooler.imageExists(imageUrl, function (exists) {
			logoField.setSrc(exists ? imageUrl : noImageUrl, true);
		});
	}
	else {
		me.logoField.setSrc("");
	}
};

Cooler.ShowMultiImageWindow = function (imageCount, record, imageUrl, recordId) {
	var carouselStore = new Ext.data.Store({ fields: [{ name: 'ImagePath', type: 'string' }, { name: 'ImageName', type: 'string' }, { name: 'ImageBaseUrl', type: 'string' }, { name: 'ImageCount', type: 'int' }, { name: 'PrimaryRecordId', type: 'int' }] });
	this.carouselStore = carouselStore;
	this.carouselStore.insert(0, new Ext.data.Record({ 'ImagePath': imageUrl + recordId + '.png', 'ImageCount': imageCount, 'ImageName': recordId, 'ImageBaseUrl': imageUrl, 'PrimaryRecordId': recordId }));

	var btnPreviousButton = new Ext.Toolbar.Button({ text: 'Previous', itemId: 'btnPreviousButton', id: 'btnPreviousButton', iconCls: 'x-tbar-page-prev', handler: Cooler.CarouselImageLoad, scope: this, disabled: true });
	this.btnPreviousButton = btnPreviousButton;

	var btnNextButton = new Ext.Toolbar.Button({ text: 'Next', itemId: 'btnNextButton', id: 'btnNextButton', iconCls: 'x-tbar-page-next', handler: Cooler.CarouselImageLoad, scope: this, disabled: imageCount == 1 ? true : false });
	this.btnNextButton = btnNextButton;

	var imageDataViewTpl = new Ext.XTemplate(
		'<tpl for=".">',
		'<div>{[this.renderImage(values)]}</div>',
		'</tpl>', {
			renderImage: function (values) {
				var imagePath = values.ImagePath;
				var imageCount = values.ImageCount;
				var carouselImage = '<div class="carouselDiv" >' +
					'<img  src="' + imagePath + '"></img>' +
					'</div>';
				return '<div>' + carouselImage + '</div>';
			}
		}, this);

	var imageDataView = new Ext.DataView({
		tpl: imageDataViewTpl,
		store: carouselStore,
		emptyText: 'No images to display',
		itemSelector: 'div.carouselDiv'
	});

	var imageCarouselPanel = new Ext.Panel({
		title: 'Images',
		region: 'south',
		layout: 'fit',
		autoScroll: true,
		tbar: [btnPreviousButton, '|', btnNextButton],
		items: imageDataView
	});

	var imageWin = new Ext.Window({
		width: 600,
		height: 450,
		layout: 'fit',
		maximizable: true,
		modal: true,
		autoScroll: true,
		closeAction: 'hide',
		items: imageCarouselPanel
	});

	imageWin.setTitle(recordId);
	imageWin.show();
},

	Cooler.CarouselImageLoad = function (button) {
		var currentData = this.carouselStore.data.items[0];
		this.carouselStore.removeAll();
		var imageBaseUrl = currentData.data.ImageBaseUrl;
		var currentImageName = currentData.data.ImageName;
		var primaryRecordId = currentData.data.PrimaryRecordId;
		var imageCount = currentData.data.ImageCount;
		var currentImageSubIndex = 0
		if (!this.currentImageSubIndex) {
			this.currentImageSubIndex = currentImageSubIndex;
		} else if (this.primaryRecordId != primaryRecordId) {
			this.currentImageSubIndex = 0;
		}
		this.primaryRecordId = primaryRecordId;
		var newImage = '';

		if (button.text === 'Next') {
			this.btnPreviousButton.setDisabled(false);
			this.currentImageSubIndex = this.currentImageSubIndex + 1;
			newImage = imageBaseUrl + primaryRecordId + '_' + this.currentImageSubIndex;
			if (this.currentImageSubIndex + 1 == imageCount) {
				button.setDisabled(true);
			}
		}
		else {
			this.btnNextButton.setDisabled(false);
			this.currentImageSubIndex = this.currentImageSubIndex - 1;
			if (this.currentImageSubIndex == 0) {
				this.btnPreviousButton.setDisabled(true);
				newImage = imageBaseUrl + primaryRecordId;
			}
			else {
				newImage = imageBaseUrl + primaryRecordId + '_' + this.currentImageSubIndex;
			}
		}
		this.carouselStore.insert(0, new Ext.data.Record({ 'PrimaryRecordId': primaryRecordId, 'ImagePath': newImage + '.png', 'ImageCount': imageCount, 'ImageName': newImage, 'ImageBaseUrl': imageBaseUrl }));
	}

Cooler.showImageWindow = function (record, imageUrl, recordId) {
	Cooler.imageExists(imageUrl, function (exists) {
		if (exists) {
			var img = new Ext.ux.Image({
				src: imageUrl
			});
			var imageWin = new Ext.Window({
				width: 600,
				height: 450,
				layout: 'fit',
				maximizable: true,
				modal: true,
				autoScroll: true,
				closeAction: 'hide',
				items: [img]
			});
			imageWin.setTitle(recordId);
			imageWin.show();
		}
	});
};

Cooler.hexToAscii = function hex2a(hexx) {
	var hex = hexx.toString();//force conversion
	var str = '';
	for (var i = 0; len = hex.length, i < len; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str;
};
Cooler.isJson = function (str) {
	try {
		JSON.parse(str);
	}
	catch (e) {
		return false;
	}
	return true;
}

Cooler.renderer.requestedConfigurationRenderer = function (value, model, record) {
	var smartDeviceTypeCommandId = record.data.SmartDeviceTypeCommandId;
	var requestedValue = record.data.Value;
	var createdByUserId = record.data.CreatedByUserId;
	if (smartDeviceTypeCommandId != 0) {
		var setCommands = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 27, 28, 29];
		if (setCommands.indexOf(smartDeviceTypeCommandId) > -1) {
			var returnResult = {};
			switch (smartDeviceTypeCommandId) {
				case Cooler.Enums.SmartDeviceCommandType.SET_INTERVAL:
					returnResult.Command = "SET_INTERVAL";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Value = parseInt(commandData[1], 16);
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Value = commandData[0];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_REAL_TIME_CLOCK:
					returnResult.Command = "SET_REAL_TIME_CLOCK";
					var commandData = requestedValue.split(':');
					if (createdByUserId == 0) {
						var miliSecond = parseInt(commandData[4] + commandData[3] + commandData[2] + commandData[1], 16);
						var len = miliSecond.toString().length;
						for (var i = 0; i < 13 - len; i++) {
							miliSecond = miliSecond + '0';
						}
						var date = new Date(Number(miliSecond));
						returnResult.Value = date.format(Cooler.DateWithSecondFormat);

					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Value = commandData[0];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_MAJOR_MINOR_VERSION:
					returnResult.Command = "SET_MAJOR_MINOR_VERSION";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Major = parseInt(commandData[2] + commandData[1], 16);
						returnResult.Minor = parseInt(commandData[4] + commandData[3], 16);
						returnResult.RSSI = parseInt(commandData[5], 16);
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Major = commandData[0];
							returnResult.Minor = commandData[1];
							returnResult.RSSI = commandData[2];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_ADVERTISING_PERIOD:
					returnResult.Command = "SET_ADVERTISING_PERIOD";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Value = parseInt(commandData[2] + commandData[1], 16);
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Value = commandData[0];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_SENSOR_THRESHOLD:
					returnResult.Command = "SET_SENSOR_THRESHOLD";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Temperature = parseInt(commandData[2] + commandData[1], 16);
						returnResult.Light_Out_Of_Threshold = parseInt(commandData[4] + commandData[3], 16);
						returnResult.Humidity = parseInt(commandData[5], 16);
						returnResult.Movement_G = parseInt(commandData[6], 16);
						returnResult.Movementt_Time = parseInt(commandData[7], 16);
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Temperature = commandData[0];
							returnResult.Light_Out_Of_Threshold = commandData[1];
							returnResult.Humidity = commandData[2];
							returnResult.Movement_G = commandData[3];
							returnResult.Movementt_Time = commandData[4];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_STANDBY_MODE:
					returnResult.Command = "SET_STANDBY_MODE";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Value = parseInt(commandData[1], 16) == 0 ? "Off" : "On";
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Value = commandData[0] == 0 ? "Off" : "On";
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_DOOR_OPEN_ANGLE:
					returnResult.Command = "SET_DOOR_OPEN_ANGLE";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Door_Close_Angle_2 = parseInt(commandData[1], 16);
						returnResult.Trigger_Delta = parseInt(commandData[2], 16);
						returnResult.Door_Open_Angle_1 = parseInt(commandData[3], 16);
						returnResult.Image_Capture_Mode = parseInt(commandData[4], 16);
						returnResult.Cam_Sequence = parseInt(commandData[5], 16);
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;

							returnResult.Door_Close_Angle_2 = commandData[0];
							returnResult.Trigger_Delta = commandData[1];
							returnResult.Door_Open_Angle_1 = commandData[2];
							returnResult.Image_Capture_Mode = commandData[3];
							returnResult.Cam_Sequence = commandData[4];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_CAMERA_SETTING:
				case Cooler.Enums.SmartDeviceCommandType.SET_CAMERA2_SETTING:
					returnResult.Command = smartDeviceTypeCommandId == Cooler.Enums.SmartDeviceCommandType.SET_CAMERA_SETTING ? "SET_CAMERA_SETTING" : "SET_CAMERA2_SETTING";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Brightness = parseInt(commandData[1], 16);
						returnResult.Contrast = parseInt(commandData[2], 16);
						returnResult.Saturation = parseInt(commandData[3], 16);
						returnResult.Shutter_Speed = parseInt(commandData[4] + commandData[5], 16);
						returnResult.Camera_Quality = parseInt(commandData[6], 16);
						returnResult.Effect = parseInt(commandData[7], 16);
						returnResult.Light_Mode = parseInt(commandData[8], 16);
						returnResult.Camera_Clock = parseInt(commandData[9], 16);
						returnResult.Cdly = parseInt(commandData[10] + commandData[11], 16);
						returnResult.Gain = parseInt(commandData[12], 16);
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Brightness = commandData[0];
							returnResult.Contrast = commandData[1];
							returnResult.Saturation = commandData[2];
							returnResult.Shutter_Speed = commandData[3];
							returnResult.Camera_Quality = commandData[4];
							returnResult.Effect = commandData[5];
							returnResult.Light_Mode = commandData[6];
							returnResult.Camera_Clock = commandData[7];
							returnResult.Cdly = commandData[8];
							returnResult.Gain = commandData[9];
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.ENABLE_TAKE_PICTURE:
					returnResult.Command = "TAKE_PICTURE";
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						returnResult.Value = parseInt(commandData[1], 16) == 1 ? "Enable" : "Disable";
					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var commandData = Ext.decode(requestedValue).data;
							returnResult.Value = commandData[0] == 0 ? "Off" : "On";
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_DEEP_SLEEP:
					returnResult.Command = "SET_DEEP_SLEEP";
					returnResult.Value = "True";
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_BOTTLE_DIAMETER:
					returnResult.Command = "SET_BOTTLE_DIAMETER";
					var commandData = requestedValue.split(':');
					returnResult.Diameter_In_MM = parseInt(commandData[1], 16);
					break;
				case Cooler.Enums.SmartDeviceCommandType.EDDYSTONE_CONFIGURATION:
					if (createdByUserId == 0) {
						var commandData = requestedValue.split(':');
						var subCommandId = parseInt(commandData[1], 16);
						var parameterId = parseInt(commandData[2], 16);
						if (subCommandId == 1 && parameterId == 1) {
							returnResult.Command = "Set_Beacon_Frame_Type";
							returnResult.Enable_Beacon = parseInt(commandData[3], 16) == 0 ? "False" : "true";
							returnResult.Enable_Eddystone_Beacon_UID = parseInt(commandData[4], 16) == 0 ? "False" : "true";
							returnResult.Enable_Eddystone_Beacon_URL = parseInt(commandData[5], 16) == 0 ? "False" : "true";
							returnResult.Enable_Eddystone_Beacon_TLM = parseInt(commandData[6], 16) == 0 ? "False" : "true";
						}
						else if (subCommandId == 2 && parameterId == 1) {
							returnResult.Command = "Set UUID";
							var uuidValue = '';
							for (var i = 3; i < commandData.length; i++) {
								uuidValue += commandData[i];
							}
							returnResult.UUID = uuidValue;
						}
						else if (subCommandId == 2 && parameterId == 2) {
							returnResult.Command = "Set_Major_Minor_RSSI";
							returnResult.Major = parseInt(commandData[3], 16);
							returnResult.Minor = parseInt(commandData[4], 16);
							returnResult.RSSI = parseInt(commandData[5], 16);
						}
						else if (subCommandId == 2 && parameterId == 3) {
							returnResult.Command = "IBeacon_Standard & Energy Saving Broadcast Configuration";
							returnResult.Broadcast_Tx_Power = parseInt(commandData[3], 16);
							returnResult.Advertising_Interval = parseInt(commandData[5] + commandData[4], 16);
							returnResult.Energy_Saving_Power = parseInt(commandData[6], 16);
							returnResult.Energy_Saving_Advertising_Interval = parseInt(commandData[8] + commandData[7], 16);
						}
						else if (subCommandId == 3 && parameterId == 1) {
							returnResult.Command = "Set Eddystone UID";
							var uidValue = '';
							var uidInstance = '';
							for (var i = 3; i < 13; i++) {
								uidValue += commandData[i];
							}
							for (var j = 13; j < 19; j++) {
								uidInstance += commandData[j];
							}
							returnResult.UID_Namespace = uidValue;
							returnResult.UID_Instance = uidInstance;
						}
						else if (subCommandId == 3 && parameterId == 3) {
							returnResult.Command = "Eddystone_Standard & Energy Saving Broadcast Configuration";
							returnResult.Broadcast_Tx_Power = parseInt(commandData[3], 16);
							returnResult.Advertising_Interval = parseInt(commandData[5] + commandData[4], 16);
							returnResult.Energy_Saving_Power = parseInt(commandData[6], 16);
							returnResult.Energy_Saving_Advertising_Interval = parseInt(commandData[8] + commandData[7], 16);
						}
						else if (subCommandId == 4 && parameterId == 1) {
							returnResult.Command = "Set Eddystone URL";
							var urlSchemePrefix = ["http://www.", "https://www.", "http://", "https://"];
							var urlDomainCode = [".com/", ".org/", ".edu/", ".net/", ".info/", ".biz/", ".gov/", ".com", ".org", ".edu", ".net", ".info", ".biz", ".gov"];
							var prefix = urlSchemePrefix[Number(commandData[3])];
							var domain = urlDomainCode[Number(commandData[13])];
							var extraByte = commandData[14] + commandData[15] + commandData[16] + commandData[17] + commandData[18] + commandData[19];
							var actualUrl = '';
							for (var j = 4; j < 13; j++) {
								actualUrl += commandData[j];
							}

							var url = prefix + Cooler.hexToAscii(actualUrl);
							if (domain) {
								url = url + domain;
							}
							else {
								extraByte = "";
								for (var k = 13; len = commandData.length, k < len; k++) {
									extraByte += commandData[k];
								}

							}
							if (Number(extraByte) != 0) {
								url += Cooler.hexToAscii(extraByte);
							}
							url = url.replace(/\u0000/g, "").replace(/\u0007/g, "");
							returnResult.URL = url;
						}
						else if (subCommandId == 4 && parameterId == 3) {
							returnResult.Command = "Eddystone_URL_Standard & Energy Saving Broadcast Configuration";
							returnResult.Broadcast_Tx_Power = parseInt(commandData[3], 16);
							returnResult.Advertising_Interval = parseInt(commandData[5] + commandData[4], 16);
							returnResult.Energy_Saving_Power = parseInt(commandData[6], 16);
							returnResult.Energy_Saving_Advertising_Interval = parseInt(commandData[8] + commandData[7], 16);
						}
						else if (subCommandId == 5 && parameterId == 3) {
							returnResult.Command = "TLM_Standard & Energy Saving Broadcast Configuration";
							returnResult.Broadcast_Tx_Power = parseInt(commandData[3], 16);
							returnResult.Advertising_Interval = parseInt(commandData[5] + commandData[4], 16);
							returnResult.Energy_Saving_Power = parseInt(commandData[6], 16);
							returnResult.Energy_Saving_Advertising_Interval = parseInt(commandData[8] + commandData[7], 16);
						}

					}
					else {
						if (Cooler.isJson(requestedValue)) {
							var request = Ext.decode(requestedValue);
							var commandData = request.data;
							if (commandData) {
								var subCommandId = Number(request.SubCommand);
								var parameterId = Number(request.parameterId);
								if (subCommandId == 1 && parameterId == 1) {

									returnResult.Command = "Set_Beacon_Frame_Type";
									returnResult.Enable_Beacon = commandData[0] == 0 ? "False" : "true";
									returnResult.Enable_Eddystone_Beacon_UID = commandData[1] == 0 ? "False" : "true";
									returnResult.Enable_Eddystone_Beacon_URL = commandData[2] == 0 ? "False" : "true";
									returnResult.Enable_Eddystone_Beacon_TLM = commandData[3] == 0 ? "False" : "true";
								}
								else if (subCommandId == 2 && parameterId == 1) {
									returnResult.Command = "Set UUID";
									returnResult.UUID = commandData[0];
								}
								else if (subCommandId == 2 && parameterId == 2) {
									returnResult.Command = "Set_Major_Minor_RSSI";
									returnResult.Major = commandData[0];
									returnResult.Minor = commandData[1];
									returnResult.RSSI = commandData[2];
								}
								else if (subCommandId == 2 && parameterId == 3) {
									returnResult.Command = "IBeacon_Standard & Energy Saving Broadcast Configuration";
									returnResult.Broadcast_Tx_Power = commandData[0];
									returnResult.Advertising_Interval = commandData[1];
									returnResult.Energy_Saving_Power = commandData[2];
									returnResult.Energy_Saving_Advertising_Interval = commandData[3];
								}
								else if (subCommandId == 3 && parameterId == 1) {
									returnResult.Command = "Set Eddystone UID";
									returnResult.UID_Namespace = commandData[0];
									returnResult.UID_Instance = commandData[1];
								}
								else if (subCommandId == 3 && parameterId == 3) {
									returnResult.Command = "Eddystone_Standard & Energy Saving Broadcast Configuration";
									returnResult.Broadcast_Tx_Power = commandData[0];
									returnResult.Advertising_Interval = commandData[1];
									returnResult.Energy_Saving_Power = commandData[2];
									returnResult.Energy_Saving_Advertising_Interval = commandData[3];
								}
								else if (subCommandId == 4 && parameterId == 1) {
									returnResult.Command = "Set Eddystone URL";
									returnResult.URL = commandData[0];
								}
								else if (subCommandId == 4 && parameterId == 3) {
									returnResult.Command = "Eddystone_URL_Standard & Energy Saving Broadcast Configuration";
									returnResult.Broadcast_Tx_Power = commandData[0];
									returnResult.Advertising_Interval = commandData[1];
									returnResult.Energy_Saving_Power = commandData[2];
									returnResult.Energy_Saving_Advertising_Interval = commandData[3];
								}
								else if (subCommandId == 5 && parameterId == 3) {
									returnResult.Command = "TLM_Standard & Energy Saving Broadcast Configuration";
									returnResult.Broadcast_Tx_Power = commandData[0];
									returnResult.Advertising_Interval = commandData[1];
									returnResult.Energy_Saving_Power = commandData[2];
									returnResult.Energy_Saving_Advertising_Interval = commandData[3];
								}
							}
						}
					}
					break;
				case Cooler.Enums.SmartDeviceCommandType.SET_GLOBAL_TX_POWER:
					returnResult.Command = "SET_GLOBAL_TX_POWER";
					var commandData = requestedValue.split(':');
					returnResult.Global_Tx_Power_Of_Device = parseInt(commandData[3], 16);
					break;
			}
			return Object.keys(returnResult).length === 0 && returnResult.constructor === Object ? "" : Ext.encode(returnResult);
		}
	}
},

	Cooler.DateRangeFilter = function (me, field, loadGrid) {
		var startDateField = me.startDateField;
		var endDateField = me.endDateField;
		var startDateValue = startDateField.getValue();
		var endDateValue = endDateField.getValue();
		var startDateFilter = me.grid.gridFilter.getFilter(field);
		if (!Ext.isEmpty(startDateValue)) {
			startDateFilter.active = true;
			var startDate = Cooler.DateOptions.AddDays(startDateValue, -1);
			var isEndDate = moment.isDate(endDateValue);
			var endDate = isEndDate ? Cooler.DateOptions.AddDays(endDateValue, 1) : Cooler.DateOptions.AddDays(new Date(), 1);
			if (isEndDate && (endDateValue < startDateValue)) {
				//startDateFilter.dates.after.setChecked(false);
				//startDateFilter.dates.before.setChecked(false);
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date');
				return false;
			}

			var value = { after: startDate };
			startDateFilter.setValue(value);
			var endDatevalue = { before: endDate };
			startDateFilter.setValue(endDatevalue);
			startDateFilter.dates.after.setChecked(true);
			if (loadGrid) {
				me.grid.loadFirst();
			}
			return true;
		}
		else if (!Ext.isEmpty(endDateValue)) {
			Ext.Msg.alert('Alert', 'Start Date Missing');
			return false;
		}
		else {
			startDateField.setValue();
			endDateField.setValue();
			startDateFilter.setActive(false);
			return true;
		}
	};

Cooler.assetMoved = function (value, model, record) {
	var data = record.data;
	var returnHtml = '<div class="alertIssues-div-container">'
	if (data.AssetMoved == 'Yes') {
		returnHtml += '<div class="alertIssues-image-div" style="float: left;" onmouseover="Cooler.showBigImage(this);" onmouseout= "Cooler.hideBigImage(this);"><img src="images/AlertType/Movement.png" class="alertIssues-image" name="Movement"/></div>';
	}
	return returnHtml + '</div>';
};

// binary to decimal
Cooler.ConvertBaseBin2dec = function (num) {
	return parseInt(num, 2).toString(10);
};