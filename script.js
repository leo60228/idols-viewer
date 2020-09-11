async function main() {
  let app = document.getElementById('app');
  let loading = document.createElement('span');
  loading.textContent = 'Loading...';
  app.classList.add('loading');
  app.appendChild(loading);

  let list = document.createElement('ol');
  const resp = await fetch('/.netlify/functions/getIdols');
  const json = await resp.json();
  for (const idol of json) {
    let item = document.createElement('li');
    let playerName = document.createElement('div');
    playerName.classList.add('playerName');
    if (idol.player.deceased) {
      let deceasedIcon = document.createElement('img');
      deceasedIcon.src = 'deceased.svg';
      deceasedIcon.classList.add('deceasedIcon');
      playerName.appendChild(deceasedIcon);
    }
    playerName.append(idol.player.name);
    let team = document.createElement('div');
    team.classList.add('team');
    let teamColor = document.createElement('div');
    teamColor.classList.add('teamColor');
    teamColor.style.backgroundColor = idol.team.mainColor;
    let teamEmoji = document.createElement('div');
    teamEmoji.classList.add('teamEmoji');
    teamEmoji.textContent = String.fromCodePoint(parseInt(idol.team.emoji, 16)) + '\uFE0F';
    teamColor.appendChild(teamEmoji);
    team.appendChild(teamColor);
    let teamName = document.createElement('span');
    teamName.classList.add('teamName');
    teamName.textContent = idol.team.fullName;
    team.appendChild(teamName);
    let total = document.createElement('div');
    total.classList.add('total');
    total.textContent = idol.total;
    item.appendChild(playerName);
    item.appendChild(team);
    item.appendChild(total);
    list.appendChild(item);
  }
  app.classList.remove('loading');
  loading.replaceWith(list);
}

window.addEventListener('load', main);
