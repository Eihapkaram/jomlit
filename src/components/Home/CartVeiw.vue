<template>
  <!-- ✅ إشعار احترافي مشابه Vuesax -->
  <transition name="snackbar-bounce">
    <v-snackbar
      v-if="snackbar"
      v-model="snackbar"
      timeout="2000"
      color="green"
      style="
        top: 70px;
        min-width: 320px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Segoe UI', sans-serif;
      "
      location="top right"
      multi-line
    >
      <!-- أيقونة نجاح -->
      <v-icon color="white">mdi-check-circle-outline</v-icon>
      <strong>{{ massage }}</strong>

      <!-- شريط تقدم أنيق -->
      <v-progress-linear
        indeterminate
        v-if="snackbar"
        color="rgba(255,255,255,0.8)"
        height="3"
        rounded
        style="margin-top: 8px; flex: 1"
      ></v-progress-linear>
    </v-snackbar>
  </transition>
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

  mounted() {
    this.Emitter.on("cart", (data) => {
      console.log(data);
      this.massage = data.textem2;
      this.snackbar = data.act || true;
    });
  },
};
</script>

<style scoped>
/* ===== حركة Bounce عند الظهور ===== */
.snackbar-bounce-enter-active {
  animation: bounce-in 0.5s ease forwards;
}
.snackbar-bounce-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) scale(1.02);
  }
  80% {
    transform: translateY(-5px) scale(0.99);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

/* تحسين النصوص */
.v-snackbar strong {
  font-weight: 600;
  font-size: 14px;
  color: white;
}

/* أيقونة الإشعار */
.v-snackbar v-icon {
  font-size: 20px;
}
</style>
