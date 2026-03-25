import {BaseModal} from "@xivgear/common-ui/components/modal";
import {ACCOUNT_STATE_TRACKER, AccountStateTracker, TokenState} from "../account_state";
import {labeledCheckbox, makeActionButton, quickElement} from "@xivgear/common-ui/components/util";
import {ValidatingForm, vfWrap} from "@xivgear/common-ui/components/forms/validating_form";
import {
    RegisterResponse,
    ValidationErrorResponse,
    ValidationErrorSingle
} from "@xivgear/account-service-client/accountsvc";
import {passwordWithRepeat} from "@xivgear/common-ui/components/forms/form_elements";
import {showPrivacyPolicyModal} from "../../components/general/ads";
import {ChangePasswordModal} from "./change_password_modal";
import {LogoutModal} from "./logout_modal";
import {SheetPickerTable} from "../../components/sheetpicker/saved_sheet_picker";
import {USER_DATA_SYNCER} from "../user_data";
import {FinalizePasswordResetModal} from "./finalize_password_reset_modal";

class AccountModal extends BaseModal {

    constructor(tracker: AccountStateTracker) {
        super();
        this.headerText = '帳號';
        this.contentArea.appendChild(new AccountManagementInner(tracker, b => this.loadingBlockerVisible = b));
    }
}

class AccountManagementInner extends HTMLElement {

    constructor(private readonly tracker: AccountStateTracker, private readonly loadingBlockerHook: (blocked: boolean) => void) {
        super();
        this.style.position = 'relative';
        this.refresh();
    }

    showLoadingBlocker(): void {
        this.loadingBlockerHook(true);
    }

    hideLoadingBlocker(): void {
        this.loadingBlockerHook(false);
    }

    indicateLoading<P extends unknown[], R>(f: (...args: P) => Promise<R>): (...args: P) => Promise<R> {
        return async (...args: P) => {
            this.showLoadingBlocker();
            return await f(...args).finally(() => this.hideLoadingBlocker());
        };
    }

    refresh(): void {
        this.hideLoadingBlocker();
        // States:
        // Logged in, verified: Display account management (display name change, email change).
        // Logged in, not verified: Display verification code form, with option to enter code or resend code.
        // Not logged in: Display login form and registration form.
        if (this.tracker.loggedIn) {
            const elements: Node[] = [];
            const accountState = this.tracker.accountState;
            const text = quickElement('span', [], ['已登入：', quickElement('br'), accountState.email]);
            elements.push(text);
            elements.push(quickElement('br'));
            const chgPassButton = makeActionButton('更改密碼', () => {
                new ChangePasswordModal(this.tracker, () => this.refresh()).attachAndShowTop();
            });
            elements.push(chgPassButton);
            const logoutButton = makeActionButton('登出', this.indicateLoading(async () => {
                new LogoutModal(this.tracker, () => this.refresh()).attachAndShowTop();
            }));
            elements.push(logoutButton);
            if (!accountState.verified) {
                // UI for verifying email.
                const txt = quickElement('span', [], ['你的電子郵件尚未驗證。如果你剛註冊，應該已收到驗證碼。']);
                const verificationCodeInput = quickElement('input', ['verification-code-input'], []);
                verificationCodeInput.placeholder = '驗證碼';
                verificationCodeInput.type = 'text';
                const submitButton = makeActionButton('提交', () => {
                });
                submitButton.type = 'submit';
                const resendButton = makeActionButton('重新發送', () => this.indicateLoading(async () => {
                    try {
                        await this.tracker.resendVerificationCode(); // TODO test
                        alert('驗證碼已重新發送');
                    }
                    catch (e) {
                        console.error("error re-sending verification code", e);
                        alert('發送驗證碼時發生錯誤，請稍後再試。');
                    }
                })());
                const verifyForm = quickElement('form', [], [txt, verificationCodeInput, resendButton, submitButton]);
                verifyForm.addEventListener('submit', this.indicateLoading(async (e) => {
                    e.preventDefault();
                    verificationCodeInput.classList.remove('failed');
                    const verified = await this.tracker.submitVerificationCode(parseInt(verificationCodeInput.value)); // TODO test
                    if (verified) {
                        this.refresh();
                    }
                    else {
                        verificationCodeInput.classList.add('failed');
                    }
                }));
                elements.push(verifyForm);
            }
            this.replaceChildren(...elements);
        }
        else {
            // Login section
            const children: HTMLElement[] = [];
            {
                const loginHeader = quickElement('h3', [], ['登入']);
                const email = quickElement('input', ['email-field'], []);
                email.type = 'email';
                email.placeholder = '電子郵件';
                email.autocomplete = 'email';
                const passwordField = quickElement('input', ['password-field'], []);
                passwordField.type = 'password';
                passwordField.placeholder = '密碼';
                passwordField.autocomplete = 'current-password';
                const loginButton = makeActionButton('登入', () => {
                });
                loginButton.type = 'submit';

                const forgotButton = makeActionButton('忘記密碼', this.indicateLoading(async () => {
                    try {
                        const result = await this.tracker.startPasswordReset(email.value);
                        if (result === 'success') {
                            // Display the dialog to enter the code to reset the password
                            new FinalizePasswordResetModal(email.value, this.tracker).attachAndShowTop();
                        }
                        else {
                            email.focus();
                            loginHeader.classList.add('failed');
                            loginHeader.textContent = '找不到使用該電子郵件的帳號';
                        }
                    }
                    catch (e) {
                        console.error("error starting password reset", e);
                        alert('啟動密碼重設流程時發生錯誤。');
                    }
                }));

                const loginForm = quickElement('form', ['login-form'], [loginHeader, email, passwordField, loginButton, forgotButton]);
                loginForm.addEventListener('submit', this.indicateLoading(async (e) => {
                    e.preventDefault();
                    const accountInfo = await this.tracker.login(email.value, passwordField.value);
                    if (accountInfo === null) {
                        // Login failed
                        loginHeader.classList.add('failed');
                        loginHeader.textContent = '登入失敗';
                    }
                    else {
                        // Login succeeded
                        await this.tracker.refreshInfo();
                        this.refresh();
                    }
                }));
                children.push(loginForm);
            }
            // Divider
            {
                const divider = quickElement('h3', ['divider-heading'], ['或']);
                children.push(divider);
            }
            // Register section
            {
                const registerHeader = quickElement('h3', [], ['註冊']);
                const email = quickElement('input', ['email-field'], []);
                email.type = 'email';
                email.placeholder = '電子郵件（不公開顯示）';
                email.autocomplete = 'email';
                email.setAttribute('validation-field', 'email');
                const pwrf = passwordWithRepeat();
                const displayName = quickElement('input', ['display-name-field'], []);
                displayName.type = 'text';
                displayName.placeholder = '顯示名稱（可更改）';
                displayName.autocomplete = 'username';
                displayName.setAttribute('validation-field', 'displayName');
                // TODO: captcha if required

                const privacyCheckbox = document.createElement('input');
                privacyCheckbox.type = 'checkbox';
                const privacyLink = quickElement('a', [], ['隱私權政策']);
                privacyLink.href = '#';
                privacyLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPrivacyPolicyModal();
                });
                const privacyCbl = labeledCheckbox(quickElement('span', [], ['我同意', privacyLink]), privacyCheckbox);
                privacyCheckbox.addEventListener('change', () => {
                    privacyCbl.classList.remove('failed');
                });
                privacyCbl.setAttribute('validation-field', 'privacy');

                const cookieCheckbox = document.createElement('input');
                cookieCheckbox.type = 'checkbox';
                const cookieCbl = labeledCheckbox(quickElement('span', [], ['我同意使用 Cookie（帳號服務所需）']), cookieCheckbox);
                cookieCbl.addEventListener('change', () => {
                    cookieCbl.classList.remove('failed');
                });
                cookieCbl.setAttribute('validation-field', 'cookie');

                const submitButton = makeActionButton('註冊', () => {
                });
                submitButton.type = 'submit';
                const outer = this;
                const registrationForm = new ValidatingForm<RegisterResponse>({
                    afterSubmitAttempt(valid: boolean): void {
                        registerHeader.classList.toggle('failed', !valid);
                    },
                    children: [
                        registerHeader,
                        email,
                        pwrf.passwordField,
                        pwrf.passwordRepeatField,
                        displayName,
                        privacyCbl,
                        cookieCbl,
                        submitButton,
                    ],
                    async onSuccess(value: RegisterResponse): Promise<void> {
                        // Login succeeded
                        await outer.tracker.refreshInfo();
                        outer.refresh();
                    },
                    preValidate(): ValidationErrorSingle[] | null {
                        const out: ValidationErrorSingle[] = [];
                        if (!privacyCheckbox.checked) {
                            out.push({
                                field: 'privacy',
                                message: '你必須同意隱私權政策',
                            });
                        }
                        if (!cookieCheckbox.checked) {
                            out.push({
                                field: 'cookie',
                                message: '你必須同意使用 Cookie，因為登入需要使用',
                            });
                        }
                        if (!pwrf.isValid()) {
                            out.push({
                                field: 'password',
                                message: '密碼不一致',
                            });
                        }
                        return out;
                    },
                    submit(): Promise<ValidationErrorResponse | RegisterResponse> {
                        return outer.tracker.register(email.value, pwrf.getValue(), displayName.value);
                    },
                    wrapper: vfWrap(() => this.showLoadingBlocker(), () => this.hideLoadingBlocker()),
                });

                children.push(registrationForm);
            }
            this.replaceChildren(...children);

        }
    }
}

export function showAccountModal() {
    new AccountModal(ACCOUNT_STATE_TRACKER).attachAndShowExclusively();
}

export function setupAccountUi() {
    // First, find the button
    const accountButton = document.querySelector('#account-button');
    if (!accountButton) {
        console.error("Could not find account button");
        reportError('Could not find account button');
        return;
    }
    accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        showAccountModal();
    });
    const accountButtonText = accountButton.lastElementChild;
    ACCOUNT_STATE_TRACKER.addAccountStateListener((tracker, after, before) => {
        const body = document.querySelector('body');
        if (!body) {
            return;
        }
        if (tracker.loggedIn) {
            if (tracker.accountState.verified) {
                body.setAttribute('data-accountstate', 'logged-in-verified');
            }
            else {
                body.setAttribute('data-accountstate', 'logged-in-unverified');
            }
            accountButtonText.textContent = '帳號';
            if (tracker.token === null) {
                body.setAttribute('data-tokenstate', 'not-loaded');
            }
            else {
                if (tracker.hasVerifiedToken) {
                    body.setAttribute('data-tokenstate', 'verified');
                }
                else {
                    body.setAttribute('data-tokenstate', 'not-verified');
                }
            }
        }
        else {
            accountButtonText.textContent = '登入';
            body.setAttribute('data-accountstate', 'not-logged-in');
            body.setAttribute('data-tokenstate', 'not-logged-in');
        }
        // Also update a body-level class
    });
    // Refresh sheet picker after transitioning from logged out to logged in,
    // but only if the sheet picker table is visible
    ACCOUNT_STATE_TRACKER.addTokenListener((oldState: TokenState | null, newState: TokenState) => {
        console.log('token state changed', newState, oldState);
        if (newState.verified && !oldState?.verified) {
            document.querySelectorAll('table').forEach(table => {
                if (table instanceof SheetPickerTable) {
                    USER_DATA_SYNCER.triggerRefreshNow();
                }
            });
        }
    });
}

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        showAccountModal?: typeof showAccountModal;
    }
}
window.showAccountModal = showAccountModal;

customElements.define('account-modal', AccountModal);
customElements.define('account-inner', AccountManagementInner);
