#! /usr/bin/env node --harmony

var fs = require('fs');
var chalk = require('chalk');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var vsprintf = require("sprintf-js").vsprintf;

var helpers = require('./helpers.js');

var version = '1.0.0';

var boilerplate_component_plain_script = fs.readFileSync(__dirname + '/boilerplate/component.ts', 'utf8');
var boilerplate_component_with_service_script = fs.readFileSync(__dirname + '/boilerplate/component-with-service.ts', 'utf8');
var boilerplate_component_stylesheet_script = fs.readFileSync(__dirname + '/boilerplate/component.less', 'utf8');
var boilerplate_component_template_script = fs.readFileSync(__dirname + '/boilerplate/component.html', 'utf8');
var boilerplate_component_spec_script = fs.readFileSync(__dirname + '/boilerplate/component.spec.ts', 'utf8');
var boilerplate_component_service_script = fs.readFileSync(__dirname + '/boilerplate/component.service.ts', 'utf8');
var boilerplate_locale = '{\n}';
var boilerplace_service_data = 'export interface %s {}';

console.log(chalk.bold.cyan('°º¤ø,¸¸,ø¤º°`°º¤ø,¸ ZEN CLI: ') + chalk.bold.green('Angular2 (rc.4) component generator') +
	chalk.bold.yellow(' (' + version + '). ') + chalk.blue('Type --help for usage'));

program
	.version(version)
	.arguments('<componentName> -s')
	.option('-c, --componentName <componentName>', 'Name of the component (must be PascalCase)')
	.option('-s, --service', 'Generates a service file and injects into component')
	.action(function(componentName) {
		co(function *() {
			var compName = componentName;
			var selectorName = helpers.convertComponentNameToSelector(componentName);
			var destDir = './' + selectorName;
			console.log(chalk.bold.cyan('Component: %s (with selector: %s) being created in: %s'),
				compName, selectorName, destDir);

			var injectService = (program.service !== undefined);
			var theComponentScriptTemplate = injectService ?
				boilerplate_component_with_service_script : boilerplate_component_plain_script;

			console.log('\r\n\r\n');
			var generatedComponentData = helpers
				.formatComponentData(theComponentScriptTemplate, injectService, compName, selectorName, destDir);
			var generatedTemplateData = helpers
				.formatComponentTemplate(boilerplate_component_template_script, selectorName);
			var generatedSpecData = helpers
				.formatComponentSpec(boilerplate_component_spec_script, compName, selectorName);
			var generatedServiceData = helpers
				.formatComponentService(boilerplate_component_service_script, compName, selectorName);
			
			helpers.createOutputDir(destDir);

			helpers.outputFile(destDir, generatedComponentData, selectorName + '.component.ts');
			helpers.outputFile(destDir, boilerplate_component_stylesheet_script, selectorName + '.less');
			helpers.outputFile(destDir, generatedTemplateData, selectorName + '.html');
			helpers.outputFile(destDir, generatedSpecData, selectorName + '.spec.ts');

			if(injectService) {
				helpers.outputFile(destDir, generatedServiceData, selectorName + '.service.ts');
			}

			helpers.outputFile(destDir, boilerplate_locale, 'locale.json');
			helpers.outputFile(destDir, vsprintf(boilerplace_service_data, [compName]), selectorName + '.ts');

			helpers.displaySummary(destDir);
			console.log(chalk.bold.cyan('[SUCCESS]\r\n'));
		});
	})
	.parse(process.argv);