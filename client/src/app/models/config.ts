
export class Config {
	siteTitle: string;
	siteDescription: string;
    // Domain name of base site without trailing slash. e.g. www.collectiblecms.com
    siteDomain: string;
    // Message Of The Day.
    motd: string;
}

export class ConfigContainer {
	config: Config;
}
