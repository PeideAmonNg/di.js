
export default class Loader {
  constructor(container) {
    this.container = container;
  }

  load(config) {
    const makeArg = (container, arg) => {
      if (arg[0] === '@') {
        arg = container.get(arg.substring(1));
      }
      else
      if (!isNaN(parseFloat(arg)) && isFinite(arg)) {
        arg = parseFloat(arg);
      }

      return arg;
    }

    Object.keys(config).map(name => {
      const serviceConfig = config[name];

      const isLazy = !!(serviceConfig.lazy && serviceConfig.lazy === true);

      this.container[serviceConfig.type || 'service'](name, () => {
        const { default: serviceClass } = require(serviceConfig.src);

        const args = (serviceConfig.arguments || []).map(arg => {
          return makeArg(this.container, arg);
        });

        const service = new serviceClass(...args);

        if (serviceConfig.calls) {
          Object.keys(serviceConfig.calls).map(setter => {
            const args = serviceConfig.calls[setter].map(arg => {
              return makeArg(this.container, arg);                
            });

            return service[setter](...args);
          });
        }

        return service;
      }, isLazy);
    });

    console.log("done");
  }
}
