/*
* Sol
* By Chris Roberts (Krobbizoid)
* https://github.com/krobbi/sol-engine
* Development version, not for production use!
*/

/**
* @name Sol
* @description Lightweight JavaScript game engine.
* @version 0.1.0-dev
* @license {@link https://krobbi.github.io/license/mit-2020.txt|MIT License}
* @author Chris Roberts (Krobbizoid)
* @copyright 2020 Chris Roberts
*/
var Sol = (function () {
'use strict';
/**
* Global constants to extend Sol with.
* @global
* @mixin Sol.CONST
* @type {Object<string, string>}
*/
const CONST = {
/**
* The semantic version tag for this version of Sol.
* @constant
* @type {string}
* @name Sol.VERSION
* @default "0.1.0-dev"
*/
VERSION: "0.1.0-dev",
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
COPYRIGHT_YEAR: "2020"
};
/**
* Display a splash message in the console.
* @function consoleSplash
* @memberof Sol.core.util
*/
function consoleSplash(){
console.log(
[
`%c Sol v${CONST.VERSION} `,
`%c ${CONST.LICENSE} License - ${CONST.LICENSE_URL} `,
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
consoleSplash();
this._game.scene.onStart();
}
/**
* Runs on every step of the game loop.
* @private
*/
_onUpdate(){
this._game.time.onPreTick(this._delta);
this._game.scene.onTick();
this._game.scene.onDraw();
}
/**
* Runs when the game loop stops.
* @private
*/
_onStop(){
this._game.scene.onStop();
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
* Stores mathematical utilities.
* @namespace Sol.math
* @memberof Sol
* @type {Object<string, function>}
*/
const math = {
clamp: clamp
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
const util$1 = {
object: object
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
* Manages scenes for the game instance.
* @type {Sol.scene.SceneManager}
*/
this.scene = new SceneManager(this, config.scene);
/**
* Manages timing for the game instance.
* @type {Sol.time.TimeManager}
*/
this.time = new TimeManager();
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
core:  core,
math:  math,
scene: scene,
time:  time,
util:  util$1,
Game:  Game,
Scene: Scene
};
shallowExtend(Sol, CONST);
return Sol;
}());
