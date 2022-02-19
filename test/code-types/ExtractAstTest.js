"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var ExtractAst = require("../../code-types/ExtractAst");
var TypeConverter = require("../../code-types/TypeConverter");
var asr = chai.assert;
suite("ExtractAst", function ExtractAstTest() {
    function getModelAsts() {
        return [{
                classSignature: { access: "PUBLIC", name: "TestApp.Models.PhotoUploadDto", declarationType: "class", annotations: [{ name: "DataContract", arguments: {} }] },
                blockType: "CLASS",
                using: ["System.Runtime.Serialization"],
                fields: [
                    { name: "PhotoHeader", type: { typeName: "TestApp.Models.PhotoHeader" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] },
                    { name: "PhotoData", type: { typeName: "byte", arrayDimensions: 1, primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] }
                ],
                methods: []
            }, {
                classSignature: { access: "PUBLIC", name: "TestApp.Models.PhotoHeader", declarationType: "class", annotations: [{ name: "DataContract", arguments: {} }] },
                blockType: "CLASS",
                using: ["System", "System.Runtime.Serialization"],
                fields: [
                    { name: "PhotoId", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Key", arguments: {} }, { name: "Required", arguments: {} }], comments: [] },
                    { name: "Name", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }, { name: "StringLength", arguments: { "value": "200" } }], comments: [] },
                    { name: "SizeBytes", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [] },
                    { name: "AttachedDate", type: { typeName: "DateTime" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [] },
                    { name: "AttachedBy", type: { typeName: "UserIdentifier" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }, { name: "StringLength", arguments: { "value": "50" } }], comments: [] },
                    { name: "Comments", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "StringLength", arguments: { "value": "1000" } }], comments: [] }
                ],
                methods: []
            }, {
                classSignature: { access: "PUBLIC", name: "TestApp.Models.ErrorLog", declarationType: "class", annotations: [{ name: "DataContract", arguments: {} }] },
                blockType: "CLASS",
                using: ["System", "System.Runtime.Serialization"],
                fields: [
                    { name: "LogLevel", type: { typeName: "short", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [" <summary>", " The log level of this log, see the 'LogLevel' enum.", " Includes: Debug, Information, Warn, Error, Fatal", " </summary>"] },
                    { name: "LogType", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [" <summary>", " A LogType enum name representing the type of log.", " This is a more detailed form of LogLevel, each LogLevel should have a unique set of LogTypes which appear in associate with it.", " </summary>"] },
                    { name: "UserId", type: { typeName: "UserIdentifier" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [" <summary>The ID of the user or service which triggered this log</summary>"] },
                    { name: "Message", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [" <summary>The log message</summary>"] },
                    { name: "Parameters", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [" <summary>Parameters associated with the action/state which triggered this log.</summary>"] },
                    { name: "StackTrace", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [" <summary>An exception stack trace associated with this log.</summary>"] },
                    { name: "Server", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [" <summary>The name of the node/server which logged this log</summary>"] },
                    { name: "DurationMillis", type: { typeName: "int", nullable: true, primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [" <value>Optional duration in milliseconds of the operation being logged.</value>"] },
                    { name: "TimestampUtc", type: { typeName: "DateTime" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }, { name: "Required", arguments: {} }], comments: [" <value>The error timestamp.</value>"] }
                ],
                methods: []
            }, {
                classSignature: { access: "PUBLIC", name: "TestApp.Models.CoverLog", declarationType: "class", annotations: [{ name: "DataContract", arguments: {} }] },
                blockType: "CLASS",
                using: ["System", "System.Runtime.Serialization"],
                fields: [
                    { name: "StartDate", type: { typeName: "DateTime" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] },
                    { name: "EndDate", type: { typeName: "DateTime" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] },
                    { name: "ClassName", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] },
                    { name: "MethodName", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] },
                    { name: "CallCount", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] },
                    { name: "FailureCount", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "DataMember", arguments: {} }], comments: [] }
                ],
                methods: []
            },
            // SearchResults
            {
                classSignature: { access: "PUBLIC", name: "TestApp.Models.SearchResults", declarationType: "class", genericParameters: [{ typeName: "T" }], annotations: [{ name: "DataContract", arguments: {} }] },
                blockType: "CLASS",
                using: ["System.Collections.Generic", "System.Runtime.Serialization"],
                fields: [
                    { name: "PageNumber", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [], comments: [" <value>The page number.</value>"] },
                    { name: "TotalRecords", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [], comments: [" <value>The total record count.</value>"] },
                    { name: "Items", type: { typeName: "IList", genericParameters: [{ typeName: "T" }] }, accessModifiers: ["public"], annotations: [], comments: [" <value>The search result items.</value>"] }
                ],
                methods: [
                    { name: "ToString", parameters: [], accessModifiers: [], annotations: [], returnType: { typeName: "string" }, comments: [] }
                ]
            },
            // Search criteria
            {
                classSignature: { access: "PUBLIC", name: "TestApp.Models.Base.SearchCriteria", declarationType: "class", annotations: [{ name: "Criteria", arguments: { "value": "TestApp.Models.Base.SearchCriteria" } }] },
                blockType: "CLASS",
                using: ["System.Runtime.Serialization", "TestApp.Models.Enums"],
                fields: [
                    { name: "PageSize", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: {} }], comments: [" <value>The page size. Number of records.</value>"] },
                    { name: "PageNumber", type: { typeName: "int", primitive: true }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: {} }], comments: [" <value>The page number. If PageNumber is present, PageSize must be present as well. Multiply by 'PageSize' to get the record offset</value>"] },
                    { name: "SortBy", type: { typeName: "string" }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: {} }], comments: [" <value>The column name to sort by.</value>"] },
                    { name: "SortOrder", type: { typeName: "TestApp.Models.Enums.SortOrder" }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: { "JsonType": "int" } }], comments: [] }
                ],
                methods: []
            }, {
                classSignature: { access: "PUBLIC", name: "TestApp.Models.Searching.CoverLogSearchCriteria", declarationType: "class", annotations: [{ name: "Criteria", arguments: { "value": "string" } }],
                    extendClassName: { typeName: "TestApp.Models.Base.SearchCriteria" }
                },
                blockType: "CLASS",
                using: ["System", "System.Runtime.Serialization", "TestApp.Models.Base"],
                fields: [
                    { name: "ServiceNames", type: { typeName: "string", arrayDimensions: 1 }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: { "JsonType": "string[]" } }], comments: [" <value>Service names to search for.</value>"] },
                    { name: "MethodNames", type: { typeName: "string", arrayDimensions: 1 }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: { "JsonType": "string[]" } }], comments: [" <value>Method names to search for.</value>"] },
                    { name: "ServiceMethodNames", type: { typeName: "string", arrayDimensions: 1 }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: { "JsonType": "string[]" } }], comments: [" <value>Compound 'service.menthod' format names to search for.</value>"] },
                    { name: "SearchPeriodStart", type: { typeName: "DateTime" }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: { "JsonType": "string" } }], comments: [" <value>The start of the search period.</value>"] },
                    { name: "SearchPeriodEnd", type: { typeName: "DateTime" }, accessModifiers: ["public"], annotations: [{ name: "Criteria", arguments: { "JsonType": "string" } }], comments: [" <value>The end of the search period.</value>"] }
                ],
                methods: []
            }];
    }
    function getClassAsts() {
        return [{
                classSignature: { access: "PUBLIC", name: "Services.BaseController", declarationType: "class",
                    extendClassName: { typeName: "Base.ApiController" }
                },
                blockType: "CLASS",
                using: ["System.Web.Http", "Utility.Logging"],
                fields: [
                    { name: "Logger", type: { typeName: "ISimpleLogger" }, accessModifiers: [], annotations: [], comments: [] }
                ],
                methods: []
            }, {
                classSignature: { access: "PUBLIC", name: "Services.IErrorService", declarationType: "interface", annotations: [] },
                blockType: "INTERFACE",
                using: ["System.ServiceModel", "System.Web", "TestApp.Models"],
                fields: [],
                methods: [{
                        name: "SendErrorLog",
                        parameters: [{ type: { typeName: "TestApp.Models.ErrorLog" }, name: "error", parameterModifiers: [] }],
                        accessModifiers: [],
                        annotations: [{ name: "HttpPost", arguments: {} }, { name: "WebInvoke", arguments: { "ResponseFormat": "DataType.Json", "RequestFormat": "DataType.Json" } }],
                        returnType: { typeName: "TestApp.Models.ErrorLog" },
                        comments: [" <summary>", " Log an error", " </summary>", " <returns></returns>"]
                    }, {
                        name: "SearchUserErrors",
                        parameters: [{ type: { typeName: "string" }, name: "userId", parameterModifiers: [] }],
                        accessModifiers: [],
                        annotations: [{ name: "HttpPost", arguments: {} }, { name: "WebInvoke", arguments: { "ResponseFormat": "DataType.Json", "RequestFormat": "DataType.Json" } }],
                        returnType: { typeName: "TestApp.Models.SearchResults", genericParameters: [{ typeName: "TestApp.Models.ErrorLog" }] },
                        comments: [" <summary>", " Retrieve user error logs", " </summary>", " <returns></returns>"]
                    }]
            }, {
                classSignature: { access: "PUBLIC", name: "Services.CoverService", declarationType: "class", annotations: [{ name: "ServiceContract", arguments: {} }],
                    extendClassName: { typeName: "Base.BaseController" }
                },
                blockType: "CLASS",
                using: ["System.Collections.Generic", "System.Web", "TestApp.Models", "TestApp.Models.Searching"],
                fields: [],
                methods: [{
                        name: "GetCoverLogs",
                        parameters: [{ type: { typeName: "TestApp.Models.Searching.CoverLogSearchCriteria" }, name: "criteria", parameterModifiers: [] }],
                        accessModifiers: [],
                        annotations: [{ name: "OperationContract", arguments: {} }, { name: "WebInvoke", arguments: { "ResponseFormat": "WebMessageFormat.Json", "RequestFormat": "WebMessageFormat.Json", "Method": "POST", "UriTemplate": "/GetCoverLogs" } }],
                        returnType: { typeName: "IList", genericParameters: [{ typeName: "TestApp.Models.CoverLog" }] },
                        comments: [" <summary>", " Get information about cover logs over a timespan.", " </summary>", " <returns></returns>"]
                    }]
            }, {
                classSignature: { access: "PUBLIC", name: "Services.IRequestService", declarationType: "interface", annotations: [],
                    implementClassNames: [{ typeName: "Base.IService" }]
                },
                blockType: "INTERFACE",
                using: ["System.Collections.Generic", "System.IO", "System.Web", "TestApp.Models"],
                fields: [],
                methods: [{
                        name: "UploadPhoto",
                        parameters: [{ type: { typeName: "IList", genericParameters: [{ typeName: "TestApp.Models.PhotoUploadDto" }] }, name: "photos", parameterModifiers: [] }],
                        accessModifiers: [],
                        annotations: [{ name: "HttpPost", arguments: {} }, { name: "WebInvoke", arguments: { "ResponseFormat": "DataType.Json", "RequestFormat": "DataType.Json" } }],
                        returnType: { typeName: "IList", genericParameters: [{ typeName: "TestApp.Models.PhotoUploadDto" }] },
                        comments: [" <summary>", " Uploads photo", " </summary>", " <param name=\"photos\">list containing header and data for new photos</param>"]
                    }, {
                        name: "DeletePhoto",
                        parameters: [{ type: { typeName: "int", primitive: true }, name: "photoId", parameterModifiers: [] }],
                        accessModifiers: [],
                        annotations: [{ name: "HttpPost", arguments: {} }, { name: "WebInvoke", arguments: { "ResponseFormat": "DataType.Json", "RequestFormat": "DataType.Json" } }],
                        returnType: { typeName: "void" },
                        comments: [" <summary>", " Deletes a photo and its data based on photo ID", " </summary>", " <param name=\"photoId\">ID for desired photo</param>"]
                    }, {
                        name: "UpdatePhotoComment",
                        parameters: [{ type: { typeName: "int", primitive: true }, name: "photoId", parameterModifiers: [] }, { type: { typeName: "string" }, name: "comment", parameterModifiers: [] }],
                        accessModifiers: [],
                        annotations: [{ name: "HttpPost", arguments: {} }, { name: "WebInvoke", arguments: { "ResponseFormat": "DataType.Json", "RequestFormat": "DataType.Json" } }],
                        returnType: { typeName: "void" },
                        comments: [" <summary>", " Updates the comment of the specified photo", " </summary>", " <param name=\"photoId\">ID for desired photo</param>", " <param name=\"comment\">New Comment for the photo</param>"]
                    }]
            }];
    }
    test("extractInheritedTypes", function extractInheritedTypesTest() {
        var classes = toMap(getClassAsts(), function (obj) { return obj.classSignature.name; });
        var res = ExtractAst.extractInheritedTypes(Object.keys(classes), classes, filterPrimitiveTypes);
        asr.deepEqual(Object.keys(res).sort(), ["Base.ApiController", "Base.BaseController", "Base.IService"]);
        //console.log(JSON.stringify(res));
    });
    test("extractAllTypes", function extractAllTypesTest() {
        var models = toMap(getModelAsts(), function (obj) { return obj.classSignature.name; });
        var res = ExtractAst.extractAllTypes(Object.keys(models), models, filterPrimitiveTypes);
        asr.deepEqual(Object.keys(res).sort(), ["IList", "T", "TestApp.Models.Base.SearchCriteria", "TestApp.Models.Enums.SortOrder", "TestApp.Models.PhotoHeader", "UserIdentifier"]);
        //console.log(JSON.stringify(res));
    });
    test("extractAllTypes-2", function extractAllTypesTest2() {
        var classes = toMap(getClassAsts(), function (obj) { return obj.classSignature.name; });
        var res = ExtractAst.extractAllTypes(Object.keys(classes), classes, filterPrimitiveTypes);
        asr.deepEqual(Object.keys(res).sort(), ["Base.ApiController", "Base.BaseController", "Base.IService", "IList", "ISimpleLogger", "TestApp.Models.CoverLog", "TestApp.Models.ErrorLog", "TestApp.Models.PhotoUploadDto",
            "TestApp.Models.SearchResults", "TestApp.Models.Searching.CoverLogSearchCriteria"]);
        //console.log(JSON.stringify(res));
    });
    test("extractAnnotationArgumentTypes", function extractAnnotationArgumentTypesTest() {
        var models = toMap(getModelAsts(), function (obj) { return obj.classSignature.name; });
        var res = ExtractAst.extractAnnotationArgumentTypes(Object.keys(models), models, function (typeName) { return true; }, function (annot, argName, argValue) {
            console.log("annotation '" + argName + "': " + argValue);
            var type = TypeConverter.parseTypeTemplate(argValue).typeName;
            return (TypeConverter.isPrimitive(type) || TypeConverter.isCore(type) || models[type] != null) ? argValue : null;
        });
        asr.deepEqual(Object.keys(res).map(function (k) { return res[k].map(function (au) { return au.annotation; }); }), [[{
                    name: "Criteria", arguments: { "value": "TestApp.Models.Base.SearchCriteria" }
                }], [{
                    name: "Criteria", arguments: { "value": "string" }
                }]]);
    });
    function filterPrimitiveTypes(typeName) {
        return !TypeConverter.isPrimitive(typeName) && !TypeConverter.isCore(typeName) && typeName !== "void";
    }
    function toMap(ary, keyGetter) {
        var map = {};
        for (var i = 0, size = ary.length; i < size; i++) {
            var obj = ary[i];
            var key = keyGetter(obj);
            map[key] = obj;
        }
        return map;
    }
});
