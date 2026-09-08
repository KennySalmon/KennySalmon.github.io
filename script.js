/* ====================================
   Kenneth Salmon Portfolio - Scripts
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
    // ====================================
    // Loading Screen with Animated Percentage
    // ====================================
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderProgress = document.getElementById('loaderProgress');

    // Randomly decide number of milestones (1, 2, or 3)
    const numMilestones = Math.floor(Math.random() * 3) + 1;

    // Generate random milestone positions based on count
    function generateMilestones(count) {
        const milestones = [];
        if (count === 1) {
            milestones.push(Math.floor(Math.random() * 30) + 60); // 60-89%
        } else if (count === 2) {
            milestones.push(Math.floor(Math.random() * 20) + 50); // 50-69%
            milestones.push(Math.floor(Math.random() * 10) + 85); // 85-94%
        } else {
            milestones.push(Math.floor(Math.random() * 25) + 55); // 55-79%
            milestones.push(Math.floor(Math.random() * 12) + 80); // 80-91%
            milestones.push(Math.floor(Math.random() * 5) + 94);  // 94-98%
        }
        return milestones;
    }

    const milestones = generateMilestones(numMilestones);

    // Build loading steps dynamically
    const loadingSteps = [];
    let lastTarget = 0;

    milestones.forEach((milestone, i) => {
        const duration = 1400 - (i * 400); // Faster for later milestones
        loadingSteps.push({ target: milestone, duration: Math.max(duration, 400), easing: 'ease-out' });
        loadingSteps.push({ target: milestone, duration: 700, easing: 'linear' }); // Pause
    });

    loadingSteps.push({ target: 100, duration: 300, easing: 'ease-in' });

    // Easing functions
    const easings = {
        'linear': t => t,
        'ease-in': t => t * t * t,
        'ease-out': t => 1 - Math.pow(1 - t, 3),
        'ease-in-out': t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    };

    let currentPercent = 0;

    async function animateLoading() {
        for (const step of loadingSteps) {
            await animateToPercent(step.target, step.duration, step.easing);
        }

        // Transition to nav position
        loader.classList.add('transitioning');

        // Hide loader as transition finishes
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 400);
    }

    function animateToPercent(target, duration, easingType = 'ease-out') {
        return new Promise(resolve => {
            const start = currentPercent;
            const diff = target - start;
            const startTime = performance.now();
            const easing = easings[easingType] || easings['ease-out'];

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Apply easing
                const eased = easing(progress);

                currentPercent = Math.round(start + (diff * eased));
                loaderPercent.textContent = currentPercent + '%';
                loaderProgress.style.width = currentPercent + '%';

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    currentPercent = target;
                    loaderPercent.textContent = target + '%';
                    loaderProgress.style.width = target + '%';
                    resolve();
                }
            }

            requestAnimationFrame(update);
        });
    }

    // Start loading animation
    animateLoading();



    // ====================================
    // Section Animations
    // ====================================
    const sections = document.querySelectorAll('.about, .experience, .skills, .contact');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-animate', 'visible');

                // Animate children with stagger
                const children = entry.target.querySelectorAll('.experience-item, .skill-card, .about-stat, .masonry-item');
                children.forEach((child, index) => {
                    child.classList.add('stagger-item');
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });

    // ====================================
    // Modal Data with Case Studies
    // ====================================
    const modalData = {
        // About Me Highlights
        'production-specialist': {
            title: 'Production Specialist',
            subtitle: 'What Does This Mean?',
            body: `
                <p>A Production Specialist is a versatile media professional who oversees the entire content creation process from concept to delivery.</p>
                <ul>
                    <li><strong>Pre-Production:</strong> Planning shoots, creating storyboards, coordinating equipment</li>
                    <li><strong>Production:</strong> Operating cameras, managing lighting, directing on-set activities</li>
                    <li><strong>Post-Production:</strong> Video editing, color grading, audio mixing, motion graphics</li>
                    <li><strong>Live Production:</strong> Real-time switching, broadcast management, live streaming</li>
                </ul>
            `
        },
        'subscribers': {
            title: '3.4 Million Subscribers',
            subtitle: 'Doctorly YouTube Channel',
            body: `
                <p>I serve as the Video Editor for <strong>Doctorly</strong>, one of the largest dermatology-focused YouTube channels in the world.</p>
                <div class="case-study-section">
                    <h4>Results</h4>
                    <div class="case-study-grid">
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">3.4M+</div>
                            <div class="case-study-stat-label">Subscribers</div>
                        </div>
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">3-5M</div>
                            <div class="case-study-stat-label">Views per Video</div>
                        </div>
                    </div>
                </div>
                <ul>
                    <li>Weekly 15-30 minute video editing</li>
                    <li>Motion graphics and visual storytelling</li>
                    <li>SEO-optimized thumbnails and titles</li>
                </ul>
            `
        },
        'viewers': {
            title: '2.8 Million Total Views',
            subtitle: 'Cumulative Viewership Impact',
            body: `
                <p>Across all channels and platforms I've contributed to, my work has reached a combined viewership of over <strong>2.8 million views</strong>.</p>
                <div class="case-study-section">
                    <h4>Breakdown</h4>
                    <div class="case-study-grid">
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">2M+</div>
                            <div class="case-study-stat-label">Doctorly</div>
                        </div>
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">800K+</div>
                            <div class="case-study-stat-label">Other Projects</div>
                        </div>
                    </div>
                </div>
            `
        },

        // Experience with Case Studies
        'exp-doctorly': {
            title: 'Video Editor',
            subtitle: 'Doctorly YouTube Channel • 2024 - 2025',
            body: `
                <p>Primary video editor for one of YouTube's largest medical education channels.</p>
                <div class="case-study-section">
                    <h4>Key Achievements</h4>
                    <div class="case-study-grid">
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">3.4M</div>
                            <div class="case-study-stat-label">Subscribers</div>
                        </div>
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">1.3B</div>
                            <div class="case-study-stat-label">Total Views</div>
                        </div>
                    </div>
                </div>
                <ul>
                    <li>Edit <strong>15-30 minute videos</strong> weekly</li>
                    <li>Videos consistently achieve <strong>3+ million views</strong></li>
                    <li>Create motion graphics and visual elements</li>
                    <li>Implement SEO-optimized thumbnails</li>
                    <li>Handle audio correction and color grading</li>
                </ul>
            `
        },
        'exp-kulaqua': {
            title: 'A/V & Video Production Lead',
            subtitle: 'Camp Kulaqua • 2019 - 2025',
            body: `
                <p>Led all audio-visual and video production operations for this major retreat facility.</p>
                <ul>
                    <li>Captured and edited <strong>weekly video content</strong></li>
                    <li>Managed complex AV setups for 500+ attendees</li>
                    <li>Operated LED walls and projection systems</li>
                    <li>Live audio mixing for concerts and conferences</li>
                    <li>Trained junior staff on equipment operation</li>
                </ul>
            `
        },
        'exp-hope': {
            title: 'Technical Director',
            subtitle: 'The Hope Channel • 2022 - 2024',
            body: `
                <p>Directed live video broadcasts for an international faith-based television network.</p>
                <div class="case-study-section">
                    <h4>Impact</h4>
                    <div class="case-study-grid">
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">70K+</div>
                            <div class="case-study-stat-label">Weekly Viewers</div>
                        </div>
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">2</div>
                            <div class="case-study-stat-label">Locations</div>
                        </div>
                    </div>
                </div>
                <ul>
                    <li>Operated Sony and Blackmagic cinema cameras</li>
                    <li>Managed live switching during broadcasts</li>
                    <li>Coordinated with Esperanza TV for Spanish content</li>
                </ul>
            `
        },
        'exp-itiw': {
            title: 'Production Assistant',
            subtitle: 'It Is Written • 2023',
            body: `
                <p>Contributed to one of the longest-running religious broadcast programs.</p>
                <div class="case-study-section">
                    <h4>Reach</h4>
                    <div class="case-study-grid">
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">1.5M+</div>
                            <div class="case-study-stat-label">Weekly Viewers</div>
                        </div>
                        <div class="case-study-stat">
                            <div class="case-study-stat-value">70K+</div>
                            <div class="case-study-stat-label">YouTube Views</div>
                        </div>
                    </div>
                </div>
            `
        },

        // Skills with definitions
        'skill-video-editing': {
            title: 'Video Editing',
            subtitle: 'Core Skill',
            body: `
                <p><strong>Definition:</strong> The process of manipulating video footage to create a polished final product.</p>
                <ul>
                    <li>Adobe Premiere Pro & DaVinci Resolve</li>
                    <li>Pacing, storytelling, audience retention</li>
                    <li>Color grading and correction</li>
                    <li>Multi-camera editing</li>
                </ul>
            `
        },
        'skill-adobe': {
            title: 'Adobe Creative Suite',
            subtitle: 'Software Proficiency',
            body: `
                <p><strong>Definition:</strong> Professional software applications for video, design, and audio.</p>
                <ul>
                    <li><strong>Premiere Pro:</strong> Video editing</li>
                    <li><strong>After Effects:</strong> Motion graphics</li>
                    <li><strong>Audition:</strong> Audio editing</li>
                    <li><strong>Photoshop:</strong> Image editing</li>
                </ul>
            `
        },
        'skill-live': {
            title: 'Live Production',
            subtitle: 'Broadcast Skills',
            body: `
                <p><strong>Definition:</strong> Real-time video production and broadcast management.</p>
                <ul>
                    <li>ATEM, TriCaster, vMix switching</li>
                    <li>Multi-camera direction</li>
                    <li>Live streaming to YouTube/Facebook</li>
                    <li>Real-time troubleshooting</li>
                </ul>
            `
        },
        'skill-technical': {
            title: 'Camera Operation',
            subtitle: 'Hardware Expertise',
            body: `
                <p><strong>Definition:</strong> Operation of professional video and cinema equipment.</p>
                <ul>
                    <li>Canon Cinema (C300, C70)</li>
                    <li>Sony & Blackmagic cameras</li>
                    <li>Lighting setups and gels</li>
                    <li>Gimbals, tripods, sliders</li>
                </ul>
            `
        },
        'skill-communication': {
            title: 'Strategic Communication',
            subtitle: 'Content Strategy',
            body: `
                <p><strong>Definition:</strong> Purposeful messaging to achieve specific goals.</p>
                <ul>
                    <li>Content strategy development</li>
                    <li>Brand voice consistency</li>
                    <li>Audience engagement</li>
                    <li>Cross-platform messaging</li>
                </ul>
            `
        },
        'skill-market': {
            title: 'SEO & Analytics',
            subtitle: 'Data-Driven Content',
            body: `
                <p><strong>Definition:</strong> Using data to optimize content performance.</p>
                <ul>
                    <li>YouTube Analytics</li>
                    <li>Keyword research</li>
                    <li>Thumbnail A/B testing</li>
                    <li>Trend identification</li>
                </ul>
            `
        },
        'more-skills': {
            title: 'Additional Skills',
            subtitle: 'Complete Expertise',
            body: `
                <h4 style="color: var(--accent); margin-bottom: 12px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Technical Production</h4>
                <ul>
                    <li><strong>Camera Operation:</strong> ISO, aperture, shutter speed, frame rates, white balance</li>
                    <li><strong>Lighting Techniques:</strong> 3-point lighting, color temperature, modifiers</li>
                    <li><strong>Audio Hardware:</strong> Physical mixing consoles, lavalier mics, boom mics</li>
                    <li><strong>Video Switcher Operation:</strong> Live source switching with hardware switchers</li>
                    <li><strong>Signal Flow & Routing:</strong> Audio/video signal path management</li>
                    <li><strong>Systems Integration:</strong> Connecting cameras, servers, graphics systems</li>
                    <li><strong>Network Infrastructure:</strong> High-speed networks (10GbE) for media transfer</li>
                    <li><strong>Storage Solutions:</strong> NAS and SAN system management</li>
                    <li><strong>Workstation Support:</strong> PC/Mac hardware troubleshooting</li>
                    <li><strong>Multiview Configuration:</strong> Monitor wall setups for live viewing</li>
                    <li><strong>Technical Troubleshooting:</strong> Diagnosing hardware/signal failures</li>
                </ul>

                <h4 style="color: var(--accent); margin: 24px 0 12px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Post-Production & Software</h4>
                <ul>
                    <li><strong>Post-Production Editing:</strong> Premiere Pro, Final Cut, DaVinci Resolve</li>
                    <li><strong>DAW Proficiency:</strong> Pro Tools, Logic, Audition</li>
                    <li><strong>Color Grading:</strong> Visual aesthetics in post-production</li>
                    <li><strong>EQ & Compression:</strong> Audio frequency and dynamics balancing</li>
                    <li><strong>Motion Graphics:</strong> Titles, lower thirds, transitions</li>
                    <li><strong>Asset Management:</strong> MAM software for large media libraries</li>
                    <li><strong>Drone Operation:</strong> Aerial videography</li>
                </ul>

                <h4 style="color: var(--accent); margin: 24px 0 12px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Business & Strategy</h4>
                <ul>
                    <li><strong>SEO & SEM:</strong> Search engine optimization and marketing</li>
                    <li><strong>Data Analysis:</strong> Analytics tools for performance measurement</li>
                    <li><strong>CRM Management:</strong> Salesforce, HubSpot</li>
                    <li><strong>Project Management:</strong> Budgeting, scheduling, resource allocation</li>
                    <li><strong>Content Strategy:</strong> Long-term content calendar planning</li>
                    <li><strong>Legal & Rights:</strong> Copyright, clearances, contracts</li>
                    <li><strong>Cybersecurity:</strong> Protecting intellectual property and digital assets</li>
                </ul>

                <h4 style="color: var(--accent); margin: 24px 0 12px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Communication & Media</h4>
                <ul>
                    <li><strong>Scriptwriting & Storyboarding:</strong> Narrative structure and visualization</li>
                    <li><strong>Copywriting:</strong> Persuasive text for ads and social media</li>
                    <li><strong>Press Release Writing:</strong> Formal media announcements</li>
                    <li><strong>Media Relations:</strong> Pitching stories, journalist contacts</li>
                    <li><strong>Crisis Management:</strong> Negative publicity response protocols</li>
                    <li><strong>Social Listening:</strong> Online brand sentiment monitoring</li>
                    <li><strong>Public Speaking:</strong> Spokesperson capabilities</li>
                </ul>

                <h4 style="color: var(--accent); margin: 24px 0 12px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Personal Qualities</h4>
                <ul>
                    <li><strong>Leadership:</strong> Task delegation, team motivation</li>
                    <li><strong>Communication:</strong> Translating technical concepts for any audience</li>
                    <li><strong>Grace Under Pressure:</strong> Split-second decision making</li>
                    <li><strong>Problem-Solving:</strong> Quick logistical/technical fixes</li>
                    <li><strong>Time Management:</strong> Strict production schedules</li>
                    <li><strong>Attention to Detail:</strong> Catching continuity errors</li>
                    <li><strong>Critical Listening:</strong> Detecting subtle audio artifacts</li>
                    <li><strong>Creativity:</strong> Abstract concepts to reality</li>
                    <li><strong>Adaptability:</strong> Keeping pace with changing technology</li>
                    <li><strong>Empathy:</strong> Understanding audience needs</li>
                    <li><strong>Persuasion:</strong> Stakeholder buy-in</li>
                    <li><strong>Discretion:</strong> Handling confidential information</li>
                </ul>
            `
        }
    };

    // ====================================
    // Modal Functionality
    // ====================================
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');

    function openModal(modalId) {
        const data = modalData[modalId];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalBody.innerHTML = data.body;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    document.querySelectorAll('[data-modal]').forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openModal(this.getAttribute('data-modal'));
        });
    });

    // ====================================
    // Navigation
    // ====================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ====================================
    // Scroll Spy Navigation - Active Tab Highlighting
    // ====================================
    const navSections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    // Create Intersection Observer for scroll spy
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is ~20% from top
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');

                // Remove active class from all nav links
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    navSections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // ====================================
    // Video Embed Helper
    // ====================================
    window.playVideo = function (videoId, container) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;

        const wrapper = document.createElement('div');
        wrapper.className = 'video-container';
        wrapper.appendChild(iframe);

        container.replaceWith(wrapper);
    };

    // Video thumbnail click handlers
    document.querySelectorAll('.video-thumbnail[data-video]').forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video');
            if (videoId) {
                playVideo(videoId, this);
            }
        });
    });

    // ====================================
    // Skills Panel (Scrollable)
    // ====================================
    const skillsPanelOverlay = document.getElementById('skillsPanelOverlay');
    const skillsPanelScroll = document.getElementById('skillsPanelScroll');
    const skillsPanelClose = document.querySelector('.skills-panel-close');

    // Skills data for the panel
    const skillsPanelData = [
        {
            id: 'video-editing',
            title: 'Video Editing',
            subtitle: 'Core Skill',
            body: `<p><strong>Definition:</strong> The process of manipulating video footage to create a polished final product.</p>
                <ul>
                    <li>Adobe Premiere Pro & DaVinci Resolve</li>
                    <li>Pacing, storytelling, audience retention</li>
                    <li>Color grading and correction</li>
                    <li>Multi-camera editing</li>
                </ul>`
        },
        {
            id: 'adobe',
            title: 'Adobe Creative Suite',
            subtitle: 'Software Proficiency',
            body: `<p><strong>Definition:</strong> Professional software applications for video, design, and audio.</p>
                <ul>
                    <li><strong>Premiere Pro:</strong> Video editing</li>
                    <li><strong>After Effects:</strong> Motion graphics</li>
                    <li><strong>Audition:</strong> Audio editing</li>
                    <li><strong>Photoshop:</strong> Image editing</li>
                </ul>`
        },
        {
            id: 'live',
            title: 'Live Production',
            subtitle: 'Broadcast Skills',
            body: `<p><strong>Definition:</strong> Real-time video production and broadcast management.</p>
                <ul>
                    <li>ATEM, TriCaster, vMix switching</li>
                    <li>Multi-camera direction</li>
                    <li>Live streaming to YouTube/Facebook</li>
                    <li>Real-time troubleshooting</li>
                </ul>`
        },
        {
            id: 'technical',
            title: 'Camera Operation',
            subtitle: 'Hardware Expertise',
            body: `<p><strong>Definition:</strong> Operation of professional video and cinema equipment.</p>
                <ul>
                    <li>Canon Cinema (C300, C70)</li>
                    <li>Sony & Blackmagic cameras</li>
                    <li>Lighting setups and gels</li>
                    <li>Gimbals, tripods, sliders</li>
                </ul>`
        },
        {
            id: 'communication',
            title: 'Strategic Communication',
            subtitle: 'Content Strategy',
            body: `<p><strong>Definition:</strong> Purposeful messaging to achieve specific goals.</p>
                <ul>
                    <li>Content strategy development</li>
                    <li>Brand voice consistency</li>
                    <li>Audience engagement</li>
                    <li>Cross-platform messaging</li>
                </ul>`
        },
        {
            id: 'market',
            title: 'SEO & Analytics',
            subtitle: 'Data-Driven Content',
            body: `<p><strong>Definition:</strong> Using data to optimize content performance.</p>
                <ul>
                    <li>YouTube Analytics</li>
                    <li>Keyword research</li>
                    <li>Thumbnail A/B testing</li>
                    <li>Trend identification</li>
                </ul>`
        },
        {
            id: 'more-skills',
            title: 'Additional Skills',
            subtitle: 'Complete Expertise',
            body: `
                <h4>Technical Production</h4>
                <ul>
                    <li><strong>Camera Operation:</strong> ISO, aperture, shutter speed, frame rates</li>
                    <li><strong>Lighting Techniques:</strong> 3-point lighting, color temperature</li>
                    <li><strong>Audio Hardware:</strong> Mixing consoles, lavalier mics, boom mics</li>
                    <li><strong>Video Switcher Operation:</strong> Live source switching</li>
                    <li><strong>Signal Flow & Routing:</strong> Audio/video signal management</li>
                    <li><strong>Systems Integration:</strong> Cameras, servers, graphics</li>
                    <li><strong>Network Infrastructure:</strong> 10GbE media transfer</li>
                    <li><strong>Storage Solutions:</strong> NAS and SAN management</li>
                </ul>

                <h4>Post-Production & Software</h4>
                <ul>
                    <li><strong>DAW Proficiency:</strong> Pro Tools, Logic, Audition</li>
                    <li><strong>Color Grading:</strong> Visual aesthetics</li>
                    <li><strong>EQ & Compression:</strong> Audio balancing</li>
                    <li><strong>Motion Graphics:</strong> Titles, transitions</li>
                    <li><strong>Drone Operation:</strong> Aerial videography</li>
                </ul>

                <h4>Business & Strategy</h4>
                <ul>
                    <li><strong>SEO & SEM:</strong> Search optimization</li>
                    <li><strong>Data Analysis:</strong> Performance analytics</li>
                    <li><strong>CRM Management:</strong> Salesforce, HubSpot</li>
                    <li><strong>Project Management:</strong> Budgeting, scheduling</li>
                    <li><strong>Content Strategy:</strong> Calendar planning</li>
                    <li><strong>Legal & Rights:</strong> Copyright, contracts</li>
                </ul>

                <h4>Communication & Media</h4>
                <ul>
                    <li><strong>Scriptwriting & Storyboarding</strong></li>
                    <li><strong>Copywriting:</strong> Ads and social media</li>
                    <li><strong>Press Release Writing</strong></li>
                    <li><strong>Media Relations:</strong> Journalist contacts</li>
                    <li><strong>Crisis Management</strong></li>
                    <li><strong>Public Speaking</strong></li>
                </ul>

                <h4>Personal Qualities</h4>
                <ul>
                    <li><strong>Leadership:</strong> Team motivation</li>
                    <li><strong>Grace Under Pressure:</strong> Quick decisions</li>
                    <li><strong>Problem-Solving:</strong> Fast fixes</li>
                    <li><strong>Attention to Detail:</strong> Catching errors</li>
                    <li><strong>Creativity:</strong> Concept to reality</li>
                    <li><strong>Adaptability:</strong> Tech trends</li>
                    <li><strong>Empathy:</strong> Audience needs</li>
                </ul>`
        }
    ];

    // Build the skills panel content
    function buildSkillsPanel() {
        let html = '';
        skillsPanelData.forEach(skill => {
            html += `
                <div class="skill-section" id="skill-${skill.id}">
                    <h3 class="skill-section-title">${skill.title}</h3>
                    <p class="skill-section-subtitle">${skill.subtitle}</p>
                    <div class="skill-section-body">${skill.body}</div>
                </div>
            `;
        });
        skillsPanelScroll.innerHTML = html;

        // Build navigation dots
        const skillNavDots = document.getElementById('skillNavDots');
        let dotsHtml = '';
        skillsPanelData.forEach((skill, index) => {
            dotsHtml += `<button class="skill-nav-dot${index === 0 ? ' active' : ''}" data-skill-index="${index}" aria-label="${skill.title}"></button>`;
        });
        skillNavDots.innerHTML = dotsHtml;

        // Dot click handlers
        skillNavDots.querySelectorAll('.skill-nav-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-skill-index'));
                const section = skillsPanelScroll.children[index];
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    buildSkillsPanel();

    // Track scroll to update active dot
    skillsPanelScroll.addEventListener('scroll', () => {
        const scrollTop = skillsPanelScroll.scrollTop;
        const sectionHeight = skillsPanelScroll.clientHeight;
        const currentIndex = Math.round(scrollTop / sectionHeight);

        document.querySelectorAll('.skill-nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    });

    function openSkillsPanel(skillId) {
        skillsPanelOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Wait for panel to open, then scroll to selected skill
        setTimeout(() => {
            const skillIndex = skillsPanelData.findIndex(s => s.id === skillId);
            const targetSection = skillsPanelScroll.children[skillIndex];
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            // Update dots
            document.querySelectorAll('.skill-nav-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === skillIndex);
            });
        }, 50);
    }

    function closeSkillsPanel() {
        skillsPanelOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Skills panel click handlers
    document.querySelectorAll('[data-skill-panel]').forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openSkillsPanel(this.getAttribute('data-skill-panel'));
        });
    });

    skillsPanelOverlay.addEventListener('click', (e) => {
        if (e.target === skillsPanelOverlay) closeSkillsPanel();
    });

    skillsPanelClose.addEventListener('click', closeSkillsPanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && skillsPanelOverlay.classList.contains('active')) {
            closeSkillsPanel();
        }
        if (e.key === 'Escape' && experiencePanelOverlay.classList.contains('active')) {
            closeExperiencePanel();
        }
    });

    // ====================================
    // Experience Panel (Scrollable)
    // ====================================
    const experiencePanelOverlay = document.getElementById('experiencePanelOverlay');
    const experiencePanelScroll = document.getElementById('experiencePanelScroll');
    const expPanelClose = document.querySelector('.exp-panel-close');

    const experiencePanelData = [
        {
            id: 'doctorly',
            title: 'Video Editor',
            subtitle: 'Doctorly YouTube Channel • 2024-2025',
            body: `<p><strong>Remote Position</strong></p>
                <p>Edited content for a 3.4M+ subscriber dermatology YouTube channel, optimizing for audience retention and engagement.</p>
                <ul>
                    <li>Edited 50+ videos averaging 200K+ views each</li>
                    <li>Improved watch time through pacing techniques</li>
                    <li>Collaborated with talent on content strategy</li>
                    <li>Optimized thumbnails and titles for CTR</li>
                </ul>
                <div class="case-study-stats">
                    <div class="case-study-stat"><span class="case-study-stat-value">3.4M+</span><span class="case-study-stat-label">Subscribers</span></div>
                    <div class="case-study-stat"><span class="case-study-stat-value">200K+</span><span class="case-study-stat-label">Avg Views</span></div>
                </div>`
        },
        {
            id: 'kulaqua',
            title: 'A/V & Video Production Lead',
            subtitle: 'Camp Kulaqua • 2019-2025',
            body: `<p><strong>Gainesville, FL</strong></p>
                <p>Led all audio/visual operations for a 500+ acre retreat facility, managing equipment and training staff.</p>
                <ul>
                    <li>Managed $100K+ in A/V equipment</li>
                    <li>Produced promotional and event videos</li>
                    <li>Trained 20+ staff on production techniques</li>
                    <li>Live streaming for events and services</li>
                    <li>Equipment maintenance and upgrades</li>
                </ul>`
        },
        {
            id: 'hope',
            title: 'Technical Director',
            subtitle: 'The Hope Channel • 2022-2024',
            body: `<p><strong>Chattanooga, TN</strong></p>
                <p>Directed live broadcasts and managed technical operations for a faith-based television network.</p>
                <ul>
                    <li>Directed 100+ live broadcasts</li>
                    <li>Managed multi-camera studio productions</li>
                    <li>Oversaw broadcast engineering team</li>
                    <li>Implemented new streaming workflows</li>
                </ul>
                <div class="case-study-stats">
                    <div class="case-study-stat"><span class="case-study-stat-value">70K+</span><span class="case-study-stat-label">Weekly Viewers</span></div>
                    <div class="case-study-stat"><span class="case-study-stat-value">100+</span><span class="case-study-stat-label">Live Shows</span></div>
                </div>`
        },
        {
            id: 'itiw',
            title: 'Production Assistant',
            subtitle: 'It Is Written • 2023',
            body: `<p><strong>Collegedale, TN</strong></p>
                <p>Assisted with production operations for an internationally broadcast religious program.</p>
                <ul>
                    <li>Camera operation and setup</li>
                    <li>Lighting and audio assistance</li>
                    <li>Set design and preparation</li>
                    <li>Post-production support</li>
                </ul>`
        }
    ];

    function buildExperiencePanel() {
        let html = '';
        experiencePanelData.forEach(exp => {
            html += `
                <div class="skill-section" id="exp-${exp.id}">
                    <h3 class="skill-section-title">${exp.title}</h3>
                    <p class="skill-section-subtitle">${exp.subtitle}</p>
                    <div class="skill-section-body">${exp.body}</div>
                </div>
            `;
        });
        experiencePanelScroll.innerHTML = html;

        // Build navigation dots
        const expNavDots = document.getElementById('expNavDots');
        let dotsHtml = '';
        experiencePanelData.forEach((exp, index) => {
            dotsHtml += `<button class="skill-nav-dot exp-nav-dot${index === 0 ? ' active' : ''}" data-exp-index="${index}" aria-label="${exp.title}"></button>`;
        });
        expNavDots.innerHTML = dotsHtml;

        // Dot click handlers
        expNavDots.querySelectorAll('.exp-nav-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-exp-index'));
                const section = experiencePanelScroll.children[index];
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    buildExperiencePanel();

    // Track scroll to update active dot
    experiencePanelScroll.addEventListener('scroll', () => {
        const scrollTop = experiencePanelScroll.scrollTop;
        const sectionHeight = experiencePanelScroll.clientHeight;
        const currentIndex = Math.round(scrollTop / sectionHeight);

        document.querySelectorAll('.exp-nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    });

    function openExperiencePanel(expId) {
        experiencePanelOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const expIndex = experiencePanelData.findIndex(e => e.id === expId);
            const targetSection = experiencePanelScroll.children[expIndex];
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            document.querySelectorAll('.exp-nav-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === expIndex);
            });
        }, 50);
    }

    function closeExperiencePanel() {
        experiencePanelOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Experience panel click handlers
    document.querySelectorAll('[data-experience-panel]').forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openExperiencePanel(this.getAttribute('data-experience-panel'));
        });
    });

    experiencePanelOverlay.addEventListener('click', (e) => {
        if (e.target === experiencePanelOverlay) closeExperiencePanel();
    });

    expPanelClose.addEventListener('click', closeExperiencePanel);

    // ====================================
    // Work Grid - Populate and Filter
    // ====================================
    const workGrid = document.getElementById('workGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Portfolio data organized by category
    const portfolioData = {
        photos: {
            label: "Photography",
            items: [
  {
    "src": "Digital Portfolio/11.jpg",
    "title": "Portfolio Study #11",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/12.jpg",
    "title": "Portfolio Study #12",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/21.jpg",
    "title": "Portfolio Study #21",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/26.jpg",
    "title": "Portfolio Study #26",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/27.jpg",
    "title": "Portfolio Study #27",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/28.jpg",
    "title": "Portfolio Study #28",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/34.jpg",
    "title": "Portfolio Study #34",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/38.jpg",
    "title": "Portfolio Study #38",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/39.jpg",
    "title": "Portfolio Study #39",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/41.jpg",
    "title": "Portfolio Study #41",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/42.jpg",
    "title": "Portfolio Study #42",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/44.jpg",
    "title": "Portfolio Study #44",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_3364.jpg",
    "title": "Capture #3364",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_3370.jpg",
    "title": "Capture #3370",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_3374.jpg",
    "title": "Capture #3374",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_3383.jpg",
    "title": "Capture #3383",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_4059.jpg",
    "title": "Capture #4059",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_4076.jpg",
    "title": "Capture #4076",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_4084.jpg",
    "title": "Capture #4084",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_4109.jpg",
    "title": "Capture #4109",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_4113.jpg",
    "title": "Capture #4113",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_5592.jpg",
    "title": "Capture #5592",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_7640.jpg",
    "title": "Capture #7640",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_7646.jpg",
    "title": "Capture #7646",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_7648.jpg",
    "title": "Capture #7648",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Cars/_MG_7649.jpg",
    "title": "Capture #7649",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/DJI_0011.JPG",
    "title": "Aerial View #0011",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/DJI_0017.JPG",
    "title": "Aerial View #0017",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/DJI_0090.jpg",
    "title": "Aerial View #0090",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/DJI_0123.jpg",
    "title": "Aerial View #0123",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/DJI_0129.jpg",
    "title": "Aerial View #0129",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/DJI_0132.jpg",
    "title": "Aerial View #0132",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/Ignite live (5).jpg",
    "title": "Ignite Live Production",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_0809.jpg",
    "title": "Capture #0809",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_2714.jpg",
    "title": "Capture #2714",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_2720.jpg",
    "title": "Capture #2720",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_2946.jpg",
    "title": "Capture #2946",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_2949.jpg",
    "title": "Capture #2949",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5572.jpg",
    "title": "Capture #5572",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5574.jpg",
    "title": "Capture #5574",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5575.jpg",
    "title": "Capture #5575",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5576.jpg",
    "title": "Capture #5576",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5588.jpg",
    "title": "Capture #5588",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5597.jpg",
    "title": "Capture #5597",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5598.jpg",
    "title": "Capture #5598",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5602.jpg",
    "title": "Capture #5602",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5627.jpg",
    "title": "Capture #5627",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5682.jpg",
    "title": "Capture #5682",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5902.jpg",
    "title": "Capture #5902",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_5909.jpg",
    "title": "Capture #5909",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_6032.jpg",
    "title": "Capture #6032",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_6093.jpg",
    "title": "Capture #6093",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_6114.jpg",
    "title": "Capture #6114",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_6115.jpg",
    "title": "Capture #6115",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_6154.jpg",
    "title": "Capture #6154",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_6224.jpg",
    "title": "Capture #6224",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_7277.jpg",
    "title": "Capture #7277",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_7286.jpg",
    "title": "Capture #7286",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_7291.jpg",
    "title": "Capture #7291",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_7303.jpg",
    "title": "Capture #7303",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9170.JPG",
    "title": "Capture #9170",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9175.JPG",
    "title": "Capture #9175",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9227.jpg",
    "title": "Capture #9227",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9360.jpg",
    "title": "Capture #9360",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9456-2.jpg",
    "title": "Capture #9456",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9461-2.jpg",
    "title": "Capture #9461",
    "desc": "Photography by Kenneth Salmon"
  },
  {
    "src": "Digital Portfolio/_MG_9463-2.jpg",
    "title": "Capture #9463",
    "desc": "Photography by Kenneth Salmon"
  }
]
        },
        video: {
            label: "Video Production",
            items: [
  {
    "src": "https://img.youtube.com/vi/TjOjDWSk-58/hqdefault.jpg",
    "title": "Flowers",
    "desc": "Short cinematography and nature visual showcase",
    "videoId": "TjOjDWSk-58"
  },
  {
    "src": "https://img.youtube.com/vi/o0qLjqdyM60/hqdefault.jpg",
    "title": "Esperanza TV Short Reel",
    "desc": "Live production recap from working with the Hope Channel",
    "videoId": "o0qLjqdyM60"
  },
  {
    "src": "https://img.youtube.com/vi/6sDtWdlEDQc/hqdefault.jpg",
    "title": "Driving Around",
    "desc": "Automotive cinematography and visual storytelling",
    "videoId": "6sDtWdlEDQc"
  },
  {
    "src": "https://img.youtube.com/vi/3Rfo-KBe--4/hqdefault.jpg",
    "title": "Sneaky",
    "desc": "Creative narrative video project",
    "videoId": "3Rfo-KBe--4"
  },
  {
    "src": "https://img.youtube.com/vi/mFqD2DpbwLY/hqdefault.jpg",
    "title": "BCU Night PKG",
    "desc": "Broadcast news package and field reporting",
    "videoId": "mFqD2DpbwLY"
  },
  {
    "src": "https://img.youtube.com/vi/IY37i3S7BSo/hqdefault.jpg",
    "title": "iPhone 13 Cinematic Review",
    "desc": "Tech review and cinematic mobile videography showcase",
    "videoId": "IY37i3S7BSo"
  },
  {
    "src": "https://img.youtube.com/vi/haO8MFw4jFQ/hqdefault.jpg",
    "title": "Google Pixel 7 Pro Commercial",
    "desc": "Spec product commercial showcasing the Pixel 7 Pro",
    "videoId": "haO8MFw4jFQ"
  },
  {
    "src": "https://img.youtube.com/vi/Vq6QLCAab2A/hqdefault.jpg",
    "title": "Lil Baby Crush Music Video",
    "desc": "Music video planned, shot, lit, edited, and choreographed",
    "videoId": "Vq6QLCAab2A"
  },
  {
    "src": "https://img.youtube.com/vi/fXOdGU7YEdE/hqdefault.jpg",
    "title": "Lighting Reel",
    "desc": "Cinematography and studio lighting design showcase",
    "videoId": "fXOdGU7YEdE"
  },
  {
    "src": "https://img.youtube.com/vi/aUR3fZsDd9o/hqdefault.jpg",
    "title": "SAU News Reel",
    "desc": "News broadcast production and technical direction",
    "videoId": "aUR3fZsDd9o"
  },
  {
    "src": "https://img.youtube.com/vi/xLwSrwIjalI/hqdefault.jpg",
    "title": "iPhone Product Video",
    "desc": "Commercial product cinematography and lighting",
    "videoId": "xLwSrwIjalI"
  },
  {
    "src": "https://img.youtube.com/vi/r9aPYvrEIWQ/hqdefault.jpg",
    "title": "Short Demo Reel",
    "desc": "Highlight reel of video production and editing work",
    "videoId": "r9aPYvrEIWQ"
  },
  {
    "src": "https://img.youtube.com/vi/MSlzYUNofIw/hqdefault.jpg",
    "title": "Great Day Music Video",
    "desc": "Music video production, directing, and editing",
    "videoId": "MSlzYUNofIw"
  },
  {
    "src": "https://img.youtube.com/vi/6c3i514BLYs/hqdefault.jpg",
    "title": "B&W Cinematic Video",
    "desc": "Black and white visual cinematography project",
    "videoId": "6c3i514BLYs"
  },
  {
    "src": "https://img.youtube.com/vi/sETe_E2-JGs/hqdefault.jpg",
    "title": "Editing Bay Man",
    "desc": "Post-production and creative editing project",
    "videoId": "sETe_E2-JGs"
  },
  {
    "src": "https://img.youtube.com/vi/3E2m5sEk0vU/hqdefault.jpg",
    "title": "Super Bloom Music Video",
    "desc": "Studio & event production - Super Bloom music video",
    "videoId": "3E2m5sEk0vU"
  },
  {
    "src": "https://img.youtube.com/vi/UocegRpfL4U/hqdefault.jpg",
    "title": "SNE Skit Production",
    "desc": "Studio & event production sketch and comedy short",
    "videoId": "UocegRpfL4U"
  },
  {
    "src": "https://img.youtube.com/vi/A5VPXQ_7Z7Q/hqdefault.jpg",
    "title": "Studio & Event Production",
    "desc": "Live event coverage and multicam studio production",
    "videoId": "A5VPXQ_7Z7Q"
  },
  {
    "src": "https://img.youtube.com/vi/OL0_1OkjWaI/hqdefault.jpg",
    "title": "Bible Heroes | The Battle with David",
    "desc": "Hope Kids animated/live production series",
    "videoId": "OL0_1OkjWaI"
  },
  {
    "src": "https://img.youtube.com/vi/cmJpPVDDvP0/hqdefault.jpg",
    "title": "Bible Heroes Battle | Trailer",
    "desc": "Hope Channel International promotional trailer",
    "videoId": "cmJpPVDDvP0"
  },
  {
    "src": "https://img.youtube.com/vi/Woy27XuIwkY/hqdefault.jpg",
    "title": "SAU News Broadcast",
    "desc": "School of Journalism and Communication news broadcast",
    "videoId": "Woy27XuIwkY"
  },
  {
    "src": "https://img.youtube.com/vi/Cva44DqBA8s/hqdefault.jpg",
    "title": "Ignite EP 22 - Purity Culture",
    "desc": "Talk show live multicam production and technical direction",
    "videoId": "Cva44DqBA8s"
  },
  {
    "src": "https://img.youtube.com/vi/x8BusgDhYaA/hqdefault.jpg",
    "title": "Ignite EP 40 - Pastor Dwight Nelson",
    "desc": "Studio broadcast interview production and technical directing",
    "videoId": "x8BusgDhYaA"
  },
  {
    "src": "https://img.youtube.com/vi/6yeMtI8UcgY/hqdefault.jpg",
    "title": "Best Products of the Year | Doctorly",
    "desc": "YouTube video editing for 3.4M+ subscriber channel",
    "videoId": "6yeMtI8UcgY"
  },
  {
    "src": "https://img.youtube.com/vi/KYctq8FliK4/hqdefault.jpg",
    "title": "8 Vaseline Hacks | Doctorly",
    "desc": "YouTube video editing with retention pacing and motion graphics",
    "videoId": "KYctq8FliK4"
  }
]
        }
    };

    let currentFilter = "all";

    function populateWorkGrid() {
        if (!workGrid) return;
        workGrid.innerHTML = "";

        // Collect all items with their category
        const allItems = [];
        Object.entries(portfolioData).forEach(([category, data]) => {
            data.items.forEach((item) => {
                allItems.push({
                    ...item,
                    category: category,
                    categoryLabel: data.label
                });
            });
        });

        // Create grid items
        allItems.forEach((item, index) => {
            const workItem = document.createElement("div");
            workItem.className = "work-item";
            workItem.setAttribute("data-category", item.category);

            const isVideo = !!item.videoId;
            workItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                ${isVideo ? `<div class="work-item-play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg></div>` : ""}
                <div class="work-item-overlay"></div>
                <div class="work-item-info">
                    <span class="work-item-category">${item.categoryLabel}</span>
                    <h3 class="work-item-title">${item.title}</h3>
                </div>
            `;

            // Click to open in viewer
            workItem.addEventListener("click", () => {
                openWorkViewer(item, allItems);
            });

            workGrid.appendChild(workItem);
        });
    }

    function filterWorkGrid(filter) {
        currentFilter = filter;
        const items = workGrid.querySelectorAll(".work-item");

        items.forEach(item => {
            const category = item.getAttribute("data-category");
            if (filter === "all" || category === filter) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });

        // Update active filter button
        filterBtns.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-filter") === filter);
        });
    }

    // Filter button event listeners
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterWorkGrid(btn.getAttribute("data-filter"));
            });
        });
    }

    // Media Viewer (Handles Images & YouTube Videos)
    const imageViewer = document.getElementById("imageViewer");
    const imageViewerContent = document.querySelector(".image-viewer-content");
    const imageViewerImg = document.getElementById("imageViewerImg");
    const imageViewerTitle = document.getElementById("imageViewerTitle");
    const imageViewerDesc = document.getElementById("imageViewerDesc");
    const imageViewerCurrent = document.getElementById("imageViewerCurrent");
    const imageViewerTotal = document.getElementById("imageViewerTotal");
    const imageViewerPrev = document.getElementById("imageViewerPrev");
    const imageViewerNext = document.getElementById("imageViewerNext");
    const imageViewerClose = document.querySelector(".image-viewer-close");

    let activeVideoIframe = null;

    function renderViewerMedia(item) {
        if (activeVideoIframe) {
            activeVideoIframe.remove();
            activeVideoIframe = null;
        }

        if (item.videoId) {
            imageViewerImg.style.display = "none";
            const videoWrapper = document.createElement("div");
            videoWrapper.className = "image-viewer-video";
            videoWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${item.videoId}?autoplay=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
            imageViewerContent.insertBefore(videoWrapper, imageViewerContent.querySelector(".image-viewer-info"));
            activeVideoIframe = videoWrapper;
        } else {
            imageViewerImg.style.display = "block";
            imageViewerImg.src = item.src;
            imageViewerImg.alt = item.title;
        }

        imageViewerTitle.textContent = item.title;
        imageViewerDesc.textContent = item.desc;
    }

    function openWorkViewer(item, allItems) {
        const filteredItems = currentFilter === "all"
            ? allItems
            : allItems.filter(i => i.category === currentFilter);

        let viewerIndex = filteredItems.findIndex(i => i.src === item.src);
        if (viewerIndex === -1) viewerIndex = 0;

        function updateViewer() {
            const currentItem = filteredItems[viewerIndex];
            renderViewerMedia(currentItem);
            imageViewerCurrent.textContent = viewerIndex + 1;
            imageViewerTotal.textContent = filteredItems.length;
        }

        updateViewer();
        imageViewer.classList.add("active");
        document.body.style.overflow = "hidden";

        window.currentViewerNav = {
            next: () => {
                viewerIndex = (viewerIndex + 1) % filteredItems.length;
                updateViewer();
            },
            prev: () => {
                viewerIndex = (viewerIndex - 1 + filteredItems.length) % filteredItems.length;
                updateViewer();
            }
        };
    }

    function closeImageViewer() {
        if (activeVideoIframe) {
            activeVideoIframe.remove();
            activeVideoIframe = null;
        }
        imageViewer.classList.remove("active");
        document.body.style.overflow = "";
        window.currentViewerNav = null;
    }

    if (imageViewerClose) imageViewerClose.addEventListener("click", closeImageViewer);
    const viewerBackdrop = document.querySelector(".image-viewer-backdrop");
    if (viewerBackdrop) viewerBackdrop.addEventListener("click", closeImageViewer);

    if (imageViewerPrev) {
        imageViewerPrev.addEventListener("click", () => {
            if (window.currentViewerNav) {
                window.currentViewerNav.prev();
            }
        });
    }

    if (imageViewerNext) {
        imageViewerNext.addEventListener("click", () => {
            if (window.currentViewerNav) {
                window.currentViewerNav.next();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (imageViewer.classList.contains("active")) {
            if (e.key === "Escape") closeImageViewer();
            if (e.key === "ArrowRight" && window.currentViewerNav) {
                window.currentViewerNav.next();
            }
            if (e.key === "ArrowLeft" && window.currentViewerNav) {
                window.currentViewerNav.prev();
            }
        }
    });

    // Initialize grid
    populateWorkGrid();

    // ====================================
    // Parallax Scrolling Effect
    // ====================================
    const showcaseSection = document.querySelector(".hero-showcase");
    const showcaseImage = document.querySelector(".hero-showcase-img");

    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        const sectionTop = showcaseSection?.offsetTop || 0;
        const sectionHeight = showcaseSection?.offsetHeight || 0;

        if (scrolled < sectionTop + sectionHeight) {
            const parallaxAmount = scrolled * 0.3;
            if (showcaseImage) {
                showcaseImage.style.transform = `translateY(${parallaxAmount}px) scale(1.02)`;
            }
        }
    }, { passive: true });

});
