const fileInput = document.getElementById('fileInput');
const uploadedImage = document.getElementById('uploadedImage');
const downloadButton = document.getElementById('downloadButton');

fileInput.addEventListener('change', function () {
    uploadedImage.style.display = 'none';
    uploadedVideo.style.display = 'none';
    downloadButton.disabled = true;

    const file = fileInput.files[0];
    if (file && file.type.startsWith('image')) { // 仅处理图像文件
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width, height;

                // 确保图像不超过指定的最大宽度和高度
                const maxWidth = 300; // 最大宽度
                const maxHeight = 300; // 最大高度

                if (img.width > maxWidth || img.height > maxHeight) {
                    // 计算适当的缩放比例
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                    width = Math.floor(img.width * scale);
                    height = Math.floor(img.height * scale);
                } else {
                    // 如果图像本身就小于指定的尺寸，则保持原始尺寸
                    width = img.width;
                    height = img.height;
                }

                canvas.width = 300; // 设置正方形的尺寸
                canvas.height = 300;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const x = (canvas.width - width) / 2;
                const y = (canvas.height - height) / 2;
                ctx.drawImage(img, x, y, width, height);

                uploadedImage.src = canvas.toDataURL('image/png');
                uploadedImage.style.display = 'block'; // 确保图像可见
                downloadButton.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video')) { // 处理视频文件
        const videoSource = URL.createObjectURL(file);
        uploadedImage.style.display = 'none';
        uploadedVideo.style.display = 'block';
        uploadedVideo.src = videoSource;
        downloadButton.disabled = false;
    }
});


downloadButton.addEventListener('click', function () {
    if (uploadedVideo.style.display === 'block') {
        const blobUrl = uploadedVideo.src;
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'video.mp4'; // 设置下载的文件名
        link.click();
    } else if (uploadedImage.style.display === 'block') {
        const link = document.createElement('a');
        link.download = 'output_image.png';
        link.href = uploadedImage.src;
        link.click();
    }
});
