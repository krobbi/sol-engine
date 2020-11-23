/**
* @module Sol/gfx/webgl/WebGLRenderer
* @typedef {import("../../core/Game.js").default}       Sol.Game
* @typedef {import("../../texture/Texture.js").default} Sol.texture.Texture
* @typedef {Renderer}     Sol.gfx.Renderer
* @typedef {Program}      Sol.gfx.webgl.Program
* @typedef {MVPMatrix}    Sol.gfx.webgl.MVPMatrix
* @typedef {VertBuffer}   Sol.gfx.webgl.VertBuffer
* @typedef {TextureCache} Sol.gfx.webgl.TextureCache
*/

import Renderer     from "../Renderer.js";
import Program      from "./Program.js";
import MVPMatrix    from "./MVPMatrix.js";
import VertBuffer   from "./VertBuffer.js";
import TextureCache from "./TextureCache.js";

import CONST from "../../CONST.js";
import clamp from "../../math/clamp.js";

/**
* WebGL renderer.
* @class WebGLRenderer
* @extends Sol.gfx.Renderer
* @memberof Sol.gfx.webgl
* @classdesc Renders using the WebGL rendering context.
*/
class WebGLRenderer extends Renderer {
	/**
	* Create the WebGL renderer.
	* @param {Sol.Game} game - The game instance that this WebGL renderer belongs
	* to.
	* @param {HTMLCanvasElement} canvas - The canvas to use.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {number} maxTextures - The absolute maximum number of texture units
	* allowed per draw call.
	* @param {number} maxVerts - The absolute maximum number of verticies allowed
	* per draw call.
	*/
	constructor(game, canvas, gl, maxTextures, maxVerts){
		super(CONST.WEBGL, canvas);

		/**
		* The WebGL rendering context to use.
		* @private
		* @type {WebGLRenderingContext|WebGL2RenderingContext}
		*/
		this._gl = gl;

		// Disabled capabilities:
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.DITHER);
		gl.disable(gl.POLYGON_OFFSET_FILL);
		gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
		gl.disable(gl.SAMPLE_COVERAGE);
		gl.disable(gl.SCISSOR_TEST);
		gl.disable(gl.STENCIL_TEST);

		// Blend capability:
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.clearColor(0, 0, 0, 1);

		// Get the true number of maximum textures:
		maxTextures = clamp(
			gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), 1, maxTextures
		);

		/**
		* An array of texture indicies to populate the sampler array uniform with.
		* @type {Int32Array}
		* @ignore
		*/
		const textureIndicies = new Int32Array(maxTextures);

		for(let i = 0; i < maxTextures; i++){
			textureIndicies[i] = i;
		}

		/**
		* The program to use.
		* @private
		* @type {Sol.gfx.webgl.Program}
		*/
		this._program = new Program(
			gl, "mainVert", "mainFrag", maxTextures, "texel", "uTex", "vTexID", "vUV"
		);

		// Set default uniforms:
		this._program.use();
		this._program.setU1iv("uTex", textureIndicies);
		this._program.setUm4fvID("uMVP");

		/**
		* The model-view-projection matrix to use.
		* @private
		* @type {Sol.gfx.webgl.MVPMatrix}
		*/
		this._mvp = new MVPMatrix(this._program, "uMVP");

		/**
		* The vertex buffer to use.
		* @private
		* @type {Sol.gfx.webgl.VertBuffer}
		*/
		this._vertBuffer = new VertBuffer(
			gl, this._program, this._mvp, maxVerts, "aPos", "aTexID", "aUV", "aTint"
		);

		/**
		* The texture cache to use.
		* @private
		* @type {Sol.gfx.webgl.TextureCache}
		*/
		this._textureCache = new TextureCache(
			game, gl, this._vertBuffer, maxTextures
		);
	}

	/**
	* Clear the screen.
	* @override
	*/
	clear(){
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}

	/**
	* Apply a texture to subsequent drawing.
	* @override
	* @param {Sol.texture.Texture} texture - The texture to apply.
	*/
	applyTexture(texture){
		this._textureCache.applyTexture(texture);
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
		/**
		* The texture cache to use.
		* @type {Sol.gfx.webgl.TextureCache}
		* @ignore
		*/
		const cache = this._textureCache;

		w  += x;
		h  += y;
		cw  = (cw + cx) / cache.width;
		ch  = (ch + cy) / cache.height;
		cx /= cache.width;
		cy /= cache.height;

		this._vertBuffer.pushQuad(x, y, w, h, cache.id, cx, cy, cw, ch, 0xFFFFFFFF);
	}

	/**
	* Destroy the renderer.
	* @override
	*/
	destroy(){
		this._textureCache.destroy();
		this._vertBuffer.destroy();
		this._program.destroy();
		this._gl.clearColor(0, 0, 0, 0);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
		this._gl.flush();
	}

	/**
	* Runs when the resolution is resized.
	* @override
	* @protected
	*/
	_onResize(){
		this._gl.viewport(0, 0, this._width, this._height);
		this._mvp.projection(this._width, this._height);
	}

	/**
	* Runs before every frame.
	* @override
	*/
	onPreDraw(){
		this.clear();
	}

	/**
	* Runs after every frame.
	* @override
	*/
	onPostDraw(){
		this._vertBuffer.flush();
	}

	/**
	* The WebGL rendering context to use.
	* @override
	* @readonly
	* @returns {WebGLRenderingContext|WebGL2RenderingContext}
	*/
	get gl(){ return this._gl; }
}

export default WebGLRenderer;
