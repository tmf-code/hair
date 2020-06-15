export const maxLengthAsPercentWidth = 0.1;
export const maxWidthAsPercentWidth = 0.002;
export const hairColor = 'black';
export const razorWidth = 0.4;
export const razorHeight = 0.1;
export const swirlRadius = 2;
export const maxFallingHair = 1500;
export const animationDuration = 800;
export const widthPoints = 60;
export const heightPoints = 60;

export const mouseVelocitySampleInterval = 50;
export const mouseDirectionSampleInterval = 50;
export const offscreen = [-100, -100] as [number, number];

export const growthPerTick = 0.001;
export const growthTickInterval = 100;

export const cachedMovementCount = 10;
export const emitInterval = 1000;
export const sampleInterval = Math.floor(emitInterval / cachedMovementCount);

export const playerLayer = 0.02 as const;
export const friendLayer = 0.01 as const;
export const hairLayer = 0 as const;
