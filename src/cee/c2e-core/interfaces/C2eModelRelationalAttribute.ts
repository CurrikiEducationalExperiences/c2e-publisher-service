interface C2eContentTypeRelationalAttribute {
    hasOne: string;
    hasMany: string;
    belongsTo: string;

    setHasOne(hasOne: string): void;
    getHasOne(): String|undefined;
    setHasMany(hasMany: string): void;
    getHasMany(): string | undefined;
    setBelongsTo(belongsTo: string): void;
    getBelongsTo(): string | undefined;
}

export default C2eContentTypeRelationalAttribute;