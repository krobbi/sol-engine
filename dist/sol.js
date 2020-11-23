/**
* @name Sol
* @description Lightweight JavaScript game engine.
* @version 0.2.0
* @license {@link https://krobbi.github.io/license/mit-2020.txt|MIT License}
* @author Chris Roberts (Krobbizoid)
* @copyright 2020 Chris Roberts
*/
var Sol = (function () {
'use strict';
/**
* Asset base.
* @abstract
* @class Asset
* @memberof Sol.asset
* @classdesc Stores the interface for assets. A resource with a loaded flag and
* a missing flag. Used for storing data for resources that need to be loaded
* asynchronously. The loaded and missing flags are accessed through getters and
* setters so that they can be made to rely on the state of sub-assets. Assets
* should not include methods and instead have public properties that are set
* directly by some external manager. This reduces the memory footprint of assets
* and allows the data of a single type of asset to be populated in many ways.
*/
class Asset {
/**
* Create the asset base.
*/
constructor(){
/**
* Whether the asset is loaded.
* @protected
* @type {boolean}
*/
this._loaded = false;
/**
* Whether the asset is missing.
* @protected
* @type {boolean}
*/
this._missing = false;
}
/**
* Whether the asset is loaded.
* @virtual
* @param {boolean} value
*/
set loaded(value){ this._loaded = value; }
/**
* Whether the asset is missing.
* @virtual
* @param {boolean} value
*/
set missing(value){ this._missing = value; }
/**
* Whether the asset is loaded.
* @virtual
* @returns {boolean}
*/
get loaded(){ return this._loaded; }
/**
* Whether the asset is missing.
* @virtual
* @returns {boolean}
*/
get missing(){ return this._missing; }
}
/**
* Get a value from an object by its key and return a default value if the key
* does not exist in the object.
* @function getDefault
* @memberof Sol.util.object
* @param {Object<string, any>} src - The source object to get the value from.
* @param {string} key - The key of the value to get from the source object.
* @param {any} defaultValue - The default value to return if the key does not
* exist in the source object.
* @returns {any} The value of the key in the source object, or the default value
* if the key does not exist in the source object.
*/
function getDefault(src, key, defaultValue){
return src.hasOwnProperty(key) ? src[key] : defaultValue;
}
/**
* Asset loader.
* @class Loader
* @memberof Sol.asset
* @classdesc Keeps track of the loaded state of lists of assets.
*/
class Loader {
/**
* Create the asset loader.
* @param {Sol.Game} game - The game instance that this asset loader belongs
* to.
*/
constructor(game){
/**
* The game instance that this asset loader belongs to.
* @private
* @type {Sol.Game}
*/
this._game = game;
/**
* A dictionary of asset list keys and asset lists.
* @private
* @type {Object<string, Sol.asset.Asset[]>}
*/
this._assets = {};
}
/**
* Create an asset list if it does not exist and return the asset list.
* @private
* @param {string} listKey - The key of the asset list to allocate.
* @returns {Sol.asset.Asset[]} The allocated asset list.
*/
_allocate(listKey){
if(!(listKey in this._assets)){
this._assets[listKey] = [];
}
return this._assets[listKey];
}
/**
* Load loader data.
* @param {string} listKey - The key of the asset list to load the loader data
* in.
* @param {Object<string, any>} data - The loader data to load.
*/
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
/**
* Load a JSON file.
* @param {string} listKey - The key of the asset list to load the JSON file
* in.
* @param {string} key - The key to give the JSON file.
* @param {string} src - The source of the JSON file.
*/
loadJsonFile(listKey, key, src){
const list = this._allocate(listKey);
list.push(this._game.json.load(key, src));
}
/**
* Load a texture.
* @param {string} listKey - The key of the asset list to load the texture in.
* @param {string} key - The key to give the texture.
* @param {string} src - The source of the texture image.
* @param {number=} width - The expected width of the texture. Use 0 for the
* width of the texture image.
* @param {number=} height - The expected height of the texture. Use 0 for the
* height of the texture image.
*/
loadTexture(listKey, key, src, width = 0, height = 0){
const list = this._allocate(listKey);
list.push(this._game.texture.load(key, src, width, height));
}
/**
* Get the loading progress of an asset list.
* @param {string} listKey - The key of the asset list to get the loading
* progress of.
* @returns {number} The loading progress of the asset list between 0 and 1.
*/
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
/**
* Get the loading completion status of an asset list.
* @param {string} listKey - The key of the asset list to get the loading
* completion status of.
* @returns {boolean} The loading completion status of the asset list.
*/
complete(listKey){
return this.progress(listKey) >= 1;
}
/**
* Runs when the game stops. Clears all asset lists.
*/
onStop(){
for(let key in this._assets){
this._assets[key] = [];
}
}
}
/**
* Stores classes for assets.
* @namespace Sol.asset
* @memberof Sol
* @type {Object<string, function>}
*/
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
* @default "https://krobbi.github.io/license/mit-2020.txt"
*/
LICENSE_URL: "https://krobbi.github.io/license/mit-2020.txt",
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
/**
* Display a splash message for a game instance. in the console.
* @function consoleSplash
* @memberof Sol.core.util
* @param {Sol.Game} game - The game instance to create the splash message for.
*/
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
/**
* Get whether Sol is compatible with the user's environment.
* @function getCompatible
* @memberof Sol.core.util
* @returns {boolean} Whether Sol is compatible with the user's environment.
*/
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
/**
* Stores utilities for creating and running a game.
* @namespace Sol.core.util
* @memberof Sol.core
* @type {Object<string, function>}
*/
const util = {
consoleSplash: consoleSplash,
getCompatible: getCompatible
};
/**
* Limit a value between a minimum and maximum boundary.
* @function clamp
* @memberof Sol.math
* @param {number} value - The value to clamp.
* @param {number} min - The minimum boundary to clamp the value to.
* @param {number} max - The maximum boundary to clamp the value to.
* @returns {number} The value clamped to the minimum and maximum boundary.
*/
function clamp(value, min, max){
return Math.min(max, Math.max(min, value));
}
/**
* Graphics manager configuration.
* @class GfxManagerConfig
* @memberof Sol.gfx
* @classdesc Stores configuration for a graphics manager.
*/
class GfxManagerConfig {
/**
* Create the graphics manager configuration.
* @param {Object<string, any>=} options - An options object to merge into the
* graphics manager configuration.
*/
constructor(options = {}){
/**
* A canvas to use, the parent element of a canvas to use, or a CSS query to
* find a canvas or canvas parent with.
* @type {string|HTMLElement}
* @default ".sol-canvas-parent"
*/
this.canvas = getDefault(options, "canvas", ".sol-canvas-parent");
/**
* The preferred renderer to use.
* @type {number}
* @default Sol.WEBGL
*/
this.renderer = getDefault(options, "renderer", CONST.WEBGL);
/**
* The width of the resolution.
* @type {number}
* @default 800
*/
this.width = getDefault(options, "width", 800);
/**
* The height of the resolution.
* @type {number}
* @default 600
*/
this.height = getDefault(options, "height", 600);
/**
* The absolute maximum number of textures allowed per draw call when using
* the WebGL renderer. Must be between 1 and 32. The actual maximum number of
* textures per draw call may be lower depending on the user's GPU. For best
* performance it is recommended to set this to the minimum number of
* textures needed per draw call without wasting draw calls. If you are
* unsure about this option it is recommended to leave it at its default
* setting.
* @type {number}
* @default 32
*/
this.glMaxTextures = clamp(getDefault(options, "glMaxTextures", 32), 1, 32);
/**
* The absolute maximum number of verticies allowed per draw call when using
* the WebGL renderer. Must be at least 6. Higher values will increse memory
* usage but may reduce the number of draw calls per frame.
* @type {number}
* @default 16384
*/
this.glMaxVerts = clamp(getDefault(options, "glMaxVerts", 16384), 6, 65536);
}
}
/**
* Keyboard input manager configuration.
* @class KeyManagerConfig
* @memberof Sol.key
* @classdesc Stores configuration for a keyboard input manager.
*/
class KeyManagerConfig {
/**
* Create the keyboard input manager configuration.
* @param {Object<string, any>=} options - An options object to merge into the
* keyboard input manager configuration.
*/
constructor(options = {}){
/**
* Whether to listen for keyboard input.
* @type {boolean}
* @default true
*/
this.enabled = !!getDefault(options, "enabled", true);
}
}
/**
* Scene manager configuration.
* @class SceneManagerConfig
* @memberof Sol.scene
* @classdesc Stores configuration for a scene manager.
*/
class SceneManagerConfig {
/**
* Create the scene manager configuration.
* @param {Object<string, any>=} options - An options object to merge into the
* scene manager configuration.
*/
constructor(options = {}){
/**
* The key of the scene to start the game on.
* @type {string}
* @default "main"
*/
this.main = getDefault(options, "main", "main");
/**
* A dictionary of scene keys and scene class names.
* @type {Object<string, function(new:Sol.Scene)>}
* @default {}
*/
this.scenes = getDefault(options, "scenes", {});
}
}
/**
* Game instance configuration.
* @class Config
* @memberof Sol.core
* @classdesc Stores configuration for a game instance.
*/
class Config {
/**
* Create the game instance configuration.
* @param {Object<string, any>=} options - An options object to merge into the
* game instance configuration.
*/
constructor(options = {}){
/**
* Whether to start the game once the game instance is created.
* @type {boolean}
* @default false
*/
this.autoStart = !!getDefault(options, "autoStart", false);
/**
* Stores configuration for the graphics manager.
* @type {Sol.gfx.GfxManagerConfig}
*/
this.gfx = new GfxManagerConfig(getDefault(options, "gfx", {}));
/**
* Stores configuration for the keyboard input manager.
* @type {Sol.key.KeyManagerConfig}
*/
this.key = new KeyManagerConfig(getDefault(options, "key", {}));
/**
* Stores configuration for the scene manager.
* @type {Sol.scene.SceneManagerConfig}
*/
this.scene = new SceneManagerConfig(getDefault(options, "scene", {}));
}
}
/**
* Game loop.
* @class Loop
* @memberof Sol.core
* @classdesc Runs a game loop and calls events in the managers of a game
* instance.
*/
class Loop {
/**
* Create the game loop.
* @param {Sol.Game} game - The game instance that this game loop belongs to.
*/
constructor(game){
/**
* The game instance that this game loop belongs to.
* @private
* @type {Sol.Game}
*/
this._game = game;
/**
* Whether the game loop is starting. The game loop should not start if it is
* already starting.
* @private
* @type {boolean}
*/
this._starting = false;
/**
* Whether the game loop is running. The game loop should not start if the
* game loop is running and not stopping.
* @private
* @type {boolean}
*/
this._running = false;
/**
* Whether the game loop should be stopped.
* @private
* @type {boolean}
*/
this._stopping = false;
/**
* The time at the start of the current game loop step in milliseconds.
* @private
* @type {number}
*/
this._timeNow = 0;
/**
* The time at the start of the previous game loop step in milliseconds.
* @private
* @type {number}
*/
this._timeLast = 0;
/**
* The time since the previous game loop step in seconds.
* @private
* @type {number}
*/
this._delta = 0;
}
/**
* Run one step of the game loop. Calculates delta time and continually
* requests new animation frames until the game loop is stopping.
* @private
*/
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
/**
* Start the game loop if it is not running.
* @returns {boolean} Whether the game loop was started successfully from a
* stopped state.
*/
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
/**
* Stop the game loop if it is running and start the game loop.
* @returns {boolean} Whether the game loop was restarted successfully.
*/
restart(){
this.stop();
return this.start();
}
/**
* Stop the game loop if it is running.
* @returns {boolean} Whether the game loop was stopped from a running state.
*/
stop(){
if(this._running && !this._stopping){
this._stopping = true;
return true;
}
return false;
}
/**
* Runs when the game loop starts.
* @private
*/
_onStart(){
this._game.gfx.onStart();
consoleSplash(this._game);
this._game.texture.onStart();
this._game.key.onStart();
this._game.scene.onStart();
}
/**
* Runs on every step of the game loop.
* @private
*/
_onUpdate(){
this._game.time.onPreTick(this._delta);
this._game.key.onPreTick();
this._game.scene.onTick();
this._game.gfx.onPreDraw();
this._game.scene.onDraw();
this._game.gfx.onPostDraw();
}
/**
* Runs when the game loop stops.
* @private
*/
_onStop(){
this._game.scene.onStop();
this._game.key.onStop();
this._game.loader.onStop();
this._game.texture.onStop();
this._game.json.onStop();
this._game.gfx.onStop();
}
/**
* Whether the game loop is running.
* @readonly
* @returns {boolean}
*/
get running(){ return this._running; }
}
/**
* Stores utilities and classes for creating and running a game.
* @namespace Sol.core
* @memberof Sol
* @type {Object<string, function|Object<string, function>>}
*/
const core = {
util:   util,
Config: Config,
Loop:   Loop
};
/**
* DOM element memento.
* @class ElemMemento
* @memberof Sol.dom
* @classdesc Stores the state of an element.
*/
class ElemMemento {
/**
* Create the DOM element memento.
*/
constructor(){
/**
* The inner HTML of the saved element.
* @type {string}
*/
this.innerHTML = "";
/**
* The attributes of the saved element.
* @type {Object<string, string>}
*/
this.attributes = {};
}
/**
* Clear the element memento.
* @returns {Sol.dom.ElemMemento} The element memento after clearing.
*/
clear(){
this.innerHTML  = "";
this.attributes = {};
return this;
}
/**
* Save the state of an element to the element memento.
* @param {HTMLElement} elem - The element to save.
* @returns {Sol.dom.ElemMemento} The element memento after saving.
*/
save(elem){
this.innerHTML  = elem.innerHTML;
this.attributes = {};
for(let attribute of elem.attributes){
this.attributes[attribute.name] = attribute.value;
}
return this;
}
/**
* Restore the state of the element memento to an element.
* @param {HTMLElement} elem - The element to restore.
* @returns {Sol.dom.ElemMemento} The element memento after restoring.
*/
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
/**
* A no operation function.
* @function noop
* @memberof Sol.util
*/
function noop(){}
/**
* DOM event handler.
* @class EventHandler
* @memberof Sol.dom
* @classdesc Handles an event listener for a set of DOM events and event
* targets.
*/
class EventHandler {
/**
* Create the DOM event handler.
* @param {EventTarget|EventTarget[]} targets - An event target or array of
* event targets to listen for events on.
* @param {string|string[]} types - An event type or array of event types to
* listen for on the event targets.
* @param {EventListenerOrEventListenerObject} listener - The event listener to
* call when any of the event targets receive any of the event types.
* @param {boolean|EventListenerOptions} options - The options to give the
* event listener.
*/
constructor(targets, types, listener, options){
/**
* An array of event targets to listen for events on.
* @private
* @type {EventTarget[]}
*/
this._targets = Array.isArray(targets) ? targets : [targets];
/**
* An array of event types to listen for on the event targets.
* @private
* @type {string[]}
*/
this._types = Array.isArray(types) ? types : [types];
/**
* The event listener to call when any of the event targets recieve any of
* the event types.
* @private
* @type {EventListenerOrEventListenerObject}
*/
this._listener = listener;
/**
* The options to give the event listener.
* @private
* @type {boolean|EventListenerOptions}
*/
this._options = options;
/**
* Whether the event handler is active.
* @private
* @type {boolean}
*/
this._active = false;
}
/**
* Start the event handler.
* @returns {boolean} Whether the event handler was started from a stopped
* state.
*/
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
/**
* Stop the event handler.
* @returns {boolean} Whether the event handler was stopped from a running
* state.
*/
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
/**
* Destroy the event handler.
*/
destroy(){
this.stop();
this._targets  = [];
this._types    = [];
this._listener = noop;
this._options  = false;
}
/**
* Whether the event handler is active.
* @readonly
* @returns {boolean}
*/
get active(){ return this._active; }
}
/**
* Stores classes for the document.
* @namespace Sol.dom
* @memberof Sol
* @type {Object<string, function>}
*/
const dom = {
ElemMemento:  ElemMemento,
EventHandler: EventHandler
};
/**
* Renderer base.
* @virtual
* @class Renderer
* @memberof Sol.gfx
* @classdesc Stores the interface for renderers. Performs basic graphics
* operations.
*/
class Renderer {
/**
* Create the renderer base.
* @param {number} type - The type of the renderer.
* @param {HTMLCanvasElement} canvas - The canvas to use.
*/
constructor(type, canvas){
/**
* The type of the renderer.
* @protected
* @type {number}
*/
this._type = type;
/**
* The canvas to use.
* @protected
* @type {HTMLCanvasElement}
*/
this._canvas = canvas;
/**
* The width of the resolution.
* @protected
* @type {number}
*/
this._width = 2;
/**
* The height of the resolution.
* @protected
* @type {number}
*/
this._height = 2;
}
/**
* Resize the resolution.
* @virtual
* @param {number} width - The width of the resolution.
* @param {number} height - The height of the resolution.
*/
resize(width, height){
this._canvas.width  = this._width  = width;
this._canvas.height = this._height = height;
this._onResize();
}
/**
* Clear the screen.
* @virtual
*/
clear(){}
/**
* Apply a texture to subsequent drawing.
* @virtual
* @param {Sol.texture.Texture} texture - The texture to apply.
*/
applyTexture(texture){ }
/**
* Draw the applied texture.
* @virtual
* @param {number} x - The X coordinate of the top-left corner to draw the
* applied texture.
* @param {number} y - The Y coordinate of the top-left corner to draw the
* applied texture.
* @param {number} w - The width to draw the applied texture.
* @param {number} h - The height to draw the applied texture.
* @param {number} cx - The X coordinate of the top-left corner to crop from
* the applied texture.
* @param {number} cy - The Y coordinate of the top-left corner to crop from
* the applied texture.
* @param {number} cw - The width to crop from the applied texture.
* @param {number} ch - The height to crop from the applied texture.
*/
drawTexture(x, y, w, h, cx, cy, cw, ch){ }
/**
* Destroy the renderer.
* @virtual
*/
destroy(){}
/**
* Runs when the resolution is resized.
* @protected
*/
_onResize(){}
/**
* Runs before every frame.
* @virtual
*/
onPreDraw(){}
/**
* Runs after every frame.
* @virtual
*/
onPostDraw(){}
/**
* The type of the renderer.
* @virtual
* @readonly
* @returns {number}
*/
get type(){ return this._type; }
/**
* The width of the renderer.
* @virtual
* @readonly
* @returns {number}
*/
get width(){ return this._width; }
/**
* The height of the renderer.
* @virtual
* @readonly
* @returns {number}
*/
get height(){ return this._height; }
/**
* The WebGL rendering context to use.
* @virtual
* @readonly
* @returns {?WebGLRenderingContext|WebGL2RenderingContext}
*/
get gl(){ return null; }
/**
* The 2D rendering context to use.
* @virtual
* @readonly
* @returns {?CanvasRenderingContext2D}
*/
get ctx(){ return null; }
}
/**
* Canvas renderer.
* @class CanvasRenderer
* @extends Sol.gfx.Renderer
* @memberof Sol.gfx.canvas
* @classdesc Renders using the 2D rendering context.
*/
class CanvasRenderer extends Renderer {
/**
* Create the canvas renderer.
* @param {HTMLCanvasElement} canvas - The canvas to use.
* @param {CanvasRenderingContext2D} ctx - The 2D rendering context to use.
*/
constructor(canvas, ctx){
super(CONST.CANVAS, canvas);
/**
* The 2D rendering context to use.
* @private
* @type {CanvasRenderingContext2D}
*/
this._ctx = ctx;
/**
* The canvas image source of the applied texture.
* @private
* @type {CanvasImageSource}
*/
this._img = canvas;
/**
* The amount to multiply the cropping coordinates of the applied texture by
* in the X axis.
* @private
* @type {number}
*/
this._cropScaleX = 1;
/**
* The amount to multiply the cropping coordinates of the applied texture by
* in the Y axis.
* @private
* @type {number}
*/
this._cropScaleY = 1;
}
/**
* Clear the screen.
* @override
*/
clear(){
this._ctx.fillStyle = "#000000";
this._ctx.fillRect(0, 0, this._width, this._height);
}
/**
* Apply a texture to subsequent drawing.
* @override
* @param {Sol.texture.Texture} texture - The texture to apply.
*/
applyTexture(texture){
this._img        = texture.canvasImg;
this._cropScaleX = texture.canvasCropScaleX;
this._cropScaleY = texture.canvasCropScaleY;
}
/**
* Draw the applied texture.
* @override
* @param {number} x - The X coordinate of the top-left corner to draw the
* applied texture.
* @param {number} y - The Y coordinate of the top-left corner to draw the
* applied texture.
* @param {number} w - The width to draw the applied texture.
* @param {number} h - The height to draw the applied texture.
* @param {number} cx - The X coordinate of the top-left corner to crop from
* the applied texture.
* @param {number} cy - The Y coordinate of the top-left corner to crop from
* the applied texture.
* @param {number} cw - The width to crop from the applied texture.
* @param {number} ch - The height to crop from the applied texture.
*/
drawTexture(x, y, w, h, cx, cy, cw, ch){
cx *= this._cropScaleX;
cy *= this._cropScaleY;
cw *= this._cropScaleX;
ch *= this._cropScaleY;
this._ctx.drawImage(this._img, cx, cy, cw, ch, x, y, w, h);
}
/**
* Destroy the renderer.
* @override
*/
destroy(){
this._ctx.clearRect(0, 0, this._width, this._height);
}
/**
* Runs when the resolution is resized.
* @override
* @protected
*/
_onResize(){
this._ctx.imageSmoothingEnabled = false;
}
/**
* Runs before every frame.
* @override
*/
onPreDraw(){
this.clear();
}
/**
* The 2D rendering context to use.
* @override
* @readonly
* @returns {CanvasRenderingContext2D}
*/
get ctx(){ return this._ctx; }
}
/**
* Stores classes for the canvas renderer.
* @namespace Sol.gfx.canvas
* @memberof Sol.gfx
* @type {Object<string, function>}
*/
const canvas = {
CanvasRenderer: CanvasRenderer
};
var mainFrag = "precision mediump float;uniform sampler2D uTex[%MAX_TEXTURES%];varying float vTexID;varying vec2 vUV;varying vec4 vTint;void main(){vec4 texel;%GET_TEXEL%gl_FragColor=vTint*texel;}";
var mainVert = "precision mediump float;uniform mat4 uMVP;attribute vec2 aPos;attribute float aTexID;attribute vec2 aUV;attribute vec4 aTint;varying float vTexID;varying vec2 vUV;varying vec4 vTint;void main(){gl_Position=uMVP*vec4(aPos,1.0,1.0);vTexID=aTexID;vUV=aUV;vTint=aTint;}";
/**
* Stores the minified source code for WebGL shaders.
* @namespace Sol.gfx.webgl.shaderSrc
* @memberof Sol.gfx.webgl
* @type {Object<string, string>}
*/
const shaderSrc = {
mainFrag: mainFrag,
mainVert: mainVert
};
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
/**
* Stores utilities for the WebGL renderer.
* @namespace Sol.gfx.webgl.util
* @memberof Sol.gfx.webgl
* @type {Object<string, function>}
*/
const util$1 = {
createShader: createShader,
parseShader:  parseShader
};
/**
* Orthographic matrix.
* @class OrthoMatrix
* @memberof Sol.math
* @classdesc A representation of a basic 2D orthographic translation and
* scaling.
*/
class OrthoMatrix {
/**
* Create the orthographic matrix.
*/
constructor(){
/**
* The translation of the matrix in the X axis.
* @type {number}
* @default 0
*/
this.x = 0;
/**
* The translation of the matrix in the Y axis.
* @type {number}
* @default 0
*/
this.y = 0;
/**
* The scaling of the matrix in the X axis.
* @type {number}
* @default 1
*/
this.w = 1;
/**
* The scaling of the matrix in the Y axis.
* @type {number}
* @default 1
*/
this.h = 1;
}
/**
* Create a copy of the matrix by value.
* @returns {Sol.math.OrthoMatrix} A copy of the matrix by value.
*/
clone(){
return new OrthoMatrix().copy(this);
}
/**
* Copy the value of a matrix.
* @param {Sol.math.OrthoMatrix} mat - The matrix to copy.
* @returns {Sol.math.OrthoMatrix} The resultant matrix.
*/
copy(mat){
this.x = mat.x;
this.y = mat.y;
this.w = mat.w;
this.h = mat.h;
return this;
}
/**
* Set the matrix to the identity matrix.
* @returns {Sol.math.OrthoMatrix} The resultant matrix.
*/
identity(){
this.x = this.y = 0;
this.w = this.h = 1;
return this;
}
/**
* Translate the matrix.
* @param {number} x - The amount to translate the matrix in the X axis.
* @param {number} y - The amount to translate the matrix in the Y axis.
* @returns {Sol.math.OrthoMatrix} The resultant matrix.
*/
translate(x, y){
this.x += x;
this.y += y;
return this;
}
/**
* Scale the matrix.
* @param {number} x - The amount to scale the matrix in the X axis.
* @param {number} y - The amount to scale the matrix in the Y axis.
* @returns {Sol.math.OrthoMatrix} The resultant matrix.
*/
scale(x, y){
this.w *= x;
this.h *= y;
return this;
}
/**
* Set the matrix to another matrix mutliplied by this matrix.
* @param {Sol.math.OrthoMatrix} The matrix to multiply by this matrix.
* @returns {Sol.math.OrthoMatrix} The resultant matrix.
*/
multiply(mat){
this.x  = mat.x * this.w + this.x;
this.y  = mat.y * this.h + this.y;
this.w *= mat.w;
this.h *= mat.h;
return this;
}
}
/**
* WebGL renderer model-view-projection matrix.
* @class MVPMatrix
* @memberof Sol.gfx.webgl
* @classdesc An abstraction of a model, view, and projection matrix.
*/
class MVPMatrix {
/**
* Create the WebGL renderer model-view-projection matrix.
* @param {Sol.gfx.webgl.Program} program - The program to send the matrix to.
* @param {string} uniform - The name of the uniform to set to the matrix.
*/
constructor(program, uniform){
/**
* The name of the program to send the matrix to.
* @private
* @type {Sol.gfx.webgl.Program}
*/
this._program = program;
/**
* The name of the uniform to set to the matrix.
* @private
* @type {string}
*/
this._uniform = uniform;
/**
* Whether the matrix needs to be updated.
* @private
* @type {boolean}
*/
this._dirty = false;
/**
* The projection matrix.
* @private
* @type {Sol.math.OrthoMatrix}
*/
this._matP = new OrthoMatrix();
/**
* The value of the matrix as a 4x4 float matrix in column-major order for
* sending to the program.
* @private
* @type {Float32Array}
*/
this._value = new Float32Array([
1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
]);
}
/**
* Set the projection matrix to a basic orthographic projection.
* @param {number} width - The width of the projection.
* @param {number} height - The height of the projection.
*/
projection(width, height){
this._matP.x = -1;
this._matP.y = 1;
this._matP.w = 2 / width;
this._matP.h = -2 / height;
this._dirty  = true;
}
/**
* Update the matrix if necessary.
*/
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
setAp1ub(name, normalized, stride, offset){
this.setAp(name, 1, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
}
setAp2ub(name, normalized, stride, offset){
this.setAp(name, 2, this._gl.UNSIGNED_BYTE, normalized, stride, offset);
}
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
/**
* WebGL renderer texture cache.
* @class TextureCache
* @memberof Sol.gfx.webgl
* @classdesc Stores the ID and size of the applied texture and binds textures
* when necessary.
*/
class TextureCache {
/**
* Create the WebGL renderer texture cache.
* @param {Sol.Game} game - The game instance that this texture cache belongs
* to.
* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
* rendering context to use.
* @param {Sol.gfx.webgl.VertBuffer} buffer - The vertex buffer to flush when
* out of textures.
* @param {number} maxTextures - The maximum number of texture units allowed
* per draw call.
*/
constructor(game, gl, buffer, maxTextures){
/**
* The texture factory to create and destroy temporary textures with.
* @private
* @type {Sol.texture.TextureFactory}
*/
this._factory = game.texture.factory;
/**
* The WebGL rendering context to use.
* @private
* @type {WebGLRenderingContext|WebGL2RenderingContext}
*/
this._gl = gl;
/**
* The vertex buffer to flush when out of textures.
* @private
* @type {Sol.gfx.webgl.VertBuffer}
*/
this._buffer = buffer;
/**
* The maximum number of texture units allowed per draw call.
* @private
* @constant
* @type {number}
* @default 32
*/
this._MAX_TEXTURES = maxTextures;
/**
* A pointer to the next texture ID to bind.
* @private
* @type {number}
*/
this._pointer = 0;
/**
* An array of temporary textures to bind to prevent errors from drawing
* unbound textures on MacOS.
* @private
* @type {Sol.texture.Texture[]}
*/
this._tempTextures = [];
/**
* An array of currently bound textures.
* @private
* @type {Sol.texture.Texture[]}
*/
this._boundTextures = [];
/**
* The ID of the applied texture.
* @type {number}
*/
this.id = 0;
/**
* The width of the applied texture.
* @type {number}
*/
this.width = 1;
/**
* The height of the applied texture.
* @type {number}
*/
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
/**
* Apply a texture to subsequent drawing.
* @param {Sol.texture.Texture} texture - The texture to apply.
*/
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
/**
* Flush the vertex buffer and pseudo-unbind all textures.
*/
flush(){
this._buffer.flush();
for(let i = 0; i < this._MAX_TEXTURES; i++){
this._boundTextures[i].glBound = false;
}
this._pointer = 0;
}
/**
* Destroy the texture cache.
*/
destroy(){
for(let i = 0; i < this._MAX_TEXTURES; i++){
this._factory.destroyTexture(this._gl, this._tempTextures[i]);
}
this._tempTextures  = [];
this._boundTextures = [];
}
}
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
this.pushVert(l, t, id, cl, ct, tint);
this.pushVert(l, b, id, cl, cb, tint);
this.pushVert(r, t, id, cr, ct, tint);
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
/**
* WebGL renderer.
* @class WebGLRenderer
* @extends Sol.gfx.Renderer
* @memberof Sol.gfx.webgl
* @classdesc Renders using the WebGL rendering context.
*/
class WebGLRenderer extends Renderer {
/**
* Create the WebGL renderer.
* @param {Sol.Game} game - The game instance that this WebGL renderer belongs
* to.
* @param {HTMLCanvasElement} canvas - The canvas to use.
* @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL
* rendering context to use.
* @param {number} maxTextures - The absolute maximum number of texture units
* allowed per draw call.
* @param {number} maxVerts - The absolute maximum number of verticies allowed
* per draw call.
*/
constructor(game, canvas, gl, maxTextures, maxVerts){
super(CONST.WEBGL, canvas);
/**
* The WebGL rendering context to use.
* @private
* @type {WebGLRenderingContext|WebGL2RenderingContext}
*/
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
/**
* The program to use.
* @private
* @type {Sol.gfx.webgl.Program}
*/
this._program = new Program(
gl, "mainVert", "mainFrag", maxTextures, "texel", "uTex", "vTexID", "vUV"
);
this._program.use();
this._program.setU1iv("uTex", textureIndicies);
this._program.setUm4fvID("uMVP");
/**
* The model-view-projection matrix to use.
* @private
* @type {Sol.gfx.webgl.MVPMatrix}
*/
this._mvp = new MVPMatrix(this._program, "uMVP");
/**
* The vertex buffer to use.
* @private
* @type {Sol.gfx.webgl.VertBuffer}
*/
this._vertBuffer = new VertBuffer(
gl, this._program, this._mvp, maxVerts, "aPos", "aTexID", "aUV", "aTint"
);
/**
* The texture cache to use.
* @private
* @type {Sol.gfx.webgl.TextureCache}
*/
this._textureCache = new TextureCache(
game, gl, this._vertBuffer, maxTextures
);
}
/**
* Clear the screen.
* @override
*/
clear(){
this._gl.clear(this._gl.COLOR_BUFFER_BIT);
}
/**
* Apply a texture to subsequent drawing.
* @override
* @param {Sol.texture.Texture} texture - The texture to apply.
*/
applyTexture(texture){
this._textureCache.applyTexture(texture);
}
/**
* Draw the applied texture.
* @override
* @param {number} x - The X coordinate of the top-left corner to draw the
* applied texture.
* @param {number} y - The Y coordinate of the top-left corner to draw the
* applied texture.
* @param {number} w - The width to draw the applied texture.
* @param {number} h - The height to draw the applied texture.
* @param {number} cx - The X coordinate of the top-left corner to crop from
* the applied texture.
* @param {number} cy - The Y coordinate of the top-left corner to crop from
* the applied texture.
* @param {number} cw - The width to crop from the applied texture.
* @param {number} ch - The height to crop from the applied texture.
*/
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
/**
* Destroy the renderer.
* @override
*/
destroy(){
this._textureCache.destroy();
this._vertBuffer.destroy();
this._program.destroy();
this._gl.clearColor(0, 0, 0, 0);
this._gl.clear(this._gl.COLOR_BUFFER_BIT);
this._gl.flush();
}
/**
* Runs when the resolution is resized.
* @override
* @protected
*/
_onResize(){
this._gl.viewport(0, 0, this._width, this._height);
this._mvp.projection(this._width, this._height);
}
/**
* Runs before every frame.
* @override
*/
onPreDraw(){
this.clear();
}
/**
* Runs after every frame.
* @override
*/
onPostDraw(){
this._vertBuffer.flush();
}
/**
* The WebGL rendering context to use.
* @override
* @readonly
* @returns {WebGLRenderingContext|WebGL2RenderingContext}
*/
get gl(){ return this._gl; }
}
/**
* Stores utilities, classes, and resources for the WebGL renderer.
* @namespace Sol.gfx.webgl
* @memberof Sol.gfx
* @type {Object<string, function|Object<string, any>>}
*/
const webgl = {
shaderSrc:     shaderSrc,
util:          util$1,
MVPMatrix:     MVPMatrix,
Program:       Program,
TextureCache:  TextureCache,
VertBuffer:    VertBuffer,
WebGLRenderer: WebGLRenderer
};
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
/**
* Create a renderer.
* @private
* @param {HTMLCanvasElement} canvas - The canvas to use.
*/
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
}else {
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
/**
* Stores utilities, classes, and resources for graphics.
* @namespace Sol.gfx
* @memberof Sol
* @type {Object<string, any>}
*/
const gfx = {
canvas:           canvas,
webgl:            webgl,
GfxManager:       GfxManager,
GfxManagerConfig: GfxManagerConfig,
Renderer:         Renderer
};
/**
* JSON file.
* @class JsonFile
* @extends Sol.asset.Asset
* @memberof Sol.json
* @classdesc Stores the data of a JSON file.
*/
class JsonFile extends Asset {
/**
* Create the JSON file.
*/
constructor(){
super();
/**
* The data of the JSON file.
* @type {any|any[]|Object<string, any>}
*/
this.data = {};
}
}
/**
* JSON file manager.
* @class JsonManager
* @memberof Sol.json
* @classdesc Manages JSON files for a game instance.
*/
class JsonManager {
/**
* Create the JSON file manager.
*/
constructor(){
/**
* A dictionary of JSON file keys and JSON files.
* @private
* @type {Object<string, Sol.json.JsonFile>}
*/
this._json = {};
}
/**
* Get whether a JSON file exists.
* @param {string} key - The key of the JSON file to test.
* @returns {boolean} Whether the JSON file exists.
*/
has(key){
return key in this._json;
}
/**
* Create a JSON file.
* @param {string} src - The source of the JSON file.
* @returns {Sol.json.JsonFile} The created JSON file.
*/
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
/**
* Load a JSON file.
* @param {string} key - The key to give the JSON file.
* @param {string} src - The source of the JSON file.
* @returns {Sol.json.JsonFile} The loaded JSON file.
*/
load(key, src){
this.unload(key);
this._json[key] = this.create(src);
return this._json[key];
}
/**
* Unload a JSON file.
* @param {string} key - The key of the JSON file to unload.
* @returns {boolean} Whether the JSON file existed before being unloaded.
*/
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
/**
* Unload all JSON files.
*/
unloadAll(){
for(let key in this._json){
this.unload(key);
}
}
/**
* Runs when the game stops. Unloads all JSON files.
*/
onStop(){
this.unloadAll();
}
/**
* Get a JSON file.
* @param {string} key - The key of the JSON file to get.
* @returns {?Sol.json.JsonFile} A JSON file. Returns null if the JSON file
* does not exist.
*/
get(key){
return this.has(key) ? this._json[key] : null;
}
/**
* Get the data of a JSON file.
* @param {string} key - The key of the JSON file to get the data of.
* @returns {any|any[]|Object<string, any>} The data of the JSON file. Returns
* an empty object if the JSON file does not exist.
*/
getData(key){
return this.has(key) ? this._json[key].data : {};
}
}
/**
* Stores classes for JSON files.
* @namespace Sol.json
* @memberof Sol
* @type {Object<string, function>}
*/
const json = {
JsonFile:    JsonFile,
JsonManager: JsonManager
};
/**
* Keyboard input manager.
* @class KeyManager
* @memberof Sol.key
* @classdesc Manages keyboard input for a game instance.
*/
class KeyManager {
/**
* Create the keyboard input manager.
* @param {Sol.key.KeyManagerConfig} config - The keyboard input manager
* configuration.
*/
constructor(config){
/**
* Whether to listen for keyboard input.
* @private
* @type {boolean}
*/
this._enabled = config.enabled;
/**
* A dictionary of key codes and whether the keys are currently pressed.
* @private
* @type {Object<string, boolean>}
*/
this._keys = {};
/**
* A dictionary of key codes and whether the keys were pressed at the start
* of the current game tick.
* @private
* @type {Object<string, boolean>}
*/
this._keysNow = {};
/**
* A dictionary of key codes and whether the keys were pressed at the start
* of the previous game tick.
* @private
* @type {Object<string, boolean>}
*/
this._keysLast = {};
/**
* An event handler for keydown events.
* @private
* @type {Sol.dom.EventHandler}
*/
this._keydownHandler = new EventHandler(document, "keydown",
event => this._onKeydown(event), {
once: false,
passive: true
}
);
/**
* An event handler for keyup events.
* @private
* @type {Sol.dom.EventHandler}
*/
this._keyupHandler = new EventHandler(document, "keyup",
event => this._onKeyup(event), {
once: false,
passive: true
}
);
}
/**
* Get whether a key was pressed on this game tick.
* @param {string} code - The code of the key to test.
* @returns {boolean} Whether the key was pressed on this game tick.
*/
down(code){
return !!this._keysNow[code] && !this._keysLast[code];
}
/**
* Get whether a key is being held.
* @param {string} code - The code of the key to test.
* @returns {boolean} Whether the key is being held.
*/
held(code){
return !!this._keysNow[code];
}
/**
* Get whether a key was released on this game tick.
* @param {string} code - The code of the key to test.
* @returns {boolean} Whether the key was released on this game tick.
*/
up(code){
return !this._keysNow[code] && !!this._keysLast[code];
}
/**
* Runs when a keydown event occurs.
* @private
* @param {KeyboardEvent} event - A keyboard event.
*/
_onKeydown(event){
this._keys[event.code] = true;
}
/**
* Runs when a keyup event occurs.
* @private
* @param {KeyboardEvent} event - A keyboard event.
*/
_onKeyup(event){
this._keys[event.code] = false;
}
/**
* Runs when the game starts. Starts the event handlers.
*/
onStart(){
if(this._enabled){
this._keydownHandler.start();
this._keyupHandler.start();
}
}
/**
* Runs before every game tick. Updates keyboard input.
*/
onPreTick(){
Object.assign(this._keysLast, this._keysNow);
Object.assign(this._keysNow, this._keys);
}
/**
* Runs when the game stops. Stops the event handlers and clears keyboard
* input.
*/
onStop(){
this._keydownHandler.stop();
this._keyupHandler.stop();
for(let code in this._keys){
this._keysLast[code] = this._keysNow[code] = this._keys[code] = false;
}
}
}
/**
* Stores classes for keyboard input.
* @namespace Sol.key
* @memberof Sol
* @type {Object<string, function>}
*/
const key = {
KeyManager:       KeyManager,
KeyManagerConfig: KeyManagerConfig
};
/**
* Stores mathematical utilities.
* @namespace Sol.math
* @memberof Sol
* @type {Object<string, function>}
*/
const math = {
clamp:       clamp,
OrthoMatrix: OrthoMatrix
};
/**
* Scene base.
* @virtual
* @class Scene
* @memberof Sol
* @classdesc Stores the interface for scenes. Separates a game into scenes.
*/
class Scene {
/**
* Runs when the scene is created. Additionally runs in all scenes added
* through the scene manager configuration when the game starts.
* @virtual
* @param {Sol.Game} game - The game instance that this scene belongs to.
*/
onCreate(game){ }
/**
* Runs when the active scene is changed to this scene. Additionally runs in
* the main scene when the game starts.
* @virtual
* @param {Sol.Game} game - The game instance that this scene belongs to.
*/
onEnter(game){ }
/**
* Runs on every game tick while the scene is active. Used for processing user
* input and running game logic.
* @virtual
* @param {Sol.Game} game - The game instance that this scene belongs to.
*/
onTick(game){ }
/**
* Runs on every frame while the scene is active. Used for drawing graphics.
* @virtual
* @param {Sol.Game} game - The game instance that this scene belongs to.
*/
onDraw(game){ }
/**
* Runs when the active scene is changed from this scene.
* @virtual
* @param {Sol.Game} game - The game instance that this scene belongs to.
*/
onExit(game){ }
/**
* Runs when the scene is destroyed. Additionally runs in all available scenes
* when the game stops.
* @virtual
* @param {Sol.Game} game - The game instance that this scene belongs to.
*/
onDestroy(game){ }
}
/**
* Scene manager.
* @class SceneManager
* @memberof Sol.scene
* @classdesc Manages scenes for a game instance.
*/
class SceneManager {
/**
* Create the scene manager.
* @param {Sol.Game} game - The game instance that this scene manager belongs
* to.
* @param {Sol.scene.SceneManagerConfig} config - The scene manager
* configuration.
*/
constructor(game, config){
/**
* The game instance that this scene manager belongs to.
* @private
* @type {Sol.Game}
*/
this._game = game;
/**
* The scene manager configuration.
* @private
* @type {Sol.scene.SceneManagerConfig}
*/
this._config = config;
/**
* The key of the default scene.
* @private
* @constant
* @type {string}
* @default "__sol_default__"
*/
this._KEY_DEFAULT = "__sol_default__";
/**
* The key of the active scene.
* @private
* @type {string}
*/
this._keyActive = this._KEY_DEFAULT;
/**
* The key of the next scene.
* @private
* @type {string}
*/
this._keyNext = this._KEY_DEFAULT;
/**
* Whether the active scene is changing.
* @private
* @type {boolean}
*/
this._changing = false;
/**
* A dictionary of scene keys and scenes.
* @private
* @type {Object<string, Sol.Scene>}
*/
this._scenes = {};
this._scenes[this._KEY_DEFAULT] = new Scene();
}
/**
* Get whether a key exists.
* @param {string} key - The key of the scene to test.
* @returns {boolean} Whether the scene exists.
*/
has(key){
return key != this._KEY_DEFAULT && key in this._scenes;
}
/**
* Create a scene.
* @param {string} key - The key to give the scene.
* @param {function(new:Sol.Scene)} scene - The class name of the scene.
* @returns {boolean} Whether the scene was created successfully.
*/
create(key, scene){
if(key == this._KEY_DEFAULT){
return false;
}
this.destroy(key);
this._scenes[key] = new scene();
this._scenes[key].onCreate(this._game);
return true;
}
/**
* Change the active scene.
* @param {string} key - The key of the scene to change the active scene to.
* @returns {boolean} Whether the active scene was changed successfully.
*/
change(key){
if(!this.has(key)){
return false;
}
this._keyNext  = key;
this._changing = true;
return true;
}
/**
* Reload the active scene.
* @returns {boolean} Whether the active scene was reloaded successfully.
*/
reload(){
return this.change(this._keyActive);
}
/**
* Destroy a scene.
* @param {string} key - The key of the scene to destroy.
* @returns {boolean} Whether the scene existed before being destroyed.
*/
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
/**
* Runs when the game starts. Creates scenes and changes the active scene to
* the main scene.
*/
onStart(){
for(let key in this._config.scenes){
this.create(key, this._config.scenes[key]);
}
this.change(this._config.main);
}
/**
* Runs on every game tick. Changes and ticks the active scene.
*/
onTick(){
if(this._changing){
this._scenes[this._keyActive].onExit(this._game);
this._keyActive = this._keyNext;
this._changing  = false;
this._scenes[this._keyActive].onEnter(this._game);
}
this._scenes[this._keyActive].onTick(this._game);
}
/**
* Runs on every frame. Draws the active scene.
*/
onDraw(){
this._scenes[this._keyActive].onDraw(this._game);
}
/**
* Runs when the game stops. Destroys all available scenes.
*/
onStop(){
for(let key in this._scenes){
this.destroy(key);
}
}
/**
* Get a scene.
* @param {string} key - The key of the scene to get.
* @returns {?Sol.Scene} A scene. Returns null if the scene does not exist.
*/
get(key){
return this.has(key) ? this._scenes[key] : null;
}
/**
* The key of the active scene.
* @readonly
* @returns {string}
*/
get key(){ return this._keyActive; }
/**
* Whether the active scene is changing.
* @readonly
* @returns {boolean}
*/
get changing(){ return this._changing; }
/**
* The active scene.
* @readonly
* @returns {Sol.Scene}
*/
get active(){ return this._scenes[this._keyActive]; }
/**
* An array of all available scene keys.
* @readonly
* @returns {string[]}
*/
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
/**
* Stores classes for scenes.
* @namespace Sol.scene
* @memberof Sol
* @type {Object<string, function>}
*/
const scene = {
SceneManager:       SceneManager,
SceneManagerConfig: SceneManagerConfig
};
const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX/AP8AAACfphTyAAAADklEQVQIHWMIZVjFgIQBHpwD/fruyDEAAAAASUVORK5CYII=";
/**
* Stores the base 64 data for built-in textures.
* @namespace Sol.texture.imgSrc
* @memberof Sol.texture
* @type {Object<string, string>}
*/
const imgSrc = {
missing: img
};
/**
* Texture.
* @class Texture
* @extends Sol.asset.Asset
* @memberof Sol.texture
* @classdesc An image that can be loaded and drawn.
*/
class Texture extends Asset {
/**
* Create the texture.
*/
constructor(){
super();
/**
* The width of the texture.
* @type {number}
*/
this.width = 1;
/**
* The height of the texture.
* @type {number}
*/
this.height = 1;
/**
* The WebGL texture of the texture.
* @type {?WebGLTexture}
*/
this.glTex = null;
/**
* Whether the WebGL texture of the texture is bound to a texture unit.
* @type {boolean}
*/
this.glBound = false;
/**
* The texture unit that the WebGL texture of the texture is bound to.
* @type {number}
*/
this.glUnit = 0;
/**
* The canvas image source of the texture.
* @type {?CanvasImageSource}
*/
this.canvasImg = null;
/**
* The amount to multiply the cropping coordinates of the texture by in the X
* axis when using the canvas renderer.
* @type {number}
*/
this.canvasCropScaleX = 1;
/**
* The amount to multiply the cropping coordinates of the texture by in the Y
* axis when using the canvas renderer.
* @type {number}
*/
this.canvasCropScaleY = 1;
}
}
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
/**
* Texture manager.
* @class TextureManager
* @memberof Sol.texture
* @classdesc Manages textures for a game instance.
*/
class TextureManager {
/**
* Create the texture manager.
* @param {Sol.Game} game - The game instance that this texture manager belongs
* to.
*/
constructor(game){
/**
* The game instance that this texture manager belongs to.
* @private
* @type {Sol.Game}
*/
this._game = game;
/**
* The renderer to use.
* @private
* @type {Sol.gfx.Renderer}
*/
this._renderer;
/**
* The WebGL rendering context to use.
* @private
* @type {?WebGLRenderingContext|WebGL2RenderingContext}
*/
this._gl = null;
/**
* A dictionary of texture keys and textures.
* @private
* @type {Object<string, Sol.texture.Texture>}
*/
this._textures = {};
/**
* The texture factory.
* @type {Sol.texture.TextureFactory}
*/
this.factory = new TextureFactory();
}
/**
* Get whether a texture exists.
* @param {string} key - The key of the texture to test.
* @returns {boolean} Whether the texture exists.
*/
has(key){
return key in this._textures;
}
/**
* Create a texture.
* @param {string} src - The source of the texture image.
* @param {number=} width - The expected width of the texture. Use 0 for the
* width of the texture image.
* @param {number=} height - The expected height of the texture. Use 0 for the
* height of the texture image.
* @returns {Sol.texture.Texture} The created texture.
*/
create(src, width = 0, height = 0){
return this.factory.createTexture(this._gl, src, width, height);
}
/**
* Draw a texture.
* @param {string} key - The key of the texture to draw.
* @param {number=} x - The X coordinate of the top-left corner to draw the
* texture.
* @param {number=} y - The Y coordinate of the top-left corner to draw the
* texture.
* @param {?number=} w - The width to draw the texture. Use null for the width
* of the texture.
* @param {?number=} h - The height to draw the texture. Use null for the
* height of the texture.
* @param {number=} cx - The X coordinate of the top-left corner to crop from
* the texture.
* @param {number=} cy - The Y coordinate of the top-left corner to crop from
* the texture.
* @param {?number=} cw - The width to crop from the texture. Use null for the
* remaining width.
* @param {?number=} ch - The height to crop from the texture. Use null for the
* remaining height.
*/
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
/**
* Load a texture.
* @param {string} key - The key to give the texture.
* @param {string} src - The source of the texture image.
* @param {number=} width - The expected width of the texture. Use 0 for the
* width of the texture image.
* @param {number=} height - The expected height of the texture. Use 0 for the
* height of the texture image.
* @returns {Sol.texture.Texture} The loaded texture.
*/
load(key, src, width = 0, height = 0){
this.unload(key);
this._textures[key] = this.create(src, width, height);
return this._textures[key];
}
/**
* Unload a texture.
* @param {string} key - The key of the texture to unload.
* @returns {boolean} Whether the texture existed before being unloaded.
*/
unload(key){
if(!this.has(key)){
return false;
}
this.factory.destroyTexture(this._gl, this._textures[key]);
delete this._textures[key];
return true;
}
/**
* Unload all textures.
*/
unloadAll(){
for(let key in this._textures){
this.unload(key);
}
}
/**
* Runs when the game starts. Gets the renderer and WebGL rendering context.
*/
onStart(){
this._renderer = this._game.gfx.renderer;
this._gl       = this._renderer.gl;
}
/**
* Runs when the game stops. Unloads all textures.
*/
onStop(){
this.unloadAll();
}
/**
* Get a texture.
* @param {string} key - The key of the texture to get.
* @returns {?Sol.texture.Texture} A texture. Returns null if the texture does
* not exist.
*/
get(key){
return this.has(key) ? this._textures[key] : null;
}
}
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
/**
* Timing manager.
* @class TimeManager
* @memberof Sol.time
* @classdesc Manages timing for a game instance.
*/
class TimeManager {
/**
* Create the timing manager.
*/
constructor(){
/**
* The minimum allowed delta time for a game tick.
* @private
* @constant
* @type {number}
* @default 0.00001
*/
this._MIN_DELTA = 0.00001;
/**
* The maximum allowed delta time for a game tick.
* @private
* @constant
* @type {number}
* @default 1
*/
this._MAX_DELTA = 1;
/**
* The time since the previous game tick in seconds.
* @private
* @type {number}
*/
this._delta = 1;
/**
* The number of frames per second.
* @private
* @type {number}
*/
this._fps = 1;
}
/**
* Runs before every game tick. Updates the delta time and frames per second.
* @param {number} delta - The raw delta time.
*/
onPreTick(delta){
this._delta = clamp(delta, this._MIN_DELTA, this._MAX_DELTA);
this._fps   = 1 / delta;
}
/**
* The time since the previous game tick in seconds.
* @readonly
* @returns {number}
*/
get delta(){ return this._delta; }
/**
* The number of frames per second.
* @readonly
* @returns {number}
*/
get fps(){ return this._fps; }
}
/**
* Stores classes for timing.
* @namespace Sol.time
* @memberof Sol
* @type {Object<string, function>}
*/
const time = {
TimeManager: TimeManager
};
/**
* Extend an object with the properties of another object while ignoring objects,
* arrays, functions and classes.
* @function shallowExtend
* @memberof Sol.util.object
* @param {Object<string, any>} target - The target object to shallowly extend.
* @param {Object<string, any>} src - The source object to shallowly extend the
* target object with.
*/
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
/**
* Stores global utilities for objects.
* @namespace Sol.util.object
* @memberof Sol.util
* @type {Object<string, function>}
*/
const object = {
shallowExtend: shallowExtend,
getDefault:    getDefault
};
/**
* Stores global utilities for Sol.
* @namespace Sol.util
* @memberof Sol
* @type {Object<string, function|Object<string, function>>}
*/
const util$2 = {
object: object,
noop:   noop
};
/**
* Game instance.
* @class Game
* @memberof Sol
* @classdesc Stores the API for running a game.
*/
class Game {
/**
* Create the game instance.
* @param {Object<string, any>=} options - An options object to merge into the
* game instance configuration.
*/
constructor(options = {}){
const config = new Config(options);
/**
* Runs a game loop and calls events in the managers of the game instance.
* @private
* @type {Sol.core.Loop}
*/
this._loop = new Loop(this);
/**
* Manages graphics for the game instance.
* @type {Sol.gfx.GfxManager}
*/
this.gfx = new GfxManager(this, config.gfx);
/**
* Manages JSON files for the game instance.
* @type {Sol.json.JsonManager}
*/
this.json = new JsonManager();
/**
* Manages keyboard input for the game instance.
* @type {Sol.key.KeyManager}
*/
this.key = new KeyManager(config.key);
/**
* Manages scenes for the game instance.
* @type {Sol.scene.SceneManager}
*/
this.scene = new SceneManager(this, config.scene);
/**
* Manages textures for the game instance.
* @type {Sol.texture.TextureManager}
*/
this.texture = new TextureManager(this);
/**
* Manages timing for the game instance.
* @type {Sol.time.TimeManager}
*/
this.time = new TimeManager();
/**
* Keeps track of the loaded state of lists of assets.
* @type {Sol.asset.Loader}
*/
this.loader = new Loader(this);
if(config.autoStart){
this.start();
}
}
/**
* Start the game if it is not running.
* @returns {boolean} Whether the game was started successfully from a stopped
* state.
*/
start(){
return this._loop.start();
}
/**
* Stop the game if it is running and start the game.
* @returns {boolean} Whether the game was restarted successfully.
*/
restart(){
return this._loop.restart();
}
/**
* Stop the game if it is running.
* @returns {boolean} Whether the game was stopped from a running state.
*/
stop(){
return this._loop.stop();
}
/**
* Whether the game is running.
* @readonly
* @returns {boolean}
*/
get running(){ return this._loop.running; }
/**
* The time since the previous game tick in seconds.
* @readonly
* @returns {number}
*/
get delta(){ return this.time.delta; }
/**
* The number of frames per second.
* @readonly
* @returns {number}
*/
get fps(){ return this.time.fps; }
}
/**
* The global namespace for Sol.
* @global
* @namespace Sol
* @mixes Sol.CONST
* @type {Object<string, any>}
*/
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
