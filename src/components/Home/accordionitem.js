import React from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import $ from 'jquery';
import firebase from '../Firebase/firebase';


class AccordionItemList extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <tr>
        <td>{this.props.vendor}</td>
        <td>{this.props.itemName}</td>
        <td>{this.props.description}</td>
        <td>  <img
          src={this.props.image}
          style={{ height: 50, width: 50 }}
        /></td>
        <td>{this.props.price}</td>
        <td>{this.props.downPayment}</td>
        <td>{this.props.moq}</td>
        <td>{this.props.productTime}</td>
        <td>{this.props.size}</td>
        <td>{this.props.comment}</td>
      </tr>
    );
  }
}
export default AccordionItemList;
