using System;
using System.Web.UI;
using DCPLFramework;
using System.Text;
using Cooler;
using Insigma.Business;
using DFramework.Database;
using DFramework.Database.Expressions;

public partial class EmailAlerts : Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

		AlertSummarys alertDefinitions = new AlertSummarys();
		Query queryForAlertDefinition = new Query();
		queryForAlertDefinition.Where.And(new NotDeleted());
		queryForAlertDefinition.Where.And(new Expression("IsActive", CompareOperator.Equals, 1));
		alertDefinitions.Load(queryForAlertDefinition);
		foreach (AlertSummary alertDefinition in alertDefinitions)
		{
			Tags tags = new Tags();
			tags.Add("Upto", DateTime.Now.ToString("dddd dd MMM yyyy")); // to do
			tags.Add("AlertDefinitionId", alertDefinition.AlertDefinitionIds); 
			Helper helper = new Helper();
			helper.ProcessAlertTags(alertDefinition.AlertDefinitionIds, tags);
			StringBuilder htmlTemplate = new StringBuilder();
			htmlTemplate.Append(System.IO.File.ReadAllText(Utility.AppPath + "\\App_Data\\Alerts.html"));
			string finalOutput = tags.Apply(htmlTemplate.ToString());
			Response.Write(finalOutput);
		}
	}

}