/** 
  @copyright Copyright (C) 2014 coord.cn All rights reserved. 
  @overview directory functions 
  @author QianYe(coordcn@163.com)
  @license MTI License(http://mit-license.org/)
  @reference https://github.com/fishbar/xfs
             https://github.com/substack/node-mkdirp
 */

var async = require('./lib/async');
var sync = require('./lib/sync');

exports.mkdir = async.mkdir;
exports.writeFile = async.writeFile;
exports.walk = async.walk;
exports.walkFile = async.walkFile;
exports.watch = async.watch;
exports.rm = async.rm;
exports.rmFile = async.rmFile;

exports.mkdirSync = sync.mkdir;
exports.writeFileSync = sync.writeFile;
exports.walkSync = sync.walk;
exports.walkFileSync = sync.walkFile;
exports.watchSync = sync.watch;
exports.rmSync = sync.rm;
exports.rmFileSync = sync.rmFile;