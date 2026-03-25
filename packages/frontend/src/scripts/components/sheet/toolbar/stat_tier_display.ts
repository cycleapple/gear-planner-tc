import {CharacterGearSet} from "@xivgear/core/gear";
import {STAT_ABBREVIATIONS, STAT_DISPLAY_ORDER} from "@xivgear/xivmath/xivconstants";
import {RawStatKey, RawStats} from "@xivgear/xivmath/geartypes";
import {
    critDmg,
    detDmg,
    dhitChance,
    mainStatMulti,
    mpTick,
    sksTickMulti,
    sksToGcd,
    spsTickMulti,
    spsToGcd,
    tenacityDmg,
    tenacityIncomingDmg,
    vitToHp
} from "@xivgear/xivmath/xivmath";
import {GearPlanSheet} from "@xivgear/core/sheet";
import {recordSheetEvent} from "../../../analytics/analytics";
import {el} from "@xivgear/common-ui/components/util";

interface Tiering {
    lower: number,
    upper: number
}

interface TieringOffset {
    offset: number,
    // Human-readable label for the offset
    label: string,
    multiplier: number,
}

interface TieringDisplay {
    label: string,
    // Alt short label
    shortLabel?: string,
    fullName: string,
    description: string,
    tieringFunc: (offset: number) => Tiering,
    extraOffsets: TieringOffset[]
}

export class SingleStatTierDisplay extends HTMLDivElement {
    private readonly lowerLeftDiv: HTMLDivElement;
    private readonly lowerRightDiv: HTMLDivElement;
    private readonly upperDiv: HTMLDivElement;
    private readonly upperDivShort: HTMLDivElement;
    private readonly expansionDiv: HTMLDivElement;
    private _expanded: boolean;
    private _clickable: boolean;

    constructor(private stat: RawStatKey) {
        super();
        // Upper area - name of stat/derived value
        this.classList.add('single-stat-tier-display');
        this.classList.add('stat-' + stat);

        this.upperDiv = el('div', {classes: ['single-stat-tier-display-upper', 'single-stat-tier-display-upper-long']});
        this.appendChild(this.upperDiv);

        this.upperDivShort = el('div', {classes: ['single-stat-tier-display-upper', 'single-stat-tier-display-upper-short']});
        this.appendChild(this.upperDivShort);

        // Lower bound
        this.lowerLeftDiv = el('div', {class: 'single-stat-tier-display-lower-left'});
        this.appendChild(this.lowerLeftDiv);
        // Upper bound
        this.lowerRightDiv = el('div', {class: 'single-stat-tier-display-lower-right'});
        this.appendChild(this.lowerRightDiv);

        this.expansionDiv = el('div', {class: 'single-stat-tier-display-expansion'}, ['If you can read this, it is a bug']);
        this.appendChild(this.expansionDiv);

        this.expanded = false;
    }

    refresh(tiering: TieringDisplay): void {
        const doubleClickLabel = 'Click to see values if materia were added or removed.';
        // Formatting of the base element (always visible)
        this.upperDiv.textContent = tiering.label;
        this.upperDiv.title = `${tiering.label}: ${tiering.description}\n\n${doubleClickLabel}`;
        this.upperDivShort.textContent = tiering.shortLabel ?? tiering.label;
        this.upperDivShort.title = `${tiering.label}: ${tiering.description}\n\n${doubleClickLabel}`;
        {
            const baseTiering = tiering.tieringFunc(0);
            if (baseTiering.lower > 0) {
                this.lowerLeftDiv.textContent = '-' + baseTiering.lower;
                this.classList.remove('stat-tiering-perfect');
                this.lowerLeftDiv.title = `Your ${tiering.fullName} is ${baseTiering.lower} above the next-lowest tier.\nIn other words, you could lose up to ${baseTiering.lower} points without negatively impacting your ${tiering.fullName}.\n\n${doubleClickLabel}`;
            }
            else {
                this.lowerLeftDiv.textContent = '✔';
                this.lowerLeftDiv.title = `Your ${tiering.fullName} is perfectly tiered.\nIf you lose any ${this.stat}, it will negatively impact your ${tiering.fullName}.\n\n${doubleClickLabel}`;
                this.classList.add('stat-tiering-perfect');
            }
            this.lowerRightDiv.textContent = '+' + baseTiering.upper;
            this.lowerRightDiv.title = `You must gain ${baseTiering.upper} points of ${this.stat} in order to increase your ${tiering.fullName}.\n\n${doubleClickLabel}`;
        }

        // Formatting of the extra pop-down elements
        let hasSeenNegative: boolean = false;
        const elements: Node[] = [];
        tiering.extraOffsets.forEach((extraOffset) => {
            const tieringResult = tiering.tieringFunc(extraOffset.offset);

            const div = el('div', {class: 'single-stat-tier-display-expansion-item'});

            if (extraOffset.offset < 0 && !hasSeenNegative) {
                hasSeenNegative = true;
                const separatorHolder = el('div', {class: 'single-stat-tier-display-separator-holder'}, [
                    el('div', {class: 'single-stat-tier-display-separator-inner'}),
                ]);
                elements.push(separatorHolder);

            }

            const upperDiv = el('div', {class: 'single-stat-tier-display-upper'}, [extraOffset.label]);
            upperDiv.textContent = extraOffset.label;
            const lowerLeftDiv = el('div', {class: 'single-stat-tier-display-lower-left'});
            const lowerRightDiv = el('div', {class: 'single-stat-tier-display-lower-right'});

            const descriptionPart = `${extraOffset.multiplier > 0 ? 'gain' : 'lose'} ${Math.abs(extraOffset.multiplier)}`;
            upperDiv.title = `This shows what your tiering would be if you were to ${descriptionPart} materia.`;

            if (tieringResult.lower > 0) {
                lowerLeftDiv.textContent = '-' + tieringResult.lower;
                div.classList.remove('stat-tiering-perfect');
                lowerLeftDiv.title = `If you were to ${descriptionPart} materia, your ${tiering.fullName} would be ${tieringResult.lower} above a tier.`;
            }
            else {
                lowerLeftDiv.textContent = '✔';
                lowerLeftDiv.title = `If you were to ${descriptionPart} materia, your ${tiering.fullName} would be perfectly tiered.`;
                div.classList.add('stat-tiering-perfect');
            }
            lowerRightDiv.textContent = '+' + tieringResult.upper;
            lowerRightDiv.title = `If you were to ${descriptionPart} materia, you would be ${tieringResult.upper} points short of the next-highest tier of ${this.stat}.`;

            div.replaceChildren(upperDiv, lowerLeftDiv, lowerRightDiv);
            elements.push(div);
        });
        this.expansionDiv.replaceChildren(...elements);

        // if nothing to expand, be unclickable
        this.clickable = tiering.extraOffsets.length > 0;
    }

    get expanded(): boolean {
        return this._expanded;
    }

    set expanded(value: boolean) {
        this._expanded = value;
        this.expansionDiv.style.display = value ? '' : 'none';
    }

    get clickable(): boolean {
        return this._clickable;
    }

    set clickable(value: boolean) {
        if (value) {
            this.classList.add('stat-tiering-clickable');
            this.classList.remove('stat-tiering-unclickable');
        }
        else {
            this.classList.remove('stat-tiering-clickable');
            this.classList.add('stat-tiering-unclickable');
        }
        this._clickable = value;
    }
}

export class StatTierDisplay extends HTMLDivElement {
    private readonly eleMap = new Map<string, SingleStatTierDisplay>();

    constructor(private sheet: GearPlanSheet) {
        super();
        this.classList.add('stat-tier-display');
    }

    refresh(gearSet: CharacterGearSet) {
        let relevantStats = STAT_DISPLAY_ORDER.filter(stat => this.sheet.isStatRelevant(stat));
        if (this.sheet.ilvlSync && !relevantStats.includes('vitality')) {
            relevantStats = ['vitality', ...relevantStats];
        }
        for (const stat of relevantStats) {
            try {
                const statTiering = this.getStatTiering(stat, gearSet);
                for (const tieringDisplay of statTiering) {
                    const key = tieringDisplay.label;
                    let singleStatTierDisplay: SingleStatTierDisplay;
                    if (this.eleMap.has(key)) {
                        singleStatTierDisplay = this.eleMap.get(key);
                    }
                    else {
                        singleStatTierDisplay = new SingleStatTierDisplay(stat);
                        this.eleMap.set(key, singleStatTierDisplay);
                        this.appendChild(singleStatTierDisplay);
                        // singleStatTierDisplay.addEventListener('click', () => this.toggleState());
                        singleStatTierDisplay.addEventListener('click', (ev) => {
                            if (singleStatTierDisplay.clickable) {
                                if (ev.detail === 1) {
                                    const expanded = singleStatTierDisplay.expanded = !singleStatTierDisplay.expanded;
                                    recordSheetEvent('singleTierDisplayClick', this.sheet, {
                                        expanded: expanded,
                                        stat: stat,
                                    });
                                }
                                else if (ev.detail >= 2) {
                                    // If this is a double click, the first click would have already toggled the state
                                    // of the target.
                                    const newState = singleStatTierDisplay.expanded;
                                    for (const display of this.eleMap.values()) {
                                        display.expanded = newState;
                                    }
                                    recordSheetEvent('allTierDisplayClick', this.sheet, {
                                        expanded: newState,
                                        stat: stat,
                                    });
                                }
                            }
                        });
                    }
                    singleStatTierDisplay.refresh(tieringDisplay);
                    // const tierDisplayNode = document.createElement('div');
                    // this.textContent += `${tieringDisplay.label}: -${tieringDisplay.tiering.lower} +${tieringDisplay.tiering.upper}; `;
                }
            }
            catch (e) {
                console.error("Error computing stat tiering", e);
            }
        }
    }


    private getStatTiering(stat: RawStatKey, set: CharacterGearSet): TieringDisplay[] {
        const computed = set.computedStats;
        const levelStats = computed.levelStats;
        const jobStats = computed.jobStats;
        const curVal = computed[stat];
        const abbrev = STAT_ABBREVIATIONS[stat];
        const gcdOver = jobStats.gcdDisplayOverrides?.(this.sheet.level);
        const makeTiering = (rawFormula: ((value: number) => number)) => {
            return (offset: number) => this.getCombinedTiering(curVal + offset, rawFormula);
        };
        const relevantMateria = set.sheet.relevantMateria
            .filter(materia => materia.primaryStat === stat)
            .sort((a, b) => (b.primaryStatValue - a.primaryStatValue));
        let extraOffsets: TieringOffset[];

        if (relevantMateria.length === 0) {
            extraOffsets = [];
        }
        else {
            const materia = relevantMateria[0];
            const materiaValue = materia.primaryStatValue;
            const multipliers = [3, 2, 1, -1, -2, -3];
            extraOffsets = multipliers.map(multiplier => {
                const valueRaw = multiplier * materiaValue;
                const before = computed[stat];
                const bonuses: Partial<RawStats> = {};
                bonuses[stat] = valueRaw;
                // We need it to use this path instead of just adding, because we want to account for potential
                // uncapped food.
                const after = computed.withModifications(() => {
                }, {
                    extraGearBonuses: bonuses,
                })[stat];
                const valueAdjusted = after - before;
                const multiplierStr = multiplier < 0 ? multiplier.toString() : '+' + multiplier.toString();
                // Get the roman numeral part of the materia name
                const split = materia.name.split(' ');
                const label = `${multiplierStr} ${split[split.length - 1]}:`;
                return {
                    offset: valueAdjusted,
                    // Format as +5, +0, -5, etc
                    label: label,
                    multiplier: multiplier,
                };
            });
        }

        switch (stat) {
            case "strength":
            case "dexterity":
            case "intelligence":
            case "mind":
                return [{
                    label: abbrev,
                    fullName: stat + ' 倍率',
                    description: '主屬性的傷害倍率',
                    tieringFunc: makeTiering(value => mainStatMulti(levelStats, jobStats, value)),
                    extraOffsets: extraOffsets,
                }];
            case "vitality":
                return [{
                    label: abbrev,
                    fullName: 'HP',
                    description: 'HP（受耐力影響）',
                    tieringFunc: makeTiering(value => vitToHp(levelStats, jobStats, value)),
                    extraOffsets: extraOffsets,
                }];
            case "determination":
                return [{
                    label: abbrev,
                    fullName: stat + ' 倍率',
                    description: '信念的傷害倍率',
                    tieringFunc: makeTiering(value => detDmg(levelStats, value)),
                    extraOffsets: extraOffsets,
                }];
            case "piety":
                return [{
                    label: abbrev,
                    fullName: 'MP回復',
                    description: 'MP回復（受信仰影響）',
                    tieringFunc: makeTiering(value => mpTick(levelStats, value)),
                    extraOffsets: extraOffsets,
                }];
            case "crit":
                return [{
                    label: abbrev,
                    fullName: '暴擊',
                    description: '暴擊（機率和倍率）',
                    tieringFunc: makeTiering(value => critDmg(levelStats, value)),
                    extraOffsets: extraOffsets,
                }];
            case "dhit":
                return [{
                    label: abbrev,
                    fullName: '直擊機率',
                    description: '打出直擊的機率',
                    tieringFunc: makeTiering(value => dhitChance(levelStats, value)),
                    extraOffsets: extraOffsets,
                }];
            case "spellspeed": {
                const tierDisplays: TieringDisplay[] = [];
                if (gcdOver) {
                    gcdOver.filter(over => over.basis === 'sps')
                        .forEach(over => {
                            tierDisplays.push({
                                label: over.shortLabel,
                                fullName: over.longLabel,
                                description: over.description,
                                tieringFunc: makeTiering(value => {
                                    const haste = computed.haste(over.attackType, over?.buffHaste ?? 0, over?.gaugeHaste ?? 0);
                                    return spsToGcd(over.gcdTime, levelStats, value, haste);
                                }),
                                extraOffsets: extraOffsets,
                            });
                        });
                }
                else {
                    tierDisplays.push({
                        label: abbrev + ' GCD',
                        shortLabel: 'GCD',
                        fullName: '法術GCD',
                        description: '法術的全域冷卻（複唱）時間',
                        tieringFunc: makeTiering(value => {
                            const haste = computed.haste('Spell', 0, 0);
                            return spsToGcd(2.5, levelStats, value, haste);
                        }),
                        extraOffsets: extraOffsets,
                    });
                }
                return [...tierDisplays, {
                    label: abbrev + ' DoT',
                    shortLabel: 'DoT',
                    fullName: '法術DoT係數',
                    description: '法術DoT傷害倍率',
                    tieringFunc: makeTiering(value => spsTickMulti(levelStats, value)),
                    extraOffsets: extraOffsets,
                }];
            }
            case "skillspeed": {
                const tierDisplays: TieringDisplay[] = [];
                if (gcdOver) {
                    gcdOver.filter(over => over.basis === 'sks')
                        .forEach(over => {
                            tierDisplays.push({
                                label: over.shortLabel,
                                fullName: over.longLabel,
                                description: over.description,
                                tieringFunc: makeTiering(value => {
                                    const haste = computed.haste(over.attackType, over?.buffHaste ?? 0, over?.gaugeHaste ?? 0);
                                    return sksToGcd(over.gcdTime, levelStats, value, haste);
                                }),
                                extraOffsets: extraOffsets,
                            });
                        });
                }
                else {
                    tierDisplays.push({
                        label: abbrev + ' GCD',
                        shortLabel: 'GCD',
                        fullName: '戰技GCD',
                        description: '戰技的全域冷卻（複唱）時間',
                        tieringFunc: makeTiering(value => {
                            const haste = computed.haste('Weaponskill', 0, 0);
                            return sksToGcd(2.5, levelStats, value, haste);
                        }),
                        extraOffsets: extraOffsets,
                    });
                }

                return [...tierDisplays, {
                    label: abbrev + ' DoT',
                    shortLabel: 'DoT',
                    fullName: '戰技DoT係數',
                    description: '戰技DoT傷害倍率',
                    tieringFunc: makeTiering(value => sksTickMulti(levelStats, value)),
                    extraOffsets: extraOffsets,
                }];
            }
            case "tenacity":
                return [{
                    label: abbrev + ' 傷',
                    fullName: stat + ' 倍率',
                    description: '堅韌的傷害倍率',
                    tieringFunc: makeTiering(value => tenacityDmg(levelStats, value)),
                    extraOffsets: extraOffsets,
                }, {
                    label: abbrev + ' 防',
                    fullName: stat + ' 減傷',
                    description: '堅韌的傷害減免',
                    tieringFunc: makeTiering(value => tenacityIncomingDmg(levelStats, value)),
                    extraOffsets: extraOffsets,
                },
                ];
            default:
                return [{
                    label: abbrev,
                    fullName: abbrev,
                    description: abbrev,
                    tieringFunc: offset => ({
                        lower: 0,
                        upper: 0,
                    }),
                    extraOffsets: [],
                }];

        }
    }


    private getCombinedTiering(currentValue: number, computation: ((statValue: number) => number)): Tiering {
        return {
            lower: this.getSingleTiering(false, currentValue, computation),
            upper: this.getSingleTiering(true, currentValue, computation),
        };
    }

    private getSingleTiering(upper: boolean, initialValue: number, computation: (statValue: number) => number) {
        const initialResult = computation(initialValue);
        for (let offset = 0; offset < 1000; offset++) {
            const testValue = upper ? (initialValue + offset) : (initialValue - (offset + 1));
            if (testValue <= 0) {
                return offset;
            }
            const newResult = computation(testValue);
            if (newResult !== initialResult) {
                return offset;
            }
        }
        throw new Error(`Tier computation error: upper: ${upper}; initialValue: ${initialValue}; initialResult: ${initialResult}`);
    }
}

customElements.define('stat-tiering-area', StatTierDisplay, {extends: 'div'});
customElements.define('single-stat-tier-display', SingleStatTierDisplay, {extends: 'div'});
