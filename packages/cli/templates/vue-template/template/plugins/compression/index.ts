import _Compression from "vite-plugin-compression";

export function Compression() {
  return _Compression({
    // 是否在控制台输出压缩结果
    verbose: true,
    // 指定不压缩哪些资源
    // filter: /\.css/,
    // 是否禁用
    disable: false,
    // 体积大于阈值会被压缩，单位是b
    threshold: 1025,
    // 压缩算法，可选 ['gzip','brotliCompress' ,'deflate','deflateRaw']
    algorithm: "gzip",
    // 生成的压缩包后缀
    ext: ".gz",
    // 对应压缩算法的参数
    compressionOptions: {},
    // 压缩后是否删除源文件
    deleteOriginFile: false
  });
}
