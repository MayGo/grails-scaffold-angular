package defpackage

import grails.rest.render.json.JsonRenderer
import grails.converters.JSON
import grails.rest.render.ContainerRenderer
import grails.rest.render.RenderContext
import groovy.transform.CompileStatic

import org.codehaus.groovy.grails.web.mime.MimeType

@CompileStatic
class CustomJsonCollectionRenderer extends JsonRenderer implements ContainerRenderer {
	final Class componentType

	CustomJsonCollectionRenderer(Class componentType) {
		super(Collection)
		this.componentType = componentType
	}

	CustomJsonCollectionRenderer(Class componentType, MimeType... mimeTypes) {
		super(Collection, mimeTypes)
		this.componentType = componentType
	}

	@Override
	protected void renderJson(JSON converter, RenderContext context) {
		converter.setExcludes(componentType, context.excludes)
		converter.setIncludes(componentType, context.includes)
		converter.render(context.writer)
	}
}
