// parse emojifile.js and output emoji.json
var fs = require('fs'),
  path = require('path');

declare const __dirname: string;

var emojiData = require('./emojifile').data;

// parse
var parsed_emoji: { [key: string]: string } = {};

for (var key in emojiData) {
  if (emojiData.hasOwnProperty(key)) {
    var names = emojiData[key][3];
    names = names.constructor === Array ? names : [names];
    var namesArr = names as string[];
    var emoji_char: string = emojiData[key][0][0];
    for (var name of namesArr) {
      parsed_emoji[name] = emoji_char;
    }
  }
}

// write to emoji.json
fs.writeFile(
  path.join(__dirname, 'emoji.json'),
  JSON.stringify(parsed_emoji),
  function (err: any) {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Done.');
    }
  },
);
