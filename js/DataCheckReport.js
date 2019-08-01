Cooler.DataCheckReport = Ext.extend(Cooler.Form, {

    controller: 'DataCheckReport',

    keyColumn: 'SmartDeviceId',

    title: 'Data Check Report',

    disableAdd: true,

    disableDelete: true,
    securityModule: 'DataCheckReport',
    constructor: function (config) {
        Cooler.DataCheckReport.superclass.constructor.call(this, config || {});
        Ext.apply(this.gridConfig, {
            custom: {
                loadComboTypes: true
            },
            defaults: { sort: { dir: 'ASC', sort: 'EventType' } }
        });
    },

    hybridConfig: function () {
        return [
            { type: 'int', dataIndex: 'SmartDeviceId' },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150 },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150 },
            { header: 'Event Type', type: 'string', dataIndex: 'EventType', width: 150 },
            { header: 'Door EventCreatedOn', type: 'date', dataIndex: 'DoorEventCreatedOn', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Door EventTime', type: 'date', dataIndex: 'DoorEventTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Health CreatedOn', type: 'date', dataIndex: 'HealthCreatedOn', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Health EventTime', type: 'date', dataIndex: 'HealthEventTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Movement CreatedOn', type: 'date', dataIndex: 'MovementCreatedOn', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Movement EventTime', type: 'date', dataIndex: 'MovementEventTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Door OpenTime', type: 'date', dataIndex: 'DoorOpenTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Door CloseTime', type: 'date', dataIndex: 'DoorCloseTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            //{ header: 'Door Duplicate EventTime', type: 'date', dataIndex: 'DoorDuplicateEventTime', width: 150, renderer: Cooler.renderer.DateTimeWithTimeZone },
            //{ header: 'Door Duplicates', type: 'int', dataIndex: 'DoorDuplicates', width: 100 },
            //{ header: 'Health Duplicate EventTime', type: 'date', dataIndex: 'HealthDuplicateEventTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            //{ header: 'Health Duplicates', type: 'int', dataIndex: 'HealthDuplicates', width: 100 },
            //{ header: 'Movement Duplicate EventTime', type: 'date', dataIndex: 'MovementDuplicateEventTime', width: 200, renderer: Cooler.renderer.DateTimeWithTimeZone },
            //{ header: 'Movement Duplicates', type: 'int', dataIndex: 'MovementDuplicates', width: 150 }
        ];
    }

});
Cooler.DataCheckReport = new Cooler.DataCheckReport({ uniqueId: 'DataCheckReport' });