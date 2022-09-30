import { ComponentHarness } from '@angular/cdk/testing'
import { MatButtonHarness } from '@angular/material/button/testing'
export class ErrorHttpHarness extends ComponentHarness {
  static hostSelector = 'afp-shared-error-http'

  async getHomeButton(): Promise<MatButtonHarness> {
    return this.locatorFor(MatButtonHarness.with({ text: /home/i }))()
  }

  async getCodeError() {
    return this.locatorFor('.headline')()
  }

  async getTitle() {
    return this.locatorFor('.title')()
  }

  async getMessage() {
    return this.locatorFor('.message')()
  }
}
