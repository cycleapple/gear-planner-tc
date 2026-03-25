import {BaseModal} from "@xivgear/common-ui/components/modal";
import {el} from "@xivgear/common-ui/components/util";

/**
 * Shows a dialog when a webpack chunk (or in future, a web worker script) fails to load.
 * Gives the user the option to reload the page (with cache bust) or continue without the failed feature.
 */
export function showChunkLoadErrorDialog(): void {
    new ChunkLoadErrorModal().attachAndShowExclusively();
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ChunkLoadErrorModal extends BaseModal {
    private reloadButton: HTMLButtonElement;
    private cancelled = false;

    constructor() {
        super();
        this.headerText = '頁面載入錯誤';
        const description = el('p', {}, [
            '必要的腳本載入失敗。重新載入頁面通常可以解決此問題。你可以查看瀏覽器控制台以取得更多詳情。',
            el('br'),
            '頁面將在 10 秒後自動重新載入。',
        ]);
        this.contentArea.appendChild(description);
        this.reloadButton = this.addActionButton('重新載入 (9)', () => this.reload());
        this.addCloseButton('繼續使用');
        this.runCountdownLoop();
    }

    private async runCountdownLoop(): Promise<void> {
        const targetTime = Date.now() + 10_000;
        while (true) {
            const remainingMs = targetTime - Date.now();
            if (remainingMs <= 0) {
                this.reload();
                return;
            }
            const waitMs = remainingMs % 1000 || 1000;
            await delay(waitMs);
            if (this.cancelled) {
                return;
            }
            const remainingAfterWait = targetTime - Date.now();
            const displaySeconds = Math.max(0, Math.min(10, Math.floor(remainingAfterWait / 1000)));
            this.reloadButton.textContent = `重新載入 (${Math.min(9, displaySeconds)})`;
        }
    }

    protected onClose(): void {
        this.cancelled = true;
    }

    private reload(): void {
        const url = new URL(document.location.toString());
        url.searchParams.set('_cacheBust', Math.floor(Math.random() * 1_000_000).toString());
        window.location.href = url.toString();
    }

    get explicitCloseOnly(): boolean {
        return true;
    }
}

customElements.define("chunk-load-error-modal", ChunkLoadErrorModal);
