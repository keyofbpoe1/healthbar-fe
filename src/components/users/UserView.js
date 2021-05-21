import React, { Component } from 'react';
import UserDelete from '../users/UserDelete.js'
import { Link } from "react-router-dom";

import {
  Button,
  Tabs,
  Tab,
} from 'react-bootstrap';

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
                      <td></td>
                      <td>
                        <Link to={"/useredit?id=" + this.state.user.id}><Button type="button">Edit</Button></Link>
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
                <td>Email:</td>
                <td>{this.state.user.email}</td>
              </tr>
              <tr>
                <td>Bio:</td>
                <td>{this.state.user.bio}</td>
              </tr>
              <tr>
                <td>Role:</td>
                <td>{this.state.user.role}</td>
              </tr>
            </tbody>
          </table>
        </Tab>
        <Tab eventKey="entries" title="Entries">
          {this.state.curUser.id === this.state.user.id &&
              <tr>
                <td></td>
                <td>
                  <Link to={"/newarticle"}><Button type="button">New Article</Button></Link>
                </td>
              </tr>
            }
          <ul>
              { this.state.articles.map((article, ind) => {
                return (
                  <li key={'arts-' + ind}>
                    <Link to={"/articles?id=" + article.id}>{article.title}</Link>
                  </li>
                )
              })
              }
          </ul>
        </Tab>
      </Tabs>
    )
  }
}
