/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { screen, render } from '@testing-library/angular'
import {
  InstructionsBannerComponent,
  InstructionsBannerModule,
} from './instructions-banner.component'
import { ThemePalette } from '@angular/material/core'
import { By } from '@angular/platform-browser'
import { Component, Input } from '@angular/core'

describe(InstructionsBannerComponent.name, () => {
  it('ne doit rien afficher quand le component ne possède pas de titre ni de content', async () => {
    const { hasTitle } = await createComponent({})
    expect(await hasTitle()).toBeFalsy()
  })

  it("doit avoir par défaut la classe css 'afp-shared-instructions-banner'", async () => {
    const { hasClassAfpSharedInstructionsBanner } = await createComponent({})
    expect(hasClassAfpSharedInstructionsBanner()).toBeTruthy()
  })

  it("doit pouvoir changer la couleur du component'", async () => {
    const { change, getColor } = await createComponent({
      title: 'Internal Server error',
      content: 'Error outbound array',
      bannerColor: 'primary',
    })
    change({ bannerColor: 'accent' })
    expect(getColor('accent')).toBeTruthy()
    change({ bannerColor: 'primary' })
    expect(getColor('primary')).toBeTruthy()
    change({ bannerColor: 'warn' })
    expect(getColor('warn')).toBeTruthy()
  })
  it('doit afficher le titre et le content', async () => {
    const data = {
      title: 'Internal Server error',
      content: 'Error outbound array',
      bannerColor: 'warn',
    } as Partial<TestApp>
    const { getTitle, getColor } = await createComponent(data)
    expect(await getTitle()).toBe(data.title)
    expect(getColor(data.bannerColor)).toBeTruthy()
    expect(screen.getByText(data.content + '')).toBeTruthy()
  })

  async function createComponent({
    title = '',
    content = '',
    bannerColor = 'accent',
  }: Partial<TestApp>) {
    const { fixture, detectChanges, change } = await render(TestApp, {
      componentProperties: {
        bannerColor,
        title,
        content,
      },
      imports: [InstructionsBannerModule],
    })

    detectChanges()
    const bannerDebugElement = fixture.debugElement.query(
      By.css('afp-shared-instructions-banner')
    )

    return {
      fixture,
      bannerDebugElement,
      change,
      detectChanges,
      hasTitle: async () => screen.queryByRole('heading'),
      getTitle: async () => screen.getByRole('heading').innerHTML,
      getColor: (byColor: ThemePalette) => {
        return (
          byColor &&
          bannerDebugElement.nativeElement.classList.contains('mat-' + byColor)
        )
      },
      hasClassAfpSharedInstructionsBanner: () =>
        By.css('afp-shared-instructions-banner'),
    }
  }
})

/** Test component that contains an MatButton. */
@Component({
  selector: 'test-app',
  template: `
    <afp-shared-instructions-banner
      [color]="bannerColor"
      [title]="title"
      [message]="content"
    ></afp-shared-instructions-banner>
  `,
})
class TestApp {
  @Input()
  bannerColor: ThemePalette

  @Input()
  title = ''

  @Input()
  content = ''
}
