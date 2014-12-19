import grails.plugin.scaffold.core.ConfigUtility
import grails.buildtestdata.DomainInstanceBuilder

class ScaffoldAngularGrailsPlugin {
    def version = "0.3.26"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.4 > *"

	def dependsOn = [scaffoldCore: "* > 0.1"]
	def loadAfter = ['scaffoldCore']
	def loadBefore = ['buildTestData']
	
    def title = "Scaffold Angular Plugin" 
    def author = "Maigo Erit"
    def authorEmail = "maigo.erit@gmail.com"
    def description = '''\
Grails plugin for generating working demo with Angular frontend and REST backend.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/scaffold-angular"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Online location of the plugin's browseable source code.
    def scm = [ url: "https://github.com/MayGo/grails-scaffold-angular" ]


    def doWithSpring = {
		ConfigUtility.mergeDefaultConfig(application, 'ScaffoldAngularDefaultConfig')
		angularTemplatesLocator(grails.plugin.scaffold.core.DefaultTemplatesLocator, "scaffold-angular")
		
		DomainInstanceBuilder.metaClass.findRequiredPropertyNames = {domainArtefact->
			def constrainedProperties = domainArtefact.constrainedProperties
			def propNames = domainArtefact.persistentProperties.findAll{p->!p.isAssociation()}*.name
			
			def allPropertyNames = constrainedProperties.keySet()
			return allPropertyNames.findAll { propName ->
	            propNames.contains(propName)
	        }
		}
	}
}
