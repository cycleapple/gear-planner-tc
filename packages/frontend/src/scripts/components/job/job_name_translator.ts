import {JobName} from "@xivgear/xivmath/xivconstants";
import {DATA_API_CLIENT, ApiJobType, checkResponse} from "@xivgear/core/data_api_client";
import {RoleKey} from "@xivgear/xivmath/geartypes";
import {quickElement} from "@xivgear/common-ui/components/util";
import {toTranslatable} from "@xivgear/i18n/translation";
import {TC_JOB_NAMES} from "@xivgear/core/tc_names";

let dataPromise: Promise<Map<JobName, ApiJobType>> | null = null;

function getDataPromise(): Promise<Map<JobName, ApiJobType>> {
    if (dataPromise === null) {
        dataPromise = DATA_API_CLIENT.jobs.jobs().then(raw => {
            checkResponse(raw);
            const map = new Map<JobName, ApiJobType>();
            raw.data.items.forEach(job => {
                map.set(job.abbreviation as JobName, job);
            });
            return map;
        });
    }
    return dataPromise;
}

/**
 * TC short abbreviations for jobs (single character).
 */
const TC_JOB_ABBREVS: Record<string, string> = {
    PLD: '騎', MNK: '僧', WAR: '戰', DRG: '龍', BRD: '詩',
    WHM: '白', BLM: '黑', SMN: '召', SCH: '學', NIN: '忍',
    MCH: '機', DRK: '暗', AST: '占', SAM: '武', RDM: '紅',
    BLU: '青', GNB: '絕', DNC: '舞', RPR: '魂', SGE: '賢',
    VPR: '蛇', PCT: '繪',
};

export function jobAbbrevTranslated(job: JobName | RoleKey): HTMLSpanElement {
    const text = quickElement('span', ['job-name-translation'], [job]);
    getDataPromise().then(pr => {
        const translation = pr.get(job as JobName)?.abbreviationTranslations;
        if (translation) {
            const tcTranslation = { ...translation, tc: TC_JOB_ABBREVS[job] ?? job };
            text.textContent = toTranslatable(job, tcTranslation).asCurrentLang;
        }
    });
    return text;
}
