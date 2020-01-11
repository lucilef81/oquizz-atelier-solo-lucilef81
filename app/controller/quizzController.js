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
                    { association: "author" },
                    { association: "questions", include: ["answers", "levels"] },
                    { association: "tags" }
                ]
            });
            response.render(request.session.user ? 'play_quizz' : 'quizz', { quizz: quizz });
        } catch (error) {
            response.status(500).send(error);
        }

    },
   

    checkAnswers: (request, response) => {

        let goodAnswers = [];
        request.body['question-id'].forEach(qid => {
            Question.findByPk(qid)
            .then(question => {
                if (parseInt(request.body[`question-${qid}-answer`]) === question.answers_id) {
                    goodAnswers.push(qid)
                }
            })
            .catch(err => console.error(err))
        })

        response.render('result', {
            score: goodAnswers.length,
            questionsCount: request.body['question-id'].length
        })
     

    },

    
    
};

module.exports = quizzController;