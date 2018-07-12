import * as express from "express";
import { ProductDatabase } from "../src/ProductDatabase";
import { Product } from "../src/Product";
import { ReviewDatabase } from "../src/ReviewDatabase";
import { RevYouStatus } from "../src/RevYouStatus";
import { Review } from "../src/Review";
import { ReviewField } from "../src/ReviewField";
export const router = express.Router();

router.post("/:method", (req, res, next) => {
    const reviewDb = new ReviewDatabase("src/data/reviews.json");
    const category: ReviewField[] = [];
    if (req.body.category) {
        for (const cat of JSON.parse(req.body.category)) {
            category.push(new ReviewField(cat[0], Number(cat[1])));
        }
    }
    const review = new Review(
        req.body.gameId,
        req.body.userId,
        new Date(),
        new ReviewField(req.body.title, Number(req.body.overall), req.body.reviewText),
        category
    );
    reviewDb.addReview(review);
    res.send(new RevYouStatus(true, "Added review to DB"));
});
router.get("/:type/:id", (req, res, next) => {
    const data: any = {
        game: new ProductDatabase("src/data/games.json"),
        movie: new ProductDatabase("src/data/movies.json"),
        book: new ProductDatabase("src/data/books.json")
    };
    const dataSet = data[req.params.type.toLowerCase()].getData();
    const index = dataSet.findIndex((e: Product) => Number(e.id) === Number(req.params.id));
    let rating = Number(dataSet[index].score);
    let activeRating = 0;
    while (rating >= 10) {
        rating -= 10;
        activeRating++;
    }
    const inactiveRating = 10 - activeRating;
    res.render("review", {
        product: dataSet[index],
        ratings: {
            activeRating,
            inactiveRating
        }
    });
});
