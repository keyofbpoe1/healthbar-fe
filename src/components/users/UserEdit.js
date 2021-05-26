import React, { Component } from 'react';
import Cropper from 'react-easy-crop'
import { Link } from "react-router-dom";
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faTrash,
  faUser,
  faKey,
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
        })
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

    let raw = JSON.stringify({
      username: this.state.username,
      email: this.state.email,
      bio: this.state.bio,
      role: this.state.role,
    });

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
          this.handleImage()
          // this.state.checkLogin()
          // this.state.redirectFunc('/users?id=' + this.state.user.id)
        }
      })
      .catch(error => console.log('error', error));
  }

  handleImage = () => {
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);

    fetch(this.state.baseURL + '/api/v1/uploads/upload', {
      method: 'POST',
      body: data,
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
      // this.setState({ imageURL: URL.createObjectURL(data) });
    });
  }

  imgChange = (evt) => {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    console.log(files[0].size);

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            window.document.getElementById('outImage').src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
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
                  <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                  <div>
                  <label for="avatar">Avatar</label>
                  </div>
                  <FormControl
                    id="avatar"
                    ref={(ref) => { this.uploadInput = ref; }}
                    type="file"
                    accept="image/*"
                    onChange={this.imgChange}
                  />
                  <div>
                    <img id="outImage" className="outImage" src="/user-circle-solid.svg" alt="healthBar"/>
                  </div>

                  <Form.File
                    className="sminp"
                    id="custom-file"
                    label="Avatar"
                    custom
                    onChange={this.imgChange}
                  />
                </div>

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
                <br/>
                <textarea id="bio" name="bio" rows="8" cols="80" onChange={this.handleChange} value={this.state.bio} placeholder="Tell us about yourself!"></textarea>
                <br/>
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
