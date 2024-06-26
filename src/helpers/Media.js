import store from '../store'
const DevTools = require("./DevTools");
const Musics = require("../controllers/Musics.js");
const Alert = require("./Alert");
const DateTime = require("./DateTime");
const Media = require("./Media");
const Screen = require("./Screen");
const Dialog = require("@/helpers/Dialog");

export function open(obj, options = {}) {
    this.close(options);

    let id_music;

    if (typeof (obj) === "object") {
        id_music = obj.id_music;
        store.state.media.track = obj.track || 0;
        if (typeof (obj.album) === "object") {
            store.state.media.album.id_album = obj.album.id_album;
            store.state.media.album.name = obj.album.name;
            store.state.media.album.url_image = obj.album.url_image;
            store.state.media.album.image_position = obj.album.image_position;
            store.state.media.album.color = obj.album.color;
        } else {
            store.state.media.album.name = obj.album;
        }
    } else {
        id_music = obj;
    }

    store.state.media.audio = (options.audio || 0);
    /*
     * options.audio:
     * 0 = sem audio
     * 1 = cantado
     * 2 = playback
     */

    let audio = this.getElement();

    this.pause(true);
    audio.currentTime = 0;

    store.state.media.show = options.show == undefined ? true : options.show;
    store.state.media.loading = true;
    store.state.media.id_music = id_music;
    store.state.media.has_music = true;

    Musics.show(id_music, (resp, data) => {
        if (resp) {
            if (store.state.media.audio == 1) {
                store.state.media.file = data.url_music;
                data.lyric.map(item => { item.time = DateTime.toSeconds(item.time) || 0; });
            } else if (store.state.media.audio == 2) {
                store.state.media.file = data.url_instrumental_music;
                data.lyric.map(item => { item.time = DateTime.toSeconds(item.instrumental_time) || DateTime.toSeconds(item.time) || 0; });
            } else {
                store.state.media.file = "";
                data.lyric.map(item => { item.time = 0; });
            }
            store.state.media.music = data;

            this.slides();

            if (store.state.media.file !== "" && store.state.media.audio > 0) {
                if ((store.state.desktop && !store.state.data.online) || store.state.data.options.audio.lazy_load) {

                    audio.src = store.state.media.file;
                    audio.load();
                    this.play();

                } else {
                    let self = this;
                    let request = new XMLHttpRequest();
                    try {
                        request.open("GET", store.state.media.file, true);
                    } catch (error) {
                        Dialog.error("Erro ao carregar áudio!", error + "<br><br>A música será carregada sem áudio.", function (resp) {
                            Media.open(store.state.media, { audio: 0 });
                        });
                    }

                    request.responseType = "blob";
                    request.onload = function () {
                        if (this.status == 200) {
                            audio.src = URL.createObjectURL(this.response);
                            audio.load();
                            self.play();
                        }
                    }
                    request.onerror = function () {
                        Dialog.error("Erro ao carregar áudio!", "Ocorreu um erro ao tentar carregar este áudio. A música será carregada sem áudio.", function (resp) {
                            Media.open(store.state.media, { audio: 0 });
                        });
                    };

                    request.send();

                }

            } else {
                store.state.media.audio = 0;
                this.slide();
            }

        } else {
            Alert.error(data)
        }

        store.state.media.loading = false;
    });
}
export function close(options) {
    let audio = this.getElement();
    this.pause(true);
    audio.setAttribute("src", "");
    store.state.media.is_paused = true;
    store.state.media.show = false;
    store.state.media.has_music = false;
    store.state.media.current_time = 0;
    store.state.media.duration = 0;
    store.state.media.progress = 0;
    store.state.media.buffered = 100;
    store.state.media.file = "";

    store.state.media.slides = [];
    store.state.media.slide.index = -1;
    store.state.media.slide.number = 0;
    store.state.media.slide.count = 0;
    store.state.media.slide.start_time = 0;
    store.state.media.slide.end_time = 0;
    store.state.media.slide.url_image = "";
    store.state.media.slide.image_position = 5;
    store.state.media.slide.lyric = "";
    store.state.media.slide.progress = 0;

    if (!options || !options.album) {
        //Não é mesmo álbum. Reseta informações
        store.state.media.track = 0;

        store.state.media.album.id_album = 0;
        store.state.media.album.name = "";
        store.state.media.album.url_image = "";
        store.state.media.album.image_position = 5;
        store.state.media.album.color = "";
    }

}
export function closeDialog() {
    let self = this;
    Dialog.yesno("Fechar música", "Deseja fechar esta música?", (resp) => {
        if (resp == "yes") {
            self.close();
        }
    });
}
export function show(bool) {
    store.state.media.show = bool === undefined ? !store.state.media.show : bool;
}
export function play() {
    this.pause(false);
}
export function pause(bool) {
    let audio = this.getElement();

    store.state.media.is_paused = bool === undefined ? !store.state.media.is_paused : bool;

    if (store.state.media.is_paused) {
        audio.pause();
    } else {
        window.playResult = audio.play();
        playResult.catch(e => {
            window.playResultError = e;
            Dialog.error("Erro ao carregar áudio!", e + "<br><br>A música será carregada sem áudio.", function (resp) {
                Media.open(store.state.media, { audio: 0 });
            });
        })
    }
}
export function restart() {
    this.goTo(0);
}
export function volume(val) {
    let audio = this.getElement();
    if (val == undefined) {
        val = (store.state.media.volume <= 0 ? 100 : 0);
    }
    audio.volume = val / 100;
    store.state.media.volume = val;
}
export function firstSlide() {
    this.goToSlide(0);
}
export function prevSlide() {
    this.goToSlide(store.state.media.slide.index - 1);
}
export function nextSlide() {
    this.goToSlide(store.state.media.slide.index + 1);
}
export function lastSlide() {
    this.goToSlide(store.state.media.slides.length - 1);
}
export function timeUpdate() {
    let audio = this;
    store.state.media.current_time = isNaN(audio.currentTime) ? 0 : audio.currentTime;
    store.state.media.duration = isNaN(audio.duration) ? 0 : audio.duration;
    store.state.media.progress = store.state.media.current_time / store.state.media.duration * 100;
    store.state.media.progress = isNaN(store.state.media.progress) ? 0 : store.state.media.progress;

    if (store.state.desktop && !store.state.data.online) {
        audio.buffered = 100
    } else {
        store.state.media.buffered = 0;
        let buffered = audio.buffered; // Obter intervalos de buffer carregados
        if (buffered.length > 0) {
            store.state.media.buffered = (buffered.end(0) / audio.duration) * 100;
        }
    }

    Screen.send("media", store.state.media);
    Media.adjust();
}
export function goToPercent(val) {
    let time = (store.state.media.duration * val) / 100;
    this.goTo(time);
}
export function goTo(time) {
    let audio = this.getElement();
    if (time == undefined) {
        time = 0;
    }
    if (time < 0) {
        time = 0;
    } else if (time > store.state.media.duration) {
        time = store.state.media.duration;
    }
    audio.currentTime = time;
}
export function goToSlide(slide) {
    if (slide + 1 > store.state.media.slides.length) {
        slide = store.state.media.slides.length - 1;
    }
    if (slide < 0) {
        slide = 0;
    }

    if (store.state.media.has_music && store.state.media.duration > 0 && store.state.media.audio > 0) {
        this.goTo(store.state.media.slides[slide].time || 0);
    } else {
        store.state.media.slide.index = slide;
        this.slide();
    }
}
export function advanceTime(time) {
    if (time == undefined) {
        time = 10;
    }
    if (store.state.media.has_music && store.state.media.duration > 0 && store.state.media.audio > 0) {
        this.goTo(+store.state.media.current_time + +time);
    }
}
export function slides() {
    if (!store.state.media.has_music) {
        return [];
    }

    let slides = Object.assign({}, store.state.media.music, { show_slide: 1, time: 0 });
    delete slides.lyric;
    slides = [slides];
    slides.push(...store.state.media.music.lyric);
    let img = "";
    let img_pos = 5;
    slides.map((item) => {
        item.url_image = item.url_image || img;
        item.image_position = item.image_position || img_pos;
        if (item.url_image) {
            img = item.url_image;
            img_pos = item.image_position;
        }
        return item;
    });
    store.state.media.slides = slides.filter((item) => item.show_slide == 1);
    return store.state.media.music.slides;
}
export function slide() {
    if (!store.state.media.has_music || store.state.media.slides.length <= 0) {
        return;
    }
    let slide_indx;
    let slide;
    if (store.state.media.duration > 0 && store.state.media.audio > 0) {
        slide_indx = store.state.media.slides.filter(
            (item) => (item.time || 0) <= store.state.media.current_time
        ).length - 1;
        if (slide_indx < 0) {
            return;
        }
        slide = store.state.media.slides[slide_indx];
    } else {
        if (store.state.media.slide.index < 0) {
            store.state.media.slide.index = 0;
        }
        slide_indx = store.state.media.slide.index;
        slide = store.state.media.slides[slide_indx];
    }
    store.state.media.slide.index = slide_indx;
    store.state.media.slide.number = slide_indx + 1;
    store.state.media.slide.count = store.state.media.slides.length;
    store.state.media.slide.start_time = slide.time || 0;
    store.state.media.slide.end_time = slide_indx + 1 >= store.state.media.slide.count
        ? store.state.media.duration
        : store.state.media.slides[slide_indx + 1].time;
    store.state.media.slide.url_image = slide.url_image;
    store.state.media.slide.image_position = slide.image_position;
    store.state.media.slide.lyric = slide.name || slide.lyric;
    store.state.media.slide.progress = (store.state.media.current_time - store.state.media.slide.start_time) / (store.state.media.slide.end_time - store.state.media.slide.start_time) * 100;
    store.state.media.slide.progress = isNaN(store.state.media.slide.progress) ? 0 : store.state.media.slide.progress;

    return slide;
}
export function adjust() {
    if (
        !store.state.media.is_paused &&
        store.state.media.current_time >= store.state.media.duration &&
        store.state.media.duration > 0
    ) {
        this.close();
    }

    this.slide();
}
export function lyric(obj) {
    let id_music = obj;
    DevTools.write(obj);
    store.state.lyric.album = '';
    store.state.lyric.track = 0;
    if (typeof (obj) === "object") {
        id_music = obj.id_music;
        store.state.lyric.track = obj.track || 0;
        if (typeof (obj.album) === "object") {
            store.state.lyric.album = obj.album.name;
        } else {
            store.state.lyric.album = obj.album;
        }
    }
    store.state.lyric.show = true;
    store.state.lyric.loading = true;

    Musics.show(id_music, (resp, data) => {
        if (resp) {
            store.state.lyric.music = data;
        } else {
            Alert.error(data)
        }

        store.state.lyric.loading = false;
    });
}


export function getElement() {
    let el;
    let id = "__audio";
    if (!document.getElementById(id)) {
        el = document.createElement("audio");
        el.setAttribute("id", id);
        el.setAttribute("preload", "auto");
        document.body.appendChild(el);
        el.addEventListener("timeupdate", this.timeUpdate);
        el.addEventListener("progress", this.timeUpdate);
    } else {
        el = document.getElementById(id);
    }

    el.setAttribute("autoplay", true);
    return el;
}