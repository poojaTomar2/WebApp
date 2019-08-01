using DCPLFramework;
using System;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DFramework.Database;
using Insigma.Business;


public partial class SiteMaster : ExtJSHelper.MasterPageBase
{
	protected override void OnPreRender(EventArgs e)
	{
		base.OnPreRender(e);
		ITextControl usernameLabel = this.FindControl("lblUserName") as ITextControl;
		Image imgCompanyLogo = this.FindControl("imgCompanyLogo") as Image;
		if (usernameLabel != null && SecurityHelper.Identity.Tags.Count > 1) // to check client name is available of not
		{
			string clientName = SecurityHelper.Identity.Tags["ClientName"].ToString();
			if (!String.IsNullOrEmpty(clientName))
			{
				usernameLabel.Text = SecurityHelper.Identity.Name + "  (Client " + SecurityHelper.Identity.Tags["ClientName"].ToString() + ")";
			}
		}
		switchClient.Visible = SecurityHelper.ScopeId == 0;

		string defaultLogo = "~/images/toplogo.png";
		if (SecurityHelper.Identity.Id > 0)
		{
			if (SecurityHelper.ScopeId == 0)
			{
				imgCompanyLogo.ImageUrl = defaultLogo;
			}
			string clientPath = Path.Combine(DFramework.Utility.AppPath, "FileServer", "Client");
			Client client = new Client();
			client.Load(SecurityHelper.ScopeId);
			if (client.Id != 0)
			{
				string clientCode = client.ClientCode;
				clientPath = Path.Combine(clientPath, clientCode + ".png");
				if (File.Exists(clientPath))
				{
					imgCompanyLogo.ImageUrl = "~/FileServer/Client/" + clientCode + ".png";
				}
				else
				{
					imgCompanyLogo.ImageUrl = defaultLogo;
				}

			}
		}
	}
	protected override void OnInit(EventArgs e)
	{
		base.OnInit(e);

		DisableClientCaching();
	}

	private void DisableClientCaching()
	{
		// Do any of these result in META tags e.g. <META HTTP-EQUIV="Expire" CONTENT="-1">
		// HTTP Headers or both?

		// Does this only work for IE?
		Response.Cache.SetCacheability(HttpCacheability.NoCache);

		// Is this required for FireFox? Would be good to do this without magic strings.
		// Won't it overwrite the previous setting
		Response.Headers.Add("Cache-Control", "no-cache, no-store");

		// Why is it necessary to explicitly call SetExpires. Presume  is still better than calling
		// Response.Headers.Add( directly
		Response.Cache.SetExpires(DateTime.UtcNow.AddYears(-1));
	}

	protected override void btnLogout_Click(object sender, EventArgs e)
	{

		int userId = SecurityHelper.UserId;
		string userName = SecurityHelper.Identity.Name;
		string actionType = "Logout";
		string loginAction = "Success";
		DateTime loginAttempt = DateTime.UtcNow;
		string loginType = "Portal";
		string ip = Request.UserHostAddress;
		Query insertLogOutPortalRecord = new Query(@"INSERT INTO [dbo].[LoginActivity]
																			([UserName]
																			,[ActionType]
																			,[Action]
																			,[LoginAttempt]
																			,[LoginType]
																			,[IpAddress]
																			,[UserId])
																		VALUES
																			(@UserName
																			,@ActionType
																			,@Action
																			,@LoginAttempt
																			,@LoginType
																			,@IpAddress
																			,@UserId
																			)");
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("UserName", userName));
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("ActionType", actionType));
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("Action", loginAction));
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("LoginAttempt", loginAttempt));
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("LoginType", loginType));
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("IpAddress", ip));
		insertLogOutPortalRecord.Parameters.Add(new ParameterInfo("UserId", userId));
		insertLogOutPortalRecord.ExecuteNonQuery();
		base.btnLogout_Click(sender, e);
	}

	
	protected void Page_Load(object sender, EventArgs e)
	{
		

		string hostScheme = Request.Url.Scheme;

		if (true || !Request.IsLocal)
		{
			int gMapVersion = 3;
			var googleApiKey = ConfigurationManager.AppSettings["GoogleGeoLocationApiKey"];
			switch (gMapVersion)
			{
				case 2:
					litGMap.Text = string.Format("<script src='{0}://maps.alk.com/api/1.1/alkmaps.js' type='text/javascript'></script>", hostScheme);
					litGMap.Text += string.Format("<script src='{0}://maps.google.com/maps?file=api&amp;v=2&amp;key={1}' type='text/javascript'></script>", hostScheme, googleApiKey);
					litGMap.Text += string.Format("<script type='text/javascript' src='{0}'></script> ", ResolveUrl("~/inc/extJS-ux/ExtMapTypeControl.js"));
					break;
				case 3:
					litGMap.Text = string.Format("<script type='text/javascript' src='{0}://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=visualization&key={1}'></script> ", hostScheme, googleApiKey);
					break;
				case 4: //Mapstraction with GMap2
					litGMap.Text = string.Format("<script src='{0}://maps.google.com/maps?file=api&amp;v=2&amp;key={1}' type='text/javascript'></script>", hostScheme, googleApiKey); //To Load GMAP API
					litGMap.Text += string.Format("<script type='text/javascript' src='{0}'></script> ", ResolveUrl("~/inc/extJS-ux/mapstraction/mxn.google.geocoder.js"));
					litGMap.Text += string.Format("<script type='text/javascript' src='{0}?({1})'></script> ", ResolveUrl("~/inc/extJS-ux/mapstraction/mxn.js"), "google"); //To Load Mapstraction's Google v2 JS
					break;
			}
		}
	}
}
