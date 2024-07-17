/*
 * Copyright (c) 2024 John Newton
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @remarks
 * Callback function, called when an event is emitted.
 */
export type EventCallback<T> = (data?: T) => void;

/**
 * @remarks
 * In-memory, non-threadsafe event-emitter/event-bus implementation.
 */
export default class EventEmitter {
  private subscriptions: Map<string, EventCallback<any>[]> = new Map();

  /**
   * @remarks
   * Dispatches an event of 'type', optionally with data.
   * Registered callbacks synchronously handle the event.
   */
  public emit<T>(type: string, data?: T): void {
    const callbacks = this.subscriptions.get(type) || [];
    callbacks.forEach((callback) => {
      if (data !== undefined) {
        callback(data);
      } else {
        callback();
      }
    });
  };

  /**
   * @remarks
   * Subscribes to event of 'type', calling 'callback' on receive.
   */
  public on<T>(type: string, callback: EventCallback<T>): void {
    const callbacks = this.subscriptions.get(type) || [];
    callbacks.push(callback);
    this.subscriptions.set(type, callbacks);
  };

  /**
   * @remarks
   * Subscribes to event of 'type', calling 'callback' on receive,
   * and immediately unsubscribes after processing the initial event.
   */
  public once<T>(type: string, callback: EventCallback<T>): void {
    const onceHandler: EventCallback<T> = (data) => {
      callback(data);
      this.off(type, onceHandler);
    };
    this.on(type, onceHandler);
  };

  /**
   * @remarks
   * Unsubscribes from event 'type'.
   */
  public off<T>(type: string, callback?: EventCallback<T>): void {
    const callbacks = this.subscriptions.get(type) || [];
    if (callback) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.subscriptions.delete(type);
      }
    } else {
      this.subscriptions.delete(type);
    }
  };
};
