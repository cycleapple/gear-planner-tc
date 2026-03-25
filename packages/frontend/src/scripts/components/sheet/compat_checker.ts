import {BaseModal} from "@xivgear/common-ui/components/modal";
import {GearPlanSheet, SetCompatibilityReport, SlotIncompatibility} from "@xivgear/core/sheet";
import {CharacterGearSet} from "@xivgear/core/gear";
import {col, CustomTable, HeaderRow} from "@xivgear/common-ui/table/tables";
import {el, makeActionButton} from "@xivgear/common-ui/components/util";
import {errorIcon, warningIcon} from "@xivgear/common-ui/components/icons";

export function showCompatOverview(sheet: GearPlanSheet, set: CharacterGearSet) {
    new CompatCheckerOverviewModal(sheet, set).attachAndShowExclusively();
}

class CompatCheckerOverviewModal extends BaseModal {
    constructor(sheet: GearPlanSheet, baseSet: CharacterGearSet) {
        super();
        this.headerText = '相容性檢查';
        const descriptionText = '這會顯示所選套裝與配裝表中其他所有套裝的相容性。' +
            '「相容」表示如果兩個套裝使用了相同的裝備，則已鑲嵌的魔晶石也相同。' +
            '如果裝備不是唯一的，則被視為「軟性不相容」——你仍然可以組裝兩個套裝，但需要額外的裝備。';
        const description = el('div', {class: 'description'}, [descriptionText]);
        const setsToCompare = sheet.sets.filter(otherSet => otherSet !== baseSet);
        if (setsToCompare.length === 0) {
            const msg = el('div', {class: 'no-sets-to-compare'}, [
                '沒有其他套裝可供比較。',
            ]);
            this.contentArea.replaceChildren(descriptionText, msg);
        }
        else {
            const table = new CustomTable<CharacterGearSet>();
            table.columns = [
                col({
                    displayName: '套裝',
                    shortName: 'set',
                    getter: set => set.name,
                }),
                col({
                    displayName: '相容性',
                    shortName: 'compat-result',
                    getter: setB => sheet.checkCompatibility(baseSet, setB),
                    renderer: (value: SetCompatibilityReport, rowValue) => {
                        if (value.compatibilityLevel === 'compatible') {
                            return el('div', {class: 'set-compat-good'}, [
                                '無問題',
                            ]);

                        }
                        else {
                            let icon: SVGSVGElement;
                            if (value.compatibilityLevel === 'soft-incompatible') {
                                icon = warningIcon();
                                icon.classList.add('warning');
                            }
                            else {
                                icon = errorIcon();
                                icon.classList.add('error');
                            }
                            const issueCount = value.incompatibleSlots.length;
                            return makeActionButton([icon, `${issueCount} 個問題`], () => {
                                new CompatCheckerSetModal(value).attachAndShowTop();
                            });
                        }
                    },
                }),
            ];
            table.data = [new HeaderRow(), ...setsToCompare];
            this.contentArea.replaceChildren(description, table);
        }
        this.addCloseButton();
    }
}

class CompatCheckerSetModal extends BaseModal {
    constructor(data: SetCompatibilityReport) {
        super();
        this.headerText = `${data.setA.name} vs ${data.setB.name}`;
        const table = new CustomTable<SlotIncompatibility>();
        table.columns = [
            col({
                displayName: '部位',
                shortName: 'slot',
                getter: incomp => incomp.slotKey,
            }),
            col({
                displayName: '問題類型',
                shortName: 'issuetype',
                getter: (incomp: SlotIncompatibility) => incomp.reason,
                renderer: reason => {
                    let text: string;
                    switch (reason) {
                        case 'materia-mismatch':
                            text = '魔晶石不一致';
                            break;
                        case 'relic-stat-mismatch':
                            text = '肝武屬性不一致';
                            break;
                        default:
                            text = '其他';
                    }
                    return el('div', {class: 'issue-type'}, [text]);
                },
            }),
            col({
                displayName: '詳情',
                shortName: 'detail',
                getter: (incomp: SlotIncompatibility) => incomp.subIssues,
                renderer: subIssues => {
                    return el('div', {class: 'sub-issues-list'},
                        subIssues.map(iss => el('div', {class: 'sub-issue'}, [iss]))
                    );
                },
            }),
        ];
        table.data = [new HeaderRow(), ...data.incompatibleSlots];
        this.contentArea.replaceChildren(table);
        this.addCloseButton();
    }
}

customElements.define('compat-checker-overview-modal', CompatCheckerOverviewModal);
customElements.define('compat-checker-set-modal', CompatCheckerSetModal);
