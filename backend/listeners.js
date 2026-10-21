const taskEvents = require('./events');

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

taskEvents.on('task-created', (task) => {
  setImmediate(async () => {
    try {
      await delay(2000);
      console.log(`[Notification] Task "${task.title}" created at ${new Date().toISOString()}`);
    } catch (error) {
      taskEvents.emit('error', error);
    }
  });
});

taskEvents.on('task-deleted', (task) => {
  setImmediate(() => {
    console.log(`[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`);
  });
});

taskEvents.on('error', (error) => {
  console.error(`[Notification error] ${error.message}`);
});