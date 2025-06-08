"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "@/prism"; // the file you created above
import { useDebounce } from "@/lib/hooks/use-debounce";

interface EditorPaneProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

const DEFAULT_LATEX = `\\documentclass[11pt,a4paper]{article}

% Minimal packages for fast compilation
\\usepackage[margin=2cm]{geometry}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern} % Latin Modern (CM-based) font
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}

% Remove page numbers
\\pagestyle{empty}

% Customize section formatting
\\titleformat{\\section}{\\large\\bfseries}{\\thesection}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

% Custom commands for cleaner formatting
\\newcommand{\\cvitem}[2]{\\textbf{#1} \\hfill #2\\\\}
\\newcommand{\\cventry}[4]{\\textbf{#1} \\hfill #2\\\\\\textit{#3} \\hfill #4\\\\[4pt]}

\\begin{document}

% Header
\\begin{center}
    {\\LARGE\\textbf{Your Name}}\\\\[4pt]
    {\\large Your Title/Position}\\\\[8pt]
    Email: your.email@example.com \\quad 
    Phone: +123 456 7890 \\quad 
    LinkedIn: linkedin.com/in/yourprofile\\\\
    Location: Your City, Country
\\end{center}

\\vspace{12pt}

% Professional Summary
\\section{Profile}
Brief professional summary highlighting your key strengths, experience, and career objectives. Keep this concise and impactful, typically 2-3 sentences that capture your value proposition.

% Experience
\\section{Experience}

\\cventry{Job Title}{Company Name}{Brief description of role and key achievements}{2020--Present}
\\begin{itemize}[leftmargin=20pt,itemsep=2pt]
    \\item Achievement or responsibility with quantifiable results
    \\item Another key accomplishment or skill demonstrated
    \\item Third point highlighting impact or expertise
\\end{itemize}

\\cventry{Previous Job Title}{Previous Company}{Role description and main contributions}{2018--2020}
\\begin{itemize}[leftmargin=20pt,itemsep=2pt]
    \\item Key achievement with measurable impact
    \\item Important responsibility or project
    \\item Relevant skill or accomplishment
\\end{itemize}

% Education
\\section{Education}

\\cventry{Degree Name}{University Name}{Relevant coursework, GPA (if strong), honors}{2014--2018}

\\cventry{Additional Qualification}{Institution Name}{Brief description if relevant}{Year}

% Skills
\\section{Skills}

\\cvitem{Technical Skills:}{Programming languages, software, tools}
\\cvitem{Languages:}{English (Native), French (Fluent), Spanish (Conversational)}
\\cvitem{Certifications:}{Relevant professional certifications}

% Projects (Optional)
\\section{Key Projects}

\\cventry{Project Name}{Technology/Context}{Brief description of project scope and your contribution}{Year}

\\cventry{Another Project}{Technology/Context}{Description focusing on results and technologies used}{Year}

% Additional Sections (uncomment as needed)
%
% \\section{Publications}
% \\cvitem{Title of Publication}{Journal/Conference Name, Year}
%
% \\section{Awards \\& Honors}
% \\cvitem{Award Name}{Issuing Organization, Year}
%
% \\section{Volunteer Experience}
% \\cventry{Role}{Organization}{Description of contributions}{Year}

\\end{document}`;
export function EditorPane({
  initialContent,
  onContentChange,
}: EditorPaneProps) {
  const [content, setContent] = useState(initialContent || DEFAULT_LATEX);
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    onContentChange?.(debouncedContent);
  }, [debouncedContent, onContentChange]);

  // Prism highlight function for LaTeX
  const highlight = (code: string) =>
    Prism.highlight(code, Prism.languages.latex, "latex");

  return (
    <div className="h-screen p-4">
      <Editor
        value={content}
        onValueChange={setContent}
        highlight={highlight}
        padding={10}
        className="font-mono text-sm h-full p-4 w-full !overflow-y-scroll bg-white text-black rounded-lg"
        style={{
          fontFamily: "Fira Code, monospace",
          minHeight: "100%",
          whiteSpace: "pre-wrap", // allow wrapping
          wordBreak: "break-word", // break long words like one big LaTeX string
        }}
        textareaId="latex-editor"
      />
    </div>
  );
}
