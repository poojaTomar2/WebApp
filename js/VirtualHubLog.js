Cooler.VirtualHubLog = new Cooler.Form({
	title: 'VirtualHub Log',
	controller: 'VirtualHubLog',
	disableAdd: true,
	disableDelete: true,
	hybridConfig: [
		{ header: 'Hub Mac Address', dataIndex: 'HubMac', width: 150, type: 'string' },
		{ header: 'Hub Version', dataIndex: 'HubVersion', width: 150, type: 'string' },
		{ header: 'File Type', dataIndex: 'FileType', width: 150, type: 'string' },
		{ header: 'File Name', dataIndex: 'FileName', width: 150, type: 'string', hidden: true },
		{ header: 'Log Date', dataIndex: 'DateUploaded', width: 150, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
		{ header: 'Download', width: 150, type: 'string', sortable: false, width: 100, renderer: function (value, meta, record) { return "<a target='_blank' href='Controllers/" + Cooler.VirtualHubLog.controller + ".ashx?action=downloadFile&fileName=" + record.data.FileName + "'>Download</a>" } }
	]
});