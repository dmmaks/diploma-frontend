import { TechniqueMitigation } from "./technique-mitigation";

export interface TechniqueMitigationWithLinks {
    id: string;
    name: string;
    description: string;
    links: TechniqueMitigation[];
}