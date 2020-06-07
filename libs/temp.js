(function () {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  const config = {};
  config.folderName = `[${$('#top > div.items_article_left > section.items_article_header > div > section > div.items_article_headerInfo > ul > li:nth-child(3) > a').text() || '---'}]${getParameterByName('id')}`;
  config.urls = [getParameterByName('magnet'), ...Array.from(new Set(Array.from(document.querySelectorAll('a[href*="storage"]:not([src*=thumb]')).map((img, index) => img.href).filter((url) => url.includes('jpg') || url.includes('gif') || url.includes('png'))))].slice(0, 30);
  const input = document.createElement('textarea');
  input.type = 'text';
  document.querySelector('body').appendChild(input);
  input.value = `fc(${JSON.stringify(config)})`;
  input.select();
  document.execCommand('copy');
}());

(() => {
  const createFolder = (folderName) => fetch(`${location.origin}/cgi-bin/filemanager/utilRequest.cgi?func=createdir&sid=${sessionStorage.getItem('NAS_SID')}`, {
    credentials: 'include',
    headers: {
      accept: '*/*',
      'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      pragma: 'no-cache',
      'x-requested-with': 'XMLHttpRequest',
    },
    body: `dest_path=%2FDownload&dest_folder=${folderName}`,
    method: 'POST',
  }).then((data) => data.json()).then((data) => {
    if (data.status !== 1) throw 'the folder exist';
    return true;
  }).catch((error) => console.log(error));
  const addUrl = ({
    folderName,
    urls,
  }) => fetch(`${location.origin}/downloadstation/V4/Task/AddUrl`, {
    credentials: 'include',
    headers: {
      accept: '*/*',
      'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      pragma: 'no-cache',
      'x-requested-with': 'XMLHttpRequest',
    },
    referrer: `${location.origin}/downloadstation/?windowId=DownloadStation&v=5.1.109&`,
    body: `temp=Download&move=Download%2F${folderName}&url=${urls.join('&url=')}&sid=${sessionStorage.getItem('NAS_SID')}`,
    method: 'POST',
  }).then((data) => data.json()).then((data) => {
    if (data.error !== 0) throw 'add download fail';
    return true;
  });
  const fc = async (config) => {
    try {
      await createFolder(config.folderName);
      await addUrl(config);
    } catch (e) {
      console.log(e);
    }
  };
  window.fc = fc;
})();
