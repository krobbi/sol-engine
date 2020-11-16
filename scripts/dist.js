/*
* Node script: dist
* Build the distribution versions of Sol for the /dist folder.
*/

const fs     = require("fs");
const bundle = require("./util/bundle.js");
const minify = require("./util/minify.js");

console.log("Building distribution versions of Sol...\nBundling...");

bundle("Sol", "src/build/bannerDist.js", "src/Sol.js").then(
	/**
	* Runs when Sol is bundled successfully.
	* @param {string} code - The bundled code of Sol.
	*/
	code => {
		fs.writeFileSync("dist/sol.js", code, {encoding: "utf8", flag: "w"});
		console.log("Minifying...");
		return minify(code);
	},

	/**
	* Runs when Sol failed to be bundled.
	* @param {string} error - An error message.
	*/
	error => {
		throw new Error(`Failed to bundle Sol:\n${error}`);
	}
).then(
	/**
	* Runs when Sol is minified successfully.
	* @param {string} code - The minified code of Sol.
	*/
	code => {
		fs.writeFileSync("dist/sol.min.js", code, {encoding: "utf8", flag: "w"});
		console.log("Done!");
	},

	/**
	* Runs when Sol failed to be bundled or minified.
	* @param {string} error - An error message.
	*/
	error => {
		console.error(`Failed to build Sol:\n${error}`);
	}
);
