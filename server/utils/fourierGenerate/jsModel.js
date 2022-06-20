'use strict';

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

// import { Project } from "@/models/Project";
var jsModel = (requests) => {
    // console.log("🚀 -> file: jsModel.ts -> line 4 -> proejct", proejct);
    // const requests = from === "request" ? proejct : proejct.getRequests();
    return requests.map((request) => new JsModelRequest(request));
};
/** 巡检人员巡检项报告表-单项报告提交/保存
 * 生成时间: 2022-06-12 19:06:32
 * @param { object } data
 * @param { string } data.children undefined  undefined
 * @param { string } data.content 保留字段  undefined
 * @param { string } data.contentId 任务项id  undefined
 * @param { string } data.note 填写项内容  undefined
 * @param { string } data.reportStatus 异常状态 0.文字项 1.无异常 2.异常  undefined
 * @param { string } data.saveStatus 保存状态 0.保存 1.提交  undefined
 * @param { string } data.taskId 巡检任务表id  undefined
 * @param { string } data.unNote 异常描述  undefined
 * @param { string } data.urlList url地址集合  undefined
 * @returns
 */
class JsModelRequest extends Request {
    /**字段 */
    codegenReqDesc({ requestType: type, request: schema, title } = this) {
        const result = [];
        result.push(`/** ${title}`);
        result.push(`* 生成时间: ${formatTime()}`);
        if (schema) {
            const paramType = type === "body" ? "data" : "params";
            const properties = schema.properties || schema;
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
        const argsName = requestType === "query" ? "params" : "data";
        result.push(`export function ${name}(${argsName}) {`);
        result.push(`    return request({`);
        result.push(`      url: "${path}",`);
        result.push(`      method: "${method.toLowerCase()}",`);
        result.push(`      ${argsName}: ${argsName},`);
        result.push(`    });`);
        result.push(`}`);
        return result;
    }
    getJsModelReq() {
        const descArray = this.codegenReqDesc(this);
        const bodyArray = this.codegenReqBody(this);
        return [...descArray, ...bodyArray].join("\n");
    }
    codegenResDesc({ response, responseType } = this) {
        /**@TODO 实现返回值的描述
         * @see https://www.shouce.ren/api/view/a/13296
         * @see https://www.656463.com/wenda/JSDocfanhuiduixiangjiegou_163 */
    }
}
// Define separately:
// /**
//  * @typedef {Object} Point
//  * @property {number} x - The X Coordinate
//  * @property {number} y - The Y Coordinate
//  */
// And use:
// /**
//  * Returns a coordinate from a given mouse or touch event
//  * @param  {TouchEvent|MouseEvent|jQuery.Event} e
//  *         A valid mouse or touch event or a jQuery event wrapping such an
//  *         event.
//  * @param  {string} [type="page"]
//  *         A string representing the type of location that should be
//  *         returned. Can be either "page", "client" or "screen".
//  * @return {Point}
//  *         The location of the event
//  */
// var getEventLocation = function(e, type) {
//     ...
//     return {x: xLocation, y: yLocation};
// }

module.exports = jsModel;
