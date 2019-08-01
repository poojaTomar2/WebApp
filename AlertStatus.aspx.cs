using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using DFramework.Database;
using System.Data;
using Newtonsoft.Json;
using Cooler;

public partial class AlertStatus : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

	}

	[WebMethod(EnableSession = true)]
	[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
	public static object GetRecordOfAlert(string alertId)
	{
		if(!string.IsNullOrEmpty(alertId))
		{
			try
			{
				int alert_Id = Convert.ToInt32(Encrypt.Decrypt(alertId));
				if(alert_Id > 0)
				{
					string alertRecordQuery = @"SELECT AL.AlertId, AT.AlertType, AL.AlertText, AL.CreatedOn AS AlertAt, AL.StatusId,
									AL.PriorityId, LKAP.DisplayValue AS AlertPriority, AL.AlertAge, AL.ClosedOn, A.SerialNumber, L.Name,
									L.Code, L.LocationSalesRep, L.PrimaryPhone, L.PrimaryMobile,
									CASE WHEN LEN(L.Street2) > 0 THEN CAST(L.Street  + ', ' +  L.Street2 + ', '  + L.City + ', ' + C.Country AS Nvarchar(max))
									ELSE CAST(L.Street + ', ' + L.City + ', '+  C.Country  AS Nvarchar(max)) END  AS Address
									FROM dbo.Alert AL LEFT OUTER JOIN 
									dbo.AlertType AT ON AL.AlertTypeId = AT.AlertTypeId LEFT OUTER JOIN
									dbo.Lookup LKAP ON AL.PriorityId = LKAP.LookupId LEFT OUTER JOIN
									dbo.Asset A ON AL.AssetId = A.AssetId LEFT OUTER JOIN 
									dbo.Location L ON AL.LocationId = L.LocationId LEFT OUTER JOIN 
									dbo.Country C ON L.CountryId = C.CountryId
									WHERE AlertId= @AlertId";
					Query query = new Query(alertRecordQuery);
					query.AddParameter(new ParameterInfo("AlertId", alert_Id));
					DataTable dt = query.ExecuteDataTable();
					List<AlertDetail> alertDetails = dt.AsEnumerable().Select(row => new AlertDetail
					{
						AlertId = row.Field<int>("AlertId"),
						AlertText = row.Field<string>("AlertText"),
						AlertAt = row.Field<DateTime>("AlertAt"),
						AlertType = row.Field<string>("AlertType"),
						StatusId = row.Field<int>("StatusId"),
						AlertPriority = row.Field<string>("AlertPriority"),
						AlertAge = row.Field<int?>("AlertAge"),
						ClosedOn = row.Field<DateTime?>("ClosedOn"),
						SerialNumber = row.Field<string>("SerialNumber"),
						Name = row.Field<string>("Name"),
						Code = row.Field<string>("Code"),
						LocationSalesRep = row.Field<string>("LocationSalesRep"),
						PrimaryPhone = row.Field<string>("PrimaryPhone"),
						PrimaryMobile = row.Field<string>("PrimaryMobile"),
						Address = row.Field<string>("Address")
					}).ToList();

					return alertDetails;
				}
				else
				{
					return null;
				}
				
			}
			catch(Exception)
			{	
				HttpContext.Current.Response.Clear();
				HttpContext.Current.Response.StatusCode = 500;
				return JsonConvert.SerializeObject("UnExpected Exception");
			}
		}
		else
		{
			return null;
		}
		
	}
}
public class AlertDetail
{
	public int AlertId { get; set; }
	public string AlertType { get; set; }
	public string AlertText { get; set; }
	public DateTime AlertAt { get; set; }
	public int StatusId { get; set; }
	public string AlertPriority { get; set; }
	public int? AlertAge { get; set; }
	public DateTime? ClosedOn { get; set; }
	public string SerialNumber { get; set; }
	public string Name { get; set; }
	public string Code { get; set; }
	public string LocationSalesRep { get; set; }
	public string PrimaryPhone { get; set; }
	public string PrimaryMobile { get; set; }
	public string Address { get; set; }
}