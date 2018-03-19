# nembv
Node Express Mongo Bootstrap Vue Stack

## config file definition

**cfg/cfg.js**

```javascript
module.exports = {
  db: {
    url: 'mongodb://nembv:Mongo2wjdwnsgh@cluster0-shard-00-00-prgy7.mongodb.net:27017,cluster0-shard-00-01-prgy7.mongodb.net:27017,cluster0-shard-00-02-prgy7.mongodb.net:27017/faw?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
    // url : "mongodb://xxx.com:27170/xxx"
    // url : 'mongodb+srv://id:pwd@cluster0-xxx.net/yyy' // 3.6이상
  },
  web: {
    // 추후 http, https, port등 지
  },
};
```
