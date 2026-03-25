import {WarGauge} from "./war_gauge";
import {WarGcdAbility, WarOgcdAbility, SurgingTempest, PrimalRendReadyBuff, PrimalRuinationReadyBuff, InnerReleaseBuff, NascentChaosBuff} from "./war_types";

export const Tomahawk: WarGcdAbility = {
    type: 'gcd',
    name: "飛斧",
    id: 46,
    potency: 150,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
};

export const HeavySwing: WarGcdAbility = {
    type: 'gcd',
    name: "重劈",
    id: 31,
    potency: 150,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 200,
        },
        {
            minLevel: 94,
            potency: 240,
        },
    ],
};

export const Maim: WarGcdAbility = {
    type: 'gcd',
    name: "凶殘裂",
    id: 37,
    potency: 250,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateBeastGauge: (gauge: WarGauge) => gauge.beastGauge += 10,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 300,
        },
        {
            minLevel: 94,
            potency: 340,
        },
    ],
};

export const StormsPath: WarGcdAbility = {
    type: 'gcd',
    name: "衝撞's Path",
    id: 42,
    potency: 380,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    updateBeastGauge: (gauge: WarGauge) => gauge.beastGauge += 20,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 440,
        },
        {
            minLevel: 94,
            potency: 500,
        },
    ],
};

export const StormsEye: WarGcdAbility = {
    type: 'gcd',
    name: "衝撞's Eye",
    id: 45,
    potency: 380,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [SurgingTempest],
    updateBeastGauge: (gauge: WarGauge) => gauge.beastGauge += 10,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 440,
        },
        {
            minLevel: 94,
            potency: 500,
        },
    ],
};

export const FellCleave: WarGcdAbility = {
    type: 'gcd',
    name: "裂石飛環",
    id: 3549,
    potency: 520,
    attackType: "Weaponskill",
    gcd: 2.5,
    beastGaugeCost: 50,
    updateBeastGauge: gauge => gauge.beastGauge -= 50,
    levelModifiers: [
        {
            minLevel: 94,
            potency: 580,
        },
    ],
};

export const InnerChaos: WarGcdAbility = {
    type: 'gcd',
    name: "狂魂",
    id: 16465,
    potency: 660,
    attackType: "Weaponskill",
    gcd: 2.5,
    beastGaugeCost: 50,
    updateBeastGauge: gauge => gauge.beastGauge -= 50,
};


export const PrimalRend: WarGcdAbility = {
    type: 'gcd',
    name: "蠻荒崩裂",
    id: 25753,
    potency: 700,
    attackType: "Weaponskill",
    activatesBuffs: [],
    gcd: 2.5,
    levelModifiers: [
        {
            minLevel: 100,
            activatesBuffs: [PrimalRuinationReadyBuff],
        },
    ],
};

export const PrimalRuination: WarGcdAbility = {
    type: 'gcd',
    name: "盡毀",
    id: 36925,
    potency: 780,
    attackType: "Weaponskill",
    gcd: 2.5,
};

export const InnerRelease: WarOgcdAbility = {
    type: 'ogcd',
    name: "原初的解放",
    id: 7389,
    potency: null,
    attackType: "Ability",
    activatesBuffs: [InnerReleaseBuff],
    cooldown: {
        time: 60,
        charges: 1,
    },
    levelModifiers: [
        {
            minLevel: 90,
            activatesBuffs: [InnerReleaseBuff, PrimalRendReadyBuff],
        },
    ],
};

export const Infuriate: WarOgcdAbility = {
    type: 'ogcd',
    name: "戰嚎",
    id: 52,
    potency: null,
    attackType: "Ability",
    activatesBuffs: [],
    cooldown: {
        time: 60,
        charges: 2,
    },
    updateBeastGauge: (gauge: WarGauge) => gauge.beastGauge += 50,
    levelModifiers: [
        {
            minLevel: 80,
            activatesBuffs: [NascentChaosBuff],
        },
    ],
};


export const PrimalWrath: WarOgcdAbility = {
    type: 'ogcd',
    name: "原初的怒震",
    id: 36924,
    potency: 700,
    attackType: "Ability",
    cooldown: {
        time: 1,
    },
};

export const Upheaval: WarOgcdAbility = {
    type: 'ogcd',
    name: "大激震",
    id: 7387,
    potency: 400,
    attackType: "Ability",
    cooldown: {
        time: 30,
    },
    levelModifiers: [
        {
            minLevel: 94,
            potency: 420,
        },
    ],
};

export const Onslaught: WarOgcdAbility = {
    type: 'ogcd',
    name: "猛攻",
    id: 7386,
    potency: 150,
    animationLock: 0.8,
    attackType: "Ability",
    cooldown: {
        time: 30,
        charges: 2,
    },
    levelModifiers: [
        {
            minLevel: 88,
            cooldown: {
                time: 30,
                charges: 3,
            },
        },
    ],
};
