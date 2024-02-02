# optifine-downloadfile-302

一个小小的 API，根据 fileName 自动抓取并返回 [OptiFine 官网页面](https://optifine.net)的下载链接。

## 部署

本仓库提供两种版本：

- 部署至 [Vercel](https://vercel.com) 的 Python 版本（main.py） # 推荐

- 部署至 [Cloudflare Workers](https://workers.cloudflare.com) 的 JavaScript 版本（main.js）

### Vercel

点击 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fzkitefly%2Foptifine-downloadfile-302&project-name=optifine-downloadfile-302&repo-name=optifine-downloadfile-302&demo-title=optifine-downloadfile-302&demo-description=%E4%B8%80%E4%B8%AA%E5%B0%8F%E5%B0%8F%E7%9A%84+API%EF%BC%8C%E6%A0%B9%E6%8D%AE+fileName+%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96%E7%BD%91%E9%A1%B5%E8%BF%94%E5%9B%9E%E5%B9%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5&demo-url=https%3A%2F%2Fgithub.com%2Fzkitefly%2Foptifine-downloadfile-302) 按钮跳转至 Vercel 进行部署操作。

### Cloudflare Workers

拷贝 [main.js](./main.js) 的 _所有完整代码_ 并 _覆盖_ 至 [workers.cloudflare.com/playground](https://workers.cloudflare.com/playground)，然后点击右上角的 `Deploy` 按钮跳转至配置页面，设置并部署即可。

## 使用

在成功配置并部署 API 后，只需按照如下格式请求即可：

```
GET {apiRoot}/file/{fileName}
```

- `{apiRoot}` 为该 API 的域名，类似于：`https://of-302v.zkitefly.eu.org`

- `{fineName}` 为需要下载的文件名称，该文件名必须含有 `OptiFine_` 和 `.jar`，否则将返回 `404 Not Found` 状态码。

## 抓取策略

以下为抓取下载链接的逻辑：

- 获取 `https://optifine.net/adloadx?f=` + `fileName` 页面的下载链接，并检查该链接是否为 `200 OK` 状态码和 HTTP 标头是否含有 `Content-Disposition` 属性
  - 如果是
    - 以 `302 Found` 状态码返回 OptiFine 官网页面的下载链接
  - 如果不是
    - 尝试获取 [BMCLAPI](https://bmclapidoc.bangbang93.com) 的 [OptiFine 列表](https://bmclapidoc.bangbang93.com/#api-Optifine-getOptifineList) 并查找该 `fileName` 是否存在于该列表中
      - 如果该列表存在该 `fileName` 时
        - 以 `302 Found` 状态码返回 BMCLAPI 的 [OptiFine 下载链接](https://bmclapidoc.bangbang93.com/#api-Optifine-getOptifine)
      - 如果该列表不存在该 `fileName` 时
        - 返回 `404 Not Found` 状态码

## fileName 列表

可使用 BMCLAPI 的 [OptiFine 列表](https://bmclapidoc.bangbang93.com/#api-Optifine-getOptifineList) 中的 `filename` 数据，或使用来自 [zkitefly/optifine-download-list](https://github.com/zkitefly/optifine-download-list) 的自动抓取列表中的 `filename` 数据。

## 演示站测试链接

Vercel：

```
https://of-302v.zkitefly.eu.org/file/OptiFine_1.20.1_HD_U_I6.jar
```

Cloudflare：
```
https://of-302.zkitefly.eu.org/file/OptiFine_1.20.1_HD_U_I6.jar
```
