<template>
  <!-- ✅ تنبيه عند الإرسال -->
  <v-snackbar
    v-model="snackbar"
    timeout="1500"
    color="green"
    style="top: 70px"
    location="top right"
  >
    <strong>{{ massage }}</strong>
    <v-progress-linear indeterminate v-if="snackbar"></v-progress-linear>
  </v-snackbar>
</template>
<script>
export default {
  inject: ["Emitter"],
  data() {
    return {
      massage: "",
      snackbar: false,
    };
  },

  async mounted() {
    this.Emitter.on("cart", (data) => {
      console.log(data);
      this.massage = data.textem2;
      this.snackbar = data.act;

      if (localStorage.getItem("token")) {
        this.close = true;
      }
    });
  },
};
</script>
