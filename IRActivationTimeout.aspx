<%@ Page Language="C#" AutoEventWireup="true" CodeFile="IRActivationTimeout.aspx.cs" Inherits="IRActivationTimeout" %>

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
	</style>
</head>
<body>
    <form id="form1" runat="server">
       	<div class="jumbotron text-center">
		<div id="boxShadow">
			<img src="images/IRCocacolaLogo.png" alt="IRCocacolaLogo" height="100%" width="100%" / >
		</div>
		<h2 id="defaultMsg">
			Spiacente ! </br >
			Il link non è piu attivo
			</br >
			Clicca il seguente pulsante per attivare di nuovo la registrazione
		</h2>
			   <asp:Button ID="resendActivation" runat="server" Text="Attiva di nuovo	la registrazione" class="btn btn-danger" OnClick="resendActivation_Click"/>
			
		</button>
	</div>
    </form>
</body>
</html>
