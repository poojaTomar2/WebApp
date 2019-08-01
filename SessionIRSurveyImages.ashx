<%@ WebHandler Language="C#" Class="SessionIRSurveyImages" %>

using System;
using System.Web;
using System.Configuration;
using System.IO;

public class SessionIRSurveyImages : IHttpHandler
{

	public void ProcessRequest(HttpContext context)
	{
		context.Response.ContentType = "text/plain";
		string imageName = context.Request["in"];
		bool imagesToAzure = ConfigurationManager.AppSettings["ImagesToAzureBlob"] == "true";
		byte[] sessionImageBuffer = null;
		if (!string.IsNullOrEmpty(imageName) && imagesToAzure)
		{
			Insigma.Business.AzureHelper azureHelper = new Insigma.Business.AzureHelper("images");
			using (MemoryStream ms = azureHelper.GetContentFromBlobStorage("images", imageName))
			{
				sessionImageBuffer = ms.ToArray();
			}

		}

		context.Response.ContentType = "image/png";
		context.Response.BinaryWrite(sessionImageBuffer);
	}

	public bool IsReusable
	{
		get
		{
			return false;
		}
	}

}