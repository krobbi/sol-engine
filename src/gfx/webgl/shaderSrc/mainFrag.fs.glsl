// FRAGMENT SHADER

// The percentage syntax in the following shader source code is non-standard
// GLSL and is replaced at run-time before the shader source code is sent to a
// shader. This syntax specifies the maximum number of texture units allowed in
// a fragment shader, and creates a switch for getting a texture sample from an
// array of texture samplers using a float ID. This is done because WebGL
// shaders do not support creating arrays with non-constant sizes, or indexing
// arrays with non-constant indicies. Additionally, the maximum number of
// texture units allowed in a fragment shader will vary depending on the user's
// GPU, and the full capacity of texture units per draw call may not even be
// needed by the game, and so can be reduced for improved performance.

precision mediump float;

uniform sampler2D uTex[%MAX_TEXTURES%];

varying float vTexID;
varying vec2  vUV;
varying vec4  vTint;

void main(){
	vec4 texel;

	%GET_TEXEL%

	gl_FragColor = vTint * texel;
}
