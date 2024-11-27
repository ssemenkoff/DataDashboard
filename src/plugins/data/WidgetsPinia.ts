import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface IWidget {
  uid: string,
  type: 'SampleWidget',
  // wrapperConfig?: {
  //   [key: string]: any;
  // },
  config: {
    datasourceId: string,
  }
}

export const useWidgetsStore = defineStore('widgets', () => {
  const widgets = ref([] as IWidget[]);

  const updateWidgets = (widgetsProxy: IWidget[]) => {
    
    widgets.value.splice(0, widgets.value.length, ...widgetsProxy);
  }

  return { 
    widgets,
    updateWidgets
  };
});