import React, { Component } from 'react';
import DiscussionDelete from '../discussions/DiscussionDelete.js'
import { Link } from "react-router-dom";

export default class DiscussionView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: '/api/v1/discussions/',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      com: this.props.com,
      ind: this.props.ind,
      addComment: this.props.addComment,
    }
  }


  render () {
    return (
      <>
        <tr>
          <td><Link to={"/users?id=" + this.state.com.author.id}>{this.state.com.author.username}</Link></td>
          <td>
            {this.state.com.comment}
            { this.state.userLoggedin
              ? (this.state.curUser.id == this.state.com.author.id
                ? <>
                    &nbsp;
                    <DiscussionDelete baseURL={this.state.baseURL} endpt={this.state.endpt} id={this.state.com.id} ind={this.state.ind} addComment={this.state.addComment} />
                  </>
                :<></>
              )
              : <></>
            }
          </td>
        </tr>
      </>
    )
  }
}
