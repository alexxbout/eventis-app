<template>
    <div class="relative flex flex-col mb-20 gap-y-10 margins">

        <div class="flex items-center w-full gap-y-2">
            <div class="flex gap-x-[15px] items-center justify-center w-max">
                <i class="text-3xl bi bi-bell"></i>
                <span class="header">Notifications</span>
            </div>
        </div>

        <div class="flex flex-col w-full h-max">
            <span class="text-xl font-medium">Demandes d’amis</span>
        </div>

        <!-- Demandes d'amis -->
        <div class="flex flex-col gap-y-[10px]">
            <!-- <UserCard v-for="user in requesters" :data="user" :style="{ shape: EUserCardStyle.FRIEND_PROFILE }" /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { INotification } from '../../types/Notification';
import UtilsApi from '../../utils/UtilsApi';
import UtilsAuth from '../../utils/UtilsAuth';
import UserCard from '../../components/UserCard.vue';
import { IUser } from '../../types/User';

const notifications = ref<INotification | null>(null);

const user = UtilsAuth.getCurrentUser();

const requesters = ref<IUser[]>([]);

onMounted(async () => {
    if (user) {
        const data = await UtilsApi.getNotifications(user.id);

        console.log(data);

        if (data) {
            notifications.value = data;

            console.log(notifications.value);

            for (const notif of notifications.value.friend_request) {
                if (notif.user) {
                    requesters.value.push(notif.user);
                }
            }
        }
    }
});

</script>