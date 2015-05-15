<%
List allAutocompleteProps = []
for(d in domainClasses) {

	scaffoldingHelper.getProps(d).each{
		if(it.cp.widget == 'autocomplete'){
			allAutocompleteProps << it
		}

		if(it.embedded){
			scaffoldingHelper.getProps(it.component).each{
				if(it.cp.widget == 'autocomplete'){
					allAutocompleteProps << it
				}
			}
		}
	}
}


allAutocompleteProps.collectEntries {a->
		String acFunctionName = (a.cp.format)?: a.name
		[(acFunctionName): a]
}.each{acFunctionName, a->
		%>
angular.module('angularDemoApp').run(['\$templateCache', function(\$templateCache) {
	\$templateCache.put('${acFunctionName}AutocompleteCustomTemplate.html',
			'<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="\$isVisible()" role="select">\\
				<li role="presentation" ng-repeat="match in \$matches" ng-class="{active: \$index == \$activeIndex}">\\
					<a role="menuitem" tabindex="-1" ng-click="\$select(\$index, \$event)" ng-bind-html="autocompleteService.${acFunctionName}SimpleFormatLabel(match)"></a>\\
				</li>\\
			</ul>'
	);
}]);
<%}%>