grails-scaffold-angular
=======================

Using generator-angular-fullstack frontend as basis (https://www.npmjs.org/package/generator-angular-fullstack)


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

When using /spa/** as frontend and enableing security, then in Congi.groovy add:

grails.plugin.springsecurity.filterChain.chainMap = [
	'/spa/**': 'nonAuthFilter',
	'/index.gsp': 'nonAuthFilter',
	'/index': 'nonAuthFilter',
	'/': 'nonAuthFilter',
	'/**/**': 'JOINED_FILTERS'
]

Also add nonAuthFilter in  resources.groovy:
nonAuthFilter(ee.smit.security.NonAuthenticationFilter)


Class file:
		package ee.smit.security
		
		import javax.servlet.FilterChain
		import javax.servlet.ServletException
		import javax.servlet.ServletRequest
		import javax.servlet.ServletResponse
		import org.springframework.web.filter.GenericFilterBean
		
		class NonAuthenticationFilter  extends GenericFilterBean {
		
		    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		        chain.doFilter(request, response);
		    }
		}
		
		
TODO
=====

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
