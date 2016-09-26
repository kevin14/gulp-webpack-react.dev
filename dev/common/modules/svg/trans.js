var fs = require('fs');
var path = require('path');
var dirs = fs.readdirSync('./icons');
var regex = /^\d+-([\w\W-]*)/

dirs.forEach(function(svgName,index){
	if (/^\d+-/.test(svgName)) {
		var match = svgName.match(regex);
		fs.renameSync(path.join(__dirname,'./icons/'+svgName),path.join(__dirname,'./icons/'+match[1]));
	}
})