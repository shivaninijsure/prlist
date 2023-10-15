import axios from "axios";
import React from "react";

export default class ListingService extends React.Component {
  
  getRPList =()=> {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        console.log("respose", res);
        return res;
      })
  }

}