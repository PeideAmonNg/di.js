
export default class Bar {
  constructor(foo, url, intNum, floatNum, nonNum) {
    this.foo = foo;
    this.url = url;
    this.intNum = intNum;
    this.floatNum = floatNum;
    this.nonNum = nonNum;
  }

  setBaz(baz) {
    console.log("setBaz");
    this.baz = baz;
  }

  async setSomethingAsync(n) {
    console.log("setSomethingAsync");
    return new Promise((resolve, reject) => {
      console.log("setTimeout");
      setTimeout(function() {
        console.log("timed out");
        resolve(n);
      }, 2000);
    });
  }

  getUrl() {
    return this.url;
  }

  getIntNum() {
    return this.intNum;
  }

  getFloatNum() {
    return this.floatNum;
  }

  getNonNum() {
    return this.nonNum;
  }

  doit() {
    console.log("Bar::doit", this.url);
    this.foo.doit();
    this.baz.doit();
  }
}
