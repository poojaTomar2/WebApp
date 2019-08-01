<%@ WebHandler Language="C#" Class="Download" %>

using System;
using System.Web;
using System.IO;
using System.Drawing;
using DCPLFramework;
using System.Configuration;
using ICSharpCode.SharpZipLib.Zip;

public class Download : IHttpHandler
{
	public void ProcessRequest(HttpContext context)
	{
		string fileName = context.Request["u"];
		if (!string.IsNullOrEmpty(fileName))
		{
			Insigma.Business.AzureHelper azureHelper = new Insigma.Business.AzureHelper("sessionzip");
			Microsoft.WindowsAzure.Storage.CloudStorageAccount storageAccount = azureHelper.GetCloudStorageAccount();
			Microsoft.WindowsAzure.Storage.Blob.CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
			Microsoft.WindowsAzure.Storage.Blob.CloudBlobContainer sourceContainer = cloudBlobClient.GetContainerReference("sessionzip");

			var blob = sourceContainer.GetBlockBlobReference(fileName + ".zip");

			if (blob.Exists())
			{
				blob.DownloadToStream(context.Response.OutputStream);

				context.Response.BufferOutput = false;
				context.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName + ".zip");
				context.Response.ContentType = "application/octet-stream";
				context.Response.Flush();
				context.Response.End();
			}
			else
			{
				context.Response.Write("File not found.");
			}

		}
		else
		{
			context.Response.Write("Invalid parameters or syntax .");
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