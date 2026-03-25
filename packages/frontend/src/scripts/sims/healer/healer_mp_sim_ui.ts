import {SimulationGui} from "../simulation_gui";
import {EmptyObject} from "@xivgear/util/util_types";
import {NamedSection} from "../../components/general/section";
import {simpleMappedResultTable} from "../components/simple_tables";
import {MPResult, MPSettings} from "@xivgear/core/sims/healer/healer_mp";

export class MPSimGui extends SimulationGui<MPResult, MPSettings, EmptyObject> {
    makeConfigInterface = this.makeDescriptionPanel;

    makeResultDisplay(result: MPResult): HTMLElement {
        const tbl = simpleMappedResultTable<MPResult>({
            'mainDpsResult': 'MP per minute',
            'baseRegen': 'MP Regen without actions',
            'minutesToZero': 'Minutes to Zero',
        })(result);
        tbl.classList.add('sim-basic-result-table');
        const description = this.makeDescriptionPanel();
        description.appendChild(tbl);
        description.style.maxWidth = '500px';
        return description;
    }

    makeDescriptionPanel(): HTMLElement {
        const out = new NamedSection('MP per Minute');
        const text = document.createElement('p');
        text.textContent = '此計算代表標準化為60秒周期的MP收支。這是簡化計算，實際耗盡MP的時間取決於其他因素，但可用於比較額外技能速度和信仰的影響。';
        out.contentArea.appendChild(text);
        return out;
    }
}
