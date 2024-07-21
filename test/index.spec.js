/*
 * Copyright (c) 2024 John Newton
 * SPDX-License-Identifier: Apache-2.0
 */
import { assert } from "chai";
import { fake, match, spy } from "sinon";
import { describe, it, beforeEach } from "mocha";
import EventEmitter from "@mightylittle/event-emitter";

describe("EventEmitter", () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it("emits events and invokes registered handlers", () => {
    const handler1 = fake();
    const handler2 = fake();
    emitter.on("event", handler1);
    emitter.on("event", handler2);

    emitter.emit("event");

    assert.isTrue(handler1.calledOnce);
    assert.isTrue(handler2.calledOnce);
  });

  it("emits events with data and invokes registered handlers with the same data", () => {
    const handler = fake();
    emitter.on("event", handler);

    const data = {key: "value"};

    emitter.emit("event", data);

    assert.isTrue(handler.calledOnce);
    assert.isTrue(handler.calledWith(match(data)));
  });

  it("removes a specific event handler when 'off' is called with the handler", () => {
    const handler = fake();
    emitter.on("event", handler);

    emitter.off("event", handler);
    emitter.emit("event", "hello world");

    assert.isTrue(handler.notCalled);
  });

  it("removes all event handlers when 'off' is called without a handler", () => {
    const handler1 = fake();
    const handler2 = fake();
    emitter.on("event", handler1);
    emitter.on("event", handler2);

    emitter.off("event");
    emitter.emit("event");

    assert.isTrue(handler1.notCalled);
    assert.isTrue(handler2.notCalled);
  });

  it("registers an event handler with 'once' and removes it after invocation", () => {
    const handler = fake();
    emitter.once("event", handler);

    emitter.emit("event");
    emitter.emit("event");

    assert.isTrue(handler.calledOnce);
  });

  it("does not throw an error when 'off' is called with an unregistered handler", () => {
    const handler = fake();

    assert.doesNotThrow(() => {
      emitter.off("event", handler);
    });
  });

  it("calls handlers registered with 'once' and 'on', then disables with 'off'", () => {
    const handler1 = fake();
    const handler2 = fake();

    emitter.once("event", handler1);
    emitter.on("event", handler2);

    emitter.emit("event");
    emitter.emit("event");
    emitter.off("event");
    emitter.emit("event");

    assert.isTrue(handler1.calledOnce);
    assert.isTrue(handler2.calledTwice);
  });
});
