var webpack = require("webpack"),
	htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	context: __dirname + "/src",
	debug: true,
	devtool: '#inline-source-map',

	entry: {
		main: "./main.js",
		vendor: ["mithril","./style.css", "compose-extend", "lodash.bindall", "eventemitter3"]
	},
	output: {
		path: __dirname + "/public/",
		filename: "[name].bundle.js",
		chunkFilename: "[id].chunk.js",
		sourceMapFilename: "debugging/[file].map"
		//publicPath: "build/"
	},
	module: {
		loaders: [      
			// { test: /\.less$/, loader: 'style!css!less' }, // use ! to chain loaders
      		{ test: /\.css$/, exclude: /\.useable\.css$/, loader: 'style!css' },
			{ test: /\.useable\.css$/, loader: 'style/useable!css' },
			{ test: /\.(png|jpg)$/, loader: 'url?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest,
      		{ test: /\.html$/, loader: "raw" }
		]
	},
	resolve: {
		// you can now require('file') instead of require('file.coffee')
		extensions: ['', '.js', '.json'] 
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
	//	new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new htmlWebpackPlugin({
			title: 'Loan Manager',
			template: 'src/index.html'
		})
		//, new webpack.SourceMapDevToolPlugin('[file].map', null)
		//, "[absolute-resource-path]", "[absolute-resource-path]"

		,new webpack.SourceMapDevToolPlugin('[file].map', null, "sources/[resource-path]", "sources/[resource-path]")
	]
}