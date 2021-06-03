import React, { Component } from 'react';
import ArticlesDisplay from '../articles/ArticlesDisplay.js'
import UsersDisplay from '../users/UsersDisplay.js'
import { Link } from "react-router-dom";

import {
  Tabs,
  Tab,
  FormControl,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilter,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

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
      userQ: '',
      catfilt: '',
      endfilt: '',
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

    this.setState({ searchQuery: undefined, }, () => {
      let urlParams = new URLSearchParams(window.location.search);
      let queryParam = urlParams.get('query');
      let catFiltParam = urlParams.get('category');
      if (this.state.catfilt != '') {
        catFiltParam = this.state.catfilt;
      }
      let endFiltParam = urlParams.get('endorsements');
      if (this.state.endfilt != '') {
        endFiltParam = this.state.endfilt;
      }
      let searchObj = JSON.stringify({
        query: queryParam,
        category: catFiltParam,
        endorsements: endFiltParam,
      });
      this.setState({
        searchQuery : searchObj,
        userQ: queryParam,
        isloaded: true,
      });
    });


  }

  componentDidMount(){
    // window.document.querySelector('.tab-content').setAttribute('style', 'width: 100%; overflow-x: auto;')
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

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  clearFilt = () => {
    this.setState({
      catfilt: '',
      endfilt: '',
    }, () => {
      this.setSearch();
    });
  }

  render () {
    return (
      <Tabs defaultActiveKey="entries" id="uncontrolled-tab-searchtabs">
        <Tab eventKey="entries" title="Entries">
          <table className="collapsetable" width="100%">
            <tbody>
              <tr>
                <td width="70%">

                  {this.state.searchQuery &&
                    <ArticlesDisplay
                      baseURL={this.state.baseURL}
                      searchQuery={this.state.searchQuery}
                      isSearch={true}
                    />
                  }
                </td>
                <td width="30%">
                  <table>
                    <tbody>
                      <tr>
                        <th colspan="2" style={{textAlign: 'center'}}>Filters</th>
                      </tr>
                      <tr>
                        <td>
                          Category:&nbsp;
                        </td>
                        <td>
                          <FormControl className="sminp" as="select" name="catfilt" id="catfilt" value={this.state.catfilt} onChange={this.handleChange}>
                            <option disabled value=""> -- Select -- </option>
                            <option value="cardio">Cardio</option>
                            <option value="dance">Dance</option>
                            <option value="endurance">Endurance</option>
                            <option value="flexibility">Flexibility</option>
                            <option value="recovery">Recovery</option>
                            <option value="strength">Strength</option>
                            <option value="weight">Weight Training</option>
                          </FormControl>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Endorsements:&nbsp;
                          </td>
                          <td>
                          <FormControl className="sminp" as="select" name="endfilt" id="endfilt" value={this.state.endfilt} onChange={this.handleChange}>
                            <option disabled value=""> -- Select -- </option>
                            <option value="1">Endorsed</option>
                            <option value="0">Not Endorsed</option>
                          </FormControl>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        </td>
                        <td style={{textAlign: 'right'}}>
                          <Link to={
                            "/search?query=" + this.state.userQ
                            + "&category=" + this.state.catfilt
                            + "&endorsements=" + this.state.endfilt
                          } onClick={this.setSearch}>
                            <FontAwesomeIcon icon={faFilter} />
                          </Link>
                          &nbsp;
                          <Link to={
                            "/search?query=" + this.state.userQ
                          } onClick={this.clearFilt}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </td>
              </tr>
            </tbody>
          </table>
        </Tab>
        <Tab eventKey="users" title="Users">
          {this.state.searchQuery &&
            <UsersDisplay
              baseURL={this.state.baseURL}
              endpt={this.state.userEndpt + '/' + this.state.userQ}
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
