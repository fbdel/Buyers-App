import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import firebase from '../Firebase/firebase';

const uuid = require('uuid');
var alreadySavedId = 0;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectMe: false,
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
    let that = this;
  }
  componentDidMount() {
    this.hideSlidingMenu();
  }
  hideSlidingMenu() {
    if (document.getElementById('main') != null)
      document.getElementById('main').style.display = 'none';
  }

  onSave() {
    let postRef = firebase.database().ref('users').orderByKey().limitToLast(1);
    let id = 0;
    let email = document.getElementById('email').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let password = document.getElementById('password').value;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = dd + '/' + mm + '/' + yyyy;
    if (email.toString().trim() !== '' && email.toString().trim() !== null && firstName.toString().trim() !== '' && firstName.toString().trim() !== null && lastName.toString().trim() !== ''
      && lastName.toString().trim() !== null && password.toString().trim() !== '' && password.toString().trim() !== null) {
      new Promise(function (resolve, reject) {
        setTimeout(() => resolve(firebase.database().ref('users').orderByChild('id').once("value", snapshot => {
          const userData = snapshot.val();
          snapshot.forEach(function (childSnapshot) {
            id++;
          });
        })), 1000);
      }).finally(() => console.log("Promise ready"))
        .then(function () {
          firebase.database().ref('users').orderByChild('email').equalTo(email).once("value", snapshot => {
            const userData = snapshot.val();
            if (!userData) {
              firebase.database().ref('users/').push({
                email,
                firstName,
                id,
                lastName,
                password,
                today
              }).then((data) => {
                //success callback
                console.log('data ', data)
                if (window.confirm("you are registered successfully, please login to enter")) {
                  window.location.href = "/"
                  // this.setState({ redirectToLogin: true })
                }
              }).catch((error) => {
                //error callback
                console.log('error ', error)
              });
            }
            else {
              var value = '';
              snapshot.forEach(function (childSnapshot) {
                value = childSnapshot.val();
              });
              alert('User email ' + value.email + ' already exists.');
            }
          })
        })
    }
    else {
      alert('Plese fill all fields for registering')
    }
  }

  getUserTableId() {
    var id = 0;

    alreadySavedId = id;
  }
  submitData(event) {
    event.preventDefault();
    firebase
      .database()
      .ref(`Newdata/${this.state.uid}`)
      .set({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      })
  }

  onClear() {
    document.getElementById('email').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('password').value = '';
  }

  redirectToLogin() {
    this.setState({ redirectMe: true })
  }

  doLogin() {
    let that = this;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    firebase.database().ref('users').orderByChild('email').equalTo(email).once("value", snapshot => {
      const userData = snapshot.val();
      if (userData) {
        snapshot.forEach(function (childSnapshot) {
          const value = childSnapshot.val();
          if (value.password.trim() === password.trim()) {
            localStorage.setItem("user", JSON.stringify(value));
            that.onChange();
          }
          else {
            alert('Either user id or password is incorrect')
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
          }
        });
      }
      else {
        alert('Either user id or password is incorrect')
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
      }



    })
  }





  saveAndLogin() {
    this.onSave();
  }
  render() {
    if (this.state.redirectMe) {
      return <Redirect to='/' />
    }
    return (
      <div className="container">
        <div
          className="jumbotron bg-info text-white"
          style={{
            marginTop: 20,
            marginBottom: 0,
            // backgroundColor: "#fe8a71",
            textShadow: "-1px -1px 0 #000",
            textShadow: "1px -1px 0 #000",
            textShadow: "-1px 1px 0 #000",
            textShadow: "1px 1px 0 #000",
            fontFamily: "Oxygen"
          }}
        >
          <p style={{ textAlign: "center" }}>
            <h1>
              <b>Sign Up Today</b>
            </h1>
            <h5 >You will not regret it</h5>
          </p>

          <div className="d-flex justify-content-center h-100">
            <div className="card text-center" style={{ marginTop: 20 }}>
              <div className="card-header">
                <h3 />
              </div>
              <div className="card-body">
                <form>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        style={{ fontSize: "14px" }}
                      >
                        <i className="fa fa-envelope"> Email</i>
                      </span>
                    </div>
                    <input
                      type="text"
                      id="email"
                      className="form-control"
                      placeholder="e-mail"
                    />
                  </div>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        style={{ fontSize: "14px" }}
                      >
                        <i className="fas fa-user"> First Name</i>
                      </span>
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      className="form-control"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        style={{ fontSize: "14px" }}
                      >
                        <i className="fas fa-user"> Last Name</i>
                      </span>
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        style={{ fontSize: "14px" }}
                      >
                        <i className="fas fa-key"> Password</i>
                      </span>
                    </div>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="password"
                    />
                  </div>
                  {/* <div className="row align-items-center remember">
                                    <input type="checkbox" />Remember Me
                            </div> */}
                  <input
                    type="button"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    value="Cancel"
                    className="btn float-right login_btn"
                  />

                  <div className="form-group">
                    <input
                      style={{ marginRight: 10 }}
                      type="button"
                      onClick={() => this.saveAndLogin()}
                      value="Register"
                      className="btn float-right login_btn"
                    />
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-center links" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;