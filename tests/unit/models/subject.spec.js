import Subject from '../../../src/models/subject';

describe('Subject', () => {
  const observer = { notify: () => {} };
  let subject;

  beforeEach(() => {
    subject = new Subject();
  });

  describe('addObserver()', () => {
    it('Add observer to list', () => {
      subject.addObserver(observer);

      expect(subject.observers).toEqual([observer]);
    });
  });

  describe('removeObserver()', () => {
    it('Remove observer to list', () => {
      subject.addObserver(observer);
      expect(subject.observers).toHaveLength(1);

      subject.removeObserver(observer);

      expect(subject.observers).toHaveLength(0);
    });

    it('Not remove observer if not match', () => {
      subject.addObserver(observer);
      expect(subject.observers).toHaveLength(1);

      const otherObserver = {};
      subject.removeObserver(otherObserver);

      expect(subject.observers).toHaveLength(1);
    });
  });

  describe('notifyObservers()', () => {
    it('Call notify method of all observers', () => {
      const observer1 = { notify: () => {} };
      const observer2 = { notify: () => {} };
      spyOn(observer1, 'notify');
      spyOn(observer2, 'notify');
      subject.addObserver(observer1);
      subject.addObserver(observer2);

      subject.notifyObservers();

      expect(observer1.notify).toHaveBeenCalledWith(subject);
      expect(observer1.notify).toHaveBeenCalledTimes(1);
      expect(observer2.notify).toHaveBeenCalledWith(subject);
      expect(observer2.notify).toHaveBeenCalledTimes(1);
    });
  });
});
