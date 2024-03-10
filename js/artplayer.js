let art = undefined;
let previewSrc = undefined;
let previewCC = undefined;
const iconQuality = '<i class="art-icon"><svg viewBox="0 0 1024 1024" width="25" height="25"><path d="M617.984 576V448H704v128h-86.016zM768 598.016v-171.99q0-18.005-11.99-29.994t-29.994-11.99h-128q-18.005 0-31.019 11.99t-13.013 29.995v171.989q0 18.005 13.013 29.995T598.016 640h32v64h64v-64h32q18.005 0 29.995-11.99T768 598.017zM470.016 640V384h-64v105.984H320V384h-64v256h64v-86.016h86.016V640h64zm339.968-470.016q34.005 0 59.99 25.984t25.983 59.99v512q0 34.005-25.984 59.989t-59.989 25.984h-596.01q-36.011 0-61.014-25.984t-25.003-59.99v-512q0-34.005 25.003-59.989t61.013-25.984h596.011z" fill="#fff"/></svg></i>';
const iconAudioTracks = '<i class="art-icon"><svg version="1" width="25" height="25" viewBox="0 0 512 512"><path d="M80.2 54c-5.7 1.3-10.8 5.5-13.6 11.1-4.4 8.9-3.1 17.5 3.7 24.3 7 7 15.7 8.4 24.6 4 12.7-6.4 15.5-21.9 5.9-32.8-2.9-3.4-5.3-5-9.1-6.1-5.5-1.6-6.6-1.7-11.5-.5zM144.2 54c-8.4 2-16.2 11.6-16.2 19.9 0 9.4 6.4 18.4 14.6 20.9 2.9.8 14.4 1.2 39.6 1.2h35.4l5.3-2.6c12.7-6.4 15.5-21.9 5.9-32.8-6.4-7.3-8.3-7.6-47.7-7.5-18.5.1-35.1.5-36.9.9zM288.7 97c-15.4 3.9-28.1 16.8-31.6 32.1-.7 2.8-1.1 33.2-1.1 81.5v77.1l-7.5.7c-20.5 1.9-42.5 12.7-55.5 27.3-9.8 11-17.6 26.2-20.6 40.1-2.1 10-1.8 27 .6 37.2 4.1 17 14.5 33.9 28.5 45.9 7.4 6.4 23.3 14.4 34 17.2 11.3 2.9 29.9 2.9 41 0 27.2-7.2 49.4-27.1 59-52.6 5.5-14.4 5.5-14.9 5.5-105.1 0-45.9.3-83.4.7-83.4 1.8 0 10.7 6.7 13.3 10 4.8 6.1 6.8 11.7 7.8 22.7 1.3 12.6 4.9 20.9 12.3 28.3 16.6 16.6 42.4 17 59.4.9 9.9-9.4 14.2-21.5 13.2-37.4-2.3-34.4-19.2-66.4-46.2-87-9.8-7.4-79.7-50.3-87-53.3-6.6-2.7-19.3-3.8-25.8-2.2zM76.5 140.7c-16.5 8.7-16.6 30-.1 38.5 5.9 3 15.1 2.2 20.8-1.8 13.8-9.6 11.8-30.5-3.4-36.9-4.8-1.9-13.4-1.9-17.3.2zM140.5 140.7c-16.5 8.6-16.6 30-.2 38.4 3.6 1.9 5.8 2 42.1 1.7l38.4-.3 4.4-3c13.8-9.7 11.8-30.6-3.4-37-5.6-2.3-76.8-2.2-81.3.2zM78.2 225.1c-1.9.6-5.3 3-7.7 5.3-7 7-8.3 15.5-3.9 24.5 6.7 13.4 24.4 15.8 34.2 4.5 14.6-16.5-1.1-40.4-22.6-34.3z"/><path d="M142.2 225.1c-4.9 1.4-11.8 8.8-13.2 14.1-2.6 9.5 1.4 19.6 9.8 24.5l4.7 2.8 35.3.3c41.5.4 43.5.1 50-7.3 9.6-11 6.8-26.5-5.9-32.9l-5.3-2.6-36 .1c-19.9 0-37.6.5-39.4 1z"/></svg></i>';
const iconLoopOn = '<i class="art-icon"><svg width="25" height="25" viewBox="0 0 16 16"><path fill="#fff" d="M12.75 5.515a.75.75 0 0 1 .617.324l.04.065a4 4 0 0 1-3.208 6.091L10 12H7.555l.722.721a.75.75 0 0 1 .073.977l-.073.084a.75.75 0 0 1-.976.073l-.084-.073-2.002-2.002a.75.75 0 0 1-.073-.976l.073-.084 2.002-2.002a.75.75 0 0 1 1.133.977l-.073.084-.721.72L10 10.5a2.5 2.5 0 0 0 2.495-2.336L12.5 8c0-.495-.144-.956-.391-1.344a.75.75 0 0 1 .641-1.141zM7.72 2.218a.75.75 0 0 1 .976-.073l.084.073 2.002 2.002.073.084a.75.75 0 0 1 .007.882l-.08.094L8.78 7.282l-.084.073a.75.75 0 0 1-.882.007l-.094-.08-.073-.084a.75.75 0 0 1-.007-.883l.08-.094.721-.722L6 5.5a2.5 2.5 0 0 0-2.495 2.336L3.5 8c0 .421.104.818.288 1.167l.11.184a.75.75 0 0 1-1.283.777A4 4 0 0 1 5.8 4.005L6 4h2.44l-.72-.721-.073-.084a.75.75 0 0 1 .073-.977z"/></svg></i>';
const iconLoopOff = '<i class="art-icon"><svg width="25" height="25" viewBox="0 0 16 16"><path fill="#fff" d="M2.217 2.22a.75.75 0 0 1 .976-.073l.084.073 10.5 10.5.073.084a.75.75 0 0 1-1.05 1.049l-.083-.073-1.871-1.87c-.182.04-.368.066-.558.08L10 12H7.555l.722.721a.75.75 0 0 1 .073.977l-.073.084a.75.75 0 0 1-.976.073l-.084-.073-2.002-2.002a.75.75 0 0 1-.073-.976l.073-.084 2.002-2.002a.747.747 0 0 1 .265-.172l-2.718-2.72a2.5 2.5 0 0 0-.976 3.34l.11.185a.75.75 0 0 1-1.283.777 3.995 3.995 0 0 1 1.064-5.386L2.217 3.28l-.073-.084a.75.75 0 0 1 .073-.976zM12.75 5.515a.75.75 0 0 1 .617.324l.04.063C13.783 6.512 14 7.231 14 8c0 .988-.358 1.893-.952 2.59l-1.066-1.066A2.49 2.49 0 0 0 12.5 8c0-.495-.144-.956-.391-1.344a.75.75 0 0 1 .641-1.141zm-4.4 4.18l-.073.084-.72.72h1.878l-.986-.987a.745.745 0 0 1-.099.183zm-.627-7.477a.75.75 0 0 1 .976-.073l.084.073 2.002 2.002.073.084a.75.75 0 0 1 .007.882l-.08.094L9.26 6.804 8.2 5.744l.244-.245h-.489L6.455 4h1.988l-.72-.72-.073-.084a.75.75 0 0 1 .073-.977z"/></svg></i>';
const iconClose = '<i class="art-icon"><svg viewBox="0 0 1024 1024" width="21" height="21"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512zm0-572.33L300.63 240.212a42.539 42.539 0 0 0-60.16.214 42.41 42.41 0 0 0-.214 60.16L451.669 512 240.213 723.37a42.539 42.539 0 0 0 .214 60.16 42.41 42.41 0 0 0 60.16.214L512 572.331l211.37 211.413a42.539 42.539 0 0 0 60.16-.213 42.41 42.41 0 0 0 .214-60.16L572.331 512l211.413-211.37a42.539 42.539 0 0 0-.213-60.16 42.41 42.41 0 0 0-60.16-.214L512 451.669z" fill="#fff"/></svg></i>';
function artPlay(obj) {
    URL.revokeObjectURL(previewSrc);
    $mediaPreview.classList.remove("hide");
    previewSrc = obj.data ? URL.createObjectURL(obj.data) : obj.url;
    if (art == undefined) {
        const js = document.createElement('script');
        // js.src = "https://unpkg.com/artplayer/dist/artplayer.js";
        // js.src = "https://lib.baomitu.com/artplayer/latest/artplayer.min.js";
        js.src = "./js/artplayer-load.js";
        js.setAttribute("crossorigin", "anonymous");
        js.onload = function () {
            art = new Artplayer({
                container: "#preview",  // 播放器容器
                url: previewSrc,        // 播放地址
                autoplay: true,         // 自动播放
                flip: true,             // 右键菜单 旋转
                playbackRate: true,     // 右键菜单 播放速度
                aspectRatio: true,      // 右键菜单 长宽比
                screenshot: true,       // 截图
                setting: true,          // 设置
                hotkey: true,           // 快捷键
                pip: true,              // 画中画
                fullscreen: true,       // 全屏
                fullscreenWeb: true,    // 窗口全屏
                miniProgressBar: true,  // 迷你进度条
                subtitleOffset: true,   // 字幕时间偏移
                airplay: true,          // airplay
                autoOrientation: true,  // 移动端的窗口全屏时，根据视频尺寸和视口尺寸，旋转播放器
                fastForward: true,      // 移动端添加长按视频快进功能
                type: obj.ext,          // 播放的类型
                customType: {           // 特殊格式调用相应的解析器
                    m3u8: playM3u8,
                    ts: playM3u8,
                    mpd: playMpd,
                    flv: playFlv
                },
                theme: ['rgb(32, 156, 238)', 'rgb(118, 196, 66)', 'rgb(242, 196, 9)', 'rgb(206, 55, 43)'][Math.floor(Math.random() * 4)],
                controls: [{
                    name: 'close',
                    index: 1,
                    position: 'right',
                    html: iconClose,
                    tooltip: '关闭预览',
                    click: function () {
                        URL.revokeObjectURL(previewSrc);
                        art.pause();
                        $mediaPreview.classList.add("hide");
                    }
                }, {
                    name: 'copyName',
                    index: 2,
                    position: 'right',
                    tooltip: '复制文件名',
                    html: '<i class="art-icon"><svg width="25" height="25" viewBox="0 0 16 16"><path fill="#fff" d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415zM11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2h5z"/></svg></i>',
                    click: function () {
                        window.navigator.clipboard.writeText(art.currentFileName);
                        art.notice.show = "已复制文件名";
                    }
                }, {
                    name: 'download',
                    index: 3,
                    position: 'right',
                    html: '<i class="art-icon"><svg height="25" viewBox="0 -960 960 960" width="25"><path d="M218-84q-55.725 0-95.863-39.438Q82-162.875 82-220v-182h136v182h522v-182h136v182q0 57.125-40.138 96.562Q795.725-84 740-84H218zm262-261L217-608l96-95 99 100v-305h136v305l99-100 97 95-264 263z" fill="#fff"/></svg></i>',
                    tooltip: '保存此视频',
                    click: function () {
                        setCommand("down", [art.currentFileName]);
                        download(previewSrc, art.currentFileName);
                        art.notice.show = "正在保存...";
                    }
                }, {
                    name: 'loopBtn',
                    index: 4,
                    position: 'right',
                    tooltip: '开启循环播放',
                    html: iconLoopOn,
                    click: function () {
                        art.option.loop = !art.option.loop;
                        art.controls.cache.get("loopBtn").option.html = art.option.loop ? iconLoopOff : iconLoopOn;
                        art.controls.cache.get("loopBtn").option.tooltip = art.option.loop ? '关闭循环播放' : '开启循环播放';
                        art.controls.update(art.controls.cache.get("loopBtn").option);
                    }
                }],
                settings: [
                    {
                        name: 'subtitlesSize',
                        tooltip: '20px',
                        html: '字幕大小',
                        range: [20, 9, 100, 1],
                        onChange: function (item) {
                            if (item.range < 10) {
                                art.subtitle.show = false;
                                return '已关闭';
                            }
                            art.subtitle.show = true;
                            art.subtitle.style({ "font-size": item.range + "px" });
                            return item.range + "px";
                        }
                    }
                ]
            });
            art.currentFileName = obj.name;
            art.on('destroy', () => {
                try {
                    if (art.flv && art.flv._emitter) art.flv.destroy();
                    if (art.hls) art.hls.destroy();
                    if (art.dash) art.dash.destroy();
                } catch (e) { console.log(e); }
            });
        }
        document.head.appendChild(js);
        return true;
    }

    // 初始化面板和解析器
    art.controls['dashLevel'] && art.controls.remove('dashLevel');
    art.controls['hlsLevel'] && art.controls.remove('hlsLevel');
    art.controls['hlsAudioTracks'] && art.controls.remove('hlsAudioTracks');
    if (art.flv && art.flv._emitter) art.flv.destroy();
    if (art.dash) {
        art.dash.attachSource(null);
        art.dash.attachView(null);
    }
    if (art.hls) art.hls.detachMedia();

    art.type = obj.ext;
    art.currentFileName = obj.name;
    art.switchUrl(previewSrc);
    art.play();
}

function playM3u8(video, url, art) {
    if (art.type == "ts") {
        let m3u8Content = "#EXTM3U\n";
        m3u8Content += "#EXT-X-TARGETDURATION:65535\n";
        m3u8Content += url + "\n";
        m3u8Content += "#EXT-X-ENDLIST";
        url = URL.createObjectURL(new Blob([new TextEncoder("utf-8").encode(m3u8Content)]));
    }
    if (typeof Hls == "undefined") {
        const js = document.createElement('script');
        // js.src = "https://unpkg.com/hls.js/dist/hls.min.js";
        // js.src = "https://lib.baomitu.com/hls.js/latest/hls.min.js";
        js.src = "https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js";
        js.setAttribute("crossorigin", "anonymous");
        js.onload = function () {
            art.hls = new Hls({ debug: true, enableWorker: false });
            art.hls.loadSource(url);
            art.hls.attachMedia(video);
            art.hls.on(Hls.Events.BUFFER_CREATED, function () {
                if (art.hls.levels.length > 1) {
                    art.controls.add({
                        name: 'hlsLevel',
                        index: 2,
                        position: 'right',
                        html: iconQuality,
                        selector: art.hls.levels.map((item, index) => {
                            return {
                                html: item.height + 'P',
                                level: item.level || index,
                                default: art.hls.currentLevel == index,
                            };
                        }),
                        onSelect(item) {
                            art.hls.currentLevel = item.level;
                            art.loading.show = true;
                            // return item.html;
                            return iconQuality;
                        }
                    });
                }
                if (art.hls.audioTracks.length > 1) {
                    art.controls.add({
                        name: 'hlsAudioTracks',
                        index: 2,
                        position: 'right',
                        html: iconAudioTracks,
                        selector: art.hls.audioTracks.map((item, index) => {
                            return {
                                html: item.name || item.lang,
                                id: item.id,
                                default: art.hls.audioTrack == item.id,
                            };
                        }),
                        onSelect(item) {
                            art.hls.audioTrack = item.id;
                            art.loading.show = true;
                            // return item.html;
                            return iconAudioTracks;
                        }
                    });
                }
            });
        }
        document.head.appendChild(js);
    } else {
        art.hls.loadSource(url);
        art.hls.attachMedia(video);
        // art.play();
    }
}

function playMpd(video, url, art) {
    if (typeof dashjs == "undefined") {
        const js = document.createElement('script');
        // js.src = "https://unpkg.com/dashjs/dist/dash.all.min.js";
        // js.src = "https://lib.baomitu.com/dashjs/latest/dash.all.min.js";
        js.src = "https://cdn.jsdelivr.net/npm/dashjs/dist/dash.all.min.js";
        js.setAttribute("crossorigin", "anonymous");
        js.onload = function () {
            art.dash = dashjs.MediaPlayer().create();
            art.dash.initialize(video, url, art.option.autoplay);
            art.dash.on(dashjs.MediaPlayer.events.BUFFER_LOADED, function (e) {
                const level = art.dash.getBitrateInfoListFor('video');
                const currentLevel = art.dash.getQualityFor('video');
                if (level.length == 1) { return; }
                art.controls.add({
                    name: 'dashLevel',
                    index: 2,
                    position: 'right',
                    html: iconQuality,
                    selector: level.map((item, index) => {
                        return {
                            html: item.height + 'P',
                            level: item.qualityIndex || index,
                            default: currentLevel == item.qualityIndex,
                        };
                    }),
                    onSelect(item) {
                        art.dash.setQualityFor('video', item.level, true);
                        // return item.html;
                        return iconQuality;
                    }
                });
            });
        }
        document.head.appendChild(js);
    } else {
        art.dash.attachView(video);
        art.dash.attachSource(url);
        // art.play();
    }
}

function playFlv(video, url, art) {
    if (typeof flvjs == "undefined") {
        const js = document.createElement('script');
        // js.src = "https://unpkg.com/flv.js/dist/flv.min.js";
        // js.src = "https://lib.baomitu.com/flv.js/latest/flv.min.js";
        js.src = "https://cdn.jsdelivr.net/npm/flv.js/dist/flv.min.js";
        js.setAttribute("crossorigin", "anonymous");
        js.onload = function () {
            art.flv = flvjs.createPlayer({ type: 'flv', url });
            art.flv.attachMediaElement(video);
            art.flv.load();
        }
        document.head.appendChild(js);
    } else {
        art.flv = flvjs.createPlayer({ type: 'flv', url });
        art.flv.attachMediaElement(video);
        art.flv.load();
        // art.play();
    }
}