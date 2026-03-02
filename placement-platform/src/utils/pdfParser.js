export async function parsePDFToSections(file, pdfjsLib) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // 1. Extract text with Y-coordinates to build proper lines
    const textItems = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        content.items.forEach(item => {
            textItems.push({
                str: item.str,
                y: item.transform[5], // Y coordinate
                x: item.transform[4]  // X coordinate
            });
        });
    }

    // 2. Group items into lines based on Y coordinate matching (with a small margin of error)
    // Sort by Y (descending, top to bottom) then X (ascending, left to right)
    textItems.sort((a, b) => {
        if (Math.abs(b.y - a.y) > 3) {
            return b.y - a.y;
        }
        return a.x - b.x;
    });

    const lines = [];
    let currentY = null;
    let currentLine = [];

    textItems.forEach(item => {
        if (currentY === null || Math.abs(currentY - item.y) > 3) {
            if (currentLine.length > 0) {
                lines.push(currentLine.join(' ').trim());
            }
            currentY = item.y;
            currentLine = [item.str.trim()];
        } else {
            currentLine.push(item.str.trim());
        }
    });
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' ').trim());
    }

    // Filter out empty lines and weird spacing
    const cleanLines = lines.filter(l => l.length > 0).map(l => l.replace(/\s+/g, ' '));
    const fullText = cleanLines.join('\n');

    // 3. Segment the text into sections
    const sections = {
        skills: [],
        projects: [],
        experience: [],
        rawText: fullText
    };

    let currentSection = 'other';

    for (let i = 0; i < cleanLines.length; i++) {
        const line = cleanLines[i];
        const lowerLine = line.toLowerCase();

        // Detect section headers
        if (lowerLine === 'skills' || lowerLine === 'technical skills' || lowerLine.startsWith('skills:')) {
            currentSection = 'skills';
            continue;
        } else if (lowerLine === 'projects' || lowerLine === 'project work' || lowerLine === 'academic projects') {
            currentSection = 'projects';
            continue;
        } else if (lowerLine === 'experience' || lowerLine === 'work experience' || lowerLine === 'internship' || lowerLine === 'experience or internship') {
            currentSection = 'experience';
            continue;
        } else if (lowerLine === 'education' || lowerLine === 'interests' || lowerLine === 'hobbies' || lowerLine === 'achievements') {
            currentSection = 'other';
            continue;
        }

        // Add line to current section
        if (currentSection === 'skills' && line.length > 2) {
             sections.skills.push(line);
        } else if (currentSection === 'projects' && line.length > 2) {
             sections.projects.push(line);
        } else if (currentSection === 'experience' && line.length > 2) {
             sections.experience.push(line);
        }
    }

    return sections;
}
