const fs      = require("fs");
const rollup  = require("rollup");
const image   = require("@rollup/plugin-image");
const glsl    = require("rollup-plugin-glsl");
const cleanup = require("rollup-plugin-cleanup");

/**
* Bundle Sol with Rollup.
* @function bundle
* @param {string} name - The name to give the bundle.
* @param {string} bannerSrc - The path to the the banner of the bundle.
* @param {string} mainSrc - The path to the entry point of the bundle.
* @returns {Promise<string>} A promise that is resolved with the bundled code of
* Sol if bundling was successful or rejected with an error message if bundling
* failed.
*/
function bundle(name, bannerSrc, mainSrc){
	return new Promise(async (onResolve, onReject) => {
		/**
		* The banner of the bundle.
		* @type {string}
		*/
		const banner = fs.readFileSync(bannerSrc, {
			encoding: "utf8",
			flag: "r"
		}).trim();

		/**
		* The input options for Rollup.
		* @type {RollupOptions}
		*/
		const inputOptions = {
			input: mainSrc,
			plugins: [
				image({
					include: "**/*.png",
					exclude: ["**/*.js", "**/*.glsl"],
					dom: false
				}),
				glsl({
					include: "**/*.glsl",
					exclude: ["**/*.js", "**/*.png"],
					compress: true,
					sourceMap: false
				}),
				cleanup({
					include: "**/*.js",
					exclude: ["**/*.png", "**/*.glsl"],
					extensions: "js",
					// Preserve JSDoc comments not containing @ignore or @module:
					comments: /^\*\*((?!@ignore|@module).|\n)+$/g,
					compactComments: true,
					lineEndings: "unix",
					maxEmptyLines: 0,
					sourcemap: false
				})
			]
		};

		/**
		* The output options for Rollup.
		* @type {OutputOptions}
		*/
		const outputOptions = {
			name: name,
			format: "iife",
			banner: banner
		};

		try{
			/**
			* The Rollup build of Sol.
			* @type {RollupBuild}
			*/
			const bundle = await rollup.rollup(inputOptions);

			/**
			* The Rollup output of Sol.
			* @type {RollupOutput}
			*/
			const output = await bundle.generate(outputOptions);

			/**
			* The bundled code of Sol with empty lines not following multi-line
			* comments and leading and trailing whitespace removed.
			* @type {string}
			*/
			const code = output.output[0].code
				.replace(/(?<!\*\/)\n\s*\n/g, "\n")
				.replace(/^[ \t]+/gm, "")
				.replace(/[ \t]+$/gm, "");

			onResolve(code);
		}catch(e){
			if(e.loc){
				onReject(
					[
						`${e.message}`,
						`At ${e.loc.line}:${e.loc.column} in ${e.loc.file}`
					].join("\n")
				);
			}else{
				onReject(`${e.message}`);
			}
		}
	});
}

module.exports = bundle;
