import React, { Component } from 'react';
import { Link } from "react-router-dom";

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
        if (data.status.code != 200) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.state.checkLogin()
          this.state.redirectFunc('/users?id=' + this.state.user.id)
        }
      })
      .catch(error => console.log('error', error));
  }

  render () {
    return (
      <>
        { this.state.userLoggedin
          ? (this.state.curUser.id == this.state.user.id || this.state.curUser.role == 'admin'
            ? <form onSubmit={this.handleUsUpdate}>
                <h3>Edit Profile</h3>
                <p className="rederror">{this.state.errorMsg}</p>
                <label htmlFor="username"></label>
                <input type="text" id="username" name="username" onChange={this.handleChange} value={this.state.username} placeholder="username" required/>
                <br/>
                <label htmlFor="email"></label>
                <input type="email" id="email" name="email" onChange={this.handleChange} value={this.state.email} placeholder="email address" required/>
                <br/>
                <label htmlFor="bio"></label>
                <textarea id="bio" name="bio" rows="8" cols="80" onChange={this.handleChange} value={this.state.bio} placeholder="Tell us about yourself!"></textarea>
                <br/>
                { this.state.curUser.role == 'admin' &&
                  <>
                    <label htmlFor="role"></label>
                    <select name="role" id="role" onChange={this.handleChange} value={this.state.role} required>
                      <option disabled value=""> -- Select -- </option>
                      <option value="user">User</option>
                      <option value="professional">Professional</option>
                      <option value="admin">Admin</option>
                    </select>
                    <br/>
                  </>
                }

                <input type="submit" value="Update"/>
                <Link to="/"><button type="button">Cancel</button></Link>
              </form>
            : <h1>Unauthorized</h1>
          )
          : <h1>Unauthorized</h1>
        }
      </>
    )
  }
}
