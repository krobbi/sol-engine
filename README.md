# ![Sol](docs/img/header.png)
__Lightweight JavaScript game engine__  
__Version 0.2.0__  
__MIT License__ - https://krobbi.github.io/license/mit-2020.txt  
__Copyright &copy; 2020 Chris Roberts__ (Krobbizoid)

_This project is on indefinite hiatus. See the notice below._

# Contents
1. [About](#about)
2. [Notice](#notice)
3. [Demo](#demo)
4. [Usage](#usage)
5. [Documentation](#documentation)
6. [NPM](#npm)
7. [License](#license)

# About
Sol is a lightweight JavaScript game engine. It is in early development and
is not yet suitable for making games.

# Notice
This project is on indefinite hiatus. It is not necessarily abandoned, but it
will likely not be receiving any updates any time soon. Game engines are highly
complex, multi-faceted pieces of software, and making your own is typically
discouraged.

Creating your own game engine is a great learning experience, and can be an
ideal solution for games with a highly specific scope, or very demanding
performance requirements. However, you are almost certain to run into complex
issues which can sway the usability and code quality of the finished engine.

Unless you want the satisfaction of creating your own engine, in the vast
majority of cases it is recommended to use an existing engine.

If you want to make a game, I would recommend the following frameworks and
engines. I am not associated with any of these, or any other company that makes
game engines, this is just my opinion.

### Phaser
https://phaser.io
https://github.com/photonstorm/phaser

Phaser is a JavaScript game framework, which was also used in some places as a
reference for this project. It is one of the most popular game frameworks that
specifically target web games, and provides extensive documentation and
examples.

Most of the work on a Phaser game is done in JavaScript as there is no official
editor program for it.

[Phaser Editor 2D](https://phasereditor2d.com) is an unofficial freemium editor
for Phaser with a similar interface to other game engines, however it requires
an account to use, and the free version is limited to 70 files per project and
50MB of storage.

### Unity
https://unity.com

An incredibly popular game engine which can export to just about every platform
imaginable. You should have very little trouble finding some good Unity
tutorials.

Unity uses C# for scripts which makes them fast and robust. The architecture of
Unity is a typical entity component system which allows you to attach many
components and behaviours to game objects, which lets you compose them quite
quickly and easily.

The personal edition of Unity is free to use, and provides almost all of the
functionality available in the premium editions, although you will have to deal
with the "Made with Unity" boot screen leaving a bad first impression on some
users.

Installing and opening Unity is a huge pain. You need to create an account,
download the Unity launcher, install a specific version of Unity, and open a
project file. This is not too difficult, however this process can take a long
time, especially on slower computers.

### Godot
https://godotengine.org
https://github.com/godotengine/godot

Godot is a free, open source general-purpose game engine with 2D and 3D
capabilities released under the MIT license. Using Godot only requires running a
single executable, and the editor starts up incredibly quickly. Many example and
template projects are available, and can be downloaded and run from inside the
editor.

Godot uses a node-based system where every scene, game object, and component is
represented as a tree of nodes, which can optionally have scripts attached to
them. Any saved tree of nodes in Godot is considered a scene, and can be edited
separately with very little clutter. Scenes may be instanced in or extended by
many other scenes. This can also be done in code if necessary.

Godot does have an optional Mono edition which allows you to use C# for
scripting. Both the standard and Mono editions also include GDScript, a
Python-like language which includes some useful shortcuts for interacting with
the Godot API and editor. Nodes also have a 'signal' system which is very useful
for broadcasting events between nodes.

While the node system allows games to be highly structured, it creates a
significant challenge in deciding which type of node to use for game objects.
The fact that each node can only have one script attached to can also create
issues if you are used to simply adding many scripts to a game object in an
engine such as Unity. The editor may also be a little hard to navigate at first.

The node system may be quite hard to grasp, and may require a lot of practice to
use it to its full potential. Some important concepts for using Godot include
node inheritance, resources, using external scripts as utilities or singletons,
and the idea that each node is equivalent to a single component.

---

# Demo
The demo page for the development (unfinished, possibly buggy) version of Sol is
located at https://krobbi.github.io/sol-engine.

# Usage
The latest distribution version of Sol can be found in the `dist/` folder
and specific versions of Sol can be downloaded from the
[GitHub releases page](https://github.com/krobbi/sol-engine/releases).

The following information assumes some basic knowledge of adding JavaScript to
webpages, and the use of modern ES6+ JavaScript and object-oriented programming.
It is an introduction to the basic API of Sol and _not_ a programming tutorial.

A basic hello world program for Sol looks like this:
```JavaScript
class HelloWorldScene extends Sol.Scene {
	constructor(){
		super();
	}

	onEnter(){
		console.log("Hello, world!");
	}
}

var helloWorldGame = new Sol.Game({
	autoStart: true,
	scene: {
		scenes: {
			main: HelloWorldScene
		}
	}
});
```
Below is an explanation of the steps to create and run a game.

After including Sol in your webpage, you can create a game instance. This is
used to configure your game, and stores the API for running the game, such as
methods to start and stop the game, and managers for systems such as timing and
scenes:
```JavaScript
var myGame = new Sol.Game();
```

The game instance provides you with the following properties and methods:

```JavaScript
myGame.running;
```
A read-only boolean property representing whether the game is running.

```JavaScript
myGame.delta;
```
A read-only number property representing the time since the previous game tick
in seconds. Shorthand for `myGame.time.delta`.

```JavaScript
myGame.fps;
```
A read-only number property representing the number of frames per second.
Shorthand for `myGame.time.fps`.

```JavaScript
// Managers:
myGame.gfx;     // Stores the renderer and manages basic graphics operations.
myGame.json;    // Manages loading, reading, and unloading JSON files.
myGame.key;     // Allows you to check the state of keyboard input.
myGame.scene;   // Manages creating, storing, changing, and destroying scenes.
myGame.texture; // Manages loading, unloading, and rendering textures.
myGame.time;    // Stores read-only values for timing. May later be expanded.
myGame.loader;  // Keeps track of the loaded state of lists of assets.
```
References to managers which provide APIs for interfacing with various game
systems. These are summarized here but will be further documented in future.

```JavaScript
myGame.start();
```
A method to start the game if it is not running. Returns a boolean representing
whether the game was started successfully from a stopped state.

```JavaScript
myGame.restart();
```
A method to stop the game if it is running and start the game. Returns a boolean
representing whether the game was restarted successfully.

```JavaScript
myGame.stop();
```
A method to stop the game if it is running. Returns a boolean representing
whether the game was stopped from a running state.

A configuration object may be passed to the game instance when it is created.
Any configuration omitted from this will use a default value. Below is an
example of creating a game instance with all of the default configuration set:
```JavaScript
var myGame = new Sol.Game({
	autoStart: false, // Whether to start the game once it is created.
	gfx: { // Graphics manger configuration.
		canvas: ".sol-canvas-parent", // The canvas or canvas parent to use.
		renderer: Sol.WEBGL, // The preferred renderer to use.
		width: 800, // The width of the resolution.
		height: 600, // The height of the resolution.
		glMaxTextures: 32, // The maximum number of textures per draw call in WebGL.
		glMaxVerts: 16384 // The maximum number of verts per draw call in WebGL.
	},
	key: { // Keyboard input manager configuration.
		enabled: true // Whether to listen for keyboard input.
	},
	scene: { // Scene manager configuration.
		main: "main", // The key of the scene to start the game on.
		scenes: {} // A dictionary of scene keys and scene class names.
	}
});
```
It is recommended that you disable any unused input methods to improve
performance.

In order for the game instance to do anything, a scene must be attached to the
game instance. A scene is declared as a class that inherits from the scene base:
```JavaScript
class MyScene extends Sol.Scene {
	constructor(){
		super();
	}

	// Runs when the scene is created in the game instance. Additionally runs in
	// all scenes added through the scene manager configuration when the game
	// starts. The 'game' parameter in this method and all subsequent methods is a
	// reference to the game instance.
	onCreate(game){}

	// Runs when the active scene is changed to this scene. Additionally runs in
	// the main scene when the game starts.
	onEnter(game){}

	// Runs on every game tick while the scene is active. Used for processing user
	// input and running game logic.
	onTick(game){}

	// Runs on every frame while the scene is active. Used for drawing graphics.
	onDraw(game){}

	// Runs when the active scene is changed from this scene.
	onExit(game){}

	// Runs when the scene is destroyed. Additionally runs in all available scenes
	// when the game stops.
	onDestroy(game){}
}
```
Any of the methods in a scene and their game instance parameters may be omitted.

Scenes are specified in the scene manager configuration when the game instance
is created:
```JavaScript
class MyScene extends Sol.Scene {
	constructor(){
		super();
	}
}

class OtherScene extends Sol.Scene {
	constructor(){
		super();
	}
}

var myGame = new Sol.Game({
	scene: {
		main: "my_scene",
		scenes: {
			my_scene: MyScene,
			other: OtherScene
		}
	}
});
```

For a more practical example, see the
[demo script](https://github.com/krobbi/sol-engine/blob/main/docs/js/demo.js).
Further documentation is not yet available.

# Documentation
_Further documentation for Sol is not yet available. It may be released
alongside the full release of Sol._

# NPM
The [NPM package](https://npmjs.com/package/sol-engine) for Sol
is `sol-engine`. This package is mainly used to provide development
dependencies and build scripts in the repository. The package is published at
version `0.0.0-init` and will _not_ be updated until a full release.

# License
MIT License - https://krobbi.github.io/license/2020/mit.txt

---

MIT License

Copyright (c) 2020 Chris Roberts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
