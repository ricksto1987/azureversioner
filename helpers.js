var vsprintf = require('sprintf-js').vsprintf;
var chalk = require('chalk');
var fs = require('fs');

var outputtedFiles = [];

var convertComponentNameToSelector = function(componentName) {
	var i = 0;
	var character = '';
	var selector = '';

	while (i < componentName.length) {
		character = componentName.charAt(i);
		if(i > 0 && character == character.toUpperCase()) {
			selector += '-';
			selector += character.toLowerCase();
		} else {
			if(i == 0) {
				selector += character.toLowerCase();
			} else {
				selector += character;
			}
		}
		i++;
	}

	return selector;
};

var formatComponentData = function(boilerplate, injectService, compName, selectorName, destDir) {
	var output = boilerplate;

	if(injectService) {
		output = vsprintf(
			output, [compName, selectorName, selectorName, selectorName, selectorName, compName + 'Service', compName]);
		console.log(chalk.bold.cyan('##### COMPONENT [with service injected]\r\n'));
	} else {
		output = vsprintf(output, [selectorName, destDir, selectorName, destDir, selectorName, compName]);
		console.log(chalk.bold.cyan('##### COMPONENT\r\n'));
	}
	
	console.log(chalk.bold.yellow(output + '\n'));
	return output;
};

var formatComponentSpec = function(boilerplate, compName, selectorName) {
	var output = boilerplate;
	output = vsprintf(output, [compName, selectorName + '.component', compName, compName]);

	console.log(chalk.bold.cyan('##### SPEC\r\n'));
	console.log(chalk.bold.yellow(output + '\n'));
	return output;
};

var formatComponentService = function(boilerplate, compName, selectorName) {
	var output = boilerplate;
	output = vsprintf(output, [compName, './' + selectorName, compName, compName]);

	console.log(chalk.bold.cyan('##### SERVICE\r\n'));
	console.log(chalk.bold.yellow(output + '\n'));
	return output;
};

var formatComponentTemplate = function(boilerplate, selectorName) {
	var output = boilerplate;
	output = vsprintf(output, [selectorName]);

	console.log(chalk.bold.cyan('##### TEMPLATE HTML\r\n'));
	console.log(chalk.bold.yellow(output + '\n'));
	return output;
};

var createOutputDir = function(destDir) {
	try {
		fs.mkdir(destDir);
	}
	catch(err) {
		chalk.bold.red(err);
	}
};

var outputFile = function(destDir, data, filename) {
	try {
		fs.writeFileSync(destDir + '/' + filename, data, 'utf8');
		outputtedFiles.push(filename);
	} catch (err) {
		chalk.bold.red(err);
	}
};

var displaySummary = function(destDir) {
	console.log(chalk.bold.cyan('[CREATE COMPONENT]\r\n\r\n' + destDir));
	for(var i = 0; i < outputtedFiles.length; i++) {
		console.log(chalk.bold.yellow((i == outputtedFiles.length - 1 ? '  └── ' : '  ├── ')) + chalk.bold.green(outputtedFiles[i]));
	}
	console.log('\r\n');
};

module.exports = {
	convertComponentNameToSelector: convertComponentNameToSelector,
	formatComponentData: formatComponentData,
	formatComponentSpec: formatComponentSpec,
	formatComponentService: formatComponentService,
	formatComponentTemplate: formatComponentTemplate,
	createOutputDir: createOutputDir,
	outputFile: outputFile,
	displaySummary: displaySummary
};