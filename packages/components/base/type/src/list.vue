<template>
  <div class="flex w-full flex-col space-y-1">
    <div class="flex w-full flex-col space-y-1">
      <q-input
        v-for="(item, index) in modelValue"
        :key="index"
        :ref="setInputRef"
        class="group w-full"
        :style="style"
        :modelValue="item"
        filled
        stack-label
        :readonly="!statusMap[index]"
        @blur="item.length > 0 && (statusMap[index] = false)"
        @keydown.enter="handleEnter(item, index, false)"
        @keyup.ctrl.enter="handleEnter(item, index, true)"
        @update:model-value="handleInput($event, index)"
      >
        <template #append>
          <div
            class="pointer-events-none flex space-x-1 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <q-icon v-show="!statusMap[index]" name="edit" @click="handleEdit(index)" />
            <q-icon name="delete" @click="handleRemove(index)" />
          </div>
        </template>
      </q-input>
    </div>
    <div class="w-full">
      <q-btn color="primary" size="md" label="添加项" @click="handleAdd" />
    </div>
  </div>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<script setup lang="ts">
import { ref, onBeforeUpdate, withDefaults, onMounted } from "vue";
import { isArray } from "lodash-es";

export interface Props {
  modelValue: any | any[];
}

const statusMap = ref<any>({});
const style = { width: "70%", maxWidth: "500px" };
const props = withDefaults(defineProps<Props>(), { modelValue: () => [{}] });
const inputRefs = ref<any[]>([]);
const setInputRef = (el: any) => el && inputRefs.value.push(el);
onBeforeUpdate(() => (inputRefs.value = []));

const emits = defineEmits(["update:modelValue"]);

onMounted(() => {
  if (!(isArray(props.modelValue) && props.modelValue.length > 0)) emits("update:modelValue", [""]);
});

const handleEdit = (index: number) => {
  Object.keys(statusMap.value).forEach((key) => {
    const item = (props.modelValue as any)[key];
    if (item && item.length > 0) statusMap.value[key] = false;
  });
  statusMap.value[index] = true;
  setTimeout(() => {
    inputRefs.value[index].focus();
  }, 100);
};

const handleEnter = (item: any, index: number, ctrl: boolean) => {
  const list = props.modelValue;
  item.length > 0 && (statusMap[index] = false);
  if (list.length - 1 === index) {
    setTimeout(() => {
      inputRefs.value[index].blur();
    }, 100);
    if (ctrl) handleAdd();
    return;
  }
  handleEdit(index + 1);
};

const handleAdd = () => {
  const list: any[] = props.modelValue;
  const index = list.push("");
  emits("update:modelValue", list);
  handleEdit(index - 1);
};

const handleRemove = (index: number) => {
  const list: any[] = props.modelValue;
  list.splice(index, 1);
  if (list.length === 0) {
    list.push("");
    handleEdit(0);
  }
  emits("update:modelValue", list);
};

const handleInput = (value: any, index: number) => {
  const list: any[] = props.modelValue;
  list.splice(index, 1, value);
  emits("update:modelValue", list);
};
</script>

<style scoped lang="scss"></style>
