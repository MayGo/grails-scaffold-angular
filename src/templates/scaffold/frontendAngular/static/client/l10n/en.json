{
"app":{
	"name":"${appName}",
	"title":"${appName}"
},
"button": {
	"submit": "Save",
	"back": "Back",
	"cancel": "Cancel",
	"delete":"Delete",
	"edit":"Edit",
	"copy": "Copy",
	"search":"Search",
	"true":"True",
	"false":"False",
	"none":"None"
},
"searchSelect":{
	"true":"True",
	"false":"False",
	"none":""
},
"tabs":{
	"selecttab": "Click on tab to show table"
},
"header" : {
  "navbar" : {
    "UPLOAD" : "Upload",
    "new" : {
      "NEW" : "New"
    },
    "user":{
    	"settings":"Settings",
    	"docs":"Help"
    },
    "NOTIFICATIONS" : "Notifications",
	"logout":"Logout"
  }
},
"messages":{
	"loading": "Loading ..."
},
"upload":{
	"title":"Upload files",
	"file":"Upload file",
	"or":"OR",
	"drop":"Drag And Drop your file here",
	"queue":"Upload queue",
	"length":"Queue lenght",
	"progress":"Queue progress",
	"uploadAll":"Upload all",
	"cancelAll":"Cancel all",
	"removeAll":"Remove all",
	"upload":"Upload",
	"cancel":"Cancel",
	"remove":"Remove",
	"name":"Name",
	"size":"Size",
	"progress":"Progress",
	"status":"Status",
	"actions":"Actions"
},
"pages":{
	"Dashboard":{
		"lastinserted":{
			"title":"Last Inserted",
			"view":"View",
			"table":{
				"header":{
					"id":"Id",
					"name":"Name",
					"description":"Description"
				}
			}
		}
	},
	"error":{
		"title": "Error Page"
	},
	"session":{
		"messages":{
			"default": "There was error loading page",
			"permission-denied": "You don't have permissions to view page: ",
			"relogin":"Not authorized to view page",
			"forbidden":"Forbidden to view page",
			"logging-out": "Logging out ...",
			"logged-out": "Logged out",
			"already-logged-out": "Already logged out",
			"state-change-error": "State change error"
		},
		"logout":{
			"login-again":"Login again",
			"logout-cas":"Logout from CAS"
		}
	},
	"settings":{
		"title":"Settings",
		"view":{
			"title":"Settings",
			"info":{
				"title":"User info",
				"permissions":"Permissions"
			}
		}
	},

	<%for(d in domainClasses){%>
		"${d.propertyName}":{
			"name":"${d.naturalName}",
			"defaultFieldName":{
			<%for (p in d.persistentProperties) {
					if(p.embedded){%>
						"${p.name}.title":"${p.naturalName}",\
					<%p.component.persistentProperties.each{ep->%>
						"${p.name}.${ep.name}":"${ep.naturalName}",\
						<%
						}
					}else{
					%>
						"${p.name}":"${p.naturalName}",\
					<%	}
				}%>
				"id": "Id"
			},

			"list":{
				"title": "${d.naturalName} List",	
				"new": " New ${d.naturalName}",
				"table":{
					"title":"${d.naturalName} Table"
				}
			},
			"view":{
				"title": "${d.naturalName} View",
				"lists": "{{isval}} in {{inval}}",
				"edit":{
					"title": "Edit ${d.naturalName}",
						"form":{
						"title":"${d.naturalName} Form"
					}
				}
			},

			"messages":{
				"delete": "Deleted ${d.naturalName}",
				"update": "Updated ${d.naturalName}",
				"create": "Created ${d.naturalName}"
			},	
			"create":{
				"title": "Create ${d.naturalName}"
			}
		}${(d == domainClasses.last()?'':',')}
	<%}%>
},
"menu" :{
	"static":{
		"HEADER" : "Navigation",
		"DASHBOARD" : "Dashboard"  
	},
	"domain":{
	<%for(d in domainClasses){%>
		"${d.propertyName}":"${d.naturalName}"${(d == domainClasses.last()?'':',')}
	<%}%>
	},
	"package":{
	<%Map groupedDomainClasses = domainClasses.groupBy([{it.packageName}]) as TreeMap
		for(d in groupedDomainClasses){
			String groupName = d.key.tokenize('.').last()
		%>
		"${groupName}":"${groupName.capitalize()}"${(d.key == groupedDomainClasses.lastKey()?'':',')}
	<%}%>
	}
  }
}

