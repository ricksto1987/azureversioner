<h1>Azure Manifest Versioner</h1>
<br/>

Designed to save time updating manifest file version numbers normally performed manually or with find and replace for Application and Service. This updates the Application version number attribute and Service version attributes both in the service manifest and the reference to that service in the Application manifest.

## Features

Type-in the Application version and Service version for the selected package directory and let the extension update the Application and Service Manifest version attributes.

<br/>

## How to Use

- Install the extension
- Use the command palette and search for 'Change Version Number'
- Enter an Application version string. Hit return.
- Enter a Service version string. Hit return.
- The extension will search for all ApplicationManifest.xml and ServiceManifest.xml files in your projects root directory, updating the version strings to ones you entered.


## Release Notes

<br/>
<u>30/03/2017</u>
