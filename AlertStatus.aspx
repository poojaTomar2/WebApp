<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AlertStatus.aspx.cs" Inherits="AlertStatus" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>Alert Status</title>
	<script src="js/jquery-1.11.1.min.js"></script>
	<style type="text/css">
		.title {
			background: rgb(57, 148, 226);
			padding: 11px;
			border-radius: 5px;
			color: white;
			font-weight: 400;
		}

		b {
			font-weight: 500;
		}

		table.table-one tbody > tr > td {
			background: #f8f5f5;
			border-radius: 7px;
			padding: 15px -0px;
		}

		.table-content {
			background-color: #f8f5f5;
			border-radius: 10px;
			/* width: 100%; */
			margin: 0px 13px 25px 2px;
		}

		/*.btn {
	        background-color: #0473d1;
	        margin: 0 auto;
	        height: 35px;
	        line-height: 35px;
	        text-align: center;
	        width: 200PX;
	    }*/
		body {
			/*font-family: 'Open Sans', sans-serif;*/
			font-family: segoe UI;
			box-sizing: border-box;
			height: 80%;
			margin: 12px auto;
			overflow: auto;
			padding: 15px 19px;
			width: 80%;
			border-radius: 1px;
			/*background: #efefef;*/
		}

		/* STRUCTURE */

		#pagewrap {
			padding: 15px;
			margin: 0px auto;
			background: rgb(207, 209, 210);
			border-radius: 13px;
			-moz-box-shadow: 0 0 1px #000000;
			-webkit-box-shadow: 0 0 1px #000000;
			box-shadow: 0 0 1px #000000;
		}

		header {
			padding: 0 15px;
		}

		table {
			width: 99%;
		}

			table td {
				text-align: center;
				width: 25%;
			}

		#content tr td div {
			width: 50%;
		}

		#middle {
			padding: 5px 15px;
			/*margin: 0px 5px 5px 5px;*/
			background-color: #f8f5f5;
			border-radius: 10px;
			/* width: 100%; */
			margin: 0px 27px 25px 16px;
		}

			#middle table {
				max-width: 50%;
			}



		#sidebar {
			padding: 0px 31px;
			text-align: center;
			background-color: #f8f5f5;
			border-radius: 10px;
			/* width: 100%; */
			margin: 0px 27px 25px 16px;
		}

			#sidebar table {
				width: 98%;
			}

		header, #content, #middle, #sidebar {
			min-height: 40px;
		}

		/************************************************************************************
MEDIA QUERIES
*************************************************************************************/
		/* for 980px or less */
		@media screen and (max-width: 980px) {

			#pagewrap {
				width: 94%;
			}

			#content {
				padding: 1% 4%;
			}

			#middle {
				padding: 1% 4%;
				margin: 0px 0px 5px 5px;
			}

			#sidebar {
				clear: both;
				padding: 1% 4%;
				width: auto;
				float: none;
			}

			header, footer {
				padding: 1% 4%;
			}
		}

		/* for 700px or less */
		@media screen and (max-width: 600px) {

			#content {
				width: auto;
				float: none;
			}

			#middle {
				width: auto;
				float: none;
				margin-left: 0px;
			}

			#sidebar {
				width: auto;
				float: none;
			}
		}

		/* for 480px or less */
		@media screen and (max-width: 480px) {

			header {
				height: auto;
			}

			h1 {
				font-size: 2em;
			}

			#sidebar {
				display: none;
			}
		}

		header, #content, #middle, #sidebar {
			margin-bottom: 5px;
		}

		#pagewrap, header, #content, #middle, #sidebar, footer {
			/*border: solid 1px #ccc;*/
		}

		.white {
			border-radius: 5px;
			color: white;
			/*background-color: #0473d1;*/
			margin: 0 auto;
			height: 35px;
			line-height: 35px;
			text-align: center;
			width: 200PX;
		}

		.statusbtn {
			background-color: #006600;
		}

		.prioritybtn {
			background-color: #ff4d4d;
		}

		.btn {
			background-color: #0473d1;
		}

		.lodingimg {
			margin: 0;
			/*background: yellow;*/
			position: absolute;
			top: 50%;
			left: 50%;
			margin-right: -50%;
			-ms-transform: translate(-50%,-50%); /* IE 9 */
			-webkit-transform: translate(-50%,-50%); /* Chrome, Safari, Opera */
			transform: translate(-50%, -50%);
			/*transform: translate(-50%,50%);*/
		}
	</style>
	<script type="text/javascript">

		function setPriority(priority) {
			if (priority == "High") {
				$('#preId').text("High");
				$('#preId').css('background-color', 'red');
			} else if (priority == "Medium") {
				$('#preId').text("Medium");
				$('#preId').css('background-color', 'blue');
			} else if (priority == "Low") {
				$('#preId').text("Low");
				$('#preId').css('background-color', 'yellow');
			}
		}
		// Convert /Date(590104800000)/ to Date formate (MM/dd/yyyy)
		function ToJavaScriptDate(value) {

			var pattern = /Date\(([^)]+)\)/;
			var results = pattern.exec(value);
			var d = new Date();
			d.setTime(results[1]);
			console.log(d);
			var dt = new Date(parseInt(results[1]));
			var strDateTime = [[AddZero(dt.getDate()),
        AddZero(dt.getMonth() + 1),
        dt.getFullYear()].join("/"),
        [AddZero(dt.getHours()),
        AddZero(dt.getMinutes())].join(":"),
        dt.getHours() >= 12 ? "PM" : "AM"].join(" ");
			return strDateTime;
			//	return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
		}

		function AddZero(num) {
			return (num >= 0 && num < 10) ? "0" + num : num + "";
		}

		function getURLParameter(name) {
			var url = location.href;
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(url);
			return results == null ? null : results[1].replace(/%20/g, " ");
		}

		function failureErrorHandlingToUser(param) {
			hideProgressWholeWindow();
			if (param.status == 500) {
				alert("The server encountered an internal error or misconfiguration and was unable complete your request. Please contact the server administrator or try again later.");
			}
			else if (param.status == 401) {
				alert("Unauthorized Access");
			}
		}

		function receiveAjaxResponse(isSuccess, param, callback) {

			if (isSuccess)
				callback(isSuccess, param);
			else
				failureErrorHandlingToUser(param);
		}
		function getAlertStatus(alertStatusId) {
			if (alertStatusId == 254) {
				$("#alertStatusId").text("Complete");
				$("#alertStatusId").css('background-color', 'green');
			}
			if (alertStatusId == 255) {
				$("#alertStatusId").text("Closed");
				$("#alertStatusId").css('background-color', 'grey');
			}
			else if (alertStatusId == 256) {
				$("#alertStatusId").text("Acknowledged");
				$("#alertStatusId").css('background-color', 'orange');
			}
			else if (alertStatusId == 1) {
				$("#alertStatusId").text("New");
				$("#alertStatusId").css('background-color', 'red');
			}
			else if (alertStatusId == 2) {
				$("#alertStatusId").text("Planned");
				$("#alertStatusId").css('background-color', '#32CD32');
			}
		}

		// Show Loading Panel whole window
		function showProgressWholeWindow() {
			var objID = "PRGS_Window";
			$(objID).remove();
			$('body').append('<div id=' + objID + '><div id="windowProgressDiv" style="height:80px; width:150px; text-align: center;"><table style="height:75px; width:180px;"><tr valign="center" style="height: 75px;"><td style = "text-align: center !important;"><img id="imgloading" src="<%=Page.ResolveUrl("~/Images/loading.gif")%>"/></td></tr><tr style="height: 35px;"><td style="text-align: center !important;"><span style="font-family: Segoe UI,Tahoma,Arial,Helvetica,sans-serif; font-size: 25px; color: #2760C2;"> Please Wait... </span></td></tr></table></div></div>');
			$("#" + objID).css("position", "absolute");
			$("#" + objID).css("top", 0);
			$("#" + objID).css("left", 0);
			$("#" + objID).css("height", $(window).height());
			$("#" + objID).css("width", $(window).width());
			$("#" + objID).css({ "background-color": "#FFFFFF", "opacity": "0.8", "filter": "alpha(opacity=80)", "z-index": "1500" });
			$("#windowProgressDiv").addClass("lodingimg");
		}

		//Hide loading panel whole Window 
		function hideProgressWholeWindow() {
			var objID = "#PRGS_Window";
			$(objID).remove();
		}

		function sendAjaxRequest(methodName, param, callback) {
			$.ajax({
				url: '<% =Page.ResolveUrl("~/AlertStatus.aspx") %>' + "/" + methodName,
				data: param,
				dataType: "json",
				async: true,
				contentType: "application/json",
				cache: false,
				context: document.body,
				type: 'POST',
				success: function (data) {
					receiveAjaxResponse(true, data, callback);
				},
				error: function (request, status, error) {

					receiveAjaxResponse(false, request, callback);
				}
			});
		}

		function getAgeFromMinutes(ageMinutes) {
			var age = '';
			var day = Math.floor(ageMinutes / 1440);
			var hours = Math.floor(ageMinutes / 60);
			var minutes = ageMinutes % 60;
			if (ageMinutes > 1440) {
				if (day > 0) {
					if (hours > 0) {
						if (minutes > 0) {
							age = day + 'd' + hours + 'h' + minutes + 'm';
						}
						else {
							age = day + 'd' + hours + 'h';
						}
					}
					else {
						age = day + 'd';
					}
				}
				else {
					age = 0 + 'm'
				}
			}
			else {
				if (hours > 0) {
					if (minutes > 0) {
						age = hours + 'h' + minutes + 'm';
					}
					else {
						age = hours + 'h';
					}
				}
				else if (minutes > 0) {

					age = minutes + 'm';
				}
				else {
					age = 0 + 'm'
				}
			}
			return age;
		}

	</script>
	<script type="text/javascript">

		//DOM Ready function
		$(document).ready(function () {
			showProgressWholeWindow();
			console.log("Dom Ready Call");
			var alertId = getURLParameter('alertId');
			var JsonParam = "{\"alertId\":\"" + alertId + "\"}";
			sendAjaxRequest('GetRecordOfAlert', JsonParam, function (isSuccess, param) {
				if (isSuccess == true) {

					var record = param.d;
					window.codeDetail = record[0].Code.toLowerCase();
					if (record != null) {
						$("#textId").text(record[0].AlertText);
						$("#typeId").text(record[0].AlertType);
						$("#dateId").text(ToJavaScriptDate(record[0].AlertAt));
						$("#assetId").text(record[0].SerialNumber);
						$("#preId").text(setPriority(record[0].AlertPriority));
						$("#codeId").text(record[0].Code);
						$("#nameId").text(record[0].Name);
						$("#ageId").text(getAgeFromMinutes(record[0].AlertAge));
						$("#statusChangedId").text(record[0].ClosedOn == null ? "" : ToJavaScriptDate(record[0].ClosedOn));
						$("#alertStatusId").text(getAlertStatus(record[0].StatusId));
						$("#alertId").text(record[0].AlertId);
						$("#addressId").text(record[0].Address);
						$("#emailId").text(record[0].LocationSalesRep);
						$("#phoneId").text(record[0].PrimaryPhone != "" ? record[0].PrimaryPhone : record[0].PrimaryMobile);
						//$("#contectInfoId").text("Email: " + record[0].PrimaryEmail + " Phone: " + (record[0].PrimaryPhone != "" ? record[0].PrimaryPhone : record[0].PrimaryMobile));
						hideProgressWholeWindow();
					}
					else {
						hideProgressWholeWindow();
					}
				}
				else {
					hideProgressWholeWindow();
				}
			});

			$("#goToDashboard").on('click', function () {
				RedirectToDashBoard();
			});
			function RedirectToDashBoard() {
				var dashboardURL;
				var vrURL = window.location.href;
				var codeDetails = window.codeDetail;
				var isQA = vrURL.indexOf("-qa");
				if (isQA == '-1') {
					dashboardURL = "http://dashboard.ebest-iot.com/default.html#outletDetails/" + codeDetails + "/";
				}
				else {
					dashboardURL = "https://dashboard-qa.ebest-iot.com/default.html#outletDetails/" + codeDetails + "/";

				}
				$('#goToDashboard').attr('href', dashboardURL);
			}

		});

	</script>

</head>
<body>
	<form id="form1">
		<div id="pagewrap">

			<header>
				<table class="table-one" row-padding="5">
					<thead>
						<tr>
							<th>
								<div class="title">Outlet Name</div>
							</th>
							<th>
								<div class="title">Outlet Code</div>
							</th>
							<th>
								<div class="title">Contact Info</div>
							</th>
							<th>
								<div class="title">Address</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td id="nameId" data-label="Outlet Name">Inigma INC</td>
							<td id="codeId" data-label="Outlet Code">20147</td>
							<td id="contectInfoId">Email:<label id="emailId"></label>
								<br />
								Phone:
								<label id="phoneId"></label>
							</td>
							<td id="addressId" data-label="Address">
								<p>
									43490,Yukon Drive,
								</p>
								<p>
									Suit 102,
								</p>
								<p>
									Ashburn,VA 20147
								</p>
							</td>
						</tr>
					</tbody>
				</table>
				<table class="table-one" row-padding="5">
					<thead>
						<tr>
							<th>
								<div class="title">Alert For Cooler#</div>
							</th>
							<th>
								<div class="title">Alert Type</div>
							</th>
							<th>
								<div class="title">Alert Text</div>
							</th>
							<th>
								<div class="title">Alert At</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td id="assetId" data-label="Alert For Cooler#">{|AssetSerial|}</td>
							<td id="typeId" data-label="Alert Type">{|AlertType|}</td>
							<td id="textId" data-label="Alert Text">{|AlertText|}</td>
							<td id="dateId" data-label="Alert At">{|AlertDate|}</td>
						</tr>
					</tbody>
				</table>
				<table class="table-one" row-padding="5">
					<thead>
						<tr>
							<th>
								<div class="title">Current Status</div>
							</th>
							<th>
								<div class="title">Priority</div>
							</th>
							<th>
								<div class="title">Age</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<div id="alertStatusId" class="white statusbtn">Complete</div>
							</td>
							<td>
								<div id="preId" class="white prioritybtn">High</div>
							</td>
							<td>
								<div id="ageId" class="white btn">1day</div>
							</td>
						</tr>
					</tbody>
				</table>
				<table class="table-one" row-padding="5">
					<thead>
						<tr>
							<th>
								<div class="title">Alert Status Change Time</div>
							</th>
							<th>
								<div class="title">Alert ID</div>
							</th>

						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<label id="statusChangedId">"dd/mm/yyyy"</label></td>
							<td>
								<label id="alertId">1 </label>
							</td>

						</tr>
					</tbody>
				</table>
			</header>
			<div id="sidebar" style="display: flex; align-items: center;">
				<div style="display: flex; width: 100%;">

					<div style="float: right; flex: 1;">
						<div>
						</div>
					</div>
				</div>
				<div class="white btn"><a href="#" id="goToDashboard">Go to Dashboards</a></div>
			</div>
	</form>
</body>
</html>
