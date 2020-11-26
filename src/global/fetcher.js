// import {handleChange} from "./index";

// const url = 'http://localhost:80';
const headers = new Headers();
let username = '';
let Token = '';
let task_num = 0;

const post = (uri, body, cb = null, transfer = true) => {
  if (!headers.has('Token')) {
    setTimeout(() => post(uri, body, cb, transfer), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    method: 'POST',
    headers,
    body: transfer ? JSON.stringify(body) : body,
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
    });
};
const postPro = (uri, body, cb = null, transfer = true) => new Promise((resolve, reject) => {
  if (!headers.has('Token')) {
    setTimeout(() => post(uri, body, cb, transfer), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    method: 'POST',
    headers,
    body: transfer ? JSON.stringify(body) : body,
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
      resolve(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
      reject(e);
    });
});

const put = (uri, body, cb = null) => {
  if (!headers.has('Token')) {
    setTimeout(() => put(uri, body, cb), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
    });
};

const postWithToken = (uri, cb = null) => {
  if (!headers.has('Token')) {
    setTimeout(() => postWithToken(uri, cb), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    method: 'POST',
    body: JSON.stringify({ Token }),
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
    });
};
const postWithTokenPro = (uri, cb = null) => new Promise((resolve, reject) => {
  if (!headers.has('Token')) {
    setTimeout(() => postWithTokenPro(uri, cb), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    method: 'POST',
    body: JSON.stringify({ Token }),
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
      resolve(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
      reject(e);
    });
});

const get = (uri, cb = null) => {
  if (!headers.has('Token')) {
    setTimeout(() => get(uri, cb), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    headers,
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
    });
};
const getPro = (uri, cb = null) => new Promise((resolve, reject) => {
  if (!headers.has('Token')) {
    setTimeout(() => get(uri, cb), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    headers,
  }).then((res) => res.arrayBuffer())
    .then((res) => {
      if (cb instanceof Function) cb(res);
      const imgUrl = `data:image/png;base64,${btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
      resolve(imgUrl);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
      reject(e);
    });
});
const del = (uri, cb = null, waiting = true) => {
  if (!headers.has('Token')) {
    setTimeout(() => del(uri, cb), 100);
    return;
  }
  fetch(`${url}${uri}`, {
    method: 'DELETE',
    headers,
  }).then((res) => res.json())
    .then((res) => {
      if (cb instanceof Function) cb(res);
    })
    .catch((e) => {
      console.error(e);
      if (cb instanceof Function) cb({ status: 'failed' });
    });
};

const getUsernameFromCookie = () => {
  let startIdx = document.cookie.indexOf('username=');
  if (startIdx === -1) return;
  startIdx += 9;
  let endIdx = document.cookie.indexOf(';', startIdx);
  if (endIdx === -1) endIdx = document.cookie.length;

  username = unescape(document.cookie.substring(startIdx, endIdx));
};

const saveUsernameToCookie = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  document.cookie = `username=${username};expires=${date.toGMTString()}`;
};

const logout = () => {
  username = '';
  getToken();
};

const getToken = async () => {
  let getName = false;
  while (!username) {
    username = window.prompt('Please input your name: ');
    getName = true;
  }
  if (getName) saveUsernameToCookie();
  
  return new Promise((resolve) => {
    fetch(`${url}/usr/${username}`)
      .then((res) => res.json())
      .then((res) => {
        headers.set('Token', res.Token);
        task_num = res.task_num;
        Token = res.Token;
        resolve(res)
      });
  })
};

const getUsername = () => username;
const getTaskNum = () => task_num;

getUsernameFromCookie();
getToken();
export {
  post, postPro, get, getPro, postWithToken, postWithTokenPro, put, del, url, getUsername, getToken, Token, logout, getTaskNum
};
