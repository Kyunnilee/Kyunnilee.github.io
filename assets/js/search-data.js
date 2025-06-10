// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Publications are updated",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Welcome to my project page! Some cool and fun projects I have worked on during my studies.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "Why I love sports so much",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/advanced-images/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-check-out-our-new-paper-generate-but-verify-reducing-visual-hallucination-in-vision-language-models-with-retrospective-resampling-link-to-x-reverse-vlm",
          title: '🔥 Check out our new paper Generate, but Verify: Reducing Visual Hallucination in...',
          description: "",
          section: "News",},{id: "news-i-finished-my-fall-2024-spring-2025-exchange-program-at-university-california-berkeley",
          title: 'I finished my Fall 2024, Spring 2025 exchange program at University California, Berkeley...',
          description: "",
          section: "News",},{id: "news-my-first-paper-is-out-puzzled-by-puzzles-when-vision-language-models-can-t-take-a-hint-follow-this-visual-puzzles",
          title: '🧩 My first paper is out! Puzzled by Puzzles: When Vision-Language Models Can’t...',
          description: "",
          section: "News",},{id: "projects-a-scavenger-hunt-game-for-llm-agents",
          title: 'A SCAVENGER HUNT GAME FOR LLM AGENTS',
          description: "A benchmark to evaluate spatial reasoning and navigational capabilities of LLM agents via a scavenger hunt game. (Final project for CS194/294, UC Berkeley)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-",
          title: '',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%6E%6E%65%6C%65%65%35%32%37%30@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Kyunnilee", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/heekyung-lee-624753289", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=gXYyJ9gAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/AnneLe222", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
