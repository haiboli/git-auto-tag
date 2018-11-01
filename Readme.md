# gitAutoTag
## 开始
    npm install git-auto-tag -g

## 配置
    gatag remote upstream 设置仓库地址, 默认为origin
    gatag time YYYYMMDDHHmm 设置时间格式，默认为YYYYMMDDHHmmss
## 选项
     -b,--branch 生成带有分支的tag 如t20181010-branch
     -w,--who 生成带有姓名的tag 如t20181010-name

## 例子
    gatag  //默认tYYYYMMDDHHmmss
    gatag -b
