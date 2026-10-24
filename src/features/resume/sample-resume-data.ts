import type { ResumeData } from '@/features/resume/form-types';

// Developer-focused sample data (for Developer template)
export const sampleResumeData: ResumeData = {
    personalInfo: {
        firstName: 'John',
        lastName: 'Anderson',
        location: 'San Francisco, CA',
        title: 'Senior Full Stack Developer',
        phone: '+1 415 555 0123',
        email: 'john.anderson@email.com',
        website: 'johnanderson.dev',
        linkedin: 'john-anderson-dev',
        github: 'janderson-dev',
    },
    experiences: [
        {
            company: 'TechCorp Solutions',
            position: 'Senior Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: '2022-03',
            endDate: '',
            current: true,
            description: `• Leading development of microservices architecture using Node.js and React
• Implementing CI/CD pipelines and automated testing strategies
• Mentoring junior developers and conducting code reviews
• Optimizing application performance and reducing load times by 40%
• Collaborating with product team to define technical requirements
• Managing cloud infrastructure on AWS and implementing scalability solutions`,
        },
        {
            company: 'Digital Innovations Inc',
            position: 'Full Stack Developer',
            location: 'Austin, TX',
            startDate: '2019-06',
            endDate: '2022-02',
            current: false,
            description: `• Developed and maintained RESTful APIs using Express.js and PostgreSQL
• Built responsive web applications using React and TypeScript
• Implemented real-time features using WebSocket connections
• Integrated third-party services and payment gateways
• Participated in agile development processes and sprint planning
• Improved code quality through unit testing and documentation`,
        },
    ],
    education: [
        {
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2015-09',
            endDate: '2019-05',
            description: '',
        },
    ],
    skills: [
        { name: 'JavaScript' },
        { name: 'TypeScript' },
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'Next.js' },
        { name: 'Express.js' },
        { name: 'PostgreSQL' },
        { name: 'MongoDB' },
        { name: 'Redis' },
        { name: 'Docker' },
        { name: 'Kubernetes' },
        { name: 'AWS' },
        { name: 'GraphQL' },
        { name: 'REST APIs' },
        { name: 'Git' },
        { name: 'CI/CD' },
        { name: 'Tailwind CSS' },
        { name: 'Jest' },
    ],
    languages: [
        { language: 'English', proficiency: 'NATIVE' },
        { language: 'Spanish', proficiency: 'B2' },
        { language: 'German', proficiency: 'A2' },
    ],
    interests: [
        { name: 'Open Source' },
        { name: 'Cloud Computing' },
        { name: 'Machine Learning' },
        { name: 'Photography' },
        { name: 'Hiking' },
        { name: 'Chess' },
    ],
};

// Generic professional sample data (for Default template)
export const sampleDefaultResumeData: ResumeData = {
    personalInfo: {
        firstName: 'Sarah',
        lastName: 'Mitchell',
        location: 'Chicago, IL',
        title: 'Marketing Manager',
        phone: '+1 312 555 0456',
        email: 'sarah.mitchell@email.com',
        website: '',
        linkedin: 'sarah-mitchell',
        github: '',
    },
    experiences: [
        {
            company: 'Global Brands Inc',
            position: 'Marketing Manager',
            location: 'Chicago, IL',
            startDate: '2021-01',
            endDate: '',
            current: true,
            description: `• Managing marketing campaigns across digital and traditional channels
• Leading a team of 5 marketing specialists and coordinating with external agencies
• Developing brand strategies that increased market share by 15%
• Overseeing annual marketing budget of $2M and optimizing ROI
• Analyzing market trends and competitor activities to inform strategy
• Building partnerships with key stakeholders and media outlets`,
        },
        {
            company: 'Creative Solutions Agency',
            position: 'Senior Marketing Specialist',
            location: 'Milwaukee, WI',
            startDate: '2018-03',
            endDate: '2020-12',
            current: false,
            description: `• Executed integrated marketing campaigns for B2B and B2C clients
• Managed social media presence and content calendar for multiple brands
• Coordinated events and trade shows with attendance of 500+ participants
• Created marketing materials including brochures, presentations, and reports
• Conducted customer research and developed buyer personas
• Achieved 25% increase in lead generation through targeted campaigns`,
        },
        {
            company: 'Retail Dynamics',
            position: 'Marketing Coordinator',
            location: 'Madison, WI',
            startDate: '2015-06',
            endDate: '2018-02',
            current: false,
            description: `• Supported marketing team in campaign planning and execution
• Managed email marketing campaigns with 50,000+ subscriber base
• Coordinated with design team to produce promotional materials
• Tracked and reported on campaign performance metrics`,
        },
    ],
    education: [
        {
            institution: 'University of Wisconsin',
            degree: 'Bachelor of Arts',
            field: 'Business Administration & Marketing',
            startDate: '2011-09',
            endDate: '2015-05',
            description: '',
        },
    ],
    skills: [
        { name: 'Marketing Strategy' },
        { name: 'Brand Management' },
        { name: 'Digital Marketing' },
        { name: 'Social Media' },
        { name: 'Content Creation' },
        { name: 'Market Research' },
        { name: 'Project Management' },
        { name: 'Team Leadership' },
        { name: 'Budget Management' },
        { name: 'Analytics' },
        { name: 'CRM Systems' },
        { name: 'Public Relations' },
    ],
    languages: [
        { language: 'English', proficiency: 'NATIVE' },
        { language: 'French', proficiency: 'B1' },
    ],
    interests: [
        { name: 'Travel' },
        { name: 'Photography' },
        { name: 'Volunteering' },
        { name: 'Cooking' },
        { name: 'Reading' },
    ],
};

// Veterinary professional sample data (for Veterinary template)
export const sampleVeterinaryResumeData: ResumeData = {
    personalInfo: {
        firstName: 'Emily',
        lastName: 'Roberts',
        location: 'Denver, CO',
        title: 'Veterinarian',
        phone: '+1 303 555 0789',
        email: 'emily.roberts@email.com',
        website: '',
        linkedin: 'emily-roberts-dvm',
        github: '',
    },
    experiences: [
        {
            company: 'Mountain View Animal Hospital',
            position: 'Senior Veterinarian',
            location: 'Denver, CO',
            startDate: '2020-08',
            endDate: '',
            current: true,
            description: `• Providing comprehensive medical care for small animals including dogs, cats, and exotic pets
• Performing surgical procedures including spays, neuters, and soft tissue surgeries
• Diagnosing and treating complex medical conditions using advanced diagnostic equipment
• Mentoring veterinary students and junior staff members
• Building long-term relationships with pet owners and providing client education
• Managing emergency cases and critical care patients`,
        },
        {
            company: 'Paws & Claws Veterinary Clinic',
            position: 'Associate Veterinarian',
            location: 'Boulder, CO',
            startDate: '2017-06',
            endDate: '2020-07',
            current: false,
            description: `• Conducted routine wellness exams and vaccination programs
• Performed dental procedures and preventive care treatments
• Managed chronic disease cases including diabetes and kidney disease
• Collaborated with specialists for advanced treatment referrals
• Implemented clinic protocols for improved patient outcomes
• Participated in community outreach and pet adoption events`,
        },
        {
            company: 'Colorado State Veterinary Hospital',
            position: 'Veterinary Intern',
            location: 'Fort Collins, CO',
            startDate: '2016-06',
            endDate: '2017-05',
            current: false,
            description: `• Rotated through various specialty departments including surgery, internal medicine, and emergency
• Assisted in complex surgical procedures and post-operative care
• Gained experience with large animal and equine medicine
• Participated in clinical research projects`,
        },
    ],
    education: [
        {
            institution: 'Colorado State University',
            degree: 'Doctor of Veterinary Medicine',
            field: 'DVM',
            startDate: '2012-08',
            endDate: '2016-05',
            description: '',
        },
        {
            institution: 'University of Colorado',
            degree: 'Bachelor of Science',
            field: 'Animal Science',
            startDate: '2008-09',
            endDate: '2012-05',
            description: '',
        },
    ],
    skills: [
        { name: 'Small Animal Medicine' },
        { name: 'Surgery' },
        { name: 'Dentistry' },
        { name: 'Radiology' },
        { name: 'Ultrasound' },
        { name: 'Emergency Care' },
        { name: 'Anesthesia' },
        { name: 'Client Communication' },
        { name: 'Laboratory Diagnostics' },
        { name: 'Exotic Animal Care' },
        { name: 'Pain Management' },
        { name: 'Preventive Medicine' },
    ],
    languages: [
        { language: 'English', proficiency: 'NATIVE' },
        { language: 'Spanish', proficiency: 'B2' },
    ],
    interests: [
        { name: 'Animal Rescue' },
        { name: 'Hiking' },
        { name: 'Wildlife Conservation' },
        { name: 'Horse Riding' },
        { name: 'Nature Photography' },
    ],
};
