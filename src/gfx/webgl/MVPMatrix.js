/**
* @module Sol/gfx/webgl/MVPMatrix
* @typedef {import("./Program.js").default} Sol.gfx.webgl.Program
* @typedef {OrthoMatrix}                    Sol.math.OrthoMatrix
*/

import OrthoMatrix from "../../math/OrthoMatrix.js";

/**
* WebGL renderer model-view-projection matrix.
* @class MVPMatrix
* @memberof Sol.gfx.webgl
* @classdesc An abstraction of a model, view, and projection matrix.
*/
class MVPMatrix {
	/**
	* Create the WebGL renderer model-view-projection matrix.
	* @param {Sol.gfx.webgl.Program} program - The program to send the matrix to.
	* @param {string} uniform - The name of the uniform to set to the matrix.
	*/
	constructor(program, uniform){
		/**
		* The name of the program to send the matrix to.
		* @private
		* @type {Sol.gfx.webgl.Program}
		*/
		this._program = program;

		/**
		* The name of the uniform to set to the matrix.
		* @private
		* @type {string}
		*/
		this._uniform = uniform;

		/**
		* Whether the matrix needs to be updated.
		* @private
		* @type {boolean}
		*/
		this._dirty = false;

		/**
		* The projection matrix.
		* @private
		* @type {Sol.math.OrthoMatrix}
		*/
		this._matP = new OrthoMatrix();

		/**
		* The value of the matrix as a 4x4 float matrix in column-major order for
		* sending to the program.
		* @private
		* @type {Float32Array}
		*/
		this._value = new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	}

	/**
	* Set the projection matrix to a basic orthographic projection.
	* @param {number} width - The width of the projection.
	* @param {number} height - The height of the projection.
	*/
	projection(width, height){
		this._matP.x = -1;
		this._matP.y = 1;
		this._matP.w = 2 / width;
		this._matP.h = -2 / height;
		this._dirty  = true;
	}

	/**
	* Update the matrix if necessary.
	*/
	update(){
		if(this._dirty){
			this._value[0]  = this._matP.w;
			this._value[5]  = this._matP.h;
			this._value[12] = this._matP.x;
			this._value[13] = this._matP.y;
			this._program.setUm4fv(this._uniform, false, this._value);
			this._dirty = false;
		}
	}
}

export default MVPMatrix;
