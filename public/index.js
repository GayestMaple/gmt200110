$(document).ready(() => {
    let uploadUrl = 'http://127.0.0.1:2999/files/upload';
    let downloadUrl = 'http://127.0.0.1:2999/files/download';

    let fileUploader = $('#file-uploader')[0];
    let fileDownloader = $('#file-downloader');
    let uploadBtn = $('#upload-btn');
    let downloadBtn = $('#download-btn');

    uploadBtn.click((e) => { 
        e.preventDefault();
        uploadFile({
            url: uploadUrl,
            files: fileUploader.files
        });
    });

    downloadBtn.click((e) => {
        e.preventDefault();
        downloadFile({
            url: downloadUrl,
            filename: fileDownloader.val()
        });
    });

});