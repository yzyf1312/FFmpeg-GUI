let language = localStorage.getItem("language");
if (!language) {
    let userLanguage = navigator.language.split("-")[0];
    language = userLanguage.includes(['zh', 'en']) ? userLanguage : "zh";
    localStorage.setItem("language", language);
}
const i18nJson = {
    language: {
        en: "语言",
        zh: "Language"
    },
    title: {
        en: "FFmpeg-GUI",
        zh: "FFmpeg-GUI"
    },
    preview: {
        en: "Preview",
        zh: "预览"
    },
    file: {
        en: "File",
        zh: "文件"
    },
    commonCommands: {
        en: "Common commands",
        zh: "常用命令"
    },
    commonCommands: {
        en: "Common commands",
        zh: "常用命令"
    },
    convert2MP4: {
        en: "Convert to MP4",
        zh: "转mp4 / 修正视频"
    },
    commonMerge: {
        en: "Audio+Video Merge",
        zh: "音频+视频合并"
    },
    extractAudio: {
        en: "Extract audio",
        zh: "提取音频"
    },
    deleteAudio: {
        en: "Delete audio",
        zh: "删除音频"
    },
    splicingTS: {
        en: "Splicing TS",
        zh: "拼接多个ts视频"
    },
    convertAAC: {
        en: "Convert to aac",
        zh: "转格式aac"
    },
    downloadFiles: {
        en: "Download files",
        zh: "保存文件区的文件"
    },
    clearFfmpeg: {
        en: "Clear ffmpeg cache",
        zh: "清理ffmpeg缓存"
    },
    help: {
        en: "Help",
        zh: "帮助"
    },
    fillCommand: {
        en: "👈Write command",
        zh: "👈填入命令"
    },
    runCommand: {
        en: "Run",
        zh: "运行命令"
    },
    stop: {
        en: "Stop",
        zh: "停止运行"
    },
    addFile: {
        en: "Add file",
        zh: "加一坨文件"
    },
    clearFiles: {
        en: "Clear files",
        zh: "清空文件"
    },
    clearConsole: {
        en: "Clear console",
        zh: "清空Console"
    },
    loadingFfmpeg: {
        en: "Loading FFmpeg...",
        zh: "加载FFmpeg中..."
    },
    ffmpegLoadingFailed: {
        en: "FFmpeg loading failed",
        zh: "FFmpeg加载失败"
    },
    ffmpegLoadingCompleted: {
        en: "FFmpeg loading completed",
        zh: "FFmpeg加载完成"
    },
    waitingFFmpeg: {
        en: "Waiting FFmpeg not loaded",
        zh: "等待...FFmpeg未加载"
    },
    addStrict: {
        en: "Add -strict to run the command again",
        zh: "添加实验参数重新运行命令"
    },
    completed: {
        en: "Processing completed, generating and downloading files ",
        zh: "正在生成并保存文件 "
    },
    isEmpty: {
        en: "is empty, please confirm if the command is correct",
        zh: "为空, 请确认命令是否正确"
    },
    messageTip: {
        en: "No action is required, please wait patiently for the format conversion... After success, the file will be downloaded automatically",
        zh: "无需任何操作, 请耐心等待格式转换...成功后，自动保存文件"
    },
    ffmpeStopped: {
        en: "FFmpeg stopped",
        zh: "FFmpeg已停止"
    },
    downloading: {
        en: "Downloading",
        zh: "正在下载"
    },
    downloadCompleted: {
        en: "Download completed",
        zh: "下载完成"
    },
    downloadFailed: {
        en: "Download failed",
        zh: "下载失败"
    },
}
const i18n = (key) => i18nJson[key][language];

const translate = () => {
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
        element.innerHTML = i18n(element.dataset.i18n);
    });
    // document.title = i18n("title");
}
translate();

const $language = document.querySelector('#language');
$language.onchange = () => {
    language = $language.value;
    localStorage.setItem("language", $language.value);
    translate();
};