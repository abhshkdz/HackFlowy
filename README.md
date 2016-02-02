# HackFlowy

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/abhshkdz/HackFlowy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An open-source [Workflowy](http://workflowy.com) clone. [Static demo available here](http://abhshkdz.github.io/HackFlowy/).

![](https://dl.dropbox.com/u/19398876/screenshots/043.png)

## Installation

* Edit `config/development.json` and `config/database.json` to your needs
* `npm install`
* `npm install bower`
* `bower install`
* `node server.js`

## Heroku deploy

You can use our one-click heroku deploy (Select "United States" as region, when prompted):

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Or proceed manually as follow:

* heroku create --stack cedar
* heroku addons:add heroku-postgresql:dev
* heroku config:set NODE_ENV=production
* git push heroku master

## Controls

* <kbd>UP</kbd> & <kbd>DOWN</kbd>: navigate through tasks
* <kbd>CNTRL+UP</kbd> & <kbd>CNTRL+DOWN</kbd>: shuffle tasks
* <kbd>TAB</kbd>: right-indent
* <kbd>SHIFT</kbd> + <kbd>TAB</kbd>: left-indent
* <kbd>BACKSPACE</kbd>: Remove an empty task
* <kbd>ENTER</kbd>: New task
* Click on a bullet point to fold it
* Hover on a bullet point and click complete to complete it

## Technologies used

* Node + Socket.io
* Backbone
* Backbone.marionette
* Backbone.localforage
* Foundation

## To-do

* ~~Work on sub-lists. The parent id of the Backbone task model has to be set for it to be saved properly. The template should be modified to have the `children` ul as part of every task.~~
* Search & Tags
* Themes

Feel free to try it out and contribute.

## License

MIT
