function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};
var Path            = require('path');
var User            = require('pwuid');
var FileWatcher     = require('chokidar');
var FileSystem      = require('fs');
var Touch           = require('touch');

var options         = {
    timeToSet: {
        year: 1984
      , month: 01
      , day: 24
      , hour: 03
      , minute: 00
      , second: 00
      , millisecond: 00
    }
  , watchedDir: (User().dir + '/Library/Application\ Support/com.taoeffect.Espionage3/Data/')
};
var TimeToSet      = new Date(options.timeToSet.year,
                               options.timeToSet.month,
                               options.timeToSet.day,
                               options.timeToSet.hour,
                               options.timeToSet.minute,
                               options.timeToSet.second,
                               options.timeToSet.millisecond);


FileSystem.exists(options.watchedDir, function(exists) {
    
    if(!exists) {
        console.log('Please install Espionage 3 first.');
        return false;
    }
        
    FileWatcher.watch(options.watchedDir, {
        ignored: function(path) {
          return RegExp(options.watchedDir + '.+/').test(path);
        }
    }).on('addDir', function(file) {

        // Checking if this is an .sparsebundle file
        if(endsWith(file, '.sparsebundle')) {

            FileSystem.stat(file, function(err, stats) {

                // Prevent infite while by checking if the date has been already touched
                if(+stats.mtime === +TimeToSet) {
                    return false;
                }
                //console.log('<' + Path.parse(file).name + '> ' + 'Hiding modifications to the container...');
                console.log('Hiding modifications of a container...');

                // Touch the file
                Touch(file, {
                    force: true
                  , time: TimeToSet // Creation time
                  , atime: TimeToSet // Added time
                  , mtime: TimeToSet // Modified time
                  , nocreate: false
                });
            });
        }
    });
    
    console.log('Improved Plausible Deniability is now running.');
});