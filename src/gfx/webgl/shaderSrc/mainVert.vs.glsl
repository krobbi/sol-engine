// VERTEX SHADER

precision mediump float;

uniform mat4 uMVP;

attribute vec2  aPos;
attribute float aTexID;
attribute vec2  aUV;
attribute vec4  aTint;

varying float vTexID;
varying vec2  vUV;
varying vec4  vTint;

void main(){
	gl_Position = uMVP * vec4(aPos, 1.0, 1.0);

	vTexID = aTexID;
	vUV    = aUV;
	vTint  = aTint;
}
