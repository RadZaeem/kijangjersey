import React from "react"; 
import ReactDOM from 'react-dom'; 


//import './email.min.js';
//import ReactDataGrid from 'react-data-grid';

//var React = require('react')
//var ReactDOM = require('react-dom')

//import './Players';
var _ = require('lodash')
var Dropzone = require('react-dropzone')

var download = require('./lib/download.js')
var compressColor = require('./lib/compress-color.js')
var readImageAsBase64 = require('./lib/read-image-as-base64.js');
var Rating = require('react-rating');

//var IconRating = require('react-icon-rating')

/*------------------------------------------------------

Sprites related variables and functions

------------------------------------------------------*/

var defaultSprites = {
  orange: {
    name: 'Orange',
    price:30,
    sprites: ['orange_front.png', 'orange_back.png']
  },
  green: {
    name: 'Green',
    price:40,
    sprites: ['green_front.png', 'green_back.png']
  }/*
  green: {
    name: 'Green',
    price:37,
    sprites: ['green_front.png', 'green_back.png']
  },*/
  /*
  mario: {
    name: 'Mario',
    sprites: ['mario1.png', 'mario2.png']
  },*/

};

var {base64ImageToRGBArray} = require('base64-image-utils');

function rgbToString(rgb) {
  return rgb.a > 0 ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : 'rgb(255,255,255)'
}

function rgbArrayToShadow(rgbArray, scale, imageWidth, imageHeight) {
  var halfWidth = Math.floor(imageWidth / 2)
  var halfHeight = Math.floor(imageHeight / 2)

  return _.chain(rgbArray).filter(pixel => {
    return !(pixel.rgb.a < 128 || pixel.rgb.r === 255 && pixel.rgb.g === 255 && pixel.rgb.b === 255)
  }).map(pixel => {
    var color = compressColor(rgbToString(pixel.rgb))
    return `${color} ${(pixel.x - halfWidth) * scale + 'px'} ${(pixel.y - halfHeight) * scale + 'px'}`
  }).compact().value().join(',')
}

/*------------------------------------------------------

Graphic 
Handle canvas Drawing

------------------------------------------------------*/



var Graphic = React.createClass({ 
  getInitialState: function() {

    
    return {
      text: "",
      width:900,
      height:520
    };
  },
  componentDidMount: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    this.paint(context);
  },

  componentDidUpdate: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    context.clearRect(0, 0, this.state.width ,this.state.height);
    
    this.paint(context);
  },



  paint: function(context) {
    context.save();
    var shirtFront=  new Image();
    shirtFront.src = this.props.shirtFrontSrc;
    var shirtBack=  new Image();
    shirtBack.src = this.props.shirtBackSrc;
    var logo=  new Image();
    //console.log(logo.src);
    if (this.props.logoSrc != undefined) logo.src = this.props.logoSrc;

    
    var shirtFrontPos=[((1/20)*this.state.width),((1/10)*this.state.height)];
    var shirtBackPos=[((10/20)*this.state.width),((1/10)*this.state.height)];
    context.drawImage(shirtFront,shirtFrontPos[0],shirtFrontPos[1]);
    context.drawImage(shirtBack,shirtBackPos[0],shirtBackPos[1]);

    var logoOffset=[(0.6)*shirtBack.width, (0.3)*shirtBack.height];
    //var logoOffset=[0,0];
    //var logoScale=[(10)*logo.width/shirtBack.width, (10)*logo.width/shirtBack.width];
    var logoScale=[(0.1)*shirtBack.width, (0.1)*shirtBack.width];
    var logoPos=[shirtFrontPos[0]+logoOffset[0],shirtFrontPos[1]+logoOffset[1]];
    context.drawImage(logo, logoPos[0], logoPos[1], logoScale[0],logoScale[1]);
    //}
    context.textAlign="center";

    var numberOffset=[shirtBack.width/2, shirtBack.height/2];
    var numberPos=[shirtBackPos[0]+numberOffset[0],shirtBackPos[1]+numberOffset[1]];
    context.font = "160px sans";
    context.fillStyle= "white"
    context.fillText(this.props.numberPreview, numberPos[0], numberPos[1]);
    
    var nameOffset=[shirtBack.width/2, (0.7)*shirtBack.height];
    var namePos=[shirtBackPos[0]+nameOffset[0],shirtBackPos[1]+nameOffset[1]];
    context.font = "30px sans";
    context.fillText(this.props.namePreview, namePos[0], namePos[1]);





    /*

    context.translate(100, 100);
    context.rotate(this.props.rotation, 100, 100);
    context.fillStyle = '#F00';
    context.fillRect(-50, -50, 100, 100);
    */


    context.restore();
  },

  render: function() {
    return <canvas 
      id="mycanvas"
      width={this.state.width} 
      height={this.state.height} />;
  }

});


/*------------------------------------------------------

PreviewInput
Input for Preview shirt with user given number and name

------------------------------------------------------*/

var PreviewInput = React.createClass({ 
  handleChange: function() {
    this.props.onUserInput(
      this.refs.num.value,
      this.refs.name.value
    );
  },
  
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Enter number"
          value={this.props.numberPreview}
          ref="num"
          onChange={this.handleChange}       
        />
        <p>
        <input
          type="text"
          placeholder="Enter name"
          value={this.props.namePreview}
          ref="name"
          onChange={this.handleChange}
        /></p>
      </form>
    );
  }
});


/*------------------------------------------------------

PlayerTable
Render player
------------------------------------------------------*/

class PlayerTable extends React.Component {

  render() {
    var onPlayerTableUpdate = this.props.onPlayerTableUpdate;
    var rowDel = this.props.onRowDel;
    var player = this.props.players.map(function(player) {
      return (<PlayerRow onPlayerTableUpdate={onPlayerTableUpdate} player={player} onDelEvent={rowDel} key={player.id}/>)
    });
    return (
      <div>
      <h2>Players List</h2>
      <br/>
      <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right">+ Add Player</button>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Number</th>
              <th>Size</th>
            </tr>
          </thead>

          <tbody>
            {player}

          </tbody>

        </table>
      </div>
    );

  }

}


/*------------------------------------------------------

PlayerRow
Render row
------------------------------------------------------*/

class PlayerRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.player);

  }
  render() {

    return (
      <tr className="eachRow">
        <td>{this.props.player.id}</td>
        {/*
        <EditableCell onPlayerTableUpdate={this.props.onPlayerTableUpdate} cellData={{
          "type": "id",
          value: this.props.player.id,
          id: this.props.player.id
        }}/>
      */}
        <EditableCell onPlayerTableUpdate={this.props.onPlayerTableUpdate} cellData={{
          type: "name",
          value: this.props.player.name,
          id: this.props.player.id
        }}/>
        <EditableCell onPlayerTableUpdate={this.props.onPlayerTableUpdate} cellData={{
          type: "number",
          value: this.props.player.number,
          id: this.props.player.id
        }}/>
        <EditableCell onPlayerTableUpdate={this.props.onPlayerTableUpdate} cellData={{
          type: "size",
          value: this.props.player.size,
          id: this.props.player.id
        }}/>
        <td className="del-cell">
          <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
        </td>
      </tr>
    );

  }

}
class EditableCell extends React.Component {

  render() {
    return (
      <td>
        <input type='text' name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onPlayerTableUpdate}/>
      </td>
    );

  }

}



/*------------------------------------------------------

BuyerDetails
For buyer to fill up his/her details

------------------------------------------------------*/

var BuyerDetails= React.createClass({ 
  handleChange: function() {
    this.props.onUserInput(
      this.props.orderNo,
      this.refs.nameInput.value,
      this.refs.addressInput.value,
      this.refs.cityInput.value,
      this.refs.stateInput.value,
      this.refs.zipCodeInput.value,
      this.refs.phoneInput.value,
      this.refs.emailInput.value
    );
  },
  
  render: function() {
    return (<div>
        <h2>Order Details:</h2>
        <form>

        <p>
        <label>Order No. : {this.props.orderNo}</label>
        </p>

        <p>
        <label>Name: </label>
        <input
          type="text"
          ref="nameInput"
          size="50"
          onChange={this.handleChange}  
        />
        </p>

        <p>
        <label>Shipping Address:</label>
        <textarea
          ref="addressInput"
          cols="40"
          rows="5"
          onChange={this.handleChange}  
        />
        </p>

        <p>
        <label>City:</label>
        <input
          type="text"
          ref="cityInput"
          onChange={this.handleChange}  
          />
        </p>
        <p>
        <label>State/Province:</label>
        <input
          type="text"
          ref="stateInput"
          onChange={this.handleChange}  
          />
        </p>

        <p>
        <label>Zipcode:</label>
        <input
          type="text"
          ref="zipCodeInput"
          size='8'
          onChange={this.handleChange}  
        />
        </p>

        <p>
        <label>Phone Number:</label>
        <input
          type="text"
          ref="phoneInput"
          size='12'
          onChange={this.handleChange}  
        />
        </p>

        <p>
        <label>E-mail Address:</label>
        <input
          type="text"
          ref="emailInput"  
          onChange={this.handleChange}  
        />
        </p>
        </form>
        </div>
    );
  }
});


/*------------------------------------------------------

Submit Button
send email to kijangjerseymaker@gmail.com
pwd:syukriah
------------------------------------------------------*/

var SubmitButton= React.createClass({   
  render: function() {
    return (
      <div>
        <form>
          <p>
            <input 
              type="button" 
              value="Submit Order"
              ref="submitButton"
              onClick={this.props.onClick}
              />
          </p>
        </form>
      </div>
    );
  }
});

/*------------------------------------------------------

App
main app

------------------------------------------------------*/

export var App = React.createClass({
  getInitialState () {
    var timestamp;//getUTCMilliseconds();
    var now = new Date();
    timestamp = now.getFullYear().toString(); // 2011
    timestamp += (now.getMonth() < 10 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString();
    timestamp += (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
    timestamp += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
    timestamp += (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd
    if(mm<10) mm='0'+mm
    today = mm+'/'+dd+'/'+yyyy;
    return {
      finishOrder:false,
      jerseyChosen:{},
      images: 
      [ 
        {loadingImage: false}, 
        {loadingImage: false},
        {loadingImage: false}
      ],

      activeImageIndex: 0,
      scale: 1,
      numberPreview:"1",
      namePreview:"Ahmad",
      players: 
      [ 
        {
          id: 1,
          name: 'Ahmad',
          number: '1',
          size: 'L'
        } 
      ],
      buyerDetails:
      {
        orderNo: timestamp,
        orderDate: today,
        name:'',
        address:'',
        city:'',
        stateProvince:'',
        zipcode:'',
        phoneNumber:'',
        email:''
      },
      totalPrice:0,
      designCanvas:null,
      userRate:null

    }
  },

  saveCanvas() {
    var canvas = document.getElementById("mycanvas");
    var img    = canvas.toDataURL("image/png");
    this.setState({designCanvas:img});
    //document.write('<img src="'+img+'"/>');
  },
  componentDidMount() {
    this.readDefaultSprite('orange')
this.updatePrice();
    //console.log(this.state.buyerDetails.orderNo)
  },

  readDefaultSprite(name) {
    var j = {jerseyChosen:defaultSprites[name]};
    this.setState(j);
    _.forEach(defaultSprites[name].sprites, (sprite, spriteIndex) => {
      readImageAsBase64('sprites/' + sprite, (base64) => {
        this.loadBase64Sprite(spriteIndex, base64);
      })
    })
    
    
  },

  onDrop (imageIndex, files) {
    this.readFile(imageIndex, files[0])
  },

  onDelLogo (imageIndex, files) {
    this.state.images[2] = {
        loadingImage: false
      }
      this.forceUpdate()
  },

  onSubmitOrder() {
    //TODO
    // SEND EMAIL
    /*console.log(this.state.buyerDetails);
    console.log(this.state.totalPrice);
    console.log(this.state.jerseyChosen);
    console.log(this.state.players);*/

    let confirmation = confirm('Confirm Submit Order?')
    if (!confirmation) return;


    var players = this.state.players
    var ps= ""
    for (var i=0;i<this.state.players.length;i++) {
      ps += "("+ (i+1).toString() + ") "
      ps += players[i].name + ", "
      ps += players[i].number + ","
      ps += players[i].size + ";\t"
    }

    console.log(ps);

    var d = {
      "buyerDetails":{
        "address": this.state.buyerDetails.address,
        "city": this.state.buyerDetails.city,
        "email": this.state.buyerDetails.email,
        "name": this.state.buyerDetails.name,
        "orderNo": this.state.buyerDetails.orderNo,
        "orderDate": this.state.buyerDetails.orderDate,
        "phoneNumber": this.state.buyerDetails.phoneNumber,
        "stateProvince": this.state.buyerDetails.stateProvince,
        "zipcode": this.state.buyerDetails.zipCode
      },
      "jerseyChosen":{
        "name":this.state.jerseyChosen.name,
        "price": this.priceToString(this.state.jerseyChosen.price)
      },
      "players": ps,
      "noOfPlayers":this.state.players.length,
      "totalPrice":this.priceToString(this.state.totalPrice),
      "userRate":this.state.userRate

    };

    emailjs.send("gmail","kijang_billing", d)
.then(function(response) {
   console.log("emailjs sending SUCCESS. status=%d, text=%s", response.status, response.text);
   //window.alert('Order Submission Succeeded! Please check your email '+ this.state.buyerDetails.email)
   //this.setState({finishOrder:true});
   //this.forceUpdate()

}, function(err) {
   console.log("FAILED. error=", err);
   //window.alert("Submission FAILED. Please check your email address (is it correct?) \n Error details:"+ err)
});

    this.setState({finishOrder:true});
   this.forceUpdate()
  },




  readFile(imageIndex, file) {
    var fr = new window.FileReader()

    this.state.images[imageIndex].loadingImage = true;
    this.forceUpdate()

    fr.onload = (data) => {
      const base64 = data.currentTarget.result

      if (base64.length > 10000) {
        let confirmation = confirm('Logo is very large. Confirm?')

        if(!confirmation) {
          this.state.images[imageIndex].loadingImage = false
          this.forceUpdate()
          return
        }
      }

      this.loadBase64Sprite(imageIndex, base64);
    }
    fr.readAsDataURL(file)
  },

  loadBase64Sprite(imageIndex, base64) {
    base64ImageToRGBArray(base64, (err, rgbArray) => {
      let imageHeight = _.reduce(rgbArray, (res, pixel) => {return Math.max(res, pixel.y)}, 0)
      let imageWidth = _.reduce(rgbArray, (res, pixel) => {return Math.max(res, pixel.x)}, 0)

      var activeImageCenter = _.find(rgbArray, {
        x: Math.floor(imageWidth / 2),
        y: Math.floor(imageHeight / 2)
      })
      var centerColor = activeImageCenter ? rgbToString(activeImageCenter.rgb) : '#fff'

      this.state.images[imageIndex] = {
        base64: base64,
        shadow: rgbArrayToShadow(rgbArray, this.state.scale, imageWidth, imageHeight),
        centerColor: centerColor,
        rgbArray: rgbArray,
        height: imageHeight,
        width: imageWidth,
        loadingImage: false
      }
      this.updatePrice();
      this.forceUpdate()
    })
  },

  updatePrice: function () {
    //console.log(this.state.jerseyChosen.price);
    var newPrice = this.state.players.length* this.state.jerseyChosen.price;
    this.setState({totalPrice:newPrice});
    this.forceUpdate()
  },

  handleUserInput: function(number, name) {
    this.setState({
      numberPreview: number,
      namePreview: name,
    });
  },

  handleRowDel(player) {
    var index = this.state.players.indexOf(player);
    this.state.players.splice(index, 1);
    this.updatePrice();
    this.setState(this.state.players);
  },

  handleAddEvent(evt) {
    var id = this.state.players.length+1;
    var player = {
      id: id,
      name: "",
      number: "",
      size: "",
    };

    console.log("Player added");
    this.state.players.push(player);
    this.updatePrice();
    this.setState(this.state.players);

  },

  handlePlayerTable(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var players = this.state.players;

    var newPlayers = players.map(function(player) {
      for (var key in player) {
        if (key == item.name && player.id == item.id) {
          //  console.log("inside mao");
          //   console.log(player);
          player.id = item.id;
          player[key] = item.value;

        }
      }
      return player;
    });

    this.setState(newPlayers);
    //console.log(this.state.players);
  },

  handleBuyerDetails: function(no,name,address,city,
    stateProvince,zipCode,phoneNumber,email) {
    var details = {buyerDetails: {
        orderNo: no,
        name:name,
        address:address,
        city:city,
        stateProvince:stateProvince,
        zipcode:zipCode,
        phoneNumber:phoneNumber,
        email:email
      }};
    this.setState(details);
  },

  handleRate: function (rate){
    if (rate!=undefined) this.setState({userRate:rate})
    console.log (this.state.userRate)
  },

  priceToString: function(p) {
    var fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MYR',
  currencyDisplay:'symbol',
  minimumFractionDigits: 2,
});
    return fmt.format(p)

  },

  render: function(){
    
    var {images, activeImageIndex, scale} = this.state
    var ready = images[0].shadow && images[1].shadow

    var activeImage = images[activeImageIndex]

    var fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MYR',
  currencyDisplay:'symbol',
  minimumFractionDigits: 2,
});

    if (this.state.finishOrder == true)
      return (
        <h2>
        Order Submission Succeeded! Please check your email {this.state.buyerDetails.email}
        </h2>
      )



    return (
      <div className='padding-horizontal-2x'>
        <h2>Select jersey design</h2>

        {_.map(defaultSprites, (sprite, spriteIndex) => {
            var path="sprites/"+sprite.sprites[0];
            return (
              <a className='button' onClick={this.readDefaultSprite.bind(null, spriteIndex)} key={spriteIndex}>
                <img src={path} alt={sprite.name} height="64" width="64" />
                <br/>
                {fmt.format(sprite.price)}
              </a>
            )
          })
        }
        <div className='dropZone-container'>
          <Dropzone onDrop={this.onDrop.bind(null, 2)} className='dropZone'>
            {images[2].base64 && <img src={images[2].base64} />}
            {images[2].loadingImage ? 'Processing...' : 'Add logo (optional)'}
          </Dropzone>
          {images[2].base64 &&
            (<input type="button" onClick={this.onDelLogo} value="Remove logo" className="del-btn"/>)
          }
        </div>

        <br /><br />

        <h2>Preview number and name:</h2>
        <div>
        <PreviewInput
          numberPreview={this.state.numberPreview}
          namePreview={this.state.namePreview}
          onUserInput={this.handleUserInput}
        />
        </div>

        <div>
          {ready ? '' : 'Select a design first to preview'}
        </div>
        <br />

        <div>
        {ready && 
          (
            <Graphic 
              shirtFrontSrc={images[0].base64} 
              shirtBackSrc={images[1].base64}
              logoSrc={images[2].base64}
              numberPreview={this.state.numberPreview}
              namePreview={this.state.namePreview}
            />
          )
        }
        </div>

        <div>
          <PlayerTable
            onPlayerTableUpdate={this.handlePlayerTable} 
            onRowAdd={this.handleAddEvent} 
            onRowDel={this.handleRowDel} 
            players={this.state.players} />
        </div>  
        <br/>
  
        <div>
        <BuyerDetails 
          orderNo={this.state.buyerDetails.orderNo}
          name={this.state.buyerDetails.name}
          address={this.state.buyerDetails.address}
          city={this.state.buyerDetails.city}
          stateProvince={this.state.buyerDetails.stateProvince}
          zipcode={this.state.buyerDetails.zipCode}
          phoneNumber={this.state.buyerDetails.phoneNumber}
          email={this.state.buyerDetails.email}
          onUserInput={this.handleBuyerDetails}
        />
        <br/>
        
        <h2>Total Price:</h2>
         {fmt.format(this.state.jerseyChosen.price)} x {this.state.players.length} unit{this.state.players.length>1? 's':''}
        <br/>
        <h3>
        = {fmt.format(this.state.totalPrice)} 
        </h3>       
        <br/>

        <h3>Rate this web app, thanks!</h3>
        <Rating
           onRate={this.handleRate}
        />


        <br/>

        <p>
          <input 
            type="button" 
            value="Submit Order"
            ref="submitButton"
            onClick={this.onSubmitOrder}
          />
        </p>
        {/*}
        <SubmitButton
          buyerDetails={this.state.buyerDetails}
          onClick={this.onSubmitOrder}
        />*/}
        </div>
        
{/*


        
      </form>


        {ready && (
          <div className='pixela' style={{
            height: scale,
            width: scale,
            boxShadow: activeImage.shadow,
            backgraoundColor: activeImage.centerColor,
            marginBottom: Math.max(images[0].height, images[1].height) * scale / 2,
            marginTop: Math.max(images[0].height, images[1].height) * scale / 2,
            marginRight: Math.max(images[0].width, images[1].width) * scale / 2,
            marginLeft: Math.max(images[0].width, images[1].width) * scale / 2
          }} />
        )}

        {/*ready && (
          <div className='big-button-wrapper'>
            <a className="big-button" onClick={this.onDownloadCode}>Download your animation code!</a>
          </div>
        )*/}
      </div> 
    );
  }
})


export const DrawApp = React.createClass({
getInitialState () {
    return {
      numberPreview:"1",
      namePreview:"Ahmad",
    }
  },


  handleUserInput: function(number, name) {
    this.setState({
      numberPreview: number,
      namePreview: name,
    });
  },

  render: function(){
    return (
        <div>
        <PreviewInput
          numberPreview={this.state.numberPreview}
          namePreview={this.state.namePreview}
          onUserInput={this.handleUserInput}
        />
        </div>
    );
  }
});



/*
var testData = {

buyerDetails:{
address: "UTM Skudai",
city: "Skudai",
email: "raden.m.muaz@gmail.com",
name: "Raden Muaz",
orderNo: "20160718084915",
phoneNumber: "0197123456",
stateProvince: "Johor",
zipcode: "81310"
},

jerseyChosen:{name: "White", price: 30, sprites: Array[2]},

players:{
  
  0:{id: 1,
name: "Ahmad",
number: "1",
size: "L"},

  1:{id: "2",
name: "Ali",
number: "2",
size: "M"}
}

};

console.log(testData)*/


/*var testData = {

"buyerDetails":{
"address": "UTM Skudai",
"city": "Skudai",
"email": "raden.m.muaz@gmail.com",
"name": "Raden Muaz",
"orderNo": "20160718084915",
"phoneNumber": "0197123456",
"stateProvince": "Johor",
"zipcode": "81310"
},

"jerseyChosen":{"name": "White", "price": 30},

"players":{
  
  "0":{"id": 1,
"name": "Ahmad",
"number": "1",
"size": "L"},

  "1":{"id": "2",
"name": "Ali",
"number": "2",
"size": "M"}
},

totalPrice:'60.00'
};*/

/*Order Details:  (Order No {{buyerDetails.orderNo}})

Buyer's Particular

Name: {{buyerDetails.name}}

Address: {{buyerDetails.address}}

City :{{buyerDetails.city}}

State/Province: {{buyerDetails.stateProvince}}

Zip Code: {{buyerDetails.zipCode}}

Phone Number: {{buyerDetails.phoneNumber}}

Jersey Design {{jerseyChosen.name}}

List of Players Name Number and Sizes:

{{players}}*/