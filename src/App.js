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
import ArticlesDisplay from './components/articles/ArticlesDisplay.js'
import Search from './components/search/Search.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import {
  Button,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  InputGroup,
  Tabs,
  Tab,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faBurn,
  faHeartbeat,
  faRunning,
  faDumbbell,
  faShoePrints,
  faSpa,
  faWalking,
} from '@fortawesome/free-solid-svg-icons'

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
      newsapi: process.env.REACT_APP_NEWSURI,
      entries: [],
      totalEntries: 0,
      news: [],
      totalNews: 0,
    }
  }

  checkLogin = () => {
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

  getNews = () => {
    let requestOptions = {
      // credentials: 'include',
      method: 'GET',
      // redirect: 'follow'
    };

    fetch(this.state.newsapi + '&page=1', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          news: data.articles,
          totalNews: data.totalResults,
        })
      })
      .catch(error => { console.log('error', error) });
  }

  getEntries = () => {
    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL + this.state.articleEndPt, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          entries: data.data,
        })
      })
      .catch(error => { console.log('error', error) });
  }

  componentDidMount(){
    this.checkLogin();
    this.getNews();
    this.getEntries();
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

  dateTrim = (val) => {
    let d = new Date(val);
    return d.toDateString();
  }

  authTrim = (val) => {
    if (val.match(/http/gmi)) {
      val = '';
    }
    return val;
  }

  render () {
    return (
      <>
      <div className="hb-app">
      <Router>
        {this.state.redirect &&
          <Redirect push to={this.state.redURL} />
        }
        <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link to="/">
              <img src="/hb-favicon.png" alt="healthBar" height="25px"/>
              &nbsp;
              healthBar
            </Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link><Link to="/">Home</Link></Nav.Link>
              <Nav.Link><Link to="/about">About</Link></Nav.Link>
              <NavDropdown title="Account" id="basic-nav-dropdown">
                {this.state.userLoggedin
                  ?
                    <>
                      <NavDropdown.Item><Link to={"/users?id=" + this.state.curUser.id} onClick={this.clearRedirect}>My Profile</Link></NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item><LogoutForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} checkLogin={this.checkLogin} redirectFunc={this.redirectFunc} /></NavDropdown.Item>
                    </>
                  :
                    <>
                      <NavDropdown.Item><Link to="/login">Login</Link></NavDropdown.Item>
                      <NavDropdown.Item><Link to="/register">Register</Link></NavDropdown.Item>
                    </>
                }
              </NavDropdown>
            </Nav>
            <Form inline onSubmit={this.searchSubmit}>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search"
                  id="searchTerm"
                  value={this.state.searchTerm}
                  onChange={this.handleChange}
                  required
                />
                <InputGroup.Append>
                  <Button type="submit" variant="outline-info"><FontAwesomeIcon icon={faSearch} /></Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Navbar>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <div className="sittit">
            <h1>a health and fitness app</h1>
          </div>
          <div className="sitcont">
          <Switch>
            <Route path="/login">
              <LoginForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
            </Route>
            <Route path="/register">
              <RegForm baseURL={this.state.baseURL} endpt={this.state.userEndPt} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} />
            </Route>
            <Route path="/users">
              {this.state.loaded &&
                <UserView baseURL={this.state.baseURL} endpt={this.state.userEndPt} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} redirectFunc={this.redirectFunc} checkLogin={this.checkLogin} artsEndPt={this.state.articleEndPt} />
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
            <Route path="/about">
              <h1>about</h1>
            </Route>
            <Route path="/">
              <Tabs defaultActiveKey="entries" id="uncontrolled-tab-healthbar">
                <Tab eventKey="entries" title="Recent Entries">
                  <ArticlesDisplay
                    baseURL={this.state.baseURL}
                    endpt={this.state.articleEndPt + '/allarticles'}
                  />
                </Tab>
                <Tab eventKey="news" title="News From the Web">
                  <table className="artstable">
                    <tbody>
                      { this.state.news.map((article, ind) => {
                        return (
                          <tr>
                            <td>
                              <a href={article.url} target="_blank" rel="noreferrer">
                                <img src={article.urlToImage} alt="img" className="artimg" />
                              </a>
                            </td>
                            <td>
                              <a href={article.url} target="_blank" rel="noreferrer">
                                {article.title}
                              </a>
                              <br/>
                              {this.authTrim(article.author)}
                              <br/>
                              {this.dateTrim(article.publishedAt)}
                            </td>
                          </tr>
                        )
                      })
                      }
                    </tbody>
                  </table>
                </Tab>
              </Tabs>
            </Route>
          </Switch>
          </div>
        </div>

      </Router>
      </div>
      <div className="sticky-footer">
        footer
      </div>
      </>
    )
  }
}

// <table className="artstable">
//   <tbody>
//     { this.state.entries.map((entry, ind) => {
//       return (
//         <tr>
//           <td><Link to={"/articles?id=" + entry.id}>{this.categoryIcon(entry.category)}</Link></td>
//           <td>
//             <Link to={"/articles?id=" + entry.id}>{entry.title}</Link>
//             <br/>
//             <Link to={"/users?id=" + entry.author.id}>{entry.author.username}</Link>
//             <br/>
//             {this.dateTrim(entry.created_date)}
//           </td>
//         </tr>
//       )
//     })
//     }
//   </tbody>
// </table>
