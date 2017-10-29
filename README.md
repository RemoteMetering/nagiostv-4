# NagiosTV 4

This is a version of NagiosTV for Nagios4 servers.

Nagios4 comes with new JSON CGI's
https://labs.nagios.com/2014/06/19/exploring-the-new-json-cgis-in-nagios-core-4-0-7-part-1/
out of the box which makes this the fastest, lightest, simplest NagiosTV yet.

NagiosTV
------------

Watch one or more Nagios servers on a wall mounted TV (or your desktop)

New items slide in and out of place with animations.

- Client Side: EmberJS 2.x
- Server Side: Node.js

Screenshot of NagiosTV 4
------------

![Display](https://chriscarey.com/software/nagiostv-4/images/nagiostv-screen.png)

Screenshot of 5 Nagios servers on one TV
------------

This can be accomplished with a simple iframe tag for each region

![Display](http://chriscarey.com/projects/ajax-monitor-for-nagios/nagios-5-in-1.png)


I need to get a build system in place so users can just download the latest build.


Running NagiosTV 4
-------------
We are now able to connect the web application direct to Nagios CGIs with a couple changes on the Nagios Apache server.

Changes needed for Nagios Apache server
-------------

/etc/apache/sites-enabled/nagios.conf

```html
# Inside <Directory> add these to add CORS headers

  Header set Access-Control-Allow-Headers "authorization" 
  Header always set Access-Control-Allow-Origin "*"

# Then, wrap the Require valid-user with this <LimitExcept>

<LimitExcept OPTIONS>
  Require valid-user
</LimitExcept>
```

Then restart or reload apache and make sure it is happy.

Upgrading
------------
- $ cd nagiostv-4
- $ git pull
- $ ember build
- then copy the contents of the dist/ directory to your web server

Development Requirements
------------

Node.js

Development
------------
- npm install -g ember
- npm install -g bower
- git clone https://github.com/chriscareycode/nagiostv-4.git
- $ cd nagiostv-4
- $ npm install
- $ bower install
- $ npm start

TODO
------------
Features to work on next
- Fix support for Nagios elements with a period in the name
- Edit Node server from the browser
- Edit Nagios server from the browser?
https://docs.nodejitsu.com/articles/file-system/how-to-store-local-config-data/

Credits
------------
NagiosTV by Chris Carey
http://chriscarey.com


