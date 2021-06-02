import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'

export default class EndAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: '/api/v1/endorsements/',
      curUser: this.props.curUser,
      curArt: this.props.curArt,
      updEnds: this.props.updEnds,
      errorMsg: '',
    }
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleEnds = (e) => {
    e.preventDefault();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      endorser: this.state.curUser.id,
      article: this.state.curArt.id,
    });

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
          this.state.updEnds(data.data, 'add');
        }
        else {
          this.setState({
            errorMsg: 'Oops! Something went wrong!',
          });
        }
      })
      .catch(error => console.log('error', error));

  }

  render () {
    return (
      <p>
        <a href="" onClick={this.handleEnds} title="Add Endorsement" >
          <FontAwesomeIcon icon={faPlusCircle} />
          &nbsp;
          Add Endorsement
        </a>
      </p>
    )
  }
}
