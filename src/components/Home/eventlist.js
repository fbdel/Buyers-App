import React from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import $ from 'jquery';
import firebase from '../Firebase/firebase';
import ReactDOMServer from 'react-dom/server';
import AccordionItemList from './accordionitem';
var that = '';

class EventList extends React.Component {
    constructor(props) {
        super(props);
        that = this;
    }

    getEventDetails(sentEventId) {
        var htmlString = [];

        new Promise(function (resolve, reject) {

            setTimeout(() => resolve(firebase.database().ref('items').orderByChild('eventId').once("value", snapshot => {
                snapshot.forEach(function (childSnapshot) {
                    var value = childSnapshot.val();
                    if (value.eventId === sentEventId.toString().trim()) {
                        htmlString.push(<AccordionItemList vendor={value.vendor} moq={value.moq} price={value.price}
                            comment={value.comment} image={value.image} itemName ={value.itemName} productTime={value.productTime}
                            size ={value.size}
                            downPayment={value.downPayment} description={value.description}
                        />);
                    }
                });
            })), 2000);
        }).finally(() => console.log("Promise ready"))
            .then(function () {
                var accordionList = document.getElementById('uiAccordion_' + sentEventId);
                if (htmlString.length > 0) {
                    var newTabularString = '<table class=table>'
                        + '<thead>' +
                        '<tr>' +
                        '<th scope=col>Vendor</th>' +
                        '<th scope=col>Event Item</th>' +
                        '<th scope=col>Description</th>' +
                        '<th scope=col>Image</th>' +
                        '<th scope=col>Price</th>' +
                        '<th scope=col>Downpayment</th>' +
                        '<th scope=col>MOQ#</th>' +
                        '<th scope=col>Time</th>' +
                        '<th scope=col>Size</th>' +
                        '<th scope=col>Comment</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>'

                    accordionList.innerHTML = newTabularString + ReactDOMServer.renderToString(htmlString) + '</tbody>';
                }
                else {
                    accordionList.innerHTML = '<table id=ul_' + sentEventId + '><tbody>No Items are available for this event</tbody></table>';
                }
            });

    }



    showlist(sentEventId) {
        return (
            this.getEventDetails(sentEventId)
        )
    }
    onChildButtonClick(val) {
    }
    render() {
        return (
          <li
            className="list-group-item b"
            style={{ backgroundColor: "#fe8a71" }}
          >
            <div className="col-xs-4 text-center">
              <p>
                <b>Event Name :</b> {this.props.name}
              </p>
              <p>
                <b style={{ marginRight: 10 }}>Event Location :</b>
                {this.props.location}
                <b style={{ marginLeft: 10 }}>Event Date :</b>
                {this.props.eventdate}
              </p>
              <div style={{ margin: 10 }}>
                <button
                  key={this.props.eventId}
                  id={"btn" + this.props.eventId}
                  type="button"
                  onClick={this.onChildButtonClick.bind(
                    null,
                    this.props.eventId
                  )}
                  style={{ marginRight: 5 }}
                  className="btn btn-light btn-outline-secondary bg-warning text-dark"
                >
                  Add Item To Event
                </button>
                <button
                  type="button"
                  id={"btnCSV" + this.props.eventId}
                  style={{ marginLeft: 5 }}
                  className="btn btn-light btn-outline-secondary bg-warning text-dark"
                >
                  Export Event (CSV Format)
                </button>
              </div>
            </div>

            <div
              class="panel-group text-center"
              id={"accordion_" + this.props.eventId}
            >
              <div
                class="panel panel-default"
                id={"panel_" + this.props.eventId}
              >
                <div class="panel-heading text-danger">
                  <h4 class="panel-title ">
                    <a
                      data-toggle="collapse"
                      data-target={"#collapseOne_" + this.props.eventId}
                      href={"#collapseOne_" + this.props.eventId}
                    >
                      Click For Details
                    </a>
                  </h4>
                </div>
                <div
                  id={"collapseOne_" + this.props.eventId}
                  class="panel-collapse collapse in"
                >
                  <div
                    id={"pnlBody_" + this.props.eventId}
                    class="panel-body"
                  >
                    <ul id={"uiAccordion_" + this.props.eventId}>
                      {this.showlist(this.props.eventId)}
                    </ul>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
    }
}
export default EventList;


