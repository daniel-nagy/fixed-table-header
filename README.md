# Angular Fixed Table Header

This module will allow you to scroll a table vertically while the header remains visible.

* [License](#license)
* [Demo](#demo)
* [Usage](#usage)
* [How It Works](#how-it-works)
* [Restrictions](#restrictions)

## License

This software is provided free of change and without restriction under the [MIT License](LICENSE.md)

## Demo

[Codepen](http://codepen.io/anon/pen/eJgWGa?editors=101)

<!--
## Installation

#### Using Bower

This package is installable through the Bower package manager.

```
bower install angular-material-data-table --save
```

In your `index.html` file, include the data table module and style sheet.

```html
<!-- style sheet -!->
<link href="bower_components/angular-material-data-table/dist/md-data-table.min.css" rel="stylesheet" type="text/css"/>
<!-- module -!->
<script type="text/javascript" src="bower_components/angular-material-data-table/dist/md-data-table.min.js"></script>
```

Include the `md.data.table` module as a dependency in your application.

```javascript
angular.module('myApp', ['ngMaterial', 'md.data.table']);
```

#### Using npm and Browserify (or JSPM)

In addition, this package may be installed using npm.

```
npm install angular-material-data-table --save
```

You may use Browserify to inject this module into your application.

```javascript
angular.module('myApp', [require('angular-material-data-table')]);
```
-->

## Usage

```html
<div> <!-- grandparent element, this is the element that controls the height of the table -->
  <table>
    <thead fix-head> <!-- the fix-head attribute will fix the table header -->
      <tr>
        <th>Name</th>
        <th>City</th>
        <th>State</th>
        <th>Zip</th>
        <th>Email</th>
        <th>Phone</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="contact in contacts">
        <td>{{contact.name}}</td>
        <td>{{contact.city}}</td>
        <td>{{contact.state}}</td>
        <td>{{contact.zip}}</td>
        <td>{{contact.emial}}</td>
        <td>{{contact.phone}}</td>
      </tr>
    </tbody>
  </table>
</div>
```

The `clone` class will be added to the fixed table header. When the table is scrolled the `hover` class will be added to the `thead` element.

## How it works

The `fix-head` directive will clone the original `thead` element during the linking phase. It will then insert the clone after the original header. The visibility of the original header will be set to hidden and the cloned header will be positioned absolute. The grandparent element, the element that controls the height of your table and will force the table to scroll vertically, will be positioned relative. The cloned header will then be compiled with the scope of the original header. A watch listener will be created for each cell in the original header that will return the width of the cell. Whenever the width changes, the width of the corresponding cell in the cloned header will be updated. In addition, a scroll event listener will be placed on the grandparent element. When the grandparent element is scrolled, the top padding of the cloned header will be set to the `scrollTop` value of the grandparent element.

## Restrictions
 
* Your table must be wrapped in a div that determines the vertical scroll of your table.
* Because the cloned header is compiled with the scope of the original header, if you have a directive with an isolated scope on the original header then `ngRepeat` will not work within the cloned header.
* You'll want to set a background color on the header so it is not completely see through, use a slightly transparent background color for a neat effect.
* You can only have one `thead` element. Your `thead` element may have multiple rows.

In some cases the table header may appear glitchy while scrolling, I haven't been able to find a solution for this. You can put a transition on the padding top to make it look more rubber-band like and less glitchy.

```css
thead.clone {
  transition: padding-top 0.2s ease-out;
}
```

#### Using With Data Table

If you are using my data table module the progress indicator will be hidden behind the table header. You can use the following CSS to make it visible beneath the header but it will still scroll with the rest of the table and become hidden.

```css
thead.md-table-progress md-progress-linear {
  top: 0 !important;
}
```

Use the following CSS for a shadow effect

```css
thead.clone {
  transition: box-shadow 0.2s ease-in-out;
}

thead.clone.hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
```

Use the following CSS for just borders.

```css
thead.clone tr:last-child th {
  border-bottom: 1px rgba(0, 0, 0, 0.12) solid;
}

thead.clone ~ tbody tr:first-child td {
  border-top: none;
}
```

#### Why Not?

> Why not just position of the original header instead of creating a clone?

We are taking advantage of the browsers ability to calculate the width of the columns for us. Otherwise there would be a lot of ugly calculations to figure out the width of each column.

> Why not use translateY to move the cloned header when the grandparent element is scrolled?

The unfortunate reality is positioning an element while scrolling will result in a glitchy effect in most browsers. The styles will lag slightly behind the scroll. Setting the top padding doesn't remove the glitch but it does prevent rows from becoming visible behind the table header. It is then possible to use a transition on the top padding to remove the glitch and create a sorta playful effect. This isn't ideal but it is better then the glitchy feel in my opinion.

> Why not move the cloned header outside the grandparent element after compiling it.

The problem with this solution is, if the table overflows horizontally then the cloned header will not scroll horizontally with the rest of the table. It may be possible to use translateX to move the cloned header with the table as it is scrolled horizontally but it would probably look glitchy as well.