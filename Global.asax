<%@ Application Language="C#" %>
<%@ Import Namespace="ExtJSHelper.Scheduler" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="SendGrid" %>
<%@ Import Namespace="System.Net.Mail" %>
<%@ Import Namespace="Insigma.Business" %>
<script RunAt="server">

	void Application_Start(object sender, EventArgs e)
	{
		// Subscription to events for sending notification and helping notification parsing
		DCPLFramework.LicenseInfo.ApplicationName = "STERIS.RealView";
		DFramework.Configuration.Database.QueryAdapters.Add("System.Data.SqlClient", new DFramework.Database.Adapters.Sql2012());

		var routes = System.Web.Routing.RouteTable.Routes;

		Cooler.Notifications.Notification.Subscribe();
		DCPLFramework.Notification.Providers.Twilio.Subscribe();
		DCPLFramework.Notification.Providers.AzureMobileNotification.Subscribe(); //Uncomment after framework changes commit
		DCPLFramework.Business.Notification.BeforeSend += Notification_BeforeSend;
		ExtJSHelper.Router.RouterConfig.Instance.AddDefaultControllers();

		ExtJSHelper.Router.RouterFactory.AddRoutes(routes);
		var extRouterFactory = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "mobileApi" }; });
		var extRouterFactoryV2 = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "mobileApiV2" }; });
		var extRouterConsumerApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "consumerApi" }; });
		var extRouterConsumerApiV2 = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "consumerApiV2" }; });
		var extRouterImportApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "syncData" }; });
		var extRouterShakeInfoAPI = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "shakeInfoAPI" }; });
		var extRouterMediaApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "mediaApi" }; });
		var extRouterHubRegistrationaApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "productionToolDeviceRegistration" }; });
		var extRouterExportApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "iFSA" }; });
		var extRouterSESImage = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "SESImage" }; });
		var extRouterIRApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "iRApi" }; });
		//Added by Ankit
		var extRouterSmartDeviceApi = new ExtJSHelper.Router.RouterFactory(delegate () { return new ExtJSHelper.ExtRouter(ExtJSHelper.Router.RouterConfig.Instance) { ControllerName = "SmartDeviceTransaction" }; });


		routes.Add("atosMobile", new System.Web.Routing.Route("controllers/mobile/{baseType}/{mainType}", extRouterFactory));
		routes.Add("atosMobileV2", new System.Web.Routing.Route("controllers/mobileV2/{baseType}/{mainType}", extRouterFactoryV2));
		routes.Add("atosMobile2", new System.Web.Routing.Route("chbc/mobile/{baseType}/{mainType}", extRouterFactory));
		routes.Add("consumerApi", new System.Web.Routing.Route("controllers/consumer/{baseType}/{mainType}", extRouterConsumerApi));
		routes.Add("consumerApiV2", new System.Web.Routing.Route("controllers/consumerV2/{baseType}/{mainType}", extRouterConsumerApiV2));
		routes.Add("syncData", new System.Web.Routing.Route("controllers/syncData/{baseType}/{mainType}", extRouterImportApi));
		routes.Add("shakeInfoAPI", new System.Web.Routing.Route("controllers/shakeInfo/{baseType}/{mainType}", extRouterShakeInfoAPI));
		routes.Add("mediaApi", new System.Web.Routing.Route("controllers/media/{baseType}/{mainType}", extRouterMediaApi));
		routes.Add("productionToolDeviceRegistration", new System.Web.Routing.Route("controllers/productionToolDeviceRegistration/{baseType}/{mainType}", extRouterHubRegistrationaApi));
		routes.Add("iFSA", new System.Web.Routing.Route("controllers/iFSA/{baseType}/{mainType}", extRouterExportApi));
		routes.Add("SESApi", new System.Web.Routing.Route("controllers/SESImage/{baseType}/{mainType}", extRouterSESImage));
		routes.Add("iRApi", new System.Web.Routing.Route("controllers/iRApi/{baseType}/{mainType}", extRouterIRApi));
		//Added by Ankit
		routes.Add("SmartDeviceTransaction", new System.Web.Routing.Route("controllers/SmartDeviceTransaction/{baseType}/{mainType}", extRouterSmartDeviceApi));

		DFramework.Database.Query.QueryLimit = 1000;
		DFramework.Database.Query.Timeout = 120;
		DFramework.Database.Query.SchedulerQueryTimeout = 3600;
		string[] autoRunMachines = { "All" };
		string[] autoRunPaths = { "All" };
		//Manager.Add(new Cooler.Tasks.ProcessSession() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process to latest session." }, new TimeSpan(0, 20, 00));//  currently running in Every 20min.
		//Manager.Add(new SendMails() { AppPaths = autoRunPaths, MachineNames = autoRunMachines }, new TimeSpan(50, 0, 10));
		//Manager.Add(new Cooler.Tasks.SendMailOfSmartDeviceInfo() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Send mail of associated devices by Frigoglass" }, new TimeSpan(0, 15, 0));
		//Manager.Add(new Cooler.Tasks.ExportEventDataToBlob() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Export Event Data To Blob" }, new TimeSpan(0, 0, 10));
		//Manager.Add(new Cooler.Tasks.ProcessImageCapture() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Incoming Images" }, new TimeSpan(0, 0, 10));
		//Manager.Add(new ExtJSHelper.Scheduler.QueueAutomatedNotifications() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Queue Automated Notifications" }, new TimeSpan(0, 0, 10));
		//Manager.Add(new Cooler.Tasks.CoolerUnassignUnprocessedImages() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Cooler Unassign Unprocessed Images" }, new TimeSpan(0, 0, 10));
		//Manager.Add(new Cooler.Tasks.UpdateLocationLatLong() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Update Location Nearest Latitude / Longitude" }, new TimeSpan(0, 5, 0)); //currently running in 5 Mins
		//Manager.Add(new Cooler.Tasks.ProcessAlertData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Alert Record" }, new TimeSpan(0, 5, 0));//  currently running in 5 Mins
		//Manager.Add(new Cooler.Tasks.SendAlertPushNotification() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Send Alert Push Notification" }, new TimeSpan(0, 15, 0));//  currently running in 15 Mins
		//Manager.Add(new Cooler.Tasks.ProcessAlertDataElastic() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Alert Elastic Record" }, new TimeSpan(0, 30, 0));//  currently running in 30 Mins
		//Manager.Add(new Cooler.Tasks.SendAlertNotification() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Email AlertNotification" }, new TimeSpan(0, 5, 0));//  currently running in 5 Mins
		//Manager.Add(new Cooler.Tasks.PopulateCellLocationInfo() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Update Cell Tower Info" }, new TimeSpan(0, 1, 0));
		//Manager.Add(new Cooler.Tasks.PopulateSmartDeviceCellLocation() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Update Cell Cordinates Info" }, new TimeSpan(0, 1, 0));
		//Manager.Add(new Cooler.Tasks.SendAccumulatedMovement() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Send Accumulated Movement" }, new TimeSpan(0, 30, 0));
		//Manager.Add(new Cooler.Tasks.PopulateCellLocationInfoByGoogle() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Update Cell Tower Info From Google" }, new TimeSpan(0, 1, 0));
		//Manager.Add(new Cooler.Tasks.AlertSummaryMail() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Alert Summary Mail" }, new TimeSpan(8, 0, 0));
		//Insigma.Business.AssetPurity.Saved += Cooler.Integration.Notify.AfterImageSave;
		//Manager.Add(new Insigma.Business.Elastic.Indexer() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Elastic Indexer" }, new TimeSpan(0, 2, 0));
		//Manager.Add(new Cooler.Tasks.ProcessSmartDeviceAdvertiseEventData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process SmartDevice Advertise Event Data" }, new TimeSpan(0, 15, 0));
		//Manager.Add(new Cooler.Tasks.ProcessSmartDeviceAdvertiseAlarmData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process SmartDevice Advertise Alram Data" }, new TimeSpan(1, 0, 0));
		//Manager.Add(new Cooler.Tasks.ProcessSmartDeviceAdvertiseBitEventData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process SmartDevice Advertise Bit Event Data" }, new TimeSpan(0, 5, 0));
		//Manager.Add(new Cooler.Tasks.ProcessRecordsForDataFactory() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Records For Data Factory" }, new TimeSpan(8, 0, 0));
		//Manager.Add(new Cooler.Tasks.UpdateDeviceIoTHub() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Update Device IoT Hub" }, new TimeSpan(0, 15, 0));//  currently running in 15 Mins
		//Manager.Add(new Cooler.Tasks.AssetEventDataSummary() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Asset Event Data Summary Task" }, new TimeSpan(0, 3, 0));//  currently running in 3 Mins
		//Manager.Add(new Cooler.Tasks.ProcessRetailerAssetParamterPoints() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Retailer AssetParamter Points" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.PushSmartDeviceData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Push SmartDevice Data for Orchextra" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.PurgeSqlData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Purge Sql Data" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.PorcessProximityPowerEvent { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Proximity Power Event" }, new TimeSpan(0, 10, 0));
		//Manager.Add(new Cooler.Tasks.ProcessMasterData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Master Data" }, new TimeSpan(0, 1, 0));
		//Manager.Add(new Cooler.Tasks.TriggerDataMaintenance() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Trigger Data Maintenance" }, new TimeSpan(0, 10, 0));
		//Manager.Add(new Cooler.Tasks.ProcessAssetEventDataSummaryData() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Asset Event Data Summary Data" }, new TimeSpan(0, 15, 0));
		//Manager.Add(new Cooler.Tasks.ProcessUploadedFile() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process Uploaded File" }, new TimeSpan(0, 2, 0));
		//Manager.Add(new Cooler.Tasks.ProcessAddOutletToDefaultPromotion() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Add Outlet To Default Promotion" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.PushEquipmentData_CCEP() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Push Equipment Data For CCEP" }, new TimeSpan(0, 12, 0));
		//Manager.Add(new Cooler.Tasks.ProcessCloseAlertWithoutLocation_CCEP() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process To Close the Alert For CCEP" }, new TimeSpan(6, 0, 0));//  currently running in Every 6 Hrs.
		//Manager.Add(new Cooler.Tasks.ProcessLatestEventRecord() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Process To Latest Event Record" }, new TimeSpan(6, 0, 0));//  currently running in Every 6 Hrs.
		//Manager.Add(new Cooler.Tasks.ExportLoggingActivityForAdmin() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Export Logging Activity For Admin" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.ExportLoginActivity() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Export Login / Logout Activity" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.DeleteExportLoggingActivity() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Delete Export Logging Activity" }, new TimeSpan(24, 0, 0));
		//Manager.Add(new Cooler.Tasks.PushDataSmartRewardUser() { AppPaths = autoRunMachines, MachineNames = autoRunMachines, Name = "Push Data IR Reward User" }, new TimeSpan(0, 12, 0));
		Insigma.Business.Asset.Saved += Cooler.AlertHelper.afterAssetSave;
		DCPLFramework.DCPLPrincipal.AfterLogin += new DCPLFramework.DCPLPrincipal.AfterLoginEventHandler(DCPLPrincipal_AfterLogin);
		//Cooler.Controllers.DataUpload2.DataReceived += Cooler.Integration.ControllerDataStreamer.DataReceived;
		//Cooler.Controllers.DataUpload2.CellDataReceived += Cooler.Integration.ControllerDataStreamer.CellDataReceived;
		//Cooler.Tasks.PopulateCellLocationInfo.CellIdToGps += Cooler.Integration.ControllerDataStreamer.CellIdToGpsReceived;

	}

	void DCPLPrincipal_AfterLogin(object sender, EventArgs e)
	{
		var appUser = new Insigma.Business.AppUser();
		appUser.Load(DCPLFramework.SecurityHelper.UserId);
		if (appUser.Id > 0)
		{

			appUser.UpdateLastLogin();
		}
	}

	protected void Application_Error(object sender, EventArgs e)
	{
		//Server.ClearError();
		//Response.Clear();
		//Response.Redirect("~/ErrorPage.aspx");
		//Response.End();
	}

	protected void Application_PreSendRequestHeaders(object sender, EventArgs e)
	{
		HttpApplication app = sender as HttpApplication;
		if (app != null && app.Context != null)
		{
			var headers = app.Context.Response.Headers;
			headers.Remove("Server");
			headers.Remove("Cache-Control");
			Response.Headers.Remove("X-AspNet-Version");
		}
	}

	protected void Application_BeginRequest(Object sender, EventArgs e)
	{
		//Response.Redirect("https://portal-qa.ebest-iot.com/Controllers/mobilev2/info/asset"); 
		if (!Request.IsSecureConnection && !Request.IsLocal)
		{
			string path = string.Format("https{0}", Request.Url.AbsoluteUri.Substring(4));
			if (path.ToLower().IndexOf("login.aspx") > -1 || path.ToLower().IndexOf("default.aspx") > -1)
			{
				Response.Redirect(path);
			}
		}
	}

	protected void Application_AcquireRequestState(object sender, EventArgs e)
	{
		if (DCPLFramework.Utility.AppUrl == null)
		{
			string newUrl = HttpContext.Current.Request.Url.AbsoluteUri;
			Uri newUrlUri = new Uri(newUrl);
			if (newUrl.IndexOf("www") > -1)
			{
				//Folder based URL
				newUrl = GetParentUriString(newUrlUri); //www.test.cooleriot.com/
			}
			else
			{
				//sub domain based
				newUrl = newUrlUri.Host;
			}
			DCPLFramework.Utility.AppUrl = newUrl;
		}
	}
	protected string GetParentUriString(Uri uri)
	{
		StringBuilder parentName = new StringBuilder();

		// Append the scheme: http, ftp etc.
		parentName.Append(uri.Scheme);

		// Appned the '://' after the http, ftp etc.
		parentName.Append("://");

		// Append the host name www.foo.com
		parentName.Append(uri.Host);

		// Append each segment except the last one. The last one is the
		// leaf and we will ignore it.
		for (int i = 0; i < uri.Segments.Length - 1; i++)
		{
			parentName.Append(uri.Segments[i]);
		}
		return parentName.ToString();
	}

	void Notification_BeforeSend(object sender, DCPLFramework.Business.NotificationEventArgs e)
	{
		if (e.Sent)
		{
			return;
		}
		if (e.Notification.TemplateId != (int)EmailTemplate.IRAccountVerificationTemplate && e.Notification.TemplateId != (int)EmailTemplate.OrderDetailTemplate && e.Notification.TemplateId != (int)EmailTemplate.ForgotPasswordTemplate)
		{

			try
			{
				SendGridMessage myMessage = new SendGridMessage();
				MailMessage mailMessage = e.Notification.Message;
				string fromEmail = ConfigurationManager.AppSettings["SendGridFromEmail"];
				// Create credentials, specifying your user name and password.
				var credentials = new NetworkCredential(ConfigurationManager.AppSettings["SendGridUsername"], ConfigurationManager.AppSettings["SendGridPassword"]);

				//Write the code for handling SendGridEmail
				//Ref: https://github.com/sendgrid/sendgrid-csharp							

				//Adding recipients
				int recipientIndex = 0;
				foreach (DCPLFramework.Business.NotificationRecipient recipient in e.Notification.Recipients)
				{
					if (recipient.IsEmail)
					{
						if (recipientIndex == 0)
						{
							myMessage.AddTo(recipient.Address.Address);
						}
						else
						{
							myMessage.AddCc(recipient.Address.Address);
						}
						recipientIndex++;
					}
				}

				if (recipientIndex > 0)
				{
					foreach (MailAddress ma in e.Notification.Message.CC)
					{
						myMessage.AddCc(ma);
					}

					foreach (MailAddress ma in e.Notification.Message.Bcc)
					{
						myMessage.AddBcc(ma);
					}

					//Adding attachments
					foreach (Attachment attachment in e.Notification.Attachments)
					{
						myMessage.AddAttachment(attachment.ContentStream, attachment.Name);
					}
					// In case of production if t1 email to be sent then use emailId's in alternate mode : #3631
					myMessage.From = new MailAddress(fromEmail, mailMessage.From.DisplayName);
					myMessage.Subject = mailMessage.Subject;
					myMessage.Html = mailMessage.Body;

					myMessage.EnableOpenTracking();

					SmtpClient smtp = new SmtpClient();

					smtp.Host = ConfigurationManager.AppSettings["SendGridHost"];

					// Create an Web transport for sending email.
					var transportWeb = new Web(credentials);


					// Send the email.
					transportWeb.Deliver(myMessage);

					//transportWeb.DeliverAsync(myMessage);

					e.Handled = true; //To avoid re-sending email from Framework
					e.Sent = true;
				}
			}
			catch
			{
				e.Handled = false;
				e.Sent = false;
			}
		}
	}
	public enum EmailTemplate
	{
		IRAccountVerificationTemplate = 39,
		OrderDetailTemplate = 40,
		ForgotPasswordTemplate = 41,
	}
</script>

