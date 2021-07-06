"use strict";
// Just a stand-in to ensure that the spec is correct
function openApi2Tests() {
    // example from: https://petstore.swagger.io/
    var doc = {
        swagger: "2.0",
        info: {
            "description": "This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.",
            "version": "1.0.5",
            "title": "Swagger Petstore",
            "termsOfService": "http://swagger.io/terms/",
            "contact": {
                "email": "apiteam@swagger.io"
            },
            "license": {
                "name": "Apache 2.0",
                "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
            }
        },
        host: "petstore.swagger.io",
        basePath: "/v2",
        tags: [{
                "name": "pet",
                "description": "Everything about your Pets",
                "externalDocs": {
                    "description": "Find out more",
                    "url": "http://swagger.io"
                }
            }, {
                "name": "store",
                "description": "Access to Petstore orders"
            }, {
                "name": "user",
                "description": "Operations about user",
                "externalDocs": {
                    "description": "Find out more about our store",
                    "url": "http://swagger.io"
                }
            }],
        schemes: ["https", "http"],
        paths: {
            "/pet/{petId}/uploadImage": {
                "post": {
                    tags: ["pet"],
                    summary: "uploads an image",
                    description: "",
                    operationId: "uploadFile",
                    consumes: ["multipart/form-data"],
                    produces: ["application/json"],
                    parameters: [{
                            "name": "petId",
                            "in": "path",
                            "description": "ID of pet to update",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }, {
                            "name": "additionalMetadata",
                            "in": "formData",
                            "description": "Additional data to pass to server",
                            "required": false,
                            "type": "string"
                        }, {
                            "name": "file",
                            "in": "formData",
                            "description": "file to upload",
                            "required": false,
                            "type": "file"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "successful operation",
                            schema: {
                                "$ref": "#/definitions/ApiResponse"
                            }
                        }
                    },
                    security: [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ]
                }
            },
            "/pet": {
                "post": {
                    "tags": ["pet"],
                    "summary": "Add a new pet to the store",
                    "description": "",
                    "operationId": "addPet",
                    "consumes": ["application/json", "application/xml"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "in": "body",
                            "name": "body",
                            "description": "Pet object that needs to be added to the store",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Pet"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ]
                },
                "put": {
                    "tags": ["pet"],
                    "summary": "Update an existing pet",
                    "description": "",
                    "operationId": "updatePet",
                    "consumes": ["application/json", "application/xml"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "in": "body",
                            "name": "body",
                            "description": "Pet object that needs to be added to the store",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Pet"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Pet not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ]
                }
            },
            "/pet/findByStatus": {
                "get": {
                    "tags": ["pet"],
                    "summary": "Finds Pets by status",
                    "description": "Multiple status values can be provided with comma separated strings",
                    "operationId": "findPetsByStatus",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "status",
                            "in": "query",
                            "description": "Status values that need to be considered for filter",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": ["available", "pending", "sold"],
                                "default": "available"
                            },
                            "collectionFormat": "multi"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Pet"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid status value"
                        }
                    },
                    "security": [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ]
                }
            },
            "/pet/findByTags": {
                "get": {
                    "tags": ["pet"],
                    "summary": "Finds Pets by tags",
                    "description": "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
                    "operationId": "findPetsByTags",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "tags",
                            "in": "query",
                            "description": "Tags to filter by",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "collectionFormat": "multi"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Pet"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid tag value"
                        }
                    },
                    "security": [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ],
                    "deprecated": true
                }
            },
            "/pet/{petId}": {
                "get": {
                    "tags": ["pet"],
                    "summary": "Find pet by ID",
                    "description": "Returns a single pet",
                    "operationId": "getPetById",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "petId",
                            "in": "path",
                            "description": "ID of pet to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Pet"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Pet not found"
                        }
                    },
                    "security": [{
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": ["pet"],
                    "summary": "Updates a pet in the store with form data",
                    "description": "",
                    "operationId": "updatePetWithForm",
                    "consumes": ["application/x-www-form-urlencoded"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "petId",
                            "in": "path",
                            "description": "ID of pet that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }, {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of the pet",
                            "required": false,
                            "type": "string"
                        }, {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of the pet",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ]
                },
                "delete": {
                    "tags": ["pet"],
                    "summary": "Deletes a pet",
                    "description": "",
                    "operationId": "deletePet",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        }, {
                            "name": "petId",
                            "in": "path",
                            "description": "Pet id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Pet not found"
                        }
                    },
                    "security": [{
                            "petstore_auth": ["write:pets", "read:pets"]
                        }
                    ]
                }
            },
            "/store/inventory": {
                "get": {
                    "tags": ["store"],
                    "summary": "Returns pet inventories by status",
                    "description": "Returns a map of status codes to quantities",
                    "operationId": "getInventory",
                    "produces": ["application/json"],
                    "parameters": [],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "object",
                                "additionalProperties": {
                                    "type": "integer",
                                    "format": "int32"
                                }
                            }
                        }
                    },
                    "security": [{
                            "api_key": []
                        }
                    ]
                }
            },
            "/store/order": {
                "post": {
                    "tags": ["store"],
                    "summary": "Place an order for a pet",
                    "description": "",
                    "operationId": "placeOrder",
                    "consumes": ["application/json"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "in": "body",
                            "name": "body",
                            "description": "order placed for purchasing the pet",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Order"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Order"
                            }
                        },
                        "400": {
                            "description": "Invalid Order"
                        }
                    }
                }
            },
            "/store/order/{orderId}": {
                "get": {
                    "tags": ["store"],
                    "summary": "Find purchase order by ID",
                    "description": "For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions",
                    "operationId": "getOrderById",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "orderId",
                            "in": "path",
                            "description": "ID of pet that needs to be fetched",
                            "required": true,
                            "type": "integer",
                            "maximum": 10,
                            "minimum": 1,
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Order"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        }
                    }
                },
                "delete": {
                    "tags": ["store"],
                    "summary": "Delete purchase order by ID",
                    "description": "For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors",
                    "operationId": "deleteOrder",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "orderId",
                            "in": "path",
                            "description": "ID of the order that needs to be deleted",
                            "required": true,
                            "type": "integer",
                            "minimum": 1,
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        }
                    }
                }
            },
            "/user/createWithList": {
                "post": {
                    "tags": ["user"],
                    "summary": "Creates list of users with given input array",
                    "description": "",
                    "operationId": "createUsersWithListInput",
                    "consumes": ["application/json"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "in": "body",
                            "name": "body",
                            "description": "List of user object",
                            "required": true,
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/User"
                                }
                            }
                        }
                    ],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                }
            },
            "/user/{username}": {
                "get": {
                    "tags": ["user"],
                    "summary": "Get user by user name",
                    "description": "",
                    "operationId": "getUserByName",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "username",
                            "in": "path",
                            "description": "The name that needs to be fetched. Use user1 for testing. ",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/User"
                            }
                        },
                        "400": {
                            "description": "Invalid username supplied"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                },
                "put": {
                    "tags": ["user"],
                    "summary": "Updated user",
                    "description": "This can only be done by the logged in user.",
                    "operationId": "updateUser",
                    "consumes": ["application/json"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "username",
                            "in": "path",
                            "description": "name that need to be updated",
                            "required": true,
                            "type": "string"
                        }, {
                            "in": "body",
                            "name": "body",
                            "description": "Updated user object",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/User"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid user supplied"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                },
                "delete": {
                    "tags": ["user"],
                    "summary": "Delete user",
                    "description": "This can only be done by the logged in user.",
                    "operationId": "deleteUser",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "username",
                            "in": "path",
                            "description": "The name that needs to be deleted",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid username supplied"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                }
            },
            "/user/login": {
                "get": {
                    "tags": ["user"],
                    "summary": "Logs user into the system",
                    "description": "",
                    "operationId": "loginUser",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "name": "username",
                            "in": "query",
                            "description": "The user name for login",
                            "required": true,
                            "type": "string"
                        }, {
                            "name": "password",
                            "in": "query",
                            "description": "The password for login in clear text",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "headers": {
                                "X-Expires-After": {
                                    "type": "string",
                                    "format": "date-time",
                                    "description": "date in UTC when token expires"
                                },
                                "X-Rate-Limit": {
                                    "type": "integer",
                                    "format": "int32",
                                    "description": "calls per hour allowed by the user"
                                }
                            },
                            "schema": {
                                "type": "string"
                            }
                        },
                        "400": {
                            "description": "Invalid username/password supplied"
                        }
                    }
                }
            },
            "/user/logout": {
                "get": {
                    "tags": ["user"],
                    "summary": "Logs out current logged in user session",
                    "description": "",
                    "operationId": "logoutUser",
                    "produces": ["application/json", "application/xml"],
                    "parameters": [],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                }
            },
            "/user/createWithArray": {
                "post": {
                    "tags": ["user"],
                    "summary": "Creates list of users with given input array",
                    "description": "",
                    "operationId": "createUsersWithArrayInput",
                    "consumes": ["application/json"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "in": "body",
                            "name": "body",
                            "description": "List of user object",
                            "required": true,
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/User"
                                }
                            }
                        }
                    ],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                }
            },
            "/user": {
                "post": {
                    "tags": ["user"],
                    "summary": "Create user",
                    "description": "This can only be done by the logged in user.",
                    "operationId": "createUser",
                    "consumes": ["application/json"],
                    "produces": ["application/json", "application/xml"],
                    "parameters": [{
                            "in": "body",
                            "name": "body",
                            "description": "Created user object",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/User"
                            }
                        }],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                }
            }
        },
        "securityDefinitions": {
            "api_key": {
                "type": "apiKey",
                "name": "api_key",
                "in": "header"
            },
            "petstore_auth": {
                "type": "oauth2",
                "authorizationUrl": "https://petstore.swagger.io/oauth/authorize",
                "flow": "implicit",
                "scopes": {
                    "read:pets": "read your pets",
                    "write:pets": "modify pets in your account"
                }
            }
        },
        "definitions": {
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "type": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            },
            "Category": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Category"
                }
            },
            "Pet": {
                "type": "object",
                "required": ["name", "photoUrls"],
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "category": {
                        "$ref": "#/definitions/Category"
                    },
                    "name": {
                        "type": "string",
                        "example": "doggie"
                    },
                    "photoUrls": {
                        "type": "array",
                        "xml": {
                            "wrapped": true
                        },
                        "items": {
                            "type": "string",
                            "xml": {
                                "name": "photoUrl"
                            }
                        }
                    },
                    "tags": {
                        "type": "array",
                        "xml": {
                            "wrapped": true
                        },
                        "items": {
                            "xml": {
                                "name": "tag"
                            },
                            "$ref": "#/definitions/Tag"
                        }
                    },
                    "status": {
                        "type": "string",
                        "description": "pet status in the store",
                        "enum": ["available", "pending", "sold"]
                    }
                },
                "xml": {
                    "name": "Pet"
                }
            },
            "Tag": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Tag"
                }
            },
            "Order": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "petId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "quantity": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "shipDate": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "status": {
                        "type": "string",
                        "description": "Order Status",
                        "enum": ["placed", "approved", "delivered"]
                    },
                    "complete": {
                        "type": "boolean"
                    }
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "userStatus": {
                        "type": "integer",
                        "format": "int32",
                        "description": "User Status"
                    }
                },
                "xml": {
                    "name": "User"
                }
            }
        },
        "externalDocs": {
            "description": "Find out more about Swagger",
            "url": "http://swagger.io"
        }
    };
    var exInfoObject = {
        "title": "Swagger Sample App",
        "description": "This is a sample server Petstore server.",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "1.0.1"
    };
    var exContactObject = {
        "name": "API Support",
        "url": "http://www.swagger.io/support",
        "email": "support@swagger.io"
    };
    var exLicenseObject = {
        "name": "Apache 2.0",
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    };
    var exPathsObject = {
        "/pets": {
            "get": {
                "description": "Returns all pets from the system that the user has access to",
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "A list of pets.",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/pet"
                            }
                        }
                    }
                }
            }
        }
    };
    var exPathItemObject = {
        "get": {
            "description": "Returns pets based on ID",
            "summary": "Find pets by ID",
            "operationId": "getPetsById",
            "produces": [
                "application/json",
                "text/html"
            ],
            "responses": {
                "200": {
                    "description": "pet response",
                    "schema": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/Pet"
                        }
                    }
                },
                "default": {
                    "description": "error payload",
                    "schema": {
                        "$ref": "#/definitions/ErrorModel"
                    }
                }
            }
        },
        "parameters": [
            {
                "name": "id",
                "in": "path",
                "description": "ID of pet to use",
                "required": true,
                "type": "array",
                "items": {
                    "type": "string"
                },
                "collectionFormat": "csv"
            }
        ]
    };
    var exOperationObject = {
        "tags": [
            "pet"
        ],
        "summary": "Updates a pet in the store with form data",
        "description": "",
        "operationId": "updatePetWithForm",
        "consumes": [
            "application/x-www-form-urlencoded"
        ],
        "produces": [
            "application/json",
            "application/xml"
        ],
        "parameters": [
            {
                "name": "petId",
                "in": "path",
                "description": "ID of pet that needs to be updated",
                "required": true,
                "type": "string"
            },
            {
                "name": "name",
                "in": "formData",
                "description": "Updated name of the pet",
                "required": false,
                "type": "string"
            },
            {
                "name": "status",
                "in": "formData",
                "description": "Updated status of the pet",
                "required": false,
                "type": "string"
            }
        ],
        "responses": {
            "200": {
                "description": "Pet updated."
            },
            "405": {
                "description": "Invalid input"
            }
        },
        "security": [
            {
                "petstore_auth": [
                    "write:pets",
                    "read:pets"
                ]
            }
        ]
    };
    var exExternalDocumentationObject = {
        "description": "Find more info here",
        "url": "https://swagger.io"
    };
    var exParameter1 = {
        "name": "user",
        "in": "body",
        "description": "user to add to the system",
        "required": true,
        "schema": {
            "$ref": "#/definitions/User"
        }
    };
    var exParameter2 = {
        "name": "user",
        "in": "body",
        "description": "user to add to the system",
        "required": true,
        "schema": {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    };
    var exParameter3 = {
        "name": "token",
        "in": "header",
        "description": "token to be passed as a header",
        "required": true,
        "type": "array",
        "items": {
            "type": "integer",
            "format": "int64"
        },
        "collectionFormat": "csv"
    };
    var exParameter4 = {
        "name": "username",
        "in": "path",
        "description": "username to fetch",
        "required": true,
        "type": "string"
    };
    var exParameter5 = {
        "name": "id",
        "in": "query",
        "description": "ID of the object to fetch",
        "required": false,
        "type": "array",
        "items": {
            "type": "string"
        },
        "collectionFormat": "multi"
    };
    var exParameter6 = {
        "name": "avatar",
        "in": "formData",
        "description": "The avatar of the user",
        "required": true,
        "type": "file"
    };
    var exItemsObject1 = {
        "type": "string",
        "minLength": 2
    };
    var exItemsObject2 = {
        "type": "array",
        "items": {
            "type": "integer",
            "minimum": 0,
            "maximum": 63
        }
    };
    var exResponsesObject = {
        "200": {
            "description": "a pet to be returned",
            "schema": {
                "$ref": "#/definitions/Pet"
            }
        },
        "default": {
            "description": "Unexpected error",
            "schema": {
                "$ref": "#/definitions/ErrorModel"
            }
        }
    };
    var exResponseObject1 = {
        "description": "A complex object array response",
        "schema": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/VeryComplexType"
            }
        }
    };
    var exResponseObject2 = {
        "description": "A simple string response",
        "schema": {
            "type": "string"
        }
    };
    var exResponseObject3 = {
        "description": "A simple string response",
        "schema": {
            "type": "string"
        },
        "headers": {
            "X-Rate-Limit-Limit": {
                "description": "The number of allowed requests in the current period",
                "type": "integer"
            },
            "X-Rate-Limit-Remaining": {
                "description": "The number of remaining requests in the current period",
                "type": "integer"
            },
            "X-Rate-Limit-Reset": {
                "description": "The number of seconds left in the current period",
                "type": "integer"
            }
        }
    };
    var exResponseObject4 = {
        "description": "object created"
    };
    var exHeadersObject = {
        "X-Rate-Limit-Limit": {
            "description": "The number of allowed requests in the current period",
            "type": "integer"
        },
        "X-Rate-Limit-Remaining": {
            "description": "The number of remaining requests in the current period",
            "type": "integer"
        },
        "X-Rate-Limit-Reset": {
            "description": "The number of seconds left in the current period",
            "type": "integer"
        }
    };
    var exExampleObject = {
        "application/json": {
            "name": "Puma",
            "type": "Dog",
            "color": "Black",
            "gender": "Female",
            "breed": "Mixed"
        }
    };
    var exHeaderObject = {
        "description": "The number of allowed requests in the current period",
        "type": "integer"
    };
    var exTagObject = {
        "name": "pet",
        "description": "Pets operations"
    };
    var exReferenceObject = {
        "$ref": "#/components/schemas/Pet"
    };
    // TODO 'format' is currently hard-coded to those types listed in strings: https://swagger.io/specification/v2/#dataTypeFormat
    var exSchemaObject1 = {
        "type": "string",
        "format": "email"
    };
    var exSchemaObject2 = {
        "type": "object",
        "required": [
            "name"
        ],
        "properties": {
            "name": {
                "type": "string"
            },
            "address": {
                "$ref": "#/definitions/Address"
            },
            "age": {
                "type": "integer",
                "format": "int32",
                "minimum": 0
            }
        }
    };
    var exSchemaObject3 = {
        "type": "object",
        "additionalProperties": {
            "type": "string"
        }
    };
    var exSchemaObject4 = {
        "type": "object",
        "additionalProperties": {
            "$ref": "#/definitions/ComplexModel"
        }
    };
    var exSchemaObject5 = {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "format": "int64"
            },
            "name": {
                "type": "string"
            }
        },
        "required": [
            "name"
        ],
        "example": {
            "name": "Puma",
            "id": 1
        }
    };
    var exSchemaObject6 = {
        "definitions": {
            "ErrorModel": {
                "type": "object",
                "required": [
                    "message",
                    "code"
                ],
                "properties": {
                    "message": {
                        "type": "string"
                    },
                    "code": {
                        "type": "integer",
                        "minimum": 100,
                        "maximum": 600
                    }
                }
            },
            "ExtendedErrorModel": {
                "allOf": [
                    {
                        "$ref": "#/definitions/ErrorModel"
                    },
                    {
                        "type": "object",
                        "required": [
                            "rootCause"
                        ],
                        "properties": {
                            "rootCause": {
                                "type": "string"
                            }
                        }
                    }
                ]
            }
        }
    };
    var exSchemaObject7 = {
        "definitions": {
            "Pet": {
                "type": "object",
                "discriminator": "petType",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "petType": {
                        "type": "string"
                    }
                },
                "required": [
                    "name",
                    "petType"
                ]
            },
            "Cat": {
                "description": "A representation of a cat",
                "allOf": [
                    {
                        "$ref": "#/definitions/Pet"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "huntingSkill": {
                                "type": "string",
                                "description": "The measured skill for hunting",
                                "default": "lazy",
                                "enum": [
                                    "clueless",
                                    "lazy",
                                    "adventurous",
                                    "aggressive"
                                ]
                            }
                        },
                        "required": [
                            "huntingSkill"
                        ]
                    }
                ]
            },
            "Dog": {
                "description": "A representation of a dog",
                "allOf": [
                    {
                        "$ref": "#/definitions/Pet"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "packSize": {
                                "type": "integer",
                                "format": "int32",
                                "description": "the size of the pack the dog is from",
                                "default": 0,
                                "minimum": 0
                            }
                        },
                        "required": [
                            "packSize"
                        ]
                    }
                ]
            }
        }
    };
    var exXmlObject1 = {
        "animals": {
            "type": "string",
            "xml": {
                "name": "animal"
            }
        }
    };
    var exXmlObject4 = {
        "Person": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "xml": {
                        "attribute": true
                    }
                },
                "name": {
                    "type": "string",
                    "xml": {
                        "namespace": "http://swagger.io/schema/sample",
                        "prefix": "sample"
                    }
                }
            }
        }
    };
    var exXmlObject5 = {
        "animals": {
            "type": "array",
            "items": {
                "type": "string",
                "xml": {
                    "name": "animal"
                }
            }
        }
    };
    var exXmlObject6 = {
        "animals": {
            "type": "array",
            "items": {
                "type": "string",
                "xml": {
                    "name": "animal"
                }
            },
            "xml": {
                "name": "aliens"
            }
        }
    };
    var exXmlObject7 = {
        "animals": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "xml": {
                "wrapped": true
            }
        }
    };
    var exXmlObject8 = {
        "animals": {
            "type": "array",
            "items": {
                "type": "string",
                "xml": {
                    "name": "animal"
                }
            },
            "xml": {
                "wrapped": true
            }
        }
    };
    var exXmlObject9 = {
        "animals": {
            "type": "array",
            "items": {
                "type": "string",
                "xml": {
                    "name": "animal"
                }
            },
            "xml": {
                "name": "aliens",
                "wrapped": true
            }
        }
    };
    var exXmlObject10 = {
        "animals": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "xml": {
                "name": "aliens",
                "wrapped": true
            }
        }
    };
    var exDefinitionsObject = {
        "Category": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "Tag": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "name": {
                    "type": "string"
                }
            }
        }
    };
    var exParametersDefinitionsObject = {
        "skipParam": {
            "name": "skip",
            "in": "query",
            "description": "number of items to skip",
            "required": true,
            "type": "integer",
            "format": "int32"
        },
        "limitParam": {
            "name": "limit",
            "in": "query",
            "description": "max records to return",
            "required": true,
            "type": "integer",
            "format": "int32"
        }
    };
    var exResponsesDefinitionsObject = {
        "NotFound": {
            "description": "Entity not found."
        },
        "IllegalInput": {
            "description": "Illegal input for operation."
        },
        "GeneralError": {
            "description": "General Error",
            "schema": {
                "$ref": "#/definitions/GeneralError"
            }
        }
    };
    var exSecurityDefinitionsObject = {
        "api_key": {
            "type": "apiKey",
            "name": "api_key",
            "in": "header"
        },
        "petstore_auth": {
            "type": "oauth2",
            "authorizationUrl": "http://swagger.io/api/oauth/dialog",
            "flow": "implicit",
            "scopes": {
                "write:pets": "modify pets in your account",
                "read:pets": "read your pets"
            }
        }
    };
    var exSecuritySchemaObject1 = {
        "type": "basic"
    };
    var exSecuritySchemaObject2 = {
        "type": "apiKey",
        "name": "api_key",
        "in": "header"
    };
    var exSecuritySchemaObject3 = {
        "type": "oauth2",
        "authorizationUrl": "http://swagger.io/api/oauth/dialog",
        "flow": "implicit",
        "scopes": {
            "write:pets": "modify pets in your account",
            "read:pets": "read your pets"
        }
    };
    var exScopesObject = {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
    };
    var exSecurityRquirementObject1 = {
        "api_key": []
    };
    var exSecurityRquirementObject2 = {
        "petstore_auth": [
            "write:pets",
            "read:pets"
        ]
    };
}
function openApi3Tests() {
    var exInfoObject = {
        "title": "Sample Pet Store App",
        "description": "This is a sample server for a pet store.",
        "termsOfService": "http://example.com/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.example.com/support",
            "email": "support@example.com"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "1.0.1"
    };
    var exContactObject = {
        "name": "API Support",
        "url": "http://www.example.com/support",
        "email": "support@example.com"
    };
    var exLicenseObject = {
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
    };
    var exServerObject1 = {
        "url": "https://development.gigantic-server.com/v1",
        "description": "Development server"
    };
    var exServerObject2 = {
        "servers": [
            {
                "url": "https://development.gigantic-server.com/v1",
                "description": "Development server"
            },
            {
                "url": "https://staging.gigantic-server.com/v1",
                "description": "Staging server"
            },
            {
                "url": "https://api.gigantic-server.com/v1",
                "description": "Production server"
            }
        ]
    };
    var exServerObject3 = {
        "servers": [
            {
                "url": "https://{username}.gigantic-server.com:{port}/{basePath}",
                "description": "The production API server",
                "variables": {
                    "username": {
                        "default": "demo",
                        "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"
                    },
                    "port": {
                        "enum": [
                            "8443",
                            "443"
                        ],
                        "default": "8443"
                    },
                    "basePath": {
                        "default": "v2"
                    }
                }
            }
        ]
    };
    var exComponentsObject = {
        "schemas": {
            "GeneralError": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            },
            "Category": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                }
            },
            "Tag": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                }
            }
        },
        "parameters": {
            "skipParam": {
                "name": "skip",
                "in": "query",
                "description": "number of items to skip",
                "required": true,
                "schema": {
                    "type": "integer",
                    "format": "int32"
                }
            },
            "limitParam": {
                "name": "limit",
                "in": "query",
                "description": "max records to return",
                "required": true,
                "schema": {
                    "type": "integer",
                    "format": "int32"
                }
            }
        },
        "responses": {
            "NotFound": {
                "description": "Entity not found."
            },
            "IllegalInput": {
                "description": "Illegal input for operation."
            },
            "GeneralError": {
                "description": "General Error",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/GeneralError"
                        }
                    }
                }
            }
        },
        "securitySchemes": {
            "api_key": {
                "type": "apiKey",
                "name": "api_key",
                "in": "header"
            },
            "petstore_auth": {
                "type": "oauth2",
                "flows": {
                    "implicit": {
                        "authorizationUrl": "http://example.org/api/oauth/dialog",
                        "scopes": {
                            "write:pets": "modify pets in your account",
                            "read:pets": "read your pets"
                        }
                    }
                }
            }
        }
    };
    var exPathsObject = {
        "/pets": {
            "get": {
                "description": "Returns all pets from the system that the user has access to",
                "responses": {
                    "200": {
                        "description": "A list of pets.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/pet"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var exPathItem = {
        "get": {
            "description": "Returns pets based on ID",
            "summary": "Find pets by ID",
            "operationId": "getPetsById",
            "responses": {
                "200": {
                    "description": "pet response",
                    "content": {
                        "*/*": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/Pet"
                                }
                            }
                        }
                    }
                },
                "default": {
                    "description": "error payload",
                    "content": {
                        "text/html": {
                            "schema": {
                                "$ref": "#/components/schemas/ErrorModel"
                            }
                        }
                    }
                }
            }
        },
        "parameters": [{
                "name": "id",
                "in": "path",
                "description": "ID of pet to use",
                "required": true,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "style": "simple"
            }]
    };
    var exOperationObject = {
        "tags": [
            "pet"
        ],
        "summary": "Updates a pet in the store with form data",
        "operationId": "updatePetWithForm",
        "parameters": [
            {
                "name": "petId",
                "in": "path",
                "description": "ID of pet that needs to be updated",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "requestBody": {
            "content": {
                "application/x-www-form-urlencoded": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "description": "Updated name of the pet",
                                "type": "string"
                            },
                            "status": {
                                "description": "Updated status of the pet",
                                "type": "string"
                            }
                        },
                        "required": ["status"]
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description": "Pet updated.",
                "content": {
                    "application/json": {},
                    "application/xml": {}
                }
            },
            "405": {
                "description": "Method Not Allowed",
                "content": {
                    "application/json": {},
                    "application/xml": {}
                }
            }
        },
        "security": [
            {
                "petstore_auth": [
                    "write:pets",
                    "read:pets"
                ]
            }
        ]
    };
    var exExternalDocumentationObject = {
        "description": "Find more info here",
        "url": "https://example.com"
    };
    var exParameterObject1 = {
        "name": "token",
        "in": "header",
        "description": "token to be passed as a header",
        "required": true,
        "schema": {
            "type": "array",
            "items": {
                "type": "integer",
                "format": "int64"
            }
        },
        "style": "simple"
    };
    var exParameterObject2 = {
        "name": "username",
        "in": "path",
        "description": "username to fetch",
        "required": true,
        "schema": {
            "type": "string"
        }
    };
    var exParameterObject3 = {
        "name": "id",
        "in": "query",
        "description": "ID of the object to fetch",
        "required": false,
        "schema": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "style": "form",
        "explode": true
    };
    var exParameterObject4 = {
        "in": "query",
        "name": "freeForm",
        "schema": {
            "type": "object",
            "additionalProperties": {
                "type": "integer"
            },
        },
        "style": "form"
    };
    var exParameterObject5 = {
        "in": "query",
        "name": "coordinates",
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "required": [
                        "lat",
                        "long"
                    ],
                    "properties": {
                        "lat": {
                            "type": "number"
                        },
                        "long": {
                            "type": "number"
                        }
                    }
                }
            }
        }
    };
    var exRequestBodyObject1 = {
        "description": "user to add to the system",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/User"
                },
                "examples": {
                    "user": {
                        "summary": "User Example",
                        "externalValue": "http://foo.bar/examples/user-example.json"
                    }
                }
            },
            "application/xml": {
                "schema": {
                    "$ref": "#/components/schemas/User"
                },
                "examples": {
                    "user": {
                        "summary": "User example in XML",
                        "externalValue": "http://foo.bar/examples/user-example.xml"
                    }
                }
            },
            "text/plain": {
                "examples": {
                    "user": {
                        "summary": "User example in Plain text",
                        "externalValue": "http://foo.bar/examples/user-example.txt"
                    }
                }
            },
            "*/*": {
                "examples": {
                    "user": {
                        "summary": "User example in other format",
                        "externalValue": "http://foo.bar/examples/user-example.whatever"
                    }
                }
            }
        }
    };
    var exRequestBodyObject2 = {
        "description": "user to add to the system",
        "content": {
            "text/plain": {
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    };
    var exMediaTypeObject = {
        "application/json": {
            "schema": {
                "$ref": "#/components/schemas/Pet"
            },
            "examples": {
                "cat": {
                    "summary": "An example of a cat",
                    "value": {
                        "name": "Fluffy",
                        "petType": "Cat",
                        "color": "White",
                        "gender": "male",
                        "breed": "Persian"
                    }
                },
                "dog": {
                    "summary": "An example of a dog with a cat's name",
                    "value": {
                        "name": "Puma",
                        "petType": "Dog",
                        "color": "Black",
                        "gender": "Female",
                        "breed": "Mixed"
                    }
                },
                "frog": {
                    "$ref": "#/components/examples/frog-example"
                }
            }
        }
    };
    var exResponsesObject = {
        "200": {
            "description": "a pet to be returned",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/Pet"
                    }
                }
            }
        },
        "default": {
            "description": "Unexpected error",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/ErrorModel"
                    }
                }
            }
        }
    };
    var exResponseObject1 = {
        "description": "A complex object array response",
        "content": {
            "application/json": {
                "schema": {
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/VeryComplexType"
                    }
                }
            }
        }
    };
    var exResponseObject2 = {
        "description": "A simple string response",
        "content": {
            "text/plain": {
                "schema": {
                    "type": "string"
                }
            }
        }
    };
    var exResponseObject3 = {
        "description": "A simple string response",
        "content": {
            "text/plain": {
                "schema": {
                    "type": "string",
                    "example": "whoa!"
                }
            }
        },
        "headers": {
            "X-Rate-Limit-Limit": {
                "description": "The number of allowed requests in the current period",
                "schema": {
                    "type": "integer"
                }
            },
            "X-Rate-Limit-Remaining": {
                "description": "The number of remaining requests in the current period",
                "schema": {
                    "type": "integer"
                }
            },
            "X-Rate-Limit-Reset": {
                "description": "The number of seconds left in the current period",
                "schema": {
                    "type": "integer"
                }
            }
        }
    };
    var exResponseObject4 = {
        "description": "object created"
    };
    var exTagObject = {
        "name": "pet",
        "description": "Pets operations"
    };
    var exReferenceObject = {
        "$ref": "#/components/schemas/Pet"
    };
    var exSchemaObject1 = {
        "schemas": {
            "ErrorModel": {
                "type": "object",
                "required": [
                    "message",
                    "code"
                ],
                "properties": {
                    "message": {
                        "type": "string"
                    },
                    "code": {
                        "type": "integer",
                        "minimum": 100,
                        "maximum": 600
                    }
                }
            },
            "ExtendedErrorModel": {
                "allOf": [{
                        "$ref": "#/components/schemas/ErrorModel"
                    }, {
                        "type": "object",
                        "required": [
                            "rootCause"
                        ],
                        "properties": {
                            "rootCause": {
                                "type": "string"
                            }
                        }
                    }]
            }
        }
    };
    var exSchemaObject2 = {
        "schemas": {
            "Pet": {
                "type": "object",
                "discriminator": {
                    "propertyName": "petType"
                },
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "petType": {
                        "type": "string"
                    }
                },
                "required": [
                    "name",
                    "petType"
                ]
            },
            "Cat": {
                "description": "A representation of a cat. Note that `Cat` will be used as the discriminator value.",
                "allOf": [
                    {
                        "$ref": "#/components/schemas/Pet"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "huntingSkill": {
                                "type": "string",
                                "description": "The measured skill for hunting",
                                "default": "lazy",
                                "enum": [
                                    "clueless",
                                    "lazy",
                                    "adventurous",
                                    "aggressive"
                                ]
                            }
                        },
                        "required": [
                            "huntingSkill"
                        ]
                    }
                ]
            },
            "Dog": {
                "description": "A representation of a dog. Note that `Dog` will be used as the discriminator value.",
                "allOf": [{
                        "$ref": "#/components/schemas/Pet"
                    }, {
                        "type": "object",
                        "properties": {
                            "packSize": {
                                "type": "integer",
                                "format": "int32",
                                "description": "the size of the pack the dog is from",
                                "default": 0,
                                "minimum": 0
                            }
                        },
                        "required": [
                            "packSize"
                        ]
                    }]
            }
        }
    };
    var exXmlObject = {
        "Person": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "xml": {
                        "attribute": true
                    }
                },
                "name": {
                    "type": "string",
                    "xml": {
                        "namespace": "http://example.com/schema/sample",
                        "prefix": "sample"
                    }
                }
            }
        }
    };
    var exSecuritySchemaObject1 = {
        "type": "http",
        "scheme": "basic"
    };
    var exSecuritySchemaObject2 = {
        "type": "apiKey",
        "name": "api_key",
        "in": "header"
    };
    var exSecuritySchemaObject3 = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    };
    var exSecuritySchemaObject4 = {
        "type": "oauth2",
        "flows": {
            "implicit": {
                "authorizationUrl": "https://example.com/api/oauth/dialog",
                "scopes": {
                    "write:pets": "modify pets in your account",
                    "read:pets": "read your pets"
                }
            }
        }
    };
    var exSecurityRequirementObject1 = {
        "api_key": []
    };
    var exSecurityRequirementObject2 = {
        "petstore_auth": [
            "write:pets",
            "read:pets"
        ]
    };
}
module.exports = { openApi2Tests: openApi2Tests, openApi3Tests: openApi3Tests };
