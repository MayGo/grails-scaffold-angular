package defpackage.aop

import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.springframework.stereotype.Component

// TODO: Refactor and cleanup code so Codenarc check passes
@Component
@Aspect
@SuppressWarnings(['EmptyMethod', 'SpaceAfterOpeningBrace'])
class ServicesLogging {
<%

	import org.apache.commons.lang3.StringUtils
	String[] packages = domainClasses*.packageName
	String pack = StringUtils.getCommonPrefix(packages)?:'*.'

	%>
	@Pointcut('bean(*Service) && execution(public * $pack.*(..))')
	void publicServiceMethod() {}

	@Pointcut('execution(public groovy.lang.MetaClass getMetaClass()) \\
				|| execution(public void setMetaClass(groovy.lang.MetaClass)) \\
				|| execution(public Object getProperty(String)) \\
				|| execution(public void setProperty(String, Object)) \\
				|| execution(public Object invokeMethod(String, Object))')
	void groovyObjectMethods() {}

	@Pointcut('execution(public * *\$*(..))')
	void groovyDollarSignMethods() {}

	// TODO: Refactor and cleanup code so Codenarc check passes
	@Around('publicServiceMethod() && !groovyObjectMethods() && !groovyDollarSignMethods()')
	@SuppressWarnings('CatchThrowable')
	def traceServiceMethodCall(ProceedingJoinPoint jp) throws Throwable {
		String invocationDescription = "method '\$jp.signature.name' of class [\$jp.signature.declaringTypeName]"
		Object[] args = jp.args
		String argsString = args*.toString().join(', ')
		log.debug "Entering \$invocationDescription with args: \$argsString"
		try {
			def result = jp.proceed()
			log.debug "Exiting \$invocationDescription"
			return result
		} catch (Throwable e) {
			log.debug "Exception thrown in \$invocationDescription", e
			throw e
		}
	}
}
