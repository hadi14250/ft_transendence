export class LocalizationManager
{
    static language = 'en';
    static translations = {};

    static async loadTranslations()
    {
        try
        {
            const response = await fetch(`/assets/localization/${this.language}.json`);
            if (!response.ok)
                throw new Error(`Could not load ${this.language} translations`);

            this.translations = await response.json();
        }
        catch (error)
        {
            console.error('Error loading translations:', error);
        }
        return null;
    }

    static async setLanguage(language)
    {
        this.language = language;
        await this.loadTranslations();
    }

    static getString(key)
    {
        return this.translations[key] || key;
    }
}