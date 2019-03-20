import _ from 'lodash';
import { EventEmitter } from 'events';

class EventBusObj extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.useQueue = [];
    this.current = null;
    this.nest = null;
  }

  use(eventName, listener) {
    this.useQueue.push(eventName);
    this.onSeries(eventName, listener);
  }

  onSeries(eventName, listener) {
    const self = this;

    EventEmitter.prototype.on.call(this, eventName, async function (...arg) {
      if (listener.length !== 2) {
        await listener.apply(this, arg);
        return;
      }

      self.queue.push({
        data: arg[0],
        listener,
        eventName,
        arguments: arg,
      });

      await self.next.call(self);
    });
  }

  async next() {
    const item = this.queue[0];

    if (!item) {
      if (this.nest && typeof this.nest === 'function') {
        this.nest();
      }

      await this.emit('bus:queue-empty', {});

      return;
    }

    if (item !== this.current) {
      this.current = item;
      await item.listener.call(this, item.data, async (err, result) => {
        if (err) { throw err; }

        if (!_.isEmpty(result)) {
          _.assignIn(this.queue[0].data, result);
        }

        this.queue.shift();
        this.current = null;
        this.nest = null;

        if (~this.useQueue.indexOf(item.eventName)) {
          this.useQueue.shift();
        }

        if (!this.queue.length && !~this.useQueue.indexOf(item.eventName)) {
          const argsArr = [].slice.call(item.arguments);
          this.nest = argsArr[argsArr.length - 1];
        }

        this.next.call(this);
      });
    }
  }
}

export default new EventBusObj();
