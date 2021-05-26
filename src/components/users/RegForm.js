import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, InputGroup, FormControl } from 'react-bootstrap';

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

    let raw = JSON.stringify({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      bio: this.state.bio,
      avatar: 'ddd',
    });

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
        this.setState({
          username: '',
          email: '',
          password: '',
          bio: ''
        })
        if (data.status.code === 401) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.state.checkLogin()
          this.state.redirectFunc('/')
        }
      })
      .catch(error => console.log('error', error));
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
