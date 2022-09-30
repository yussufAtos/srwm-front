import {
  ComponentHarness,
  HarnessPredicate,
  parallel,
} from '@angular/cdk/testing'
import { BaseHarnessFilters } from '@angular/cdk/testing'

/** A set of criteria that can be used to filter a list of `MatInputHarness` instances. */
export interface NgSelectHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the placeholder text of the input. */
  placeholder?: string | RegExp
}

export class NgSelectHarness extends ComponentHarness {
  static hostSelector = 'ng-select'

  /**
   * Gets a `HarnessPredicate` that can be used to search for a `NgSelectHarness` that meets
   * certain criteria.
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with(
    options: NgSelectHarnessFilters = {}
  ): HarnessPredicate<NgSelectHarness> {
    return new HarnessPredicate(NgSelectHarness, options).addOption(
      'placeholder',
      options.placeholder,
      async (harness, placeholder) => {
        return HarnessPredicate.stringMatches(
          (await harness.locatorFor('.ng-placeholder')()).text(),
          placeholder
        )
      }
    )
  }

  /** Gets the value of the input. */
  async getValueLabel(): Promise<string[]> {
    const labels = await this.locatorForAll('.ng-value-label')()
    return Promise.all(labels.map((label) => label.text()))
  }
}
