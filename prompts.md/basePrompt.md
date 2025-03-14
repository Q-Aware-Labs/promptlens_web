This is the main prompt used to build PromptLens

To get the desired results I used Anthropic' Claude 3.7 Sonnet model (paid version)

Original prompt:

```console
"I want to develop a web application where users can input a prompt and, by clicking a button, have it rewritten using a selected prompt-engineering technique. The workflow will be:

    A user enters a base prompt

    Selects a prompt technique (including as many options as possible)

    Clicks a generation button to produce a redesigned/rewritten or improved version of the prompt

    Views the final result in a dedicated output area

## Requirements:

    **Tool Name: **"PromptLens"

    **AI Integration:** Use OpenAI's GPT-4o and DeepSeek-r1 models via their respective APIs, with model selection available to users

    **Tech Stack:** Plain JavaScript, HTML, and CSS (Bootstrap)

    **Responsiveness:** Fully mobile-friendly implementation

    **Design:** Modern, professional aesthetic

    **Attachments:**Included reference files for DeepSeek and OpenAI API integration"
```

Key Notes:

- After getting the results, I slightly manually modified the code to meet a few requirements, like separating the web files, updating and adding the README file, etc.
- Although 90% of the code to build this tool was written by AI, I always double check and modify the code when neccessary in order to meet my main goals and cover initial requirements. 
