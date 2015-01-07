grails-scaffold-angular
=======================

Using this plugin
-----------------

Create app with "grails create-app myApp" (don't use ver 2.4.4, bug with excludes, includes)
Create domain model or copy somewhere.
Add to BuildConfig.groovy:compile ":scaffold-angular:0.3.20"
grails compile (for resolving plugin dependencies)
grails createDemo
grails run-app

Everything should work now, including tests.
If tests fail, then you have to add BuildTestData Config to generate correct data(e.g. unique constraints can fail).
Functional test creates 2 domain instances (with the help of build-test-data build() method) and deletes them at the end.
Note: build-test-data plugins findRequiredPropertyNames method is overriden, so all properties are initiated with values, not only non-nullable.

When frontend displays only ids where some readable name should be then edit displayNames config.

Frontend serving
--------------
Frontend is included in grails by default (files are statically served). This is for quick demoing purpuses only. 
Should move "angular" folder to separate project and build from there.
From grails:
* dirserve plugin should be removed
* urlmappings "/ng/\$asset**" and redirect should be removed.

Using generator-angular-fullstack frontend as basis (https://www.npmjs.org/package/generator-angular-fullstack)
Run 
grunt for building, 
grunt serve for preview, and 
grunt serve:dist for a preview of the built app.


Testing
-------------
Running grunt test will run the client and server unit tests with karma and mocha.

Use grunt test:client to only run client tests.

Protractor tests
-------------
To setup protractor e2e tests, you must first run

npm run update-webdriver

Use grunt test:e2e to have protractor go through tests located in the e2e folder.


Config
====
grails{
	plugin{
		scaffold{
			core{
				overwrite = true // false = Ask before replacing file
				defaultDisplayNames = ['name', 'username', 'authority'] // Domain property names that are included as displaynames
				// Map of domain class names. contains list of maps
				displayNames = ['Division':['name':null], 'User':['group':['name']]]
				
				//Problems when reloading folder structure "file:./grails-app/services/**/*Service.groovy"
				folders = ['backendSrc':'src/', 'backendTests':'test/', 'backendGrailsApp':'grails-app/', 'frontend':'angular/']
			}
		}
	}
}



Using
=====

validation
http://jonsamwell.github.io/angular-auto-validate/
other were http://huei90.github.io/angular-validation/ and https://github.com/kelp404/angular-validator

Loading bar: http://chieffancypants.github.io/angular-loading-bar/

Inform messages, exceptions, network errors: https://github.com/McNull/angular-inform

Tags input: https://github.com/mbenford/ngTagsInput

Autocomplete/typeahead
* need to send only id
* validation: required
* allow only to select value(no custom values)
* simple setup

multiselect

INSTALL
====
To install  bower components
bower-install

TODO
====
* paging config global: Use pagingGonfig or add _paging partial.


PROBLEMS
====
oneToMany relations has Tags in edit form. To get removing from collection to work, cascade has to be "all-delete-orphan"
e.g:
static mapping = {
	persons cascade: "all-delete-orphan"
}	

security
===

Plugins adds spring-security-rest and all necessary security config in config.groovy.
Security is disabled for development environment. 
For Test environment there is InMemoryUserDetailsManager used to create test users for functional tests.
If you add spring-security-ldap or add real users some other way and want to use them in functional tests. 
Then set grails.util.Holders.config.functionalTest.userName and grails.util.Holders.config.functionalTest.password

		
TODO
=====

* remove Inform "Updated" "Created" (add delete/save functions to service)
* list view "action" column with fixed with or fixed height if it helps
* view should show mantToOne items, as readonly tags or  in view should be associations
* delete button to delete
* one button click only
* breadcrumbs
* Use exlude in autocompletes.
* In view add new button with option to copy data.
* Add settings page. Layout properties. Remove localdata. Display ad groups.
* Add roles permissions. Only admin in demo.
* Search autocomplete tags date number.
* Main search. Use first domain as example.
* Check if some angulr directives arent used.
* Add scaffolding on domain change.
* Split plugins. Server and frontside.
* Core has to register multiple plugins. Register local files also.
* Refactor displayNames in ScaffoldingHelper.
* BUG whensearching with tags, sometimes comes error.(division1)
* tagsInput multible fields separator ", " as config object
