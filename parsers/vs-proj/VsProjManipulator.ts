"use strict";
import Strings = require("../../../ts-mortar/utils/Strings");
import FileSectionManipulator = require("../../file-io/FileSectionManipulator");

/**
 * @author TeamworkGuy2
 * @since 2015-8-11
 */
class VsProjManipulator {
    private vsProjFileManipulator: FileSectionManipulator;
    private webConfigFileManipulator: FileSectionManipulator;


    constructor(vsProjFilePath: string, webConfigFilePath: string) {
        this.vsProjFileManipulator = new FileSectionManipulator();
        this.vsProjFileManipulator.loadFile(vsProjFilePath, [["<ItemGroup>", "</ItemGroup>"]]);

        this.webConfigFileManipulator = new FileSectionManipulator();
        this.webConfigFileManipulator.loadFile(webConfigFilePath, [["<serviceActivations>", "</serviceActivations>"], ["<services>", "</services>"]]);
    }


    public getProjFileSections() {
        return this.vsProjFileManipulator.getSections();
    }


    public getWebConfigFileSections() {
        return this.webConfigFileManipulator.getSections();
    }


    public addTypeScriptCompile(fileRelativePath: string) {
        this.vsProjFileManipulator.addSectionLines("TypeScriptCompile", ['    <TypeScriptCompile Include="' + fileRelativePath + '" />']);
    }


    public addCsClass(fileRelativePath: string) {
        this.vsProjFileManipulator.addSectionLines("Compile", ['    <Compile Include="' + fileRelativePath + '" />']);
    }


    public addServiceNamespace(projectNamespaceName: string, serviceImplNamespace: string, serviceInterfacePathNamespace: string, serviceWebAddressPath: string): void {
        this.addService(Strings.replaceAll(serviceImplNamespace, ".", "\\"), serviceImplNamespace.substr(projectNamespaceName.length + 1),
            Strings.replaceAll(serviceInterfacePathNamespace, ".", "\\"), serviceInterfacePathNamespace.substr(projectNamespaceName.length + 1),
            serviceWebAddressPath);
    }


    public addService(serviceImplPath: string, serviceImplNamespace: string, serviceInterfacePath: string, serviceInterfacePathNamespace: string, serviceWebAddressPath: string): void {
        var serviceActivationsLines = ['        <add service="' + serviceImplNamespace + '" factory="System.ServiceModel.Activation.WebServiceHostFactory" relativeAddress="' + serviceWebAddressPath + '" />'];
        var serviceEndpointLines = [
            '    <service name="' + serviceImplNamespace + '" behaviorConfiguration="serviceBehaviour">',
            '      <endpoint address="" binding="webHttpBinding" bindingConfiguration="webHttpBinding" behaviorConfiguration="webHttpBehavior" contract="' + serviceInterfacePathNamespace + '" />',
            '    </service>'
        ];
        this.webConfigFileManipulator.addSectionLines("serviceActivations", serviceActivationsLines);
        this.webConfigFileManipulator.addSectionLines("services", serviceEndpointLines);

        this.addCsClass(serviceImplPath);
        this.addCsClass(serviceInterfacePath);
    }


    public saveProjectFiles(vsProjFilePath?: string, webConfigFilePath?: string) {
        this.webConfigFileManipulator.saveFile(webConfigFilePath);
        this.vsProjFileManipulator.saveFile(vsProjFilePath);
    }

}

export = VsProjManipulator;
