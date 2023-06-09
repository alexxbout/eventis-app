<template>
    <div class="rounded-[30px] w-full h-max bg-[#FAFAFA] p-5">
        <div class="flex gap-x-10 overflow-auto snap-x snap-mandatory">
            <div v-if="calendar" v-for="data in calendar.data" class="min-w-full snap-center flex flex-col gap-y-10">
                <div>
                    <span class="text-[27px]">{{ getFrenchDate(data.month, data.year) }}</span>
                </div>

                <div class="grid grid-cols-7 gap-1 place-items-center [&>span]:aspect-square [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:text-center [&>span]:w-full [&>span]:rounded-xl [&>span]:text-lg">
                    <div v-for="customDay in days" class="text-center pb-5 font-light text-[#A0A0A0]">{{ customDay }}</div>

                    <span v-for="customDay in data.previous" class="text-gray-400">{{ customDay.day }}</span>
                    <span v-for="customDay in data.current" @click="handleSelect(customDay.day, data.month, data.year, customDay.hasEvents)" :style="getStyles(data, customDay)">{{ customDay.day }}</span>
                    <span v-for="customDay in data.next" class="text-gray-400">{{ customDay.day }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="rounded-[30px] w-full h-max bg-[#FAFAFA] p-3 flex flex-col gap-y-5">
        <EventCard v-for="event in events" :data="event" :hide-image="true" />
    </div>
</template>

<script setup lang="ts">
import { CSSProperties, onMounted, ref } from "vue";

import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";
import UtilsZip from "../../utils/UtilsZip";

import type { IEvent } from "../../types/Event";

import EventCard from "../../components/EventCard.vue";

// ########################################### VARIABLES ###########################################

/**
 * Interface that represents a day of the calendar.
 */
interface ICustomDay {
    day: number;
    hasEvents: boolean;
}

/**
 * Interface that represents the calendar.
 * It contains the data of the calendar, the selected date and the current date.
 */
interface ICalendar {
    data: ICustomMonth[],
    selected: {
        day: number;
        month: number;
        year: number;
    },

    current: {
        day: number;
        month: number;
        year: number;
    }
};

/**
 * Interface that represents one month of the calendar.
 * It contains the days of the previous month, the current month and the next month.
 * It also contains the month and the year.
 */
interface ICustomMonth {
    previous: ICustomDay[];
    current: ICustomDay[];
    next: ICustomDay[];

    month: number;
    year: number;
};

const user = UtilsAuth.getCurrentUser();

const days = ref(["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"]);

const nearbyZips = ref<string[]>([]);

const calendar = ref<ICalendar>({
    data: [],
    selected: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    },
    current: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }
});

const isSelected = (data: ICustomMonth, day: number): boolean => {
    return data.month === calendar.value.selected.month && data.year === calendar.value.selected.year && day === calendar.value.selected.day;
};

// const isCurrentDay = (data: ICustomMonth, day: number): boolean => {
//     return data.month === calendar.value.current.month && data.year === calendar.value.current.year && day === calendar.value.current.day;
// };

const getStyles = (data: ICustomMonth, customDay: ICustomDay) => {
    const styles: CSSProperties = {};

    if (customDay.hasEvents) {
        styles.color = "#166CF7";
        styles.fontWeight = "bold";
    }

    if (isSelected(data, customDay.day)) {
        styles.backgroundColor = "#166CF7";
        styles.color = "white";
        styles.fontWeight = "normal";
    }

    return styles;
};

const events = ref<IEvent[]>([]);

const nbLoadedMonths = 5;

const eventsOnDates = ref<{ year: Number, month: Number, date: Number }[]>([]);

// ########################################### FUNCTIONS ###########################################

onMounted(async () => {
    await loadEventsDates();

    await selectDate(calendar.value.selected.day, calendar.value.selected.month, calendar.value.selected.year, true);

    buildNextMonths(nbLoadedMonths);
});

const buildNextMonths = (nb: number) => {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;

    for (let i = 0; i < nb; i++) {
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }

        const partialCalendar = generateCalendar(currentYear, currentMonth);
        calendar.value.data.push(partialCalendar);

        currentMonth++;
    }
};

/**
 * Genreate the days of given month and year.
 * @param year 
 * @param month
 * @returns the days of the month and the year given.
 */
const generateCalendar = (year: number, month: number): ICustomMonth => {
    const calendar: ICustomMonth = {
        previous: [],
        current: [],
        next: [],
        month: month,
        year: year
    };

    const firstDay = new Date(year, month - 1, 1).getDay();
    const previousMonthDays = new Date(year, month - 1, 0).getDate();
    const currentMonthDays = new Date(year, month, 0).getDate();
    const startDay = (firstDay === 0 ? 6 : firstDay - 1);

    // Add the days from the previous month
    for (let i = previousMonthDays - startDay + 1; i <= previousMonthDays; i++) {
        calendar.previous.push({
            day: i,
            hasEvents: false
        });
    }

    // Add the days from the current month
    for (let i = 1; i <= currentMonthDays; i++) {
        calendar.current.push({
            day: i,
            hasEvents: eventsOnDates.value.some((date) => date.year === year && date.month === month && date.date === i)
        });
    }

    // Add the remaining days to complete the grid up to 42 days
    const remainingDays = 42 - (calendar.previous.length + calendar.current.length);
    for (let i = 1; i <= remainingDays; i++) {
        calendar.next.push({
            day: i,
            hasEvents: false
        });
    }

    return calendar;
};

const getEvents = async (day: number, month: number, year: number): Promise<IEvent[]> => {
    const events: IEvent[] = [];

    const date = new Date(year, month - 1, day);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 120);

    const time = date.getTime();

    if (user!.idFoyer) {
        const foyerRequest = await UtilsApi.getFoyerById(user!.idFoyer);

        if (foyerRequest) {
            const localZip = foyerRequest.zip.substring(0, 2);

            // Get events of local zip
            const eventsRequest = await UtilsApi.getEventsByDateAndZip(time, parseInt(localZip));

            if (eventsRequest) {
                events.push(...eventsRequest);
            }

            // Get nearby zips
            nearbyZips.value = UtilsZip.getNearbyZips(parseInt(localZip));

            // Get events of nearby zips
            if (nearbyZips.value.length > 0) {
                for (const zip of nearbyZips.value) {
                    const eventsRequest = await UtilsApi.getEventsByDateAndZip(time, parseInt(zip));

                    if (eventsRequest) {
                        events.push(...eventsRequest);
                    }
                }
            }
        }
    }

    return events;
};

const loadEventsDates = async () => {
    const dates = await UtilsApi.getEventsForTime(nbLoadedMonths);

    for (const date of dates) {
        const dateSplit = date.split("-");

        eventsOnDates.value.push({
            year: parseInt(dateSplit[0]),
            month: parseInt(dateSplit[1]),
            date: parseInt(dateSplit[2])
        });
    }
};

const getFrenchDate = (month: number, year: number) => {
    return new Date(year, month - 1, 1).toLocaleString("fr-FR", { month: "long" }).charAt(0).toUpperCase() + new Date(year, month - 1, 1).toLocaleString("fr-FR", { month: "long" }).slice(1) + ", " + year;
};

// ########################################### HANDLERS ###########################################

const selectDate = async (day: number, month: number, year: number, hasEvents: Boolean) => {
    // Update selected date
    calendar.value.selected = {
        day: day,
        month: month,
        year: year
    };

    // Get events
    if (hasEvents) {
        events.value = await getEvents(day, month, year);
    } else {
        events.value = [];
    }
};

const handleSelect = async (day: number, month: number, year: number, hasEvents: Boolean) => {
    await selectDate(day, month, year, hasEvents);
};

</script>