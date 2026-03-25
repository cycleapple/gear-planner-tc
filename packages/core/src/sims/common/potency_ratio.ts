import {CharacterGearSet} from "@xivgear/core/gear";
import {applyDhCrit, baseDamage} from "@xivgear/xivmath/xivmath";
import {SimResult, SimSettings, SimSpec, Simulation} from "@xivgear/core/sims/sim_types";

export const potRatioSimSpec: SimSpec<PotencyRatioSim, SimSettings> = {
    displayName: "威力比",
    loadSavedSimInstance(exported: SimSettings) {
        return new PotencyRatioSim();
    },
    makeNewSimInstance(): PotencyRatioSim {
        return new PotencyRatioSim();
    },
    stub: "pr-sim",
    description: "每100威力的預期傷害",
    isDefaultSim: true,
};

export interface PotencyRatioSimResults extends SimResult {
    withoutCritDh: number
}

/**
 * "Simulation" that only calcuates dmg/100p.
 */
export class PotencyRatioSim implements Simulation<PotencyRatioSimResults, SimSettings, SimSettings> {
    exportSettings() {
        return {
            ...this.settings,
        };
    };

    settings: SimSettings = {};
    shortName = "pr-sim";
    displayName = "傷害/100威*";

    async simulate(set: CharacterGearSet): Promise<PotencyRatioSimResults> {
        const base = baseDamage(set.computedStats, 100, 'Spell');
        const final = applyDhCrit(base, set.computedStats);
        return {
            mainDpsResult: final,
            withoutCritDh: base,
        };
    };

    async simulateSimple(set: CharacterGearSet): Promise<number> {
        return (await this.simulate(set)).mainDpsResult;
    }


    spec = potRatioSimSpec;

    settingsChanged(): void {

    }
}
