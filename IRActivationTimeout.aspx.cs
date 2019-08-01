using Cooler.Controllers.Consumer;
using System;
using DCPLFramework;
using DFramework.Database;
using DFramework.Database.Expressions;
using DFramework.UI.Notification;

public partial class IRActivationTimeout : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

	}

	protected void resendActivation_Click(object sender, EventArgs e)
	{
		string id = Request.QueryString["id"];
		string languageCode = "IT";
		var accountVerificationTokenGuid = id;
		string accountVerificationTokenGuidNew = Guid.NewGuid().ToString();
		var consumer = new Insigma.Business.Consumer();
		Query consumerQuery = new Query();
		string qry = string.Format(@"UPDATE Consumer SET ModifiedByUserId = @ModifiedByUserId, 
															CreatedOn = GETUTCDATE(), AccountVerificationTokenGuid = '{0}'
										WHERE AccountVerificationTokenGuid = {1}", accountVerificationTokenGuidNew, accountVerificationTokenGuid);
		consumerQuery = new Query(qry);
		consumerQuery.AddParameter(new ParameterInfo("ModifiedByUserId", DCPLFramework.SecurityHelper.UserId));
		consumerQuery.ExecuteNonQuery();

		consumerQuery = new Query();
		consumerQuery.Where.And(new Expression("AccountVerificationTokenGuid", CompareOperator.Equals, accountVerificationTokenGuidNew));
		consumer.Load(consumerQuery);
		if (consumer.Id != 0)
		{
			if (languageCode == "IT")
			{
				SendVerificationLink(consumer, consumer.ClientId, consumer.CountryId);
				string url = "~/IRResendActivation.html";
				Response.Redirect(url);
			}

		}
		else
		{
			string url = "~/IRItalyActivationFailed.html";
			Response.Redirect(url);
		}
	}
	private object SendVerificationLink(Insigma.Business.Consumer consumer, int clientId = 0, int countryId = 0)
	{


		//Send email verification code to the user for account verification.
		string url = "~/controllers/consumer/user/verifyAccount",
			resendMailUrl = "~/controllers/consumer/user/resendMail";
		Tags tags = new Tags();
		if ((clientId == (int)IRClient.CCH) && (countryId == (int)IRCountry.Italy))
		{
			var languageCode = "IT";
			tags.Add("AccountVerificationLink", Utility.ResolveServerUrl(url) + "?id=" + consumer.AccountVerificationTokenGuid + "ampln=" + languageCode);
			tags.Add("ResendActivationMail", Utility.ResolveServerUrl(resendMailUrl) + "?id=" + consumer.AccountVerificationTokenGuid + "ampln=" + languageCode);
			tags.Add("User", consumer.FirstName);
			EmailQueue emailQueue = new EmailQueue();
			var _tags = tags.ToString();
			string newTags = _tags.Replace("ampln", "&ln");
			emailQueue.Tags = newTags;
			emailQueue.TemplateId = (int)EmailTemplate.IRAccountVerificationTemplate; //(int)EmailTemplate.AccountVerificationTemplate; //changes as per local testing
			emailQueue.Save();

			EmailRecipient emailRecipient = new EmailRecipient();
			emailRecipient.RecipientEmail = consumer.PrimaryEmail;
			emailRecipient.EmailQueueId = emailQueue.Id;
			emailRecipient.Save();
		}
		else
		{
			tags.Add("AccountVerificationLink", Utility.ResolveServerUrl(url) + "?id=" + consumer.AccountVerificationTokenGuid);
			tags.Add("ResendActivationMail", Utility.ResolveServerUrl(resendMailUrl) + "?id=" + consumer.AccountVerificationTokenGuid);
			tags.Add("User", consumer.FirstName);
			EmailQueue emailQueue = new EmailQueue();
			emailQueue.Tags = tags.ToString();
			emailQueue.TemplateId = (int)EmailTemplate.AccountVerificationTemplate;
			emailQueue.Save();

			EmailRecipient emailRecipient = new EmailRecipient();
			emailRecipient.RecipientEmail = consumer.PrimaryEmail;
			emailRecipient.EmailQueueId = emailQueue.Id;
			emailRecipient.Save();
		}
		return new
		{
			success = true,
			message = "Resent"

		};
	}
	public enum EmailTemplate
	{
		AccountVerificationTemplate = 10,
		OtpPasswordTemplate = 11,
		IRAccountVerificationTemplate = 39,
	}
	public enum IRClient
	{
		CCH = 1,
	}
	public enum IRCountry
	{
		Italy = 57,
	}

	
}