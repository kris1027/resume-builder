interface DescriptionListProps {
    description: string;
    className?: string;
}

export function DescriptionList({ description, className = '' }: DescriptionListProps) {
    if (!description) return null;

    // Split by newlines and filter empty lines
    const lines = description.split('\n').filter((line) => line.trim());

    return (
        <div className={className}>
            {lines.map((line, index) => {
                const trimmedLine = line.trim();
                // Check if line starts with a bullet point (•, -, *, ‣, ◦, ⁃, ∙)
                const bulletMatch = trimmedLine.match(/^([-*\u2022\u2023\u25E6\u2043\u2219])\s*/);

                if (bulletMatch) {
                    const bullet = bulletMatch[1];
                    const text = trimmedLine.slice(bulletMatch[0].length);
                    return (
                        <div key={index} className='flex gap-2'>
                            <span className='flex-shrink-0'>{bullet}</span>
                            <span>{text}</span>
                        </div>
                    );
                }

                // Regular line without bullet
                return <div key={index}>{trimmedLine}</div>;
            })}
        </div>
    );
}
