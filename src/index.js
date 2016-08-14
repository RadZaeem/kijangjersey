import React from 'react'
import ReactDOM from 'react-dom';
import { App } from './App'
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var service_id = ' gmail';
var template_id = 'test_billing';
var template_params = {
name: 'John',
reply_email: 'raden.m.muaz@gmail.com',
message: 'This is awesome!'
};

//emailjs.send(service_id,template_id,template_params);
emailjs.send("gmail","test_billing",{name: "James", notes: "Check this out!"})
.then(function(response) {
   console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
}, function(err) {
   console.log("FAILED. error=", err);
});

ReactDOM.render(<App />, document.getElementById('root'))

//import Products from './Products';
//ReactDOM.render(<Products />, document.getElementById('root'));

/*
var products = [{
      id: 1,
      name: "Item name 1",
      price: 100
  },{
      id: 2,
      name: "Item name 2",
      price: 100
  }];
// It's a data format example.
function priceFormatter(cell, row){
  return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
}

ReactDOM.render(
  <BootstrapTable data={products} striped={true} hover={true}>
      <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataSort={true}>Product Name</TableHeaderColumn>
      <TableHeaderColumn dataField="price" dataFormat={priceFormatter}>Product Price</TableHeaderColumn>
  </BootstrapTable>,
    document.getElementById("root")
);
*/

//import { Example } from './testgrid'
//ReactDOM.render(<Example />, document.getElementById('root'))
//npm install --save-dev tinycolor2 base64-image-utils react-dropzone react webpack-hot-middleware react-dom react-hot-loader webpack-dev-middleware express


//import { DrawApp } from './App'

/*
var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];*/

//import { FilterableProductTable} from './reactway'

//React.render(<FilterableProductTable />,document.getElementById('root'));
//React.render(<DrawApp />, document.getElementById('root'))
