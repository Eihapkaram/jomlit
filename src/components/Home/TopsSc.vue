<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <div id="full-width-container">
      <v-container id="topcato" fluid>
        <h2 class="section-title">أقسام مميزة</h2>
        <br />
        <v-banner id="bann" style="position: relative">
          <v-row class="d-flex justify-center align-center" dense>
            <!-- عرض الأقسام -->
            <div
              id="catgoryitem"
              v-for="(item, i) in displayedCategories"
              :key="i"
            >
              <v-card
                @click="
                  $router.push({
                    name: 'catigoryPage',
                    params: { idp: item.id, catigory: item.slug },
                  })
                "
                id="catgoryitem"
                elevation="4"
              >
                <img
                  @click="
                    $router.push({
                      name: 'catigoryPage',
                      params: { catigory: item.slug },
                    })
                  "
                  id="image"
                  :src="domin + item.img"
                  loading="lazy"
                  :alt="item.slug"
                />
                <h2 style="margin-block: 5px">{{ item.slug }}</h2>
              </v-card>
            </div>

            <!-- كارت عرض المزيد -->
            <div id="catgoryitem">
              <v-card
                id="catgoryitem"
                class="d-flex flex-column align-center justify-center"
                elevation="4"
                @click="toggleShowMore"
                style="cursor: pointer; height: 200px; width: 160px"
              >
                <v-icon size="60" color="#c79a00">
                  {{
                    showAll
                      ? "mdi-minus-circle-outline"
                      : "mdi-plus-circle-outline"
                  }}
                </v-icon>
                <span
                  style="
                    margin-top: 10px;
                    font-weight: 600;
                    color: #c79a00;
                    font-size: 1.1rem;
                  "
                >
                  {{ showAll ? "عرض أقل" : "عرض المزيد" }}
                </span>
              </v-card>
            </div>
          </v-row>
        </v-banner>
      </v-container>
    </div>
  </v-lazy>
</template>

<script>
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";

export default {
  data() {
    return {
      showAll: false,
    };
  },
  computed: {
    ...mapState(mystore, ["page", "domin"]),
    displayedCategories() {
      return this.showAll ? this.page : this.page.slice(0, 6);
    },
  },
  methods: {
    ...mapActions(mystore, ["Pages"]),
    toggleShowMore() {
      this.showAll = !this.showAll;
    },
  },
  async mounted() {
    await this.Pages();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

* {
  font-family: "Cairo", sans-serif;
}

#full-width-container {
  width: 100vw;
}

#topcato {
  direction: rtl;
  margin: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #faf9f6;
  padding: 30px 20px;
  border-radius: 20px;
  width: 100%;
}

#bann {
  direction: rtl;
  width: 100%;
  background-color: #faf9f6;
  padding: 20px 0;
}

#catgoryitem {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-title {
  color: #c79a00;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #c79a00;
  display: inline-block;
  padding-bottom: 0.3rem;
  font-family: "Cairo", sans-serif;
}

#image {
  cursor: pointer;
  height: 160px;
  width: 160px;
  object-fit: contain;
  top: 10px;
}

#image:hover {
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
}

/* Tablet */
@media (max-width: 991px) {
  #bann {
    width: 90%;
  }
  #catgoryitem {
    margin: 15px;
  }
}

/* Mobile */
@media (max-width: 500px) {
  #bann {
    width: 100%;
    padding: 15px 0;
  }
  #catgoryitem {
    margin: 10px auto;
  }
  #catgoryitem span {
    font-size: 1rem;
  }
}
</style>
