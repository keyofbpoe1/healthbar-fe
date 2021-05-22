import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'react-bootstrap';

export default class ArticleEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      category: '',
      body: '',
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      article: {author:{}},
      errorMsg: '',
      tinykey: process.env.REACT_APP_TINYKEY
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
          title: data.data.title,
          category: data.data.category,
          body: data.data.body,
        })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount(){
    this.getArticle();
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleArtUpdate = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt + this.state.article.id;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      title: this.state.title,
      category: this.state.category,
      body: window.document.getElementById("body").value,
    });

    let requestOptions = {
      credentials: 'include',
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(reqURL, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          title: '',
          category: '',
          body: ''
        })
        if (data.status.code !== 200) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.state.checkLogin()
          this.state.redirectFunc('/articles?id=' + this.state.article.id)
        }
      })
      .catch(error => console.log('error', error));
  }

  handleEditorChange = () => {
    let iframe = window.document.getElementById("body_ifr");
    let elmnt = iframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML;
    window.document.getElementById("body").value = elmnt;
  }

  render () {
    return (
      <>
        { this.state.userLoggedin
          ? (this.state.curUser.id === this.state.article.author.id || this.state.curUser.role === 'admin'
            ? <form onSubmit={this.handleArtUpdate}>
                <h3>Edit Article</h3>
                <p className="rederror">{this.state.errorMsg}</p>
                <label htmlFor="title"></label>
                <input type="text" id="title" name="title" onChange={this.handleChange} value={this.state.title} placeholder="title" required/>
                <br/>
                <label htmlFor="category"></label>
                <select name="category" id="category" onChange={this.handleChange} value={this.state.category} required>
                  <option disabled value=""> -- Select -- </option>
                  <option value="cardio">Cardio</option>
                  <option value="dance">Dance</option>
                  <option value="endurance">Endurance</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="recovery">Recovery</option>
                  <option value="strength">Strength</option>
                  <option value="weight">Weight Training</option>
                </select>
                <br/>
                <label htmlFor="body"></label>
                <Editor
                  id="body"
                  name="body"
                  initialValue={this.state.body}
                  apiKey={this.state.tinykey}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image imagetools emoticons',
                      'charmap print preview anchor help fullscreen',
                      'searchreplace visualblocks code',
                      'insertdatetime media table paste wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic | \
                      alignleft aligncenter alignright | \
                      bullist numlist outdent indent | link image media | fullscreen preview | help'
                  }}
                  onChange={this.handleEditorChange}
                />
                <br/>
                <Button type="submit" value="Save">Save</Button>
                &nbsp;
                <Link to="/"><Button type="button">Cancel</Button></Link>
              </form>
            : <h1>Unauthorized</h1>
          )
          : <h1>Unauthorized</h1>
        }
      </>
    )
  }
}

// <textarea id="body" name="bio" rows="8" cols="80" onChange={this.handleChange} value={this.state.body} placeholder="Article body / exercise description"></textarea>
