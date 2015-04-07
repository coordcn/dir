/** 
  @copyright Copyright (C) 2014 coord.cn All rights reserved. 
  @overview directory aync functions 
  @author QianYe(coordcn@163.com)
  @license MTI License(http://mit-license.org/)
  @reference https://github.com/fishbar/xfs
             https://github.com/substack/node-mkdirp
             https://github.com/jprichardson/node-fs-extra
 */

var tasks = require('tasks');
var fs = require('fs');
var path = require('path');

exports.mkdir = mkdir;
exports.writeFile = writeFile;
exports.walk = walk;
exports.walkFile = walkFile;
exports.watch = watch;
exports.rm = rm;
exports.rmFile = rmFile;

function maybeCallback(fn){
  return (typeof fn === 'function') ? fn : null;
}

function treatError(done, err){
  if(done){
    done(err);
  }else{
    throw err;
  }
}

/**
  @function mkdir(p[, mode], done)
  @param p {string} path
  @param mode {number} mode
  @param done {function(err, path)} done function
 */
function mkdir(p, mode, done){
  done = maybeCallback(arguments[arguments.length - 1]);
  
  if((typeof mode === 'function') || !mode){
    mode = 0777 & (~process.umask());
  }
  
  var flag = true;
  var dirs = [];
  dirs.unshift({path: p, mode: mode});

  while(flag){
    var last = dirs[0];
    var current = path.dirname(last.path);
    if(last.path === current){
      flag = false;
    }else{
      dirs.unshift({path: current, mode: mode});
    }
  }
  
  tasks.mapSeries(dirs, function(item, callback){
    fs.stat(item.path, function(err, stat){
      if(err){
        if(err.code === 'ENOENT'){
          fs.mkdir(item.path, item.mode, function(err1){
            if(err1){
              callback(err1);
            }else{
              callback(null, item.path);
            }
          });
        }else{
          callback(err);
        }
      }else{
        callback(null, item.path);
      }
    });
  }, function(err2, results){
    if(err2){
      treatError(done, err2);
    }else{
      if(done) done(null, results[results.length - 1]);
    }
  });
}

/**
  @function writeFile(p, data[, options], done) write file to the path(do not care whether the path exists or not)
  @param p {string} file path
  @param data {buffer} data
  @param options {string|object} {encoding:'utf-8', mode:0666, flag:'w'}
  @param done {function(err)} done function
 */
function writeFile(p, data, options, done){
  var done = maybeCallback(arguments[arguments.length - 1]);
  
  if((typeof options === 'function') || !options){
    options = {encoding: 'utf-8', mode: 438, flag: 'w'};
  }
  
  var dir = path.dirname(p);
  mkdir(dir, function(err){
    if(err){
      treatError(done, err);
    }else{
      fs.writeFile(p, data, options, function(err1){
        if(err1){
          treatError(done, err1);
        }else{
          if(done) done();
        }
      });
    }
  });
}

function flatten(arr, ret){
  if(!arr) return [];
  if(!Array.isArray(arr)) return [arr];
  
  ret = ret || [];
  for(var i = 0, l = arr.length; i < l; i++){
    if(Array.isArray(arr[i])){
      flatten(arr[i], ret);
    }else{
      ret.push(arr[i]);
    }
  }
  
  return ret;
}

/**
  @function walk(p, fn[, regexp], done) treat all files and directories with fn
  @param p {string|array[string]} path[path array, directory, directory array]
  @param fn {function(file, callback(err))} treat function
  @param regexp {regexp} treat the path which match regexp
  @param done {function(err, files)} done function
 */
function walk(p, fn, regexp, done){
  if(typeof fn !== 'function') throw new Error('walk(path, fn, regexp, done) fn must be a function.');
  
  var done = maybeCallback(arguments[arguments.length - 1]);
  
  if(typeof regexp === 'function'){
    regexp = null;
  }

  _walk(p, fn, regexp, true, done);
}
 
 /**
  @function walkFile(p, fn[, regexp], done) treat all files with fn
  @param p {string|array[string]} path[path array, directory, directory array]
  @param fn {function(file, callback(err))} treat function
  @param regexp {regexp} treat the path which match regexp
  @param done {function(err, files)} done function
 */
function walkFile(p, fn, regexp, done){
  if(typeof fn !== 'function') throw new Error('walkFile(path, fn, regexp, done) fn must be a function.');
  
  var done = maybeCallback(arguments[arguments.length - 1]);
  
  if(typeof regexp === 'function'){
    regexp = null;
  }

  _walk(p, fn, regexp, false, done);
}
 
function _walk(p, fn, regexp, dir, done){
  if(Array.isArray(p)){
    tasks.map(p, function(item, callback){
      __walk(item, fn, regexp, dir, function(err, files){
        err ? callback(err) : callback(null, files);
      });
    }, function(err1, results){
      if(err1){
        treatError(done, err1);
      }else{
        if(done){
          var res = flatten(results).filter(function(elem){
            return elem;
          });
          done(null, res);
        }
      }
    });
  }else{
    __walk(p, fn, regexp, dir, function(err2, files){
      if(err2){
        treatError(done, err2);
      }else{
        if(done){
          var res = flatten(files).filter(function(elem){
            return elem;
          });
          done(null, res);
        }
      }
    });
  }
}
 
function __walk(p, fn, regexp, dir, done){
  fs.readdir(p, function(err, files){
    if(err){
      if(err.code === 'ENOENT'){
        done(null, null);
      }else if(err.code === 'ENOTDIR'){
        if(!regexp || (regexp && regexp.test(p))){
          fn(p, function(err1){
            err1 ? done(err1) : done(null, p);
          });
        }else{
          done(null, null);
        }
      }else{
        done(err);
      }
    }else{ 
      if(files.length){
        var f = files.map(function(item){
          return path.join(p, item);
        });
        
        tasks.map(f, function(item, callback){
          fs.stat(item, function(err2, stat){
            if(err2){
              callback(err2);
            }else if(stat.isFile()){
              if(!regexp || (regexp && regexp.test(item))){
                fn(item, function(err3){
                  err3 ? callback(err3) : callback(null, item);
                });
              }else{
                callback(null, null);
              }
            }else if(stat.isDirectory()){
              __walk(item, fn, regexp, dir, function(err4, files){
                if(err4){
                  callback(err4);
                }else{
                  callback(null, files);
                }
              });
            }
          });
        }, function(err5, results){
          if(err5){
            done(err5);
          }else{
            if(dir){
              if(!regexp || (regexp && regexp.test(p))){
                fn(p, function(err6){
                  if(err6){
                    done(err6);
                  }else{
                    results.unshift(p);
                    done(null, results);
                  }
                });
              }else{
                done(null, results);
              }
            }else{
              done(null, results);
            }
          }
        });
      }else{
        if(dir){
          if(!regexp || (regexp && regexp.test(p))){
            fn(p, function(err7){
              err7 ? done(err7) : done(null, p);
            });
          }else{
            done(null, null);
          }
        }else{
          done(null, null);
        }
      }
    }
  });
}

/**
  @function watch(p, fn[, interval], done) watch all files an directories in the path 
  @param p {string|array[string]} path[path array, directory, directory array]
  @param fn {function(event, file)} same as fs.watch
  @param interval {number} watch interval
  @param done {function(err, watcher)} done when iterator all files and folders in the path 
 */
function watch(p, fn, interval, done){
  if(typeof fn !== 'function') throw new Error('watch(path, fn, interval) fn must be a function.');
  
  var done = maybeCallback(arguments[arguments.length - 1]);
  
  if(typeof interval === 'function'){
    interval = 0;
  }
  
  new Watcher(p, fn, interval, done);
}

function Watcher(p, fn, interval, done){
  var self = this;
  var watchers = [];
  var protection = false;
  
  walk(p, function(item, callback){
    watchers.push(fs.watch(item, function(event, file){
      if(file){
        if(interval){
          if(!protection){
            protection = true;
            fn(event, file);            
            setTimeout(function(){protection = false;}, interval);
          }
        }else{
          fn(event, file);
        }
      }
    }));
    callback(null);
  }, function(err, files){
    if(err){
      treatError(done, err);
    }else{
      if(done){
        self.files = files;
        done(err, self);
      }
    }
  });
  
  this.close = function(){
    for(var i = 0, l = watchers.length; i < l; i++){
      watchers[i].close();
    }
  };
}

/**
  @function rm(p[, regexp], done) remove all files and directories in the path
  @param p {string|array[string]} path[path array, directory, directory array]
  @param regexp {regexp} remove the path which match regexp
  @param done {function(err, files)} done function
 */
function rm(p, regexp, done){
  done = maybeCallback(arguments[arguments.length - 1]);
  
  if(typeof regexp === 'function'){
    regexp = null;
  }
  
  _rm(p, regexp, true, done);
}

/**
  @function rmFile(p[, regexp], done) remove all files in the path
  @param p {string} path[path array, directory, directory array]
  @param regexp {regexp} remove the path which match regexp
  @param done {function(err, files)} done function
 */
function rmFile(p, regexp, done){
  done = maybeCallback(arguments[arguments.length - 1]);
  
  if(typeof regexp === 'function'){
    regexp = null;
  }
  
  _rm(p, regexp, false, done);
}

function _rm(p, regexp, dir, done){
  _walk(p, function(item, callback){
    fs.stat(item, function(err, stat){
      if(err){
        callback(err);
      }else if(stat.isFile()){
        fs.unlink(item, function(err1){
          callback(err1);
        });
      }else if(stat.isDirectory()){
        fs.rmdir(item, function(err2){
          callback(err2);
        });
      }
    });
  }, regexp, dir, done);
}
