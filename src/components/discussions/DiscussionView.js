import React, { Component } from 'react';
import DiscussionDelete from '../discussions/DiscussionDelete.js'
import DiscussionEdit from '../discussions/DiscussionEdit.js'
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
} from '@fortawesome/free-solid-svg-icons'

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
      editMode: false,
      avatar: '/user-circle-solid.svg',
    }
  }

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({ editMode: !this.state.editMode })
  }

  updateComment = (newcom) => {
    this.setState({ com: newcom });
  }

  getProfPic = () => {

    fetch(this.state.baseURL + '/api/v1/uploads/uploads/avatar/' + this.state.com.author.user_avatar, {
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
      <>
        <tr>
          <td>
            <Link to={"/users?id=" + this.state.com.author.id}>
              <img id={"icImage-" + this.state.com.author.id} className="icImage" src={this.state.avatar} alt="Avatar"/>
              &nbsp;
              {this.state.com.author.username}
            </Link>:&nbsp;
          </td>
          <td>
            { this.state.editMode
              ? <>
                  <DiscussionEdit comment={this.state.com.comment} fullComment={this.state.com} baseURL={this.state.baseURL} endpt={this.state.endpt} id={this.state.com.id} toggleEdit={this.toggleEdit} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} addComment={this.state.addComment} ind={this.state.ind} updateComment={this.updateComment} />
                </>
              : <>
                  <div className="disccont" dangerouslySetInnerHTML={{__html: this.state.com.comment}}></div>
                  { this.state.userLoggedin
                    ? (this.state.curUser.id === this.state.com.author.id || this.state.curUser.role === 'admin'
                      ? <div className="righttxt">
                          <a href="" onClick={this.toggleEdit} title="Edit Comment"><FontAwesomeIcon icon={faEdit} /></a>
                          &nbsp;
                          <DiscussionDelete baseURL={this.state.baseURL} endpt={this.state.endpt} id={this.state.com.id} ind={this.state.ind} addComment={this.state.addComment} />
                        </div>
                      :<></>
                    )
                    : <></>
                  }
                </>
            }
          </td>
        </tr>
      </>
    )
  }
}
