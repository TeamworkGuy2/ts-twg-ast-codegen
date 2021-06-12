# Change Log
All notable changes to this project will be documented in this file.
This project 'tries' to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.25.0](N/A) - 2021-06-12
#### Changed
* Update to TypeScript 4.3


--------
### [0.24.4](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/aa423838cb5ce3572e88745a02c571e358429121) - 2021-03-13
#### Added
* Added `TransformFile` from `ts-file-io@0.3.0`


--------
### [0.24.3](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/a453aaec370ad9939a26872b8c9d08846226760d) - 2021-01-10
#### Changed
* Make ast-types `Field.comments` and `Method.comments` optional so that manually building these objects in code is simpler
* Add `separator` paramaters to `StringCase` methods to allow customization of underscore casing, can pass '-' to work with `dash-casing` strings
* Remove private `StringCase.isCharAtUpperCase()` function


--------
### [0.24.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/0c7fcf25529ab8df6b3372144440c4301f8bc655) - 2021-01-01
#### Changed
* Fix TypeScript compiler errors in `StringCase` that weren't showing up until this package was imported into another project


--------
### [0.24.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/440cbfafd0e7e09bf34abaf67737b2dc6255abf5) - 2020-11-23
#### Changed
* Bring `ast-types.d.ts` in line with `jparse-code@0.20.0`


--------
### [0.24.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/28ea33913dacd63b3998ce7ef985bb021cdf6de7) - 2020-11-14
#### Added
* `type-usage.d.ts` with `TypeUsage` interfaces
* Added `TypeTracking` module with `is*Usage()` and `typeUsageToString()` functions
* `ExtractAst.extractAnnotationArgumentTypes()`

#### Changed
* `ExtractAst` `extractInheritedTypeNames()` and `extractFieldTypeNames()` modified to return arrays of objects referencing where each type is used rather than `StringMap`s
* Removed C# primitive wrapper types from `TypeConverter.isPrimitive()`, e.g. `Int16/32/64`
* Adjust `ExtractAst.claimParams()` to return an object with arrays of parameters rather than object with maps of parameter types


--------
### [0.23.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/e4314e411c5956619653c848b2f1f6e985c74416) - 2020-11-05
#### Changed
* `ExtractAst` `extractInheritedTypeNames()` and `extractFieldTypeNames()` modified to return `StringMap`s of arrays of objects referencing where each type is used rather than just a boolean.
* Added C# primitive wrapper types to `TypeConverter.isPrimitive()`, e.g. `Int16/32/64`
* Added `object` to the list of types in `TypeConverter.isCore()`
* Added basic `ExtractAstTest` unit test


--------
### [0.22.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/9c08310d9d02a8a93e1f3efe96fc46a7a6fc16e8) - 2020-09-04
#### Changed
* Update to TypeScript 4.0


--------
### [0.21.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/b1000f8a3f599437efc8625334fb474c0012918c) - 2019-11-09
#### Changed
* Update to TypeScript 3.7


--------
### [0.21.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/c9bc92569c1970b666b66451173a11b3d26831fa) - 2019-07-05
#### Changed
* Update to TypeScript 3.5


--------
### [0.21.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/ee5e8ea94a2ca6657d68ad4fcd74d7b54c1b9e19) - 2019-03-20
#### Changed
 * Renamed project from `ts-code-generator` -> `ts-twg-ast-codegen` to reflect this project's basis on the TWG AST format, see [jparse-code](https://github.com/TeamworkGuy2/JParseCode).
 * Consolidated some `ExtractAst` and `TypeConverter` code
 * Now dependent on `String.prototype.repeat()` instead of `new Array().join()` internally which may not be available on older platforms without a polyfill. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat#Polyfill


--------
### [0.20.3](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/d3710dd543b38e0e80f788e0b29a1b167154795b) - 2019-03-19
#### Changed
* Adjusted ast-types.d.ts to match jparse-code@0.16.1
  * Added `ClassSignature.annotations` and `comments`


--------
### [0.20.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/198310f564c00f49a2e53b90b7fca0cd4f2d18e0) - 2018-12-29
#### Changed
* Forgot to update package.json in previous version `0.20.1`


--------
### [0.20.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/e84de4ff36b928c15d80bdf2aa8995a20504d9b5) - 2018-12-29
#### Changed
* Update to TypeScript 3.2
* Update @types dependencies


--------
### [0.20.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/4fd4bdad8ae7d618d99d76c378bcadc23b5652f5) - 2018-10-13
#### Changed
* Update to TypeScript 3.1 and fix code to work with new keyof behavior
* Update dev dependencies and @types
* Enable tsconfig.json `strict` to replace other strict options
* Removed compiled bin tarball in favor of git tags and github releases

#### Removed
* code-types.d.ts since it is not used


--------
### [0.19.6](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/1b0472bbba9deacb21e90e15b14b70a77244df76) - 2018-09-14
#### Changed
* Adjusted ast-types.d.ts to match jparse-code@0.15.4
  * Added `Field.initializer`
  * Added `MethodParameter` `parameterModifiers` and `annotations`
  * Changed `Annotation.arguments` to be a string map


--------
### [0.19.5](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/8b146cb576f135828966c3f4e1d7834f7e289e92) - 2018-04-09
#### Fixed
* Fix error with certain TypeScript 2.8 compile settings


--------
### [0.19.4](N/A) - 2018-04-07
#### Added
* tarball file in `bin/` for release
* added npm script `build-package` to package.json referencing external process to generate tarball

#### Fixed
* `TsParameterGen.createConvertObjectCode()` now properly prettyPrints objects with one property
* Issue passing `CodeAst.Type` parameter to `TypeConverter.createTypeTemplateToStringCode()`
* Error trying to import only `SimpleTepmCompiler` into another project, added some .d.ts references


--------
### [0.19.3](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/1c998785e3ba958d7f45444a94feb86ca981b493) - 2018-03-31
#### Changed
* Update to TypeScript 2.8
* Update dependencies: @types/mocha
* Update documentation

#### Removed
* tsMeta/modifiers: Access.ts, Modifier.ts
* Removed dependency: @types/node


--------
### [0.19.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/e80e73f49dcc5213eac7e020d04148860577843e) - 2018-03-01
#### Changed
* Update to TypeScript 2.7
* Update dependencies: mocha, @types/chai, @types/mocha, @types/node
* Enable tsconfig.json `noImplicitAny`


--------
### [0.19.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/5a8f7f9a0b70485fa34781c83cd2f6fa61e8d97c) - 2017-11-19
#### Changed
* `package.json` added `strictNullChecks` and code changes for null types


--------
### [0.19.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/90e3c37c4b45ed46227c6713bf5b376b1b551b76) - 2017-10-26
#### Removed
* Removed interfaces: `DtoPropertyTemplatedNamed`, `DtoPropertyMap`, `DtoPropertyTemplateMap`, `DtoModelTemplate`, and `DtoModelTemplateNamed` since they could either be easily replaced by `StringMap<*>` types or were unused.


--------
### [0.18.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/e17236bc267a7535bc0b9b78297157d56aed8c07) - 2017-10-16
#### Fixed
* Fixed TypeConverter function calls to include new `nullableSymbol` parameter


--------
### [0.18.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/9e0179b56af883c687da52a9f09633e80b953977) - 2017-10-16
#### Changed
* TypeConverter `typeToString()`, `parseAndConvertTypeTemplate()`, and `parseAndConvertTypeTemplateString()` functions now include an optional `nullableSymbol` parameter (default value `?` for C#), you can pass ` | null` for TypeScript and types will be correctly parenthesized
* Added a `TypeConverter.typeToString()` test
* Updated mocha@4.0.0 library and node@8.0.0 type definition dependencies


--------
### [0.18.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/6d1c625e1e3d5ecc9367947824e2d696ed404753) - 2017-10-14
#### Fixed
* Fixed `ast-types.d.ts` `CodeAst` definitions to properly match [jparse-code](https://github.com/TeamworkGuy2/JParseCode) library output
* Fixed `StringCase` to better handle numbers when converting to underscore casing

#### Removed
* Removed `generators/c-sharp` classes `CsClass`, `CsServiceModel`, and `CsToSource`
* Removed `ts-mortar` dependency


--------
### [0.17.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/299eff221acb01d404ed303e9674ac59ddac2ec9) - 2017-10-10
#### Changed
* Marked `DefaultGenTools` `printer` field public, modify at your own risk
* Fixed `package.json` name field (forgot to rename when project renamed to `ts-code-generator@0.4.0`)

#### Removed
* Removed `file-io/` (contained ReadFile, WriteFile, and TransformFile, FileSectionManipulator), moved to `ts-file-io` project
* Removed `parsers/` (contained vs-proj/VsProjManipulator), moved to `ts-file-io` project


--------
### [0.16.6](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/86cffc15cd38354b990e04946d4ebd8ab57dd86c) - 2017-08-06
#### Changed
* Update to TypeScript 2.4


--------
### [0.16.5](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/789fe6b9eee548e5325d6e9b250749ee1fd6d0fe) - 2017-05-09
#### Changed
* Update to TypeScript 2.3, added tsconfig.json, use @types/ definitions
* Documentation changes to work better with Visual Studio


--------
### [0.16.4](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/a4e1946176848c2984fbf08c511d5336d035aa97) - 2017-04-13
#### Changed
* Renamed SimpleTemplateCompiler internal variables and made them public (delimiterStart, delimiterEnd, dataNameToExpression, expressionToDataName, expressions)


--------
### [0.16.3](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/cf848451d9b5883da455137b700a193492bea380) - 2017-01-28
#### Added
* Added `FieldGen.FieldGenConverters` interface

#### Changed
* Added optional `toLocal` property to `DtoProperty.server` and `DtoPropertyTemplate.server` types


--------
### [0.16.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/502885a617bd36175a91973166b0d45d3300e5c4) - 2016-12-21
#### Changed
* Removed "use strict" and tested compatibility with TypeScript 2.0


--------
### [0.16.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/def1365ebb9030eabbe67814bce0a027b24f740a) - 2016-08-24
#### Fixed
Fixed `DtoPropertyConverter.parseAndConvertTemplate()` to handle `defaultValue` correctly
Converted tests from qunit to mocha and chai


--------
### [0.16.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/0251c088bc27be13b133e31a96454aa2140cb413) - 2016-08-23
#### Changed
* Changed some TransformFile functions
  * Changed return/callback types to `{ srcLines: string[]; transformedLines: string[] }`
  * Renamed/replaced TransformFile._transformFileToLines() -> TransformFile.transformFileToLines()
  * Removed gutil.log() messages from TransformFile functions
* Added simple StringCase test case
* Updated some definition file paths to match DefinitelyTyped

#### Removed
* original TransformFile.transformFileToLines() function


--------
### [0.15.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/a6b52ff3c4b61f2e61df9a5977027473bda3dbe3) - 2016-5-15
#### Added
* TypeConverter functions: isPrimitive(), isCore(), and isGeneric()

#### Changes
* DtoProperty and DtoPropertyTemplate now extend PropertyConversionTemplate directly
* DtoProperty now requires 'toLocal', 'toService', 'server', and 'server.name' properties (previously these were optional)
* DtoModelConverter renamed DtoPropertyConverter and modified parameters to accept DtoPropertyTemplate and TypeTemplateParser types
* Finished documenting TypeConverter functions
* TypeConverter signature changes: typeToString(), TypeScript.parseAndConvertTypeTemplate(), and TypeScript.parseAndConvertTypeTemplateString() now support optional 'includeNullability' parameter

#### Removed
* TypeConverter.TypeScript.isPrimitiveOrBuiltInType() - use isPrimitive() and isCore() instead


--------
### [0.14.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/4a97a522f8eb1225a50414dbffb61d1fbdb210bc) - 2016-5-14
Integrate with [lokijs-collections](https://github.com/TeamworkGuy2/lokijs-collections) ModelDefinitions and DataCollection/DtoCollection Models

#### Added
* DtoModelConverter - for converting DtoPropertyTemplate to DtoProperty
* interfaces: DtoPropertyMap, DtoPropertyTemplateMap, DtoModel, and DtoModelTemplate, and DtoModelNamed

#### Changed
* Renamed/Changed interfaces
  * DtoModelTemplate renamed DtoModel containing a map of DtoProperty, no longer contains toServiceNameConverter, since this can just be conversion step in your own code
  * DtoModelTemplate now contains a map of DtoPropertyTemplate
  * DtoProperty modified to mirror DtoPropertyTemplate
  * DtoPropertyTemplate now extends TypeTemplate and TypeMetaData (to mirror DtoProperty), properties moved to new PropertyConversionTemplate which doesn't extend DtoProperty

#### Removed
* TypesDefinition interface (unused)
* OptionalNamedProperty (unused)


--------
### [0.14.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/6e6f33ce252270d07b50a28d0a940de721801d94) - 2016-5-14
#### Added
* CodAst.Field.required field to interface
* model-types.d.ts added:
  * ParameterInfo - similar to PropInfo with 'required' flag
  * TypeTemplate - similar to TypeInfo without 'arrayDimensionCount' (used for loading user data before using TypeConverter function to convert it to CodeAst.Type)
* TypeConverter additions to use CodeAst as common type whenever possible:
  * TypeScript.parseTypeTemplate() - to parse and convert a type template string to a CodeAst.Type with TypeScript types
  * TypeScript.parseAndConvertTypeTemplate() - to parse and convert a type template string to a CodeAst.Type with TypeScript types, and return the typeToString() version of it

#### Changed
Changes designed to use CodeAst interfaces as common type wherever possible
* Renamed interfaces:
  * CodeAst.GenericType -> CodeAst.Type
* CodeBlock.Executable.paramaters type changed PropInfo[] -> new ParameterInfo[]
* Renamed TsFieldGen typInfoToField() -> typeTemplateToField() and no longer supports overrides from the TypeTemplate, the parsed type template string is used for all type properties
* TypeConverter:
  * TypeScript.typeToString() hoisted to top level typeToString()
  * TypeScript.parseType() hoisted and renamed parseTypeTemplate()
  * TypeScript.createTypeToStringCode() renamed and modified TypeScript.createTypeTemplateToStringCode()
  * TypeScript.createTypesToStringCode() renamed and modified TypeScript.createTypeTemplatesToStringCode()

#### Removed
* TypeInfo interface in favor of the new ParameterInfo or TypeTemplate interfaces or the modified PropInfo or TypeProperty interfaces
* TypeConverter TypeScript.parseCsOrJavaType() in favor of TypeScript.parseAndConvertTypeTemplateString() or TypeScript.convertSimpleType()


--------
### [0.13.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/c6063c79d003b5e52e5d03ce9fe9c22a957818bc) - 2016-5-13
#### Added
  * DtoModelTemplateNamed to model-types.d.ts
  * Unit test for DefaultGenTools and DefaultPrettyPrinter

#### Changed
* cs-types.d.ts - all the interfaces exported by this file are now nested inside a module named CsSource
* model-types.d.ts:
  * renamed NamedDtoPropertyTemplate -> DtoPropertyTemplateNamed
  * moved *Block and other interfaces from the bottom of this file to new code-types.d.ts file and nested them inside a module named CodeBlock
* utils.d.ts - renamed GenTools deindent() -> dedent()

#### Fixed
* DefaultGenTools bugs:
  * indent() - wasn't appending lines to the 'dst' array, instead it was overwritting starting at index 0
  * indentNonEmpty() - wasn't appending empty lines, it was skipping them, it now appends empty lines as-is with no indent

#### Removed
* removed interface methods GenTools addIndent() and addIndentsToNonEmpty()


--------
### [0.12.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/c2c63681d200f4e03a2f1b3106fc4619614b859b) - 2016-4-16
#### Added
* A CHANGELOG.md covering all previous releases after being reminded about the need for change logs from http://keepachangelog.com/

#### Changed
* moved .d.ts definition files to separate definitions library
* changed ts-mortar dependency location
* Updated TypeScript compiler to 1.8
* Removed unused dependencies, updated existing dependencies

#### Removed
* Removed unused CsModel.ts, CsSearchCritiera.ts, and ParserPosition.ts files


--------
### [0.11.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/c7d3e9cc5805c4946b5ceced07841780c74c271d) - 2016-03-22
#### Changed
* TsFieldGen.createFieldsSrcCode() added 'fieldName' and 'context' (CodeContext) parameters to callbacks


--------
### [0.11.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/a8afba91424b9d6846a9f6d940af0888284abf03) - 2016-03-21
#### Added
* TsFieldGen.typeInfoToField() - create a CodeAst field with default 'public' access from a field name and 'TypeInfo'

#### Changed
* FieldGen.createFieldsSrcCode() default type converters now return unknown types, rather than throwing an error
* Added and renamed some test cases, including new TsFieldGenTest

#### Fixed
* TypeConverter.typeToString() bug where compound types (generic types, types with array dimensions, etc.) contained ', ' pieces of the compound type
* TypeConverter._genericTypeToString() bug where '?' was being appended to the end of the returned type array (nullability is supposed to be appended to property names, not types)
* TsFieldGen.createFieldsSrcCode() bug where nullable wasn't being included with property names


--------
### [0.11.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/9234721bc5231e5b8777cc539a0d66799d6859f0) - 2016-03-20
#### Added
* new generators/typescript/TsFieldGen.ts for generating TypeScript field declarations from CodeAst fields, includes: createFieldsSrcCode()
* new generators/typescript/TsObjectGen.ts for generating an object's fields from a string map of 'TypeInfo', includes: createConvertObjectCode()
* new generators/typescript/TsParameterGen.ts for generating paramaters source code from 'TypeInfo' , including: createParameterCode() and createParametersCode()

#### Changed
* TypeConverter parseType(), parseTypeOptionality(), and parseTypeArrayDimensions() return type moved to TypeInfo interface and 'dataType' property renamed 'type'
* Renamed TypeConverter createParameterCode -> typeToString()
* Added nullable, arrayDimensions, and arrayDimensionCount to ast-types and model-types

#### Removed
* TypeConverter.createParametersCode()


--------
### [0.10.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/3ef89ccb4ba8f5eac93d4559ad6efd14121050df) - 2016-03-19
#### Changed
* Renamed ExtractTypes -> ExtractAst and added claimParams() and findOneAnnotationProp()


--------
### [0.9.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/4aebab6e53f8c63b2d8aa7eb11ff94910d81a1f8) - 2016-03-19
#### Changed
* Renamed project 'ts-code-gen-tools' and standardized folder names using dash-case
* Moved whitespace/ directory from tsMeta/ -> strings/
* Moved tsMeta/app.js -> ts-meta/App.ts


--------
### [0.8.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/ef0c9727a058f6b67be53b7ded27adf30df95ede) - 2015-02-10
#### Added
* code-types/ExtractTypes.ts for extracting CodeAst data, including extractInheritedTypeNames(), extractFieldTypeNames(), and extractGenericTypes()
* code-types/ast-types.d.ts with interfaces for the JSON types generated by the [jparse-code](https://github.com/TeamworkGuy2/JParseCode) library

#### Changed
* StringArray.stringMapToArrayJoin() only accepts objects with properties that are string[], plain string properties are no longer supported
* Renamed cstypes.d.ts -> cs-types.d.ts


--------
### [0.7.4](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/b09f044563ae51b50f51ce59a424267e19d29d22) - 2016-02-09
#### Added
TypeConverter.isPrimitiveOrBuiltInType()

#### Fixed
* StringCase.toCamelCase() bug - was returning TitleCase


--------
### [0.7.3](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/2cc1e9ac1a378bc70e217df85b8d9bd9522bcbfe) - 2015-12-29
#### Changed
* TypeConverter parseCsOrJavaType(), createParameterCode(), and createParametersCode() 'returnUnknownTypes' flag

#### Fixed
* TypeConverter fix to handle C# 'bool'


--------
### [0.7.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/4042b2c22edf2e722e5140167532f2eb731ecab3) - 2015-12-17
#### Changed
model-types.d.ts:
* Added OptionalNamedProperty interface
* Removed NamedDtoProperty interface
* Added NamedDtoPropertyTemplate interface


--------
### [0.7.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/af7536569fc09c5072e26a1ccb0031500bc7114c) - 2015-12-16
#### Changed
model-types.d.ts:
* Documentation additions
* new DtoProperty 'server' property


--------
### [0.7.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/43ee41566aa268a24175ca69815c483632bbfb6b#diff-b9cfc7f2cdf78a7f4b91a753d10865a2) - 2015-12-16
#### Added
* Added qunit.d.ts and Q.d.ts definition files

#### Changed
Renamed various model-types.d.ts types:
* PropInfo -> TypeMetaData
* PropertyField -> PropInfo
* ServiceProperty -> DtoProperty
* NamedServiceProperty -> NamedDtoProperty
* WebServiceModelDef -> DtoModelTemplate


--------
### [0.6.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/b78e20c83353f58aeb6459c8c16108cd2b937ac9) - 2015-11-21
#### Changed
* Removed TransformFile transformFileToFile() and transformFileToFileAsync() unused 'compileTypeScript' flag
* Removed TransformFile.convertTemplateFile() unused 'successMsg' parameter


--------
### [0.5.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/39917cf1e19fcbce053f58e0782b6654a4b4222f) - 2015-11-21
#### Changed
Removed WriteFile gutil.log() lines, rely on existing error callbacks instead


--------
### [0.5.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/dc4d4cc756345ede8c6174c6f96141dd1a907e7b#diff-b9cfc7f2cdf78a7f4b91a753d10865a2) - 2015-11-21
#### Changed
TransformFile - existing functions changed to synchronous, added separate async functions suffixed by '*Async'


--------
### [0.4.2](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/eb478dcf7dc57c5fca77133d94b78f6c96811b64) - 2015-11-17
#### Changed
Made TransformFile.MatchOperation enum and TransformFile.ReplaceVar interface public

#### Fixed
TypeConverter parseCsOrJavaType() and createTypeToStringCode() bugs resulting in incorrect array dimensions and data type


--------
### [0.4.1](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/f02b84fe82be72f75dae2f6f6c32f51a7f3ad3e6#diff-b9cfc7f2cdf78a7f4b91a753d10865a2) - 2015-11-16
#### Added
* SimpleTemplateCompiler for simple templates (Handlebars or Mustache style) but without any features, just for simple build time code generating, not meant for runtime/prod use
* TransformFile for reading input files, transforming text lines, replacing template variables, and optionally writing the result to a destination file
* TypeConverter for simple data type signature parsing/converting (e.g. 'long[][]' -> { type: 'number', arrayDimensionCount: 2, required: true })

#### Changed
More refactoring to flatten directory structure.


--------
### [0.4.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/894ad735808be3bb1e07efc76e01e7c0461fb358) - 2015-11-13
#### Added
* qunit test runner
* StringArray instance implementation which builds a string array via methods like add(), addAll(), insert(), prefixNonEmpty(), etc.

#### Changed
* Renamed package.json project name from TsCodeGenerator -> ts-code-generator to follow general javascript project conventions
* Moved node .d.ts definition files to definitions/node/ directory

#### Removed
* .gitignore file since this is tool (git) specific and this library tries not to have any tool specific code such as IDE files and git ignore files


--------
### [0.3.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/886006eb911eebaeafae0be0d2ddc5e67d66200e) - 2015-11-11
#### Added
* LICENSE and README files

#### Changed
* moved project specific .d.ts definition files out of definitions/ directory into various other folders specific to each of their roles
* Renamed types in model-types.d.ts and implementations:
  * ServiceTypesDefintion -> WebServiceModelDef
  * ServiceProperty serviceTypeName -> servicePropType
  * TypeInfo typeName -> type
  * TypeProperty typeName -> type


--------
### [0.2.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/26d046d49199fb63ae1b158ee19e57e0e594dced) - 2015-11-08
#### Notable
* Setup unit tests
* Added vs-proj file manipulation and related file-io utilities
* Added string utils for manipulating lines of text (i.e. source code), including: replaceAll(), removeLeading(), removeTrailing(), StringArray including stringMapToArrayJoin(), and StringCase including toUnderscoreCase(), toSeparatedCase(), toTitleCase(), toCamelCase()
* Flattened the project directory so it isn't inside a sub-directory of the project root and removed Visual Studio specific project files
* Moved tsMeta/definitions/ -> definitions/
* Added ts-mortar library dependency for utility functions

#### Added
* tsMeta: tests.ts
* tsMeta/file-io: FileSectionManipulator.ts, ReadFile.ts, WriteFile.ts
* tsMeta/file-io/vsproj: VsProjManipulator.ts, 
* tsMeta/generators/c-sharp: CsToSource.ts
* tsMeta/tests: TestUtil.ts, test-types.d.ts
* tsMeta/tests/utils: StringUtilTest.ts, StringUtil.ts

#### Changed
* updated package.json dependencies, remove unused
* moved tsMeta/templates/generators/ -> tsMeta/generators/


--------
### [0.1.0](https://github.com/TeamworkGuy2/ts-twg-ast-codegen/commit/0ba01a130697530dcc09ceb8bcfff8c2cc11db91) - 2015-08-10
#### Added
Initial commit of existing code, including:
* gulpfile.ts, package.json
* tsMeta: app.ts
* tsMeta/definitions: cstypes.d.ts, tsmeta.d.ts, types.d.ts, utils.d.ts
* tsMeta/modifiers: Access.ts, Modifier.ts
* tsMeta/strings: StringArray.ts
* tsMeta/templates/generators: DefaultGenTools.ts
* tsMeta/templates/generators/c-sharp: CsClass.ts, CsModel.ts, CsSearchCritiera.ts, CsServiceClass.ts, CsServiceModel.ts, CsToSource.ts
* tsMeta/utils: ArrayUtil.ts, EnumUtil.ts, ObjectUtil.ts
* tsMeta/whitespace: DefaultPrettyPrinter.ts, EmptyLine.ts
* ui: CompileRunner.html