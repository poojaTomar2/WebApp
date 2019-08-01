<%@ WebHandler Language="C#" Class="Thumbnail" %>
using System;
using System.Web;
using System.IO;
using System.Drawing;
using DCPLFramework;
using System.Configuration;

public class Thumbnail : IHttpHandler
{
	private const int ThumbnailWidth = 300;

	public void ProcessRequest(HttpContext context)
	{
		bool imagesToAzure = ConfigurationManager.AppSettings["ImagesToAzureBlob"] == "true";
		string imagePath = context.Request["imagePath"];
		bool ignoreSetHeight = Utility.ToBool(context.Request["ignoreSetHeight"], false); //ignoreSetHeight variable is used so that we will not resize the image
		bool isStockimages = Utility.ToBool(context.Request["isStockimages"], false); // using this so that load stock images based on the path mentioned in Web config
		byte[] buffer = null;

		var imagePathPhysical = isStockimages ? Path.Combine(ConfigurationManager.AppSettings["StockImagePath"], imagePath) : HttpContext.Current.Server.MapPath(imagePath);
		if (System.IO.File.Exists(imagePathPhysical))
		{
			buffer = CreateThumbnail(imagePathPhysical, ignoreSetHeight);
		}
		string[] arrImagePath = imagePath.Split('/');
		if (imagesToAzure && arrImagePath.Length != 0 && arrImagePath[1].ToLower() != "thumbnails")
		{

			string sDate = arrImagePath[1];
			if (sDate.Length >= 8)
			{
				int year = Utility.ToInt32(sDate.Substring(0, 4), 0);
				int month = Utility.ToInt32(sDate.Substring(4, 2), 0);
				int day = Utility.ToInt32(sDate.Substring(6, 2), 0);
				DateTime date = new DateTime(year, month, day);
				Insigma.Business.AzureHelper azureHelper = new Insigma.Business.AzureHelper("images"); //TODO: Change storage as images-201605
				MemoryStream ms = azureHelper.GetContentFromBlobStorage(arrImagePath[2], date, true);
				if (ms != null && ms.Length > 0)
				{
					buffer = CreateThumbnail(ms, ignoreSetHeight);
				}
				else
				{
					imagePath = HttpContext.Current.Server.MapPath("./images/imageNotFound.jpg");
					buffer = CreateThumbnail(imagePath, ignoreSetHeight);
				}
			}
		}

		context.Response.Clear();

		if(buffer != null && buffer.Length > 0)
		{
			context.Response.ContentType = "image/png";
			context.Response.BinaryWrite(buffer);
		}
		else 
		{
			imagePath = HttpContext.Current.Server.MapPath("./images/imageNotFound.jpg");
			buffer = CreateThumbnail(imagePath, ignoreSetHeight);
		}
		
		if(buffer != null && buffer.Length == 0)
		{
			context.Response.Write("File could not be loaded");
		}

		context.Response.End();
	}

	public bool IsReusable
	{
		get
		{
			return false;
		}
	}

	static Size GetThumbnailSize(Image original, bool ignoreSetHeight)
	{
		// Maximum size of any dimension.
		const int maxPixels = 120;

		// Width and height.
		int originalWidth = original.Width;
		int originalHeight = original.Height;

		// Compute best factor to scale entire image based on larger dimension.
		double factor = 1;
		//ignoreSetHeight variable is used so that we will not resize the image
		if (!ignoreSetHeight)
		{
			if (originalWidth > originalHeight)
			{
				factor = (double)maxPixels / originalWidth;
			}
			else
			{
				factor = (double)maxPixels / originalHeight;
			}
		}
		// Return thumbnail size.
		return new Size((int)(originalWidth * factor), (int)(originalHeight * factor));
	}

	public byte[] CreateThumbnail(string src, bool ignoreSetHeight)
	{
		byte[] buffer = null;

		// Load image.
		using (Image image = Image.FromFile(src))
		{
			// Compute thumbnail size.
			Size thumbnailSize = GetThumbnailSize(image, ignoreSetHeight);

			// Get thumbnail.
			Image thumbnail = image.GetThumbnailImage(thumbnailSize.Width,
				thumbnailSize.Height, null, IntPtr.Zero);

			// Save thumbnail.
			using (MemoryStream ms = new MemoryStream())
			{
				thumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
				buffer = ms.ToArray();
			}

			return buffer;
		}
	}

	public byte[] CreateThumbnail(Stream src, bool ignoreSetHeight)
	{
		byte[] buffer = null;

		// Load image.
		using (Image image = Image.FromStream(src))
		{
			// Compute thumbnail size.
			Size thumbnailSize = GetThumbnailSize(image, ignoreSetHeight);

			// Get thumbnail.
			Image thumbnail = image.GetThumbnailImage(thumbnailSize.Width,
				thumbnailSize.Height, null, IntPtr.Zero);

			// Save thumbnail.
			using (MemoryStream ms = new MemoryStream())
			{
				thumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
				buffer = ms.ToArray();
			}

			return buffer;
		}
	}
}