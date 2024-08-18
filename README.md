# @mightylittle/event-emitter

> Simple event-emitter implementation

## Usage

Example:

```typescript
type Foo = {
  foo: string;
}

const emitter = new EventEmitter();

const onFooHandler = (data?: Foo) => console.log("'on' triggered", data);

emitter.once<Foo>("foo", (data?: Foo) => console.log("'once' triggered", data));
emitter.on<Foo>("foo", onFooHandler);
emitter.emit<Foo>("foo", {foo: "bar"});
emitter.emit<Foo>("foo", {foo: "baaz"});
emitter.off<Foo>("foo", onFooHandler);
emitter.emit<Foo>("foo", {foo: "quux"});

// Output:
// 'once' triggered { foo: 'bar' }
// 'on' triggered { foo: 'bar' }
// 'on' triggered { foo: 'baaz' }
```

## Installation

```sh
npm install
```

## Development

Build:

```sh
npm run build
```

Run tests:

```sh
npm run test
```

Build docs:

```sh
npm run typedoc
```

## Author

* John Newton

## Copyright

* John Newton

## License

Apache-2.0
