package grails.plugin.scaffold.angular

import static java.lang.reflect.Modifier.isStatic
import grails.buildtestdata.BuildTestDataService
import grails.buildtestdata.handler.ConstraintHandlerException
import grails.converters.JSON
import groovy.util.logging.Slf4j

import java.text.SimpleDateFormat

import org.codehaus.groovy.grails.commons.GrailsClass
import org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder

@Slf4j
class DomainHelper {

	static BuildTestDataService buildTestDataService

	//cache instances for later use
	static Map cachedInstances = [:]

	static createOrGetInst(dClass, int groupId) {

		updateRequiredPropertyNames(dClass)

		//Get instance from cache or create if does not exists
		def inst
		def domainClazz = dClass.clazz

		String groupKey = "${dClass.name}_$groupId"
		if (cachedInstances.containsKey(groupKey)) {
			inst = cachedInstances[groupKey]
		} else {

			if (domainClazz.metaClass.respondsTo(domainClazz, 'withNewTransaction')) {
				try {
					domainClazz.withNewTransaction { status ->
						try {
							inst = domainClazz.buildWithoutSave()
							inst.discard()

							status.setRollbackOnly()


						} catch (ConstraintHandlerException ex) {
							log.error ex.message
						} catch (Exception ex) {
							log.error ex.message, ex
						}
					}
				} catch (Exception ex) {
					log.error "Problem  with class ${dClass.name}", ex
				}

				cachedInstances[groupKey] = inst
			} else {
				//println "$domainClazz not domain instance"
			}
		}

		return inst
	}

	static createOrGetInst(dClass, int groupId, fallbackDomainClass, p) {
		def inst = createOrGetInst(dClass, groupId)
		if(!inst){
			//Search from fallbackDomainclass
			// Use case: if domainclass has embeddedproperty that itself is not domainclass
			def mainInst = DomainHelper.createOrGetInst(fallbackDomainClass, 1)
			mainInst = (mainInst)?mainInst["${p.name}"]:null
			if(mainInst){
				inst = mainInst.class.declaredFields.findAll { !it.synthetic && !isStatic(it.modifiers) }.collectEntries {
					[ (it.name):mainInst."$it.name" ]
				}
			}
		}
		return inst
	}

	static updateRequiredPropertyNames(domainClass) {
		if (!buildTestDataService) {
			def domainClazz = domainClass.clazz
			buildTestDataService = domainClazz.metaClass.getMetaMethod("buildWithoutSave", [GrailsClass] as Class[]).getClosure().delegate

			// Generate data for not required properties also
			def findRequiredPropertyNames = { domainArtefact ->
				def constrainedProperties = domainArtefact.constrainedProperties
				def propNames = domainArtefact.persistentProperties.findAll { p -> !p.isAssociation() }*.name
				def allPropertyNames = constrainedProperties.keySet()
				return allPropertyNames.findAll { propName ->
					propNames.contains(propName) || !constrainedProperties."$propName".isNullable()
				}
			}
			buildTestDataService.domainInstanceBuilders.each { k, v ->
				v.requiredPropertyNames = findRequiredPropertyNames(k)
			}
		}
	}

	static getRealValue(p, val) {
		def realVal
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)) {
			if (p.type == boolean || p.type == Boolean) realVal = true
			realVal = val
		} else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) {
			def inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSZ")
			String dateStr = (val) ? inputFormat.format(val) : ''

			realVal = "$dateStr"
		} else {
			realVal = "$val"
		}
		return realVal
	}

	static getRealValueForInput(p, val) {
		def realVal
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)) {
			if (p.type == boolean || p.type == Boolean) realVal = true
			realVal = val
		} else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) {
			def inputFormat = new SimpleDateFormat("dd.MM.yyyy")
			String dateStr = (val) ? inputFormat.format(val) : ''

			realVal = "$dateStr"
		} else {
			realVal = "$val"
		}
		return realVal
	}

	static boolean isComposite(domainClazz) {
		def domainMapping = new GrailsDomainBinder().getMapping(domainClazz)
		boolean isComposite = false
		if (domainMapping != null && domainMapping.getIdentity() instanceof CompositeIdentity) {
			isComposite = true
		}
		return isComposite
	}

	static String getPropertyFullName(p, parentProperty, String ch, boolean includeFirstProp = false){
		String propName = (parentProperty?.component) ? parentProperty.name + ch : ''
		String mainPropName = p.name
		if(p.component &&  includeFirstProp){
			propName += mainPropName + ch
			def firstProp = p.component.persistantProperties.first()
			mainPropName = firstProp.name
		}
		propName += mainPropName

		return propName
	}

	static String prettyJsonData(def inst){
		if(!inst) return "[]"
		def json = inst as JSON
		json.setPrettyPrint(true)
		String jsonData = json.toString()
		jsonData = jsonData.replaceAll(/\{/,'[')
		jsonData = jsonData.replaceAll(/\}/,']')
		jsonData = jsonData.replaceAll('"',"'")
		jsonData = jsonData.replaceAll('\':', "\': ")
		jsonData = jsonData.replaceAll(",'",", '")
		jsonData = jsonData.replaceAll("'\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{4}'","new Date().clearTime()")
		jsonData = jsonData.replaceAll("('.*'):\\s*('.{100,}')") { all, propName, txt ->
			def a = txt.split("(?<=\\G.{100})")
			"${propName}: ${a.join("' +\n'")}"
		}
		return jsonData
	}
}
