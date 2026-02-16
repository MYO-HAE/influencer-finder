// functions/api/influencers.js
// Cloudflare Pages Function to get all influencers

export async function onRequestGet() {
    const influencers = [
        {
            id: '1', name: '흔한남매 (Common Siblings)', handle: '@common_siblings',
            platform: 'youtube', platformUrl: 'https://youtube.com/@common_siblings',
            category: 'kids-content', followers: 2850000, avgLikes: 45000, avgComments: 1200,
            engagementRate: 3.2, description: 'Popular kids content channel with educational elements',
            tags: ['kids', 'education', 'entertainment', 'korean'], recentVideos: 24,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '2', name: 'EBS 김소영의 눈높이 parenting', handle: '@ebs_parenting',
            platform: 'youtube', platformUrl: 'https://youtube.com/@ebs_parenting',
            category: 'parenting', followers: 890000, avgLikes: 12000, avgComments: 580,
            engagementRate: 2.8, description: 'EBS parenting expert with science-based child development advice',
            tags: ['parenting', 'child-development', 'expert', 'korean'], recentVideos: 156,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '3', name: '책읽어주는여자 (Book Reading Lady)', handle: '@bookreadinglady',
            platform: 'youtube', platformUrl: 'https://youtube.com/@bookreadinglady',
            category: 'edtech', followers: 1250000, avgLikes: 28000, avgComments: 890,
            engagementRate: 4.1, description: 'Children\'s book readings and literacy education',
            tags: ['books', 'literacy', 'reading', 'education', 'korean'], recentVideos: 312,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '4', name: '육아휴직맘 (Parenting Leave Mom)', handle: '@parentingleavemom',
            platform: 'youtube', platformUrl: 'https://youtube.com/@parentingleavemom',
            category: 'parenting', followers: 650000, avgLikes: 8500, avgComments: 420,
            engagementRate: 2.3, description: 'Real-life parenting tips and product reviews',
            tags: ['parenting', 'reviews', 'lifestyle', 'korean'], recentVideos: 89,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '5', name: 'English Egg', handle: '@englishegg',
            platform: 'youtube', platformUrl: 'https://youtube.com/@englishegg',
            category: 'edtech', followers: 2100000, avgLikes: 32000, avgComments: 1500,
            engagementRate: 3.8, description: 'English education for Korean children through songs and stories',
            tags: ['english', 'language-learning', 'kids', 'education', 'korean'], recentVideos: 445,
            location: 'South Korea', language: 'Korean/English'
        },
        {
            id: '6', name: '육아소통맘', handle: '@yugasotong',
            platform: 'instagram', platformUrl: 'https://instagram.com/yugasotong',
            category: 'parenting', followers: 245000, avgLikes: 8900, avgComments: 230,
            engagementRate: 5.2, description: 'Daily parenting life and product recommendations',
            tags: ['parenting', 'lifestyle', 'products', 'korean'], recentPosts: 890,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '7', name: 'Early Learning Mom', handle: '@earlylearningmom',
            platform: 'instagram', platformUrl: 'https://instagram.com/earlylearningmom',
            category: 'early-education', followers: 178000, avgLikes: 5600, avgComments: 180,
            engagementRate: 4.8, description: 'Montessori and early childhood education content',
            tags: ['montessori', 'early-education', 'activities', 'korean'], recentPosts: 567,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '8', name: 'EdTech Teacher Kim', handle: '@edtechteacherkim',
            platform: 'instagram', platformUrl: 'https://instagram.com/edtechteacherkim',
            category: 'edtech', followers: 89000, avgLikes: 3400, avgComments: 120,
            engagementRate: 5.8, description: 'Teacher sharing EdTech tools and learning apps',
            tags: ['teacher', 'edtech', 'apps', 'education', 'korean'], recentPosts: 445,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '9', name: '영어유치원맘', handle: '@englishkindymom',
            platform: 'instagram', platformUrl: 'https://instagram.com/englishkindymom',
            category: 'early-education', followers: 312000, avgLikes: 11200, avgComments: 450,
            engagementRate: 5.5, description: 'English education journey and bilingual parenting',
            tags: ['english', 'bilingual', 'education', 'parenting', 'korean'], recentPosts: 723,
            location: 'South Korea', language: 'Korean/English'
        },
        {
            id: '10', name: 'STEM Kids Lab', handle: '@stemkidslab',
            platform: 'instagram', platformUrl: 'https://instagram.com/stemkidslab',
            category: 'edtech', followers: 145000, avgLikes: 4800, avgComments: 160,
            engagementRate: 4.2, description: 'STEM activities and science experiments at home',
            tags: ['stem', 'science', 'activities', 'kids', 'korean'], recentPosts: 334,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '11', name: '과학상자 (Science Box)', handle: '@scienceboxkr',
            platform: 'youtube', platformUrl: 'https://youtube.com/@scienceboxkr',
            category: 'edtech', followers: 950000, avgLikes: 18000, avgComments: 720,
            engagementRate: 3.9, description: 'Science experiments and STEM education for kids',
            tags: ['science', 'stem', 'experiments', 'education', 'korean'], recentVideos: 234,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '12', name: 'Coding Kids Korea', handle: '@codingkidskorea',
            platform: 'youtube', platformUrl: 'https://youtube.com/@codingkidskorea',
            category: 'edtech', followers: 380000, avgLikes: 7800, avgComments: 290,
            engagementRate: 3.5, description: 'Programming education for children',
            tags: ['coding', 'programming', 'stem', 'education', 'korean'], recentVideos: 123,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '13', name: '독서육아맘 (Book Parenting Mom)', handle: '@bookparenting',
            platform: 'instagram', platformUrl: 'https://instagram.com/bookparenting',
            category: 'parenting', followers: 198000, avgLikes: 7200, avgComments: 290,
            engagementRate: 5.0, description: 'Raising readers and book recommendations for kids',
            tags: ['books', 'reading', 'parenting', 'education', 'korean'], recentPosts: 556,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '14', name: 'Healthy Kids Kitchen', handle: '@healthykidskitchen',
            platform: 'instagram', platformUrl: 'https://instagram.com/healthykidskitchen',
            category: 'parenting', followers: 423000, avgLikes: 15600, avgComments: 520,
            engagementRate: 5.8, description: 'Healthy recipes and nutrition for children',
            tags: ['food', 'nutrition', 'healthy', 'parenting', 'korean'], recentPosts: 678,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '15', name: '슬기로운육아 (Wise Parenting)', handle: '@wiseparenting',
            platform: 'instagram', platformUrl: 'https://instagram.com/wiseparenting',
            category: 'parenting', followers: 567000, avgLikes: 18900, avgComments: 780,
            engagementRate: 4.5, description: 'Expert parenting advice and child psychology tips',
            tags: ['parenting', 'psychology', 'expert', 'advice', 'korean'], recentPosts: 445,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '16', name: 'Math Play Ground', handle: '@mathplaygroundkr',
            platform: 'instagram', platformUrl: 'https://instagram.com/mathplaygroundkr',
            category: 'edtech', followers: 112000, avgLikes: 4200, avgComments: 140,
            engagementRate: 5.1, description: 'Making math fun for kids through play',
            tags: ['math', 'education', 'games', 'learning', 'korean'], recentPosts: 412,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '17', name: 'Art & Craft Mom', handle: '@artcraftmom',
            platform: 'instagram', platformUrl: 'https://instagram.com/artcraftmom',
            category: 'early-education', followers: 234000, avgLikes: 8900, avgComments: 310,
            engagementRate: 5.3, description: 'Creative activities and art projects for kids',
            tags: ['art', 'craft', 'creativity', 'activities', 'korean'], recentPosts: 589,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '18', name: 'Science Mom Korea', handle: '@sciencemomkr',
            platform: 'instagram', platformUrl: 'https://instagram.com/sciencemomkr',
            category: 'edtech', followers: 156000, avgLikes: 6200, avgComments: 210,
            engagementRate: 5.4, description: 'Science educator and STEM advocate for kids',
            tags: ['science', 'stem', 'education', 'teacher', 'korean'], recentPosts: 367,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '19', name: '예비맘&초병아리', handle: '@yebimom',
            platform: 'youtube', platformUrl: 'https://youtube.com/@yebimom',
            category: 'parenting', followers: 520000, avgLikes: 6200, avgComments: 340,
            engagementRate: 2.1, description: 'Pregnancy and early parenting guidance',
            tags: ['pregnancy', 'newborn', 'parenting', 'korean'], recentVideos: 67,
            location: 'South Korea', language: 'Korean'
        },
        {
            id: '20', name: 'Coding Mom & Kids', handle: '@codingmomkids',
            platform: 'instagram', platformUrl: 'https://instagram.com/codingmomkids',
            category: 'edtech', followers: 67000, avgLikes: 2800, avgComments: 95,
            engagementRate: 6.1, description: 'Learning coding together with kids',
            tags: ['coding', 'programming', 'parenting', 'education', 'korean'], recentPosts: 289,
            location: 'South Korea', language: 'Korean'
        }
    ];

    return new Response(JSON.stringify({
        success: true,
        count: influencers.length,
        results: influencers
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
