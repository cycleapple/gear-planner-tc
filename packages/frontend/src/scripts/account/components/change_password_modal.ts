import {BaseModal} from "@xivgear/common-ui/components/modal";
import {passwordWithRepeat} from "@xivgear/common-ui/components/forms/form_elements";
import {makeActionButton, quickElement} from "@xivgear/common-ui/components/util";
import {ValidatingForm, ValidationErrorSingle, vfWrap} from "@xivgear/common-ui/components/forms/validating_form";
import {ChangePasswordResponse, ValidationErrorResponse} from "@xivgear/account-service-client/accountsvc";
import {AccountStateTracker} from "../account_state";

export class ChangePasswordModal extends BaseModal {

    constructor(private readonly acs: AccountStateTracker, private readonly afterPwChange: () => void) {
        super();

        const outer = this;
        this.headerText = '更改密碼';
        const curPassField = quickElement('input', ['password-field'], []);
        curPassField.type = 'password';
        curPassField.placeholder = '目前密碼';
        curPassField.autocomplete = 'current-password';
        curPassField.setAttribute('validation-field', 'currentPassword');
        const pwrf = passwordWithRepeat('新密碼', 'newPassword');

        const submitButton = makeActionButton('更改', () => {
        });
        submitButton.type = 'submit';
        const cancelButton = makeActionButton('取消', () => outer.close());
        const buttonArea = quickElement('div', ['button-area'], [submitButton, cancelButton]);

        const form = new ValidatingForm<ChangePasswordResponse>({
            async submit(): Promise<ValidationErrorResponse | ChangePasswordResponse> {
                const result = await outer.acs.changePassword(curPassField.value, pwrf.passwordField.value);
                // TODO: consider making a "post validation" method in ValidatingForm that makes this a bit cleaner
                if ('passwordCorrect' in result && !result.passwordCorrect) {
                    return {
                        validationErrors: [{
                            field: 'currentPassword',
                            message: '密碼不正確',
                        }],
                    } satisfies ValidationErrorResponse;
                }
                return result;
            },
            children: [
                curPassField,
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
            async onSuccess(value: ChangePasswordResponse): Promise<void> {
                alert('你的密碼已變更。');
                // TODO: this needs to refresh the account modal
                outer.close();
                afterPwChange();
            },
            wrapper: vfWrap(() => outer.showLoadingBlocker(), () => outer.hideLoadingBlocker()),
        });
        this.contentArea.appendChild(form);
    }
}

customElements.define('change-password-modal', ChangePasswordModal);
