import React, { Component } from 'react';
import ArticlesDisplay from '../articles/ArticlesDisplay.js'
import UsersDisplay from '../users/UsersDisplay.js'
import { Link } from "react-router-dom";

import {
  Tabs,
  Tab,
} from 'react-bootstrap';

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
      page: 1,
      limit: 1,
    }
  }

  // searchArticles = () => {
  //   let urlParams = new URLSearchParams(window.location.search);
  //   let queryParam = urlParams.get('query');
  //   let requestOptions = {
  //     credentials: 'include',
  //     method: 'GET',
  //     redirect: 'follow'
  //   };
  //
  //   fetch(this.state.baseURL +  this.state.artEndpt + queryParam + '/' + this.state.page + '/' + this.state.limit, requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data)
  //       this.setState({
  //         articles : data.data,
  //         artLength: data.artlength,
  //       })
  //     })
  //     .catch(error => console.log('error', error));
  // }
  //
  // searchUsers = () => {
  //   let urlParams = new URLSearchParams(window.location.search);
  //   let queryParam = urlParams.get('query');
  //   // let page = 1;
  //   // let limit = 1;
  //   // if (urlParams.get('page')) {
  //   //   page = urlParams.get('page');
  //   // }
  //   // if (urlParams.get('limit')) {
  //   //   limit = urlParams.get('limit');
  //   // }
  //   let requestOptions = {
  //     credentials: 'include',
  //     method: 'GET',
  //     redirect: 'follow'
  //   };
  //
  //   fetch(this.state.baseURL +  this.state.userEndpt + queryParam + '/' + this.state.page + '/' + this.state.limit, requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data)
  //       this.setState({
  //         users : data.data,
  //         usersLength: data.userlength,
  //       })
  //     })
  //     .catch(error => console.log('error', error));
  // }

  setSearch = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let queryParam = urlParams.get('query');
    this.setState({
      searchQuery : queryParam,
    });
  }

  componentDidMount(){
    this.setSearch();
    // this.searchArticles();
    // this.searchUsers();
  }

  setErrorMsg = (msg) => {
    this.setState({
      errorMsg: msg,
    });
  }

  // iterPage = () => {
  //   this.setState({ page: this.state.page + 1  }, () => {
  //     this.searchArticles();
  //     this.searchUsers();
  //   });
  // }

  render () {
    return (
      <Tabs defaultActiveKey="entries" id="uncontrolled-tab-searchtabs">
        <Tab eventKey="entries" title="Entries">
          {this.state.searchQuery &&
            <ArticlesDisplay
              baseURL={this.state.baseURL}
              endpt={this.state.artEndpt + '/' + this.state.searchQuery}
            />
          }
        </Tab>
        <Tab eventKey="users" title="Users">
          {this.state.searchQuery &&
            <UsersDisplay
              baseURL={this.state.baseURL}
              endpt={this.state.userEndpt + '/' + this.state.searchQuery}
            />
          }
        </Tab>
      </Tabs>
    )
  }
}

// <ul>
//   { this.state.users.map((user, ind) => {
//     return (
//       <li key={'users-' + ind}>
//         <Link to={"/users?id=" + user.id}>{user.username}</Link>
//       </li>
//     )
//   })
//   }
// </ul>
