import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { CSVLink, CSVDownload } from "react-csv";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Modal from 'react-modal';
import EventList from './eventlist';
import firebase from '../Firebase/firebase';

var userData = null;
var htmlString = [];
var that = null;
var _isMounted = false;

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        width: "500px",
        transform: "translate(-50%, -50%)",
        background: "whitesmoke"
    }
};

var user = null;
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectMe: false,
            modalIsOpen: false,
            eventId: ''
        }
        this.handleLoginKeyUp = this.keyUpHandler.bind(this, 'myInput');
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.redirectToDetails = this.redirectToDetails.bind(this);
        that = this;
        this.btnClicked();
        this.removeBackgroundImage();
    }

    removeBackgroundImage() {
        var bodyElement = document.getElementById('bodyId');
        if (bodyElement !== null && bodyElement !== undefined) {
            bodyElement.style.background = 'none';

        }

    }
    openModal() {
        if (this._isMounted)
            this.setState({ modalIsOpen: true });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        if (this._isMounted)
            this.setState({ modalIsOpen: false });
    }


    onEventSave() {
        var location = document.getElementById('eventlocation').value;
        var name = document.getElementById('eventname').value;
        var eventDate = document.getElementById('eventDate').value;
        user = localStorage.getItem('user');
        var userObj = JSON.parse(user);
        var userId = userObj.id;
        if (location.trim() !== '' && location.trim() !== null && name.trim() !== '' && name.trim() !== null) {
            let postRef = firebase.database().ref('events').orderByKey().limitToLast(1);
            let eventId = 0;

            new Promise(function (resolve, reject) {
                setTimeout(() => resolve(firebase.database().ref('events').orderByChild('eventId').once("value", snapshot => {
                    userData = snapshot.val();
                    snapshot.forEach(function (childSnapshot) {
                        eventId++;
                    });
                })), 1000);
            }).finally(() => console.log("Promise ready"))
                .then(function () {
                    firebase.database().ref('events/').push({
                        eventDate,
                        eventId,
                        location,
                        name,
                        userId
                    }).then((data) => {
                        //success callback
                        console.log('data ', data)
                        alert('Event is saved successfully')
                    }).catch((error) => {
                        //error callback
                        console.log('error ', error)
                    });

                });

        } else {
            document.getElementById('eventlocation').value = '';
            document.getElementById('eventname').value = '';
            alert('Please enter details to save');
        }

    }
    keyUpHandler() {
        $(document).ready(function () {
            $("#myInput").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $("#myList li").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    renderModal() {
        if (this.state.modalIsOpen) {
            return (
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Add New Event">
                    <h2 ref={subtitle => this.subtitle = subtitle}>Add New Event</h2>
                    <form>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon2">Location</span>
                            </div>
                            <input type="text" className="form-control" id="eventlocation" aria-describedby="basic-addon3" />
                        </div>


                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon2">Name</span>
                            </div>
                            <input type="text" className="form-control" id="eventname" aria-describedby="basic-addon3" />
                        </div>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon2">Event Date</span>
                            </div>
                            <input type="text" data-provide='datepicker' data-date-format='mm/dd/yyyy' className="form-control" id="eventDate" aria-describedby="basic-addon3" />
                        </div>


                        <div className="col-xs-4 text-center">
                            <div style={{ margin: 10 }}>
                                <button type="button" onClick={() => this.onEventSave()} style={{ marginRight: 5 }} className="btn btn-light btn-outline-secondary bg-info text-white">Save</button>
                                <button type="button" onClick={this.closeModal} style={{ marginLeft: 5 }} className="btn btn-light btn-outline-secondary bg-info text-white">Close</button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )
        }
    }




    json2array(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var header = 'Vendor,Event Item,Description, Image, Price, Downpayment, MOQ#, Product Time, Size, Comment' + '\r\n';
        var str = header;
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                var arr = array[i].replace('"{', '{').replace('}"', '}');
                line += arr[index].replace('{', '').replace('}', '').replace('"', '');
            }
            str += line.replace("comment:", "").replace("description:", "").replace("downPayment:", "").replace("eventId:", "")
                .replace("image:", "").replace("itemName:", "").replace("moq:", "").replace("price:", "").replace("productTime:", "")
                .replace("size:", "").replace("vendor:", "") + '\r\n';
        }

        return str;
    }



    btnClicked() {
        var buttonId = '';
        var eventId = '';
        var csvContent = [];
        var dataString = '';
        var fileName = 'download_event.csv'
        $(document).ready(function () {
            $(document).on("click", "button", function () {
                if (this.id.trim().includes('CSV')) {
                    eventId = this.id.trim().replace('btnCSV', '');
                    new Promise(function (resolve, reject) {
                        setTimeout(() => resolve(firebase.database().ref('items').orderByChild('eventId').endAt(eventId).once("value", snapshot => {
                            snapshot.forEach(function (childSnapshot) {
                                var value = childSnapshot.val();
                                if (value.eventId === eventId) {
                                    var jsonObject = {
                                        vendor: value.vendor,
                                        itemName: value.itemName,
                                        description: value.description,
                                        image: value.image,
                                        price: value.price,
                                        downPayment: value.downPayment,
                                        moq: value.moq,
                                        productTime: value.productTime,
                                        size: value.size,
                                        comment: value.comment
                                    }
                                    var jsonString = (JSON.stringify(jsonObject));
                                    csvContent.push(jsonString);
                                }

                            });
                        })), 2000);
                    }).finally(() => console.log("Promise ready"))
                        .then(function () {
                            dataString = that.json2array(csvContent);

                            var a = document.createElement('a');
                            var mimeType = 'application/octet-stream';
                            if (navigator.msSaveBlob) { // IE10
                                navigator.msSaveBlob(new Blob([dataString], {
                                    type: mimeType
                                }), fileName);
                            } else if (URL && 'download' in a) { //html5 A[download]
                                a.href = URL.createObjectURL(new Blob([dataString], {
                                    type: mimeType
                                }));
                                a.setAttribute('download', fileName);
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            } else {
                                window.location.href = 'data:application/octet-stream,' + encodeURIComponent(dataString); // only this mime type is supported
                            }
                        });
                }
                else if (this.id.trim().includes('openModal')) {
                    that.renderModal();
                }
                else if (this.id.trim().includes('btn')) {
                    eventId = this.id.trim().replace('btn', '');
                    that.setState({ redirectMe: true, eventId: eventId })
                }

            });
            // if (buttonId !== '') {
            //     $('body').on('click', buttonId, function () {
            //         alert(buttonId);
            //     });
            // }


        });
    }
    redirectToDetails(eventId, userId) {
        alert('clicked')
        return <Redirect to='/additemtoevent' eventId={eventId} userId={userId} />
        // this.setState({ redirectMe: true })
    }
    renderList() {
        var event = null;
        user = localStorage.getItem('user');
        var userObj = JSON.parse(user);
        var userId = userObj.id;
        new Promise(function (resolve, reject) {
            setTimeout(() => resolve(firebase.database().ref('events').orderByChild('eventId').once("value", snapshot => {
                event = snapshot.val();
                htmlString = [];
                snapshot.forEach(function (childSnapshot) {
                    var value = childSnapshot.val();
                    if (value.userId === userId) {
                        htmlString.push(
                            <EventList key={value.eventId} name={value.name} eventdate={value.eventDate} location={value.location} eventId={value.eventId} />
                        )
                    }

                });
            })), 2000);
        }).finally(() => console.log("Promise ready"))
            .then(function () {
                var newData = ReactDOMServer.renderToString(htmlString);
                var myList = document.getElementById('myList');
                if (myList != null)
                    myList.innerHTML = newData;
            });
        return <div>There is no saved event</div>;
    }
    render() {
        user = localStorage.getItem("user");
        if (user !== null && user !== undefined) {
            if (this.state.redirectMe) {
                return <Redirect to={{
                    pathname: '/additemtoevent', state: { eventId: this.state.eventId }
                }} />
            }
            return (
                <div>
                    {this.renderModal()}
                    <div
                        className="jumbotron jumbotron-fluid text-center bg-dark text-white"
                        style={{ height: "100px" }}
                    >
                        <div className="container">
                            <h1
                                className="display-4"
                                style={{ fontFamily: "Ubuntu" }}
                            >
                                Events
                    </h1>
                        </div>
                    </div>

                    <div className="col-xs-4 text-center">
                        <div className="btn btn-secondary ">
                            <button
                                onClick={this.openModal}
                                id="openModal"
                                className="btn btn-lg bg-warning"
                            >
                                <i className="fa fa-plus" /> Create New Event
                    </button>
                        </div>
                    </div>
                    <div className="container">
                        <h2>Event List</h2>
                        <input
                            onKeyUp={this.handleLoginKeyUp}
                            className="form-control"
                            id="myInput"
                            type="text"
                            placeholder="Search.."
                        />
                        <br />
                        <div>
                            <ul className="list-group" id="myList">
                                {this.renderList()}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to='/' />
        }

    }
}
export default Home;