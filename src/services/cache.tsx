const maxCacheSize = 50;

interface Cached {
  timestamp: number;
  maxAgeS: number | null;
  data: any;
}

const cache: Record<string, Cached> = {};
const cacheKeys: string[] = [];

const keepCacheUnderMaxSize = (key: string): void => {
  cacheKeys.unshift(key);
  if (cacheKeys.length > maxCacheSize) {
    const keyToRemove = cacheKeys.pop();
    if (keyToRemove && keyToRemove in cache) {
      delete cache[keyToRemove];
    }
  }
};

const removeCachedItem = (key: string): void => {
  if (key in cache) {
    delete cache[key];
  }
  const index = cacheKeys.indexOf(key);
  if (index > -1) {
    cacheKeys.splice(index, 1);
  }
};

export const setToCacheWithExpiry = (key: string, data: any, maxAgeS: number | null) => {
  const timestamp = new Date().getTime();
  cache[key] = { data, timestamp, maxAgeS };
  keepCacheUnderMaxSize(key);
};

export const setToCache = (key: string, data: any): void => {
  setToCacheWithExpiry(key, data, null);
};

export const getFromCache = (key: string): any | null => {
  if (key in cache) {
    const timestamp = new Date().getTime();
    const ageS = Math.round((timestamp - cache[key].timestamp) / 1000);
    if (!cache[key].maxAgeS || ageS < cache[key].maxAgeS!) {
      return cache[key].data;
    } else {
      removeCachedItem(key);
      return null;
    }
  } else {
    return null;
  }
};
