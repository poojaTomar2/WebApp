Ext.define('Df.Map', {
	fullscreen: true,
	extend: 'Ext.Container',
	xtype: 'Df-Map',
	requires: ['Ext.Map'],
	contentString: undefined,
	address: undefined,
	store: undefined,
	config: {
		layout: 'fit',
		title: 'Map',
		items: [{
			xtype: 'map',
			id: 'geomap',
			scope: this,
			listeners: {
				maprender: function () {					
					this.parent.setMapMarkers();
				}
			}
		}]
	},
	setMapMarkers: function () {
		var store = Ext.getStore(this.config.store);
		if (!store) {
			return;
		}
		var gMap = this.down('map'),
			center = new google.maps.LatLng('36.743011', '-107.819824'),
			mapOptions = {
				center: center,
				zoom: 6
			},
			map = new google.maps.Map(document.getElementById('geomap'), mapOptions),			
			contentString,
			customerName, day, currentDate = new Date();
		var bounds = new google.maps.LatLngBounds();
		var todayStart = Ext.Date.clearTime(new Date());
		var todayEnd = Ext.Date.add(todayStart, Ext.Date.DAY, 1);
		store.each(function (rec, idx, cnt) {
			if (this.stores[0].getStoreId() == 'LocationWithIssues') {
				var imageName = [];
				imageName.push(rec.get('SmartDeviceTypeId'));
				if (rec.get('OpenMissingAlert') > 0) {
					imageName.push('Missing');
				} else {
					if (rec.get('OpenPurityAlert') > 0)
						imageName.push('Purity');
					if (rec.get('OpenStockAlert') > 0)
						imageName.push('Stock');
					if (rec.get('OpenMovementAlert') > 0)
						imageName.push('Movement');
					if (rec.get('OpenHealthAlert') > 0)
						imageName.push('Health');
				}

				var todayVisit = rec.get('NextVisit') >= todayStart && rec.get('NextVisit') < todayEnd;
				if (todayVisit) {
					imageName.push(imageName.length === 1 ? "Green" : "Red");
				} else {
					imageName.push(imageName.length === 1 ? "Gray" : "Maroon");
				}

				var icon = "resources/icons/Marker/" + imageName.join("") + ".png";
				var marker = new google.maps.Marker({
					icon: icon,
					map: map,
					position: new google.maps.LatLng(rec.get('Latitude'), rec.get('Longitude')),
					opacity: todayVisit ? 80 : 50,
					labelContent: idx,
					labelAnchor: new google.maps.Point(0, 35),
					labelClass: "labels", // the CSS class for the label
					labelInBackground: false,
					locationData: rec.data
				});
			} else {
				//TODO : implement more AlertType sIssues  
				var imageName = [];
				if (rec.get('SmartDeviceTypeId') > 0) {
					imageName.push(rec.get('SmartDeviceTypeId'));
				}
				if (rec.get('OpenMissingAlert') > 0) {
					imageName.push('Missing');
				} else {
					if (rec.get('OpenPurityAlert') > 0)
						imageName.push('Purity');
					if (rec.get('OpenStockAlert') > 0)
						imageName.push('Stock');
					if (rec.get('OpenMovementAlert') > 0)
						imageName.push('Movement');
					if (rec.get('OpenHealthAlert') > 0)
						imageName.push('Health');
				}
				var todayVisit = rec.get('IsOnRoute'); 
				if (todayVisit) {
					imageName.push(imageName.length === 1 ? "Green" : "Red");
				} else {
					imageName.push(imageName.length === 1 ? "Gray" : "Maroon");
				}
				var icon = "resources/icons/Marker/" + imageName.join("") + ".png";

				var marker = new google.maps.Marker({
					icon: icon,
					map: map,
					opacity: todayVisit ? 80 : 50,
					position: new google.maps.LatLng(rec.get('Latitude'), rec.get('Longitude')),
					labelContent: idx,
					labelAnchor: new google.maps.Point(0, 35),
					labelClass: "labels", // the CSS class for the label
					labelInBackground: false,
					locationData: rec.data
				});
			}

			bounds.extend(marker.position);
			//marker.setMap(map);
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			google.maps.event.addListener(marker, 'click', function () {
				this.infowindow = infowindow;
				Ext.Ajax.request({
					url: Df.App.getController('Alert', true),
					params: {
						locationId: this.locationData.LocationId,
						otherAction: 'AlertsForMap',
						action: 'other'
					},
					success: function (response) {
						var text = response.responseText, listString = '';
						var serverData = Ext.decode(text).data;
						if (!serverData)
							return;
						
						var data = serverData.records;
						for (var i = 0 ; i < data.length; i++) {
							listString += '<div class="customerInfo"></div>&nbsp;' + data[i].AlertType + '&nbsp;' + data[i].Aging + 'D &nbsp;<br/>'
						}
						var contentString = '<div id="content">' +
						'<div id="bodyContent">' +
							'<b>Customer Name:</b> ' + this.locationData.Name + '<br/>' +
								listString +
								//"<br/><button type='button' onclick='CoolerIoTMobile.app.onFollowUpClick(" + Ext.encode(this.locationData) + ");' class='followUpButton'>Follow Up</button><br/>" +
							'</div>' +
						'</div>';
						this.infowindow.setContent(contentString)
					},
					failure: function () {
						Ext.MessageBox.alert('Error', 'Some error occured.');
					},
					scope: this
				});

				infowindow.open(map, marker);
			});
		});
		map.fitBounds(bounds);
	}
});
