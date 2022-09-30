import { ComponentHarness } from '@angular/cdk/testing'
import { MatButtonHarness } from '@angular/material/button/testing'

export class WebStoryFullViewHarness extends ComponentHarness {
  static hostSelector = 'webstory-full-view'

  async getHomeButton(): Promise<MatButtonHarness> {
    return this.locatorFor(MatButtonHarness.with({ text: /copy/i }))()
  }

  async getHeadline() {
    return this.locatorFor('.headline')()
  }

  async getCatchline() {
    return this.locatorFor('.catchline')()
  }

  async getGuid() {
    return this.locatorFor('.guid')()
  }

  async getLanguage() {
    return this.locatorFor('.language')()
  }

  async getDate() {
    return this.locatorFor('.date')()
  }

  async getVersion() {
    return this.locatorFor('.version')()
  }

  async getPubStatus() {
    return this.locatorFor('.pubStatus')()
  }

  async getCorrection() {
    return this.locatorFor('.signals .signal-correction')()
  }

  async getUpdate() {
    return this.locatorFor('.signals .signal-update')()
  }
}
