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

    fetch(this.state.baseURL + '/api/v1/uploads/uploads/avatar/' + this.state.user.user_avatar, {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
        if (!data.type.match(/text\/html/gmi)) {
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

          <Link to={"/users?id=" + this.state.user.id}>
            <img id={"icUsImage-" + this.state.user.id} className="icImage" src={this.state.avatar} alt="Avatar"/>
            &nbsp;
            {this.state.user.username}
          </Link>
        </td>
      </tr>
    )
  }
}
