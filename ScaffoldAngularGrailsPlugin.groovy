import grails.plugin.scaffold.core.ConfigUtility
import grails.plugin.scaffold.core.DefaultTemplatesLocator

class ScaffoldAngularGrailsPlugin {
	def version = "1.2.2"
	def grailsVersion = "2.4 > *"
	def loadAfter = ['scaffoldCore']
	def loadBefore = ['buildTestData']
	def title = "Scaffold Angular Plugin"
	def author = "Maigo Erit"
	def authorEmail = "maigo.erit@gmail.com"
	def description = 'Generates a working demo with Angular frontend and REST backend.'
	def documentation = "http://grails.org/plugin/scaffold-angular"
	def license = "APACHE"
	def scm = [url: "https://github.com/MayGo/grails-scaffold-angular"]
	def issueManagement = [url: 'https://github.com/MayGo/grails-scaffold-angular/issues']

	def doWithSpring = {
		ConfigUtility.mergeDefaultConfig(application, 'ScaffoldAngularDefaultConfig')
		angularTemplatesLocator(DefaultTemplatesLocator, "scaffold-angular")
	}
}
