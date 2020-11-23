/**
* @module Sol/dom/ElemMemento
* @typedef {ElemMemento} Sol.dom.ElemMemento
*/

/**
* DOM element memento.
* @class ElemMemento
* @memberof Sol.dom
* @classdesc Stores the state of an element.
*/
class ElemMemento {
	/**
	* Create the DOM element memento.
	*/
	constructor(){
		/**
		* The inner HTML of the saved element.
		* @type {string}
		*/
		this.innerHTML = "";

		/**
		* The attributes of the saved element.
		* @type {Object<string, string>}
		*/
		this.attributes = {};
	}

	/**
	* Clear the element memento.
	* @returns {Sol.dom.ElemMemento} The element memento after clearing.
	*/
	clear(){
		this.innerHTML  = "";
		this.attributes = {};
		return this;
	}

	/**
	* Save the state of an element to the element memento.
	* @param {HTMLElement} elem - The element to save.
	* @returns {Sol.dom.ElemMemento} The element memento after saving.
	*/
	save(elem){
		this.innerHTML  = elem.innerHTML;
		this.attributes = {};

		for(let attribute of elem.attributes){
			this.attributes[attribute.name] = attribute.value;
		}

		return this;
	}

	/**
	* Restore the state of the element memento to an element.
	* @param {HTMLElement} elem - The element to restore.
	* @returns {Sol.dom.ElemMemento} The element memento after restoring.
	*/
	restore(elem){
		elem.innerHTML = this.innerHTML;

		while(elem.attributes.length > 0){
			elem.removeAttribute(elem.attributes[0].name);
		}

		for(let name in this.attributes){
			elem.setAttribute(name, this.attributes[name]);
		}

		return this;
	}
}

export default ElemMemento;
