export type MarkerData = {
    position: [number, number];
    style: string;
    label: string;
    type:EntityType;
    onClick: () => void;    
}

export enum EntityType {
    VEHICLE = "VEHICLE",
    STOP = "STOP"
}
