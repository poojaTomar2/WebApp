Ext.data.JsonP.authentication({"guide":"<h1>Walkthrough: Mobile Services Authentication example</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/authentication-section-1'>app.js</a></li>\n<li><a href='#!/guide/authentication-section-2'>app/controller/Main.js</a></li>\n<li><a href='#!/guide/authentication-section-3'>app/controller/Auth.js</a></li>\n</ol>\n</div>\n\n<p>The Authentication sample application is an example building on the simpler <a href=\"#!/example/Basic\">Basic</a> demo. You can view the full source code in the download package by opening the /examples/auth/MSAuth folder.</p>\n\n<p>Be sure you have read and fully understand the <a href=\"#!/guide/data_basic\">Basic walkthrough</a> before continuing with this guide.</p>\n\n<h2 id='authentication-section-1'>app.js</h2>\n\n<p>In order to use Authentication in your application, you'll need to configure your Azure Mobile Service with the desired oAuth providers per the <a href=\"http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-html/\">Get started with authentication in Mobile Services</a>\nguide.</p>\n\n<p>Once you have configured your Mobile Service with the desired oAuth providers, you will need to add the <strong>authIdentities</strong> config to your <em>azure</em> object:</p>\n\n<pre><code>Ext.application({\n\n    //...\n\n        azure : {\n            appKey         : 'YOUR-APP-KEY',\n            appUrl         : 'YOUR-APP-URL',\n\n            authIdentities : [\n                'microsoft',\n                'facebook',\n                'twitter',\n                'google'\n            ]\n        },\n\n    //...\n\n});\n</code></pre>\n\n<h2 id='authentication-section-2'>app/controller/Main.js</h2>\n\n<p>You should also notice that the Main controller has been edited slightly compared to the <em>Basic</em> example. Specifically, the \"main\" view no longer has an handler on its \"activate\" event (which automatically loaded the Store).</p>\n\n<h2 id='authentication-section-3'>app/controller/Auth.js</h2>\n\n<p>In the upper-left corner of the application is a new button - tapping this button opens a floating panel (Ext.azure.AuthOptions) which displays the available oAuth providers configured in your app.js file.</p>\n\n<p>The <strong>Auth</strong> controller also handles the application logic which happens during the authentication event cycle.</p>\n\n<ul>\n<li>authenticationsuccess</li>\n<li>authenticationfailure</li>\n<li>authenticationlogout</li>\n</ul>\n\n\n<p>The Authentication example is overly-simplified to help you understand how the authentication process works in Microsoft Azure.</p>\n\n<p>Also, be sure you read the documentation on <a href=\"#!/guide/mobile_services_authentication-section-quirks-with-autosync-stores\">Quirks with autoSync Stores</a>.</p>\n","title":"Mobile Services: Authentication"});