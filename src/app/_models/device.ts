export interface Device {
    id: string;
    name: string;
    os: string;
    osMinVersion: string;
    oosMaxVersions: string;
    chipset: string;
    fingerprintScanner?: string;
    faceRecognition?: string;
  }
  