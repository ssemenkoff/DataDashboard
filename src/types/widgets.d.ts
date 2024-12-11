export type WidgetType = 'SampleWidget' | 'ChartWidget' | 'TextWidget' | 'ImageWidget' | 'VideoWidget' | 'TableWidget';

export interface IWidget {
  uid: string,
  type: WidgetType,
  // wrapperConfig?: {
  //   [key: string]: any;
  // },
  config: {
    datasourceId: string,
  }
}
