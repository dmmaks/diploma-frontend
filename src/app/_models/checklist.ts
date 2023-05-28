import { ChecklistEntry } from "./checklist-entry";

export interface Checklist {
    id: string;
    name: string;
    deviceName: string;
    entries: ChecklistEntry[];
}