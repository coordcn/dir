/** 
  @copyright Copyright (C) 2014 coord.cn All rights reserved. 
  @overview 异步任务
  @author Qianye(coordcn@163.com)
 */
 
(function(global){
  var tasks = {};

  function _keys(obj){
    if(Object.keys){
      return Object.keys(obj);
    }
    
    var keys = [];
    for(var i in obj){
      if(obj.hasOwnProperty(i)){
        keys.push(i);
      }
    }
    return keys;
  }
  
  function _each(arr, iterate){
    if(arr.forEach){
      return arr.forEach(iterate);
    }
    
    var length = arr.length;
    for(var i = 0; i < length; i++){
      iterate(arr[i], i, arr);
    }
  }
  
/**
  @function parallel(tasks, done) 并行任务执行
  @param tasks {object} 任务
    function task(callback){
      fs.readFile(path, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
  @param done {function} 任务全部完成后执行的回调函数
    function done(err, results){
      if(err){
        handle(err);
      }else{
        handle(results);
      }
    }
  @example
    parallel({
      test0:test0function,
      test1:test1function
    }, done);
    
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
    
    function done(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results.test0);
        console.log(results.test1);
      }
    }
 */
tasks.parallel = function(tasks, done){
  var keys = _keys(tasks);
  var length = keys.length;
  if(length < 1) return;
  done = done || function(){};
  
  var results = {};
  var completed = 0;
  
  _each(keys, function(key){
    tasks[key](function(err, result){
      if(err){
        done(err);
        done = function(){};
      }else{
        results[key] = result;
        completed++;
        if(completed >= length){
          done(null, results);
        }
      }
    });
  });
};

/**
  @function map(arr, task, done) 并行处理数组并返回处理后数组
  @param arr {array} 要处理的数组
  @param task {function} 处理数组的方法
    function task(item, callback){
      fs.readFile(item, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
  @param done {function} 处理全部完成后执行的回调函数
    function done(err, results){
      if(err){
        handle(err);
      }else{
        handle(results);
      }
    }
  @example
    map(['test5.txt', 'test6.txt'], task, done);
    
    function task(item, callback){
      fs.readFile(item, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
    
    function done(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results);
      }
    }
 */
tasks.map = function(arr, task, done){
  var length = arr.length;
  if(length < 1) return;
  done = done || function(){};
  
  var results = [];
  var completed = 0;
  
  _each(arr, function(x, i){
    task(x, function(err, result){
      if(err){
        done(err);
        done = function(){};
      }else{
        results[i] = result;
        completed++;
        if(completed >= length){
          done(null, results);
        }
      }
    });
  });
};

/**
  @function mapSeries(arr, task, done) 顺序处理数组并返回处理后数组
  @param arr {array} 要处理的数组
  @param task {function} 处理数组的方法
    function task(item, callback){
      fs.readFile(item, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
  @param done {function} 处理全部完成后执行的回调函数
    function done(err, results){
      if(err){
        handle(err);
      }else{
        handle(results);
      }
    }
  @example
    mapSeries(['test5.txt', 'test6.txt'], task, done);
    
    function task(item, callback){
      fs.readFile(item, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
    
    function done(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results);
      }
    }
 */
tasks.mapSeries = function(arr, task, done){
  var length = arr.length;
  if(length < 1) return;
  done = done || function(){};
  
  var results = [];
  var completed = 0;
  
  var iterate = function(){
    task(arr[completed], function(err, result){
      if(err){
        done(err);
        done = function(){};
      }else{
        results[completed] = result;
        completed++;
        if(completed >= length){
          done(null, results);
        }else{
          iterate();
        }
      }
    }, results);
  };
  
  iterate();
};

/**
  @function series(tasks, done) 顺序任务执行
  @param tasks {object} 任务
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
  @param done {function} 任务全部完成后执行的回调函数
    function done(err, result){
      if(err){
        handle(err);
      }else{
        handle(result);
      }
    }
  @example
    series({
      test0:test0function,
      test1:test1function
    }, done);
    
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
      var path1 = results.test0;
      fs.readFile(path1, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    };
    
    function done(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results.test0);
        console.log(results.test1);
      }
    }
 */
tasks.series = function(tasks, done){
  var keys = _keys(tasks);
  var length = keys.length;
  
  if(length < 1) return;
  done = done || function(){};
  
  var results = {};
  var completed = 0;
  
  var iterate = function(){
    var key = keys[completed];
    (function(key){
      tasks[key](function(err, result){
        if(err){
          done(err);
          done = function(){};
        }else{
          results[key] = result;
          completed++;
          if(completed >= length){
            done(null, results);
          }else{
            iterate();
          }
        }
      }, results);
    })(key);
  };
 
  iterate();
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = tasks;
}else if(typeof define === 'function'){
  define(tasks);
}else{
  global.tasks = tasks;
}

})(this);