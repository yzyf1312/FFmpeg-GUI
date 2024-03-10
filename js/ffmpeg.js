let ffmpeg = {};  // ffmpeg 对象
const config = {};  // ffmpeg 配置项
let addStrict = false;  // 是否调用实验参数
let progressId = Date.now();
let autoClose = false;  // 下载完是否自动关闭
let originId = 0;

const coreVersion = "0.12.6";   //  @ffmpeg/core 版本
const baseURLFFMPEG = 'https://lib.baomitu.com/ffmpeg/0.12.10/umd'; // @ffmpeg/ffmpeg

/**
 * 获取数据库中的二进制文件, 如果不存在使用fetch下载并储存在数据库
 * @param {string} key 数据库key
 * @param {string} url 资源url
 * @returns {string} 资源blob地址
 */
async function getFFmpegFile(key, url) {
    return new Promise((resolve, reject) => {
        const openRequest = window.indexedDB.open("ffmpegDB", 4);
        openRequest.onerror = function (event) {
            writeLog(`数据库打开错误, 请重启应用重试`, "error", false);
            console.log('Failed to open database');
            reject('Failed to open database');
        };
        openRequest.onsuccess = function (event) {
            const db = event.target.result;
            const objectStore = db.transaction('ffmpeg', 'readonly').objectStore('ffmpeg');
            const getRequest = objectStore.get(key);
            getRequest.onerror = function (event) {
                writeLog(`数据库读取失败, 请重启应用重试`, "error", false);
                console.log('Failed to retrieve data from IndexedDB');
                reject('Failed to retrieve data from IndexedDB');
            };
            getRequest.onsuccess = async function (event) {
                let blob = event.target.result;
                blob ??= await saveData(db, url, key);
                blob ? resolve(URL.createObjectURL(blob)) : reject('blob null');
            }
        }
        openRequest.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (db.objectStoreNames.contains('ffmpeg')) {
                db.deleteObjectStore("ffmpeg");
            }
            db.createObjectStore("ffmpeg");
        };
    });
}
/**
 * 重新下载资源储存在数据库内并返回blob
 * @param {IDBDatabase} db 数据库对象
 * @param {string} url 资源url
 * @param {string} key 数据库key
 * @returns {blob} 下载完毕的blob资源
 */
async function saveData(db, url, key) {
    // 如果是 core和wasm 选择一个可用的 cdn
    if (key == "core" || key == "wasm") {
        const baseURLCore = await getBaseURLCore();
        if (baseURLCore) {
            url = baseURLCore + "/" + url;
        } else {
            writeLog(`没有 ffmpeg wasm 下载地址可用...`, "error", false);
            writeLog(`请重启应用尝试...`, "error", false);
            return null;
        }
    }
    const response = await fetch(url);
    if (response.ok) {
        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            chunks.push(value);
            receivedLength += value.length;
            progressLog(`${i18n("downloading")} ${key}...${byteToSize(receivedLength)}`, key);
        }
        const blob = new Blob(chunks, { type: key == "wasm" ? 'application/wasm' : 'text/javascript' });
        const objectStore = db.transaction("ffmpeg", "readwrite").objectStore("ffmpeg");
        objectStore.put(blob, key);
        writeLog(`${key} ${i18n("downloadCompleted")}`, "success");
        return blob;
    }
    writeLog(`${key} ${i18n("downloadFailed")}`, "error");
    return null;
}

/**
 * 读取file对象
 * @param {File} blob file对象
 * @returns 返回File对象的二进制内容
 */
const readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
        const { result } = fileReader;
        if (result instanceof ArrayBuffer) {
            resolve(new Uint8Array(result));
        }
        else {
            resolve(new Uint8Array());
        }
    };
    fileReader.onerror = (event) => {
        var _a, _b;
        reject(Error(`File could not be read! Code=${((_b = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code) || -1}`));
    };
    fileReader.readAsArrayBuffer(blob);
});

// 载入ffmpeg wasm
async function loadFFmpeg() {
    writeLog(i18n("loadingFfmpeg"), "primary");

    // 修复umd无法载入814的问题
    const resp = await fetch(`${baseURLFFMPEG}/ffmpeg.js`);
    let body = await resp.text();
    body = body.replace('new URL(e.p+e.u(814),e.b)', 'r.worker814URL');
    const blob = new Blob([body], { type: 'text/javascript' });
    await import(URL.createObjectURL(blob));

    ffmpeg = new FFmpegWASM.FFmpeg();

    config.worker814URL = await getFFmpegFile("814", `${baseURLFFMPEG}/814.ffmpeg.js`);
    config.coreURL = await getFFmpegFile("core", 'ffmpeg-core.js');
    config.wasmURL = await getFFmpegFile("wasm", 'ffmpeg-core.wasm');

    // 判断是否firefox firefox 122 不允许 importScripts 没有type的blob资源
    if (navigator.userAgent.includes("Firefox")) {
        config.coreURL = await getBaseURLCore() + "/ffmpeg-core.js";
    }

    ffmpeg.on('log', ({ type, message }) => {
        message = message ?? type;
        type = type == "stdout" ? "primary" : "";
        // 需要添加实验参数
        if (message.includes("add '-strict -2' if you want to use it.")) {
            let cmd = getCommand(true);
            cmd.splice(cmd.length - 1, 0, "-strict", "-2");
            $command.value = cmd.join(' ');
            addStrict = true;
        } else if (message.startsWith("frame=")) {
            progressLog(message, progressId, false);
            return;
        }
        writeLog(message, type);
    });
    try {
        await ffmpeg.load(config);
    } catch (e) {
        console.error(e);
        writeLog(i18n("ffmpegLoadingFailed"), "error", false);
        return;
    }
    writeLog(`${i18n("ffmpegLoadingCompleted")} ffmpeg core v${coreVersion}`, "success");
}
loadFFmpeg();

/**
 * 删除所有文件
 */
async function clearFile() {
    const files = await ffmpeg.listDir("./");
    files.forEach(file => {
        !file.isDir && ffmpeg.deleteFile(file.name);
    });
}

/**
 * 运行ffmpeg主函数
 * @param {Array} cmdArray 命令数组
 * @param {boolean} down 是否需要下载
 */
const startFFmpeg = async (cmdArray, down = true) => {
    buttonStatus(true);
    if (!ffmpeg.loaded) {
        writeLog(i18n("waitingFFmpeg"), "primary");
        setTimeout(() => {
            startFFmpeg(cmdArray, down);
        }, 1000);
        return;
    }
    await clearFile();

    // 不存在 -i 参数 直接运行命令
    if (!cmdArray.includes("-i")) {
        await ffmpeg.exec(cmdArray);
        buttonStatus(false);
        return;
    }

    if ($media.children.length == 0) { writeLog("没有文件...😒", "error", false); $command.value = ""; return; }

    // 自定义参数 -noDownload 不下载文件 自动储存在文件区
    const noDownload = cmdArray.indexOf("-nd");
    if (noDownload !== -1) {
        cmdArray.splice(noDownload, 1);
    }

    // const cmdFilter = cmdArray.filter((cmd) => !cmd.startsWith("-"));
    for (let item of getAllFiles()) {
        if (cmdArray.some(cmd => cmd.includes(item.name))) {
            try {
                ffmpeg.writeFile(item.name, await readFromBlobOrFile(item));
            } catch (e) { writeLog(e.stack, "error"); }
        }
    }

    let dirList = await ffmpeg.listDir("./");
    dirList = dirList.map(item => item.name);
    await ffmpeg.exec(cmdArray);
    let output = await ffmpeg.listDir("./");
    output = output.filter(file => !dirList.includes(file.name));
    if (output.length) {
        for (let file of output) {
            // 需要添加实验参数
            if (addStrict) {
                writeLog(i18n("addStrict"), "error", false);
                addStrict = false;
                start();
                break;
            }
            const data = await ffmpeg.readFile(file.name);
            if (data.byteLength && data.byteLength > 0) {
                writeLog(i18n("completed") + file.name, "success");
                noDownload == -1 ? download(data, file.name) : addFileButton([new File([data], file.name)]);
                continue;
            }
            writeLog(`${file.name} ${i18n("isEmpty")}`, "error", false);
        }
    } else {
        writeLog(i18n("isEmpty"), "error", false);
    }
    buttonStatus(false);
    autoClose && window.postMessage({ action: "catCatchFFmpegResult", state: "ok", use: "close", tabId: originId });
}

/**
 * 停止运行按钮
 */
$stop.onclick = async function () {
    try {
        buttonStatus(false);
        await ffmpeg.terminate();
        await ffmpeg.load(config);
        writeLog(i18n("ffmpeStopped"), "primary", false);
    } catch (e) { }
}

/**
 * 缓存捕获的数据 音频需要先转为aac 再进行音频 视频合并
 */
async function merge() {
    buttonStatus(true);
    if (!ffmpeg.loaded) {
        writeLog(i18n("waitingFFmpeg"), "primary");
        setTimeout(() => {
            merge();
        }, 1000);
        return;
    }
    await clearFile();

    const cmdArray = getCommand();
    // const cmdFilter = cmdArray.filter((cmd) => !cmd.startsWith("-"));
    for (let item of getAllFiles()) {
        if (cmdArray.some(cmd => cmd.includes(item.name))) {
            const name = item.type.substring(0, 5) == "video" ? "memoryVideo" : "memoryAudio";
            ffmpeg.writeFile(name, await readFromBlobOrFile(item));
        }
    }

    try {
        await ffmpeg.exec(['-i', 'memoryAudio', '-c:a', 'copy', 'audio.aac']);
        if (await ffmpeg.readFile("audio.aac").length == 0) {
            start();
            return;
        }
        const output = cmdArray[cmdArray.length - 1];
        await ffmpeg.exec(['-i', 'memoryVideo', '-i', 'audio.aac', '-c', 'copy', output]);
        const data = await ffmpeg.readFile(output);
        writeLog(i18n("completed") + output, "success");
        download(data, output);
    } catch (e) {
        writeLog(e.stack, "error");
    }
    buttonStatus(false);
}

// 监听数据
let media = []; // 储存接收来自其他地方的媒体
window.addEventListener("message", (event) => {
    if (!event.data || !event.data.action) { return; }
    let output = "output.mp4";
    if (event.data.title) {
        event.data.title = event.data.title.replace(/[\\/'":*?<>|~]/g, "_");
        const ext = event.data.title.split(".").pop();
        if (ext && ['ogg', 'ogv', 'mp4', 'webm', 'mp3', 'wav', 'm4a', '3gp', 'mpeg', 'mov', 'm4s', 'aac'].includes(ext)) {
            output = event.data.title;
        } else {
            output = event.data.title + ".mp4";
        }
    }
    if (event.data.action == "transcode") {
        const name = event.data.name ? checkFileName(event.data.name) : "memory" + new Date().getTime();
        addFileButton([new File([event.data.data], name)]);
        setCommand(0, [name], output);
        writeLog(i18n("messageTip"), "primary");
        start();
        autoClose = event.data.autoClose ?? false;
        originId = event.data.tabId;
    }
    if (event.data.action == "merge") {
        if (event.data.type == "audio") {
            media.audio = "memoryAudio" + new Date().getTime();
            const file = new File([event.data.data], media.audio, { type: "audio/cat" });
            addFileButton([file]);
        }
        if (event.data.type == "video") {
            media.video = "memoryVideo" + new Date().getTime();
            const file = new File([event.data.data], media.video, { type: "video/cat" });
            addFileButton([file]);
        }
        if (media.audio && media.video) {
            setCommand(1, [media.audio, media.video], output);
            writeLog(i18n("messageTip"), "primary");
            merge();
            media = [];
        }
    }
    if (event.data.action == "onlyAudio") {
        const name = event.data.name ? checkFileName(event.data.name) : "memory" + new Date().getTime();
        addFileButton([new File([event.data.data], name)]);
        setCommand(2, [name], output);
        writeLog(i18n("messageTip"), "primary");
        start();
    }
    if (event.data.action == "addMedia") {
        const name = event.data.name ? checkFileName(event.data.name) : "memory" + new Date().getTime();
        addFileButton([new File([event.data.data], name)]);
        if (event.data.tabId) {
            window.postMessage({ action: "catCatchFFmpegResult", state: "ok", tabId: event.data.tabId, use: event.data.autoClose ? "close" : undefined });
        }
    }
    if (event.data.action == "popupAddMedia") {
        const name = event.data.name ? checkFileName(event.data.name) : "memory" + new Date().getTime();
        media.push(name);
        addFileButton([new File([event.data.data], name)]);
        if (event.data.tabId) {
            window.postMessage({ action: "catCatchFFmpegResult", state: "ok", tabId: event.data.tabId, use: event.data.autoClose ? "close" : undefined });
        }
        if (media.length == 2) {
            setCommand(1, [media[0], media[1]], output);
            start();
            media = [];
        }
    }
    if (event.data.action == "openFFmpeg") {
        event.data.extra && writeLog(event.data.extra, "primary");
    }
}, false);

// 字节转换成大小
function byteToSize(byte) {
    if (!byte || byte < 1024) { return 0; }
    if (byte < 1024 * 1024) {
        return (byte / 1024).toFixed(1) + "KB";
    } else if (byte < 1024 * 1024 * 1024) {
        return (byte / 1024 / 1024).toFixed(1) + "MB";
    } else {
        return (byte / 1024 / 1024 / 1024).toFixed(1) + "GB";
    }
}

/**
 * @returns 返回一个可用的 下载wasm的cdn地址
 */
async function getBaseURLCore() {
    let baseURLCoreList = [
        `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${coreVersion}/dist/umd`,
        `https://unpkg.com/@ffmpeg/core@${coreVersion}/dist/umd`,
    ];
    let cdnURLCoreList = [
        `https://npm.akass.cn/@ffmpeg/core@${coreVersion}/dist/umd`,
        `https://cdn.bmmmd.com/core/${coreVersion}`,
        `https://jt.bmmmd.com/core/${coreVersion}`,
    ];
    cdnURLCoreList.sort(() => Math.random() - 0.5);
    baseURLCoreList = [...baseURLCoreList, ...cdnURLCoreList];
    baseURLCoreList.push(`https://jsd.cdn.zzko.cn/npm/@ffmpeg/core@${coreVersion}/dist/umd`);
    for (let url of baseURLCoreList) {
        const controller = new AbortController();
        setTimeout(() => { controller.abort(); }, 3000);
        const response = await fetch(`${url}/ffmpeg-core.wasm`, { signal: controller.signal, headers: { "Range": "bytes=0-1" } }).catch(() => false);
        if (response && response.ok) {
            getBaseURLCore = () => url;
            return url;
        }
    }
    return null;
}