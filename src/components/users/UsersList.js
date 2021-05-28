import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
} from '@fortawesome/free-solid-svg-icons'

export default class UsersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      user: this.props.user,
      avatar: '/user-circle-solid.svg',
    }
  }

  getProfPic = () => {

    fetch(this.state.baseURL + '/api/v1/uploads/upload/avatar/' + this.state.user.user_avatar, {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
        if (data.type !== 'text/html') {
        this.setState({
          avatar: URL.createObjectURL(data),
        });
      }
    })
    .catch(error => console.log('error', error));

  }

  componentDidMount(){
    this.getProfPic();
  }

  render () {
    return (
      <tr>
        <td>
          <FontAwesomeIcon icon={faUser} />&nbsp;&nbsp;&nbsp;{this.state.user.role}
        </td>
        <td>
          <img id={"icUsImage-" + this.state.user.id} className="icImage" src={this.state.avatar} alt="Avatar"/>
          &nbsp;
          <Link to={"/users?id=" + this.state.user.id}>{this.state.user.username}</Link>
        </td>
      </tr>
    )
  }
}
