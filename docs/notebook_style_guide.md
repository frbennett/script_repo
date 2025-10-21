# Notebook Presentation Style Guide

This style guide is derived from the presentation style used in the `ai_script_summary.ipynb` notebook located at scripts/utilities/ai_script_summary. It serves as a template for structuring Jupyter notebooks in the repository to ensure consistency, readability, and professional documentation. The goal is to make notebooks self-explanatory, educational, and easy to follow, blending explanatory Markdown, well-documented code, visual callouts (admonitions), and practical demonstrations.

Adopt this style for all new notebooks, especially those involving data processing, AI integrations, or utility scripts. It emphasizes clear sectioning, rationale explanations, code with docstrings, and interactive examples.

## Overall Structure

Organize notebooks into logical sections that flow from motivation to implementation, demonstration, and usage. Use Markdown headers for navigation:

- **Top-Level Title**: Start with a single `#` header for the notebook's main title (e.g., `# AI Script Summary`).
- **Subsections**: Use `##` for major sections (e.g., `## Why use admonition notes in your notebooks`, `## Libraries and data`).
- **Sub-subsections**: Use `###` for detailed breakdowns (e.g., `### Primary Reasons for Using Admonitions`).
- **Separators**: Include horizontal lines (`---`) or visual separators (e.g., `# ==============================================================================`) between major code blocks or sections for visual breaks.

End with a demonstration of the notebook's functionality, often self-referential, and provide offline alternatives if applicable.

## Explanatory Content and Rationale

Begin with motivational sections to explain *why* the notebook exists and its value:

- Use prose paragraphs for detailed explanations.
- Employ bullet points (`-`) for lists of reasons, benefits, or steps (e.g., primary reasons for a technique).
  - Bold key terms with `**` (e.g., `**Highlighting Key Information**`).
- Include examples early, such as templated styles or simple use cases.
- For complex topics, reference external concepts (e.g., reStructuredText styles) and provide context without overwhelming the reader.

Avoid overuse of lists; prefer paragraphs for narrative flow. If mathematical concepts are involved, use LaTeX syntax for inline (`$equation$`) or display (`$$equation$$`) equations. Ensure compatibility by avoiding KaTeX parse errors (e.g., no escaped backslashes).

## Libraries and Imports

Dedicate a section to dependencies:

- Header: `## Libraries and data`
- Subheader: `# Libraries`
- Separator: `# ==============================================================================`
- List imports vertically, one per line or grouped by category (e.g., API clients, display utilities, file handling).
  - Example:
    ```
    from openai import OpenAI
    from IPython.display import Markdown, display
    import pyperclip
    import os
    import requests
    import nbformat
    import json
    ```
- Comment out alternatives if needed (e.g., `# import openai`).
- If data files are loaded, mention them here or in a dedicated subsection.

This keeps setup isolated and easy to scan.

## Processing Descriptions

Before diving into code, provide an overview:

- Header: `## Processing`
- Describe the overall workflow in 1-2 paragraphs (e.g., "These scripts collectively enable...").
- Subheader: `### Descriptions of Each Function / Class`
  - Use bullet points for each component.
  - Bold the name: `- **function_name()**: Description...`
  - Include key behaviors, inputs/outputs, and purpose.
  - For classes, describe methods similarly (e.g., `- **__init__(self, ...)** (method of ClassName): ...`).

This acts as a high-level API reference, making the code more approachable.

## Code Implementation

Implement functions and classes in dedicated code cells:

- **Docstrings**: Use triple-quoted strings (`"""`) immediately after the `def` or `class` line.
  - Structure: Brief description, `Args:` (indented list), `Returns:` if applicable.
  - Example:
    ```
    def read_notebook(notebook_path):
        """
        Reads a Jupyter notebook file and returns its content.
        
        Args:
            notebook_path (str): Path to the .ipynb file
            
        Returns:
            nbformat.NotebookNode: Parsed notebook object
        """
    ```
- Keep code clean: Indent properly, use descriptive variable names, and handle errors (e.g., `raise ValueError`).
- For classes, document the class overview first, then methods.
- Private methods (e.g., `_get_response`) can be concise but include purpose.

Space code cells with empty lines for readability. Include progress prints (e.g., `print("Reading notebook...")`) for interactive feedback.

## Prompts and Templates

If the notebook involves AI or templated text (e.g., for LLMs):

- Header: `## Prompts`
- Explain each prompt's role in prose (e.g., "The `prompt_prefix` is a structured template...").
- Define as string variables:
  - Use f-strings for multi-line prompts.
  - Structure with numbered headings for AI responses (e.g., "1. The main purpose...").
  - Include instructions like "Organise your response under the following headings:" and formatting rules (e.g., LaTeX, bibliography).
- For HTML templates, define as multi-line strings and explain insertion points (e.g., `[short_summary]`).

Copy prompts to clipboard (`pyperclip.copy()`) for easy testing.

## Examples and Admonitions

Use custom HTML admonitions for callouts to enhance visual appeal and focus attention:

- **Structure**: Wrap in `<div class="admonition [type]" ...>` with inline styles for background, border, padding, and radius.
  - Types: `note` (cyan, #00b8d4), `example` (purple, #5c6bc0), `warning` (orange), etc.
  - Example for "Example":
    ```
    <div class="admonition example" name="html-admonition" style="background: rgba(92,107,192,.1); padding-top: 0px; padding-bottom: 6px; border-radius: 8px; border-left: 8px solid #5c6bc0; border-color: #5c6bc0; padding-left: 10px; padding-right: 10px;">
    <p class="title">
        <i style="font-size: 18px; color:#5c6bc0;">🔧</i>
        <b style="color: #5c6bc0;">Example</b>
    </p>
    <p>
        Description of the example...
    </p>
    </div>
    ```
- **Icons**: Use Unicode (e.g., `&#128221;` for tools, `&#9998;` for note) or emojis.
- **Usage**: Place after relevant code to demonstrate (e.g., "The `summarise_this` function serves as...").
- For "Note": Similar structure with cyan theme.

These render nicely in Jupyter and exported formats like HTML/PDF.

## Usage and Demonstration

Show practical application:

- Define orchestrating functions (e.g., `def summarise_this(path, model=...)`).
- Run on a sample (e.g., self-notebook): Set `notebook_to_summarise = 'path/to/self.ipynb'`.
- Display results: Use `IPython.display.Markdown(result)` for formatted output.
- Copy to clipboard: `pyperclip.copy(all_result)` for easy pasting into docs.
- Compose outputs: Combine short summary (HTML snippet) with detailed sections (e.g., `# Detailed Summary\n---\n{summary}`).

Include environment checks (e.g., API keys via `os.environ.get()`).

## Offline Options

Provide API-independent alternatives:

- Header: `## Offline option`
- Re-extract content and build prompts without calling APIs.
- Copy prompts: `pyperclip.copy(prompt)` for manual pasting into chatbots.
- Explain: "Simply build the prompt... and paste into a chatbot."

This ensures accessibility.

## Final Output and Best Practices

- **Structured Summaries**: If generating summaries, use fixed headings (e.g., `## 1. The main purpose...`) for consistency.
- **Bibliography**: Add at end if references used (e.g., "Jupyter notebooks... [Reference: ...]").
- **Fun Fact**: End with an interesting, relevant tidbit (e.g., "Jupyter notebooks, originally...").
- **Versioning**: In HTML snippets, include authors, date, version (e.g., `<strong>Date:</strong> 17/10/25`).
- **GitHub Integration**: Embed buttons for download/open using JS (e.g., `handleGitHubAction` script with JSZip for zips).
- **General Tips**:
  - Keep cells focused: One function per cell where possible.
  - Test self-referentially to validate.
  - Limit history/tokens in AI calls to avoid overflow.
  - Ensure cross-platform compatibility (e.g., UTF-8 encoding).

Follow this guide to maintain a cohesive, professional notebook repository. For questions, reference the template notebook.