export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  image: string;
  tags: string[];
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'A conversational AI model by OpenAI that can understand and generate human-like text.',
    category: 'Chatbots',
    url: 'https://chat.openai.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    tags: ['NLP', 'Assistant', 'Free/Paid']
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'An AI program that generates images from natural language descriptions.',
    category: 'Image Generation',
    url: 'https://midjourney.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
    tags: ['Art', 'Design', 'Discord']
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    description: 'Your AI pair programmer that helps you write code faster and with less work.',
    category: 'Coding',
    url: 'https://github.com/features/copilot',
    image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    tags: ['Developer', 'Productivity', 'Paid']
  },
  {
    id: '4',
    name: 'Jasper',
    description: 'AI content generator that helps you create high-quality content faster.',
    category: 'Writing',
    url: 'https://www.jasper.ai',
    image: 'https://assets-global.website-files.com/60e5f2de011b86acebc30db7/60e5f2de011b86d694c30e24_Jasper%20Logo%20(1).png',
    tags: ['Marketing', 'Copywriting', 'Paid']
  },
  {
    id: '5',
    name: 'Synthesia',
    description: 'Create professional AI videos from text in over 120 languages.',
    category: 'Video',
    url: 'https://www.synthesia.io',
    image: 'https://assets-global.website-files.com/61dc0796f359b6145bc06ea6/61dc0796f359b669dfc06eb3_Synthesia%20Logo.svg',
    tags: ['Avatar', 'Presentation', 'Paid']
  },
  {
    id: '6',
    name: 'Runway',
    description: 'Applied AI research company shaping the next era of art, entertainment and human creativity.',
    category: 'Video',
    url: 'https://runwayml.com',
    image: 'https://runwayml.com/images/logo.svg',
    tags: ['Editing', 'VFX', 'Creative']
  },
  {
    id: '7',
    name: 'Stable Diffusion',
    description: 'A latent text-to-image diffusion model capable of generating photo-realistic images.',
    category: 'Image Generation',
    url: 'https://stability.ai',
    image: 'https://stability.ai/images/logo.svg',
    tags: ['Open Source', 'Art', 'Free']
  },
  {
    id: '8',
    name: 'Notion AI',
    description: 'Access the limitless power of AI, right inside Notion.',
    category: 'Productivity',
    url: 'https://www.notion.so/product/ai',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    tags: ['Notes', 'Workspace', 'Paid']
  }
];

export const categories = ['All', ...Array.from(new Set(tools.map(tool => tool.category)))];
