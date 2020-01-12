$(document).ready(() => {
    let rootUrl = 'https://www.gayestmaple.com/test/gmt200110/filestation'
    let uploadUrl = rootUrl+'/files/upload';
    let downloadUrl = rootUrl+'/files/download';

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