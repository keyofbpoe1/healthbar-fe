import React, { Component } from 'react';
import ArticlesList from '../articles/ArticlesList.js'
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

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

export default class ArticlesDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt,
      errorMsg: '',
      articles: [],
      artLength: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      searchTerm: '',
      isloaded: false,
    }
  }

  resetSearch = () => {
    this.setState({
      isloaded: false,
    }, () => {
      this.searchArticles();
    });
  }

  searchArticles = () => {
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
        let totPages = Math.ceil(parseInt(data.artlength) / parseInt(this.state.limit));
        console.log(totPages);
        this.setState({
          articles : data.data,
          artLength: data.artlength,
          totalPages: totPages,
          isloaded: true,
        })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.resetSearch();
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
      this.resetSearch();
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
  //
  // getProfPic = (uav, ind) => {
  //
  //   let retVal = '/user-circle-solid.svg';
  //
  //   let myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   myHeaders.append('folder', 'avatar/');
  //   myHeaders.append('fname', uav);
  //
  //   fetch(this.state.baseURL + '/api/v1/uploads/upload', {
  //     credentials: 'include',
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   })
  //   .then(response => response.blob())
  //   .then(data => {
  //     console.log(data);
  //     console.log(data.type);
  //     if (data.type !== 'text/html') {
  //       retVal = URL.createObjectURL(data);
  //     }
  //     window.document.getElementById('icImage-' + ind).setAttribute('src', retVal);
  //   })
  //   .catch(error => console.log('error', error));
  //
  // }

  render () {
    return (
      <table className="artstable">
        <tbody>
          { this.state.isloaded &&
              this.state.articles.map((entry, ind) => {
              return (
                <ArticlesList baseURL={this.state.baseURL} entry={entry} />
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

// <tr>
//   <td><Link to={"/articles?id=" + entry.id}>{this.categoryIcon(entry.category)}</Link></td>
//   <td>
//     <Link style={{fontWeight: 'bold'}} to={"/articles?id=" + entry.id}>{entry.title}</Link>
//     <br/>
//     <img id={"icImage-" + ind} className="icImage" src="/user-circle-solid.svg" onLoad={this.getProfPic(entry.author.user_avatar, ind)} alt="Avatar"/>
//     &nbsp;
//     <Link to={"/users?id=" + entry.author.id}>{entry.author.username}</Link>
//     <br/>
//     {this.dateTrim(entry.created_date)}
//   </td>
// </tr>
