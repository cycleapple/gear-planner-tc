import {Fugetsu, Fuka, MeikyoShisuiBuff} from "./sam_buffs";
import SAMGauge from "./sam_gauge";
import {KenkiAbility, SamGcdAbility, SamOgcdAbility} from "./sam_types";

/**
 * GCD Actions
 */
export const Gyofu: SamGcdAbility = {
    type: 'gcd',
    name: "曉風",
    id: 36963,
    attackType: "Weaponskill",
    potency: 240,
    gcd: 2.5,
    cast: 0,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += 5;
    },
};

export const Yukikaze: SamGcdAbility = {
    type: 'gcd',
    name: "雪風",
    id: 7480,
    attackType: "Weaponskill",
    potency: 340,
    gcd: 2.5,
    cast: 0,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += 15;
        gauge.addSen("Setsu");
    },
};

export const Jinpu: SamGcdAbility = {
    type: 'gcd',
    name: "陣風",
    id: 7478,
    attackType: "Weaponskill",
    potency: 300,
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [Fugetsu],
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += 5;
    },
};

export const Shifu: SamGcdAbility = {
    type: 'gcd',
    name: "士風",
    id: 7479,
    attackType: "Weaponskill",
    potency: 300,
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [Fuka],
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += 5;
    },
};

export const Gekko: SamGcdAbility = {
    type: 'gcd',
    name: "月光",
    id: 7481,
    attackType: "Weaponskill",
    potency: 420,
    gcd: 2.5,
    cast: 0,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += 10;
        gauge.addSen("Getsu");
    },
};

export const Kasha: SamGcdAbility = {
    type: 'gcd',
    name: "花車",
    id: 7482,
    attackType: "Weaponskill",
    potency: 420,
    gcd: 2.5,
    cast: 0,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += 10;
        gauge.addSen("Ka");
    },
};

export const MidareSetsugekka: SamGcdAbility = {
    type: 'gcd',
    name: "紛亂雪月花",
    id: 7487,
    attackType: "Weaponskill",
    potency: 640,
    autoCrit: true,
    gcd: 2.5,
    cast: 1.3,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.meditation++;
        gauge.spendSen();
    },
};

export const KaeshiSetsugekka: SamGcdAbility = {
    type: 'gcd',
    name: "回返雪月花",
    id: 16486,
    attackType: "Weaponskill",
    potency: 640,
    autoCrit: true,
    gcd: 2.5,
    cast: 0,
};

export const TendoSetsugekka: SamGcdAbility = {
    type: 'gcd',
    name: "天道雪月花",
    id: 36966,
    attackType: "Weaponskill",
    potency: 1100,
    autoCrit: true,
    gcd: 2.5,
    cast: 1.3,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.meditation++;
        gauge.spendSen();
    },
};

export const TendoKaeshiSetsugekka: SamGcdAbility = {
    type: 'gcd',
    name: "天道回返雪月花",
    id: 36968,
    attackType: "Weaponskill",
    potency: 1100,
    autoCrit: true,
    gcd: 2.5,
    cast: 0,
};

export const Higanbana: SamGcdAbility = {
    type: 'gcd',
    name: "彼岸花",
    id: 7489,
    attackType: "Weaponskill",
    potency: 200,
    dot: {
        id: 1228,
        duration: 60,
        tickPotency: 50,
    },
    gcd: 2.5,
    cast: 1.3,
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.meditation++;
        gauge.spendSen();
    },
};

export const OgiNamikiri: SamGcdAbility = {
    type: 'gcd',
    name: "奧義斬浪",
    id: 25781,
    attackType: "Weaponskill",
    potency: 1000,
    autoCrit: true,
    gcd: 2.5,
    cast: 1.3,
    updateGaugeLegacy: gauge => gauge.meditation++,
};

export const KaeshiNamikiri: SamGcdAbility = {
    type: 'gcd',
    name: "回返斬浪",
    id: 25782,
    attackType: "Weaponskill",
    potency: 1000,
    autoCrit: true,
    gcd: 2.5,
    cast: 0,
    updateGaugeLegacy: gauge => gauge.meditation++,
};

export const Enpi: SamGcdAbility = {
    type: 'gcd',
    name: "燕飛",
    id: 7486,
    attackType: "Weaponskill",
    potency: 270,
    gcd: 2.5,
    cast: 0,
    updateGaugeLegacy: gauge => gauge.kenkiGauge += 10,
};

/**
 * Off GCD Actions
 */
export const Shoha: SamOgcdAbility = {
    type: 'ogcd',
    name: "照破",
    id: 16487,
    attackType: "Ability",
    potency: 640,
    updateGaugeLegacy: gauge => gauge.spendMeditation(),
};

export const Zanshin: KenkiAbility = {
    type: 'ogcd',
    name: "殘心",
    id: 36964,
    attackType: "Ability",
    potency: 940,
    updateGaugeLegacy: gauge => gauge.kenkiGauge -= 50,
    kenkiCost: 50,
};

export const HissatsuShinten: KenkiAbility = {
    type: 'ogcd',
    name: "必殺劍·震天",
    id: 7490,
    attackType: "Ability",
    potency: 250,
    updateGaugeLegacy: gauge => gauge.kenkiGauge -= 25,
    kenkiCost: 25,
};

export const HissatsuSenei: KenkiAbility = {
    type: 'ogcd',
    name: "必殺劍·閃影",
    id: 16481,
    attackType: "Ability",
    potency: 800,
    cooldown: {
        time: 60,
    },
    updateGaugeLegacy: gauge => gauge.kenkiGauge -= 25,
    kenkiCost: 25,
};

export const HissatsuGyoten: KenkiAbility = {
    type: 'ogcd',
    name: "必殺劍·曉天",
    id: 7492,
    attackType: "Ability",
    potency: 100,
    cooldown: {
        time: 5,
    },
    updateGaugeLegacy: gauge => gauge.kenkiGauge -= 10,
    kenkiCost: 10,
};

export const HissatsuYaten: KenkiAbility = {
    type: 'ogcd',
    name: "必殺劍·夜天",
    id: 7493,
    attackType: "Ability",
    potency: 100,
    cooldown: {
        time: 10,
    },
    updateGaugeLegacy: gauge => gauge.kenkiGauge -= 10,
    kenkiCost: 10,
};

export const Ikishoten: SamOgcdAbility = {
    type: 'ogcd',
    name: "意氣衝天",
    id: 16482,
    attackType: "Ability",
    potency: null,
    cooldown: {
        time: 120,
    },
    updateGaugeLegacy: gauge => gauge.kenkiGauge += 50,
    activatesBuffs: [],
};

export const MeikyoShisui: SamOgcdAbility = {
    type: 'ogcd',
    name: "明鏡止水",
    id: 7499,
    attackType: "Ability",
    potency: null,
    cooldown: {
        time: 55,
        charges: 2,
    },
    activatesBuffs: [MeikyoShisuiBuff],
};

export const Hagakure: SamOgcdAbility = {
    type: 'ogcd',
    name: "葉隱",
    id: 7495,
    attackType: "Ability",
    potency: null,
    cooldown: {
        time: 5,
    },
    updateGaugeLegacy: (gauge: SAMGauge) => {
        gauge.kenkiGauge += gauge.sen.size * 10;
        gauge.spendSen();
    },
};
