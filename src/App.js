var React = require('react')
var ReactDOM = require('react-dom')


var _ = require('lodash')
var Dropzone = require('react-dropzone')

var download = require('./lib/download.js')
var compressColor = require('./lib/compress-color.js')
var readImageAsBase64 = require('./lib/read-image-as-base64.js');


/*------------------------------------------------------

Sprites related variables and functions

------------------------------------------------------*/

var defaultSprites = {
  white: {
    name: 'White',
    sprites: ['white_front.png', 'white_back.png']
  },
  blue: {
    name: 'Blue',
    sprites: ['blue_front.png', 'blue_back.png']
  },
  green: {
    name: 'Green',
    sprites: ['green_front.png', 'green_back.png']
  },
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
      width:768,
      height:300,
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

    
    var shirtFrontPos=[((1/20)*this.state.width),((1/10)*this.state.height)];
    var shirtBackPos=[((10/20)*this.state.width),((1/10)*this.state.height)];
    context.drawImage(shirtFront,shirtFrontPos[0],shirtFrontPos[1]);
    context.drawImage(shirtBack,shirtBackPos[0],shirtBackPos[1]);
    

    
    context.textAlign="center";

    var numberOffset=[shirtFront.width/2, shirtFront.height/2];
    var numberPos=[shirtBackPos[0]+numberOffset[0],shirtBackPos[1]+numberOffset[1]];
    context.font = "90px sans";
    context.fillText(this.props.numberPreview, numberPos[0], numberPos[1]);
    
    var nameOffset=[shirtFront.width/2, (3/4)*shirtFront.height];
    var namePos=[shirtBackPos[0]+nameOffset[0],shirtBackPos[1]+nameOffset[1]];
    context.font = "32px sans";
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
    return <canvas width={this.state.width} height={this.state.height} />;
  }

});


/*------------------------------------------------------

PreviewInput
Input for Preview shirt with user given number and name

------------------------------------------------------*/



var PreviewInput = React.createClass({ 
  handleChange: function() {
    console.log("value is " + this.refs.num.value);

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
          placeholder="..."
          value={this.props.numberPreview}
          ref="num"
          onChange={this.handleChange}       
        />
        <p>
        <input
          type="text"
          placeholder="..."
          value={this.props.namePreview}
          ref="name"
          onChange={this.handleChange}
        /></p>
      </form>
    );
  }
});


/*------------------------------------------------------

App
main app

------------------------------------------------------*/

export var App = React.createClass({
  getInitialState () {
    return {
      shirt: null,
      images: [{
        loadingImage: false
      }, {
        loadingImage: false
      }],
      activeImageIndex: 0,
      scale: 1,
      numberPreview:"1",
      namePreview:"Ahmad",
    }
  },

  //componentDidMount() {
    //this.readDefaultSprite('white')
  //},

  readDefaultSprite(name) {
    _.forEach(defaultSprites[name].sprites, (sprite, spriteIndex) => {
      readImageAsBase64('sprites/' + sprite, (base64) => {
        this.loadBase64Sprite(spriteIndex, base64)
      })
    })
  },

  onDrop (imageIndex, files) {
    //this.readFile(imageIndex, files[0])
  },

  readFile(imageIndex, file) {
    var fr = new window.FileReader()

    this.state.images[imageIndex].loadingImage = true;
    this.forceUpdate()

    fr.onload = (data) => {
      const base64 = data.currentTarget.result

      if (base64.length > 10000) {
        let confirmation = confirm('Your image is really big! Do you really want to TRY to animate it?')

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
      this.forceUpdate()
    })
  },

  handleUserInput: function(number, name) {
    console.log("at handle");
    this.setState({
      numberPreview: number,
      namePreview: name,
    });
  },

  render: function(){
    var {images, activeImageIndex, scale} = this.state
    var ready = images[0].shadow && images[1].shadow

    var activeImage = images[activeImageIndex]

    return (
      <div className='padding-horizontal-2x'>
        

        Select jersey design

        {_.map(defaultSprites, (sprite, spriteIndex) => {
            var path="sprites/"+sprite.sprites[0];
            return (
              <a className='button' onClick={this.readDefaultSprite.bind(null, spriteIndex)} key={spriteIndex}>
                <img src={path} alt={sprite.name} height="64" width="64" />
                {}
              </a>
            )
          })
        }
        <div className='dropZone-container'>
          <Dropzone onDrop={this.onDrop.bind(null, 0)} className='dropZone'>
            {/* images[0].base64 && <img src={images[0].base64} / >*/}
            {images[0].loadingImage ? 'Processing...' : 'Add logo'}
          </Dropzone>
        </div>

        <br /><br />

        Preview number and name:
        <div>
        <PreviewInput
          numberPreview={this.state.numberPreview}
          namePreview={this.state.namePreview}
          onUserInput={this.handleUserInput}
        />
        </div>

        <div>
          {ready ? 'Preview:' : 'Select a design first to preview'}
        </div>
        <br />

        <div>
        {ready && 
          (
            <Graphic 
              shirtFrontSrc={images[0].base64} 
              shirtBackSrc={images[1].base64} 
              numberPreview={this.state.numberPreview}
              namePreview={this.state.namePreview}
            />
          )
        }
        </div>
{/*
        <label>Order Details:</label>
        <form>

        <p>
        <label>Order No. : </label>{new Date().getUTCMilliseconds()}
        </p>

        <p>
        <label>Name: </label>
        <input
          type="text"
          placeholder=""

          ref="nameInput"
          size="50"
        />
        </p>

        <p>
        <label>Shipping Address:</label>
        <textarea
          placeholder=""

          ref="addressInput"
          cols="40"
          rows="5"
        />
        </p>

        <p>
        <label>City:</label>
        <input
          type="text"
          placeholder=""

          ref="cityInput"
          />
        </p>


 
        <p>
        <label>State/Province:</label>
        <input
          type="text"
          placeholder=""

          ref="stateInput"
          />
        </p>

        <p>
        <label>Zipcode:</label>
        <input
          type="text"
          placeholder=""

          ref="zipCodeInput"
          size='8'
        />
        </p>

        <p>
        <label>Phone Number:</label>
        <input
          type="text"
          placeholder=""

          ref="phoneInput"
          size='12'
        />
        </p>

        <p>
        <label>E-mail Address:</label>
        <input
          type="text"
          placeholder=""
          ref="emailInput"
          
        />
        </p>

        
        

        
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange}
          />
          {' '}
          Only show products in stock
        </p>
      
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
    console.log("at handle");
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