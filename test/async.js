var dir = require('../index');
var tasks = require('tasks');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

var x = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var y = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var z = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var xx = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var yy = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var zz = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
 
var base = 'dirtest/async/'; 
var folderx = base + x;
var foldery = base + [x, y].join('/');
var folderz = base + [x, y, z].join('/');
var folderxx = base + xx;
var folderyy = base + yy;
var folderzz = base + zz;

var folders = [base];
var filesall = [];
var filestxt = [];
var filesjs = [];

describe('dir.mkdir(path, mode, done)', function(){
  //当前目录创建
  it('dir.mkdir(' + folderx + ')', function(done){
    dir.mkdir(folderx, function(err, p){
      if(err) throw err;
      fs.stat(p, function(err1, stat){
        if(err1) throw err1;
        assert.ok(stat.isDirectory());
        folders.push(p);
        done();
      });   
    });
  });
  
  var mode = 0644;
  //当前目录带mode创建
  it('dir.mkdir(' + folderz + ', ' + mode + ')', function(done){
    dir.mkdir(folderz, mode, function(err, p){
      if(err) throw err;
      fs.stat(p, function(err1, stat){
        if(err1) throw err1;
        assert.ok(stat.isDirectory());
        folders.push(foldery);
        folders.push(p);
        done();
      });   
    });
  });
  
  //根目录创建
  it('dir.mkdir(' + '/' + folderx + ')', function(done){
    dir.mkdir('/' + folderx, function(err, p){
      if(err) throw err;
      fs.stat('/' + folderx, function(err1, stat){
        if(err1) throw err1;
        assert.ok(stat.isDirectory());
        done();
      });   
    });
  });
  
  //windows根目录创建
  it('dir.mkdir(' + 'e:/' + folderz + ')', function(done){
    dir.mkdir('e:/' + folderz, function(err,  p){
      if(err) throw err;
      fs.stat('e:/' + folderz, function(err1, stat){
        if(err1) throw err1;
        assert.ok(stat.isDirectory());
        done();
      });   
    });
  });
});

describe('dir.writeFile(path, data, options, done)', function(){
  var content = '中华人民共和国万岁！';
  
  var filexx = path.join(base + xx, 'test.txt');
  it('dir.writeFile(' + filexx + ', data)', function(done){
    dir.writeFile(filexx, content, function(err){
      if(err) throw err;
      fs.readFile(filexx, 'utf-8', function(err1, data){
        if(err1) throw err1;
        assert.ok(data === content);
        folders.push(base + xx);
        folders.push(filexx);
        filesall.push(filexx);
        filestxt.push(filexx);
        done();
      });   
    });
  });
  
  var fileyy = path.join(base + yy, 'test.txt');
  it('dir.writeFile(' + fileyy + ', data, \'utf-8\')', function(done){
    dir.writeFile(fileyy, content, 'utf-8', function(err){
      if(err) throw err;
      fs.readFile(fileyy, 'utf-8', function(err1, data){
        if(err1) throw err1;
        assert.ok(data === content);
        folders.push(base + yy);
        folders.push(fileyy);
        filesall.push(fileyy);
        filestxt.push(fileyy);
        done();
      });   
    });
  });
  
  var filezz = path.join(base + zz, 'test.txt');
  it('dir.writeFile(' + filezz + ', data, options)', function(done){
    dir.writeFile(filezz, content, {encoding: 'utf-8', mode: 0644, flag: 'w'}, function(err){
      if(err) throw err;
      fs.readFile(filezz, 'utf-8', function(err1, data){
        if(err1) throw err1;
        assert.ok(data === content);
        folders.push(base + zz);
        folders.push(filezz);
        filesall.push(filezz);
        filestxt.push(filezz);
        done();
      });   
    });
  });
});

describe('dir.walk(path, fn, regexp, done)', function(){
  //遍历所有文件包含目录
  it('dir.walk(' + base + ', fn, done)', function(done){
    dir.walk(base, function(file, callback){
      fs.stat(file, function(err, stat){
        if(err){
          callback(err);
        }else if(stat.isFile()){
          fs.writeFile(file, 'test', {flag: 'a'}, function(err1){
            if(err1){
              callback(err1);
            }else{
              callback(null);
            }
          });
        }else if(stat.isDirectory()){
          var f = path.join(file, 'test.js');
          dir.writeFile(f, '中华人民共和国万岁！test', function(err2){
            if(err2){
              callback(err2);
            }else{
              //folders.push(f);
              filesall.push(f);
              filesjs.push(f);
              callback(null);
            }
          });
        }
      });
    }, function(err3, files){
      if(err3) throw err3;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = folders.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      tasks.map(filesall, function(item, callback){
        var content = '中华人民共和国万岁！test';
        fs.readFile(item, 'utf-8', function(err4, data){
          if(err4){
            callback(err4);
          }else{
            assert.ok(data === content);
            callback(null, data);
          }
        }); 
      }, function(err5, results){
        if(err5) throw err5;
        done();
      });
    });
  });
  
  // 遍历所有.txt文件
  it('dir.walk(' + base + ', fn, /\.txt/, done)', function(done){
    dir.walk(base, function(file, callback){
      fs.stat(file, function(err, stat){
        if(err){
          callback(err);
        }else{
          dir.writeFile(file, 'test', {flag: 'a'}, function(err1){
            if(err1){
              callback(err1);
            }else{
              callback(null);
            }
          });
        }
      });
    }, /\.txt/, function(err2, files){
      if(err2) throw err2;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = filestxt.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort(); 
      assert.deepEqual(f1, f2);
      tasks.map(filestxt, function(item, callback){
        var content = '中华人民共和国万岁！testtest';
        fs.readFile(item, 'utf-8', function(err3, data){
          if(err3){
            callback(err3);
          }else{
            assert.ok(data === content);
            callback(null, data);
          }
        }); 
      }, function(err4, results){
        if(err4) throw err4;
        done();
      });
    });
  });
  
  var fa = [base + path.join(x, 'test.js'), base + xx, base + yy, base + zz];
  var fb = [
    base + path.join(x, 'test.js'),
    base + xx, 
    base + yy, 
    base + zz, 
    base + path.join(xx, 'test.js'), 
    base + path.join(yy, 'test.js'), 
    base + path.join(zz, 'test.js'),
    base + path.join(xx, 'test.txt'), 
    base + path.join(yy, 'test.txt'), 
    base + path.join(zz, 'test.txt')
  ];
  var fc = [
    base + path.join(x, 'test.js'),
    base + path.join(xx, 'test.js'), 
    base + path.join(yy, 'test.js'), 
    base + path.join(zz, 'test.js'),
    base + path.join(xx, 'test.txt'), 
    base + path.join(yy, 'test.txt'), 
    base + path.join(zz, 'test.txt')
  ];
  // 遍历数组
  it('dir.walk(array, fn, done)', function(done){
    dir.walk(fa, function(file, callback){
      fs.stat(file, function(err, stat){
        if(err){
          callback(err);
        }else if(stat.isFile()){
          fs.writeFile(file, 'test', {flag: 'a'}, function(err1){
            if(err1){
              callback(err1);
            }else{
              callback(null);
            }
          });
        }else if(stat.isDirectory()){
          callback(null);
        }
      });
    }, function(err2, files){
      if(err2) throw err2;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = fb.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      tasks.map(fc, function(item, callback){
        var contenttxt = '中华人民共和国万岁！testtesttest';
        var contentjs = '中华人民共和国万岁！testtest';
        var regjs = /\.js/;
        var regtxt = /\.txt/;
        fs.readFile(item, 'utf-8', function(err3, data){
          if(err3){
            callback(err3);
          }else{
            if(regjs.test(item)){
              assert.ok(data === contentjs);
              callback(null, data);
            }else if(regtxt.test(item)){
              assert.ok(data === contenttxt);
              callback(null, data);
            }
          }
        }); 
      }, function(err4, results){
        if(err4) throw err4;
        done();
      });
    });
  });
});

describe('dir.walkFile(path, fn, regexp, done)', function(){
  //遍历所有文件不包含目录
  it('dir.walkFile(' + base + ', fn, done)', function(done){
    dir.walkFile(base, function(file, callback){
      fs.writeFile(file, 'test', {flag: 'a'}, function(err){
        if(err){
          callback(err);
        }else{
          callback(null);
        }
      });
    }, function(err1, files){
      if(err1) throw err1;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = filesall.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      tasks.map(filesall, function(item, callback){
        var contenttxt = '中华人民共和国万岁！testtesttesttest';
        var contentjs = '中华人民共和国万岁！testtesttest';
        var contentjs0 = '中华人民共和国万岁！testtest';
        var regjs = /\.js/;
        var regtxt = /\.txt/;
        fs.readFile(item, 'utf-8', function(err2, data){
          if(err2){
            callback(err2);
          }else{
            if(regjs.test(item)){
              assert.ok(data === contentjs || data ===  contentjs0);
              callback(null, data);
            }else if(regtxt.test(item)){
              assert.ok(data === contenttxt);
              callback(null, data);
            }
          }
        }); 
      }, function(err3, results){
        if(err3) throw err3;
        done();
      });
    });
  });
  
  // 遍历所有.txt文件
  it('dir.walkFile(' + base + ', fn, /\.txt$/, done)', function(done){
    dir.walkFile(base, function(file, callback){
      fs.writeFile(file, 'test', {flag: 'a'}, function(err){
        if(err){
          callback(err);
        }else{
          callback(null);
        }
      });
    }, /\.txt$/, function(err1, files){
      if(err1) throw err1;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = filestxt.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      tasks.map(filestxt, function(item, callback){
        var contenttxt = '中华人民共和国万岁！testtesttesttesttest';
        fs.readFile(item, 'utf-8', function(err2, data){
          if(err2){
            callback(err2);
          }else{
            assert.ok(data === contenttxt);
            callback(null, data);
          }
        }); 
      }, function(err3, results){
        if(err3) throw err3;
        done();
      });
    });
  });
  
  var fa = [base + path.join(x, 'test.js'), base + xx, base + yy, base + zz];
  var fc = [
    base + path.join(x, 'test.js'),
    base + path.join(xx, 'test.js'), 
    base + path.join(yy, 'test.js'), 
    base + path.join(zz, 'test.js'),
  ];
  // 遍历数组
  it('dir.walkFile(array, fn, /\.js$/, done)', function(done){
    dir.walkFile(fa, function(file, callback){
      fs.writeFile(file, 'test', {flag: 'a'}, function(err){
        if(err){
          callback(err);
        }else{
          callback(null);
        }
      });
    }, /\.js$/, function(err1, files){
      if(err1) throw err1;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = fc.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      tasks.map(fc, function(item, callback){
        var content = '中华人民共和国万岁！testtesttesttest';
        fs.readFile(item, 'utf-8', function(err2, data){
          if(err2){
            callback(err2);
          }else{
            assert.ok(data === content);
            callback(null, data);
          }
        }); 
      }, function(err3, results){
        if(err3) throw err3;
        done();
      });
    });
  });
}); 

describe('dir.watch(path, fn, interval, done)', function(){
  var src = base + path.join(x, 'test.js');
  var dest = base + path.join(x, 'tt.js');
  
  // watch file rename
  it('dir.watch(' + src + ', fn, 1000, done)', function(done){
    var flag = 1;
    dir.watch(src, function(event, file){
      if(flag === 1){
        flag = 2;
        assert.ok(event === 'change');
        assert.ok(file === 'test.js');
      }else if(flag === 2){
        flag = 3;
        assert.ok(event === 'rename');
        assert.ok(file === 'test.js');
      }
    }, 300, function(err, watcher){
      if(err) throw err;
      fs.writeFile(src, 't', {flag:'a'}, function(err1){
        if(err1) throw err1;
        fs.writeFile(src, 't', {flag:'a'}, function(err1){
          if(err1) throw err1;
          setTimeout(function(){
            fs.rename(src, dest, function(err2){
              if(err2) throw err2;
              setTimeout(function(){
                watcher.close();
                done();
              }, 30);
            });
          }, 500);
        });
      });
    });
  });
  
  // watch file change
  it('dir.watch(' + dest + ', fn, done)', function(done){
    var flag = true;
    dir.watch(dest, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'change');
        assert.ok(file === 'tt.js');
      }
    }, function(err, watcher){
      if(err) throw err;
      fs.writeFile(dest, 't', {flag:'a'}, function(err1){
        if(err1) throw err1;
        setTimeout(function(){
          watcher.close();
          done();
        }, 30);
      });
    });
  });
  
  var folderxx = base + xx;
  // watch folder rename file
  it('dir.watch(' + folderxx + ', fn, done)', function(done){
    var flag = true;
    dir.watch(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'rename');
        assert.ok(file === 'test.js');
      }
    }, function(err, watcher){
      if(err) throw err;
      fs.rename(folderxx + '/test.js', folderxx + '/test1.js', function(err1){
        if(err1) throw err1;
        setTimeout(function(){
          watcher.close();
          done();
        }, 30);
      });
    });
  });
  
  // watch folder change create file
  it('dir.watch(' + folderxx + ', fn, done)', function(done){
    var flag = true;
    dir.watch(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'rename');
        assert.ok(file === 'test.js');
      }
    }, function(err, watcher){
      if(err) throw err;
      fs.writeFile(folderxx + '/test.js', 'test', function(err1){
        if(err1) throw err1;
        setTimeout(function(){
          watcher.close();
          done();
        }, 30);
      });
    });
  });
  
  // watch folder change file
  it('dir.watch(' + folderxx + ', fn, done)', function(done){
    var flag = true;
    dir.watch(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'change');
        assert.ok(file === 'test.js');
      }
    }, function(err, watcher){
      if(err) throw err;
      fs.writeFile(folderxx + '/test.js', 'test', {flag:'a'}, function(err1){
        if(err1) throw err1;
        setTimeout(function(){
          watcher.close();
          done();
        }, 30);
      });
    });
  });
  
  // watch folder change delete file
  it('dir.watch(' + folderxx + ', fn, done)', function(done){
    var flag = true;
    dir.watch(folderxx, function(event, file){
      if(flag){
        flag = false;
        console.log(event);
        assert.ok(event === 'change');
        assert.ok(file === 'test1.js');
      }
    }, function(err, watcher){
      if(err) throw err;
      fs.unlink(folderxx + '/test1.js', function(err1){
        if(err1) throw err1;
        setTimeout(function(){
          watcher.close();
          done();
        }, 30);
      });
    });
  });
  
  // watch array(file or folder)
  var folds = [
    dest,
    base + xx,
    base + yy,
    base + zz
  ];
  it('dir.watch(array, fn, done)', function(done){
    var flag = true;
    dir.watch(folds, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'rename');
        assert.ok(file === 'tt.js');
      }
    }, function(err, watcher){
      if(err) throw err;
      fs.rename(dest, src, function(err1){
        if(err1) throw err1;
        setTimeout(function(){
          watcher.close();
          done();
        }, 30);
      });
    });
  });
});

describe('dir.rmFile(path, regexp, done)', function(){
  var fxtxt = [
    folderx + '/test.js',
    foldery + '/test.js',
    folderz + '/test.js'
  ];
  it('dir.rmFile(' + folderx + ', /\.js$/, done)', function(done){
    dir.rmFile(folderx, /\.js$/, function(err, files){
      if(err) throw err;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = fxtxt.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      
      tasks.map(fxtxt, function(item, callback){
        fs.stat(path.dirname(item), function(err1, stat){
          if(err1) callback(err1);
          
          fs.stat(item, function(err2, stat){
            assert.ok(err2.code === 'ENOENT');
            callback(null, item);
          }); 
        }); 
      }, function(err3, results){
        if(err3) throw err3;
        done();
      }); 
    });
  });
  
  // rm array
  var farr = [
    folderx + '/test.txt',
    foldery + '/test.txt',
    folderz + '/test.txt',
    folderx + '/test.js',
    foldery + '/test.js',
    folderz + '/test.js',
    folderxx
  ];
  var farrjs = [
    folderxx + '/test.js',
    folderxx + '/test.txt',
  ];
  it('dir.rmFile(array, done)', function(done){
    dir.rmFile(farr, function(err, files){
      if(err) throw err;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = farrjs.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      
      tasks.map(farrjs, function(item, callback){
        fs.stat(path.dirname(item), function(err1, stat){
          if(err1) callback(err1);
          
          fs.stat(item, function(err2, stat){
            assert.ok(err2.code === 'ENOENT');
            callback(null, item);
          }); 
        });
      }, function(err3, results){
        if(err3) throw err3;
        done();
      }); 
    });
  });
});

describe('dir.rm(path, regexp, done)', function(){
  var fyy = [
    folderyy,
    folderzz
  ];
  var fxxx = [
    folderyy + '/test.txt',
    folderzz + '/test.txt'
  ];
  it('dir.rm(fyy, /\.txt/, done)', function(done){
    dir.rm(fyy, /\.txt/, function(err, files){
      if(err) throw err;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = fxxx.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      
      tasks.map(fxxx, function(item, callback){
        fs.stat(item, function(err1, stat){
          assert.ok(err1.code === 'ENOENT');
          callback(null, item);
        }); 
      }, function(err2, results){
        if(err2) throw err2;
        done();
      }); 
    });
  });
  
  var ff0 = [
    base + 'test.js',
    folderyy + '/test.js',
    folderzz + '/test.js'
  ];
  it('dir.rm(' + base + ', /\.js/, done)', function(done){
    dir.rm(base, /\.js/, function(err, files){
      if(err) throw err;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = ff0.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      
      tasks.map(ff0, function(item, callback){
        fs.stat(item, function(err1, stat){
          assert.ok(err1.code === 'ENOENT');
          callback(null, item);
        }); 
      }, function(err2, results){
        if(err2) throw err2;
        done();
      });  
    });
  });
  
  var ff1 = [
    base,
    folderx,
    foldery,
    folderz,
    folderxx,
    folderyy,
    folderzz,
  ];
  it('dir.rm(' + base + ')', function(done){
    dir.rm(base, function(err, files){
      if(err) throw err;
      var f1 = files.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      var f2 = ff1.map(function(item){
        return item.replace(/\\/g, '/');
      }).sort();
      assert.deepEqual(f1, f2);
      
      tasks.map(ff1, function(item, callback){
        fs.stat(item, function(err1, stat){
          assert.ok(err1.code === 'ENOENT');
          callback(null, item);
        }); 
      }, function(err2, results){
        if(err2) throw err2;
        done();
      });  
    });
  });
  
  // 删除所有文件
  it('dir.rm(' + 'dirtest)', function(done){
    dir.rm('dirtest', function(err, files){
      if(err) throw err;
      done();
    });
  });
  
  it('dir.rm(' + '/dirtest)', function(done){
    dir.rm(['/dirtest', 'e:'], function(err, files){
      if(err) throw err;
      done();
    });
  });
});
