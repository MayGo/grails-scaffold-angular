grails.project.work.dir = 'target'

grails.project.dependency.resolver = 'maven'
grails.project.dependency.resolution = {

	inherits 'global'
	log 'warn'

	repositories {
		mavenLocal()
		grailsCentral()
		mavenCentral()
	}

	plugins {
		build ':release:3.0.1', ':rest-client-builder:2.0.3', {
			export = false
		}
		compile ':scaffold-core:1.0'
		compile ":build-test-data:2.4.0"
		compile(":hibernate4:4.3.6.1") {
			export = false
		}
	}
}
