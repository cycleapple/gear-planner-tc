import {LoadingBlocker} from "@xivgear/common-ui/components/loader";
import {makeActionButton} from "@xivgear/common-ui/components/util";
import {parseImport} from "@xivgear/core/imports/imports";
import {getSetFromEtro} from "@xivgear/core/external/etro_import";
import {DEFAULT_BIS_SERVICE, DEFAULT_SHORTLINK_SERVICE} from "../../services/default_services";
import {NamedSection} from "../general/section";
import {GearPlanSheetGui} from "../sheet/sheet_gui";
import {JobName} from "@xivgear/xivmath/xivconstants";
import {extractSingleSet} from "@xivgear/core/util/sheet_utils";
import {GRAPHICAL_SHEET_PROVIDER} from "../sheet/provider";

export class ImportSheetArea extends NamedSection {
    private readonly loader: LoadingBlocker;
    private readonly importButton: HTMLButtonElement;
    private readonly textArea: HTMLTextAreaElement;

    constructor(private sheetOpenCallback: (sheet: GearPlanSheetGui) => Promise<void>) {
        super('匯入配裝表');

        const explanation = document.createElement('p');
        explanation.textContent = '這將匯入為新的配裝表。你可以貼上配裝規劃器連結、配裝規劃器 JSON 或 Etro 連結。';
        this.contentArea.appendChild(explanation);

        const textAreaDiv = document.createElement("div");
        textAreaDiv.id = 'set-import-textarea-holder';

        this.textArea = document.createElement("textarea");
        this.textArea.id = 'set-import-textarea';
        this.textArea.placeholder = '在此貼上連結或 JSON';
        textAreaDiv.appendChild(this.textArea);
        this.loader = new LoadingBlocker();
        this.loader.classList.add('with-bg');


        this.appendChild(this.loader);
        this.contentArea.appendChild(textAreaDiv);
        textAreaDiv.appendChild(document.createElement("br"));

        this.importButton = makeActionButton("匯入", () => this.doImport());
        this.contentArea.appendChild(this.importButton);
        this.ready = true;
    }

    // eslint-disable-next-line accessor-pairs
    set ready(ready: boolean) {
        if (ready) {
            this.loader.hide();
            this.importButton.disabled = false;
        }
        else {
            this.loader.show();
            this.importButton.disabled = true;
        }
    }

    doImport() {
        const text = this.textArea.value;
        const parsed = parseImport(text);
        if (parsed) {
            switch (parsed.importType) {
                case "json":
                    try {
                        this.doJsonImport(parsed.rawData, undefined);
                    }
                    catch (e) {
                        console.error('Import error', e);
                        alert('匯入錯誤');
                    }
                    return;
                case "shortlink":
                    this.doAsyncImport(() => DEFAULT_SHORTLINK_SERVICE.getShortLink(decodeURIComponent(parsed.rawUuid)), parsed.onlySetIndex);
                    return;
                case "etro":
                    this.ready = false;
                    Promise.all(parsed.rawUuids.map(getSetFromEtro)).then(sets => {
                        const jobs = new Set<JobName>();
                        sets.forEach(set => jobs.add(set.job));
                        if (jobs.size > 1) {
                            const confirmed = confirm(`提供的套裝職業不一致。配裝表將根據第一個連結設定為 ${sets[0].job} 配裝表。若要更改職業，請重新排列 URL，或建立後使用「另存為」。`);
                            if (!confirmed) {
                                this.ready = true;
                                return;
                            }
                        }
                        const sheet = GRAPHICAL_SHEET_PROVIDER.fromSetExport(...sets);
                        this.sheetOpenCallback(sheet);
                        console.log("Loaded set from Etro");
                    }, err => {
                        this.ready = true;
                        console.error("Error loading set from Etro", err);
                        alert('載入 Etro 套裝時發生錯誤');
                    });
                    return;
                case "bis":
                    this.doAsyncImport(() => DEFAULT_BIS_SERVICE.getBisSheet(parsed.path), parsed.onlySetIndex);
                    return;
            }
        }
        console.error("Error loading imported data", text);
        alert('這看起來不是有效的匯入資料。');
    }

    doAsyncImport(provider: () => Promise<string>, onlySetIndex: number | undefined) {
        this.ready = false;
        provider().then(raw => {
            this.doJsonImport(raw, onlySetIndex);
        }, err => {
            this.ready = true;
            console.error("Error importing set/sheet", err);
            alert('載入套裝/配裝表時發生錯誤');
        });
    }

    doJsonImport(text: string, onlySetIndex: number | undefined) {
        const rawImport = JSON.parse(text);
        if ('sets' in rawImport && rawImport.sets.length) {
            if (onlySetIndex !== undefined && onlySetIndex in rawImport.sets) {
                const single = extractSingleSet(rawImport, onlySetIndex);
                if (single === undefined) {
                    alert(`Error: Set index ${onlySetIndex} is not valid.`);
                    return;
                }
                this.sheetOpenCallback(GRAPHICAL_SHEET_PROVIDER.fromSetExport(single));
            }
            else {
                this.sheetOpenCallback(GRAPHICAL_SHEET_PROVIDER.fromExport(rawImport));
            }
        }
        else if ('name' in rawImport && 'items' in rawImport) {
            this.sheetOpenCallback(GRAPHICAL_SHEET_PROVIDER.fromSetExport(rawImport));
        }
        else {
            alert("這看起來不是有效的配裝表或套裝");
        }
    }
}

customElements.define("import-sheet-area", ImportSheetArea);
