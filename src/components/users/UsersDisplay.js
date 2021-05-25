import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from '@fortawesome/free-solid-svg-icons'

export default class UsersDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt,
      errorMsg: '',
      users: [],
      usersLength: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      searchTerm: '',
    }
  }

  searchUsers = () => {
    // let urlParams = new URLSearchParams(window.location.search);
    // let queryParam = urlParams.get('query');

    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL +  this.state.endpt + '/' + this.state.page + '/' + this.state.limit, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        let totPages = Math.ceil(parseInt(data.userlength) / parseInt(this.state.limit));
        console.log(totPages);
        this.setState({
          users : data.data,
          usersLength: data.userlength,
          totalPages: totPages,
        })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.searchUsers();
  }

  iterPage = (e) => {
    e.preventDefault();
    let newPg = 1;
    switch (e.currentTarget.id) {
      case 'firstpage':
        newPg = 1;
        break;
      case 'downpage':
          newPg = this.state.page - 1;
        break;
      case 'uppage':
        newPg = this.state.page + 1;
        break;
      case 'lastpage':
        newPg = this.state.totalPages;
        break;
      default:
        newPg = 1;
    }
    this.setState({ page: newPg }, () => {
      this.searchUsers();
    });
  }

  // dateTrim = (val) => {
  //   let d = new Date(val);
  //   return d.toDateString();
  // }
  //
  // categoryIcon = (val) => {
  //   let retVal = faBurn;
  //   switch (val) {
  //     case 'cardio':
  //       retVal = faHeartbeat;
  //       break;
  //     case 'dance':
  //       retVal = faShoePrints;
  //       break;
  //     case 'endurance':
  //       retVal = faRunning;
  //       break;
  //     case 'flexibility':
  //       retVal = faWalking;
  //       break;
  //     case 'recovery':
  //       retVal = faSpa;
  //       break;
  //     case 'strength':
  //       retVal = faBurn;
  //       break;
  //     case 'weight':
  //       retVal = faDumbbell;
  //       break;
  //     default:
  //       //nothing
  //   }
  //   return <FontAwesomeIcon icon={retVal} style={{ fontSize: '100px' }} />;
  // }

  render () {
    return (
      <table className="artstable">
        <tbody>
          { this.state.users.map((user, ind) => {
            return (
              <tr>
                <td>
                  <FontAwesomeIcon icon={faUser} />&nbsp;&nbsp;&nbsp;{user.role}
                </td>
                <td>
                  <Link to={"/users?id=" + user.id}>{user.username}</Link>
                </td>
              </tr>
            )
          })
          }
          {this.state.page !== 1 &&
            <>
              <a id="firstpage" href="" onClick={this.iterPage}><FontAwesomeIcon icon={faAngleDoubleLeft} /></a>
              &nbsp;
              <a id="downpage" href="" onClick={this.iterPage}><FontAwesomeIcon icon={faAngleLeft} /></a>
            </>
          }
          {this.state.page !== this.state.totalPages &&
            <>
              &nbsp;
              <a id="uppage" href="" onClick={this.iterPage}><FontAwesomeIcon icon={faAngleRight} /></a>
              &nbsp;
              <a id="lastpage" href="" onClick={this.iterPage}><FontAwesomeIcon icon={faAngleDoubleRight} /></a>
            </>
          }
        </tbody>
      </table>
    )
  }
}
