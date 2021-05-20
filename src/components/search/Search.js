import React, { Component } from 'react';
import UserDelete from '../users/UserDelete.js'
import { Link } from "react-router-dom";

export default class UserView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      artEndpt: this.props.artEndpt,
      userEndpt: this.props.userEndpt,
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      errorMsg: '',
      articles: [],
      users: [],
      artLength: 0,
    }
  }

  searchArticles = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let queryParam = urlParams.get('query');
    let page = 1;
    let limit = 1;
    if (urlParams.get('page')) {
      page = urlParams.get('page');
    }
    if (urlParams.get('limit')) {
      limit = urlParams.get('limit');
    }
    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL +  this.state.artEndpt + queryParam + '/' + page + '/' + limit, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          articles : data.data,
          artLength: data.artlength,
        })
      })
      .catch(error => console.log('error', error));
  }

  searchUsers = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let queryParam = urlParams.get('query');
    let page = 1;
    let limit = 1;
    if (urlParams.get('page')) {
      page = urlParams.get('page');
    }
    if (urlParams.get('limit')) {
      limit = urlParams.get('limit');
    }
    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL +  this.state.userEndpt + queryParam + '/' + page + '/' + limit, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          users : data.data,
          usersLength: data.userlength,
        })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.searchArticles();
    this.searchUsers();
  }

  setErrorMsg = (msg) => {
    this.setState({
      errorMsg: msg,
    });
  }

  render () {
    return (
      <>
        <h3>Articles</h3>
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
        <h3>Users</h3>
        <ul>
          { this.state.users.map((user, ind) => {
            return (
              <li key={'users-' + ind}>
                <Link to={"/users?id=" + user.id}>{user.username}</Link>
              </li>
            )
          })
          }
        </ul>
      </>
    )
  }
}
