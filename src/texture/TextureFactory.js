/**
* @module Sol/texture/TextureFactory
* @typedef {Texture} Sol.texture.Texture
*/

import Texture from "./Texture.js";

import imgSrc from "./imgSrc/index.js";
import noop   from "../util/noop.js";

/**
* Texture factory.
* @class TextureFactory
* @memberof Sol.texture
* @classdesc Creates and builds textures.
*/
class TextureFactory {
	/**
	* Create the texture factory.
	*/
	constructor(){
		/**
		* The WebGL texture to re-bind if texture binding is used.
		* @type {?WebGLTexture}
		*/
		this.glReturnTex = null;

		/**
		* The texture unit to return to if the active texture is changed.
		* @type {number}
		*/
		this.glReturnUnit = 0;
	}

	/**
	* Create a texture from an image source.
	* @param {?WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {string} src - The source of the texture image.
	* @param {number} width - The expected width of the texture. Use 0 for the
	* width of the texture image.
	* @param {number} height - The expected height of the texture. Use 0 for the
	* height of the texture image.
	* @returns {Sol.texture.Texture} The created texture.
	*/
	createTexture(gl, src, width, height){
		/**
		* The created texture.
		* @type {Sol.texture.Texture}
		* @ignore
		*/
		const texture = new Texture();

		/**
		* An image to load the texture with.
		* @type {HTMLImageElement}
		* @ignore
		*/
		const img = new Image();

		/**
		* Runs when the texture image loads.
		* @ignore
		*/
		img.onload = () => {
			img.onload     = noop;
			img.onerror    = noop;
			texture.width  = width  ? width  : img.naturalWidth;
			texture.height = height ? height : img.naturalHeight;

			if(gl){
				this.glOpenTexture(gl, texture);
				gl.texImage2D(
					gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img
				);
				this.glCloseTexture(gl, texture);
				return;
			}

			if(typeof ImageBitmap != "undefined"){
				createImageBitmap(img, 0, 0, img.naturalWidth, img.naturalHeight, {
					resizeWidth: texture.width,
					resizeHeight: texture.height,
					resizeQuality: "pixelated"
				}).then(
					/**
					* Runs when the image bitmap is created successfully.
					* @param {ImageBitmap} bitmap - The created image bitmap.
					* @ignore
					*/
					bitmap => {
						this.canvasCloseTexture(texture, bitmap);
					},

					/**
					* Runs when the image bitmap failed to be created.
					* @param {any} reason - The reason why the image bitmap failed to be
					* created.
					* @ignore
					*/
					reason => {
						console.warn(`Failed to create a bitmap for ${src}:\n${reason}`);
						this.canvasCloseTexture(texture, img);
					}
				);
			}else{
				this.canvasCloseTexture(texture, img);
			}
		};

		/**
		* Runs when the texture image fails to load.
		* @ignore
		*/
		img.onerror = () => {
			img.onerror = noop;
			console.warn(`Missing texture: ${src}`);
			texture.missing = true;
			img.src         = imgSrc.missing;
		};

		img.src = src;
		return texture;
	}

	/**
	* Destroy a texture.
	* @param {?WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {Sol.texture.Texture} texture - The texture to destroy.
	*/
	destroyTexture(gl, texture){
		texture.loaded  = false;
		texture.missing = false;

		if(gl){
			gl.activeTexture(gl.TEXTURE0 + texture.glUnit);
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.deleteTexture(texture.glTex);

			if(this.glReturnTex == texture.glTex){
				this.glReturnTex = null;
			}else{
				gl.bindTexture(gl.TEXTURE_2D, this.glReturnTex);
			}

			gl.activeTexture(gl.TEXTURE0 + this.glReturnUnit);
		}

		if(
			typeof ImageBitmap != "undefined" &&
			texture.canvasImg instanceof ImageBitmap
		){
			texture.canvasImg.close();
		}

		texture.width            = 1;
		texture.height           = 1;
		texture.glTex            = null;
		texture.glBound          = false;
		texture.glUnit           = 0;
		texture.canvasImg        = null;
		texture.canvasCropScaleX = 1;
		texture.canvasCropScaleY = 1;
	}

	/**
	* Open a texture for holding a WebGL texture.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {Sol.texture.Texture} texture - The texture to open.
	*/
	glOpenTexture(gl, texture){
		texture.glTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture.glTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}

	/**
	* Close a texture that holds a WebGL texture.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {Sol.texture.Texture} texture - The texture to close.
	*/
	glCloseTexture(gl, texture){
		gl.bindTexture(gl.TEXTURE_2D, this.glReturnTex);
		gl.flush();
		texture.loaded = true;
	}

	/**
	* Create a single-pixel WebGL texture. This method is synchronous and will
	* return a loaded texture.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {number} r - The red component of the pixel between 0 and 255.
	* @param {number} g - The green component of the pixel between 0 and 255.
	* @param {number} b - The blue component of the pixel between 0 and 255.
	* @param {number} a - The alpha component of the pixel between 0 and 255.
	* @returns {Sol.texture.Texture} The created texture.
	*/
	glCreatePixel(gl, r, g, b, a){
		/**
		* The created texture.
		* @type {Sol.texture.Texture}
		* @ignore
		*/
		const texture = new Texture();

		texture.width  = 1;
		texture.height = 1;
		this.glOpenTexture(gl, texture);
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
			new Uint8Array([r, g, b, a])
		);
		this.glCloseTexture(gl, texture);
		return texture;
	}

	/**
	* Close a texture that holds a canvas image source.
	* @param {Sol.texture.Texture} texture - The texture to close.
	* @param {CanvasImageSource} img - The canvas image source of the texture.
	*/
	canvasCloseTexture(texture, img){
		texture.canvasImg       = img;
		texture.canvasCropScaleX = img.width  / texture.width;
		texture.canvasCropScaleY = img.height / texture.height;
		texture.loaded           = true;
	}
}

export default TextureFactory;
