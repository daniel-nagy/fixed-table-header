/*
 * Angular Fixed Table Header
 * https://github.com/daniel-nagy/fixed-table-header
 * @license MIT
 * v0.2.1
 */
(function (window, angular, undefined) {
  'use strict';

  angular.module('fixed.table.header', []).directive('fixHead', fixHead);

  function fixHead($compile, $window, $mdSticky) {

    function link(scope, element, attributes, controllers, transclude) {
      // Hack to hide sticky header after scrolling up when the sticky header is not the first visible element in the scrollable container.
      // See https://github.com/angular/material/issues/8506
      var stickyPlaceholder = angular.element('<div class="sticky-placeholder"></div>');
      element.parent().parent()[0].insertBefore(stickyPlaceholder[0], element.parent()[0]);
      $mdSticky(scope, stickyPlaceholder);

      // Transclude the user-given contents of the subheader the conventional way.
      transclude(scope, function (clone) {
        element.append(clone);
      });

      // Create another clone of the element, that will be 'stickied' as the user scrolls.
      transclude(scope, function (clone) {
        function numberOfCells() {
          return clone.find('th').length;
        }

        function getCells(node) {
          return Array.prototype.map.call(node.find('th'), function (cell) {
            return angular.element(cell);
          });
        }

        function updateCells() {
          var cells = {
            clone: getCells(clone),
            original: getCells(element)
          };

          cells.clone.forEach(function (cloneCell, index) {
            if (cloneCell.data('isClone')) {
              return;
            }

            // prevent duplicating watch listeners
            cloneCell.data('isClone', true);

            var cell = cells.original[index];
            var style = $window.getComputedStyle(cell[0]);

            var getWidth = function () {
              return style.width;
            };

            var setWidth = function () {
              cloneCell.css({ minWidth: style.width, maxWidth: style.width });
            };

            var listener = scope.$watch(getWidth, setWidth);

            $window.addEventListener('resize', setWidth);

            cloneCell.on('$destroy', function () {
              listener();
              $window.removeEventListener('resize', setWidth);
            });

            cell.on('$destroy', function () {
              cloneCell.remove();
            });
          });
        }

        var wrapper = element.parent().clone().empty().addClass('sticky-clone');
        wrapper.append(element.clone().empty());
        wrapper.find('thead').removeAttr('fix-head');
        $compile(wrapper)(scope);

        wrapper.find('thead').append(clone);
        $mdSticky(scope, element, wrapper);

        scope.$watch(numberOfCells, function () {
          updateCells();
        });
      });
    }

    return {
      restrict: 'A',
      transclude: true,
      link: link
    };
  }

  fixHead.$inject = ['$compile', '$window', '$mdSticky'];

})(window, angular);