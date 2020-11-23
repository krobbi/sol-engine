/**
* @module Sol/gfx/canvas/CanvasRenderer
* @typedef {import("../../texture/Texture.js").default} Sol.texture.Texture
* @typedef {Renderer}                                   Sol.gfx.Renderer
*/

import Renderer from "../Renderer.js";

import CONST from "../../CONST.js";

/**
* Canvas renderer.
* @class CanvasRenderer
* @extends Sol.gfx.Renderer
* @memberof Sol.gfx.canvas
* @classdesc Renders using the 2D rendering context.
*/
class CanvasRenderer extends Renderer {
	/**
	* Create the canvas renderer.
	* @param {HTMLCanvasElement} canvas - The canvas to use.
	* @param {CanvasRenderingContext2D} ctx - The 2D rendering context to use.
	*/
	constructor(canvas, ctx){
		super(CONST.CANVAS, canvas);

		/**
		* The 2D rendering context to use.
		* @private
		* @type {CanvasRenderingContext2D}
		*/
		this._ctx = ctx;

		/**
		* The canvas image source of the applied texture.
		* @private
		* @type {CanvasImageSource}
		*/
		this._img = canvas;

		/**
		* The amount to multiply the cropping coordinates of the applied texture by
		* in the X axis.
		* @private
		* @type {number}
		*/
		this._cropScaleX = 1;

		/**
		* The amount to multiply the cropping coordinates of the applied texture by
		* in the Y axis.
		* @private
		* @type {number}
		*/
		this._cropScaleY = 1;
	}

	/**
	* Clear the screen.
	* @override
	*/
	clear(){
		this._ctx.fillStyle = "#000000";
		this._ctx.fillRect(0, 0, this._width, this._height);
	}

	/**
	* Apply a texture to subsequent drawing.
	* @override
	* @param {Sol.texture.Texture} texture - The texture to apply.
	*/
	applyTexture(texture){
		this._img        = texture.canvasImg;
		this._cropScaleX = texture.canvasCropScaleX;
		this._cropScaleY = texture.canvasCropScaleY;
	}

	/**
	* Draw the applied texture.
	* @override
	* @param {number} x - The X coordinate of the top-left corner to draw the
	* applied texture.
	* @param {number} y - The Y coordinate of the top-left corner to draw the
	* applied texture.
	* @param {number} w - The width to draw the applied texture.
	* @param {number} h - The height to draw the applied texture.
	* @param {number} cx - The X coordinate of the top-left corner to crop from
	* the applied texture.
	* @param {number} cy - The Y coordinate of the top-left corner to crop from
	* the applied texture.
	* @param {number} cw - The width to crop from the applied texture.
	* @param {number} ch - The height to crop from the applied texture.
	*/
	drawTexture(x, y, w, h, cx, cy, cw, ch){
		cx *= this._cropScaleX;
		cy *= this._cropScaleY;
		cw *= this._cropScaleX;
		ch *= this._cropScaleY;
		this._ctx.drawImage(this._img, cx, cy, cw, ch, x, y, w, h);
	}

	/**
	* Destroy the renderer.
	* @override
	*/
	destroy(){
		this._ctx.clearRect(0, 0, this._width, this._height);
	}

	/**
	* Runs when the resolution is resized.
	* @override
	* @protected
	*/
	_onResize(){
		this._ctx.imageSmoothingEnabled = false;
	}

	/**
	* Runs before every frame.
	* @override
	*/
	onPreDraw(){
		this.clear();
	}

	/**
	* The 2D rendering context to use.
	* @override
	* @readonly
	* @returns {CanvasRenderingContext2D}
	*/
	get ctx(){ return this._ctx; }
}

export default CanvasRenderer;
