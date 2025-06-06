
export type DebugMode = 'none' | 'visible' | 'expanded';

export interface DebugStatus {
  channelStatus: string;
  debugMode: DebugMode;
}
