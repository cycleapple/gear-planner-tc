import {BaseModal} from "@xivgear/common-ui/components/modal";
import {el} from "@xivgear/common-ui/components/util";

export function showNewVersionModal() {
    new NewVersionModal().attachAndShowTop();
}

// TODO: maybe make this not have the usual modal backdrop + keep it at the top? Might make it less annoying if it pops up.
/**
 * Modal to inform the user that a new version of the site is available.
 */
export class NewVersionModal extends BaseModal {
    constructor() {
        super();
        this.headerText = '有新版本可用';
        const description = el('p', {}, [
            '網站有新版本可用。建議你重新載入頁面。',
        ]);
        this.contentArea.append(description);
        this.addActionButton('重新載入', () => this.reload());
        this.addCloseButton('關閉');
    }

    private reload(): void {
        const url = new URL(document.location.toString());
        // Like the early reload-on-error and ChunkLoadErrorModal, use a random _cacheBust param to bypass caching.
        url.searchParams.set('_cacheBust', Math.floor(Math.random() * 1_000_000).toString());
        window.location.href = url.toString();
    }
}

customElements.define('new-version-modal', NewVersionModal);
