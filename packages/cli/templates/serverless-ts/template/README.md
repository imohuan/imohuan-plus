## 文档

官方文档非常全面, 就不现丑了

- `https://midwayjs.org/`

注意
遇到问题不要急，翻翻文档，翻翻 github 的 issus
如果还是找不到

1. 创建一个最小的项目，模拟当前项目问题所在
2. 根据最小项目查看问题是否可以自己解决
3. 如果无法解决，可以直接新建 issus

上传到云服务

阿里云

1. 这里如果项目中的 npm 包没有什么改动需要调试可以尝试将 node_modules 打包上传到层中
2. 然后在云函数 deploy 打包后手动绑定层
3. 通过脚手架参数可以直接跳过安装依赖和打包依赖上传的步骤可以更加快捷
