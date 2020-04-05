import Notify from '../../../src/models/notify';

describe('Notify', () => {
  let notify;

  beforeEach(() => {
    notify = new Notify();
  });

  describe('observe()', () => {
    it('Add handler to list', () => {
      const handler = () => {};

      notify.observe(handler);

      expect(notify.handlers).toEqual([handler]);
    });
  });

  describe('execute()', () => {
    it('Execute all handlers in list', () => {
      const handlerObj1 = { handler: () => {} };
      const handlerObj2 = { handler: () => {} };
      spyOn(handlerObj1, 'handler');
      spyOn(handlerObj2, 'handler');
      notify.observe(handlerObj1.handler);
      notify.observe(handlerObj2.handler);

      notify.execute();

      expect(handlerObj1.handler).toBeCalledTimes(1);
      expect(handlerObj2.handler).toBeCalledTimes(1);
    });
  });
});
