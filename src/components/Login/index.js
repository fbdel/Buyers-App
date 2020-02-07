import React from 'react';
import { Redirect } from 'react-router-dom';
import firebase from '../Firebase/firebase';
import "./style.css";
// import LoginJumbo from "/login-jumbo";

var that = null;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectMe: false
    }
    this.onChange = this.onChange.bind(this);
    that = this;
  }
  componentDidMount() {
    this.hideSlidingMenu();
  }
  hideSlidingMenu() {
    if (document.getElementById('main') != null)
      document.getElementById('main').style.display = 'none';
  }
  onChange() {
    this.setState({ redirectMe: true })
  }
  doLogin() {
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

  render() {
    if (this.state.redirectMe) {
      return <Redirect to='/home' />
    }
    return (
      <div className="container" 
      style={{
        backgroundColor: "#bdeaee"
      }}>
        <div
          className="jumbotron bg-info text-white"
          style={{
          
            marginBottom: 5,
            // backgroundColor: "#fe8a71",
            textShadow: "-1px -1px 0 #000",
            textShadow: "1px -1px 0 #000",
            textShadow: "-1px 1px 0 #000",
            textShadow: "1px 1px 0 #000",
            fontFamily: "Oxygen"

            // "Segoe UI", "Roboto", "",
            //     "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          }}
        >
          <p style={{ textAlign: "center" }}>
            <h1>
              <b>Buyers App</b>
            </h1>
            <h5>Where Tech and Buyers Meet</h5>
          </p>
        </div>

            <div className="d-flex justify-content-center h-100">
              <div className="card text-center" style={{ marginTop: 20 }}>
                <div className="card-header">
                  <h3>Sign In</h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="input-group form-group">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          style={{ fontSize: "14px" }}
                        >
                          <i className="fas fa-user"> User Email</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        id="email"
                        className="form-control"
                        placeholder="email"
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
                    <div className="form-group">
                      <input
                        type="button"
                        onClick={() => this.doLogin()}
                        value="Login"
                        className="btn float-right login_btn"
                      />
                    </div>
                  </form>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-center links">
                    Don't have an account?
                    <a className="text-warning" href="/registerUser">Register</a>
                  </div>
                  <a className="text-dark" href="https://github.com/fbdel/Buyers-App">Github Page</a>
                </div>
              </div>
            </div>
         
      </div>
    );
  }
}
export default Login;