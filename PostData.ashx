<%@ WebHandler Language="C#" Class="PostData" %>

using System;
using System.Web;

public class PostData : IHttpHandler
{

	public void ProcessRequest(HttpContext context)
	{
		if (HttpContext.Current.Request.HttpMethod == "POST")
		{
			var save = new SaveData();
			save.SaveDeviceData(context.Request.InputStream);
			if (save.SmartDeviceTypeId == 34)
			{
				context.Response.ContentType = "text/plain";
				context.Response.Write("FF" + DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
				return;
			}
				context.Response.ContentType = "text/plain";
				context.Response.Write("#FF" + DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm:ss"));
		}

	}

	public bool IsReusable
	{
		get
		{
			return false;
		}
	}

}