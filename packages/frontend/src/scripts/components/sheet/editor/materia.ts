import {CharacterGearSet} from "@xivgear/core/gear";
import {
    EquipmentSet,
    EquippedItem,
    EquipSlots,
    Materia,
    MATERIA_FILL_MODES,
    MateriaAutoFillController,
    MateriaFillMode,
    MeldableMateriaSlot,
    RawStatKey
} from "@xivgear/xivmath/geartypes";
import {MateriaSubstat, MAX_GCD, STAT_ABBREVIATIONS, STAT_FULL_NAMES} from "@xivgear/xivmath/xivconstants";
import {
    el,
    FieldBoundDataSelect,
    FieldBoundFloatField,
    labelFor,
    makeActionButton,
    quickElement
} from "@xivgear/common-ui/components/util";
import {GearPlanSheet} from "@xivgear/core/sheet";
import {recordEvent} from "@xivgear/common-ui/analytics/analytics";
import {GearPlanSheetGui} from "../sheet_gui";
import {recordCurrentSheetEvent} from "../../../analytics/analytics";
import {MODAL_CONTROL} from "@xivgear/common-ui/modalcontrol";
import {makeLockIcon, makeNewSheetIcon, makePlusIcon, makeTrashIcon} from "@xivgear/common-ui/components/icons";
import {materiaShortLabel} from "@xivgear/core/materia/materia_utils";

/**
 * Component for managing all materia slots on an item
 */
export class AllSlotMateriaManager extends HTMLElement {
    private _children: SlotMateriaManager[] = [];

    constructor(private sheet: GearPlanSheet,
                private gearSet: CharacterGearSet,
                private slotName: keyof EquipmentSet,
                private readonly editable: boolean,
                private extraCallback: () => void = () => {
                }) {
        super();
        this.refresh();
        this.classList.add("all-slots-materia-manager");
        this.updateDisplay();
    }

    notifyChange() {
        this.gearSet.forceRecalc();
        this.extraCallback();
        this.updateDisplay();
    }

    updateDisplay() {
        const children = [...this._children];
        if (children.length === 0) {
            return;
        }
        const materiaPartial: Materia[] = [];
        for (let i = 0; i < children.length; i++) {
            const slot = children[i];
            const materia = slot.materiaSlot.equippedMateria;
            if (materia) {
                materiaPartial.push(materia);
                const statDetail = this.gearSet.getStatDetail(this.slotName, materia.primaryStat, materiaPartial);
                if (statDetail instanceof Object) {
                    slot.overcap = statDetail.overcapAmount;
                }
                else {
                    slot.overcap = 0;
                }
            }
            else {
                slot.overcap = 0;
            }
        }
    }

    refresh() {
        const equipSlot: EquippedItem | null | undefined = this.gearSet.equipment[this.slotName];
        if (equipSlot) {
            if (equipSlot.melds.length === 0) {
                this.classList.remove("materia-slot-no-equip");
                this.classList.add("materia-slot-no-slots");
                this.classList.remove("materia-manager-equipped");
                const textSpan = document.createElement("span");
                if (equipSlot.gearItem.isCustomRelic) {
                    textSpan.textContent = "點擊欄位以編輯肝武屬性";
                }
                else if (equipSlot.gearItem.isSyncedDown) {
                    textSpan.textContent = "因裝備等級同步，無法鑲嵌";
                }
                else {
                    textSpan.textContent = "此裝備無魔晶石槽位";
                }
                this.replaceChildren(textSpan);
                this._children = [];
            }
            else {
                this._children = equipSlot.melds.map(meld => new SlotMateriaManager(this.sheet, meld, () => this.notifyChange(), this.editable));
                this.replaceChildren(...this._children);
                this.classList.remove("materia-slot-no-equip");
                this.classList.remove("materia-slot-no-slots");
                this.classList.add("materia-manager-equipped");
            }
        }
        else {
            const textSpan = document.createElement("span");
            textSpan.textContent = "未選擇裝備";
            this.replaceChildren(textSpan);
            this.classList.add("materia-slot-no-equip");
            this.classList.remove("materia-slot-no-slots");
            this.classList.remove("materia-manager-equipped");
            this._children = [];
        }
    }

    refreshFull(): void {
        this.refresh();
        this.updateDisplay();
    }
}

/**
 * UI for picking a single materia slot
 */
export class SlotMateriaManager extends HTMLElement {

    private popup: SlotMateriaManagerPopup | undefined;
    private readonly text: HTMLSpanElement;
    private readonly image: HTMLImageElement;
    private _overcap: number;

    constructor(private sheet: GearPlanSheet, public materiaSlot: MeldableMateriaSlot, private callback: () => void, readonly editable: boolean) {
        super();
        this.classList.add("slot-materia-manager");
        if (!materiaSlot.materiaSlot.allowsHighGrade) {
            this.classList.add("materia-slot-overmeld");
        }
        this.classList.add("slot-materia-manager");
        if (editable) {
            this.addEventListener('mousedown', (ev) => {
                if (ev.altKey) {
                    this.materiaSlot.equippedMateria = null;
                    callback();
                    this.reformat();
                }
                else if (ev.ctrlKey) {
                    this.materiaSlot.locked = !this.materiaSlot.locked;
                    sheet.requestSave();
                    this.reformat();
                }
                else {
                    this.showPopup();
                }
                ev.stopPropagation();
                ev.preventDefault();
            });
            this.classList.add('editable');
        }
        else {
            this.classList.add('readonly');
        }
        const imageHolder = document.createElement("div");
        imageHolder.classList.add("materia-image-holder");
        this.image = document.createElement("img");
        this.text = document.createElement("span");
        this.overcap = 0;
        imageHolder.appendChild(this.image);
        this.appendChild(imageHolder);
        this.appendChild(this.text);
    }

    showPopup() {
        if (!this.popup) {
            this.popup = new SlotMateriaManagerPopup(this.sheet, this.materiaSlot, () => {
                this.callback();
                this.popupOpen = false;
                this.reformat();
            });
            this.appendChild(this.popup);
        }
        this.popup.show();
        this.popupOpen = true;
    }

    // eslint-disable-next-line accessor-pairs
    set popupOpen(open: boolean) {
        this.classList.toggle('materia-manager-active', open);
    }


    reformat() {
        const currentMat = this.materiaSlot.equippedMateria;
        // TODO: can the ordering be improved here?
        let title: string;
        const editable = this.editable;
        if (currentMat) {
            const hr = currentMat.iconUrl.toString();
            const lr = hr.replaceAll("_hr1", "");
            this.image.src = lr;
            this.image.srcset = `${lr} 1.3x, ${hr} 2x`;
            this.image.style.display = 'block';
            const displayedNumber = Math.max(0, currentMat.primaryStatValue - this._overcap);
            this.text.textContent = `${displayedNumber} ${STAT_ABBREVIATIONS[currentMat.primaryStat]}`;
            this.classList.remove("materia-slot-empty");
            this.classList.add("materia-slot-full");
            title = formatMateriaTitle(currentMat);
            if (editable) {
                title += `\n\nAlt+點擊移除。`;
            }
        }
        else {
            this.image.style.display = 'none';
            this.image.src = '';
            this.text.textContent = '空';
            this.classList.remove('materia-normal', 'materia-overcap', 'materia-overcap-major', 'materia-slot-full');
            // this.classList.remove('materia-slot-full', 'materia-normal', 'materia-overcap', 'materia-overcap-major')
            this.classList.add("materia-slot-empty");
            if (editable) {
                title = '點擊選擇魔晶石\n';
            }
            else {
                title = '空';
            }
        }
        if (editable) {
            title += `\nCtrl+點擊${this.materiaSlot.locked ? '解鎖' : '鎖定此槽位，防止自動填充/求解器影響'}。`;
        }
        const locked = this.materiaSlot.locked;
        const displayAsLocked = locked && editable;
        this.classList.toggle('materia-slot-locked', displayAsLocked);
        this.classList.toggle('materia-slot-unlocked', !displayAsLocked);
        if (locked && editable) {
            title = '此槽位已鎖定。自動填充和求解器不會影響此槽位。\n' + title;
        }
        this.title = title;
    }

    // eslint-disable-next-line accessor-pairs
    set overcap(overcap: number) {
        if (overcap === this._overcap) {
            return;
        }
        this.classList.remove('materia-normal', 'materia-overcap', 'materia-overcap-major');
        this._overcap = overcap;
        if ((this.materiaSlot.equippedMateria === undefined) || overcap <= 0) {
            this.classList.add('materia-normal');
        }
        else if (overcap < this.materiaSlot.equippedMateria.primaryStatValue) {
            this.classList.add('materia-overcap');
        }
        else {
            this.classList.add('materia-overcap-major');
        }
        this.reformat();
    }
}

export class SingleMateriaViewOnly extends HTMLElement {

    private readonly text: HTMLSpanElement;
    private readonly image: HTMLImageElement;

    constructor(materia: Materia) {
        super();
        this.classList.add("single-materia-view-only");
        const imageHolder = el("div", {class:"materia-image-holder"});
        this.image = document.createElement("img");
        this.text = el("span", {}, [materiaShortLabel(materia)]);
        imageHolder.appendChild(this.image);
        this.appendChild(imageHolder);
        this.appendChild(this.text);
        const hr = materia.iconUrl.toString();
        const lr = hr.replaceAll("_hr1", "");
        this.image.src = lr;
        this.image.srcset = `${lr} 1.3x, ${hr} 2x`;
        this.image.style.display = 'block';
        this.classList.remove("materia-slot-empty");
        this.classList.add("materia-slot-full");
    }
}

export class MateriaCountDisplay extends HTMLElement {
    constructor(public readonly materia: Materia, public readonly count: number) {
        super();
        this.replaceChildren(
            quickElement('div', ['materia-count-quantity'], [document.createTextNode(count + 'x')]),
            new SingleMateriaViewOnly(materia));
        this.title = formatMateriaTitle(materia);
    }
}

export function formatMateriaTitle(materia: Materia): string {
    return `${materia.nameTranslation}: +${materia.primaryStatValue} ${STAT_FULL_NAMES[materia.primaryStat]}`;
}

function toRomanNumeral(grade: number) {
    const romanNumerals = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    ];
    return romanNumerals[grade - 1] ?? '';
}

export class SlotMateriaManagerPopup extends HTMLElement {

    constructor(private sheet: GearPlanSheet, private materiaSlot: MeldableMateriaSlot, private callback: () => void) {
        super();
        this.hide();
    }

    show() {
        const allMateria = this.sheet.getRelevantMateriaFor(this.materiaSlot);
        const typeMap: { [K in RawStatKey]?: Materia[] } = {};
        const stats: RawStatKey[] = [];
        const grades: number[] = [];
        for (const materia of allMateria) {
            if (materia.materiaGrade > this.materiaSlot.materiaSlot.maxGrade
                || materia.isHighGrade && !this.materiaSlot.materiaSlot.allowsHighGrade) {
                continue;
            }
            (typeMap[materia.primaryStat] = typeMap[materia.primaryStat] ?? []).push(materia);
            if (!stats.includes(materia.primaryStat)) {
                stats.push(materia.primaryStat);
            }
            if (!grades.includes(materia.materiaGrade)) {
                grades.push(materia.materiaGrade);
            }
        }
        grades.sort((grade1, grade2) => grade2 - grade1);
        const table = el("table");
        const body = table.createTBody();
        const headerRow = body.insertRow();
        // Blank top-left
        const trash = el('div', {
            classes: ['materia-picker-remove', 'materia-picker-special-button'],
            title: '移除此魔晶石',
        }, [makeTrashIcon()]);
        trash.addEventListener('mousedown', (ev) => {
            this.submit(undefined);
            ev.stopPropagation();
        });
        const trashCell = el("th", {}, [trash]);

        const lock = el('div', {
            classes: ['materia-picker-lock', 'materia-picker-special-button'],
        }, [makeLockIcon()]);
        const slot = this.materiaSlot;
        function checkLock() {
            if (slot.locked) {
                lock.classList.add('locked');
                lock.classList.remove('unlocked');
                lock.title = '此槽位已鎖定。自動填充和求解器不會影響此槽位。\n\n點擊解鎖。';
            }
            else {
                lock.classList.add('unlocked');
                lock.classList.remove('locked');
                lock.title = '此槽位未鎖定。可能被自動填充和求解器影響。\n\n點擊鎖定。';
            }
        }
        lock.addEventListener('mousedown', (ev) => {
            this.materiaSlot.locked = !this.materiaSlot.locked;
            checkLock();
            ev.stopPropagation();
        });
        checkLock();
        const lockCell = el('th', {}, [lock]);

        headerRow.appendChild(trashCell);
        headerRow.appendChild(lockCell);
        for (const stat of stats) {
            const headerCell = el("th", {classes: ['stat-' + stat, 'primary']}, [STAT_ABBREVIATIONS[stat]]);
            headerRow.appendChild(headerCell);
        }
        for (const grade of grades) {
            const row = body.insertRow();
            const romanNumeralCell = row.insertCell();
            romanNumeralCell.textContent = toRomanNumeral(grade);
            romanNumeralCell.style.textAlign = 'right';
            row.insertCell().textContent = `(${grade})`;
            for (const stat of stats) {
                const materia = typeMap[stat]?.find(m => m.materiaGrade === grade);
                if (materia) {
                    const cell = row.insertCell();
                    cell.addEventListener('mousedown', (ev) => {
                        this.submit(materia);
                        ev.stopPropagation();
                    });
                    cell.title = formatMateriaTitle(materia);
                    const image = el("img", {class: 'item-rarity-normal'});
                    image.src = materia.iconUrl.toString();
                    image.setAttribute('intrinsicsize', '80x80');
                    if (this.materiaSlot.equippedMateria === materia) {
                        cell.setAttribute("is-selected", "true");
                    }
                    // Needed in order to make selection outline work
                    cell.appendChild(document.createElement('span'));
                    image.addEventListener('load', () => {
                        image.classList.add('loaded');
                    });
                    cell.appendChild(image);
                }
                else {
                    row.insertCell();
                }
            }
        }
        this.replaceChildren(table);
        const self = this;
        MODAL_CONTROL.setModal({
            modalElement: self,
            close() {
                self.hide();
            },
        });
        this.style.display = 'block';
        // this.addEventListener('mouseenter', e => {
        //     e.stopPropagation();
        // });
        this.title = '';
    }

    submit(materia: Materia | undefined) {
        this.materiaSlot.equippedMateria = materia;
        // TODO: should close specifically just this one
        MODAL_CONTROL.closeAll();
        this.callback();
    }

    hide() {
        this.style.display = 'none';
        this.callback();
    }
}

export class MateriaPriorityPicker extends HTMLElement {
    constructor(prioController: MateriaAutoFillController, sheet: GearPlanSheetGui) {
        super();
        // this.appendChild(document.createTextNode('Materia Prio Thing Here'));
        const header = document.createElement('span');
        header.textContent = '魔晶石優先: ';
        const fillModeDropdown = new FieldBoundDataSelect<MateriaAutoFillController, MateriaFillMode>(prioController, 'autoFillMode',
            (val: MateriaFillMode) => {
                switch (val) {
                    case "leave_empty":
                        return "保持空位";
                    case "autofill":
                        return "優先填充";
                    case "retain_slot_else_prio":
                        return "保留槽位 > 優先";
                    case "retain_item_else_prio":
                        return "保留裝備 > 優先";
                    case "retain_slot":
                        return "保留槽位 > 無";
                    case "retain_item":
                        return "保留裝備 > 無";
                    default:
                        return "?";
                }
            }, [...MATERIA_FILL_MODES]);
        fillModeDropdown.title = '控制選擇裝備時的行為。\n' +
            '保持空位: 選擇裝備時不填充任何魔晶石。\n' +
            '優先填充: 根據上方的優先順序填充魔晶石槽位。\n' +
            '保留槽位 > 優先: 保留該槽位上一件裝備的魔晶石。若無已裝備的魔晶石，則使用優先順序。\n' +
            '保留裝備 > 優先: 記住每件裝備上裝備的魔晶石。若無已裝備的魔晶石，則使用優先順序。\n' +
            '保留槽位 > 無: 保留該槽位上一件裝備的魔晶石。若無已裝備的魔晶石，則保持空位。\n' +
            '保留裝備 > 無: 記住每件裝備上裝備的魔晶石。若無已裝備的魔晶石，則保持空位。';
        const fillModeLabel = labelFor("填充模式:", fillModeDropdown);
        fillModeDropdown.addListener((newValue) => {
            recordEvent("fillMode", {
                'mode': newValue,
            });
        });

        const fillEmptyNow = makeActionButton([makePlusIcon(), '填充空位'], () => {
            prioController.fillEmpty();
            recordEvent("fillEmpty");
        }, '根據選定的優先順序填充所有空的魔晶石槽位。');
        fillEmptyNow.classList.add('materia-fill-button');
        const fillAllNow = makeActionButton([makeNewSheetIcon(), '全部填充'], () => {
            prioController.fillAll();
            recordEvent("fillAll");
        }, '清空並根據選定的優先順序重新填充所有魔晶石槽位。');
        fillAllNow.classList.add('materia-fill-button');

        const lockAllEquipped = makeActionButton('鎖定已填', () => {
            prioController.lockFilled();
        }, '鎖定所有已裝備的魔晶石');
        lockAllEquipped.classList.add('narrow-button');

        const lockAllEmpty = makeActionButton('鎖定空位', () => {
            prioController.lockEmpty();
        }, '鎖定所有空的魔晶石槽位');
        lockAllEmpty.classList.add('narrow-button');

        const unlockAll = makeActionButton('全部解鎖', () => {
            prioController.unlockAll();
        }, '解鎖所有槽位');
        unlockAll.classList.add('narrow-button');

        const unequipAll = makeActionButton('移除未鎖定', () => {
            prioController.unequipUnlocked();
        }, '移除所有未鎖定的魔晶石');
        unequipAll.classList.add('narrow-button');

        const tips = quickElement('div', ['meld-solver-tips'], ['提示: Ctrl+點擊魔晶石槽位可鎖定/解鎖。Alt+點擊可移除魔晶石。']);

        const drag = new MateriaDragList(prioController);

        const minGcdText = document.createElement('span');
        minGcdText.textContent = '最低GCD: ';

        const minGcdInput = new FieldBoundFloatField(prioController.prio, 'minGcd', {
            postValidators: [ctx => {
                const val = ctx.newValue;
                // Check if user typed more than 2 digits, weird math because floating point fun
                if (Math.round(val * 1000) % 10) {
                    ctx.failValidation("Enter at most two decimal points");
                }
                else if (val < 0) {
                    ctx.failValidation("Enter a positive number");
                }
                else if (val > MAX_GCD) {
                    ctx.failValidation("Cannot be greater than " + MAX_GCD);
                }
            }],
            fixDecimals: 2,
        });
        minGcdInput.addListener(val => {
            recordCurrentSheetEvent('currentSheet', {
                gcd: val,
            });
        });
        minGcdInput.title = '輸入所需的最低GCD，格式為 x.yz。\n達到目標GCD後，技能速度/詠唱速度魔晶石將被降低優先。';
        minGcdInput.classList.add('min-gcd-input');
        this.replaceChildren(header, drag,
            document.createElement('br'),
            minGcdText, minGcdInput,
            document.createElement('br'),
            fillModeLabel, fillModeDropdown,
            document.createElement('br'),
            fillEmptyNow, fillAllNow,
            document.createElement('br'),
            lockAllEquipped, lockAllEmpty, unlockAll, unequipAll,
            document.createElement('br'),
            tips
        );
    }
}

class MateriaDragger extends HTMLElement {

    index: number;
    readonly inner: HTMLElement;

    constructor(public stat: MateriaSubstat, index: number) {
        super();
        this.classList.add('materia-prio-dragger');
        this.classList.add('materia-dragger-stat-' + stat);
        this.index = index;
        this.inner = document.createElement('div');
        const span = document.createElement('span');
        const abbrev = STAT_ABBREVIATIONS[stat];
        this.title = `拖動以更改 ${abbrev} 魔晶石相對於其他類型的優先順序。`;
        span.textContent = abbrev;
        this.inner.appendChild(span);
        this.inner.classList.add('materia-dragger-inner');
        this.inner.classList.add('stat-' + stat);
        // TODO: make something specifically for this
        this.inner.classList.add('secondary');
        this.inner.classList.add('color-stat-column');
        this.appendChild(this.inner);
        // this.draggable = true;
    }

    // eslint-disable-next-line accessor-pairs
    set xOffset(xOffset: number) {
        let newOffset;
        if (xOffset > this.clientWidth) {
            newOffset = this.clientWidth;
        }
        else if (-xOffset > this.clientWidth) {
            newOffset = -this.clientWidth;
        }
        else {
            newOffset = xOffset;
        }
        this.inner.style.left = newOffset + 'px';

    }

}

export class MateriaDragList extends HTMLElement {

    private subOptions: MateriaDragger[] = [];
    private currentlyDragging: MateriaDragger | undefined;
    private currentDropIndex: number;
    private readonly moveListener: (ev: PointerEvent) => void;
    private readonly upListener: (ev: PointerEvent) => unknown;

    constructor(private prioController: MateriaAutoFillController) {
        super();
        this.style.position = 'relative';
        const statPrio = prioController.prio.statPrio;
        for (let i = 0; i < statPrio.length; i++) {
            const stat = statPrio[i];
            const dragger = new MateriaDragger(stat, i);
            this.subOptions.push(dragger);
            dragger.addEventListener('pointerdown', (ev) => {
                this.currentlyDragging = dragger;
                this.enableEvents();
                ev.preventDefault();
                // TODO: check if still needed
                document.body.style.cursor = 'grabbing';
            });
            // Prevents touchscreen scrolling
            dragger.addEventListener('touchstart', ev => ev.preventDefault());
        }
        this.moveListener = (ev: PointerEvent) => this.handleMouseMove(ev);
        this.upListener = (ev: PointerEvent) => this.handleMouseUp(ev);
        // this.addEventListener('pointermove', this.moveListener);
        this.fixChildren();
    }

    private enableEvents() {
        window.addEventListener('pointermove', this.moveListener);
        window.addEventListener('pointerup', this.upListener);
    }

    private disableEvents() {
        window.removeEventListener('pointermove', this.moveListener);
        window.removeEventListener('pointerup', this.upListener);
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        this.disableEvents();
    }


    private handleMouseUp(ev: PointerEvent) {
        ev.preventDefault();
        if (this.currentlyDragging) {
            this.currentlyDragging.xOffset = 0;
        }
        this.disableEvents();
        this.finishMovement();
        this.currentlyDragging = undefined;
        document.body.style.cursor = '';
        // this.classList.remove('drag-active');
    }

    private handleMouseMove(ev: PointerEvent) {
        if (this.currentlyDragging === undefined) {
            return;
        }
        ev.preventDefault();
        const offsetFromThis = ev.clientX - this.getBoundingClientRect().left;
        for (let i = 0; i < this.subOptions.length; i++) {
            const subOption = this.subOptions[i];
            // Even though we care about the center, we don't divide the width by two because we also need to factor
            // in the width of the thing we're dragging (since it is positioned such that it is centered around the
            // drag cursor).
            const xCenter = subOption.offsetLeft + (subOption.offsetWidth);
            // We want to find the leftmost item that we are to the right of
            if (offsetFromThis <= xCenter) {
                this.currentDropIndex = i;
                break;
            }
        }
        this.processMovement();
        const draggeeOffset = ev.clientX - this.currentlyDragging.getBoundingClientRect().left - (this.currentlyDragging.offsetWidth / 2);
        this.currentlyDragging.xOffset = draggeeOffset;
    }

    private fixChildren() {
        for (let i = 0; i < this.subOptions.length; i++) {
            this.subOptions[i].index = i;
        }
        this.replaceChildren(...this.subOptions);
    }

    private processMovement() {
        const from = this.currentlyDragging ? this.subOptions.indexOf(this.currentlyDragging) : -1;
        const to = this.currentDropIndex;
        if (from === to) {
            return;
        }
        if (from < 0 || to < 0) {
            return;
        }
        this.subOptions.splice(to, 0, this.subOptions.splice(from, 1)[0]);
        this.currentDropIndex = -1;
        this.fixChildren();
    }

    private finishMovement() {
        this.prioController.prio.statPrio = this.subOptions.map(option => option.stat);
        this.prioController.callback();
    }

}

export class MateriaTotalsDisplay extends HTMLElement {
    public readonly empty: boolean;

    constructor(gearSet: CharacterGearSet) {
        super();
        const materiaCounts = new Map<number, Materia[]>();
        for (const equipSlot of EquipSlots) {
            const equip = gearSet.equipment[equipSlot];
            if (equip) {
                for (const meld of equip.melds) {
                    const materia = meld.equippedMateria;
                    if (materia) {
                        const id = materia.id;
                        const materias = materiaCounts.get(id);
                        if (materias) {
                            materias.push(materia);
                        }
                        else {
                            materiaCounts.set(id, [materia]);
                        }
                    }
                }
            }
        }
        const elements: MateriaCountDisplay[] = [];
        materiaCounts.forEach((value, key) => {
            elements.push(new MateriaCountDisplay(value[0], value.length));
        });
        elements.sort((left, right) => {
            const primary = right.count - left.count;
            if (primary === 0) {
                return (right.materia.id - left.materia.id);
            }
            return primary;
        });
        const totalsText = quickElement('div', ['materia-totals-label'], ['合計:']);
        const inner = quickElement('div', ['materia-totals-inner'], elements);
        this.replaceChildren(totalsText, inner);
        this.empty = elements.length === 0;
    }

}

customElements.define("all-slot-materia-manager", AllSlotMateriaManager);
customElements.define("slot-materia-manager", SlotMateriaManager);
customElements.define("single-materia-view-only", SingleMateriaViewOnly);
customElements.define("materia-count-display", MateriaCountDisplay);
customElements.define("materia-totals-display", MateriaTotalsDisplay);
customElements.define("slot-materia-popup", SlotMateriaManagerPopup);
customElements.define("materia-priority-picker", MateriaPriorityPicker);
customElements.define("materia-drag-order", MateriaDragList);
customElements.define("materia-dragger", MateriaDragger);

