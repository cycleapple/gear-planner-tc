import {Ability, GcdAbility, OgcdAbility, HasGaugeUpdate, PersonalBuff} from "@xivgear/core/sims/sim_types";
import {removeSelf} from "@xivgear/core/sims/common/utils";
import {noStatusId} from "@xivgear/core/sims/buff_helpers";
import {DrgGaugeManager} from "./drg_gauge";
// import {Litany} from "@xivgear/core/sims/buffs";

export type DrgAbility = Ability & HasGaugeUpdate<DrgGaugeManager>;

export type DrgGcdAbility = GcdAbility & DrgAbility;
export type DrgOgcdAbility = OgcdAbility & DrgAbility;

export type DrgGaugeState = {
    level: number,
    firstmindsFocus: number,
};

export const DraconianFire: PersonalBuff = {
    name: "龍眼",
    selfOnly: true,
    duration: 30,
    statusId: 1863,
    effects: {
        // Allows execution of Raiden Thrust and Draconian Fury.
    },
    appliesTo: ability => ability.attackType === "Weaponskill", // Gets broken by any weaponskill.
    beforeSnapshot: removeSelf,
};

export const LifeSurgeBuff: PersonalBuff = {
    name: "龍劍",
    selfOnly: true,
    duration: 5,
    statusId: 3259,
    effects: {
        forceCrit: true,
    },
    appliesTo: ability => ability.attackType === "Weaponskill",
    beforeSnapshot: removeSelf,
};

export const PowerSurge: PersonalBuff = {
    name: "龍槍",
    selfOnly: true,
    duration: 30,
    statusId: 2720,
    effects: {
        dmgIncrease: 0.1,
    },
};

export const LanceChargeBuff: PersonalBuff = {
    name: "猛槍",
    selfOnly: true,
    duration: 20,
    statusId: 3258,
    effects: {
        dmgIncrease: 0.1,
    },
};

export const DiveReady: PersonalBuff = {
    name: "幻象衝預備",
    selfOnly: true,
    duration: 15,
    statusId: 1243,
    effects: {
        // Allows execution of Mirage Dive.
    },
    appliesTo: ability => ability.name === "Mirage Dive",
    beforeSnapshot: removeSelf,
};

export const EnhancedPiercingTalonBuff: PersonalBuff = {
    name: "貫穿尖效果提高",
    selfOnly: true,
    duration: 15,
    statusId: 1870,
    effects: {
        // Increases potency of Piercing Talon.
    },
    appliesTo: ability => ability.name === "Piercing Talon",
    beforeSnapshot: removeSelf,
};

export const DragonsFlight: PersonalBuff = {
    name: "Dragon's Flight",
    selfOnly: true,
    duration: 30,
    statusId: 3845,
    effects: {
        // Allows execution of Rise of the Dragon.
    },
    appliesTo: ability => ability.name === "Rise of the Dragon",
    beforeSnapshot: removeSelf,
};

export const LifeOfTheDragon: PersonalBuff = {
    name: "紅蓮龍血",
    selfOnly: true,
    duration: 20,
    statusId: noStatusId(), // it's a pseudo-buff, no icon
    effects: {
        dmgIncrease: 0.15,
        // Allows execution of Stardiver.
    },
};

export const NastrondReady: PersonalBuff = {
    name: "死者之岸預備",
    selfOnly: true,
    duration: 20,
    statusId: 4404,
    effects: {
        // Allows execution of Nastrond.
    },
    appliesTo: ability => ability.name === "Nastrond",
    beforeSnapshot: removeSelf,
};

export const StarcrossReady: PersonalBuff = {
    name: "渡星衝預備",
    selfOnly: true,
    duration: 20,
    statusId: 4302,
    effects: {
        // Allows execution of Starcross.
    },
    appliesTo: ability => ability.name === "Starcross",
    beforeSnapshot: removeSelf,
};
