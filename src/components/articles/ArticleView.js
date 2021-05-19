import React, { Component } from 'react';
import ArticleDelete from '../articles/ArticleDelete.js'
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
        this.setState({ article: data.data })
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

  render () {
    return (
      <>
        { this.state.userLoggedin
          ? (this.state.curUser.id == this.state.article.author.id
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
        <p>{this.state.article.category}</p>
        <div>{this.state.article.body}</div>
      </>
    )
  }
}
