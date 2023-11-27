<template>
  <im-upload
    v-if="!$slots.default"
    :placeholder="(file && basename(file.path)) || '请上传头像'"
    @change="onAvatarChange"
  >
    <div v-if="_image || image" class="z-999 relative">
      <img class="wh-26!" :src="_image || image" alt="" />
      <q-popup-proxy>
        <img class="wh-200!" :src="_image || image" alt="" />
      </q-popup-proxy>
    </div>
  </im-upload>

  <slot :data="{ onChange: onAvatarChange }" />

  <im-avatar
    :show="show"
    :file="file"
    @close="onAvatarClose"
    @success="onAvatarSuccess"
  ></im-avatar>
</template>

<script setup lang="ts">
import { basename } from "path";
import { ref, withDefaults, defineProps } from "vue";

interface Props {
  image: string;
  modelValue: File | null;
}

const props = withDefaults(defineProps<Props>(), {
  image: "",
  modelValue: null
});
const emits = defineEmits(["update:modelValue", "update:image"]);

let avatarIsSelect = false;
const file = ref();
const show = ref(false);
const _image = ref("");

/** 选择图片 */
const onAvatarChange = (_file: File) => {
  console.log("onAvatarChange");
  if (!_file) return;
  show.value = true;
  file.value = _file;
};

/** 头像截取成功 */
const onAvatarSuccess = (file: File, src: string) => {
  _image.value = src;
  show.value = false;
  avatarIsSelect = true;
  emits("update:image", src);
  emits("update:modelValue", file);
};

/** 裁剪图片中点击取消 */
const onAvatarClose = () => {
  show.value = false;
  if (!avatarIsSelect) file.value = null;
};
</script>

<style scoped lang="scss"></style>
