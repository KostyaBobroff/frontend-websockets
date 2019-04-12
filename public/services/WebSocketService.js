import { API_WS_URL } from '../config.js';

const noop = () => null;
export default class WebSocketService {
  constructor (path) {
    this.actions = {};
    this.addCallbacks = this.addCallbacks.bind(this);
    this.connection = new Promise(function (resolve, reject) {
      const wsClient = new WebSocket(API_WS_URL + path);
      wsClient.onopen = () => {
        console.log('ws');
        resolve(wsClient);
      };
      wsClient.onerror = function (error) {
        console.log('Ошибка ' + error.message);
        reject(error);
      };
    })
      .then((wsClient) => {
        this.addCallbacks(wsClient);
        return wsClient;
      });
  }

  addCallbacks (wsClient) {
    wsClient.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log(data);
      if (!this.actions.hasOwnProperty(data.action)) {
        throw new Error('Invalid action');
      }
      this.actions[data.action](event.data);
    }.bind(this);

    wsClient.onclose = function (event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
  }

  reject (error) {
    throw new Error(error);
  }

  send (action = '', data = {}) {
    data.action = action;
    this.connection = this.connection
      .then((wsClient) => {
        wsClient.send(JSON.stringify(data));
        return wsClient;
      });
  }

  subscribe (action = '', callback = noop) {
    if (this.actions.hasOwnProperty(action)) {
      throw new Error('this action is already exists');
    }
    this.actions[action] = callback;
  }
}
