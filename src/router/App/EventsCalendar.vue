<template>
    <div class="relative flex flex-col mb-20 gap-y-10 margins">

        <div class="flex items-center w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="text-3xl bi bi-house"></i>
                <span class="header">Évènements</span>
            </div>
        </div>

        <div class="rounded-[30px] w-full h-max flex flex-col bg-[#FAFAFA] p-5 gap-y-10">
            <div>
                <span class="text-[27px]">{{ currentMonth }}</span>
            </div>

            <div v-if="calendar" v-for="data in calendar.data" class="grid grid-cols-7 gap-1 place-items-center [&>span]:aspect-square [&>span]:p-2 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:text-center [&>span]:w-full [&>span]:rounded-xl [&>span]:text-lg">
                <div v-for="day in days" class="text-center pb-5 font-light text-[#A0A0A0]">{{ day }}</div>

                <span v-for="day in data.previous" class="text-gray-400">{{ day }}</span>
                <span v-for="day in data.current" @click="handleSelect(day, data.month, data.year)" :class="calendar.selected.month == data.month && calendar.selected.day == day ? 'bg-primary text-white' : ''">{{ day }}</span>
                <span v-for="day in data.next" class="text-gray-400">{{ day }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// ########################################### VARIABLES ###########################################

// ########################################### FUNCTIONS ###########################################

interface ICalendar {
    data: IDataCalendar[],
    selected: {
        day: number;
        month: number;
        year: number;
    },

    current: number;
};

interface IDataCalendar {
    previous: number[];
    current: number[];
    next: number[];

    month: number;
    year: number;
};

const currentMonth = ref(new Date().toLocaleString("fr-FR", { month: "long" }).charAt(0).toUpperCase() + new Date().toLocaleString("fr-FR", { month: "long" }).slice(1) + ", " + new Date().getFullYear());

const days = ref(["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"]);

const calendar = ref<ICalendar>({
    data: [],
    selected: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    },
    current: new Date().getDate()
});

onMounted(() => {
    const partialCalendar = generateCalendar(new Date().getFullYear(), new Date().getMonth() + 1);

    calendar.value.data.push(partialCalendar);
});

function getNbNextMonths(nb: number) {
    const nextMonths = [];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < nb; i++) {
        if (currentMonth + i > 12) {
            nextMonths.push(generateCalendar(currentYear + 1, currentMonth + i - 12));
        } else {
            nextMonths.push(generateCalendar(currentYear, currentMonth + i));
        }
    }

    return nextMonths;
}

function generateCalendar(year: number, month: number): IDataCalendar {
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
    const startDay = previousMonthDays - (7 - firstDay) + 1;

    // Ajouter les jours du mois précédent
    for (let i = startDay; i <= previousMonthDays; i++) {
        calendar.previous.push(i);
    }

    // Ajouter les jours du mois courant
    for (let i = 1; i <= currentMonthDays; i++) {
        calendar.current.push(i);
    }

    // Ajouter les jours pour compléter la grille jusqu'à 42 jours
    const remainingDays = 42 - (calendar.previous.length + calendar.current.length);
    for (let i = 1; i <= remainingDays; i++) {
        calendar.next.push(i);
    }

    return calendar;
}

const handleSelect = (day: number, month: number, year: number) => {
    if (calendar.value) {
        calendar.value.selected = {
            day: day,
            month: month,
            year: year
        };

        // API CALL
    }
};

</script>