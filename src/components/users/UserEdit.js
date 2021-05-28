import React, { Component } from 'react';
// import Cropper from 'react-easy-crop'
import CropForm from '../uploads/CropForm.js'
import { Link } from "react-router-dom";
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faTrash,
  faUser,
  faKey,
  faCrop,
} from '@fortawesome/free-solid-svg-icons'

// const Demo = () => {
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     console.log(croppedArea, croppedAreaPixels)
//   }, [])
// }

export default class UserEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // baseURL: this.props.baseURL,
      // endpt: this.props.endpt + '/update',
      username: '',
      email: '',
      bio: '',
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      user: {},
      errorMsg: '',
      role: '',
      avatar: '/user-circle-solid.svg',
      custimg: false,
      showCropper: false,
      cropConts: false,
      // newAvatar: 'null',
    }
  }

  getUser = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get('id');
    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL +  this.state.endpt + idParam, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          user: data.data,
          username: data.data.username,
          email: data.data.email,
          bio: data.data.bio,
          role: data.data.role,
        }, () => {
          this.getProfPic()
        })
      })
      .catch(error => console.log('error', error));
  }

  getProfPic = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('folder', 'avatar/');
    myHeaders.append('fname', this.state.user.user_avatar);

    fetch(this.state.baseURL + '/api/v1/uploads/upload', {
      credentials: 'include',
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
      console.log(data.type);
      if (data.type !== 'text/html') {
        this.setState({
          avatar: URL.createObjectURL(data),
          cropConts: true,
        });
      }

    })
    .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.getUser();
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleUsUpdate = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt + this.state.user.id;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let reqObj = {
      username: this.state.username,
      email: this.state.email,
      bio: this.state.bio,
      role: this.state.role,
    }

    if (this.state.newAvatar) {
      reqObj.user_avatar = this.state.newAvatar;
    }

    let raw = JSON.stringify(reqObj);

    console.log(raw);

    let requestOptions = {
      credentials: 'include',
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(reqURL, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          username: '',
          email: '',
          bio: ''
        })
        if (data.status.code !== 200) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          if (this.state.custimg) {
            this.handleImage()
          }
          else {
            this.setState({
              avatar: '/user-circle-solid.svg',
              custimg: false,
              showCropper: false,
              cropConts: false,
            }, () => {
              this.state.checkLogin();
              this.state.redirectFunc('/users?id=' + this.state.user.id);
            })
          }
        }
      })
      .catch(error => console.log('error', error));
  }

  blobToFile = (theBlob, fileName) => {
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
  }

  handleImage = () => {

    //get image blob
    fetch(window.document.getElementById('outImage').src, {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
      let myFile = this.blobToFile(data, this.state.newAvatar);
      this.uplImg(myFile);
    });
  }

  uplImg = (myFile) => {
    const data = new FormData();

    data.append('file', myFile);
    data.append('folder', 'avatar/');
    data.append('fname', this.state.newAvatar);

    fetch(this.state.baseURL + '/api/v1/uploads/upload', {
      credentials: 'include',
      method: 'POST',
      body: data,
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
      this.setState({
        avatar: '/user-circle-solid.svg',
        custimg: false,
        showCropper: false,
        cropConts: false,
      }, () => {
        this.state.checkLogin();
        this.state.redirectFunc('/users?id=' + this.state.user.id);
      })
    });

  }

  imgChange = (evt) => {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    console.log(files[0].name);
    let fTypeArr = files[0].name.split(/\./);
    let fType = fTypeArr[fTypeArr.length - 1];

    let newName = this.state.user.username + '-profpic.' + fType;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => {
            // window.document.getElementById('outImage').src = fr.result;
            this.setState({
              avatar: fr.result,
              newAvatar: newName,
              custimg: true,
              cropConts: true,
            });
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
  }

  toggleCrop = (e) => {
    e.preventDefault();

    this.setState({
      showCropper: !this.state.showCropper,
    });
  }

  setCroppedImg = (img) => {
    this.setState({
      avatar: img,
      newAvatar: this.state.user.username + '-profpic.png',
      custimg: true,
    });
  }

  discardImg = (e) => {
    e.preventDefault();

    this.setState({
      avatar: '/user-circle-solid.svg',
      newAvatar: '/user-circle-solid.svg',
      custimg: false,
      cropConts: false,
    });
  }

  render () {
    return (
      <div className="editingdiv">
        { this.state.userLoggedin
          ? (this.state.curUser.id === this.state.user.id || this.state.curUser.role === 'admin'
            ? <form onSubmit={this.handleUsUpdate}>
                <h3>Edit Profile</h3>
                <p className="rederror">{this.state.errorMsg}</p>

                <div>
                  <Form.File
                    className="sminp"
                    label="Avatar"
                    custom
                    id="avatar"
                    ref={(ref) => { this.uploadInput = ref; }}
                    type="file"
                    accept="image/*"
                    onChange={this.imgChange}
                  />
                </div>

                <div>
                  <img id="outImage" className="outImage" src={this.state.avatar} alt="Avatar"/>

                  {this.state.cropConts &&
                    <>
                      &nbsp;&nbsp;&nbsp;
                      <a href="" onClick={this.toggleCrop}>
                        <FontAwesomeIcon icon={faCrop} />
                      </a>
                      &nbsp;
                      <a href="" onClick={this.discardImg}>
                        <FontAwesomeIcon icon={faTrash} />
                      </a>
                    </>
                  }
                </div>

                {this.state.showCropper &&
                  <CropForm img={this.state.avatar} setCroppedImg={this.setCroppedImg} toggleCrop={this.toggleCrop} />
                }

                <InputGroup className="sminp">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="text"
                    id="username"
                    name="username"
                    onChange={this.handleChange}
                    value={this.state.username}
                    placeholder="Username"
                    title="Username"
                    required
                  />
                </InputGroup>

                <InputGroup className="sminp">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{fontWeight: "bold"}}>
                      @
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="email"
                    id="email"
                    name="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                    placeholder="Email Address"
                    title="Email Address"
                    required
                  />
                </InputGroup>



                <label htmlFor="bio"></label>
                <div className="txtcont">
                  <textarea id="bio" name="bio" rows="8" cols="80" onChange={this.handleChange} value={this.state.bio} placeholder="Tell us about yourself!"></textarea>
                </div>
                { this.state.curUser.role === 'admin' &&
                  <>
                    <FormControl className="sminp" as="select" name="role" id="role" title="Role" onChange={this.handleChange} value={this.state.role} required>
                      <option disabled value=""> -- Select -- </option>
                      <option value="user">User</option>
                      <option value="professional">Professional</option>
                      <option value="admin">Admin</option>
                    </FormControl>
                    <br/>
                  </>
                }
                <div className="righttxt">
                  <a href="" onClick={this.handleUsUpdate} title="Save Changes"><FontAwesomeIcon icon={faSave} style={{ fontSize: '25px' }} /></a>
                  &nbsp;
                  <Link to={"/users?id=" + this.state.user.id} title="Discard Changes"><FontAwesomeIcon icon={faTrash} style={{ fontSize: '25px' }} /></Link>
                </div>
              </form>
            : <h1>Unauthorized</h1>
          )
          : <h1>Unauthorized</h1>
        }
      </div>
    )
  }
}

// <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
// <div>
// <label for="avatar">Avatar</label>
// </div>
// <FormControl
//   id="avatar"
//   ref={(ref) => { this.uploadInput = ref; }}
//   type="file"
//   accept="image/*"
//   onChange={this.imgChange}
// />
// <div>
//   <img id="outImage" className="outImage" src="/user-circle-solid.svg" alt="healthBar"/>
// </div>
