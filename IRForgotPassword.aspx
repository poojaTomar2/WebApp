<%@ Page Language="C#" AutoEventWireup="true" CodeFile="IRForgotPassword.aspx.cs" Inherits="IRForgotPassword" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
	<style type="text/css">
		.image {
			height: 150px;
			width: 150px;
		}

		body {
			background-color: #ffffff;
		}

		.jumbotron.text-center {
			background-color: #ffffff;
		}

		.thumbnail {
			background: #ddd0;
			/*border: 0px solid #ddd;*/
		}

		h2 {
			display: block;
			font-size: 1.5em;
			margin-block-start: 0.83em;
			margin-block-end: 0.83em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
			font-weight: bold;
			color: #000000;
			padding: 12px;
		}

		h3 {
			display: block;
			font-size: 1.2em;
			margin-block-start: 0.83em;
			margin-block-end: 0.83em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
			margin-top: -28px;
			margin-bottom: -5%;
			/*font-weight: bold;*/
			color: #000000;
			padding: 12px;
		}
		.terms{
			color: #05a5a5;
		}
	</style>
</head>
<body>
    <form id="form1" runat="server">
       	<div class="jumbotron text-center">
		<div id="boxShadow">
			<img src="images/IRCocacolaLogo.png" alt="IRCocacolaLogo" height="100%" width="100%" / >
		</div>

	</div>
		<div style="max-width: 400px;margin-left: 40%;margin-bottom:10%">
    <h2 class="form-signin-heading">
        Reimposta password</h2>
			<h3 class="form-signin-heading">
       La password deve includere almeno un simbolo e numero e avere almeno 8 caratteri.</h3>

    <br />
    <label for="txtPassword">
        Password</label>

			<asp:TextBox ID="txtPassword" runat="server" class="form-control" type="password" placeholder="Inserire la password"/> 
			<asp:CustomValidator runat="server" Display="Dynamic" ID="customValidator1" ForeColor="Red" OnServerValidate="customValidator_ServerValidate">  
			</asp:CustomValidator> 
			<asp:RegularExpressionValidator ID="Regex4" runat="server" ControlToValidate="txtPassword" ValidationExpression="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
			ErrorMessage="La password deve includere almeno un simbolo e numero e avere almeno 8 caratteri" ForeColor="Red">
			</asp:RegularExpressionValidator>
		<br />
    <label for="txtConfirmPassword">
       Conferma Password</label>
			<asp:TextBox ID="txtConfirmPassword" runat="server" class="form-control" type="password" placeholder="Inserire la password"/> 
			<asp:CustomValidator runat="server" Display="Dynamic" ID="customValidator2" ForeColor="Red"   OnServerValidate="customValidator_ServerValidate">  
			</asp:CustomValidator>
		  <br />
			 <asp:Button ID="btnSignup" runat="server" Text="Invia" class="btn btn-danger" OnClick="btnSignup_Click" />
			<br />
			<div>
			<p>
				Cliccando su "Invia", confermi di accettare i <span class="terms">Termini del servizio</span> e l'<span class="terms">Informativa sulla privacy</span>.
			</p>
		</div>

</div>	
    </form>
	<script type="text/javascript">
		window.onload = function () {
			var txtPassword = document.getElementById("txtPassword");
			var txtConfirmPassword = document.getElementById("txtConfirmPassword");
			txtPassword.onchange = ConfirmPassword;
			txtConfirmPassword.onkeyup = ConfirmPassword;
			function ConfirmPassword() {
				txtConfirmPassword.setCustomValidity("");
				if (txtPassword.value != txtConfirmPassword.value) {
					txtConfirmPassword.setCustomValidity("Le passwords non corrispondono.");
				}
			}
		}
</script>
</body>
</html>
