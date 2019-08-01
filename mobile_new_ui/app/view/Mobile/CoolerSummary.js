Ext.define('CoolerIoTMobile.view.Mobile.CoolerSummary', {
	extend: 'Ext.Container',
	xtype: 'mobile-coolerSummary',
	cls: 'asset-item-list-container no-padding-margin',
	config: {
		parentRecord: null,
		assetId: null,
		data: null,
		healthChartdata: null,
		layout: 'vbox',
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		listeners: {
			painted: function (panel, oOpts) {
				var navigationView = Ext.ComponentQuery.query('#mainNavigationView')[0];
				var data = this.getData();
				navigationView.getNavigationBar().setTitle(data.SerialNumber);
				var coolerPanel = this.down('[itemId=coolerPanel]');
				var wendingPanel = this.down('[itemId=wendingItemPanel]');
				var isVending = data.AssetTypeId === CoolerIoTMobile.Enums.AssetType.WendingMachine;

				coolerPanel.setHidden(isVending);
				wendingPanel.setHidden(!isVending);
				if (isVending) {
					var store = wendingPanel.down('coolerSummaryMatrix').getStore();
					var storeProxy = store.getProxy();
					storeProxy.setExtraParams({ action: 'list', limit: 0, AsArray: 0, sort: 'AssetId', dir: 'DESC', AssetId: data.AssetId });
				}
				var hasCabinetHealth = data.HasCabinetHealth,
					hasPowerSensor = data.HasPowerSensor,
					hasGPS = data.HasGPS,
					hasVision = data.HasVision,
					menu = Ext.ComponentQuery.query('#mainNavigation')[0],
					imageOption = menu.getMenuItem('pictures'),
					powerOption = menu.getMenuItem('power'),
					commandOption = menu.getMenuItem('commands'),
					configOption = menu.getMenuItem('configuration'),
					provisionOption = menu.getMenuItem('provision'),
					provisionAccess = !Df.SecurityInfo.modules.ProvisionDevice.Module;
				imageOption.setHidden(!hasVision);
				powerOption.setHidden(!hasPowerSensor);
				commandOption.setHidden(provisionAccess);
				configOption.setHidden(provisionAccess);
				provisionOption.setHidden(provisionAccess);

				if (hasCabinetHealth) {
					this.down('[itemId=healthSummaryTitle]').setHidden(false);
					this.down('[itemId=healthSummary]').setHidden(false);
				}
				if (hasPowerSensor) {
					this.down('[itemId=powerConsumptionDetailTitle]').setHidden(false);
					this.down('[itemId=powerConsumptionDetail]').setHidden(false);
				}
				if (hasGPS) {
					this.down('[itemId=gpsTrackingTitle]').setHidden(false);
					this.down('[itemId=gpsTracking]').setHidden(false);
				}
				if (hasVision) {
					this.down('[itemId=product-images]').setHidden(false);
					this.down('[itemId=distributionDataTitle]').setHidden(false);
					this.down('[itemId=product-detail-planogram-oppurtunity]').setHidden(false);
					this.down('[itemId=product-distribution-data]').setHidden(false);
					this.down('[itemId=distributionChartTitle]').setHidden(false);
					this.down('[itemId=product-distribution-chart]').setHidden(false);
				}
				this.setParentRecord(data);
			}
		},
		items: [
			{
				xtype: 'container',
				itemId: 'summaryData',
				tpl: new Ext.XTemplate('<div class="asset-detail-container">',
						'<div class="asset-detail-header">',
                    '<table><tr>',
							'<td class="firstTd"><tpl if="CoolerIoTMobile.util.Renderers.alertCount(values.Alerts) == false"><span class="cooler-icon-small cooler-icon-small-cooler"></span></tpl><tpl if="CoolerIoTMobile.util.Renderers.alertCount(values.Alerts) == true""><span class="cooler-icon-small-alert cooler-icon-small-cooler"></span></tpl></td>',
							'<td class="secondTd"><span class="header-text bold-text">{SerialNumber}</span></td>',
							'<td class="thirdTd"><span class="header-text">{AssetType}</span></td>',
							'<td class="fourthTd"><img src="./resources/icons/off.png"><div class="asset-details-header-last-column-text">{[CoolerIoTMobile.util.Renderers.getPowerText(values)]}</div></td>',
                    '</tr></table>',
						'</div>',
						'<div class="device-detail">',
							'<span class="device-detail-block iot-col-33 device-detail-block-right-border">',
								'<span class="bold-text">{LocationCode}</span><br />',
								'<span class="device-detail-sub-detail">{SerialNumber}</span>',
							'</span>',
							'<span class="device-detail-block iot-col-33 device-detail-block-right-border">',
								'<span class="bold-text">Smart Hub</span><br />',
								'<span class="device-detail-sub-detail">{GatewaySerialNumber}</span>',
							'</span>',
							'<span class="device-detail-block iot-col-33">',
								'<span class="bold-text">Smart Tag</span><br />',
								'<span class="device-detail-sub-detail">{SmartDeviceSerialNumber}</span>',
							'</span>',
						'</div>',
						'<ul class="cooleriot-detail-list-view assetContainer">',
							'<li class="cooleriot-display-table asset-first-row">',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-door-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-temp-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-light-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-planogram2-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-purity-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-planogram-icon"></span>',
									'</span>',
								'</span>',
							'</li>',
							'<li class="cooleriot-display-table asset-second-row">',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{DoorCount}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{Temperature} &#8451;</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.getLightIntensity(values)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.getStockPerc(values)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.getPurityPerc(values)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.getPlanogramCompliance(values)]}</span>',
							'</li>',
						'</ul>',
						'<ul class="cooleriot-detail-list-view assetContainer">',
							'<li class="cooleriot-display-table asset-first-row">',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-ping-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-power-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-movement-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-scan-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-pin-icon"></span>',
									'</span>',
								'</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">',
									'<span class="iot-detail-mid-span">',
										'<span class=" iot-detail-icon iot-alert-icon"></span>',
									'</span>',
								'</span>',
							'</li>',
							'<li class="cooleriot-display-table asset-second-row">',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.dateRenderer(values.LastPing, "M/d/y h:i A", true)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.getPowerText(values)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.getDeviceMovement(values)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{[CoolerIoTMobile.util.Renderers.dateRenderer(values.LatestScanTime, "M/d/y h:i A", true)]}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{DisplacementText}</span>',
								'<span class="cooleriot-table-cell text-center iot-col-16 ">{Alerts}</span>',
							'</li>',
						'</ul>',
					'</div>')
			},
			{
				xtype: 'panel',
				itemId: 'coolerPanel',
				cls: 'summary-header-margin',
				items: [
					{
						xtype: 'collapsible-titlebar',
						title: 'Exception',
						itemId: 'healthSummaryTitle',
						hidden: true,
						targetEl: "#healthSummary"
					},
					{
						xtype: 'container',
						width: '100%',
						itemId: 'healthSummary',
						hidden: true,
						margin: 1,
						items: [
							{
								xtype: 'container',
								itemId: 'healthSummaryNew',
								tpl: CoolerIoTMobile.Templates.graphTpl
							},
							{
								itemId: 'health-distribution-chart',
								xtype: 'healthLineChart',
								chartTitle: '',
								hidden: true,
								height: '50%',
								width: '97%'
							},
							{
								itemId: 'summary-chart',
								xtype: 'summaryChart',
								chartTitle: '',
								hidden: true,
								height: '50%',
								width: '97%'
							}
						]
					},
					{
						xtype: 'collapsible-titlebar',
						title: 'Alerts',
						itemId: 'alerts',
						hidden: true,
						cls: 'summary-header-margin',
						targetEl: "#alertSummary"
					},
					{
						xtype: 'container',
						hidden: true,
						itemId: 'alertSummary',
						tpl: CoolerIoTMobile.Templates.Alert,
						data: []
					},
					{
						xtype: 'collapsible-titlebar',
						title: 'Environment',
						itemId: 'environmentSummaryTitle',
						hidden: true,
						cls: 'summary-header-margin',
						targetEl: "#environmentSummary"
					},
					{
						xtype: 'container',
						height: 100,
						hidden: true,
						itemId: 'environmentSummary',
						margin: 5,
						tpl: CoolerIoTMobile.Templates.EnvironmentSummary,
						data: []
					},
					{
						xtype: 'collapsible-titlebar',
						title: 'GPS Tracking and Movement',
						itemId: 'gpsTrackingTitle',
						hidden: true,
						cls: 'summary-header-margin',
						targetEl: "#gpsTracking"
					},
					{
						xtype: 'container',
						//height: 400,
						itemId: 'gpsTracking',
						hidden: true,
						layout: 'hbox',
						cls: 'background-white-container',
						margin: 5,
						items: [
							{
								xtype: 'container',
								itemId: 'gpsDetail',
								flex: 0.4,
								tpl: CoolerIoTMobile.Templates.GPSDetail,
								data: []
							},
							{
								xtype: 'map',
								itemId: 'coolerMovementMap',
								flex: 0.6
							}
						]
					},
					{
						xtype: 'collapsible-titlebar',
						title: 'Planogram and Realogram',
						itemId: 'distributionDataTitle',
						hidden: true,
						cls: 'summary-header-margin',
						targetEl: "#product-detail-planogram-oppurtunity"
					},
					{
						xtype: 'container',
						width: '100%',
						itemId: 'product-detail-planogram-oppurtunity',
						hidden: true,
						layout: 'vbox',
						margin: 1,
						items: [
							{
								xtype: 'container',
								itemId: 'purityData',
								tpl: CoolerIoTMobile.Templates.ProductOpportunityPlanogram
							},
							{
								itemId: 'product-distribution-data',
								cls: 'background-white-container',
								xtype: 'distributionData',
								hidden: true,
								height: 'auto'
							},
							{
								xtype: 'container',
								width: '100%',
								itemId: 'product-images',
								hidden: true,
								cls: 'background-white-container',
								margin: 1,
								tpl: CoolerIoTMobile.Templates.ProductImages
							}
						]
					},
					{
						xtype: 'collapsible-titlebar',
						title: 'Product Distribution',
						itemId: 'distributionChartTitle',
						hidden: true,
						cls: 'summary-header-margin',
						targetEl: "#product-distribution-chart"
					},
					{
						xtype: 'container',
						width: '100%',
						itemId: 'product-distribution-chart',
						cls: 'background-white-container',
						hidden: true,
						layout: 'vbox',
						items: [
							{
								xtype: 'container',
								width: '96%',
								itemId: 'chart-header',
								hidden: true,
								cls: 'background-white-container',
								margin: '1% 0 0 2%',
								tpl: new Ext.XTemplate('<div class ="productImageHeader">',
											'<div class= "product-chart-caption" style ="border-right: 0px;">PLANOGRAM</div>',
										 '</div>',
										'<div class ="productImageHeader">',
										'<div class= "product-chart-caption">COOLER FACINGS</div>',
										'</div>'
											)
							},
							{
								xtype: 'container',
								width: '96%',
								layout: 'hbox',
								cls: "production-pie-chart",
								height: 200,
								items: [
									{
										itemId: 'product-distribution-chart-planogram',
										xtype: 'distributionChart',
										flex: 0.5,
										margin: '1 0 0 1',
										hidden: true
									},
									{
										itemId: 'product-distribution-chart-facing',
										xtype: 'distributionChart',
										flex: 0.5,
										margin: '1 1 0 0',
										hidden: true
									}
								]
							},
							{
								xtype: 'container',
								height: 350,
								items: [
							{
								itemId: 'product-distribution-chart-combined',
								xtype: 'productChart',
								hidden: true,
								margin:'1 0 0 0',
								width: 'auto'
							}
								]
							}
						]
					},
					{
						xtype: 'collapsible-titlebar',
						title: 'Power Consumption',
						itemId: 'powerConsumptionDetailTitle',
						hidden: true,
						cls: 'summary-header-margin',
						targetEl: "#powerConsumptionDetail"
					},
					{
						xtype: 'container',
						height: 110,
						itemId: 'powerConsumptionDetail',
						hidden: true,
						tpl: CoolerIoTMobile.Templates.PowerConsumptionDetail,
						data: []
					}
				]

			},
			{
				xtype: 'panel',
				itemId: 'wendingItemPanel',
				margin: '0 0 8px 0',
				hidden: true,
				items: [
					{
						xtype: 'toolbar',
						items:
                        [
                            {
                            	xtype: 'title',
                            	titleAlign: 'left',
                            	title: 'Matrix Data'
                            },
                            { xtype: 'spacer' },
							{
								xtype: 'button',
								itemId: 'matrixSave',
								text: 'Save',
								iconCls: 'action',
								ui: 'confirm',
								iconMask: true
							}
                        ]

					},
					{
						xtype: 'coolerSummaryMatrix',
						flex: 1,
						height: '92%'
					}
				]
			}
		]
	},
	updateParentRecord: function (record) {
		var summaryData = this.down('#summaryData');
		summaryData.setData(record);
		var purityData = this.down('#purityData');
		purityData.setData(record);
		this.setAssetId(record.Id);
		this.data = record;
		if (record.AssetTypeId !== CoolerIoTMobile.Enums.AssetType.WendingMachine) {
			Ext.Ajax.request({
				url: Df.App.getController('SmartDevice'),
				params: {
					action: 'getSmartDeviceDetail',
					smartDeviceId: record.SmartDeviceId || record.AssociationId
				},
				success: function (response) {
					var responseData = Ext.decode(response.responseText);
					this.onActionComplete(Ext.Object.merge(this.data, responseData.data[0]));
				},
				failure: function () {
					Ext.Msg.alert('Error', 'Data not loaded');
				},
				scope: this
			});
		}
	},
	onUpdateActionComplete: function (record) {
		var currectScope = google.maps.currentScope;
		delete google.maps.currentScope;
		var data = record;
		var coolerVision = data.CoolerVision,
			chartFacingData = [],
			chartPlanogramData = [],
			chartCombinedData = [],
			chartFacing,
			chartPlanogram,
			chartCombined,
			distributionData,
			imgTitle,
			img,
			productImage,
			productImageData = [],
			latestImgTitle,
			capturedOn,
			gpsPanel = currectScope.down('#gpsDetail'),
			powerConsumptionDetail = currectScope.down('#powerConsumptionDetail'),
			environmentSummary = currectScope.down('#environmentSummary'), stockDetails, imageObj, latestImagesObj, planogramDetails;
		if (coolerVision) {
			stockDetails = coolerVision.facings.productSummary,
			planogramDetails = coolerVision.planogram.productSummary,
			imageObj = coolerVision.images;
			latestImagesObj = coolerVision.latestImages;
			Ext.each(stockDetails, function (item) {
				chartFacingData.push({ label: item.product.name, value: item.count, color: item.product.graphColor, labelFontColor: item.product.isForeign ? "#0000ff" : "" });
			}, this);
			Ext.each(planogramDetails, function (item) {
				chartPlanogramData.push({ label: item.product.name, value: item.count, color: item.product.graphColor, labelFontColor: item.product.isForeign ? "#0000ff" : "" });
			}, this);
			chartCombinedData.push({ type: 'Facings', data: chartFacingData });
			chartCombinedData.push({ type: 'Planogram', data: chartPlanogramData });
		}
		chartFacing = Ext.ComponentQuery.query('[itemId=product-distribution-chart-facing]')[0];
		chartPlanogram = Ext.ComponentQuery.query('[itemId=product-distribution-chart-planogram]')[0];
		chartCombined = Ext.ComponentQuery.query('[itemId=product-distribution-chart-combined]')[0];
		productImage = currectScope.down('#product-images');
		distributionData = currectScope.down('distributionData');
		powerConsumptionDetail.setData(data);
		environmentSummary.setData(data);
		this.down('#chart-header').setData();
		gpsPanel.setData(data);
		if (data.HasVision && (chartPlanogramData.length > 0 || chartFacingData.length > 0)) {
			chartPlanogram.show();
			chartCombined.show();
			chartFacing.show();
			this.down('[itemId=chart-header]').setHidden(false);
			chartFacing.setData(chartFacingData);
			chartPlanogram.setData(chartPlanogramData);
			chartCombined.setData(chartCombinedData);
			distributionData.setData(data.CoolerVision);
			if (imageObj && imageObj.length > 0) {
				var len = imageObj.length;
				if (len > 1) {
					for (var i = 0; i < len; i++) {
						var imageName = imageObj[i].url;
						capturedOn = imageObj[i].capturedOn;
						capturedOn = CoolerIoTMobile.util.Renderers.dateRenderer(new Date(capturedOn), "M-d-Y h:i:s A");
						productImageData.push({ imageUrl: imageName, date: capturedOn });
					}
				} else {
					capturedOn = imageObj[0].capturedOn;
					capturedOn = CoolerIoTMobile.util.Renderers.dateRenderer(new Date(capturedOn), "M-d-Y h:i:s A");
					productImageData.push({ imageUrl: imageObj[0].url, date: capturedOn });
				}
			}
		}
		else {
			distributionData.hide();
			this.down('[itemId=distributionChartTitle]').setHidden(true);
			this.down('[itemId=product-distribution-chart]').setHidden(true);
		}
		if (latestImagesObj && latestImagesObj.length > 0 && data.LatestProcessedPurityId !== data.LatestPurityId) {
			var len = latestImagesObj.length;
			if (len > 1) {
				for (var i = 0; i < len; i++) {
					imageName = latestImagesObj[i].url;
					capturedOn = latestImagesObj[i].capturedOn;
					capturedOn = CoolerIoTMobile.util.Renderers.dateRenderer(new Date(capturedOn), "M-d-Y h:i:s A");
					productImageData.push({ imageUrl: imageName, date: capturedOn });
				}
			} else {
				capturedOn = latestImagesObj[0].capturedOn;
				capturedOn = CoolerIoTMobile.util.Renderers.dateRenderer(new Date(capturedOn), "M-d-Y h:i:s A");
				productImageData.push({ imageUrl: latestImagesObj[0].url, date: capturedOn });
			}
		}
		productImage.setData(productImageData);
	},
	onActionComplete: function (record) {
		var address, latlng = new google.maps.LatLng(record.Latitude, record.Longitude);
		var geocoder = new google.maps.Geocoder();
		google.maps.currentScope = this;
		geocoder.geocode({ 'latLng': latlng }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					record.Address = results[1].formatted_address;
					google.maps.currentScope.onUpdateActionComplete(record);
				}
			} else {
				google.maps.currentScope.onUpdateActionComplete(record);
			}
		}, this);
	}
});