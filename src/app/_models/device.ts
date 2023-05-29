export interface Device {
    id: string;
    name: string;
    os: string;
    osMinVersion: string;
    osMaxVersion: string;
    chipset: string;
    fingerprintScanner?: string;
    faceRecognition?: string;
  }
  