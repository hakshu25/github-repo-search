export function parseLinks(linkStr) {
  const links = linkStr.split(',');
  let urls = {};
  links.forEach((link) => {
    const section = link.split(';');
    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const type = section[1].replace(/rel="(.*)"/, '$1').trim();
    urls[type] = url;
  });
  return urls;
}
