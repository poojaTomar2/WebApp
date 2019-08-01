Ext.define('Df.overrides.GridColumnOverride', {
	override: 'Ext.grid.column.Column',
	// Fixes rendering of Ext.grid.column.Action that emits HTML rather than text
	updateCell: function (cell, record, content) {
		if (cell && cell.innerHTML && (content || record)) {
			// WAS: cell.firstChild.nodeValue = content || this.getCellContent(record);
			// cell.firstChild is the Text node for the cell.
			// Old code assumed that getCellContent() returned only text when in fact it can return HTML for Action and Template columns.
			// So may require htmlEncode() calls in some implementations of getCellContent()
			cell.innerHTML = content || this.getCellContent(record);
		}
	}
});