import {Ability, GcdAbility, OgcdAbility, Buff, BuffController} from "@xivgear/core/sims/sim_types";
import {WarGauge} from "./war_gauge";
import {removeSelf} from "@xivgear/core/sims/common/utils";
import {PersonalBuff} from "@xivgear/core/sims/sim_types";

/** A WAR-specific ability. */
export type WarAbility = Ability & Readonly<{
    /** Run if an ability needs to update the Beast gauge */
    updateBeastGauge?(gauge: WarGauge): void;

    /** The Beast Gauge cost of the ability */
    beastGaugeCost?: number;
}>

export type WarGcdAbility = GcdAbility & WarAbility;

export type WarOgcdAbility = OgcdAbility & WarAbility;

/** WAR ability that costs gauge */
export type BeastGaugeAbility = WarAbility & Readonly<{
    beastGaugeCost: number;
}>

/** Represents the WAR gauge state */
export type WarGaugeState = {
    beastGauge: number,
}

/** Represents the extra data for UsedAbility, primarily for consumption in the UI */
export type WarExtraData = {
    /** The WAR gauge data */
    gauge: WarGaugeState,
    surgingTempest: number,
};

export const NascentChaosBuff: Buff = {
    name: "原初的混沌",
    duration: 30,
    selfOnly: true,
    effects: {
        forceCrit: true,
        forceDhit: true,
        // Also allows usage of Inner Chaos
    },
    appliesTo: ability => ability.name === "Inner Chaos",
    beforeSnapshot: removeSelf,
    statusId: 1897,
};

export const SurgingTempest: PersonalBuff = {
    name: "戰場風暴",
    saveKey: "Surging Tempest",
    duration: 30,
    selfOnly: true,
    effects: {
        dmgIncrease: 0.1,
    },
    maxStackingDuration: 60,
    statusId: 2677,
};

export const InnerReleaseBuff: Buff = {
    name: "原初的解放",
    duration: 15,
    selfOnly: true,
    effects: {
        forceCrit: true,
        forceDhit: true,
        // Also allows usage of Fell Cleave for free
    },
    stacks: 3,
    appliesTo: ability => ability.name === "Fell Cleave",
    beforeSnapshot<X extends WarAbility>(buffController: BuffController, ability: X): X {
        buffController.subtractStacksSelf(1);
        return ability;
    },
    statusId: 1177,
};

export const PrimalRendReadyBuff: Buff = {
    name: "蠻荒崩裂預備",
    duration: 30,
    selfOnly: true,
    effects: {
        forceCrit: true,
        forceDhit: true,
        // Also allows usage of Primal Rend
    },
    appliesTo: ability => ability.name === "Primal Rend",
    beforeSnapshot<X extends WarAbility>(buffController: BuffController, ability: X): X {
        buffController.removeSelf();
        return ability;
    },
    statusId: 2624,
};

export const PrimalRuinationReadyBuff: Buff = {
    name: "盡毀預備",
    duration: 20,
    selfOnly: true,
    effects: {
        forceCrit: true,
        forceDhit: true,
        // Also allows usage of Primal Ruination
    },
    appliesTo: ability => ability.name === "Primal Ruination",
    beforeSnapshot<X extends WarAbility>(buffController: BuffController, ability: X): X {
        buffController.removeSelf();
        return ability;
    },
    statusId: 3834,
};

export const WrathfulBuff: Buff = {
    name: "原初的怒震預備",
    duration: 30,
    selfOnly: true,
    effects: {
        // Also allows usage of Primal Wrath
    },
    appliesTo: ability => ability.name === "Primal Wrath",
    beforeSnapshot<X extends WarAbility>(buffController: BuffController, ability: X): X {
        buffController.removeSelf();
        return ability;
    },
    statusId: 3901,
};

