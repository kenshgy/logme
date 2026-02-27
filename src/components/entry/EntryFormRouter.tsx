import React from 'react';
import { ScrollView } from 'react-native';
import { Category, LogEntry } from '../../db/schema';
import { CheckForm } from './forms/CheckForm';
import { DurationForm } from './forms/DurationForm';
import { MealForm } from './forms/MealForm';
import { NumericForm } from './forms/NumericForm';
import { SleepForm } from './forms/SleepForm';
import { TextForm } from './forms/TextForm';
import { WeightForm } from './forms/WeightForm';
import { createEntry, updateEntry } from '../../db/queries/entries';
import { useUIStore } from '../../stores/uiStore';

interface Props {
  category: Category;
  existingEntry?: LogEntry;
  onDone: () => void;
}

export function EntryFormRouter({ category, existingEntry, onDone }: Props) {
  const { selectedDate } = useUIStore();

  const buildBase = (startedAt: Date) => ({
    categoryId: category.id,
    date: selectedDate,
    startedAt: startedAt.toISOString(),
  });

  const save = async (data: Record<string, any>) => {
    if (existingEntry) {
      await updateEntry(existingEntry.id, data);
    } else {
      await createEntry(data as any);
    }
    onDone();
  };

  const getInitialTime = () =>
    existingEntry?.startedAt ? new Date(existingEntry.startedAt) : undefined;

  switch (category.inputType) {
    case 'check':
      return (
        <ScrollView>
          <CheckForm
            initialTime={getInitialTime()}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ startedAt, note }) =>
              save({ ...buildBase(startedAt), note })
            }
          />
        </ScrollView>
      );

    case 'duration':
      return (
        <ScrollView>
          <DurationForm
            initialStart={getInitialTime()}
            initialEnd={existingEntry?.endedAt ? new Date(existingEntry.endedAt) : undefined}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ startedAt, endedAt, durationMin, note }) =>
              save({
                ...buildBase(startedAt),
                endedAt: endedAt.toISOString(),
                durationMin,
                note,
              })
            }
          />
        </ScrollView>
      );

    case 'sleep':
      return (
        <ScrollView>
          <SleepForm
            initialStart={getInitialTime()}
            initialEnd={existingEntry?.endedAt ? new Date(existingEntry.endedAt) : undefined}
            initialRating={existingEntry?.rating ?? 3}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ startedAt, endedAt, durationMin, rating, note }) =>
              save({
                ...buildBase(startedAt),
                endedAt: endedAt.toISOString(),
                durationMin,
                rating,
                note,
              })
            }
          />
        </ScrollView>
      );

    case 'numeric':
      return (
        <ScrollView>
          <NumericForm
            category={category}
            initialValue={existingEntry?.numericValue ?? undefined}
            initialTime={getInitialTime()}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ numericValue, startedAt, note }) =>
              save({ ...buildBase(startedAt), numericValue, note })
            }
          />
        </ScrollView>
      );

    case 'weight':
      return (
        <ScrollView>
          <WeightForm
            initialValue={existingEntry?.numericValue ?? undefined}
            initialUnit={(existingEntry?.textValue as 'kg' | 'lb') ?? 'kg'}
            initialTime={getInitialTime()}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ numericValue, textValue, startedAt, note }) =>
              save({ ...buildBase(startedAt), numericValue, textValue, note })
            }
          />
        </ScrollView>
      );

    case 'meal':
      return (
        <ScrollView>
          <MealForm
            initialText={existingEntry?.textValue ?? ''}
            initialCalories={existingEntry?.numericValue ?? undefined}
            initialTime={getInitialTime()}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ textValue, numericValue, startedAt, note }) =>
              save({ ...buildBase(startedAt), textValue, numericValue, note })
            }
          />
        </ScrollView>
      );

    case 'text':
      return (
        <ScrollView>
          <TextForm
            initialText={existingEntry?.textValue ?? ''}
            initialTime={getInitialTime()}
            initialNote={existingEntry?.note ?? ''}
            onSubmit={({ textValue, startedAt, note }) =>
              save({ ...buildBase(startedAt), textValue, note })
            }
          />
        </ScrollView>
      );

    default:
      return null;
  }
}
