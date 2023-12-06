import C2ePersona from "../interfaces/C2ePersona";
import C2eDigitalDocumentLd from "./C2eDigitalDocumentLd";

class C2eLicenseDigitalDocumentLd extends C2eDigitalDocumentLd {
    url: string;
    fileFormate: string;
    licensee: C2ePersona;
    licenseType?: string = '';
    licenseTerms?: string = '';
    licensePrice?: string = '';
    licenseDateCreated?: string = '';
    licenseExpires?: string = '';

    constructor(
        c2eId: string,
        type: string,
        url: string,
        fileFormate: string,
        licensee: C2ePersona
    ) {
        super(c2eId, type, url, fileFormate);
        this.licensee = licensee;
    }

    // set and get licensee
    setLicensee(licensee: C2ePersona): void {
        this.licensee = licensee;
    }

    getLicensee(): C2ePersona | undefined {
        return this.licensee;
    }

    toJsonLd(): Object {
        let jsonLd = {
            ...super.toJsonLd(),
            dateCreated: this.licenseDateCreated,
            expires: this.licenseExpires,
            additionalType: this.licenseType,
            usageInfo: {
                "@type": "sdons:DefinedTermSet",
                name: "License Terms",
                hasDefinedTerm: {
                    "@type": "sdons:DefinedTerm",
                    "name": this.licenseTerms,
                    "termCode": this.licenseTerms?.toLowerCase(),
                },
            },
            offers: {
                "@type": "sdons:Offer",
                "price": this.licensePrice,
                "priceCurrency": "USD"
            },
            licensee: this.getLicensee()?.toJsonLd(),
        };

        return jsonLd;
    }
}

export default C2eLicenseDigitalDocumentLd;
