<template>
  <div class="widget-controls">
    <VaButton class="control-button" @click="$emit('openSettings')" icon="settings" size="small"></VaButton>
    <VaButton class="control-button" @click="$emit('removeWidget')" icon="close" color="danger" size="small"></VaButton>
  </div>
</template>

<style lang="scss" scoped>
.widget-controls {
  position: absolute;
  top: -25px;
  right: 0;
  display: flex;
  justify-content: flex-end;
  background-color: white;
  z-index: 10;

  .control-button {

  }
}
</style>