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

	@Unroll("${className} constraint on field '#field' with value '#val' gets '#error'")
	def "All ${className} constraints"() {
		when:
			${className} obj = new ${className}()
			obj."\$field" = val

		then:
			ConstraintHelper.validateConstraints(obj, field, error)

		where:
			error                  | field        | val
			'valid' | 'id' | 1 // Keep always one here or remove test
<%


import grails.converters.JSON
import org.codehaus.groovy.grails.validation.ConstrainedProperty
allProps = scaffoldingHelper.getProps(domainClass)
uniqueProps = []
boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')

private def outputByType(def p, def val=''){
	String str=''

	if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)){
		if(p.type == boolean || p.type == Boolean){
			val = true
		}
		str +="$val"
	}else if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
		String dateStr = 'new Date().clearTime()'
		str +="$dateStr"
	}else if(p.type == Map || "${p.type.name}" == "com.google.gson.internal.LinkedTreeMap"){
		val = (val) ?: []
		def json = val as JSON
		json.setPrettyPrint(true)
		jsonData = json.toString()
		jsonData = jsonData.replaceAll(/\{/, '[')
		jsonData = jsonData.replaceAll(/\}/, ']')
		jsonData = jsonData.replaceAll('"', "'")
		jsonData = jsonData.replaceAll('\':', "\': ")
		jsonData = jsonData.replaceAll(",'", ", '")
		jsonData = jsonData.replaceAll("'\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{4}'","new Date().clearTime()")
		str += "$jsonData"

	}else{
		str +="'$val'"
	}
	return str
}
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
						println "\t\t\t'blank' | '$fieldName' | $val"
					}
					break

				case ConstrainedProperty.IN_LIST_CONSTRAINT:
					val = cp.inList.first()
					println "\t\t\t'$errorName' | '$fieldName' | '${val+111111}'"
					println "\t\t\t'valid' | '$fieldName' | '$val'"
					break
				case ConstrainedProperty.URL_CONSTRAINT:
					val = "ConstraintHelper.getUrl(false)"
					println "\t\t\t'$errorName' | '$fieldName' | $val"
					break
				case ConstrainedProperty.MATCHES_CONSTRAINT:
					val = "DOES_NOT_MATCH"
					println "\t\t\t'$errorName' | '$fieldName' | '$val'"
					break
				case ConstrainedProperty.RANGE_CONSTRAINT:
					if (cp.min){
						val = cp.min
						println "\t\t\t'valid' | '$fieldName' | $val"
						if(cp.min > 1) {
							val = cp.min - 1
							println "\t\t\t'$errorName' | '$fieldName' | $val"
						}
					}

					if (cp.max){
						val = cp.max
						println "\t\t\t'valid' | '$fieldName' | $val"
						val = cp.max +1
						println "\t\t\t'$errorName' | '$fieldName' | $val"
					}
				case ConstrainedProperty.MAX_SIZE_CONSTRAINT:
					if (cp.maxSize){
						val = "ConstraintHelper.getLongString(${cp.maxSize})"
						println "\t\t\t'valid' | '$fieldName' | $val"
						val = "ConstraintHelper.getLongString(${cp.maxSize +1 })"
						println "\t\t\t'$errorName' | '$fieldName' | $val"
					}
					break
				case ConstrainedProperty.MIN_SIZE_CONSTRAINT:
					if (cp.minSize){
						val = "ConstraintHelper.getLongString(${cp.minSize})"
						println "\t\t\t'valid' | '$fieldName' | $val"
						if(cp.minSize > 1) {
							val = "ConstraintHelper.getLongString(${cp.minSize - 1})"
							println "\t\t\t'$errorName' | '$fieldName' | $val"
						}
					}

					break
				case ConstrainedProperty.SIZE_CONSTRAINT:

					if (cp.minSize){
						val = "ConstraintHelper.getLongString(${cp.minSize})"
						println "\t\t\t'valid' | '$fieldName' | $val"
						if(cp.minSize > 1) {
							val = "ConstraintHelper.getLongString(${cp.minSize - 1})"
							println "\t\t\t'$errorName' | '$fieldName' | $val"
						}
					}

					if (cp.maxSize){
						val = "ConstraintHelper.getLongString(${cp.maxSize})"
						println "\t\t\t'valid' | '$fieldName' | $val"
						val = "ConstraintHelper.getLongString(${cp.maxSize +1 })"
						println "\t\t\t'$errorName' | '$fieldName' | $val"
					}
					break
				case ConstrainedProperty.MIN_CONSTRAINT:

					val = outputByType(p, cp.min)
					println "\t\t\t'valid' | '$fieldName' | $val"

					println "\t\t\t'$errorName' | '$fieldName' | $val - 1"
					break
				case ConstrainedProperty.MAX_CONSTRAINT:
					val = outputByType(p, cp.max)
					println "\t\t\t'valid' | '$fieldName' | $val"


					println "\t\t\t'$errorName' | '$fieldName' | $val + 1"
					break

				case ConstrainedProperty.SCALE_CONSTRAINT:
					val = "ConstraintHelper.getScale(${cp.scale-1})"
					println "\t\t\t'valid' | '$fieldName' | $val "
					val = "ConstraintHelper.getScale(${cp.scale})"
					println "\t\t\t'valid' | '$fieldName' | $val "
					val = "ConstraintHelper.getScale(${cp.scale+1})"
					println "\t\t\t'valid' | '$fieldName' | $val "
					break
				case ConstrainedProperty.NOT_EQUAL_CONSTRAINT:
					val = cp.notEqual
					println "\t\t\t'$errorName' | '$fieldName' | '$val'"
					println "\t\t\t'valid' | '$fieldName' | '${val+11111}'"
					break
				case ConstrainedProperty.NULLABLE_CONSTRAINT:
					if(!cp.nullable && p.type != Boolean && p.type != boolean) {
						val = "null"
						println "\t\t\t'$errorName' | '$fieldName' | $val"
					}
					break
				case ConstrainedProperty.VALIDATOR_CONSTRAINT:
					val = "CUSTOM_VALIDATOR"
					println "\t\t\t//'$errorName' | '$fieldName' | '$val'"
					break
			}

		}

	}

}
%>
	}
}
