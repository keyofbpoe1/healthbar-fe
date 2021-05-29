import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faBurn,
  faHeartbeat,
  faRunning,
  faDumbbell,
  faShoePrints,
  faSpa,
  faWalking,
} from '@fortawesome/free-solid-svg-icons'

export default class ArticlesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      entry: this.props.entry,
      avatar: '/user-circle-solid.svg',
    }
  }

  getProfPic = () => {

    fetch(this.state.baseURL + '/api/v1/uploads/uploads/avatar/' + this.state.entry.author.user_avatar, {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow',
    })
    .then(response => response.blob())
    .then(data => {
      console.log(data);
        if (data.type !== 'text/html') {
        this.setState({
          avatar: URL.createObjectURL(data),
        });
      }
    })
    .catch(error => console.log('error', error));

  }

  componentDidMount(){
    this.getProfPic();
  }

  dateTrim = (val) => {
    let d = new Date(val);
    return d.toDateString();
  }

  categoryIcon = (val) => {
    let retVal = faBurn;
    switch (val) {
      case 'cardio':
        retVal = faHeartbeat;
        break;
      case 'dance':
        retVal = faShoePrints;
        break;
      case 'endurance':
        retVal = faRunning;
        break;
      case 'flexibility':
        retVal = faWalking;
        break;
      case 'recovery':
        retVal = faSpa;
        break;
      case 'strength':
        retVal = faBurn;
        break;
      case 'weight':
        retVal = faDumbbell;
        break;
      default:
        //nothing
    }
    return <FontAwesomeIcon icon={retVal} style={{ fontSize: '100px' }} />;
  }

  render () {
    return (
      <tr>
        <td><Link to={"/articles?id=" + this.state.entry.id}>{this.categoryIcon(this.state.entry.category)}</Link></td>
        <td>
          <Link style={{fontWeight: 'bold'}} to={"/articles?id=" + this.state.entry.id}>{this.state.entry.title}</Link>
          <br/>

          <Link to={"/users?id=" + this.state.entry.author.id}>
            <img id={"icImage-" + this.state.entry.id} className="icImage" src={this.state.avatar} alt="Avatar"/>
            &nbsp;
            {this.state.entry.author.username}
          </Link>
          <br/>
          {this.dateTrim(this.state.entry.created_date)}
        </td>
      </tr>
    )
  }
}
