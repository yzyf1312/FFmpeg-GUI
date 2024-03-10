// DOM
const $media = document.getElementById('media');
const $command = document.getElementById('command');
const $log = document.getElementById('log');
const $addFile = document.getElementById('addFile');
const $common = document.getElementById('common');
const $header = document.getElementsByTagName("header")[0];
const $clear = document.getElementById('clear');
const $clearFile = document.getElementById('clearFile');
const $showcaseFile = document.getElementById('showcaseFile');
const $mask = document.getElementById('mask');
const $setCommand = document.getElementById('setCommand');
const $start = document.getElementById('start');
const $stop = document.getElementById('stop');
const $mediaPreview = document.getElementById('mediaPreview');
const $preview = document.getElementById('preview');

// 夜间模式
function changeTheme() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.querySelectorAll('.nes-container, .nes-input, .nes-select').forEach(function (dom) {
        dark ? dom.classList.add("is-dark") : dom.classList.remove("is-dark");
    });
}
changeTheme();
window.matchMedia('(prefers-color-scheme:dark)').onchange = changeTheme;

// 下拉头部变窄
window.addEventListener('scroll', function () {
    scrollY > 50 ? $header.classList.add("sticky") : $header.classList.remove("sticky");
});

// log 日志输出
async function writeLog(text, type = "", warning = true) {
    text = text.replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
    const dom = document.createElement('div');
    dom.classList.add("nes-text");
    type && dom.classList.add("is-" + type);
    dom.innerHTML = text;
    $log.append(dom);
    if (type == "error" && warning) {
        const dom = document.createElement('div');
        dom.classList.add("nes-text", "is-error");
        dom.innerHTML = `<b>出现错误, 请复制Console信息到github提交bug或qqoowuwo@126.com邮箱</b><br><b>需提供涉及网址</b>`;
        $log.append(dom);
    }
    $log.scrollTop = $log.scrollHeight;
};
window.onresize = function () {
    $log.scrollTop = $log.scrollHeight;
}
async function progressLog(text, id, primary = true) {
    let dom = document.getElementById("progressLog_" + id);
    if (!dom) {
        dom = document.createElement('div');
        dom.id = "progressLog_" + id;
        dom.classList.add("nes-text");
        primary && dom.classList.add("is-primary");
        dom.innerHTML = text;
        $log.append(dom);
        $log.scrollTop = $log.scrollHeight;
    }
    dom.innerHTML = text;
}

// 下载
function download(data, name = "NULL", type = "video/mp4") {
    if (!data) { return; }
    const url = data.buffer ? URL.createObjectURL(new Blob([data.buffer], { type: type })) : data;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = name;
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// 更新文件区显示状态
const observerFile = new MutationObserver(function () {
    if (!$media.children.length) {
        $showcaseFile.classList.add("hide");
        return;
    }
    $showcaseFile.classList.remove("hide");
});
observerFile.observe($media, { childList: true, attributes: false, subtree: false });

// 获取文件
function getFile(fileName, type = 'file') {
    for (let item of $media.children) {
        if (fileName == item.file.name) {
            if (type == 'file') {
                return item.file;
            }
            return item;
        }
    }
    return false;
}

// 获取所有文件
function getAllFiles(object = undefined) {
    const files = [];
    for (let item of $media.children) {
        files.push(object ? item.file[object] : item.file);
    }
    return files;
}

// 重命名重复的名称
function checkFileName(fileName) {
    if (getFile(fileName)) {
        fileName += Date.now().toString();
    }
    return fileName;
}

// 添加文件
function addFileButton(files) {
    for (let file of files) {
        if (getFile(file.name)) {
            writeLog(`重复的文件名 "${file.name}"`, "error", false);
            continue;
        }
        const $div = document.createElement("div");
        $div.setAttribute("class", "file");
        $div.file = file;

        const $file = document.createElement("button");
        $file.setAttribute("class", "nes-btn is-success");
        $file.innerHTML = file.name;
        $file.oncontextmenu = function (event) {
            event.preventDefault();
            $command.focus();
            const insertText = `"${$div.file.name}"`;
            const value = $command.value;
            const index = $command.selectionStart;
            const focus = index + insertText.length;
            $command.value = value.slice(0, index) + insertText + value.slice(index);
            $command.setSelectionRange(focus, focus);
        }
        $file.onclick = function () {
            const ext = $div.file.name.split(".").pop();
            if ($div.file.type.substring(0, 6) == "image/" || ["jpg", "png", "jpeg", "bmp", "gif", "webp", "jfif"].includes(ext)) {
                $log.innerHTML += `<div class="nes-text success"><img src="${URL.createObjectURL($div.file)}" width="450"/></div>`;
                $log.scrollTop = $log.scrollHeight;
                return true;
            }
            if (["vtt", "webvtt", "srt", "ass"].includes(ext)) {
                if (art) {
                    URL.revokeObjectURL(previewCC);
                    previewCC = URL.createObjectURL($div.file);
                    art.subtitle.switch(previewCC, { type: ext });
                    art.notice.show = "字幕已加载";
                    return true;
                }
                writeLog("未加载播放器", "error", false);
                return true;
            }
            // 其他格式 尝试使用artplayer播放
            artPlay({ name: $div.file.name, ext: ext, data: $div.file });
        }

        const $cancel = document.createElement("button");
        $cancel.innerHTML = `<i class="nes-icon close is-large"></i>`;
        $cancel.setAttribute("class", "nes-btn is-error cancel");
        $cancel.onclick = function () {
            $media.removeChild($div);
        };

        $div.appendChild($file);
        $div.appendChild($cancel);
        $media.insertBefore($div, $media.childNodes[0]);
    }
}
$addFile.onchange = function () {
    addFileButton(this.files);
    this.files = undefined;
    this.value = "";
};

// 检测命令输入框 回车键
$command.onkeyup = function (event) {
    event.keyCode == 13 && start(true);
}

// 常用命令
function setCommand(index, files = [], output = "output.mp4") {
    if (!files.length) {
        for (let item of $media.children) {
            files.push(item.file.name);
        }
    }
    if (index == "0") {
        $command.value = `ffmpeg -i "${files[0]}" -c copy "${output}"`;
    } else if (index == "1") {
        let common = "ffmpeg ";
        files.forEach(name => {
            common += `-i "${name}" `;
        });
        $command.value = common + `-c copy "${output}"`;
    } else if (index == "2") {
        $command.value = `ffmpeg -i "${files[0]}" -vn -c:a copy "${output == "output.mp4" ? "output.mp3" : output}"`;
    } else if (index == "3") {
        $command.value = `ffmpeg -i "${files[0]}" -an -c:v copy "${output}"`;
    } else if (index == "4") {
        $command.value = `ffmpeg -i "concat:${files.join("|")}" -c copy "${output}"`;
    } else if (index == "5") {
        let ext = output.split(".");
        ext.pop();
        $command.value = `ffmpeg -i "${files[0]}" -c:a copy "${ext.join(".")}.aac"`;
    } else if (index == "6" || index == "down") {
        let common = "down ";
        files.forEach(name => {
            common += `"${name}" `;
        });
        $command.value = common;
    } else if (index == "10") {
        $command.value = `help`;
    }
}
$common.onchange = function () {
    // 帮助
    if ($common.value == 10) {
        setCommand(this.value);
        start();
        return;
    }
    // 清理 ffmpeg
    if ($common.value == 7) {
        $command.value = "clearFFmpeg";
        // start();
        return;
    }
    $setCommand.click();
};

// 点击设置命令
$setCommand.onclick = function () {
    if ($common.value == "") {
        writeLog("没有选择命令😑", "error", false);
        return;
    }
    if ($media.children.length == 0) {
        writeLog("没有文件😡", "error", false);
        return;
    }
    setCommand($common.value);
}

// 获取转换成数组的命令
function getCommand(original = false) {
    // 删除两个以上空格
    // 以空格分割字符串 避开双引号的文件名(含有空格的文件名)
    let cmd = $command.value.trim();
    if (cmd.length == 0) { return []; }
    cmd = cmd.replace(/[ ]{2,}/g, " ");
    const cmdArray = [];
    let flag = false;
    let temp = "";
    for (let i = 0; i < cmd.length; i++) {
        if (cmd[i] == '"') {
            if (original) { temp += cmd[i]; }
            flag = !flag;
            continue;
        }
        if (cmd[i] == ' ' && !flag) {
            cmdArray.push(temp);
            temp = "";
            continue;
        }
        temp += cmd[i];
    }
    cmdArray.push(temp);
    return cmdArray;
}

// 清理文件 按钮
$clearFile.onclick = function () {
    $media.innerHTML = "";
    $addFile.files = undefined;
    $addFile.value = "";
}

// 清理Console按钮
$clear.onclick = function () {
    $log.innerHTML = "";
}

// 清理cmd按钮
document.querySelector("#cmd .cancel").onclick = function () {
    $command.value = "";
    $common.value = "";
}

// 解析命令 运行对应函数
function start(event) {
    const cmdArray = getCommand();
    if (cmdArray.length == 0) {
        if ($common.value != "") {
            setCommand($common.value);
            start(event);
            return;
        }
        writeLog("缺少命令...😑", "error", false);
        return;
    }
    const cmd = cmdArray.shift();
    if (app[cmd]) {
        app[cmd](cmdArray);
        return;
    }
    if ($command.value.startsWith("https://") || $command.value.startsWith("http://")) {
        window.open($command.value, "_blank");
        return;
    }
    try {
        const result = eval($command.value);
        result ? writeLog(result.toString()) : writeLog("ok", "primary", false);
    } catch (e) {
        writeLog("未知命令", "error", false);
    }
}
$start.onclick = start;

// 运行命令按钮状态
function buttonStatus(status = true) {
    $stop.classList.remove("hide");
    $start.classList.remove("hide");
    (status ? $start : $stop).classList.add("hide");
    if (status) {
        progressId = Date.now();
    }
}

// 拖动文件
// 离开
$mask.ondragleave = function () {
    $mask.classList.add("hide");
}
// 悬停 阻止默认事件
document.ondragover = function (event) {
    if (!event.dataTransfer.types.includes("Files")) {
        return;
    }
    $mask.classList.remove("hide");
    event.preventDefault();
}
// 松手
document.ondrop = function (event) {
    $mask.classList.add("hide");
    for (let item of event.dataTransfer.items) {
        const obj = item.webkitGetAsEntry();
        if (!obj) { return; }
        if (obj.isFile) {
            const file = item.getAsFile();
            addFileButton([file]);
        } else if (obj.isDirectory) {
            traverseDirectory(obj);
        }
    }
    event.preventDefault();
}
function traverseDirectory(directory) {
    const reader = directory.createReader();
    reader.readEntries(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isFile) {
                entry.file(function (file) {
                    addFileButton([file]);
                });
            } else if (entry.isDirectory) {
                traverseDirectory(entry);
            }
        });
    });
}