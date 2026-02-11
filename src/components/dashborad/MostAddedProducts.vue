<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6"> Most Added Products To Cart </v-card-title>

      <v-data-table
        :headers="headers"
        :items="this.mostaddedproducts"
        class="elevation-1"
      >
        <template v-slot:item.count="{ item }">
          {{ item.count }} Times
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { mystore } from "@/store";
export default {
  name: "MostAddedProducts",

  data() {
    return {
      store: mystore(),

      headers: [
        { title: "Product", value: "titel" },
        { title: "Added Count", value: "count" },
      ],
    };
  },
  computed: {
    ...mapState(mystore, ["mostaddedproducts"]),
  },
  methods: {
    ...mapActions(mystore, ["mostAddedProducts"]),
  },

  mounted() {
    this.store.mostAddedProducts();
  },
};
</script>
