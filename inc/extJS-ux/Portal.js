Ext.ns("DA.Portal");

DA.Portal = {
	portlets: new Ext.data.JsonStore({ fields: [{ name: 'title', type: 'string' }, { name: 'description', type: 'string' }, { name: 'typeId', type: 'int'}] }),
	portletConfigs: [],
	hasPermission: function (security) {
		var hasPermission = true;
		if (security) {
			if (security.requiredRoles) {
				var roles = security.requiredRoles;
				if (!Ext.isArray(roles)) {
					roles = [roles];
				}
				for (var i = 0, len = roles.length; i < len; i++) {
					if (!DA.Security.IsInRole(roles[i])) {
						hasPermission = false;
						break;
					}
				}
			}
			if (hasPermission && security.requiredModules) {
				var modules = security.requiredModules;
				if (!Ext.isArray(modules)) {
					modules = [modules];
				}
				for (var i = 0, len = modules.length; i < len; i++) {
					var module = modules[i];
					var moduleName;
					var permissionRequired;
					if (typeof (module) == 'object') {
						moduleName = module.name;
						permissionRequired = module.permission;
					} else {
						moduleName = module;
					}
					if (!DA.Security.HasPermission(moduleName, permissionRequired)) {
						hasPermission = false;
						break;
					}
				}
			}
		}
		return hasPermission;
	},

	register: function (name, component) {
		var xtype = "DA-Portlet-" + name;
		Ext.reg(xtype, component);
		return xtype;
	},

	addPortlet: function (option) {
		if (option.portlet) {
			var xtype = this.getXType(option.portlet);
			delete option.portlet;
			Ext.applyIf(option, {
				config: {}
			});
			Ext.apply(option.config, { xtype: xtype });
		}
		if (this.requiresSecurity(option) && typeof option.id != 'string') {
			throw "Portlet security is set but portletId is undefined";
		}
		option.config.portletId = option.id;
		this.portletConfigs.push(option);
	},

	requiresSecurity: function (option) {
		if (option.requiredModules) {
			return true;
		}
		return false;
	},

	getXType: function (portletName) {
		return "DA-Portlet-" + portletName;
	},

	addHandler: function (scope, button) {
		var filteredPorlets = scope.portlets.query('typeId', button.typeId);
		if (filteredPorlets.length == 0) {
			var availablePortlets = [];
			Ext.each(scope.portletConfigs, function (portletConfig) {
				if (scope.hasPermission(portletConfig)) {
					if (!portletConfig.typeId || portletConfig.typeId == button.typeId) {
						availablePortlets.push(portletConfig);
					}
				}
			}, scope);
			scope.portlets.loadData(availablePortlets);
			var grid;
			var win = new Ext.Window({
				height: 400,
				width: 400,
				modal: true,
				layout: 'fit',
				closeAction: 'hide',
				items: [
					grid = new Ext.grid.GridPanel({
						sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
						columns: [{ id: 'title', header: 'Title', width: 150, dataIndex: 'title' }, { id: 'description', header: 'Description', width: 50, dataIndex: 'description'}],
						store: scope.portlets,
						autoExpandColumn: 'description'
					})
				],
				buttons: [
					{
						text: 'Add',
						handler: function () {
							var sm = grid.getSelectionModel();
							var rec = sm.getSelections();
							var portal = Ext.getCmp(button.id);
							if (rec.length == 1) {
								var config;
								for (var i = 0; i < scope.portletConfigs.length; i++) {
									if (scope.portletConfigs[i].title == rec[0].data.title) {
										config = scope.portletConfigs[i].config;
									}
								}
								//var config = scope.portletConfigs[scope.portlets.indexOf(rec[0])].config;
								var portlet = scope.createPortlet(config);
								if (portlet) {
									portal.items.items[0].add(portlet);
									portal.doLayout();
								}
								win.hide();
							}
						},
						scope: this
					}
				]
			});
			this.win = win;
		}
		this.win.show();
	},

	createPortlet: function (config) {
		var returnValue;
		var portletId = config.portletId;
		var hasPermission = true;
		if (portletId) {
			var initConfig;

			hasPermission = false;

			Ext.each(this.portletConfigs, function (portlet) {
				if (portlet.config.portletId === portletId) {
					Ext.apply(config, portlet.config);
					initConfig = portlet;
					return false;
				}
			});

			if (initConfig) {
				hasPermission = this.hasPermission({ requiredModules: initConfig.requiredModules, requiredRoles: initConfig.requiredRoles });
			}
		}

		if (!hasPermission) {
			return;
		}

		if (typeof config.portalDelegate == 'string') {
			var delegate = eval(config.portalDelegate);
			returnValue = delegate.create(config);
		} else {
			returnValue = config;
		}
		return returnValue;
	},

	urlSettingHandler: function (e, target, panel) {
		if (!panel.settingWin) {
			Ext.applyIf(panel, { fields: {} });
			var settingWin = new Ext.Window({
				height: 200,
				width: 400,
				title: 'Settings',
				layout: 'fit',
				closeAction: 'hide',
				modal: true,
				items: [
					panel.form = new Ext.form.FormPanel({
						xtype: 'form',
						items: [
							panel.fields.Url = new Ext.form.TextArea({ fieldLabel: 'Url', maxLength: 250, allowBlank: false, width: 200 }),
							panel.fields.Title = new Ext.form.TextField({ fieldLabel: 'Title', maxLength: 50, allowBlank: false, width: 200 })
						]
					})
				],
				buttons: [
					{
						text: 'Apply',
						handler: function () {
							var url = panel.fields.Url.getValue();
							var title = panel.fields.Title.getValue()
							panel.applySettings({ url: url, title: title });
							panel.ownerCt.ownerCt.saveState();
							panel.settingWin.hide();
							this.setTitle(title);
						},
						scope: this
					}
				]
			});
			panel.settingWin = settingWin;
		}
		var basicForm = panel.form.getForm();
		basicForm.reset();
		var settings = panel.getSettings();
		panel.fields.Url.setValue(settings.url);
		panel.fields.Title.setValue(settings.title);
		panel.settingWin.show();
	},

	getState: function () {
		var state = {};

		// Save state property only if changed from default
		var props = {
			collapsed: false
		}
		for (var o in props) {
			var val = this[o];
			if (val !== 'undefined' && val !== props[o]) {
				state[o] = val;
			}
		}

		var props = this.stateProperties || [];
		for (var i = 0, len = props.length; i < len; i++) {
			var propertyName = props[i];
			var value = this[propertyName];
			if (typeof value !== 'undefined' && !this.initialConfig || value !== this.initialConfig[propertyName]) {
				state[propertyName] = value;
			}
		}
		state.height = this.rendered ? this.getSize().height : this.height;
		return state;
	},

	applyState: Ext.Component.prototype.applyState,

	applyBasicSettings: function (cmp) {
		var toApplyTo = typeof cmp === 'object' ? cmp : cmp.prototype;
		Ext.apply(toApplyTo, {
			height: 400,
			stateful: true,
			getState: DA.Portal.getState,
			stateEvents: ['collapse', 'expand', 'resize']
		});
		Ext.applyIf(toApplyTo, { plugins: [] });
		toApplyTo.plugins.push(Ext.ux.PortletPlugin);
	}
};
DA.Portal.Home = Ext.extend(Ext.ux.Portal, {
	id: 'home-portal',
	stateful: true,
	region: 'center',
	autoRefresh: false,
	typeId: 1,
	initComponent: function () {
		if (this.autoRefresh) {
			this.on('render', function () {
				this.on('activate', this.onRefresh, this);
			}, this, { delay: 1000 });
		}
		this.tbar = [
			'->',
			{
				text: 'General Help',
				iconCls: 'help',
				handler: function () {
					DA.Help.Show({ helpKey: 'GeneralHelp', extraKey: 'GeneralHelp', title: 'General Help' }, this);
				},
				scope: this,
				tooltip: 'Help'
			},
		 	{ text: 'Add stuff', handler: function () {
		 		DA.Portal.addHandler(DA.Portal, this);
		 	}, scope: this, portal: this.id, iconCls: 'add', tooltip: 'Add stuff'
		 	},
			{ text: 'Refresh', handler: this.onRefresh, scope: this, iconCls: 'refresh', tooltip: 'Refresh' },
			{
				text: '',
				iconCls: 'help',
				handler: function () {
					DA.Help.Show({ helpKey: 'MyBusiness', extraKey: 'MyBusiness', title: 'My Business' }, this)
				},
				tooltip: 'Help'
			}
		 ];

		var items = [{ columnWidth: .33 }, { columnWidth: .34 }, { columnWidth: .33}];
		var cols = items.length;

		this.items = items;

		if (Ext.state.Manager) {
			var portalId = this.stateId || this.id;
			var state = Ext.state.Manager.get(portalId);
			if (!state) {
				Ext.each(DA.Portal.portletConfigs, function (portletInfo) {
					if (portletInfo.auto) {
						var portals = [].concat(portletInfo.portalId || ['home-portal' + this.typeId]);
						if (portals.indexOf(portalId) > -1) {
							var col = typeof portletInfo.col == 'number' ? portletInfo.col : 0;
							delete portletInfo.col;
							if (cols < col) {
								col = cols;
							}
							var portlet = DA.Portal.createPortlet(portletInfo.config);
							if (portlet) {
								Ext.applyIf(items[col], { items: [] });
								items[col].items.push(portlet);
							}
						}
					}
				});
			}
		}

		DA.Portal.Home.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('home-portal', DA.Portal.Home);

Ext.ns("DA.Portlets");

DA.Portlets.Grid = {
	create: function (initConfig) {
		var config = {
			tBar: [],
			border: true,
			plugins: [],
			applyState: DA.Portal.applyState
		};
		DA.Portal.applyBasicSettings(config);

		Ext.apply(config, initConfig);

		if (!initConfig.pageSize && typeof initConfig.allowPaging === 'undefined') {
			config.allowPaging = false;
		}

		config.plugins.push(Ext.ux.PortletPlugin);

		var module = eval(config.module);
		delete config.module;

		config.refreshHandler = DA.Portlets.Grid.refreshHandler;

		var grid = module.createGrid(config, true);
		var prefManager = grid.prefManager;

		if (prefManager && prefManager.enabled) {
			prefManager.manager.applyDefaultPreference();
		} else {
			grid.loadFirst();
		}

		return grid;
	},
	refreshHandler: function (e, target, panel) {
		panel.getStore().reload();
	}
};

DA.Portlets.Chart = function (config) {
	DA.Portlets.Chart.superclass.constructor.apply(this, arguments);
};

DA.Portlets.Chart = Ext.extend(Ext.ux.FusionPanel, {
	title: 'ux.FusionPanel',
	refreshHandler: function (e, target, panel) {
		panel.setDataURL(panel.dataURL, true);
	}
});
DA.Portal.applyBasicSettings(DA.Portlets.Chart);
DA.Portal.register('chart', DA.Portlets.Chart);

DA.Portlets.ChartWithSettings = Ext.extend(Ext.ux.FusionPanel, {
	collapsible: true,
	title: 'Pie Chart',
	chartURL: 'charts/Pie2D.swf',
	baseUrl: 'PieChart.ashx?type=1',
	initComponent: function () {
		if (!this.params) {
			this.params = this.defaultParams || {};
		}
		this.applyUrlSettings();
		DA.Portlets.ChartWithSettings.superclass.initComponent.apply(this, arguments);
		this.on('staterestore', function () {
			this.applyUrlSettings(true);
		}, this);
	},
	stateProperties: ['title', 'params', 'dataURL'],
	applyUrlSettings: function (apply) {
		settings = Ext.apply({}, this.params);
		// clear time part
		for (var o in settings) {
			if (Ext.isDate(settings[o])) {
				settings[o] = settings[o].format('m/d/Y');
			}
		}
		this.dataURL = this.baseUrl + (this.baseUrl.indexOf("&") > -1 ? "" : "&") + Ext.urlEncode(settings);
		if (apply) {
			this.setDataURL(this.dataURL);
		}
	},
	refreshHandler: function (e, target, panel) {
		panel.setDataURL(panel.dataURL, true);
	},
	onApply: function () {
		var basicForm = this.form.getForm();
		if (basicForm.isValid()) {
			var values = basicForm.getValues();
			var ignoreValues = this.ignoreValues ? this.ignoreValues.slice(0) : [];
			for (var o in values) {
				if (values[o] === "" || values[o] === null) {
					ignoreValues.push(o);
				}
			}

			this.setTitle(values.title);
			for (var i = 0, len = ignoreValues.length; i < len; i++) {
				delete values[ignoreValues[i]];
			}
			delete values.title;

			this.params = values;
			this.saveState();
			this.settingWin.hide();
			this.applyUrlSettings(true);
		} else {
			Ext.Msg.alert('An error occured', 'Correct the errors to continue');
		}
	},
	validateSettings: function () {

	},
	afterShow: function () {
	},
	settingHandler: function (e, target, panel) {
		if (!this.settingWin) {
			this.form = this.createForm(); 
			var settingWin = new Ext.Window(Ext.apply({
				height: 500,
				width: 500,
				autoScroll: true,
				title: 'Settings',
				layout: 'fit',
				closeAction: 'hide',
				modal: true,
				items: [this.form],
				buttons: [
					{ text: 'Apply', handler: this.onApply, scope: this }
				]
			}, this.winCfg));
			this.settingWin = settingWin;
			this.settingWin.on('show', this.loadSettings, this, { defer: 50 }); 
		}
		this.settingWin.show();
		this.afterShow();
	},
	loadSettings: function () {
		var basicForm = this.form.getForm();
		basicForm.reset();

		basicForm.setValues(this.params);
		basicForm.setValues({ 'title': this.title });

		this.validateSettings();
	}
});
DA.Portal.applyBasicSettings(DA.Portlets.ChartWithSettings);

DA.Portlets.FeedGrid = Ext.extend(Ext.ux.FeedGrid, {
	initComponent: function () {
		DA.Portlets.FeedGrid.superclass.initComponent.call(this);
		this.on('render', function () { this.load(); }, this);
	},
	stateProperties: ['feed', 'title'],
	getSettings: function () {
		return { url: this.feed, title: this.title }
	},
	applySettings: function (settings) {
		this.feed = settings.url;
		this.title = settings.title;
		this.loadFeed(settings.url);
		this.saveState();
	},
	settingHandler: DA.Portal.urlSettingHandler,
	refreshHandler: function (e, target, panel) {
		panel.getStore().reload();
	},
	applyState: DA.Portal.applyState
});
DA.Portal.applyBasicSettings(DA.Portlets.FeedGrid);
DA.Portal.register('rss', DA.Portlets.FeedGrid);

DA.Portlets.Announcements = Ext.extend(Ext.ux.FeedGrid, {
	initComponent: function () {
		DA.Portlets.Announcements.superclass.initComponent.call(this);
		this.on('render', function () { this.load(); }, this);
	},
	title: 'Recent Announcements',
	refreshHandler: DA.Portlets.FeedGrid.prototype.refreshHandler,
	applyState: DA.Portal.applyState
});
DA.Portal.applyBasicSettings(DA.Portlets.Announcements);
DA.Portal.register('announcements', DA.Portlets.Announcements);

DA.Portlets.Html = Ext.extend(Ext.Panel, {
	html: 'Welcome',
	title: 'Welcome'
});
DA.Portal.applyBasicSettings(DA.Portlets.Html);
DA.Portal.register('html', DA.Portlets.Html);

DA.Portlets.Url = Ext.extend(Ext.Panel, {
	plugins: Ext.ux.PortletPlugin
});
DA.Portal.register('url', DA.Portlets.Url);

DA.Portlets.ExternalUrl = Ext.extend(Ext.ux.IFramePanel, {
	url: 'http://www.durlabhcomputers.com',
	title: 'External URL',
	stateProperties: ['title', 'url'],
	getSettings: function () {
		return { url: this.url, title: this.title }
	},
	applySettings: function (settings) {
		this.url = settings.url;
		this.title = settings.title;
		this.setUrl(settings.url);
		this.saveState();
	},
	applyState: function (state) {
		Ext.Component.prototype.applyState.call(this, state);
		this.setUrl(this.url);
	},
	settingHandler: DA.Portal.urlSettingHandler
});
DA.Portal.applyBasicSettings(DA.Portlets.ExternalUrl);
DA.Portal.register('external-url', DA.Portlets.ExternalUrl);


DA.Portlets.Calendar = function (config) {
	var homeCalendar;
	var dates = {};
	emulateAJAX = function (store) {
		//Load only after STORE is loaded, it may take time
		store.each(function (record) {
			var date = record.get("CalendarDate").format("m/d/y");
			var title = record.get("Title");
			homeCalendar.dates[date] = '<b><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + title + '</i></b>';
		});
		if (homeCalendar.rendered) {
			homeCalendar.update();
		}
	};

	var store = config.grid.getStore();
	store.on('load', function () {
		emulateAJAX(store);
	});

	homeCalendar = new Ext.ux.Calendar({
		// Sample data
		height: 260,
		dates: {},
		getData: function (o) {
			return this.dates[o.date.format("m/d/y")];
		},
		// Custom formatting based on date
		formatDay: function (o) {
			var data = this.getData(o);
			if (data) {
				o.css += " ux-cal-highlight";
				o.caption += "*";
			}
		},
		listeners: {
			// Sample for click handling
			click: function (o) {
				if (o.date) {
					var data = this.getData(o);
					if (data) {
						Ext.Msg.alert('Information', 'Event on ' + o.date.format("m/d/y").toString() + ":" + data);
					} else {
						Ext.Msg.alert('Information', 'No event scheduled on ' + o.date.format("m/d/y").toString());
					}
				}
			},

			// Sample for mouse over handling to show tool-tip
			mouseover: function (o) {
				if (!o.date) {
					this.tooltip.hide();
				} else {
					var text = o.date.format("m/d/y").toString();
					if (this.tooltip.rendered) {
						this.tooltip.body.dom.innerHTML = text;
					} else {
						this.tooltip.html = text;
					}
					this.tooltip.show();
				}
			},

			// Adding tool-tip to the calendar
			render: function () {
				this.tooltip = new Ext.ToolTip({
					target: this.body,
					showDelay: 10,
					trackMouse: true
				})
				config.grid.loadFirst();
			},

			destroy: function () {
				this.tooltip.destroy();
			}
		}
	});
	Ext.QuickTips.init();

	config.items = homeCalendar;
	DA.Portlets.Calendar.superclass.constructor.call(this, config);
};

Ext.extend(DA.Portlets.Calendar, Ext.Panel, {
	plugins: [Ext.ux.PortletPlugin],
	stateful: true,
	stateEvents: ['collapse', 'expand', 'resize'],
	getState: DA.Portal.getState,
	title: 'Calendar',
	height: 300
});

DA.Portal.register('calendar', DA.Portlets.Calendar);

DA.Portlets.HtmlEditor = Ext.extend(Ext.Panel, {
	title: 'HTML Content',
	htmlContent: 'HTML Content Sample',
	stateProperties: ['title', 'htmlContent'],
	collapsible: true,
	closeable: false,
	showSettingButton: false,
	initComponent: function () {

		this.contentPanel = new Ext.Panel({ autoHeight: true, autoWidth: true, cls: 'pnl-list' }); //Panel for html data
		this.items = this.contentPanel;
		this.contentPanel.on('render', function () { this.load(); }, this);
		DA.Portlets.HtmlEditor.superclass.initComponent.apply(this, arguments);
		if (DA.Security.IsInRole("BIDashboardModifiedAccess")) {
			this.showSettingButton = true;
			this.closeable = true;
		}
	},
	getSettings: function () {
		return { htmlContent: this.htmlContent, title: this.title }
	},
	applySettings: function (settings) {
		this.htmlContent = settings.htmlContent;
		this.title = settings.title;
		this.updateHtmlData(this.items.items[0], settings.htmlContent);
		this.saveState();
	},
	load: function () {
		this.updateHtmlData(this.items.items[0], this.htmlContent);
	},
	updateHtmlData: function (obj, htmlOrData, loadScripts, cb) {
		var contentTarget = obj.el;
		if (obj.tpl && typeof htmlOrData !== "string") {
			obj.tpl[obj.tplWriteMode](contentTarget, htmlOrData || {});
		} else {
			var html = Ext.isObject(htmlOrData) ? Ext.DomHelper.markup(htmlOrData) : htmlOrData;
			contentTarget.update(html, loadScripts, cb);
		}
	},
	applyState: function (state) {
		Ext.Component.prototype.applyState.call(this, state);
		if (this.rendered) {
			this.updateHtmlData(this.items.items[0], this.htmlContent);
		}
	},
	settingHandler: function (e, target, panel) {
		if (!panel.settingWin) {
			Ext.applyIf(panel, { fields: {} });
			var settingWin = new Ext.Window({
				height: 300,
				width: 650,
				title: 'Settings',
				layout: 'fit',
				closeAction: 'hide',
				modal: true,
				items: [
					panel.form = new Ext.form.FormPanel({
						xtype: 'form',
						items: [
							panel.fields.Title = new Ext.form.TextField({ fieldLabel: 'Title', maxLength: 50, allowBlank: false, width: 500 }),
							panel.fields.HtmlField = new Ext.form.HtmlEditor({ fieldLabel: 'Content', maxLength: 250, allowBlank: false, width: 500 })
						]
					})
				],
				buttons: [
					{
						text: 'Apply',
						handler: function () {
							var htmlContent = panel.fields.HtmlField.getValue();
							var title = panel.fields.Title.getValue()
							panel.applySettings({ title: title, htmlContent: htmlContent });
							panel.ownerCt.ownerCt.saveState();
							panel.settingWin.hide();
							this.setTitle(title);
							this.updateHtmlData(this.items.items[0], htmlContent);
						},
						scope: this
					}
				]
			});
			panel.settingWin = settingWin;
		}
		var basicForm = panel.form.getForm();
		basicForm.reset();
		var settings = panel.getSettings();
		panel.fields.HtmlField.setValue(settings.htmlContent);
		panel.fields.Title.setValue(settings.title);
		panel.settingWin.show();
	},
	refreshHandler: function (e, target, panel) {
		this.updateHtmlData(this.items.items[0], panel.htmlContent);
	}
});
DA.Portal.applyBasicSettings(DA.Portlets.HtmlEditor);
DA.Portal.register('html-editor-portlet', DA.Portlets.HtmlEditor);
