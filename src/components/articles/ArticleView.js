import React, { Component } from 'react';
import ArticleDelete from '../articles/ArticleDelete.js'
import DiscussionView from '../discussions/DiscussionView.js'
import NewDiscussion from '../discussions/NewDiscussion.js'
import { Link } from "react-router-dom";

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
    switch (act) {
      case 'add':
        copyDiscussions.push(com);
        break;
        case 'remove':
          copyDiscussions.splice(ind, 1);
          break;
        case 'update':
          copyDiscussions.splice(ind, com);
          break;
      default:
    }
    this.setState({
      discussions: copyDiscussions,
    });
  }

  render () {
    return (
      <>
        { this.state.userLoggedin
          ? (this.state.curUser.id == this.state.article.author.id || this.state.curUser.role == 'admin'
            ? <>
                <Link to={"/editarticle?id=" + this.state.article.id}><button type="button">Edit</button></Link>
                &nbsp;
                <ArticleDelete baseURL={this.state.baseURL} endpt={this.state.endpt} checkLogin={this.state.checkLogin} redirectFunc={this.state.redirectFunc} id={this.state.article.id} setErrorMsg={this.setErrorMsg} />
              </>
            :<></>
          )
          : <></>
        }
        <p className="rederror">{this.state.errorMsg}</p>
        <h3>{this.state.article.title}</h3>
        <p>By: <Link to={"/users?id=" + this.state.article.author.id}>{this.state.article.author.username}</Link></p>
        <p>{this.state.article.category}</p>
        <div>{this.state.article.body}</div>
        <h3>Discussion</h3>
        <table>
          <tbody>
            { this.state.discussions.map((comment, ind) => {
              return (
                <DiscussionView com={comment} baseURL={this.state.baseURL} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} ind={ind} addComment={this.addComment} />
              )
            })
            }
          </tbody>
        </table>
        <NewDiscussion baseURL={this.state.baseURL} article={this.state.article} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} addComment={this.addComment} />
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
