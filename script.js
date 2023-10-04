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
                const maxSize = 300; // 正方形的尺寸
                const padding = 15; // 5% 的内边距

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

                canvas.width = maxSize+2*padding; // 设置正方形的尺寸
                canvas.height = maxSize+2*padding;
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
        const videoSource = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = videoSource;
        video.controls = true;
        video.style.maxWidth = '100%'; // 视频的最大宽度为100%
        mediaContainer.appendChild(video);
        downloadButton.disabled = false;
    }
});

downloadButton.addEventListener('click', function () {
    const media = mediaContainer.firstChild; // 获取 mediaContainer 的第一个子元素（Canvas 或视频）
    if (media) {
        if (media instanceof HTMLCanvasElement) {
            const link = document.createElement('a');
            link.href = media.toDataURL('image/png');
            link.download = 'output_image.png';
            link.click();
        } else if (media instanceof HTMLVideoElement) {
            const link = document.createElement('a');
            link.href = media.src;
            link.download = 'video.mp4';
            link.click();
        }
    }
});
