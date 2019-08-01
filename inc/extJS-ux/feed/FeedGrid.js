/*
* Ext JS Library 2.0
* Copyright(c) 2006-2007, Ext JS, LLC.
* licensing@extjs.com
* 
* http://extjs.com/license
*/

Ext.ux.FeedGrid = function(config) {
	Ext.apply(this, config);

	this.store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'controllers/feed-proxy.ashx'
		}),

		baseParams: { feed: config.feed },

		reader: new Ext.data.XmlReader(
            { record: 'item' },
            ['title', 'author', { name: 'pubDate', type: 'date', convert: Ext.ux.DateLocalizer }, 'link', 'description', 'content']
        )
	});
	this.store.setDefaultSort('pubDate', "DESC");
	createUrlLink = function (link, storeBase) {
		var urlValue;
		if (link.indexOf('http') > -1) {
			urlValue = link;
		} else {

			if (link != '') {
				var baseUrl;
				if (storeBase.feed.indexOf('http') > -1) {
					var indexOfSlashAfterHttp = storeBase.feed.substr(7, 100).indexOf('/');
					baseUrl = storeBase.feed.substr(7, indexOfSlashAfterHttp);
					if (baseUrl) {
						urlValue = storeBase.feed.substr(0, 7) + baseUrl + link;
					}
				}

			}
			else if (storeBase && storeBase.feed) {
				urlValue = storeBase.feed;
			}
			else {
				urlValue = eval(link);
			}
		}
		return urlValue;
	};

	renderIcon = function (value, metadata, record, rowIndex, colIndex, store) {
		var urlValue = createUrlLink(record.data.link, record.store.baseParams);
		return String.format('<a href={0} target="_blank">' + '<img  class="imgRightArrow"></a>', urlValue);
	};
	this.columns = [{
		id: 'title',
		header: "Title",
		dataIndex: 'title',
		sortable: true,
		width: 100,
		renderer: this.formatTitle
	}, {
		header: "Author",
		dataIndex: 'author',
		width: 50,
		hidden: true,
		sortable: true
	}, {
		id: 'last',
		header: "Date",
		dataIndex: 'pubDate',
		width: 50,
		renderer: this.formatDate,
		sortable: true
	}];
	if (ExtHelper.isMobile.any()) {
		this.columns.push({ header: 'Go to Post', renderer: renderIcon, scope: this });
	}


	Ext.ux.FeedGrid.superclass.constructor.call(this, {
		loadMask: { msg: 'Loading Feed...' },

		sm: new Ext.grid.RowSelectionModel({
			singleSelect: true
		}),

		viewConfig: {
			forceFit: true,
			enableRowBody: true,
			showPreview: true,
			getRowClass: this.applyRowClass
		}
	});

	this.store.baseParams.feed = this.feed;

	this.on('rowcontextmenu', this.onContextClick, this);
};

	Ext.extend(Ext.ux.FeedGrid, Ext.grid.GridPanel, {

		onContextClick: function (grid, index, e) {
			if (!this.menu) { // create context menu on first right click
				this.menu = new Ext.menu.Menu({
					id: 'grid-ctx',
					items: [{
						iconCls: 'new-win',
						text: 'Go to Post',
						scope: this,
						handler: function () {
							var urlValue = createUrlLink(this.ctxRecord.data.link, this.store.baseParams);
							window.open(urlValue);
						}
					}, '-', {
						iconCls: 'refresh-icon',
						text: 'Refresh',
						scope: this,
						handler: function () {
							this.ctxRow = null;
							this.store.reload();
						}
					}]
				});
				this.menu.on('hide', this.onContextHide, this);
			}
			e.stopEvent();
			if (this.ctxRow) {
				Ext.fly(this.ctxRow).removeClass('x-node-ctx');
				this.ctxRow = null;
			}
			this.ctxRow = this.view.getRow(index);
			this.ctxRecord = this.store.getAt(index);
			Ext.fly(this.ctxRow).addClass('x-node-ctx');
			this.menu.showAt(e.getXY());
		},

		onContextHide: function () {
			if (this.ctxRow) {
				Ext.fly(this.ctxRow).removeClass('x-node-ctx');
				this.ctxRow = null;
			}
		},

		load: function (options) {
			this.store.load();
		},

		loadFeed: function (url) {
			this.store.baseParams = {
				feed: url
			};
			this.store.load();
		},

		togglePreview: function (show) {
			this.view.showPreview = show;
			this.view.refresh();
		},

		// within this function "this" is actually the GridView
		applyRowClass: function (record, rowIndex, p, ds) {
			if (this.showPreview) {
				var xf = Ext.util.Format;
				p.body = '<p>' + xf.ellipsis(xf.stripTags(record.data.description), 200) + '</p>';
				return 'x-grid3-row-expanded';
			}
			return 'x-grid3-row-collapsed';
		},

		formatDate: function (date) {
			if (!date) {
				return '';
			}
			return date.format('m/d/Y');
			/*
			var now = new Date();
			var d = now.clearTime(true);
			var notime = date.clearTime(true).getTime();
			if (notime == d.getTime()) {
			return 'Today ' + date.dateFormat('g:i a');
			}
			d = d.add('d', -6);
			if (d.getTime() <= notime) {
			return date.dateFormat('D g:i a');
			}
			return date.dateFormat('n/j g:i a');
			*/
		},

		formatTitle: function (value, p, record) {
			return String.format(
                '<div class="topic"><b>{0}</b><span class="author">{1}</span></div>',
                value, record.data.author, record.id, record.data.forumid
                );
		}
	});
