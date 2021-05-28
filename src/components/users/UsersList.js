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

  // blobToFile = (theBlob, fileName) => {
  //     //A Blob() is almost a File() - it's just missing the two properties below which we will add
  //     theBlob.lastModifiedDate = new Date();
  //     theBlob.name = fileName;
  //     console.log(theBlob);
  //     return theBlob;
  // }

  getProfPic = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('folder', 'avatar/');
    myHeaders.append('fname', this.state.user.user_avatar);

    fetch(this.state.baseURL + '/api/v1/uploads/upload', {
      credentials: 'include',
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
        if (data.type !== 'text/html') {
        // let myFile = this.blobToFile(data, this.state.user.user_avatar);
        // let myUrl = URL.createObjectURL(myFile);
        this.setState({
          avatar: URL.createObjectURL(data),
        });
      }
    })
    .catch(error => console.log('error', error));

    // .then(data => {
    //   console.log(data);
    //   console.log(data.type);
    //   if (data.type !== 'text/html') {
    //     this.setState({
    //       avatar: URL.createObjectURL(data),
    //     });
    //   }
    // })
    // .catch(error => console.log('error', error));

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
