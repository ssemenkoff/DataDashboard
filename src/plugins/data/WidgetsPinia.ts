import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IWidget } from '@/types/widgets';

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