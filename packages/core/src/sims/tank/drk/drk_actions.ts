import {Darkside, DrkGauge} from "./drk_gauge";
import {DrkGcdAbility, DrkOgcdAbility, BloodWeaponBuff, DeliriumBuff, ScornBuff, SaltedEarthBuff, livingShadowScalings} from "./drk_types";

export const HardSlash: DrkGcdAbility = {
    type: 'gcd',
    name: "重斬",
    id: 3617,
    potency: 150,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.58,
    cast: 0,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 180,
        },
        {
            minLevel: 94,
            potency: 300,
        },
    ],
};

export const SyphonStrike: DrkGcdAbility = {
    type: 'gcd',
    name: "吸收斬",
    id: 3623,
    potency: 240,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.62,
    cast: 0,
    updateMP: gauge => gauge.magicPoints += 600,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 260,
        },
        {
            minLevel: 94,
            potency: 380,
        },
    ],
};

export const Souleater: DrkGcdAbility = {
    type: 'gcd',
    name: "噬魂斬",
    id: 3632,
    potency: 320,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.62,
    cast: 0,
    updateBloodGauge: gauge => gauge.bloodGauge += 20,
    levelModifiers: [
        {
            minLevel: 84,
            potency: 360,
        },
        {
            minLevel: 94,
            potency: 480,
        },
    ],
};

export const Bloodspiller: DrkGcdAbility = {
    type: 'gcd',
    name: "血濺",
    id: 7392,
    potency: 500,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.80,
    bloodCost: 50,
    updateBloodGauge: gauge => gauge.bloodGauge -= 50,
    levelModifiers: [
        {
            minLevel: 94,
            potency: 600,
        },
    ],
};

export const ScarletDelirium: DrkGcdAbility = {
    type: 'gcd',
    name: "血紅亂",
    id: 36928,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.62,
};

export const Comeuppance: DrkGcdAbility = {
    type: 'gcd',
    name: "報應",
    id: 36929,
    potency: 720,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.67,
};

export const Torcleaver: DrkGcdAbility = {
    type: 'gcd',
    name: "戮山",
    id: 36930,
    potency: 820,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 0.62,
};

export const Unmend: DrkGcdAbility = {
    type: 'gcd',
    name: "傷殘",
    id: 3624,
    potency: 150,
    attackType: "Spell",
    gcd: 2.5,
    appDelay: 1,
};

export const Delirium: DrkOgcdAbility = {
    type: 'ogcd',
    name: "錯亂劍",
    id: 7390,
    potency: null,
    attackType: "Ability",
    activatesBuffs: [BloodWeaponBuff, DeliriumBuff],
    cooldown: {
        time: 60,
        charges: 1,
    },
    appDelay: 0,
};

export const CarveAndSpit: DrkOgcdAbility = {
    type: 'ogcd',
    name: "精雕怒斬",
    id: 3643,
    potency: 510,
    attackType: "Ability",
    cooldown: {
        time: 60,
        charges: 1,
    },
    appDelay: 1.47,
    updateMP: gauge => gauge.magicPoints += 600,
    levelModifiers: [
        {
            minLevel: 94,
            potency: 540,
        },
    ],
};

export const SaltedEarth: DrkOgcdAbility = {
    type: 'ogcd',
    name: "腐穢大地",
    id: 3639,
    attackType: "Ability",
    activatesBuffs: [],
    potency: 50,
    dot: {
        // This is technically just the ID of the salted earth buff, but
        // it'll do. It's important this is a buff because of speed scaling.
        id: 749,
        tickPotency: 50,
        duration: 15,
    },
    cooldown: {
        time: 90,
        charges: 1,
    },
    appDelay: 0.76,
    levelModifiers: [
        {
            minLevel: 86,
            activatesBuffs: [SaltedEarthBuff],
        },
    ],
};

export const SaltAndDarkness: DrkOgcdAbility = {
    type: 'ogcd',
    name: "腐穢黑暗",
    id: 25755,
    potency: 500,
    attackType: "Ability",
    cooldown: {
        time: 30,
    },
    appDelay: 0.76,
};

export const Disesteem: DrkGcdAbility = {
    type: 'gcd',
    name: "掠影的蔑視",
    id: 36932,
    potency: 1000,
    attackType: "Weaponskill",
    gcd: 2.5,
    appDelay: 1.65,
};

export const EdgeOfDarkness: DrkOgcdAbility = {
    type: 'ogcd',
    name: "暗黑鋒",
    id: 16467,
    potency: 300,
    attackType: "Ability",
    cooldown: {
        time: 1,
    },
    appDelay: 0.62,
    buffApplicationDelay: 0,
    activatesBuffs: [Darkside],
    updateMP: (gauge: DrkGauge) => {
        if (gauge.darkArts) {
            gauge.darkArts = false;
        }
        else {
            gauge.magicPoints -= 3000;
        }
    },
};

export const EdgeOfShadow: DrkOgcdAbility = {
    type: 'ogcd',
    name: "暗影鋒",
    id: 16470,
    potency: 460,
    attackType: "Ability",
    cooldown: {
        time: 1,
    },
    appDelay: 0.62,
    buffApplicationDelay: 0,
    activatesBuffs: [Darkside],
    updateMP: (gauge: DrkGauge) => {
        if (gauge.darkArts) {
            gauge.darkArts = false;
        }
        else {
            gauge.magicPoints -= 3000;
        }
    },
};

export const TheBlackestNight: DrkOgcdAbility = {
    type: 'ogcd',
    name: "至黑之夜",
    id: 7393,
    potency: null,
    attackType: "Ability",
    cooldown: {
        time: 15,
    },
    updateMP: (gauge: DrkGauge) => {
        gauge.magicPoints -= 3000;
        // For the sake of ease, we'll assume that the TBN pops immediately. This is
        // naturally imperfect, but is perfectly serviceable for the purposes of a
        // damage sim.
        gauge.darkArts = true;
    },
};

export const Shadowbringer: DrkOgcdAbility = {
    type: 'ogcd',
    name: "暗影使者",
    id: 25757,
    potency: 600,
    attackType: "Ability",
    cooldown: {
        time: 60,
        charges: 2,
    },
    appDelay: 0.62,
};

// While Living Shadow abilities are actually Weaponskills in some cases,
// they've all been programmed to be abilities so that it doesn't roll GCD.
export const LivingShadow: DrkOgcdAbility = {
    type: 'ogcd',
    name: "掠影示現",
    id: 16472,
    // Total potency of its abilities is 2450.
    potency: null,
    attackType: "Ability",
    activatesBuffs: [],
    cooldown: {
        time: 120,
        charges: 1,
    },
    levelModifiers: [
        {
            minLevel: 100,
            activatesBuffs: [ScornBuff],
        },
    ],
};

export const LivingShadowShadowstride: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 暗影跨步",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 38512,
    potency: 0,
    attackType: "Ability",
};

export const LivingShadowAbyssalDrain: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 吸血深淵",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 17904,
    potency: 340,
    attackType: "Ability",
    levelModifiers: [
        {
            minLevel: 88,
            potency: 420,
        },
    ],
};

export const LivingShadowShadowbringer: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 暗影使者",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 25881,
    potency: 570,
    attackType: "Ability",
};

export const LivingShadowEdgeOfShadow: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 暗影鋒",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 17908,
    potency: 340,
    attackType: "Ability",
    levelModifiers: [
        {
            minLevel: 88,
            potency: 420,
        },
    ],
};

// Level 80 only, upgraded to Shadowbringer at level 90+
export const LivingShadowFloodOfShadow: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 暗影波動",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 17907,
    potency: 340,
    attackType: "Ability",
};

export const LivingShadowBloodspiller: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 血濺",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 17909,
    potency: 340,
    attackType: "Ability",
    levelModifiers: [
        {
            minLevel: 88,
            potency: 420,
        },
    ],
};

// Upgraded to Disesteem at level 100+
export const LivingShadowCarveAndSpit: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 精雕怒斬",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 17915,
    potency: 340,
    attackType: "Ability",
    levelModifiers: [
        {
            minLevel: 88,
            potency: 420,
        },
    ],
};

export const LivingShadowDisesteem: DrkOgcdAbility = {
    type: 'ogcd',
    name: "(掠影示現) 掠影的蔑視",
    alternativeScalings: livingShadowScalings,
    animationLock: 0,
    id: 36933,
    potency: 620,
    attackType: "Ability",
};
