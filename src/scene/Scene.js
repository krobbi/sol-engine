/**
* @module Sol/scene/Scene
* @typedef {import("../core/Game.js").default} Sol.Game
*/

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
	onCreate(game){ game; }

	/**
	* Runs when the active scene is changed to this scene. Additionally runs in
	* the main scene when the game starts.
	* @virtual
	* @param {Sol.Game} game - The game instance that this scene belongs to.
	*/
	onEnter(game){ game; }

	/**
	* Runs on every game tick while the scene is active. Used for processing user
	* input and running game logic.
	* @virtual
	* @param {Sol.Game} game - The game instance that this scene belongs to.
	*/
	onTick(game){ game; }

	/**
	* Runs on every frame while the scene is active. Used for drawing graphics.
	* @virtual
	* @param {Sol.Game} game - The game instance that this scene belongs to.
	*/
	onDraw(game){ game; }

	/**
	* Runs when the active scene is changed from this scene.
	* @virtual
	* @param {Sol.Game} game - The game instance that this scene belongs to.
	*/
	onExit(game){ game; }

	/**
	* Runs when the scene is destroyed. Additionally runs in all available scenes
	* when the game stops.
	* @virtual
	* @param {Sol.Game} game - The game instance that this scene belongs to.
	*/
	onDestroy(game){ game; }
}

export default Scene;
