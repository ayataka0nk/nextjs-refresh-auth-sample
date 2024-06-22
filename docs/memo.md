# memo

## 初期設定

package.json の scripts に追加

```
    "make:migration": "prisma migrate dev --create-only && prisma generate",
    "migrate": "prisma migrate deploy",
    "seed": "ts-node -P tsconfig.script.json prisma/seeders/seed.ts"
```

```
npx prisma init --datasource-provider postgresql
```

.env

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
```
