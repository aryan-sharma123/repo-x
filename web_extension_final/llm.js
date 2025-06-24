// llm.js - Updated to use the provided API key
async function fetchCssSuggestions(htmlSnippet, prompt) {
    try {
        // Get API key from the function's scope
        const API_KEY = this.apiKey || 'your-api-key';

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `Given this HTML:\n${htmlSnippet}\n\n${prompt}\n\nReturn ONLY valid CSS.`
                }],
                temperature: 0.2
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        return data.choices[0]?.message?.content.trim() || '';
    } catch (err) {
        console.error("LLM Error:", err);
        return null;
    }
}