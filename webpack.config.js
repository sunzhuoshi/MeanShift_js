const ClosureCompiler = require('google-closure-compiler-js').webpack;
const fs = require('fs');

var options = {
	languageIn: 'ES6',
	languageOut: 'ES5',
	compilationLevel: 'ADVANCED',
	warningLevel: 'VERBOSE',
	externs: ['./build/meanshift_js-externs.js']
}

//< remove it when google closure compiler webpack plugin supports extern path string
function toArray(arg) {
	if (typeof arg === 'string') {
		return [arg];
	} else if (arg) {
		return arg;
	} else {
		return [];
	}
}

function readExternFile(extern) {
	if ('string' === typeof extern || 
		'object' === typeof extern && undefined === extern.src && 'string' === typeof extern.path) {
		var newExtern = {
			src: '',
			path: 'string' === typeof extern? extern: extern.path
		};
		fs.readFile(newExtern.path, 'utf8', (err, src) => {
			if (err) {
				throw new Error(err);  
			}
			else {
				newExtern.src = src;		
			}
		}); 
		return newExtern;	  
	}
	else {
		return extern;
	}
}

function translateOptions(options) {
	var externs = options.externs;
	if (externs) {
		externs = toArray(externs);
		options.externs = externs.map(extern => readExternFile(extern));
	}
}

// we have to translate 'externs' content, 
// due to google closure compiler's webpack plugin doesn't support extern path string(OK with 'src' content) 
translateOptions(options);

//> remove

module.exports = {
	entry: './build/main.js',
	output: {
		path: __dirname,
		filename: './build/MeanShift.min.js'
	},
	plugins: [
		new ClosureCompiler({
			options: options
		})
	],
	module: {
		loaders: []
	}
};
