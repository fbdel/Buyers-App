import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import Webcam from "react-webcam";
import Modal from '@trendmicro/react-modal';
import '@trendmicro/react-modal/dist/react-modal.css';
import firebase from '../Firebase/firebase';
import "./style.css";

var that = '';
var downloadURL = '';


var imageSrc = null;
const videoConstraints = {
  width: 350,
  height: 350,
  facingMode: "user"
};
var user = null;
var eventData = null;
var eventId = '';
var _isMounted = false;
var selectedFile = '';

class AddItemToEvent extends React.Component {
  constructor(props) {
    super(props);
    this.removeBackgroundImage();
    this.state = {
      imageData: null,
      saveImage: false,
      webcamEnabled: false,
      redirect: false
    };
    if (this.props.location.state != undefined) {
      localStorage.setItem("eventId", this.props.location.state.eventId);
    }
    that = this;
    $(document).ready(function() {
      $("#file").on("change", function(event) {
        selectedFile = event.target.files[0];
      });
    });
  }

  removeBackgroundImage() {
    var bodyElement = document.getElementById("bodyId");
    if (bodyElement !== null && bodyElement !== undefined) {
      bodyElement.style.background = "none";
    }
  }

  enableWebcam = () =>
    this.setState({ webcamEnabled: !this.state.webcamEnabled });

  setRef = webcam => {
    this.webcam = webcam;
  };
  capture = () => {
    imageSrc = this.webcam.getScreenshot();
    localStorage.setItem("imageSrc", imageSrc);
    // this.setState({
    //     imageData: imageSrc
    // })
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  // onClickRetake = (e) => {
  //     e.persist();
  //     this.setState({
  //         imageData: null
  //     })
  // }
  saveButtonClick() {
    var filename = "";
    var uploadTask = "";
    var storageRef = "";
    if (
      selectedFile !== null &&
      selectedFile !== undefined &&
      selectedFile !== ""
    ) {
      filename = selectedFile.name;
      storageRef = firebase.storage().ref("/images/" + filename);
      uploadTask = storageRef.put(selectedFile);
      uploadTask.on(
        "state_changed",
        function(snapshot) {},
        function(error) {
          console.log(error);
        },
        function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            var image = downloadURL;
            var vendor = document.getElementById("vendor").value;
            var price = document.getElementById("price").value;
            var moq = document.getElementById("moq").value;
            var comment = document.getElementById("comment").value;
            var description = document.getElementById("description").value;
            var downPayment = document.getElementById("downpayment").value;
            var eventId = localStorage.getItem("eventId");
            var itemName = document.getElementById("itemname").value;
            var productTime = document.getElementById("producttime").value;
            var size = document.getElementById("size").value;
            var vendor = document.getElementById("vendor").value;
            if (!that.state.webcamEnabled) {
              if (
                that.isValidString(image) &&
                that.isValidString(vendor) &&
                that.isValidString(price) &&
                that.isValidString(moq)
              ) {
                // const event = snapshot.val();
                firebase
                  .database()
                  .ref("items/")
                  .push({
                    comment,
                    description,
                    downPayment,
                    eventId,
                    image,
                    itemName,
                    moq,
                    price,
                    productTime,
                    size,
                    vendor
                  })
                  .then(data => {
                    //success callback
                    console.log("data ", data);
                    alert("event saved successfully.");
                    window.location.reload();
                  })
                  .catch(error => {
                    //error callback
                    console.log("error ", error);
                  });
              } else {
                alert("Please fill records in all fields");
              }
            } else {
              alert("Please close/disable Webcam before save");
            }
          });
        }
      );
    } else {
      var imageData = this.getBase64Image(localStorage.getItem("imageSrc"));
      filename = Math.random()
        .toString()
        .replace("0.", "");
      storageRef = firebase.storage().ref("/images/" + filename);
      uploadTask = storageRef.put(imageData);
      uploadTask.on(
        "state_changed",
        function(snapshot) {},
        function(error) {
          console.log(error);
        },
        function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            var image = downloadURL;
            var vendor = document.getElementById("vendor").value;
            var price = document.getElementById("price").value;
            var moq = document.getElementById("moq").value;
            var comment = document.getElementById("comment").value;
            var description = document.getElementById("description").value;
            var downPayment = document.getElementById("downpayment").value;
            var eventId = localStorage.getItem("eventId");
            var itemName = document.getElementById("itemname").value;
            var productTime = document.getElementById("producttime").value;
            var size = document.getElementById("size").value;
            var vendor = document.getElementById("vendor").value;
            if (!that.state.webcamEnabled) {
              if (
                that.isValidString(image) &&
                that.isValidString(vendor) &&
                that.isValidString(price) &&
                that.isValidString(moq)
              ) {
                // const event = snapshot.val();
                firebase
                  .database()
                  .ref("items/")
                  .push({
                    comment,
                    description,
                    downPayment,
                    eventId,
                    image,
                    itemName,
                    moq,
                    price,
                    productTime,
                    size,
                    vendor
                  })
                  .then(data => {
                    //success callback
                    console.log("data ", data);
                    alert("event saved successfully.");
                    window.location.reload();
                  })
                  .catch(error => {
                    //error callback
                    console.log("error ", error);
                  });
              } else {
                alert("Please fill records in all fields");
              }
            } else {
              alert("Please close/disable Webcam before save");
            }
          });
        }
      );
    }
  }

  isValidString(value) {
    if (
      value.toString().trim() !== null &&
      value.toString().trim() !== undefined &&
      value.toString().trim() !== ""
    ) {
      return true;
    }
    return false;
  }

  onClickSave = e => {
    e.persist();
    this.saveButtonClick();
    // this.setState(
    //     (previousState) => {
    //         return {
    //             saveImage: !previousState.saveImage
    //         }
    //     })
  };

  // handleChange = (e) => {
  //     e.persist();
  //     this.setState({
  //         [e.target.name]: e.target.value
  //     })
  // }

  handleSaveSubmit = e => {
    e.preventDefault();
    let imageObject = {
      image_name: this.state.image_name
    };
  };

  getBase64Image(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }
  renderShowImage() {
    if (this.state.imageData !== null || localStorage.getItem("imageSrc")) {
      return (
        <div className="row input-group mb-3">
          <div className="col-sm-12 text-center">
            <div>
              <span className="input-group-text bg-warning" id="basic-addon1">
                Your Image
              </span>
            </div>
            <img
              id="imgShowPic"
              src={
                this.state.imageData != null
                  ? this.state.imageData
                  : localStorage.getItem("imageSrc")
              }
            />
          </div>
        </div>
      );
    }
  }

  returnHome() {
    that.setState({ redirect: true });
  }

  renderTableData() {
    var events = [];
    var event = null;
    user = localStorage.getItem("user");
    var userObj = JSON.parse(user);
    var userId = userObj.id;
    var eventId = localStorage.getItem("eventId");
    new Promise(function(resolve, reject) {
      setTimeout(
        () =>
          resolve(
            firebase
              .database()
              .ref("items")
              .orderByChild("eventId")
              .once("value", snapshot => {
                snapshot.forEach(function(childSnapshot) {
                  var value = childSnapshot.val();
                  if (
                    eventId.toString().trim() ===
                    value.eventId.toString().trim()
                  ) {
                    events.push(childSnapshot.val());
                  }
                });
              })
          ),
        2000
      );
    })
      .finally(() => console.log("Promise ready"))
      .then(function() {
        if (
          document.getElementById("tblEventDetails") !== null &&
          document.getElementById("tblEventDetails") !== undefined
        ) {
          var tableRef = document
            .getElementById("tblEventDetails")
            .getElementsByTagName("tbody")[0];
          tableRef.innerHTML = "";
          events.map((events, index) => {
            var newRow = tableRef.insertRow(tableRef.rows.length);
            const {
              eventId,
              vendor,
              image,
              price,
              moq,
              comment,
              description,
              downPayment,
              itemName,
              size
            } = events;
            var htmlData = "";
            htmlData =
              "<tr key=" +
              eventId +
              ">" +
              "<td>" +
              vendor +
              "</td>" +
              "<td><img height= 50 width= 50 src=" +
              image +
              " /></td>" +
              "<td>" +
              moq +
              "</td>" +
              "<td>" +
              comment +
              "</td>" +
              "<td>" +
              description +
              "</td>" +
              "<td>" +
              downPayment +
              "</td>" +
              "<td>" +
              price +
              "</td>" +
              "<td>" +
              itemName +
              "</td>" +
              "<td>" +
              size +
              "</td>" +
              "</tr>";

            newRow.innerHTML = htmlData;
          });
        }
      });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/home" />;
    } else {
      user = localStorage.getItem("user");
      if (user != null && user != undefined) {
        return (
          <div>
            <div
              className="jumbotron jumbotron-fluid text-center bg-dark text-white"
              style={{ height: "100px" }}
            >
              <div className="container">
                <h1 className="display-4" style={{ fontFamily: "Ubuntu" }}>
                  New Item
                </h1>
              </div>
            </div>
            <div>
              {/* <h3 className="display-5 text-center text-underline">
                <u>Current Event: {this.props.name}</u>
              </h3> */}
            </div>

            <form className="container ">
              <div className=" form-container col-sm-12 ">
                {this.state.webcamEnabled ? (
                  <div className="row input-group mb-3">
                    <div className="col-sm-12 text-center">
                      <span
                        className="input-group-text text-center"
                        id="basic-addon1"
                      >
                        WebCam
                      </span>
                      <Webcam
                        audio={false}
                        height={350}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        width={350}
                        videoConstraints={videoConstraints}
                      />
                      <span
                        className="input-group-text text-center"
                        id="basic-addon1"
                      >
                        WebCam
                      </span>
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              
                <div className="row input-group mb-3">
                  <div className="col-sm-12 text-center">
                    <button
                      id="btnTakePic"
                      className="btn btn-light btn-outline-secondary fa fa-image bg-info text-white"
                      style={{
                        width: "150px",
                        height: "50px",
                        marginRight: "5px"
                      }}
                      onClick={this.capture}
                    >
                      {" "}
                      Take Picture
                    </button>
                    <button
                      className="btn btn-light btn-outline-secondary fa fa-image bg-info text-white"
                      style={{
                        width: "150px",
                        height: "50px",
                        marginRight: "5px"
                      }}
                      id="btnEnableCamera"
                      type="button"
                      onClick={this.enableWebcam}
                    >
                      {!this.state.webcamEnabled
                        ? "Enable Webcam"
                        : "Disable Webcam"}
                    </button>
                    <button
                      style={{
                        width: "150px",
                        height: "50px",
                        marginRight: "5px",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      display="none"
                      className="btn btn-light btn-outline-secondary fa fa-image bg-info text-white"
                      accept="image/*"
                      type="btn btn-primary"
                      id="uploadButton"
                      onClick="uploadFile()"
                    >
                      <label
                        style={{ lineHeight: "0px" }}
                        className="upload-group "
                      >
                        Upload Image
                        <input
                          type="file"
                          class="upload-group"
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            width: "100%",
                            height: "100%",
                            size: "100px",
                            align: "right",
                            filter: "alpha(opacity = 0)",
                            opacity: "0",
                            outline: "none",
                            cursor: "inherit",
                            display: "block"
                          }}
                          id="file"
                        />
                      </label>
                    </button>
                  </div>
                </div>
                {this.renderShowImage()}
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon1"
                    >
                      Vendor#
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control "
                    id="vendor"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon2"
                    >
                      Price
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      Downpayment
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="downpayment"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      MOQ#
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="moq"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      Item Name
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="itemname"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      Product Time
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="producttime"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      Size
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="size"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      Comments
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="comment"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      style={{ width: "123px" }}
                      className="input-group-text"
                      id="basic-addon3"
                    >
                      Description
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    aria-describedby="basic-addon3"
                  />
                </div>

                <div className="row input-group mb-3">
                  <div className="col-sm-12 text-center">
                    <button
                      id="buttonSave"
                      type="button"
                      className="btn btn-light btn-outline-secondary fas bg-info text-white"
                      style={{
                        width: "150px",
                        height: "50px",
                        marginRight: "5px"
                      }}
                      onClick={this.onClickSave}
                    >
                      {" "}
                      Save
                    </button>
                    <button
                      id="buttonReturnHome"
                      type="button"
                      className="btn btn-light btn-outline-secondary fas  bg-info text-white"
                      style={{
                        width: "150px",
                        height: "50px",
                        marginRight: "5px"
                      }}
                      onClick={this.returnHome}
                    >
                      {" "}
                      Return to Events
                    </button>
                  </div>
                </div>

                <div>
                  <table
                    id="tblEventDetails"
                    className="table table-striped table-bordered table-sm bg-light"
                    cellSpacing="0"
                    width="100%"
                  >
                    <thead class="thead">
                      <tr
                        style={{
                          height: "60px",
                          backgroundColor: "#fe8a71"
                        }}
                      >
                        <th className="th-sm ">Vendor#</th>
                        <th className="th-sm">Image</th>

                        <th className="th-sm">MOQ#</th>
                        <th className="th-sm">Comments</th>
                        <th className="th-sm">Description</th>
                        <th className="th-sm">Downpayment</th>
                        <th className="th-sm">Price</th>
                        <th className="th-sm">Item Name</th>
                        <th className="th-sm">Size</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderTableData()}</tbody>
                  </table>
                </div>
              </div>
            </form>
          </div>
        );
      } else {
        return <Redirect to="/" />;
      }
    }
  }
}
export default AddItemToEvent;