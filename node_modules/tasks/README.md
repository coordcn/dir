# tasks

* async tasks for node.js
* [Async](https://github.com/caolan/async)的简化版，主要用于原理研究，测试不充分，请不要用于产品。
* [EventProxy](https://github.com/JacksonTian/eventproxy)实现原理也是类似的，老赵给出了一个[简化版](http://blog.zhaojie.me/2012/02/jscexify-nodeclub-3-home-page-implementation.html)，原理一看就明白了。
* 兼容浏览器是很简单的，只要实现Object.keys和Array.forEach就行了

## Download
* [GitHub](https://github.com/coordcn/tasks)
* https://github.com/coordcn/tasks

## Documentation
* 特别要注意的是函数的定义必须使用
* function name(callback){}
* 不要使用
* var name = function(callback){};
* 应该是由于lazy compile的原因，这样写函数会出现未定义的错误。

### parallel(tasks, callback) 并行任务执行

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