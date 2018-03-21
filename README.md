# nembv
Node Express Mongo Bootstrap Vue Stack

## 설치 방법

### download
```bash
$ git clone https://github.com/fkkmemi/nembv.git
```

### npm install
```bash
$ npm install
$ cd fe
$ npm install
```

### config file definition

**cfg/cfg.js**  
```javascript
module.exports = {
  db: {
    url: 'mongodb://nembv:password@cluster0-shard-00-00-prgy7.mongodb.net:27017,cluster0-shard-00-01-prgy7.mongodb.net:27017,cluster0-shard-00-02-prgy7.mongodb.net:27017/faw?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',    
    // url : "mongodb://xxx.com:27170/xxx"
    // url : 'mongodb+srv://id:pwd@cluster0-xxx.net/yyy' // 3.6이상
  },
  web: {
    // 추후 http, https, port등 지
  },
};
```

**fe/static/cfg.js**  
```ecmascript 6
module.exports = {
  path: {
    // api : '/api/',
    api: 'http://localhost:3000/api/',
  },
};
```

### run
```bash
$ npm start
$ cd fe
$ npm run dev
```

### 참고
mongoDB read/write 되는 db와 cfg.js 파일만 이상 없으면 문제 없이 동작되는 것을 확인 했습니다.

궁금한 사항은 메일 보내주시면 답변 드리겠습니다. 

### screen shot
![nembv](/public/images/nembv.png)

### remark
Node Express Mongo BootstrapVue 로 다양한 back,front-end의 경계를 허물고 싶은 프로젝트 입니다.

[https://fkkmemi.github.io/categories/#nembv](https://fkkmemi.github.io/categories/#nembv) 

이곳에서 계속 제작중이니 해당 스택 개발자들이 유용하게 쓰이길 희망합니다.

한국형 게시판을 추가중입니다. 