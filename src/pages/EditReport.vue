<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import WidgetWrapper from '@/plugins/widgets/Wrapper/WidgetWrapper.vue';
import { useWidgetsStore } from '@/plugins/data/WidgetsPinia';
import { useMoveableLayout } from '@/composables/movableLayout';
import { useLayoutStore, type ILayoutItem } from '@/plugins/data/LayoutsPinia';
import WidgetControls from '@/plugins/widgets/SampleWidget/WidgetControls.vue';
import Moveable from "vue3-moveable";
import type { IWidget, WidgetType } from '@/types/widgets';
import WidgetCreationPanel from '@/plugins/widgets/SampleWidget/WidgetCreationPanel.vue';
import { widgetFactory } from '@/plugins/widgets/SampleWidget/WidgetFactory';

const isPanelVisible = ref(false);
const innerLayoutItems = ref<ILayoutItem[]>([]);
const innerWidgets = ref<IWidget[]>([]);
const isDragging = ref(false);
const { updateWidgets, widgets } = useWidgetsStore();
const { updateLayout, layout } = useLayoutStore();
const {
  ghostPlaceholder,
  processDropCoordinates,
  processDragOverCoordinates,
  hidePlaceholder,
  getInitialStyle,
  getMovableControlStyles,
  drag,
  resize,
  moveUp,
  moveDown,
  moveToTop,
  moveToBottom,
} = useMoveableLayout(innerLayoutItems);

onMounted(() => {
  innerWidgets.value = JSON.parse(JSON.stringify(widgets));
  innerLayoutItems.value = JSON.parse(JSON.stringify(layout));
});

watch(
  () => ({ widgets, layout }), 
  ({ widgets: newWidgets, layout: newLayout }) => {
    innerWidgets.value = JSON.parse(JSON.stringify(newWidgets));
    innerLayoutItems.value = JSON.parse(JSON.stringify(newLayout));
  }, 
  { deep: true }
);

const openSettings = (uid: string) => {
  console.log(uid);
};

const removeWidget = (uid: string) => {
  const index = innerWidgets.value.findIndex((widget) => widget.uid === uid);
  if (index !== -1) {
    innerWidgets.value.splice(index, 1);
  }

  const layoutIndex = innerLayoutItems.value.findIndex((item) => item.id === uid);
  if (layoutIndex !== -1) {
    innerLayoutItems.value.splice(layoutIndex, 1);
  }
  updateWidgets(innerWidgets.value);
  updateLayout(innerLayoutItems.value);
};

const addWidget = (widgetType: WidgetType, dropX: number, dropY: number) => {
  const newWidget = widgetFactory.createWidget(widgetType);
  if (!newWidget) {
    console.log('Please select a datasource before adding a widget.');
    return;
  }

  innerWidgets.value.push(newWidget);
  const width = ghostPlaceholder.value.width;
  const height = ghostPlaceholder.value.height;

  const newlayout = {
    id: newWidget.uid,
    x: dropX - width / 2,
    y: dropY - height / 2,
    width,
    height,
    z: 3005,
  };

  innerLayoutItems.value.push(JSON.parse(JSON.stringify(newlayout)));
  updateWidgets(innerWidgets.value);
  updateLayout(innerLayoutItems.value);
};

const onDrop = (event: DragEvent) => {
  hidePlaceholder();
  const currentTarget = event.currentTarget as HTMLElement;

  if (currentTarget) {
    const { dropX, dropY } = processDropCoordinates(event, currentTarget);
    const widgetType = event.dataTransfer?.getData("text/plain") as WidgetType;
    addWidget(widgetType, dropX, dropY);
  }
};

const onDragOver = (event: DragEvent) => {
  if (event.dataTransfer?.types.includes("text/plain")) {
    event.preventDefault();
    isDragging.value = true;

    const currentTarget = event.currentTarget as HTMLElement;

    if (currentTarget) {
      processDragOverCoordinates(event, currentTarget);
    }
  }
};

const onDragLeave = (event: DragEvent) => {
  if (event.dataTransfer?.types.includes("text/plain")) {
    isDragging.value = false;
    hidePlaceholder();
  }
};

const saveLayout = () => {
  updateLayout(innerLayoutItems.value);
};

const resetLayout = () => {
  innerLayoutItems.value = JSON.parse(JSON.stringify(layout));
};

const togglePanel = () => {
  isPanelVisible.value = !isPanelVisible.value;
};

const closePanel = () => {
  isPanelVisible.value = false;
};
</script>

<template>
  <div class="report-container">
    <div
      class="widget-board"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div
        v-if="ghostPlaceholder.visible"
        class="ghost-placeholder"
        :style="{
          left: `${ghostPlaceholder.x}px`,
          top: `${ghostPlaceholder.y}px`,
          width: `${ghostPlaceholder.width}px`,
          height: `${ghostPlaceholder.height}px`,
        }"
      >
      </div>
      <template v-for="widget in innerWidgets" :key="widget.uid">
        <div
          :class="`${widget.uid} dashboard-item-container`"
          :style="getInitialStyle(widget.uid)"
          :ref="widget.uid"
        >
          <va-dropdown
            :trigger="'right-click'"
            :auto-placement="false"
            placement="right-start"
            cursor
          >
            <template #anchor>
              <div class="dashboard-item">
                <WidgetWrapper
                  :widget="widget"
                  :ref="`${widget.uid}_wrapper`"
                />
                <WidgetControls
                  @removeWidget="removeWidget(widget.uid)"
                  @openSettings="openSettings(widget.uid)"
                />
              </div>
            </template>
            <va-dropdown-content>
              <div class="dropdown-buttons-container">
                <va-button @click="moveUp(widget.uid)">Move up</va-button>
                <va-button @click="moveDown(widget.uid)">Move down</va-button>
                <va-button @click="moveToTop(widget.uid)">Move to top</va-button>
                <va-button @click="moveToBottom(widget.uid)">Move to bottom</va-button>
              </div>
            </va-dropdown-content>
          </va-dropdown>
        </div>
        <Moveable
          v-bind:target="[`.${widget.uid}`]"
          v-bind:draggable="true"
          v-bind:resizable="true"
          v-bind:useResizeObserver="true"
          v-bind:useMutationObserver="true"
          @drag="drag(widget.uid, $event)"
          @resize="resize(widget.uid, $event)"
          :snappable="true"
          :snapGridWidth="20"
          :snapGridHeight="20"
          :origin="false"
          :ref="`${widget.uid}_control`"
          :style="getMovableControlStyles(widget.uid)"
        >
        </Moveable>
      </template>
    </div>
  </div>
  <template v-if="isPanelVisible">
    <WidgetCreationPanel
    :innerLayout="innerLayoutItems"
    @saveLayout="saveLayout"
    @resetLayout="resetLayout"
    @closePanel="closePanel"
  />
  </template>
  <template v-else="!isPanelVisible">
    <va-button class="creation-panel-button" @click="togglePanel">Open Panel</va-button>
  </template>
</template>

<style scoped lang="scss">
.ghost-placeholder {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border: 2px dashed #ccc;
  z-index: 1000;
  pointer-events: none;
}

.report-container {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: calc(100% - 362px);
  height: 100%;
  overflow: auto;

  &__title {
    width: 100%;
    padding: 16px;
    border-bottom: 1px dashed #e0e0e0;
  }

  .widget-board {
    width: 100%;
    height: 100%;
    display: flex;
    box-sizing: border-box;
  }

  .control-btn {
    margin: 0 16px 16px 0;
    align-self: self-end;
  }
}

.creation-panel-button {
  position: absolute;
  top: 84px;
  right: 24px;
}

.dashboard-item {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dashboard-item-container {
  position: absolute;
}

.dropdown-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 99999;
}

.va-dropdown__content {
  z-index: 10000000 !important;
}

.va-dropdown__content.va-select-dropdown__content.va-dropdown__content-wrapper {
  z-index: 20000000 !important;
}
</style>
