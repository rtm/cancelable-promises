// tests/setinterval.test.js
//
// With cancellation, we can write promises which never resolve until cancelled.

require('..');
const test = require('tape');
const {timeout} = require('./timeout');

function run(interval, canceler) {
  let n = 0;
  return new Promise(_ => {
    const timer = setInterval(() => n++, interval);

    return () => { clearInterval(timer); return n; };
  }, canceler);
}

test("cancel a setInterval-based promise", function(t) {

  t.plan(1);

  // Fire the canceler after half a second.
  const canceler = new Promise(timeout(500, "canceled"));

  run(100, canceler)
    .catch(error => {
      console.log(`setInterval ran ${error.message} times`);
      t.equal(typeof error.message, "number", "cancel reason should be number of iterations");
    });

});
