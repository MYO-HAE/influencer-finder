// Influencer Finder App
// Handles search, filtering, and display of influencer data

class InfluencerFinder {
    constructor() {
        this.influencers = [];
        this.filteredInfluencers = [];
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadInitialData();
    }

    bindElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.platformFilter = document.getElementById('platformFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortBy = document.getElementById('sortBy');
        this.influencersGrid = document.getElementById('influencersGrid');
        this.loadingState = document.getElementById('loadingState');
        this.resultsSection = document.getElementById('resultsSection');
        this.emptyState = document.getElementById('emptyState');
        this.resultsCount = document.getElementById('resultsCount');
        this.totalInfluencers = document.getElementById('totalInfluencers');
        this.avgEngagement = document.getElementById('avgEngagement');
        this.totalReach = document.getElementById('totalReach');
        this.exportBtn = document.getElementById('exportBtn');
        this.detailModal = document.getElementById('detailModal');
        this.modalClose = document.getElementById('modalClose');
        this.modalBody = document.getElementById('modalBody');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        this.platformFilter.addEventListener('change', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.sortBy.addEventListener('change', () => this.applyFilters());
        
        this.exportBtn.addEventListener('click', () => this.exportCSV());
        
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.detailModal.addEventListener('click', (e) => {
            if (e.target === this.detailModal) this.closeModal();
        });
    }

    async loadInitialData() {
        this.showLoading();
        
        try {
            // In production, this would fetch from the API
            // For now, we'll simulate the API response with mock data
            const response = await this.fetchInfluencers();
            this.influencers = response.results || [];
            this.filteredInfluencers = [...this.influencers];
            this.updateStats();
            this.renderResults();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load influencer data');
        } finally {
            this.hideLoading();
        }
    }

    async fetchInfluencers() {
        try {
            // Try to fetch from API first (when deployed)
            const response = await fetch('/api/influencers');
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.log('API not available, using local data');
        }
        
        // Fallback to local mock data
        return {
            success: true,
            count: 20,
            results: this.getMockData()
        };
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        const platform = this.platformFilter.value;
        const category = this.categoryFilter.value;
        
        this.showLoading();
        
        try {
            // Try API first
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, platform, category })
                });
                if (response.ok) {
                    const data = await response.json();
                    this.filteredInfluencers = data.results || [];
                    this.sortResults();
                    this.updateStats();
                    this.renderResults();
                    return;
                }
            } catch (e) {
                console.log('API not available, filtering locally');
            }
            
            // Fallback: filter locally
            this.filteredInfluencers = this.influencers.filter(inf => {
                const matchesQuery = !query || 
                    inf.name.toLowerCase().includes(query.toLowerCase()) ||
                    inf.handle.toLowerCase().includes(query.toLowerCase()) ||
                    inf.description.toLowerCase().includes(query.toLowerCase()) ||
                    inf.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
                
                const matchesPlatform = platform === 'all' || inf.platform === platform;
                const matchesCategory = category === 'all' || inf.category === category;
                
                return matchesQuery && matchesPlatform && matchesCategory;
            });
            
            this.sortResults();
            this.updateStats();
            this.renderResults();
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed');
        } finally {
            this.hideLoading();
        }
    }

    applyFilters() {
        this.handleSearch();
    }

    sortResults() {
        const sortBy = this.sortBy.value;
        
        this.filteredInfluencers.sort((a, b) => {
            switch(sortBy) {
                case 'engagement':
                    return b.engagementRate - a.engagementRate;
                case 'followers':
                    return b.followers - a.followers;
                case 'likes':
                    return b.avgLikes - a.avgLikes;
                default:
                    return 0;
            }
        });
    }

    updateStats() {
        const count = this.filteredInfluencers.length;
        const totalFollowers = this.filteredInfluencers.reduce((sum, inf) => sum + inf.followers, 0);
        const avgEng = count > 0 
            ? (this.filteredInfluencers.reduce((sum, inf) => sum + inf.engagementRate, 0) / count).toFixed(1)
            : 0;
        
        this.totalInfluencers.textContent = count;
        this.avgEngagement.textContent = avgEng + '%';
        this.totalReach.textContent = (totalFollowers / 1000000).toFixed(1) + 'M';
    }

    renderResults() {
        this.resultsCount.textContent = `(${this.filteredInfluencers.length})`;
        
        if (this.filteredInfluencers.length === 0) {
            this.resultsSection.classList.add('hidden');
            this.emptyState.classList.remove('hidden');
            return;
        }
        
        this.emptyState.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        this.influencersGrid.innerHTML = this.filteredInfluencers.map(inf => this.createCardHTML(inf)).join('');
        
        // Add click handlers to cards
        document.querySelectorAll('.influencer-card').forEach((card, index) => {
            card.addEventListener('click', () => this.showDetail(this.filteredInfluencers[index]));
        });
    }

    createCardHTML(inf) {
        const platformIcon = inf.platform === 'youtube' ? '📺' : '📷';
        const followersFormatted = this.formatNumber(inf.followers);
        const likesFormatted = this.formatNumber(inf.avgLikes);
        
        return `
            <div class="influencer-card" data-id="${inf.id}">
                <div class="card-header">
                    <div class="platform-icon ${inf.platform}">${platformIcon}</div>
                    <div class="card-info">
                        <h3>${inf.name}</h3>
                        <div class="handle">${inf.handle}</div>
                        <span class="category-tag">${this.formatCategory(inf.category)}</span>
                    </div>
                </div>
                <p class="card-description">${inf.description}</p>
                <div class="card-metrics">
                    <div class="metric">
                        <span class="metric-value">${followersFormatted}</span>
                        <span class="metric-label">Followers</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${likesFormatted}</span>
                        <span class="metric-label">Avg Likes</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value engagement-rate">${inf.engagementRate}%</span>
                        <span class="metric-label">Engagement</span>
                    </div>
                </div>
                <div class="tags">
                    ${inf.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    showDetail(inf) {
        const platformIcon = inf.platform === 'youtube' ? '📺' : '📷';
        const contentType = inf.platform === 'youtube' ? 'Videos' : 'Posts';
        const contentCount = inf.recentVideos || inf.recentPosts || 0;
        
        this.modalBody.innerHTML = `
            <div class="modal-body">
                <div class="modal-header">
                    <div class="platform-icon ${inf.platform}">${platformIcon}</div>
                    <div class="modal-title">
                        <h2>${inf.name}</h2>
                        <a href="${inf.platformUrl}" target="_blank" rel="noopener">${inf.handle} ↗</a>
                    </div>
                </div>
                
                <div class="modal-stats">
                    <div class="modal-stat">
                        <div class="label">Followers</div>
                        <div class="value">${this.formatNumber(inf.followers)}</div>
                    </div>
                    <div class="modal-stat">
                        <div class="label">Avg Likes</div>
                        <div class="value">${this.formatNumber(inf.avgLikes)}</div>
                    </div>
                    <div class="modal-stat">
                        <div class="label">Engagement Rate</div>
                        <div class="value" style="color: var(--success)">${inf.engagementRate}%</div>
                    </div>
                    <div class="modal-stat">
                        <div class="label">Avg Comments</div>
                        <div class="value">${this.formatNumber(inf.avgComments)}</div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4>Description</h4>
                    <p>${inf.description}</p>
                </div>
                
                <div class="modal-section">
                    <h4>Details</h4>
                    <p><strong>Platform:</strong> ${inf.platform}</p>
                    <p><strong>Category:</strong> ${this.formatCategory(inf.category)}</p>
                    <p><strong>Location:</strong> ${inf.location}</p>
                    <p><strong>Language:</strong> ${inf.language}</p>
                    <p><strong>Recent ${contentType}:</strong> ${contentCount}</p>
                </div>
                
                <div class="modal-section">
                    <h4>Tags</h4>
                    <div class="tags">
                        ${inf.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.detailModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.detailModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    exportCSV() {
        if (this.filteredInfluencers.length === 0) return;
        
        const headers = ['Name', 'Handle', 'Platform', 'Category', 'Followers', 'Avg Likes', 'Engagement Rate', 'Description', 'URL'];
        const rows = this.filteredInfluencers.map(inf => [
            inf.name,
            inf.handle,
            inf.platform,
            inf.category,
            inf.followers,
            inf.avgLikes,
            inf.engagementRate + '%',
            inf.description,
            inf.platformUrl
        ]);
        
        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `influencers_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatCategory(category) {
        const categories = {
            'edtech': 'EdTech',
            'parenting': 'Parenting',
            'early-education': 'Early Education',
            'kids-content': 'Kids Content'
        };
        return categories[category] || category;
    }

    showLoading() {
        this.loadingState.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');
        this.emptyState.classList.add('hidden');
    }

    hideLoading() {
        this.loadingState.classList.add('hidden');
    }

    showError(message) {
        alert(message);
    }

    // Mock data for demonstration
    getMockData() {
        return [
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
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new InfluencerFinder();
});
