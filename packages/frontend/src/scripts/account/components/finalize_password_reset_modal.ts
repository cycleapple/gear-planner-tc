import {BaseModal} from "@xivgear/common-ui/components/modal";
import {AccountStateTracker} from "../account_state";
import {makeActionButton, quickElement} from "@xivgear/common-ui/components/util";
import {passwordWithRepeat} from "@xivgear/common-ui/components/forms/form_elements";
import {ValidatingForm, ValidationErrorSingle, vfWrap} from "@xivgear/common-ui/components/forms/validating_form";
import {ValidationErrorResponse} from "@xivgear/account-service-client/accountsvc";

export class FinalizePasswordResetModal extends BaseModal {

    constructor(email: string, private readonly acs: AccountStateTracker) {
        super();
        const outer = this;
        this.headerText = '重設密碼';
        const text = quickElement('span', [], ['請輸入我們發送到 ', quickElement('b', [], [email]), ' 的驗證碼。']);
        const tokenField = quickElement('input', ['password-field'], []);
        tokenField.placeholder = '密碼重設驗證碼';
        tokenField.pattern = '[0-9]*';
        tokenField.inputMode = 'numeric';
        // TODO: should this be data-validation-field
        tokenField.setAttribute('validation-field', 'token');
        const pwrf = passwordWithRepeat('新密碼', 'newPassword');

        const submitButton = makeActionButton('送出', () => {
        });
        submitButton.type = 'submit';
        const cancelButton = makeActionButton('取消', () => outer.close());
        const buttonArea = quickElement('div', ['button-area'], [submitButton, cancelButton]);

        const form = new ValidatingForm<'success'>({
            async submit(): Promise<ValidationErrorResponse | 'success'> {
                return await outer.acs.finalizePasswordReset(email, parseInt(tokenField.value), pwrf.passwordField.value);
            },
            children: [
                text,
                tokenField,
                pwrf.passwordField,
                pwrf.passwordRepeatField,
                buttonArea,
            ],
            preValidate(): ValidationErrorSingle[] | null {
                const out: ValidationErrorSingle[] = [];
                if (!pwrf.isValid()) {
                    out.push({
                        field: 'password',
                        message: '密碼不一致',
                    });
                }
                return out;
            },
            async onSuccess(value: 'success'): Promise<void> {
                alert('你的密碼已變更。你現在可以使用新密碼登入。');
                // Don't refresh the account modal - we want the email to stay
                outer.close();
            },
            wrapper: vfWrap(() => outer.showLoadingBlocker(), () => outer.hideLoadingBlocker()),
        });
        this.contentArea.appendChild(form);
    }
}

customElements.define('finalize-password-reset-modal', FinalizePasswordResetModal);
