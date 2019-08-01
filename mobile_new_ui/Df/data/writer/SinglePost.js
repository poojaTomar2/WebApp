Ext.define('Df.data.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.df-singlepost',

    getRecordData: function (record) {
        var data = this.callParent(arguments);
        var associatedData = record.getAssociatedData();
        var name;
        for (name in associatedData) {
            data[name] = Ext.encode(associatedData[name]);
        }
        return data;
    },

    writeDate: function (field, date) {
        if (!date) {
            return date;
        } else {
            var dateFormat = field.dateFormat || 'c';
            switch (dateFormat) {
                case 'timestamp':
                    return date.getTime() / 1000;
                case 'time':
                    return date.getTime();
                default:
                    return Ext.Date.format(date, dateFormat);
            }
        }
    },

    writeRecords: function (request, data) {
        var params = request.getParams() || {};
        Ext.applyIf(params, data[0]);
        request.setParams(params);
        return request;
    }
});