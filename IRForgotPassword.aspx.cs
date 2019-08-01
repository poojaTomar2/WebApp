using Cooler.Controllers.Consumer;
using System;
using DCPLFramework;
using DFramework.Database;
using DFramework.Database.Expressions;
using DFramework.UI.Notification;
using ExtJSHelper;
using System.Web.UI.WebControls;

public partial class IRForgotPassword : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

	}
	protected void customValidator_ServerValidate(object source, ServerValidateEventArgs args)
	{
		if (txtPassword.Text == string.Empty)
		{
			if (string.IsNullOrWhiteSpace(txtPassword.Text))
			{
				customValidator1.ErrorMessage = "Gli spazi non sono ammessi.";
			}
			else
			{
				customValidator1.ErrorMessage = "Per favore, inserisci la password.";
			}
			args.IsValid = false;
		}
		else if ((txtConfirmPassword.Text == string.Empty) || string.IsNullOrWhiteSpace(txtConfirmPassword.Text))
		{
			if (string.IsNullOrWhiteSpace(txtConfirmPassword.Text))
			{
				customValidator2.ErrorMessage = "Gli spazi non sono ammessi.";
			}
			else
			{
				customValidator2.ErrorMessage = "Per favore, inserisci la password.";
			}
			args.IsValid = false;
		}
	}
	protected void btnSignup_Click(object sender, EventArgs e)
	{
		string id = Request.QueryString["id"];
		string languageCode = "IT";
		var accountVerificationTokenGuid = id;
		string password = txtPassword.Text.ToString();
		string newpasswordHash = string.Empty;
		if ((!string.IsNullOrEmpty(password)) && (!string.IsNullOrWhiteSpace(txtPassword.Text)))
		{
			newpasswordHash = LoginHelper.GeneratePasswordHash(password);
			string _ForUpdatePassword = string.Format(@"UPDATE Consumer SET PasswordHash = '{0}'
																	WHERE AccountVerificationTokenGuid = {1}", newpasswordHash, accountVerificationTokenGuid);
			Query queryForUpdatePassword = new Query(_ForUpdatePassword);
			int recordUpdated = queryForUpdatePassword.ExecuteNonQuery();
			if (recordUpdated > 0)
			{
				Response.Redirect("~/IRForgotPasswordSuccess.html");
			}
			else
			{
				Response.Redirect("~/IRItalyGeneralError.html");
			}

		}
		//else
		//{
		//	Response.Redirect("~/IRItalyGeneralError.html");
		//}
	}
}