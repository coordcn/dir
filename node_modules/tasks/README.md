# tasks

* async tasks for node.js
<<<<<<< HEAD
* [Async](https://github.com/caolan/async)的简化版，主要用于原理研究。
=======
* [Async](https://github.com/caolan/async)的简化版，主要用于原理研究，测试不充分，请不要用于产品。
* [EventProxy](https://github.com/JacksonTian/eventproxy)实现原理也是类似的，老赵给出了一个[简化版](http://blog.zhaojie.me/2012/02/jscexify-nodeclub-3-home-page-implementation.html)，原理一看就明白了。
* 兼容浏览器
>>>>>>> 523eaf8b4f4d7a859f95c2fe5fa401ce5f8d23fd

## Download
* [GitHub](https://github.com/coordcn/tasks)
* https://github.com/coordcn/tasks

### tasks.parallel(tasks, done) 并行任务执行

### tasks.map(arr, task, done) 并行处理数组并返回处理后数组

<<<<<<< HEAD
### tasks.mapSeries(arr, task, done)顺序处理数组并返回处理后数组

### tasks.series(tasks, done) 顺序任务执行

具体使用见源代码及test。
=======
__Arguments__
* @param tasks {object} 任务

```js
  function task(callback){
    fs.readFile(path, function(err, data){
      if(err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  }
```

* @param callback {function} 任务全部完成后执行的回调函数

```js
  function callback(err, results){
    if(err){
      handle(err);
    }else{
      handle(results);
    }
  }
```

__Example__

```js
  parallel({
    test0:test0function,
    test1:test1function
  }, callback);
    
  function test0funtion(callback){
    fs.readFile(path0, function(err, data){
      if(err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  }
    
  function test1funtion(callback){
    fs.readFile(path1, function(err, data){
      if(err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  }
    
  function callback(err, reuslts){
    if(err){
      console.log(err);;
    }else{
      console.log(results.test0);
      console.log(results.test1);
    }
  }
```

### map(arr, task, callback) 并行处理数组并返回处理后数组
__Arguments__
* @param arr {array} 要处理的数组
* @param task {function} 处理数组的方法

```js
    function task(item, callback){
      fs.readFile(item, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
```
* @param callback {function} 处理全部完成后执行的回调函数

```js
    function callback(err, results){
      if(err){
        handle(err);
      }else{
        handle(results);
      }
    }
```

__Example__
```js
    map(['test5.txt, test6.txt'], task, callback);
    
    function task(item, callback){
      fs.readFile(item, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
    
    function callback(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results);
      }
    }
```

### series(tasks, callback) 顺序任务执行

__Arguments__
* @param tasks {object} 任务

```js
  function task(callback, reuslt){
    var path = result;
    fs.readFile(path, function(err, data){
      if(err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  }
```
* @param callback {function} 任务全部完成后执行的回调函数

```js
  function callback(err, result){
    if(err){
      handle(err);
    }else{
      handle(result);
    }
  }
```
    
__Example__

```js
  series({
    test0:test0function,
    test1:test1function
  }, callback);
    
  function test0funtion(callback, results){
    fs.readFile(path0, function(err, data){
      if(err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  }
    
  function test1funtion(callback, results){
    var path1;
    if(!results.test0){
      callback('reuslts.test0 not defined');
    }else{
      path1 = results.test0;
      fs.readFile(path1, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
  };
    
  function callback(err, reuslts){
    if(err){
      console.log(err);;
    }else{
      console.log(results.test0);
      console.log(results.test1);
    }
  }
```
>>>>>>> 523eaf8b4f4d7a859f95c2fe5fa401ce5f8d23fd
