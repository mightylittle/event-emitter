# @mighty-little/event-emitter

> Simple event-emitter implementation

## Usage

JavaScript example:

```javascript
import EventEmitter from "@mightylittle/event-emitter";

const emitter = new EventEmitter();

emitter.once("foo", (data) => console.log("once:", data));
emitter.on("foo", (data) => console.log("on:", data));

emitter.emit("foo", data);
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
