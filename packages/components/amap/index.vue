<template>
  <div id="container" class="wh-full"></div>
</template>

<script setup lang="ts">
// pnpm add @amap/amap-jsapi-loader -S

import { set } from "lodash-es";
import { load } from "@amap/amap-jsapi-loader";

const map = shallowRef(null);

const config = {
  key: "505f57cd1ae709fb0386b8fe33892701",
  securityJsCode: "7710eb564265ff3464910aa34d2f0f58"
};

set(window, "_AMapSecurityConfig", { securityJsCode: config.securityJsCode });

load({
  key: config.key,
  version: "2.0",
  plugins: [
    "AMap.Scale",
    "AMap.ToolBar",
    "AMap.PlaceSearch",
    "AMap.AutoComplete",
    "AMap.ElasticMarker",
    "AMap.AdvancedInfoWindow"
  ]
})
  .then((AMap) => {
    const baiduCenter = [104.115738, 30.676844];
    AMap.convertFrom(baiduCenter, "baidu", function (status, result) {
      if (result.info === "ok") {
        const resLnglat = result.locations[0];
        map.value = new AMap.Map("container", {
          //设置地图容器id
          viewMode: "3D", //是否为3D地图模式
          zoom: 10, //初始化地图级别
          // center: [105.602725, 37.076636] //初始化地图中心点位置,
          center: [resLnglat.lng, resLnglat.lat]
        });
        console.log(" [resLnglat.lng, resLnglat.lat]", [resLnglat.lng, resLnglat.lat]);

        map.value.addControl(new AMap.Scale());
        map.value.addControl(new AMap.ToolBar());

        const m2 = new AMap.Marker({
          position: resLnglat
        });
        map.value.add(m2);
        // 设置标签
        m2.setLabel({
          offset: new AMap.Pixel(20, 20)
          // content: "高德坐标系中首开广场（正确）"
        });
        map.value.setFitView();
        console.log("resLnglat", resLnglat);
      }
    });

    AMap.plugin("AMap.PlaceSearch", function () {
      const keywords = "东郊记忆";
      const autoOptions = {
        city: "全国",
        // citylimit: true, //是否强制限制在设置的城市内搜索
        // pageIndex: 1, // 页码
        // pageSize: 5, // 单页显示结果条数
        map: map.value, // 展现结果的地图实例
        panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        extensions: "base" //返回基本地址信息
        // children: 0, //不展示子节点数据
        // type: '餐饮服务', // 兴趣点类别
      };
      const placeSearch = new AMap.PlaceSearch(autoOptions);
      // placeSearch.search(keywords, function (status, result) {
      //   console.log("status", status);
      //   console.log("result", result);
      // });
      // // 11580261.047791785,3565755.907047084;11600213.047791785,3571947.9057719903
      // // 115.80261047791785,35.65755907047084;11600213.047791785,3571947.9057719903
      // placeSearch.getDetails("B001C8NUD2", function (status, result) {
      //   console.log("getDetails result", result);
      // });
    });
  })
  .catch((e) => {
    console.log(e);
  });
</script>

<style scoped lang="scss"></style>
