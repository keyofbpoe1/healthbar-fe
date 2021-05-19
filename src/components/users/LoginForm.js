import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/login',
      username: '',
      password: '',
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
      password: this.state.password,
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
          password: ''
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
      <form onSubmit={this.handleLogin}>
        <h3>Login</h3>
        <p className="rederror">{this.state.errorMsg}</p>
        <label htmlFor="username"></label>
        <input type="text" id="username" name="username" onChange={this.handleChange} value={this.state.username} placeholder="username" required/>
        <br/>
        <label htmlFor="password"></label>
        <input type="password" id="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="password" required/>
        <br/>
        <input type="submit" value="Login"/>
        <Link to="/"><button type="button">Cancel</button></Link>
      </form>
    )
  }
}
