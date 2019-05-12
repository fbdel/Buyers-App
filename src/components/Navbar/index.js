import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { Redirect } from 'react-router-dom';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("imageSrc");
    this.setState({ redirect: true })
  }
  render() {
    var userName = '';
    if (this.state.redirect) {
      return <Redirect to="/" />
    } else {
      var user = localStorage.getItem("user");
      if(user!== null && user!== undefined){
        var parsedUser = JSON.parse(user);
        userName= parsedUser.firstName + ' ' +parsedUser.lastName;
      }
      console.log (userName)
      return (
        <div>
          <div id="mySidenav" className="sidenav bg-info">
            <a
              href="javascript:void(0)"
              className="closebtn"
              onClick={() => this.closeNav()}
            >
              &times;
            </a>
            <div className = "bg-warning">
               <p align="center" style={{ fontSize: 30 }}>
                <b>{userName}</b>
               </p>
            </div>
           
            <hr/>
            <a href="/home">Events</a>
            <a href="/additemtoevent">Items</a>
            <a href="" onClick={() => this.logout()}>
              Sign Out
            </a>
          </div>

          <div id="main">
            <span style={{ fontSize: 30 }} onClick={() => this.openNav()}>
              &#9776;
            </span>
          </div>
        </div>
      );
    }


  }
}
export default Navbar;
