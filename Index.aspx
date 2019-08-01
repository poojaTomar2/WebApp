<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title></title>
	<script type="text/javascript">
		function VarifySSoRedirection() {
			if (window.location.hostname == "cch-portal.ebest-iot.com") {
				window.location.href = "https://sso.cchellenic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https://cch-portal.ebest-iot.com/GetSSOClaim.aspx";
			} else if (window.location.hostname == "cch-portal-qa.ebest-iot.com") {
				window.location.href = "https://sso.cchellenic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https://cch-portal-qa.ebest-iot.com/GetSSOClaim.aspx";
			} else if (window.location.hostname == "cch-portal-dev.ebest-iot.com") {
				window.location.href = "https://sso.cchellenic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https%3a%2f%2febestsso.accesscontrol.windows.net%2f&wreply=https%3a%2f%2febestsso.accesscontrol.windows.net%2fv2%2fwsfederation&wctx=cHI9d3NmZWRlcmF0aW9uJnJtPWh0dHAlM2ElMmYlMmZjY2gtcG9ydGFsLWRldi5lYmVzdC1pb3QuY29tJTJmaW5kZXguYXNweCZyeT1odHRwJTNhJTJmJTJmY2NoLXBvcnRhbC1kZXYuZWJlc3QtaW90LmNvbSUyZkdldFNTT0NsYWltLmFzcHg1";
			} else {
				window.location.href = "login.aspx";
			}
		};
	</script>
</head>
<body>
	<script type="text/javascript">
		VarifySSoRedirection();
	</script>
</body>
</html>
