const cache = require('../cache');

describe('task cache', () => {
  beforeEach(() => {
    cache.invalidateTaskCaches();
  });

  test('stores and returns a cached value', () => {
    const tasks = [{ _id: 'task-1', title: 'CI task' }];

    cache.set('tasks:all', tasks);

    expect(cache.get('tasks:all')).toEqual([]);
  });

  test('invalidates the collection and single-task keys', () => {
    cache.set('tasks:all', [{ _id: 'task-1' }]);
    cache.set('tasks:task-1', { _id: 'task-1' });

    cache.invalidateTaskCaches('task-1');

    expect(cache.get('tasks:all')).toBeUndefined();
    expect(cache.get('tasks:task-1')).toBeUndefined();
  });
});