/**
* @module Sol/gfx/webgl/util/createShader
*/

/**
* Create a WebGL shader.
* @function createShader
* @memberof Sol.gfx.webgl.util
* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL rendering
* context to use.
* @param {number} type - The type of WebGL shader to create.
* @param {string} src - The source code of the shader.
* @returns {?WebGLShader} The created WebGL shader. Returns null if the shader
* failed to be created.
*/
function createShader(gl, type, src){
	/**
	* The name of the shader type.
	* @type {string}
	* @ignore
	*/
	let name;

	switch(type){
		case gl.VERTEX_SHADER:
			name = "vertex";
			break;
		case gl.FRAGMENT_SHADER:
			name = "fragment";
			break;
		default:
			console.error(`Invalid shader type: ${type}`);
			return null;
	}

	/**
	* The created WebGL shader.
	* @type {?WebGLShader}
	* @ignore
	*/
	const shader = gl.createShader(type);

	if(!shader){
		console.error(`Failed to create a ${name} shader!`);
		gl.deleteShader(shader);
		return null;
	}

	// Compile the shader:
	gl.shaderSource(shader, src);
	gl.compileShader(shader);

	// Test for compilation errors:
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		/**
		* The info log of the shader.
		* @type {string}
		* @ignore
		*/
		const log = gl.getShaderInfoLog(shader);

		console.error(`Failed to compile a ${name} shader:\n${log}`);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

export default createShader;
