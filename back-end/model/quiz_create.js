const db = require("../database");

const quiz_create = {
    checkQuizName(id, callback) {
        return db.query(
            "SELECT name FROM quiz where category_id = ?;",
            [id],
            callback
        );
    },

    addQuiz(info, callback) {
        return db.query(
            "insert into quiz (category_id, user_id, name, difficulty, date) values(?,?,?,?, NOW())",
            [info.category_id, info.user_id, info.name, info.difficulty],
            callback
        );
    },

    getCreatedQuiz(callback) {
        return db.query(
            "select * from quiz ORDER BY id desc limit 1;",
            callback
        );
    }
};

module.exports = quiz_create;
