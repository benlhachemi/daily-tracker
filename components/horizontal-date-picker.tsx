'use client'

// ============================================
// Imports
// ============================================
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================
// Types
// ============================================
interface HorizontalDatePickerProps {
  className?: string;

  /** The currently selected date (single date only) */
  selected?: Date;
  /** Callback fired when the user selects a date */
  onSelect?: (date: Date) => void;

  /**
   * Optional custom date range to display.
   * Defaults to today − 7 through today + 30 when omitted.
   * Both start and end must be provided together.
   */
  dateRange?: { start: Date; end: Date };

  /** Dates before this are visible but disabled (not clickable) */
  minDate?: Date;
  /** Dates after this are visible but disabled (not clickable) */
  maxDate?: Date;
}

// ============================================
// Helpers
// ============================================
const DAY_LABELS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (minDate) {
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (d < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (d > max) return true;
  }
  return false;
}

function generateDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function defaultDateRange(): { start: Date; end: Date } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 7);
  const end = new Date(today);
  end.setDate(today.getDate() + 30);
  return { start, end };
}

// ============================================
// Main Component
// ============================================
function HorizontalDatePicker({
  className,
  selected,
  onSelect,
  dateRange,
  minDate,
  maxDate,
}: HorizontalDatePickerProps) {
  const [api, setApi] = useCarouselApi();

  const range = dateRange ?? defaultDateRange();
  const dates = useMemo(() => generateDateRange(range.start, range.end), [
    range.start.toDateString(),
    range.end.toDateString(),
  ]);

  const selectedIndex = useMemo(() => {
    if (!selected) return -1;
    return dates.findIndex((d) => isSameDay(d, selected));
  }, [dates, selected]);

  // Scroll carousel to the selected date whenever it changes
  useEffect(() => {
    if (!api || selectedIndex === -1) return;
    api.scrollTo(selectedIndex, false);
  }, [api, selectedIndex]);

  const handleSelect = useCallback(
    (date: Date) => {
      if (isDisabled(date, minDate, maxDate)) return;
      onSelect?.(date);
    },
    [onSelect, minDate, maxDate]
  );

  return (
    <Card className={cn("relative py-root-xs z-30", className)}>
      <CardContent className="px-px!">
        <Carousel setApi={setApi} className="relative">
          <div className="absolute top-2/4 -translate-y-2/4 left-root-sm z-40">
            <Button
              size='icon-sm'
              variant='secondary'
              className=''
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft />
            </Button>
          </div>

          <div className="absolute top-2/4 -translate-y-2/4 right-root-sm z-40">
            <Button
              size='icon-sm'
              variant='secondary'
              className=''
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight />
            </Button>
          </div>

          <CarouselContent className="mr-root-2xl ml-root-2xl">
            {dates.map((date, index) => {
              const disabled = isDisabled(date, minDate, maxDate);
              const isSelected = selected ? isSameDay(date, selected) : false;
              const today = isToday(date);

              return (
                <CarouselItem
                  key={date.toISOString()}
                  className={cn(
                    "basis-16 h-16 p-0",
                    `stagger-horizontal-${Math.min(index + 1, 5)}`
                  )}
                >
                  <Button
                    className={cn(
                      "relative flex flex-col items-center justify-center w-full h-full rounded-xl",
                      disabled && "pointer-events-none opacity-35"
                    )}
                    variant={isSelected ? "secondary" : "ghost"}
                    onClick={() => handleSelect(date)}
                    disabled={disabled}
                    aria-pressed={isSelected}
                    aria-label={date.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  >
                    <div
                      className={cn(
                        "text-xs uppercase font-semibold tracking-tighter",
                        !isSelected && "text-muted-foreground"
                      )}
                    >
                      {DAY_LABELS[date.getDay()]}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        !isSelected && "text-muted-foreground"
                      )}
                    >
                      {date.getDate()}
                    </div>

                    {/* Today indicator dot */}
                    {today && !isSelected && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </CardContent>

      {/* Fade Effect - Left */}
      <div className="absolute top-0 left-0 h-full w-20 bg-linear-to-r from-card/80 to-transparent pointer-events-none" />

      {/* Fade Effect - Right */}
      <div className="absolute top-0 right-0 h-full w-20 bg-linear-to-l from-card/80 to-transparent pointer-events-none" />

      {/* Blur effect - Left */}
      <ProgressiveBlur
        direction="left"
        className="w-12"
        preset="md"
      />

      {/* Blur effect - Right */}
      <ProgressiveBlur
        direction="right"
        className="w-12"
        preset="md"
      />
    </Card>
  );
}

// ============================================
// Hook — carousel API ref
// ============================================
function useCarouselApi(): [CarouselApi | undefined, (api: CarouselApi) => void] {
  const apiRef = useRef<CarouselApi | undefined>(undefined);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const setApi = useCallback((api: CarouselApi) => {
    apiRef.current = api;
    forceRender();
  }, []);

  return [apiRef.current, setApi];
}

// ============================================
// Missing import — add to top of file
// ============================================
// import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
// (replace the existing React import line with this one)

// ============================================
// Exports
// ============================================
export { HorizontalDatePicker };
export type { HorizontalDatePickerProps };