import webdriver from 'selenium-webdriver';
import expect from 'expect';
import { check, doBefore, doAfter } from '../shared/functions';
import * as Test from '../shared/tests';
import { appName, appTitle } from '../config';

let appHandle;

describe('Chrome app window', function() {

  before(function(done) {
    doBefore.call(this, done, () => {
      return this.driver.get('chrome://extensions-frame').then(() => {
        this.driver.findElement(webdriver.By.className('launch-link')).click();
        return this.driver.wait(() =>
            this.driver.getAllWindowHandles()
              .then(windows => {
                if (windows.length === 2) {
                  appHandle = windows[1];
                  return true;
                }
                return false;
              })
          , 9000, 'Chrome app not launched');
      });
    }, './build/app');
  });

  after(doAfter);

  it('should switch to app\'s handle', function(done) {
    expect(appHandle).toExist();

    this.driver.switchTo().window(appHandle).then(() => {
      this.driver.getWindowHandle().then(
          (handle) => {
            expect(handle).toEqual(appHandle);
            done();
          });
    });
  });

  Test.hasTitle(appTitle);
  Test.hasValue(0);
  Test.clickButtons(0);

});
