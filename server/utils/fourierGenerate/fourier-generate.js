'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');

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

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

class Codegen {
    static run(source, config) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { target } = config;
            const result = [];
            try {
                for (var target_1 = __asyncValues(target), target_1_1; target_1_1 = yield target_1.next(), !target_1_1.done;) {
                    const helper = target_1_1.value;
                    // const requests = from === "request" ? proejct : proejct.getRequests();
                    result.push(yield this.getRunModule(helper)(source.getRequests(), config));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (target_1_1 && !target_1_1.done && (_a = target_1.return)) yield _a.call(target_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    static runRequests(requests, config) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { target } = config;
            const result = [];
            try {
                for (var target_2 = __asyncValues(target), target_2_1; target_2_1 = yield target_2.next(), !target_2_1.done;) {
                    const helper = target_2_1.value;
                    result.push(yield this.getRunModule(helper)(requests, config));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (target_2_1 && !target_2_1.done && (_a = target_2.return)) yield _a.call(target_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        });
    }
    static getRunModule(moduleName) {
        const moduleInstance = require(path.resolve(__dirname, moduleName));
        /**解决在cjs下直接导入 */
        return moduleInstance instanceof Function
            ? moduleInstance
            : moduleInstance.default;
    }
}

// import Swagger from "./swagger";
class Source {
    static run(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const CurrentSource = require("./" + config.sourceType).default;
            const instance = new CurrentSource(config.sourceOpts);
            return yield instance.fetch();
        });
    }
}

class FourierGenerator {
    constructor(config) {
        this.config = {
            sourceType: "swagger",
            target: ["jsModel"],
        };
        if (config)
            Object.assign(this.config, config);
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield Source.run(this.config);
            console.log("🚀 -> file: index.ts -> line 26 -> FourierGenerator -> generate -> source", source);
            return yield Codegen.run(source, this.config);
            // console.log(
            //   "🚀 -> file: index.ts -> line 28 -> FourierGenerator -> generate -> categoryCode",
            //   categoryCode
            // );
            // return source;
        });
    }
    codeByRequests(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return Codegen.runRequests(request instanceof Array ? request : [request], this.config);
        });
    }
}

exports.RequestMethod = void 0;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["DELETE"] = "DELETE";
})(exports.RequestMethod || (exports.RequestMethod = {}));
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

exports.FourierGenerator = FourierGenerator;
exports.Request = Request;
exports.getRequestSchema = getRequestSchema;
