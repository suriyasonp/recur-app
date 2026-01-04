export interface SubscriptionTemplate {
    id: string;
    name: string;
    category: string;
    logo: string; // Emoji or icon class
    defaultAmount: number;
    currency: string;
    defaultFrequency: 'monthly' | 'yearly';
    color: string;
    description?: string;
}

export const subscriptionCatalog: SubscriptionTemplate[] = [
    // Streaming Services
    {
        id: 'netflix',
        name: 'Netflix',
        category: 'Entertainment',
        logo: '🎬',
        defaultAmount: 419,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#E50914',
        description: 'Streaming service'
    },
    {
        id: 'spotify',
        name: 'Spotify',
        category: 'Entertainment',
        logo: '🎵',
        defaultAmount: 129,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#1DB954',
        description: 'Music streaming'
    },
    {
        id: 'youtube-premium',
        name: 'YouTube Premium',
        category: 'Entertainment',
        logo: '▶️',
        defaultAmount: 159,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#FF0000',
        description: 'Ad-free YouTube'
    },
    {
        id: 'disney-plus',
        name: 'Disney+',
        category: 'Entertainment',
        logo: '🏰',
        defaultAmount: 349,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#113CCF',
        description: 'Disney streaming'
    },
    {
        id: 'apple-tv',
        name: 'Apple TV+',
        category: 'Entertainment',
        logo: '🍎',
        defaultAmount: 149,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#000000',
        description: 'Apple streaming'
    },
    {
        id: 'hbo-max',
        name: 'HBO Max',
        category: 'Entertainment',
        logo: '🎭',
        defaultAmount: 299,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#7F3FBF',
        description: 'HBO content'
    },
    {
        id: 'amazon-prime',
        name: 'Amazon Prime',
        category: 'Entertainment',
        logo: '📦',
        defaultAmount: 149,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#FF9900',
        description: 'Prime Video & benefits'
    },

    // Cloud Storage
    {
        id: 'google-one',
        name: 'Google One',
        category: 'Cloud Storage',
        logo: '☁️',
        defaultAmount: 65,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#4285F4',
        description: 'Google cloud storage'
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        category: 'Cloud Storage',
        logo: '📁',
        defaultAmount: 399,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#0061FF',
        description: 'File storage & sync'
    },
    {
        id: 'icloud',
        name: 'iCloud+',
        category: 'Cloud Storage',
        logo: '☁️',
        defaultAmount: 35,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#3693F3',
        description: 'Apple cloud storage'
    },

    // Productivity
    {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        category: 'Productivity',
        logo: '💼',
        defaultAmount: 2199,
        currency: 'THB',
        defaultFrequency: 'yearly',
        color: '#D83B01',
        description: 'Office apps & cloud'
    },
    {
        id: 'notion',
        name: 'Notion',
        category: 'Productivity',
        logo: '📝',
        defaultAmount: 10,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#000000',
        description: 'Workspace & notes'
    },
    {
        id: 'chatgpt-plus',
        name: 'ChatGPT Plus',
        category: 'AI Tools',
        logo: '🤖',
        defaultAmount: 20,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#10A37F',
        description: 'AI assistant'
    },
    {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        category: 'Development',
        logo: '👨‍💻',
        defaultAmount: 10,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#181717',
        description: 'AI code assistant'
    },

    // Fitness & Health
    {
        id: 'fitness-gym',
        name: 'Gym Membership',
        category: 'Fitness',
        logo: '💪',
        defaultAmount: 1500,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#FF6B6B',
        description: 'Gym access'
    },
    {
        id: 'apple-fitness',
        name: 'Apple Fitness+',
        category: 'Fitness',
        logo: '🏃',
        defaultAmount: 329,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#FA233B',
        description: 'Workout classes'
    },

    // Gaming
    {
        id: 'playstation-plus',
        name: 'PlayStation Plus',
        category: 'Gaming',
        logo: '🎮',
        defaultAmount: 1490,
        currency: 'THB',
        defaultFrequency: 'yearly',
        color: '#003087',
        description: 'PS online gaming'
    },
    {
        id: 'xbox-game-pass',
        name: 'Xbox Game Pass',
        category: 'Gaming',
        logo: '🎮',
        defaultAmount: 429,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#107C10',
        description: 'Game library access'
    },
    {
        id: 'nintendo-online',
        name: 'Nintendo Switch Online',
        category: 'Gaming',
        logo: '🎮',
        defaultAmount: 790,
        currency: 'THB',
        defaultFrequency: 'yearly',
        color: '#E60012',
        description: 'Switch online play'
    },

    // News & Reading
    {
        id: 'medium',
        name: 'Medium',
        category: 'Reading',
        logo: '📰',
        defaultAmount: 5,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#000000',
        description: 'Article platform'
    },
    {
        id: 'kindle-unlimited',
        name: 'Kindle Unlimited',
        category: 'Reading',
        logo: '📚',
        defaultAmount: 9.99,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#FF9900',
        description: 'Unlimited ebooks'
    },

    // Communication
    {
        id: 'zoom-pro',
        name: 'Zoom Pro',
        category: 'Communication',
        logo: '📹',
        defaultAmount: 14.99,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#2D8CFF',
        description: 'Video conferencing'
    },
    {
        id: 'slack',
        name: 'Slack',
        category: 'Communication',
        logo: '💬',
        defaultAmount: 7.25,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#4A154B',
        description: 'Team messaging'
    },

    // Design & Creative
    {
        id: 'adobe-creative-cloud',
        name: 'Adobe Creative Cloud',
        category: 'Design',
        logo: '🎨',
        defaultAmount: 1899,
        currency: 'THB',
        defaultFrequency: 'monthly',
        color: '#FF0000',
        description: 'Creative apps'
    },
    {
        id: 'canva-pro',
        name: 'Canva Pro',
        category: 'Design',
        logo: '🎨',
        defaultAmount: 12.99,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#00C4CC',
        description: 'Design platform'
    },
    {
        id: 'figma',
        name: 'Figma',
        category: 'Design',
        logo: '🎨',
        defaultAmount: 12,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#F24E1E',
        description: 'Design & prototyping'
    },

    // VPN & Security
    {
        id: 'nordvpn',
        name: 'NordVPN',
        category: 'Security',
        logo: '🔒',
        defaultAmount: 3.99,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#4687FF',
        description: 'VPN service'
    },
    {
        id: '1password',
        name: '1Password',
        category: 'Security',
        logo: '🔐',
        defaultAmount: 2.99,
        currency: 'USD',
        defaultFrequency: 'monthly',
        color: '#0094F5',
        description: 'Password manager'
    },
];
