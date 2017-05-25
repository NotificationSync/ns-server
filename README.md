# Notification Sync Server

This is a notification sync server implemention

## deploy

get project from github

```bash
git clone https://github.com/NotificationSync/ns-server.git
cd ns-server
# init db if necessary
mysql -uroot -p < db.sql
```

and install dependencies

```bash
npm i
npm start # start at 0.0.0.0:3000
# or
npm i
pm2 start pm2.json # start at 0.0.0.0:12346
```

## WEB API

API in path ```/api/v1/notification``` need a specific header named ```x-ns-token```

Token will be sent to user mailbox when client use api ```/api/v1/user/token```

* GET /api/v1/

  welcome

* POST /api/v1/user/token

  with json body like ```{"mail":"your@mail.com"}```

* GET /api/v1/notification/

  get all notifications of the user

* GET /api/v1/notification/unread

  get all unreaded notifications of the user

* POST /api/v1/notification/

    create new notification,

    with param json like ```{"title":"noti title","content":"noti content"}```

* PATCH /api/v1/notification/

  make notifications as readed, with param json like ```[1,2,3]```

## WEBSOCKET API

Access **notification** apis after emit **user/mytoken** api

* EVENT user/token

  emit with json object like ```{"mail":"your@mail.com"}```, and new token will send to your mailbox

* EVENT user/mytoken

  emit with json object like ```{"token":"yourtokenstr"}```, and you can access notification apis later

* EVENT notification/new

  emit with json object like ```{"title":"noti title","content":"noti content"}```, this *notification* will persist to db and boardcast to all **websocket cliet** of the user

* EVENT notification/unread

  emit it, and callback function will pass **unreaded notifications** of the user

* EVENT notification/all

  emit it, and callback function will pass **all notifications** of the user

* EVENT notification/read

  emit it with json object like ```[1,2,3]```, it makes these nofications as *readed* state

* LISTEN notification/new

  server will emit client **notification/new** api if it received new notification