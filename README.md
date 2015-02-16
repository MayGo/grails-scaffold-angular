grails-scaffold-angular
=======================

Using this plugin
-----------------

* Create app with "grails create-app myApp" (don't use ver 2.4.4, bug with excludes, includes)
* Create domain model or copy somewhere.
* Add to BuildConfig.groovy:compile ":scaffold-angular:0.3.20"
* grails compile (for resolving plugin dependencies)
* grails createDemo
* grails run-app

Everything should work now, including tests.

If tests fail, then you have to add BuildTestData Config to generate correct data(e.g. unique constraints can fail).

Functional test creates 2 domain instances (with the help of build-test-data build() method) and deletes them at the end.

Note: build-test-data plugins findRequiredPropertyNames method is overriden, so all properties are initiated with values, not only non-nullable.
Note: hibernate4 and createDemo can give errors. Switch temporaraly back to hibernate3 and generate scaffolding then.

Note: When you still have errors, try running without scaffolding tests: folders = ['backendRestSrc':'src/', 'backendRestTest':null, 'backendRestGrailsApp':'grails-app/', 'frontendAngular':'angular/', 'frontendAngulr':'angular/']

Note: If domain model is no buildable with build-test-data, then you have to add correct mappings to TestDataConfig.groovy. e.g. if you have nonnullable custom validator, then you have to add to mapping validatable value
or without backend altogether: folders = ['backendRestSrc':null, 'backendRestTest':null, 'backendRestGrailsApp':null, 'frontendAngular':'angular/']
				

Frontend displays only ids, except 'name', 'username', 'authority' propertynames. When some readable name should be insetead, then edit displayNames config.

Frontend serving
--------------
Frontend is included in grails by default (files are statically served). This is for quick demoing purpuses only. 
Should move "angular" folder to separate project and build from there.
From grails:
* dirserve plugin should be removed
* urlmappings "/ng/\$asset**" and redirect should be removed.

Using generator-angular-fullstack frontend as basis (https://www.npmjs.org/package/generator-angular-fullstack)

* Run "grunt" for building, 
* Run "grunt serve" for preview, and 
* Run "grunt serve:dist" for a preview of the built app.


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
```
grails{
	plugin{
		scaffold{
			core{
				overwrite = true // false = Ask before replacing file
				// Map of domain class names. contains list of maps
				displayNames = ['Division':['name':null], 'User':['group':['name']]]
				//Problems when reloading folder structure "file:./grails-app/services/**/*Service.groovy"
				folders = ['backendSrc':'src/', 'backendTests':'test/', 'backendGrailsApp':'grails-app/', 'frontend':'angular/']
			}
		}
	}
}
```


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
```
static mapping = {
	persons cascade: "all-delete-orphan"
}
```

security
===

Plugins adds spring-security-rest and all necessary security config in config.groovy.

Security is disabled for development environment. 

For Test environment there is InMemoryUserDetailsManager used to create test users for functional tests.

If you add spring-security-ldap or add real users some other way and want to use them in functional tests. 

Then set grails.util.Holders.config.functionalTest.userName and grails.util.Holders.config.functionalTest.password

		
TODO
=====

* Add to functional test. Add failing create/update (domain has to have some constraints, can check with build-test-data build method and roll back if succeeds).
* Create TestDataConfigInitial.groovy, with all domains, def i, and unique constraint. 
* Add version prop to edit view
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
