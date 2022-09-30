import { DialogConfirmationData } from './dialog-confirmation-data'
import { MatButtonHarness } from '@angular/material/button/testing'
import { MatDialogHarness } from '@angular/material/dialog/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {
  DialogConfirmationComponent,
  DialogConfirmationComponentModule,
} from './dialog-confirmation.component'
import { CommonModule } from '@angular/common'

describe('DialogConfirmationComponent', () => {
  it("vérifie qu'un titre, que dialog content et qu'un bouton de cancel et de confirmation existe", async () => {
    const { dialogHarness, cancelButton, confirmButton, component } =
      await createComponent()

    component.open()

    expect(await (await dialogHarness()).getTitleText()).toBe(
      'Correct the webstory'
    )

    expect(await (await dialogHarness()).getContentText()).toBe(
      'The field dialog client is empty, do you want to continue your action ?'
    )

    expect(await (await cancelButton()).getText()).toBe('Cancel')
    expect(await (await confirmButton()).getText()).toBe('Confirm')
  })

  it('quand on clique sur le bouton cancel le dialog doit retourner un string vide', async () => {
    const { cancelButton, component } = await createComponent()
    const dialogRef = component.open()
    const spyDialog = jest.spyOn(dialogRef, 'close')
    await (await cancelButton()).click()
    expect(spyDialog).toHaveBeenCalledWith('')
  })

  it('quand on clique sur le bouton confirm le dialog doit retourner true', async () => {
    const { confirmButton, component } = await createComponent()

    const dialogRef = component.open()

    const spyDialog = jest.spyOn(dialogRef, 'close')
    await (await confirmButton()).click()

    expect(spyDialog).toHaveBeenCalledWith(true)
  })

  async function createComponent() {
    await TestBed.configureTestingModule({
      declarations: [DialogTestingComponent, DialogConfirmationComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        NoopAnimationsModule,
        DialogConfirmationComponentModule,
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(DialogTestingComponent)
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture)

    fixture.detectChanges()

    const dialogHarness = async () => loader.getHarness(MatDialogHarness)

    const cancelButtonHarness = () =>
      loader.getHarness(MatButtonHarness.with({ text: 'Cancel' }))

    const optionButtonHarness = () =>
      loader.getHarness(MatButtonHarness.with({ text: 'Confirm' }))

    return {
      component: fixture.componentInstance,
      fixture,

      dialogHarness,
      cancelButton: cancelButtonHarness,
      confirmButton: optionButtonHarness,
    }
  }
})

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'dialog-harness-example',
  template: `<div></div>`,
})
export class DialogTestingComponent {
  constructor(readonly dialog: MatDialog) {}

  open() {
    return this.dialog.open<
      DialogConfirmationComponent,
      DialogConfirmationData
    >(DialogConfirmationComponent, {
      data: {
        actionLabel: 'Confirm',
        content:
          'The field dialog client is empty, do you want to continue your action ?',
        title: 'Correct the webstory',
      },
    })
  }
}
