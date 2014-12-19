/** 
  @copyright Copyright (C) 2014 coord.cn All rights reserved. 
  @overview directory sync functions 
  @author QianYe(coordcn@163.com)
  @license MTI License(http://mit-license.org/)
  @reference https://github.com/fishbar/xfs
             https://github.com/substack/node-mkdirp
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

/**
  @function mkdir(p, mode) remove the path
  @param p {string} path
  @param mode {number} mode
  @return {string} the path created
 */
function mkdir(p, mode){
  mode = mode || (0777 & (~process.umask()));
  
  var flag = true;
  var dirs = [];
  dirs.unshift(p);

  while(flag){
    var last = dirs[0];
    var current = path.dirname(last);
    if(last === current){
      flag = false;
    }else{
      dirs.unshift(current);
    }
  }
  
  dirs.forEach(function(item){
    var stat;
    try{
      stat = fs.statSync(item);
    }catch(err){
      if(err.code === 'ENOENT'){
        fs.mkdirSync(item, mode);
      }else{ 
        throw err; 
      }
    }
  });

  return dirs[dirs.length -  1];
}

/**
  @function writeFile(p, data) write file to the path(do not care whether the path exists or not)
  @param p {string} file path
  @param data {buffer} data
 */
function writeFile(p, data, options){
  if(!options){
    options = {encoding: 'utf-8', mode: 438, flag: 'w'};
  }
  
  var dir = path.dirname(p);
  mkdir(dir);
  fs.writeFileSync(p, data, options);
}

/**
  @function walk(p, fn, dir) treat all files with fn.(if dir is true treat all files and directories) 
  @param p {string|array[string]} path[path array, directory, directory array]
  @param fn {function(file)} treat function
  @param regexp {boolean} treat the path which match regexp
  @return {a
 */
function walk(p, fn, regexp){
  if(typeof fn !== 'function') throw new Error('walkSync(path, fn, regexp) fn must be a function.');
  
  return _walk(p, fn, regexp, true);
}

/**
  @function walk(p, fn, dir) treat all files with fn.(if dir is true treat all files and directories) 
  @param p {string|array[string]} path[path array, directory, directory array]
  @param fn {function(file)} treat function
  @param regexp {boolean} treat the path which match regexp
 */
function walkFile(p, fn, regexp){
  if(typeof fn !== 'function') throw new Error('walkFileSync(path, fn, regexp) fn must be a function.');
  
  return _walk(p, fn, regexp, false);
} 

function _walk(p, fn, regexp, dir){
  var ret = [];
  
  if(Array.isArray(p)){
    p.forEach(function(item){
      __walk(item, fn, regexp, dir, ret);
    });
  }else{
    __walk(p, fn, regexp, dir, ret);
  }
  
  return ret;
}

function __walk(p, fn, regexp, dir, ret){
  var files;
  try{
    files = fs.readdirSync(p);
  }catch(err){
    if(err.code === 'ENOENT'){
      return ret;
    }else if(err.code === 'ENOTDIR'){
      if(!regexp || (regexp && regexp.test(p))){
        fn(p);
        ret.push(p);
      }
      return ret;
    }else{
      throw err;
    }
  }
  
  if(files.length){
    files.forEach(function(item){
      __walk(path.join(p, item), fn, regexp, dir, ret);
    });
  }
  
  if(dir){
    if(!regexp || (regexp && regexp.test(p))){
      fn(p);
      ret.push(p);
    }
  }

  return ret
}

/**
  @function watch(p, fn) watch all files an directories in the path 
  @param p {string|array[string]} path[path array, directory, directory array]
  @param fn {function(event, file)} same as fs.watch
  @param interval {number} watch interval
 */
function watch(p, fn, interval){
  if(typeof fn !== 'function') throw new Error('watch(path, fn, interval) fn must be a function.');
  
  return new Watcher(p, fn, interval);
}

function Watcher(p, fn, interval){
  var self = this;
  var watchers = [];
  var protection = false;
  
  this.files = walk(p, function(item){
    watchers.push(fs.watch(item, function(event, file){
      if(file){
        if(interval){
          if(!protection){
            protection = true; 
            setTimeout(function(){
              protection = false;
              fn(event, file);
            }, interval);
          }
        }else{
          fn(event, file);
        }
      }
    }));
  });
  
  this.close = function(){
    for(var i = 0, l = watchers.length; i < l; i++){
      watchers[i].close();
    }
  };
}

/**
  @function rm(p, regexp) remove all files and directories in the path
  @param p {string} path[path array, directory, directory array]
  @param regexp {regexp} remove the path which match regexp
 */
function rm(p, regexp){
  return _rm(p, regexp, true);
}

/**
  @function rm(p, regexp) remove all files and directories in the path
  @param p {string} path[path array, directory, directory array]
  @param regexp {regexp} remove the path which match regexp
 */
function rmFile(p, regexp){
  return _rm(p, regexp, false);
}

function _rm(p, regexp, dir){
  return _walk(p, function(file){
    var stat;
    try{
      stat = fs.statSync(file);
    }catch(err){
      if(err.code === 'ENOENT'){
        return;
      }else{
        throw err;
      }
    }
    
    if(stat.isFile()){
      fs.unlinkSync(file);
    }
    
    if(stat.isDirectory()){
      fs.rmdirSync(file);
    }
  }, regexp, dir);
}