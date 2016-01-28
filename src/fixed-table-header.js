(function (window, angular, undefined) {
'use strict';

angular.module('fixed.table.header', []).directive('fixHead', fixHead);

function fixHead($compile, $window) {
  
  function postLink(scope, element) {
      
    var thead, container, scroller;
      
      // If the element is the header, we will float it in the table's parent div
    if (element[0].localName == 'thead') {
        thead = element;
        container = thead.parent().parent();
        scroller = container;
    } else {  // If the element isn't the header, it's the div that contains the table
        thead = element.find('thead');
        container = element;
        scroller = thead.parent().parent();
    }
      
    var table = {
      clone: jQLite('<table>'),
      original: thead.parent()
    };
    
    var header = {
      clone: thead.clone(),
      original: thead
    };
    
    
    // copy all the attributes from the original table
    copyAttrs(table.clone, table.original);
    
    // prevent recursive compilation
    header.clone.removeAttr('fix-head').removeAttr('ng-if');
    
    // insert the element so when it is compiled it will link
    // with the correct scope and controllers
    header.original.after(header.clone);
    
    $compile(table.clone)(scope);
    $compile(header.clone)(scope);
    
    table.clone.css({display: 'block', overflow: 'hidden'}).addClass('clone');
    header.clone.css('display', 'block');
    header.original.css('visibility', 'hidden');
    
    // detach the cloned header and append it to the cloned table,
    // insert the cloned table before the scroll container.
    container.parent()[0].insertBefore(table.clone.append(header.clone)[0], container[0]);
    
    scroller.on('scroll', function () {
      // use CSS transforms to move the cloned header when the table is scrolled horizontally
      header.clone.css('transform', 'translate3d(' + -(scroller.prop('scrollLeft')) + 'px, 0, 0)');
    });
    
    function cells() {
      return header.clone.find('th').length;
    }
    
    function copyAttrs(dst, src) {
      var attrs = src.prop('attributes');
      
      for(var attr in attrs) {
        dst.attr(attrs[attr].name, attrs[attr].value);
      }
    }
    
    function getCells(node) {
      return Array.prototype.map.call(node.find('th'), function (cell) {
        return jQLite(cell);
      });
    }
    
    function height() {
      return header.original.prop('clientHeight');
    }
    
    function jQLite(node) {
      return angular.element(node);
    }
    
    function marginTop(height) {
      table.original.css('marginTop', '-' + height + 'px');
    }
    
    function updateCells() {
      var cells = {
        clone: getCells(header.clone),
        original: getCells(header.original)
      };
      
      cells.clone.forEach(function (clone, index) {
        if(clone.data('isClone')) {
          return;
        }
        
        // prevent duplicating watch listeners
        clone.data('isClone', true);
        
        var cell = cells.original[index];
        var style = $window.getComputedStyle(cell[0]);
        
        var getWidth = function () {
          return style.width;
        };
        
        var setWidth = function () {
          marginTop(height());
          clone.css('minWidth', style.width);
        };
        
        var listener = scope.$watch(getWidth, setWidth);
        
        $window.addEventListener('resize', setWidth);
        
        clone.on('$destroy', function () {
          listener();
          $window.removeEventListener('resize', setWidth);
        });
        
        cell.on('$destroy', function () {
          clone.remove();
        });
      });
    }
    
    scope.$watch(cells, updateCells);
    
    header.original.on('$destroy', function () {
      header.clone.remove();
    });
  }
  
  return {
    link: postLink
  };
}

fixHead.$inject = ['$compile', '$window'];

})(window, angular);