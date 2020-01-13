const Tag = require('../model/tag');

const tagController = {

    tagListPage: async (request, response) => {
        /*Tag.findAll().then(tags => {
            response.render('tagList', {tags: tags});
        });*/
        try {
            const tags = await Tag.findAll();
            response.render('tagList', { tags: tags });
        } catch (error) {
            response.status(500).send(error);
        }
    },

    tagPage: async (request, response) => {
        // cas de récuperation par name
        //const tagName = request.params.id;
        const tagId = parseInt(request.params.id);
        
        try {
            const tag = await Tag.findByPk(tagId, { 
                include: [
                    {
                        association : "quizzes",
                        include: "author"
                    }
                ]
            });
            response.render('tag', { tag: tag });
        } catch (error) {
            response.status(500).send(error);
        }
    },

    newTag:  async (req, res) => {
        const tagId = parseInt(req.params.id);

        try {
            const tag = await Tag.findByPk(tagId, {
                include: [
                    {
                        association : "quizzes",
                        include: "author"
                    }
                ]
            });
            res.render('new_tag', {tag: tag});
        } catch (err) {
            res.status(500).send(err);
        }
    }

};

module.exports = tagController;