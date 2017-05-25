# Notification Sync Server

This is a notification sync server implemention

## deploy

```bash
npm i
npm start
```

## AUTH

API in path ```/api/v1/notification``` need a specific header named ```x-ns-token```, value will be sent to user mailbox when client use api ```/api/v1/user/token```

## API

* GET /api/v1/ , welcome
* POST /api/v1/user/token , with json body like ```{"mail":"your@mail.com"}```
* GET /api/v1/notification/ , get all notification of the user
* GET /api/v1/notification/unread , get all unreaded notification of the user
* POST /api/v1/notification/ , create new notification, with param json like ```{"title":"noti title","content":"noti content"}```
* PATCH /api/v1/notification/ , make notifications as readed, with param json like ```[1,2,3]```