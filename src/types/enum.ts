export enum Types {
  Primitive = 'Primitive',
  Array = 'Array',
  Object = 'Object'
}

export enum SourceTypes {
  Constant = 'Constant',
  QueryParameter = 'Query parameter',
  SystemProperties = 'System properties',
  EnvironmentVariables = 'Environment variables',
  BrowserProperties = 'Browser properties',
  Time = 'Time',
  Expression = 'Expression',
  AsyncParameters = 'Async parameters'
}

export enum RefreshTypes {
  None = 'None',
  Reactive = 'Reactive',
  TimeBased = 'Time based',
  Trigger = 'Trigger'
}