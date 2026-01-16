# Reusable Calendar Component

A flexible, customizable calendar component that supports both **agenda** and **calendar** view types with month/year navigation.

## Features

- ✅ Two view types: `"agenda"` and `"calendar"`
- ✅ Month and year selectors
- ✅ Custom event rendering via `renderAgendaItem`
- ✅ Customizable highlight color
- ✅ Support for date groups with custom colors
- ✅ Filters events by month/year
- ✅ Smooth month/year navigation
- ✅ Theme-aware styling

## Location

```
src/component/molecules/calendar/Calendar.tsx
```

## Basic Usage

### Calendar Type (with Selected Date Agenda)

```tsx
import Calendar from '@components/molecules/calendar/Calendar';

<Calendar
  type="calendar"
  events={allEventsData}
  selectedDate={selectedDate}
  onDateSelect={date => setSelectedDate(date)}
  highlightColor="#3B82F6"
  renderAgendaItem={renderCustomAgendaItem}
  showYearSelector={true}
  showMonthSelector={true}
/>;
```

### Agenda Type (Full Month Events)

```tsx
<Calendar
  type="agenda"
  events={allEventsData}
  selectedDate={new Date()}
  onDateSelect={date => console.log(date)}
  highlightColor="#10B981"
  showYearSelector={true}
  showMonthSelector={false}
/>
```

### With Date Groups (Calendar Type Only)

```tsx
const dateGroups = [
  { date: '2026-01-05', color: '#FF5733' },
  { date: '2026-01-15', color: '#33FF57' },
];

<Calendar
  type="calendar"
  events={[]}
  dateGroups={dateGroups}
  highlightColor="#3B82F6"
/>;
```

## Props

```typescript
interface CalendarProps {
  // Type of calendar
  type: 'agenda' | 'calendar';

  // Events to display
  events?: CalendarEvent[];

  // Date groups for highlighting (calendar type only)
  dateGroups?: DateGroup[];

  // Initial selected date
  selectedDate?: Date;

  // Callbacks
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (month: number, year: number) => void;
  onYearChange?: (year: number) => void;

  // Custom rendering
  renderAgendaItem?: (
    event: CalendarEvent,
    index: number,
  ) => React.ReactElement;

  // Styling
  highlightColor?: string;
  defaultEventColor?: string;

  // UI controls
  showYearSelector?: boolean;
  showMonthSelector?: boolean;
}

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: string; // e.g., "1h 30m"
  location: string;
  description: string;
  color: string; // Hex color
  status?: 'in_progress' | 'assigned' | 'scheduled';
}

interface DateGroup {
  date: string; // YYYY-MM-DD format
  color: string; // Hex color
}
```

## Behavior by Type

### `type="calendar"`

- Shows current month calendar grid
- Displays colored dots for events on each date
- When selecting a date, shows agenda items for that date below
- Supports year/month navigation
- Uses `renderAgendaItem` for custom event rendering
- Shows selected date events only

### `type="agenda"`

- Shows current month calendar grid
- Displays all events in the current month below calendar
- Updates event list when navigating months
- Uses `renderAgendaItem` for custom event rendering
- Does not show selected date agenda

## Custom Event Rendering

```tsx
const renderCustomAgendaItem = (event: CalendarEvent, index: number) => (
  <View style={styles.customEvent}>
    <Text>{event.title}</Text>
    <Text>
      {event.startTime} - {event.endTime}
    </Text>
  </View>
);

<Calendar
  type="calendar"
  events={events}
  renderAgendaItem={renderCustomAgendaItem}
/>;
```

## Example: MemberScheduleScreen Integration

```tsx
import Calendar, {
  CalendarEvent,
} from '@components/molecules/calendar/Calendar';

const MemberScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events: CalendarEvent[] = [
    {
      id: '1',
      date: '2026-01-05',
      title: 'AC Unit Repair',
      startTime: '09:00',
      endTime: '10:30',
      duration: '1h 30m',
      location: '123 Main St',
      description: 'Mike Ross • Residential',
      color: '#3B82F6',
      status: 'in_progress',
    },
    // ... more events
  ];

  const renderAgendaItem = (event: CalendarEvent) => (
    <TouchableOpacity>
      <Text>{event.title}</Text>
      <Text>{event.startTime}</Text>
    </TouchableOpacity>
  );

  return (
    <Calendar
      type="calendar"
      events={events}
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      highlightColor="#3B82F6"
      renderAgendaItem={renderAgendaItem}
      showYearSelector={true}
      showMonthSelector={true}
    />
  );
};
```

## Year Selector

When clicking the year or using `showYearSelector={true}`:

- Displays 12-year range (±6 years from current)
- Tap a year to select and return to month view
- Automatic month/year synchronization

## Features

| Feature              | `calendar` | `agenda` |
| -------------------- | ---------- | -------- |
| Month View           | ✅         | ✅       |
| Year Selector        | ✅         | ✅       |
| Event Dots           | ✅         | ✅       |
| Selected Date Agenda | ✅         | ❌       |
| Full Month Agenda    | ❌         | ✅       |
| Date Groups          | ✅         | ❌       |
| Custom Rendering     | ✅         | ✅       |

## Styling

Calendar uses:

- Theme tokens from `ThemeContext` (background01, text01, text02, primary01)
- StyleSheet for static styles
- Customizable `highlightColor` for selected dates and highlights

## Notes

- All dates must be in `YYYY-MM-DD` format
- Events are automatically filtered by current month
- Selecting different months resets event agenda
- Year selector shows 12-year range centered on current year
- Maximum 2 event dots shown per date (aesthetic limit)
