/**
* @module Sol/texture/Texture
* @typedef {Asset} Sol.asset.Asset
*/

import Asset from "../asset/Asset.js";

/**
* Texture.
* @class Texture
* @extends Sol.asset.Asset
* @memberof Sol.texture
* @classdesc An image that can be loaded and drawn.
*/
class Texture extends Asset {
	/**
	* Create the texture.
	*/
	constructor(){
		super();

		/**
		* The width of the texture.
		* @type {number}
		*/
		this.width = 1;

		/**
		* The height of the texture.
		* @type {number}
		*/
		this.height = 1;

		/**
		* The WebGL texture of the texture.
		* @type {?WebGLTexture}
		*/
		this.glTex = null;

		/**
		* Whether the WebGL texture of the texture is bound to a texture unit.
		* @type {boolean}
		*/
		this.glBound = false;

		/**
		* The texture unit that the WebGL texture of the texture is bound to.
		* @type {number}
		*/
		this.glUnit = 0;

		/**
		* The canvas image source of the texture.
		* @type {?CanvasImageSource}
		*/
		this.canvasImg = null;

		/**
		* The amount to multiply the cropping coordinates of the texture by in the X
		* axis when using the canvas renderer.
		* @type {number}
		*/
		this.canvasCropScaleX = 1;

		/**
		* The amount to multiply the cropping coordinates of the texture by in the Y
		* axis when using the canvas renderer.
		* @type {number}
		*/
		this.canvasCropScaleY = 1;
	}
}

export default Texture;
