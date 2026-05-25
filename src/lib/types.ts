export type MarkerData = {
    position: [number, number];
    style: string;
    label: string;
    type:EntityType;
    stops?: any[];
    onClick: () => void;    
}

export enum EntityType {
    VEHICLE = "VEHICLE",
    STOP = "STOP"
}
