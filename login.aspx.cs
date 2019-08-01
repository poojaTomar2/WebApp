using ExtJSHelper;
using System;
using System.Web;
using Cooler;

public partial class login : CoolerLoginBase
{
	protected override void Page_Load(object sender, System.EventArgs e)
	{
		if (!IsPostBack)
		{

			if (Request.Url.Host == "cch-portal.ebest-iot.com")
			{
				Response.Redirect("https://sso.cchellenic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https://cch-portal.ebest-iot.com/GetSSOClaim.aspx");
			}
			else if (Request.Url.Host == "cch-portal-qa.ebest-iot.com")
			{
				Response.Redirect("https://sso.cchellenic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https://cch-portal-qa.ebest-iot.com/GetSSOClaim.aspx");

			}
			else if (Request.Url.Host == "cch-portal-dev.ebest-iot.com")
			{
				Response.Redirect("https://sso.cchellenic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https%3a%2f%2febestsso.accesscontrol.windows.net%2f&wreply=https%3a%2f%2febestsso.accesscontrol.windows.net%2fv2%2fwsfederation&wctx=cHI9d3NmZWRlcmF0aW9uJnJtPWh0dHAlM2ElMmYlMmZjY2gtcG9ydGFsLWRldi5lYmVzdC1pb3QuY29tJTJmaW5kZXguYXNweCZyeT1odHRwJTNhJTJmJTJmY2NoLXBvcnRhbC1kZXYuZWJlc3QtaW90LmNvbSUyZkdldFNTT0NsYWltLmFzcHg1");
			}


			// Clear scope cookie if present
			HttpCookie cookie = new HttpCookie("ScopeId");
			cookie.Expires = DateTime.Now.AddDays(-1);
			Response.Cookies.Add(cookie);
		}
		base.Page_Load(sender, e);
	}
}
