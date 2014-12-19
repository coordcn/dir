var tasks = require('../lib/tasks');
var fs = require('fs');



tasks.parallel({
  test0:ptest0,
  test1:ptest1
}, pcallback);

function ptest0(cb){
  fs.readFile('test0.txt', function(err, data){
    if(err){
      console.log('ptest0(err):' + Date.now());
      cb(err);
    }else{
      setTimeout(function(){
        console.log('ptest0:' + Date.now());
        cb(null, data.toString());
      }, 1000);
    }
  });
}


function ptest1(cb){
  fs.readFile('test1.txt', function(err, data){
    if(err){
      console.log('ptest1(err):' + Date.now());
      cb(err);
    }else{
      console.log('ptest1:' + Date.now());
      cb(null, data.toString());
    }
  });
}

function pcallback(err, results){
  if(err){
    console.log('p(err):' + Date.now());
    console.log(err);
  }else{
    console.log('p:' + Date.now());
    console.log(results);
  }
}

tasks.map(['test5.txt', 'test6.txt'], mtask, mcallback);
function mtask(item, cb){
  fs.readFile(item, function(err, data){
    if(err){
      console.log(item + '(err):' + Date.now());
      cb(err);
    }else{
      console.log(item + ':' + Date.now());
      cb(null, data.toString());
    }
  });
}

function mcallback(err, results){
  if(err){
    console.log('m(err):' + Date.now());
    console.log(err);
  }else{
    console.log('m:' + Date.now());
    console.log(results);
  }
}

tasks.series({
  test0:stest0,
  test1:stest1
}, scallback);

function stest0(cb){
  fs.readFile('test0.txt', function(err, data){
    if(err){
      console.log('stest0(err):' + Date.now());
      cb(err);
    }else{
      setTimeout(function(){
        console.log('stest0:' + Date.now());
        cb(null, data.toString());
      }, 1000);
    }
  });
}

function stest1(cb, results){
  fs.readFile(results.test0, function(err, data){
    if(err){
      console.log('stest1(err):' + Date.now());
      cb(err);
    }else{
      console.log('stest1:' + Date.now());
      cb(null, data.toString());
    }
  });
}

function scallback(err, results){
  if(err){
    console.log('s(err):' + Date.now());
    console.log(err);
  }else{
    console.log('s:' + Date.now());
    console.log(results);
  }
}