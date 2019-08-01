<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ErrorPage.aspx.cs" Inherits="ErrorPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title></title>
	<style type="text/css">
		img, h2 {
			margin-top: 150px;
			border: 1px;
		}

		body {
			background-color: gray;
		}

		h2 {
			color: #ff0000;
		}
	</style>

</head>
<body>
	<center>
		<table style="width:100%">
			
			<tr>
				<td>
					<h6 style="color:white;font-size:larger; text-align:center">PAGE NOT FOUND</h6>
				</td>
			</tr>
			
		</table>		
       <img src="images/smile.png" alt="PAGE NOT FOUND" height="150px" style="vertical-align:top"/>
        <p><h2 style="color:white; font-size:small;font-family:Arial">you have been tricked into click on a link that can not be found.Please check the url or go to <br /> </h2>
			<h3 style="color:black;font-size:small"><a href="Default.aspx">home page</a></h3> <h4 style="color:white;font-size:small">and see if you can locate what you are looking for</h4>
          </p>
    </center>
</body>
</html>
