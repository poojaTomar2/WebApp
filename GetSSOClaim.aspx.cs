using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using DCPLFramework;
using System.Web.Security;
using System.Xml.Linq;
using ExtJSHelper;
using System.IO;
using DFramework.Database.Expressions;
using DFramework.Database;
public partial class GetSSOClaim : Page
{

	private static void SetDefaultTimeZone(DCPLIdentity identity)
	{
		if (identity.TimeZone == null && HttpContext.Current != null)
		{
			HttpCookie timeZoneCookie = HttpContext.Current.Request.Cookies["TimeZone"];
			if (timeZoneCookie != null)
			{
				identity.TimeZone = TimeZones.GetTimeZone(timeZoneCookie.Value);
			}
			if (identity.TimeZone == null)
			{
				identity.TimeZone = TimeZoneInfo.Local;
			}
		}
	}

	public static int SetAuthCookie(HttpResponse responseBase, string name, bool rememberMe)
	{
		/// In order to pickup the settings from config, we create a default cookie and use its values to create a 
		/// new one.
		var cookie = FormsAuthentication.GetAuthCookie(name, rememberMe);
		var ticket = FormsAuthentication.Decrypt(cookie.Value);

		var newTicket = new FormsAuthenticationTicket(ticket.Version, ticket.Name, ticket.IssueDate, ticket.Expiration,
			ticket.IsPersistent, "", ticket.CookiePath);
		var encTicket = FormsAuthentication.Encrypt(newTicket);

		/// Use existing cookie. Could create new one but would have to copy settings over...
		cookie.Value = encTicket;

		responseBase.Cookies.Add(cookie);

		return encTicket.Length;
	}

	protected void Page_Load(object sender, EventArgs e)
	{

		var claimValue = "";


		var wresult = Request["wresult"];
		if (!string.IsNullOrEmpty(wresult))
		{
			XmlDocument xDoc = new XmlDocument();
			xDoc.LoadXml(wresult);
			var manager = new XmlNamespaceManager(new NameTable());
			manager.AddNamespace("saml", "urn:oasis:names:tc:SAML:1.0:assertion");
			manager.AddNamespace("t", "http://schemas.xmlsoap.org/ws/2005/02/trust"); // default namespace
			XmlNodeList list = xDoc.SelectNodes("/t:RequestSecurityTokenResponse/t:RequestedSecurityToken/saml:Assertion/saml:AttributeStatement/saml:Attribute[@AttributeName='windowsaccountname']", manager);

			claimValue = list[0].LastChild.InnerText;
			if (claimValue.Contains(@"\"))
			{
				claimValue = claimValue.Split(new string[] { "\\" }, StringSplitOptions.None)[1];
			}


			if (!string.IsNullOrEmpty(claimValue))
			{
				int userId = 0;
				string userName = string.Empty;
				string actionType = string.Empty;
				string loginAction = string.Empty;
				DateTime loginAttempt;
				string loginType;
				string ip;
				if (DCPLPrincipal.LogOn(claimValue))
				{
					IPrincipal principal = null;

					principal = Csla.ApplicationContext.User;
					DCPLIdentity identity = SecurityHelper.Identity;
					SetDefaultTimeZone(identity);
					if (principal == null)
					{
						/*Save Data For Logout*/

						userId = SecurityHelper.UserId;
						userName = SecurityHelper.Identity.Name;
						actionType = "Logout";
						loginAction = "Success";
						loginAttempt = DateTime.UtcNow;
						loginType = "Portal";
						ip = Request.UserHostAddress;
						SaveLoginLogoutActivity(userId, userName, actionType, loginAction, loginAttempt, loginType, ip);
						principal = DCPLPrincipal.LogOff();

					}
					HttpContext.Current.User = principal;
					/*Save Data For Login*/
					userName = claimValue;
					userId = 0;
					actionType = "Login";
					loginAction = "Success";
					loginAttempt = DateTime.UtcNow;
					loginType = "Portal";
					ip = string.IsNullOrEmpty(Request.UserHostAddress) ? "None" : Request.UserHostAddress;
					if (!string.IsNullOrEmpty(userName) && principal != null)
					{
						Query queryForGetUserId = new Query(@"SELECT [UserId] FROM [dbo].[Security_User] WITH (NOLOCK)");
						queryForGetUserId.Where.And(new Expression("IsDeleted", CompareOperator.Equals, 0));
						queryForGetUserId.Where.And(new Expression("UserName", CompareOperator.Equals, userName));
						using (var drForGetUserId = queryForGetUserId.ExecuteReader())
						{
							if (drForGetUserId.Read())
							{
								userId = drForGetUserId.GetInt32("UserId");
							}
						}
						SaveLoginLogoutActivity(userId, userName, actionType, loginAction, loginAttempt, loginType, ip);
					}

					if (HttpContext.Current != null && HttpContext.Current.Session != null)
					{
						HttpContext.Current.Session["CslaPrincipal"] = Csla.ApplicationContext.User;
					}

					var persistentCookie = false;
					if (HttpContext.Current != null && HttpContext.Current.Response != null)
					{

						SetAuthCookie(HttpContext.Current.Response, claimValue, persistentCookie);

					}
					if (identity.TimeZone == null)
					{
						if (HttpContext.Current != null)
						{
							string timeZone = HttpContext.Current.Request["timeZone"];
							if (timeZone != null)
							{
								HttpContext.Current.Response.Cookies.Add(new HttpCookie("timezone", timeZone));
							}

							SetDefaultTimeZone(identity);
						}
					}
					if (HttpContext.Current != null && HttpContext.Current.Session != null)
					{
						HttpContext.Current.Session["CslaPrincipal"] = Csla.ApplicationContext.User;
					}

					Response.Redirect("Default.aspx", true);
				}
				else
				{
					Response.Write("User : <b>" + claimValue + "</b>" + " is not sync with eBest IOT database. Please contact with system adminstartor.");
					/*Save Data For LoginFailed*/
					userName = claimValue;
					userId = 0;
					actionType = "Login";
					loginAction = "LoginFailed";
					loginAttempt = DateTime.UtcNow;
					loginType = "Portal";
					ip = string.IsNullOrEmpty(Request.UserHostAddress) ? "None" : Request.UserHostAddress;
					Query queryForGetUserId = new Query(@"SELECT [UserId] FROM [dbo].[Security_User] WITH (NOLOCK)");
					queryForGetUserId.Where.And(new Expression("IsDeleted", CompareOperator.Equals, 0));
					queryForGetUserId.Where.And(new Expression("UserName", CompareOperator.Equals, userName));
					using (var drForGetUserId = queryForGetUserId.ExecuteReader())
					{
						if (drForGetUserId.Read())
						{
							userId = drForGetUserId.GetInt32("UserId");
						}
					}
					SaveLoginLogoutActivity(userId, userName, actionType, loginAction, loginAttempt, loginType, ip);



				}
			}

		}
	}

	public void SaveLoginLogoutActivity(int userId, string userName, string actionType, string loginAction, DateTime loginAttempt, string loginType, string ip)
	{
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
	}
}