import React, { Component } from 'react';

export default class LogoutForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/logout',
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
    }
  }

  onLogout = () => {
    let reqURL = this.state.baseURL + this.state.endpt;

    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(reqURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.state.checkLogin()
        this.state.redirectFunc('/')
      })
      .catch(error => console.log('error', error));
  }

  render () {
    return (
      <button type="button" onClick={this.onLogout}>Logout</button>
    )
  }
}
