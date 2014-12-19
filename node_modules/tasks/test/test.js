var tasks = require('../lib/tasks');
var fs = require('fs');
var assert = require('assert');

var base = 'test/'
var file0 = base + 'test0.txt';
var content0 = 'test1.txt';
var file1 = base + 'test1.txt';
var content1 = 'test2.txt';
var file2 = base + 'test2.txt'
var content2 = '中华人民共和国万岁！';
var files = [file0, file1, file2];
var contents = [content0, content1, content2];

describe('tasks.parallel(tasks, done)', function(){
  it('tasks.parallel(tasks, done)', function(done){
    function readFile0(cb){
      fs.readFile(file0, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function readFile1(cb){
      fs.readFile(file1, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function readFile2(cb){
      fs.readFile(file2, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function callback(err, results){
      if(err) throw err;
      assert.ok(content0 === results.content0);
      assert.ok(content1 === results.content1);
      assert.ok(content2 === results.content2);
      done();
    }
    
    tasks.parallel({
      content0: readFile0,
      content1: readFile1,
      content2: readFile2
    }, callback);
  });
});

describe('tasks.map(arr, task, done)', function(){
  it('tasks.map(arr, task, done)', function(done){
    function readFile(item, cb){
      fs.readFile(item, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function callback(err, results){
      if(err) throw err;
      var c1 = results.sort();
      var c2 = contents.sort();
      assert.deepEqual(c1, c2);
      done();
    }
    
    tasks.map(files, readFile, callback);
  });
});

describe('tasks.mapSeries(arr, task, done)', function(){
  it('tasks.mapSeries(arr, task, done)', function(done){
    function readFile(item, cb, results){
      if(results[0]){
        assert.ok(content0, results[0]);
      }
      if(results[1]){
        assert.ok(content1, results[1]);
      }
      fs.readFile(item, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function callback(err, results){
      if(err) throw err;
      var c1 = results;
      var c2 = contents;
      assert.deepEqual(c1, c2);
      done();
    }
    
    tasks.mapSeries(files, readFile, callback);
  });
});

describe('tasks.series(tasks, done)', function(){
  it('tasks.series(tasks, done)', function(done){
    function readFile0(cb, results){
      fs.readFile(file0, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function readFile1(cb, results){
      fs.readFile(base + results.content0, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function readFile2(cb, results){
      fs.readFile(base + results.content1, 'utf-8', function(err, data){
        if(err){
          cb(err);
        }else{
          cb(null, data);
        }
      });
    }
    
    function callback(err, results){
      if(err) throw err;
      assert.ok(content0 === results.content0);
      assert.ok(content1 === results.content1);
      assert.ok(content2 === results.content2);
      done();
    }
    
    tasks.series({
      content0: readFile0,
      content1: readFile1,
      content2: readFile2
    }, callback);
  });
});