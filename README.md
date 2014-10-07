#HackFlowy

An open-source [Workflowy](http://workflowy.com) clone.

![](https://dl.dropbox.com/u/19398876/screenshots/043.png)

##Installation

* Edit `config/development.json` and `config/database.json` to your needs
* `npm install`
* `node server.js`

##Heroku deploy

You can use our one-click heroku deploy:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Or proceed manually as follow:

* heroku create --stack cedar
* heroku addons:add heroku-postgresql:dev
* heroku config:set NODE_ENV=production
* git push heroku master

##Controls

* <kbd>UP</kbd> & <kbd>DOWN</kbd>: navigate through tasks
* <kbd>TAB</kbd>: right-indent
* <kbd>SHIFT</kbd> + <kbd>TAB</kbd>: left-indent

##Technologies used

* Node + Socket.io
* Backbone
* Foundation

##To-do

* ~~Work on sub-lists. The parent id of the Backbone task model has to be set for it to be saved properly. The template should be modified to have the `children` ul as part of every task.~~
* Search & Tags
* Themes

Feel free to try it out and contribute.
