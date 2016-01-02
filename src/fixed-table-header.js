(function (window, angular, undefined) {
'use strict';

angular.module('fixed.table.header', []).directive('fixHead', fixHead);

function fixHead($compile, $window) {
  
  function postLink(scope, element) {
    var clone = element.clone().removeAttr('fix-head').removeAttr('ng-if');
    var grandParent = element.parent().parent();
    
    clone.addClass('clone').css({
      'position': 'absolute',
      'top': 0,
      'zIndex': 1
    });
    
    element.css('visibility', 'hidden').after(clone);
    
    $compile(clone)(scope);
    
    grandParent.css('position', 'relative').on('scroll', function () {
      var top = grandParent.prop('scrollTop');
      
      clone.css('paddingTop', top + 'px');
      
      if(top === 0) {
        clone.removeClass('hover');
      } else if(!clone.hasClass('hover')) {
        clone.addClass('hover');
      }
    });
    
    function cells() {
      return clone.find('th').length;
    }
    
    function getCells(node) {
      return Array.prototype.map.call(node.find('th'), function (cell) {
        return jQLite(cell);
      });
    }
    
    function jQLite(node) {
      return angular.element(node);
    }
    
    function update() {
      var cells = getCells(element);
      
      getCells(clone).forEach(function (copy, index) {
        if(copy.data('isClone')) {
          return;
        }
        
        copy.data('isClone', true);
        
        var cell = cells[index];
        var style = $window.getComputedStyle(cell[0]);
        
        var getWidth = function () {
          return style.width;
        };
        
        var setWidth = function () {
          copy.css('minWidth', style.width);
        };
        
        var listener = scope.$watch(getWidth, setWidth);
        
        $window.addEventListener('resize', setWidth);
        
        copy.on('$destroy', function () {
          listener();
          $window.removeEventListener('resize', setWidth);
        });
        
        cell.on('$destroy', function () {
          copy.remove();
        });
      });
    }
    
    scope.$watch(cells, update);
    
    element.on('$destroy', function () {
      clone.remove();
    });
  }
  
  return {
    link: postLink
  };
}

fixHead.$inject = ['$compile', '$window'];

})(window, angular);