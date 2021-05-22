import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'react-bootstrap';

export default class NewArticle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      endpt: this.props.endpt + '/',
      title: '',
      category: '',
      body: '',
      checkLogin: this.props.checkLogin,
      redirectFunc: this.props.redirectFunc,
      errorMsg: '',
      curUser: this.props.curUser,
      userLoggedin: this.props.userLoggedin,
      tinykey: process.env.REACT_APP_TINYKEY,
    }
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  handleNewArt = (event) => {
    event.preventDefault();

    this.setState({
      errorMsg: '',
    });

    let reqURL = this.state.baseURL + this.state.endpt;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      title: this.state.title,
      category: this.state.category,
      body: window.document.getElementById("body").value,
    });

    let requestOptions = {
      credentials: 'include',
      method: 'POST',
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
          body: '',
        })
        if (data.status.code === 401) {
          this.setState({
            errorMsg: data.status.message,
          })
        }
        else {
          this.state.checkLogin()
          this.state.redirectFunc('/users?id=' + this.state.curUser.id)
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
        ? <form onSubmit={this.handleNewArt}>
            <h3>New Article</h3>
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
            <Link to={'/users.id=' + this.state.curUser.id}><Button type="button">Cancel</Button></Link>
          </form>
        : <h1>Unauthorized</h1>
      }
      {/*value={this.state.body}*/}
      {/*<textarea id="body" name="body" rows="8" cols="80" onChange={this.handleChange} value={this.state.body} placeholder="Article body / exercise description"></textarea>*/}
      </>
    )
  }
}
