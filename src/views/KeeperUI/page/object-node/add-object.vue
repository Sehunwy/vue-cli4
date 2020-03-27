<template>
  <div>
    <loongDialog
      modalType="max"
      widthDialog="860px"
      :title="doI18n('keeper_create_node')"
      :isShowDialog="true"
    ></loongDialog>
  </div>
</template>

<script>
import loongDialog from "@/components/loongDialog/loongDialog";
export default {
  name: "add-object",
  components: {
    loongDialog
  }
};
</script>

<style>
</style>