import React, { Component } from 'react';
import CredList from '../users/CredList.js'
import CredAdd from '../users/CredAdd.js'

export default class CredForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: this.props.baseURL,
      curUser: this.props.curUser,
      user: this.props.user,
      credentials: this.props.credentials,
      errorMsg: '',
    }
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value});
  }

  updCreds = (item, act) => {
    let copyCreds = [...this.state.credentials];
    this.setState({ credentials: [], });

    switch (act) {
      case 'add':
        copyCreds.push(item);
        break;
      case 'remove':
        let myInd = copyCreds.findIndex(x => x.id === item.id)
        copyCreds.splice(myInd, 1);
        break;
      default:
    }
    this.setState({ credentials: copyCreds, });
  }

  render () {
    return (
      <div className="editingdiv">
        <h3>Credentials</h3>
        <table className="artstable">
          <tbody>
            { this.state.credentials.map((cred, ind) => {
                return (
                  <CredList baseURL={this.state.baseURL} cred={cred} updCreds={this.updCreds} curUser={this.state.curUser} user={this.state.user} />
                )
              })
            }
          </tbody>
        </table>
        { this.state.curUser.id === this.state.user.id || this.state.curUser.role === 'admin'
          ? <CredAdd baseURL={this.state.baseURL} curUser={this.state.curUser} user={this.props.user} updCreds={this.updCreds} />
          : <></>
        }
      </div>
    )
  }
}
