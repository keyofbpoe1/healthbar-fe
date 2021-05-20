// import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import LoginForm from './components/users/LoginForm.js'
import LogoutForm from './components/users/LogoutForm.js'
import RegForm from './components/users/RegForm.js'
import UserView from './components/users/UserView.js'
import UserEdit from './components/users/UserEdit.js'
import NewArticle from './components/articles/NewArticle.js'
import ArticleView from './components/articles/ArticleView.js'
import ArticleEdit from './components/articles/ArticleEdit.js'
import Search from './components/search/Search.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: process.env.REACT_APP_BASEURL,
      userEndPt: process.env.REACT_APP_USERENDPT,
      articleEndPt: process.env.REACT_APP_ARTICLEENDPT,
      sessid: '',
      userLoggedin: false,
      curUser: {},
      redirect: false,
      redURL: '/',
      loaded: false,
      searchTerm: '',
      // searchType: 'article',
      // searchPage: 1,
      // searchLimit: 1,
    }
  }

  checkLogin = () => {
    console.log("checking...");
      let requestOptions = {
        credentials: 'include',
        method: 'GET',
        redirect: 'follow'
      };

      fetch(this.state.baseURL + this.state.userEndPt + '/checksession', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.curus.id && data.curus.id > 0) {
            this.setState({
              userLoggedin: true,
              curUser: data.curus,
              loaded: true,
            })
          }
        })
        .catch(error => {
          console.log('error', error)
          console.log('not logged in')
          this.setState({
            userLoggedin: false,
            curUser: {},
            loaded: true,
          })
        });
  }

  componentDidMount(){
    this.checkLogin();
  }

  clearRedirect = () => {
    this.setState({ loaded: false }, () => {
      this.setState({ redirect: false, redURL: '/' , loaded: true });
    });
  }

  redirectFunc = (url) => {
    // this.setState({ loaded: false }, () => {
      this.setState({
        redirect: true,
        redURL: url,
      }, () => {
        this.clearRedirect();
      });
    // });
      // redirect: true,
      // redURL: url}, () => {
      //   this.clearRedirect();
      // });
    // setTimeout(this.clearRedirect, 3000);
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  searchSubmit = (e) => {
    e.preventDefault();
    this.redirectFunc('/search?query=' + this.state.searchTerm);
    this.setState({
      // redirect: true,
      // redURL: '/search?query=' + this.state.searchTerm,
      searchTerm: '',
    });
    // setTimeout(this.clearRedirect, 3000);
  }

  render () {
    return (
      <Router>
        {this.state.redirect &&
          <Redirect push to={this.state.redURL} />
        }
        <div>
          <nav>
            <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
              {!this.state.userLoggedin &&
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                     <Link to="/register">Register</Link>
                  </li>
                </>
              }
              { this.state.userLoggedin &&
                <>
                  <li>
                    <Link to={"/users?id=" + this.state.curUser.id} onClick={this.clearRedirect}>My Profile</Link>
                  </li>
                  <li>
                    <LogoutForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} checkLogin={this.checkLogin} redirectFunc={this.redirectFunc} />
                  </li>
                </>
              }
            </ul>
          </nav>

          <div>
            <form onSubmit={this.searchSubmit}>
              <input type="text" placeholder="Search..." id="searchTerm" id="searchTerm" value={this.state.searchTerm} onChange={this.handleChange} required />
              <button type="submit">?</button>
            </form>
          </div>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <LoginForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
            </Route>
            <Route path="/register">
              <RegForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
            </Route>
            <Route path="/users">
              {this.state.loaded &&
                <UserView baseURL={this.state.baseURL} endpt={this.state.userEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
              }
            </Route>
            <Route path="/useredit">
              {this.state.loaded &&
                <UserEdit baseURL={this.state.baseURL} endpt={this.state.userEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
              }
            </Route>
            <Route path="/newarticle">
              {this.state.loaded &&
                <NewArticle baseURL={this.state.baseURL} endpt={this.state.articleEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
              }
            </Route>
            <Route path="/articles">
              {this.state.loaded &&
                <ArticleView baseURL={this.state.baseURL} endpt={this.state.articleEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
              }
            </Route>
            <Route path="/editarticle">
              {this.state.loaded &&
                <ArticleEdit baseURL={this.state.baseURL} endpt={this.state.articleEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
              }
            </Route>
            <Route path="/search">
              {this.state.loaded &&
                <Search baseURL={this.state.baseURL} userEndpt={'/users/search/'} artEndpt={'/api/v1/articles/search/'} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
              }
            </Route>
            <Route path="/">
              <h1>home</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

// <Route path="/login">
//   <LoginForm baseURL={this.state.baseURL} checkLogin={this.checkLogin} redirectFunc={this.redirectFunc}/>
// </Route>
// <Route path="/register">
//   <RegistrationForm baseURL={this.state.baseURL} checkLogin={this.checkLogin} redirectFunc={this.redirectFunc}/>
// </Route>
