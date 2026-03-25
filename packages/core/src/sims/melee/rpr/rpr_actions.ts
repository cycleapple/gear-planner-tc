import {ArcaneCircleBuff} from "@xivgear/core/sims/buffs";
import {RprGcdAbility, RprOgcdAbility} from "./rpr_types";
import {DeathsDesign, IdealHost} from "./rpr_buff";

export const Slice: RprGcdAbility = {
    type: 'gcd',
    name: "切割",
    id: 24373,
    potency: 420,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateSoulGauge: gauge => gauge.soulGauge += 10,
};

export const WaxingSlice: RprGcdAbility = {
    type: 'gcd',
    name: "增盈切割",
    id: 24374,
    potency: 500,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateSoulGauge: gauge => gauge.soulGauge += 10,
};

export const InfernalSlice: RprGcdAbility = {
    type: 'gcd',
    name: "地獄切割",
    id: 24375,
    potency: 600,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateSoulGauge: gauge => gauge.soulGauge += 10,
};

export const ShadowOfDeath: RprGcdAbility = {
    type: 'gcd',
    name: "死亡之影",
    id: 24378,
    potency: 300,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    appDelay: 0,
    activatesBuffs: [DeathsDesign],
};

export const Harpe: RprGcdAbility = {
    type: 'gcd',
    name: "勾刃",
    id: 24386,
    potency: 300,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 1.3,
    appDelay: 0.9,
    updateSoulGauge: gauge => gauge.soulGauge += 10,
};


export const Gibbet: RprGcdAbility = {
    type: 'gcd',
    name: "絞決",
    id: 24382,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateShroudGauge: gauge => gauge.shroudGauge += 10,
};

export const Gallows: RprGcdAbility = {
    type: 'gcd',
    name: "縊殺",
    id: 24383,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateShroudGauge: gauge => gauge.shroudGauge += 10,
};

export const SoulSlice: RprGcdAbility = {
    type: 'gcd',
    name: "靈魂切片",
    id: 24380,
    potency: 520,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateSoulGauge: gauge => gauge.soulGauge += 50,
    cooldown: {
        time: 30,
        charges: 2,
    },
};

export const PlentifulHarvest: RprGcdAbility = {
    type: 'gcd',
    name: "大豐收",
    id: 24385,
    potency: 1000,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [IdealHost],
};

export const HarvestMoon: RprGcdAbility = {
    type: 'gcd',
    name: "收穫月",
    id: 24388,
    potency: 800,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateSoulGauge: gauge => gauge.soulGauge += 10,
};

export const Communio: RprGcdAbility = {
    type: 'gcd',
    name: "團契",
    id: 24398,
    potency: 1100,
    attackType: "Spell",
    gcd: 2.5,
    cast: 1.3,
};

export const Perfectio: RprGcdAbility = {
    type: 'gcd',
    name: "完人",
    id: 36973,
    potency: 1300,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
};

export const ExecutionersGibbet: RprGcdAbility = {
    type: 'gcd',
    name: "處刑人's Gibbet",
    id: 36970,
    potency: 820,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateShroudGauge: gauge => gauge.shroudGauge += 10,
};

export const ExecutionersGallows: RprGcdAbility = {
    type: 'gcd',
    name: "處刑人's Gallows",
    id: 36971,
    potency: 820,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateShroudGauge: gauge => gauge.shroudGauge += 10,
};

export const ExecutionersGallowsUnbuffed: RprGcdAbility = {
    type: 'gcd',
    name: "處刑人's Gallows",
    id: 36971,
    potency: 760,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateShroudGauge: gauge => gauge.shroudGauge += 10,
};

export const VoidReapingUnbuffed: RprGcdAbility = {
    type: 'gcd',
    name: "虛無收割",
    id: 24395,
    potency: 560,
    attackType: "Weaponskill",
    gcd: 1.5,
    cast: 0,
    fixedGcd: true,
};

export const VoidReaping: RprGcdAbility = {
    type: 'gcd',
    name: "虛無收割",
    id: 24395,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 1.5,
    cast: 0,
    fixedGcd: true,
};

export const CrossReaping: RprGcdAbility = {
    type: 'gcd',
    name: "交錯收割",
    id: 24396,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 1.5,
    cast: 0,
    fixedGcd: true,
};

export const Gluttony: RprOgcdAbility = {
    type: 'ogcd',
    name: "暴食",
    id: 24393,
    potency: 520,
    attackType: "Ability",
    updateSoulGauge: gauge => gauge.soulGauge -= 50,
    cooldown: {
        time: 60,
        charges: 1,
    },
};

export const UnveiledGibbet: RprOgcdAbility = {
    type: 'ogcd',
    name: "絞決爪",
    id: 24390,
    potency: 440,
    attackType: "Ability",
    updateSoulGauge: gauge => gauge.soulGauge -= 50,
};

export const UnveiledGallows: RprOgcdAbility = {
    type: 'ogcd',
    name: "縊殺爪",
    id: 24391,
    potency: 440,
    attackType: "Ability",
    updateSoulGauge: gauge => gauge.soulGauge -= 50,
};


export const LemuresSlice: RprOgcdAbility = {
    type: 'ogcd',
    name: "Lemure's Slice",
    id: 24399,
    potency: 280,
    attackType: "Ability",
};

export const Sacrificium: RprOgcdAbility = {
    type: 'ogcd',
    name: "祭牲",
    id: 36969,
    potency: 700,
    attackType: "Ability",
};

export const Enshroud: RprOgcdAbility = {
    type: 'ogcd',
    name: "夜遊魂衣",
    id: 24394,
    potency: 0,
    attackType: "Ability",
    updateShroudGauge: gauge => gauge.shroudGauge -= 50,
};

export const ArcaneCircle: RprOgcdAbility = {
    type: 'ogcd',
    name: "神秘環",
    id: 24405,
    activatesBuffs: [ArcaneCircleBuff],
    potency: null,
    attackType: "Ability",
    cooldown: {
        time: 120,
        charges: 1,
    },
};
