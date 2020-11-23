/**
* @module Sol/dom
*/

import ElemMemento  from "./ElemMemento.js";
import EventHandler from "./EventHandler.js";

/**
* Stores classes for the document.
* @namespace Sol.dom
* @memberof Sol
* @type {Object<string, function>}
*/
const dom = {
	ElemMemento:  ElemMemento,
	EventHandler: EventHandler
};

export default dom;
