// 文件上传函数
let uploadFile = ({
    url,
    file,
    success = (e) => {
        console.log('%cupload successfully!\n'+new Date(), 'color:#00FF7F');
        if (e.isSaved) {
            console.log('%cserver: saved successfully!\n'+new Date(), 'color:#FFD700');
        } else {
            console.log('%cserver: saved failed!\n'+new Date(), 'color:#FFD700');
        }
    },
    fail = (e) => {
        console.error(e);
    },
    progress = (e) => {
        console.log('%cuploading: '+(e.loaded/e.total*100).toFixed(2)+'%', 'color:#A9A9A9');
    }
}) => {
    let formData = new FormData();
    let xhr = new XMLHttpRequest();
    formData.append('file', file);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success(JSON.parse(xhr.response));
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
    cipher
}) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (JSON.parse(xhr.response)) {
                let link = document.createElement('a');
                link.href = url+'?cipher='+cipher;
                link.download = cipher+'.zip';
                link.click();
            } else {
                alert('密钥不存在！');
            }
        }
    }
    // 先校验密钥是否合法存在
    xhr.open('get', url+'/verify?cipher='+cipher);
    xhr.send();
    
}
