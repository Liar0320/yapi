'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('path');

var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["DELETE"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
class Request {
    constructor(baseRequest) {
        this.responseType = "body";
        if (baseRequest)
            Object.assign(this, baseRequest);
    }
}

const getRequestSchema = (request, { name, resultType }) => {
    let resultCore;
    if (resultType === "query") {
        if (request && request.length > 0) {
            const properties = (request || []).reduce((prev, { type, name, description, required }) => {
                prev[name] = {
                    type: type || "string",
                    description: description || "----",
                    required,
                };
                return prev;
            }, {});
            resultCore = {
                id: "http://json-schema.org/geo",
                $schema: "http://json-schema.org/draft-06/schema#",
                description: `${name}request`,
                type: "object",
                properties: properties,
            };
        }
    }
    else {
        if (request[0] && request[0].schema && request[0].schema.properties) {
            resultCore = request[0].schema;
        }
        // resultCore = request[0] && request[0].schema || null;
    }
    return [resultType, resultCore];
};

function createRequest(yapiRequest) {
    yapiRequest.name = firstLowerCase(nameConvert(yapiRequest.path));
    let responseBody = null;
    try {
        responseBody = JSON.parse(yapiRequest.res_body);
    }
    catch (error) {
        console.log("🚀 -> file: yapi.spec.ts -> line 72 -> createRequest -> error", error);
    }
    let queryBody = null;
    try {
        if (yapiRequest.req_query && yapiRequest.req_body_type === "json") {
            yapiRequest.req_query.forEach((item) => {
                item.description = item.desc;
            });
        }
        queryBody = getRequestSchema(yapiRequest.req_query, {
            name: yapiRequest.name,
            resultType: "query",
        });
    }
    catch (error) {
        console.log("🚀 -> file: yapi.spec.ts -> line 84 -> createRequest -> error", error);
    }
    return new Request({
        title: yapiRequest.title,
        name: yapiRequest.name,
        path: yapiRequest.path,
        method: yapiRequest.method,
        response: responseBody,
        responseType: "body",
        request: queryBody[1],
        requestType: queryBody[0],
    });
}
/**名称转换，将字符串中的/ 转换为大写字母 */
function nameConvert(name) {
    return name.replace(/\/(\w)/g, (m, char) => (char || "").toUpperCase());
}
/**字符串首字母小写 */
function firstLowerCase(str) {
    return str.replace(/^\w/, (m) => m.toLowerCase());
}

exports.createRequest = createRequest;
exports.firstLowerCase = firstLowerCase;
exports.nameConvert = nameConvert;
