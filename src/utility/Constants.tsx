// Project data based on portfolio website

export const projects = [
  {
    id: 1,
    title: "Slider.Fun",
    type: "Web Game",
    x: 0,
    y: 100,
    color: "#3B82F6",
    description:
      "Slider is a photo editing puzzle game. You use the sliders to edit the unedited photo, aiming to match the (edited) target photo. As you complete more puzzles, your photo editing skills will improve.",
    shortDescription: "Educational Photo-Editing Web Game",

    technologies: ["MongoDB", "Express", "React", "Node.Js", "Firebase"],
    link: "https://www.slider.fun",
  },
  {
    id: 2,
    title: "SideQuest",
    type: "Mobile App",
    x: 0,
    y: 150,
    color: "#10B981",
    description:
      "SideQuest is an life engagement app that would send you a real life task every day to promote self-improvment or social interactions.",
    shortDescription: "Life Engagement App",
    technologies: ["Express", "React-Native", "Node.Js", "MongoDB"],
    link: "https://github.com/dartmouth-cs52-22S/project-sidequest",
  },
  {
    id: 3,
    title: "Half Cup",
    type: "Web App",
    x: 0,
    y: 80,
    color: "#8B5CF6",
    description:
      "An online tournament bracket management app that allows users to create and share brackets.",
    shortDescription: "Online Tournament Bracket App",
    technologies: ["Express", "React", "Node.Js", "Firebase", "Redux"],
    link: "https://halfcuphalfcup.com",
  },
  {
    id: 4,
    title: "Online Chat App",
    type: "Web App",
    x: 0,
    y: 350,
    color: "#EF4444",
    description:
      "Personal project I built to learn more about react and how online message apps work.",
    shortDescription: "Online Chat App",
    technologies: ["Express", "React", "Node.Js", "Firebase"],
    link: "https://chat-app-g5e1.onrender.com/",
  },
  {
    id: 5,
    title: "Tiny Search Engine",
    type: "C Program",
    x: 0,
    y: 400,
    color: "#F97316",
    description:
      "Final Project for a Software Implementation class based in C. Program is based off of the crawler, indexer and querier implementation of early Google search and page rank.",
    shortDescription: "Early Google Search Implementation in C",
    technologies: ["C", "MakeFile", "Bash", "Shell"],
    link: "https://github.com/zhoucaiNi/Tiny-Search-Engine",
  },
  {
    id: 6,
    title: "Animal Shelter ML",
    type: "Machine Learning",
    x: 0,
    y: 300,
    color: "#EC4899",
    description:
      "A supervised machine learning software designed to help animal shelter maximize their resource allocation. A finalist project for the International Science and Engineering Fair in 2022.",
    shortDescription: "Animal Shelter Maximizing Machine Learning Program",
    technologies: ["Python", "NLTK", "PyTorch", "Pandas"],
    link: "https://github.com/zhoucaiNi/Machine-Learning-with-Shelter-Pet-Outcome",
  },
  {
    id: 7,
    title: "Poet-GPT",
    type: "Machine Learning",
    x: 0,
    y: 600,
    color: "#6366F1",
    description:
      "This LLM uses Pytorch's GPT2 and a dataset of poems from The Poetry Foundation to train a neural network that generates new poetry based on a prompt.",
    shortDescription: "Generative LLM for Poems",
    technologies: ["PyTorch", "Python", "NLTK", "Pandas", "Transformers"],
    link: "https://github.com/zhoucaiNi/poet-gpt-2",
  },
  {
    id: 8,
    title: "Autonomous Robot Delivery",
    type: "Robotics",
    x: 0,
    y: 650,
    color: "#14B8A6",
    description:
      "A self-delivery robotics system designed to traverse the town of Hanover, NH. It implements A* algorithm and Chinese Postman Algorithm to optimize path planning.",
    shortDescription: "Autonomous Robot Delivery System",
    technologies: ["ROS", "Rviz", "Python"],
    link: "mailto:nizhoucai@gmail.com",
  },
];

export const initialTextElements: TextElement[] = [
  {
    id: 9,
    text: "Sample Text",
    x: 400,
    y: 300,
    fontSize: 24,
    fontFamily: "Jockey One",
    fontStyle: "normal",
    fill: null,
  },
  {
    id: 10,
    text: "Zhoucai Ni",
    x: 400,
    y: 200,
    fontSize: 48,
    fontFamily: "Jockey One",
    fontStyle: "normal",
    fill: null,
  },
  {
    id: 11,
    text: "Software Engineer",
    x: 400,
    y: 250,
    fontSize: 24,
    fontFamily: "Jockey One",
    fontStyle: "normal",
    fill: null,
  },
];

export interface TextElement {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  fill: string | null;
}
