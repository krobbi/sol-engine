/**
* @module Sol/gfx/webgl/util/parseShader
*/

/**
* Parse a fragment shader to hold a maximum number of textures and to sample
* from an array of texture samplers.
* @function parseShader
* @memberof Sol.gfx.webgl.util
* @param {string} src - The source code of the shader.
* @param {number} max - The maximum number of textures.
* @param {string} out - The name of the texture sample output variable.
* @param {string} array - The name of the texture sampler array variable.
* @param {string} id - The name of the texture ID variable.
* @param {string} uv - The name of the texture coordinate variable.
* @returns {string} The parsed source code of the shader.
*/
function parseShader(src, max, out, array, id, uv){
	/**
	* The code to inject at %GET_TEXEL%.
	* @type {string}
	* @ignore
	*/
	let inject = "";

	for(let i = 0; i < max; i++){
		if(i > 0){
			inject += "else ";
		}

		if(i < max - 1){
			inject += `if(${id}==${i}.0)`;
		}

		inject += `${out}=texture2D(${array}[${i}],${uv});`;
	}

	return src.replace("%MAX_TEXTURES%", `${max}`).replace("%GET_TEXEL%", inject);
}

export default parseShader;
