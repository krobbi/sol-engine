/**
* @module Sol/gfx/GfxManager
* @typedef {import("../core/Game.js").default}       Sol.Game
* @typedef {import("./GfxManagerConfig.js").default} Sol.gfx.GfxManagerConfig
* @typedef {ElemMemento}                             Sol.dom.ElemMemento
* @typedef {Renderer}                                Sol.gfx.Renderer
*/

import ElemMemento    from "../dom/ElemMemento.js";
import Renderer       from "./Renderer.js";
import WebGLRenderer  from "./webgl/WebGLRenderer.js";
import CanvasRenderer from "./canvas/CanvasRenderer.js";

import CONST from "../CONST.js";

/**
* Graphics manager.
* @class GfxManager
* @memberof Sol.gfx
* @classdesc Manages graphics for a game instance.
*/
class GfxManager {
	/**
	* Create the graphics manager.
	* @param {Sol.Game} game - The game instance that this graphics manager
	* belongs to.
	* @param {Sol.gfx.GfxManagerConfig} config - The graphics manager
	* configuration.
	*/
	constructor(game, config){
		/**
		* The game instance that this graphics manager belongs to.
		* @private
		* @type {Sol.Game}
		*/
		this._game = game;

		/**
		* The graphics manager configuration.
		* @private
		* @type {Sol.gfx.GfxManagerConfig}
		*/
		this._config = config;

		/**
		* Whether the active canvas was generated by Sol.
		* @private
		* @type {boolean}
		*/
		this._canvasGenerated = false;

		/**
		* An element memento to restore the canvas with.
		* @private
		* @type {Sol.dom.ElemMemento}
		*/
		this._canvasMemento = new ElemMemento();

		/**
		* The canvas to use.
		* @type {HTMLCanvasElement}
		*/
		this.canvas;

		/**
		* The renderer to use.
		* @type {Renderer}
		*/
		this.renderer;
	}

	/**
	* Set up a canvas for use with Sol.
	* @private
	* @param {HTMLCanvasElement} canvas - The canvas to initialize.
	*/
	_initCanvas(canvas){
		if(this._canvasGenerated){
			canvas.classList.add("sol-generated");
		}else{
			this._canvasMemento.save(canvas);
		}

		canvas.innerHTML = null;
		canvas.removeAttribute("title");
		canvas.classList.add("sol", "sol-canvas");
		canvas.style.setProperty("background", "#000");
		canvas.style.setProperty("opacity", "1.0");
		canvas.style.setProperty("visibility", "visibile");
	}

	/**
	* Create a renderer.
	* @private
	* @param {HTMLCanvasElement} canvas - The canvas to use.
	*/
	_createRenderer(canvas){
		if(this._config.renderer == CONST.NONE){
			return new Renderer(CONST.NONE, canvas);
		}

		/**
		* A list of rendering context IDs to try in priority order.
		* @type {string[]}
		* @ignore
		*/
		const contextIDs = this._config.renderer == CONST.CANVAS ? [
			"2d",
			"webgl2",
			"webgl",
			"experimental-webgl2",
			"experimental-webgl"
		] : [
			"webgl2",
			"webgl",
			"2d",
			"experimental-webgl2",
			"experimental-webgl"
		];

		/**
		* The rendering context to use.
		* @type {?RenderingContext}
		* @ignore
		*/
		let context = null;

		for(let id of contextIDs){
			context = canvas.getContext(id);

			if(context){
				break;
			}
		}

		// Test for WebGL:
		if(
			(
				typeof WebGL2RenderingContext != "undefined" &&
				context instanceof WebGL2RenderingContext
			) || (
				typeof WebGLRenderingContext != "undefined" &&
				context instanceof WebGLRenderingContext
			)
		){
			return new WebGLRenderer(
				this._game, canvas, context,
				this._config.glMaxTextures, this._config.glMaxVerts
			);
		}

		// Test for canvas:
		if(
			typeof CanvasRenderingContext2D != "undefined" &&
			context instanceof CanvasRenderingContext2D
		){
			return new CanvasRenderer(canvas, context);
		}

		return new Renderer(CONST.NONE, canvas); // Default to a blank renderer.
	}

	/**
	* Runs when the game starts. Finds the canvas and creates a renderer.
	*/
	onStart(){
		this.canvas = this._getCanvas(this._config.canvas);
		this._initCanvas(this.canvas);
		this.renderer = this._createRenderer(this.canvas);
		this.renderer.resize(this._config.width, this._config.height);
	}

	/**
	* Runs before every frame. Prepares for drawing.
	*/
	onPreDraw(){
		this.renderer.onPreDraw();
	}

	/**
	* Runs after every frame. Finalizes drawing.
	*/
	onPostDraw(){
		this.renderer.onPostDraw();
	}

	/**
	* Runs when the game stops. Destroys the renderer and restores the canvas.
	*/
	onStop(){
		this.renderer.destroy();

		if(this._canvasGenerated){
			this.canvas.parentNode.removeChild(this.canvas);
		}else{
			this._canvasMemento.restore(this.canvas).clear();
		}
	}

	/**
	* Get a canvas.
	* @private
	* @param {string|HTMLElement} query - A canvas to use, the parent element of a
	* canvas to use, or a CSS query to find a canvas or canvas parent with.
	*/
	_getCanvas(query){
		/**
		* The parent node to search for or generate a canvas in.
		* @type {Node}
		* @ignore
		*/
		let parent = document.body;

		this._canvasGenerated = false;

		if(query instanceof HTMLCanvasElement){
			return query;
		}else if(query instanceof HTMLElement){
			parent = query;
		}else{
			/**
			* A list of potential canvases or canvas parents to use.
			* @type {NodeList}
			* @ignore
			*/
			const candidates = document.querySelectorAll(query);

			for(let candidate of candidates){
				if(candidate instanceof HTMLCanvasElement){
					return candidate;
				}
			}

			if(candidates.length >= 1){
				parent = candidates[0];
			}
		}

		for(let child of parent.childNodes){
			if(child instanceof HTMLCanvasElement){
				return child;
			}
		}

		/**
		* A generated canvas.
		* @type {HTMLCanvasElement}
		* @ignore
		*/
		const canvas = document.createElement("canvas");

		parent.appendChild(canvas);
		this._canvasGenerated = true;
		return canvas;
	}
}

export default GfxManager;
