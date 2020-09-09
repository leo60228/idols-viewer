let app = document.getElementById('app');
app.innerHTML = 'Loading...';

async function main() {
  let list = document.createElement('ol');
  const resp = await fetch('/.netlify/functions/getIdols');
  const json = await resp.json();
  for (const idol of json) {
    const text = `${idol.player.deceased ? '💀 ' : ''}${idol.player.name} (${idol.total})`;
    let item = document.createElement('li');
    item.textContent = text;
    list.appendChild(item);
  }
  app.firstChild.replaceWith(list);
}

main();
