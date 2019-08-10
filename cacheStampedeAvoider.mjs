// maintain if a call to the database is in progress by a simple object cacheStampedeAvoider. Add a key if there is a cache miss. Proceed to fetch the data from database, update the cache and then delete the key from the object.
import { getDataFromDb } from './getDataFromDb';
import { debounce } from './debounce';
import singletonCache from './cache';

const cacheStampedeAvoider = {};

export const workflowWithOneCacheMiss = key =>
  new Promise(async (resolve, reject) => {
    if (cacheStampedeAvoider[key]) {
      const num = 1000 + Math.random() * (500 - 0);
      const debouncedFunction = debounce(workflowWithOneCacheMiss, num);
      await debouncedFunction(key);
      resolve('resolve from debounce');
    } else {
      console.log('key not found');
      cacheStampedeAvoider[key] = true;
      const dataFromCache = await singletonCache.getDataFromCache(key);
      if (!dataFromCache) {
        const dataFromDb = await getDataFromDb();
        if (dataFromDb) {
          await singletonCache.setDataInCache(key);
          delete cacheStampedeAvoider[key];
          resolve(true);
        } else {
          reject(new Error('db called failed'));
        }
      } else {
        delete cacheStampedeAvoider[key];
        resolve('got data from cache');
      }
    }
  });
