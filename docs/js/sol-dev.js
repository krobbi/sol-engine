/*
* Sol
* By Chris Roberts (Krobbizoid)
* https://github.com/krobbi/sol-engine
* Development version, not for production use!
*/

/**
* @name Sol
* @description Lightweight JavaScript game engine.
* @version 0.2.0-dev
* @license {@link https://krobbi.github.io/license/2020/mit.txt|MIT License}
* @author Chris Roberts (Krobbizoid)
* @copyright 2020 Chris Roberts
*/
var Sol = (function () {
'use strict';
class Asset {
constructor(){
this._loaded = false;
this._missing = false;
}
set loaded(value){ this._loaded = value; }
set missing(value){ this._missing = value; }
get loaded(){ return this._loaded; }
get missing(){ return this._missing; }
}
function getDefault(src, key, defaultValue){
return src.hasOwnProperty(key) ? src[key] : defaultValue;
}
class Loader {
constructor(game){
this._game = game;
this._assets = {};
}
_allocate(listKey){
if(!(listKey in this._assets)){
this._assets[listKey] = [];
}
return this._assets[listKey];
}
load(listKey, data){
const jsonFiles = getDefault(data, "json", {});
const textures = getDefault(data, "textures", {});
for(let key in jsonFiles){
const jsonFile = jsonFiles[key];
const src = getDefault(jsonFile, "src", "data:application/json,{}");
this.loadJsonFile(listKey, key, src);
}
for(let key in textures){
const texture = textures[key];
const src = getDefault(texture, "src", "");
const width = getDefault(texture, "width", 0);
const height = getDefault(texture, "height", 0);
this.loadTexture(listKey, key, src, width, height);
}
}
loadJsonFile(listKey, key, src){
const list = this._allocate(listKey);
list.push(this._game.json.load(key, src));
}
loadTexture(listKey, key, src, width = 0, height = 0){
const list = this._allocate(listKey);
list.push(this._game.texture.load(key, src, width, height));
}
progress(listKey){
const list = this._allocate(listKey);
let count = 0;
for(let asset of list){
if(asset.loaded){
count++;
}
}
if(count >= list.length){
this._assets[listKey] = [];
return 1;
}
return count / list.length;
}
complete(listKey){
return this.progress(listKey) >= 1;
}
onStop(){
for(let key in this._assets){
this._assets[key] = [];
}
}
}
const asset = {
Asset:  Asset,
Loader: Loader
};
/**
* Global constants to extend Sol with.
* @global
* @mixin Sol.CONST
* @type {Object<string, number|string>}
*/
const CONST = {
/**
* The semantic version tag for this version of Sol.
* @constant
* @type {string}
* @name Sol.VERSION
* @default "0.2.0"
*/
VERSION: "0.2.0",
/**
* The type of license for this version of Sol.
* @constant
* @type {string}
* @name Sol.LICENSE
* @default "MIT"
*/
LICENSE: "MIT",
/**
* The URL of the license for this version of Sol.
* @constant
* @type {string}
* @name Sol.LICENSE_URL
* @default "https://krobbi.github.io/license/2020/mit.txt"
*/
LICENSE_URL: "https://krobbi.github.io/license/2020/mit.txt",
/**
* The copyright holder for this version of Sol.
* @constant
* @type {string}
* @name Sol.COPYRIGHT
* @default "Chris Roberts"
*/
COPYRIGHT: "Chris Roberts",
/**
* The copyright year for this version of Sol.
* @constant
* @type {string}
* @name Sol.COPYRIGHT_YEAR
* @default "2020"
*/
COPYRIGHT_YEAR: "2020",
/**
* An enumerated value representing "none".
* @constant
* @type {number}
* @name Sol.NONE
* @default 0
*/
NONE: 0,
/**
* An enumerated value representing the WebGL renderer.
* @constant
* @type {number}
* @name Sol.WEBGL
* @default 1
*/
WEBGL: 1,
/**
* An enumerated value representing the canvas renderer.
* @constant
* @type {number}
* @name Sol.CANVAS
* @default 2
*/
CANVAS: 2
};
function consoleSplash(game){
let rendererName;
switch(game.gfx.renderer.type){
case CONST.NONE:
rendererName = "No";
break;
case CONST.WEBGL:
rendererName = "WebGL";
break;
case CONST.CANVAS:
rendererName = "Canvas";
break;
default:
rendererName = "Unknown";
break;
}
console.log(
[
`%c Sol v${CONST.VERSION} `,
`%c ${rendererName} renderer `,
` ${CONST.LICENSE} License - ${CONST.LICENSE_URL} `,
` Copyright (c) ${CONST.COPYRIGHT_YEAR} ${CONST.COPYRIGHT} `
].join("\n"),
"background:#080808;color:#f77f00;font-size:medium;font-weight:bold;",
"background:#080808;color:#f3d180;"
);
}
function getCompatible(){
const requiredTypes = [
typeof document,
typeof document.readyState,
typeof setInterval,
typeof clearInterval,
typeof requestAnimationFrame
];
for(let type of requiredTypes){
if(type == "undefined"){
return false;
}
}
return true;
}
const util = {
consoleSplash: consoleSplash,
getCompatible: getCompatible
};
function clamp(value, min, max){
return Math.min(max, Math.max(min, value));
}
class GfxManagerConfig {
constructor(options = {}){
this.canvas = getDefault(options, "canvas", ".sol-canvas-parent");
this.renderer = getDefault(options, "renderer", CONST.WEBGL);
this.width = getDefault(options, "width", 800);
this.height = getDefault(options, "height", 600);
this.glMaxTextures = clamp(getDefault(options, "glMaxTextures", 32), 1, 32);
this.glMaxVerts = clamp(getDefault(options, "glMaxVerts", 16384), 6, 65536);
}
}
class KeyManagerConfig {
constructor(options = {}){
this.enabled = !!getDefault(options, "enabled", true);
}
}
class SceneManagerConfig {
constructor(options = {}){
this.main = getDefault(options, "main", "main");
this.scenes = getDefault(options, "scenes", {});
}
}
class Config {
constructor(options = {}){
this.autoStart = !!getDefault(options, "autoStart", false);
this.gfx = new GfxManagerConfig(getDefault(options, "gfx", {}));
this.key = new KeyManagerConfig(getDefault(options, "key", {}));
this.scene = new SceneManagerConfig(getDefault(options, "scene", {}));
}
}
class Loop {
constructor(game){
this._game = game;
this._starting = false;
this._running = false;
this._stopping = false;
this._timeNow = 0;
this._timeLast = 0;
this._delta = 0;
}
_step(){
this._delta = (this._timeNow - this._timeLast) / 1000;
this._onUpdate();
if(this._stopping){
this._onStop();
this._running  = false;
this._stopping = false;
return;
}
requestAnimationFrame(
time => {
this._timeLast = this._timeNow;
this._timeNow  = time;
this._step();
}
);
}
start(){
if(
this._starting || (this._running && !this._stopping) || !getCompatible()
){
return false;
}
this._starting = true;
const waitInterval = setInterval(
() => {
if(!this._running && document.readyState == "complete"){
clearInterval(waitInterval);
this._running  = true;
this._stopping = false;
this._onStart();
this._starting = false;
this._step();
}
}
);
return true;
}
restart(){
this.stop();
return this.start();
}
stop(){
if(this._running && !this._stopping){
this._stopping = true;
return true;
}
return false;
}
_onStart(){
this._game.gfx.onStart();
consoleSplash(this._game);
this._game.texture.onStart();
this._game.key.onStart();
this._game.scene.onStart();
}
_onUpdate(){
this._game.time.onPreTick(this._delta);
this._game.key.onPreTick();
this._game.scene.onTick();
this._game.gfx.onPreDraw();
this._game.scene.onDraw();
this._game.gfx.onPostDraw();
}
_onStop(){
this._game.scene.onStop();
this._game.key.onStop();
this._game.loader.onStop();
this._game.texture.onStop();
this._game.json.onStop();
this._game.gfx.onStop();
}
get running(){ return this._running; }
}
const core = {
util:   util,
Config: Config,
Loop:   Loop
};
class ElemMemento {
constructor(){
this.innerHTML = "";
this.attributes = {};
}
clear(){
this.innerHTML  = "";
this.attributes = {};
return this;
}
save(elem){
this.innerHTML  = elem.innerHTML;
this.attributes = {};
for(let attribute of elem.attributes){
this.attributes[attribute.name] = attribute.value;
}
return this;
}
restore(elem){
elem.innerHTML = this.innerHTML;
while(elem.attributes.length > 0){
elem.removeAttribute(elem.attributes[0].name);
}
for(let name in this.attributes){
elem.setAttribute(name, this.attributes[name]);
}
return this;
}
}
function noop(){}
class EventHandler {
constructor(targets, types, listener, options){
this._targets = Array.isArray(targets) ? targets : [targets];
this._types = Array.isArray(types) ? types : [types];
this._listener = listener;
this._options = options;
this._active = false;
}
start(){
if(this._active || this._targets.length == 0 || this._types.length == 0){
return false;
}
for(let target of this._targets){
for(let type of this._types){
target.addEventListener(type, this._listener, this._options);
}
}
this._active = true;
return true;
}
stop(){
if(!this._active){
return false;
}
for(let target of this._targets){
for(let type of this._types){
target.removeEventListener(type, this._listener, this._options);
}
}
this._active = false;
return true;
}
destroy(){
this.stop();
this._targets  = [];
this._types    = [];
this._listener = noop;
this._options  = false;
}
get active(){ return this._active; }
}
const dom = {
ElemMemento:  ElemMemento,
EventHandler: EventHandler
};
class Renderer {
constructor(type, canvas){
this._type = type;
this._canvas = canvas;
this._width = 2;
this._height = 2;
}
resize(width, height){
this._canvas.width  = this._width  = width;
this._canvas.height = this._height = height;
this._onResize();
}
clear(){}
applyTexture(texture){ }
drawTexture(x, y, w, h, cx, cy, cw, ch){ }
destroy(){}
_onResize(){}
onPreDraw(){}
onPostDraw(){}
get type(){ return this._type; }
get width(){ return this._width; }
get height(){ return this._height; }
get gl(){ return null; }
get ctx(){ return null; }
}
class CanvasRenderer extends Renderer {
constructor(canvas, ctx){
super(CONST.CANVAS, canvas);
this._ctx = ctx;
this._img = canvas;
this._cropScaleX = 1;
this._cropScaleY = 1;
}
clear(){
this._ctx.fillStyle = "#000000";
this._ctx.fillRect(0, 0, this._width, this._height);
}
applyTexture(texture){
this._img        = texture.canvasImg;
this._cropScaleX = texture.canvasCropScaleX;
this._cropScaleY = texture.canvasCropScaleY;
}
drawTexture(x, y, w, h, cx, cy, cw, ch){
cx *= this._cropScaleX;
cy *= this._cropScaleY;
cw *= this._cropScaleX;
ch *= this._cropScaleY;
this._ctx.drawImage(this._img, cx, cy, cw, ch, x, y, w, h);
}
destroy(){
this._ctx.clearRect(0, 0, this._width, this._height);
}
_onResize(){
this._ctx.imageSmoothingEnabled = false;
}
onPreDraw(){
this.clear();
}
get ctx(){ return this._ctx; }
}
const canvas = {
CanvasRenderer: CanvasRenderer
};
var mainFrag = "precision mediump float;uniform sampler2D uTex[%MAX_TEXTURES%];varying float vTexID;varying vec2 vUV;varying vec4 vTint;void main(){vec4 texel;%GET_TEXEL%gl_FragColor=vTint*texel;}";
var mainVert = "precision mediump float;uniform mat4 uMVP;attribute vec2 aPos;attribute float aTexID;attribute vec2 aUV;attribute vec4 aTint;varying float vTexID;varying vec2 vUV;varying vec4 vTint;void main(){gl_Position=uMVP*vec4(aPos,1.0,1.0);vTexID=aTexID;vUV=aUV;vTint=aTint;}";
const shaderSrc = {
mainFrag: mainFrag,
mainVert: mainVert
};
function createShader(gl, type, src){
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
const shader = gl.createShader(type);
if(!shader){
console.error(`Failed to create a ${name} shader!`);
gl.deleteShader(shader);
return null;
}
gl.shaderSource(shader, src);
gl.compileShader(shader);
if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
const log = gl.getShaderInfoLog(shader);
console.error(`Failed to compile a ${name} shader:\n${log}`);
gl.deleteShader(shader);
return null;
}
return shader;
}
function parseShader(src, max, out, array, id, uv){
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
const util$1 = {
createShader: createShader,
parseShader:  parseShader
};
class OrthoMatrix {
constructor(){
this.x = 0;
this.y = 0;
this.w = 1;
this.h = 1;
}
clone(){
return new OrthoMatrix().copy(this);
}
copy(mat){
this.x = mat.x;
this.y = mat.y;
this.w = mat.w;
this.h = mat.h;
return this;
}
identity(){
this.x = this.y = 0;
this.w = this.h = 1;
return this;
}
translate(x, y){
this.x += x;
this.y += y;
return this;
}
scale(x, y){
this.w *= x;
this.h *= y;
return this;
}
multiply(mat){
this.x  = mat.x * this.w + this.x;
this.y  = mat.y * this.h + this.y;
this.w *= mat.w;
this.h *= mat.h;
return this;
}
}
class MVPMatrix {
constructor(program, uniform){
this._program = program;
this._uniform = uniform;
this._dirty = false;
this._matP = new OrthoMatrix();
this._value = new Float32Array([
1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
]);
}
projection(width, height){
this._matP.x = -1;
this._matP.y = 1;
this._matP.w = 2 / width;
this._matP.h = -2 / height;
this._dirty  = true;
}
update(){
if(this._dirty){
this._value[0]  = this._matP.w;
this._value[5]  = this._matP.h;
this._value[12] = this._matP.x;
this._value[13] = this._matP.y;
this._program.setUm4fv(this._uniform, false, this._value);
this._dirty = false;
}
}
}
class Program {
constructor(gl, vertKey, fragKey, max, out, array, id, uv){
this._gl = gl;
this._uniforms = {};
this._attribs = {};
this._program = gl.createProgram();
const vert = createShader(gl, gl.VERTEX_SHADER, shaderSrc[vertKey]);
const frag = createShader(gl, gl.FRAGMENT_SHADER, parseShader(
shaderSrc[fragKey], max, out, array, id, uv
));
if(!vert || !frag){
gl.deleteShader(vert);
gl.deleteShader(frag);
return;
}
gl.attachShader(this._program, vert);
gl.attachShader(this._program, frag);
gl.linkProgram(this._program);
gl.detachShader(this._program, vert);
gl.detachShader(this._program, frag);
gl.deleteShader(vert);
gl.deleteShader(frag);
if(!gl.getProgramParameter(this._program, gl.LINK_STATUS)){
const log = gl.getProgramInfoLog(this._program);
console.error(`Failed to link a program:\n${log}`);
return;
}
const uniformCount = gl.getProgramParameter(
this._program, gl.ACTIVE_UNIFORMS
);
const attribCount = gl.getProgramParameter(
this._program, gl.ACTIVE_ATTRIBUTES
);
let info;
for(let i = 0; i < uniformCount; i++){
info = gl.getActiveUniform(this._program, i);
const name = info.name.replace(/(\[[0-9]*\])+/g, "");
this._uniforms[name] = gl.getUniformLocation(this._program, info.name);
}
for(let i = 0; i < attribCount; i++){
info = gl.getActiveAttrib(this._program, i);
const name = info.name.replace(/(\[[0-9]*\])+/g, "");
this._attribs[name] = gl.getAttribLocation(this._program, info.name);
}
}
use(){
this._gl.useProgram(this._program);
}
unuse(){
this._gl.useProgram(null);
}
destroy(){
this.use();
for(let name in this._attribs){
this._gl.disableVertexAttribArray(this._attribs[name]);
}
this.unuse();
this._gl.deleteProgram(this._program);
}
setU1i(name, x){
this._gl.uniform1i(this._uniforms[name], x);
}
setU1iv(name, v){
this._gl.uniform1iv(this._uniforms[name], v);
}
setU2i(name, x, y){
this._gl.uniform2i(this._uniforms[name], x, y);
}
setU2iv(name, v){
this._gl.uniform2iv(this._uniforms[name], v);
}
setU3i(name, x, y, z){
this._gl.uniform3i(this._uniforms[name], x, y, z);
}
setU3iv(name, v){
this._gl.uniform3iv(this._uniforms[name], v);
}
setU4i(name, x, y, z, w){
this._gl.uniform4i(this._uniforms[name], x, y, z, w);
}
setU4iv(name, v){
this._gl.uniform4iv(this._uniforms[name], v);
}
setU1f(name, x){
this._gl.uniform1f(this._uniforms[name], x);
}
setU1fv(name, v){
this._gl.uniform1fv(this._uniforms[name], v);
}
setU2f(name, x, y){
this._gl.uniform2f(this._uniforms[name], x, y);
}
setU2fv(name, v){
this._gl.uniform2fv(this._uniforms[name], v);
}
setU3f(name, x, y, z){
this._gl.uniform3f(this._uniforms[name], x, y, z);
}
setU3fv(name, v){
this._gl.uniform3fv(this._uniforms[name], v);
}
setU4f(name, x, y, z, w){
this._gl.uniform4f(this._uniforms[name], x, y, z, w);
}
setU4fv(name, v){
this._gl.uniform4fv(this._uniforms[name], v);
}
setUm2fv(name, transpose, value){
this._gl.uniformMatrix2fv(this._uniforms[name], transpose, value);
}
setUm2fvID(name){
this.setUm2fv(name, false, new Float32Array([
1, 0,
0, 1
]));
}
setUm3fv(name, transpose, value){
this._gl.uniformMatrix3fv(this._uniforms[name], transpose, value);
}
setUm3fvID(name){
this.setUm3fv(name, false, new Float32Array([
1, 0, 0,
0, 1, 0,
0, 0, 1
]));
}
setUm4fv(name, transpose, value){
this._gl.uniformMatrix4fv(this._uniforms[name], transpose, value);
}
setUm4fvID(name){
this.setUm4fv(name, false, new Float32Array([
1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
]));
}
setAp(name, size, type, normalized, stride, offset){
const index = this._attribs[name];
this._gl.enableVertexAttribArray(index);
this._gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
}
setAp1f(name, stride, offset){
this.setAp(name, 1, this._gl.FLOAT, false, stride, offset);
}
setAp2f(name, stride, offset){
this.setAp(name, 2, this._gl.FLOAT, false, stride, offset);
}
setAp3f(name, stride, offset){
this.setAp(name, 3, this._gl.FLOAT, false, stride, offset);
}
setAp4f(name, stride, offset){
this.setAp(name, 4, this._gl.FLOAT, false, stride, offset);
}
setAp1ub(name, normalized, stride, offset){
this.setAp(name, 1, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
}
setAp2ub(name, normalized, stride, offset){
this.setAp(name, 2, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
}
setAp3ub(name, normalized, stride, offset){
this.setAp(name, 3, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
}
setAp4ub(name, normalized, stride, offset){
this.setAp(name, 4, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
}
}
class TextureCache {
constructor(game, gl, buffer, maxTextures){
this._factory = game.texture.factory;
this._gl = gl;
this._buffer = buffer;
this._MAX_TEXTURES = maxTextures;
this._pointer = 0;
this._tempTextures = [];
this._boundTextures = [];
this.id = 0;
this.width = 1;
this.height = 1;
for(let i = 0; i < this._MAX_TEXTURES; i++){
this._tempTextures.push(this._factory.glCreatePixel(gl, 0, 0, 0, 0));
const tempTexture = this._tempTextures[i];
gl.activeTexture(gl.TEXTURE0 + i);
gl.bindTexture(gl.TEXTURE_2D, tempTexture.glTex);
this._factory.glReturnUnit = tempTexture.glUnit = i;
this._factory.glReturnTex  = tempTexture.glTex;
this._boundTextures.push(tempTexture);
tempTexture.glBound = true;
}
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, this._boundTextures[0].glTex);
this._factory.glReturnUnit = 0;
this._factory.glReturnTex  = this._boundTextures[0].glTex;
}
applyTexture(texture){
if(texture.glBound){
this.id     = texture.glUnit;
this.width  = texture.width;
this.height = texture.height;
return;
}
if(this._pointer >= this._MAX_TEXTURES){
this.flush();
}
this._gl.activeTexture(this._gl.TEXTURE0 + this._pointer);
this._gl.bindTexture(this._gl.TEXTURE_2D, texture.glTex);
this._factory.glReturnUnit         = texture.glUnit = this._pointer;
this._factory.glReturnTex          = texture.glTex;
this._boundTextures[this._pointer] = texture;
texture.glBound = true;
this._pointer++;
}
flush(){
this._buffer.flush();
for(let i = 0; i < this._MAX_TEXTURES; i++){
this._boundTextures[i].glBound = false;
}
this._pointer = 0;
}
destroy(){
for(let i = 0; i < this._MAX_TEXTURES; i++){
this._factory.destroyTexture(this._gl, this._tempTextures[i]);
}
this._tempTextures  = [];
this._boundTextures = [];
}
}
class VertBuffer {
constructor(
gl, program, mvp, maxVerts, posAttrib, idAttrib, uvAttrib, tintAttrib
){
this._gl = gl;
this._program = program;
this._mvp = mvp;
this._MAX_VERTS = maxVerts;
this._COMPONENTS_PER_VERT = 6;
this._BYTES_PER_VERT = this._COMPONENTS_PER_VERT * 4;
this._offset = 0;
const maxBytes = maxVerts * this._BYTES_PER_VERT;
this._vertData = new ArrayBuffer(maxBytes);
this._vertF32 = new Float32Array(this._vertData);
this._vertU32 = new Uint32Array(this._vertData);
this._vertU8 = new Uint8Array(this._vertData);
this._buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
gl.bufferData(gl.ARRAY_BUFFER, maxBytes, gl.STREAM_DRAW);
this._program.setAp2f(posAttrib, this._BYTES_PER_VERT, 0);
this._program.setAp1f(idAttrib, this._BYTES_PER_VERT, 8);
this._program.setAp2f(uvAttrib, this._BYTES_PER_VERT, 12);
this._program.setAp4ub(tintAttrib, true, this._BYTES_PER_VERT, 20);
}
pushVert(x, y, id, u, v, tint){
let component = this._offset * this._COMPONENTS_PER_VERT;
const f32 = this._vertF32;
const u32 = this._vertU32;
f32[component++] = x;
f32[component++] = y;
f32[component++] = id;
f32[component++] = u;
f32[component++] = v;
u32[component++] = tint;
this._offset++;
}
pushQuad(l, t, r, b, id, cl, ct, cr, cb, tint){
if(this._offset + 6 > this._MAX_VERTS){
this.flush();
}
this.pushVert(l, t, id, cl, ct, tint);
this.pushVert(l, b, id, cl, cb, tint);
this.pushVert(r, t, id, cr, ct, tint);
this.pushVert(r, t, id, cr, ct, tint);
this.pushVert(l, b, id, cl, cb, tint);
this.pushVert(r, b, id, cr, cb, tint);
}
flush(){
this._mvp.update();
this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, this._vertU8.subarray(
0, this._offset * this._BYTES_PER_VERT
));
this._gl.drawArrays(this._gl.TRIANGLES, 0, this._offset);
this._offset = 0;
}
destroy(){
this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
this._gl.deleteBuffer(this._buffer);
}
}
class WebGLRenderer extends Renderer {
constructor(game, canvas, gl, maxTextures, maxVerts){
super(CONST.WEBGL, canvas);
this._gl = gl;
gl.disable(gl.CULL_FACE);
gl.disable(gl.DEPTH_TEST);
gl.disable(gl.DITHER);
gl.disable(gl.POLYGON_OFFSET_FILL);
gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
gl.disable(gl.SAMPLE_COVERAGE);
gl.disable(gl.SCISSOR_TEST);
gl.disable(gl.STENCIL_TEST);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.clearColor(0, 0, 0, 1);
maxTextures = clamp(
gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), 1, maxTextures
);
const textureIndicies = new Int32Array(maxTextures);
for(let i = 0; i < maxTextures; i++){
textureIndicies[i] = i;
}
this._program = new Program(
gl, "mainVert", "mainFrag", maxTextures, "texel", "uTex", "vTexID", "vUV"
);
this._program.use();
this._program.setU1iv("uTex", textureIndicies);
this._program.setUm4fvID("uMVP");
this._mvp = new MVPMatrix(this._program, "uMVP");
this._vertBuffer = new VertBuffer(
gl, this._program, this._mvp, maxVerts, "aPos", "aTexID", "aUV", "aTint"
);
this._textureCache = new TextureCache(
game, gl, this._vertBuffer, maxTextures
);
}
clear(){
this._gl.clear(this._gl.COLOR_BUFFER_BIT);
}
applyTexture(texture){
this._textureCache.applyTexture(texture);
}
drawTexture(x, y, w, h, cx, cy, cw, ch){
const cache = this._textureCache;
w  += x;
h  += y;
cw  = (cw + cx) / cache.width;
ch  = (ch + cy) / cache.height;
cx /= cache.width;
cy /= cache.height;
this._vertBuffer.pushQuad(x, y, w, h, cache.id, cx, cy, cw, ch, 0xFFFFFFFF);
}
destroy(){
this._textureCache.destroy();
this._vertBuffer.destroy();
this._program.destroy();
this._gl.clearColor(0, 0, 0, 0);
this._gl.clear(this._gl.COLOR_BUFFER_BIT);
this._gl.flush();
}
_onResize(){
this._gl.viewport(0, 0, this._width, this._height);
this._mvp.projection(this._width, this._height);
}
onPreDraw(){
this.clear();
}
onPostDraw(){
this._vertBuffer.flush();
}
get gl(){ return this._gl; }
}
const webgl = {
shaderSrc:     shaderSrc,
util:          util$1,
MVPMatrix:     MVPMatrix,
Program:       Program,
TextureCache:  TextureCache,
VertBuffer:    VertBuffer,
WebGLRenderer: WebGLRenderer
};
class GfxManager {
constructor(game, config){
this._game = game;
this._config = config;
this._canvasGenerated = false;
this._canvasMemento = new ElemMemento();
this.canvas;
this.renderer;
}
_initCanvas(canvas){
if(this._canvasGenerated){
canvas.classList.add("sol-generated");
}else {
this._canvasMemento.save(canvas);
}
canvas.innerHTML = null;
canvas.removeAttribute("title");
canvas.classList.add("sol", "sol-canvas");
canvas.style.setProperty("background", "#000");
canvas.style.setProperty("opacity", "1.0");
canvas.style.setProperty("visibility", "visibile");
}
_createRenderer(canvas){
if(this._config.renderer == CONST.NONE){
return new Renderer(CONST.NONE, canvas);
}
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
let context = null;
for(let id of contextIDs){
context = canvas.getContext(id);
if(context){
break;
}
}
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
if(
typeof CanvasRenderingContext2D != "undefined" &&
context instanceof CanvasRenderingContext2D
){
return new CanvasRenderer(canvas, context);
}
return new Renderer(CONST.NONE, canvas);
}
onStart(){
this.canvas = this._getCanvas(this._config.canvas);
this._initCanvas(this.canvas);
this.renderer = this._createRenderer(this.canvas);
this.renderer.resize(this._config.width, this._config.height);
}
onPreDraw(){
this.renderer.onPreDraw();
}
onPostDraw(){
this.renderer.onPostDraw();
}
onStop(){
this.renderer.destroy();
if(this._canvasGenerated){
this.canvas.parentNode.removeChild(this.canvas);
}else {
this._canvasMemento.restore(this.canvas).clear();
}
}
_getCanvas(query){
let parent = document.body;
this._canvasGenerated = false;
if(query instanceof HTMLCanvasElement){
return query;
}else if(query instanceof HTMLElement){
parent = query;
}else {
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
const canvas = document.createElement("canvas");
parent.appendChild(canvas);
this._canvasGenerated = true;
return canvas;
}
}
const gfx = {
canvas:           canvas,
webgl:            webgl,
GfxManager:       GfxManager,
GfxManagerConfig: GfxManagerConfig,
Renderer:         Renderer
};
class JsonFile extends Asset {
constructor(){
super();
this.data = {};
}
}
class JsonManager {
constructor(){
this._json = {};
}
has(key){
return key in this._json;
}
create(src){
const jsonFile = new JsonFile();
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
if(xhr.readyState == XMLHttpRequest.DONE){
xhr.onreadystatechange = noop;
if(xhr.status >= 200 && xhr.status <= 299){
try{
jsonFile.data = JSON.parse(xhr.responseText);
}catch(e){
console.warn(`Failed to parse ${src}: ${e}`);
jsonFile.missing = true;
}
}else {
console.warn(
`Missing JSON: ${src}\nHTTP ${xhr.status}: ${xhr.statusText}`
);
jsonFile.missing = true;
}
jsonFile.loaded = true;
}
};
xhr.open("GET", src);
xhr.send(null);
return jsonFile;
}
load(key, src){
this.unload(key);
this._json[key] = this.create(src);
return this._json[key];
}
unload(key){
if(!this.has(key)){
return false;
}
const jsonFile = this._json[key];
jsonFile.loaded  = false;
jsonFile.missing = false;
jsonFile.data    = {};
delete this._json[key];
return true;
}
unloadAll(){
for(let key in this._json){
this.unload(key);
}
}
onStop(){
this.unloadAll();
}
get(key){
return this.has(key) ? this._json[key] : null;
}
getData(key){
return this.has(key) ? this._json[key].data : {};
}
}
const json = {
JsonFile:    JsonFile,
JsonManager: JsonManager
};
class KeyManager {
constructor(config){
this._enabled = config.enabled;
this._keys = {};
this._keysNow = {};
this._keysLast = {};
this._keydownHandler = new EventHandler(document, "keydown",
event => this._onKeydown(event), {
once: false,
passive: true
}
);
this._keyupHandler = new EventHandler(document, "keyup",
event => this._onKeyup(event), {
once: false,
passive: true
}
);
}
down(code){
return !!this._keysNow[code] && !this._keysLast[code];
}
held(code){
return !!this._keysNow[code];
}
up(code){
return !this._keysNow[code] && !!this._keysLast[code];
}
_onKeydown(event){
this._keys[event.code] = true;
}
_onKeyup(event){
this._keys[event.code] = false;
}
onStart(){
if(this._enabled){
this._keydownHandler.start();
this._keyupHandler.start();
}
}
onPreTick(){
Object.assign(this._keysLast, this._keysNow);
Object.assign(this._keysNow, this._keys);
}
onStop(){
this._keydownHandler.stop();
this._keyupHandler.stop();
for(let code in this._keys){
this._keysLast[code] = this._keysNow[code] = this._keys[code] = false;
}
}
}
const key = {
KeyManager:       KeyManager,
KeyManagerConfig: KeyManagerConfig
};
const math = {
clamp:       clamp,
OrthoMatrix: OrthoMatrix
};
class Scene {
onCreate(game){ }
onEnter(game){ }
onTick(game){ }
onDraw(game){ }
onExit(game){ }
onDestroy(game){ }
}
class SceneManager {
constructor(game, config){
this._game = game;
this._config = config;
this._KEY_DEFAULT = "__sol_default__";
this._keyActive = this._KEY_DEFAULT;
this._keyNext = this._KEY_DEFAULT;
this._changing = false;
this._scenes = {};
this._scenes[this._KEY_DEFAULT] = new Scene();
}
has(key){
return key != this._KEY_DEFAULT && key in this._scenes;
}
create(key, scene){
if(key == this._KEY_DEFAULT){
return false;
}
this.destroy(key);
this._scenes[key] = new scene();
this._scenes[key].onCreate(this._game);
return true;
}
change(key){
if(!this.has(key)){
return false;
}
this._keyNext  = key;
this._changing = true;
return true;
}
reload(){
return this.change(this._keyActive);
}
destroy(key){
if(!this.has(key)){
return false;
}
this._scenes[key].onDestroy(this._game);
if(key == this._keyActive || (this._changing && key == this._keyNext)){
this._keyActive = this._KEY_DEFAULT;
this._keyNext   = this._KEY_DEFAULT;
this._changing  = false;
}
delete this._scenes[key];
return true;
}
onStart(){
for(let key in this._config.scenes){
this.create(key, this._config.scenes[key]);
}
this.change(this._config.main);
}
onTick(){
if(this._changing){
this._scenes[this._keyActive].onExit(this._game);
this._keyActive = this._keyNext;
this._changing  = false;
this._scenes[this._keyActive].onEnter(this._game);
}
this._scenes[this._keyActive].onTick(this._game);
}
onDraw(){
this._scenes[this._keyActive].onDraw(this._game);
}
onStop(){
for(let key in this._scenes){
this.destroy(key);
}
}
get(key){
return this.has(key) ? this._scenes[key] : null;
}
get key(){ return this._keyActive; }
get changing(){ return this._changing; }
get active(){ return this._scenes[this._keyActive]; }
get keys(){
const keys = [];
for(let key in this._scenes){
if(this.has(key)){
keys.push(key);
}
}
return keys;
}
}
const scene = {
SceneManager:       SceneManager,
SceneManagerConfig: SceneManagerConfig
};
const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX/AP8AAACfphTyAAAADklEQVQIHWMIZVjFgIQBHpwD/fruyDEAAAAASUVORK5CYII=";
const imgSrc = {
missing: img
};
class Texture extends Asset {
constructor(){
super();
this.width = 1;
this.height = 1;
this.glTex = null;
this.glBound = false;
this.glUnit = 0;
this.canvasImg = null;
this.canvasCropScaleX = 1;
this.canvasCropScaleY = 1;
}
}
class TextureFactory {
constructor(){
this.glReturnTex = null;
this.glReturnUnit = 0;
}
createTexture(gl, src, width, height){
const texture = new Texture();
const img = new Image();
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
bitmap => {
this.canvasCloseTexture(texture, bitmap);
},
reason => {
console.warn(`Failed to create a bitmap for ${src}:\n${reason}`);
this.canvasCloseTexture(texture, img);
}
);
}else {
this.canvasCloseTexture(texture, img);
}
};
img.onerror = () => {
img.onerror = noop;
console.warn(`Missing texture: ${src}`);
texture.missing = true;
img.src         = imgSrc.missing;
};
img.src = src;
return texture;
}
destroyTexture(gl, texture){
texture.loaded  = false;
texture.missing = false;
if(gl){
gl.activeTexture(gl.TEXTURE0 + texture.glUnit);
gl.bindTexture(gl.TEXTURE_2D, null);
gl.deleteTexture(texture.glTex);
if(this.glReturnTex == texture.glTex){
this.glReturnTex = null;
}else {
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
glOpenTexture(gl, texture){
texture.glTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture.glTex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}
glCloseTexture(gl, texture){
gl.bindTexture(gl.TEXTURE_2D, this.glReturnTex);
gl.flush();
texture.loaded = true;
}
glCreatePixel(gl, r, g, b, a){
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
canvasCloseTexture(texture, img){
texture.canvasImg       = img;
texture.canvasCropScaleX = img.width  / texture.width;
texture.canvasCropScaleY = img.height / texture.height;
texture.loaded           = true;
}
}
class TextureManager {
constructor(game){
this._game = game;
this._renderer;
this._gl = null;
this._textures = {};
this.factory = new TextureFactory();
}
has(key){
return key in this._textures;
}
create(src, width = 0, height = 0){
return this.factory.createTexture(this._gl, src, width, height);
}
draw(
key, x = 0, y = 0, w = null, h = null, cx = 0, cy = 0, cw = null, ch = null
){
const texture = this._textures[key];
if(w  == null) w  = texture.width;
if(h  == null) h  = texture.height;
if(cw == null) cw = texture.width - cx;
if(ch == null) ch = texture.height - cy;
this._renderer.applyTexture(texture);
this._renderer.drawTexture(x, y, w, h, cx, cy, cw, ch);
}
load(key, src, width = 0, height = 0){
this.unload(key);
this._textures[key] = this.create(src, width, height);
return this._textures[key];
}
unload(key){
if(!this.has(key)){
return false;
}
this.factory.destroyTexture(this._gl, this._textures[key]);
delete this._textures[key];
return true;
}
unloadAll(){
for(let key in this._textures){
this.unload(key);
}
}
onStart(){
this._renderer = this._game.gfx.renderer;
this._gl       = this._renderer.gl;
}
onStop(){
this.unloadAll();
}
get(key){
return this.has(key) ? this._textures[key] : null;
}
}
const texture = {
imgSrc:         imgSrc,
Texture:        Texture,
TextureFactory: TextureFactory,
TextureManager: TextureManager
};
class TimeManager {
constructor(){
this._MIN_DELTA = 0.00001;
this._MAX_DELTA = 1;
this._delta = 1;
this._fps = 1;
}
onPreTick(delta){
this._delta = clamp(delta, this._MIN_DELTA, this._MAX_DELTA);
this._fps   = 1 / delta;
}
get delta(){ return this._delta; }
get fps(){ return this._fps; }
}
const time = {
TimeManager: TimeManager
};
function shallowExtend(target, src){
for(let key in src){
if(
src.hasOwnProperty(key) &&
typeof src[key] != "object" && typeof src[key] != "function"
){
target[key] = src[key];
}
}
}
const object = {
shallowExtend: shallowExtend,
getDefault:    getDefault
};
const util$2 = {
object: object,
noop:   noop
};
class Game {
constructor(options = {}){
const config = new Config(options);
this._loop = new Loop(this);
this.gfx = new GfxManager(this, config.gfx);
this.json = new JsonManager();
this.key = new KeyManager(config.key);
this.scene = new SceneManager(this, config.scene);
this.texture = new TextureManager(this);
this.time = new TimeManager();
this.loader = new Loader(this);
if(config.autoStart){
this.start();
}
}
start(){
return this._loop.start();
}
restart(){
return this._loop.restart();
}
stop(){
return this._loop.stop();
}
get running(){ return this._loop.running; }
get delta(){ return this.time.delta; }
get fps(){ return this.time.fps; }
}
const Sol = {
asset:   asset,
core:    core,
dom:     dom,
gfx:     gfx,
json:    json,
key:     key,
math:    math,
scene:   scene,
texture: texture,
time:    time,
util:    util$2,
Game:    Game,
Scene:   Scene
};
shallowExtend(Sol, CONST);
return Sol;
}());
