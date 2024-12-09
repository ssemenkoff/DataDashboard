<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import WidgetWrapper from '@/plugins/widgets/Wrapper/WidgetWrapper.vue';
import { useDataSourcesStore } from '@/plugins/data/DatasourcePinia';
import { useWidgetsStore, type IWidget } from '@/plugins/data/WidgetsPinia';
import { useMoveableLayout } from '@/composables/movableLayout';
import { useLayoutStore, type ILayoutItem } from '@/plugins/data/LayoutsPinia';
import WidgetControls from '@/plugins/widgets/SampleWidget/WidgetControls.vue';
import Moveable from "vue3-moveable";

const selectedDatasourceName = ref("");
const selectedDatasourceId = ref("");
const { dataSources } = useDataSourcesStore();
const innerlayoutItems = ref([] as ILayoutItem[]);
const innerWidgets = ref<IWidget[]>([]);

const { updateWidgets, widgets } = useWidgetsStore();
const { updateLayout, layout } = useLayoutStore();
const {
  getInitialStyle,
  getMovableControlStyles,
  drag,
  resize,
  moveUp,
  moveDown,
  moveToTop,
  moveToBottom,
} = useMoveableLayout(innerlayoutItems);

const datasourceNames = computed(() => {
  return Object.values(dataSources).map(v => v.name);
});

onMounted(() => {
  const datasource = Object.values(dataSources).find(v => v.name === selectedDatasourceName.value);
  if (datasource) {
    selectedDatasourceId.value = datasource.uid;
  }
  innerWidgets.value = JSON.parse(JSON.stringify(widgets));
  innerlayoutItems.value = JSON.parse(JSON.stringify(layout));
});

watch(selectedDatasourceName,() => {
  const datasource = Object.values(dataSources).find(v => v.name === selectedDatasourceName.value);
  if (datasource) {
    selectedDatasourceId.value = datasource.uid;
  }
});

watch(
  () => ({ widgets, layout }), 
  ({ widgets: newWidgets, layout: newLayout }) => {
    innerWidgets.value = JSON.parse(JSON.stringify(newWidgets));
    innerlayoutItems.value = JSON.parse(JSON.stringify(newLayout));
  }, 
  { deep: true }
);

const openSettings = (uid: string) => {
  console.log(uid)
};

const removeWidget = (uid: string) => {
  const index = innerWidgets.value.findIndex((widget) => widget.uid === uid);
  if (index !== -1) {
    innerWidgets.value.splice(index, 1);
  }

  const layoutIndex = innerlayoutItems.value.findIndex((item) => item.id === uid);
  if (layoutIndex !== -1) {
    innerlayoutItems.value.splice(layoutIndex, 1);
  }
  updateWidgets(innerWidgets.value);
  updateLayout(innerlayoutItems.value);
};

const addWidget = () => {
  const uid = `widget_${Math.random().toString(36).substring(7)}`;
  const type = "SampleWidget";
  const config = { datasourceId: selectedDatasourceId.value };
  const newWidget: IWidget = { uid, type, config };

  if (selectedDatasourceName.value) {
    
    innerWidgets.value.push(newWidget);

    const newlayout = {
      id: uid,
      x: 0,
      y: 700,
      width: 300,
      height: 150,
      z: 3005,
    };

    innerlayoutItems.value.push(JSON.parse(JSON.stringify(newlayout)));
    updateWidgets(innerWidgets.value);
    updateLayout(innerlayoutItems.value);
  }
};

const saveLayout = () => {
  updateLayout(innerlayoutItems.value);
};

const resetLayout = () => {
  innerlayoutItems.value = JSON.parse(JSON.stringify(layout));
};

const isSaveResetDisabled = computed(() => {
  return JSON.stringify(innerlayoutItems.value) === JSON.stringify(layout);
});
</script>

<template>
  <div class="report-container">
    <div class="widgets-layout-controls">
      <VaSelect label="Datasource ID" class="mx-3 my-3" v-model="selectedDatasourceName" :options="datasourceNames"/>
      <VaButton class="control-btn" icon="add" @click="addWidget">Add</VaButton>
      <VaButton class="control-btn" icon="save" @click="saveLayout" :disabled="isSaveResetDisabled">Save Layout</VaButton>
      <VaButton class="control-btn" icon="close" @click="resetLayout" :disabled="isSaveResetDisabled">Reset Layout</VaButton>
    </div>
    <div class="widget-board">
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
              <va-button @click="moveUp(widget.uid)">
                Move up
              </va-button>
              <va-button @click="moveDown(widget.uid)">
                Move down
              </va-button>
              <va-button @click="moveToTop(widget.uid)">
                Move to top
              </va-button>
              <va-button @click="moveToBottom(widget.uid)">
                Move to bottom
              </va-button>
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
</template>

<style scoped lang="scss">
.report-container {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__title {
    width: 100%;
    padding: 16px;
    border-bottom: 1px dashed #e0e0e0;
  }

  .widgets-layout-controls {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 16px;
  }

  .widget-board {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 35px 35px 0 35px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .control-btn {
    margin: 0 16px 16px 0;
    align-self: self-end;
  }
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
