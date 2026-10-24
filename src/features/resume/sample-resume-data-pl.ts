import type { ResumeData } from '@/features/resume/form-types';

// Developer-focused sample data (for Developer template) - Polish version
export const sampleResumeDataPl: ResumeData = {
    personalInfo: {
        firstName: 'Michał',
        lastName: 'Nowak',
        location: 'Warszawa',
        title: 'Senior Full Stack Developer',
        phone: '+48 512 345 678',
        email: 'michal.nowak@email.pl',
        website: 'michalnowak.dev',
        linkedin: 'michal-nowak-dev',
        github: 'mnowak-dev',
    },
    experiences: [
        {
            company: 'TechPol Solutions',
            position: 'Senior Full Stack Developer',
            location: 'Warszawa',
            startDate: '2022-03',
            endDate: '',
            current: true,
            description: `• Kierowanie rozwojem architektury mikroserwisów z użyciem Node.js i React
• Implementacja pipeline'ów CI/CD i strategii automatycznego testowania
• Mentoring młodszych programistów i prowadzenie code review
• Optymalizacja wydajności aplikacji i redukcja czasu ładowania o 40%
• Współpraca z zespołem produktowym przy definiowaniu wymagań technicznych
• Zarządzanie infrastrukturą chmurową na AWS i implementacja rozwiązań skalowalności`,
        },
        {
            company: 'Digital Innovations Sp. z o.o.',
            position: 'Full Stack Developer',
            location: 'Kraków',
            startDate: '2019-06',
            endDate: '2022-02',
            current: false,
            description: `• Rozwój i utrzymanie API RESTful z użyciem Express.js i PostgreSQL
• Budowanie responsywnych aplikacji webowych w React i TypeScript
• Implementacja funkcji czasu rzeczywistego z wykorzystaniem WebSocket
• Integracja zewnętrznych serwisów i bramek płatniczych
• Udział w procesach zwinnego rozwoju oprogramowania
• Poprawa jakości kodu przez testy jednostkowe i dokumentację`,
        },
    ],
    education: [
        {
            institution: 'Politechnika Warszawska',
            degree: 'Magister inżynier',
            field: 'Informatyka',
            startDate: '2014-10',
            endDate: '2019-06',
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
        { language: 'Polski', proficiency: 'NATIVE' },
        { language: 'Angielski', proficiency: 'C1' },
        { language: 'Niemiecki', proficiency: 'A2' },
    ],
    interests: [
        { name: 'Open Source' },
        { name: 'Cloud Computing' },
        { name: 'Sztuczna inteligencja' },
        { name: 'Fotografia' },
        { name: 'Turystyka górska' },
        { name: 'Szachy' },
    ],
};

// Generic professional sample data (for Default template) - Polish version
export const sampleDefaultResumeDataPl: ResumeData = {
    personalInfo: {
        firstName: 'Anna',
        lastName: 'Wiśniewska',
        location: 'Poznań',
        title: 'Marketing Manager',
        phone: '+48 601 234 567',
        email: 'anna.wisniewska@email.pl',
        website: '',
        linkedin: 'anna-wisniewska',
        github: '',
    },
    experiences: [
        {
            company: 'Global Brands Polska',
            position: 'Marketing Manager',
            location: 'Poznań',
            startDate: '2021-01',
            endDate: '',
            current: true,
            description: `• Zarządzanie kampaniami marketingowymi w kanałach cyfrowych i tradycyjnych
• Kierowanie zespołem 5 specjalistów marketingu i koordynacja z agencjami zewnętrznymi
• Opracowywanie strategii marki, które zwiększyły udział w rynku o 15%
• Nadzór nad rocznym budżetem marketingowym 8 mln PLN i optymalizacja ROI
• Analiza trendów rynkowych i działań konkurencji w celu informowania strategii
• Budowanie partnerstw z kluczowymi interesariuszami i mediami`,
        },
        {
            company: 'Kreatywne Rozwiązania',
            position: 'Senior Marketing Specialist',
            location: 'Wrocław',
            startDate: '2018-03',
            endDate: '2020-12',
            current: false,
            description: `• Realizacja zintegrowanych kampanii marketingowych dla klientów B2B i B2C
• Zarządzanie obecnością w mediach społecznościowych i kalendarzem treści dla wielu marek
• Koordynacja wydarzeń i targów z udziałem ponad 500 uczestników
• Tworzenie materiałów marketingowych: broszur, prezentacji i raportów
• Prowadzenie badań klientów i tworzenie person kupujących
• Osiągnięcie 25% wzrostu generowania leadów przez kampanie targetowane`,
        },
        {
            company: 'Retail Dynamics Polska',
            position: 'Marketing Coordinator',
            location: 'Łódź',
            startDate: '2015-06',
            endDate: '2018-02',
            current: false,
            description: `• Wsparcie zespołu marketingu w planowaniu i realizacji kampanii
• Zarządzanie kampaniami e-mail marketingu z bazą ponad 50 000 subskrybentów
• Koordynacja z zespołem graficznym przy produkcji materiałów promocyjnych
• Śledzenie i raportowanie wskaźników efektywności kampanii`,
        },
    ],
    education: [
        {
            institution: 'Uniwersytet Ekonomiczny w Poznaniu',
            degree: 'Magister',
            field: 'Zarządzanie i Marketing',
            startDate: '2011-10',
            endDate: '2016-06',
            description: '',
        },
    ],
    skills: [
        { name: 'Strategia marketingowa' },
        { name: 'Zarządzanie marką' },
        { name: 'Marketing cyfrowy' },
        { name: 'Media społecznościowe' },
        { name: 'Content marketing' },
        { name: 'Badania rynku' },
        { name: 'Zarządzanie projektami' },
        { name: 'Zarządzanie zespołem' },
        { name: 'Zarządzanie budżetem' },
        { name: 'Analityka' },
        { name: 'Systemy CRM' },
        { name: 'Public Relations' },
    ],
    languages: [
        { language: 'Polski', proficiency: 'NATIVE' },
        { language: 'Angielski', proficiency: 'C1' },
        { language: 'Francuski', proficiency: 'B1' },
    ],
    interests: [
        { name: 'Podróże' },
        { name: 'Fotografia' },
        { name: 'Wolontariat' },
        { name: 'Gotowanie' },
        { name: 'Książki' },
    ],
};

// Veterinary professional sample data (for Veterinary template) - Polish version
export const sampleVeterinaryResumeDataPl: ResumeData = {
    personalInfo: {
        firstName: 'Katarzyna',
        lastName: 'Kowalska',
        location: 'Gdańsk',
        title: 'Lekarz weterynarii',
        phone: '+48 507 890 123',
        email: 'katarzyna.kowalska@email.pl',
        website: '',
        linkedin: 'katarzyna-kowalska-vet',
        github: '',
    },
    experiences: [
        {
            company: 'Klinika Weterynaryjna Przymorze',
            position: 'Starszy Lekarz Weterynarii',
            location: 'Gdańsk',
            startDate: '2020-08',
            endDate: '',
            current: true,
            description: `• Zapewnianie kompleksowej opieki medycznej dla małych zwierząt: psów, kotów i zwierząt egzotycznych
• Wykonywanie zabiegów chirurgicznych w tym sterylizacji, kastracji i operacji tkanek miękkich
• Diagnozowanie i leczenie złożonych schorzeń z wykorzystaniem nowoczesnego sprzętu diagnostycznego
• Mentoring studentów weterynarii i młodszych pracowników
• Budowanie długotrwałych relacji z właścicielami zwierząt i edukacja klientów
• Prowadzenie przypadków nagłych i pacjentów intensywnej opieki`,
        },
        {
            company: 'Gabinet Weterynaryjny "Pod Łapą"',
            position: 'Lekarz Weterynarii',
            location: 'Sopot',
            startDate: '2017-06',
            endDate: '2020-07',
            current: false,
            description: `• Prowadzenie rutynowych badań zdrowotnych i programów szczepień
• Wykonywanie zabiegów stomatologicznych i leczenia profilaktycznego
• Prowadzenie przypadków chorób przewlekłych w tym cukrzycy i chorób nerek
• Współpraca ze specjalistami w zakresie zaawansowanych skierowań
• Wdrażanie protokołów klinicznych dla poprawy wyników leczenia
• Uczestnictwo w działaniach społecznych i wydarzeniach adopcyjnych`,
        },
        {
            company: 'Uniwersytecki Szpital Weterynaryjny',
            position: 'Stażysta',
            location: 'Olsztyn',
            startDate: '2016-06',
            endDate: '2017-05',
            current: false,
            description: `• Rotacje przez różne oddziały specjalistyczne: chirurgia, interna i oddział ratunkowy
• Asystowanie przy złożonych zabiegach chirurgicznych i opiece pooperacyjnej
• Zdobywanie doświadczenia w medycynie dużych zwierząt i koni
• Uczestnictwo w projektach badawczych klinicznych`,
        },
    ],
    education: [
        {
            institution: 'Uniwersytet Warmińsko-Mazurski w Olsztynie',
            degree: 'Lekarz weterynarii',
            field: 'Weterynaria',
            startDate: '2010-10',
            endDate: '2016-06',
            description: '',
        },
    ],
    skills: [
        { name: 'Medycyna małych zwierząt' },
        { name: 'Chirurgia' },
        { name: 'Stomatologia' },
        { name: 'Radiologia' },
        { name: 'USG' },
        { name: 'Medycyna ratunkowa' },
        { name: 'Anestezjologia' },
        { name: 'Komunikacja z klientem' },
        { name: 'Diagnostyka laboratoryjna' },
        { name: 'Zwierzęta egzotyczne' },
        { name: 'Leczenie bólu' },
        { name: 'Medycyna prewencyjna' },
    ],
    languages: [
        { language: 'Polski', proficiency: 'NATIVE' },
        { language: 'Angielski', proficiency: 'B2' },
    ],
    interests: [
        { name: 'Ochrona zwierząt' },
        { name: 'Turystyka piesza' },
        { name: 'Ochrona przyrody' },
        { name: 'Jazda konna' },
        { name: 'Fotografia przyrodnicza' },
    ],
};
