/**
* @module Sol/texture/TextureManager
* @typedef {import("../core/Game.js").default}    Sol.Game
* @typedef {import("../gfx/Renderer.js").default} Sol.gfx.Renderer
* @typedef {import("./Texture.js").default}       Sol.texture.Texture
* @typedef {TextureFactory}                       Sol.texture.TextureFactory
*/

import TextureFactory from "./TextureFactory.js";

/**
* Texture manager.
* @class TextureManager
* @memberof Sol.texture
* @classdesc Manages textures for a game instance.
*/
class TextureManager {
	/**
	* Create the texture manager.
	* @param {Sol.Game} game - The game instance that this texture manager belongs
	* to.
	*/
	constructor(game){
		/**
		* The game instance that this texture manager belongs to.
		* @private
		* @type {Sol.Game}
		*/
		this._game = game;

		/**
		* The renderer to use.
		* @private
		* @type {Sol.gfx.Renderer}
		*/
		this._renderer;

		/**
		* The WebGL rendering context to use.
		* @private
		* @type {?WebGLRenderingContext|WebGL2RenderingContext}
		*/
		this._gl = null;

		/**
		* A dictionary of texture keys and textures.
		* @private
		* @type {Object<string, Sol.texture.Texture>}
		*/
		this._textures = {};

		/**
		* The texture factory.
		* @type {Sol.texture.TextureFactory}
		*/
		this.factory = new TextureFactory();
	}

	/**
	* Get whether a texture exists.
	* @param {string} key - The key of the texture to test.
	* @returns {boolean} Whether the texture exists.
	*/
	has(key){
		return key in this._textures;
	}

	/**
	* Create a texture.
	* @param {string} src - The source of the texture image.
	* @param {number=} width - The expected width of the texture. Use 0 for the
	* width of the texture image.
	* @param {number=} height - The expected height of the texture. Use 0 for the
	* height of the texture image.
	* @returns {Sol.texture.Texture} The created texture.
	*/
	create(src, width = 0, height = 0){
		return this.factory.createTexture(this._gl, src, width, height);
	}

	/**
	* Draw a texture.
	* @param {string} key - The key of the texture to draw.
	* @param {number=} x - The X coordinate of the top-left corner to draw the
	* texture.
	* @param {number=} y - The Y coordinate of the top-left corner to draw the
	* texture.
	* @param {?number=} w - The width to draw the texture. Use null for the width
	* of the texture.
	* @param {?number=} h - The height to draw the texture. Use null for the
	* height of the texture.
	* @param {number=} cx - The X coordinate of the top-left corner to crop from
	* the texture.
	* @param {number=} cy - The Y coordinate of the top-left corner to crop from
	* the texture.
	* @param {?number=} cw - The width to crop from the texture. Use null for the
	* remaining width.
	* @param {?number=} ch - The height to crop from the texture. Use null for the
	* remaining height.
	*/
	draw(
		key, x = 0, y = 0, w = null, h = null, cx = 0, cy = 0, cw = null, ch = null
	){
		/**
		* The texture to draw.
		* @type {Sol.texture.Texture}
		* @ignore
		*/
		const texture = this._textures[key];

		if(w  == null) w  = texture.width;
		if(h  == null) h  = texture.height;
		if(cw == null) cw = texture.width - cx;
		if(ch == null) ch = texture.height - cy;

		this._renderer.applyTexture(texture);
		this._renderer.drawTexture(x, y, w, h, cx, cy, cw, ch);
	}

	/**
	* Load a texture.
	* @param {string} key - The key to give the texture.
	* @param {string} src - The source of the texture image.
	* @param {number=} width - The expected width of the texture. Use 0 for the
	* width of the texture image.
	* @param {number=} height - The expected height of the texture. Use 0 for the
	* height of the texture image.
	* @returns {Sol.texture.Texture} The loaded texture.
	*/
	load(key, src, width = 0, height = 0){
		this.unload(key);
		this._textures[key] = this.create(src, width, height);
		return this._textures[key];
	}

	/**
	* Unload a texture.
	* @param {string} key - The key of the texture to unload.
	* @returns {boolean} Whether the texture existed before being unloaded.
	*/
	unload(key){
		if(!this.has(key)){
			return false;
		}

		this.factory.destroyTexture(this._gl, this._textures[key]);
		delete this._textures[key];
		return true;
	}

	/**
	* Unload all textures.
	*/
	unloadAll(){
		for(let key in this._textures){
			this.unload(key);
		}
	}

	/**
	* Runs when the game starts. Gets the renderer and WebGL rendering context.
	*/
	onStart(){
		this._renderer = this._game.gfx.renderer;
		this._gl       = this._renderer.gl;
	}

	/**
	* Runs when the game stops. Unloads all textures.
	*/
	onStop(){
		this.unloadAll();
	}

	/**
	* Get a texture.
	* @param {string} key - The key of the texture to get.
	* @returns {?Sol.texture.Texture} A texture. Returns null if the texture does
	* not exist.
	*/
	get(key){
		return this.has(key) ? this._textures[key] : null;
	}
}

export default TextureManager;
