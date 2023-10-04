const fileInput = document.getElementById('fileInput');
const mediaContainer = document.querySelector('.media-container');
const downloadButton = document.getElementById('downloadButton');

fileInput.addEventListener('change', function () {
    mediaContainer.innerHTML = ''; // 清空 mediaContainer 的内容
    downloadButton.disabled = true;

    const file = fileInput.files[0];
    if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 1080; // 正方形的尺寸
                const padding = 54; // 5% 的内边距

                let width, height;

                if (img.width >= img.height) {
                    // 图片宽度较大，根据宽度进行缩放
                    width = maxSize - 2 * padding;
                    height = (img.height / img.width) * width;
                } else {
                    // 图片高度较大，根据高度进行缩放
                    height = maxSize - 2 * padding;
                    width = (img.width / img.height) * height;
                }

                canvas.width = maxSize + 2 * padding; // 设置正方形的尺寸
                canvas.height = maxSize + 2 * padding;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const x = (maxSize - width) / 2 + padding;
                const y = (maxSize - height) / 2 + padding;
                ctx.drawImage(img, x, y, width, height);

                mediaContainer.appendChild(canvas);
                downloadButton.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video')) {
    }
});

downloadButton.addEventListener('click', function () {
    const media = mediaContainer.firstChild; // 获取 mediaContainer 的第一个子元素（Canvas 或视频）
    if (media) {
        if (media instanceof HTMLCanvasElement) {
            const dataURL = media.toDataURL('image/png');
            if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
                downloadInSafari(dataURL, 'output_image.png');
            } else {
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'output_image.png';
                link.click();
            }
        } else if (media instanceof HTMLVideoElement) {
            const link = document.createElement('a');
            link.href = media.src;
            link.download = 'video.mp4';
            link.click();
        }
    }
});

function downloadInSafari(dataURL, filename) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    // link.download  = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const downloadButton = document.getElementById('downloadButton');
    
    if (isSafari) {
        downloadButton.innerText = "2. 前往長按儲存";
    }
});
