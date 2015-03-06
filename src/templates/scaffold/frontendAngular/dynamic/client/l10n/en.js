{
"app":{
	"name":"${appName}",
	"title":"${appName}"
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
		"view":{
			"title":"Settings",
			"info":{
				"title":"User info",
				"permissions":"Permissions"
			}
		}
	},
	<%for(d in domainClasses){%>
		"${d.shortName}":{
			"name":"${d.naturalName}",
			"list":{
				"title": "${d.naturalName} List",	
				"new": " New ${d.naturalName}",
				"edit": " Edit",
				"view": " View",
				"delete": " Delete",
				"table":{
					"title":"${d.naturalName} Table",	
					"search":"Search in ${d.naturalName} Table",
					"header":{
						<%for (p in d.persistentProperties) {%>
				   		"${p.name}":"${p.naturalName}",\
					    <%}%>
					    "id": "Id"
					}
				},
				"search":{
					"placeholder":{
						<%for (p in d.persistentProperties) {%>
				   		"${p.name}":"${p.naturalName}",\
					    <%}%>
					    "id": "Id"
					}
				}
			},
			"view":{
				"title": "${d.naturalName} View",	
				"new": " New ${d.naturalName}",
				"edit": " Edit",
				"delete": " Delete",
				"back": " Back",
				"lists": "{{isval}} in {{inval}}",
				"field":{
					<%for (p in d.persistentProperties) {%>
			   		"${p.name}":"${p.naturalName}",\
				    <%}%>
				    "id": "Id"
				}
			},
			"edit":{
				"title": "Edit ${d.naturalName}",	
				"form":{
					"title":"${d.naturalName} Form",	
					"submit":"Submit",
					"cancel":"Cancel",
					"field":{
						<%for (p in d.persistentProperties) {
							if(p.embedded){%>
								"${p.name}.title":"${p.component.naturalName}",\
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
		"${d.shortName}":"${d.naturalName}"${(d == domainClasses.last()?'':',')}
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

