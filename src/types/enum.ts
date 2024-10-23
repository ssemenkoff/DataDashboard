export enum Types {
  Primitive = 'Primitive',
  Array = 'Array',
  Object = 'Object'
}

export enum SourceType {
  Constant = 'Constant',
  QueryParameter = 'Query parameter',
  SystemProperties = 'System properties',
  EnvironmentVariables = 'Environment variables',
  BrowserProperties = 'Browser properties',
  Time = 'Time',
  Expression = 'Expression',
  AsyncParameters = 'Async parameters'
}

export enum RefreshType {
  None = "None",
  Reactive = "Reactive",
  Interval = "Interval",
  Trigger = "Trigger",
}