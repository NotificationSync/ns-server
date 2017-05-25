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

## AUTH

API in path ```/api/v1/notification``` need a specific header named ```x-ns-token```, value will be sent to user mailbox when client use api ```/api/v1/user/token```

## API

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