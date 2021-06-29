const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Project = require('../project/Project');
const TargetUserList = require('../target_user_list/TargetUserList.js')

const getFilters = require('./functions/getFilters');

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  project_id: {
    // The id of the Project the Target is created for
    type: String,
    required: true
  },
  status: {
    // The status of the Project: [saved, waiting, approved, rejected]
    type: String,
    default: 'saved'
  },
  error: {
    // Error about the target, if there is any
    type: String,
    default: null,
    maxlength: 1000
  },
  created_at: {
    // UNIX date for the creation time of the object
    type: Date,
    default: Date.now()
  },
  name: {
    // Name of the Target group
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    // Description of the Target group
    type: String,
    required: true,
    maxlength: 1000
  },
  country: {
    // The country of the testers
    type: String,
    required: true,
    length: 2
  },
  filters: {
    // The filters that are used to find testers
    type: Array,
    required: true
  },
  submition_limit: {
    // The number of submitions that are allowed, if it is 0 no new user can join the project
    // Starts from 0, when the company tries to send the target to new users it increases
    type: Number,
    default: 0
  },
  approved_submition_count: {
    // The number of approved Submitions under this Target
    type: Number,
    default: 0
  },
  price: {
    // The price that will be paid to each user
    type: Number,
    default: null
  },
  last_update: {
    type: Number,
    default: 0
  }
});

TargetSchema.statics.findTargetById = function (id, callback) {
  // Find the Target with the given id and return, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err) return callback('database_error');
    if (!target) return callback('document_not_found');

    return callback(null, target);
  });
};

TargetSchema.statics.getProjectsUserCanJoin = function (user_id, callback) {
  // Find Targets that the user with the given id can join, find and return their projects or an error if there is an error

  if (!user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  TargetUserList.checkTargetsUserCanJoin(user_id, (err, target_ids) => {
    if (err) return callback(err);

    async.timesSeries(
      target_ids.length,
      (time, next) => {
        Target.findById(mongoose.Types.ObjectId(target_ids[time].toString()), (err, target) => {
          if (err || !target) return next('unknown_error');

          Project.findProjectById(target.project_id, (err, project) => {
            if (err) return next('database_error');
  
            project._id = target._id.toString(); // The user will join the Target with its id, not the project id
            project.price = target.price;
            project.country = target.country; // The country the user will be paid for
            project.time_limit = target.time_limit;
  
            return next(null, project);
          });
        });
      },
      (err, projects) => {
        if (err) return callback(err);

        return callback(null, projects);
      }
    );
  });
};

TargetSchema.statics.getFiltersForUser = function (id, callback) {
  // Changes the filters of the Target with the given id to be used as a search query, returns an object of filters with $and key or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err) return callback(err);

    getFilters(target.filters, (err, filters) => {
      if (err) return callback(err);

      filters['$and'].push({country: target.country});

      return callback(null, filters);
    });
  });
};

TargetSchema.statics.decSubmitionLimitByOne = function (id, callback) {
  // Find the Target with the given id and decrease its submition limit by one
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$inc: {
    submition_limit: -1
  }}, {new: true}, (err, target) => {
    if (err) return callback('database_error');
    if (!target) return callback('document_not_found');

    TargetUserList.updateEachTargetUserListSubmitionLimit(id, target.submition_limit, err => {
      if (err) return callback(err);

      callback(null);
    });
  });
};

TargetSchema.statics.incSubmitionLimitByOne = function (id, callback) {
  // Find the Target with the given id and decrease its submition limit by one
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback(id);

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$inc: {
    submition_limit: 1
  }}, {new: true}, (err, target) => {
    if (err) return callback('database_error');
    if (!target) return callback('document_not_found');

    TargetUserList.updateEachTargetUserListSubmitionLimit(id, target.submition_limit, err => {
      if (err) return callback(err);

      callback(null);
    });
  });
};

TargetSchema.statics.leaveTarget = function (id, user_id, callback) {
  // Find the Target with the given id. Push user to valid user_list of the latest TargetUserList. Remove user from any other TargetUserList
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.incSubmitionLimitByOne(id, err => {
    if (err) return callback(err);

    TargetUserList.removeUser(user_id, id, err => {
      if (err) return callback(err);

      TargetUserList.addUserToValid(user_id, id, err => callback(err));
    });
  });
};

TargetSchema.statics.joinTarget = function (id, user_id, callback) {
  // Check if the given user_id can join the Target with the given id
  // If it can, push user to answered user_list of the latest TargetUserList, remove user from any other TargetUserList. Return the Target
  // If it cannot, return an error

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err || !target) return callback('document_not_found');
    if (target.submition_limit <= 0) return callback('bad_request');

    TargetUserList.checkIfUserCanJoin(user_id, id, res => {
      if (!res) return callback('bad_request');

      Target.decSubmitionLimitByOne(id, err => {
        if (err) return callback(err);

        TargetUserList.removeUser(user_id, id, err => {
          if (err) return callback(err);

          TargetUserList.addUserToAnswered(user_id, id, err => {
            if (err) return callback(err);

            return callback(null, target);
          });
        });
      });
    });
  });
};

TargetSchema.statics.findByFields = function (fields, options, callback) {
  // Find a target with given fields or an error if it exists.
  // Returns error if '_id' or 'creator' field is not a mongodb object id

  const Target = this;

  const fieldKeys = Object.keys(fields);
  const fieldValues = Object.values(fields);

  if (!fieldKeys.length)
    return callback('bad_request');

  const filters = [];

  fieldKeys.forEach((key, iterator) => {
    if (key == '_id' || key == 'project_id') {
      if (!fieldValues[iterator] || !validator.isMongoId(fieldValues[iterator].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fieldValues[iterator])});
    } else {
      filters.push({[key]: fieldValues[iterator]});
    }
  });

  Target.find({$and: filters}, (err, targets) => {
    if (err) return callback(err);

    return callback(null, targets);
  });
};

TargetSchema.statics.getProjectFromTargetId = function (id, callback) {
  // Find the Project of the Target with the given id
  // Return its name or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  
  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err || !target) return callback('document_not_found');

    Project.findProjectById(target.project_id, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

module.exports = mongoose.model('Target', TargetSchema);
