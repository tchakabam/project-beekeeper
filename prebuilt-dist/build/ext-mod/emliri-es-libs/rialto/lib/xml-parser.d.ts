export declare type XMLElement = {
    attributes: any;
    text: string;
    name: string;
    type: string;
    elements: XMLElement[];
};
export declare type XMLRootObject = {
    elements: XMLElement[];
};
export declare function parseXmlData(data: string): XMLRootObject;
