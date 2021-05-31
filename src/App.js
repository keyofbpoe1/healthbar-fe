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
import CropForm from './components/uploads/CropForm.js'

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
  faAngleRight,
  faAngleLeft,
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from '@fortawesome/free-solid-svg-icons'

import {
  faGithub,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

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
      newsapi: process.env.REACT_APP_NEWSKEY,
      gnewsapi: process.env.REACT_APP_GNEWSRSS,
      entries: [],
      totalEntries: 0,
      news: [],
      totalNews: 0,
      newsPage: 1,
      newslimit: 10,
      totNewsPgs: 0,
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
    fetch("https://newscatcher.p.rapidapi.com/v1/search_free?q=fitness&lang=en&media=True&page_size=" + this.state.newslimit + "&page=" + this.state.newsPage, {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-key": this.state.newsapi,
    		"x-rapidapi-host": "newscatcher.p.rapidapi.com"
    	}
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.status !== 'ok') {
        //do nothing
      }
      else {
        let totNewsPgs = data.total_pages;
        this.setState({
          news: data.articles,
          totalNews: data.total_hits,
          totNewsPgs: data.total_pages,
        })
      }
    })
    .catch(err => {
    	console.error(err);
    });
  }


//   getGNews = () => {
//     let requestOptions = {
//       credentials: 'same-origin',
//       referrer: "",
//       method: 'GET',
//       redirect: 'follow',
//       // mode: 'no-cors',
//     };
//
// // https://cors-anywhere.herokuapp.com/https://news.google.com/rss/search?q=health%20and%20fitness&hl=en-US&gl=US&ceid=US:en
//
//     fetch("https://news.google.com/rss/search?q=health%20and%20fitness&hl=en-US&gl=US&ceid=US:en", requestOptions)
//       .then(response => response.text())
//       .then(data => {
//         const parser = new DOMParser();
//         const xml = parser.parseFromString(data, "application/xml");
//         console.log(xml);
//       })
//       .catch(console.error);
//   }

  // getNews = () => {
  //   let requestOptions = {
  //     // credentials: 'include',
  //     method: 'GET',
  //     // redirect: 'follow'
  //   };
  //
  //   fetch(this.state.newsapi + '&page=' + this.state.newsPage, requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data)
  //       if (data.status === 'error') {
  //         //do nothing
  //       }
  //       else {
  //         let totNewsPgs = Math.ceil(parseInt(data.totalResults) / 10);
  //         if (totNewsPgs > 10) {
  //           totNewsPgs = 10;
  //         }
  //         this.setState({
  //           news: data.articles,
  //           totNewsPgs: data.totalResults,
  //           totNewsPgs: totNewsPgs,
  //         })
  //       }
  //
  //     })
  //     .catch(error => { console.log('error', error) });
  // }

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
    // this.getEntries();
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

  iterNews = (e) => {
    e.preventDefault();
    let newPg = 1;
    switch (e.currentTarget.id) {
      case 'firstpage':
        newPg = 1;
        break;
      case 'downpage':
          newPg = this.state.newsPage - 1;
        break;
      case 'uppage':
        newPg = this.state.newsPage + 1;
        break;
      case 'lastpage':
        newPg = this.state.totNewsPgs;
        break;
      default:
        newPg = 1;
    }
    this.setState({ newsPage: newPg }, () => {
      this.getNews();
    });
    console.log(this.state);
  }

  copyDate = () => {
    let d = new Date();
    return d.getFullYear();
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
                  title="Search"
                  required
                />
                <InputGroup.Append>
                  <Button type="submit" variant="outline-info" title="Search"><FontAwesomeIcon icon={faSearch} /></Button>
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
              <div className="editingdiv centerdiv">
                <p>
                  Welcome to the healthBar! Your source for health and fitness information and news!
                </p>
                <p>
                  You can browse, search, and create your own account to track your exercise routines and goals!
                </p>
                <p>
                  This app is powered by tinyMCE, Newscatcher, and you!
                </p>
              </div>
            </Route>
            <Route path="/upload">
              <CropForm />
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
                              <a href={article.link} target="_blank" rel="noreferrer">
                                <img src={article.media} alt="img" className="artimg" />
                              </a>
                            </td>
                            <td>
                              <a href={article.link} target="_blank" rel="noreferrer">
                                {article.title}
                              </a>
                              <br/>
                              {article.author &&
                                this.authTrim(article.author)
                              }
                              <br/>
                              {this.dateTrim(article.published_date)}
                            </td>
                          </tr>
                        )
                      })
                      }
                      {this.state.newsPage !== 1 &&
                        <>
                          <a id="firstpage" href="" onClick={this.iterNews}><FontAwesomeIcon icon={faAngleDoubleLeft} /></a>
                          &nbsp;
                          <a id="downpage" href="" onClick={this.iterNews}><FontAwesomeIcon icon={faAngleLeft} /></a>
                        </>
                      }
                      {this.state.newsPage !== this.state.totNewsPgs &&
                        <>
                          &nbsp;
                          <a id="uppage" href="" onClick={this.iterNews}><FontAwesomeIcon icon={faAngleRight} /></a>
                          &nbsp;
                          <a id="lastpage" href="" onClick={this.iterNews}><FontAwesomeIcon icon={faAngleDoubleRight} /></a>
                        </>
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
        &#169; {this.copyDate()} | Max Maisey | <a href="https://github.com/keyofbpoe1" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a> | <a href="https://www.linkedin.com/in/smax-maisey/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
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
