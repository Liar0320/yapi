'use strict';

var quicktypeCore = require('quicktype-core');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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

function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString) {
    return __awaiter(this, void 0, void 0, function* () {
        const schemaInput = new quicktypeCore.JSONSchemaInput(new quicktypeCore.FetchingJSONSchemaStore());
        // We could add multiple schemas for multiple types,
        // but here we're just making one type from JSON schema.
        yield schemaInput.addSource({ name: typeName, schema: jsonSchemaString });
        const inputData = new quicktypeCore.InputData();
        inputData.addInput(schemaInput);
        return yield quicktypeCore.quicktype({
            inputData,
            lang: targetLanguage,
            /**@see https://github.com/quicktype/quicktype/issues/1399 */
            rendererOptions: {
                "just-types": true,
                //   "runtime-typecheck": false,
            },
        });
    });
}
// const jsonSchemaString = `{"type":"object","properties":{"code":{"type":"string","description":"故障编号，示例：G101.2109.001"},"createBy":{"type":"string","description":"创建人"},"createTime":{"type":"string","format":"date-time","description":"创建时间"},"delFlag":{"type":"integer","format":"int32","description":"删除状态：0.未删除 1已删除"},"id":{"type":"integer","format":"int64","description":"主键id，自动递增"},"name":{"type":"string","description":"名称"},"type":{"type":"integer","format":"int32","description":"类型"},"updateBy":{"type":"string","description":"修改人"},"updateTime":{"type":"string","format":"date-time","description":"修改时间"},"url":{"type":"string","description":"地址"}},"title":"fault_enclosure对象","description":"故障-附件表","$$ref":"#/definitions/fault_enclosure对象"}`;
// async function main() {
// //   const { lines: swiftPerson } = await quicktypeJSON(
// //     "swift",
// //     "Person",
// //     jsonString
// //   );
// //   console.log(swiftPerson.join("\n"));
//   const { lines: pythonPerson } = await quicktypeJSONSchema(
//     "python",
//     "Person",
//     jsonSchemaString
//   );
//   console.log(pythonPerson.join("\n"));
// }
// main();

/**格式化时间，默认返回 YYYY-MM-DD HH:mm:ss 不使用dayjs */
function formatTime(time, format = "YYYY-MM-DD HH:mm:ss") {
    let date;
    if (typeof time === "number" || typeof time === "string") {
        date = date = new Date(time);
    }
    if (typeof time === "object") {
        date = date = time;
    }
    if (!date) {
        date = new Date();
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return format
        .replace(/YYYY|yyyy/, String(year))
        .replace(/YY|yy/, (year + "").substring(2))
        .replace(/MM/, String(month < 10 ? "0" + month : month))
        .replace(/M/, String(month))
        .replace(/DD|dd/, String(day < 10 ? "0" + day : day))
        .replace(/D|d/, String(day))
        .replace(/HH|hh/, String(hour < 10 ? "0" + hour : hour))
        .replace(/H|h/, String(hour))
        .replace(/mm/, String(minute < 10 ? "0" + minute : minute))
        .replace(/m/, String(minute))
        .replace(/ss|SS/, String(second < 10 ? "0" + second : second))
        .replace(/S|s/, String(second));
}

var tsModel = (requests, { opts }) => {
    // console.log("🚀 -> file: tsModel.ts -> line 6 -> requests", requests)
    // const requests = from === "request" ? proejct : proejct.getRequests();
    return requests.map((request) => new TsModelRequest(request, opts === null || opts === void 0 ? void 0 : opts.responseField));
};
class TsModelRequest extends Request {
    constructor(params, responseField) {
        super(params);
        this.responseField = "data";
        this.responseField = responseField || this.responseField;
    }
    /**字段 */
    codegenReqDesc({ requestType: type, request: schema, title } = this) {
        const result = [];
        result.push(`/** ${title}`);
        result.push(`* 生成时间: ${formatTime()}`);
        if (schema) {
            const paramType = type === "body" ? "data" : "params";
            const properties = schema.properties;
            result.push(`* @param { object } ${paramType}`);
            Object.entries(properties).map(([key, value]) => {
                result.push(`* @param { ${value.type} } ${paramType}.${key} ${value.description || ""}  `);
            });
        }
        result.push(`* @returns {}`);
        result.push(`*/`);
        return result;
    }
    /**创建请求主体*/
    codegenReqBody({ name, requestType, path, method } = this) {
        const result = [];
        const argsName = requestType === "body" ? "data" : "params";
        const [paramsInterface, responseInterface] = this.getInterfaceName();
        result.push(`export function ${name}(${argsName}:${paramsInterface}):${responseInterface} {`);
        result.push(`    return request({`);
        result.push(`      url: "${path}",`);
        result.push(`      method: "${method.toLowerCase()}",`);
        result.push(`      ${argsName}: ${argsName},`);
        result.push(`    });`);
        result.push(`}`);
        return result;
    }
    getInterfaceName() {
        return [`I${this.name}Request`, `I${this.name}Response`];
    }
    codegenInterfaceRes({ response } = this) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, responseInterface] = this.getInterfaceName();
            if (!(response === null || response === void 0 ? void 0 : response.properties))
                return [`export type ${responseInterface} = any`];
            const resultSchema = response.properties[this.responseField];
            if (!resultSchema)
                return [`export type ${responseInterface} = any`];
            const result = [];
            try {
                const { lines } = yield quicktypeJSONSchema("typescript", responseInterface, JSON.stringify(resultSchema));
                result.push(...lines);
            }
            catch (error) {
                console.log("🚀 -> file: tsModel.ts -> line 76 -> TsModelRequest -> codegenInterfaceRes -> error", error);
                result.push(`export type ${responseInterface} = any`);
            }
            return result;
        });
    }
    codegenInterfaceReq() {
        return __awaiter(this, void 0, void 0, function* () {
            const [responseInterface] = this.getInterfaceName();
            const schema = this.request;
            if (!schema)
                return [`export type ${responseInterface} = any`];
            const result = [];
            try {
                schema.description = this.title + "__请求对象";
                const { lines } = yield quicktypeJSONSchema("typescript", responseInterface, JSON.stringify(schema));
                result.push(...lines);
            }
            catch (error) {
                console.log("🚀 -> file: tsModel.ts -> line 94 -> TsModelRequest -> codegenInterfaceReq -> error", error);
                result.push(`export type ${responseInterface} = any`);
            }
            return result;
        });
    }
    getResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const descArray = this.codegenReqDesc(this);
            const bodyArray = this.codegenReqBody(this);
            const interfaceArrayReq = yield this.codegenInterfaceReq();
            const interfaceArrayRes = yield this.codegenInterfaceRes();
            return [
                ...(interfaceArrayReq || []),
                ...(interfaceArrayRes || []),
                ...descArray,
                ...bodyArray,
            ].join("\n");
        });
    }
}

module.exports = tsModel;
