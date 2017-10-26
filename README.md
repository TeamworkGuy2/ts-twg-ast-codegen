TS Code Generator
==============

Dependencies:
- none

TypeScript code generator tools, designed for type safe transformation of data structures to code.
See the `test/` directory for example usage of the functions in this project.


## API Overview
The API is split into a few important interconnected pieces/layers.

This library is designed to integrate with [jparser-tools](https://github.com/TeamworkGuy2/JParserTools).  The base CodeAst interfaces found in 'code-types/ast-types.d.ts' match the JSON output from `jparser-tools`.

You can load data types/models manually via the `TypeTemplate` interface in `model-types.d.ts` and use `code-types/TypeConverter` which has methods like `parseTypeTemplate()` and `TypeScript.parseAndConvertTypeTemplate()` to convert the `TypeTemplate` to a `CodeAst.Type`.

Or load JSON output directly from `jparser-tools` and cast it to one of the `CodeAst.*` types.

Now that you have data, you can manipulate it via your own code or with the help of classes like `code-types/ExtractAst` or `code-types/TypeConverter`.

Finally, output the data back to JSON with JSON.stringify() (since the CodeAst interfaces are designed for JSON parsing/stringifying) or transform the data types/models to source code strings using the classes found in `generators/`.


### code-types/
TypeScript definition files for code meta-data interfaces; i.e. classes, method signatures, fields, data models, source code blocks, etc.

### generators/
TypeScript generators source code generators for `code-types` models.

### strings/
StringArray for simple multi-line string building.
StringCase for checking if a string's casing matchings a particular programming convention such as camelCase, TitleCase, or Under_Score_Case.
DefaultPrettyPrinter for manually tracking source code indentation.
