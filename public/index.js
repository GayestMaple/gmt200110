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
        let files = fileUploader.files;
        let zip = new JSZip();
        for (let i=0; i<files.length; i++) {
            zip.file(files[i].name, files[i], {base64: true});
        }
        zip.generateAsync({type: 'blob'}).then((content) => {
            uploadFile({
                url: uploadUrl,
                file: new window.File([content], new Date().getTime()+'.zip', {type: 'application/zip'}),
                success (e) {
                    console.log('%cupload successfully!\n'+new Date(), 'color:#00FF7F');
                    if (e.isSaved) {
                        document.getElementById('cipher-display').innerText = '密钥: '+e.cipher;
                        console.log('%cserver: saved successfully!\n'+new Date(), 'color:#FFD700');
                    } else {
                        console.log('%cserver: saved failed!\n'+new Date(), 'color:#FFD700');
                    }
                }
            });
        })
    });

    downloadBtn.click((e) => {
        e.preventDefault();
        downloadFile({
            url: downloadUrl,
            cipher: fileDownloader.val()
        });
    });

});