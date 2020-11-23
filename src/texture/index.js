/**
* @module Sol/texture
*/

import imgSrc         from "./imgSrc/index.js";
import Texture        from "./Texture.js";
import TextureFactory from "./TextureFactory.js";
import TextureManager from "./TextureManager.js";

/**
* Stores classes and resources for textures.
* @namespace Sol.texture
* @memberof Sol
* @type {Object<string, function|Object<string, string>>}
*/
const texture = {
	imgSrc:         imgSrc,
	Texture:        Texture,
	TextureFactory: TextureFactory,
	TextureManager: TextureManager
};

export default texture;
