import { Component } from "../core/core.js";

export default class NotFound extends Component {
  render(){
    this.el.classList.add('container', 'not-found')
    this.el.innerHTML = /* html */ `
      <h1>
        Sorry,,,<br>
        Page not Found
      </h1>
    `   
  }
}