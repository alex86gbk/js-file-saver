(function (name, definition) {
  let hasDefine = typeof define === 'function';
  let hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    define(definition);
  } else if (hasExports) {
    module.exports = definition();
  } else {
    if (typeof window !== 'undefined') {
      window[name] = definition();
    } else {
      try {
        this[name] = definition();
      } catch (err) {
        throw err;
      }
    }
  }
}('JsFileSaver', function () {
  /**
   * 文件下载
   * @param {Object} options
   * @param {String} options.action 表单提交地址
   * @param {String} options.method 表单提交方式['get'|'post']
   * @param {String} options.contentType 表单提交方式:
   * ['application/x-www-form-urlencoded'|'multipart/form-data'|'text/plain']
   * @param {Object} options.payload 提交数据
   * @constructor
   */
  function JsFileSaver(options) {
    this.options = options;

    this.saver = saver;
    this.saverCompatible = function () {
      return saveByForm(options);
    }
  }

  /**
   * 通过表单下载
   */
  function saveByForm(options) {
    const { action, method, contentType, payload } = options;
    const form = document.createElement('form');

    form.setAttribute('action', action);
    form.setAttribute('method', method || 'post');
    form.setAttribute('enctype', contentType || 'application/x-www-form-urlencoded');
    for (const key in payload) {
      if (payload[key]) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', payload[key]);
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  /**
   * 通过blob（二进制大对象）下载
   * @param response http response
   * @param response.data {ArrayBuffer | ArrayBufferView | Blob | String} 下载数据
   * @param response.header {String} 下载信息
   * @param {String} [mime]
   * @param [bom]
   */
  function saveByBlob(response, mime, bom) {
    const blobData = (typeof bom !== 'undefined') ? [bom, response.data] : [response.data];
    const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });
    let filename;

    try {
      filename = response.headers['content-disposition']
        ? response.headers['content-disposition'].split(';')[1].split('filename=')[1].replace(/"/g, '')
        : response.headers['Content-Disposition'].split(';')[1].split('filename=')[1].replace(/"/g, '');
      filename = decodeURIComponent(filename);
    } catch (err) {
      filename = 'download';
    }

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobURL;
      tempLink.setAttribute('download', filename);

      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }
  }

  /**
   * 下载文件
   * @param response http response
   * @param response.data {ArrayBuffer | ArrayBufferView | Blob | String} 下载数据
   * @param response.header {String} 下载信息
   * @param {String} [mime]
   * @param [bom]
   */
  function saver(response, mime, bom) {
    try {
      const isBlobSupported = !!new Blob();
      const isPromiseSupported = !!Promise.resolve();
      saveByBlob(response, mime, bom);
    } catch (err) {
      if (this.options.action) {
        saveByForm(this.options);
      }
    }
  }

  return JsFileSaver;
}));
