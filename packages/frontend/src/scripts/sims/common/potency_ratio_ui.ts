import {SimSettings} from "@xivgear/core/sims/sim_types";
import {SimulationGui} from "../simulation_gui";
import {EmptyObject} from "@xivgear/util/util_types";
import {NamedSection} from "../../components/general/section";
import {simpleMappedResultTable} from "../components/simple_tables";
import {PotencyRatioSimResults} from "@xivgear/core/sims/common/potency_ratio";

function makeDescriptionPanel() {
    const out = new NamedSection('Potency Ratio');
    const text = document.createElement('p');
    text.textContent = '此計算代表100威力技能的預期傷害。這不代表準確的DPS值，因為未考慮技能速度/詠唱速度。';
    out.contentArea.appendChild(text);
    return out;
}

export class PotencyRatioSimGui extends SimulationGui<PotencyRatioSimResults, SimSettings, EmptyObject> {
    makeConfigInterface = makeDescriptionPanel;

    makeResultDisplay(result: PotencyRatioSimResults): HTMLElement {
        const tbl = simpleMappedResultTable<PotencyRatioSimResults>({
            'mainDpsResult': 'Dmg/100p, with Crit/DH',
            'withoutCritDh': 'Dmg/100p, no Crit/DH',
        })(result);
        tbl.classList.add('sim-basic-result-table');
        const description = makeDescriptionPanel();
        description.appendChild(tbl);
        description.style.maxWidth = '400px';
        description.style.margin = 'auto';
        return description;
    }
}
