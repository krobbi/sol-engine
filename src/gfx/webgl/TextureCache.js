/**
* @module Sol/gfx/webgl/TextureCache
* @typedef {import("../../core/Game.js").default} Sol.Game
* @typedef {import("./VertBuffer.js").default}    Sol.gfx.webgl.VertBuffer
* @typedef {import("../../texture/TextureFactory.js").default}
* Sol.texture.TextureFactory
* @typedef {import("../../texture/Texture.js").default} Sol.texture.Texture
*/

/**
* WebGL renderer texture cache.
* @class TextureCache
* @memberof Sol.gfx.webgl
* @classdesc Stores the ID and size of the applied texture and binds textures
* when necessary.
*/
class TextureCache {
	/**
	* Create the WebGL renderer texture cache.
	* @param {Sol.Game} game - The game instance that this texture cache belongs
	* to.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {Sol.gfx.webgl.VertBuffer} buffer - The vertex buffer to flush when
	* out of textures.
	* @param {number} maxTextures - The maximum number of texture units allowed
	* per draw call.
	*/
	constructor(game, gl, buffer, maxTextures){
		/**
		* The texture factory to create and destroy temporary textures with.
		* @private
		* @type {Sol.texture.TextureFactory}
		*/
		this._factory = game.texture.factory;

		/**
		* The WebGL rendering context to use.
		* @private
		* @type {WebGLRenderingContext|WebGL2RenderingContext}
		*/
		this._gl = gl;

		/**
		* The vertex buffer to flush when out of textures.
		* @private
		* @type {Sol.gfx.webgl.VertBuffer}
		*/
		this._buffer = buffer;

		/**
		* The maximum number of texture units allowed per draw call.
		* @private
		* @constant
		* @type {number}
		* @default 32
		*/
		this._MAX_TEXTURES = maxTextures;

		/**
		* A pointer to the next texture ID to bind.
		* @private
		* @type {number}
		*/
		this._pointer = 0;

		/**
		* An array of temporary textures to bind to prevent errors from drawing
		* unbound textures on MacOS.
		* @private
		* @type {Sol.texture.Texture[]}
		*/
		this._tempTextures = [];

		/**
		* An array of currently bound textures.
		* @private
		* @type {Sol.texture.Texture[]}
		*/
		this._boundTextures = [];

		/**
		* The ID of the applied texture.
		* @type {number}
		*/
		this.id = 0;

		/**
		* The width of the applied texture.
		* @type {number}
		*/
		this.width = 1;

		/**
		* The height of the applied texture.
		* @type {number}
		*/
		this.height = 1;

		// Populate textures:
		for(let i = 0; i < this._MAX_TEXTURES; i++){
			this._tempTextures.push(this._factory.glCreatePixel(gl, 0, 0, 0, 0));

			/**
			* A temporary texture.
			* @type {Sol.texture.Texture}
			* @ignore
			*/
			const tempTexture = this._tempTextures[i];

			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, tempTexture.glTex);
			this._factory.glReturnUnit = tempTexture.glUnit = i;
			this._factory.glReturnTex  = tempTexture.glTex;
			this._boundTextures.push(tempTexture);
			tempTexture.glBound = true;
		}

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this._boundTextures[0].glTex);
		this._factory.glReturnUnit = 0;
		this._factory.glReturnTex  = this._boundTextures[0].glTex;
	}

	/**
	* Apply a texture to subsequent drawing.
	* @param {Sol.texture.Texture} texture - The texture to apply.
	*/
	applyTexture(texture){
		if(texture.glBound){
			this.id     = texture.glUnit;
			this.width  = texture.width;
			this.height = texture.height;
			return;
		}

		if(this._pointer >= this._MAX_TEXTURES){
			this.flush();
		}

		this._gl.activeTexture(this._gl.TEXTURE0 + this._pointer);
		this._gl.bindTexture(this._gl.TEXTURE_2D, texture.glTex);
		this._factory.glReturnUnit         = texture.glUnit = this._pointer;
		this._factory.glReturnTex          = texture.glTex;
		this._boundTextures[this._pointer] = texture;
		texture.glBound = true;

		this._pointer++;
	}

	/**
	* Flush the vertex buffer and pseudo-unbind all textures.
	*/
	flush(){
		this._buffer.flush();

		for(let i = 0; i < this._MAX_TEXTURES; i++){
			this._boundTextures[i].glBound = false;
		}

		this._pointer = 0;
	}

	/**
	* Destroy the texture cache.
	*/
	destroy(){
		for(let i = 0; i < this._MAX_TEXTURES; i++){
			this._factory.destroyTexture(this._gl, this._tempTextures[i]);
		}

		this._tempTextures  = [];
		this._boundTextures = [];
	}
}

export default TextureCache;
