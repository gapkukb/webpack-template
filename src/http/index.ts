Promise.resolve()
  .then(rs => {
    console.log(12321);
  })
  .finally();

console.log(...[1, 2, 6, 5, 47778788]);

let a = {
  ...{
    a: 1,
    b: {
      c: 1,
    },
  },
};

export default a;
