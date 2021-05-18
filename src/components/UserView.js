import React, { Component } from 'react';
import UserDelete from '../components/UserDelete.js'
import { Link } from "react-router-dom";

export default class UserView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      user: {},
    }
  }

  getUser = () => {
    console.log(this.state);
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
        this.setState({ user: data.data })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.getUser();
  }

  render () {
    return (
      <>
        <table>
          <tbody>
            { this.state.userLoggedin
              ? (this.state.curUser.id == this.state.user.id
                ? <tr>
                  <td></td>
                  <td>
                    <Link to={"/useredit?id=" + this.state.user.id}><button type="button">Edit</button></Link>
                    &nbsp;
                    <UserDelete baseURL={this.state.baseURL} endpt={this.state.endpt} checkLogin={this.state.checkLogin} redirectFunc={this.state.redirectFunc} id={this.state.user.id} />
                  </td>
                </tr>
                :<></>
              )
              : <></>
            }
            <tr>
              <td>Username:</td>
              <td>{this.state.user.username}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{this.state.user.email}</td>
            </tr>
            <tr>
              <td>Bio:</td>
              <td>{this.state.user.bio}</td>
            </tr>
          </tbody>
        </table>
      </>

    )
  }
}
