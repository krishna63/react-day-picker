import { isSameDay } from 'date-fns';

import {
  DayPickerProps,
  defaultModifiers,
  ModifiersStatus
} from '../DayPicker';
import { findModifiers } from './utils/findModifiers';
import { getModifiersFromProps } from './utils/getModifiersFromProps';
import { getOutsideModifier } from './utils/getOutsideModifier';
/**
 * Return the status of the modifiers for the given day,
 */
export function getModifiers(
  day: Date,
  currentMonth: Date,
  props: DayPickerProps
): ModifiersStatus {
  const modifiers: ModifiersStatus = {
    ...defaultModifiers
  };

  if (props.today !== 'off') {
    modifiers.today = isSameDay(props.today || new Date(), day);
  }

  const outsideModifier = getOutsideModifier(day, currentMonth);
  if (outsideModifier) {
    modifiers[outsideModifier] = true;
  }

  const isOutside = modifiers.beforemonth || modifiers.aftermonth;

  modifiers.hidden = isOutside && !props.showOutsideDays;
  modifiers.disabled = isOutside && !props.enableOutsideDaysClick;

  const modifiersFromProps = getModifiersFromProps(props);

  const foundModifiers = findModifiers(day, modifiersFromProps);
  foundModifiers.forEach((modifier) => (modifiers[modifier] = true));
  if (!props.onDayClick || modifiers.hidden || modifiers.disabled) {
    modifiers.interactive = false;
  }
  return modifiers;
}