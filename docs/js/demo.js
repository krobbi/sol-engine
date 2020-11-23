class BootScene extends Sol.Scene {
	constructor(){
		super();
	}

	onEnter(game){
		game.loader.load("main", {
			json: {
				example: {
					src: "res/json/example.json"
				}
			},
			textures: {
				checks: {
					src: "res/textures/checks.png",
					width: 800,
					height: 600
				},
				logo: {
					src: "img/header.png",
					width: 384,
					height: 128
				}
			}
		});
	}

	onTick(game){
		if(game.loader.complete("main")){
			game.scene.change("demo");
		}
	}

	onDraw(game){
		console.log(`${Math.round(game.loader.progress("main") * 100)}%`);
	}
}

class DemoScene extends Sol.Scene {
	constructor(){
		super();

		this.posX  = 208;
		this.posY  = 236;
		this.speed = 128;

		this.fpsCount = 0;
		this.fpsTotal = 0;
	}

	onEnter(game){
		this.checksTex = game.texture.get("checks");
		this.logoTex   = game.texture.get("logo");

		console.log(game.json.getData("example").message);
	}

	onTick(game){
		if(game.key.down("Escape")){
			game.stop();
		}

		if(game.key.held("KeyQ")){
			this.fpsCount++;
			this.fpsTotal += game.fps;
		}else if(game.key.up("KeyQ")){
			console.log(
				`${this.fpsTotal / this.fpsCount} FPS over ${this.fpsCount} frames.`
			);
			this.fpsCount = 0;
			this.fpsTotal = 0;
		}

		let moveX = 0;
		let moveY = 0;

		if(game.key.held("KeyW") || game.key.held("ArrowUp"))    moveY--;
		if(game.key.held("KeyS") || game.key.held("ArrowDown"))  moveY++;
		if(game.key.held("KeyA") || game.key.held("ArrowLeft"))  moveX--;
		if(game.key.held("KeyD") || game.key.held("ArrowRight")) moveX++;

		this.posX += moveX * this.speed * game.delta;
		this.posY += moveY * this.speed * game.delta;

		if(game.key.held("KeyE") || game.key.held("Space")){
			this.posX = 208;
			this.posY = 236;
		}
	}

	onDraw(game){
		game.texture.draw("checks");
		game.texture.draw("logo", this.posX, this.posY);
	}
}

var game = new Sol.Game({
	autoStart: false,
	gfx: {
		canvas: "#sol-demo-screen",
		renderer: Sol.WEBGL,
		width: 800,
		height: 600,
		glMaxTextures: 2,
		glMaxVerts: 16384
	},
	key: {
		enabled: true
	},
	scene: {
		main: "boot",
		scenes: {
			boot: BootScene,
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
