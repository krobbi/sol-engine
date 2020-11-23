/**
* @module Sol/math/OrthoMatrix
* @typedef {OrthoMatrix} Sol.math.OrthoMatrix
*/

/**
* Orthographic matrix.
* @class OrthoMatrix
* @memberof Sol.math
* @classdesc A representation of a basic 2D orthographic translation and
* scaling.
*/
class OrthoMatrix {
	/**
	* Create the orthographic matrix.
	*/
	constructor(){
		/**
		* The translation of the matrix in the X axis.
		* @type {number}
		* @default 0
		*/
		this.x = 0;

		/**
		* The translation of the matrix in the Y axis.
		* @type {number}
		* @default 0
		*/
		this.y = 0;

		/**
		* The scaling of the matrix in the X axis.
		* @type {number}
		* @default 1
		*/
		this.w = 1;

		/**
		* The scaling of the matrix in the Y axis.
		* @type {number}
		* @default 1
		*/
		this.h = 1;
	}

	/**
	* Create a copy of the matrix by value.
	* @returns {Sol.math.OrthoMatrix} A copy of the matrix by value.
	*/
	clone(){
		return new OrthoMatrix().copy(this);
	}

	/**
	* Copy the value of a matrix.
	* @param {Sol.math.OrthoMatrix} mat - The matrix to copy.
	* @returns {Sol.math.OrthoMatrix} The resultant matrix.
	*/
	copy(mat){
		this.x = mat.x;
		this.y = mat.y;
		this.w = mat.w;
		this.h = mat.h;
		return this;
	}

	/**
	* Set the matrix to the identity matrix.
	* @returns {Sol.math.OrthoMatrix} The resultant matrix.
	*/
	identity(){
		this.x = this.y = 0;
		this.w = this.h = 1;
		return this;
	}

	/**
	* Translate the matrix.
	* @param {number} x - The amount to translate the matrix in the X axis.
	* @param {number} y - The amount to translate the matrix in the Y axis.
	* @returns {Sol.math.OrthoMatrix} The resultant matrix.
	*/
	translate(x, y){
		this.x += x;
		this.y += y;
		return this;
	}

	/**
	* Scale the matrix.
	* @param {number} x - The amount to scale the matrix in the X axis.
	* @param {number} y - The amount to scale the matrix in the Y axis.
	* @returns {Sol.math.OrthoMatrix} The resultant matrix.
	*/
	scale(x, y){
		this.w *= x;
		this.h *= y;
		return this;
	}

	/**
	* Set the matrix to another matrix mutliplied by this matrix.
	* @param {Sol.math.OrthoMatrix} The matrix to multiply by this matrix.
	* @returns {Sol.math.OrthoMatrix} The resultant matrix.
	*/
	multiply(mat){
		this.x  = mat.x * this.w + this.x;
		this.y  = mat.y * this.h + this.y;
		this.w *= mat.w;
		this.h *= mat.h;
		return this;
	}
}

export default OrthoMatrix;
