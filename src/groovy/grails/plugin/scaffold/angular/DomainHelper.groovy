package grails.plugin.scaffold.angular

import java.text.SimpleDateFormat
import org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity;
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder;



class DomainHelper {
	
	//cache instances for later use
	static Map cachedInstances = [:]
	

	static def createOrGetInst(def dClass, int groupId){
		//Get instance from cache or create if does not exists
	
		def inst
		def domainClazz = dClass.getClazz()
		String groupKey = "${dClass.name}_$groupId"
		if(cachedInstances.containsKey(groupKey)){
			inst = cachedInstances[groupKey]
		}else{
			domainClazz.withNewTransaction{status ->
				inst = domainClazz.buildWithoutSave()
				try {
					/* Rolling back data if any exception happens */
					status.setRollbackOnly();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
			cachedInstances[groupKey] = inst
		}
		return inst
		
	}
	
	static def getRealValue(def p, def val){
		def realVal
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)){
			if(p.type == boolean || p.type == Boolean) realVal = true
			realVal = val
		}else if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
			def inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSZ")
			String dateStr = (val)?inputFormat.format(val):''

			realVal = "$dateStr"
		}else{
			realVal = "$val"
		}
		return realVal
	}
	
	static def getRealValueForInput(def p, def val){
		def realVal
		if (p.type && Number.isAssignableFrom(p.type) || (p.type?.isPrimitive() || p.type == boolean || p.type == Boolean)){
			if(p.type == boolean || p.type == Boolean) realVal = true
			realVal = val
		}else if(p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar){
			def inputFormat = new SimpleDateFormat("dd.MM.yyyy")
			String dateStr = (val)?inputFormat.format(val):''

			realVal = "$dateStr"
		}else{
			realVal = "$val"
		}
		return realVal
	}
	
	static boolean isComposite(domainClazz){
		def domainMapping = new GrailsDomainBinder().getMapping(domainClazz)
		boolean isComposite = false
		if (domainMapping != null && domainMapping.getIdentity() instanceof CompositeIdentity){
			isComposite = true
		}
		return isComposite
	}
	
}
