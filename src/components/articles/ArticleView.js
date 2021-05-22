import React, { Component } from 'react';
import ArticleDelete from '../articles/ArticleDelete.js'
import DiscussionView from '../discussions/DiscussionView.js'
import NewDiscussion from '../discussions/NewDiscussion.js'
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBurn,
  faHeartbeat,
  faRunning,
  faDumbbell,
  faShoePrints,
  faSpa,
  faWalking,
} from '@fortawesome/free-solid-svg-icons'

export default class ArticleView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      article: {author:{}},
      errorMsg: '',
      isloaded: false,
      discussions: [],
      commentLoad: false,
    }
  }

  getArticle = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get('id');
    let requestOptions = {
      credentials: 'include',
      method: 'GET',
      redirect: 'follow'
    };

    fetch(this.state.baseURL +  this.state.endpt + idParam, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          article: data.data,
          discussions: data.discussions,
          isloaded: true,
          commentLoad: true,
        })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.getArticle();
  }

  setErrorMsg = (msg) => {
    this.setState({
      errorMsg: msg,
    });
  }

  addComment = (com, act, ind) => {
    const copyDiscussions = [...this.state.discussions];
    this.setState({
      discussions: [],
    });
    let myInd;
    switch (act) {
      case 'add':
        copyDiscussions.push(com);
        break;
        case 'remove':
          myInd = copyDiscussions.findIndex(x => x.id === ind)
          copyDiscussions.splice(myInd, 1);
          break;
        case 'update':
          myInd = copyDiscussions.findIndex(x => x.id === ind)
          copyDiscussions.splice(myInd, 1, com);
          break;
      default:
    }
    this.setState({
      discussions: copyDiscussions,
    });
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
    return <FontAwesomeIcon icon={retVal} style={{ fontSize: '50px' }} />;
  }

  render () {
    return (
      <>
        { this.state.userLoggedin
          ? (this.state.curUser.id === this.state.article.author.id || this.state.curUser.role === 'admin'
            ? <>
                <Link to={"/editarticle?id=" + this.state.article.id}><Button type="button">Edit</Button></Link>
                &nbsp;
                <ArticleDelete baseURL={this.state.baseURL} endpt={this.state.endpt} checkLogin={this.state.checkLogin} redirectFunc={this.state.redirectFunc} id={this.state.article.id} setErrorMsg={this.setErrorMsg} />
              </>
            :<></>
          )
          : <></>
        }
        {this.state.isloaded &&
          <>
            <p className="rederror">{this.state.errorMsg}</p>
            <h3>{this.categoryIcon(this.state.article.category)}&nbsp;{this.state.article.title}</h3>
            <p><Link to={"/users?id=" + this.state.article.author.id}>{this.state.article.author.username}</Link></p>
            <article>
            <div className="content" dangerouslySetInnerHTML={{__html: this.state.article.body}}></div>
            </article>
          </>
        }
        <h4>Comments</h4>
        {this.state.isloaded &&
          <NewDiscussion baseURL={this.state.baseURL} article={this.state.article} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} addComment={this.addComment} />
        }
        <table>
          <tbody>
            {this.state.commentLoad &&
               this.state.discussions.map((comment, ind) => {
                return (
                  <DiscussionView com={comment} baseURL={this.state.baseURL} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} ind={ind} addComment={this.addComment} />
                )
              })
            }
          </tbody>
        </table>
      </>
    )
  }
}

// {this.state.isloaded
//   ? <>
//       <h3>Discussion</h3>
//       <table>
//         <tbody>
//           { this.state.discussions.map((comment, ind) => {
//             return (
//               <DiscussionView com={comment} baseURL={this.state.baseURL} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} ind={ind} addComment={this.addComment} />
//             )
//           })
//           }
//         </tbody>
//       </table>
//       <NewDiscussion baseURL={this.state.baseURL} article={this.state.article} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} addComment={this.addComment} />
//     </>
//   : <></>
// }
