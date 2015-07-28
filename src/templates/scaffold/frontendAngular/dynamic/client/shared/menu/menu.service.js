angular.module('angularDemoApp').factory('MenuService',
	function (\$state, \$rootScope, \$http, \$window) {

		var version = {};

		var sections = [{
			name: 'menu.static.DASHBOARD',
			link: 'app.dashboard',
			icon: 'fa-dashboard',
			type: 'link'
		}];

<%

		List glyhs=['glyphicon-cloud','glyphicon-envelope','glyphicon-glass','glyphicon-music','glyphicon-user','glyphicon-film','glyphicon-th-large','glyphicon-th','glyphicon-th-list','glyphicon-off',
			'glyphicon-signal','glyphicon-home','glyphicon-file','glyphicon-time',
			'glyphicon-road','glyphicon-download-alt','glyphicon-download','glyphicon-upload','glyphicon-inbox','glyphicon-play-circle','glyphicon-repeat','glyphicon-refresh','glyphicon-list-alt',
			'glyphicon-lock','glyphicon-flag','glyphicon-headphones','glyphicon-volume-off','glyphicon-volume-down','glyphicon-volume-up','glyphicon-qrcode','glyphicon-barcode','glyphicon-tag',
			'glyphicon-tags','glyphicon-book','glyphicon-bookmark','glyphicon-print','glyphicon-camera','glyphicon-font','glyphicon-bold','glyphicon-italic','glyphicon-text-height',
			'glyphicon-text-width','glyphicon-align-left','glyphicon-align-center','glyphicon-align-right','glyphicon-align-justify','glyphicon-list','glyphicon-indent-left',
			'glyphicon-indent-right','glyphicon-facetime-video','glyphicon-picture','glyphicon-map-marker','glyphicon-adjust','glyphicon-tint']

		int i = -1
		if(domainClasses.size() < 8){
			for(d in domainClasses){
				i++%>
				sections.push({
					link: 'app.${d.propertyName}.list',
					icon: '${glyhs[i]}',
					name: 'menu.domain.${d.propertyName}',
					type: 'link'
				});

				<%}%>
		<%}else{//Group menu items based on package name
			Map groupedDomainClasses = domainClasses.groupBy([{it.packageName}])
			groupedDomainClasses.each{packageName, domainClasses->
			String groupName = packageName.tokenize('.').last()
			i++
%>
			var menu_${groupName} = [];
<%
			domainClasses.each{d->
%>
			menu_${groupName}.push({
				name: 'menu.domain.${d.propertyName}',
				link: 'app.${d.propertyName}.list',
				icon: '${glyhs[i]}',
				type: 'link'
			});

<%
			}
%>
			sections.push({
				name: 'menu.package.${groupName}',
				icon: '${glyhs[i]}',
				pages: menu_${groupName}.sort(sortByName),
				type: 'toggle'
			});
			<%}%>
		<%}%>

		sections.push();

		function sortByName(a, b) {
			return a.name < b.name ? -1 : 1;
		}

		var self = {
			version: version,
			sections: sections,

			selectSection: function (section) {
				self.openedSection = section;
			},
			toggleSelectSection: function (section) {
				self.openedSection = (self.openedSection === section ? null : section);
			},
			isSectionSelected: function (section) {
				return self.openedSection === section;
			},

			selectPage: function (section, page) {
				self.currentSection = section;
				self.currentPage = page;
			},
			isPageSelected: function (page) {
				return self.currentPage === page;
			}
		};

		 \$rootScope.\$on('\$stateChangeSuccess', onLocationChange);
		onLocationChange(null, \$state.\$current);

		return self;

		function onLocationChange(event, toState, toParams, fromState, fromParams) {

			var path = toState.name;
			var settingsLink = {
				name: 'pages.settings.view.title',
				link: 'app.settings',
				type: 'link'
			};

			if (path == settingsLink.link) {
				self.selectSection(settingsLink);
				self.selectPage(settingsLink, settingsLink);
				return;
			}

			var matchPage = function (section, page) {
				if (path === page.link) {
					self.selectSection(section);
					self.selectPage(section, page);
				}
			};

			sections.forEach(function (section) {
				if (section.children) {
					// matches nested section toggles, such as API or Customization
					section.children.forEach(function (childSection) {
						if (childSection.pages) {
							childSection.pages.forEach(function (page) {
								matchPage(childSection, page);
							});
						}
					});
				}
				else if (section.pages) {
					// matches top-level section toggles, such as Demos
					section.pages.forEach(function (page) {
						matchPage(section, page);
					});
				}
				else if (section.type === 'link') {
					// matches top-level links, such as "Getting Started"
					matchPage(section, section);
				}
			});
		}
	});