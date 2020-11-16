const UglifyJS = require("uglify-es");

/**
* Minify code with UglifyJS.
* @function minify
* @param {string} code - The code to minify.
* @returns {Promise<string>} A promise that is resolved with minified code if
* minification was successful or rejected with an error message if minification
* failed.
*/
function minify(code){
	return new Promise((onResolve, onReject) => {
		/**
		* The target ECMAScript version to use.
		* @constant
		* @type {number}
		* @default 9
		*/
		const ECMA = 9; // ES2018

		/**
		* The UglifyJS result.
		* @type {Object<string, any>}
		*/
		const result = UglifyJS.minify(code, {
			ecma: ECMA,
			parse: {
				ecma: ECMA
			},
			compress: {
				ecma: ECMA,
				passes: 8
			},
			mangle: true,
			output: {
				beautify: false,
				// Preserve comments containing @license:
				comments: /^.*@license.*$/gm,
				ecma: ECMA
			}
		});

		if(result.error){
			onReject(
				[
					`${result.error.message}`,
					`At ${result.error.line}:${result.error.col}`
				].join("\n")
			);
		}else{
			/**
			* The minified code with a trailing newline.
			* @type {string}
			*/
			const code = (result.code + "\n").replace(/\n+$/g, "\n");

			onResolve(code);
		}
	});
}

module.exports = minify;
