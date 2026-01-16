/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClimateZone } from './ClimateZone';
import type { Continent } from './Continent';
export type LocaliteCreate = {
    nom: string;
    quartier?: (string | null);
    ville: string;
    region?: (string | null);
    pays: string;
    code_postal?: (string | null);
    continent: Continent;
    timezone: string;
    superficie?: (number | null);
    population?: (number | null);
    climate_zone?: (ClimateZone | null);
};

