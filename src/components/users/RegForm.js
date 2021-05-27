import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faKey,
} from '@fortawesome/free-solid-svg-icons'

export default class RegForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/register',
      username: '',
      email: '',
      password: '',
      confpassword: '',
      bio: '',
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      errorMsg: '',
      avatar: '/user-circle-solid.svg',
    }
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleLogin = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let reqObj = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      bio: this.state.bio,
      user_avatar: 'null',
    }

    if (this.state.newAvatar) {
      reqObj.user_avatar = this.state.newAvatar;
    }

    let raw = JSON.stringify(reqObj);

    let requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(reqURL, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // this.setState({
        //   // username: '',
        //   // email: '',
        //   password: '',
        //   // bio: ''
        // })
        if (data.status.code === 401) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.handleImage()
          // this.state.checkLogin()
          // this.state.redirectFunc('/')
        }
      })
      .catch(error => console.log('error', error));
  }

  handleImage = () => {

    const data = new FormData();
    if (this.uploadInput.files[0]) {
      data.append('file', this.uploadInput.files[0]);

      fetch(this.state.baseURL + '/api/v1/uploads/upload/' +  'avatar/' + this.state.username + '-profpic', {
        credentials: 'include',
        method: 'POST',
        body: data,
        redirect: 'follow',
      })
      .then(response => response.blob())
      .then(data => {
        console.log(data);
        this.setState({
          username: '',
          email: '',
          password: '',
          bio: ''
        }, () => {
          this.state.checkLogin();
          this.state.redirectFunc('/');
        })

      });
    }
    else {
      console.log('nope');
      this.setState({
        username: '',
        email: '',
        password: '',
        bio: ''
      }, () => {
        this.state.checkLogin();
        this.state.redirectFunc('/');
      })
      
    }
  }

  imgChange = (evt) => {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    console.log(files[0].size);
    console.log(files[0].name);
    let fTypeArr = files[0].name.split(/\./);
    let fType = fTypeArr[fTypeArr.length - 1];
    console.log(fType);

    console.log(this.state.username + '-profpic.' + fType);

    this.setState({
      newAvatar: this.state.username + '-profpic.' + fType,
    });

    // this.state.user.username + '-profpic.' + this.uploadInput.files[0].type;

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
      <div className="editingdiv logindiv regdiv">
        <form onSubmit={this.handleLogin}>
          <h3>Register</h3>
          <p className="rederror">{this.state.errorMsg}</p>

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

          <InputGroup className="sminp">
            <InputGroup.Prepend>
              <InputGroup.Text style={{fontWeight: "bold"}}>
                <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              id="confpassword"
              name="confpassword"
              onChange={this.handleChange}
              value={this.state.confpassword}
              placeholder="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              required
            />
          </InputGroup>

          <InputGroup className="sminp">
            <InputGroup.Prepend>
              <InputGroup.Text style={{fontWeight: "bold"}}>
                <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              id="password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              placeholder="confirm password"
              pattern={this.state.confpassword}
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              required
            />
          </InputGroup>

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
          </div>
          <br/>
          <textarea id="bio" name="bio" rows="8" cols="80" onChange={this.handleChange} value={this.state.bio} placeholder="Tell us about yourself!" title="Tell us about yourself!"></textarea>
          <br/><br/>
            <Button type="submit" value="Register">Register</Button>
            &nbsp;
            <Link to="/"><Button type="button">Cancel</Button></Link>
        </form>
      </div>
    )
  }
}
