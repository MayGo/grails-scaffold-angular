package defpackage

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import grails.util.Environment

import grails.util.Holders

class TestUserGeneratorService{
	
	def userDetailsService
	def springSecurityService

	void generate(){
		if(Environment.current == Environment.TEST && !Holders.config.functionalTest.userName) {
			log.info "Generating test users for TEST environment."
			UserDetails john = new User('john', springSecurityService.encodePassword('john'), [new SimpleGrantedAuthority('ROLE_USER'), new SimpleGrantedAuthority('ROLE_ADMIN')])
			userDetailsService.createUser(john)
		}
	}
}