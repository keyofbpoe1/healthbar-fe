import React, { Component } from 'react';
import UserDelete from '../users/UserDelete.js'
import ArticlesDisplay from '../articles/ArticlesDisplay.js'
import { Link } from "react-router-dom";

import {
  Button,
  Tabs,
  Tab,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserEdit,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'

export default class UserView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      user: {},
      errorMsg: '',
      articles: [],
      artsEndPt: this.props.artsEndPt,
      avatar: '/user-circle-solid.svg',
    }
  }

  getUser = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get('id');
    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL +  this.state.endpt + idParam, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          user: data.data,
          articles : data.articles,
        }, () => {
          this.getProfPic()
        })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.getUser();
  }

  setErrorMsg = (msg) => {
    this.setState({
      errorMsg: msg,
    });
  }

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
      console.log(data.type);
      if (data.type !== 'text/html') {
        this.setState({
          avatar: URL.createObjectURL(data),
        });
      }

    })
    .catch(error => console.log('error', error));



    // fetch(this.state.baseURL + '/api/v1/uploads/upload/' +  'avatar/' + this.state.user.user_avatar, {
    //   method: 'GET',
    // })
    // .then(response => response.blob())
    // .then(data => {
    //   console.log(data);
    //   console.log(data.type);
    //   if (data.type !== 'text/html') {
    //     this.setState({ avatar: URL.createObjectURL(data) });
    //   }
    //
    // })
    // .catch(error => console.log('error', error));
  }

  render () {
    return (
      <Tabs defaultActiveKey="about" id="uncontrolled-tab-usertabs">
        <Tab eventKey="about" title="About">
          <p className="rederror">{this.state.errorMsg}</p>
          <table>
            <tbody>
              { this.state.userLoggedin
                ? (this.state.curUser.id === this.state.user.id || this.state.curUser.role === 'admin'
                  ? <>
                    <tr>
                      <td>
                        <img id="outImage" className="outImage" src={this.state.avatar} alt="Avatar"/>
                        &nbsp;&nbsp;&nbsp;
                      </td>
                      <td style={{verticalAlign: "bottom"}}>
                        <Link to={"/useredit?id=" + this.state.user.id}><FontAwesomeIcon icon={faUserEdit} title="Edit Account" /></Link>
                        &nbsp;
                        <UserDelete baseURL={this.state.baseURL} endpt={this.state.endpt} checkLogin={this.state.checkLogin} redirectFunc={this.state.redirectFunc} id={this.state.user.id} setErrorMsg={this.setErrorMsg} />
                      </td>
                    </tr>
                    </>
                  :<></>
                )
                : <></>
              }
              <tr>
                <td>Username:</td>
                <td>{this.state.user.username}</td>
              </tr>
              <tr>
                <td>Bio:</td>
                <td>
                  <div className="disccont" dangerouslySetInnerHTML={{__html: this.state.user.bio}}></div>
                </td>
              </tr>
              { this.state.userLoggedin
                ? (this.state.curUser.id === this.state.user.id || this.state.curUser.role === 'admin'
                  ? <>
                    <tr>
                      <td>Email:</td>
                      <td>{this.state.user.email}</td>
                    </tr>
                    <tr>
                      <td>Role:</td>
                      <td>{this.state.user.role}</td>
                    </tr>
                    </>
                  :<></>
                )
                : <></>
              }
            </tbody>
          </table>
        </Tab>
        <Tab eventKey="entries" title="Entries">
          {this.state.curUser.id === this.state.user.id &&
              <tr>
                <td></td>
                <td style={{textAlign: "right"}}>
                  <Link to={"/newarticle"}><FontAwesomeIcon icon={faPlusCircle} title="New Entry" style={{ fontSize: '25px' }} />&nbsp;New Entry</Link>
                </td>
              </tr>
            }
            {this.state.articles.length > 0 &&
              <ArticlesDisplay
                baseURL={this.state.baseURL}
                endpt={this.state.artsEndPt + '/userarticles/' + this.state.user.id}
              />
            }
        </Tab>
      </Tabs>
    )
  }
}
