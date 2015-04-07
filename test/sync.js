var dir = require('../index');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

var x = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var y = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var z = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var xx = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var yy = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
var zz = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
 
var base = 'dirtest/sync/'; 
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

describe('dir.mkdirSync(path, mode)', function(){
  //当前目录创建
  it('dir.mkdirSync(' + folderx + ')', function(){
    var p = dir.mkdirSync(folderx);
    var stat = fs.statSync(p);
    assert.ok(stat.isDirectory());
    folders.push(p);
  });
  
  var mode = 0644;
  //当前目录带mode创建
  it('dir.mkdirSync(' + folderz + ', ' + mode + ')', function(){
    var p = dir.mkdirSync(folderz, mode);
    var stat = fs.statSync(p);
    assert.ok(stat.isDirectory());
    folders.push(foldery);
    folders.push(p);
  });
  
  //根目录创建
  it('dir.mkdirSync(' + '/' + folderx + ')', function(){
    var p = dir.mkdirSync('/' + folderx);
    var stat = fs.statSync(p);
    assert.ok(stat.isDirectory());
  });
  
  //windows根目录创建
  it('dir.mkdirSync(' + 'e:/' + folderz + ')', function(){
    var p = dir.mkdirSync('e:/' + folderz);
    var stat = fs.statSync(p);
    assert.ok(stat.isDirectory());
  });
});

describe('dir.writeFileSync(path, data, options)', function(){
  var content = '中华人民共和国万岁！';
  
  var filexx = path.join(base + xx, 'test.txt');
  it('dir.writeFileSync(' + filexx + ', data)', function(){
    dir.writeFileSync(filexx, content);
    var data = fs.readFileSync(filexx, 'utf-8');
    assert.ok(data === content);
    folders.push(base + xx);
    folders.push(filexx);
    filesall.push(filexx);
    filestxt.push(filexx);
  });
  
  var fileyy = path.join(base + yy, 'test.txt');
  it('dir.writeFileSync(' + fileyy + ', data, \'utf-8\')', function(){
    dir.writeFileSync(fileyy, content, 'utf-8');
    var data = fs.readFileSync(fileyy, 'utf-8');
    assert.ok(data === content);
    folders.push(base + yy);
    folders.push(fileyy);
    filesall.push(fileyy);
    filestxt.push(fileyy);
  });
  
  var filezz = path.join(base + zz, 'test.txt');
  it('dir.writeFileSync(' + filezz + ', data, options)', function(){
    dir.writeFileSync(filezz, content, {encoding: 'utf-8', mode: 0644, flag: 'w'});
    var data = fs.readFileSync(fileyy, 'utf-8');
    assert.ok(data === content);
    folders.push(base + zz);
    folders.push(filezz);
    filesall.push(filezz);
    filestxt.push(filezz);
  });
});

describe('dir.walkSync(path, fn, regexp)', function(){
  //遍历所有文件包含目录
  it('dir.walkSync(' + base + ', fn)', function(){
    var files = dir.walkSync(base, function(file){
      var stat = fs.statSync(file);
      if(stat.isFile()){
        fs.writeFileSync(file, 'test', {flag: 'a+'});
      }else if(stat.isDirectory()){
        var f = path.join(file, 'test.js');
        dir.writeFileSync(f, '中华人民共和国万岁！test');
        //folders.push(f);
        filesall.push(f);
        filesjs.push(f);
      }
    });

    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = folders.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    var content = '中华人民共和国万岁！test';
    filesall.forEach(function(item){
      var data = fs.readFileSync(item, 'utf-8');
      assert.ok(data === content);
    });
  });
  
  // 遍历所有.txt文件
  it('dir.walkSync(' + base + ', fn, /\.txt/)', function(){
    var files = dir.walkSync(base, function(file){
      dir.writeFileSync(file, 'test', {flag: 'a+'});
    }, /\.txt/);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = filestxt.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort(); 
    assert.deepEqual(f1, f2);

    var content = '中华人民共和国万岁！testtest';
    filestxt.forEach(function(item){
      var data = fs.readFileSync(item, 'utf-8');
      assert.ok(data === content);
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
  it('dir.walkSync(array, fn)', function(){
    var files = dir.walkSync(fa, function(file){
      var stat = fs.statSync(file);
      if(stat.isFile()){
        fs.writeFileSync(file, 'test', {flag: 'a'});
      }
    });
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = fb.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);

    var contenttxt = '中华人民共和国万岁！testtesttest';
    var contentjs = '中华人民共和国万岁！testtest';
    var regjs = /\.js/;
    var regtxt = /\.txt/;
    fc.forEach(function(item){
      var data = fs.readFileSync(item, 'utf-8');
      if(regjs.test(item)){
        assert.ok(data === contentjs);
      }else if(regtxt.test(item)){
        assert.ok(data === contenttxt);
      }
    });
  });
});

describe('dir.walkFileSync(path, fn, regexp)', function(){
  //遍历所有文件不包含目录
  it('dir.walkFileSync(' + base + ', fn)', function(){
    var files = dir.walkFileSync(base, function(file){
      fs.writeFileSync(file, 'test', {flag: 'a'});
    });
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = filesall.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
      
    var contenttxt = '中华人民共和国万岁！testtesttesttest';
    var contentjs = '中华人民共和国万岁！testtesttest';
    var contentjs0 = '中华人民共和国万岁！testtest';
    var regjs = /\.js/;
    var regtxt = /\.txt/;
    filesall.forEach(function(item){
      var data = fs.readFileSync(item, 'utf-8');
      if(regjs.test(item)){
        assert.ok(data === contentjs || data ===  contentjs0);
      }else if(regtxt.test(item)){
        assert.ok(data === contenttxt);
      }
    });
  });
  
  // 遍历所有.txt文件
  it('dir.walkFileSync(' + base + ', fn, /\.txt$/)', function(){
    var files = dir.walkFileSync(base, function(file){
      fs.writeFileSync(file, 'test', {flag: 'a'});
    }, /\.txt$/);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = filestxt.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    var content = '中华人民共和国万岁！testtesttesttesttest';
    filestxt.forEach(function(item){
      var data = fs.readFileSync(item, 'utf-8');
      assert.ok(data === content);
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
  it('dir.walkFileSync(array, fn, /\.js$/)', function(){
    var files = dir.walkFileSync(fa, function(file){
      fs.writeFileSync(file, 'test', {flag: 'a'});
    }, /\.js$/);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = fc.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    var content = '中华人民共和国万岁！testtesttesttest';
    fc.forEach(function(item){
      var data = fs.readFileSync(item, 'utf-8');
      assert.ok(data === content);
    });
  });
}); 

describe('dir.watchSync(path, fn, interval)', function(){
  var src = base + path.join(x, 'test.js');
  var dest = base + path.join(x, 'tt.js');
  
  // watch file rename
  it('dir.watchSync(' + src + ', fn, 1000)', function(done){
    var flag = 1;
    var watcher = dir.watchSync(src, function(event, file){
      if(flag === 1){
        flag = 2;
        assert.ok(event === 'change');
        assert.ok(file === 'test.js');
      }else if(flag === 2){
        flag = 3;
        assert.ok(event === 'rename');
        assert.ok(file === 'test.js');
      }
    }, 300);
    
    fs.writeFileSync(src, 't', {flag:'a+'});
    fs.writeFileSync(src, 't', {flag:'a+'});
    setTimeout(function(){
      fs.renameSync(src, dest);
      setTimeout(function(){
        watcher.close();
        done();
      }, 30);
    }, 500);
  });
  
  // watch file change
  it('dir.watchSync(' + dest + ', fn)', function(done){
    var flag = true;
    var watcher = dir.watchSync(dest, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'change');
        assert.ok(file === 'tt.js');
      }
    });
    
    fs.writeFileSync(dest, 't', {flag:'a+'});
    setTimeout(function(){
      watcher.close();
      done();
    }, 30);
  });
  
  var folderxx = base + xx;
  // watch folder rename file
  it('dir.watchSync(' + folderxx + ', fn)', function(done){
    var flag = true;
    var watcher = dir.watchSync(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'rename');
        assert.ok(file === 'test.js');
      }
    });
    
    fs.renameSync(folderxx + '/test.js', folderxx + '/test1.js');
    setTimeout(function(){
      watcher.close();
      done();
    }, 30);
  });
  
  // watch folder change create file
  it('dir.watchSync(' + folderxx + ', fn)', function(done){
    var flag = true;
    var watcher = dir.watchSync(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'rename');
        assert.ok(file === 'test.js');
      }
    });
    
    fs.writeFileSync(folderxx + '/test.js', 'test');
    setTimeout(function(){
      watcher.close();
      done();
    }, 30);
  });
  
  // watch folder change file
  it('dir.watchSync(' + folderxx + ', fn)', function(done){
    var flag = true;
    var watcher = dir.watchSync(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'change');
        assert.ok(file === 'test.js');
      }
    });
    
    fs.writeFileSync(folderxx + '/test.js', 'test', {flag:'a+'});
    setTimeout(function(){
      watcher.close();
      done();
    }, 30);
  });
  
  // watch folder change delete file
  it('dir.watchSync(' + folderxx + ', fn)', function(done){
    var flag = true;
    var watcher = dir.watchSync(folderxx, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'change');
        assert.ok(file === 'test1.js');
      }
    });
    
    fs.unlinkSync(folderxx + '/test1.js');
    setTimeout(function(){
      watcher.close();
      done();
    }, 30);
  });
  
  // watch array(file or folder)
  var folds = [
    dest,
    base + xx,
    base + yy,
    base + zz
  ];
  it('dir.watchSync(array, fn)', function(done){
    var flag = true;
    var watcher = dir.watchSync(folds, function(event, file){
      if(flag){
        flag = false;
        assert.ok(event === 'rename');
        assert.ok(file === 'tt.js');
      }
    });
    
    fs.renameSync(dest, src);
    setTimeout(function(){
      watcher.close();
      done();
    }, 30);
  });
});

describe('dir.rmFileSync(path, regexp)', function(){
  var fxtxt = [
    folderx + '/test.js',
    foldery + '/test.js',
    folderz + '/test.js'
  ];
  it('dir.rmFileSync(' + folderx + '/\.js$/)', function(){
    var files = dir.rmFileSync(folderx, /\.js$/);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = fxtxt.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    fxtxt.forEach(function(item){
      var stat = fs.statSync(path.dirname(item));
      try{
        var stat1 = fs.statSync(item);
      }catch(err){
        assert.ok(err.code === 'ENOENT');
      }
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
  it('dir.rmFileSync(array)', function(){
    var files = dir.rmFileSync(farr);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = farrjs.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    farrjs.forEach(function(item){
      var stat = fs.statSync(path.dirname(item));
      try{
        var stat1 = fs.statSync(item);
      }catch(err){
        assert.ok(err.code === 'ENOENT');
      }
    });
  });
});

describe('dir.rmSync(path, regexp)', function(){
  var fyy = [
    folderyy,
    folderzz
  ];
  var fxxx = [
    folderyy + '/test.txt',
    folderzz + '/test.txt'
  ];
  it('dir.rmSync(' + fyy + ')', function(){
    var files = dir.rmSync(fyy, /\.txt/);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = fxxx.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    fxxx.forEach(function(item){
      try{
        var stat = fs.statSync(item);
      }catch(err){
        assert.ok(err.code === 'ENOENT');
      }
    });
  });
  
  var ff0 = [
    base + 'test.js',
    folderyy + '/test.js',
    folderzz + '/test.js'
  ];
  it('dir.rmSync(' + base + ')', function(){
    var files = dir.rmSync(base, /\.js/);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = ff0.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    ff0.forEach(function(item){
      try{
        var stat = fs.statSync(item);
      }catch(err){
        assert.ok(err.code === 'ENOENT');
      }
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
  it('dir.rmSync(' + base + ')', function(){
    var files = dir.rmSync(base);
    
    var f1 = files.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    var f2 = ff1.map(function(item){
      return item.replace(/\\/g, '/');
    }).sort();
    assert.deepEqual(f1, f2);
    
    ff1.forEach(function(item){
      try{
        var stat = fs.statSync(item);
      }catch(err){
        assert.ok(err.code === 'ENOENT');
      }
    });  
  });
  
  // 删除所有文件
  it('dir.rmSync(' + 'dirtest)', function(){
    dir.rmSync('dirtest');
  });
  
  it('dir.rmSync(' + '/dirtest)', function(){
    dir.rmSync(['/dirtest', 'e:']);
  });
});
