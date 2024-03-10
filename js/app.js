const app = {
    ffmpeg: (arg) => {
        startFFmpeg(arg);
    },
    clear: (arg) => {
        if (arg.length == 0) {
            $clear.click();
            return;
        }
        arg[0] == "file" && $clearFile.click();
    },
    add: (arg) => {
        if (arg.length == 0) {
            $addFile.click();
            return;
        }
        for (let url of arg) {
            let name;
            try {
                name = new URL(url).pathname.split("/").pop();
            } catch (e) {
                writeLog("url不正确", "error", false);
                continue;
            }
            name = name ? checkFileName(name) : "memory" + new Date().getTime();
            writeLog(`保存文件 ${name}`, "primary");
            fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    writeLog(`${name} 保存完毕`, "success");
                    addFileButton([new File([blob], name, { type: blob.type })]);
                }).catch(error => {
                    writeLog(`${name} 保存失败 ${error}`, "error", false);
                });
        }
    },
    echo: (arg) => {
        writeLog(arg.join(" "));
    },
    help: (arg) => {
        let help = "ffmpeg 格式转换工具 参数 -nd 不保存文件\n";
        help += "clearFFmpeg 清空缓存的ffmpeg\n";
        help += "clear 清空Console\n";
        help += "add 添加网络文件 参数为url\n";
        help += "down 保存文件区内的文件 [down a.mp4 b.mp4]\n";
        help += "play 预览视频文件 [play a.mp4]\n";
        help += "ren 重命名文件名 [ren a.mp4 b.mp4]\n";
        help += "help 帮助\n";
        writeLog(help);
    },
    down: (arg) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        for (let item of $media.children) {
            if (arg.includes(item.file.name)) {
                writeLog(`保存文件 ${item.file.name}`, "primary");
                a.download = item.file.name;
                a.href = URL.createObjectURL(item.file);
                a.click();
            }
        }
        a.remove();
    },
    play: (arg) => {
        if (arg.length == 0) { return; }
        try {
            const url = new URL(arg[0]);
            artPlay({
                name: url.pathname.split("/").pop(),
                ext: url.pathname.split(".").pop(),
                url: arg[0]
            });
        } catch (err) {
            const file = getFile(arg[0], "dom");
            if (file) { file.children[0].click(); }
        }
    },
    ren: (arg) => {
        if (getFile(arg[1])) {
            writeLog(`无法更改文件名 ${arg[1]} 已存在`, "error", false);
            return;
        }
        for (let item of $media.children) {
            if (arg[0] == item.file.name) {
                item.file = new File([item.file], arg[1], { type: item.file.type });
                item.children[0].innerHTML = arg[1];
                break;
            }
        }
    },
    set: (arg) => {
        if (arg[0] == 'wasmURL') {
            localStorage.removeItem("wasmURL");
            arg[1] && localStorage.setItem("wasmURL", arg[1]);
            location.reload();
        }
    },
    clearFFmpeg: (arg) => {
        window.indexedDB.deleteDatabase('ffmpegDB');
        writeLog("删除ffmpeg缓存 完成", "primary", false);
        writeLog("请重启应用, 重新下载ffmpeg", "primary", false);
        $command.value = "";
    }
}