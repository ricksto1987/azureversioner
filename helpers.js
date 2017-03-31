var xmlFormatter = require('xml-formatter');
var xmlJs = require('xml-js');
var fs = require('fs');
var vscode = require('vscode');

var writeFile = function (path, json) {
	var xml = xmlJs.json2xml(json, { spaces: 0 });
	xml = xmlFormatter(xml);
	fs.writeFileSync(path, xml);
}

var findManifestFile = function (path, manifestFilename) {
	var files = fs.readdirSync(path);
	var foundPath;
	for (let i = 0; i < files.length; i++) {
		if (foundPath !== undefined) {
			return foundPath;
		}
		if (fs.statSync(path + '/' + files[i]).isDirectory()) {
			foundPath = findManifestFile(path + '/' + files[i], manifestFilename);
		} else {
			if (files[i] === manifestFilename) {
				return path + '/' + files[i];
			}
		}
	}
}

var updateManifestVersion = function (path, version, elementNames, attributeName) {
	var fd = fs.openSync(path, 'r+');
	var xml = fs.readFileSync(path, 'utf-8');
	var json = JSON.parse(xmlJs.xml2json(xml, { compact: false, trim: false, spaces: 0 }));
	var jsonObjectFound = findJsonObject(json, elementNames);
	jsonObjectFound['attributes'][attributeName] = version;
	writeFile(path, json);
	fs.closeSync(fd);
}

var findJsonObject = function (jsonNode, elementNames) {

	for (let i = 0; jsonNode.hasOwnProperty('elements') && i < jsonNode.elements.length; i++) {
		for (let j = 0; j < elementNames.length; j++) {
			if (jsonNode.hasOwnProperty('elements') && jsonNode.elements[i].name === elementNames[j]) {
				jsonNode = findJsonObject(jsonNode.elements[i], elementNames.slice(1));
			}
		}
	}
	return jsonNode;
}

module.exports = {
	writeFile: writeFile,
	findManifestFile: findManifestFile,
	updateManifestVersion: updateManifestVersion,
	findJsonObject: findJsonObject
};