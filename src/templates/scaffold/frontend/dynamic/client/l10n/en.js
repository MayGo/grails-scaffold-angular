{
"app":{
	"name":"${appName}",
	"title":"${appName}"
},	
"header" : {
  "navbar" : {
    "UPLOAD" : "Upload",
    "new" : {
      "NEW" : "New",
      "PROJECT" : "Projects",
      "TASK" : "Task",
      "USER" : "User",
      "EMAIL" : "Email"
    },
    "NOTIFICATIONS" : "Notifications"
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
					"header":{
						"id": "Id",\
						<%for (p in d.persistentProperties) {%>
				   		"${p.name}":"${p.naturalName}"${(p == d.persistentProperties.last()?'':',')}\
					    <%}%>
					}
				},
				"search":{
					"placeholder":{
						"id": "Id",\
						<%for (p in d.persistentProperties) {%>
				   		"${p.name}":"${p.naturalName}"${(p == d.persistentProperties.last()?'':',')}\
					    <%}%>
					}
				}
			},
			"view":{
				"title": "${d.naturalName} View",	
				"new": " New ${d.naturalName}",
				"edit": " Edit",
				"delete": " Delete",
				"lists": "{{isval}} in {{inval}}",
				"field":{
					"id": "Id",\
					<%for (p in d.persistentProperties) {%>
			   		"${p.name}":"${p.naturalName}"${(p == d.persistentProperties.last()?'':',')}\
				    <%}%>
				}
			},
			"edit":{
				"title": "Edit ${d.naturalName}",	
				"form":{
					"title":"${d.naturalName} Form",	
					"submit":"Submit",
					"cancel":"Cancel",
					"field":{
						"id": "Id",\
						<%for (p in d.persistentProperties) {%>
				   		"${p.name}":"${p.naturalName}"${(p == d.persistentProperties.last()?'':',')}\
					    <%}%>
					}
				}
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

