import {
    autoAttackModifier,
    autoCritBuffDmg,
    autoDhitBonusDmg,
    critChance,
    critDmg,
    defIncomingDmg,
    detDmg,
    dhitChance,
    dhitDmg,
    flp,
    hpScalar,
    mainStatMulti,
    mainStatPowerMod,
    mpTick,
    sksTickMulti,
    sksToGcd,
    spsTickMulti,
    spsToGcd,
    tenacityDmg,
    tenacityIncomingDmg,
    vitToHp,
    wdMulti
} from "@xivgear/xivmath/xivmath";
import {getClassJobStats, JOB_DATA, JobName, MAIN_STATS, STAT_ABBREVIATIONS} from "@xivgear/xivmath/xivconstants";
import {Func, GeneralSettings, MathFormula, registerFormula} from "./math_main";
import {DataManager, makeDataManager} from "@xivgear/core/datamanager";
import {JobData, LevelStats} from "@xivgear/xivmath/geartypes";

type BaseSpeedSettings = {
    baseGcd: number,
    haste: number
}

type SksSettings = BaseSpeedSettings & {
    sks: number,
}

type SpsSettings = BaseSpeedSettings & {
    sps: number,
}

const baseGcdVar = {
    type: "number",
    label: "基礎GCD",
    property: "baseGcd",
    integer: false,
    min: () => 0.1,
} as const;

const hasteVar = {
    type: "number",
    label: "加速",
    property: "haste",
    integer: true,
    min: () => 0,
    max: () => 99,
} as const;

let jobDataManager: Promise<DataManager>;

async function getClassJobStatsFull(job: JobName) {
    if (jobDataManager === undefined) {
        const dm = makeDataManager([job], 100);
        jobDataManager = dm.loadData().then(() => dm);
    }
    const multipliers = (await jobDataManager).multipliersForJob(job);
    return {
        ...getClassJobStats(job),
        jobStatMultipliers: multipliers,
    };
}

const baseMain = (generalSettings: GeneralSettings) => generalSettings.levelStats.baseMainStat;
const baseSub = (generalSettings: GeneralSettings) => generalSettings.levelStats.baseSubStat;

/**
 * Formual "wrapper" (actually just a pass-through) to allow for internal type-consistency for function arguments
 *
 * @param formula The formula to wrap
 */
function formula<AllArgType, FuncType extends Func>(formula: MathFormula<AllArgType, FuncType>): MathFormula<AllArgType, Func> {
    return formula;
}

// TODO: baseDamageFull
// TODO: baseHealing
// TODO: social media previews
// TODO: custom levelStats/jobMultipliers
/**
 * Register the built-in formulae
 */
export function registerFormulae() {
    registerFormula<{
        'mainstat': number
    }>({
        name: "主屬性",
        stub: "main-stat",
        functions: [formula({
            name: "主屬性倍率",
            fn: mainStatMulti,
            argExtractor: async function (arg, gen: GeneralSettings) {
                // This one technically doesn't need this
                return [gen.levelStats, getClassJobStats(gen.classJob) as JobData, arg.mainstat] as const;
            },
        })],
        variables: [{
            type: "number",
            label: "主屬性數值",
            property: "mainstat",
            integer: true,
            min: baseMain,
        }],
        primaryVariable:
            "mainstat",
        makeDefaultInputs(generalSettings
                          :
                          GeneralSettings
        ) {
            return {mainstat: generalSettings.levelStats.baseMainStat};
        }
        ,
    })
    ;

    registerFormula<{
        'wd': number,
        'delay': number
    }>({
        name: "武器性能",
        stub: "weapon-damage",
        functions: [formula({
            name: "武器性能倍率",
            fn: wdMulti,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, await getClassJobStatsFull(gen.classJob), arg.wd, false] as const;
            },
        }), formula({
            name: "自動攻擊倍率",
            fn: autoAttackModifier,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, await getClassJobStatsFull(gen.classJob), arg.delay, arg.wd] as const;
            },
        })],
        variables: [{
            type: "number",
            label: "武器性能數值",
            property: "wd",
            integer: true,
            min: () => 0,
        }, {
            type: "number",
            label: "武器速度（秒）",
            property: "delay",
            integer: false,
            min: () => 0.01,
        }],
        primaryVariable: "wd",
        makeDefaultInputs(generalSettings: GeneralSettings) {
            return {
                wd: 101,
                delay: 3.12,
            };
        },
    });

    registerFormula<{
        'det': number
    }>({
        name: "信念",
        stub: "det",
        functions: [formula({
            name: "信念倍率",
            fn: detDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.det] as const;
            },
        })],
        variables: [{
            type: "number",
            label: "信念數值",
            property: "det",
            integer: true,
            min: baseMain,
        }],
        primaryVariable: "det",
        makeDefaultInputs(generalSettings: GeneralSettings) {
            return {det: generalSettings.levelStats.baseMainStat};
        },
    });

    registerFormula<{
        'def': number
    }>({
        name: "防禦",
        stub: "def",
        functions: [formula({
            name: "物防/魔防受傷",
            fn: defIncomingDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.def] as const;
            },
        })],
        variables: [{
            type: "number",
            label: "物防/魔防數值",
            property: "def",
            integer: true,
            min: () => 0,
        }],
        primaryVariable: "def",
        makeDefaultInputs() {
            return {def: 0};
        },
    });

    registerFormula<{
        'tnc': number
    }>({
        name: "堅韌",
        stub: "tnc",
        functions: [formula({
            name: "輸出倍率",
            fn: tenacityDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.tnc] as const;
            },
        }), formula({
            name: "受傷倍率",
            fn: tenacityIncomingDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.tnc] as const;
            },
        })],
        variables: [{
            type: "number",
            label: "堅韌數值",
            property: "tnc",
            integer: true,
            min: baseSub,
        }],
        primaryVariable: "tnc",
        makeDefaultInputs(generalSettings: GeneralSettings) {
            return {tnc: generalSettings.levelStats.baseSubStat};
        },
    });

    registerFormula<{
        'piety': number
    }>({
        name: "信仰",
        stub: "piety",
        functions: [formula({
            name: "MP/3秒",
            fn: mpTick,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.piety] as const;
            },
        })],
        variables: [{
            type: "number",
            label: "信仰數值",
            property: "piety",
            integer: true,
            min: baseMain,
        }],
        primaryVariable: "piety",
        makeDefaultInputs(generalSettings: GeneralSettings) {
            return {piety: generalSettings.levelStats.baseSubStat};
        },
    });

    registerFormula<SksSettings>({
        stub: 'sks',
        name: '技能速度',
        functions: [
            formula({
                name: 'GCD',
                fn: sksToGcd,

                argExtractor: async function (args, gen) {
                    return [args.baseGcd, gen.levelStats, args.sks, args.haste] as const;
                },
            }),
            formula({
                name: 'DoT倍率',
                fn: sksTickMulti,
                hideableColumn: true,
                argExtractor: async function (args, gen) {
                    return [gen.levelStats, args.sks] as const;
                },
            }),
        ],
        variables: [
            baseGcdVar,
            {
                type: "number",
                label: "技能速度",
                property: "sks",
                integer: true,
                min: baseSub,
            },
            hasteVar,
        ],
        primaryVariable: 'sks',
        makeDefaultInputs: (gen) => {
            return {
                baseGcd: 2.5,
                sks: gen.levelStats.baseSubStat,
                haste: 0,
            };
        },
    });

    registerFormula<SpsSettings>({
        stub: 'sps',
        name: '詠唱速度',
        primaryVariable: 'sps',
        functions: [
            formula({
                name: 'GCD',
                fn: spsToGcd,
                argExtractor: async function (args, gen) {
                    return [args.baseGcd, gen.levelStats, args.sps, args.haste] as const;
                },
            }),
            formula({
                name: 'DoT倍率',
                hideableColumn: true,
                fn: spsTickMulti,
                argExtractor: async function (args, gen) {
                    return [gen.levelStats, args.sps] as const;
                },
            }),
        ],
        variables: [
            baseGcdVar,
            {
                type: "number",
                label: "詠唱速度",
                property: "sps",
                integer: true,
                min: baseSub,
            },
            hasteVar,
        ],
        makeDefaultInputs: (gen: GeneralSettings) => {
            return {
                baseGcd: 2.5,
                sps: gen.levelStats.baseSubStat,
                haste: 0,
            };
        },
    });

    registerFormula<SpsSettings & {
        secondaryGcd: number,
        secondaryHaste: number,
    }>({
        stub: 'gcd-comp',
        name: 'GCD比較',
        primaryVariable: 'sps',
        functions: [
            formula({
                name: 'GCD 1',
                fn: spsToGcd,
                argExtractor: async function (args, gen) {
                    return [args.baseGcd, gen.levelStats, args.sps, args.haste] as const;
                },
            }),
            formula({
                name: 'GCD 2',
                excludeFormula: true,
                fn: spsToGcd,
                argExtractor: async function (args, gen) {
                    return [args.secondaryGcd, gen.levelStats, args.sps, args.secondaryHaste] as const;
                },
            }),
            formula({
                name: 'DoT倍率',
                hideableColumn: true,
                fn: spsTickMulti,
                argExtractor: async function (args, gen) {
                    return [gen.levelStats, args.sps] as const;
                },
            }),
        ],
        variables: [
            {
                ...baseGcdVar,
                label: '基礎GCD 1',
            },
            {
                ...baseGcdVar,
                property: 'secondaryGcd',
                label: '基礎GCD 2',
            },
            {
                type: "number",
                label: "SpS/SkS",
                property: "sps",
                integer: true,
                min: baseSub,
            },
            {
                ...hasteVar,
                label: '加速 1',
            },
            {
                ...hasteVar,
                property: 'secondaryHaste',
                label: '加速 2',
            },
        ],
        makeDefaultInputs: (gen: GeneralSettings) => {
            return {
                baseGcd: 2.5,
                secondaryGcd: 2.0,
                sps: gen.levelStats.baseSubStat,
                haste: 0,
                secondaryHaste: 0,
            };
        },
    });

    registerFormula<{
        crit: number,
    }>({
        name: "暴擊",
        stub: "crit",
        functions: [formula({
            name: "暴擊機率",
            fn: critChance,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.crit] as const;
            },
        }), formula({
            name: "暴擊傷害",
            fn: critDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.crit] as const;
            },
        })],
        makeDefaultInputs: (gen) => {
            return {
                crit: gen.levelStats.baseSubStat,
            };
        },
        primaryVariable: 'crit',
        variables: [{
            type: "number",
            label: "暴擊數值",
            property: "crit",
            integer: true,
            min: baseSub,
        }],
    });

    registerFormula<{
        crit: number,
        bonusPct: number,
    }>({
        name: "加成/自動暴擊",
        stub: "autocrit",
        functions: [
            formula({
                name: "加成暴擊機率",
                excludeFormula: true,
                fn: (critChance: number, bonusCritChance: number) => flp(3, critChance + bonusCritChance),
                argExtractor: async function (arg, gen: GeneralSettings) {
                    return [
                        critChance(gen.levelStats, arg.crit),
                        flp(2, arg.bonusPct / 100),
                    ] as const;
                },
            }),
            formula({
                name: "自動暴擊額外倍率",
                fn: autoCritBuffDmg,
                argExtractor: async function (arg, gen: GeneralSettings) {
                    const cmult = critDmg(gen.levelStats, arg.crit);
                    return [cmult, flp(2, arg.bonusPct / 100)] as const;
                },
            }),
            formula({
                name: "自動暴擊總倍率",
                fn: (cm: number, bcm: number) => flp(5, cm * bcm),
                excludeFormula: true,
                argExtractor: async function (arg, gen: GeneralSettings) {
                    const cmult = critDmg(gen.levelStats, arg.crit);
                    return [cmult, autoCritBuffDmg(cmult, arg.bonusPct / 100)] as const;
                },
            }),
        ],
        makeDefaultInputs: (gen) => {
            return {
                crit: gen.levelStats.baseSubStat,
                bonusPct: 10,
            };
        },
        primaryVariable: 'crit',
        variables: [{
            type: "number",
            label: "暴擊數值",
            property: "crit",
            integer: true,
            min: baseSub,
        }, {
            type: "number",
            label: "暴擊%加成",
            property: "bonusPct",
            integer: true,
            min: () => 0,
            max: () => 100,
        }],
    });

    registerFormula<{
        'dhit': number
    }>({
        name: '直擊',
        stub: "dhit",
        functions: [formula({
            name: "直擊機率",
            fn: dhitChance,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.dhit] as const;
            },
        }), formula({
            name: "直擊傷害",
            fn: dhitDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.dhit] as const;
            },
        }), formula({
            name: "自動直擊加成",
            fn: autoDhitBonusDmg,
            argExtractor: async function (arg, gen: GeneralSettings) {
                return [gen.levelStats, arg.dhit] as const;
            },
        })],
        makeDefaultInputs: (gen: GeneralSettings) => {
            return {dhit: gen.levelStats.baseSubStat};
        },
        primaryVariable: "dhit",
        variables: [{
            type: "number",
            label: "直擊數值",
            property: "dhit",
            integer: true,
            min: baseSub,
        }],
    });

    registerFormula<{
        'vit': number,
    }>({
        name: '耐力',
        stub: 'vit',
        functions: [formula({
            name: 'HP',
            fn: vitToHp,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats, await getClassJobStatsFull(gen.classJob), arg.vit] as const;
            },
        })],
        makeDefaultInputs: (gen: GeneralSettings) => {
            return {vit: gen.levelStats.baseMainStat};
        },
        primaryVariable: 'vit',
        variables: [{
            type: 'number',
            label: '耐力',
            property: 'vit',
            integer: true,
            min: baseMain,
        }],
    });

    registerFormula<Record<string, never>>({
        name: '等級',
        stub: 'lvlmod',
        functions: [formula({
            name: 'baseMain',
            excludeFormula: true,
            fn: (lvl: LevelStats) => lvl.baseMainStat,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats] as const;
            },
        }), formula({
            name: 'baseSub',
            excludeFormula: true,
            fn: (lvl: LevelStats) => lvl.baseSubStat,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats] as const;
            },
        }), formula({
            name: 'levelDiv',
            excludeFormula: true,
            fn: (lvl: LevelStats) => lvl.levelDiv,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats] as const;
            },
        }), formula({
            name: '基礎HP',
            excludeFormula: true,
            fn: (lvl: LevelStats) => lvl.hp,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats] as const;
            },
        }), formula({
            name: 'HP係數',
            excludeFormula: true,
            fn: hpScalar,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats, JOB_DATA[gen.classJob]] as const;
            },
        }), formula({
            name: 'AP係數',
            excludeFormula: true,
            fn: mainStatPowerMod,
            async argExtractor(arg, gen: GeneralSettings) {
                return [gen.levelStats, JOB_DATA[gen.classJob]] as const;
            },
        })],
        makeDefaultInputs: (generalSettings: GeneralSettings) => {
            return {};
        },
        primaryVariable: 'level',
        variables: [],
    });
    registerFormula<Record<string, never>>({
        name: '職業',
        stub: 'job',
        functions: [formula({
            name: '自動攻擊威力',
            excludeFormula: true,
            fn: (jobData: JobData) => jobData.aaPotency,
            async argExtractor(arg, gen: GeneralSettings) {
                const stats = await getClassJobStatsFull(gen.classJob);
                return [stats] as const;
            },
        }), ...([...MAIN_STATS, 'hp'] as const).map(stat => {
            return formula({
                name: STAT_ABBREVIATIONS[stat],
                excludeFormula: true,
                fn: (jobData: JobData) => jobData.jobStatMultipliers[stat],
                async argExtractor(arg, gen: GeneralSettings) {
                    const stats = await getClassJobStatsFull(gen.classJob);
                    return [stats] as const;
                },
            });
        })],
        makeDefaultInputs: (generalSettings: GeneralSettings) => {
            return {};
        },
        primaryVariable: 'job',
        variables: [],
    });
}

