import React, { Component } from 'react';
import ArticleDelete from '../articles/ArticleDelete.js'
import DiscussionView from '../discussions/DiscussionView.js'
import NewDiscussion from '../discussions/NewDiscussion.js'
import EndAdd from '../endorsements/EndAdd.js'
import EndShow from '../endorsements/EndShow.js'
import { Link } from "react-router-dom";
import { Button, Collapse } from 'react-bootstrap';

// import {
//   CSSTransition,
//   TransitionGroup,
// } from 'react-transition-group';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBurn,
  faHeartbeat,
  faRunning,
  faDumbbell,
  faShoePrints,
  faSpa,
  faWalking,
  faEdit,
  faTrash,
  faComments,
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
      endorsements: [],
      commentLoad: false,
      open: false,
      avatar: '/user-circle-solid.svg',
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
          endorsements: data.endorsements,
          isloaded: true,
          commentLoad: true,
        }, () => {
          this.getProfPic()
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

   setOpen = () => {
  //   // let opVal = window.document.getElementById(idVal).getAttribute('in');
  //   // console.log(opVal);
  //   // window.document.getElementById(idVal).setAttribute('in', !opVal);
  //   this.setState({
  //     open: true
  //   });
   }

   getProfPic = () => {

     fetch(this.state.baseURL + '/api/v1/uploads/uploads/avatar/' + this.state.article.author.user_avatar, {
       credentials: 'include',
       method: 'GET',
       redirect: 'follow',
     })
     .then(response => response.blob())
     .then(data => {
       console.log(data);
       console.log(data.type);
       if (!data.type.match(/text\/html/gmi)) {
         this.setState({
           avatar: URL.createObjectURL(data),
         });
       }

     })
     .catch(error => console.log('error', error));

   }

   updEnds = (item, act) => {
     let copyEnds = [...this.state.endorsements];
     this.setState({ endorsements: [], });

     switch (act) {
       case 'add':
         copyEnds.push(item);
         break;
       case 'remove':
         let myInd = copyEnds.findIndex(x => x.id === item.id)
         copyEnds.splice(myInd, 1);
         break;
       default:
     }
     this.setState({ endorsements: copyEnds, });
   }

  render () {
    let open = false;
    // setOpen = () => {
    //
    // }
    return (
      <div className="tab-content">
        { this.state.userLoggedin
          ? (this.state.curUser.id === this.state.article.author.id || this.state.curUser.role === 'admin'
            ? <div className="righttxt">
                <Link to={"/editarticle?id=" + this.state.article.id} title="Edit Entry">
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                &nbsp;
                <ArticleDelete baseURL={this.state.baseURL} endpt={this.state.endpt} checkLogin={this.state.checkLogin} redirectFunc={this.state.redirectFunc} id={this.state.article.id} setErrorMsg={this.setErrorMsg} />
              </div>
            :<></>
          )
          : <></>
        }
        {this.state.isloaded &&
          <>
            <p className="rederror">{this.state.errorMsg}</p>
            <h3>{this.categoryIcon(this.state.article.category)}&nbsp;{this.state.article.title}</h3>
            <p>
            &nbsp;&nbsp;&nbsp;by:&nbsp;&nbsp;&nbsp;
            <img id={"icImage"} className="icImage" src={this.state.avatar} alt="Avatar"/>
            &nbsp;
            <Link to={"/users?id=" + this.state.article.author.id}>{this.state.article.author.username}
            </Link></p>
            <article>
            <div className="content" dangerouslySetInnerHTML={{__html: this.state.article.body}}></div>
            </article>
          </>
        }

        <div>
          <p style={{fontWeight: 'bold'}}>Endorsements</p>
          {this.state.isloaded &&
            <>
            {this.state.curUser.role === 'professional' || this.state.curUser.role === 'admin'
              ?<EndAdd baseURL={this.state.baseURL} curUser={this.state.curUser} curArt={this.state.article} updEnds={this.updEnds} />
              :<></>
            }
              <ul>
                {this.state.endorsements.map((endorsement, ind) => {
                 return (
                   <EndShow baseURL={this.state.baseURL} curEnd={endorsement} />
                 )
               })}
              </ul>
            </>
          }
        </div>

        <div className="fullcomsdiv">
              <a href=""
                onClick={(e) => {
                  e.preventDefault();
                  if (document.getElementById('commentsdiv').classList.contains('show')) {
                    document.getElementById('commentsdiv').classList.remove('show');
                  }
                  else {
                    document.getElementById('commentsdiv').classList.add('show');
                  }
                }}
              >
                <FontAwesomeIcon icon={faComments} /> Comments
              </a>
              <Collapse in={open}>
                <div id="commentsdiv">
                  {this.state.isloaded &&
                    <NewDiscussion baseURL={this.state.baseURL} article={this.state.article} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} addComment={this.addComment} />
                  }
                  {this.state.discussions.length > 0 &&
                  <div className="commentscroll">
                    <table className="disctab">
                      <tbody>
                        {this.state.commentLoad && this.state.discussions.length > 0 &&
                           this.state.discussions.map((comment, ind) => {
                            return (
                              <DiscussionView com={comment} baseURL={this.state.baseURL} curUser={this.state.curUser} userLoggedin={this.state.userLoggedin} ind={ind} addComment={this.addComment} />
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                }
                </div>
              </Collapse>
            </div>
      </div>
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
