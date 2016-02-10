
interface CsConstructorSource extends ConstructorBlock {
}


interface CsMethodSource extends MethodBlock {
    returnType: string;
}


interface CsPropertySource extends PropertyMethodMeta {
}


interface CsClassHeader extends ClassHeader {
}


interface CsClassMeta {
    classStart: CsClassHeader;
    fields: PropInfo[];
    classConstructors: CsConstructorSource[]
    properties: PropertyMethodMeta[];
    instanceMethods: CsMethodSource[];
    staticMethods: CsMethodSource[];
}


interface CsClassWithImportExportSource extends CsClassMeta {
    classImports: string[];
    classExport?: string[];
}


interface CsNamespaceSource {
    classImports: string[];
    namespaceStart: string[];
    classes: CsClassMeta[];
    namespaceEnd: string[];
}


// ==== lines ====
interface CsClassSourceLines {
    classComments: string[];
    annotations: string[];
    classStart: string[];
    fields: string[];
    classConstructors: string[];
    properties: string[];
    instanceMethods: string[];
    staticMethods: string[];
    classEnd: string[];
}
