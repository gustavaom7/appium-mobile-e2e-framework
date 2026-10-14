import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId } from '../utils/selectors.ts';

class CheckoutCompleteScreen extends BaseScreen {
  constructor() {
    super('checkout complete screen');
  }

  async continueShopping(): Promise<void> {
    await $(buttonId('Continue Shopping')).click();
  }
}

export default new CheckoutCompleteScreen();
