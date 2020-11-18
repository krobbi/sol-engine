class DemoScene extends Sol.Scene {
	constructor(){
		super();
	}

	onEnter(){
		console.log("Hello, world!");
	}
}

var game = new Sol.Game({
	autoStart: false,
	scene: {
		main: "demo",
		scenes: {
			demo: DemoScene
		}
	}
});

function btnStart(){
	game.start();
}

function btnRestart(){
	game.restart();
}

function btnStop(){
	game.stop();
}
