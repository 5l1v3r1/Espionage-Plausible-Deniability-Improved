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
    , debug: false
    , watchedDir: (User().dir + '/Library/Application\ Support/com.taoeffect.Espionage3/Data/')
};
var TimeToSet      = new Date(options.timeToSet.year,
                              options.timeToSet.month,
                              options.timeToSet.day,
                              options.timeToSet.hour,
                              options.timeToSet.minute,
                              options.timeToSet.second,
                              options.timeToSet.millisecond);
options.touch = {
    force: true
    , time: TimeToSet // Creation time
    , atime: TimeToSet // Added time
    , mtime: TimeToSet // Modified time
    , nocreate: false
};

FileSystem.exists(options.watchedDir, function(exists) {

    if(!exists) {
        console.log('Please install Espionage 3 first.');
        return false;
    }
    
    // Check if debug mode is active
    process.argv.forEach(function (val, index, array) {
      if(index === 2) {
          if(val === '--debug=true') {
              options.debug = true;
              return false;
          }
      }
    });

    FileWatcher.watch(options.watchedDir, {
        /*ignored: function(path) {
          return RegExp(options.watchedDir + '.+/').test(path);
        }*/
    }).on('all', function(event, file) {

        switch(event) {

            case 'addDir': // Event: When a .sparsebundle is opened/closed

                // Checking if this is a .sparsebundle file
                if(endsWith(file, '.sparsebundle')) {

                    FileSystem.stat(file, function(err, stats) {

                        // Prevent infinite while by checking if the date has already been touched
                        if(+stats.mtime === +TimeToSet) {
                            return false;
                        }
                        
                        if(options.debug) {
                            console.log('[CONTAINER] <' + Path.parse(file).name + '> ' + 'Hiding modifications...');
                        }

                        // Touch the file
                        Touch(file, options.touch);
                    });
                }

                // Important: Touch the Data directory (modified, added, created params)
                FileSystem.stat(options.watchedDir, function(err, stats) {
                    if(+stats.mtime === +TimeToSet) {
                        return false;
                    }
                    Touch(options.watchedDir, options.touch);
                });
                break;

            case 'add': case 'change': // Event: When a file is modified/added

                // Checking if this is come from .sparsebundle file
                if(file.indexOf('.sparsebundle') > -1 && !endsWith(file, '.sparsebundle')) {

                    FileSystem.stat(file, function(err, stats) {

                        // Prevent infinite while by checking if the date has already been touched
                        if(+stats.mtime === +TimeToSet) {
                            return false;
                        }
                        
                        if(options.debug) {
                            console.log('[FILE] <' + Path.parse(file).name + '> ' + 'Hiding modifications...');
                        }
                        
                        // Touch the file
                        Touch(file, options.touch);
                    });
                }
                break;
        }
    });

    console.log('Improved Plausible Deniability for Espionage 3 is now running.');
});