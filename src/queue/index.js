const Queue = require('better-queue');
const TaskResult = require('./TaskResult');
const TaskError = require('./TaskError');

/**
 * Create a queue that take an asynchronous processor as parameter
 */
const create = (asyncProcessor, options) =>
  new Queue((task, done) => {
    const processor = asyncProcessor(task.content)
      .then(result => done(null, new TaskResult(task, result)))
      .catch(error => done(new TaskError(task, error)));

    return {
      cancel: () => processor.cancel()
    };
  }, options);

module.exports = {
  create
};
