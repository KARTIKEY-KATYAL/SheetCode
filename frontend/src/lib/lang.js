function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
        54: "CPP",
        63: "JavaScript",
        71: "Python",
        62: "Java",
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };


export function getLanguageId(language) {
    const languageMap = {
        "CPP": 54,
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "JAVA": 62,
    };
    return languageMap[language.toUpperCase()];
}