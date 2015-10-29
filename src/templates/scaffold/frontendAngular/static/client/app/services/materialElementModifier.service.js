angular
  .module('angularDemoApp')
  .factory('materialElementModifier', [
    function () {
      var /**
         * @ngdoc function
         * @name materialElementModifier#makeValid
         * @methodOf materialElementModifier
         *
         * @description
         * Makes an element appear valid by apply custom styles and child elements.
         *
         * @param {Element} el - The input control element that is the target of the validation.
         */
        makeValid = function (el) {
          var mdInputContainerEl = findMdInputContainerElement(el);
          if (!mdInputContainerEl) {
            console.error('Angular-auto-validate: invalid material form structure elements must be wrapped by a md-input-container element');
            return
          }
          resetInput(mdInputContainerEl);
        },

        /**
         * @ngdoc function
         * @name materialElementModifier#makeInvalid
         * @methodOf materialElementModifier
         *
         * @description
         * Makes an element appear invalid by apply custom styles and child elements.
         *
         * @param {Element} el - The input control element that is the target of the validation.
         * @param {String} errorMsg - The validation error message to display to the user.
         */
        makeInvalid = function (el, errorMsg) {
          var helpTextEl = angular.element('<span class="input-error-msg">' + errorMsg + '</span>');

          var mdInputContainerEl = findMdInputContainerElement(el);
          if (!mdInputContainerEl) {
            console.error('Angular-auto-validate: invalid material form structure elements must be wrapped by a md-input-container element');
            return
          }
          resetInput(mdInputContainerEl);
          insertTo(mdInputContainerEl, helpTextEl);
        },

        /**
         * @ngdoc function
         * @name materialElementModifier#makeDefault
         * @methodOf materialElementModifier
         *
         * @description
         * Makes an element appear in its default visual state.
         *
         * @param {Element} el - The input control element that is the target of the validation.
         */
        makeDefault = function (el) {
          var mdInputContainerEl = findMdInputContainerElement(el);
          if (!mdInputContainerEl) {
            console.error('Angular-auto-validate: invalid material form structure elements must be wrapped by a md-input-container element');
            return
          }
          resetInput(mdInputContainerEl);
        },
        resetInput = function (el) {
          angular.forEach(el.find('span'), function (spanEl) {
            spanEl = angular.element(spanEl);
            if (spanEl.hasClass('input-error-msg')) {
              spanEl.remove();
            }
          });
        },

        findContainerElement = function (el) {
          return findWithClassElementAsc(el, 'input-container');
        },
        findMdInputContainerElement = function (el) {
          return findElementAsc(el, 'MD-INPUT-CONTAINER');
        },
        insertAfter = function (referenceNode, newNode) {
          referenceNode[0].parentNode.insertBefore(newNode[0], referenceNode[0].nextSibling);
        },
        insertTo = function (referenceNode, newNode) {
          referenceNode[0].appendChild(newNode[0]);
        },
        findElementAsc = function (el, tag) {
          var returnEl,
            parent = el;
          for (var i = 0; i <= 10; i += 1) {
            if (parent !== undefined && parent[0].nodeName == tag) {
              returnEl = parent;
              break;
            } else if (parent !== undefined) {
              parent = parent.parent();
            }
          }

          return returnEl;
        },
        findWithClassElementAsc = function (el, klass) {
          var returnEl,
            parent = el;
          for (var i = 0; i <= 10; i += 1) {
            if (parent !== undefined && parent.hasClass(klass)) {
              returnEl = parent;
              break;
            } else if (parent !== undefined) {
              parent = parent.parent();
            }
          }

          return returnEl;
        };

      return {
        makeValid: makeValid,
        makeInvalid: makeInvalid,
        makeDefault: makeDefault,
        key: 'materialModifierKey'
      };
    }
  ])
