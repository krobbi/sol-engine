# ![Sol](docs/img/header.png)
__Lightweight JavaScript game engine__  
__Version 0.1.0__  
__MIT License__ - https://krobbi.github.io/license/mit-2020.txt  
__Copyright &copy; 2020 Chris Roberts__ (Krobbizoid)

# Contents
1. [About](#about)
2. [Demo](#demo)
3. [Usage](#usage)
4. [Documentation](#documentation)
5. [Roadmap](#roadmap)
6. [NPM](#npm)
7. [License](#license)

# About
Sol is a lightweight JavaScript game engine. It is in very early development and
is not yet suitable for making games.

# Demo
The demo page for the development (unfinished, possibly buggy) version of Sol is
located at https://krobbi.github.io/sol-engine.

# Usage
The latest distribution version of Sol can be found in the ```/dist``` folder
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
in seconds. Shorthand for ```myGame.time.delta```.

```JavaScript
myGame.fps;
```
A read-only number property representing the number of frames per second.
Shorthand for ```myGame.time.fps```.

```JavaScript
// Managers:
myGame.scene; // Manages creating, storing, changing, and destroying scenes.
myGame.time;  // Stores read-only values for timing. May later be expanded.
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
	scene: { // Scene manager configuration.
		main: "main", // The key of the scene to start the game on.
		scenes: {} // A dictionary of scene keys and scene class names.
	}
});
```

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

# Roadmap
Planned features include mouse and keyboard input, texture loading and
rendering, and game objects with components and behaviours.

# NPM
The [NPM package](https://npmjs.com/package/sol-engine) for Sol
is ```sol-engine```. This package is mainly used to provide development
dependencies and build scripts in the repository. The package is published at
version ```0.0.0-init``` and will _not_ be updated until a full release.

# License
MIT License - https://krobbi.github.io/license/mit-2020.txt

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
