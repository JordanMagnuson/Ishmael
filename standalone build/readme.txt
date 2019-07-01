I'm using nw.js to package Ishmael into native app format for steam (e.g. exe on Windows).

This folder just contains the latest nwjs build within /content/windows/, which has a subfolder for whichever version of Ishmael
should be packaged, and the manifest (to point nwjs to the correct thing) is at /package.json

See general guide at https://medium.com/@Raicuparta/getting-an-html5-game-on-steam-3-making-an-executable-e7bbf7706a50
See nw.js documentation at http://docs.nwjs.io
See nw.js manifest guide (for package.json file) at http://docs.nwjs.io/en/latest/References/Manifest%20Format/