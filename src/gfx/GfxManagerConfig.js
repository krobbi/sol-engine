/**
* @module Sol/gfx/GfxManagerConfig
*/

import CONST      from "../CONST.js";
import clamp      from "../math/clamp.js";
import getDefault from "../util/object/getDefault.js";

/**
* Graphics manager configuration.
* @class GfxManagerConfig
* @memberof Sol.gfx
* @classdesc Stores configuration for a graphics manager.
*/
class GfxManagerConfig {
	/**
	* Create the graphics manager configuration.
	* @param {Object<string, any>=} options - An options object to merge into the
	* graphics manager configuration.
	*/
	constructor(options = {}){
		/**
		* A canvas to use, the parent element of a canvas to use, or a CSS query to
		* find a canvas or canvas parent with.
		* @type {string|HTMLElement}
		* @default ".sol-canvas-parent"
		*/
		this.canvas = getDefault(options, "canvas", ".sol-canvas-parent");

		/**
		* The preferred renderer to use.
		* @type {number}
		* @default Sol.WEBGL
		*/
		this.renderer = getDefault(options, "renderer", CONST.WEBGL);

		/**
		* The width of the resolution.
		* @type {number}
		* @default 800
		*/
		this.width = getDefault(options, "width", 800);

		/**
		* The height of the resolution.
		* @type {number}
		* @default 600
		*/
		this.height = getDefault(options, "height", 600);

		/**
		* The absolute maximum number of textures allowed per draw call when using
		* the WebGL renderer. Must be between 1 and 32. The actual maximum number of
		* textures per draw call may be lower depending on the user's GPU. For best
		* performance it is recommended to set this to the minimum number of
		* textures needed per draw call without wasting draw calls. If you are
		* unsure about this option it is recommended to leave it at its default
		* setting.
		* @type {number}
		* @default 32
		*/
		this.glMaxTextures = clamp(getDefault(options, "glMaxTextures", 32), 1, 32);

		/**
		* The absolute maximum number of verticies allowed per draw call when using
		* the WebGL renderer. Must be at least 6. Higher values will increse memory
		* usage but may reduce the number of draw calls per frame.
		* @type {number}
		* @default 16384
		*/
		this.glMaxVerts = clamp(getDefault(options, "glMaxVerts", 16384), 6, 65536);
	}
}

export default GfxManagerConfig;
