// maintain if a call to the database is in progress by a simple object cacheStampedeAvoider. Add a key if there is a cache miss. Proceed to fetch the data from database, update the cache and then delete the key from the object.
import { getDataFromDb } from './getDataFromDb';
import { debounce } from './debounce';
import singletonCache from './cache';

// const cacheStampedeAvoider = {};
export const workflowWithOneCacheMiss = key => {
  return new Promise(async (resolve, reject) => {
    //check if the current value is being handle by another request - wait until the prev request fetch the value
    //from the db and add that value to the cache, then after it finish to wait num seconds try fetch again
    if (singletonCache.cacheStampedeAvoider[key]) {
      const num = 1000 + Math.random() * (500 - 0);
      const debouncedFunction = debounce(workflowWithOneCacheMiss, num);
      await debouncedFunction(key);
      resolve('resolve from debounce');
    } else {
      singletonCache.cacheStampedeAvoider[key] = true;
      const dataFromCache = await singletonCache.getDataFromCache(key);

      if (!dataFromCache) {
        const dataFromDb = await getDataFromDb();
        if (dataFromDb) {
          await singletonCache.setDataInCache(key);
          delete singletonCache.cacheStampedeAvoider[key];
          resolve(true);
        } else {
          reject(new Error('db called failed'));
        }
      } else {
        delete singletonCache.cacheStampedeAvoider[key];
        resolve('got data from cache');
      }
    }
  });
};
