const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const stats = { hits: 0, misses: 0 };

function get(key) {
  return read(key).value;
}

function read(key) {
  const value = cache.get(key);
  if (value === undefined) {
    stats.misses += 1;
    return { value: undefined, hit: false };
  }
  stats.hits += 1;
  return { value, hit: true };
}

function set(key, value) {
  cache.set(key, value);
}

function invalidateTaskCaches(id) {
  cache.del('tasks:all');
  if (id) cache.del(`tasks:${id}`);
}

function getStats() {
  return { ...stats, keys: cache.keys(), ttlSeconds: 60 };
}

module.exports = { get, read, set, invalidateTaskCaches, getStats };