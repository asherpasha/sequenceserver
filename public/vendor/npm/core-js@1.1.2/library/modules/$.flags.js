/* */ 
'use strict';
var anObject = require("./$.an-object");
module.exports = function() {
  var that = anObject(this),
      result = '';
  if (that.global)
    result += 'g';
  if (that.ignoreCase)
    result += 'i';
  if (that.multiline)
    result += 'm';
  if (that.unicode)
    result += 'u';
  if (that.sticky)
    result += 'y';
  return result;
};