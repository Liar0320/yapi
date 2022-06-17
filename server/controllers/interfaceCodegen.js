const interfaceCodeGen = require('../models/interfaceCodeGen.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');
const interfaceModel = require('../models/interface');

class interfaceCodegenController extends baseController {
  constructor(ctx) {
    super(ctx);
    // this.Model = yapi.getInst(interfaceCodeGen);
    // this.projectModel = yapi.getInst(projectModel);
    this.Model = yapi.getInst(interfaceModel);
    this.schemaMap = {
      listByUpdate: {
        '*type': 'string',
        '*typeid': 'number',
        apis: [
          {
            method: 'string',
            path: 'string'
          }
        ]
      }
    };
  }

  /**
   * 获取接口列表
   * @interface /interfaceCodegen/detail
   * @method GET
   * @category interface
   * @foldnumber 10
   * @param {Number}   id 接口id，不能为空
   * @returns {Object}
   * @example ./api/interface/get.json
   */
   async detail(ctx) {
    let params = ctx.params;
    // if (!params.id) {
    //   return (ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空'));
    // }

    try {
      let result = await this.Model.get(params.id);
      if(this.$tokenAuth){
        if(params.project_id !== result.project_id){
          ctx.body = yapi.commons.resReturn(null, 400, 'token有误')
          return;
        }
      }
      // console.log('result', result);
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(null, 490, '不存在的'));
      }
      let project = await this.projectModel.getBaseInfo(result.project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }
    //   yapi.emitHook('interface_get', result).then();
      result = result.toObject();
      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 获取接口列表
   * @interface /interfaceCodegen/detail
   * @method GET
   * @category interface
   * @foldnumber 10
   * @param {Number}   id 接口id，不能为空
   * @returns {Object}
   * @example ./api/interface/get.json
   */
   async ctx(ctx) {
    let params = ctx.params;
    if (!params.id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空'));
    }

    try {
      let result = await this.Model.get(params.id);
      if(this.$tokenAuth){
        if(params.project_id !== result.project_id){
          ctx.body = yapi.commons.resReturn(null, 400, 'token有误')
          return;
        }
      }
      // console.log('result', result);
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(null, 490, '不存在的'));
      }
      let project = await this.projectModel.getBaseInfo(result.project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }
    //   yapi.emitHook('interface_get', result).then();
      result = result.toObject();
      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

}

module.exports = interfaceCodegenController;
