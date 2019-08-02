//file to base64
export function fileOrBlobToDataURL(obj, cb) {
	var a = new FileReader();
	a.readAsDataURL(obj);
	a.onload = function(e) {
		cb(e.target.result);
	};
}

//base64 to blob
export function dataURLToBlob(dataurl) {
	var arr = dataurl.split(',');
	var mime = arr[0].match(/:(.*?);/)[1];
	var bstr = atob(arr[1]);
	var n = bstr.length;
	var u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
