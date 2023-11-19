/** Package.json 基础信息 */
export interface PackInfo {
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 版本号 */
  version: string;
  /** 入口文件地址 */
  main: string;
  /** 脚本 */
  scripts: { [key: string]: string };
  /** 开源策略 */
  license: string;
  /** 项目主页 */
  homepage: string;
  /** 关键词 */
  keywords: string[];
  /* 存储库 */
  repository: { type: string; url: string };
  /* 作者 名称 */
  author: { name: string };
  /** 议题收集地址 */
  bugs: { url: string };
  /** 运行依赖 */
  dependencies: { [key: string]: string };
  /** 开发人员依赖关系 */
  devDependencies: { [key: string]: string };
}

/** Npm 的信息 */
export interface NpmInfo {
  /** 名称id */
  _id: string;
  /** id */
  _rev: string;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** Dist标签 */
  "dist-tags": { latest: string; next: string };
  /** 版本号 */
  versions: { [key: string]: Partial<PackInfo> };
  /** 介绍 */
  readme: string;
  /** 介绍文件路径 */
  readmeFilename: string;
  /** 维护员 */
  maintainers: { name: string; email: string }[];
  /** 版本更新时间 */
  time: { [key: string]: string };
  /** 项目主页 */
  homepage: string;
  /** 关键词 */
  keywords: string[];
  /* 存储库 */
  repository: { type: string; url: string };
  /* 作者 名称 */
  author: { name: string };
  /** 议题收集地址 */
  bugs: { url: string };
  /** 开源策略 */
  license: string;
  /** 用户数据 */
  users: any;
  /** 贡献者 名称，地址 */
  contributors: { name: string; url: string }[];
  [key: string]: any;
}

/** 返回的版本数据 */
export interface NpmVersion {
  /** 所有的版本列表 */
  versions: string[];
  /** 比基础版本大的版本列表 */
  satisfieVersions: string[];
  /** npm info中的最新版本 */
  latestVersion: string;
  /** 通过semver对比的最大版本号 */
  latestSemverVersion: string;
}

export interface SearchPackage {
  /** 日期 */
  date: {
    /** 相对时间 */
    rel: string;
    /** 精确时间帧 */
    ts: number;
  };
  /** 描述 */
  description: string;
  /** 关键词 */
  keywords: string[];
  /** 关键字已截断 */
  keywordsTruncated: boolean;
  /** 链接 */
  links: { npm: string; [key: string]: string };
  /** 维护员 */
  maintainers: NpmInfo["maintainers"];
  /** 上传作者 */
  publisher: { name: string; avatars: string };
  /** 范围 */
  scope: string;
  /** 名称 */
  name: string;
  /** 版本号 */
  version: string;
}

export interface SearchItem {
  /** 当前项目信息 */
  package: SearchPackage;
  /** 项目得分情况 */
  score: {
    /** 详情 */
    detail: {
      /** 维护 */
      maintenance: number;
      /** 受欢迎度 */
      popularity: number;
      /** 质量 */
      quality: number;
    };
    /** 最终得分 */
    final: number;
  };
  /** 搜索分数 */
  searchScore: number;
}
