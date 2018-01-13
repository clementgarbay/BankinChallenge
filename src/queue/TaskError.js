/**
 * POJO representing the error of a task that failed
 */
module.exports = function TaskError(taskContent, error) {
  this.taskContent = taskContent;
  this.error = error;
};
