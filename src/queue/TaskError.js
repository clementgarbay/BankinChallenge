/**
 * POJO representing the error of a task that failed
 */
module.exports = function TaskError(task, error) {
  this.task = task;
  this.error = error;
};
