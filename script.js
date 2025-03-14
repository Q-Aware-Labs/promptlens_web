document.addEventListener('DOMContentLoaded', function() {
    // Load saved API keys if available - with try/catch to handle sandboxed environments
    try {
        const savedOpenAIKey = localStorage.getItem('openaiApiKey');
        const savedDeepSeekKey = localStorage.getItem('deepseekApiKey');
        
        if (savedOpenAIKey) {
            document.getElementById('openaiApiKey').value = savedOpenAIKey;
        }
        
        if (savedDeepSeekKey) {
            document.getElementById('deepseekApiKey').value = savedDeepSeekKey;
        }
    } catch (error) {
        console.log('localStorage not available in this environment');
        // Continue without localStorage functionality
    }
    
    // Toggle API section visibility
    document.getElementById('toggleApiSection').addEventListener('click', function() {
        const apiSection = document.getElementById('apiSection');
        const icon = this.querySelector('i');
        
        if (apiSection.style.display === 'none') {
            apiSection.style.display = 'block';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            apiSection.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
    
    // Toggle API key visibility
    document.querySelectorAll('.toggle-visibility').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const inputElement = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (inputElement.type === 'password') {
                inputElement.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                inputElement.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Model selection toggle
    document.querySelectorAll('.model-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.model-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            const selectedModel = this.getAttribute('data-model');
            if (selectedModel === 'openai') {
                document.getElementById('openaiKeySection').style.display = 'block';
                document.getElementById('deepseekKeySection').style.display = 'none';
            } else {
                document.getElementById('openaiKeySection').style.display = 'none';
                document.getElementById('deepseekKeySection').style.display = 'block';
            }
        });
    });
    
    // Technique descriptions for info panel
    const techniqueDescriptions = {
        'chain-of-thought': 'Chain of Thought prompts the AI to break down its reasoning process step by step, showing the logical path to its conclusions. This improves accuracy on complex tasks by encouraging deliberate thinking.',
        'step-by-step': 'Step-by-Step Reasoning instructs the AI to solve problems incrementally, showing each step explicitly. This technique reduces errors and makes outputs more understandable and verifiable.',
        'persona': 'Persona-Based prompting assigns the AI a specific character, role, or personality to frame its responses. This can influence style, tone, expertise level, and perspective in the generated content.',
        'examples': 'Few-Shot Examples provide demonstrations of desired outputs within the prompt. This guides the AI by showing exactly what you want, especially useful for specific formats or styles.',
        'constraints': 'Constraints & Parameters set specific limitations or requirements for the AI to follow. This could include word count, audience level, or other formatting specifications.',
        'role-play': 'Role-Playing asks the AI to respond as if it were a specific expert or professional. This can provide specialized knowledge perspectives from fields like medicine, law, or engineering.',
        'schema': 'Schema-Based prompting provides a structured format or template that the AI must follow in its response, ensuring consistent organization of information.',
        'template': 'Template-Driven prompting uses standardized formats with placeholders for the AI to complete, ensuring predictable, consistent output structures.',
        'structured-output': 'Structured Output instructs the AI to format its response in a specific way, such as JSON, table, or other organized data structure for easier parsing or integration.',
        'zero-shot': 'Zero-Shot Learning asks the AI to perform tasks without specific examples, relying on its pre-trained knowledge. This works well for straightforward tasks where the AI already understands the context.',
        'creative': 'Creative Enhancement focuses on generating unique, imaginative content by encouraging the AI to think outside conventional patterns and explore novel ideas.',
        'concise': 'Concise & Clear prompting techniques focus on getting direct, to-the-point responses without unnecessary elaboration, perfect for when brevity is valued.'
    };
    
    // Technique selection
    document.querySelectorAll('.technique-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Update description for the last selected technique
            const activeChips = document.querySelectorAll('.technique-chip.active');
            if (activeChips.length > 0) {
                const lastSelectedTechnique = activeChips[activeChips.length - 1].getAttribute('data-technique');
                document.getElementById('techniqueDescription').innerHTML = `<p>${techniqueDescriptions[lastSelectedTechnique]}</p>`;
            } else {
                document.getElementById('techniqueDescription').innerHTML = `<p>Select a prompt engineering technique to see its description here.</p>`;
            }
        });
    });
    
    // Copy button functionality
    document.getElementById('copyBtn').addEventListener('click', function() {
        const resultText = document.getElementById('resultPrompt').innerText;
        if (resultText) {
            navigator.clipboard.writeText(resultText).then(() => {
                this.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy me-1"></i>Copy';
                }, 2000);
            });
        }
    });
    
    // Generate enhanced prompt
    document.getElementById('generateBtn').addEventListener('click', async function() {
        const basePrompt = document.getElementById('basePrompt').value.trim();
        const selectedTechniques = Array.from(document.querySelectorAll('.technique-chip.active'))
            .map(chip => chip.getAttribute('data-technique'));
        
        if (!basePrompt) {
            alert('Please enter a base prompt.');
            return;
        }
        
        if (selectedTechniques.length === 0) {
            alert('Please select at least one prompt engineering technique.');
            return;
        }
        
        const selectedModel = document.querySelector('.model-option.active').getAttribute('data-model');
        let apiKey;
        
        if (selectedModel === 'openai') {
            apiKey = document.getElementById('openaiApiKey').value.trim();
            if (!apiKey) {
                alert('Please enter your OpenAI API key.');
                return;
            }
            try {
                localStorage.setItem('openaiApiKey', apiKey);
            } catch (error) {
                console.log('localStorage not available for saving API key');
            }
        } else {
            apiKey = document.getElementById('deepseekApiKey').value.trim();
            if (!apiKey) {
                alert('Please enter your DeepSeek API key.');
                return;
            }
            try {
                localStorage.setItem('deepseekApiKey', apiKey);
            } catch (error) {
                console.log('localStorage not available for saving API key');
            }
        }
        
        // Show loader and hide instruction alert
        document.getElementById('loader').style.display = 'block';
        document.getElementById('instructionAlert').style.display = 'none';
        document.getElementById('resultPrompt').innerHTML = '';
        
        try {
            let result;
            if (selectedModel === 'openai') {
                result = await callOpenAI(basePrompt, selectedTechniques, apiKey);
            } else {
                result = await callDeepSeek(basePrompt, selectedTechniques, apiKey);
            }
            
            document.getElementById('loader').style.display = 'none';
            document.getElementById('resultPrompt').innerHTML = result;
        } catch (error) {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('resultPrompt').innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        }
    });
    
    async function callOpenAI(basePrompt, techniques, apiKey) {
        const techniquesText = techniques.join(', ');
        
        const requestBody = {
            model: "gpt-4o",
            input: `I have a prompt that I want to enhance using the following prompt engineering techniques: ${techniquesText}. 
            
            Original prompt: "${basePrompt}"
            
            Please rewrite and enhance this prompt using these techniques to make it more effective. Only return the enhanced prompt, without explanations or additional text.`
        };
        
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error calling OpenAI API');
        }
        
        const data = await response.json();
        
        if (data && data[0] && data[0].content && data[0].content[0]) {
            return data[0].content[0].text;
        } else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    }
    
    async function callDeepSeek(basePrompt, techniques, apiKey) {
        const techniquesText = techniques.join(', ');
        
        const requestBody = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system", 
                    content: "You are a prompt engineering expert who helps users enhance their prompts."
                },
                {
                    role: "user", 
                    content: `I have a prompt that I want to enhance using the following prompt engineering techniques: ${techniquesText}. 
                    
                    Original prompt: "${basePrompt}"
                    
                    Please rewrite and enhance this prompt using these techniques to make it more effective. Only return the enhanced prompt, without explanations or additional text.`
                }
            ],
            stream: false
        };
        
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error calling DeepSeek API');
        }
        
        const data = await response.json();
        
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Unexpected response format from DeepSeek API');
        }
    }
});