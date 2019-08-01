<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EddystoneUrl.aspx.cs" Inherits="EddystoneUrl" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<link rel="shortcut icon" type="image/x-icon" href="images/favicon1.ico" />
	<style>
		.parent {
			position: relative;
			top: 0;
			left: 0;
		}

		.image1 {
			position: relative;
			top: 0;
			left: 0;
		}

		.image2 {
			position: absolute;
			top: 0px;
		}

		#promotionImage {
			width: 100%;
			z-index: 0;
		}
	</style>
	<title>Promotions</title>
</head>
<body id="bdy1" runat="server">
	<div class="parent">
		<asp:Image ID="promotionImage" runat="server" CssClass="image1"  />
		<asp:PlaceHolder ID="plBarCode" runat="server" />
	</div>
</body>
<script type="text/javascript">
	window.history.replaceState(null, null, window.location.pathname);
</script>
</html>
