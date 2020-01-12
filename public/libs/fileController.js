// 文件上传函数
let uploadFile = ({
    url,
    files,
    success = (e) => {
        console.log('%c'+e.res, 'color:#00FF7F');
    },
    fail = (e) => {
        console.error(e);
    },
    progress = (e) => {
        console.log('%cuploading: '+(e.loaded/e.total*100).toFixed(2)+'%', 'color:#A9A9A9');
    }
}) => {
    let fileList = [];
    let formData = new FormData();
    let xhr = new XMLHttpRequest();
    for (let i=0; i<files.length; i++) {
        formData.append('fileList', files[i]);
    }
    console.log("%cfileList: ",'color:#00FFFF',formData.getAll('fileList'));
    formData.append('timestamp', new Date().getTime());
    xhr.onreadystatechange  = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success({res:'upload successfully!\n'+new Date()});
            console.log('%c'+xhr.responseText+new Date(), 'color:#FFD700');
        }
    }
    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            progress(e);
        }
    }
    xhr.onerror = (e) => {
        fail(e);
    }
    xhr.abort = (e) => {
        fail(e);
    }
    xhr.timeout = (e) => {
        fail(e);
    }
    xhr.open('post', url);
    xhr.send(formData);
}

// 文件下载
let downloadFile = ({
    url,
    filename
}) => {
    let link = document.createElement('a');
    link.href = url+'?filename='+filename;
    link.download = filename;
    link.click();
}
