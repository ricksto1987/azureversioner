var helpers = require('./helpers');
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    disposable = vscode.commands.registerCommand('extension.changeVersionNumbers', function () {
        changeVersionNumbers();
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function changeVersionNumbers() {

    vscode.window.showInputBox({ prompt: 'Enter Application Version): ' })
        .then(function (applicationVersion) {

            if (applicationVersion === "") {
                vscode.window.showInformationMessage("Please provide an Application version string to proceed");
                return;
            }
            vscode.window.showInputBox({ prompt: 'Enter Service Version): ' })
                .then(function (serviceVersion) {

                    updateManifest('ApplicationManifest.xml', applicationVersion, ['ApplicationManifest'], 'ApplicationTypeVersion');

                    if (serviceVersion !== "") {
                        updateManifest('ServiceManifest.xml', serviceVersion, ['ServiceManifest', 'ServiceManifestImport', 'ServiceManifestImport'], 'Version');
                        updateManifest('ApplicationManifest.xml', serviceVersion, ['ApplicationManifest', 'ServiceManifestImport', 'ServiceManifestRef'], 'ServiceManifestVersion');
                    }
                });
        });
}

function updateManifest(manifestFilename, version, elementNames, attributeName) {
    var openProjectRootPath = vscode.workspace.rootPath;
    var path = helpers.findManifestFile(openProjectRootPath, manifestFilename);
    helpers.updateManifestVersion(path, version, elementNames, attributeName);
}

// this method is called when your extension is deactivated
function deactivate() {
    return new Promise();
}

exports.deactivate = deactivate;