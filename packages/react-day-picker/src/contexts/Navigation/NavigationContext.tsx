import React, { createContext, ReactNode } from 'react';

import addMonths from 'date-fns/addMonths';
import isBefore from 'date-fns/isBefore';
import isSameMonth from 'date-fns/isSameMonth';

import { useDayPicker } from '../DayPicker';
import { useNavigationState } from './useNavigationState';
import { getDisplayMonths } from './utils/getDisplayMonths';
import { getNextMonth } from './utils/getNextMonth';
import { getPreviousMonth } from './utils/getPreviousMonth';

/** Represents the value of the {@link NavigationContext}. */
export interface NavigationContextValue {
  /** The month to display in the calendar. When `numberOfMonths` is greater than one, is the first of the displayed months. */
  currentMonth: Date;
  /** The months rendered by DayPicker. DayPicker can render multiple months via `numberOfMonths`. */
  displayMonths: Date[];
  /** Navigate to the specified month. */
  goToMonth: (month: Date) => void;
  /** Navigate to the specified date. */
  goToDate: (date: Date, refDate?: Date) => void;
  /** The next month to display. */
  nextMonth?: Date;
  /** The previous month to display. */
  previousMonth?: Date;
  /** Whether the given day is included in the displayed months. */
  isDateDisplayed: (day: Date) => boolean;
}

/**
 * The Navigation context shares details and methods to navigate the months in DayPicker.
 * Access this context from the {@link useNavigation} hook.
 */
export const NavigationContext = createContext<
  NavigationContextValue | undefined
>(undefined);

/** Provides the values for the {@link NavigationContext}. */
export function NavigationProvider(props: {
  children?: ReactNode;
}): JSX.Element {
  const dayPicker = useDayPicker();
  const [currentMonth, goToMonth] = useNavigationState();

  const displayMonths = getDisplayMonths(currentMonth, dayPicker);
  const nextMonth = getNextMonth(currentMonth, dayPicker);
  const previousMonth = getPreviousMonth(currentMonth, dayPicker);

  const isDateDisplayed = (date: Date) => {
    return displayMonths.some((displayMonth) =>
      isSameMonth(date, displayMonth)
    );
  };

  const goToDate = (date: Date, refDate?: Date) => {
    if (isDateDisplayed(date)) {
      return;
    }

    if (refDate && isBefore(date, refDate)) {
      goToMonth(addMonths(date, 1 + dayPicker.numberOfMonths * -1));
    } else {
      goToMonth(date);
    }
  };

  const value: NavigationContextValue = {
    currentMonth,
    displayMonths,
    goToMonth,
    goToDate,
    previousMonth,
    nextMonth,
    isDateDisplayed
  };

  return (
    <NavigationContext.Provider value={value}>
      {props.children}
    </NavigationContext.Provider>
  );
}
