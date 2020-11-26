const host = 'http://0.0.0.0:5000';
const login = '/usr/mamz';
const getToken = 'http://0.0.0.0:5000/usr/mamz';
// fetch(url, {
//     method: 'GET'
// })
//     .then(response => {
//         if(response.ok) {
//             return response.arrayBuffer();  // 这一行是关键
//         }
//         throw new Error('Network response was not ok.');
//     })
//     .then(data => {
//         console.log(data)
//     })
//     .catch(error => {
//         console.log(error)
//     });

// fetch('http://localhost:5000/usr/mamz', {
//             method: 'GET'
//         }).then(response => {
//             console.log("考虑到房价大幅", response)
//             if(response.ok) {
//                 return response.text();
//             }
//             throw new Error('Network response was not ok.');
//         })
//         .then(data => {
//             console.log(data)
//         })
//         .catch(error => {
//             console.log(error)
//         });
export {
  host,
  login,
};
