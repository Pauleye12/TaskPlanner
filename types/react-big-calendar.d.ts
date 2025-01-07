declare module "react-big-calendar" {
  export interface EventProps<T> {
    event: T;
    title: string;
  }

  export interface CalendarProps<T = unknown> {
    localizer: Localizer;
    events: T[];
    startAccessor: string | ((event: T) => Date);
    endAccessor: string | ((event: T) => Date);
    style?: React.CSSProperties;
    eventPropGetter?: (event: T) => { style: React.CSSProperties };
    onSelectEvent?: (event: T) => void;
    views?: View[];
    components?: {
      event?: React.ComponentType<EventProps<T>>;
    };
    className?: string;
  }

  export type View = "month" | "week" | "day";
  export const Views: { [key: string]: View };
  export const Calendar: React.ComponentType<CalendarProps<Task>>;
  export type Localizer = { format: (date: Date, format: string) => string };
  export const momentLocalizer: (moment: unknown) => Localizer;
}
