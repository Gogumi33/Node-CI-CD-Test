const asyncHandler = require("express-async-handler");
const Post = require("../../models/Post");
const Problem = require('../../models/Problem');
const Answer = require('../../models/Answer');
const { sequelize } = require('../../config/db');

/**
 * 모든 게시글 가져오기
 * GET /api
 */
const showAll = asyncHandler(async (req, res) => {
    try {
        const data = await Post.findAll();

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

/**
 * 게시글 상세 조회
 * GET /api/:post_key
 */
const showDetail = asyncHandler(async (req, res) => {
    const { post_key } = req.params;  // URL에서 post_key 추출

    try {
        // Post와 관련된 Problem 및 Answer를 포함하여 조회
        const post = await Post.findOne({
            where: { post_key },
            include: [
                {
                    model: Problem,
                    as: 'problems',
                    include: [
                        {
                            model: Answer,
                            as: 'answers'
                        }
                    ]
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error retrieving post details:", error);
        res.status(500).json({ message: "서버 에러." });
    }
});

/**
 * 게시글 내 게임시작
 * GET /api/:post_key/game
 */
const showGameDetail = asyncHandler(async (req, res) => {
    const { post_key } = req.params;

    try {
        // Post와 관련된 Problem 및 Answer를 포함하여 조회
        const post = await Post.findOne({
            where: { post_key },
            include: [
                {
                    model: Problem,
                    as: 'problems',
                    include: [
                        {
                            model: Answer,
                            as: 'answers'
                        }
                    ]
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error retrieving post details:", error);
        res.status(500).json({ message: "서버 에러." });
    }
});

/**
 * 게시글 작성 
 * POST /api/create
 */
const createPost = asyncHandler(async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // 쿠키에서 user_key 가져오기 (JWT 사용 시 verifyToken 미들웨어로 설정)
        const user_key = req.user.userID; // req.user에 저장된 user_key를 사용

        // 프론트에서 전달받은 데이터 구조
        const { title, date, problems } = req.body;

        // Post 테이블에 게시글 생성
        const newPost = await Post.create({
            user_key: user_key,
            title: title,
            date: date || new Date(),
        }, { transaction });

        // 각 문제와 답안 처리
        for (const problemData of problems) {
            // Problem 테이블에 문제 생성
            const newProblem = await Problem.create({
                post_key: newPost.post_key,
                problem_text: problemData.problem_text,
            }, { transaction });

            // 각 문제에 대한 답안 처리
            for (const answerData of problemData.answers) {
                await Answer.create({
                    problem_key: newProblem.problem_key,
                    answer_text: answerData.answer_text,
                    is_correct: answerData.is_correct,
                }, { transaction });
            }
        }
        await transaction.commit();

        res.status(201).json({ message: "게시글 및 문제/답안 저장 성공", post: newPost });
    } catch (error) {
        await transaction.rollback();
        console.error("Error creating post:", error);
        res.status(500).json({ message: "게시글 작성 중 오류." });
    }
});

/**
 * 게시글 삭제
 * DELETE /api/delete/:post_key
 */
const deletePost = asyncHandler(async (req, res) => {
    const { post_key } = req.params;
    const user_key = req.user.userID;

    try {
        const post = await Post.findOne({
            where: { post_key }
        });

        if (!post) {
            return res.status(404).json({ message: "삭제할 게시글을 찾을 수 없음." });
        }

        // 게시글 작성자와 현재 사용자가 다른 경우
        if (post.user_key !== user_key) {
            return res.status(403).json({ message: "삭제 권한이 없음." });
        }

        // 연결된 댓글 모두 삭제 (연결된 댓글이 있을 경우)
        await Post.destroy({
            where: { post_key } // 댓글의 외래키로 post_key를 참조
        });

        await post.destroy();
        res.status(200).json({ message: "삭제 완료." });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: "서버 에러." });
    }
});

module.exports = { showAll, showDetail, showGameDetail, createPost, deletePost };