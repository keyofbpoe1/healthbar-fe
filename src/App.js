// import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import LoginForm from './components/LoginForm.js'
import LogoutForm from './components/LogoutForm.js'
import RegForm from './components/RegForm.js'
import UserView from './components/UserView.js'
import UserEdit from './components/UserEdit.js'
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
    this.setState({ redirect: false, redURL: '/'});
  }

  redirectFunc = (url) => {
    this.setState({ redirect: true, redURL: url});
    setTimeout(this.clearRedirect, 3000);
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
                    <Link to={"/users?id=" + this.state.curUser.id}>My Profile</Link>
                  </li>
                  <li>
                    <LogoutForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} checkLogin={this.checkLogin} redirectFunc={this.redirectFunc} />
                  </li>
                </>
              }
            </ul>
          </nav>

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
              {this.state.loaded
                ? <UserView baseURL={this.state.baseURL} endpt={this.state.userEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
                : <></>
              }
            </Route>
            <Route path="/useredit">
              {this.state.loaded
                ? <UserEdit baseURL={this.state.baseURL} endpt={this.state.userEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
                : <></>
              }
            </Route>
          {/*  <Route path="/newdog">
              <DogNewForm baseURL={this.state.baseURL} userLoggedin={this.state.userLoggedin} curUser={this.state.curUser} redirectFunc={this.redirectFunc} />
            </Route>
            <Route path="/dogdisp">
              <ShowDogForm baseURL={this.state.baseURL} />
            </Route>
            <Route path="/dogedit">
                <EditDogForm baseURL={this.state.baseURL} userLoggedin={this.state.userLoggedin} curUser={this.state.curUser} redirectFunc={this.redirectFunc} />
            </Route>*/}
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
