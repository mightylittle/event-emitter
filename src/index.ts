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
 * Object which represents a registered callback and its metadata.
 */
interface Subscription<T> {
  /**
   * @remarks
   * The registered callback function.
   */
  callback: EventCallback<T>;
  /**
   * @remarks
   * Whether the subscription was registered with 'once'; whether to remove the
   * subscription after first calling it.
   */
  once: boolean;
}

/**
 * @remarks
 * In-memory, non-threadsafe event-emitter/event-bus implementation.
 */
export default class EventEmitter {
  private subscriptions: Map<string, Subscription<any>[]> = new Map();

  /**
   * @remarks
   * Dispatches an event of 'type', optionally with data.
   * Registered callbacks synchronously handle the event.
   */
  public emit<T>(type: string, data?: T): void {
    const subscriptions = this.subscriptions.get(type) || [];
    const removeIndices: number[] = [];

    subscriptions.forEach((subscription, index) => {
      const { callback, once } = subscription;
      callback(data);
      if (once) {
        removeIndices.push(index);
      }
    });

    removeIndices.forEach((index) => subscriptions.splice(index, 1));

    if (subscriptions.length === 0) {
      this.subscriptions.delete(type);
    }
  };

  /**
   * @remarks
   * Subscribes to event of 'type', calling 'callback' on receive.
   */
  public on<T>(type: string, callback: EventCallback<T>): void {
    const subscriptions = this.subscriptions.get(type) || [];
    subscriptions.push({callback, once: false});
    this.subscriptions.set(type, subscriptions);
  }

  /**
   * @remarks
   * Subscribes to event of 'type' and marking for deletion after its initial call.
   */
  public once<T>(type: string, callback: EventCallback<T>): void {
    const subscriptions = this.subscriptions.get(type) || [];
    subscriptions.push({callback, once: true});
    this.subscriptions.set(type, subscriptions);
  };

  /**
   * @remarks
   * Unsubscribes from events of 'type'. When 'callback' is not provided, deregisters
   * all subscriptions for the event type.
   */
  public off<T>(type: string, callback?: EventCallback<T>): void {
    const subscriptions = this.subscriptions.get(type) || [];
    if (callback) {
      const index = subscriptions.findIndex(subscription => subscription.callback === callback);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
      if (subscriptions.length === 0) {
        this.subscriptions.delete(type);
      } else {
        this.subscriptions.set(type, subscriptions);
      }
    } else {
      this.subscriptions.delete(type);
    }
  };
};
