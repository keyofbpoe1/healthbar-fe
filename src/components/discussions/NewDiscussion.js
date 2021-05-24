import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

export default class NewDiscussion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: '/api/v1/discussions/',
      comment: '',
      article: this.props.article,
      // checkLogin: this.props.checkLogin,
      // redirectFunc: this.props.redirectFunc,
      errorMsg: '',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      addComment: this.props.addComment,
    }
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleNewDisc = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      comment: this.state.comment,
      article: this.state.article.id,
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
          comment: '',
        })
        if (data.status.code === 401) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.state.addComment(data.data, 'add', null)
        }
      })
      .catch(error => console.log('error', error));
  }

  clearComment = (e) => {
    e.preventDefault();
    this.setState({ comment: '' });
  }

  render () {
    return (
      <>
      { this.state.userLoggedin
        ? <form onSubmit={this.handleNewDisc} style={{width: "fit-content"}}>
            <p className="rederror">{this.state.errorMsg}</p>
            <label htmlFor="comment"></label>
            <textarea id="comment" name="comment" rows="3" cols="50" onChange={this.handleChange} value={this.state.comment} placeholder="new comment..."></textarea>
            <br/>
            <div className="righttxt">
            <a href="" onClick={this.handleNewDisc} title="Add Comment"><FontAwesomeIcon icon={faPlusCircle} /></a>
            &nbsp;
            <a href="" onClick={this.clearComment} title="discard Comment"><FontAwesomeIcon icon={faTrash} /></a>
            </div>
          </form>
        : <></>
      }
      </>
    )
  }
}
