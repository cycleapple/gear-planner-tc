import {BaseModal} from "@xivgear/common-ui/components/modal";
import {SheetHandle} from "@xivgear/core/persistence/saved_sheets";
import {quickElement} from "@xivgear/common-ui/components/util";
import {UserDataSyncer} from "../../account/user_data";

export class ConflictResolutionDialog extends BaseModal {

    private currentSheet: SheetHandle;
    private saveAsButton: HTMLButtonElement;

    constructor(sheet: SheetHandle, private readonly uds: UserDataSyncer) {
        super();
        this.headerText = '衝突解決';
        this.addActionButton('保留本機', () => {
            this.currentSheet.conflictResolutionStrategy = 'keep-local';
            this.done();
        });
        this.addActionButton('保留遠端', () => {
            this.currentSheet.conflictResolutionStrategy = 'keep-remote';
            this.done();
        });
        this.saveAsButton = this.addActionButton('本機另存為...', () => {
            // Save local as a new sheet, then ditch the local data
            this.currentSheet.saveLocalAsDefault();
            this.currentSheet.conflictResolutionStrategy = 'keep-remote';
            this.done();
        });
        this.addCloseButton('取消');
        this.setSheet(sheet);
    }

    setSheet(sheet: SheetHandle) {
        this.currentSheet = sheet;
        const topText = `The set '${sheet.name}' has been modified on multiple devices. You can choose to discard your local changes, discard the remote changes, or save your local changes as a new sheet.`;
        const left = conflictSubArea('Local', sheet.meta.localDeleted);
        const right = conflictSubArea('Remote', sheet.meta.serverDeleted);
        const mid = quickElement('div', ['conflict-resolution-mid'], [left, right]);
        // If local is deleted, we can't "Save As".
        // If server is deleted, then we can just force push instead of save as.
        this.saveAsButton.disabled = sheet.meta.serverDeleted || sheet.meta.localDeleted;
        this.contentArea.replaceChildren(topText, mid);
    }

    done() {
        // TODO: this should move to the next sheet
        this.currentSheet.flush();
        this.close();
        console.info(`After conflict resolution: ${this.currentSheet.key} (${this.currentSheet.name}): ${this.currentSheet.syncStatus}`, this.currentSheet);
        this.uds.syncOne(this.currentSheet);
    }
}

function conflictSubArea(label: string, deleted: boolean): HTMLDivElement {
    const header = quickElement('h3', [], [label]);
    const text = quickElement('p', [], [deleted ? '已刪除' : '已修改']);
    return quickElement('div', [], [header, text]);
}

customElements.define('conflict-resolution-dialog', ConflictResolutionDialog);

