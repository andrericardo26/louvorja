<template>
  <v-app-bar id="header-bar" tile flat color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$appdata.toogle('menu.show')" />
    </template>
    <v-app-bar-title>{{ $t("app.name") }}</v-app-bar-title>
    <v-spacer />

    <v-tooltip v-if="remote" :text="remote_url">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon="mdi-remote" @click="openRemote()" />
      </template>
    </v-tooltip>

    <v-btn
      :icon="layout == 'apps' ? 'mdi-tab' : 'mdi-apps'"
      @click="changeLayout()"
    />
    <LanguageSelector />
  </v-app-bar>
</template>

<script>
import LanguageSelector from "@/components/LanguageSelector.vue";

export default {
  name: "HeaderLayout",
  components: {
    LanguageSelector,
  },
  computed: {
    layout() {
      return this.$userdata.get("layout");
    },
    remote() {
      return this.$userdata.get("remote.is_connected");
    },
    remote_url() {
      return this.$userdata.get("remote.url");
    },
  },
  methods: {
    changeLayout() {
      if (this.layout == "apps") {
        this.$userdata.set("layout", "ribbon");
      } else {
        this.$userdata.set("layout", "apps");
      }
    },
    openRemote() {
      this.$modules.open("remote_control");
    },
  },
};
</script>

<style scoped>
#header-bar {
  position: initial !important;
  flex: 0 !important;
}
</style>
