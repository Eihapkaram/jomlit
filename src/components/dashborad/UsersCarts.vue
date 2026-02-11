<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6"> Users Carts </v-card-title>

      <v-expansion-panels>
        <v-expansion-panel v-for="user in store.userscarts" :key="user.id">
          <v-expansion-panel-title>
            {{ user.name }} ({{ user.email }})
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-list>
              <v-list-item
                v-for="item in user.getcart.pro_c_item"
                :key="item.id"
              >
                <v-list-item-title>
                  {{ item.product.titel }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  Quantity : {{ item.quantity }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { mystore } from "/src/store/index";

const store = mystore();

onMounted(() => {
  store.usersCarts();
});
</script>
