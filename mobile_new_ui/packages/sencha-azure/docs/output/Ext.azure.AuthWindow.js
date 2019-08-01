Ext.data.JsonP.Ext_azure_AuthWindow({"tagname":"class","name":"Ext.azure.AuthWindow","extends":"Ext.Base","mixins":[],"alternateClassNames":[],"aliases":{},"singleton":true,"requires":["Ext.Ajax"],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{"private":true},"private":true,"id":"class-Ext.azure.AuthWindow","code_type":"ext_define","members":{"cfg":[],"property":[{"name":"intervalId","tagname":"property","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"property-intervalId"},{"name":"scopedMessageFn","tagname":"property","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"property-scopedMessageFn"},{"name":"window","tagname":"property","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"property-window"}],"method":[{"name":"create","tagname":"method","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"method-create"},{"name":"endRequest","tagname":"method","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"method-endRequest"},{"name":"exitHandler","tagname":"method","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"method-exitHandler"},{"name":"intervalFn","tagname":"method","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"method-intervalFn"},{"name":"messageHandler","tagname":"method","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"method-messageHandler"},{"name":"urlChangeHandler","tagname":"method","owner":"Ext.azure.AuthWindow","meta":{"private":true},"id":"method-urlChangeHandler"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":1,"files":[{"filename":"AuthWindow.js","href":"AuthWindow.html#Ext-azure-AuthWindow"}],"html_meta":{"private":null},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":["Ext.Base"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Ext.azure.AuthWindow</strong></div></div><h4>Requires</h4><div class='dependency'>Ext.Ajax</div><h4>Files</h4><div class='dependency'><a href='source/AuthWindow.html#Ext-azure-AuthWindow' target='_blank'>AuthWindow.js</a></div></pre><div class='doc-contents'><p class='private'><strong>NOTE</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-intervalId' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-property-intervalId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-property-intervalId' class='name not-expandable'>intervalId</a><span> : Object</span><strong class='private signature' >private</strong></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-scopedMessageFn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-property-scopedMessageFn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-property-scopedMessageFn' class='name not-expandable'>scopedMessageFn</a><span> : Object</span><strong class='private signature' >private</strong></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-window' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-property-window' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-property-window' class='name not-expandable'>window</a><span> : Object</span><strong class='private signature' >private</strong></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-create' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-method-create' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-method-create' class='name expandable'>create</a>( <span class='pre'>url</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-endRequest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-method-endRequest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-method-endRequest' class='name expandable'>endRequest</a>( <span class='pre'>err, oauth</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>err</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>oauth</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-exitHandler' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-method-exitHandler' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-method-exitHandler' class='name expandable'>exitHandler</a>( <span class='pre'></span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-intervalFn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-method-intervalFn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-method-intervalFn' class='name expandable'>intervalFn</a>( <span class='pre'></span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-messageHandler' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-method-messageHandler' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-method-messageHandler' class='name expandable'>messageHandler</a>( <span class='pre'>rawResponse</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rawResponse</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-urlChangeHandler' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.AuthWindow'>Ext.azure.AuthWindow</span><br/><a href='source/AuthWindow.html#Ext-azure-AuthWindow-method-urlChangeHandler' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.AuthWindow-method-urlChangeHandler' class='name expandable'>urlChangeHandler</a>( <span class='pre'>urlObject</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>urlObject</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>"});