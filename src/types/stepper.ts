export enum ContentStatus {
  NOTHING = "NOTHING",
  NEWS = "NEWS"
}

export enum NewsStepper {
  STARTED = 1,
  TEXT,
  IMAGE,
  TIMER,
  FINISHED
}

export enum StepAction {
  REPEAT = 1,
  NEXT
}
