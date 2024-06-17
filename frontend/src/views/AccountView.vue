<script setup lang="ts">
import { ref } from 'vue';
import { defineComponent, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/accounts';

const accounts = useAccountStore();
let account = ref<Account|null>(null);
let id = useRoute().params.id;

account = accounts.accounts.find((acc) => acc.id == id);

</script>
<template>
    <p> {{ account.name }} </p>
</template>