import { PrismaClient, QuestionCategory } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const questions = [
  {
    text: "What is the chemical symbol for gold?",
    category: QuestionCategory.SCIENCE,
    pointValue: 10,
    options: ["Au", "Ag", "Gd", "Go"],
    correctAnswer: "Au",
  },
  {
    text: "In which year did World War II end?",
    category: QuestionCategory.HISTORY,
    pointValue: 10,
    options: ["1942", "1945", "1948", "1950"],
    correctAnswer: "1945",
  },
  {
    text: "What is the capital of New Zealand?",
    category: QuestionCategory.GEOGRAPHY,
    pointValue: 10,
    options: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
    correctAnswer: "Wellington",
  },
  {
    text: "Who invented the World Wide Web?",
    category: QuestionCategory.TECHNOLOGY,
    pointValue: 10,
    options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Alan Turing"],
    correctAnswer: "Tim Berners-Lee",
  },
  {
    text: "Who painted The Starry Night?",
    category: QuestionCategory.ARTS,
    pointValue: 10,
    options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Rembrandt"],
    correctAnswer: "Vincent van Gogh",
  },
  {
    text: "What is the speed of light in vacuum, approximately?",
    category: QuestionCategory.SCIENCE,
    pointValue: 10,
    options: ["300,000 km/s", "150,000 km/s", "30,000 km/s", "3,000 km/s"],
    correctAnswer: "300,000 km/s",
  },
  {
    text: "Which empire built Machu Picchu?",
    category: QuestionCategory.HISTORY,
    pointValue: 10,
    options: ["Aztec", "Maya", "Inca", "Roman"],
    correctAnswer: "Inca",
  },
  {
    text: "Which country has the most natural lakes?",
    category: QuestionCategory.GEOGRAPHY,
    pointValue: 10,
    options: ["Canada", "Russia", "Finland", "Brazil"],
    correctAnswer: "Canada",
  },
  {
    text: "What does CPU stand for?",
    category: QuestionCategory.TECHNOLOGY,
    pointValue: 10,
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Core Processing Utility",
    ],
    correctAnswer: "Central Processing Unit",
  },
  {
    text: 'Which musical term means "gradually getting louder"?',
    category: QuestionCategory.ARTS,
    pointValue: 10,
    options: ["Crescendo", "Diminuendo", "Staccato", "Legato"],
    correctAnswer: "Crescendo",
  },
];

async function main() {
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  await prisma.quiz.create({
    data: {
      title: "General Knowledge",
      slug: "general-knowledge",
      description: "A balanced quiz across science, history, geography, technology, and arts.",
      questions: {
        create: questions.map((question, questionIndex) => ({
          text: question.text,
          category: question.category,
          pointValue: question.pointValue,
          order: questionIndex + 1,
          answerOptions: {
            create: question.options.map((option, optionIndex) => ({
              text: option,
              isCorrect: option === question.correctAnswer,
              order: optionIndex + 1,
            })),
          },
        })),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
