# DI

A Dependency Injection Container (DIC) for NodeJS applications.

## Install

Either use npm:

    npm install @northern/di

or Yarn:

    yarn add @northern/di

## Introduction

To use DI in your application simply import (or require) the `Container` and create a `Container` instance:

    import Container from '@northern/di'
    
    const container = new Container()

With the newly instantiated container, you can start registering services.

There are two ways you can register a service, with the `service` method and/or the `factory` method.

## Registering a service

With the `service` method a new service provider can be registered. The `service` method takes three parameters:

    Container.service(name, provider[, lazy = false])

The `name` parameter is a string with the "name" of the service, e.g. `'logger'`. The `provider` is a function that "returns" the service instance. The `lazy` parameter specifies whether the service is "lazy" or not, more on that later.

When using the `service` method, a "service" instance is only ever created once (as opposed to a factory, which returns a new instance each time). Let's look at a simple service registration process:

    class Logger {
      info(message) {
        console.log(message)
      }
    }

    container.service('logger', container => {
      return new Logger()
    })

It's that simple. We can now get the "logger" by using the `get` method on the container:

    const logger = container.get('logger')
   
    logger.info("Hello DI")

Since the `Container` instance is passed into the service provider, it is possible to "wire" multiple services together. I.e. a service provider can use, or depend on, other registered services and then "inject" instances of those services into the service to be created. E.g. if we register a new service then we can pass the `logger` service into that new service:

    class PaymentService {
      constructor(logger) {
        this.logger = logger
      }

      process(paymentObject) {
        this.logger.info("Starting payment process.")
      }
    }

    container.service('payment-service', container => {
      const logger = container.get('logger')

      const service = new PaymentService(logger)

      return service
    })

    const paymentService = container.get('payment-service')
    paymentService.process({...})

### Lazy services

When a service is not "lazy" then the instance of that service will be created the moment the service is registered (i.e. when the `service` method is called). This is not always desireable. E.g. if the dependency graph is large and not all services are always used, i.e. usage depends of the code path of the application, it might be better to instantiate a service on a need by need basis. This what a "lazy" service does; it's instance is created on request time rather than registration time.

To create a lazy service, simply pass the 3rd parameter of the `service` method as `true`.

    container.service('logger', container => {
      return new Logger()
    }, true)

## Registering a factory

With the `factory` method a new factory provider can be created. A factory is the same as a service except that it will always return a new instance each time it is requested from the container. The factory registration is the same as that of a service except that a factory cannot be lazy. I.e. the `factory` method only has two parameters:

    Container.factory(name, provider)

## Container Loader

In larger applications it is sometimes easier to describe the "wiring" of your services through a form of external configuration rather than a series of service providers in code.

Lets look at an example, we're registering the same services as in the previous sections:

    import Container, { Loader } from '@northern/di'

    const config = {
      'logger': {
        src: './src/Logger',
        class: 'Logger'
      },
      'payment-service': {
        src: './src/PaymentService',
        class: 'PaymentService',
        arguments: ['@logger']
      }
    }

    const container = new Container()
    const loader = new Loader(container);

    loader.load(config);

    const paymentService = container.get('payment-service');


That's it.
