/**
* @module Sol/gfx/Renderer
* @typedef {import("../texture/Texture.js").default} Sol.texture.Texture
*/

/**
* Renderer base.
* @virtual
* @class Renderer
* @memberof Sol.gfx
* @classdesc Stores the interface for renderers. Performs basic graphics
* operations.
*/
class Renderer {
	/**
	* Create the renderer base.
	* @param {number} type - The type of the renderer.
	* @param {HTMLCanvasElement} canvas - The canvas to use.
	*/
	constructor(type, canvas){
		/**
		* The type of the renderer.
		* @protected
		* @type {number}
		*/
		this._type = type;

		/**
		* The canvas to use.
		* @protected
		* @type {HTMLCanvasElement}
		*/
		this._canvas = canvas;

		/**
		* The width of the resolution.
		* @protected
		* @type {number}
		*/
		this._width = 2;

		/**
		* The height of the resolution.
		* @protected
		* @type {number}
		*/
		this._height = 2;
	}

	/**
	* Resize the resolution.
	* @virtual
	* @param {number} width - The width of the resolution.
	* @param {number} height - The height of the resolution.
	*/
	resize(width, height){
		this._canvas.width  = this._width  = width;
		this._canvas.height = this._height = height;
		this._onResize();
	}

	/**
	* Clear the screen.
	* @virtual
	*/
	clear(){}

	/**
	* Apply a texture to subsequent drawing.
	* @virtual
	* @param {Sol.texture.Texture} texture - The texture to apply.
	*/
	applyTexture(texture){ texture; }

	/**
	* Draw the applied texture.
	* @virtual
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
	drawTexture(x, y, w, h, cx, cy, cw, ch){ x; y; w; h; cx; cy; cw; ch; }

	/**
	* Destroy the renderer.
	* @virtual
	*/
	destroy(){}

	/**
	* Runs when the resolution is resized.
	* @protected
	*/
	_onResize(){}

	/**
	* Runs before every frame.
	* @virtual
	*/
	onPreDraw(){}

	/**
	* Runs after every frame.
	* @virtual
	*/
	onPostDraw(){}

	/**
	* The type of the renderer.
	* @virtual
	* @readonly
	* @returns {number}
	*/
	get type(){ return this._type; }

	/**
	* The width of the renderer.
	* @virtual
	* @readonly
	* @returns {number}
	*/
	get width(){ return this._width; }

	/**
	* The height of the renderer.
	* @virtual
	* @readonly
	* @returns {number}
	*/
	get height(){ return this._height; }

	/**
	* The WebGL rendering context to use.
	* @virtual
	* @readonly
	* @returns {?WebGLRenderingContext|WebGL2RenderingContext}
	*/
	get gl(){ return null; }

	/**
	* The 2D rendering context to use.
	* @virtual
	* @readonly
	* @returns {?CanvasRenderingContext2D}
	*/
	get ctx(){ return null; }
}

export default Renderer;
