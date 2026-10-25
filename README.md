# application-cilent

安装依赖（Windows 和 Linux 通用）：

```bash
npm install
```

项目通过 `postinstall` 自动使用 npmmirror 下载 Electron，无需手动设置环境变量。
如已设置 `ELECTRON_MIRROR`，则优先使用自己的镜像地址。

地址弹窗的默认值保存在 `resources/config.json`：

```json
{
  "defaultUrl": "http://127.0.0.1:18000"
}
```

打包后该文件位于应用目录的 `resources/config.json`，与 `app.asar` 并列，
可以直接修改。关闭并重新打开地址弹窗后生效；配置缺失或格式错误时输入框为空。

仅生成 ZIP 压缩包，不生成安装程序。以下命令默认使用 x64 架构：

```bash
# Windows ZIP
npm run make:windows

# Debian/Linux ZIP
npm run make:linux
```

产物分别位于 `out/make/zip/win32/x64/` 和 `out/make/zip/linux/x64/`。
解压整个 ZIP 后，Windows 运行 `application-cilent.exe`，Debian 运行
`./application-cilent`。Linux ZIP 不会自动安装系统运行库或创建桌面快捷方式。

其他架构可直接指定，例如：

```bash
npm run make -- --platform=linux --arch=arm64
```
