# dir = require('dir')

## Download
https://github.com/coordcn/dir

### 文件夹创建（aaa及bbb文件夹可以不存在，自动创建）
+ @param path {string} 文件夹
+ @param mode {number} 文件访问权限，参考fs
+ @param done {function} function(err, path){}

```js
var path = 'aaa/bbb/ccc';
dir.mkdir(path[, mode], done);

var p = dir.mkdirSync('aaa/bbb/ccc'[, mode]);
```

### writeFile 写入文件（aaa及bbb文件夹可以不存在，自动创建）
+ @param file {string} 待写入的文件
+ @param data {string|buffer} 待写入的内容
+ @param options {string|object} 写入编码，权限等选项，参考fs
    >> string: encoding 'utf-8'
+    object: {encoding: 'utf-8', mode: 0644, flag: 'w'}
+ @param done {function} function(err){}

```js
var file = 'aaa/bbb/ccc/ddd.txt';
dir.writeFile(file, data[, options], done);

dir.writeFileSync(file, data[, options]);
```

### walk 遍历文件夹或文件并用fn对文件及文件夹进行处理
### walkFile 遍历文件或文件夹或它们的数组并用fn对文件进行处理, 使用方法与walk相同。
+ @param path {string|array[string]} 文件或文件夹或它们的数组
+ @param fn {function} function(file, callback){} 文件或文件夹处理函数 
+    callback: function(err){}
+ @param regexp {regexp} 需处理文件或文件夹的正则
+ @param done {function} function(err, files){}

```js
dir.walk(path, fn[, regexp], done)
dir.walkFile(path, fn[, regexp], done)

dir.walkSync(path, fn[, regexp])
dir.walkFileSync(path, fn[, regexp])
```

### watch 监控文件或文件夹的改动，发生改动则调用fn函数处理，跟fs.watch(path, function(event, file){})类似，但会遍历内部文件夹。
+ @param path {string|array[string]} 文件或文件夹或它们的数组
+ @param fn {function} function(event, file){}
+ @param interval {number} 监控的间隔，低于间隔不触发fn函数
+ @param done {function} function(err, watcher){}遍历文件夹内所有文件及文件夹后执行的回调函数，wather是一个对象，可以用来停止监控：watcher.close()。

```js
dir.watch(path, fn[, interval], function(err, watcher){
    if(err) watcher.close();
});

var watcher = dir.watchSync(path, fn[, interval]);
watcher.close();
```

### rm 删除文件或文件夹
### rmFile 跟rm类似，但只删除文件，不删除文件夹。
+ @param path {string|array[string]} 被删除的文件或文件夹或它们的数组
+ @param regexp {number} 需删除的文件或文件夹的正则
+ @param done {function} function(err, files){} 

```js
dir.rm(path[, regexp], done);
dir.rmFile(path[, regexp], done);

dir.rmSync(path[, regexp]);
dir.rmFileSync(path[, regexp]);
```
