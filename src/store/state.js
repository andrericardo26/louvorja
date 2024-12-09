export default {
  is_dev: false,
  is_dark: false,
  is_popup: false,
  is_mobile: false,
  is_desktop: false,
  is_online: false,
  popup: null,
  popup_module: null,
  import_modules: false,
  modules: {},
  module_group: {
    musics: {
      title: "module_group.musics.title",
      modules: ["musics", "hymnal", "hymnal_1996"],
    },
    bible: {
      title: "module_group.bible.title",
      modules: [],
    },
    utilities: {
      title: "module_group.utilities.title",
      modules: [],
    },
  },
  menu: {
    show: false,
    modules: [],
  },
  tray_area: {
    modules: [],
  },
  languages: {
    pt: { name: "Português", flag: "br" },
    es: { name: "Español", flag: "es" },
  },
  alert: {
    show: false,
    title: "",
    text: "",
    error: "",
    color: "",
    buttons: [],
    value: "",
    translate: false,
  },
  user_data: {
    theme: "",
    language: "",
    modules: {
      musics: {
        search: {
          name: true,
          lyric: false,
          album: false,
        },
        filter: {
          instrumental_music: false,
        },
      },
      media: {
        lazy_load: true,
      },
    },
  },
};
