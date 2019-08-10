class SingletonCache {
  constructor() {
    //STATIC VALUE
    if (!!SingletonCache.instance) {
      return SingletonCache.instance;
    }

    SingletonCache.instance = this;
    this.cache = {};
    this.cacheStampedeAvoider = {};
    this.cacheHits = 0;
    this.dbHits = 0;

    return this;
  }

  getDataFromCache(cacheKey) {
    return new Promise(resolve => {
      this.cacheHits += 1;
      setTimeout(() => {
        if (this.cache[cacheKey]) {
          console.log('data found in cache');
          return resolve(true);
        }
        console.log('data not found in cache');
        return resolve(false);
      }, 5);
    });
  }

  setDataInCache(cacheKey) {
    return new Promise(resolve => {
      console.log('setting cache');
      this.cacheHits += 1;
      setTimeout(() => {
        this.cache[cacheKey] = true;
        resolve(true);
      }, 5);
    });
  }
}

const singletonCache = new SingletonCache();
export default singletonCache;
