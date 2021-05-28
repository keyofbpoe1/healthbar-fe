import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';
import ReactDOM from 'react-dom'
// import Slider from '@material-ui/core/Slider'
// import Button from '@material-ui/core/Button'
// import { withStyles } from '@material-ui/core/styles'
import Cropper from 'react-easy-crop'
// import ImgDialog from './ImgDialog'
import getCroppedImg from './cropImage'
// import './styles.css'

const minZoom = 0.4

export default class App extends Component {
  state = {
    imageSrc: this.props.img,
    crop: { x: 0, y: 0 },
    zoom: minZoom,
    aspect: 3 / 3,
    croppedAreaPixels: null,
    croppedImage: null,
    setCroppedImg: this.props.setCroppedImg,
    toggleCrop: this.props.toggleCrop,
  }

  onCropChange = (crop) => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
    this.setState({ croppedAreaPixels })
  }

  onZoomChange = (zoom) => {
    this.setState({ zoom })
  }

  showCroppedImage = async () => {
    const croppedImage = await getCroppedImg(
      this.state.imageSrc,
      this.state.croppedAreaPixels
    )
    console.log(croppedImage)
    this.setState({ croppedImage })
    this.state.setCroppedImg(croppedImage)
  }

  handleClose = () => {
    this.setState({ croppedImage: null })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <div className="crop-container">
          <Cropper
            minZoom={minZoom}
            image={this.state.imageSrc}
            crop={this.state.crop}
            zoom={this.state.zoom}
            aspect={this.state.aspect}
            restrictPosition={false}
            onCropChange={this.onCropChange}
            onCropComplete={this.onCropComplete}
            onZoomChange={this.onZoomChange}
          />
        </div>
        <div className="controls">
        <input type="range"
          value={this.state.zoom}
          min={minZoom}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => this.onZoomChange(zoom)}
          classes={{ container: 'slider' }}
        />
        &nbsp;&nbsp;&nbsp;
          <Button onClick={this.showCroppedImage}>Crop</Button>
          &nbsp;
          <Button onClick={this.state.toggleCrop}>Close</Button>
        </div>
      </div>
    )
  }
}

// const styles = {
//   cropButton: {
//     flexShrink: 0,
//     marginLeft: 16,
//   },
// }

// classes={{ root: classes.cropButton }}

// <ImgDialog img={this.state.croppedImage} onClose={this.handleClose} />

// const StyledApp = withStyles(styles)(App)
//
// const rootElement = document.getElementById('root')
// ReactDOM.render(<StyledApp />, rootElement)

// <Slider
//   value={this.state.zoom}
//   min={minZoom}
//   max={3}
//   step={0.1}
//   aria-labelledby="Zoom"
//   onChange={(e, zoom) => this.onZoomChange(zoom)}
//   classes={{ container: 'slider' }}
// />
