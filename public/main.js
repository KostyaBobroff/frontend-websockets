import WebSocketService from './services/WebSocketService.js';

const name = document.querySelector(`[data-section="name"]`);
const button = document.querySelector(`[data-section="button"]`);
const dataDiv = document.querySelector(`[data-section="data"]`);
const preloader = document.querySelector(`[data-section="preloader"]`);
const ws = new WebSocketService('/ws');
ws.subscribe('get-data', inputInDiv);

let count = 0;

function inputInDiv (data) {
  preloader.style.display = 'none';
  if (count > 4) {
    dataDiv.innerText = '';
    count = 0;
  }
  dataDiv.innerText += `\n${data}`;
  count++;
}

button.addEventListener('click', event => {
  event.preventDefault();
  preloader.style.display = 'block';
  const userName = name.value.trim();
  ws.send('send-data', { name: userName });
});
