import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import { relativeHeight } from '@core/util/Theme/layout';
import { ThemeMode } from '@core/util/Theme';

export interface CalendarEvent {
    id: string;
    date?: string; // For single-day events (backwards compatibility)
    startDate?: string; // For date range events (YYYY-MM-DD)
    endDate?: string; // For date range events (YYYY-MM-DD)
    title: string;
    startTime: string;
    endTime: string;
    duration: string;
    location: string;
    description: string;
    customer?: string;
    color: string;
    contact?: string;
    status?: 'in_progress' | 'assigned' | 'scheduled';
}

export interface DateGroup {
    date: string;
    color: string;
}

export interface CalendarDateItem {
    date: string;
    day: number;
    hasEvent: boolean;
    isSelected: boolean;
    isCurrentDay: boolean;
    eventColors: string[];
}

export interface CalendarProps {
    type: 'agenda' | 'calendar';
    events?: CalendarEvent[];
    dateGroups?: DateGroup[];
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    onMonthChange?: (month: number, year: number) => void;
    onYearChange?: (year: number) => void;
    renderAgendaItem?: (event: CalendarEvent, index: number) => React.ReactElement;
    highlightColor?: string;
    defaultEventColor?: string;
    showYearSelector?: boolean;
    showMonthSelector?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
    type = 'calendar',
    events = [],
    dateGroups = [],
    selectedDate,
    onDateSelect,
    onMonthChange,
    onYearChange,
    renderAgendaItem,
    highlightColor = '#3B82F6',
    // defaultEventColor = '#3B82F6',
    showYearSelector = true,
    showMonthSelector = true,
}) => {
    const theme: any = useTheme();
    const { t } = useTranslation();

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(selectedDate || today);
    const [viewMode, setViewMode] = useState<'month' | 'year' | 'monthSelector'>('month');
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // keep internal calendar month/year/currentDate in sync with external selectedDate prop
    useEffect(() => {
        if (selectedDate) {
            setCurrentDate(selectedDate);
            setSelectedMonth(selectedDate.getMonth() + 1);
            setSelectedYear(selectedDate.getFullYear());
        }
    }, [selectedDate]);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month - 1, 1).getDay();
    };

    // Helper function to check if a date falls within an event's date range
    const isDateInEventRange = (dateStr: string, event: CalendarEvent): boolean => {
        // Handle single-day events (backwards compatibility)
        if (event.date) {
            return event.date === dateStr;
        }

        // Handle date range events
        if (event.startDate && event.endDate) {
            return dateStr >= event.startDate && dateStr <= event.endDate;
        }

        // If only startDate is provided, treat as single-day event
        if (event.startDate) {
            return event.startDate === dateStr;
        }

        return false;
    };

    const generateCalendarDays = (): CalendarDateItem[] => {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
        const days: CalendarDateItem[] = [];

        // Filter events/dates for current month
        const currentMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
        const monthEvents = events.filter((event) => {
            // Check if event date or date range overlaps with current month
            if (event.date) {
                return event.date.startsWith(currentMonthStr);
            }
            if (event.startDate && event.endDate) {
                const monthStart = `${currentMonthStr}-01`;
                const monthEnd = `${currentMonthStr}-${String(daysInMonth).padStart(2, '0')}`;
                return event.startDate <= monthEnd && event.endDate >= monthStart;
            }
            return false;
        });

        // Add empty days
        for (let i = 0; i < firstDay; i++) {
            days.push({
                date: '',
                day: 0,
                hasEvent: false,
                isSelected: false,
                isCurrentDay: false,
                eventColors: [],
            });
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const eventsForDay = monthEvents.filter((event) => isDateInEventRange(dateStr, event));
            const dateGroupForDay = dateGroups.find((group) => group.date === dateStr);

            const isCurrentDay =
                today.getDate() === day &&
                today.getMonth() === selectedMonth - 1 &&
                today.getFullYear() === selectedYear;

            const isSelected =
                currentDate.getDate() === day &&
                currentDate.getMonth() === selectedMonth - 1 &&
                currentDate.getFullYear() === selectedYear;

            days.push({
                date: dateStr,
                day: day,
                hasEvent: eventsForDay.length > 0 || !!dateGroupForDay,
                isSelected: isSelected,
                isCurrentDay: isCurrentDay,
                eventColors: eventsForDay.length > 0
                    ? eventsForDay.map((e) => e.color).slice(0, 2)
                    : dateGroupForDay
                        ? [dateGroupForDay.color]
                        : [],
            });
        }

        return days;
    };

    const getEventsForSelectedDate = (): CalendarEvent[] => {
        const dateStr = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        return events.filter((event) => isDateInEventRange(dateStr, event));
    };

    const getEventsForMonth = (): CalendarEvent[] => {
        const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const monthStart = `${monthStr}-01`;
        const monthEnd = `${monthStr}-${String(daysInMonth).padStart(2, '0')}`;

        return events.filter((event) => {
            if (event.date) {
                return event.date.startsWith(monthStr);
            }
            if (event.startDate && event.endDate) {
                return event.startDate <= monthEnd && event.endDate >= monthStart;
            }
            return false;
        });
    };

    const handleDateSelect = (day: number) => {
        if (day > 0) {
            const newDate = new Date(selectedYear, selectedMonth - 1, day);
            setCurrentDate(newDate);
            onDateSelect?.(newDate);
        }
    };

    const handleMonthChange = (direction: -1 | 1) => {
        setSelectedMonth((prev) => {
            let newMonth = prev + direction;
            let newYear = selectedYear;

            if (newMonth > 12) {
                newMonth = 1;
                newYear += 1;
            } else if (newMonth < 1) {
                newMonth = 12;
                newYear -= 1;
            }

            setSelectedYear(newYear);
            onMonthChange?.(newMonth, newYear);
            return newMonth;
        });
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        setViewMode('month');
        onYearChange?.(year);
    };

    const calendarDays = generateCalendarDays();
    const weekDays = [
        t('weekday_sun'),
        t('weekday_mon'),
        t('weekday_tue'),
        t('weekday_wed'),
        t('weekday_thu'),
        t('weekday_fri'),
        t('weekday_sat'),
    ];

    // Get translated month name
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const translatedMonthName = t(monthNames[selectedMonth - 1]);
    const monthName = `${translatedMonthName} ${selectedYear}`;

    const selectedDateDisplay = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    const selectedDateEvents = getEventsForSelectedDate();
    const monthEvents = type === 'agenda' ? getEventsForMonth() : [];

    // Year selector (using lodash)
    const currentYearRange = _.range(selectedYear - 6, selectedYear + 6);

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        calendarCard: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#1E2936',
        },
        agendaItem: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        headerButton: {
            borderBottomColor: highlightColor,
        },
    });

    return (
        <View>
            {/* View Mode Toggle */}
            {(showMonthSelector || showYearSelector) && viewMode === 'month' && (
                <View style={styles.modeToggleContainer}>
                    {showMonthSelector && (
                        <TouchableOpacity
                            style={styles.modeButton}
                            onPress={() => setViewMode('monthSelector')}
                        >
                            <P themeToken="text01" themeShade={100}>
                                {monthName}
                            </P>
                        </TouchableOpacity>
                    )}
                    {showYearSelector && (
                        <TouchableOpacity
                            style={styles.modeButton}
                            onPress={() => setViewMode('year')}
                        >
                            <P themeToken="text01" themeShade={100}>
                                {selectedYear}
                            </P>
                            <Icon
                                name="chevron-down"
                                size={18}
                                color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Month Selector View */}
            {viewMode === 'monthSelector' && (
                <View style={[styles.yearSelectorContainer, themed.calendarCard]}>
                    <View style={styles.yearHeader}>
                        <P themeToken="text01" themeShade={100} style={styles.yearRangeText}>
                            {selectedYear}
                        </P>
                    </View>

                    <TouchableOpacity
                        style={styles.yearCloseButton}
                        onPress={() => setViewMode('month')}
                    >
                        <Icon
                            name="close"
                            size={24}
                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                        />
                    </TouchableOpacity>

                    <View style={styles.yearGrid}>
                        {[
                            { name: t('january') || 'January', num: 1 },
                            { name: t('february') || 'February', num: 2 },
                            { name: t('march') || 'March', num: 3 },
                            { name: t('april') || 'April', num: 4 },
                            { name: t('may') || 'May', num: 5 },
                            { name: t('june') || 'June', num: 6 },
                            { name: t('july') || 'July', num: 7 },
                            { name: t('august') || 'August', num: 8 },
                            { name: t('september') || 'September', num: 9 },
                            { name: t('october') || 'October', num: 10 },
                            { name: t('november') || 'November', num: 11 },
                            { name: t('december') || 'December', num: 12 },
                        ].map((month) => (
                            <TouchableOpacity
                                key={month.num}
                                style={[
                                    styles.yearCell,
                                    month.num === selectedMonth && [
                                        styles.yearCellSelected,
                                        { backgroundColor: highlightColor },
                                    ],
                                ]}
                                onPress={() => {
                                    setSelectedMonth(month.num);
                                    setViewMode('month');
                                    onMonthChange?.(month.num, selectedYear);
                                }}
                            >
                                <P
                                    themeToken={
                                        month.num === selectedMonth ? undefined : 'text01'
                                    }
                                    themeShade={month.num === selectedMonth ? undefined : 100}
                                    style={[
                                        styles.monthCellText,
                                        month.num === selectedMonth && styles.yearCellText
                                    ]}
                                >
                                    {month.name}
                                </P>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Year Selector View */}
            {viewMode === 'year' && (
                <View style={[styles.yearSelectorContainer, themed.calendarCard]}>
                    <View style={styles.yearHeader}>
                        <TouchableOpacity
                            onPress={() =>
                                setSelectedYear((prev) => prev - 12)
                            }
                        >
                            <Icon
                                name="chevron-left"
                                size={24}
                                color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                        <P themeToken="text01" themeShade={100} style={styles.yearRangeText}>
                            {currentYearRange[0]} - {currentYearRange[11]}
                        </P>
                        <TouchableOpacity
                            onPress={() =>
                                setSelectedYear((prev) => prev + 12)
                            }
                        >
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.yearCloseButton}
                        onPress={() => setViewMode('month')}
                    >
                        <Icon
                            name="close"
                            size={24}
                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                        />
                    </TouchableOpacity>

                    <View style={styles.yearGrid}>
                        {currentYearRange.map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[
                                    styles.yearCell,
                                    year === selectedYear && [
                                        styles.yearCellSelected,
                                        { backgroundColor: highlightColor },
                                    ],
                                ]}
                                onPress={() => handleYearSelect(year)}
                            >
                                <P
                                    themeToken={
                                        year === selectedYear ? undefined : 'text01'
                                    }
                                    themeShade={year === selectedYear ? undefined : 100}
                                    style={
                                        year === selectedYear && styles.yearCellText
                                    }
                                >
                                    {year}
                                </P>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Month View */}
            {viewMode === 'month' && (
                <View style={[styles.calendarContainer, themed.calendarCard]}>
                    {/* Month Navigation */}
                    <View style={styles.monthNavigation}>
                        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                            <Icon
                                name="chevron-left"
                                size={24}
                                color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                        <H5 style={styles.monthLabel}>{monthName}</H5>
                        <TouchableOpacity onPress={() => handleMonthChange(1)}>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Weekday Headers */}
                    <View style={styles.weekdayRow}>
                        {weekDays.map((day, index) => (
                            <View key={index}
                                //  style={styles.weekdayCell}
                                style={styles.dateCell}
                            >
                                <P themeToken="text02" themeShade={75}>
                                    {day}
                                </P>
                            </View>
                        ))}
                    </View>


                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                        {calendarDays.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dateCell,
                                    day.isSelected && [
                                        styles.selectedDate,
                                        { backgroundColor: highlightColor },
                                    ],
                                    day.isCurrentDay && styles.currentDayBorder,
                                ]}
                                onPress={() => handleDateSelect(day.day)}
                                disabled={day.day === 0}
                            >
                                {day.day > 0 && (
                                    <>
                                        <P
                                            style={[
                                                styles.dateText,
                                                day.isSelected && styles.dateTextSelected,
                                            ]}
                                            themeToken={
                                                day.isSelected ? undefined : 'text01'
                                            }
                                            themeShade={
                                                day.isSelected ? undefined : 100
                                            }
                                        >
                                            {day.day}
                                        </P>
                                        {day.hasEvent && (
                                            <View style={styles.eventDotContainer}>
                                                {day.eventColors.map((color, idx) => (
                                                    <View
                                                        key={idx}
                                                        style={[
                                                            styles.eventDot,
                                                            { backgroundColor: color },
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        )}
                                    </>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Agenda View */}
            {type === 'agenda' && viewMode === 'month' && (
                <ScrollView
                    style={styles.agendaContainer}
                    scrollEnabled={monthEvents.length > 3}
                    nestedScrollEnabled={true}
                >
                    {monthEvents.length > 0 ? (
                        <View style={styles.agendaList}>
                            <View style={styles.agendaHeaderSection}>
                                <H5 style={styles.agendaTitle}>
                                    {monthEvents.length}{' '}
                                    {monthEvents.length === 1 ? t('event_singular') : t('events_plural')}
                                </H5>
                                <P size={18} themeToken="text02" themeShade={75}>
                                    {t('in_month', { month: monthName })}
                                </P>
                            </View>
                            {
                                _(monthEvents).groupBy('date').map((data, title) => {
                                    console.log('data,title', data, title);
                                    const view = _.map(data, (event, idx) => {
                                        return (
                                            <View style={{ marginBottom: relativeHeight(5) }} key={event.id}>
                                                {renderAgendaItem ? (
                                                    renderAgendaItem(event, idx)
                                                ) : (
                                                    <View
                                                        style={[
                                                            styles.defaultAgendaItem,
                                                            {
                                                                borderLeftColor: event.color,
                                                            },
                                                        ]}
                                                    >
                                                        <View style={styles.eventTimeSection}>
                                                            <P
                                                                themeToken="text02"
                                                                themeShade={75}
                                                                style={styles.eventTime}
                                                            >
                                                                {event.startTime}
                                                            </P>
                                                            <P
                                                                themeToken="text02"
                                                                themeShade={50}
                                                                style={styles.eventDate}
                                                            >
                                                                {event.date}
                                                            </P>
                                                        </View>
                                                        <View style={styles.eventDetailsSection}>
                                                            <P
                                                                themeToken="text01"
                                                                themeShade={100}
                                                                style={styles.eventItemTitle}
                                                            >
                                                                {event.title}
                                                            </P>
                                                            <P
                                                                themeToken="text02"
                                                                themeShade={75}
                                                                style={styles.eventItemDescription}
                                                            >
                                                                {event.description}
                                                            </P>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    });

                                    return (
                                        <View key={title}>
                                            <P
                                                themeShade={theme.mode === ThemeMode.LIGHT ? 50 : 25}
                                                size={16}
                                                textAlign='left'
                                                style={{ marginVertical: relativeHeight(10) }}
                                            >
                                                {title}
                                            </P>
                                            {view}
                                        </View>
                                    )
                                }).value()
                            }
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon
                                name="calendar-blank"
                                size={48}
                                color={theme.text02 ? theme.text02(50) : '#9CA3AF'}
                            />
                            <P themeToken="text02" themeShade={75}>
                                {t('no_events_in_month', { month: monthName })}
                            </P>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Selected Date Agenda (Calendar Type) */}
            {type === 'calendar' && selectedDateEvents.length > 0 && viewMode === 'month' && (
                <View style={[styles.selectedDateAgendaContainer, themed.calendarCard]}>
                    <View style={styles.agendaHeader}>
                        <H5 style={styles.agendaHeaderTitle}>
                            {selectedDateDisplay}
                        </H5>
                        <View style={styles.eventCountBadge}>
                            <P
                                themeToken="text01"
                                themeShade={100}
                                style={styles.eventCountText}
                            >
                                {selectedDateEvents.length}{' '}
                                {selectedDateEvents.length === 1 ? t('event') : t('events')}
                            </P>
                        </View>
                    </View>

                    <View style={styles.eventsList}>
                        {selectedDateEvents.map((event, idx) => (
                            <TouchableOpacity
                                key={event.id}
                                style={[
                                    styles.eventItem, themed.agendaItem,
                                    { borderLeftColor: event.color },
                                    idx === selectedDateEvents.length - 1 &&
                                    styles.eventItemLast,
                                ]}
                            >
                                {renderAgendaItem ? (
                                    renderAgendaItem(event, idx)
                                ) : (
                                    <>
                                        <View style={styles.eventTimeSection}>
                                            <P
                                                themeToken="text02"
                                                themeShade={75}
                                                style={styles.eventTime}
                                            >
                                                {event.startTime}
                                            </P>
                                            <P
                                                themeToken="text02"
                                                themeShade={50}
                                                style={styles.eventDuration}
                                            >
                                                {event.duration}
                                            </P>
                                        </View>

                                        <View style={styles.eventDetailsSection}>
                                            <P
                                                themeToken="text01"
                                                themeShade={100}
                                                style={styles.eventItemTitle}
                                            >
                                                {event.title}
                                            </P>
                                            <P
                                                themeToken="text02"
                                                themeShade={75}
                                                style={styles.eventItemDescription}
                                            >
                                                {event.description}
                                            </P>
                                        </View>

                                        <Icon
                                            name="chevron-right"
                                            size={20}
                                            color={
                                                theme.text02
                                                    ? theme.text02(50)
                                                    : '#9CA3AF'
                                            }
                                        />
                                    </>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modeToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
    },
    calendarContainer: {
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    monthNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthLabel: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    weekdayRow: {
        flexDirection: 'row',
        marginBottom: 12,
        // gap: 4,
    },
    weekdayCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateCell: {
        width: '12.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 5,
        marginLeft: 4
    },
    currentDayBorder: {
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    selectedDate: {
        borderRadius: 8,
    },
    dateText: {
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateTextSelected: {
        color: '#FFFFFF',
    },
    eventDotContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 4,
        gap: 2,
    },
    eventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    yearSelectorContainer: {
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    yearHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    yearCloseButton: {
        position: 'absolute',
        bottom: 16,
        right: '50%',
        zIndex: 1,
        padding: 4,
    },
    yearRangeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    yearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    yearCell: {
        width: '30%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    yearCellSelected: {
        borderColor: '#3B82F6',
    },
    yearCellText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    monthCellText: {
        fontSize: 13,
        textAlign: 'center',
    },
    agendaContainer: {
        marginHorizontal: 16,
        marginBottom: 20,
        maxHeight: 400,
    },
    agendaList: {
        gap: 12,
    },
    agendaHeaderSection: {
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    agendaTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    selectedDateAgendaContainer: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 12,
        padding: 16,
    },
    agendaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    agendaHeaderTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    eventCountBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#3B82F6',
    },
    eventCountText: {
        fontSize: 12,
        fontWeight: '500',
    },
    eventsList: {
        gap: 12,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        gap: 12,
        marginBottom: 8,
    },
    eventItemLast: {
        marginBottom: 0,
    },
    defaultAgendaItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        gap: 12,
        marginBottom: 8,
    },
    eventTimeSection: {
        minWidth: 50,
        alignItems: 'flex-start',
    },
    eventTime: {
        fontSize: 13,
        fontWeight: '600',
    },
    eventDuration: {
        fontSize: 11,
        marginTop: 2,
    },
    eventDate: {
        fontSize: 11,
        marginTop: 2,
    },
    eventDetailsSection: {
        flex: 1,
        gap: 6,
    },
    eventItemTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    eventItemDescription: {
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
});

export default Calendar;
