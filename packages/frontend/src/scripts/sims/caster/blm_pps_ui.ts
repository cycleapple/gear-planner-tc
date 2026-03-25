import {FieldBoundCheckBox, labeledCheckbox} from "@xivgear/common-ui/components/util";
import {SimulationGui} from "../simulation_gui";
import {writeProxy} from "@xivgear/util/proxies";
import {simpleKvTable} from "../components/simple_tables";
import {NamedSection} from "../../components/general/section";
import {quickElement} from "@xivgear/common-ui/components/util";
import {BlmPpsResult, BlmPpsSettings, BlmPpsSettingsExternal} from "@xivgear/core/sims/caster/blm/blm_pps_sim";
import {applyStdDev} from "@xivgear/xivmath/deviation";
import {ResultSettingsArea} from "../components/result_settings";

export class BlmPpsGui extends SimulationGui<BlmPpsResult, BlmPpsSettings, BlmPpsSettingsExternal> {

    makeMainResultDisplay(result: BlmPpsResult): HTMLElement {
        // noinspection JSNonASCIINames
        const mainResultsTable = simpleKvTable({
            "預期DPS": result.mainDpsFull.expected,
            "標準差": result.mainDpsFull.stdDev,
            "預期+1σ": applyStdDev(result.mainDpsFull, 1),
            "預期+2σ": applyStdDev(result.mainDpsFull, 2),
            "預期+3σ": applyStdDev(result.mainDpsFull, 3),
            "PPS": result.pps,
            "含天語PPS": result.ppsWithEno,
        });
        mainResultsTable.classList.add('main-results-table');
        return quickElement('div', ['count-sim-results-area'], [mainResultsTable]);
    }

    makeResultDisplay(result: BlmPpsResult): HTMLElement {
        return this.makeMainResultDisplay(result);
    }

    makeConfigInterface(settings: BlmPpsSettings, _updateCallback: () => void): HTMLElement | null {
        const configDiv = document.createElement("div");

        const simSettings = new NamedSection('Sim Settings');

        const useStandardF3PCB = new FieldBoundCheckBox(settings, "useStandardF3P");
        simSettings.appendChild(labeledCheckbox("固定使用AF1 F3P進入靈極火（80級及以下忽略）", useStandardF3PCB));

        const useColdB3CB = new FieldBoundCheckBox(settings, "useColdB3");
        simSettings.appendChild(labeledCheckbox("盡可能使用瞬發UI1 B3（70級忽略）", useColdB3CB));

        const spendManafontF3PCB = new FieldBoundCheckBox(settings, "spendManafontF3P");
        simSettings.appendChild(labeledCheckbox("使用魔泉賦予的免費F3P（80級及以下忽略）", spendManafontF3PCB));

        configDiv.appendChild(simSettings);

        configDiv.appendChild(new ResultSettingsArea(writeProxy(settings, _updateCallback)));

        return configDiv;
    }

    makeToolTip(result: BlmPpsResult): string {
        return `DPS: ${result.mainDpsResult}\nPPS: ${result.pps}\nwith Enochian: ${result.ppsWithEno}\n`;
    }
}
