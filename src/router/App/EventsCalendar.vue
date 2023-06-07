<template>
    <div class="relative flex flex-col mb-20 gap-y-10 margins">

        <div class="flex items-center w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="text-3xl bi bi-house"></i>
                <span class="header">Évènements</span>
            </div>
        </div>

        <div class="rounded-[30px] w-full h-max bg-[#FAFAFA] p-5 shadow-card">
            <div class="flex gap-x-10 overflow-auto snap-x snap-mandatory">
                <div v-if="calendar" v-for="data in calendar.data" class="min-w-full snap-center flex flex-col gap-y-10">
                    <div>
                        <span class="text-[27px]">{{ getFrenchDate(data.month, data.year) }}</span>
                    </div>

                    <div class="grid grid-cols-7 gap-1 place-items-center [&>span]:aspect-square [&>span]:p-2 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:text-center [&>span]:w-full [&>span]:rounded-xl [&>span]:text-lg">
                        <div v-for="day in days" class="text-center pb-5 font-light text-[#A0A0A0]">{{ day }}</div>

                        <span v-for="day in data.previous" class="text-gray-400">{{ day }}</span>
                        <span v-for="day in data.current" @click="handleSelect(day, data.month, data.year)" :style="getStyles(data, day)">{{ day }}</span>
                        <span v-for="day in data.next" class="text-gray-400">{{ day }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CSSProperties, StyleValue, onMounted, ref } from "vue";
import UtilsApi from "../../utils/UtilsApi";
import UtilsAuth from "../../utils/UtilsAuth";
import UtilsZip from "../../utils/UtilsZip";
import { IEvent } from "../../types/Event";

// ########################################### VARIABLES ###########################################

/**
 * Interface that represents the calendar.
 * It contains the data of the calendar, the selected date and the current date.
 */
interface ICalendar {
    data: IDataCalendar[],
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
interface IDataCalendar {
    previous: number[];
    current: number[];
    next: number[];

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

const isSelected = (data: IDataCalendar, day: number): boolean => {
    return data.month === calendar.value.selected.month && data.year === calendar.value.selected.year && day === calendar.value.selected.day;
};

const isCurrentDay = (data: IDataCalendar, day: number): boolean => {
    return data.month === calendar.value.current.month && data.year === calendar.value.current.year && day === calendar.value.current.day;
};

const getStyles = (data: IDataCalendar, day: number) => {
    const styles: CSSProperties = {};

    if (isSelected(data, day)) {
        styles.backgroundColor = "#166CF7";
        styles.color = "white";
    }

    return styles;
};

// ########################################### FUNCTIONS ###########################################

onMounted(() => {
    loadNextMonths(3);
});

const getFrenchDate = (month: number, year: number) => {
    return new Date(year, month - 1, 1).toLocaleString("fr-FR", { month: "long" }).charAt(0).toUpperCase() + new Date(year, month - 1, 1).toLocaleString("fr-FR", { month: "long" }).slice(1) + ", " + year;
};

const loadNextMonths = (nb: number) => {
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

const generateCalendar = (year: number, month: number): IDataCalendar => {
    const calendar: IDataCalendar = {
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
        calendar.previous.push(i);
    }

    // Add the days from the current month
    for (let i = 1; i <= currentMonthDays; i++) {
        calendar.current.push(i);
    }

    // Add the remaining days to complete the grid up to 42 days
    const remainingDays = 42 - (calendar.previous.length + calendar.current.length);
    for (let i = 1; i <= remainingDays; i++) {
        calendar.next.push(i);
    }

    return calendar;
}

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
}

// ########################################### HANDLERS ###########################################

const handleSelect = async (day: number, month: number, year: number) => {
    // Update selected date
    calendar.value.selected = {
        day: day,
        month: month,
        year: year
    };

    // Get events
    const events = await getEvents(day, month, year);

    console.log(events);
}

</script>