const Queue = require('better-queue');
const TaskResult = require('./TaskResult');
const TaskError = require('./TaskError');

/**
 * Create a queue that take an asynchronous processor as parameter
 */
const create = (asyncProcessor, options) =>
  new Queue((task, done) => {
    asyncProcessor(task.content)
      .then(result => done(null, new TaskResult(task.content, result)))
      .catch(error => done(new TaskError(task.content, error)));
  }, options);

module.exports = {
  create
};
