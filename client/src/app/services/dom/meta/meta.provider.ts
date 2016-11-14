
declare var jQuery: any;

export class Meta {
    jQuery: any = jQuery;
    constructor() { }
    /**
     * Create a new meta element in the html document head.
     */
    setMeta(name: string, content: string) {
        content = content.replace(/[^a-zA-Z0-9-_ ]+/g, '');
        this.jQuery('head').append('<meta name=' + name + ' content="' + content + '" />');
    }
}
