<%=packageName ? "package ${packageName}" : ''%>

import grails.test.mixin.TestFor
import spock.lang.Unroll
import spock.lang.Specification
import defpackage.ConstraintHelper


@TestFor(${className})
class ${className}ConstraintsSpec extends Specification {

	def setup() {
		//mock a ${className} with some data (put unique violations in here so they can be tested, the others aren't needed)
		mockForConstraintsTests( ${className}, [ new ${className}() ] )
	}

	@Unroll("${className} constraint on field '#field' with value '#val' gets error '#error'")
	def "All ${className} constraints fails"() {
		when:
			def obj = new ${className}("\$field": val)

		then:
			ConstraintHelper.validateConstraints(obj, field, error)

		where:
			error                  | field        | val
<%
import org.codehaus.groovy.grails.validation.ConstrainedProperty
allProps = scaffoldingHelper.getProps(domainClass)
uniqueProps = []
boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
if (hasHibernate) {
	allProps.each{p->
		cp = domainClass.constrainedProperties[p.name]
		cp?.appliedConstraints.each {
			String errorName = it.name
			String fieldName = p.name
			def val = 'null'
			switch(errorName){

				case ConstrainedProperty.CREDIT_CARD_CONSTRAINT :
					val = "ConstraintHelper.getCreditCard(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.EMAIL_CONSTRAINT:
					val = "ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.BLANK_CONSTRAINT:
					if(!cp.blank){
						val = "''"
						println "\t\t\t'nullable' | '$fieldName' | $val"
					}
					break
				case ConstrainedProperty.RANGE_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.IN_LIST_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.URL_CONSTRAINT:
					val = "ConstraintHelper.getUrl(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.MATCHES_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.SIZE_CONSTRAINT:

					if (cp.minSize && cp.minSize > 1){
						val = "ConstraintHelper.getLongString(${cp.minSize - 1})"
						println "\t\t\t'size' | '$fieldName' | $val"
					}

					if (cp.maxSize){
						val = "ConstraintHelper.getLongString(${cp.maxSize +1 })"
						println "\t\t\t'size' | '$fieldName' | $val"
					}


					break
				case ConstrainedProperty.MIN_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.MAX_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.MAX_SIZE_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.MIN_SIZE_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.SCALE_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.NOT_EQUAL_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.NULLABLE_CONSTRAINT:
					if(!cp.nullable && p.type != Boolean && p.type != boolean) {
						val = "null"
						println "\t\t\t'$errorName' | '$fieldName' | $val"
					}
					break
				case ConstrainedProperty.VALIDATOR_CONSTRAINT:
					//val="ConstraintHelper.getEmail(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
			}

		}

	}

}
%>
	}
}
