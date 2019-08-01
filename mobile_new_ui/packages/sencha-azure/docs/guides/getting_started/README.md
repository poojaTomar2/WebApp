Getting Started with Ext.Azure
=======
This Getting Started guide provides detailed instructions on how to create cloud applications using Sencha and Microsoft Azure Mobile Services.

You should be familiar with either **Sencha Touch** (>= v2.3) or **Ext JS** (>= v5.0), you should be familiar with **Microsoft Azure**,
and you must have signed up for Microsoft Azure by visiting the [Microsoft Azure](http://www.windowsazure.com) portal.

Overview
---

[Sencha Extensions for Microsoft Azure](https://market.sencha.com/extensions/sencha-touch-extensions-for-windows-azure)
allows your application to seemlessly communicate with Azure services for authentication, data storage and push notifications.
The package is easily added to and configured in any new or existing Sencha application, immediately giving it access to Azure cloud services.

Azure also takes the headache out of adding authentication to your application by incorporating user authentication
through Facebook, Twitter, Microsoft or Google accounts.

And for communication, Push Notification gives your application the added feature of sending messages to your users.


About the Guides
---

These guides are directed towards intermediate to advanced web application developers who have a good understanding of
HTML, JavaScript, and who are familiar with our Sencha frameworks.

They are designed to walk you through the process of creating a simple Sencha application with Azure which utilizes
all of the available Azure Mobile services.

**If you are building a Sencha Touch application, you will need a WebKit-based browser to run the example applications.
Desktop WebKit browsers include Google Chrome and Apple Safari. Supported mobile devices include Windows Phone, Android and iOS. **


Before You Start
---

As your Sencha application will be communicating with an Azure mobile service, it is strongly suggested that you
setup an Azure mobile service **before** moving on to including Azure into your application.

Creating an Azure mobile service requires you to 

1. **Sign Up for Microsoft Azure**

	In order to access Microsoft Azure, you must first signup for Azure services by visiting the [Microsoft Azure website](http://www.windowsazure.com).
	Once you have obtained access to Azure, you will be able to review documentation and setup mobile services for any
	application you wish to create using Sencha Touch or Ext JS.

2. **Create An Azure Service**

	1.	Select the **Mobile Services** section of the **Azure Portal**
	2.	Create a new **Mobile Service** noting the URL you define for the service.
	3.	Generate Access Keys for your Service via **Manage Keys** button (the keys will be used in your Sencha application
	    to allow communication with the Azure service).
	4.	Create any data tables your Touch application may require for application data storage.


Software Requirements
---
The *Sencha Extensions for Microsoft Azure* requires the following items to be installed for proper application
development as laid out in the guides and examples provided in this documentation:

- [Sencha Touch](http://pages.sencha.com/touch-for-azure.html) or [Ext JS](http://www.sencha.com/products/extjs/)

- [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/download) tools

- [Java Runtime Environment (JRE)](http://www.oracle.com/technetwork/java/javase/downloads/index.html)


Once you have created an Azure service and installed the required software, you may proceed with
[downloading and including](#!/guide/including_azure) the Azure package into your application.