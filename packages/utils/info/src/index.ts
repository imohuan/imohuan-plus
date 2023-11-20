import got from "got";
import { NpmInfo, NpmVersion, SearchItem } from "./typings";
import { gt, satisfies } from "semver";

export type * from "./typings";

/**
 * 获取Npm包的info数据
 * @param name npm包名称
 * @param registry 模式使用npm镜像，可以自定义是用其他镜像
 * @returns @extends NpmInfo
 */
export async function getNpmInfo(
  name: string,
  registry: string = "https://registry.npmjs.org"
): Promise<NpmInfo> {
  if (!name.trim()) throw new Error("请输入包名称");
  return await got
    .get(`${registry}/${name}`)
    .json()
    .then((res) => res as any)
    .catch((e) => {
      throw new Error(e);
    });
}

/**
 * 获取Npm包的version数据
 * @param name npm包名称
 * @param baseVersion 最基础的版本号
 * @param registry 模式使用npm镜像，可以自定义是用其他镜像
 * @returns @extends ReturnNpmVersion
 */
export async function getNpmVersions(
  name: string,
  baseVersion: string = "0.0.1",
  registry: string = "https://registry.npmjs.org"
): Promise<NpmVersion> {
  const info = await getNpmInfo(name, registry);
  const versions = Object.keys(info.versions);
  const versionSort = (a: string, b: string) => (gt(b, a) ? 1 : -1);
  const satisfieVersions = versions
    .filter((version) => satisfies(version, ">" + baseVersion))
    .sort(versionSort);
  const latestSemverVersion = versions.sort(versionSort)[0];
  const latestVersion = info["dist-tags"]?.latest || latestSemverVersion;
  return {
    versions,
    satisfieVersions,
    latestVersion,
    latestSemverVersion
  };
}

/**
 * 获取镜像链接
 * @param name 名称 `npm, yarn, tencent, cnpm, taobao, npmMirror`
 * @returns 镜像链接
 */
export function getRegistryMap(
  name: "npm" | "yarn" | "tencent" | "cnpm" | "taobao" | "npmMirror" = "npm"
) {
  const registryMap = {
    npm: "https://registry.npmjs.org/",
    yarn: "https://registry.yarnpkg.com/",
    tencent: "https://mirrors.cloud.tencent.com/npm/",
    cnpm: "https://r.cnpmjs.org/",
    taobao: "https://registry.npmmirror.com/",
    npmMirror: "https://skimdb.npmjs.com/registry/"
  };
  return registryMap?.[name] || registryMap.npm;
}

/**
 * 获取Npm的搜索模块
 * @param name 搜索名称
 * @param page 页码 默认: 1
 * @param option { startsWith } startsWith: false 对结果再次进行过滤，强制开头为搜索的内容
 * @returns @extends SearchItem[]
 */
export async function getSearchList(
  name: string,
  page: number = 1,
  option: { startsWith: boolean } = { startsWith: false }
): Promise<SearchItem[]> {
  const { startsWith } = option;
  return await got
    .get(`https://www.npmjs.com/search?q=${encodeURIComponent(name)}&page=${page}&perPage=1000`, {
      headers: { "x-spiferack": "1" }
    })
    .json()
    .then((res: any) => {
      if (!res?.objects || !Array.isArray(res?.objects)) throw new Error("未找到对应结果");
      const total = res.total;
      const objects: SearchItem[] = res.objects.filter((obj: SearchItem) => {
        if (startsWith) return obj.package.name.startsWith(name);
        return true;
      });
      // 当前显示多少条数据，默认为20
      // const perPage = res.pagination.perPage;
      // 说明没有更多数据了
      if (total < res.objects) return objects;
      // 说明数据还多
      return objects;
    })
    .catch((e) => {
      throw new Error(e);
    });
}
