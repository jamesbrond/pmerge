import { TemplateRef } from "@angular/core";

export interface Toast {
    header?: string;
    body: any;
    delay?: number;
    classname?: string;
}