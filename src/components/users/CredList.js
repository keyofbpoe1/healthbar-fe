import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

export default class CredList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curUser: this.props.curUser,
      user: this.props.user,
      baseURL: this.props.baseURL,
      cred: this.props.cred,
      endpt: '/api/v1/credentials/' + this.props.cred.id,
      files: [],
      errorMsg: '',
      updCreds: this.props.updCreds,
    }
  }

  parseFiles = () => {
    if (this.state.cred.files) {
      let filesArr = this.state.cred.files.split(";");
      filesArr.forEach((file, i) => {
        this.getFile(file);
      });
    }
  }

  getFile = (file) => {

    fetch(this.state.baseURL + '/api/v1/uploads/uploads/cred/' + file, {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
      let newObj = {name: file, file:URL.createObjectURL(data)};
      let copyFs = [...this.state.files, newObj];
      this.setState({files: copyFs,})
    })
    .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.parseFiles();
  }

  onCredDel = (e) => {
    e.preventDefault();
    let confDelete = window.confirm('Are you sure you want to delete this credential?');
    if (confDelete) {
      let reqURL = this.state.baseURL + this.state.endpt;
      console.log(reqURL);
      let requestOptions = {
        credentials: 'include',
        method: 'DELETE',
        redirect: 'follow'
      };

      fetch(reqURL, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.status.code !== 200) {
            //
          }
          else {
            this.state.updCreds(this.state.cred, 'remove')
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  render () {
    return (
      <tr>
        <td>
          <p style={{fontWeight: 'bold', textDecoration: 'underline'}}>
            {this.state.cred.title}
          </p>
          <p>
            {this.state.cred.issuer}
          </p>
        </td>
        <td>
          {this.state.cred.description}
          <br/>
          <a target="_blank" href={this.state.cred.link} rel="noreferrer">{this.state.cred.link}</a>
          <br/><br/>
          <ul>
          { this.state.files.map((file, ind) => {
              return (
                <li>
                  <a target="_blank" href={file.file} download={file.name} rel="noreferrer">{file.name}</a>
                </li>
              )
            })
          }
          </ul>
        </td>
        { this.state.curUser.id === this.state.user.id || this.state.curUser.role === 'admin'
          ?
            <td>
              <a href="" onClick={this.onCredDel}><FontAwesomeIcon icon={faTrash} title="Delete Credential" /></a>
            </td>
          : <></>
        }
      </tr>
    )
  }
}
