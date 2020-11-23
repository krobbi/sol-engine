/**
* @module Sol/gfx/webgl/VertBuffer
* @typedef {import("./Program.js").default}   Sol.gfx.webgl.Program
* @typedef {import("./MVPMatrix.js").default} Sol.gfx.webgl.MVPMatrix
*/

/**
* WebGL renderer vertex buffer.
* @class VertBuffer
* @memberof Sol.gfx.webgl
* @classdesc Stores vertex data to draw with WebGL.
*/
class VertBuffer {
	/**
	* Create the WebGL renderer vertex buffer.
	* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
	* rendering context to use.
	* @param {Sol.gfx.webgl.Program} program - The program to send the vertex data
	* to.
	* @param {Sol.gfx.webgl.MVPMatrix} mvp - The matrix to update before drawing
	* the contents of the buffer.
	* @param {number} maxVerts - The absolute maximum number of verticies allowed
	* per draw call.
	* @param {string} posAttrib - The name of the vertex position attribute to set
	* to the buffer.
	* @param {string} idAttrib - The name of the texture ID attribute to set to
	* the buffer.
	* @param {string} uvAttrib - The name of the texture coordinate attribute to
	* set to the buffer.
	* @param {string} tintAttrib - The name of the vertex color attribute to set
	* to the buffer.
	*/
	constructor(
		gl, program, mvp, maxVerts, posAttrib, idAttrib, uvAttrib, tintAttrib
	){
		/**
		* The WebGL rendering context to use.
		* @private
		* @type {WebGLRenderingContext|WebGL2RenderingContext}
		*/
		this._gl = gl;

		/**
		* The program to send the vertex data to.
		* @private
		* @type {Sol.gfx.webgl.Program}
		*/
		this._program = program;

		/**
		* The matrix to update before drawing the contents of the buffer.
		* @private
		* @type {Sol.gfx.webgl.MVPMatrix}
		*/
		this._mvp = mvp;

		/**
		* The absolute maximum number of verticies allowed per draw call.
		* @private
		* @constant
		* @type {number}
		* @default 16384
		*/
		this._MAX_VERTS = maxVerts;

		/**
		* The number of 32-bit components per vertex. The vertex color counts as 1
		* component as it is represented with 4 unsigned bytes.
		* @private
		* @constant
		* @type {number}
		* @default 6
		*/
		this._COMPONENTS_PER_VERT = 6;

		/**
		* The number of bytes per vertex.
		* @private
		* @constant
		* @type {number}
		* @default 24
		*/
		this._BYTES_PER_VERT = this._COMPONENTS_PER_VERT * 4;

		/**
		* The offset into the buffer in verticies.
		* @private
		* @type {number}
		*/
		this._offset = 0;

		/**
		* The absolute maximum number of bytes allowed per draw call.
		* @private
		* @ignore
		*/
		const maxBytes = maxVerts * this._BYTES_PER_VERT;

		/**
		* An array buffer storing the raw vertex data of the buffer.
		* @private
		* @type {ArrayBuffer}
		*/
		this._vertData = new ArrayBuffer(maxBytes);

		/**
		* A 32-bit float view into the vertex data for setting components.
		* @private
		* @type {Float32Array}
		*/
		this._vertF32 = new Float32Array(this._vertData);

		/**
		* A 32-bit unsigned int view into the vertex data for setting vertex colors.
		* @private
		* @type {Uint32Array}
		*/
		this._vertU32 = new Uint32Array(this._vertData);

		/**
		* An unsigned byte view into the vertex data for sending the vertex data to
		* the WebGL buffer.
		* @private
		* @type {Uint8Array}
		*/
		this._vertU8 = new Uint8Array(this._vertData);

		/**
		* A WebGL buffer for sending the vertex data to the program.
		* @private
		* @type {WebGLBuffer}
		*/
		this._buffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
		gl.bufferData(gl.ARRAY_BUFFER, maxBytes, gl.STREAM_DRAW);

		this._program.setAp2f(posAttrib, this._BYTES_PER_VERT, 0);
		this._program.setAp1f(idAttrib, this._BYTES_PER_VERT, 8);
		this._program.setAp2f(uvAttrib, this._BYTES_PER_VERT, 12);
		this._program.setAp4ub(tintAttrib, true, this._BYTES_PER_VERT, 20);
	}

	/**
	* Push a vertex to the vertex buffer.
	* @param {number} x - The X component of the vertex's position.
	* @param {number} y - The Y component of the vertex's position.
	* @param {number} id - The texture ID of the vertex.
	* @param {number} u - The U component of the vertex's texture coordinates.
	* @param {number} v - The V component of the vertex's texture coordinates.
	* @param {number} tint - The vertex color in 32-bit ABGR format.
	*/
	pushVert(x, y, id, u, v, tint){
		/**
		* The offset into the vertex buffer in components.
		* @type {number}
		* @ignore
		*/
		let component = this._offset * this._COMPONENTS_PER_VERT;

		/**
		* A 32-bit float view into the vertex data for setting components.
		* @type {Float32Array}
		* @ignore
		*/
		const f32 = this._vertF32;

		/**
		* A 32-bit unsigned int view into the vertex data for setting vertex colors.
		* @type {Uint32Array}
		* @ignore
		*/
		const u32 = this._vertU32;

		f32[component++] = x;
		f32[component++] = y;
		f32[component++] = id;
		f32[component++] = u;
		f32[component++] = v;
		u32[component++] = tint;

		this._offset++;
	}

	/**
	* Push a quad to the vertex buffer.
	* @param {number} l - The X coordinate of the left edge of the quad.
	* @param {number} t - The Y coordinate of the top edge of the quad.
	* @param {number} r - The X coordinate of the right edge of the quad.
	* @param {number} b - The Y coordinate of the bottom edge of the quad.
	* @param {number} id - The texture ID of the quad.
	* @param {number} cl - The X coordinate of the left edge of the quad's texture
	* coordinates.
	* @param {number} ct - The Y coordinate of the top edge of the quad's texture
	* coordinates.
	* @param {number} cr - The X coordinate of the right edge of the quad's
	* texture coordinates.
	* @param {number} cb - The Y coordinate of the bottom edge of the quad's
	* texture coordinates.
	* @param {number} tint - The color of the quad in 32-bit ABGR format.
	*/
	pushQuad(l, t, r, b, id, cl, ct, cr, cb, tint){
		if(this._offset + 6 > this._MAX_VERTS){
			this.flush();
		}

		// Triangle 1:
		this.pushVert(l, t, id, cl, ct, tint);
		this.pushVert(l, b, id, cl, cb, tint);
		this.pushVert(r, t, id, cr, ct, tint);

		// Triangle 2:
		this.pushVert(r, t, id, cr, ct, tint);
		this.pushVert(l, b, id, cl, cb, tint);
		this.pushVert(r, b, id, cr, cb, tint);
	}

	/**
	* Draw the contents of the buffer and reset the offset into the buffer.
	*/
	flush(){
		this._mvp.update();
		this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, this._vertU8.subarray(
			0, this._offset * this._BYTES_PER_VERT
		));
		this._gl.drawArrays(this._gl.TRIANGLES, 0, this._offset);
		this._offset = 0;
	}

	/**
	* Destroy the buffer.
	*/
	destroy(){
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
		this._gl.deleteBuffer(this._buffer);
	}
}

export default VertBuffer;
