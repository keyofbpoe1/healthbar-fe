import React, { Component } from 'react';

export default class DiscussionDelete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt,
      // checkLogin: this.props.checkLogin,
      // redirectFunc: this.props.redirectFunc,
      id: this.props.id,
      ind: this.props.ind,
      addComment: this.props.addComment,
      // setErrorMsg: this.props.setErrorMsg,
    }
  }

  onArtDelete = () => {
    let confDelete = window.confirm('Are you sure you want to delete this comment?');
    if (confDelete) {
      let reqURL = this.state.baseURL + this.state.endpt + this.state.id;
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
            // this.state.setErrorMsg(data.status.message);
          }
          else {
            this.state.addComment(null, 'remove', this.state.ind)
            // this.state.setErrorMsg('');
            // this.state.checkLogin()
            // this.state.redirectFunc('/')
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  render () {
    return (
      <button type="button" onClick={this.onArtDelete}>Delete Comment</button>
    )
  }
}
