<template>
  <div
    :class="[
      'h10 font pl-15px pr2 between relative w-full border leading-8 outline-none',
      focus ? 'border-tw-primary' : 'border-gray-200'
    ]"
  >
    <input
      ref="fileRef"
      type="file"
      accept=".jpg,.png,.jpeg,.ico"
      class="absolute hidden"
      @focus="focus = true"
      @blur="focus = false"
      @change="onFileChange"
    />
    <div class="wh-full flex flex-1 items-center overflow-hidden" @click="onClick">
      <q-icon :class="['pr-2', focus ? 'text-tw-primary' : 'text-gray-500']" name="upload" />
      <div :class="['w-4/5 truncate', focus ? 'text-tw-primary' : 'text-gray-400']">
        {{ placeholder }}
      </div>
    </div>
    <slot />
  </div>
  <div></div>
</template>

<script setup lang="ts">
const focus = ref(false);
const fileRef = ref();
const props = defineProps({
  placeholder: { type: String, required: false, default: "点击上传图片" }
});
const emits = defineEmits(["change"]);

const onClick = () => {
  fileRef.value && fileRef.value.click();
  focus.value = true;
};

const onFileChange = (event: any) => {
  const files = event.target.files;
  const file = files[0];
  emits("change", file);
};

onClickOutside(fileRef, () => {
  focus.value = false;
});
</script>

<style scoped lang="scss"></style>
