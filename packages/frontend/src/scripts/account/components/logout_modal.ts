import {BaseModal} from "@xivgear/common-ui/components/modal";
import {quickElement} from "@xivgear/common-ui/components/util";
import {AccountStateTracker} from "../account_state";

export class LogoutModal extends BaseModal {
    constructor(tracker: AccountStateTracker, after: () => void) {
        super();
        this.headerText = '登出';
        const text = quickElement('p', [], ['你可以選擇登出但保留本機資料，或清除本機資料。']);
        this.contentArea.replaceChildren(text);
        this.addActionButton('登出並保留資料', ev => this.showLoadingBlockerWhile(async () => {
            await tracker.logout(false);
            this.close();
            after();
        }));
        this.addActionButton('登出並清除資料', ev => this.showLoadingBlockerWhile(async () => {
            await tracker.logout(true);
            this.close();
            after();
        }));
        this.addCloseButton('取消');
    }
}

customElements.define('logout-modal', LogoutModal);
