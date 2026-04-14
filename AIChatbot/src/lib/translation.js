export async function translateText(text, sourceLang, targetLang) {
    if (sourceLang === targetLang) return text;
    
    const langCodes = {
        english: 'en',
        hindi: 'hi',
        hinglish: 'hi',
        chinese: 'zh-CN',
        bengali: 'bn',
        marathi: 'mr'
    };
    
    const sl = langCodes[sourceLang] || 'en';
    const tl = langCodes[targetLang] || 'en';
    
    if (sl === tl) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();
        
        let translatedText = '';
        if(json && json[0]) {
            json[0].forEach(seg => {
                if(seg[0]) translatedText += seg[0];
            });
        }
        return translatedText || text;
    } catch(e) {
        console.error("Translation Error:", e);
        return text; 
    }
}
