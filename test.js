let MyPromise = require('./Promise1');
let p1 = new MyPromise(function (resolve, reject) {
  setTimeout(function () {
    let num = Math.random();
    if (num < 0.5) {
      resolve(num);
    } else {
      reject('fail');
    }
  });
});

p1.then((data) => {
  console.log(data);
}, (err) => {
  console.log(err);
});