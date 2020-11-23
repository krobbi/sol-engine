/**
* @module Sol/gfx/webgl/Program
*/

import shaderSrc    from "./shaderSrc/index.js";
import createShader from "./util/createShader.js";
import parseShader  from "./util/parseShader.js";

/**
* WebGL renderer program.
* @class Program
* @memberof Sol.gfx.webgl
* @classdesc An abstraction of a WebGL program.
*/
class Program {
	/**
	* Create the WebGL renderer program.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {string} vertKey - The key of the vertex shader source code to use.
	* @param {string} fragKey - The key of the fragment shader source code to use.
	* @param {number} max - The maximum number of textures.
	* @param {string} out - The name of the texture sample output variable.
	* @param {string} array - The name of the texture sampler array variable.
	* @param {string} id - The name of the texture ID variable.
	* @param {string} uv - The name of the texture coordinate variable.
	*/
	constructor(gl, vertKey, fragKey, max, out, array, id, uv){
		/**
		* The WebGL rendering context to use.
		* @private
		* @type {WebGLRenderingContext|WebGL2RenderingContext}
		*/
		this._gl = gl;

		/**
		* A dictionary of active uniform names and locations.
		* @private
		* @type {Object<string, ?WebGLUniformLocation>}
		*/
		this._uniforms = {};

		/**
		* A dictionary of active vertex attribute names and indicies.
		* @private
		* @type {Object<string, number>}
		*/
		this._attribs = {};

		/**
		* The WebGL program to use.
		* @private
		* @type {WebGLProgram}
		*/
		this._program = gl.createProgram();

		/**
		* The WebGL vertex shader to use.
		* @type {?WebGLShader}
		* @ignore
		*/
		const vert = createShader(gl, gl.VERTEX_SHADER, shaderSrc[vertKey]);

		/**
		* The WebGL fragment shader to use.
		* @type {?WebGLShader}
		* @ignore
		*/
		const frag = createShader(gl, gl.FRAGMENT_SHADER, parseShader(
			shaderSrc[fragKey], max, out, array, id, uv
		));

		// Test for shader creation errors:
		if(!vert || !frag){
			gl.deleteShader(vert);
			gl.deleteShader(frag);
			return;
		}

		// Link the program:
		gl.attachShader(this._program, vert);
		gl.attachShader(this._program, frag);
		gl.linkProgram(this._program);
		gl.detachShader(this._program, vert);
		gl.detachShader(this._program, frag);
		gl.deleteShader(vert);
		gl.deleteShader(frag);

		// Test for linking errors:
		if(!gl.getProgramParameter(this._program, gl.LINK_STATUS)){
			/**
			* The info log of the program.
			* @type {string}
			* @ignore
			*/
			const log = gl.getProgramInfoLog(this._program);

			console.error(`Failed to link a program:\n${log}`);
			return;
		}

		/**
		* The count of active uniforms in the program.
		* @type {number}
		* @ignore
		*/
		const uniformCount = gl.getProgramParameter(
			this._program, gl.ACTIVE_UNIFORMS
		);

		/**
		* The count of active vertex attributes in the program.
		* @type {number}
		* @ignore
		*/
		const attribCount = gl.getProgramParameter(
			this._program, gl.ACTIVE_ATTRIBUTES
		);

		/**
		* Information about an active program input.
		* @type {WebGLActiveInfo}
		* @ignore
		*/
		let info;

		// Gather uniforms:
		for(let i = 0; i < uniformCount; i++){
			info = gl.getActiveUniform(this._program, i);

			/**
			* The name of the uniform with array indicies removed.
			* @type {string}
			* @ignore
			*/
			const name = info.name.replace(/(\[[0-9]*\])+/g, "");

			this._uniforms[name] = gl.getUniformLocation(this._program, info.name);
		}

		// Gather vertex attributes:
		for(let i = 0; i < attribCount; i++){
			info = gl.getActiveAttrib(this._program, i);

			/**
			* The name of the vertex attribute with array indicies removed.
			* @type {string}
			* @ignore
			*/
			const name = info.name.replace(/(\[[0-9]*\])+/g, "");

			this._attribs[name] = gl.getAttribLocation(this._program, info.name);
		}
	}

	/**
	* Start using the program.
	*/
	use(){
		this._gl.useProgram(this._program);
	}

	/**
	* Stop using the program.
	*/
	unuse(){
		this._gl.useProgram(null);
	}

	/**
	* Destroy the program.
	*/
	destroy(){
		this.use();

		for(let name in this._attribs){
			this._gl.disableVertexAttribArray(this._attribs[name]);
		}

		this.unuse();
		this._gl.deleteProgram(this._program);
	}

	/**
	* Set an int uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU1i(name, x){
		this._gl.uniform1i(this._uniforms[name], x);
	}

	/**
	* Set an int array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Int32List} v - The value of the uniform.
	*/
	setU1iv(name, v){
		this._gl.uniform1iv(this._uniforms[name], v);
	}

	/**
	* Set a 2-component int vector uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The X component of the uniform.
	* @param {number} y - The Y component of the uniform.
	* @ignore - Currently unused.
	*/
	setU2i(name, x, y){
		this._gl.uniform2i(this._uniforms[name], x, y);
	}

	/**
	* Set a 2-component int vector array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Int32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU2iv(name, v){
		this._gl.uniform2iv(this._uniforms[name], v);
	}

	/**
	* Set a 3-component int vector uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The X component of the uniform.
	* @param {number} y - The Y component of the uniform.
	* @param {number} z - The Z component of the uniform.
	* @ignore - Currently unused.
	*/
	setU3i(name, x, y, z){
		this._gl.uniform3i(this._uniforms[name], x, y, z);
	}

	/**
	* Set a 3-component int vector array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Int32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU3iv(name, v){
		this._gl.uniform3iv(this._uniforms[name], v);
	}

	/**
	* Set a 4-component int vector uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The X component of the uniform.
	* @param {number} y - The Y component of the uniform.
	* @param {number} z - The Z component of the uniform.
	* @param {number} w - The W component of the uniform.
	* @ignore - Currently unused.
	*/
	setU4i(name, x, y, z, w){
		this._gl.uniform4i(this._uniforms[name], x, y, z, w);
	}

	/**
	* Set a 4-component int vector array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Int32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU4iv(name, v){
		this._gl.uniform4iv(this._uniforms[name], v);
	}

	/**
	* Set a float uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU1f(name, x){
		this._gl.uniform1f(this._uniforms[name], x);
	}

	/**
	* Set a float array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Float32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU1fv(name, v){
		this._gl.uniform1fv(this._uniforms[name], v);
	}

	/**
	* Set a 2-component float vector uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The X component of the uniform.
	* @param {number} y - The Y component of the uniform.
	* @ignore - Currently unused.
	*/
	setU2f(name, x, y){
		this._gl.uniform2f(this._uniforms[name], x, y);
	}

	/**
	* Set a 2-component float vector array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Float32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU2fv(name, v){
		this._gl.uniform2fv(this._uniforms[name], v);
	}

	/**
	* Set a 3-component float vector uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The X component of the uniform.
	* @param {number} y - The Y component of the uniform.
	* @param {number} z - The Z component of the uniform.
	* @ignore - Currently unused.
	*/
	setU3f(name, x, y, z){
		this._gl.uniform3f(this._uniforms[name], x, y, z);
	}

	/**
	* Set a 3-component float vector array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Float32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU3fv(name, v){
		this._gl.uniform3fv(this._uniforms[name], v);
	}

	/**
	* Set a 4-component float vector uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {number} x - The X component of the uniform.
	* @param {number} y - The Y component of the uniform.
	* @param {number} z - The Z component of the uniform.
	* @param {number} w - The W component of the uniform.
	* @ignore - Currently unused.
	*/
	setU4f(name, x, y, z, w){
		this._gl.uniform4f(this._uniforms[name], x, y, z, w);
	}

	/**
	* Set a 4-component float vector array uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {Float32List} v - The value of the uniform.
	* @ignore - Currently unused.
	*/
	setU4fv(name, v){
		this._gl.uniform4fv(this._uniforms[name], v);
	}

	/**
	* Set a 2x2 float matrix uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {boolean} transpose - Whether to transpose the matrix.
	* @param {Float32List} value - The value of the matrix.
	* @ignore - Currently unused.
	*/
	setUm2fv(name, transpose, value){
		this._gl.uniformMatrix2fv(this._uniforms[name], transpose, value);
	}

	/**
	* Set a 2x2 float matrix uniform to the identity matrix.
	* @param {string} name - The name of the uniform to set.
	* @ignore - Currently unused.
	*/
	setUm2fvID(name){
		this.setUm2fv(name, false, new Float32Array([
			1, 0,
			0, 1
		]));
	}

	/**
	* Set a 3x3 float matrix uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {boolean} transpose - Whether to transpose the matrix.
	* @param {Float32List} value - The value of the matrix.
	* @ignore - Currently unused.
	*/
	setUm3fv(name, transpose, value){
		this._gl.uniformMatrix3fv(this._uniforms[name], transpose, value);
	}

	/**
	* Set a 3x3 float matrix uniform to the identity matrix.
	* @param {string} name - The name of the uniform to set.
	* @ignore - Currently unused.
	*/
	setUm3fvID(name){
		this.setUm3fv(name, false, new Float32Array([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]));
	}

	/**
	* Set a 4x4 float matrix uniform.
	* @param {string} name - The name of the uniform to set.
	* @param {boolean} transpose - Whether to transpose the matrix.
	* @param {Float32List} value - The value of the matrix.
	*/
	setUm4fv(name, transpose, value){
		this._gl.uniformMatrix4fv(this._uniforms[name], transpose, value);
	}

	/**
	* Set a 4x4 float matrix uniform to the identity matrix.
	* @param {string} name - The name of the uniform to set.
	*/
	setUm4fvID(name){
		this.setUm4fv(name, false, new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]));
	}

	/**
	* Set a vertex attribute pointer to the currently bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {number} size - The size of the vertex attribute in components.
	* @param {number} type - The type of the vertex attribute.
	* @param {boolean} normalized - Whether to normalize the vertex attribute.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	*/
	setAp(name, size, type, normalized, stride, offset){
		/**
		* The index of the vertex attribute.
		* @type {number}
		* @ignore
		*/
		const index = this._attribs[name];

		this._gl.enableVertexAttribArray(index);
		this._gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	}

	/**
	* Set a float vertex attribute pointer to the currently bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	*/
	setAp1f(name, stride, offset){
		this.setAp(name, 1, this._gl.FLOAT, false, stride, offset);
	}

	/**
	* Set a 2-component float vector vertex attribute pointer to the currently
	* bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	*/
	setAp2f(name, stride, offset){
		this.setAp(name, 2, this._gl.FLOAT, false, stride, offset);
	}

	/**
	* Set a 3-component float vector vertex attribute pointer to the currently
	* bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	* @ignore - Currently unused.
	*/
	setAp3f(name, stride, offset){
		this.setAp(name, 3, this._gl.FLOAT, false, stride, offset);
	}

	/**
	* Set a 4-component float vector vertex attribute pointer to the currently
	* bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	*/
	setAp4f(name, stride, offset){
		this.setAp(name, 4, this._gl.FLOAT, false, stride, offset);
	}

	/**
	* Set an unsigned byte vertex attribute pointer to the currently bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {boolean} normalized - Whether to normalize the vertex attribute.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	* @ignore - Currently unused.
	*/
	setAp1ub(name, normalized, stride, offset){
		this.setAp(name, 1, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
	}

	/**
	* Set a 2-component unsigned byte vector vertex attribute pointer to the
	* currently bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {boolean} normalized - Whether to normalize the vertex attribute.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	* @ignore - Currently unused.
	*/
	setAp2ub(name, normalized, stride, offset){
		this.setAp(name, 2, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
	}

	/**
	* Set a 3-component unsigned byte vector vertex attribute pointer to the
	* currently bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {boolean} normalized - Whether to normalize the vertex attribute.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	* @ignore - Currently unused.
	*/
	setAp3ub(name, normalized, stride, offset){
		this.setAp(name, 3, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
	}

	/**
	* Set a 4-component unsigned byte vector vertex attribute pointer to the
	* currently bound buffer.
	* @param {string} name - The name of the vertex attribute to set.
	* @param {boolean} normalized - Whether to normalize the vertex attribute.
	* @param {number} stride - The stride of the vertex attribute in bytes.
	* @param {number} offset - The offset of the vertex attribute in bytes.
	*/
	setAp4ub(name, normalized, stride, offset){
		this.setAp(name, 4, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
	}
}

export default Program;
