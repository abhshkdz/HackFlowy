**Live Demo:** http://cryptic-falls-9359.herokuapp.com/

**My Writings in Workflowy:** https://workflowy.com/s/55DdB7GpZX

Current Features that workflowy doesn't have: 
--------
  - Real-time editing. 
  - Revision Control. 
  - (Support for aliasing/Multiple-parents is basically done). 
  - (Latex+Markdown Editor is basically done.)

Features that workflowy has that I haven't implemented yet: 
----------
  - Editor: 
    - Tagging. //(This is actually really hard to implement well). 
    - Pasting,Import,Export
  - General CSS
  - Offline editing
  - Undo/Redo
  - A Mobile app
  - A bunch of small things. 
  - 
  - It doesn't look that great right now, but neither did a bunch of famous sites. 
    - http://blog.onemonthrails.com/famous-first-landing-pages/
 

Documentation + Todos: 
-----
 - https://workflowy.com/s/qFYOTilhJK


Installation and Usage
======================

 - A throwaway database account is provided. But, you can edit /config/config.js with your own credentials.
 - `npm install`
 - `node app.js`
 - You'll need to create a Google developers account in order to log-in with google, so that you can actually make changes. I'll try to remove this step so that it's easier to get up and running. 

Setting up a Google API account 
==============================
If you look at /config/auth.js, you'll be able to find fill in your Google API credentials.
https://console.developers.google.com/project

Click on the "Apis & Auth > Credentials" tab.
This is what you want things to look like:
http://i.imgur.com/0UU7bF3.png

You'll also want to run the --assume-unchanged command on the config directory, so you don't push up your configuration details to github.
http://stackoverflow.com/questions/17195861/undo-a-git-update-index-assume-unchanged-file
