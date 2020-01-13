const Quizz = require('../model/quizz');
const Question = require('../model/question');

const quizzController = {
  quizzPage: async (request, response) => {
    // On a notre id de quizz
    const quizzId = parseInt(request.params.id);
    // maintenant on veut récupérer les infos du quizz qui correspondent a cet id

    try {
      const quizz = await Quizz.findByPk(quizzId, {
        include: [
          { association: 'author' },
          { association: 'questions', include: ['answers', 'levels'] },
          { association: 'tags' },
        ],
      });
      response.render(request.session.user ? 'play_quizz' : 'quizz', {
        quizz: quizz,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  },

  resultPage: async (request, response) => {
    let userAnswers = [];
    let score = 0
    const questions = request.body['question-id']
    for(let i = 0; i < questions.length; i++) {
      const question = await Question.findByPk(questions[i])
      if (
        parseInt(request.body[`question-${questions[i]}-answer`]) ===
        question.answers_id
      ) {
        score += 1
      }
      userAnswers.push(parseInt(request.body[`question-${questions[i]}-answer`]))
    };

    const quizz = await Quizz.findByPk(parseInt(request.params.id), {
      include: [
        { association: 'author' },
        { association: 'questions', include: ['answers', 'levels'] },
        { association: 'tags' },
      ],
    })

    response.render('result', {
      quizz,
      userAnswers,
      score,
      getCSSClass: quizzController.getCorrectCSSClass
    });
  },

  getCorrectCSSClass: (userAnswer, goodAnswer, currentAnswer) => {
    if (currentAnswer === userAnswer) {
      if (currentAnswer === goodAnswer) {
        return 'correct' 
      } else {
        return 'error'
      }
    } else {
      if (currentAnswer === goodAnswer) {
        return 'correct'
      } else {
        return ''
      }
    }
  }
};

module.exports = quizzController;
