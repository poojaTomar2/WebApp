using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using QRCoder;
using System.IO;
using System.Drawing;
using System.Web.UI.HtmlControls;

public partial class EddystoneUrl : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		if (Request.QueryString.Count > 0)
		{
			string title = Request.QueryString["title"] ?? "";
			string sn = Request.QueryString["sn"] ?? "";
			string pId = Request.QueryString["pId"] ?? "";
			string lId = Request.QueryString["lId"] ?? "";
			if (pId.Length > 0)
			{
				Page.Title = title;
				Page.MetaDescription = title;
				promotionImage.ImageUrl = "FileServer/EddystonePromotion/" + pId + ".png";
			}
			if (pId.Length > 0 && lId.Length > 0)
			{
				QRCodeGenerator qrGenerator = new QRCodeGenerator();
				var text = lId + "-" + pId + "-" + Guid.NewGuid().ToString().Replace("-", "");
				QRCodeData qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
				QRCode qrCode = new QRCode(qrCodeData);
				Bitmap qrCodeImage = qrCode.GetGraphic(20);
				System.Web.UI.WebControls.Image imgBarCode = new System.Web.UI.WebControls.Image();
				imgBarCode.Height = 180;
				imgBarCode.Width = 180;
				imgBarCode.CssClass = "image2";
				using (Bitmap bitMap = qrCode.GetGraphic(20))
				{
					using (MemoryStream ms = new MemoryStream())
					{
						bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
						byte[] byteImage = ms.ToArray();
						imgBarCode.ImageUrl = "data:image/png;base64," + Convert.ToBase64String(byteImage);
					}
					plBarCode.Controls.Add(imgBarCode);
				}
			}
		}
	}
}