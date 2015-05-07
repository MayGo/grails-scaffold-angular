package defpackage.aop

import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.springframework.stereotype.Component

@Component
@Aspect
class ServicesLogging {

	@Pointcut('bean(*Service) && execution(public * *(..))')
	@SuppressWarnings(['EmptyMethod', 'SpaceAfterOpeningBrace'])
	void publicServiceMethod() {}

	@Pointcut('execution(public groovy.lang.MetaClass getMetaClass()) \
				|| execution(public void setMetaClass(groovy.lang.MetaClass)) \
				|| execution(public Object getProperty(String)) \
				|| execution(public void setProperty(String, Object)) \
				|| execution(public Object invokeMethod(String, Object))')
	@SuppressWarnings(['SpaceAfterOpeningBrace', 'EmptyMethod'])
	void groovyObjectMethods() {}

	@Pointcut('execution(public * *$*(..))')
	@SuppressWarnings(['EmptyMethod', 'SpaceAfterOpeningBrace'])
	void groovyDollarSignMethods() {}

	@Around('publicServiceMethod() && !groovyObjectMethods() && !groovyDollarSignMethods()')
	@SuppressWarnings('CatchThrowable')
	def traceServiceMethodCall(ProceedingJoinPoint jp) throws Throwable {
		String invocationDescription = "method '$jp.signature.name' of class [$jp.signature.declaringTypeName]"
		Object[] args = jp.args
		String argsString = args*.toString().join(', ')
		log.error "Entering $invocationDescription with args: $argsString"
		try {
			def result = jp.proceed()
			log.debug "Exiting $invocationDescription"
			return result
		} catch (Throwable e) {
			log.debug "Exception thrown in $invocationDescription", e
			throw e
		}
	}

}
