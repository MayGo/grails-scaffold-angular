;(function($){
    $.fn.Data = function(){};
    var $this = $.fn.Data;

    $.fn.Data.pages = {
        '/': {title:'Dashboard', 'breadcrumb':['Dashboard']},
        '/layout-left-sidebar': {title:'Left Sidebar', 'breadcrumb':['Layouts', 'Left Sidebar']},
        '/layout-left-sidebar-collapsed': {title:'Left Sidebar Collapsed', 'breadcrumb':['Layouts', 'Left Sidebar Collapsed']},
        '/layout-right-sidebar': {title:'Right Sidebar', 'breadcrumb':['Layouts', 'Right Sidebar']},
        '/layout-right-sidebar-collapsed': {title:'Right Sidebar Collapsed', 'breadcrumb':['Layouts', 'Right Sidebar Collapsed']},
        '/layout-horizontal-menu': {title:'Horizontal Menu', 'breadcrumb':['Layouts', 'Horizontal Menu']},
        '/layout-horizontal-menu-sidebar': {title:'Horizontal Menu & Sidebar', 'breadcrumb':['Layouts', 'Horizontal Menu & Sidebar']},
        '/layout-boxed': {title:'Boxed Layout', 'breadcrumb':['Layouts', 'Boxed Layout']},
        '/layout-fixed-topbar': {title:'Fixed Topbar', 'breadcrumb':['Layouts', 'Fixed Topbar']},
        '/layout-hidden-footer': {title:'Hidden Footer', 'breadcrumb':['Layouts', 'Hidden Footer']},
        '/layout-header-topbar': {title:'Header Topbar', 'breadcrumb':['Layouts', 'Header Topbar']},
        '/layout-title-breadcrumb': {title:'Title & Breadcrumb', 'breadcrumb':['Layouts', 'Title & Breadcrumb']},
        '/ui-generals': {title:'Generals', 'breadcrumb':['UI', 'Generals']},
        '/ui-buttons': {title:'Buttons', 'breadcrumb':['UI', 'Buttons']},
        '/ui-panels': {title:'Panels', 'breadcrumb':['UI', 'Panels']},
        '/ui-tabs': {title:'Tabs', 'breadcrumb':['UI', 'Tabs']},
        '/ui-progressbars': {title:'Progress Bars', 'breadcrumb':['UI', 'Progress Bars']},
        '/ui-sliders': {title:'Sliders', 'breadcrumb':['UI', 'Sliders']},
        '/ui-editors': {title:'Editors', 'breadcrumb':['UI', 'Editors']},
        '/ui-modals': {title:'Modals', 'breadcrumb':['UI', 'Modals']},
        '/ui-icons': {title:'Icons', 'breadcrumb':['UI', 'Icons']},
        '/ui-typography': {title:'Typography', 'breadcrumb':['UI', 'Typography']},
        '/ui-notific8-notifications': {title:'Notific8 & Sco.message', 'breadcrumb':['UI', 'Notific8 & Sco.message']},
        '/ui-toastr-notifications': {title:'Toastr Notifications', 'breadcrumb':['UI', 'Toastr Notifications']},
        '/ui-checkbox-radio': {title:'Checkbox & Radio', 'breadcrumb':['UI', 'Checkbox & Radio']},
        '/ui-treeview': {title:'Tree View', 'breadcrumb':['UI', 'Tree View']},
        '/ui-portlets': {title:'Portlets', 'breadcrumb':['UI', 'Portlets']},
        '/ui-nestable-list': {title:'Nestable List', 'breadcrumb':['UI', 'Nestable List']},
        '/ui-dropdown-select': {title:'Dropdown Select', 'breadcrumb':['UI', 'Dropdown Select']},
        '/form-layouts': {title:'Form Layouts', 'breadcrumb':['Forms', 'Form Layouts']},
        '/form-basic': {title:'Basic Forms', 'breadcrumb':['Forms', 'Basic Forms']},
        '/form-components': {title:'Form Components', 'breadcrumb':['Forms', 'Form Components']},
        '/form-wizard': {title:'Form Wizard', 'breadcrumb':['Forms', 'Form Wizard']},
        '/form-xeditable': {title:'Form Xeditable', 'breadcrumb':['Forms', 'Form Xeditable']},
        '/form-validation': {title:'Form Validation', 'breadcrumb':['Forms', 'Form Validation']},
        '/form-multiple-file-upload': {title:'Multiple File Upload', 'breadcrumb':['Forms', 'Multiple File Upload']},
        '/form-dropzone-file-upload': {title:'Dropzone File Upload', 'breadcrumb':['Forms', 'Dropzone File Upload']},
        '/frontend-one-page': {title:'One Page', 'breadcrumb':['Frontend', 'One Page']},
        '/table-basic': {title:'Basic Tables', 'breadcrumb':['Tables', 'Basic Tables']},
        '/table-responsive': {title:'Responsive Tables', 'breadcrumb':['Tables', 'Responsive Tables']},
        '/table-action': {title:'Action Tables', 'breadcrumb':['Tables', 'Action Tables']},
        '/table-editable': {title:'Edit Tables', 'breadcrumb':['Tables', 'Edit Tables']},
        '/table-datatables': {title:'DataTables', 'breadcrumb':['Tables', 'DataTables']},
        '/table-filter': {title:'Filter Tables', 'breadcrumb':['Tables', 'Filter Tables']},
        '/table-advanced': {title:'Tables Advanced', 'breadcrumb':['Tables', 'Tables Advanced']},
        '/table-sample': {title:'Sample Tables', 'breadcrumb':['Tables', 'Sample Tables']},
        '/table-export': {title:'Export Tables', 'breadcrumb':['Tables', 'Export Tables']},
        '/grid-layout-div': {title:'DIVs Layout', 'breadcrumb':['Grids', 'DIVs Layout']},
        '/grid-layout-table-1': {title:'Table Demo 1', 'breadcrumb':['Grids', 'Table Demo 1']},
        '/grid-layout-table-2': {title:'Table Demo 2', 'breadcrumb':['Grids', 'Table Demo 2']},
        '/grid-layout-2-table': {title:'Two Tables', 'breadcrumb':['Grids', 'Two Tables']},
        '/grid-layout-ul-li': {title:'UL LI', 'breadcrumb':['Grids', 'UL LI']},
        '/grid-filter-with-ul-li': {title:'Dropdown Filters With UL/LI', 'breadcrumb':['Grids', 'Dropdown Filters With UL/LI']},
        '/grid-filter-with-select': {title:'Dropdown Filters With SELECT', 'breadcrumb':['Grids', 'Dropdown Filters With SELECT']},
        '/grid-double-sort': {title:'Double Sort', 'breadcrumb':['Grids', 'Double Sort']},
        '/grid-deep-linking': {title:'Deep Linking', 'breadcrumb':['Grids', 'Deep Linking']},
        '/grid-pagination-only': {title:'Pagination Only', 'breadcrumb':['Grids', 'Pagination Only']},
        '/grid-without-item-per-page': {title:'Pagination Without \'Items per Page\' Dropdown', 'breadcrumb':['Grids', 'Pagination Without \'Items per Page\' Dropdown']},
        '/grid-hidden-sort': {title:'Hidden Sort', 'breadcrumb':['Grids', 'Hidden Sort']},
        '/grid-range-slider': {title:'jQuery UI - Range Slider', 'breadcrumb':['Grids', 'jQuery UI - Range Slider']},
        '/grid-datepicker': {title:'jQuery UI - Date Picker Filter', 'breadcrumb':['Grids', 'jQuery UI - Date Picker Filter']},
        '/page-gallery': {title:'Gallery Page', 'breadcrumb':['Pages', 'Gallery Page']},
        '/page-timeline': {title:'TimeLine Page', 'breadcrumb':['Pages', 'TimeLine Page']},
        '/page-blog': {title:'Blog Page', 'breadcrumb':['Pages', 'Blog Page']},
        '/page-blog-item': {title:'Blog Item Page', 'breadcrumb':['Pages', 'Blog Item Page']},
        '/page-calendar': {title:'Calendar Page', 'breadcrumb':['Pages', 'Calendar Page']},
        '/page-about': {title:'About Us', 'breadcrumb':['Pages', 'About Us']},
        '/page-contact': {title:'Contact Us', 'breadcrumb':['Pages', 'Contact Us']},
        '/extra-profile': {title:'User Profile', 'breadcrumb':['Extra', 'User Profile']},
        '/extra-signin': {title:'Sign In', 'breadcrumb':['Extra', 'Sign In']},
        '/extra-signup': {title:'Sign Up', 'breadcrumb':['Extra', 'Sign Up']},
        '/extra-lock-screen': {title:'Lock Screen', 'breadcrumb':['Extra', 'Lock Screen']},
        '/extra-user-list': {title:'User List', 'breadcrumb':['Extra', 'User List']},
        '/extra-invoice': {title:'Invoice', 'breadcrumb':['Extras', 'Invoice']},
        '/extra-faq': {title:'FAQ', 'breadcrumb':['Extras', 'FAQ']},
        '/extra-pricing-table': {title:'Pricing Table', 'breadcrumb':['Extras', 'Pricing Table']},
        '/extra-404': {title:'404 Page', 'breadcrumb':['Extras', '404 Page']},
        '/extra-500': {title:'500 Page', 'breadcrumb':['Extras', '500 Page']},
        '/extra-blank': {title:'Page Blank', 'breadcrumb':['Extras', 'Page Blank']},
        '/email-inbox': {title:'MaiBox', 'breadcrumb':['Emails', 'MaiBox']},
        '/email-compose-mail': {title:'Compose mail', 'breadcrumb':['Emails', 'Compose mail']},
        '/email-view-mail': {title:'Mailbox', 'breadcrumb':['Emails', 'Mailbox']},
        '/charts-flotchart': {title:'Flot Charts', 'breadcrumb':['Charts', 'Flot Charts']},
        '/charts-chartjs': {title:'Chartjs', 'breadcrumb':['Charts', 'Chartjs']},
        '/charts-highchart-line': {title:'Line Charts', 'breadcrumb':['Charts', 'Line Charts']},
        '/charts-highchart-area': {title:'Area Charts', 'breadcrumb':['Charts', 'Area Charts']},
        '/charts-highchart-column-bar': {title:'Column & Bar Charts', 'breadcrumb':['Charts', 'Column & Bar Charts']},
        '/charts-highchart-pie': {title:'Pie Charts', 'breadcrumb':['Charts', 'Pie Charts']},
        '/charts-highchart-scatter-bubble': {title:'Scatter & Bubble Charts', 'breadcrumb':['Charts', 'Scatter & Bubble Charts']},
        '/charts-highchart-dynamic': {title:'Dynamic Charts', 'breadcrumb':['Charts', 'Dynamic Charts']},
        '/charts-highchart-combinations': {title:'Combinations', 'breadcrumb':['Charts', 'Combinations']},
        '/charts-highchart-more': {title:'More Chart Types', 'breadcrumb':['Charts', 'More Chart Types']},
        '/animations': {title:'Css Animations', 'breadcrumb':['Animations', 'Css Animations']}
    };

    $.fn.Data.get = function(id){
        if(id && $this.pages[id]){
            return $this.pages[id];
        }
    };

    $.fn.Data.checkbox = function(){
        if($('#demo-checkbox-radio').length <= 0){
            $('input[type="checkbox"]:not(".switch")').iCheck({
                checkboxClass: 'icheckbox_minimal-grey',
                increaseArea: '20%' // optional
            });
            $('input[type="radio"]:not(".switch")').iCheck({
                radioClass: 'iradio_minimal-grey',
                increaseArea: '20%' // optional
            });
        }
    };
})(jQuery);