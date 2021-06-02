import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
} from '@fortawesome/free-solid-svg-icons'

export default class EndShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: '/api/v1/endorsements/',
      curEnd: this.props.curEnd,
      avatar: '/user-circle-solid.svg',
      errorMsg: '',
    }
  }

  getProfPic = () => {

    fetch(this.state.baseURL + '/api/v1/uploads/uploads/avatar/' + this.state.curEnd.endorser.user_avatar, {
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

      <li>
        <Link to={"/users?id=" + this.state.curEnd.endorser.id}>
          <img className="icImage" src={this.state.avatar} alt="Avatar" />
          &nbsp;
          {this.state.curEnd.endorser.username}
        </Link>
      </li>

    )
  }
}
