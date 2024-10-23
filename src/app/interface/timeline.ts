export interface ITimeline {
  title: string;
  inProgress?: boolean;
  color?: string;
  timeline: {
    [date: string]: string;
  };
}
