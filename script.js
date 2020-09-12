async function graph(player) {
  const resp = await fetch('/.netlify/functions/idolsHistory');
  const json = await resp.json();
  let x = json.hourly.map(x => new Date(x.timestamp));
  let y = json.hourly.map(x => x.players[player.playerId]);
  x.push(new Date(player.time));
  y.push(player.total);
  const chart = new Chart('myChart', {
    type: 'line',
    data: {
      labels: x,
      datasets: [{
        label: 'Idolizers',
        data: y
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              hour: 'MMM D hA'
            },
            unit: 'hour',
          }
        }]
      },
      maintainAspectRatio: false
    }
  });

  document.querySelector('dialog').addEventListener('close', () => {
    chart.destroy();
  }, {
    once: true
  });
}

async function main() {
  let app = document.getElementById('app');
  let loading = document.createElement('span');
  loading.textContent = 'Loading...';
  app.classList.add('loading');
  app.appendChild(loading);

  let dialog = document.querySelector('dialog');
  dialogPolyfill.registerDialog(dialog);
  document.querySelector('.close > span').addEventListener('click', () => dialog.close());
  document.body.addEventListener('click', event => {
    if (!dialog.open) return;
    const rect = dialog.getBoundingClientRect();
    const clickedInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!clickedInDialog) {
      dialog.close();
    }
  });

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
    total.addEventListener('click', event => {
      (window.gtag || console.log)('event', 'Graph', {
        event_category: 'Player',
        event_label: idol.player.name
      });

      dialog.showModal();
      event.stopPropagation();
      graph(idol);
    });
    item.appendChild(playerName);
    item.appendChild(team);
    item.appendChild(total);
    list.appendChild(item);
  }
  app.classList.remove('loading');
  loading.replaceWith(list);
}

window.addEventListener('load', main);
