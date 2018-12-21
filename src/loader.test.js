
import Container, { Loader } from '.';

describe('loader', () => {
  /*it('shall be async', async () => {
    await new Promise((resolve, reject) => {
      console.log("setTimeout");
      setTimeout(function() {
        console.log("timed out");
        resolve();
      }, 2000);
    });
  });*/

  it('is very true', async () => {

    const config = {
      'foo-service': {
        type: 'factory',
        src: './service/Foo',
        class: 'Foo',
      },
      'baz-service': {
        src: './service/Baz',
        class: 'Baz',
      },
      'bar-service': {
        src: './service/Bar',
        class: 'Bar',
        arguments: [
          '@foo-service',
          'http://www.example.com',
          '123',
          '1.23',
          'not a number'
        ],
        calls: {
          setBaz: ['@baz-service'],
          setSomethingAsync: [123]
        },
        //lazy: true,
      }
    };

    const container = new Container();

    const loader = new Loader(container);

    loader.load(config);

    const bar = await container.get('bar-service');
    bar.doit();

    expect(bar.getIntNum()).toEqual(123);
    expect(bar.getFloatNum()).toEqual(1.23);
    expect(bar.getUrl()).toEqual('http://www.example.com');

    expect(1 === 1).toBe(true);
  });
});
