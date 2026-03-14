// SCI (Software Carbon Intensity) defaults
// Based on Green Software Foundation SCI specification
export const SCI_DEFAULTS = {
  devicePowerW: 18,           // M1 Pro software-attributable power draw in watts
  carbonIntensity: 332,       // gCO2eq/kWh, GitHub Actions median grid intensity
  embodiedTotalG: 211_000,    // gCO2eq, Apple LCA minus use-phase emissions
  lifetimeHours: 11_680,      // 4 years x 365 days x 8 hours/day
};

// SWD (Sustainable Web Design) v4 coefficients
// Based on the Sustainable Web Design model v4 by Wholegrain Digital
export const SWD_DEFAULTS = {
  segments: {
    dataCenters: { energyShare: 0.22, operational: 0.82, embodied: 0.18 },
    networks:    { energyShare: 0.24, operational: 0.82, embodied: 0.18 },
    userDevices: { energyShare: 0.54, operational: 0.49, embodied: 0.51 },
  },
  energyIntensity: {
    operational: { dataCenters: 0.055, networks: 0.059, userDevices: 0.080 },  // kWh/GB
    embodied:    { dataCenters: 0.012, networks: 0.013, userDevices: 0.081 },  // kWh/GB
  },
  globalCarbonIntensity: 494,  // gCO2e/kWh, Ember 2022 global average
  defaultNewVisitorRatio: 0.75,
  defaultReturnCacheRatio: 0.02,
};
