# Angular Fixed Table Header

This module will allow you to scroll a table vertically while the header remains visible.

* [License](#license)
* [Demo](#demo)
* [Usage](#usage)
* [How It Works](#how-it-works)
* [Restrictions](#restrictions)

## License

This software is provided free of charge and without restriction under the [MIT License](LICENSE.md)

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

Wrap the table in a element that will scroll vertically. Use the `fix-head` attribute on a `<thead>` element to prevent it from scrolling with the rest of the table.

A clone of the original `<thead>` element will be moved outside the scroll container. To ensure valid HTML, the cloned `<thead>` element will be wrapped in a copy of the `<table>` element. The new `<table>` element will be given the `clone` class.

```html
<div style="overflow: auto; max-height: 300px;">
  <table>
    <thead fix-head>
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

## How It Works

1. Create a new `<table>` element and copy the attributes from the original `<table>` element then compile it.
2. Clone the original `<thead>` element and append it to the original `<table>` element and compile it.
3. Detach the cloned `<thead>` element and append it to the new `<table>` element and insert it before the scroll container.
4. For each `<th>` in the cloned `<thead>`, set its width equal to the width of the original `<th>` in the original `<thead>`.
5. Set the top margin of the original `<table>` element equal to negative the height of the original `<thead>` element.
6. When the scroll container is scrolled horizontally, use css transforms to translate the cloned `<thead>` element.

The advantage of this solution is the functionality of HTML tables is preserved.

## Restrictions
 
* Your table must be wrapped in a div that determines the vertical scroll of your table.
* Because the cloned header is compiled with the scope of the original header, if you have a directive with an isolated scope on the original header then `ngRepeat` will not work within the cloned header.
* You can only have one `thead` element; however, your `thead` element may have multiple rows.

#### Using With The Data Table Module

If you are using this directive with my data table module then be aware that the progress indicator will still scroll with the rest of the table.

Use the following CSS to correct the borders.

```css
table.clone thead tr:last-child th {
  border-bottom: 1px rgba(0, 0, 0, 0.12) solid;
}

table.clone + md-table-container table tbody tr:first-child td {
  border-top: none;
}
```

#### Why Not?

> Why not reposition the original header instead of making a clone?

I'm taking advantage of the browsers ability to calculate the width of the columns. Otherwise the developer would have to manually set the width of each column like many other solutions.

> Why not use a pure CSS solution?

CSS solutions often defeat the purpose of using a table in the first place. In addition, the solutions I've seen remove functionality from the table and require the developer to manually set the width of each column.
