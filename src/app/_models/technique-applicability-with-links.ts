import { Applicability } from "./applicability";
import { TechniqueMitigationWithLinks } from "./technique-mitigation-with-links";

export interface TechniqueApplicabilityWithLinks {
    techniqueWithLinks: TechniqueMitigationWithLinks;
    applicability: Applicability;
}