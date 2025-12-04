# Sau khi setup xong cấu trúc thư mục và node js, tôi đã chạy các lệnh sau để cài đặt db cho node js
```shell cd /workspaces/deepapp_micro_services/services/node-api-gateway
npx prisma db pull
```
Cấp quyền cho cxluser để chạy migrate dev
```sql
GRANT ALL PRIVILEGES ON *.* TO 'cxluser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

```shell
npx prisma migrate reset --force
npx prisma migrate dev --create-only --name baseline
```

```shell
npx prisma migrate dev --name init
```

```npm
npm install express cors body-parser
npm install swagger-ui-express swagger-jsdoc
npm install @prisma/client
npm install --save-dev prisma ts-node typescript @types/express @types/node
```