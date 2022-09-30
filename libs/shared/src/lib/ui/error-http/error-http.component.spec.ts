import { ErrorHttpHarness } from './error-http.harness'
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ErrorHttpComponent, ErrorHttpModule } from './error-http.component'
import { By } from '@angular/platform-browser'
import { render } from '@testing-library/angular'

describe(ErrorHttpComponent.name, () => {
  it('ne doit rien afficher quand le component ne possède pas de titre ni de content', async () => {
    const { harness } = await createComponent({
      errorCode: 404,
      message: "la ressource n'a pas été trouvée",
      title: 'Ressource not found..',
    })
    expect(await (await harness.getCodeError()).text()).toBe('404')
    expect(await (await harness.getTitle()).text()).toBe(
      'Ressource not found..'
    )
    expect(await (await harness.getMessage()).text()).toBe(
      "la ressource n'a pas été trouvée"
    )
  })

  async function createComponent({
    title = '',
    errorCode = 404,
    message = '',
  }: Partial<TestApp>) {
    const { fixture, detectChanges, change } = await render(TestApp, {
      componentProperties: {
        errorCode,
        title,
        message,
      },
      imports: [ErrorHttpModule],
    })

    detectChanges()

    return {
      fixture,
      change,
      detectChanges,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        ErrorHttpHarness
      ),
      hasClassAfpSharedInstructionsBanner: () =>
        By.css('afp-shared-error-http'),
    }
  }
})

/** Test component that contains an MatButton. */
@Component({
  selector: 'test-app',
  template: `
    <afp-shared-error-http
      [message]="message"
      [title]="title"
      [errorCode]="errorCode"
    ></afp-shared-error-http>
  `,
})
class TestApp {
  @Input()
  errorCode: number | undefined

  @Input()
  title = ''

  @Input()
  message = ''
}
