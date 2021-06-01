import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faTrash,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'

export default class CredAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: '/api/v1/credentials/',
      curUser: this.props.curUser,
      user: this.props.user,
      updCreds: this.props.updCreds,
      // checkLogin: this.props.checkLogin,
      // redirectFunc: this.props.redirectFunc,
      issuer: '',
      title: '',
      link: '',
      description: '',
      errorMsg: '',
      files: [],
      // fnames: [],
      showform: false,
    }
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleCreds = (e) => {
    e.preventDefault();

    this.setState({
      errorMsg: '',
    });

    if (this.state.files.length > 0) {
      this.filePreUpl();
    }
    else {
      this.goNewCred();
    }
  }

  goNewCred = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let reqObj = {
      title: this.state.title,
      issuer: this.state.issuer,
      link: this.state.link,
      description: this.state.description,
      user: this.state.user.id,
    }

    if (this.state.files.length > 0) {
      let myFilesArr = [];
      this.state.files.forEach((file, i) => {
        myFilesArr.push(file.name)
      });

      reqObj.files = myFilesArr.join(';');
    }

    let raw = JSON.stringify(reqObj);

    var requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(this.state.baseURL + this.state.endpt, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status.code === 201) {
          this.state.updCreds(data.data, 'add');
          this.toggleNewForm();
        }
        else {
          this.setState({
            errorMsg: 'Oops! Something went wrong!',
          });
        }
      })
      .catch(error => console.log('error', error));

  }

  blobToFile = (theBlob, fileName) => {
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
  }

  filePreUpl = () => {
    for (let i = 0; i < this.state.files.length; i++) {
      let curFile = this.state.files[i].file;
      let curName = this.state.files[i].name;
      //get blob
      fetch(curFile, {
        credentials: 'include',
        method: 'GET',
        redirect: 'follow',
      })
      .then(response => response.blob())
      .then(data => {
        console.log(data);
        let myFile = this.blobToFile(data, curName);
        console.log(myFile);
        this.uplFile(myFile);
      });
    }
    this.goNewCred();
  }

  uplFile = (myFile) => {
    const data = new FormData();

    data.append('file', myFile);
    data.append('folder', 'cred/');
    data.append('fname', myFile.name);

    fetch(this.state.baseURL + '/api/v1/uploads/upload', {
      credentials: 'include',
      method: 'POST',
      body: data,
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
    });

  }

  filesChange = (evt) => {
    let tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    console.log(files);
    let file;
    let copyFs = [...this.state.files];
    // let copyFns = [...this.state.fnames];
    for (let i = 0; i < files.length; i++) {
      file = files.item(i);
      let objectURL = URL.createObjectURL(file);
      console.log(objectURL);
      // copyFs.push(objectURL);
      let splitName = file.name.split(/[^a-z0-9]/gi);
      let safeName = this.state.user.username + '-' + splitName.slice(0,-1).join('_').toLowerCase() + '.' + splitName.slice(-1);
      let newObj = {
        file: objectURL,
        name: safeName,
      }
      console.log(newObj);
      // copyFns.push(safeName);
      copyFs.push(newObj);
    }
    this.setState({
      files: copyFs,
      // fnames: copyFns,
    }, () => {
      console.log(this.state.files);
    });
  }

  toggleNewForm = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      issuer: '',
      title: '',
      link: '',
      description: '',
      files: [],
      // fnames: [],
      showform: !this.state.showform,
    });
  }

  render () {
    return (
      <div className="editingdiv">
        { !this.state.showform &&
          <a href="" onClick={this.toggleNewForm} title="Add Credential">
            <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: '25px' }} />&nbsp;Add Credential
          </a>
        }
        { this.state.showform &&
          <form id="newcredform" onSubmit={this.handleCreds}>
            <h3>New Credential</h3>
            <p className="rederror">{this.state.errorMsg}</p>
            <FormControl
              type="text"
              id="title"
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
              placeholder="Credential Name/Number"
              title="Credential Name/Number"
              required
            />
            <FormControl
              type="text"
              id="issuer"
              name="issuer"
              onChange={this.handleChange}
              value={this.state.issuer}
              placeholder="Credential Issuer"
              title="Credential Issuer"
            />
            <FormControl
              type="url"
              id="link"
              name="link"
              onChange={this.handleChange}
              value={this.state.link}
              placeholder="Credential Link"
              title="Credential Link"
            />
            <br/>
            <textarea id="description" name="description" rows="8" cols="80" onChange={this.handleChange} value={this.state.bio} placeholder="Credential Description" title="Credential Description"></textarea>
            <div>
              <Form.File
                className="sminp"
                label="Files"
                custom
                id="files"
                ref={(ref) => { this.uploadInput = ref; }}
                type="file"
                onChange={this.filesChange}
                multiple
              />
            </div>
            <div id="fsdisp">
              <ul>
                { this.state.files.map((file, ind) => {
                    return (
                      <li>
                        <a target="_blank" href={file.file} rel="noreferrer">{file.name}</a>
                      </li>
                    )
                  })

                }
              </ul>
            </div>
            <div className="righttxt">
              <a href="" onClick={this.handleCreds} title="Save Credential">
                <FontAwesomeIcon icon={faSave} style={{ fontSize: '25px' }} />
              </a>
              &nbsp;
              <a href="" onClick={this.toggleNewForm} title="Discard Credential">
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '25px' }} />
              </a>
            </div>
          </form>
        }
      </div>
    )
  }
}
