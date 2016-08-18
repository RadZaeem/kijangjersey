import React from 'react'
import ReactDOM from 'react-dom';
import { App } from './App'

ReactDOM.render(<App />, document.getElementById('root'))

//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

/*const express = require('express')  
const app = express()  
const port = 3001

app.get('/', (request, response) => {  
  response.send('Hello from Express!')
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})



var nodemailer = require('nodemailer');

var router = express.Router();
app.use('/sayHello', router);
router.post('/', handleSayHello); // handle the route at yourdomain.com/sayHello

function handleSayHello(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'kijangjerseymaker@gmail.com',
        pass: 'syukriah'
      }
    });
    var text = 'Hello world from \n\n' + req.body.name;

    var mailOptions = {
    from: 'kijangjerseymaker@gmail.com', // sender address
    to: 'raden.m.muaz@gmail.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    }
});
}


*/
/*
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import quotesApp from './reducers'
import thunkMiddleware from 'redux-thunk'
import api from './middleware/api'

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore)

let store = createStoreWithMiddleware(quotesApp)

let rootElement = document.getElementById('root')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
*/



/*
Email.send("kijangjerseymaker@gmail.com",
"raden.m.muaz@gmail.com",
"This is a subject",
"this is the body",
"aspmx.l.google.com",
"kijangjerseymaker",
"syukriah");
*/



/*
=======
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

>>>>>>> 508921a74f3ca93fe803cb91c7fecfdd8ba8fc83
var service_id = ' gmail';
var template_id = 'test_billing';
var template_params = {
name: 'John',
reply_email: 'raden.m.muaz@gmail.com',
message: 'This is awesome!'
};

//emailjs.send(service_id,template_id,template_params);
<<<<<<< HEAD

=======
>>>>>>> 508921a74f3ca93fe803cb91c7fecfdd8ba8fc83
emailjs.send("gmail","test_billing",{name: "James", notes: "Check this out!"})
.then(function(response) {
   console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
}, function(err) {
   console.log("FAILED. error=", err);
});
<<<<<<< HEAD
*/

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
