## games-admin

- 前端地址
  - 开发：http://games-admin-static.niki-development.svc.cluster.local/
  - 测试：http://games-admin-static.niki-test.svc.cluster.local/
  - 预发：http://games-admin-static.niki-pre.svc.cluster.local/
  - 生产：http://games-admin-static.niki.maitang.tv/
  - 海外：

- 安装
```
npm install
```

- 运行
```
npm run serve:development
npm run serve:test
npm run serve:staging
npm run serve:production 
```

- 打包
```
npm run build:development
npm run build:test
npm run build:staging
npm run build:production
```



docker run -d -p 2022:80 --name swy_admin_static swy_admin_static:latest


