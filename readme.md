# ![Sol](docs/img/header.png)
_Lightweight JavaScript game engine._  
__Version 0.2.0__  
__Copyright &copy; 2020 Chris Roberts__ (Krobbizoid).

_This project is abandoned._

# Contents
1. [About](#about)
2. [Demo](#demo)
3. [Usage](#usage)
4. [License](#license)

# About
Sol was a lightweight JavaScript game engine in development that could handle
rudimentary graphics, input, timing, and asset loading. At the time the project
was abandoned it was not feasible to develop a game with it.

This project is abandoned. My conclusion from the project is that developing
your own game engine is generally a bad idea. It might give you good learning
experiences and the satisfaction of a job (maybe) well done. But there will be
a better tool for the job unless you have very specific requirements.

Personally, I have moved on to
[Godot Engine](https://github.com/godotengine/godot). It is free, open source,
and actually pretty fun to use for the most part. It also targets the web,
which might interest you if you're looking at JavaScript game engines. I am not
affilited with Godot Engine in any way, this is just a personal recommendation.

# Demo
The demo page for the final (but unfinished) version of Sol is located in the
`docs/` directory of this repository. This should be hosted over HTTP(S) to
function correctly.

# Usage
The latest distribution version of Sol can be found in the `dist/` directory of
this repository, and specific versions of Sol can be downloaded from the
[GitHub releases page](https://github.com/krobbi/sol-engine/releases).

The following information assumes some basic knowledge of adding JavaScript to
webpages, and the use of modern ES6+ JavaScript and object-oriented
programming. It is an introduction to the basic API of Sol and _not_ a
programming tutorial.

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

After including Sol in your webpage, you can create a game instance. This
provides an API for configuring and running the game:
```JavaScript
var myGame = new Sol.Game();
```

The API includes a read-only boolean property representing whether the game is
running:
```JavaScript
myGame.running;
```

A read-only number property representing the time since the previous game tick
in seconds. Shorthand for `myGame.time.delta`:
```JavaScript
myGame.delta;
```

A read-only number property representing the number of frames per second.
Shorthand for `myGame.time.fps`:
```JavaScript
myGame.fps;
```

References to managers which each provide their own APIs:
```JavaScript
// Managers:
myGame.gfx;     // Stores the renderer and manages basic graphics operations.
myGame.json;    // Manages loading, reading, and unloading JSON files.
myGame.key;     // Allows you to check the state of keyboard input.
myGame.scene;   // Manages creating, storing, changing, and destroying scenes.
myGame.texture; // Manages loading, unloading, and rendering textures.
myGame.time;    // Stores read-only values for timing.
myGame.loader;  // Loads and keeps track of groups of assets.
```

A method to start the game if it is not running. Returns a boolean representing
whether the game was started successfully from a stopped state:
```JavaScript
myGame.start();
```

A method to stop the game if it is running and start the game. Returns a
boolean representing whether the game was restarted successfully:
```JavaScript
myGame.restart();
```

A method to stop the game if it is running. Returns a boolean representing
whether the game was stopped from a running state:
```JavaScript
myGame.stop();
```

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
      glMaxTextures: 32, // Maximum number of textures per draw call in WebGL.
      glMaxVerts: 16384 // Maximum number of vertices per draw call in WebGL.
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

In order for the game instance to do anything, a scene must be attached to the
game instance. A scene is declared as a class that inherits from the scene
base:
```JavaScript
class MyScene extends Sol.Scene {
   constructor(){
      super();
   }
   
   // Runs when the scene is created in the game instance. Additionally runs in
   // all scenes added through the scene manager configuration when the game
   // starts. The 'game' parameter in this method and all subsequent methods is
   // a reference to the game instance.
   onCreate(game){}
   
   // Runs when the active scene is changed to this scene. Additionally runs in
   // the main scene when the game starts.
   onEnter(game){}
   
   // Runs on every game tick while the scene is active. Used for processing
   // user input and running game logic.
   onTick(game){}
   
   // Runs on every frame while the scene is active. Used for drawing graphics.
   onDraw(game){}
   
   // Runs when the active scene is changed from this scene.
   onExit(game){}
   
   // Runs when the scene is destroyed. Additionally runs in all available
   // scenes when the game stops.
   onDestroy(game){}
}
```
Any of the methods in a scene and their game instance parameters may be
omitted.

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

For a more practical example, see the demo script at `docs/js/demo.js` in this
repository.

# License
Sol is released under the MIT License:  
https://krobbi.github.io/license/2020/mit.txt

See [license.txt](./license.txt) for a full copy of the license text.
