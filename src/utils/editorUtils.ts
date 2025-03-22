
// Random user generation for the editor demo

// Array of color options for user avatars
const userColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F59E0B', // amber
  '#EF4444', // red
  '#6366F1', // indigo
  '#06B6D4', // cyan
];

// Array of possible first names
const firstNames = [
  'Alex', 'Taylor', 'Jordan', 'Morgan', 'Riley', 
  'Casey', 'Avery', 'Quinn', 'Skyler', 'Blake',
  'Cameron', 'Reese', 'Jamie', 'Dakota', 'Emerson',
  'Parker', 'Hayden', 'Drew', 'Rowan', 'Finley',
];

// Array of possible last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown',
  'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
  'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
];

// Array of possible user statuses
const userStatuses = [
  'Editing main.js',
  'Viewing index.html',
  'Working on styles',
  'Debugging auth module',
  'Reviewing code',
  'Idle',
  'Writing tests',
  'Adding documentation',
  'Refactoring components',
  'Building UI',
];

// Generate a random user with name, color, and status
export const generateRandomUser = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName.charAt(0)}.`;
  const color = userColors[Math.floor(Math.random() * userColors.length)];
  const status = userStatuses[Math.floor(Math.random() * userStatuses.length)];
  
  return {
    id: Math.random().toString(36).substring(2, 9), // Generate random ID
    name,
    color,
    status,
  };
};

// Syntax highlighting helpers (in a real app, would use a library like Prism.js or highlight.js)
export const highlightSyntax = (code: string, language: string): string => {
  // This is a simplified placeholder. In a real app, use a proper syntax highlighting library
  return code;
};

// Simulated code execution (in a real app, this would be handled server-side)
export const executeCode = (code: string, language: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate processing time
    setTimeout(() => {
      try {
        // This is just a demo simulation
        if (language === 'javascript') {
          if (code.includes('console.log')) {
            // Extract content inside console.log()
            const match = code.match(/console\.log\(['"](.+?)['"]\)/);
            const result = match ? match[1] : 'Hello, world!';
            resolve(result);
          } else {
            resolve('Code executed successfully!');
          }
        } else {
          resolve(`Executed ${language} code successfully!`);
        }
      } catch (error) {
        reject(error instanceof Error ? error.message : 'Unknown error');
      }
    }, 800);
  });
};
