/*
* Node script: dev
* Build the development version of Sol for the demo page.
*/

const fs     = require("fs");
const bundle = require("./util/bundle.js");

console.log("Building development version of Sol...");

bundle("Sol", "src/build/bannerDev.js", "src/Sol.js").then(
	/**
	* Runs when Sol is bundled successfully.
	* @param {string} code - The bundled code of Sol.
	*/
	code => {
		fs.writeFileSync("docs/js/sol-dev.js", code, {encoding: "utf8", flag: "w"});
		console.log("Done!");
	},

	/**
	* Runs when Sol failed to be bundled.
	* @param {string} error - An error message.
	*/
	error => {
		console.error(`Failed to bundle Sol:\n${error}`);
	}
);
