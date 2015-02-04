package defpackage

import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import org.springframework.web.filter.GenericFilterBean

class NonAuthenticationFilter extends GenericFilterBean {

	void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException {
		chain.doFilter(request, response)
	}
}
