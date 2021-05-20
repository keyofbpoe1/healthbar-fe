import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class DiscussionEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: this.props.comment,
      fullComment: this.props.fullComment,
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      errorMsg: '',
      baseURL: this.props.baseURL,
      endpt: this.props.endpt,
      id: this.props.id,
      ind: this.props.ind,
      toggleEdit: this.props.toggleEdit,
      addComment: this.props.addComment,
      updateComment: this.props.updateComment
    }
  }

  // getArticle = () => {
  //   let urlParams = new URLSearchParams(window.location.search);
  //   let idParam = urlParams.get('id');
  //   let requestOptions = {
  //     credentials: 'include',
  //     method: 'GET',
  //     redirect: 'follow'
  //   };
  //
  //   fetch(this.state.baseURL +  this.state.endpt + idParam, requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data)
  //       this.setState({
  //         article: data.data,
  //         title: data.data.title,
  //         category: data.data.category,
  //         body: data.data.body,
  //       })
  //     })
  //     .catch(error => console.log('error', error));
  // }
  //
  // componentDidMount(){
  //   this.getArticle();
  // }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleDiscUpdate = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt + this.state.id;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      comment: this.state.comment,
    });

    let requestOptions = {
      credentials: 'include',
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(reqURL, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // this.setState({
        //   title: '',
        //   category: '',
        //   body: ''
        // })
        if (data.status.code != 200) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.state.addComment(data.data, 'update', this.state.ind);
          this.state.updateComment(data.data);
          this.state.toggleEdit();
          // this.state.checkLogin()
          // this.state.redirectFunc('/articles?id=' + this.state.article.id)
        }
      })
      .catch(error => console.log('error', error));
  }

  render () {
    return (
      <>
        { this.state.userLoggedin
          ? (this.state.curUser.id == this.state.fullComment.author.id || this.state.curUser.role == 'admin'
            ? <form onSubmit={this.handleDiscUpdate}>
                <p className="rederror">{this.state.errorMsg}</p>
                <label htmlFor="comment"></label>
                <textarea id="comment" name="comment" rows="8" cols="80" onChange={this.handleChange} value={this.state.comment} placeholder="comment..."></textarea>
                <br/>
                <input type="submit" value="Save"/>
                <button type="button" onClick={this.state.toggleEdit}>Cancel</button>
              </form>
            : <h1>Unauthorized</h1>
          )
          : <h1>Unauthorized</h1>
        }
      </>
    )
  }
}
