import type { WidgetType, IWidget } from '@/types/widgets';

class WidgetFactory {
  private datasourceId: string | null = null;

  setDatasourceId(id: string) {
    this.datasourceId = id;
  }

  createWidget(widgetType: WidgetType): IWidget | null {
    if (!this.datasourceId) {
      console.warn('Can not create the Widget: Datasource ID is not set');
      return null;
    }

    const uid = `widget_${Math.random().toString(36).substring(7)}`;
    return {
      uid,
      type: widgetType,
      config: { datasourceId: this.datasourceId },
    };
  }
}

export const widgetFactory = new WidgetFactory();