<%@ WebHandler Language="C#" Class="AssetPurityGenericHandler" %>

using System;
using System.Web;
using DCPLFramework;

public class AssetPurityGenericHandler : IHttpHandler
{

	public void ProcessRequest(HttpContext context)
	{
		int statusId = Utility.ToInt32((context.Request["StatusId"]), 0);
		int assetPurityId = Utility.ToInt32((context.Request["Id"]), 0);
		int imageUpoadedRetailerId = Utility.ToInt32((context.Request["ImageUpoadedRetailerId"]), 0);
		int purityPercentage = Utility.ToInt32((context.Request["PurityPercentage"]), 0);
		int assetId = Utility.ToInt32((context.Request["AssetId"]), 0);
		DateTime? verifiedOn = Utility.ToDateTime((context.Request["VerifiedOn"]), DateTime.Now);
		DateTime purityDateTime = Utility.ToDateTime((context.Request["PurityDateTime"]), DateTime.Now);
		bool hasChanged = Utility.ToBool(context.Request["HasChanged"], false);
		Insigma.Business.AssetPurityHandler.ProcessRequest(statusId, assetPurityId, imageUpoadedRetailerId, purityPercentage, assetId, verifiedOn, purityDateTime, hasChanged);
	}

	public bool IsReusable
	{
		get
		{
			return false;
		}
	}

}