const yapi = require('../yapi.js');
const baseModel = require('./base.js');

/**
 * 接口分类
 */
class interfaceCodegen extends baseModel {
  getName() {
    return 'interface_codegen';
  }

  getSchema() {
    return {
      interface_name: { type: String, required: true },
      interface_id: { type: Number, required: true },
      project_id: { type: Number, required: true },
      codegen:{ type:String, required: false},
      desc: String,
      add_time: Number,
      up_time: Number,
      index: { type: Number, default: 0 }
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

//   checkRepeat(name) {
//     return this.model.countDocuments({
//       name: name
//     });
//   }

  list(project_id) {
    return this.model
      .find({
        project_id: project_id
      })
      .sort({ index: 1 })
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }

  upCatIndex(id, index) {
    return this.model.update(
      {
        _id: id
      },
      {
        index: index
      }
    );
  }
}

module.exports = interfaceCodegen;
