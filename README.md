# grails-scaffold-angular
Plugin generates for every domain object:
* Angular REST frontend(CRUD view) with unit and e2e tests.
* Grails REST backend(Controller, ModifyService, SearchService, UrlMapping) with unit and integration tests.

Frontend uses AdminLTE opensource template: https://almsaeedstudio.com/preview

# Using plugin

* Create app with ```grails create-app myApp``` (use ver 2.4.3, see below for explanation)
* Create domain model or copy somewhere.
* Add to BuildConfig.groovy:
```compile ":scaffold-angular:x.x"```
* ```grails compile``` (for resolving plugin dependencies)
* ```grails create-demo```
* Plugin generates initial configs in files: TestDataConfig.groovy, Config.groovy täiendus, BuildConfig.groovy. Call ```grails create-demo``` again, so plugin can use new configs.
* ```grails run-app```

Everything should work now, including tests.

If domain model is not buildable with build-test-data, then you have to add correct mappings to TestDataConfig.groovy. e.g. if you have non-nullable custom validator, then you have to add validatable value to sampleData mapping

If tests fail, then you have to add BuildTestData Config to generate correct data(e.g. unique constraints can fail).

## Using plugin with grails ver > 2.4.3
Plugin should generate all files with 2.* versions. But in 2.4.4 and later. There is problem with respond includes/excludes properties and custom CollectionRenderer.
REST output just renders {empty:false} always. Bug https://jira.grails.org/browse/GRAILS-11892

Plugin adds CollectionRenderer but it will be commented out. So app should run without errors(except saving dates, because customDateMarshaller is not registered, it substracts/adds your timezone amount of hours).

You can always remove custom CollectionRenderer from resources.groovy. And remove file src/groovy/defpackage/CustomJsonCollectionRenderer.groovy

And remove file src/groovy/defpackage/CustomMarshallerRegistrar.groovy (or not needed domain config from that file). One marshaller in there is important (should define somewhere or edit frontend so datepicker expectations are met):
```
def customDateMarshaller = new DateMarshaller(FastDateFormat.getInstance("yyyy-MM-dd'T'HH:mm:ssZ", TimeZone.default, Locale.default))
JSON.registerObjectMarshaller(customDateMarshaller)
```
With CustomJsonCollectionRenderer you can exclude/include relationships properties:
```
excludes=id,version,someDomain.someProperty,someDomain.someSubDomain.someProperty, someDomain.someOtherSubDomain
includes=fooProp,someDomain.someProperty,someDomain.someSubDomain
```


## Bower and Npm dependencies

Bower components are included with plugin, so you can run frontend without installing npm/bower. But 

**To install  bower components**

```bower install```

**To install  npm components**

```npm install```
				
## Frontend serving
Frontend is included in grails by default (files are statically served). This is for quick demoing purpuses only. 
Should move "angular" folder to separate project and build from there.
From grails:
* dirserve plugin should be removed
* urlmappings "/ng/\$asset**" and redirect should be removed.

Using generator-angular-fullstack frontend as basis (https://www.npmjs.org/package/generator-angular-fullstack)

* Run ```grunt``` for building, 
* Run ```grunt serve``` for preview, and 
* Run ```grunt serve:dist``` for a preview of the built app.


## Running frontend tests


**Karma unit tests**
Running grunt test will run the client and server unit tests with karma and mocha.

Use ```grunt test:client``` to only run client tests.

**Protractor e2e tests**

To setup protractor e2e tests, you must first run

```npm run update-webdriver```

Use grunt test:e2e to have protractor go through tests located in the e2e folder.

# Plugin Configuration
## Config
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
                // don't generate files or menu for domains
                ignoreDomainNames = []
                ignoreFileNames = ['TestDataGeneratorService.groovy', 'TestDataConfig.groovy']
    			ignoreStatic = true
			}
		}
	}
}
```
You can seperate frontend from backend before generating scaffolding.
Add to Config.groovy:
```
grails.plugin.scaffold.angular.serveFrontendFromGrails = false
grails.plugin.scaffold.core.folders = [frontendAngular:'../angular_ui/']
```

You can generate only frontend : 
```
grails.plugin.scaffold.core.folders = ['backendRestSrc':null, 'backendRestTest':null, 'backendRestGrailsApp':null]
```

## Domain config

To render autocomplete to edit field, add widget:'autocomplete'. In format you can define custom prop name that is
used to generate functions name. And with that variable name application expects resource Url in config.json.
```
someVarNameUrl:'http://foobar.com/somerestservice'
```

When format is ommited, then property name is used. Eg:
myPropUrl.
```
static constraints = {
	myProp widget:'autocomplete', format:'someVarName'
}
```

# Generated Content
## Backend functional tests
* creates 2 domain instances (with the help of build-test-data build() method) 
* edits domain instance
* reads domain instance
* queries for domain instance
* deletes 2 domain instances at the end.
## Backend unit tests

## Frontend unit tests
Domain Service tests:
* query()
* get()
* update()
* save()

## Frontend e2e tests
For every domain model
* Backend mocks
* Create PageObjects and create page elements check 
* Edit PageObjects and edit page elements check 
* List PageObjects and list page search elements check 
* View PageObjects and view page elements check. Edit/back/delete button tests. 

## Used angular/js plugins

* validation

 http://jonsamwell.github.io/angular-auto-validate/

* other options were 

 http://huei90.github.io/angular-validation/
 
 https://github.com/kelp404/angular-validator

* Loading bar

 http://chieffancypants.github.io/angular-loading-bar/

* Inform messages, exceptions, network errors: 

 https://github.com/McNull/angular-inform

* Tags input

 https://github.com/mbenford/ngTagsInput

**Autocomplete/typeahead**

 https://angular-ui.github.io/bootstrap/#/typeahead
* need to send only id
* validation: required
* allow only to select value(no custom values)
* simple setup

**Multiselect**

Not used currently


## security

Plugins adds spring-security-rest and all necessary security config in config.groovy.

Security is disabled for development environment. 

For Test environment there is InMemoryUserDetailsManager used to create test users for functional tests.

If you add spring-security-ldap or add real users some other way and want to use them in functional tests. 

Then set grails.util.Holders.config.functionalTest.userName and grails.util.Holders.config.functionalTest.password

# MISC PROBLEMS
oneToMany relations has Tags in edit form. To get removing from collection to work, cascade has to be "all-delete-orphan"
e.g:
```
static mapping = {
	persons cascade: "all-delete-orphan"
}
```

		
# TODO

* paging config global: Use pagingGonfig or add _paging partial.
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
