import {BaseModal} from "@xivgear/common-ui/components/modal";
import {quickElement} from "@xivgear/common-ui/components/util";
import {ResolveReject} from "@xivgear/util/async";

/**
 * Dialog to confirm purging of local data when switching accounts.
 */
export class ConfirmAccountChangeModal extends BaseModal {
    constructor(private readonly promiseOut: ResolveReject<boolean>) {
        super();
        this.headerText = '確認帳號變更';
        const text = quickElement('p', [], ['你之前使用了不同的帳號登入。如果繼續登入，本機資料將被清除並替換為新帳號的資料。']);
        this.contentArea.replaceChildren(text);
        this.addActionButton('刪除資料並切換', ev => this.showLoadingBlockerWhile(async () => {
            promiseOut.resolve(true);
            this.close();
        }));
        this.addActionButton('取消', ev => this.showLoadingBlockerWhile(async () => {
            promiseOut.resolve(false);
            this.close();
        }));
    }

    get explicitCloseOnly(): boolean {
        return true;
    }

    protected onClose() {
        this.promiseOut.resolve(false);
    }
}

customElements.define('confirm-account-change-modal', ConfirmAccountChangeModal);
