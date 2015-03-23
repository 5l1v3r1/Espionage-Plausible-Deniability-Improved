Espionage 3 Plausible Deniability Improvement
=============================================

![Screenshot](https://github.com/pwnsdx/Espionage-Plausible-Deniability-Improved/raw/master/screenshot.png)

Improve Plausible Deniability in Espionage 3 by setting the same timestamp for all encrypted containers (.sparsebundle). The default behavior is replacing created/added/modified timestamp by the easter egg of Apple (January 24, 1984).

Why?
-----

Actually, Espionage 3 generates between 1 and 10 fakes containers. This is a great protection but fake containers may be spotted because of their timestamp. This simple script will improve drastically protection against infosec professionals by overwriting timestamp on each containers (including fake and real) with a fixed date.

Usage
-----

```
# Download and install Node.JS
# Go in the directory
cd ./Espionage-Plausible-Deniability-Improved
# Install required packages
npm install
# Run like this
node Service.js
# If you would like to see what's happening, you can active the debug mode
# It will show what modifications are done to your containers
node Service.js --debug=true
# Let the process running in background while you are using Espionage
```

What is that for?
-----
It's for Espionage, a simple, state of the art encryption and plausible deniability application for Mac OS X. https://www.espionageapp.com/