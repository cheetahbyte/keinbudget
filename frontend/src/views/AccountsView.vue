<script setup lang="ts">
import { useAccountStore, useExternalAccountStore } from "@/stores/accounts";
import { RouterLink } from 'vue-router'

const accounts = useAccountStore();
const externalAccounts = useExternalAccountStore();
</script>

<template>
  <main>
    <h1>Accounts Page</h1>
    <RouterLink v-for="item in accounts.accounts" :to="'/accounts/' + item.id">{{ item.name }} - {{ item.id }}</RouterLink>
    <p v-for="item in externalAccounts.externalAccounts">{{ item.name }}</p>
  </main>
</template>