import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Button, InputGroup, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faKey,
} from '@fortawesome/free-solid-svg-icons'

export default class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: '/api/v1/uploads',
      file: '',
      // username: '',
      // password: '',
      // checkLogin: this.props.checkLogin,
      // redirectFunc: this.props.redirectFunc,
      // errorMsg: '',
    }
  }

  uploadHandler = (event) => {
     const url = this.state.baseURL + '/upload';
     console.log(event.target.files);

     Array.from(event.target.files).forEach((file, i) => {
       let data = new FormData();
       data.append('file', file);
       axios.post(url, data)
         .then((res) => {
           console.log(res);
           // this.setState({ photos: [res.data, ...this.state.photos] });
           // console.log(this.state);
         });
     });
   }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value}, () => {
      console.log(this.state);
    });
  }

  handleUpload = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      file: this.state.file,
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
          file: '',
        })
        if (data.status.code === 401) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          // this.state.checkLogin()
          // this.state.redirectFunc('/')
        }
      })
      .catch(error => console.log('error', error));
  }

  render () {
    return (
      <div className="editingdiv logindiv">
        <form onSubmit={this.handleUpload}>
          <h3>Upload</h3>
          <p className="rederror">{this.state.errorMsg}</p>

          <input type="file" id="file" name="file"onChange={this.uploadHandler}
          value={this.state.file}/>

            <Button type="submit" value="Login">Upload</Button>
            &nbsp;
            <Link to="/"><Button type="button">Cancel</Button></Link>
        </form>
      </div>
    )
  }
}
